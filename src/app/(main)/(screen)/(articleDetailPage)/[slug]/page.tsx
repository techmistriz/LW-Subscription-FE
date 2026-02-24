// app/(main)/(screen)/(articleDetailPage)/[slug]/page.tsx
import ArticleDetailPage from "@/features/articleDetailPage/ArticleDetailPage";
import { getArticleBySlug } from "@/lib/api/services/posts";

// Server-side metadata generation
export async function generateMetadata({ params }: any) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    // Fallback metadata for not found
    return {
      title: "Article Not Found | Lex Witness",
      description: "The requested article could not be found.",
      openGraph: {
        title: "Article Not Found | Lex Witness",
        description: "The requested article could not be found.",
        url: "https://lexwitness.com/",
        siteName: "Lex Witness",
        images: [
          {
            url: "https://lexwitness.com/default-og-image.jpg",
            width: 1200,
            height: 630,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Article Not Found | Lex Witness",
        description: "The requested article could not be found.",
        images: ["https://lexwitness.com/default-og-image.jpg"],
      },
    };
  }

  // Absolute image URL fallback
  const imageUrl =
    article.image?.startsWith("http")
      ? article.image
      : article.image
      ? `${process.env.NEXT_PUBLIC_POSTS_BASE_URL}${article.image}`
      : "https://lexwitness.com/default-og-image.jpg";

  // Metadata for LinkedIn, Twitter, etc.
  return {
    title: { absolute: article.title },
    description: article.description?.slice(0, 160) || "Lex Witness article",
    openGraph: {
      title: article.title,
      description: article.description?.slice(0, 160) || "Lex Witness article",
      url: `https://lexwitness.com/${article.slug}`,
      siteName: "Lex Witness",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description?.slice(0, 160) || "Lex Witness article",
      images: [imageUrl],
    },
  };
}

// Server component page
export default function Page() {
  return <ArticleDetailPage />;
}
