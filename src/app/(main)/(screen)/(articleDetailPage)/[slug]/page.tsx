// app/(main)/(screen)/(articleDetailPage)/[slug]/page.tsx
import ArticleDetailPage from "@/features/articleDetailPage/ArticleDetailPage";
import { getArticleBySlug } from "@/lib/api/services/posts";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Fetch article server-side using your Axios wrapper
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: "Article Not Found | Lex Witness",
      description: "The requested article was not found.",
      openGraph: {
        title: "Article Not Found | Lex Witness",
        description: "The requested article was not found.",
        images: [{ url: "https://lexwitness.com/default-og-image.jpg", width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Article Not Found | Lex Witness",
        images: ["https://lexwitness.com/default-og-image.jpg"],
      },
    };
  }

  // Determine the absolute image URL
  const imageUrl =
    article.image?.startsWith("http")
      ? article.image
      : `${process.env.NEXT_PUBLIC_POSTS_BASE_URL}${article.image}` || "https://lexwitness.com/default-og-image.jpg";

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

// Keep page as a server component (do NOT use "use client" here)
export default function Page() {
  return <ArticleDetailPage />;
}