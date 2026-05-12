import type { Metadata } from "next";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechBadge } from "@/components/ui/TechBadge";
import { BentoCard } from "@/components/bento/BentoCard";
import { PERSONAL, EXPERIENCE, TECH_STACK, EXPERTISE } from "@/data/portfolio";
import { AboutClient } from "./AboutClient";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Terry Agbo — AI Systems Engineer, SaaS builder, and AI product architect.",
};

export default function AboutPage() {
  return <AboutClient />;
}