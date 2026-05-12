"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStatus("success");
    setTimeout(() => setStatus("idle"), 5000);
  };

  if (status === "success") {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full flex flex-col items-center justify-center text-center p-12 glass-card"
      >
        <div className="w-20 h-20 rounded-full bg-[rgb(0,167,157,0.1)] flex items-center justify-center mb-6 border border-[rgb(0,167,157,0.2)]">
          <CheckCircle2 size={40} className="text-[rgb(0,167,157)]" />
        </div>
        <h3 className="text-2xl font-display font-bold text-white mb-2">Message Received</h3>
        <p className="text-white/50 max-w-sm">
          Thanks for reaching out! I'll get back to you within 24-48 hours.
        </p>
        <button 
          onClick={() => setStatus("idle")}
          className="mt-8 text-[rgb(0,167,157)] font-bold text-xs uppercase tracking-widest hover:text-[rgb(0,220,210)] transition-colors"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            placeholder="John Doe"
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder:text-white/10 focus:outline-none focus:border-[rgb(0,167,157,0.5)] focus:bg-white/[0.05] transition-all"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="john@example.com"
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder:text-white/10 focus:outline-none focus:border-[rgb(0,167,157,0.5)] focus:bg-white/[0.05] transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          required
          placeholder="AI Product Inquiry"
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder:text-white/10 focus:outline-none focus:border-[rgb(0,167,157,0.5)] focus:bg-white/[0.05] transition-all"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-xs font-bold text-white/30 uppercase tracking-widest ml-1">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          placeholder="Tell me about your project..."
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white placeholder:text-white/10 focus:outline-none focus:border-[rgb(0,167,157,0.5)] focus:bg-white/[0.05] transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className={cn(
          "w-full py-4 rounded-xl font-bold text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3",
          "bg-gradient-to-r from-[rgb(0,87,79)] to-[rgb(0,167,157)] text-white shadow-lg shadow-[rgb(0,167,157,0.2)]",
          "hover:shadow-[rgb(0,167,157,0.4)] hover:-translate-y-0.5 active:translate-y-0",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        )}
      >
        {status === "sending" ? (
          "Transmitting..."
        ) : (
          <>
            Send Intelligence <Send size={16} />
          </>
        )}
      </button>

      <p className="text-center text-[10px] text-white/20 uppercase tracking-wider">
        By sending, you agree to the intergalactic protocol of polite communication.
      </p>
    </form>
  );
}
