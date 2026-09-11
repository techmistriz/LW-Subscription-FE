import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { getCategoryBySlug } from "@/services/categories.service";
import CategoryPage from "@/features/category/CategoryPage";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;

  const categoryData = await getCategoryBySlug(category);

  if (!categoryData) {
    return {
      title: `Category Not Found | ${siteConfig.name}`,
      description: "The requested category could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = categoryData.name;
  const description = `Explore the latest ${categoryData.name} news, articles, insights and updates from ${siteConfig.name}.`;

  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const canonicalUrl = `${baseUrl}/category/${category}`;

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
          url: `${baseUrl}${siteConfig.defaultOgImage}`,
          width: 1200,
          height: 630,
          alt: `${title} | ${siteConfig.name}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}${siteConfig.defaultOgImage}`],
    },
  };
}

export default function Page() {
  return <CategoryPage />;
}
