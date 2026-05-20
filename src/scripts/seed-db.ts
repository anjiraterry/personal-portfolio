import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import * as staticData from "../data/portfolio";

// Simple custom .env file parser to avoid requiring external dotenv dependency
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

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

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const email = process.argv[2];
  const password = process.argv[3];

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Error: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env");
    process.exit(1);
  }

  if (!email || !password) {
    console.error("\nUsage: npx tsx src/scripts/seed-db.ts <admin-email> <admin-password>\n");
    process.exit(1);
  }

  console.log(`Connecting to Supabase at ${supabaseUrl}...`);
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log(`Logging in as ${email}...`);
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    console.error("Login failed:", authError.message);
    process.exit(1);
  }

  console.log("Logged in successfully. Starting database sync...");

  try {
    // 1. Sync Personal Info
    console.log("Syncing Personal Info...");
    const { error: personalErr } = await supabase
      .from("personal")
      .upsert({ 
        id: "1", 
        ...PERSONAL, 
        philosophy: (staticData as any).PHILOSOPHY || [] 
      }, { onConflict: "id" });
    if (personalErr) throw personalErr;

    // 2. Sync Metrics
    console.log("Syncing Metrics...");
    await supabase.from("metrics").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: metricsErr } = await supabase.from("metrics").insert(METRICS);
    if (metricsErr) throw metricsErr;

    // 3. Sync Tech Stack
    console.log("Syncing Tech Stack...");
    await supabase.from("tech_stack").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: techErr } = await supabase.from("tech_stack").insert(TECH_STACK);
    if (techErr) throw techErr;

    // 4. Sync Expertise
    console.log("Syncing Expertise...");
    await supabase.from("expertise").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: expertiseErr } = await supabase.from("expertise").insert(
      EXPERTISE.map((name) => ({ name }))
    );
    if (expertiseErr) throw expertiseErr;

    // 5. Sync Experience
    console.log("Syncing Experience...");
    await supabase.from("experience").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const sanitizedExp = EXPERIENCE.map(({ highlights, ...rest }: any) => rest);
    const { error: expErr } = await supabase.from("experience").insert(sanitizedExp);
    if (expErr) throw expErr;

    // 6. Sync Education
    console.log("Syncing Education...");
    await supabase.from("education").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: eduErr } = await supabase.from("education").insert(EDUCATION);
    if (eduErr) throw eduErr;

    // 7. Sync Projects
    console.log("Syncing Projects...");
    await supabase.from("projects").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: projErr } = await supabase.from("projects").insert(PROJECTS);
    if (projErr) throw projErr;

    // 8. Sync Focus Areas
    console.log("Syncing Focus Areas...");
    await supabase.from("focus_areas").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: focusErr } = await supabase.from("focus_areas").insert(
      FOCUS_AREAS.map((f, i) => ({ ...f, is_current: i === 0 }))
    );
    if (focusErr) throw focusErr;

    // 9. Sync Notes
    console.log("Syncing Notes...");
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

    console.log("\nSuccess: Database synced and seeded successfully!");
  } catch (err: any) {
    console.error("\nError: Sync failed:", err.message || err);
    process.exit(1);
  }
}

seed();
