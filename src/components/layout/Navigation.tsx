"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { PERSONAL } from "@/data/portfolio";
import { useAuth } from "@/components/admin/AdminProvider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/focus", label: "Focus" },
  { href: "/notes", label: "Notes" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-5 left-0 right-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Pill container */}
          <div
            className={cn(
              "flex items-center justify-between gap-1 px-4 py-2 rounded-2xl transition-all duration-500",
              scrolled
                ? "bg-[rgba(10,13,16,0.92)] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
                : "bg-[rgba(10,13,16,0.75)] backdrop-blur-xl border border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
            )}
          >
            <div className="flex items-center gap-4">
              {/* Logo mark */}
              <Link href="/" className="flex items-center gap-2 mr-2 pl-2 group">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: "linear-gradient(135deg, rgb(0,87,79), rgb(0,167,157))" }}
                >
                  {PERSONAL.initials}
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {/* Desktop nav links */}
              <nav className="hidden md:flex items-center gap-0.5">
                {NAV_LINKS.map((link) => {
                  const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "relative px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200",
                        active ? "text-white" : "text-white/45 hover:text-white/75"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: "rgba(0,167,157,0.12)",
                            border: "1px solid rgba(0,167,157,0.2)",
                          }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* CTA + Admin */}
              <div className="hidden md:flex items-center gap-2">
                {isAuthenticated && (
                  <button
                    onClick={logout}
                    title="Logout"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-full text-[rgb(0,167,157)] bg-[rgb(0,167,157,0.08)] border border-[rgb(0,167,157,0.2)] hover:bg-[rgb(0,167,157,0.15)] transition-all"
                  >
                  
                    <span className="text-[11px] font-bold uppercase tracking-wider">Admin</span>
                    <LogOut size={12}  />
                  </button>
                )}
                <Link
                  href="/contact"
                  className="px-4 py-1.5 text-[13px] font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,167,157,0.25)] hover:-translate-y-px"
                  style={{ background: "linear-gradient(135deg, rgb(0,87,79), rgb(0,167,157))" }}
                >
                  Let&apos;s Talk
                </Link>
              </div>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden ml-1 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[72px] left-1/2 -translate-x-1/2 z-40 w-56"
          >
            <div className="rounded-2xl p-2 bg-[rgba(10,13,16,0.95)] backdrop-blur-2xl border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
              {NAV_LINKS.map((link) => {
                const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                      active
                        ? "text-white bg-white/[0.06]"
                        : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-2 pt-2 border-t border-white/[0.06]">
                <Link
                  href="/contact"
                  className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-center"
                  style={{ background: "linear-gradient(135deg, rgb(0,87,79), rgb(0,167,157))" }}
                >
                  Let&apos;s Talk
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}