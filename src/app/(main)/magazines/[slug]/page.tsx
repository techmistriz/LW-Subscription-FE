import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { getSingleMagazine } from "@/services/magazine.service";
import MagazineDetailPage from "@/features/magazines/components/MagazineDetailPage";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const magazine = await getSingleMagazine(slug);

    const title = magazine.title;

    const description =
      magazine.description ||
      magazine.short_description ||
      `Read ${magazine.title} on ${siteConfig.name}.`;

    const imageUrl = magazine.image
      ? `${siteConfig.magazinesImageBaseUrl}${magazine.image}`
      : `${siteConfig.url}${siteConfig.defaultOgImage}`;

    const baseUrl = siteConfig.url.replace(/\/$/, "");
    const canonicalUrl = `${baseUrl}/magazines/${slug}`;

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
            alt: title,
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
  } catch {
    return {
      title: `Magazine | ${siteConfig.name}`,
      description: `Explore magazines from ${siteConfig.name}.`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;

  return <MagazineDetailPage params={resolvedParams} />;
}
