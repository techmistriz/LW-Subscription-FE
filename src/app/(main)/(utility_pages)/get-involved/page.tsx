import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import GetInvolvedPage from "@/features/GetInvolvedPage";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Discover ways to get involved with Lex Witness through partnerships, collaborations, contributions and opportunities in the legal and corporate affairs community.",

  alternates: {
    canonical: `${siteConfig.url.replace(/\/$/, "")}/get-involved`,
  },

  openGraph: {
    title: "Get Involved | Lex Witness",
    description:
      "Discover ways to get involved with Lex Witness through partnerships, collaborations, contributions and opportunities in the legal and corporate affairs community.",
    url: `${siteConfig.url.replace(/\/$/, "")}/get-involved`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.url.replace(/\/$/, "")}${siteConfig.defaultOgImage}`,
        width: 1200,
        height: 630,
        alt: "Get Involved with Lex Witness",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Get Involved | Lex Witness",
    description:
      "Discover ways to get involved with Lex Witness through partnerships, collaborations, contributions and opportunities in the legal and corporate affairs community.",
    images: [
      `${siteConfig.url.replace(/\/$/, "")}${siteConfig.defaultOgImage}`,
    ],
  },
};

export default function GetInvolved() {
  return <GetInvolvedPage />;
}
