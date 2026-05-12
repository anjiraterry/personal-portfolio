"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Calendar, Code2, Brain, Layers, Mail, Download, Check, Copy, User, Github } from "lucide-react";
import { TechBadge } from "@/components/ui/TechBadge";
import { BentoCard } from "@/components/bento/BentoCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResumeDownloadButton } from "@/components/ui/ResumeDownloadButton";
import { PERSONAL, EXPERIENCE, TECH_STACK, EXPERTISE } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const VALUES = [
  { icon: Brain, title: "AI-First Thinking", description: "I approach every problem by asking: how can AI make this 10x better? Then I build the infrastructure to make it real." },
  { icon: Code2, title: "Systems Mindset", description: "Good AI products need great engineering foundations. I obsess over reliability, observability, and maintainability." },
  { icon: Layers, title: "Product Sensibility", description: "I've shipped and grown SaaS products solo. I understand what users need and how to build toward that north star." },
];

export function AboutClient() {
  const [activeTab, setActiveTab] = useState<"stack" | "expertise">("stack");
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <User size={16} style={{ color: "rgb(0,167,157)" }} />
            <span className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: "rgb(0,167,157)" }}>
              About Me
            </span>
          </div>
          <h1 className="font-display font-bold text-white mb-6"
            style={{ fontSize: "clamp(2.2rem, 6vw, 3.8rem)", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
            Building at the frontier<br className="hidden md:block" /> of AI engineering
          </h1>
          <div className="flex items-center gap-4 text-sm text-white/35">
            <span className="flex items-center gap-1.5"><MapPin size={12} />{PERSONAL.location}</span>
            <span className="flex items-center gap-1.5"><Calendar size={12} />7 years engineering</span>
          </div>
        </motion.div>

        {/* Bio section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid lg:grid-cols-5 gap-8 mb-20"
        >
          {/* Profile visual */}
          <div className="lg:col-span-2">
            <BentoCard noPadding className="aspect-[4/5] overflow-hidden group">
              <img 
                src="/terry.jpeg" 
                alt={PERSONAL.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Social icons overlay - simplified */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button 
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md text-white/50 hover:text-white transition-all"
                  title="Copy Email"
                >
                  {copied ? <Check size={16} className="text-[rgb(0,200,188)]" /> : <Mail size={16} />}
                </button>
                <ResumeDownloadButton variant="ghost" size="sm" className="bg-black/40 border-white/10 backdrop-blur-md text-white/50" iconOnly />
              </div>
            </BentoCard>
          </div>

          {/* Bio text */}
          <div className="lg:col-span-3 flex flex-col justify-center space-y-5">
            <h2 className="font-display font-bold text-white mb-2"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.02em" }}>
              {PERSONAL.name}
            </h2>
            <p className="text-white/65 text-base leading-relaxed">
              I'm an AI Systems Engineer with 7 years of experience building production systems at the intersection of AI, infrastructure, and product engineering.
            </p>
            <p className="text-white/50 text-base leading-relaxed">
              My work spans the full stack — from LLM infrastructure and RAG pipelines to polished React frontends. I've built multi-agent orchestration systems, shipped SaaS products from 0→1, and led teams of engineers through complex technical transformations.
            </p>
            <p className="text-white/50 text-base leading-relaxed">
              Currently, I'm most excited about autonomous AI agents, next-generation RAG architectures, and the emerging patterns for building truly AI-native products — not products with AI bolted on.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link href="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all hover:shadow-[0_0_25px_rgba(0,167,157,0.3)] hover:-translate-y-px"
                style={{ background: "linear-gradient(135deg, rgb(0,87,79), rgb(0,167,157))" }}>
                Let's work together <ArrowRight size={14} />
              </Link>
              <a href={PERSONAL.github} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] transition-all hover:bg-white/[0.08] hover:text-white hover:-translate-y-px">
                <Github size={14} /> GitHub
              </a>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <div className="mb-20">
          <SectionHeading label="Philosophy" title="How I think & work" />
          <div className="grid md:grid-cols-3 gap-4">
            {VALUES.map((v, i) => (
              <BentoCard key={v.title} delay={i * 0.08} className="h-full">
                <div className="p-2 rounded-xl w-fit mb-4" style={{ background: "rgba(0,167,157,0.1)" }}>
                  <v.icon size={18} style={{ color: "rgb(0,167,157)" }} />
                </div>
                <h3 className="font-display font-bold text-white/90 text-base mb-2">{v.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{v.description}</p>
              </BentoCard>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="mb-20">
          <SectionHeading label="Career" title="Work Experience" />
          <div className="space-y-4">
            {EXPERIENCE.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <BentoCard>
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-display font-bold text-white/95 text-lg">{exp.company}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            background: exp.type === "Full-time" ? "rgba(0,167,157,0.12)" : "rgba(255,200,50,0.12)",
                            color: exp.type === "Full-time" ? "rgb(0,200,188)" : "rgb(255,210,80)",
                          }}>
                          {exp.type}
                        </span>
                      </div>
                      <p className="text-white/50 text-sm">{exp.role}</p>
                    </div>
                    <span className="text-white/30 text-sm font-mono">{exp.period}</span>
                  </div>
                  <p className="text-white/45 text-sm leading-relaxed mb-4">{exp.description}</p>
                  <ul className="space-y-1.5 mb-4">
                    {exp.achievements.map((a, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-white/40">
                        <span className="mt-0.5 flex-shrink-0" style={{ color: "rgb(0,167,157)" }}>→</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tech.map((t) => (
                      <TechBadge key={t} name={t} />
                    ))}
                  </div>
                </BentoCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <SectionHeading label="Technologies" title="Stack I work with" className="mb-0" />
            
            <div className="flex p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
              <button
                onClick={() => setActiveTab("stack")}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                  activeTab === "stack"
                    ? "bg-[rgb(0,167,157)] text-white shadow-lg shadow-[rgb(0,167,157,0.2)]"
                    : "text-white/30 hover:text-white/50",
                )}
              >
                STACK
              </button>
              <button
                onClick={() => setActiveTab("expertise")}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                  activeTab === "expertise"
                    ? "bg-[rgb(0,167,157)] text-white shadow-lg shadow-[rgb(0,167,157,0.2)]"
                    : "text-white/30 hover:text-white/50",
                )}
              >
                EXPERTISE
              </button>
            </div>
          </div>

          <BentoCard className="p-8">
            <div className="flex flex-wrap gap-3">
              {activeTab === "stack"
                ? TECH_STACK.map((tech, i) => (
                    <TechBadge key={tech.name} name={tech.name} category={tech.category} index={i} />
                  ))
                : EXPERTISE.map((item, i) => (
                    <TechBadge
                      key={item}
                      name={item}
                      index={i}
                      variant="teal"
                    />
                  ))}
            </div>
          </BentoCard>
        </div>

      </div>
    </div>
  );
}