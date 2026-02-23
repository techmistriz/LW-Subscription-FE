"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import { getArticleBySlug, getRelatedPosts } from "@/lib/api/services/posts";
import { toTitleCase } from "@/lib/utils/helper/toTitleCase";
import TestimonialCard from "@/components/Testimonial/Testimonial";
import { Article } from "@/types";
import "./style.css";
import { formatArticleHTML } from "@/lib/utils/helper/formatArticle";
import SocialShare from "@/components/SocialShare/SocialShare";
const postBaseUrl = process.env.NEXT_PUBLIC_POSTS_BASE_URL || "";

export default function ArticleDetailPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>();

  // Article data states
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  // const [shareUrl, setShareUrl] = useState("");

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
        console.log(articleData);
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

  // Generate author avatar URL
  const getAuthorAvatar = (avatar?: string, name?: string) => {
    if (avatar) return avatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "")}&background=eee&color=000&size=128`;
  };

  const categoryTitle = toTitleCase(
    article.category
      ? typeof article.category === "string"
        ? article.category
        : article.category.slug
      : category || "",
  );

  console.log("Singlepage", article);

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <article className="lg:col-span-9">
          {/* Category breadcrumb */}
          <Link
            href={`/category/${
              typeof article.category === "string"
                ? article.category
                : article.category?.slug
            }`}
          >
            {" "}
            <p className="text-[#c9060a] text-lg uppercase cursor-pointer mb-2">
              {categoryTitle}
            </p>
          </Link>

          {/* Article title */}
          <h1 className="text-2xl lg:text-2xl font-bold leading-snug">
            {article.title}
          </h1>
          <div className="w-10 h-1 bg-[#c9060a] mb-1" />

          {/* Meta and social sharing */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#333333]">
              <Link
                href={`/author/${article.author?.slug}`}
                className="text-[#c9060a] font-medium"
              >
                {article.author?.name || "Lex Witness Bureau"}
              </Link>{" "}
              |{" "}
              {article.publish_date || article.published_at || "November 2025"}
            </p>

            {/* Social sharing buttons */}
            <SocialShare title={article.title} />
          </div>

          {/* Featured image */}
          {article.image && (
            <div className="relative w-full mt-3 mb-6">
              <Image
                src={
                  article.image.startsWith("http")
                    ? article.image
                    : `${postBaseUrl}/${article.image}`
                }
                alt={article.title || "article image"}
                width={1200} // approximate image width
                height={800} // approximate image height
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          )}

          {/* Article content */}
          {/* <div
            className="text-sm text-[#333333] leading-7 space-y-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: stripInlineStyles(
                article.description || article.content || "",
              ),
            }}
          /> */}

          <>
            {/* Testimonials */}
            {Array.isArray(article.reader_feedbacks) &&
              article.reader_feedbacks.length > 0 && (
                <div className="my-12 space-y-8">
                  {article.reader_feedbacks.map((item: any) => (
                    <TestimonialCard
                      key={item.id}
                      data={{
                        reader_feedback: item.reader_feedback,
                        reader_name: item.reader_name,
                        reader_designation: item.reader_designation,
                        text_alignment: item.text_alignment || "left", // use alignment from API
                      }}
                    />
                  ))}
                </div>
              )}

            {/* Article Description */}
            {article.description && (
              <div
                className="article-content text-[15px] font-normal leading-7 text-gray-800"
                dangerouslySetInnerHTML={{
                  __html: formatArticleHTML(article.description),
                }}
              />
            )}
          </>
          {/* SocialShare */}
          <div className="flex justify-end mt-6">
            <SocialShare title={article.title} />
          </div>

          {/* Author section */}
          {article.author && (
            <>
              <h3 className="font-bold text-xl mt-10">ABOUT AUTHOR</h3>
              <div className="w-10 h-1 bg-[#c9060a]" />
              <div className="border border-gray-300 mt-2 p-4 flex gap-4   transition-none hover:shadow-[0_-6px_15px_rgba(0,0,0,0.15),0_6px_15px_rgba(0,0,0,0.15)]">
                <div className="relative w-24 h-24 overflow-hidden bg-gray-200 shrink-0 ">
                  <Image
                    src={getAuthorAvatar(
                      article.author?.avatar,
                      article.author?.name,
                    )}
                    alt={article.author?.name || "Author"}
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
                      `${article.author.name || "Author"} is a contributor at Lex Witness.`}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Related articles section */}
          {relatedPosts.length > 0 && (
            <div className="lg:col-span-12  my-8">
              <h3 className="font-bold text-xl">RELATED ARTICLES</h3>
              <div className="w-10 h-1 bg-[#c9060a] mb-4" />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/${post.slug}`}
                    className="bg-[#F8F8F8] border shadow-md border-gray-300 flex flex-col items-start hover:shadow-gray-400 hover:shadow-md cursor-pointer group"
                  >
                    <div className="h-60 lg:h-40 w-full relative bg-white">
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
                      <h4 className="text-base font-medium leading-snug line-clamp-2 text-gray-800  transition-colors">
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
