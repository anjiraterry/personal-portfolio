"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function GlowButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className,
  disabled,
  type = "button",
}: GlowButtonProps) {
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-sm",
  };

  const base = cn(
    "relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 overflow-hidden",
    sizes[size],
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  if (variant === "primary") {
    return (
      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.02 } : undefined}
        whileTap={!disabled ? { scale: 0.98 } : undefined}
        className={base}
        style={{ background: "linear-gradient(135deg, rgb(0,87,79), rgb(0,167,157))" }}
      >
        <motion.span
          className="absolute inset-0 rounded-xl opacity-0"
          style={{ background: "rgba(255,255,255,0.1)" }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
        <span className="relative z-10 text-white">{children}</span>
        {/* Glow effect */}
        <motion.span
          className="absolute inset-0 rounded-xl opacity-0 blur-md"
          style={{ background: "linear-gradient(135deg, rgb(0,87,79), rgb(0,167,157))" }}
          whileHover={{ opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    );
  }

  if (variant === "ghost") {
    return (
      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.02 } : undefined}
        whileTap={!disabled ? { scale: 0.98 } : undefined}
        className={cn(base, "bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12]")}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      className={cn(base, "bg-transparent border border-[rgba(0,167,157,0.3)] text-[rgb(0,200,188)] hover:bg-[rgba(0,167,157,0.08)] hover:border-[rgba(0,167,157,0.5)]")}
    >
      {children}
    </motion.button>
  );
}