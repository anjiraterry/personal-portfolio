"use server";

import { createServerSupabaseClient } from "@/supabase/server";
import * as staticData from "@/data/portfolio";
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
    const { error: expErr } = await supabase.from("experience").insert(EXPERIENCE);
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

    return { success: true };
  } catch (err: any) {
    console.error("Migration failed:", err);
    return { success: false, error: err.message };
  }
}
