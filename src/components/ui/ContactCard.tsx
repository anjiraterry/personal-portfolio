"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactCardProps {
  label: string;
  value: string;
  href?: string;
  icon: React.ReactNode;
  copyable?: boolean;
  index?: number;
}

export function ContactCard({ label, value, href, icon, copyable = false, index = 0 }: ContactCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative p-4 rounded-xl border border-white/[0.07] transition-all duration-300",
        "bg-[rgba(14,18,22,0.8)] backdrop-blur-xl",
        "hover:border-[rgba(0,167,157,0.2)] hover:bg-[rgba(0,87,79,0.06)]"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-white/[0.04] text-white/50 group-hover:text-[rgb(0,167,157)] transition-colors mt-0.5">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-0.5">{label}</p>
          <p className="text-sm text-white/75 font-medium truncate">{value}</p>
        </div>
        <div className="flex gap-1.5">
          {copyable && (
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-white/[0.04] text-white/30 hover:text-white/70 transition-all"
            >
              {copied ? <Check size={13} className="text-[rgb(0,200,188)]" /> : <Copy size={13} />}
            </button>
          )}
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/[0.04] text-white/30 hover:text-white/70 transition-all"
            >
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}