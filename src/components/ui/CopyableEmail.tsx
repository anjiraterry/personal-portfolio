"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyableEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors text-sm">
      <span>{email}</span>
      {copied ? <Check size={12} className="text-[rgb(0,200,188)]" /> : <Copy size={12} />}
    </button>
  );
}