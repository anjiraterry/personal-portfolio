import { Loader2 } from "lucide-react";

export default function SocialAdminLoading() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-[rgb(0,167,157)]" size={32} />
        <p className="text-white/50 text-sm uppercase tracking-widest font-bold">Loading Social Manager...</p>
      </div>
    </div>
  );
}
