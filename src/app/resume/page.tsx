import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlowButton } from "@/components/ui/GlowButton";
import { PERSONAL, EXPERIENCE, EDUCATION } from "@/data/portfolio";
import { Download, Printer, Mail, MapPin, Globe, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Professional experience, education, and technical skills of Kael Soren.",
};

export default function ResumePage() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header CTAs */}
        <div className="flex justify-between items-end mb-12 no-print">
          <SectionHeading
            label="Curriculum Vitae"
            title="Résumé"
            className="mb-0"
          />
          <div className="flex gap-3">
            <GlowButton variant="ghost" size="sm" onClick={() => window.print()}>
              <Printer size={14} className="mr-2" /> Print
            </GlowButton>
            <GlowButton variant="primary" size="sm">
              <Download size={14} className="mr-2" /> Download PDF
            </GlowButton>
          </div>
        </div>

        {/* Resume Paper */}
        <div className="glass-card-static p-12 relative overflow-hidden bg-[rgb(12,15,18)]">
          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none noise-overlay" />
          
          {/* Header */}
          <div className="border-b border-white/[0.08] pb-10 mb-10">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <h1 className="font-display font-bold text-white text-4xl mb-2">{PERSONAL.name}</h1>
                <p className="text-[rgb(0,167,157)] font-semibold tracking-wide uppercase text-sm">
                  {PERSONAL.title}
                </p>
              </div>
              <div className="space-y-2 text-right">
                <div className="flex items-center justify-end gap-2 text-white/50 text-sm">
                  <span>{PERSONAL.email}</span>
                  <Mail size={14} />
                </div>
                <div className="flex items-center justify-end gap-2 text-white/50 text-sm">
                  <span>{PERSONAL.location}</span>
                  <MapPin size={14} />
                </div>
                <div className="flex items-center justify-end gap-2 text-white/50 text-sm">
                  <a href={PERSONAL.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">github.com/kaelsoren</a>
                  <Globe size={14} />
                </div>
              </div>
            </div>
            <p className="mt-8 text-white/60 leading-relaxed max-w-3xl">
              AI Systems Engineer with 8+ years of experience building scalable distributed systems and production-grade AI applications. Expert in multi-agent architectures, RAG optimization, and high-performance backend infrastructure.
            </p>
          </div>

          {/* Experience */}
          <div className="mb-12">
            <h2 className="font-display font-bold text-white text-xl mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-[rgb(0,167,157)]" /> Professional Experience
            </h2>
            <div className="space-y-10">
              {EXPERIENCE.map((job, i) => (
                <div key={i} className="group relative">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-1 mb-3">
                    <div>
                      <h3 className="text-white font-bold text-lg">{job.role}</h3>
                      <p className="text-[rgb(0,167,157)] font-medium">{job.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/40 text-sm font-medium">{job.period}</p>
                      <p className="text-white/20 text-[10px] uppercase tracking-wider">{job.location}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {job.highlights.map((item, j) => (
                      <li key={j} className="text-white/50 text-sm leading-relaxed flex items-start gap-3">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-[rgb(0,167,157)] flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mb-12">
            <h2 className="font-display font-bold text-white text-xl mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-[rgb(0,167,157)]" /> Education
            </h2>
            <div className="space-y-6">
              {EDUCATION.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-bold">{edu.degree}</h3>
                    <p className="text-white/60 text-sm">{edu.school}</p>
                  </div>
                  <p className="text-white/40 text-sm">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Grid */}
          <div>
            <h2 className="font-display font-bold text-white text-xl mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-[rgb(0,167,157)]" /> Technical Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {[
                { label: "AI & ML", skills: ["LLMs", "RAG", "LangChain", "Vector DBs", "PyTorch"] },
                { label: "Languages", skills: ["TypeScript", "Python", "Rust", "Go", "SQL"] },
                { label: "Infrastructure", skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"] },
                { label: "Frontend", skills: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
              ].map((group) => (
                <div key={group.label}>
                  <p className="text-[rgb(0,167,157)] text-[10px] font-bold uppercase tracking-widest mb-2">{group.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map(s => (
                      <span key={s} className="text-white/50 text-sm">{s}{s !== group.skills[group.skills.length-1] && ","}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
