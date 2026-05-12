"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { EXPERIENCE } from "@/data/portfolio";

export function ExperienceTimeline() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="pr-1">
        <div className="flex flex-col">
          {EXPERIENCE.map((exp, i) => {
            const isOpen = openIndex === i;
            const isLast = i === EXPERIENCE.length - 1;
            return (
              <div key={i} className="relative pl-7 pb-6 last:pb-0">
                {/* Line ABOVE dot */}
                {i !== 0 && (
                  <div className="absolute left-[7px] top-0 h-[12px] w-px bg-white/10" />
                )}
                {/* Line BELOW dot */}
                {!isLast && (
                  <div className="absolute left-[7px] top-[26px] bottom-0 w-px bg-white/10" />
                )}
                
                {/* Dot */}
                <div
                  className="absolute left-0 top-[12px] w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 z-10"
                  style={{
                    background: i === 0 ? "rgb(0,167,157)" : isOpen ? "rgba(0,167,157,0.3)" : "rgb(12,16,20)",
                    borderColor: i === 0 || isOpen ? "rgb(0,167,157)" : "rgba(0,167,157,0.3)",
                    boxShadow: (i === 0 || isOpen) ? "0 0 8px rgba(0,167,157,0.45)" : "none",
                  }}
                />

                {/* Accordion header */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full text-left group py-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
                        {exp.company}
                      </span>
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{
                          background: exp.type === "Full-time" ? "rgba(0,167,157,0.12)" : "rgba(255,200,50,0.12)",
                          color: exp.type === "Full-time" ? "rgb(0,200,188)" : "rgb(255,210,80)",
                        }}
                      >
                        {exp.type}
                      </span>
                    </div>
                    <ChevronDown
                      size={13}
                      className="flex-shrink-0 text-white/25 transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </div>
                  <p className="text-[11px] text-white/40 mt-0.5">
                    {exp.role} · {exp.period}
                  </p>
                </button>

                {/* Accordion body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="pb-3">
                        <p className="text-xs text-white/40 leading-relaxed mb-2">{exp.description}</p>
                        <ul className="space-y-1 mb-2">
                          {exp.achievements.map((a, j) => (
                            <li key={j} className="text-[11px] text-white/35 flex gap-1.5">
                              <span style={{ color: "rgb(0,167,157)" }}>→</span>
                              {a}
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-1">
                          {exp.tech.slice(0, 5).map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 rounded text-[9px] font-medium text-white/30 bg-white/[0.04] border border-white/[0.05]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

  );
}