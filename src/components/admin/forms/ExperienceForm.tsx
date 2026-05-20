"use client";

import { useState } from "react";
import { upsertExperience, deleteExperience } from "@/app/actions/portfolio";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { useAuth } from "@/components/admin/AdminProvider";
import { toast } from "sonner";
import { Loader2, Trash2, Briefcase, ListChecks, Code2, Plus, X } from "lucide-react";
import { TagInput } from "../TagInput";
import { CustomSelect } from "../CustomSelect";
import { useFormDraft } from "./useFormDraft";

const DEFAULT_EXPERIENCE = {
  company: "",
  role: "",
  period: "",
  type: "Full-time",
  location: "",
  description: "",
  achievements: [],
  tech: []
};

export const ExperienceForm = ({ experience, onClose }: { experience?: any, onClose: () => void }) => {
  const { refreshData } = usePortfolio();
  const { confirmDelete } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData, clearDraft] = useFormDraft(
    "draft_experience",
    experience || DEFAULT_EXPERIENCE,
    !experience?.id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await upsertExperience(formData);
      if (res && !res.success) {
        throw new Error(res.error || "Failed to save experience");
      }
      clearDraft();
      await refreshData();
      toast.success("Experience saved successfully");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save experience", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!experience?.id) return;
    confirmDelete({
      title: "Delete Experience",
      label: `${experience.role} at ${experience.company}`,
      onConfirm: async () => {
        try {
          const res = await deleteExperience(experience.id);
          if (res && !res.success) {
            throw new Error(res.error || "Failed to delete experience");
          }
          await refreshData();
          toast.success("Experience deleted successfully");
          onClose();
        } catch (err: any) {
          toast.error("Failed to delete experience", { description: err.message });
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-4 no-scrollbar">
      {/* 1. Basic Info */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(0,167,157)] mb-2">
          <Briefcase size={12} /> Role Details
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all"
              placeholder="e.g. SW Global"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all"
              placeholder="e.g. Senior Engineer"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Period</label>
            <input
              type="text"
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all"
              placeholder="e.g. Jan 2023 - Present"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Job Type</label>
            <CustomSelect
              value={formData.type || "Full-time"}
              onChange={(val) => setFormData({ ...formData, type: val })}
              options={[
                { value: "Full-time", label: "Full-time" },
                { value: "Contract", label: "Contract" },
                { value: "Freelance", label: "Freelance" }
              ]}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Brief Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white min-h-[80px] focus:border-[rgb(0,167,157,0.4)] outline-none transition-all resize-none"
            placeholder="High-level overview of your role..."
          />
        </div>
      </section>

      {/* 2. Achievements */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(0,167,157)] mb-2">
          <ListChecks size={12} /> Achievements (Bullet Points)
        </div>
        
        <div className="space-y-2">
          {(formData.achievements || []).map((a: string, i: number) => (
            <div key={i} className="flex gap-2 group">
              <textarea
                value={a}
                onChange={(e) => {
                  const newA = [...formData.achievements];
                  newA[i] = e.target.value;
                  setFormData({ ...formData, achievements: newA });
                }}
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all resize-none min-h-[60px]"
              />
              <button 
                type="button"
                onClick={() => {
                  const newA = formData.achievements.filter((_: any, idx: number) => idx !== i);
                  setFormData({ ...formData, achievements: newA });
                }}
                className="p-2 h-fit text-white/20 hover:text-red-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFormData({ ...formData, achievements: [...(formData.achievements || []), ""] })}
            className="w-full py-3 border border-dashed border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-[rgb(0,167,157)] hover:border-[rgb(0,167,157,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Add Achievement
          </button>
        </div>
      </section>

      {/* 3. Tech Stack */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(0,167,157)] mb-2">
          <Code2 size={12} /> Technology Stack
        </div>
        
        <div className="space-y-1.5">
          <TagInput
            tags={formData.tech || []}
            onChange={(tech) => setFormData({ ...formData, tech })}
            placeholder="Add technology..."
          />
        </div>
      </section>

      {/* Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-white/10">
        {experience?.id ? (
          <button
            type="button"
            onClick={handleDelete}
            className="text-red-400/50 hover:text-red-400 transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            Delete Experience
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
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Save Experience"}
          </button>
        </div>
      </div>
    </form>
  );
};
