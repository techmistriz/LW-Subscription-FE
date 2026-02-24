import ArticleDetailPage from "@/features/articleDetailPage/ArticleDetailPage";
import { getArticleBySlug } from "@/lib/api/services/posts";

// 👇 ADD THIS HERE (top level, outside component)
export async function generateMetadata({ params }: any) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: "Article Not Found | Lex Witness",
    };
  }

  const imageUrl = article.image?.startsWith("http")
    ? article.image
    : `${process.env.NEXT_PUBLIC_POSTS_BASE_URL}/${article.image}`;

  return {
    title: article.title,
    description: article.description?.slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.description?.slice(0, 160),
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
      description: article.description?.slice(0, 160),
      images: [imageUrl],
    },
  };
}

// 👇 Keep page as Server Component (NO "use client")
export default function Page() {
  return <ArticleDetailPage />;
}