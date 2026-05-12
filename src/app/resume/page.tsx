import type { Metadata } from "next";
import { ResumeClient } from "./ResumeClient";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Professional experience, education, and technical skills of Terry Agbo.",
};

export default function ResumePage() {
  return <ResumeClient />;
}
