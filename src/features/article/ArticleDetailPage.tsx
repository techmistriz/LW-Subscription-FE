"use client";

import { Facebook, Twitter, Linkedin, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import { getArticleBySlug, getRelatedPosts } from "@/lib/api/services/posts";
import { stripInlineStyles, toTitleCase } from "@/lib/utils/helper/toTitleCase";

const postBaseUrl = process.env.NEXT_PUBLIC_POSTS_BASE_URL || "";

interface Article {
  id: number;
  title: string;
  slug: string;
  content?: string;
  description?: string;
  image?: string;
  publish_date?: string;
  published_at?: string;
  category?: { slug?: string };
  category_id?: number;
  author_id?: number;
  magazine_id?: number;
  author?: {
    name: string;
    avatar?: string;
    bio?: string;
  };
}

export default function ArticleDetailPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>();

  // Article data states
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState("");

  // Load main article by slug
  useEffect(() => {
    let active = true;

    async function fetchArticle() {
      if (!slug) return;

      // Reset immediately when slug changes
      setLoading(true);
      setArticle(null);
      setRelatedPosts([]);

      try {
        const articleData = await getArticleBySlug(slug as string);

        if (!active) return;

        if (articleData) {
          setArticle(articleData);
          document.title = `${articleData.title} | Lex Witness`;
        } else {
          setArticle(null);
        }
      } catch (error) {
        if (!active) return;
        console.error("Failed to fetch article:", error);
        setArticle(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchArticle();

    return () => {
      active = false;
    };
  }, [slug]);

  // Load related posts based on category, author, and magazine
  useEffect(() => {
    let active = true;

    async function fetchRelated() {
      if (!article) return;

      try {
        const requests = [];

        if (article.category_id) {
          requests.push(getRelatedPosts({ category_id: article.category_id }));
        }

        if (article.author_id) {
          requests.push(getRelatedPosts({ author_id: article.author_id }));
        }

        if (article.magazine_id) {
          requests.push(getRelatedPosts({ magazine_id: article.magazine_id }));
        }

        const results = await Promise.all(requests);

        if (!active) return;

        const collectedPosts = results.flat();

        const uniqueRelatedPosts = Array.from(
          new Map(
            collectedPosts
              .filter((post) => post.slug !== article.slug)
              .map((post) => [post.id, post]),
          ).values(),
        ).slice(0, 3);

        setRelatedPosts(uniqueRelatedPosts);
      } catch (error) {
        if (active) {
          console.error("Failed to fetch related posts:", error);
          setRelatedPosts([]);
        }
      }
    }

    fetchRelated();

    return () => {
      active = false;
    };
  }, [article]);

  // Initialize share URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section className="bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-12 w-3/4 bg-gray-200 rounded" />
            <div className="h-96 bg-gray-200 rounded" />
            <div className="h-48 bg-gray-200 rounded" />
          </div>
        </div>
      </section>
    );
  }

  // Article not found
  if (!article) {
    return (
      <section className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Article Not Found
          </h1>
          <p className="text-gray-600">
            Article {slug} not found in {category} category.
          </p>
        </div>
      </section>
    );
  }

  // Generate image URL with fallback
  // const getImageUrl = (image?: string) => {
  //   if (!image) return "/placeholder.jpg";
  //   return image.startsWith("http") ? image : `${postBaseUrl}/${image}`;
  // };

  // Generate author avatar URL
  const getAuthorAvatar = (avatar?: string, name?: string) => {
    if (avatar) return avatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "")}&background=eee&color=000&size=128`;
  };

  // Handle social sharing
  const handleShare = async () => {
    if (!shareUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        // Using a more modern notification approach
        if (typeof window !== "undefined") {
          const toast = document.createElement("div");
          toast.textContent = "Link copied to clipboard!";
          toast.className =
            "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50";
          document.body.appendChild(toast);
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const categoryTitle = toTitleCase(
    article.category?.slug || (category as string) || "",
  );

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <article className="lg:col-span-9">
          {/* Category breadcrumb */}
          <p className="text-[#c9060a] text-lg   capitalize  mb-2">
            {categoryTitle}
          </p>

          {/* Article title */}
          <h1 className="text-2xl lg:text-2xl font-bold leading-snug">
            {article.title}
          </h1>
          <div className="w-10 h-1 bg-[#c9060a] mb-1" />

          {/* Meta and social sharing */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#333333]">
              <span className="text-[#c9060a] font-medium">
                {article.author?.name || "Lex Witness Bureau"}
              </span>{" "}
              |{" "}
              {article.publish_date || article.published_at || "November 2025"}
            </p>

            {/* Social sharing buttons */}
            <div className="flex gap-2">
              <a
                href="#facebook"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                className="w-6 h-6 bg-[#1877F2] text-white flex items-center justify-center   hover:bg-[#a00508] transition-all duration-200"
              >
                <Facebook size={16} />
              </a>

              <a
                href="#twitter"
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
                className="w-6 h-6 bg-[#1DA1F2]  text-white flex items-center justify-center   hover:bg-[#a00508] transition-all duration-200"
              >
                <Twitter size={16} />
              </a>

              <a
                href="#linkedIn"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className="w-6 h-6 bg-[#0A66C2] text-white flex items-center justify-center   hover:bg-[#a00508] transition-all duration-200"
              >
                <Linkedin size={16} />
              </a>

              <button
                onClick={handleShare}
                aria-label="Share this article"
                className="w-6 h-6 bg-gray-500 hover:bg-gray-700 text-white flex items-center justify-center cursor-pointer transition-all duration-200"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Featured image */}
          {article.image && (
            <div className="relative w-full h-[400px] mt-3 mb-6 overflow-hidden">
              <Image
                src={
                  article.image.startsWith("http")
                    ? article.image
                    : `${postBaseUrl}/${article.image}`
                }
                alt={article.title || "article image"}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}

          {/* Article content */}
          <div
            className="text-sm text-[#333333] leading-7 space-y-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: stripInlineStyles(
                article.description || article.content || "",
              ),
            }}
          />

          {/* Author section */}
          {article.author && (
            <>
              <h3 className="font-bold text-xl mt-10">ABOUT AUTHOR</h3>
              <div className="w-10 h-1 bg-[#c9060a]" />
              <div className="border border-gray-300 mt-2 p-4 flex gap-4   transition-none hover:shadow-[0_-6px_15px_rgba(0,0,0,0.15),0_6px_15px_rgba(0,0,0,0.15)]">
                <div className="relative w-24 h-24 overflow-hidden bg-gray-200 shrink-0 ">
                  <Image
                    src={getAuthorAvatar(
                      article.author.avatar,
                      article.author.name,
                    )}
                    alt={article.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 ">
                  <h4 className="font-semibold text-base mb-2">
                    {article.author.name.toUpperCase()}
                  </h4>
                  <p className="text-xs text-[#333333] leading-5">
                    {article.author.bio ||
                      `${article.author.name} is a contributor at Lex Witness.`}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Related articles section */}
          {relatedPosts.length > 0 && (
            <div className="lg:col-span-12 mt-16 mb-8">
              <h3 className="font-bold text-xl">RELATED ARTICLES</h3>
              <div className="w-10 h-1 bg-[#c9060a] mb-4" />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/${post.slug}`}
                    className="bg-[#F8F8F8] border shadow-md border-gray-300 flex flex-col items-start hover:shadow-gray-400 hover:shadow-md cursor-pointer group"
                  >
                    <div className="h-40 w-full relative bg-white">
                      {post.image ? (
                        <Image
                          src={
                            post.image.startsWith("https")
                              ? post.image
                              : `${postBaseUrl}/${post.image}`
                          }
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="300px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <div className="w-20 h-14 bg-gray-300 rounded-sm flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-8 h-8 text-gray-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 4a1 1 0 110 2 1 1 0 010-2zm-2 7l3-4 2 3 3-4 4 5H5z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="px-3 py-4 text-start border-t border-gray-400 w-full">
                      <h4 className="text-base font-medium leading-snug line-clamp-2 text-gray-800 group-hover:text-[#c9060a] transition-colors">
                        {post.title}
                      </h4>

                      <p className="text-[#c9060a] text-sm mt-2 font-normal">
                        {post.author?.name || "Lex Witness Bureau"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Right sidebar */}
        <RightSidebar />
      </div>
    </section>
  );
}
