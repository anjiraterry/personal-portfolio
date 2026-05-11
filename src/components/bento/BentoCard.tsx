"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
  gradient?: boolean;
  span?: "1" | "2" | "3" | "full";
  rowSpan?: "1" | "2";
  delay?: number;
  noPadding?: boolean;
}

export function BentoCard({
  children,
  className,
  glowOnHover = true,
  gradient = false,
  delay = 0,
  noPadding = false,
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={glowOnHover ? { y: -2 } : undefined}
      className={cn(
        "relative rounded-2xl overflow-hidden transition-all duration-400",
        "border border-white/[0.06]",
        gradient
          ? "bg-gradient-to-br from-[rgba(0,87,79,0.2)] to-[rgba(0,167,157,0.08)]"
          : "bg-[rgba(14,18,22,0.8)]",
        "backdrop-blur-xl",
        !noPadding && "p-6",
        glowOnHover && "hover:border-[rgba(0,167,157,0.15)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,167,157,0.08)]",
        className
      )}
    >
      {/* Subtle noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}