import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { logger } from "@/lib/logger";
import ArticleDetailPage from "@/features/article-detail/ArticleDetailPage";
import { getArticleBySlug } from "@/services/post.service";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  logger.info(" generateMetadata START", { slug });

  try {
    const article = await getArticleBySlug(slug);

    logger.info(" generateMetadata ARTICLE", {
      slug,
      found: Boolean(article),
      status: article?.status,
    });

    if (!article || article.status === false) {
      logger.warn("Article not found for metadata", { slug });

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

    logger.info(" generateMetadata SUCCESS", { slug });

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
  } catch (error) {
    logger.error(" generateMetadata ERROR", {
      slug,
      error,
    });

    throw error;
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  logger.info(" Page START", { slug });

  try {
    const article = await getArticleBySlug(slug);

    logger.info(" Page ARTICLE", {
      slug,
      found: Boolean(article),
      status: article?.status,
    });

    if (!article) {
      logger.warn("Page article not found", { slug });
      return null;
    }

    logger.info(" Page RENDER", { slug });

    return <ArticleDetailPage article={article} />;
  } catch (error) {
    logger.error(" Page ERROR", {
      slug,
      error,
    });

    throw error;
  }
}
