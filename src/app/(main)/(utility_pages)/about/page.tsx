import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import AboutUsPage from "@/features/static-pages/about";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about Lex Witness, India's leading magazine covering legal, corporate affairs and business insights.",

  alternates: {
    canonical: `${siteConfig.url.replace(/\/$/, "")}/about`,
  },

  openGraph: {
    title: "About Us | Lex Witness",
    description:
      "Learn more about Lex Witness, India's leading magazine covering legal, corporate affairs and business insights.",
    url: `${siteConfig.url.replace(/\/$/, "")}/about`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.url.replace(/\/$/, "")}${siteConfig.defaultOgImage}`,
        width: 1200,
        height: 630,
        alt: "About Lex Witness",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "About Us | Lex Witness",
    description:
      "Learn more about Lex Witness, India's leading magazine covering legal, corporate affairs and business insights.",
    images: [
      `${siteConfig.url.replace(/\/$/, "")}${siteConfig.defaultOgImage}`,
    ],
  },
};

export default function About() {
  return <AboutUsPage />;
}
