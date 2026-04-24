"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { getArticleBySlug, getRelatedPosts } from "@/lib/api/services/posts";
import { toTitleCase } from "@/lib/utils/helper/toTitleCase";
import { formatArticleHTML } from "@/lib/utils/helper/formatArticle";

import TestimonialCard from "@/components/Testimonial/Testimonial";
import SocialShare from "@/components/SocialShare/SocialShare";

import { Article } from "@/types";

import "./style.css";
import { useAppSelector } from "@/redux/store/hooks";

const postBaseUrl = process.env.NEXT_PUBLIC_POSTS_BASE_URL || "";
const authorImg = process.env.NEXT_PUBLIC_ADMIN_IMAGE_URL || "";

export default function ArticleDetailPage() {
  const { category, slug } = useParams<{ category: string; slug: string }>();

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorImage, setAuthorImage] = useState("/avatar.jpg");

  /*----------------- Only subscribes User Read full article content -----------------*/

  const { user } = useAppSelector((state) => state.auth);
  const subscription = useAppSelector((state) => state.subscription.data);

  const isSubscribed = Boolean(
    user && // MUST HAVE
    subscription &&
    subscription.status === "ACTIVE" &&
    subscription.end_date &&
    new Date(subscription.end_date) >= new Date(),
  );

  const redirectPath = user ? "/dashboard" : "/register";

  /* ---------------- FETCH ARTICLE ---------------- */

  useEffect(() => {
    let active = true;

    async function fetchArticle() {
      if (!slug) return;

      setLoading(true);
      setArticle(null);
      setRelatedPosts([]);

      try {
        const articleData = await getArticleBySlug(slug);

        // console.log("Slug:", slug);
        // console.log("Article:", articleData);

        if (!active) return;

        /*----------------- API error or not found -----------------*/
        if (!articleData || articleData.status === false) {
          setArticle(null);
          return;
        }

        setArticle(articleData);
        document.title = `${articleData.title} | Lex Witness`;
      } catch (error) {
        console.error("Failed to fetch article:", error);
        if (active) setArticle(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchArticle();
    return () => {
      active = false;
    };
  }, [slug]);

  /* ---------------- FETCH RELATED POSTS ---------------- */

  useEffect(() => {
    let active = true;

    async function fetchRelated() {
      if (!article) return;

      try {
        const requests = [];

        if (article.category_id)
          requests.push(getRelatedPosts({ category_id: article.category_id }));

        if (article.author_id)
          requests.push(getRelatedPosts({ author_id: article.author_id }));

        if (article.magazine_id)
          requests.push(getRelatedPosts({ magazine_id: article.magazine_id }));

        const results = await Promise.all(requests);

        if (!active) return;

        const uniquePosts = Array.from(
          new Map(
            results
              .flat()
              .filter((p) => p.slug !== article.slug)
              .map((p) => [p.id, p]),
          ).values(),
        ).slice(0, 3);

        setRelatedPosts(uniquePosts);
      } catch (error) {
        console.error("Failed to fetch related posts:", error);
        if (active) setRelatedPosts([]);
      }
    }

    fetchRelated();
    return () => {
      active = false;
    };
  }, [article]);

  /* ---------------- AUTHOR IMAGE ---------------- */

  useEffect(() => {
    if (
      article?.author &&
      typeof article.author !== "string" &&
      article.author.image
    ) {
      setAuthorImage(`${authorImg}${article.author.image}`);
    } else {
      setAuthorImage("/avatar.jpg");
    }
  }, [article]);

  /* ---------------- LOADING UI ---------------- */

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

  /* ---------------- ARTICLE NOT FOUND ---------------- */
  if (!article) {
    notFound();
  }

  /* ---------------- CATEGORY TITLE ---------------- */

  const rawCategory =
    typeof article.category === "string"
      ? article.category
      : (article.category?.slug ?? "");

  const categoryTitle = toTitleCase(rawCategory);

  return (
    <section className="bg-white">
      <article className="lg:col-span-9">
        {/*----------------- CATEGORY -----------------*/}
        <Link href={`/category/${rawCategory}`}>
          <p className="text-[#c9060a] font-semibold text-lg uppercase cursor-pointer mb-2">
            {categoryTitle}
          </p>
        </Link>

        {/*----------------- TITLE -----------------*/}
        <h1 className="text-2xl lg:text-[22px] font-semibold leading-snug">
          {article.title}
        </h1>

        <div className="w-10 h-1 bg-[#c9060a] mb-1" />

        {/*----------------- AUTHOR + SOCIAL -----------------*/}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm text-[#333333] flex items-center gap-2">
            {article.author && typeof article.author !== "string" ? (
              <Link
                href={`/author/${article.author.slug}`}
                className="text-[#c9060a] font-medium"
              >
                {article.author.name}
              </Link>
            ) : (
              <span className="text-[#c9060a] font-medium">
                {typeof article.author === "string"
                  ? article.author
                  : "Lex Witness Bureau"}
              </span>
            )}

            <span className="text-gray-500">|</span>

            <span>
              {article.magazine?.month?.name} {article.magazine?.year}
            </span>
          </p>

          <SocialShare title={article.title} />
        </div>

        {/*----------------- FEATURE IMAGE -----------------*/}
        {article.image && (
          <div className="relative w-full mt-3 mb-6 aspect-video">
            <Image
              src={
                article.image.startsWith("http")
                  ? article.image
                  : `${postBaseUrl}/${article.image}`
              }
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/*----------------- ARTICLE CONTENT -----------------*/}
        <div className="my-6">
          {isSubscribed ? (
            <div
              className="article-content text-[17px] leading-7.25 font-normal text-gray-800 text-justify"
              dangerouslySetInnerHTML={{
                __html: formatArticleHTML(article.description || ""),
              }}
            />
          ) : (
            <div className="p-6 bg-white border-2 border-gray-100 text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Subscribe to Read Full Article
              </h2>

              <p className="text-gray-700 mb-4 text-[14px]">
                This article is available only for our subscribed readers.
              </p>

              <Link
                href={redirectPath}
                className="inline-block bg-[#c9060a] text-white px-6 py-3 font-normal hover:bg-[#333] transition"
              >
                SUBSCRIBE NOW
              </Link>
            </div>
          )}
        </div>

        {/*----------------- TESTIMONIALS -----------------*/}
        {Array.isArray(article.reader_feedbacks) &&
          article.reader_feedbacks.some((item) => item.reader_feedback) && (
            <div className="my-12 space-y-8">
              {article.reader_feedbacks
                .filter((item) => item.reader_feedback) // remove empty feedback
                .map((item: any) => (
                  <TestimonialCard
                    key={item.id}
                    data={{
                      reader_feedback: item.reader_feedback,
                      reader_name: item.reader_name,
                      reader_designation: item.reader_designation,
                      text_alignment:
                        (item.text_aligment?.replace("text-", "") as
                          | "left"
                          | "right"
                          | "center") || "left",
                    }}
                  />
                ))}
            </div>
          )}

        {article.description && (
          <div className="flex justify-end  ">
            <SocialShare title={article.title} />
          </div>
        )}

        {/*----------------- AUTHOR SECTION -----------------*/}
        {article.author && typeof article.author !== "string" && (
          <>
            <h3 className="font-bold text-xl mt-10">ABOUT AUTHOR</h3>
            <div className="w-10 h-1 bg-[#c9060a]" />

            <div className="border border-gray-300 mt-2 p-4 flex gap-4 hover:shadow-gray-300 hover:shadow-md">
              <div className="relative w-24 h-24 shrink-0">
                <Image
                  src={authorImage}
                  alt={article.author.name}
                  fill
                  className="object-cover"
                  onError={() => setAuthorImage("/avatar.jpg")}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-base mb-2">
                  {article.author.name.toUpperCase()}
                </h4>

                <p className="text-xs text-[#333333] leading-5">
                  {article.author.bio ||
                    `${article.author.name} is a contributor at Lex Witness.`}
                </p>
                <div className="flex lg:mt-5 gap-4">
                  {/*----------------- Author LinkedIn -----------------*/}
                  {/* {article.author?.linkedin && ( */}
                  <a
                    href={article.author.linkedin}
                    // target="_blank"
                    rel="noopener noreferrer"
                    className="relative group w-10 h-6 flex items-center justify-center border border-[#0A66C2] text-white bg-[#0A66C2] shadow-sm overflow-hidden"
                  >
                    <svg
                      className="w-4 h-4 z-10"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.78v2.22h.07c.66-1.25 2.27-2.57 4.68-2.57 5 0 5.92 3.28 5.92 7.55V24h-5v-7.92c0-1.89-.03-4.33-2.63-4.33-2.63 0-3.03 2.05-3.03 4.17V24h-5V8z" />
                    </svg>

                    {/*----------------- Hover overlay -----------------*/}
                    <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></span>
                  </a>
                  {/* )} */}
                </div>
              </div>
            </div>
          </>
        )}

        {/*----------------- RELATED POSTS -----------------*/}
        {relatedPosts.length > 0 && (
          <div className="my-8">
            <h3 className="font-bold text-xl">RELATED ARTICLES</h3>
            <div className="w-10 h-1 bg-[#c9060a] mb-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${post.slug}`}
                  className="bg-[#F8F8F8] border shadow-md border-gray-300 flex flex-col hover:shadow-gray-400 hover:shadow-md"
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
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center" />
                    )}
                  </div>

                  <div className="px-3 py-4 border-t border-gray-400">
                    <h4 className="text-base font-medium line-clamp-2 text-gray-800">
                      {post.title}
                    </h4>

                    <p className="text-[#c9060a] text-sm mt-2">
                      {typeof post.author === "string"
                        ? post.author
                        : post.author?.name || "Lex Witness Bureau"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </section>
  );
}
