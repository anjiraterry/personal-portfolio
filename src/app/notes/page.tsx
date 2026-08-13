import type { Metadata } from "next";
import NotesClient from "./NotesClient";

export const metadata: Metadata = {
  title: "Notes",
  description: "Technical insights on AI systems, SaaS architecture, and engineering.",
};

export default function NotesPage() {
  return <NotesClient />;
}
