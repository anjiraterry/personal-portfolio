"use client";

import { useState } from "react";
import { upsertNote, deleteNote } from "@/app/actions/portfolio";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { useAuth } from "@/components/admin/AdminProvider";
import { Loader2, Trash2, BookOpen, Calendar, Clock, Tag } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "../ImageUpload";
import { TagInput } from "../TagInput";
import { useFormDraft } from "./useFormDraft";

const DEFAULT_NOTE = {
  title: "",
  slug: "",
  date: new Date().toISOString().split('T')[0],
  category: "",
  read_time: "5 min",
  excerpt: "",
  image: "",
  tags: []
};

export const NoteForm = ({ note, onClose }: { note?: any, onClose: () => void }) => {
  const { refreshData } = usePortfolio();
  const { confirmDelete } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData, clearDraft] = useFormDraft(
    "draft_note",
    note ? {
      ...note,
      read_time: note.read_time || note.readTime || "5 min",
      image: note.image || ""
    } : DEFAULT_NOTE,
    !note?.id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await upsertNote(formData);
      if (res && !res.success) {
        throw new Error(res.error || "Failed to save note");
      }
      clearDraft();
      await refreshData();
      toast.success("Note saved successfully");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save note", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!note?.id) return;
    confirmDelete({
      title: "Delete Note",
      label: note.title,
      onConfirm: async () => {
        try {
          const res = await deleteNote(note.id);
          if (res && !res.success) {
            throw new Error(res.error || "Failed to delete note");
          }
          await refreshData();
          toast.success("Note deleted successfully");
          onClose();
        } catch (err: any) {
          toast.error("Failed to delete note", { description: err.message });
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 no-scrollbar">
      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(0,167,157)] mb-2">
          <BookOpen size={12} /> Note Content
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ 
                ...formData, 
                title: e.target.value, 
                slug: note ? formData.slug : e.target.value.toLowerCase().replace(/\s+/g, '-') 
              })}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all"
              placeholder="e.g. Building RAG Systems"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all font-mono"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1 flex items-center gap-1"><Calendar size={10} /> Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1 flex items-center gap-1"><Clock size={10} /> Read Time</label>
            <input
              type="text"
              value={formData.read_time}
              onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all"
              placeholder="5 min"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[rgb(0,167,157,0.4)] outline-none transition-all"
              placeholder="AI Agents"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-white min-h-[80px] focus:border-[rgb(0,167,157,0.4)] outline-none transition-all resize-none"
            placeholder="Short summary of the note..."
          />
        </div>

        <div className="space-y-1.5">
          <TagInput
            tags={formData.tags || []}
            onChange={(tags) => setFormData({ ...formData, tags })}
            placeholder="e.g. RAG, LLM, Infrastructure..."
            label="Tags"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(0,167,157)]">
          Cover Image
        </div>
        <ImageUpload value={formData.image} onChange={(url) => setFormData({ ...formData, image: url })} />
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-white/10">
        {note?.id ? (
          <button
            type="button"
            onClick={handleDelete}
            className="group flex items-center gap-2 text-red-400/50 hover:text-red-400 transition-all text-[10px] font-bold uppercase tracking-widest"
          >
            <Trash2 size={14} /> Delete Note
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
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Publish Note"}
          </button>
        </div>
      </div>
    </form>
  );
};
