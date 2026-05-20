"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github, ExternalLink, Plus } from "lucide-react";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { TechBadge } from "@/components/ui/TechBadge";
import { BentoCard } from "@/components/bento/BentoCard";
import { EditableSection } from "@/components/admin/EditableSection";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProjectDetailPage({ params }: Props) {
  const { slug } = use(params);
  const { data } = usePortfolio();
  const { projects: PROJECTS } = data;
  
  const project = PROJECTS.find((p: any) => p.slug === slug);
  
  const openAdmin = (view: any, item?: any) => {
    if (typeof window !== "undefined" && (window as any).openAdmin) {
      (window as any).openAdmin(view, item);
    }
  };

  if (!project) return null;

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
          <EditableSection onEdit={() => openAdmin("project", project)} label="Project Info">
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
          </EditableSection>
        </div>

        {/* Hero image */}
        <EditableSection onEdit={() => openAdmin("project", project)} label="Hero Image">
          <div className="relative aspect-[16/7] rounded-2xl overflow-hidden mb-12 border border-white/[0.06]">
            <Image src={project.image} alt={project.title} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,8,10,0.4)] to-transparent" />
          </div>
        </EditableSection>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {project.metrics?.map((m: any, i: number) => (
            <EditableSection key={m.label || i} onEdit={() => openAdmin("project", project)} label="Metrics">
              <BentoCard className="text-center h-full">
                <div className="font-display font-bold text-2xl mb-1"
                  style={{ background: "linear-gradient(135deg, rgb(0,167,157), rgb(0,220,200))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {m.value}
                </div>
                <div className="text-white/35 text-xs">{m.label}</div>
              </BentoCard>
            </EditableSection>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <EditableSection onEdit={() => openAdmin("project", project)} label="Overview" className="md:col-span-2">
              <BentoCard>
                <h2 className="font-display font-bold text-white/90 text-xl mb-3">Overview</h2>
                <p className="text-white/50 text-sm leading-relaxed whitespace-pre-wrap">{project.overview}</p>
              </BentoCard>
            </EditableSection>

            <EditableSection onEdit={() => openAdmin("project", project)} label="Architecture">
              <BentoCard className="h-full">
                <h2 className="font-display font-bold text-white/90 text-xl mb-3">Architecture</h2>
                <p className="text-white/50 text-sm leading-relaxed whitespace-pre-wrap">{project.architecture}</p>
              </BentoCard>
            </EditableSection>

            <EditableSection onEdit={() => openAdmin("project", project)} label="Challenges">
              <BentoCard className="h-full">
                <h2 className="font-display font-bold text-white/90 text-xl mb-4">Key Challenges</h2>
                <ul className="space-y-3">
                  {project.challenges?.map((c: string, i: number) => (
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
            </EditableSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <EditableSection onEdit={() => openAdmin("project", project)} label="Tech Stack">
              <BentoCard>
                <h3 className="font-display font-semibold text-white/80 text-sm mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech?.map((t: string) => (
                    <TechBadge key={t} name={t} />
                  ))}
                </div>
              </BentoCard>
            </EditableSection>

            <EditableSection onEdit={() => openAdmin("project", project)} label="Links">
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
                </div>
              </BentoCard>
            </EditableSection>
          </div>
        </div>
      </div>
    </div>
  );
}