"use client";

import React from "react";
import { useAuth } from "@/components/admin/AdminProvider";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type EditableSectionProps = {
  children: React.ReactNode;
  onEdit?: () => void;
  onAdd?: () => void;
  onDelete?: () => void;
  className?: string;
  label?: string;
  isList?: boolean;
  autoHeight?: boolean;
};

export const EditableSection = ({
  children,
  onEdit,
  onAdd,
  onDelete,
  className,
  label,
  isList = false,
  autoHeight = false,
}: EditableSectionProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <>{children}</>;

  return (
    <div className={cn("relative group/editable w-full", className, !autoHeight && "h-full")}>
      {children}
      
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover/editable:opacity-100 transition-opacity z-[60]">
        {onEdit && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
            className="p-2 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-[rgb(0,167,157)] transition-all"
            title={`Edit ${label || "section"}`}
          >
            <Edit2 size={14} />
          </button>
        )}
        {onAdd && isList && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAdd(); }}
            className="p-2 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-[rgb(0,167,157)] transition-all"
            title={`Add ${label || "item"}`}
          >
            <Plus size={14} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
            className="p-2 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-red-500/50 transition-all"
            title={`Delete ${label || "item"}`}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Visual highlight in edit mode */}
      <div className="absolute inset-0 border-2 border-dashed border-[rgb(0,167,157,0.3)] rounded-xl pointer-events-none opacity-0 group-hover/editable:opacity-100 transition-opacity" />
    </div>
  );
};
