"use client";

import Image from "next/image";
import Link from "next/link";

const postImageBaseUrl = process.env.NEXT_PUBLIC_POSTS_BASE_URL || "";

interface Props {
  articles: any[];
}

/**
 * RelatedMagazineArticles component displays a list of related articles
 * with thumbnail images and links to full articles
 */
export default function RelatedMagazineArticles({ articles }: Props) {
  // Show empty state when no articles available
  if (!articles.length) {
    return <p className="text-sm text-gray-500">No related articles found.</p>;
  }

  return (
    <div className="space-y-6">
      {articles.slice(0, 3).map((article) => (
        <div
          key={article.id}
          className="flex gap-4 border-b border-dashed border-gray-300 pb-6 last:border-b-0"
        >
          {/* Article thumbnail */}
          <Link href={`/${article.slug}`}>
            <Image
              src={article.image ? `${postImageBaseUrl}/${article.image}` : "/placeholder.jpg"}
              alt={article.title || "Article thumbnail"}
              width={110}
              height={80}
              className="object-cover shrink-0 mt-1"
              sizes="110px"
            />
          </Link>

          {/* Article content */}
          <div className="flex-1 min-w-0">
            <div>
              {/* Article title */}
              <Link
                href={`/${article.slug}`}
                className="font-semibold text-[15px] leading-snug border-b border-gray-300 pb-1 block transition-colors  "
              >
                {article.title}
              </Link>

              {/* Article excerpt */}
              <p className="text-[15px] font-normal text-[#333333] mt-2 line-clamp-2">
                {article.short_description || "No description available"}
              </p>

              {/* Read more link */}
              <Link
                href={`/${article.slug}`}
                className="text-[#c9060a] text-sm mt-2 inline-block  "
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
