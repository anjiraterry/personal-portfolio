import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Terry Agbo — AI Systems Engineer",
    template: "%s | Terry Agbo",
  },
  description:
    "AI Systems Engineer building production-grade AI-native products, scalable systems, and modern web experiences. Specializing in LLMs, RAG pipelines, and multi-agent architectures.",
  keywords: [
    "AI Engineer",
    "AI Systems",
    "LLM",
    "RAG",
    "Multi-Agent",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: "Terry Agbo" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: "Terry Agbo — AI Systems Engineer",
    description:
      "Building production-grade AI-native products, scalable systems, and modern web experiences.",
    siteName: "Terry Agbo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terry Agbo — AI Systems Engineer",
    description: "Building AI-native products, scalable systems, and modern web experiences.",
    creator: "@anjiraterry",
  },
};

import { AdminProvider } from "@/components/admin/AdminProvider";
import { PortfolioProvider } from "@/components/providers/PortfolioProvider";
import { AdminControls } from "@/components/admin/AdminControls";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", inter.variable, syne.variable)}>
      <body className="font-sans bg-[rgb(6,8,10)] text-white antialiased">
        <AdminProvider>
          <PortfolioProvider>
            <Toaster 
              theme="dark" 
              position="bottom-right" 
              toastOptions={{
                style: {
                  background: 'rgba(14, 18, 22, 0.95)',
                  border: '1px solid rgba(0, 167, 157, 0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                },
                className: 'font-sans',
              }}
            />
            <AdminControls />
            {/* Ambient background orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
              <div
                className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-[0.04]"
                style={{ background: "radial-gradient(circle, rgb(0,167,157), transparent 70%)" }}
              />
              <div
                className="absolute top-1/2 -right-64 w-[800px] h-[800px] rounded-full opacity-[0.03]"
                style={{ background: "radial-gradient(circle, rgb(0,87,79), transparent 70%)" }}
              />
              <div
                className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.03]"
                style={{ background: "radial-gradient(circle, rgb(0,167,157), transparent 70%)" }}
              />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
              <Navigation />
              <main className="flex-1">{children}</main>
            </div>
          </PortfolioProvider>
        </AdminProvider>
      </body>
    </html>
  );
}