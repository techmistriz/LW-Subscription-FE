"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getPosts } from "@/lib/api/services/posts";
import { getYears } from "@/lib/api/services/years";
import { getAuthors } from "@/lib/api/services/author";
import { getCategories } from "@/lib/api/services/categories";
import Pagination from "@/components/Pagination/Pagination";
import { Year, Article, Author, Category } from "@/types";
import { Post } from "@/types";
import { ReactNode } from "react";
import { PaginationMeta } from "@/types/api";
import PostList from "@/components/Common/PostList";

export default function ArchivePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [articles, setArticles] = useState<Article[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [loading, setLoading] = useState(false);

  // URL Params
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

  // Local state for dropdowns
  const [selectedYearId, setSelectedYearId] = useState<number | undefined>(
    year,
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(categoryId);
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | undefined>(
    authorId,
  );

  const hasActiveFilters =
    selectedYearId || selectedCategoryId || selectedAuthorId || searchTerm;
  const totalPages = meta?.paging?.last_page ?? 1;

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

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPosts({
        search: searchTerm.trim() || undefined,
        year: year,
        category_id: categoryId,
        author_id: authorId,
        page: currentPage,
      });
      setArticles(response.data || []);
      setMeta(response.meta || undefined);
    } catch (error) {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, year, categoryId, authorId, currentPage]);

  useEffect(() => {
    loadFilterData();
  }, [loadFilterData]);
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (selectedYearId) params.set("year", selectedYearId.toString());
    if (selectedCategoryId)
      params.set("category_id", selectedCategoryId.toString());
    if (selectedAuthorId) params.set("author_id", selectedAuthorId.toString());
    router.push(`/archive?${params.toString()}`);
  };

  // const handleClearFilters = () => {
  //   setSelectedYearId(undefined);
  //   setSelectedCategoryId(undefined);
  //   setSelectedAuthorId(undefined);
  //   router.push("/archive");
  // };


const posts: Post[] = articles.map(a => ({
  ...a,
  content: a.content ? <>{a.content}</> : <></>, // ensure content is always ReactNode
}));

  return (
    <>
      {/* Filter Controls Wrapper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 w-max lg:grid-cols-4 gap-2 mb-4">
        <select
          value={selectedYearId?.toString() ?? ""}
          onChange={(e) =>
            setSelectedYearId(
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
          className="bg-white border border-gray-300 px-2 py-2 outline-none"
        >
          <option value="">Select Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          value={selectedCategoryId?.toString() ?? ""}
          onChange={(e) =>
            setSelectedCategoryId(
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
          className="bg-white border border-gray-300 px-2 py-2 outline-none"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={selectedAuthorId?.toString() ?? ""}
          onChange={(e) =>
            setSelectedAuthorId(
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
          className="bg-white border border-gray-300 px-2 py-2 outline-none"
        >
          <option value="">Select Author</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleApplyFilters}
          className="bg-[#c9060a] text-white px-6 py-2 font-semibold hover:bg-[#c9060a] transition-colors w-65 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>

        {/* <button
          onClick={handleClearFilters}
          className="bg-gray-500 text-white px-8 py-2 hover:bg-gray-600 transition-colors"
          disabled={loading || !hasActiveFilters}
        >
          Clear
        </button> */}
      </div>

    <PostList
  posts={posts} // ✅ use mapped array
  loading={loading}
  postBaseUrl={process.env.NEXT_PUBLIC_POSTS_BASE_URL || ""}
  emptyMessage={
    searchTerm ? `No results for "${searchTerm}"` : "No posts found."
  }
/>

      {!loading && articles.length > 0 && (
        <Pagination
          currentPage={currentPage}
          lastPage={totalPages}
          loading={loading}
          onPageChange={(page) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", page.toString());
            router.push(`/archive?${params.toString()}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </>
  );
}
