/**
 * redistribute-tweets.mjs
 *
 * Finds all Twitter posts that are still "scheduled" but have a past scheduled_date
 * (i.e., overdue — whether or not they've been pushed to Buffer already),
 * then redistributes them randomly across future dates — one tweet per day,
 * at a randomised time between 08:00–20:00 UTC, starting from tomorrow.
 *
 * Any existing buffer_post_id is cleared so the scheduler will re-queue them
 * with the new dates.
 *
 * Usage:
 *   node scripts/redistribute-tweets.mjs
 *   node scripts/redistribute-tweets.mjs --dry-run   (preview only, no writes)
 *   node scripts/redistribute-tweets.mjs --max-per-day 2
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env') });

// ─── Config ───────────────────────────────────────────────────────────────────

const DRY_RUN = process.argv.includes('--dry-run');
const MAX_PER_DAY = (() => {
  const idx = process.argv.indexOf('--max-per-day');
  return idx !== -1 ? parseInt(process.argv[idx + 1], 10) : 1;
})();

const EARLIEST_HOUR_UTC = 8;   // 08:00 UTC
const LATEST_HOUR_UTC   = 20;  // 20:00 UTC (exclusive)

// ─── Supabase ─────────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY   // service role bypasses RLS
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomTime() {
  const hour   = Math.floor(Math.random() * (LATEST_HOUR_UTC - EARLIEST_HOUR_UTC)) + EARLIEST_HOUR_UTC;
  const minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
}

/** Returns an array of ISO date strings, starting from tomorrow, with enough
 *  slots to fit `count` posts at `maxPerDay` per day. */
function generateFutureDates(count, maxPerDay) {
  const dates = [];
  const base = new Date();
  base.setUTCHours(0, 0, 0, 0);
  let dayOffset = 1;          // start from tomorrow

  while (dates.length < count) {
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() + dayOffset);
    const dateStr = d.toISOString().split('T')[0];
    for (let slot = 0; slot < maxPerDay && dates.length < count; slot++) {
      dates.push(dateStr);
    }
    dayOffset++;
  }
  return dates;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Twitter Post Redistributor');
  console.log(`   Mode        : ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE'}`);
  console.log(`   Max per day : ${MAX_PER_DAY}`);
  console.log('');

  // 1. Fetch all overdue scheduled twitter posts (past date, not yet sent)
  const todayStr = new Date().toISOString().split('T')[0];

  const { data: posts, error } = await supabase
    .from('social_posts')
    .select('id, content, scheduled_date, scheduled_time, buffer_post_id')
    .eq('platform', 'twitter')
    .eq('status', 'scheduled')
    .lt('scheduled_date', todayStr)   // strictly in the past
    .order('scheduled_date', { ascending: true });

  if (error) {
    console.error('Failed to fetch posts:', error.message);
    process.exit(1);
  }

  if (!posts || posts.length === 0) {
    console.log('No overdue tweets found — nothing to redistribute.');
    return;
  }

  console.log(`Found ${posts.length} overdue tweet(s):\n`);
  posts.forEach(p => {
    const buffered = p.buffer_post_id ? `[in Buffer: ${p.buffer_post_id.slice(0, 8)}...]` : '[not in Buffer]';
    console.log(`   ${p.scheduled_date} ${p.scheduled_time}  ${buffered}`);
  });
  console.log('');

  // 2. Shuffle and assign new dates
  const shuffled    = shuffle(posts);
  const futureDates = generateFutureDates(shuffled.length, MAX_PER_DAY);

  // Randomise times per day-slot so two posts on the same day aren't at the
  // exact same time. Track used times per date to avoid collisions.
  const usedTimesPerDate = {};
  const assignments = shuffled.map((post, i) => {
    const date = futureDates[i];
    if (!usedTimesPerDate[date]) usedTimesPerDate[date] = new Set();
    
    let time;
    let attempts = 0;
    do {
      time = randomTime();
      attempts++;
    } while (usedTimesPerDate[date].has(time) && attempts < 50);

    usedTimesPerDate[date].add(time);

    return { post, newDate: date, newTime: time };
  });

  // 3. Preview
  const lastDate = futureDates[futureDates.length - 1];
  const totalDays = Math.ceil(posts.length / MAX_PER_DAY);
  console.log(`Proposed schedule (spread to ${lastDate} — ${totalDays} days):\n`);
  assignments.forEach(({ post, newDate, newTime }, i) => {
    const snippet = post.content.slice(0, 60).replace(/\n/g, ' ');
    console.log(`   [${String(i + 1).padStart(2, '0')}] ${newDate} ${newTime}  "${snippet}${post.content.length > 60 ? '...' : ''}"`);
  });
  console.log('');

  if (DRY_RUN) {
    console.log('Dry run complete — no changes written.');
    return;
  }

  // 4. Apply updates
  console.log('Writing updates to Supabase...\n');
  let success = 0;
  let failed  = 0;

  for (const { post, newDate, newTime } of assignments) {
    const { error: updateErr } = await supabase
      .from('social_posts')
      .update({
        scheduled_date : newDate,
        scheduled_time : newTime,
        buffer_post_id : null,        // clear so scheduler re-queues it
        updated_at     : new Date().toISOString(),
      })
      .eq('id', post.id);

    if (updateErr) {
      console.error(`   FAIL [${post.id}]: ${updateErr.message}`);
      failed++;
    } else {
      console.log(`   OK  ${newDate} ${newTime}`);
      success++;
    }
  }

  console.log('');
  console.log(`Done -- ${success} redistributed, ${failed} failed.`);
  console.log('Run the scheduler now to push the first batch to Buffer.');
}

main();
