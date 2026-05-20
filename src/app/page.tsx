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
  Briefcase,
  Download,
  Copy,
  Check,
  Layers2,
  Calendar,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BentoCard } from "@/components/bento/BentoCard";
import { TechBadge } from "@/components/ui/TechBadge";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { SnakeGame } from "@/components/ui/SnakeGame";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { EditableSection } from "@/components/admin/EditableSection";
import { cn } from "@/lib/utils";
import { ResumeDownloadButton } from "@/components/ui/ResumeDownloadButton";
import { 
  deleteExperience, 
  deleteMetric, 
  deleteTechItem, 
  deleteExpertiseItem, 
  deleteNote,
  deleteProject,
  deleteFocusArea
} from "@/app/actions/portfolio";
import { toast } from "sonner";
import { useAuth } from "@/components/admin/AdminProvider";

export default function HomePage() {
  const { data, refreshData } = usePortfolio();
  const { confirmDelete } = useAuth();
  
  const handleDelete = (action: Function, id: string, label: string, itemLabel?: string) => {
    if (!id) return;
    confirmDelete({
      title: `Delete ${label}`,
      label: itemLabel || label,
      onConfirm: async () => {
        try {
          const res = await action(id);
          if (res && !res.success) {
            throw new Error(res.error || `Failed to delete ${label}`);
          }
          await refreshData();
          toast.success(`${label} deleted successfully`);
        } catch (err: any) {
          toast.error(`Failed to delete ${label}`, { description: err.message });
        }
      }
    });
  };

  const { 
    personal: PERSONAL, 
    techStack: TECH_STACK, 
    expertise: EXPERTISE, 
    projects: PROJECTS, 
    experience: EXPERIENCE, 
    focusAreas: FOCUS_AREAS, 
    notes: NOTES,
    metrics: METRICS
  } = data;

  const [activeTab, setActiveTab] = useState<"stack" | "expertise">("stack");
  const [[projectIndex, direction], setProject] = useState([0, 0]);
  const [showProjectInfo, setShowProjectInfo] = useState(false);
  const [copied, setCopied] = useState(false);

  // Helper for admin
  const openAdmin = (view: any, item?: any) => {
    if (typeof window !== "undefined" && (window as any).openAdmin) {
      (window as any).openAdmin(view, item);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  // Project Slider Logic
  const nextProject = useCallback(() => {
    setProject(([prev]) => [(prev + 1) % PROJECTS.length, 1]);
  }, []);

  const prevProject = useCallback(() => {
    setProject(([prev]) => [(prev - 1 + PROJECTS.length) % PROJECTS.length, -1]);
  }, []);

  const contentVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        x: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
        opacity: { duration: 0.4, delay: 0.2 }
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: {
        opacity: { duration: 0.2 },
        x: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 }
      }
    })
  };

  useEffect(() => {
    const timer = setInterval(nextProject, 10000);
    return () => clearInterval(timer);
  }, [nextProject]);

  return (
    <div className="min-h-screen pt-[100px] pb-12 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:grid-rows-3 gap-6 lg:h-[calc(100vh-140px)]">
          {/* Intro Card */}
          <div className="md:col-span-2 lg:col-span-3 h-[280px] md:h-[320px] lg:h-full">
            <EditableSection onEdit={() => openAdmin("personal")} label="Intro">
              <BentoCard gradient className="flex flex-col justify-center h-full">
                <h1 className="font-display font-bold text-white/95 mb-4 leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.04em" }}>
                  Hi, I&apos;m {PERSONAL.name.split(" ")[0]} —
                </h1>
                <p className="text-white/40 text-lg md:text-xl leading-relaxed max-w-xl">
                  {PERSONAL.roles[0]}, currently building at <span className="text-white/80 border-b border-white/20">SW Global</span> based in {PERSONAL.location}
                </p>
              </BentoCard>
            </EditableSection>
          </div>

          {/* Experience Timeline Card */}
          <div className="md:col-span-2 lg:col-span-3 h-[450px] md:h-[500px] lg:h-full">
            <EditableSection onAdd={() => openAdmin("experience")} label="Experience" isList>
              <BentoCard className="h-full flex flex-col justify-between">
                <div className="flex flex-col md:flex-row gap-8 h-full overflow-hidden">
                  <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                      <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/20">Experience Timeline</p>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                      <ExperienceTimeline />
                    </div>
                  </div>
                  <div className="w-full md:w-px bg-white/[0.05] h-px md:h-full flex-shrink-0" />
                  <div className="flex flex-col justify-center space-y-8 md:pr-4 flex-shrink-0">
                    {METRICS.slice(0, 2).map((metric: any) => (
                      <EditableSection 
                        key={metric.id || metric.label} 
                        onEdit={() => openAdmin("metric", metric)} 
                        onDelete={() => handleDelete(deleteMetric, metric.id, "Metric")}
                        onAdd={() => openAdmin("metric")}
                        label="Metric"
                        autoHeight
                      >
                        <div>
                          <Layers2 className="text-[rgb(0,167,157)] mb-2" size={24} />
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-1">{metric.label}</p>
                          <p className="text-3xl font-display font-bold text-white/90">{metric.value}{metric.suffix}</p>
                        </div>
                      </EditableSection>
                    ))}
                  </div>
                </div>
              </BentoCard>
            </EditableSection>
          </div>

          {/* Headshot Card */}
          <div className="lg:col-span-1 h-[400px] md:h-[450px] lg:h-full">
            <BentoCard noPadding className="h-full group overflow-hidden">
              <img src="/terry.jpeg" alt="Headshot" className="w-full h-full object-cover scale-125 transition-all duration-700 group-hover:scale-120" />
            </BentoCard>
          </div>

          {/* About Card */}
          <div className="lg:col-span-2 h-[300px] md:h-[450px] lg:h-full">
            <EditableSection onEdit={() => openAdmin("personal")} label="About">
              <BentoCard className="h-full flex flex-col justify-between">
                <div className="overflow-y-auto custom-scrollbar pr-1">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/20 mb-6">About Me</p>
                  <h3 className="text-xl md:text-2xl font-display font-medium text-white/80 leading-relaxed">
                    {PERSONAL.tagline || "I architect and ship AI-native products at the intersection of LLMs, infrastructure, and product engineering."}
                  </h3>
                </div>
                <div className="flex justify-between items-end mt-4 relative">
                  <div className="flex gap-4">
                    <a href={PERSONAL.twitter} target="_blank" className="text-white/30 hover:text-white transition-colors"><Twitter size={18} /></a>
                    <a href={PERSONAL.github} target="_blank" className="text-white/30 hover:text-white transition-colors"><Github size={18} /></a>
                    <a href={PERSONAL.linkedin} target="_blank" className="text-white/30 hover:text-white transition-colors"><Linkedin size={18} /></a>
                    <button onClick={handleCopyEmail} className="text-white/30 hover:text-white transition-colors" title="Copy Email">{copied ? <Check size={18} className="text-[rgb(0,200,188)]" /> : <Mail size={18} />}</button>
                    <ResumeDownloadButton minimal className="text-white/30 hover:text-white" />
                  </div>
                  <AnimatePresence>
                    {copied && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute bottom-16 left-4">
                        <span className="text-[10px] font-bold text-[rgb(0,200,188)] uppercase tracking-widest bg-[rgb(0,167,157,0.1)] px-2 py-1 rounded-md border border-[rgb(0,167,157,0.15)] backdrop-blur-sm">Email Copied!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Link href="/about" className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"><ArrowUpRight size={18} /></Link>
                </div>
              </BentoCard>
            </EditableSection>
          </div>          {/* Project Slider Card */}
          <div className="md:col-span-2 lg:col-span-2 h-[450px] lg:h-full">
            <EditableSection 
              onEdit={PROJECTS.length > 0 ? () => openAdmin("project", PROJECTS[projectIndex]) : undefined} 
              onDelete={PROJECTS.length > 0 ? () => handleDelete(deleteProject, PROJECTS[projectIndex].id, "Project") : undefined}
              onAdd={() => openAdmin("project")} 
              label="Project" 
              isList
            >
              <BentoCard noPadding className="h-full group relative overflow-hidden">
                {!PROJECTS || PROJECTS.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-white/20 uppercase tracking-widest text-xs">No Projects Found</div>
                ) : (
                  <>
                    <div className="absolute inset-0 z-0">
                      <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                          key={projectIndex}
                          custom={direction}
                          initial={{ opacity: 0, x: direction > 0 ? "100%" : "-100%" }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: direction > 0 ? "-100%" : "100%" }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                          className="absolute inset-0"
                        >
                          <img 
                            src={PROJECTS[projectIndex].image} 
                            alt={PROJECTS[projectIndex].title} 
                            className="w-full h-full object-cover" 
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Layer 2: Backdrop */}
                    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-end">
                      <motion.div
                        animate={{ height: showProjectInfo ? "100%" : "120px" }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                        className={cn(
                          "relative w-full pointer-events-auto transition-all duration-500",
                          "bg-gradient-to-t from-black/90 via-black/40 to-transparent",
                          showProjectInfo ? "backdrop-blur-md bg-black/70" : ""
                        )}
                      />
                    </div>

                    {/* Layer 3: Content */}
                    <div className="absolute inset-0 z-20 pointer-events-none">
                      <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                          key={projectIndex}
                          custom={direction}
                          variants={contentVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          layout
                          className={cn(
                            "absolute inset-0 flex flex-col p-6 md:p-10 transition-all duration-500 no-scrollbar",
                            showProjectInfo ? "justify-center" : "justify-end pb-6 md:pb-6"
                          )}
                        >
                          <AnimatePresence>
                            {showProjectInfo && (
                              <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                                className="text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(0,167,157)] mb-2"
                              >
                                {PROJECTS[projectIndex].category}
                              </motion.p>
                            )}
                          </AnimatePresence>
                          <motion.h3 
                            layout
                            className={cn(
                              "font-display font-bold text-white leading-tight drop-shadow-md transition-all duration-500",
                              showProjectInfo ? "text-3xl mt-4" : "text-lg"
                            )}
                          >
                            {PROJECTS[projectIndex].title}
                          </motion.h3>
                          <motion.div 
                            initial={false}
                            animate={{ 
                              opacity: showProjectInfo ? 1 : 0,
                              height: showProjectInfo ? "auto" : 0,
                              marginTop: showProjectInfo ? 16 : 0
                            }}
                            className="max-w-md pointer-events-auto overflow-hidden no-scrollbar"
                          >
                            <p className="text-sm text-white/60 leading-relaxed mb-8">{PROJECTS[projectIndex].description}</p>
                            <Link 
                              href={`/projects/${PROJECTS[projectIndex].slug}`} 
                              className="inline-flex items-center gap-3 text-xs font-bold text-white uppercase tracking-[0.2em] hover:text-[rgb(0,167,157)] transition-colors group/case"
                            >
                              Explore Case Study <ArrowRight size={14} className="group-hover/case:translate-x-1 transition-transform" />
                            </Link>
                          </motion.div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Layer 4: Controls */}
                    <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none z-40">
                      <button onClick={(e) => { e.preventDefault(); prevProject(); }} className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 lg:-translate-x-2 group-hover:translate-x-0"><ChevronLeft size={15} /></button>
                      <button onClick={(e) => { e.preventDefault(); setShowProjectInfo(!showProjectInfo); }} className={cn("w-8 h-8 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-[rgb(0,167,157,0.2)] transition-all pointer-events-auto z-50 opacity-0 group-hover:opacity-100", showProjectInfo ? "absolute top-6 right-6 opacity-100" : "absolute bottom-6 right-10")}>{showProjectInfo ? <ChevronDown size={15} /> : <ChevronUp size={15} />}</button>
                      <button onClick={(e) => { e.preventDefault(); nextProject(); }} className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 lg:translate-x-2 group-hover:translate-x-0"><ChevronRight size={15} /></button>
                    </div>
                  </>
                )}
              </BentoCard>
            </EditableSection>
          </div>

          <div className="lg:col-span-1 h-[300px] md:h-[400px] lg:h-full">
            <BentoCard noPadding className="h-full"><SnakeGame /></BentoCard>
          </div>

          <div className="md:col-span-1 lg:col-span-2 h-[200px] md:h-[400px] lg:h-full">
            <EditableSection 
              onEdit={() => openAdmin("focus", FOCUS_AREAS.find((f: any) => f.is_current) || FOCUS_AREAS[0])} 
              onDelete={() => handleDelete(deleteFocusArea, (FOCUS_AREAS.find((f: any) => f.is_current) || FOCUS_AREAS[0]).id, "Focus Area")}
              onAdd={() => openAdmin("focus")} 
              label="Focus" 
              isList
            >
              <BentoCard gradient glowOnHover={false} className="h-full flex flex-col justify-between p-6">
                <div className="overflow-y-auto no-scrollbar">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/20">Current Focus</p>
                  </div>
                  <h4 className="text-white/90 font-bold text-lg mb-2">{(FOCUS_AREAS.find((f: any) => f.is_current) || FOCUS_AREAS[0]).title}</h4>
                  <p className="text-white/40 text-xs leading-relaxed max-w-md line-clamp-3">{(FOCUS_AREAS.find((f: any) => f.is_current) || FOCUS_AREAS[0]).description}</p>
                </div>
                <Link href="/focus" className="flex items-center gap-2 text-xs font-bold text-[rgb(0,167,157)] uppercase tracking-widest hover:text-[rgb(0,220,210)] transition-colors mt-4">View R&D <ArrowRight size={12} /></Link>
              </BentoCard>
            </EditableSection>
          </div>

          <div className="md:col-span-1 lg:col-span-2 h-[250px] lg:h-full">
            <EditableSection 
              onAdd={() => openAdmin(activeTab === "stack" ? "tech" : "expertise")} 
              label={activeTab === "stack" ? "Tech" : "Expertise"} 
              isList
            >
              <BentoCard className="h-full flex flex-col p-6">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/30">{activeTab === "stack" ? "Stack" : "Expertise"}</h3>
                  <div className="flex p-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <button onClick={() => setActiveTab("stack")} className={cn("px-3 py-1 text-[9px] font-bold rounded-md transition-all", activeTab === "stack" ? "bg-[rgb(0,167,157)] text-white" : "text-white/30 hover:text-white/50")}>STACK</button>
                    <button onClick={() => setActiveTab("expertise")} className={cn("px-3 py-1 text-[9px] font-bold rounded-md transition-all", activeTab === "expertise" ? "bg-[rgb(0,167,157)] text-white" : "text-white/30 hover:text-white/50")}>EXPERTISE</button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 overflow-y-auto custom-scrollbar pr-1">
                  {activeTab === "stack" ? 
                    TECH_STACK.map((tech, i) => (
                      <div key={tech.id || tech.name} onClick={() => openAdmin("tech", tech)} className="cursor-pointer">
                        <TechBadge name={tech.name} index={i} />
                      </div>
                    )) : 
                    EXPERTISE.map((item, i) => (
                      <div key={item.id || item.name} onClick={() => openAdmin("expertise", item)} className="cursor-pointer">
                        <TechBadge name={item.name} index={i} variant="teal" />
                      </div>
                    ))
                  }
                </div>
              </BentoCard>
            </EditableSection>
          </div>

          <div className="md:col-span-1 lg:col-span-2 h-[250px] lg:h-full">
            <EditableSection onAdd={() => openAdmin("note")} onDelete={() => handleDelete(deleteNote, NOTES[0]?.id, "Note")} label="Note" isList>
              <BentoCard gradient className="h-full flex flex-col justify-between p-6">
                <div className="overflow-hidden">
                  <div className="flex items-center justify-between mb-4"><p className="text-sm font-bold uppercase tracking-[0.2em] text-white/20">Latest Notes</p><Link href="/notes" className="text-[10px] font-bold text-[rgb(0,167,157)] uppercase tracking-widest hover:text-[rgb(0,220,210)] transition-colors">View All</Link></div>
                  <div className="space-y-3">
                    {NOTES.slice(0, 2).map((note: any) => (
                      <Link key={note.slug} href={`/notes/${note.slug}`} className="block group relative">
                        <h4 className="text-white/80 group-hover:text-white transition-colors text-sm font-medium leading-tight mb-1 line-clamp-1">{note.title}</h4>
                        <p className="text-[10px] text-white/30">{note.date} • {note.read_time || note.readTime}</p>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.05] flex-shrink-0"><p className="text-[11px] italic text-white/20 line-clamp-1">&ldquo;The engineering is the hard part.&rdquo;</p></div>
              </BentoCard>
            </EditableSection>
          </div>
        </div>
      </div>
    </div>
  );
}
