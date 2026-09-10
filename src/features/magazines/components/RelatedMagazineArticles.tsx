"use client";

import Link from "next/link";
import SafeImage from "../../../components/media/SafeImage";
import type { Post } from "@/types/models";
import { siteConfig } from "@/config/site";

const postImageBaseUrl = siteConfig.postsImageBaseUrl || "";

interface Props {
  articles: Post[];
}

export default function RelatedMagazineArticles({ articles }: Props) {
  if (!articles.length) {
    return <p className="text-sm text-gray-500">No related articles found.</p>;
  }

  return (
    <div className="space-y-6 mt-1">
      {articles.slice(0, 3).map((article) => (
        <div
          key={article.id}
          className="flex flex-col md:flex-row gap-4 border-b border-dashed border-gray-300 pb-5 last:border-b-0"
        >
          <Link
            href={`/${article.slug}`}
            className="relative w-full h-50 md:w-30 md:h-25 shrink-0 block"
          >
            <SafeImage
              src={
                article.image
                  ? `${postImageBaseUrl}/${article.image}`
                  : undefined
              }
              alt={article.title || "Article thumbnail"}
              fill
              sizes="(max-width: 768px) 100vw, 180px"
              className="object-cover"
            />
          </Link>

          <div className="flex-1">
            <Link
              href={`/${article.slug}`}
              className="font-semibold text-[16px] leading-snug block transition-colors"
            >
              {article.title}
            </Link>

            <hr className="text-gray-200" />

            <p className="text-[14px] text-gray-600 mt-2 line-clamp-2">
              {article.short_description || "No description available"}
            </p>

            <Link
              href={`/${article.slug}`}
              className="text-[#c9060a] text-sm mt-3 inline-block"
            >
              Read More
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
