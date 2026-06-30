"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { PostSlide } from "./PostSlide";

export function DayCard({ 
  dateStr, 
  posts, 
  platform 
}: { 
  dateStr: string, 
  posts: any[], 
  platform: string 
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Create a placeholder post for creating new
  const [drafts, setDrafts] = useState<any[]>([]);

  // When props change, reset drafts (or keep them if user is editing, simplistic approach here is just to let them edit in place)
  useEffect(() => {
    setDrafts([]);
  }, [posts]);

  const displayPosts = [...posts, ...drafts];

  const handlePrev = () => {
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    }
  };

  const handleNext = () => {
    if (activeSlide < displayPosts.length - 1) {
      setActiveSlide(activeSlide + 1);
    }
  };

  const handleAddPost = () => {
    setDrafts([...drafts, {
      id: null,
      platform,
      content: "",
      scheduled_date: dateStr,
      scheduled_time: "09:00:00",
      status: "draft"
    }]);
    
    // go to new slide
    setTimeout(() => {
      setActiveSlide(displayPosts.length);
    }, 10);
  };

  // Format date header
  const dateObj = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
  const formattedDate = formatter.format(dateObj); // e.g., "Thu, Jun 12"

  return (
    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-white/80">{formattedDate}</h3>
        <button 
          onClick={handleAddPost}
          className="p-1.5 rounded-full bg-white/5 hover:bg-[rgb(0,167,157)] text-white/50 hover:text-white transition-colors"
          title="Add Post"
        >
          <Plus size={14} />
        </button>
      </div>

      {displayPosts.length === 0 ? (
        <div className="flex-grow flex items-center justify-center border border-dashed border-white/10 rounded-xl">
          <p className="text-white/30 text-sm">No posts scheduled</p>
        </div>
      ) : (
        <div className="flex-grow flex flex-col min-h-0 relative group">
          
          <div className="flex-grow flex items-center justify-center min-h-0 overflow-hidden w-full relative">
            <div 
              className="flex w-full transition-transform duration-300 ease-in-out h-full"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {displayPosts.map((post, idx) => (
                <div key={post.id || `draft-${idx}`} className="w-full h-full flex-shrink-0 px-1">
                  <PostSlide post={post} platform={platform} />
                </div>
              ))}
            </div>
          </div>

          {displayPosts.length > 1 && (
            <>
              {/* Left Chevron */}
              <button
                onClick={handlePrev}
                disabled={activeSlide === 0}
                className="absolute left-[-12px] top-1/2 -translate-y-1/2 bg-black/50 border border-white/10 rounded-full p-1.5 text-white/50 hover:text-white hover:bg-black/80 disabled:opacity-0 transition-all z-10 shadow-lg"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Right Chevron */}
              <button
                onClick={handleNext}
                disabled={activeSlide === displayPosts.length - 1}
                className="absolute right-[-12px] top-1/2 -translate-y-1/2 bg-black/50 border border-white/10 rounded-full p-1.5 text-white/50 hover:text-white hover:bg-black/80 disabled:opacity-0 transition-all z-10 shadow-lg"
              >
                <ChevronRight size={16} />
              </button>
              
              <div className="flex justify-center gap-1.5 mt-3 pt-2 border-t border-white/5">
                {displayPosts.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === activeSlide ? 'bg-[rgb(0,167,157)]' : 'bg-white/20 hover:bg-white/40'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
