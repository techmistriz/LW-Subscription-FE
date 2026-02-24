import ArticleDetailPage from "@/features/articleDetailPage/ArticleDetailPage";
import { getArticleBySlug } from "@/lib/api/services/posts";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article || article.status === false) {
    return {
      title: `Article Not Found: ${slug} | Lex Witness`,
    };
  }

  // ✅ PERFECT - Use your exact image base URL
  let imageUrl = "https://lwsubscription.vercel.app/default-og-image.jpg";
  
  if (article.image) {
    // NEXT_PUBLIC_POSTS_BASE_URL = https://admin.lexwitness.com/uploads/posts/
    const postsBaseUrl = process.env.NEXT_PUBLIC_POSTS_BASE_URL || 'https://admin.lexwitness.com/uploads/posts/';
    imageUrl = `${postsBaseUrl}${article.image}`;
  }

  return {
    title: article.title,
   openGraph: {
  title: article.title,
  images: [{
    url: imageUrl,
    width: 1200,      // ✅ LinkedIn requires
    height: 630,      // ✅ Exact aspect ratio
    type: 'image/jpeg' // ✅ Forces JPG detection
  }],
},

    twitter: {
      card: "summary_large_image",
      title: article.title,
      images: [imageUrl],
    },
  };
}

export default function Page() {
  return <ArticleDetailPage />;
}
