"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon, CameraIcon } from "lucide-react";
import { uploadImage } from "@/app/actions/portfolio";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export const ImageUpload = ({ value, onChange, label, className }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "portfolio");

    try {
      const { publicUrl } = await uploadImage(formData);
      onChange(publicUrl);
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      console.error(err);
      toast.error("Upload failed", {
        description: err.message || "Failed to upload image to Supabase Storage"
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
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-white/[0.02]">
            <img src={value} alt="Upload preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
                title="Change Image"
              >
                <Upload size={16} />
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-2 rounded-lg bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all"
                title="Remove Image"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full aspect-video rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[rgb(0,167,157,0.3)] transition-all flex flex-col items-center justify-center gap-3 group/btn"
          >
            {uploading ? (
              <Loader2 className="animate-spin text-[rgb(0,167,157)]" size={24} />
            ) : (
              <>
                <div className="p-3 rounded-full bg-white/[0.03] group-hover/btn:bg-[rgb(0,167,157,0.1)] transition-colors">
                  <CameraIcon className="text-white/20 group-hover/btn:text-[rgb(0,167,157)]" size={20} />
                </div>
                <span className="text-xs font-bold text-white/30 group-hover/btn:text-white/50 transition-colors uppercase tracking-widest">
                  Upload Project Cover
                </span>
              </>
            )}
          </button>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          accept="image/*"
        />
      </div>
    </div>
  );
};
