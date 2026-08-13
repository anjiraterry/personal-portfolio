import { getMessages } from "@/app/actions/portfolio";
import { createServerSupabaseClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { MessagesClient } from "./MessagesClient";
import { PageTransition } from "@/components/ui/PageTransition";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages | Admin",
  description: "View and reply to messages from the contact form.",
};

export const dynamic = "force-dynamic";

export default async function MessagesAdminPage() {
  const supabase = createServerSupabaseClient();

  // Verify auth
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect("/admin/login");
  }

  // Fetch data
  const result = await getMessages();
  const messages = result.success ? result.data : [];

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-12 px-4 sm:px-8">
      <PageTransition className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Messages</h1>
          <p className="text-white/50 text-sm mt-2">Incoming messages from the contact form.</p>
        </div>

        <MessagesClient initialMessages={messages || []} />
      </PageTransition>
    </div>
  );
}
