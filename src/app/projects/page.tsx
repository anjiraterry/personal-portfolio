"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Plus } from "lucide-react";
import { usePortfolio } from "@/components/providers/PortfolioProvider";
import { EditableSection } from "@/components/admin/EditableSection";
import { useAuth } from "@/components/admin/AdminProvider";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { deleteProject } from "@/app/actions/portfolio";
import { toast } from "sonner";

const CATEGORIES = ["All", "AI Infrastructure", "AI Agents", "Infrastructure", "AI Product", "SaaS Product"];

export default function ProjectsPage() {
  const { data, refreshData } = usePortfolio();
  const { isAuthenticated, confirmDelete } = useAuth();
  const { projects: PROJECTS } = data;
  const [activeCategory, setActiveCategory] = useState("All");

  const openAdmin = (view: string, item?: any) => {
    if (typeof window !== "undefined" && (window as any).openAdmin) {
      (window as any).openAdmin(view, item);
    }
  };

  const handleDelete = (project: any) => {
    confirmDelete({
      title: "Delete Project",
      label: project.title,
      onConfirm: async () => {
        try {
          await deleteProject(project.id);
          await refreshData();
          toast.success("Project deleted successfully");
        } catch (err) {
          toast.error("Failed to delete project");
        }
      }
    });
  };

  const filtered = activeCategory === "All"
    ? PROJECTS
    : PROJECTS.filter((p: any) => p.category === activeCategory);

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Briefcase size={16} style={{ color: "rgb(0,167,157)" }} />
                <span className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: "rgb(0,167,157)" }}>
                  Selected Work
                </span>
              </div>
              <h1 className="font-display font-bold text-white/95 mb-4"
                style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
                Projects & Case Studies
              </h1>
            </div>
            {isAuthenticated && (
              <button 
                onClick={() => openAdmin("project")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgb(0,167,157,0.1)] border border-[rgb(0,167,157,0.2)] text-[rgb(0,167,157)] text-xs font-bold uppercase tracking-widest hover:bg-[rgb(0,167,157,0.2)] transition-all"
              >
                <Plus size={14} /> Add Project
              </button>
            )}
          </div>
          <p className="text-white/45 text-base leading-relaxed max-w-xl">
            A collection of AI systems, infrastructure tools, and products I&apos;ve built in production.
          </p>
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

        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((project: any, i: number) => (
            <EditableSection 
              key={project.id || project.slug} 
              onEdit={() => openAdmin("project", project)} 
              onDelete={() => handleDelete(project)}
              label="Project"
            >
              <ProjectCard project={project} index={i} />
            </EditableSection>
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
