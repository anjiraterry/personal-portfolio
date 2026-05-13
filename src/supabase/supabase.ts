import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;
 
function getSupabaseClient(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }
    _supabase = createBrowserClient(url, key);
  }
  return _supabase;
}
 
// Proxy that lazily creates the client on first property access
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseClient() as any)[prop];
  },
});
 
// Database types
export type ContactMessage = {
  id?: string;
  name: string;
  email: string;
  message: string;
  inquiry_type: "Hiring" | "Collaboration" | "AI Consulting" | "Startup" | "Other";
  created_at?: string;
};