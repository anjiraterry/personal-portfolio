"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { triggerScheduler, toggleSchedulerPause, seedTwitterPosts, seedLinkedInPosts } from "@/app/actions/social";
import { DayCard } from "../widget/DayCard";
import { Activity, Linkedin, Twitter, ChevronLeft, ChevronRight, Loader2, Play, Pause, Power, Database, LayoutGrid, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SocialManagerSection({
  initialPosts,
  isLinkedInConnected,
  linkedInProfile,
  lastRunAt,
  initialIsPaused
}: {
  initialPosts: any[];
  isLinkedInConnected: boolean;
  linkedInProfile?: string;
  lastRunAt?: string;
  initialIsPaused?: boolean;
}) {
  const [activeTab, setActiveTab] = useState("twitter");
  const [triggering, setTriggering] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [togglingPause, setTogglingPause] = useState(false);
  const [isPaused, setIsPaused] = useState(initialIsPaused || false);
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");

  // Group posts by platform and date
  const groupedPosts = initialPosts.reduce((acc, post) => {
    if (!acc[post.platform]) acc[post.platform] = {};
    if (!acc[post.platform][post.scheduled_date]) acc[post.platform][post.scheduled_date] = [];
    acc[post.platform][post.scheduled_date].push(post);
    return acc;
  }, { twitter: {}, linkedin: {} });

  // Generate 7 days for the current page
  // Start from June 11 2026 as requested
  const startDate = new Date("2026-06-11T00:00:00");
  startDate.setDate(startDate.getDate() + (page * 7));

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const handleTrigger = async () => {
    setTriggering(true);
    try {
      await triggerScheduler();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setTriggering(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      if (activeTab === "twitter") {
        await seedTwitterPosts();
      } else {
        await seedLinkedInPosts();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSeeding(false);
    }
  };

  const handleTogglePause = async () => {
    setTogglingPause(true);
    try {
      await toggleSchedulerPause(!isPaused);
      setIsPaused(!isPaused);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setTogglingPause(false);
    }
  };

  const getPendingCount = (platform: string) => {
    return initialPosts.filter(p => p.platform === platform && p.status === "scheduled").length;
  };

  // Determine if we need to show the seed button for the active tab
  const activePlatformPosts = initialPosts.filter(p => p.platform === activeTab);
  const showSeedButton = activePlatformPosts.length === 0;

  return (
    <div className="space-y-6">
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-4">
          <Tabs.List className="flex flex-wrap gap-2">
            <Tabs.Trigger 
              value="twitter"
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: activeTab === "twitter" ? "linear-gradient(135deg, rgb(0,87,79), rgb(0,167,157))" : "rgba(255,255,255,0.04)",
                border: activeTab === "twitter" ? "none" : "1px solid rgba(255,255,255,0.07)",
                color: activeTab === "twitter" ? "white" : "rgba(255,255,255,0.45)",
              }}
            >
              <div className="flex items-center gap-2">
                <Twitter size={16} /> Twitter
              </div>
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="linkedin"
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: activeTab === "linkedin" ? "linear-gradient(135deg, rgb(0,87,79), rgb(0,167,157))" : "rgba(255,255,255,0.04)",
                border: activeTab === "linkedin" ? "none" : "1px solid rgba(255,255,255,0.07)",
                color: activeTab === "linkedin" ? "white" : "rgba(255,255,255,0.45)",
              }}
            >
              <div className="flex items-center gap-2">
                <Linkedin size={16} /> LinkedIn
              </div>
            </Tabs.Trigger>
          </Tabs.List>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
              <button 
                onClick={() => setViewMode("grid")}
                className={cn("p-1.5 rounded-md transition-colors", viewMode === "grid" ? "bg-white/10 text-white" : "text-white/40 hover:text-white")}
                title="Feed View"
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setViewMode("calendar")}
                className={cn("p-1.5 rounded-md transition-colors", viewMode === "calendar" ? "bg-white/10 text-white" : "text-white/40 hover:text-white")}
                title="Calendar View"
              >
                <Calendar size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="my-6 bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", isPaused ? "bg-amber-500/10" : "bg-[rgb(0,167,157,0.1)]")}>
                {isPaused ? <Pause className="text-amber-500" size={20} /> : <Activity className="text-[rgb(0,167,157)]" size={20} />}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Scheduler Status</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className={cn(isPaused ? "text-amber-500" : "text-[rgb(0,167,157)]")}>● {isPaused ? "Paused" : "Active"}</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/80">Pending: {getPendingCount(activeTab)}</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block w-px h-10 bg-white/10" />
            <div className="hidden md:block">
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Last Run</p>
              <p className="text-sm text-white/80">{lastRunAt ? new Date(lastRunAt).toLocaleString() : "Never"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {showSeedButton && (
              <button 
                onClick={handleSeed}
                disabled={seeding}
                className="flex-1 md:flex-none px-4 py-2 border rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 bg-[rgb(0,167,157,0.1)] border-[rgb(0,167,157,0.2)] text-[rgb(0,167,157)] hover:bg-[rgb(0,167,157,0.2)]"
              >
                {seeding ? <Loader2 size={14} className="animate-spin" /> : <Database size={14} />}
                Seed Posts
              </button>
            )}
            <button 
              onClick={handleTogglePause}
              disabled={togglingPause}
              className={cn(
                "flex-1 md:flex-none px-4 py-2 border rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2",
                isPaused 
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20" 
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              )}
            >
              {togglingPause ? <Loader2 size={14} className="animate-spin" /> : <Power size={14} />}
              {isPaused ? "Resume Automation" : "Pause Automation"}
            </button>
            <button 
              onClick={handleTrigger}
              disabled={triggering || isPaused}
              className="flex-1 md:flex-none px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {triggering ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
              Trigger Now
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs.Content value="twitter" className="space-y-6">
           {viewMode === "grid" ? (
             <>
               <PaginationControls page={page} setPage={setPage} />
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                 {days.map(d => (
                   <DayCard key={d} dateStr={d} posts={groupedPosts.twitter[d] || []} platform="twitter" />
                 ))}
               </div>
             </>
           ) : (
             <CalendarMonthView posts={groupedPosts.twitter} />
           )}
        </Tabs.Content>

        <Tabs.Content value="linkedin" className="space-y-6">
           {viewMode === "grid" ? (
             <>
               <PaginationControls page={page} setPage={setPage} />
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                 {days.map(d => (
                   <DayCard key={d} dateStr={d} posts={groupedPosts.linkedin[d] || []} platform="linkedin" />
                 ))}
               </div>
             </>
           ) : (
             <CalendarMonthView posts={groupedPosts.linkedin} />
           )}
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

function PaginationControls({ page, setPage }: { page: number, setPage: (p: number) => void }) {
  // Cap at ~13 weeks (Sept 11 2026 roughly 90 days / 7 = 12 pages)
  const maxPage = 12; 

  return (
    <div className="flex justify-between items-center bg-white/[0.01] border border-white/5 rounded-lg p-2">
      <button 
        onClick={() => setPage(Math.max(0, page - 1))}
        disabled={page === 0}
        className="p-2 text-white/50 hover:text-white disabled:opacity-30 transition-colors"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="text-xs font-bold tracking-widest text-white/50">WEEK {page + 1}</span>
      <button 
        onClick={() => setPage(Math.min(maxPage, page + 1))}
        disabled={page === maxPage}
        className="p-2 text-white/50 hover:text-white disabled:opacity-30 transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function CalendarMonthView({ posts }: { posts: Record<string, any[]> }) {
  // July 2026 starting point since that's when most posts are scheduled
  const startDate = new Date("2026-07-01T00:00:00");
  const daysInMonth = 31; // July has 31 days
  const startDayOfWeek = startDate.getDay(); // 0 is Sunday
  
  const blanks = Array.from({ length: startDayOfWeek }).map((_, i) => i);
  const days = Array.from({ length: daysInMonth }).map((_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
      <div className="mb-4 text-white/60 font-bold uppercase tracking-widest text-sm px-2">July 2026</div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="text-center text-xs font-bold text-white/30 uppercase">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {blanks.map(b => <div key={`blank-${b}`} className="h-24 bg-white/[0.01] rounded-lg border border-transparent" />)}
        {days.map(d => {
          const dayPosts = posts[d] || [];
          const dayNum = new Date(d).getDate();
          return (
            <div key={d} className="h-24 bg-white/[0.03] rounded-lg border border-white/5 p-2 flex flex-col hover:border-white/20 transition-colors overflow-hidden">
              <span className="text-white/40 text-xs font-bold">{dayNum}</span>
              <div className="mt-auto space-y-1">
                {dayPosts.slice(0,2).map(p => (
                  <div key={p.id} className="text-[10px] truncate bg-[rgb(0,167,157,0.15)] text-[rgb(0,167,157)] rounded px-1.5 py-0.5 border border-[rgb(0,167,157,0.3)]">
                    {p.status === 'sent' ? '✓ ' : ''}{p.content}
                  </div>
                ))}
                {dayPosts.length > 2 && <div className="text-[10px] text-white/40 font-bold ml-1">+{dayPosts.length - 2} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
