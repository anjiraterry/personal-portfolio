"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import { PROJECTS } from "@/data/portfolio";

const statusColors: Record<string, { bg: string; text: string }> = {
  Production:   { bg: "rgba(0,167,157,0.18)",   text: "rgb(0,210,195)" },
  Beta:         { bg: "rgba(255,190,40,0.15)",  text: "rgb(255,205,70)" },
  "Open Source":{ bg: "rgba(110,155,255,0.15)", text: "rgb(140,175,255)" },
  Shipped:      { bg: "rgba(100,230,130,0.12)", text: "rgb(110,230,140)" },
  Development:  { bg: "rgb(20,24,28)",          text: "rgb(251,191,36)" },
};

export function ProjectGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Mouse drag
  function onMouseDown(e: React.MouseEvent) {
    isDragging.current = false;
    startX.current = e.pageX;
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0;

    function onMove(ev: MouseEvent) {
      const diff = ev.pageX - startX.current;
      if (Math.abs(diff) > 4) isDragging.current = true;
      if (trackRef.current) trackRef.current.scrollLeft = scrollLeft.current - diff;
    }
    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  return (
    <div className="relative -mx-6">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[rgba(6,8,10,1)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[rgba(6,8,10,1)] to-transparent z-10 pointer-events-none" />

      {/* Scrollable track */}
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        className="flex gap-3 overflow-x-auto pb-1 px-6 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {PROJECTS.map((project, i) => (
          <GalleryCard key={project.slug} project={project} index={i} isDragging={isDragging} />
        ))}
      </div>
    </div>
  );
}

function GalleryCard({
  project,
  index,
  isDragging,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  isDragging: React.MutableRefObject<boolean>;
}) {
  const [hovered, setHovered] = useState(false);
  const colors = statusColors[project.status] ?? { bg: "rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.6)" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="relative flex-shrink-0 w-[280px] md:w-[320px] rounded-2xl overflow-hidden border border-white/[0.06] bg-[rgba(14,18,22,0.8)]"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ height: 220 }}
    >
      {/* Background image — always visible */}
      <div className="absolute inset-0">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 280px, 320px"
          className="object-cover object-top origin-top transition-all duration-700"
          style={{ 
            filter: hovered ? "brightness(0.35)" : "brightness(0.55)",
            transform: hovered ? "scale(1.05)" : "scale(1)"
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-400"
          style={{
            background: hovered
              ? "linear-gradient(to top, rgba(6,8,10,0.97) 0%, rgba(6,8,10,0.6) 60%, transparent 100%)"
              : "linear-gradient(to top, rgba(6,8,10,0.88) 0%, rgba(6,8,10,0.3) 60%, transparent 100%)",
          }}
        />
      </div>

      {/* Status pill — top left */}
      <div className="absolute top-3 left-3 z-20">
        <span
          className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide backdrop-blur-md border"
          style={{ 
            background: colors.bg, 
            color: colors.text,
            borderColor: project.status === "Development" 
              ? "rgba(245,158,11,0.35)" 
              : project.status === "Beta" 
                ? "rgba(255,200,50,0.35)" 
                : project.status === "Production"
                  ? "rgba(0,167,157,0.35)"
                  : "rgba(255,255,255,0.08)"
          }}
        >
          {project.status}
        </span>
      </div>

      {/* Action icons — top right */}
      <div className="absolute top-3 right-3 z-20 flex gap-1.5">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => { if (isDragging.current) e.preventDefault(); e.stopPropagation(); }}
            className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/50 hover:text-white/90 transition-colors"
          >
            <Github size={12} />
          </a>
        )}
        <Link
          href={`/projects/${project.slug}`}
          onClick={(e) => { if (isDragging.current) e.preventDefault(); }}
          className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/50 hover:text-[rgb(0,200,188)] transition-colors"
        >
          <ArrowUpRight size={12} />
        </Link>
      </div>

      {/* Default state — title + category at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4 z-20"
        animate={{ opacity: hovered ? 0 : 1, y: hovered ? 6 : 0 }}
        transition={{ duration: 0.22 }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-0.5">{project.category}</p>
        <h3 className="font-semibold text-white/95 text-base leading-tight">{project.title}</h3>
      </motion.div>

      {/* Hover reveal — full info */}
      <motion.div
        className="absolute inset-0 p-4 z-20 flex flex-col justify-end"
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
        transition={{ duration: 0.25 }}
      >
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-semibold text-white/95 text-sm leading-tight">{project.title}</h3>
          <span className="text-[10px] text-white/30">{project.year}</span>
        </div>
        <p className="text-xs text-white/50 leading-relaxed mb-3 line-clamp-3">{project.description}</p>
        {/* Tech pills */}
        <div className="flex flex-wrap gap-1">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 rounded text-[9px] font-medium text-white/35 bg-white/[0.06] border border-white/[0.06]"
            >
              {t}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="px-1.5 py-0.5 rounded text-[9px] text-white/25">+{project.tech.length - 4}</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
