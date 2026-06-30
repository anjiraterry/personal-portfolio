// @ts-nocheck
// Deno Edge Function — runs in Supabase's Deno runtime, not Node.js.
// TypeScript errors from the Node TS server are expected and suppressed here.
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";


const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  const logEntry = {
    ran_at: new Date().toISOString(),
    linkedin_posts_sent: 0,
    twitter_posts_queued: 0,
    errors: [] as any[]
  };

  try {
    // Check if automation is paused
    const { data: settings, error: settingsErr } = await supabase
      .from('social_settings')
      .select('is_paused')
      .limit(1)
      .maybeSingle();

    if (settingsErr) throw settingsErr;

    if (settings?.is_paused) {
      return new Response(JSON.stringify({ success: true, message: "Scheduler is paused." }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // ==========================================
    // JOB: Refill Buffer queue for Platforms
    // ==========================================
    const bufferToken = Deno.env.get('BUFFER_ACCESS_TOKEN');
    const bufferOrgId = Deno.env.get('BUFFER_ORG_ID') || "6a2abec8829607e5611af400";
    
    const platforms = [
      { name: 'twitter', profileId: Deno.env.get('BUFFER_TWITTER_PROFILE_ID') },
      { name: 'linkedin', profileId: Deno.env.get('BUFFER_LINKEDIN_PROFILE_ID') }
    ];

    if (bufferToken) {
      for (const platform of platforms) {
        if (!platform.profileId) continue;
        
        try {
          // Check Buffer queue count using GraphQL
          const queueQuery = `
            query GetPendingPosts {
              posts(
                first: 50, 
                input: { 
                  organizationId: "${bufferOrgId}", 
                  filter: { 
                    status: [scheduled],
                    channelIds: ["${platform.profileId}"]
                  } 
                }
              ) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
          `;

          const bufferRes = await fetch('https://api.buffer.com/graphql', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${bufferToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: queueQuery })
          });
          
          const bufferData = await bufferRes.json();
          const currentQueueCount = bufferData.data?.posts?.edges?.length || 0;
          
          if (currentQueueCount < 5) {
            const needed = 10 - currentQueueCount;
            
            // Get next scheduled posts
            const { data: upcomingPosts, error: dbErr } = await supabase
              .from('social_posts')
              .select('*')
              .eq('platform', platform.name)
              .eq('status', 'scheduled')
              .is('buffer_post_id', null)
              .order('scheduled_date', { ascending: true })
              .order('scheduled_time', { ascending: true })
              .limit(needed);
              
            if (dbErr) throw dbErr;

            for (const post of (upcomingPosts || [])) {
               try {
                  const scheduleAt = new Date(`${post.scheduled_date}T${post.scheduled_time}Z`);
                  
                  const pushQuery = `
                    mutation CreatePost($text: String!, $channelId: ChannelId!, $dueAt: DateTime!) {
                      createPost(
                        input: {
                          text: $text
                          channelId: $channelId
                          schedulingType: automatic
                          mode: customScheduled
                          dueAt: $dueAt
                        }
                      ) {
                        ... on PostActionSuccess {
                          post {
                            id
                          }
                        }
                        ... on MutationError {
                          message
                        }
                      }
                    }
                  `;

                  const pushRes = await fetch('https://api.buffer.com/graphql', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${bufferToken}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      query: pushQuery,
                      variables: {
                        text: post.content,
                        channelId: platform.profileId,
                        dueAt: scheduleAt.toISOString()
                      }
                    })
                  });
                  
                  const pushData = await pushRes.json();
                  const successData = pushData.data?.createPost?.post;
                  const errorData = pushData.data?.createPost?.message;
                  
                  if (successData && successData.id) {
                     await supabase.from('social_posts').update({
                        buffer_post_id: successData.id,
                        status: 'scheduled'
                     }).eq('id', post.id);
                     
                     if (platform.name === 'twitter') logEntry.twitter_posts_queued++;
                     if (platform.name === 'linkedin') logEntry.linkedin_posts_queued = (logEntry.linkedin_posts_queued || 0) + 1;
                  } else {
                     logEntry.errors.push({ type: `buffer_push_${platform.name}`, error: errorData || pushData });
                  }
               } catch(e: any) {
                  logEntry.errors.push({ type: `buffer_push_exception_${platform.name}`, error: e.message });
               }
            }
          }
        } catch (e: any) {
           logEntry.errors.push({ type: `buffer_queue_exception_${platform.name}`, error: e.message });
        }

        // ==========================================
        // JOB 2.5: Sync published Buffer posts back to Supabase
        // ==========================================
        try {
          const syncQuery = `
            query GetSentPosts {
              posts(
                first: 50, 
                input: { 
                  organizationId: "${bufferOrgId}", 
                  filter: { 
                    status: [sent],
                    channelIds: ["${platform.profileId}"]
                  } 
                }
              ) {
                edges {
                  node {
                    id
                    status
                    dueAt
                  }
                }
              }
            }
          `;

          const syncRes = await fetch('https://api.buffer.com/graphql', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${bufferToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: syncQuery })
          });
          
          const syncData = await syncRes.json();
          const sentPosts = syncData.data?.posts?.edges || [];
          
          for (const edge of sentPosts) {
            if (edge.node?.id && edge.node?.status === 'sent') {
              await supabase.from('social_posts')
                .update({ 
                  status: 'sent', 
                  sent_at: edge.node.dueAt ? new Date(edge.node.dueAt).toISOString() : new Date().toISOString() 
                })
                .eq('buffer_post_id', edge.node.id)
                .eq('status', 'scheduled');
            }
          }
        } catch (e: any) {
          logEntry.errors.push({ type: `buffer_sync_exception_${platform.name}`, error: e.message });
        }
      }
    } else {
      logEntry.errors.push({ type: 'buffer_config', error: 'Missing Buffer token' });
    }

  } catch (err: any) {
    logEntry.errors.push({ type: 'fatal', error: err.message });
  } finally {
    // Write scheduler log
    await supabase.from('scheduler_log').insert([logEntry]);
  }

  return new Response(JSON.stringify({ success: true, log: logEntry }), {
    headers: { "Content-Type": "application/json" },
  });
});
