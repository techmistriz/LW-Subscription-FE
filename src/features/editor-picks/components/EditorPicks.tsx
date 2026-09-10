"use client";

import { useEffect, useState } from "react";
import { getEditorPicksPosts } from "@/services/post.service";
import EditorPickCard from "./EditorPickCard";
import Link from "next/link";
import PageLoader from "@/components/feedback/Loader/PageLoader";
import type { Post } from "@/types/models";
import { siteConfig } from "@/config/site";
import { PAGINATION } from "@/config/constants";

const postBaseUrl = siteConfig.postsImageBaseUrl || "";

export default function EditorPicks() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Set loading to true
      try {
        const data = await getEditorPicksPosts({
          limit: PAGINATION.EDITOR_PICKS_LIMIT,
        });
        setPosts(data || []);
      } catch (error) {
        console.error("Editor Picks Error:", error);
        setPosts([]);
      } finally {
        setLoading(false); // Always set loading to false
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 mb-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl text-[#333333] font-semibold tracking-wide">
          EDITOR PICKS
        </h2>
        <div className="w-10 h-1 bg-[#c9060a] mx-auto mt-2"></div>
      </div>

      {/* Show spinner if loading OR posts.length === 0 */}
      {loading || posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <PageLoader />
          <span className="mt-4 text-gray-500 text-lg">
            {loading ? "Loading editor picks..." : "No editor picks available"}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 cursor-pointer">
          {posts.map((item) => (
            <Link key={item.id} href={`/${item.slug}`}>
              <EditorPickCard
                img={
                  item.image
                    ? item.image.startsWith("http")
                      ? item.image
                      : `${postBaseUrl}/${item.image}`
                    : undefined
                }
                title={item.title}
                author={
                  typeof item.author === "object" ? item.author?.name || "" : ""
                }
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
