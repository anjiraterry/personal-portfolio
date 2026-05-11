"use client";

import { motion } from "framer-motion";
import { BentoCard } from "@/components/bento/BentoCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechBadge } from "@/components/ui/TechBadge";
import { FOCUS_AREAS } from "@/data/portfolio";
import { FlaskConical, Lightbulb, ArrowRight } from "lucide-react";

export default function FocusPage() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
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
          <p className="text-white/45 text-base leading-relaxed max-w-xl mb-16">
            What I'm actively researching, building, and thinking about at the frontier of AI systems engineering.
          </p>
        </motion.div>

        {/* Focus areas */}
        <div className="space-y-6">
          {FOCUS_AREAS.map((area, i) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <BentoCard>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
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
                  {area.tags.map((tag) => (
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
                    {area.insights.map((insight, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-white/40">
                        <ArrowRight size={12} className="mt-1 flex-shrink-0" style={{ color: "rgb(0,167,157)" }} />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </BentoCard>
            </motion.div>
          ))}
        </div>

        {/* Philosophy note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <BentoCard gradient>
            <div className="text-4xl font-display font-bold text-[rgba(0,167,157,0.12)] mb-3">&ldquo;</div>
            <p className="text-white/50 text-base leading-relaxed italic">
              The most important skill in AI systems engineering isn't knowing the latest models — it's knowing how to build systems that remain reliable, observable, and maintainable as the models change underneath them.
            </p>
            <p className="text-sm text-white/25 mt-4">— Research philosophy</p>
          </BentoCard>
        </motion.div>

      </div>
    </div>
  );
}