import { createClient } from "@supabase/supabase-js";
import { TWITTER_POSTS } from "c:/Users/tagbo/Documents/Terrod/portfolio/src/data/social/twitter";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lmetunhvbezkwkmcunqx.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_4RUmLphDkVxOhW5wy3uD2A_eeyCzUTk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Checking for existing Twitter posts...");
  const { data: existing, error } = await supabase.from("social_posts").select("id").limit(1);
  
  if (error) {
    console.error("Error checking db:", error);
  }

  if (!existing || existing.length === 0) {
    console.log("Seeding Twitter posts...");
    const twitterPosts = TWITTER_POSTS.map((p: any) => ({ ...p, platform: "twitter" }));
    const { error: insertErr } = await supabase.from("social_posts").insert(twitterPosts);
    if (insertErr) {
      console.error("Error inserting:", insertErr);
    } else {
      console.log("Seeded " + twitterPosts.length + " posts.");
    }
  } else {
    console.log("Database already seeded with posts.");
  }

  // Now run buffer push manually since edge function might not be triggered easily
  const bufferToken = "0kOE6TnqCnZoguwh2uFopVJRWwNUo5_N2DWUT9y2lWC";
  const bufferProfileId = "6a2ac2c138b557934584a7d1";

  const bufferRes = await fetch(`https://api.bufferapp.com/1/profiles/${bufferProfileId}/pending_updates.json?access_token=${bufferToken}`);
  const bufferData = await bufferRes.json();
  const currentQueueCount = bufferData.total || 0;
  console.log("Current Buffer Queue count:", currentQueueCount);

  if (currentQueueCount < 5) {
    const needed = 10 - currentQueueCount;
    console.log(`Pushing ${needed} posts to Buffer...`);
    const { data: upcomingTwitterPosts, error: twErr } = await supabase
      .from("social_posts")
      .select("*")
      .eq("platform", "twitter")
      .eq("status", "scheduled")
      .is("buffer_post_id", null)
      .order("scheduled_date", { ascending: true })
      .order("scheduled_time", { ascending: true })
      .limit(needed);

    if (twErr) {
      console.error("Error fetching upcoming posts:", twErr);
      return;
    }

    if (!upcomingTwitterPosts || upcomingTwitterPosts.length === 0) {
      console.log("No upcoming posts to schedule.");
      return;
    }

    for (const post of upcomingTwitterPosts) {
      const scheduleAt = new Date(`${post.scheduled_date}T${post.scheduled_time}Z`);
      const pushParams = new URLSearchParams();
      pushParams.append("text", post.content);
      pushParams.append("profile_ids[]", bufferProfileId);
      pushParams.append("scheduled_at", scheduleAt.toISOString());

      const pushRes = await fetch(`https://api.bufferapp.com/1/updates/create.json?access_token=${bufferToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: pushParams.toString(),
      });

      const pushData = await pushRes.json();
      if (pushData.success && pushData.updates?.length > 0) {
        console.log(`Pushed post id ${post.id} to buffer: ${pushData.updates[0].id}`);
        await supabase.from("social_posts").update({
          buffer_post_id: pushData.updates[0].id,
          status: "scheduled",
        }).eq("id", post.id);
      } else {
        console.error("Buffer push failed:", pushData);
      }
    }
  } else {
    console.log("Buffer queue is already full enough.");
  }
}

run();
