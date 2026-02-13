"use client";

import { useEffect, useState } from "react";
import { getEditorPicksPosts } from "@/lib/api/posts";
import EditorPickCard from "../EditorPickCard/EditorPickCard";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  slug: string; // ✅ add this
  image?: string;
  author?: {
    name: string;
  };
}

const postBaseUrl = process.env.NEXT_PUBLIC_POSTS_BASE_URL || "";

export default function EditorPicks() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getEditorPicksPosts({ limit: 5 });
        // console.log(data);
        setPosts(data);
      } catch (error) {
        console.error("Editor Picks Error:", error);
      }
    };

    fetchPosts();
  }, []);

  const getImageUrl = (image?: string) => {
    if (!image) return "/placeholder.jpg";
    return image.startsWith("http") ? image : `${postBaseUrl}/${image}`;
  };

  return (
    <section className="max-w-6xl mx-auto px-4 mb-20">
      <div className="text-center mb-10">
        <h2 className="text-2xl text-[#333333] font-semibold tracking-wide">
          EDITOR PICKS
        </h2>
        <div className="w-10 h-1 bg-[#c9060a] mx-auto mt-2"></div>
      </div>

      {/* EXACT SAME GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 cursor-pointer">
        {posts.map((item) => (
          <Link key={item.id} href={`/${item.slug}`}>
            <EditorPickCard
              img={getImageUrl(item.image)}
              title={item.title}
              author={item?.author?.name || ""}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
