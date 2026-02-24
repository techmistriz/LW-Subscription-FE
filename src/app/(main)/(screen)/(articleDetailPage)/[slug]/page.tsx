// app/(main)/(screen)/(articleDetailPage)/[slug]/page.tsx
import ArticleDetailPage from "@/features/articleDetailPage/ArticleDetailPage";
import { getArticleBySlug } from "@/lib/api/services/posts";

export async function generateMetadata({ params }: any) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return { title: "Article Not Found | Lex Witness" };
  }

  const imageUrl = article.image || "https://lexwitness.com/default-og-image.jpg";

  return {
    title: { absolute: article.title },
    description: article.description?.slice(0, 160) || "Lex Witness article",
    openGraph: {
      title: article.title,
      description: article.description?.slice(0, 160) || "Lex Witness article",
      url: `https://lexwitness.com/${article.slug}`,
      siteName: "Lex Witness",
      images: [{ url: imageUrl, width: 1200, height: 630 }],
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

export default function Page() {
  return <ArticleDetailPage />;
}