// Add this at the top of your page.tsx file
import ArticleDetailPage from '@/features/articleDetailPage/ArticleDetailPage';
import { Metadata } from 'next';

// Replace your entire generateMetadata function with this:
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: "Article Not Found | Lex Witness",
      description: "The requested article could not be found.",
    };
  }

  const imageUrl = article.image?.startsWith("http")
    ? article.image
    : article.image
    ? `${process.env.NEXT_PUBLIC_POSTS_BASE_URL || 'https://lwsubscription.vercel.app/api'}${article.image}`
    : "https://lwsubscription.vercel.app/default-og-image.jpg";

  return {
    title: article.title,
    description: article.description?.slice(0, 160) || "Lex Witness article",
    // CRITICAL: These make images/titles work on ALL platforms
    openGraph: {
      title: article.title,
      description: article.description?.slice(0, 160) || "Lex Witness article",
      url: `https://lwsubscription.vercel.app/${article.slug}`, // ABSOLUTE URL
      siteName: "Lex Witness",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
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
