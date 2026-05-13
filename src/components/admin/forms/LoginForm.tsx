"use client";

import { useState } from "react";
import { supabase } from "@/supabase/supabase";
import { toast } from "sonner";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Successfully logged in", {
        description: "You now have administrative access.",
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error("Login failed", {
        description: err.message || "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2 text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-white/95">Admin Access</h2>
        <p className="text-white/45 text-sm">Enter your credentials to manage the portfolio.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-12 py-3.5 text-sm text-white placeholder:text-white/10 outline-none focus:border-[rgb(0,167,157,0.3)] focus:bg-white/[0.05] transition-all"
              placeholder="admin@example.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-12 py-3.5 text-sm text-white placeholder:text-white/10 outline-none focus:border-[rgb(0,167,157,0.3)] focus:bg-white/[0.05] transition-all"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-[rgb(0,87,79)] to-[rgb(0,167,157)] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(0,167,157,0.2)] hover:shadow-[0_0_30px_rgba(0,167,157,0.4)] hover:-translate-y-px transition-all disabled:opacity-50 disabled:translate-y-0"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
