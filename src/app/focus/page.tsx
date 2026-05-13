"use client";

import { motion } from "framer-motion";
import { BentoCard } from "@/components/bento/BentoCard";
import { TechBadge } from "@/components/ui/TechBadge";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { EditableSection } from "@/components/admin/EditableSection";
import { useAuth } from "@/components/admin/AdminProvider";
import { FlaskConical, Lightbulb, ArrowRight, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function FocusPage() {
  const { data, refreshData } = usePortfolio();
  const { isAuthenticated, confirmDelete } = useAuth();
  const { focusAreas: FOCUS_AREAS } = data;

  const openAdmin = (view: any, item?: any) => {
    if (typeof window !== "undefined" && (window as any).openAdmin) {
      (window as any).openAdmin(view, item);
    }
  };

  const handleDelete = (area: any) => {
    confirmDelete({
      title: "Delete Focus Area",
      label: area.title,
      onConfirm: async () => {
        try {
          const { deleteFocusArea } = await import("@/app/actions/portfolio");
          await deleteFocusArea(area.id);
          await refreshData();
          toast.success("Focus area deleted successfully");
        } catch (err) {
          toast.error("Failed to delete focus area");
        }
      }
    });
  };

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FlaskConical size={16} style={{ color: "rgb(0,167,157)" }} />
                <span className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: "rgb(0,167,157)" }}>
                  AI R&D Lab
                </span>
              </div>
              <h1 className="font-display font-bold text-white/95 mb-4"
                style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
                Current Focus Areas
              </h1>
            </div>
            {isAuthenticated && (
              <button 
                onClick={() => openAdmin("focus")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgb(0,167,157,0.1)] border border-[rgb(0,167,157,0.2)] text-[rgb(0,167,157)] text-xs font-bold uppercase tracking-widest hover:bg-[rgb(0,167,157,0.2)] transition-all"
              >
                <Plus size={14} /> Add Focus
              </button>
            )}
          </div>
          <p className="text-white/45 text-base leading-relaxed max-w-xl mb-16">
            What I'm actively researching, building, and thinking about at the frontier of AI systems engineering.
          </p>
        </motion.div>

        {/* Focus areas */}
        <div className="space-y-6">
          {FOCUS_AREAS.map((area: any, i: number) => {
            const activeCount = FOCUS_AREAS.filter((f: any) => f.is_current).length;
            const isActive = area.is_current;

            const handleToggleActive = async (e: React.MouseEvent) => {
              e.stopPropagation();
              try {
                const { upsertFocusArea } = await import("@/app/actions/portfolio");
                if (isActive) {
                  await upsertFocusArea({ ...area, is_current: false });
                } else if (activeCount < 2) {
                  await upsertFocusArea({ ...area, is_current: true });
                } else {
                  toast.warning("Active focus limit reached", {
                    description: "You can only have 2 active focus areas at a time."
                  });
                  return;
                }
                await refreshData();
              } catch (err) {
                console.error(err);
              }
            };

            return (
              <motion.div
                key={area.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="mb-6"
              >
                <EditableSection onEdit={() => openAdmin("focus", area)} onDelete={() => handleDelete(area)} label="Focus Area">
                  <BentoCard className={cn(
                    "transition-all duration-500",
                    isActive ? "ring-1 ring-[rgb(0,167,157,0.3)] bg-[rgb(0,167,157,0.02)]" : ""
                  )}>
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          {isAuthenticated && (
                            <div 
                              onClick={handleToggleActive}
                              className={cn(
                                "w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-all",
                                isActive ? "bg-[rgb(0,167,157)] border-[rgb(0,167,157)] text-white" : "border-white/10 hover:border-white/30"
                              )}
                            >
                              {isActive && <Check size={12} strokeWidth={3} />}
                            </div>
                          )}
                          <h2 className="font-display font-bold text-white/95 text-xl">{area.title}</h2>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                            style={{ background: "rgba(0,167,157,0.12)", color: "rgb(0,200,188)" }}>
                            {area.status}
                          </span>
                        </div>
                        <p className="text-white/45 text-sm leading-relaxed max-w-2xl">{area.description}</p>
                      </div>
                    {/* Progress */}
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-bold font-display" style={{ color: "rgb(0,167,157)" }}>{area.progress}%</span>
                      <span className="text-[10px] text-white/25">Progress</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1 rounded-full bg-white/[0.06] mb-5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${area.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, rgb(0,87,79), rgb(0,167,157))" }}
                    />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {(area.tags || []).map((tag: string) => (
                      <TechBadge key={tag} name={tag} variant="teal" />
                    ))}
                  </div>

                  {/* Insights */}
                  <div className="border-t border-white/[0.06] pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb size={13} style={{ color: "rgb(0,167,157)" }} />
                      <span className="text-xs font-semibold text-white/35 uppercase tracking-wider">Key Insights</span>
                    </div>
                    <ul className="space-y-2">
                      {(area.insights || []).map((insight: string, j: number) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-white/40">
                          <ArrowRight size={12} className="mt-1 flex-shrink-0" style={{ color: "rgb(0,167,157)" }} />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </BentoCard>
              </EditableSection>
              </motion.div>
            );
          })}
        </div>
 
        {/* Philosophy note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <EditableSection onEdit={() => openAdmin("focus")} label="Philosophy Note">
            <BentoCard gradient>
              <div className="text-4xl font-display font-bold text-[rgba(0,167,157,0.12)] mb-3">&ldquo;</div>
              <p className="text-white/50 text-base leading-relaxed italic">
                The most important skill in AI systems engineering isn't knowing the latest models — it's knowing how to build systems that remain reliable, observable, and maintainable as the models change underneath them.
              </p>
              <p className="text-sm text-white/25 mt-4">— Research philosophy</p>
            </BentoCard>
          </EditableSection>
        </motion.div>

      </div>
    </div>

  );
}