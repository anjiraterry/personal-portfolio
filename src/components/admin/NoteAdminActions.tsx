"use client";

import { useAuth } from "@/components/admin/AdminProvider";
import { Edit2, Trash2 } from "lucide-react";
import { deleteNote } from "@/app/actions/portfolio";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function NoteAdminActions({ note }: { note: any }) {
  const { isAuthenticated, confirmDelete } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) return null;

  const openAdmin = () => {
    if (typeof window !== "undefined" && (window as any).openAdmin) {
      (window as any).openAdmin("note", note);
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
          if (res && !res.success) throw new Error(res.error || "Failed to delete note");
          toast.success("Note deleted successfully");
          router.push("/notes");
        } catch (err: any) {
          toast.error("Failed to delete note", { description: err.message });
        }
      }
    });
  };

  return (
    <>
      <button
        onClick={handleDelete}
        className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]"
        title="Delete Note"
      >
        <Trash2 size={14} /> Delete
      </button>
      <button
        onClick={openAdmin}
        className="p-2.5 rounded-xl bg-[rgb(0,167,157,0.1)] text-[rgb(0,167,157)] hover:bg-[rgb(0,167,157,0.2)] border border-[rgb(0,167,157,0.2)] transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]"
        title="Edit Note"
      >
        <Edit2 size={14} /> Edit
      </button>
    </>
  );
}
