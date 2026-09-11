import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import TermsPage from "@/features/static-pages/terms";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the Lex Witness Terms & Conditions governing the use of our website, content, subscriptions and services.",

  alternates: {
    canonical: `${siteConfig.url.replace(/\/$/, "")}/terms`,
  },

  openGraph: {
    title: "Terms & Conditions | Lex Witness",
    description:
      "Read the Lex Witness Terms & Conditions governing the use of our website, content, subscriptions and services.",
    url: `${siteConfig.url.replace(/\/$/, "")}/terms`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.url.replace(/\/$/, "")}${siteConfig.defaultOgImage}`,
        width: 1200,
        height: 630,
        alt: "Lex Witness Terms & Conditions",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | Lex Witness",
    description:
      "Read the Lex Witness Terms & Conditions governing the use of our website, content, subscriptions and services.",
    images: [
      `${siteConfig.url.replace(/\/$/, "")}${siteConfig.defaultOgImage}`,
    ],
  },
};

export default function Terms() {
  return <TermsPage />;
}
