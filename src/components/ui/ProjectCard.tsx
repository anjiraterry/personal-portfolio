"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  status: string;
  description: string;
  image: string;
  tech: string[];
  github?: string | null;
  demo?: string | null;
}

interface ProjectCardProps {
  project: Project;
  index?: number;
  variant?: "grid" | "slider";
}

const statusColors: Record<string, string> = {
  Production: "rgba(0,167,157,0.15)",
  Beta: "rgba(255,200,50,0.15)",
  "Open Source": "rgba(100,150,255,0.15)",
  Shipped: "rgba(150,255,150,0.12)",
};

const statusText: Record<string, string> = {
  Production: "rgb(0,200,188)",
  Beta: "rgb(255,200,80)",
  "Open Source": "rgb(130,170,255)",
  Shipped: "rgb(100,220,120)",
};

export function ProjectCard({ project, index = 0, variant = "grid" }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={cn(variant === "slider" && "flex-shrink-0 w-80 md:w-96")}
    >
      <Link href={`/projects/${project.slug}`} className="group block h-full">
        <div className={cn(
          "h-full rounded-2xl border border-white/[0.06] overflow-hidden transition-all duration-400",
          "bg-[rgba(14,18,22,0.8)] backdrop-blur-xl",
          "hover:border-[rgba(0,167,157,0.15)] hover:shadow-[0_12px_50px_rgba(0,0,0,0.5)]",
          "hover:-translate-y-1"
        )}>
          {/* Image */}
          <div className="relative h-44 overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgb(14,18,22)] via-transparent to-transparent" />
            {/* Status badge */}
            <div className="absolute top-3 right-3">
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  background: statusColors[project.status] ?? "rgba(255,255,255,0.1)",
                  color: statusText[project.status] ?? "rgba(255,255,255,0.7)",
                }}
              >
                {project.status}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="font-display font-bold text-white/95 text-lg leading-tight group-hover:text-white">
                  {project.title}
                </h3>
                <p className="text-white/40 text-xs mt-0.5">{project.subtitle}</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0 mt-0.5">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg bg-white/[0.05] text-white/40 hover:text-white/80 transition-colors"
                  >
                    <Github size={13} />
                  </a>
                )}
                <div className="p-1.5 rounded-lg bg-white/[0.05] text-white/40 group-hover:text-[rgb(0,167,157)] transition-colors">
                  <ArrowUpRight size={13} />
                </div>
              </div>
            </div>

            <p className="text-white/45 text-sm leading-relaxed truncate-2 mb-4">
              {project.description}
            </p>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-1.5">
              {project.tech.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded text-[10px] font-medium text-white/40 bg-white/[0.04] border border-white/[0.06]"
                >
                  {t}
                </span>
              ))}
              {project.tech.length > 4 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-medium text-white/30">
                  +{project.tech.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}