"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Trash2, ExternalLink, BarChart2, Heart, Repeat, MessageCircle, Bookmark } from "lucide-react";
import { PostEditor } from "./PostEditor";
import { deletePost } from "@/app/actions/social";
import { cn } from "@/lib/utils";

export function PostSlide({ post, platform }: { post: any, platform: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const isMuted = post.status === "sent" || post.status === "failed";

  const handleDelete = async () => {
    if (confirm("Delete this post?")) {
      await deletePost(post.id);
    }
  };

  if (isEditing) {
    return <PostEditor post={post} onClose={() => setIsEditing(false)} platform={platform} />;
  }

  return (
    <div className={cn(
      "flex flex-col min-h-0 h-full bg-white/[0.02] border border-white/5 p-5 rounded-xl transition-opacity relative group",
      isMuted && "opacity-60"
    )}>
      {/* Header / Status */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {post.status === "scheduled" && (
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-amber-500"
            />
          )}
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm",
            post.status === "draft" && "bg-white/10 text-white/60",
            post.status === "scheduled" && "bg-amber-500/20 text-amber-500",
            post.status === "sent" && "bg-green-500/20 text-green-500",
            post.status === "failed" && "bg-red-500/20 text-red-500"
          )}>
            {post.status}
          </span>
          <span className="text-[10px] text-white/30">{post.scheduled_time.substring(0,5)}</span>
        </div>
        
        {/* Actions (Hover) */}
        {!isMuted && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <button onClick={() => setIsEditing(true)} className="p-1.5 text-white/40 hover:text-white bg-white/5 rounded-md hover:bg-white/10 transition-colors">
              <Edit2 size={12} />
            </button>
            <button onClick={handleDelete} className="p-1.5 text-red-400/60 hover:text-red-400 bg-red-500/5 rounded-md hover:bg-red-500/10 transition-colors">
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto mb-4 custom-scrollbar">
        <p className="text-sm text-white/80 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Footer / Metrics */}
      {post.status === "sent" && (
        <div className="mt-auto pt-4 border-t border-white/5 flex flex-wrap gap-3">
          {platform === "twitter" && post.metrics ? (
            <>
              <Stat icon={<BarChart2 size={12} />} value={post.metrics.impressions || 0} />
              <Stat icon={<Heart size={12} />} value={post.metrics.likes || 0} />
              <Stat icon={<Repeat size={12} />} value={post.metrics.retweets || 0} />
              <Stat icon={<MessageCircle size={12} />} value={post.metrics.replies || 0} />
              <Stat icon={<Bookmark size={12} />} value={post.metrics.bookmarks || 0} />
            </>
          ) : platform === "linkedin" ? (
             <a href="#" className="flex items-center gap-1 text-xs text-[rgb(0,167,157)] hover:underline">
                <ExternalLink size={12} /> View on LinkedIn
             </a>
          ) : null}

        </div>
      )}
      
      {post.status === "failed" && post.metrics?.error && (
         <div className="mt-auto pt-3 border-t border-red-500/20">
           <p className="text-[10px] text-red-400 line-clamp-2">{JSON.stringify(post.metrics.error)}</p>
         </div>
      )}
    </div>
  );
}

function Stat({ icon, value }: { icon: React.ReactNode, value: number }) {
  return (
    <div className="flex items-center gap-1 text-white/40 text-xs">
      {icon}
      <span>{value}</span>
    </div>
  );
}
