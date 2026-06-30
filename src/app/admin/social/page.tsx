import SocialManagerSection from "@/components/sections/SocialManagerSection";
import { fetchSocialPosts } from "@/lib/data-fetcher";
import { fetchSocialTokens, fetchSchedulerLogs } from "@/lib/social-fetcher";
import { createServerSupabaseClient } from "@/supabase/server";
import { redirect } from "next/navigation";


export const dynamic = "force-dynamic";

export default async function SocialAdminPage() {
  const supabase = createServerSupabaseClient();

  // Verify auth
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect("/admin/login");
  }

  // Fetch data
  const [posts, tokens, logs, settingsRes] = await Promise.all([
    fetchSocialPosts(supabase),
    fetchSocialTokens(supabase),
    fetchSchedulerLogs(supabase, 1),
    supabase.from("social_settings").select("is_paused").maybeSingle()
  ]);

  // Check if LinkedIn is connected
  const isLinkedInConnected = tokens.some((t: { platform: string }) => t.platform === "linkedin");
  const linkedInProfile = tokens.find((t: { platform: string; profile_name?: string }) => t.platform === "linkedin")?.profile_name;

  const lastRun = logs.length > 0 ? logs[0].ran_at : null;
  const isPaused = settingsRes.data?.is_paused || false;

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Social Media Manager</h1>
          <p className="text-white/50 text-sm mt-2">Manage and schedule posts across Twitter and LinkedIn.</p>
        </div>

        <SocialManagerSection
          initialPosts={posts}
          isLinkedInConnected={isLinkedInConnected}
          linkedInProfile={linkedInProfile}
          lastRunAt={lastRun}
          initialIsPaused={isPaused}
        />
      </div>
    </div>
  );
}
