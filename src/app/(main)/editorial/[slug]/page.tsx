import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { getEditorial } from "@/services/editorial.service";
import EditorialPage from "@/features/editorial/components/EditorialPage";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const data = await getEditorial();

    const title = data.name ? `${data.name} | Editorial` : "Editorial";

    const description =
      data.description ||
      `Read the latest editorial insights from ${siteConfig.name}.`;

    const baseUrl = siteConfig.url.replace(/\/$/, "");
    const canonicalUrl = `${baseUrl}/editorial/${slug}`;

    const imageUrl = data.image
      ? `${siteConfig.editorialImageBaseUrl}${data.image}`
      : `${baseUrl}${siteConfig.defaultOgImage}`;

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
            alt: data.name || "Editorial",
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
      title: "Editorial",
      description: `Editorial insights from ${siteConfig.name}.`,
    };
  }
}

export default function Page() {
  return <EditorialPage />;
}
