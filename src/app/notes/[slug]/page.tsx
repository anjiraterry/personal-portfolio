import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2, Twitter, Linkedin } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { PERSONAL, NOTES } from "@/data/portfolio";
import { NOTES_CONTENT } from "@/data/notes_content";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { createServerSupabaseClient } from "@/supabase/server";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { NoteAdminActions } from "@/components/admin/NoteAdminActions";
import { PageTransition } from "@/components/ui/PageTransition";

interface NotePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerSupabaseClient();
  const { data: note } = await supabase.from('notes').select('title').eq('slug', slug).single();
  const staticNote = NOTES.find((n) => n.slug === slug);
  const title = note?.title || staticNote?.title;
  
  return {
    title: title ? `${title} | Terry Agbo` : "Note Not Found",
  };
}

function parseMarkdownToHtml(text: string) {
  if (!text) return "";
  
  // Parse markdown bold/italics globally first, even if there are <p> tags
  // because old notes might have <p> but still contain ** raw markdown
  let parsed = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  if (parsed.includes("<p>")) return parsed;
  
  return parsed
    .split(/\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => `<p>${line}</p>`)
    .join('\n');
}

export default async function NoteDetailPage({ params }: NotePageProps) {
  const { slug } = await params;
  const supabase = createServerSupabaseClient();
  
  // Fetch from DB
  const { data: dbNote } = await supabase.from('notes').select('*').eq('slug', slug).single();
  
  // Fallbacks
  const staticNote = NOTES.find((n) => n.slug === slug);
  const staticContent = NOTES_CONTENT[slug];

  const note = dbNote || staticNote;
  const contentToRender = dbNote?.content || staticContent;

  if (!note || (!dbNote?.content && !staticContent)) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <PageTransition className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <Link href="/notes" className="inline-flex items-center gap-2 text-white/30 hover:text-[rgb(0,167,157)] transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium uppercase tracking-widest">Back to Notes</span>
        </Link>

        {/* Article Header */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            {note.category && (
              <span className="px-3 py-1 rounded-full bg-[rgb(0,167,157,0.1)] text-[rgb(0,200,188)] text-[10px] font-bold uppercase tracking-widest border border-[rgb(0,167,157,0.2)]">
                {note.category}
              </span>
            )}
            <div className="flex items-center gap-2 text-white/20 text-[10px] font-bold uppercase tracking-widest">
              <Calendar size={12} />
              <span>{formatDate(note.date)}</span>
              <span className="mx-1">•</span>
              <Clock size={12} />
              <span>{note.read_time || note.readTime} read</span>
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
              <NoteAdminActions note={note} />
              <ShareButtons title={note.title} />
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {note.image && (
          <div className="mb-12 rounded-3xl overflow-hidden border border-white/10 relative aspect-[21/9] bg-white/[0.02]">
            <img src={note.image} alt={note.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Article Content */}
        <article 
          className="prose prose-invert prose-teal max-w-none mb-24"
          dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(contentToRender || "") }}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-20 border-t border-white/[0.05] pt-12">
          {(note.tags || []).map((tag: string) => (
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
