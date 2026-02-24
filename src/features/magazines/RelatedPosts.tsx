"use client";

import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types";

const postsImgBaseUrl = process.env.NEXT_PUBLIC_POSTS_BASE_URL || "";

export default function RelatedPosts({ posts }: { posts: Article[] }) {
  if (!posts || posts.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-4 my-10 text-center">
        <div className="text-[#333333] text-lg mb-2">
          No articles available
        </div>
        <div className="text-gray-500 text-sm">
          Please check back later
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 my-10">
      <div className="text-center mb-10">
        <h2 className="text-2xl text-[#333333] font-semibold tracking-wide">
          ARTICLES
        </h2>
        <div className="w-10 h-1.5 bg-[#c9060a] mx-auto mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {posts.map((article) => (
          <Link
            key={article.id}
            href={`/${article.slug}`}
            className="group border border-gray-300 bg-white hover:shadow-[0_2px_10px_rgba(0,0,0,0.18)] flex flex-col"
          >
            <div className="relative w-full h-45 overflow-hidden">
              <Image
                src={
                  article.image
                    ? `${postsImgBaseUrl}/${article.image}`
                    : "/placeholder.jpg"
                }
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-[15px] font-semibold text-[#222] leading-snug mb-2 line-clamp-2">
                {article.title}
              </h3>

             <span className="mt-auto text-sm text-[#c9060a] font-medium">
  {typeof article.category === "string"
    ? article.category
    : article.category?.name || "Uncategorized"}
</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}