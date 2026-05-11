"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ label, title, subtitle, align = "left", className }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("mb-12", align === "center" && "text-center", className)}
    >
      {label && (
        <span className="inline-block mb-3 text-xs font-semibold tracking-[0.15em] uppercase"
          style={{ color: "rgb(0,167,157)" }}>
          {label}
        </span>
      )}
      <h2 className="text-section-title font-display text-white/95">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-base text-white/45 max-w-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}