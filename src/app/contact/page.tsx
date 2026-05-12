import type { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for AI product engineering, consulting, or collaborations.",
};

export default function ContactPage() {
  return <ContactClient />;
}
