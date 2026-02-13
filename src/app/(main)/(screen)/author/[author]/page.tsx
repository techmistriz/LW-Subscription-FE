"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { toTitleCase } from "@/lib/utils/helper";
import { getPosts } from "@/lib/api/services/posts";
import { getAuthors } from "@/lib/api/services/author";
import { getYears } from "@/lib/api/services/years";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import PageLoader from "@/components/Loader/PageLoader";

// Types
interface Year {
  id: number;
  name: number | string;
}

interface Post {
  id: number;
  slug: string;
  title: string;
  image?: string;
  author?: {
    id: number;
    name: string;
    slug: string;
  };
  publish_date?: string;
  short_description?: string;
}

const postBaseUrl = process.env.NEXT_PUBLIC_POSTS_BASE_URL || "";
const bannerImg: React.CSSProperties = {
  backgroundImage: `url(${process.env.NEXT_PUBLIC_BANNER_BASE_URL})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export default function AuthorPage() {
  const params = useParams();
  const authorSlug = params?.author as string;

  const authorName = authorSlug?.replace(/-/g, " ") || "";
  const authorTitleCaps = authorName.toUpperCase();
  const authorTitleNormal = toTitleCase(authorName);

  // State
  const [loading, setLoading] = useState(true);
  const [yearOpen, setYearOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [years, setYears] = useState<Year[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [authorId, setAuthorId] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get author ID from slug
  const loadAuthor = useCallback(async () => {
    if (!authorSlug) return;

    try {
      const allAuthors = await getAuthors();
      const author = allAuthors.find((a) => a.slug === authorSlug);

      if (author?.id) {
        setAuthorId(author.id);
      } else {
        setAuthorId(null);
      }
    } catch (error) {
      console.error("getAuthors failed:", error);
      setAuthorId(null);
    }
  }, [authorSlug]);

  const fetchPosts = useCallback(
    async (year?: number, page: number = 1) => {
      if (!authorId) return;

      setLoading(true);
      try {
        const response = await getPosts({
          author_id: authorId,
          year_id: year || undefined,
          page,
        });

        setPosts(response.data || []);
        setLastPage(response.meta?.last_page || 1);
        setCurrentPage(page);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    },
    [authorId],
  );

  // Load years dropdown
  const loadYears = useCallback(async () => {
    try {
      const yearsData = await getYears();
      setYears(yearsData.data || []);
    } catch (error) {
      console.error("Error loading years:", error);
    }
  }, []);

  // Effects
  useEffect(() => {
    loadAuthor();
  }, [loadAuthor]);

  useEffect(() => {
    if (authorId) {
      fetchPosts(undefined, 1);
    }
  }, [authorId, fetchPosts]);

  useEffect(() => {
    loadYears();
  }, [loadYears]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setYearOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter handlers
  const handleYearSelect = (year: number | null) => {
    setSelectedYear(year);
    setYearOpen(false);
  };

  const handleApplyFilter = () => {
    fetchPosts(selectedYear ?? undefined, 1);
  };

  if (loading) {
    return (
      <PageLoader/>
    );
  }

  // Image URL helper
  const getImageUrl = (image?: string) => {
    if (!image) return "/placeholder.jpg";
    return image.startsWith("http") ? image : `${postBaseUrl}/${image}`;
  };

  return (
    <section className="bg-white">
      {/* HERO */}
      <section className="py-12 bg-cover bg-center" style={bannerImg}>
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-white text-xl md:text-2xl font-bold">
            {authorTitleCaps}
          </h1>
          <p className="text-sm text-gray-200">
            <Link href="/" className="text-[#c9060a] hover:underline">
              Home
            </Link>{" "}
            | {authorTitleNormal}
          </p>
        </div>
      </section>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-9">
          {/* FILTER */}
          <div className="flex flex-col sm:flex-row gap-3 my-6 sm:items-center">
            <div className="relative w-full sm:w-40" ref={dropdownRef}>
              <button
                onClick={() => setYearOpen(!yearOpen)}
                disabled={loading || !authorId}
                className="border border-gray-300 px-4 py-2 w-full flex justify-between items-center bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <span>
                  {selectedYear
                    ? years.find((y) => y.id === selectedYear)?.name
                    : "All Years"}
                </span>

                <span
                  className={`ml-2 transition-transform duration-200 ${
                    yearOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▾
                </span>
              </button>

              {yearOpen && (
                <div className="absolute w-full bg-white border border-gray-300 shadow-lg z-10  overflow-hidden">
                  <div
                    onClick={() => handleYearSelect(null)}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    All Years
                  </div>
                  {years.map((year) => (
                    <div
                      key={year.id}
                      onClick={() => handleYearSelect(Number(year.id))}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm  border-gray-100"
                    >
                      {year.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleApplyFilter}
              disabled={loading || !authorId}
              className="bg-[#c9060a] lg:w-44 text-white px-6 py-2 hover:bg-[#333] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Filter
            </button>
          </div>

          {/* EMPTY STATE */}
          {!authorId ? (
            <div className="py-20 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg mb-2">Author not found</p>
              <p className="text-sm text-gray-400">
                No author found with slug {authorSlug}
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 text-lg mb-2">No articles found</p>
              <p className="text-sm text-gray-400">
                {selectedYear
                  ? `${authorTitleNormal} has not published any articles in ${
                      years.find((y) => y.id === selectedYear)?.name
                    }`
                  : `${authorTitleNormal} has not published any articles yet`}
              </p>
            </div>
          ) : (
            /* ARTICLES LIST */
            <div className="space-y-6">
              {posts.map((article) => (
                <div
                  key={article.id}
                  className="flex gap-4 border-b border-dashed border-gray-300 pb-6 last:border-b-0"
                >
                  <div className="relative w-45 h-30 shrink-0 overflow-hidden rounded">
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
                    <h3 className="text-xl font-semibold leading-tight line-clamp-2 mb-2">
                      <Link
                        href={`/${article.slug}`}
                        className="hover:text-[#c9060a] transition-colors"
                      >
                        {article.title}
                      </Link>
                    </h3>

                    <p className="text-sm text-[#333333] mb-2 border-b border-gray-200 pb-2">
                      <Link
                        href={`/author/${article.author?.slug}`}
                        className="text-[#c9060a] font-medium hover:underline"
                      >
                        {article.author?.name || authorTitleNormal}
                      </Link>{" "}
                      | {article.publish_date || "N/A"}
                    </p>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                      {article.short_description || "No description available"}
                    </p>

                    <Link
                      href={`/${article.slug}`}
                      className="text-[#c9060a] text-sm font-medium inline-flex items-center gap-1"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {lastPage > 1 && authorId && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: lastPage }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => fetchPosts(selectedYear ?? undefined, page)}
                    disabled={loading}
                    className={`px-4 py-2 rounded transition-all ${
                      currentPage === page
                        ? "bg-[#c9060a] text-white shadow-md"
                        : "border border-gray-300 hover:bg-gray-50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <RightSidebar />
      </div>
    </section>
  );
}
