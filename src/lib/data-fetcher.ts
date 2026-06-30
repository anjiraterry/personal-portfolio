import { supabase } from "@/supabase/supabase";

export async function getPortfolioData() {
  const [
    { data: personal },
    { data: metrics },
    { data: techStack },
    { data: expertise },
    { data: experience },
    { data: education },
    { data: projects },
    { data: focusAreas },
    { data: notes },
  ] = await Promise.all([
    supabase.from("personal").select("*").single(),
    supabase.from("metrics").select("*").order("created_at", { ascending: true }),
    supabase.from("tech_stack").select("*").order("created_at", { ascending: true }),
    supabase.from("expertise").select("*").order("created_at", { ascending: true }),
    supabase.from("experience").select("*").order("created_at", { ascending: false }),
    supabase.from("education").select("*").order("created_at", { ascending: false }),
    supabase.from("projects").select("*").order("year", { ascending: false }),
    supabase.from("focus_areas").select("*").order("created_at", { ascending: false }),
    supabase.from("notes").select("*").order("created_at", { ascending: false }),
  ]);

  return {
    personal: personal || null,
    metrics: metrics || [],
    techStack: techStack || [],
    expertise: expertise || [],
    experience: experience || [],
    education: education || [],
    projects: projects || [],
    focusAreas: focusAreas || [],
    notes: notes || [],
    philosophy: (personal as any)?.philosophy || [],
  };
}

export async function fetchSocialPosts(serverSupabase?: any) {
  const client = serverSupabase || supabase;
  const { data, error } = await client
    .from("social_posts")
    .select("*")
    .order("scheduled_date", { ascending: true })
    .order("scheduled_time", { ascending: true });

  if (error) {
    console.error("Error fetching social posts:", error);
    return [];
  }
  return data || [];
}
