"use client";

import { useState } from "react";
import { updatePost, createPost } from "@/app/actions/social";
import { Loader2 } from "lucide-react";

export function PostEditor({ 
  post, 
  onClose, 
  platform 
}: { 
  post: any, 
  onClose: () => void,
  platform: string 
}) {
  const [content, setContent] = useState(post.content || "");
  const [date, setDate] = useState(post.scheduled_date || new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(post.scheduled_time || "09:00");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (post.id) {
        await updatePost(post.id, content, date, time);
      } else {
        await createPost(platform, content, date, time);
      }
      onClose();
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#111] p-4 rounded-xl border border-white/10 relative z-10">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-grow w-full bg-transparent text-sm text-white/90 focus:outline-none resize-none mb-4"
        placeholder="What do you want to talk about?"
      />
      <div className="flex items-center gap-2 mb-4 text-xs">
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)}
          className="bg-black border border-white/10 rounded px-2 py-1 text-white/80 focus:border-[rgb(0,167,157)] outline-none"
        />
        <input 
          type="time" 
          value={time.substring(0,5)} 
          onChange={(e) => setTime(e.target.value)}
          className="bg-black border border-white/10 rounded px-2 py-1 text-white/80 focus:border-[rgb(0,167,157)] outline-none"
        />
      </div>
      <div className="flex justify-end gap-2 mt-auto">
        <button 
          onClick={onClose}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white/50 hover:bg-white/5 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          disabled={loading || !content}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-black hover:bg-[rgb(0,167,157)] hover:text-white transition-colors flex items-center gap-2"
        >
          {loading && <Loader2 size={12} className="animate-spin" />}
          Save
        </button>
      </div>
    </div>
  );
}
