"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { toTitleCase } from "@/lib/utils/helper";
import { getPosts } from "@/lib/api/services/posts";
import { getYears } from "@/lib/api/services/years";
import { getCategoryBySlug } from "@/lib/api/services/categories";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import Pagination from "@/components/Pagination/Pagination";

const postBaseUrl = process.env.NEXT_PUBLIC_POSTS_BASE_URL || "";
const bannerImg: React.CSSProperties = {
  backgroundImage: `url(${process.env.NEXT_PUBLIC_BANNER_BASE_URL})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

/**
 * Category page displaying all articles for a specific category
 * with year filtering and pagination
 */
export default function CategoryPage() {
  const { category } = useParams();
  const categorySlug = category as string;
  const router = useRouter();

  // Derive category display names from slug
  const categoryName = categorySlug?.replace(/-/g, " ") || "";
  const categoryTitleCaps = categoryName.toUpperCase();
  const categoryTitleNormal = toTitleCase(categoryName);

  // Component state
  const [loading, setLoading] = useState(true);
  const [yearOpen, setYearOpen] = useState(false);
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [years, setYears] = useState<{ id: number; name: number }[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch posts for current category and year filter
  const fetchPosts = useCallback(
    async (year_id?: number, page: number = 1) => {
      if (!categoryId) return;

      setLoading(true);
      try {
        const response = await getPosts({
          category_id: Number(categoryId),
          year_id,
          page,
        });

        // console.log("CategoryPost Pagination META:", response.meta);

        setPosts(response.data ?? []);
        setLastPage(response.meta?.paging?.last_page ?? 1);
        setCurrentPage(page);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    },
    [categoryId],
  );

  // Load category data by slug
  useEffect(() => {
    async function loadCategory() {
      if (!categorySlug) return;

      try {
        const category = await getCategoryBySlug(categorySlug);

        if (!category?.id) {
          console.error("Category not found for slug:", categorySlug);
          router.replace("/404");
          return;
        }

        setCategoryId(Number(category.id));
      } catch (error) {
        console.error("Failed to load category:", error);
        router.replace("/404");
      }
    }

    loadCategory();
  }, [categorySlug, router]);

  // Fetch posts when category changes
  useEffect(() => {
    if (categoryId) {
      setPosts([]);
      setCurrentPage(1);
      fetchPosts(undefined, 1);
    }
  }, [categoryId, fetchPosts]);

  // Load available years for filtering
  useEffect(() => {
    async function loadYears() {
      try {
        const yearsData = await getYears();
        setYears(yearsData.data || []);
      } catch (error) {
        console.error("Failed to load years:", error);
        setYears([]);
      }
    }
    loadYears();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setYearOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Year filter handlers
  const handleYearSelect = (yearId: number | null) => {
    setSelectedYearId(yearId);
    setYearOpen(false);
  };

  const handleApplyFilter = () => {
    fetchPosts(selectedYearId ?? undefined, 1);
  };

  // Show loading state while fetching category
  if (!categoryId && loading) {
    return (
      <div className="py-20 text-center text-gray-500">Loading category...</div>
    );
  }

  // Generate image URL for posts
  const getImageUrl = (image?: string) => {
    if (!image) return "/placeholder.jpg";
    return image.startsWith("http") ? image : `${postBaseUrl}/${image}`;
  };

  const selectedYearLabel = selectedYearId
    ? years.find((y) => y.id === selectedYearId)?.name
    : null;

  return (
    <section className="bg-white">
      {/* Hero banner */}
      <section className="py-12 bg-cover bg-center" style={bannerImg}>
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-white text-xl md:text-2xl font-bold">
            {categoryTitleCaps}
          </h1>
          <p className="text-sm text-gray-200">
            <Link href="/" className="text-[#c9060a] ">
              Home
            </Link>{" "}
            | {categoryTitleNormal}
          </p>
        </div>
      </section>

      {/* Main content area */}
      <div className="max-w-6xl mx-auto px-4 py-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main content column */}
        <div className="lg:col-span-9">
          {/* Filter controls */}
          <div className="flex flex-col sm:flex-row gap-3 my-6 sm:items-center">
            <div className="relative w-full sm:w-40" ref={dropdownRef}>
              <button
                onClick={() => setYearOpen(!yearOpen)}
                className="border border-gray-300 px-4 py-2 w-full flex justify-between items-center bg-white"
              >
                {selectedYearLabel || "All Years"}
                <span>▾</span>
              </button>

              {yearOpen && (
                <div className="absolute w-full bg-white border shadow z-10 max-h-64 overflow-y-auto">
                  <div
                    onClick={() => handleYearSelect(null)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    All Years
                  </div>
                  {years.map((year) => (
                    <div
                      key={year.id}
                      onClick={() => handleYearSelect(year.id)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {year.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleApplyFilter}
              disabled={loading}
              className="border px-15 py-2 text-white bg-[#c9060a] hover:bg-[#333] cursor-pointer disabled:opacity-50"
            >
              Filter
            </button>
          </div>

          {/* Results summary */}
          <div className="mb-6 text-sm text-gray-500">
            Showing {posts.length} of {posts.length} articles
            {selectedYearLabel && ` for ${selectedYearLabel}`}
          </div>

          {/* Articles list */}
          <div className="space-y-6">
            {posts.length === 0 ? (
              <p className="col-span-full text-center text-[#333333] py-12">
                {selectedYearLabel
                  ? `No magazines found for ${selectedYearLabel}`
                  : "No magazines found"}
              </p>
            ) : (
              posts.map((article) => {
                const imageUrl = getImageUrl(article.image);

                return (
                  <div
                    key={article.id}
                    className="flex gap-4 border-b border-dashed border-gray-300 pb-6 last:border-b-0"
                  >
                    {/* Article thumbnail */}
                    <div className="relative w-45 h-30 shrink-0 overflow-hidden">
                      <Link href={`/${article.slug}`}>
                        <Image
                          src={imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="180px"
                        />
                      </Link>
                    </div>

                    {/* Article content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold leading-tight line-clamp-2 mb-2 cursor-pointer">
                        <Link
                          href={`/${article.slug}`}
                          className=" transition-colors"
                        >
                          {article.title}
                        </Link>
                      </h3>

                      <p className="text-[#333333] border-b border-gray-300 text-sm py-1 mb-3">
                        <Link
                          href={`/author/${article.author?.slug}`}
                          className="text-[#c9060a] font-medium "
                        >
                          {article.author?.name || article.author || "Admin"}
                        </Link>{" "}
                        | {article.publish_date || article.date}
                      </p>

                      <p className="text-[#333333] line-clamp-2 text-sm leading-relaxed mb-4">
                        {article.short_description || article.excerpt}
                      </p>

                      <Link
                        href={`/${article.slug}`}
                        className="text-[#c9060a] text-sm inline-flex items-center gap-1 "
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            loading={loading}
          />
        </div>

        {/* Right sidebar */}
        <RightSidebar />
      </div>
    </section>
  );
}