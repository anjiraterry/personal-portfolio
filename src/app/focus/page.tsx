import type { Metadata } from "next";
import FocusClient from "./FocusClient";

export const metadata: Metadata = {
  title: "Focus Areas",
  description: "Current focus areas and active projects I'm dedicating time to.",
};

export default function FocusPage() {
  return <FocusClient />;
}
