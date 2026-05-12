"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TechBadgeProps {
  name: string;
  category?: string;
  index?: number;
  variant?: "default" | "teal" | "outlined";
}

export function TechBadge({ name, category = "default", index = 0, variant = "default" }: TechBadgeProps) {
  // Make all badges neutral as requested
  const bg = "rgba(255,255,255,0.05)";

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ scale: 1.05, y: -1 }}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider cursor-default transition-all",
        "border border-white/[0.06] text-white/40 hover:text-white/80 hover:bg-white/[0.08] hover:border-white/[0.12]",
        variant === "teal" && "border-[rgba(0,167,157,0.15)] text-[rgb(0,180,170)]",
        variant === "outlined" && "bg-transparent border-white/10"
      )}
      style={{ background: variant === "default" ? bg : undefined }}
    >
      {name}
    </motion.span>
  );
}