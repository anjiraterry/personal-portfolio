"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { PROJECTS } from "@/data/portfolio";

const CATEGORIES = ["All", "AI Infrastructure", "AI Agents", "Infrastructure", "AI Product", "SaaS Product"];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <SectionHeading
            label="Selected Work"
            title="Projects & Case Studies"
            subtitle="A collection of AI systems, infrastructure tools, and products I've built in production."
          />
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: activeCategory === cat ? "linear-gradient(135deg, rgb(0,87,79), rgb(0,167,157))" : "rgba(255,255,255,0.04)",
                border: activeCategory === cat ? "none" : "1px solid rgba(255,255,255,0.07)",
                color: activeCategory === cat ? "white" : "rgba(255,255,255,0.45)",
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <p className="text-lg">No projects in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}