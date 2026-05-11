import type { Metadata } from "next";
import { ContactCard } from "@/components/ui/ContactCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PERSONAL } from "@/data/portfolio";
import { Mail, Github, Linkedin, Twitter, Calendar, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for AI product engineering, consulting, or collaborations.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          label="Get in Touch"
          title="Let's build something intelligent."
          subtitle="Whether you have a specific project in mind or just want to chat about the future of AI, I'm always open to interesting conversations."
          align="center"
          className="mb-20"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[rgb(0,87,79)] to-[rgb(0,167,157)]" />
              
              <h2 className="font-display font-bold text-white/90 text-2xl mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white/[0.04] text-[rgb(0,167,157)]">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-1">Email</p>
                    <a href={`mailto:${PERSONAL.email}`} className="text-white/80 hover:text-[rgb(0,167,157)] transition-colors text-lg">
                      {PERSONAL.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white/[0.04] text-[rgb(0,167,157)]">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-1">Scheduling</p>
                    <a href={PERSONAL.calendly} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[rgb(0,167,157)] transition-colors text-lg">
                      Book a discovery call
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white/[0.04] text-[rgb(0,167,157)]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-1">Location</p>
                    <p className="text-white/80 text-lg">{PERSONAL.location}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/[0.05]">
                <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">Social Presence</p>
                <div className="flex gap-4">
                  {[
                    { icon: <Github size={20} />, href: PERSONAL.github },
                    { icon: <Linkedin size={20} />, href: PERSONAL.linkedin },
                    { icon: <Twitter size={20} />, href: PERSONAL.twitter },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-white/[0.04] text-white/40 hover:text-[rgb(0,167,157)] hover:bg-white/[0.08] transition-all"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card p-8 bg-gradient-to-br from-[rgba(0,167,157,0.05)] to-transparent border-[rgba(0,167,157,0.1)]">
              <h3 className="font-display font-bold text-white/90 text-lg mb-3">Availability</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                I am currently based in {PERSONAL.location.split(',')[0]} and open to remote roles worldwide or local opportunities in the EMEA/US regions.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <ContactCard />
          </div>
        </div>
      </div>
    </div>
  );
}
