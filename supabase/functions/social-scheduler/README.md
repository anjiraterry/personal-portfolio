# Social Post Scheduler Edge Function

This Edge Function acts as the background worker for the Social Media Manager module.
It runs via `pg_cron` inside Supabase on a regular schedule (e.g., hourly).

## Tasks Handled
1. **LinkedIn Posting**: Checks for due LinkedIn posts (`scheduled_date + scheduled_time <= now()`), refreshes the LinkedIn token, posts to the user's personal profile using the LinkedIn UGC Posts API, and marks the post as `sent` (or `failed`).
2. **Twitter Queue Refill**: Checks the Twitter Buffer queue. If below 5 queued posts, it pulls upcoming scheduled Twitter posts and pushes them to Buffer to keep the queue at 10.
3. **Logging**: Writes execution results and any errors to the `scheduler_log` table.

## Deployment Instructions

Execute the following commands from the root of the project to deploy the function and set up the necessary secrets:

```bash
supabase functions deploy social-scheduler
supabase secrets set LINKEDIN_CLIENT_ID=your_client_id
supabase secrets set LINKEDIN_CLIENT_SECRET=your_client_secret
supabase secrets set BUFFER_ACCESS_TOKEN=your_buffer_token
supabase secrets set BUFFER_TWITTER_PROFILE_ID=your_buffer_twitter_profile_id
```

Make sure that `social_posts`, `social_tokens`, and `scheduler_log` tables exist in your database and that `pg_cron` is configured properly (refer to `src/lib/social-cron-setup.sql`).
