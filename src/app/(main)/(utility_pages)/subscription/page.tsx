import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import SubscriptionPage from "@/features/subscription/components/SubscriptionPage";

export const metadata: Metadata = {
  title: "Subscription",
  description:
    "Subscribe to Lex Witness and get access to the latest legal news, corporate affairs, business insights and industry analysis.",

  alternates: {
    canonical: `${siteConfig.url.replace(/\/$/, "")}/subscription`,
  },

  openGraph: {
    title: "Subscription | Lex Witness",
    description:
      "Subscribe to Lex Witness and get access to the latest legal news, corporate affairs, business insights and industry analysis.",
    url: `${siteConfig.url.replace(/\/$/, "")}/subscription`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.url.replace(/\/$/, "")}${siteConfig.defaultOgImage}`,
        width: 1200,
        height: 630,
        alt: "Lex Witness Subscription",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Subscription | Lex Witness",
    description:
      "Subscribe to Lex Witness and get access to the latest legal news, corporate affairs, business insights and industry analysis.",
    images: [
      `${siteConfig.url.replace(/\/$/, "")}${siteConfig.defaultOgImage}`,
    ],
  },
};

export default function Subscription() {
  return <SubscriptionPage />;
}
