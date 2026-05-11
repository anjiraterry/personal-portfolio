import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { PROJECTS } from "@/data/portfolio";
import { TechBadge } from "@/components/ui/TechBadge";
import { BentoCard } from "@/components/bento/BentoCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-6">

        {/* Back */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-white/35 hover:text-white/70 transition-colors mb-10 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Projects
        </Link>

        {/* Hero */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{ background: "rgba(0,167,157,0.12)", color: "rgb(0,200,188)" }}>
              {project.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/[0.05] text-white/40">
              {project.year}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{ background: "rgba(0,167,157,0.08)", color: "rgba(0,200,188,0.7)", border: "1px solid rgba(0,167,157,0.15)" }}>
              {project.status}
            </span>
          </div>

          <h1 className="font-display font-bold text-white/95 mb-2"
            style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
            {project.title}
          </h1>
          <p className="text-white/45 text-lg mb-6">{project.subtitle}</p>

          <div className="flex flex-wrap gap-3">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, rgb(0,87,79), rgb(0,167,157))" }}>
                Live Demo <ExternalLink size={13} />
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Github size={14} /> View Code
              </a>
            )}
          </div>
        </div>

        {/* Hero image */}
        <div className="relative aspect-[16/7] rounded-2xl overflow-hidden mb-12 border border-white/[0.06]">
          <Image src={project.image} alt={project.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,8,10,0.4)] to-transparent" />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {project.metrics.map((m) => (
            <BentoCard key={m.label} className="text-center">
              <div className="font-display font-bold text-2xl mb-1"
                style={{ background: "linear-gradient(135deg, rgb(0,167,157), rgb(0,220,200))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {m.value}
              </div>
              <div className="text-white/35 text-xs">{m.label}</div>
            </BentoCard>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <BentoCard>
              <h2 className="font-display font-bold text-white/90 text-xl mb-3">Overview</h2>
              <p className="text-white/50 text-sm leading-relaxed">{project.overview}</p>
            </BentoCard>

            <BentoCard>
              <h2 className="font-display font-bold text-white/90 text-xl mb-3">Architecture</h2>
              <p className="text-white/50 text-sm leading-relaxed">{project.architecture}</p>
            </BentoCard>

            <BentoCard>
              <h2 className="font-display font-bold text-white/90 text-xl mb-4">Key Challenges</h2>
              <ul className="space-y-3">
                {project.challenges.map((c, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold"
                      style={{ background: "rgba(0,167,157,0.12)", color: "rgb(0,200,188)" }}>
                      {i + 1}
                    </span>
                    <span className="text-sm text-white/50">{c}</span>
                  </li>
                ))}
              </ul>
            </BentoCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <BentoCard>
              <h3 className="font-display font-semibold text-white/80 text-sm mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <TechBadge key={t} name={t} />
                ))}
              </div>
            </BentoCard>

            <BentoCard>
              <h3 className="font-display font-semibold text-white/80 text-sm mb-3">Links</h3>
              <div className="space-y-2">
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[rgb(0,167,157)] hover:text-[rgb(0,220,210)] transition-colors">
                    <ExternalLink size={13} /> Live Demo
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white/45 hover:text-white/75 transition-colors">
                    <Github size={13} /> Source Code
                  </a>
                )}
                {!project.demo && !project.github && (
                  <p className="text-xs text-white/25">Links not available</p>
                )}
              </div>
            </BentoCard>

            <BentoCard>
              <h3 className="font-display font-semibold text-white/80 text-sm mb-3">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/35">Year</span>
                  <span className="text-white/60">{project.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/35">Category</span>
                  <span className="text-white/60">{project.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/35">Status</span>
                  <span style={{ color: "rgb(0,200,188)" }}>{project.status}</span>
                </div>
              </div>
            </BentoCard>
          </div>
        </div>

        {/* Next project */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex justify-between items-center">
          <Link href="/projects" className="text-sm text-white/35 hover:text-white/70 transition-colors">
            ← All Projects
          </Link>
          {PROJECTS.find((p, i) => PROJECTS[i - 1]?.slug === slug) && (
            <Link href={`/projects/${PROJECTS[PROJECTS.findIndex((p) => p.slug === slug) + 1]?.slug}`}
              className="text-sm text-white/35 hover:text-white/70 transition-colors">
              Next Project →
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}