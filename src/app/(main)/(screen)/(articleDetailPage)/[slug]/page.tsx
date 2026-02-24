import ArticleDetailPage from "@/features/articleDetailPage/ArticleDetailPage";
import { getArticleBySlug } from "@/lib/api/services/posts";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const imageUrl = article.image
    ? `${process.env.NEXT_PUBLIC_POSTS_BASE_URL}${article.image}`
    : "https://yourdomain.com/default-og.jpg";

  return {
    title: article.title,
    description: article.short_description || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.short_description || article.excerpt,
      url: `https://yourdomain.com/articles/${params.slug}`,
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
      description: article.short_description || article.excerpt,
      images: [imageUrl],
    },
  };
}

export default function Page({ params }: Props) {
  return <ArticleDetailPage slug={params.slug} />;
}