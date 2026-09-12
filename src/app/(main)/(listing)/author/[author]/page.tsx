import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { getAuthors } from "@/services/author.service";
import AuthorPage from "@/features/authors/AuthorPage";

type Props = {
  params: Promise<{ author: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { author } = await params;

  const authors = await getAuthors();

  const authorData = authors.find(
    (item) =>
      item.slug === author || item.name?.toLowerCase() === author.toLowerCase(),
  );

  if (!authorData) {
    return {
      title: `Author Not Found | ${siteConfig.name}`,
      description: "The requested author could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = authorData.name;
  const description = `Read articles and insights by ${authorData.name} on ${siteConfig.name}.`;

  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const canonicalUrl = `${baseUrl}/author/${author}`;

  const imageUrl = authorData.image
    ? `${siteConfig.authorImageBaseUrl}${authorData.image}`
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
      type: "profile",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: authorData.name,
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
  return <AuthorPage />;
}
