import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Target, Calendar, Download, MonitorPlay, FlaskConical, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/supabase/server";
import { EditFocusButton } from "./EditFocusButton";
import { PageTransition } from "@/components/ui/PageTransition";

interface FocusPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: FocusPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerSupabaseClient();
  const { data: area } = await supabase.from('focus_areas').select('title, description').eq('slug', slug).single();
  
  return {
    title: area?.title ? `${area.title} | Research` : "Research Not Found",
    description: area?.description || "Research and development focus area.",
  };
}

export default async function FocusDetailPage({ params }: FocusPageProps) {
  const { slug } = await params;
  const supabase = createServerSupabaseClient();
  
  // Fetch from supabase
  const { data: area } = await supabase.from('focus_areas').select('*').eq('slug', slug).single();

  if (!area) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      {/* Background gradients for academic feel */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[rgb(0,167,157)] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.05]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[rgb(0,167,157)] rounded-full mix-blend-screen filter blur-[120px] opacity-[0.03]" />
      </div>

      <PageTransition className="max-w-7xl mx-auto px-6">
        
        {/* Navigation & Admin */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/focus"
            className="inline-flex items-center gap-2 text-white/30 hover:text-[rgb(0,167,157)] transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium uppercase tracking-widest">Back to R&D Lab</span>
          </Link>
          
          <EditFocusButton area={area} />
        </div>

        {/* Paper Header */}
        <header className="mb-16 border-b border-white/10 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <FlaskConical size={16} className="text-[rgb(0,167,157)]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[rgb(0,167,157)]">
              Research Paper
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-white/60">
              {area.status || "Active Research"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-[1.15] tracking-tight">
            {area.title}
          </h1>

          <p className="text-xl text-white/60 leading-relaxed mb-8 max-w-3xl">
            {area.description}
          </p>

          {/* Action Bar for PDF & Slides */}
          {(area.pdf_url || area.slides_url) && (
            <div className="flex flex-wrap gap-4 pt-4">
              {area.pdf_url && (
                <a 
                  href={area.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white hover:text-white transition-all shadow-[0_0_20px_rgba(0,167,157,0.15)] hover:shadow-[0_0_25px_rgba(0,167,157,0.3)]"
                  style={{ background: "linear-gradient(135deg, rgb(0,87,79), rgb(0,167,157))" }}
                >
                  <Download size={16} /> Download Paper (PDF)
                </a>
              )}
              
              {area.slides_url && (
                <a 
                  href={area.slides_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-[rgb(0,167,157)] bg-[rgb(0,167,157,0.1)] border border-[rgb(0,167,157,0.2)] hover:bg-[rgb(0,167,157,0.15)] transition-all"
                >
                  <MonitorPlay size={16} /> View Slide Deck <ExternalLink size={14} className="ml-1" />
                </a>
              )}
            </div>
          )}
        </header>

        {/* Rich Text Content */}
        {area.content ? (
          <article className="prose prose-invert prose-lg max-w-none prose-teal prose-headings:font-display prose-headings:tracking-tight prose-a:text-[rgb(0,167,157)] hover:prose-a:text-[rgb(0,200,188)]">
            <div dangerouslySetInnerHTML={{ __html: area.content }} />
          </article>
        ) : (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
            <Target className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-display font-semibold text-white/60 mb-2">Research in Progress</h3>
            <p className="text-white/40">The full paper for this focus area has not been published yet.</p>
          </div>
        )}
      </PageTransition>
    </div>
  );
}
