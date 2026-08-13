"use client";

import { useAuth } from "@/components/admin/AdminProvider";
import { Edit3 } from "lucide-react";

export const EditFocusButton = ({ area }: { area: any }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={() => {
        if (typeof window !== "undefined" && (window as any).openAdmin) {
          (window as any).openAdmin('focus', area);
        }
      }}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest"
    >
      <Edit3 size={14} /> Edit Paper
    </button>
  );
};
