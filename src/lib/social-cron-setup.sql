-- 1. Create social_posts table
create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('twitter', 'linkedin')),
  content text not null,
  scheduled_date date not null,
  scheduled_time time not null default '09:00:00',
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'sent', 'failed')),
  buffer_post_id text,
  sent_at timestamptz,
  metrics jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Create social_tokens table
create table if not exists public.social_tokens (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  profile_id text,
  profile_name text,
  created_at timestamptz default now()
);

-- 3. Create scheduler_log table
create table if not exists public.scheduler_log (
  id uuid primary key default gen_random_uuid(),
  ran_at timestamptz default now(),
  linkedin_posts_sent int default 0,
  twitter_posts_queued int default 0,
  errors jsonb default '[]'
);

-- Enable RLS
alter table public.social_posts enable row level security;
alter table public.social_tokens enable row level security;
alter table public.scheduler_log enable row level security;

-- Setup RLS policies (adjust to your auth schema, assuming simple authenticated access for admin)
create policy "Enable all access for authenticated users" on public.social_posts for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on public.social_tokens for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on public.scheduler_log for all using (auth.role() = 'authenticated');

-- 4. Create social_settings table for pausing/resuming automation
create table if not exists public.social_settings (
  id uuid primary key default gen_random_uuid(),
  is_paused boolean default false,
  updated_at timestamptz default now()
);

-- Insert initial setting if not exists
insert into public.social_settings (is_paused)
select false where not exists (select 1 from public.social_settings);

-- Enable RLS and setup policies
alter table public.social_settings enable row level security;
create policy "Enable all access for authenticated users" on public.social_settings for all using (auth.role() = 'authenticated');

-- Setup Edge Function execution using pg_cron
create extension if not exists pg_cron;

-- Update to run once a day (e.g. at midnight)
select cron.schedule(
  'social-post-scheduler',
  '0 0 * * *',
  $$
  select net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/social-scheduler',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);
