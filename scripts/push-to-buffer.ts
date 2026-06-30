import * as dotenv from "dotenv";
import { TWITTER_POSTS } from "../src/data/social/twitter";

dotenv.config();

const bufferToken = process.env.BUFFER_ACCESS_TOKEN;
const bufferProfileId = process.env.BUFFER_TWITTER_PROFILE_ID;

if (!bufferToken || !bufferProfileId) {
  console.error("Missing BUFFER_ACCESS_TOKEN or BUFFER_TWITTER_PROFILE_ID in .env");
  process.exit(1);
}

async function run() {
  // 1. Get current pending updates from Buffer
  const bufferRes = await fetch(`https://api.bufferapp.com/1/profiles/${bufferProfileId}/pending_updates.json?access_token=${bufferToken}`);
  const bufferData = await bufferRes.json();
  const currentQueueCount = bufferData.total || 0;
  console.log("Current Buffer Queue count:", currentQueueCount);

  // We want to keep 10 posts in the queue
  if (currentQueueCount < 10) {
    const needed = 10 - currentQueueCount;
    console.log(`Pushing ${needed} posts to Buffer...`);
    
    // 2. Select upcoming posts from our twitter.ts file based on date and time
    // Filter out posts that are in the past
    const now = new Date();
    const upcomingPosts = TWITTER_POSTS.filter(post => {
      if (post.status !== "scheduled") return false;
      const scheduleAt = new Date(`${post.scheduled_date}T${post.scheduled_time}Z`);
      return scheduleAt > now;
    }).sort((a, b) => {
      const timeA = new Date(`${a.scheduled_date}T${a.scheduled_time}Z`).getTime();
      const timeB = new Date(`${b.scheduled_date}T${b.scheduled_time}Z`).getTime();
      return timeA - timeB;
    }).slice(0, needed);

    if (upcomingPosts.length === 0) {
      console.log("No upcoming scheduled posts found in twitter.ts.");
      return;
    }

    // 3. Push to Buffer
    for (const post of upcomingPosts) {
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
        console.log(`✅ Successfully pushed to buffer: ${post.scheduled_date} ${post.scheduled_time}`);
      } else {
        console.error("❌ Buffer push failed for a post:", pushData);
      }
    }
  } else {
    console.log("Buffer queue is full enough.");
  }
}

run();
