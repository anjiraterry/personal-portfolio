"use client";

import { useState } from "react";
import { upsertFocusArea, deleteFocusArea } from "@/app/actions/portfolio";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { useAuth } from "@/components/admin/AdminProvider";
import { Loader2, Trash2, Target, Lightbulb, Image as ImageIcon, Code2, X } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "../ImageUpload";

export const FocusForm = ({ area, onClose }: { area?: any, onClose: () => void }) => {
  const { refreshData } = usePortfolio();
  const { confirmDelete } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(area || {
    title: "",
    status: "Active",
    description: "",
    progress: 50,
    is_current: false,
    image: "",
    tags: [],
    insights: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await upsertFocusArea(formData);
      await refreshData();
      toast.success("Focus area saved successfully");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save focus area", {
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!area?.id) return;
    confirmDelete({
      title: "Delete Focus Area",
      label: area.title,
      onConfirm: async () => {
        try {
          await deleteFocusArea(area.id);
          await refreshData();
          toast.success("Focus area deleted successfully");
          onClose();
        } catch (err: any) {
          toast.error("Failed to delete focus area");
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 no-scrollbar">
      {/* Basic Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(0,167,157)] mb-2">
          <Target size={12} /> Area Definition
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all"
            placeholder="e.g. Reasoning Agents"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Status</label>
            <input
              type="text"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all"
              placeholder="e.g. Active Research"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Progress ({formData.progress}%)</label>
            <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${formData.progress}%`,
                  background: "linear-gradient(90deg, rgb(0,87,79), rgb(0,167,157))",
                  boxShadow: "0 0 10px rgba(0,167,157,0.4)"
                }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Visuals */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(0,167,157)] mb-2">
          <ImageIcon size={12} /> Focus Visual
        </div>
        <ImageUpload 
          value={formData.image} 
          onChange={(url) => setFormData({ ...formData, image: url })}
          label="Background Image (Optional)"
        />
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(0,167,157)] mb-2">
          <Lightbulb size={12} /> Insights & Details
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white min-h-[100px] focus:border-[rgb(0,167,157,0.4)] outline-none transition-all resize-none"
            placeholder="Explain what you are researching or building..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1 flex items-center gap-2">
            <Code2 size={12} /> Technologies
          </label>
          <input
            type="text"
            placeholder="Add tech (press enter)..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const val = e.currentTarget.value.trim();
                if (val && !formData.tech?.includes(val)) {
                  setFormData({ ...formData, tech: [...(formData.tech || []), val] });
                  e.currentTarget.value = '';
                }
              }
            }}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {(formData.tech || []).map((t: string) => (
              <span key={t} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[rgb(0,167,157,0.1)] border border-[rgb(0,167,157,0.2)] text-[rgb(0,180,170)] text-[10px] font-bold uppercase tracking-wider">
                {t}
                <button type="button" onClick={() => setFormData({ ...formData, tech: formData.tech.filter((i: any) => i !== t) })}>
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Key Insights (one per line)</label>
          <textarea
            value={formData.insights?.join("\n") || ""}
            onChange={(e) => setFormData({ ...formData, insights: e.target.value.split("\n").filter(Boolean) })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-white min-h-[100px] focus:border-[rgb(0,167,157,0.4)] outline-none transition-all resize-none font-mono"
            placeholder="Insight 1&#10;Insight 2..."
          />
        </div>
      </div>

      {/* Config */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="is_current"
          checked={formData.is_current}
          onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
          className="w-4 h-4 rounded border-white/10 bg-white/[0.03] accent-[rgb(0,167,157)] cursor-pointer"
        />
        <label htmlFor="is_current" className="text-xs font-bold text-white/50 cursor-pointer hover:text-white transition-colors">
          Display in "Current Focus" section
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-white/10">
        {area?.id ? (
          <button
            type="button"
            onClick={handleDelete}
            className="text-red-400/50 hover:text-red-400 transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            Delete Area
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
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
};
