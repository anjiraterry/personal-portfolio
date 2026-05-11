import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2, Twitter, Linkedin } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { PERSONAL, NOTES } from "@/data/portfolio";
import { NOTES_CONTENT } from "@/data/notes_content";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface NotePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = NOTES.find((n) => n.slug === slug);
  return {
    title: note ? `${note.title} | Kael Soren` : "Note Not Found",
  };
}

export default async function NoteDetailPage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = NOTES.find((n) => n.slug === slug);
  const content = NOTES_CONTENT[slug];

  if (!note || !content) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <Link href="/notes" className="inline-flex items-center gap-2 text-white/30 hover:text-[rgb(0,167,157)] transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium uppercase tracking-widest">Back to Notes</span>
        </Link>

        {/* Article Header */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-[rgb(0,167,157,0.1)] text-[rgb(0,200,188)] text-[10px] font-bold uppercase tracking-widest border border-[rgb(0,167,157,0.2)]">
              {note.category}
            </span>
            <div className="flex items-center gap-2 text-white/20 text-[10px] font-bold uppercase tracking-widest">
              <Calendar size={12} />
              <span>{formatDate(note.date)}</span>
              <span className="mx-1">•</span>
              <Clock size={12} />
              <span>{note.readTime} read</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-8 leading-[1.1]">
            {note.title}
          </h1>

          <div className="flex items-center justify-between border-y border-white/[0.05] py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[rgb(0,87,79)] flex items-center justify-center font-display font-bold text-white border border-[rgb(0,167,157,0.3)]">
                {PERSONAL.initials}
              </div>
              <div>
                <p className="text-white/80 font-bold text-sm">{PERSONAL.name}</p>
                <p className="text-white/30 text-xs">{PERSONAL.title}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="p-2.5 rounded-xl bg-white/[0.04] text-white/40 hover:text-[rgb(0,167,157)] transition-colors">
                <Share2 size={18} />
              </button>
              <button className="p-2.5 rounded-xl bg-white/[0.04] text-white/40 hover:text-[rgb(0,167,157)] transition-colors">
                <Twitter size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article 
          className="prose prose-invert prose-teal max-w-none mb-24"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-20 border-t border-white/[0.05] pt-12">
          {note.tags.map(tag => (
            <span key={tag} className="px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/30 text-xs font-medium">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer CTAs */}
        <div className="p-12 rounded-3xl bg-[rgb(12,15,18)] border border-white/[0.06] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[rgb(0,167,157)] opacity-[0.03] blur-[100px] pointer-events-none" />
          
          <h2 className="font-display font-bold text-white text-2xl mb-4 text-center">Enjoyed this note?</h2>
          <p className="text-white/40 text-center mb-8 max-w-lg mx-auto">
            I write about AI engineering, systems design, and the philosophy of building intelligent products. Subscribe to get these in your inbox.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/contact">
              <GlowButton variant="primary">Work with me</GlowButton>
            </Link>
            <a href={PERSONAL.twitter} target="_blank" rel="noopener noreferrer">
              <GlowButton variant="ghost">Follow on Twitter</GlowButton>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
