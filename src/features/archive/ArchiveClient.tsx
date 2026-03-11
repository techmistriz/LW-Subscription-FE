"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getPosts } from "@/lib/api/services/posts";
import { getYears } from "@/lib/api/services/years";
import { getAuthors } from "@/lib/api/services/author";
import { getCategories } from "@/lib/api/services/categories";
import Pagination from "@/components/Pagination/Pagination";
import { Year, Article, Author, Category, Post } from "@/types";
import { PaginationMeta } from "@/types/api";
import PostList from "@/components/Common/PostList";
import { Search } from "lucide-react";

export default function ArchivePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ---------------- URL PARAMS ---------------- */

  const searchTerm = searchParams.get("search") || "";
  const mode = searchParams.get("mode");

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

  const isTitleSearch = mode === "search" || !!searchTerm;

  /* ---------------- STATE ---------------- */

  const [articles, setArticles] = useState<Article[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState(searchTerm);

  const [selectedYearId, setSelectedYearId] = useState<number | undefined>(
    year,
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(categoryId);
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | undefined>(
    authorId,
  );

  const totalPages = meta?.paging?.last_page ?? 1;

  /* ---------------- SYNC SEARCH INPUT ---------------- */

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  /* ---------------- LOAD FILTER DATA ---------------- */

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

  useEffect(() => {
    loadFilterData();
  }, [loadFilterData]);

  /* ---------------- FETCH ARTICLES ---------------- */

  const fetchArticles = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getPosts({
        search: searchTerm.trim() || undefined,
        year,
        category_id: categoryId,
        author_id: authorId,
        page: currentPage,
      });

      setArticles(response.data || []);
      setMeta(response.meta || undefined);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, year, categoryId, authorId, currentPage]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  /* ---------------- SEARCH HANDLER ---------------- */

  const handleArchiveSearch = () => {
    const params = new URLSearchParams();

    params.set("mode", "search"); // always keep search mode

    if (searchInput.trim()) {
      params.set("search", searchInput.trim());
    }

    router.push(`/archive?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleArchiveSearch();
  };

  /* ---------------- FILTER HANDLER ---------------- */

  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    if (selectedYearId) params.set("year", selectedYearId.toString());
    if (selectedCategoryId)
      params.set("category_id", selectedCategoryId.toString());
    if (selectedAuthorId) params.set("author_id", selectedAuthorId.toString());

    router.push(`/archive?${params.toString()}`);
  };

  /* ---------------- MAP POSTS ---------------- */

  const posts: Post[] = articles.map((a) => ({
    ...a,
    content: a.content ? <>{a.content}</> : <></>,
  }));

  /* ---------------- UI ---------------- */

  return (
    <>
      {/* SEARCH OR FILTER UI */}

      {isTitleSearch ? (
        /* SEARCH BAR UI */
        <div className="flex items-center gap-3 mt-5 -mb-1 pb-2 border-gray-300  max-w-4xl">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search here..."
            className="flex-1 bg-transparent outline-none text-md  text-gray-800"
          />
          <Search
            onClick={handleArchiveSearch}
            className="text-gray-700 size-5 cursor-pointer"
          />
        </div>
      ) : (
        /* FILTER UI */
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
            className="bg-[#c9060a] text-white px-6 py-2 font-semibold cursor-pointer"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      )}

      {/* POSTS */}

      <PostList
        posts={posts}
        loading={loading}
        postBaseUrl={process.env.NEXT_PUBLIC_POSTS_BASE_URL || ""}
        emptyMessage={
          searchTerm ? `No results for "${searchTerm}"` : "No posts found."
        }
      />

      {/* PAGINATION */}

      {!loading && articles.length > 0 && (
        <Pagination
          currentPage={currentPage}
          lastPage={totalPages}
          loading={loading}
          onPageChange={(page) => {
            const params = new URLSearchParams(searchParams.toString());

            params.set("page", page.toString());

            if (isTitleSearch) {
              params.set("mode", "search");
            }

            router.push(`/archive?${params.toString()}`);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </>
  );
}
