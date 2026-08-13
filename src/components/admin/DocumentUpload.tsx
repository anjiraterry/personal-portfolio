"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, FileText, FileUp, ExternalLink } from "lucide-react";
import { uploadImage } from "@/app/actions/portfolio";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DocumentUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  accept?: string;
}

export const DocumentUpload = ({ value, onChange, label, className, accept = ".pdf,.ppt,.pptx,.key" }: DocumentUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      toast.error("File size must be less than 25MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "portfolio");

    try {
      const res = await uploadImage(formData);
      if (res && !res.success) {
        throw new Error(res.error || "Failed to upload document");
      }
      onChange(res.publicUrl!);
      toast.success("Document uploaded successfully");
    } catch (err: any) {
      console.error(err);
      toast.error("Upload failed", {
        description: err.message || "Failed to upload document to Supabase Storage"
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</label>}
      
      <div className="relative group">
        {value ? (
          <div className="relative p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between gap-4 overflow-hidden">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-[rgb(0,167,157,0.1)] text-[rgb(0,167,157)] shrink-0">
                <FileText size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">Document Uploaded</p>
                <a 
                  href={value} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-[rgb(0,167,157)] hover:underline flex items-center gap-1 mt-0.5"
                >
                  View File <ExternalLink size={10} />
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all"
                title="Change File"
              >
                <Upload size={14} />
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                title="Remove File"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : showUrlInput ? (
          <div className="w-full p-4 rounded-xl border-2 border-dashed border-[rgb(0,167,157,0.3)] bg-[rgb(0,167,157,0.02)] h-full min-h-[140px] flex flex-col justify-center gap-3">
            <input
              type="text"
              placeholder="Paste Google Drive / Notion / PDF link..."
              className="w-full bg-black/20 border border-[rgb(0,167,157,0.2)] rounded-lg p-2.5 text-xs text-white focus:border-[rgb(0,167,157,0.5)] outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (e.currentTarget.value) {
                    onChange(e.currentTarget.value);
                    setShowUrlInput(false);
                  }
                }
              }}
            />
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] text-white/40">Press Enter to save</span>
              <button 
                type="button" 
                onClick={() => setShowUrlInput(false)}
                className="text-[10px] text-[rgb(0,167,157)] hover:underline font-bold uppercase tracking-wider"
              >
                Upload File Instead
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-full min-h-[140px] p-6 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[rgb(0,167,157,0.3)] transition-all flex flex-col items-center justify-center gap-3 group/btn relative"
          >
            {uploading ? (
              <Loader2 className="animate-spin text-[rgb(0,167,157)]" size={24} />
            ) : (
              <>
                <div className="p-3 rounded-full bg-white/[0.03] group-hover/btn:bg-[rgb(0,167,157,0.1)] transition-colors">
                  <FileUp className="text-white/20 group-hover/btn:text-[rgb(0,167,157)]" size={20} />
                </div>
                <span className="text-xs font-bold text-white/30 group-hover/btn:text-white/50 transition-colors uppercase tracking-widest">
                  Upload {label ? label : "Document"}
                </span>
                <div 
                  className="absolute bottom-3 text-[10px] font-bold text-[rgb(0,167,157)] uppercase tracking-wider opacity-0 group-hover/btn:opacity-100 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); setShowUrlInput(true); }}
                >
                  Or Paste Link
                </div>
              </>
            )}
          </button>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          accept={accept}
        />
      </div>
    </div>
  );
};
