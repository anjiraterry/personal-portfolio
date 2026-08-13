"use client";

import { Share2, Twitter, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  const handleTwitterShare = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this note: ${title}`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={handleCopyLink}
        className="p-2.5 rounded-xl bg-white/[0.04] text-white/40 hover:text-[rgb(0,167,157)] hover:bg-[rgb(0,167,157,0.1)] transition-all"
        title="Copy Link"
      >
        {copied ? <Check size={18} className="text-[rgb(0,167,157)]" /> : <Share2 size={18} />}
      </button>
      <button 
        onClick={handleTwitterShare}
        className="p-2.5 rounded-xl bg-white/[0.04] text-white/40 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-all"
        title="Share on Twitter"
      >
        <Twitter size={18} />
      </button>
    </div>
  );
}
