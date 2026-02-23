import ArticleDetailPage from "@/features/articleDetailPage/ArticleDetailPage";
import { getArticleBySlug } from "@/lib/api/services/posts";

export async function generateMetadata({ params }: any) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return { title: "Article" };
  }

  const imageUrl = article.image?.startsWith("http")
    ? article.image
    : `https://lexwitness.com/${article.image}`;

  return {
    title: article.title,
    description: article.description?.slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.description?.slice(0, 160),
      url: `https://lexwitness.com/${params.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
      type: "article",
    },
  };
}

export default function Page({ params }: any) {
  return <ArticleDetailPage slug={params.slug} />;
}