import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import TagPage from "@/features/tag/TagPage";

type Props = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, slug } = await params;

  const tagName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const title = tagName;
  const description = `Explore the latest articles, news and insights about ${tagName} from ${siteConfig.name}.`;

  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const canonicalUrl = `${baseUrl}/tag/${id}/${slug}`;
  const imageUrl = `${baseUrl}${siteConfig.defaultOgImage}`;

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${tagName} | ${siteConfig.name}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function Page() {
  return <TagPage />;
}
