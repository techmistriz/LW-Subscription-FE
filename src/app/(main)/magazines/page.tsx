import type { Metadata } from "next";
import { Suspense } from "react";

import { siteConfig } from "@/config/site";
import MagazinesClient from "@/features/magazines/components/MagazinesClient";

export const metadata: Metadata = {
  title: "Magazines",
  description:
    "Explore the latest legal, corporate affairs and business magazines from Lex Witness.",

  alternates: {
    canonical: `${siteConfig.url.replace(/\/$/, "")}/magazines`,
  },

  openGraph: {
    title: "Magazines | Lex Witness",
    description:
      "Explore the latest legal, corporate affairs and business magazines from Lex Witness.",
    url: `${siteConfig.url.replace(/\/$/, "")}/magazines`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.url.replace(/\/$/, "")}${siteConfig.defaultOgImage}`,
        width: 1200,
        height: 630,
        alt: "Lex Witness Magazines",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Magazines | Lex Witness",
    description:
      "Explore the latest legal, corporate affairs and business magazines from Lex Witness.",
    images: [
      `${siteConfig.url.replace(/\/$/, "")}${siteConfig.defaultOgImage}`,
    ],
  },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MagazinesClient />
    </Suspense>
  );
}
