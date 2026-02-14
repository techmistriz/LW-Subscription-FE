"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { getPosts } from "@/lib/api/services/posts";
import { getYears } from "@/lib/api/services/years";
import { getAuthors } from "@/lib/api/services/author";
import { getCategories } from "@/lib/api/services/categories";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import Pagination from "@/components/Pagination/Pagination";
import {
  Year,
  Article,
  Author,
  PaginationMeta,
  Category,
  ArticleCategory,
} from "@/types";
import PageLoader from "@/components/Loader/PageLoader";

/**
 * ArchivePage component - Displays articles with filtering by year, category, author, and search
 * Supports pagination and maintains URL state for all filters
 */
export default function ArchivePage() {
  // HOOKS
  const params = useParams<{ slug?: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSlug = params.slug as string | undefined;

  // STATE
  const [articles, setArticles] = useState<Article[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [loading, setLoading] = useState(false);

  // Parse URL parameters
  const yearId = searchParams.get("year_id")
    ? Number(searchParams.get("year_id"))
    : undefined;
  const categoryId = searchParams.get("category_id")
    ? Number(searchParams.get("category_id"))
    : undefined;
  const authorId = searchParams.get("author_id")
    ? Number(searchParams.get("author_id"))
    : undefined;
  const currentPage = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("search") || "";

  // Local filter state for UI controls
  const [selectedYearId, setSelectedYearId] = useState<number | undefined>(
    yearId,
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(categoryId);
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | undefined>(
    authorId,
  );

  // COMPUTED VALUES
  const hasActiveFilters =
    selectedYearId || selectedCategoryId || selectedAuthorId || searchTerm;
  const totalPages = meta?.paging?.last_page ?? 1;

  // UTILITY FUNCTIONS
  const capitalizeFirst = (str: string = "") =>
    str.charAt(0).toUpperCase() + str.slice(1);
  const capitalizeAll = (str: string = "") => str.toUpperCase();

  const getCategorySlug = (category?: ArticleCategory) =>
    typeof category === "string" ? category : category?.slug || "";

  const getAuthorSlug = (author?: Author | string) =>
    typeof author === "string"
      ? author
      : (author?.slug ?? author?.name ?? "admin");

  const getPostImageUrl = (image?: string) =>
    !image
      ? "/placeholder.jpg"
      : image.startsWith("http")
        ? image
        : `${process.env.NEXT_PUBLIC_POSTS_BASE_URL}/${image}`;

  const bannerImg: React.CSSProperties = {
    backgroundImage: `url(${process.env.NEXT_PUBLIC_BANNER_BASE_URL})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  // DATA FETCHING FUNCTIONS
  /**
   * Load filter dropdown options (years, authors, categories) once on mount
   */
  const loadFilterData = useCallback(async () => {
    try {
      const [yearsRes, authorsRes, categoriesRes] = await Promise.all([
        getYears(),
        getAuthors(),
        getCategories(),
      ]);
      setYears(yearsRes.data || []);
      setAuthors(authorsRes || []);
      setCategories(categoriesRes || []);
    } catch (error) {
      console.error("Failed to load filter data:", error);
    }
  }, []);

  /**
   * Fetch articles based on current filters/search/page
   */
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Search takes precedence
      if (searchTerm.trim()) {
        const response = await getPosts({
          search: searchTerm.trim(),
          page: currentPage,
        });
        setArticles(response.data || []);
        setMeta(response.meta || undefined);
        return;
      }

      // 2. Filters (year/category/author)
      if (yearId || categoryId || authorId) {
        const response = await getPosts({
          year_id: yearId,
          category_id: categoryId,
          author_id: authorId,
          page: currentPage,
        });
        setArticles(response.data || []);
        setMeta(response.meta || undefined);
        return;
      }

      // 3. Default: all posts with pagination
      const response = await getPosts({
        page: currentPage,
      });
      setArticles(response.data || []);
      setMeta(response.meta || undefined);
    } catch (error) {
      console.error("Fetch articles error:", error);
      setArticles([]);
      setMeta(undefined);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, yearId, categoryId, authorId, currentPage]);

  /**
   * Clear all filters and navigate to default archive view
   */
  const handleClearFilters = () => {
    setLoading(true);
    setSelectedYearId(undefined);
    setSelectedCategoryId(undefined);
    setSelectedAuthorId(undefined);
    router.push("/archive");
  };

  /**
   * Apply selected filters to URL params and trigger fetch
   */
  const handleApplyFilters = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedYearId) params.set("year_id", selectedYearId.toString());
    if (selectedCategoryId)
      params.set("category_id", selectedCategoryId.toString());
    if (selectedAuthorId) params.set("author_id", selectedAuthorId.toString());
    router.push(`/archive?${params.toString()}`);
  };

  // EFFECTS
  // Load filter options once on mount
  useEffect(() => {
    loadFilterData();
  }, [loadFilterData]);

  // Fetch articles when URL params change
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <section className="bg-white">
      {/* Banner Section */}
      <section className="py-12 bg-cover bg-center" style={bannerImg}>
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">
            {capitalizeAll(urlSlug ?? "archive")}
          </h1>
          <p className="text-sm text-gray-200">
            <Link href="/" className="text-[#c9060a]">
              Home
            </Link>{" "}
            | {capitalizeFirst(urlSlug ?? "archive")}
          </p>
        </div>
      </section>

      {/* Filter Controls */}
      <div className="max-w-6xl px-4 mx-auto py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {/* Year Filter */}
        <select
          value={selectedYearId?.toString() ?? ""}
          onChange={(e) =>
            setSelectedYearId(
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
          className="bg-white border border-gray-300 px-4 py-2"
          disabled={loading}
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year.id} value={year.id}>
              {year.name}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategoryId?.toString() ?? ""}
          onChange={(e) =>
            setSelectedCategoryId(
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
          className="bg-white border border-gray-300 px-4 py-2"
          disabled={loading}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Author Filter */}
        <select
          value={selectedAuthorId?.toString() ?? ""}
          onChange={(e) =>
            setSelectedAuthorId(
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
          className="bg-white border border-gray-300 px-4 py-2"
          disabled={loading}
        >
          <option value="">All Authors</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>

        {/* Search Button */}
        <button
          onClick={handleApplyFilters}
          className="bg-[#c9060a] cursor-pointer text-white px-8 py-2 font-semibold transition-all min-w-25"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>

        {/* Clear Button */}
        <button
          onClick={handleClearFilters}
          className="bg-gray-500 text-white px-8 py-2 transition-all cursor-pointer"
          disabled={loading || !hasActiveFilters}
        >
          Clear
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-4 py-12">
        {/* Articles List */}
        <div className="lg:col-span-9 space-y-6 relative">
          {/* First Load Full Loader */}
          {loading && articles.length === 0 ? (
            <PageLoader />
          ) : articles.length === 0 ? (
            <div className="text-center py-10">No articles found.</div>
          ) : (
            articles.map((article) => (
              <article
                key={article.id}
                className="flex gap-4 border-b border-dashed border-gray-300 pb-6 last:border-b-0"
              >
                {/* Article Image */}
                <div className="relative w-45 h-30 shrink-0 overflow-hidden rounded">
                  <Link href={`/${article.slug}`}>
                    <Image
                      src={getPostImageUrl(article.image)}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="180px"
                    />
                  </Link>
                </div>

                {/* Article Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold leading-tight line-clamp-2 mb-2">
                    <Link
                      href={`/category/${getCategorySlug(article.category)}/${article.slug}`}
                    >
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-[#333333] border-b border-gray-300 text-sm py-1 mb-3">
                    <Link
                      href={`/author/${getAuthorSlug(article.author)}`}
                      className="text-[#c9060a] font-medium"
                    >
                      {typeof article.author === "string"
                        ? article.author
                        : (article.author?.name ?? "Admin")}
                    </Link>{" "}
                    | {article.publish_date || "N/A"}
                  </p>

                  <p className="text-[#333333] line-clamp-2 text-sm leading-relaxed mb-4">
                    {article.short_description ||
                      article.excerpt ||
                      "No description available."}
                  </p>

                  <Link
                    href={`/${article.slug}`}
                    className="text-[#c9060a] text-sm font-medium"
                  >
                    Read More
                  </Link>
                </div>
              </article>
            ))
          )}

          {/* Pagination */}
          {!loading && articles.length > 0 && (
            <Pagination
              currentPage={currentPage}
              lastPage={totalPages}
              loading={loading}
            />
          )}
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </section>
  );
}
