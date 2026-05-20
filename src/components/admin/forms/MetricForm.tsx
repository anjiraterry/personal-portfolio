"use client";

import { useState } from "react";
import { upsertMetric, deleteMetric } from "@/app/actions/portfolio";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { useAuth } from "@/components/admin/AdminProvider";
import { Loader2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useFormDraft } from "./useFormDraft";

const DEFAULT_METRIC = {
  label: "",
  value: "",
  suffix: "",
  icon: "Layers2"
};

export const MetricForm = ({ metric, onClose }: { metric?: any, onClose: () => void }) => {
  const { refreshData } = usePortfolio();
  const { confirmDelete } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData, clearDraft] = useFormDraft(
    "draft_metric",
    metric || DEFAULT_METRIC,
    !metric?.id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await upsertMetric(formData);
      if (res && !res.success) {
        throw new Error(res.error || "Failed to save metric");
      }
      clearDraft();
      await refreshData();
      toast.success("Metric saved successfully");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save metric", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!metric?.id) return;
    confirmDelete({
      title: "Delete Metric",
      label: metric.label,
      onConfirm: async () => {
        try {
          const res = await deleteMetric(metric.id);
          if (res && !res.success) {
            throw new Error(res.error || "Failed to delete metric");
          }
          await refreshData();
          toast.success("Metric deleted successfully");
          onClose();
        } catch (err: any) {
          toast.error("Failed to delete metric", { description: err.message });
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Label</label>
        <input
          type="text"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 text-white"
          placeholder="e.g. Total Experience"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Value</label>
          <input
            type="text"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 text-white"
            placeholder="e.g. 4"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Suffix</label>
          <input
            type="text"
            value={formData.suffix}
            onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 text-white"
            placeholder="e.g. Years or +"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        {metric?.id ? (
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
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Save Metric"}
          </button>
        </div>
      </div>
    </form>
  );
};
