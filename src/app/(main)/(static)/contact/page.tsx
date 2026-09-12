import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import ContactPage from "./ContactPage";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Lex Witness for enquiries, feedback, partnerships and information about our legal and corporate affairs publication.",

  alternates: {
    canonical: `${siteConfig.url.replace(/\/$/, "")}/contact`,
  },

  openGraph: {
    title: "Contact Us | Lex Witness",
    description:
      "Get in touch with Lex Witness for enquiries, feedback, partnerships and information about our legal and corporate affairs publication.",
    url: `${siteConfig.url.replace(/\/$/, "")}/contact`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.url.replace(/\/$/, "")}${siteConfig.defaultOgImage}`,
        width: 1200,
        height: 630,
        alt: "Contact Lex Witness",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Lex Witness",
    description:
      "Get in touch with Lex Witness for enquiries, feedback, partnerships and information about our legal and corporate affairs publication.",
    images: [
      `${siteConfig.url.replace(/\/$/, "")}${siteConfig.defaultOgImage}`,
    ],
  },
};

export default function Contact() {
  return <ContactPage />;
}
