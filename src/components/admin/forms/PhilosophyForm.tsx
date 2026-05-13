"use client";

import { useState } from "react";
import { upsertPhilosophy, deletePhilosophy } from "@/app/actions/portfolio";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { useAuth } from "@/components/admin/AdminProvider";
import { Loader2, Trash2, Heart, Type, AlignLeft, Info } from "lucide-react";
import { toast } from "sonner";

export const PhilosophyForm = ({ item, onClose }: { item?: any, onClose: () => void }) => {
  const { refreshData } = usePortfolio();
  const { confirmDelete } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(item || {
    title: "",
    description: "",
    icon: "Brain"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await upsertPhilosophy(formData);
      await refreshData();
      toast.success("Philosophy saved");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save philosophy");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!item?.id) return;
    confirmDelete({
      title: "Delete Value",
      label: item.title,
      onConfirm: async () => {
        try {
          await deletePhilosophy(item.id);
          await refreshData();
          toast.success("Value deleted");
          onClose();
        } catch (err) {
          toast.error("Failed to delete");
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(0,167,157)] mb-2">
          <Heart size={12} /> Core Value
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all"
            placeholder="e.g. AI-First Thinking"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white min-h-[100px] focus:border-[rgb(0,167,157,0.4)] outline-none transition-all resize-none"
            placeholder="Explain this philosophy..."
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1 flex items-center gap-2">
            <Info size={12} /> Icon (Lucide Name)
          </label>
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all"
            placeholder="e.g. Brain, Code2, Layers"
          />
          <p className="text-[9px] text-white/20 mt-1 italic ml-1">Use any name from Lucide React library.</p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-white/10">
        {item?.id ? (
          <button
            type="button"
            onClick={handleDelete}
            className="text-red-400/50 hover:text-red-400 transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            Delete Value
          </button>
        ) : <div />}
        
        <div className="flex gap-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white/30 hover:text-white transition-all uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-[rgb(0,167,157)] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[rgb(0,190,180)] transition-all shadow-[0_0_15px_rgba(0,167,157,0.2)] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Save Philosophy"}
          </button>
        </div>
      </div>
    </form>
  );
};
