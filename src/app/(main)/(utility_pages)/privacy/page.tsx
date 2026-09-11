import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import PrivacyPage from "@/features/static-pages/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Lex Witness Privacy Policy to understand how we collect, use and protect your information.",

  alternates: {
    canonical: `${siteConfig.url.replace(/\/$/, "")}/privacy`,
  },

  openGraph: {
    title: "Privacy Policy | Lex Witness",
    description:
      "Read the Lex Witness Privacy Policy to understand how we collect, use and protect your information.",
    url: `${siteConfig.url.replace(/\/$/, "")}/privacy`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.url.replace(/\/$/, "")}${siteConfig.defaultOgImage}`,
        width: 1200,
        height: 630,
        alt: "Lex Witness Privacy Policy",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Lex Witness",
    description:
      "Read the Lex Witness Privacy Policy to understand how we collect, use and protect your information.",
    images: [
      `${siteConfig.url.replace(/\/$/, "")}${siteConfig.defaultOgImage}`,
    ],
  },
};

export default function Privacy() {
  return <PrivacyPage />;
}
