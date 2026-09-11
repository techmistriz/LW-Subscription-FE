import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import ArticleDetailPage from "@/features/articleDetailPage/ArticleDetailPage";
import { getArticleBySlug } from "@/services/post.service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status === false) {
    return {
      title: `Article Not Found | ${siteConfig.name}`,
      description: "The requested article could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = article.title;

  const description =
    article.excerpt ||
    article.short_description ||
    `Read the latest legal news, insights and analysis from ${siteConfig.name}.`;

  const imageUrl = article.image
    ? `${siteConfig.postsImageBaseUrl}${article.image}`
    : `${siteConfig.url}${siteConfig.defaultOgImage}`;

  const canonicalUrl = `${siteConfig.url}/${slug}`;

  return {
    title: `${title} | ${siteConfig.name}`,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: "article",
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
}

export default function Page() {
  return <ArticleDetailPage />;
}
