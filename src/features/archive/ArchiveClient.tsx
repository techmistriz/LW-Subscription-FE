"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { getPosts } from "@/lib/api/services/posts";
import { getYears } from "@/lib/api/services/years";
import { getAuthors } from "@/lib/api/services/author";
import { getCategories } from "@/lib/api/services/categories";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import Pagination from "@/components/Pagination/Pagination";
import { Year, Article, Author, Category } from "@/types";
import { PaginationMeta } from "@/types/api";
import Banner from "@/components/Common/Banner";
import PostList from "@/components/Common/PostList";

/**
 * ArchivePage
 *
 * Displays all articles with:
 * - Filtering (Year, Category, Author)
 * - Search support
 * - Pagination
 * - URL state synchronization
 */
export default function ArchivePage() {

  //     ROUTER & URL PARAMS
  const params = useParams<{ slug?: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSlug = params.slug as string | undefined;

//     COMPONENT STATE
  const [articles, setArticles] = useState<Article[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [loading, setLoading] = useState(false);

   //  READ URL QUERY PARAMETERS
  const year = searchParams.get("year")
    ? Number(searchParams.get("year"))
    : undefined;

  const categoryId = searchParams.get("category_id")
    ? Number(searchParams.get("category_id"))
    : undefined;

  const authorId = searchParams.get("author_id")
    ? Number(searchParams.get("author_id"))
    : undefined;

  const currentPage = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("search") || "";

    //  LOCAL FILTER STATE (UI CONTROL)
  const [selectedYearId, setSelectedYearId] = useState<number | undefined>(year);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(categoryId);
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | undefined>(authorId);

  // Determines if any filter or search is active
  const hasActiveFilters =
    selectedYearId || selectedCategoryId || selectedAuthorId || searchTerm;

  // Total pages from API response
  const totalPages = meta?.paging?.last_page ?? 1;

    //  LOAD FILTER DROPDOWN DATA, (Runs once on mount)
  const loadFilterData = useCallback(async () => {
    try {
      const [yearsRes, authorsRes, categoriesRes] = await Promise.all([
        getYears(),
        getAuthors(),
        getCategories(),
      ]);

      setYears(yearsRes || []);
      setAuthors(authorsRes || []);
      setCategories(categoriesRes || []);
    } catch (error) {
      console.error("Failed to load filter data:", error);
    }
  }, []);

    //  FETCH ARTICLES, Runs when filters/search/page changes
  const fetchArticles = useCallback(async () => {
    setLoading(true);

    try {
      // 1️. Search takes priority over filters
      if (searchTerm.trim()) {
        const response = await getPosts({
          search: searchTerm.trim(),
          page: currentPage,
        });

        setArticles(response.data || []);
        setMeta(response.meta || undefined);
        return;
      }

      // 2️. Apply filters if present
      if (year || categoryId || authorId) {
        const response = await getPosts({
          year: year,
          category_id: categoryId,
          author_id: authorId,
          page: currentPage,
        });

        setArticles(response.data || []);
        setMeta(response.meta || undefined);
        return;
      }

      // 3. Default: fetch all posts
      const response = await getPosts({ page: currentPage });

      setArticles(response.data || []);
      setMeta(response.meta || undefined);
    } catch (error) {
      console.error("Fetch articles error:", error);
      setArticles([]);
      setMeta(undefined);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, year, categoryId, authorId, currentPage]);

    //  CLEAR FILTERS, Resets state and navigates to base archive
  const handleClearFilters = () => {
    setLoading(true);
    setSelectedYearId(undefined);
    setSelectedCategoryId(undefined);
    setSelectedAuthorId(undefined);
    router.push("/archive");
  };

    //  APPLY FILTERS, Updates URL query params
  const handleApplyFilters = () => {
    setLoading(true);
    const params = new URLSearchParams();

    if (selectedYearId) params.set("year", selectedYearId.toString());
    if (selectedCategoryId)
      params.set("category_id", selectedCategoryId.toString());
    if (selectedAuthorId)
      params.set("author_id", selectedAuthorId.toString());

    router.push(`/archive?${params.toString()}`);
  };

    
  // Load dropdown data once
  useEffect(() => {
    loadFilterData();
  }, [loadFilterData]);

  // Refetch posts when URL params change
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

   //  EMPTY STATE MESSAGE
  const emptyMessage = searchTerm
    ? `No results found for "${searchTerm}".`
    : hasActiveFilters
    ? "No posts found for the selected filters."
    : "No posts available.";

  //   RENDER
  return (
    <section className="bg-white">
      {/* Page Banner */}
      <Banner title={urlSlug ?? "archive"} />

      {/* Filter Controls */}
      <div className="max-w-6xl px-4 mx-auto py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {/* Year Filter */}
        <select
          value={selectedYearId?.toString() ?? ""}
          onChange={(e) =>
            setSelectedYearId(
              e.target.value ? Number(e.target.value) : undefined
            )
          }
          className="bg-white border border-gray-300 px-4 py-2"
          disabled={loading}
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategoryId?.toString() ?? ""}
          onChange={(e) =>
            setSelectedCategoryId(
              e.target.value ? Number(e.target.value) : undefined
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
              e.target.value ? Number(e.target.value) : undefined
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

        {/* Apply Filters Button */}
        <button
          onClick={handleApplyFilters}
          className="bg-[#c9060a] cursor-pointer text-white px-8 py-2 font-semibold transition-all min-w-25"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>

        {/* Clear Filters Button */}
        <button
          onClick={handleClearFilters}
          className="bg-gray-500 text-white px-8 py-2 transition-all cursor-pointer"
          disabled={loading || !hasActiveFilters}
        >
          Clear
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-4 py-12">
        <div className="lg:col-span-9 space-y-6 relative">
          <PostList
            posts={articles}
            loading={loading}
            postBaseUrl={process.env.NEXT_PUBLIC_POSTS_BASE_URL || ""}
            emptyMessage={emptyMessage}
          />

          {/* Pagination */}
          {!loading && articles.length > 0 && (
            <Pagination
              currentPage={currentPage}
              lastPage={totalPages}
              loading={loading}
            />
          )}
        </div>

        {/* Sidebar */}
        <RightSidebar />
      </div>
    </section>
  );
}
