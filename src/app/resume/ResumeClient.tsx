"use client";

import { motion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { PERSONAL, EXPERIENCE, EDUCATION } from "@/data/portfolio";
import { Mail, MapPin, Globe, Github } from "lucide-react";
import { ResumeDownloadButton } from "@/components/ui/ResumeDownloadButton";

export function ResumeClient() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 no-print">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: "rgb(0,167,157)" }}>
                Curriculum Vitae
              </span>
            </div>
            <h1 className="font-display font-bold text-white/95"
              style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
              Résumé
            </h1>
          </motion.div>
          <div className="flex gap-3">
            <ResumeDownloadButton size="sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Experience */}
            <section>
              <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-px bg-[rgb(0,167,157)]" />
                Work Experience
              </h2>
              <div className="space-y-8">
                {EXPERIENCE.map((exp, i) => (
                  <div key={i} className="relative pl-8 border-l border-white/[0.05]">
                    <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-[rgb(0,167,157)] shadow-[0_0_10px_rgb(0,167,157)]" />
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-white/90">{exp.company}</h3>
                      <span className="text-xs font-mono text-white/30">{exp.period}</span>
                    </div>
                    <p className="text-[rgb(0,167,157)] text-sm font-medium mb-3">{exp.role}</p>
                    <ul className="space-y-2">
                      {exp.achievements.map((a, j) => (
                        <li key={j} className="text-sm text-white/50 leading-relaxed flex items-start gap-2">
                          <span className="text-[rgb(0,167,157)] mt-1.5">•</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-px bg-[rgb(0,167,157)]" />
                Education
              </h2>
              <div className="space-y-6">
                {EDUCATION.map((edu, i) => (
                  <div key={i} className="pl-8 border-l border-white/[0.05] relative">
                    <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-white/10" />
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold text-white/90">{edu.school}</h3>
                      <span className="text-xs font-mono text-white/30">{edu.year}</span>
                    </div>
                    <p className="text-white/50">{edu.degree}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-card p-6 rounded-2xl border border-white/[0.05]">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-6">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-[rgb(0,167,157)]">
                    <Mail size={14} />
                  </div>
                  <div className="text-sm">
                    <p className="text-white/30 text-[10px] uppercase font-bold tracking-tighter">Email</p>
                    <a href={`mailto:${PERSONAL.email}`} className="text-white/70 hover:text-white transition-colors">{PERSONAL.email}</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-[rgb(0,167,157)]">
                    <MapPin size={14} />
                  </div>
                  <div className="text-sm">
                    <p className="text-white/30 text-[10px] uppercase font-bold tracking-tighter">Location</p>
                    <p className="text-white/70">{PERSONAL.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-[rgb(0,167,157)]">
                    <Github size={14} />
                  </div>
                  <div className="text-sm">
                    <p className="text-white/30 text-[10px] uppercase font-bold tracking-tighter">GitHub</p>
                    <a href={PERSONAL.github} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">anjiraterry</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/[0.05]">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-6">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {PERSONAL.roles.map((role) => (
                  <span key={role} className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-medium text-white/50 uppercase tracking-wider">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
