"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PROJECTS } from "@/data/portfolio";
import { ProjectCard } from "@/components/ui/ProjectCard";

export function ProjectSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 420;
    scrollRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Scroll buttons */}
      <div className="absolute -top-12 right-0 flex gap-2 z-10">
        <button
          onClick={() => scroll("left")}
          className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.07] text-white/50 hover:text-white/90 hover:bg-white/[0.08] transition-all"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.07] text-white/50 hover:text-white/90 hover:bg-white/[0.08] transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[rgba(6,8,10,0.8)] to-transparent z-10 pointer-events-none rounded-l-xl" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[rgba(6,8,10,0.9)] to-transparent z-10 pointer-events-none" />

      {/* Slider track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {PROJECTS.map((project, i) => (
          <div key={project.slug} className="snap-start flex-shrink-0">
            <ProjectCard project={project} index={i} variant="slider" />
          </div>
        ))}
      </div>
    </div>
  );
}