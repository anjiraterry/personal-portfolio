"use server";

import { createServerSupabaseClient } from "@/supabase/server";
import * as staticData from "@/data/portfolio";
import { TWITTER_POSTS } from "@/data/social/twitter";
import { LINKEDIN_POSTS } from "@/data/social/linkedin";
const {
  PERSONAL,
  METRICS,
  TECH_STACK,
  EXPERTISE,
  EXPERIENCE,
  EDUCATION,
  PROJECTS,
  FOCUS_AREAS,
  NOTES,
} = staticData;

export async function syncPortfolioToSupabase() {
  const supabase = createServerSupabaseClient();
  
  console.log("Starting portfolio sync...");

  try {
    // 1. Sync Personal Info
    const { error: personalErr } = await supabase
      .from("personal")
      .upsert({ 
        id: "1", 
        ...PERSONAL, 
        philosophy: (staticData as any).PHILOSOPHY || [] 
      }, { onConflict: "id" });
    if (personalErr) throw personalErr;

    // 2. Sync Metrics
    await supabase.from("metrics").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: metricsErr } = await supabase.from("metrics").insert(METRICS);
    if (metricsErr) throw metricsErr;

    // 3. Sync Tech Stack
    await supabase.from("tech_stack").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: techErr } = await supabase.from("tech_stack").insert(TECH_STACK);
    if (techErr) throw techErr;

    // 4. Sync Expertise
    await supabase.from("expertise").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: expertiseErr } = await supabase.from("expertise").insert(
      EXPERTISE.map((name) => ({ name }))
    );
    if (expertiseErr) throw expertiseErr;

    // 5. Sync Experience
    await supabase.from("experience").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const sanitizedExp = EXPERIENCE.map(({ highlights, ...rest }: any) => rest);
    const { error: expErr } = await supabase.from("experience").insert(sanitizedExp);
    if (expErr) throw expErr;

    // 6. Sync Education
    await supabase.from("education").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: eduErr } = await supabase.from("education").insert(EDUCATION);
    if (eduErr) throw eduErr;

    // 7. Sync Projects
    await supabase.from("projects").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: projErr } = await supabase.from("projects").insert(PROJECTS);
    if (projErr) throw projErr;

    // 8. Sync Focus Areas
    await supabase.from("focus_areas").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: focusErr } = await supabase.from("focus_areas").insert(
      FOCUS_AREAS.map((f, i) => ({ ...f, is_current: i === 0 }))
    );
    if (focusErr) throw focusErr;

    // 9. Sync Notes
    await supabase.from("notes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: notesErr } = await supabase.from("notes").insert(
      NOTES.map(n => {
        const note = n as any;
        const { readTime, read_time, ...rest } = note;
        return {
          ...rest,
          read_time: read_time || readTime || "5 min"
        };
      })
    );
    if (notesErr) throw notesErr;

    // 10. Sync Social Posts (Seed if empty)
    await syncSocialPosts(supabase);

    return { success: true };
  } catch (err: any) {
    console.error("Migration failed:", err);
    return { success: false, error: err.message };
  }
}

async function syncSocialPosts(supabase: any) {
  const { data: existing, error: checkErr } = await supabase.from("social_posts").select("id").limit(1);
  if (checkErr) throw checkErr;

  // Only seed if table is empty
  if (!existing || existing.length === 0) {
    const twitterPosts = TWITTER_POSTS.map(p => ({ ...p, platform: "twitter" as const }));
    const linkedInPosts = LINKEDIN_POSTS.map(p => ({ ...p, platform: "linkedin" as const }));
    const seedPosts = [...twitterPosts, ...linkedInPosts];

    if (seedPosts.length === 0) {
      console.log("No social posts defined in src/data/social/ — skipping seed.");
      return;
    }

    const { error: seedErr } = await supabase.from("social_posts").insert(seedPosts);
    if (seedErr) throw seedErr;
    console.log(`Seeded ${seedPosts.length} social posts (${twitterPosts.length} Twitter, ${linkedInPosts.length} LinkedIn).`);
  }
}
