"use client";

import { useState } from "react";
import { Mail, Clock, Reply, User, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function MessagesClient({ initialMessages }: { initialMessages: any[] }) {
  const [messages, setMessages] = useState(initialMessages);

  if (messages.length === 0) {
    return (
      <div className="text-center py-24 bg-white/[0.02] border border-white/10 rounded-2xl">
        <MessageSquare size={48} className="mx-auto text-white/20 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Messages Yet</h3>
        <p className="text-white/50 text-sm">When someone reaches out via the contact form, it will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((msg) => {
        const replySubject = encodeURIComponent(`Re: ${msg.subject}`);
        const replyBody = encodeURIComponent(
          `\n\n\n\nOn ${new Date(msg.created_at).toLocaleString()}, ${msg.name} wrote:\n> ${msg.message.replace(/\n/g, "\n> ")}`
        );
        const mailtoHref = `mailto:${msg.email}?subject=${replySubject}&body=${replyBody}`;

        return (
          <div key={msg.id} className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 transition-colors hover:border-white/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="flex flex-wrap items-center gap-4 flex-1">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <User size={16} className="text-[rgb(0,167,157)]" />
                    <span className="font-bold">{msg.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Mail size={16} />
                    <a href={`mailto:${msg.email}`} className="hover:text-white transition-colors">
                      {msg.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
                    <Clock size={14} />
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="shrink-0">
                  <a
                    href={mailtoHref}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-[rgb(0,167,157,0.1)] hover:bg-[rgb(0,167,157,0.2)] text-[rgb(0,167,157)] border border-[rgb(0,167,157,0.2)] rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    <Reply size={14} /> Reply
                  </a>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="text-lg font-bold text-white mb-2">{msg.subject}</h4>
                <p className="text-white/70 whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.message}
                </p>
              </div>
          </div>
        );
      })}
    </div>
  );
}
