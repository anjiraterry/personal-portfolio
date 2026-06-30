import * as dotenv from "dotenv";
import { TWITTER_POSTS } from "../src/data/social/twitter";

dotenv.config();

const bufferToken = process.env.BUFFER_ACCESS_TOKEN;
// The organization ID the user provided in the GraphQL snippet
const organizationId = "6a2abec8829607e5611af400";

if (!bufferToken) {
  console.error("Missing BUFFER_ACCESS_TOKEN in .env");
  process.exit(1);
}

async function run() {
  // 1. Select upcoming posts from our twitter.ts file based on date and time
  const now = new Date();
  const upcomingPosts = TWITTER_POSTS.filter(post => {
    if (post.status !== "scheduled") return false;
    const scheduleAt = new Date(`${post.scheduled_date}T${post.scheduled_time}Z`);
    return scheduleAt > now;
  }).sort((a, b) => {
    const timeA = new Date(`${a.scheduled_date}T${a.scheduled_time}Z`).getTime();
    const timeB = new Date(`${b.scheduled_date}T${b.scheduled_time}Z`).getTime();
    return timeA - timeB;
  }).slice(0, 10); // push 10 to start

  if (upcomingPosts.length === 0) {
    console.log("No upcoming scheduled posts found in twitter.ts.");
    return;
  }

  console.log(`Pushing ${upcomingPosts.length} posts to Buffer as Ideas via GraphQL...`);

  // 2. Push to Buffer as Ideas
  for (const post of upcomingPosts) {
    const query = `
      mutation CreateIdea($orgId: ID!, $title: String!, $text: String!) {
        createIdea(input: {
          organizationId: $orgId,
          content: {
            title: $title,
            text: $text
          }
        }) {
          ... on Idea {
            id
            content {
              title
              text
            }
          }
        }
      }
    `;

    const variables = {
      orgId: organizationId,
      title: `Tweet - ${post.pillar}`,
      text: post.content
    };

    const pushRes = await fetch('https://api.buffer.com/graphql', {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${bufferToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, variables }),
    });

    const pushData = await pushRes.json();
    if (pushData.errors) {
      console.error("❌ Buffer push failed for a post:", JSON.stringify(pushData.errors, null, 2));
    } else if (pushData.data && pushData.data.createIdea) {
      console.log(`✅ Successfully pushed Idea: ${post.scheduled_date} ${post.scheduled_time} (ID: ${pushData.data.createIdea.id})`);
    } else {
      console.error("❌ Unknown error:", pushData);
    }
  }
}

run();
