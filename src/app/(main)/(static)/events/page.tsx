import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import EventsPage from "./EventPages";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Discover industry-leading legal summits and events connecting legal professionals, policymakers and business leaders.",

  alternates: {
    canonical: `${siteConfig.url.replace(/\/$/, "")}/events`,
  },

  openGraph: {
    title: "Events | Lex Witness",
    description:
      "Discover industry-leading legal summits and events connecting legal professionals, policymakers and business leaders.",
    url: `${siteConfig.url.replace(/\/$/, "")}/events`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.url.replace(/\/$/, "")}${siteConfig.defaultOgImage}`,
        width: 1200,
        height: 630,
        alt: "Lex Witness Events",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Events | Lex Witness",
    description:
      "Discover industry-leading legal summits and events connecting legal professionals, policymakers and business leaders.",
    images: [
      `${siteConfig.url.replace(/\/$/, "")}${siteConfig.defaultOgImage}`,
    ],
  },
};

export default function Page() {
  return <EventsPage />;
}
