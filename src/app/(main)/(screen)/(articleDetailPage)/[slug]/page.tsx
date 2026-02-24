// Add this at the top of your page.tsx file
import ArticleDetailPage from '@/features/articleDetailPage/ArticleDetailPage';
import { getArticleBySlug } from '@/lib/api/services/posts';
import { Metadata } from 'next';

// Replace your entire generateMetadata function with this:
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found | Lex Witness',
    };
  }

  // ✅ Clean image URL - NO console.log
  let imageUrl = 'https://lwsubscription.vercel.app/default-og-image.jpg';
  
  if (article.image) {
    const postsBaseUrl = process.env.NEXT_PUBLIC_POSTS_BASE_URL || 'https://lwsubscription.vercel.app';
    imageUrl = article.image.startsWith('http') 
      ? article.image 
      : `${postsBaseUrl.replace(/\/$/, '')}/${article.image.replace(/^\//, '')}`;
  }
console.log(imageUrl)
  return {
    title: article.title,
    openGraph: {
      title: article.title,
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      images: [imageUrl],
    },
  };
}






// Server component page
export default function Page() {
  return <ArticleDetailPage />;
}
