"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ArrowUpRight,
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Globe,
  ChevronLeft,
  ChevronRight,
  User,
  Layers2,
  Calendar,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BentoCard } from "@/components/bento/BentoCard";
import { TechBadge } from "@/components/ui/TechBadge";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { PERSONAL, TECH_STACK, EXPERTISE, PROJECTS, EXPERIENCE, FOCUS_AREAS, NOTES } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"stack" | "expertise">("stack");
  const [projectIndex, setProjectIndex] = useState(0);

  // Project Slider Logic
  const nextProject = useCallback(() => {
    setProjectIndex((prev) => (prev + 1) % PROJECTS.length);
  }, []);

  const prevProject = useCallback(() => {
    setProjectIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextProject, 5000);
    return () => clearInterval(timer);
  }, [nextProject]);

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* ============================================================
            BENTO GRID
            ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          
          {/* ── CARD 1: HERO INTRO (Row 1, Col 1-3) ────────────────── */}
          <div className="lg:col-span-3">
            <BentoCard gradient className="flex flex-col justify-center h-full min-h-[300px]">
              <h1 className="font-display font-bold text-white/95 mb-4 leading-tight"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.04em" }}>
                Hi, I&apos;m {PERSONAL.name.split(' ')[0]} —
              </h1>
              <p className="text-white/40 text-xl md:text-2xl leading-relaxed max-w-xl">
                {PERSONAL.roles[0]}, currently building at <span className="text-white/80 border-b border-white/20">Nexus AI</span> based in {PERSONAL.location.split(',')[0]}
              </p>
            </BentoCard>
          </div>

          {/* ── COMBINED CARD 2 & 3: EXPERIENCE TIMELINE (Row 1, Col 4-6) ── */}
          <div className="lg:col-span-3">
            <BentoCard className="h-full min-h-[300px] flex flex-col justify-between">
              <div className="flex flex-col md:flex-row gap-8 h-full">
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 mb-4">
                
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/20">Experience Timeline</p>
                  </div>
                  <ExperienceTimeline />
                </div>
                <div className="w-full md:w-px bg-white/[0.05] md:h-full" />
                <div className="flex flex-col justify-center space-y-8 md:pr-4">
                  <div>
                    <Layers2 className="text-[rgb(0,167,157)] mb-2" size={24} />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-1">Solutions Shipped</p>
                    <p className="text-3xl font-display font-bold text-white/90">24+</p>
                  </div>
                  <div>
                    <Calendar className="text-[rgb(0,167,157)] mb-2" size={24} />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-1">Total Experience</p>
                    <p className="text-3xl font-display font-bold text-white/90">7 Years</p>
                  </div>
                </div>
              </div>
            </BentoCard>
          </div>

          {/* ── CARD 5: HEADSHOT (Row 2, Col 1) ────────────────────── */}
          <div className="lg:col-span-1">
            <BentoCard noPadding className="h-full min-h-[340px] group overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" 
                alt="Headshot" 
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              />
            </BentoCard>
          </div>

          {/* ── CARD 6: ABOUT (Row 2, Col 2-3) ─────────────────────── */}
          <div className="lg:col-span-2">
            <BentoCard className="h-full flex flex-col justify-between min-h-[340px]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/20 mb-8">About Me</p>
                <h3 className="text-2xl md:text-3xl font-display font-medium text-white/80 leading-relaxed">
                  I architect and ship AI-native products at the intersection of LLMs, infrastructure, and product engineering.
                </h3>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex gap-4">
                  <a href={PERSONAL.twitter} target="_blank" className="text-white/30 hover:text-white transition-colors"><Twitter size={18} /></a>
                  <a href={PERSONAL.github} target="_blank" className="text-white/30 hover:text-white transition-colors"><Github size={18} /></a>
                  <a href={PERSONAL.linkedin} target="_blank" className="text-white/30 hover:text-white transition-colors"><Linkedin size={18} /></a>
                </div>
                <Link href="/about" className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all">
                  <ArrowUpRight size={20} />
                </Link>
              </div>
            </BentoCard>
          </div>

          {/* ── CARD 7: PROJECT SLIDER (Row 2, Col 4-5) ────────────── */}
          <div className="lg:col-span-2">
            <BentoCard noPadding className="h-full min-h-[340px] group relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={projectIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <img 
                    src={PROJECTS[projectIndex].image} 
                    alt={PROJECTS[projectIndex].title} 
                    className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[rgb(0,167,157)] mb-2">
                      {PROJECTS[projectIndex].category}
                    </p>
                    <h3 className="text-2xl font-display font-bold text-white mb-2">{PROJECTS[projectIndex].title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed max-w-sm mb-4 line-clamp-2">
                      {PROJECTS[projectIndex].description}
                    </p>
                    <Link 
                      href={`/projects/${PROJECTS[projectIndex].slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest"
                    >
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Controls */}
              <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.preventDefault(); prevProject(); }}
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-black/70 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); nextProject(); }}
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-black/70 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </BentoCard>
          </div>

          {/* ── CARD 8: RESOURCES (Row 2, Col 6) ───────────────────── */}
          <div className="lg:col-span-1">
            <BentoCard className="h-full flex flex-col justify-between min-h-[340px]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-8">Resources</p>
                <h3 className="text-xl font-display font-medium text-white/70 leading-snug">
                  Curated assets to accelerate your engineering workflow.
                </h3>
              </div>
              <div className="flex justify-end">
                <Link href="/notes" className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all">
                  <ArrowUpRight size={20} />
                </Link>
              </div>
            </BentoCard>
          </div>

          {/* ── CARD 9: MOVED FOCUS (Row 3, Col 1-2) ────────────────── */}
          <div className="lg:col-span-2">
            <BentoCard gradient className="h-full min-h-[220px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-smfont-bold uppercase tracking-[0.2em] text-white/20">Current Focus</p>
              
                </div>
                <h4 className="text-white/90 font-bold text-lg mb-2">{FOCUS_AREAS[0].title}</h4>
                <p className="text-white/40 text-xs leading-relaxed max-w-md">
                  {FOCUS_AREAS[0].description}
                </p>
              </div>
              <Link href="/focus" className="flex items-center gap-2 text-sm font-bold text-[rgb(0,167,157)] uppercase tracking-widest hover:text-[rgb(0,220,210)] transition-colors">
                View R&D <ArrowRight size={12} />
              </Link>
            </BentoCard>
          </div>

          {/* ── CARD 10: STACK & EXPERTISE (Row 3, Col 3-4) ────────── */}
          <div className="lg:col-span-2">
            <BentoCard className="h-full flex flex-col min-h-[220px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/30">
                  {activeTab === "stack" ? "Stack I use" : "My Expertise"}
                </h3>
                <div className="flex p-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <button 
                    onClick={() => setActiveTab("stack")}
                    className={cn(
                      "px-4 py-1.5 text-[10px] font-bold rounded-md transition-all",
                      activeTab === "stack" ? "bg-[rgb(0,167,157)] text-white" : "text-white/30 hover:text-white/50"
                    )}
                  >
                    STACK
                  </button>
                  <button 
                    onClick={() => setActiveTab("expertise")}
                    className={cn(
                      "px-4 py-1.5 text-[10px] font-bold rounded-md transition-all",
                      activeTab === "expertise" ? "bg-[rgb(0,167,157)] text-white" : "text-white/30 hover:text-white/50"
                    )}
                  >
                    EXPERTISE
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {activeTab === "stack" ? (
                  TECH_STACK.map((tech, i) => (
                    <TechBadge key={tech.name} name={tech.name} index={i} />
                  ))
                ) : (
                  EXPERTISE.map((item, i) => (
                    <TechBadge key={item} name={item} index={i} variant="teal" />
                  ))
                )}
              </div>
            </BentoCard>
          </div>

          {/* ── CARD 11: LATEST NOTES (Row 3, Col 5-6) ─────────────── */}
          <div className="lg:col-span-2">
            <BentoCard gradient className="h-full flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/20">Latest Notes</p>
                  <Link href="/notes" className="text-[10px] font-bold text-[rgb(0,167,157)] uppercase tracking-widest hover:text-[rgb(0,220,210)] transition-colors">
                    View All
                  </Link>
                </div>
                <div className="space-y-4">
                  {NOTES.slice(0, 2).map((note) => (
                    <Link key={note.slug} href={`/notes/${note.slug}`} className="block group">
                      <h4 className="text-white/80 group-hover:text-white transition-colors text-sm font-medium leading-tight mb-1">{note.title}</h4>
                      <p className="text-[10px] text-white/30">{note.date} • {note.readTime}</p>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.05]">
                <p className="text-[11px] italic text-white/20">&ldquo;The engineering is the hard part.&rdquo;</p>
              </div>
            </BentoCard>
          </div>

        </div>
      </div>
    </div>
  );
}