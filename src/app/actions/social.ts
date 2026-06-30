"use server";

import { createServerSupabaseClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { getTwitterMetrics } from "@/lib/twitter-metrics";
import { TWITTER_POSTS } from "@/data/social/twitter";

export async function createPost(platform: string, content: string, scheduledDate: string, scheduledTime: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("social_posts").insert({
    platform,
    content,
    scheduled_date: scheduledDate,
    scheduled_time: scheduledTime,
    status: "draft" // or scheduled based on some logic, defaulting to draft initially or let user choose
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/social");
}

export async function updatePost(id: string, content: string, scheduledDate: string, scheduledTime: string, status?: string) {
  const supabase = createServerSupabaseClient();
  const updateData: any = { content, scheduled_date: scheduledDate, scheduled_time: scheduledTime };
  if (status) updateData.status = status;
  
  const { error } = await supabase.from("social_posts").update(updateData).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/social");
}

export async function deletePost(id: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("social_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/social");
}

export async function syncTwitterMetricsAction(postId: string, bufferPostId: string) {
  // If we had the actual tweet ID we would use getTwitterMetrics(tweetId)
  // For Buffer, bufferPostId is not the tweet ID. 
  // Normally you'd get the tweet ID from Buffer API, but for simplicity here we just mock or handle if known
  // Assuming bufferPostId here might be tweet ID for demo, or we just fetch metrics.
  // We'll call getTwitterMetrics if we assume bufferPostId is tweet ID, or just return mock if not available.
  
  try {
    const metrics = await getTwitterMetrics(bufferPostId); // Note: bufferPostId != tweetId in reality, but following instructions
    const supabase = createServerSupabaseClient();
    await supabase.from("social_posts").update({ metrics }).eq("id", postId);
    revalidatePath("/admin/social");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to sync metrics:", err);
    return { success: false, error: err.message };
  }
}

export async function bulkGeneratePosts(platform: string, count: number) {
  // Placeholder for AI generation if needed. For now just creates drafts.
  const supabase = createServerSupabaseClient();
  const today = new Date();
  
  const posts = Array.from({ length: count }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1); // schedule starting tomorrow
    return {
      platform,
      content: `[Auto-generated Draft ${i + 1}] Write something brilliant here...`,
      scheduled_date: d.toISOString().split("T")[0],
      scheduled_time: "09:00:00",
      status: "draft"
    };
  });

  const { error } = await supabase.from("social_posts").insert(posts);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/social");
}

export async function triggerScheduler() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Missing Supabase env vars for edge function trigger");

  const res = await fetch(`${supabaseUrl}/functions/v1/social-scheduler`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${serviceRoleKey}`
    },
    body: JSON.stringify({})
  });

  if (!res.ok) {
    throw new Error(`Edge function failed: ${await res.text()}`);
  }
  
  revalidatePath("/admin/social");
  return res.json();
}

export async function toggleSchedulerPause(isPaused: boolean) {
  const supabase = createServerSupabaseClient();
  
  // Try to update existing settings
  const { data, error: updateError } = await supabase
    .from("social_settings")
    .update({ is_paused: isPaused, updated_at: new Date().toISOString() })
    .neq("id", "00000000-0000-0000-0000-000000000000") // update all
    .select();

  // If table is empty, insert one
  if (!updateError && data?.length === 0) {
    await supabase.from("social_settings").insert({ is_paused: isPaused });
  }

  if (updateError) throw new Error(updateError.message);
  revalidatePath("/admin/social");
}

export async function seedTwitterPosts() {
  const supabase = createServerSupabaseClient();
  const { data: existing } = await supabase.from("social_posts").select("id").limit(1);
  
  if (!existing || existing.length === 0) {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1); // Start tomorrow
    let currentDayPosts = 0;

    const twitterPosts = TWITTER_POSTS.map((p: any) => {
      if (currentDayPosts >= 3) {
        currentDate.setDate(currentDate.getDate() + 1);
        currentDayPosts = 0;
      }
      const formattedDate = currentDate.toISOString().split('T')[0];
      currentDayPosts++;

      return { 
        platform: "twitter",
        content: p.content,
        scheduled_date: formattedDate,
        scheduled_time: p.scheduled_time || "09:00:00",
        status: p.status || "scheduled"
      };
    });
    
    const { error } = await supabase.from("social_posts").insert(twitterPosts);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/social");
}

export async function seedLinkedInPosts() {
  const supabase = createServerSupabaseClient();
  const { data: existing } = await supabase.from("social_posts").select("id").eq('platform', 'linkedin').limit(1);
  
  if (!existing || existing.length === 0) {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1); // Start tomorrow
    let currentDayPosts = 0;

    // Dynamically import to avoid circular dependencies if any, or we can just import at top.
    const { LINKEDIN_POSTS } = await import('@/data/social/linkedin');

    const linkedInPosts = LINKEDIN_POSTS.filter((p: any) => p && p.content && p.content.trim() !== "").map((p: any) => {
      // 1 post a day for linkedin
      if (currentDayPosts >= 1) {
        currentDate.setDate(currentDate.getDate() + 1);
        currentDayPosts = 0;
      }
      const formattedDate = currentDate.toISOString().split('T')[0];
      currentDayPosts++;

      return { 
        platform: "linkedin",
        content: p.content,
        scheduled_date: formattedDate,
        scheduled_time: p.scheduled_time || "09:00:00",
        status: p.status || "scheduled"
      };
    });
    
    const { error } = await supabase.from("social_posts").insert(linkedInPosts);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/social");
}
