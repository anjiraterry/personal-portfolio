import type { Metadata } from "next";
import ProjectsClient from "./ProjectsClient";

export const metadata: Metadata = {
  title: "Projects",
  description: "A collection of AI systems, infrastructure tools, and products I've built in production.",
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
