"use client";

import { useState } from "react";
import { upsertTechItem, deleteTechItem } from "@/app/actions/portfolio";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { useAuth } from "@/components/admin/AdminProvider";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CustomSelect } from "../CustomSelect";
import { useFormDraft } from "./useFormDraft";

const DEFAULT_TECH = {
  name: "",
  category: "frontend"
};

export const TechStackForm = ({ item, onClose }: { item?: any, onClose: () => void }) => {
  const { refreshData } = usePortfolio();
  const { confirmDelete } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData, clearDraft] = useFormDraft(
    "draft_tech_item",
    item || DEFAULT_TECH,
    !item?.id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await upsertTechItem(formData);
      if (res && !res.success) {
        throw new Error(res.error || "Failed to save tech item");
      }
      clearDraft();
      await refreshData();
      toast.success("Tech item saved successfully");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save tech item", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!item?.id) return;
    confirmDelete({
      title: "Delete Tech Item",
      label: item.name,
      onConfirm: async () => {
        try {
          const res = await deleteTechItem(item.id);
          if (res && !res.success) {
            throw new Error(res.error || "Failed to delete tech item");
          }
          await refreshData();
          toast.success("Tech item deleted successfully");
          onClose();
        } catch (err: any) {
          toast.error("Failed to delete tech item", { description: err.message });
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all"
          placeholder="e.g. Next.js"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Category</label>
        <CustomSelect
          value={formData.category}
          onChange={(val) => setFormData({ ...formData, category: val })}
          options={[
            { value: "frontend", label: "Frontend" },
            { value: "backend", label: "Backend" },
            { value: "language", label: "Language" },
            { value: "database", label: "Database" },
            { value: "ai", label: "AI" },
            { value: "other", label: "Other" }
          ]}
        />
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-white/10">
        {item?.id ? (
          <button type="button" onClick={handleDelete} className="group flex items-center gap-2 text-red-400/50 hover:text-red-400 transition-all text-[10px] font-bold uppercase tracking-widest">
            <Trash2 size={14} /> Delete
          </button>
        ) : <div />}
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-white/30 hover:text-white uppercase tracking-widest transition-all">Cancel</button>
          <button type="submit" disabled={loading} className="bg-gradient-to-r from-[rgb(0,87,79)] to-[rgb(0,167,157)] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,167,157,0.3)] transition-all disabled:opacity-50 flex items-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};
