"use client";

import { useState } from "react";
import { upsertProject, deleteProject } from "@/app/actions/portfolio";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { useAuth } from "@/components/admin/AdminProvider";
import { Loader2, Plus, Trash2, Globe, Github as GithubIcon, Layout, Settings, Trophy, ListChecks, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "../ImageUpload";
import { TagInput } from "../TagInput";
import { CustomSelect } from "../CustomSelect";
import { useFormDraft } from "./useFormDraft";

const STATUS_OPTIONS = ["Idea", "Architecting", "Development", "Production", "Funding", "Scale"];

const DEFAULT_PROJECT = {
  title: "",
  slug: "",
  subtitle: "",
  category: "",
  status: "Production",
  year: new Date().getFullYear().toString(),
  description: "",
  overview: "",
  architecture: "",
  challenges: [],
  metrics: [],
  image: "",
  tech: [],
  featured: false,
  github: "",
  demo: ""
};

export const ProjectForm = ({ project, onClose }: { project?: any, onClose: () => void }) => {
  const { refreshData } = usePortfolio();
  const { confirmDelete } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData, clearDraft] = useFormDraft(
    "draft_project", 
    project || DEFAULT_PROJECT, 
    !project?.id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await upsertProject(formData);
      if (res && !res.success) {
        throw new Error(res.error || "Failed to save project");
      }
      clearDraft();
      await refreshData();
      toast.success("Project saved successfully");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save project", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!project?.id) return;
    confirmDelete({
      title: "Delete Project",
      label: project.title,
      onConfirm: async () => {
        try {
          const res = await deleteProject(project.id);
          if (res && !res.success) {
            throw new Error(res.error || "Failed to delete project");
          }
          await refreshData();
          toast.success("Project deleted successfully");
          onClose();
        } catch (err: any) {
          toast.error("Failed to delete project", { description: err.message });
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-h-[75vh] overflow-y-auto pr-4 no-scrollbar">
      {/* 1. Basic Info Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(0,167,157)] mb-2">
          <Layout size={12} /> Basic Information
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Project Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ 
                ...formData, 
                title: e.target.value, 
                slug: project ? formData.slug : e.target.value.toLowerCase().replace(/\s+/g, '-') 
              })}
              placeholder="e.g. Thorfin"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] focus:bg-white/[0.05] outline-none transition-all"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] focus:bg-white/[0.05] outline-none transition-all font-mono"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g. AI Agents"
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Current Status</label>
            <CustomSelect
              value={formData.status}
              onChange={(val) => setFormData({ ...formData, status: val })}
              options={STATUS_OPTIONS.map(opt => ({ value: opt, label: opt }))}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Subtitle / Tagline</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="Brief one-liner about the project"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Card Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief paragraph summary shown on the project card..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white min-h-[80px] focus:border-[rgb(0,167,157,0.4)] outline-none transition-all resize-none"
            required
          />
        </div>
      </section>

      {/* 2. Media Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(0,167,157)] mb-2">
          <ImageIcon size={12} /> Project Visuals
        </div>
        <ImageUpload 
          value={formData.image} 
          onChange={(url) => setFormData({ ...formData, image: url })} 
        />
      </section>

      {/* 3. Detailed Content */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(0,167,157)] mb-2">
          <Settings size={12} /> Deep Dive Content
        </div>
        
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Project Overview</label>
          <textarea
            value={formData.overview}
            onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white min-h-[120px] focus:border-[rgb(0,167,157,0.4)] outline-none transition-all resize-none"
            placeholder="Describe the problem and your solution..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">System Architecture</label>
          <textarea
            value={formData.architecture}
            onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white min-h-[100px] focus:border-[rgb(0,167,157,0.4)] outline-none transition-all resize-none"
            placeholder="Explain the technical stack and data flow..."
          />
        </div>
      </section>

      {/* 4. Lists & Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(0,167,157)]">
            <ListChecks size={12} /> Key Challenges
          </div>
          <textarea
            value={formData.challenges?.join("\n") || ""}
            onChange={(e) => setFormData({ ...formData, challenges: e.target.value.split("\n").filter(Boolean) })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white min-h-[150px] focus:border-[rgb(0,167,157,0.4)] outline-none transition-all resize-none"
            placeholder="One challenge per line..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(0,167,157)]">
            <Trophy size={12} /> Project Metrics
          </div>
          <textarea
            value={formData.metrics?.map((m: any) => `${m.label}:${m.value}:${m.suffix || ""}`).join("\n") || ""}
            onChange={(e) => setFormData({ 
              ...formData, 
              metrics: e.target.value.split("\n").filter(Boolean).map(line => {
                const [label, value, suffix] = line.split(":");
                return { label: label?.trim() || "", value: value?.trim() || "", suffix: suffix?.trim() || "" };
              }) 
            })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white min-h-[150px] focus:border-[rgb(0,167,157,0.4)] outline-none transition-all resize-none font-mono"
            placeholder="Label:Value:Suffix (e.g. Users:10k:+)"
          />
        </div>
      </section>

      {/* 5. Tech & Links */}
      <section className="space-y-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <TagInput
              tags={formData.tech || []}
              onChange={(tech) => setFormData({ ...formData, tech })}
              placeholder="e.g. Next.js, AI, Supabase..."
              label="Tech Stack"
            />
          </div>
          
          <div className="space-y-4">
             <div className="grid grid-cols-1 gap-3">
                <div className="relative">
                  <GithubIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                  <input
                    type="text"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="GitHub Repo URL"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                  <input
                    type="text"
                    value={formData.demo}
                    onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
                    placeholder="Live Demo URL"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all"
                  />
                </div>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 rounded border-white/10 bg-white/[0.03] accent-[rgb(0,167,157)] cursor-pointer"
          />
          <label htmlFor="featured" className="text-xs font-bold text-white/50 cursor-pointer hover:text-white transition-colors">
            Highlight as Featured Project
          </label>
        </div>
      </section>

      {/* Footer Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-white/10">
        {project?.id ? (
          <button
            type="button"
            onClick={handleDelete}
            className="group flex items-center gap-2 text-red-400/50 hover:text-red-400 transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            <Trash2 size={14} className="group-hover:scale-110 transition-transform" /> Delete Project
          </button>
        ) : <div />}
        
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-xs font-bold text-white/30 hover:text-white transition-all uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[rgb(0,87,79)] to-[rgb(0,167,157)] text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,167,157,0.3)] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Publish Project"}
          </button>
        </div>
      </div>
    </form>
  );
};
