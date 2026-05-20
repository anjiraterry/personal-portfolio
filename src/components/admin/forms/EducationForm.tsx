"use client";

import { useState } from "react";
import { upsertEducation, deleteEducation } from "@/app/actions/portfolio";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { useAuth } from "@/components/admin/AdminProvider";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useFormDraft } from "./useFormDraft";

const DEFAULT_EDUCATION = {
  school: "",
  degree: "",
  year: ""
};

export const EducationForm = ({ education, onClose }: { education?: any, onClose: () => void }) => {
  const { refreshData } = usePortfolio();
  const { confirmDelete } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData, clearDraft] = useFormDraft(
    "draft_education",
    education || DEFAULT_EDUCATION,
    !education?.id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await upsertEducation(formData);
      if (res && !res.success) {
        throw new Error(res.error || "Failed to save education");
      }
      clearDraft();
      await refreshData();
      toast.success("Education saved successfully");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save education", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!education?.id) return;
    confirmDelete({
      title: "Delete Education",
      label: education.school,
      onConfirm: async () => {
        try {
          const res = await deleteEducation(education.id);
          if (res && !res.success) {
            throw new Error(res.error || "Failed to delete education");
          }
          await refreshData();
          toast.success("Education deleted successfully");
          onClose();
        } catch (err: any) {
          toast.error("Failed to delete education", { description: err.message });
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">School</label>
        <input
          type="text"
          value={formData.school}
          onChange={(e) => setFormData({ ...formData, school: e.target.value })}
          className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 text-white"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Degree</label>
          <input
            type="text"
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 text-white"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Year</label>
          <input
            type="text"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 text-white"
            placeholder="e.g. 2018 - 2022"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        {education?.id ? (
          <button
            type="button"
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 transition-colors text-xs font-bold uppercase tracking-widest"
          >
            Delete
          </button>
        ) : <div />}
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-white/50 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-[rgb(0,167,157)] text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-[rgb(0,190,180)] transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Save Education"}
          </button>
        </div>
      </div>
    </form>
  );
};
