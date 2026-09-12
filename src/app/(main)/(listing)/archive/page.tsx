import type { Metadata } from "next";
import { Suspense } from "react";

import { siteConfig } from "@/config/site";
import ArchiveClient from "../../../../features/archive/ArchiveClient";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "Explore the Lex Witness archive for legal news, corporate affairs, business insights, articles and past publications.",

  alternates: {
    canonical: `${siteConfig.url.replace(/\/$/, "")}/archive`,
  },

  openGraph: {
    title: "Archive | Lex Witness",
    description:
      "Explore the Lex Witness archive for legal news, corporate affairs, business insights, articles and past publications.",
    url: `${siteConfig.url.replace(/\/$/, "")}/archive`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.url.replace(/\/$/, "")}${siteConfig.defaultOgImage}`,
        width: 1200,
        height: 630,
        alt: "Lex Witness Archive",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Archive | Lex Witness",
    description:
      "Explore the Lex Witness archive for legal news, corporate affairs, business insights, articles and past publications.",
    images: [
      `${siteConfig.url.replace(/\/$/, "")}${siteConfig.defaultOgImage}`,
    ],
  },
};

export default function ArchivePage() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading archive...</div>}
    >
      <ArchiveClient />
    </Suspense>
  );
}
