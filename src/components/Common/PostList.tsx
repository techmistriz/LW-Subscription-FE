"use client";

import Link from "next/link";
import Image from "next/image";
import PageLoader from "@/components/Loader/PageLoader";

interface Author {
  id: number;
  name: string;
  slug: string;
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  image?: string;
  author?: Author | string;
  publish_date?: string;
  short_description?: string;
  date?: string;
  excerpt?: string;
}

interface PostListProps {
  posts: Post[];
  fallbackAuthorName?: string;
  postBaseUrl?: string;
  loading?: boolean;
  emptyMessage?: string;
}

export default function PostList({
  posts,
  fallbackAuthorName,
  postBaseUrl = "",
  loading = false,
  emptyMessage = "No posts available.",
}: PostListProps) {
  const getImageUrl = (image?: string) => {
    if (!image) return "/placeholder.jpg";
    return image.startsWith("http") ? image : `${postBaseUrl}/${image}`;
  };

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <PageLoader />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-10 text-center bg-gray-50 border border-dashed border-gray-300 rounded-md">
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <hr className="border-gray-200" />

      {posts.map((article) => (
        <div
          key={article.id}
          className="flex gap-4 border-b border-dashed border-gray-300 pb-6 last:border-b-0"
        >
          <div className="relative w-45 h-30 shrink-0 overflow-hidden ">
            <Link href={`/${article.slug}`}>
              <Image
                src={getImageUrl(article.image)}
                alt={article.title}
                fill
                className="object-cover"
                sizes="180px"
              />
            </Link>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-[18px]  font-semibold leading-tight line-clamp-2 mb-2">
              <Link href={`/${article.slug}`} className=" text-[#333]">
                {article.title}
              </Link>
            </h3>

            <p className="font-normal text-[16px] text-[#333333] mb-2 border-b border-gray-200 pb-2">
              {typeof article.author === "object" ? (
                <Link
                  href={`/author/${article.author?.slug}`}
                  className="text-[#c9060a]  "
                >
                  {article.author?.name}
                </Link>
              ) : (
                <span className="text-[#c9060a] font-medium">
                  {article.author || fallbackAuthorName || "Admin"}
                </span>
              )}{" "}
              | {article.publish_date || article.date || "N/A"}
            </p>

            <p className="text-[16px] text-gray-600 line-clamp-2 mb-3 leading-relaxed">
              {article.short_description || "No description available"}
            </p>

            <Link
              href={`/${article.slug}`}
              className="text-[#c9060a] text-sm font-normal inline-flex items-center gap-1"
            >
              Read More
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
