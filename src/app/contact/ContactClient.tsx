"use client";

import { motion } from "framer-motion";
import { ContactForm } from "@/components/ui/ContactForm";
import { PERSONAL } from "@/data/portfolio";
import { Mail, Github, Linkedin, Twitter, Calendar, MapPin, MessageSquare } from "lucide-react";

export function ContactClient() {
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare size={16} style={{ color: "rgb(0,167,157)" }} />
            <span className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: "rgb(0,167,157)" }}>
              Get in Touch
            </span>
          </div>
          <h1 className="font-display font-bold text-white/95 mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
            Let's build something intelligent.
          </h1>
          <p className="text-white/45 text-base leading-relaxed max-w-xl">
            Whether you have a specific project in mind or just want to chat about the future of AI, I'm always open to interesting conversations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-card p-8 relative overflow-hidden">
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
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
