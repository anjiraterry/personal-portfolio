"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/supabase";
import { syncPortfolioToSupabase } from "@/lib/sync";
import { motion } from "framer-motion";
import { LogIn, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { BentoCard } from "@/components/bento/BentoCard";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!confirm("This will overwrite your Supabase data with the static data from portfolio.ts. Continue?")) return;
    setSyncing(true);
    try {
      const res = await syncPortfolioToSupabase();
      if (res.success) alert("Sync completed!");
      else alert("Sync failed: " + res.error);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <BentoCard className="p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[rgb(0,167,157,0.1)] border border-[rgb(0,167,157,0.2)] flex items-center justify-center mb-4">
              <Lock className="text-[rgb(0,167,157)]" size={32} />
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-white/40 text-center text-sm">
              Enter your credentials to manage your portfolio content.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-white/20 group-focus-within:text-[rgb(0,167,157)] transition-colors" size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[rgb(0,167,157,0.5)] focus:ring-1 focus:ring-[rgb(0,167,157,0.5)] transition-all"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-white/20 group-focus-within:text-[rgb(0,167,157)] transition-colors" size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[rgb(0,167,157,0.5)] focus:ring-1 focus:ring-[rgb(0,167,157,0.5)] transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
              >
                <p className="text-red-400 text-xs text-center">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-white text-black font-bold py-4 rounded-xl transition-all hover:bg-[rgb(0,167,157)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="w-full py-3 rounded-xl border border-dashed border-white/10 text-white/30 text-xs font-bold uppercase tracking-widest hover:border-[rgb(0,167,157,0.5)] hover:text-[rgb(0,167,157)] transition-all flex items-center justify-center gap-2"
            >
              {syncing ? <Loader2 className="animate-spin" size={14} /> : "Seed Database from Static Data"}
            </button>
          </div>
        </BentoCard>
      </motion.div>
    </div>
  );
}
