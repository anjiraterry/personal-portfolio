"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Clock, ArrowUpRight } from "lucide-react";
import { BentoCard } from "@/components/bento/BentoCard";
import { NOTES } from "@/data/portfolio";
import { formatDate } from "@/lib/utils";

const CATEGORIES = ["All", "AI Infrastructure", "AI Agents", "RAG Systems", "Engineering", "Stack", "Prompt Engineering"];

export default function NotesPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = NOTES.filter((n) => {
    const matchesQuery = query === "" ||
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(query.toLowerCase());
    const matchesCat = activeCategory === "All" || n.category === activeCategory;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <span className="inline-block mb-4 text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: "rgb(0,167,157)" }}>
            Writing
          </span>
          <h1 className="font-display font-bold text-white/95 mb-3"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "-0.03em" }}>
            Notes
          </h1>
          <p className="text-white/40 text-base">
            Technical insights on AI systems, SaaS architecture, and engineering.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative mb-5"
        >
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            placeholder="Search notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white/70 placeholder-white/20 outline-none transition-all"
            style={{
              background: "rgba(14,18,22,0.8)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          />
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: activeCategory === cat ? "rgba(0,167,157,0.15)" : "rgba(255,255,255,0.04)",
                border: activeCategory === cat ? "1px solid rgba(0,167,157,0.3)" : "1px solid rgba(255,255,255,0.06)",
                color: activeCategory === cat ? "rgb(0,200,188)" : "rgba(255,255,255,0.40)",
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Notes list */}
        <div className="space-y-4">
          {filtered.map((note, i) => (
            <motion.div
              key={note.slug}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link href={`/notes/${note.slug}`} className="group block">
                <BentoCard>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                          style={{ background: "rgba(0,167,157,0.1)", color: "rgb(0,200,188)" }}>
                          {note.category}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-white/25">
                          <Clock size={9} />
                          {note.readTime}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-white/85 text-base mb-2 group-hover:text-white transition-colors leading-snug">
                        {note.title}
                      </h3>
                      <p className="text-white/40 text-sm leading-relaxed truncate-2">{note.excerpt}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {note.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium text-white/30 bg-white/[0.04] border border-white/[0.05]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <ArrowUpRight size={15} className="text-white/20 group-hover:text-[rgb(0,167,157)] transition-colors" />
                      <span className="text-[11px] text-white/25 whitespace-nowrap">{formatDate(note.date)}</span>
                    </div>
                  </div>
                </BentoCard>
              </Link>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-20 text-white/25">
              <p>No notes found for "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}