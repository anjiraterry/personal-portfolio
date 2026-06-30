import { supabase } from "@/supabase/supabase"; // Note: Use server client if called from server components

export async function fetchSocialTokens(serverSupabase?: any) {
  const client = serverSupabase || supabase;
  const { data, error } = await client
    .from("social_tokens")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching social tokens:", error);
    return [];
  }
  return data || [];
}

export async function fetchSchedulerLogs(serverSupabase?: any, limit = 5) {
  const client = serverSupabase || supabase;
  const { data, error } = await client
    .from("scheduler_log")
    .select("*")
    .order("ran_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching scheduler logs:", error);
    return [];
  }
  return data || [];
}
