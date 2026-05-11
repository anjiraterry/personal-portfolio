import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { PERSONAL } from "@/data/portfolio";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <Link href="/" className="font-display font-bold text-white/80 hover:text-white transition-colors">
              {PERSONAL.name}
            </Link>
            <p className="text-white/30 text-sm mt-1">{PERSONAL.title}</p>
          </div>

          <div className="flex items-center gap-4">
            {[
              { href: PERSONAL.github, icon: Github, label: "GitHub" },
              { href: PERSONAL.linkedin, icon: Linkedin, label: "LinkedIn" },
              { href: PERSONAL.twitter, icon: Twitter, label: "Twitter" },
              { href: `mailto:${PERSONAL.email}`, icon: Mail, label: "Email" },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-all"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} {PERSONAL.name}. Built with Next.js.
          </p>
        </div>
      </div>
    </footer>
  );
}