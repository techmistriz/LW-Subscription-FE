"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Article, getPostsByMagazine } from "@/lib/api/services/posts";
import Image from "next/image";
import PageLoader from "@/components/Loader/PageLoader";

const postsImgBaseUrl = process.env.NEXT_PUBLIC_POSTS_BASE_URL || "";

/**
 * RelatedPosts component displays articles related to a specific magazine edition
 */
export default function RelatedPosts({ magazineId }: { magazineId: number }) {
  const [posts, setPosts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true); // Fixed: boolean state

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      try {
        const data = await getPostsByMagazine(magazineId);
        setPosts(data || []);
      } catch (e) {
        console.error("Failed to load related posts", e);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [magazineId]);

  return (
    <section className="max-w-6xl mx-auto px-4 my-10">
      <div className="text-center mb-10">
        <h2 className="text-2xl text-[#333333] font-semibold tracking-wide">
          ARTICLES
        </h2>
        <div className="w-10 h-1.5 bg-[#c9060a] mx-auto mt-2"></div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-4">
          <PageLoader />
          <span className="mt-4 text-gray-500 text-lg">
            Loading articles...
          </span>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {posts.map((article, index) => (
            <Link
              key={`${article.id}-${index}`}
              href={`/${article.slug}`}
              className="group border border-gray-300 bg-white hover:shadow-[0_2px_10px_rgba(0,0,0,0.18)] flex flex-col"
            >
              <div className="relative w-full h-45 overflow-hidden">
                <Image
                  src={`${postsImgBaseUrl}/${article.image}`}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-[15px] font-semibold text-[#222] leading-snug mb-2 line-clamp-2">
                  {article.title}
                </h3>

                <span className="mt-auto text-sm text-[#c9060a] font-medium">
                  {article.category?.name || "Uncategorized"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-[#333333] text-lg mb-4">
            No articles available
          </div>
          <div className="text-gray-500 text-sm">Please check back later</div>
        </div>
      )}
    </section>
  );
}
