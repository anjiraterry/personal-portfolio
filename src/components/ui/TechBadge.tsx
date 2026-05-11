"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TechBadgeProps {
  name: string;
  category?: string;
  index?: number;
  variant?: "default" | "teal" | "outlined";
}

const categoryColors: Record<string, string> = {
  ai: "rgba(0,167,157,0.15)",
  frontend: "rgba(100,100,255,0.12)",
  backend: "rgba(255,150,50,0.12)",
  database: "rgba(50,200,100,0.12)",
  infra: "rgba(200,100,255,0.12)",
  language: "rgba(255,200,50,0.12)",
};

export function TechBadge({ name, category = "default", index = 0, variant = "default" }: TechBadgeProps) {
  const bg = categoryColors[category] ?? "rgba(255,255,255,0.06)";

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ scale: 1.05, y: -1 }}
      className={cn(
        "inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold cursor-default transition-all",
        "border border-white/[0.07] text-white/70 hover:text-white/90",
        variant === "teal" && "border-[rgba(0,167,157,0.2)] text-[rgb(0,200,188)]",
        variant === "outlined" && "bg-transparent border-white/10"
      )}
      style={{ background: variant === "default" ? bg : undefined }}
    >
      {name}
    </motion.span>
  );
}