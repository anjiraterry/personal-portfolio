"use client";

import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ResumePDF } from "@/components/pdf/ResumePDF";
import { GlowButton } from "@/components/ui/GlowButton";
import { Download, Loader2 } from "lucide-react";
import { PERSONAL } from "@/data/portfolio";
import { cn } from "@/lib/utils";

interface ResumeDownloadButtonProps {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
  iconOnly?: boolean;
  minimal?: boolean;
}

export function ResumeDownloadButton({
  variant = "primary",
  size = "md",
  className,
  showIcon = true,
  iconOnly = false,
  minimal = false,
}: ResumeDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    if (minimal) return <Download size={18} className="animate-pulse opacity-20" />;
    return (
      <GlowButton variant={variant} size={size} className={className} disabled>
        {showIcon && <Download size={18} />}
        {!iconOnly && <span className="ml-2">Preparing...</span>}
      </GlowButton>
    );
  }

  const content = ({ loading }: { loading: boolean }) => {
    if (minimal) {
      return (
        <button disabled={loading} className={cn("text-white/30 hover:text-white transition-colors", className)} title="Download Resume">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
        </button>
      );
    }

    return (
      <GlowButton variant={variant} size={size} disabled={loading} title="Download Resume" className={className}>
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Download size={18} />
        )}
        {!iconOnly && !loading && <span className="ml-2">Download</span>}
        {!iconOnly && loading && <span className="ml-2">Preparing...</span>}
      </GlowButton>
    );
  };

  return (
    <PDFDownloadLink
      document={<ResumePDF />}
      fileName={`${PERSONAL.name.replace(/\s+/g, '_')}_Resume.pdf`}
      style={{ textDecoration: 'none' }}
    >
      {/* @ts-ignore */}
      {content}
    </PDFDownloadLink>
  );
}
