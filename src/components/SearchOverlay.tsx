"use client";

import { AuthorListItem, Year } from "@/types";
import { X, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { getYears } from "@/lib/api/services/years";
import { getAuthors } from "@/lib/api/services/author";
import { getCategories } from "@/lib/api/services/categories";
import { getPosts } from "@/lib/api/services/posts";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

/**
 * SearchOverlay component provides advanced search functionality
 * with title search and filter options for years, categories, and authors
 */
export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const router = useRouter();

  // Form state
  const [titleSearch, setTitleSearch] = useState("");
  const [yearId, setYearId] = useState<number | undefined>();
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [authorId, setAuthorId] = useState<number | undefined>();

  // Data state
  const [years, setYears] = useState<Year[]>([]);
  const [authors, setAuthors] = useState<AuthorListItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Load filter options on component mount
  useEffect(() => {
    async function loadFilterOptions() {
      setLoading(true);
      try {
        const [yearsRes, authorsRes, categoriesRes] = await Promise.all([
          getYears(),
          getAuthors(),
          getCategories(),
        ]);
        setYears(yearsRes || []);
        setAuthors(authorsRes || []);
        setCategories(categoriesRes || []);
      } finally {
        setLoading(false);
      }
    }

    if (open) {
      loadFilterOptions();
    }
  }, [open]);

  // Handle title search submission
  const handleTitleSearch = useCallback(() => {
    if (!titleSearch.trim()) return;

    const params = new URLSearchParams();
    params.append("search", titleSearch.trim());

    setSearchLoading(true);
    onClose();
    router.push(`/archive?${params.toString()}`);
    setSearchLoading(false);
  }, [titleSearch, onClose, router]);

  // Handle filter search submission
  const handleFilterSearch = useCallback(() => {
    const params = new URLSearchParams();

    if (yearId) params.append("year_id", yearId.toString());
    if (categoryId) params.append("category_id", categoryId.toString());
    if (authorId) params.append("author_id", authorId.toString());

    onClose();
    router.push(`/archive?${params.toString()}`);
  }, [yearId, categoryId, authorId, onClose, router]);

  // Handle Enter key press for title search
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && titleSearch.trim()) {
      handleTitleSearch();
    }
  };

  // Don't render when overlay is closed
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 bg-black/90 flex items-center justify-center">
      {/* Close button */}
      <button onClick={onClose} className="absolute top-6 right-6 text-white">
        <X size={38} />
      </button>

      <div className="w-full max-w-6xl">
        {/* Title search input */}
        <div className="relative mb-6">
          <input
            value={titleSearch}
            onChange={(e) => setTitleSearch(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search here..."
            className="w-full bg-transparent border border-gray-300 text-white placeholder:text-white placeholder:text-md px-5 py-2 pr-14 text-lg outline-none"
          />

          <Search
            onClick={handleTitleSearch}
            className="absolute cursor-pointer right-5 top-1/2 -translate-y-1/2 text-white hover:scale-110 transition-transform"
          />
        </div>

        {/* Filter separator */}
        <p className="text-center text-gray-300 mb-6">or</p>

        {/* Filter controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Year filter */}
          <select
            value={yearId ?? ""}
            onChange={(e) =>
              setYearId(e.target.value ? Number(e.target.value) : undefined)
            }
            className="bg-transparent border border-gray-400 text-white px-4 py-2"
            disabled={loading}
          >
            <option className="text-black" value="">
              All Years
            </option>
            {years.map((year) => (
              <option
                key={year.id}
                value={year.id}
                className="text-white bg-black"
              >
                {year.name}
              </option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={categoryId ?? ""}
            onChange={(e) =>
              setCategoryId(e.target.value ? Number(e.target.value) : undefined)
            }
            className="bg-transparent border border-gray-400 text-white px-4 py-2"
            disabled={loading}
          >
            <option className="text-black" value="">
              All Categories
            </option>
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
                className="text-white bg-black"
              >
                {category.name}
              </option>
            ))}
          </select>

          {/* Author filter */}
          <select
            value={authorId ?? ""}
            onChange={(e) =>
              setAuthorId(e.target.value ? Number(e.target.value) : undefined)
            }
            className="bg-transparent border border-gray-400 text-white px-4 py-2"
            disabled={loading}
          >
            <option className="text-black" value="">
              All Authors
            </option>
            {authors.map((author) => (
              <option
                key={author.id}
                value={author.id}
                className="text-white bg-black"
              >
                {author.name}
              </option>
            ))}
          </select>

          {/* Search button */}
          <button
            onClick={handleFilterSearch}
            disabled={searchLoading || loading}
            className="bg-[#c9060a] text-white px-6 py-3 hover:bg-[#333] transition-colors cursor-pointer disabled:opacity-50"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
