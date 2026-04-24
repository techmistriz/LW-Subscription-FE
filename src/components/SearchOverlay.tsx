"use client";

import { AuthorListItem, Year } from "@/types";
import { X, Search, ChevronDown } from "lucide-react"; // Added ChevronDown
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { getYears } from "@/lib/api/services/years";
import { getAuthors } from "@/lib/api/services/author";
import { getCategories } from "@/lib/api/services/categories";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const router = useRouter();

  /*----------------- Form state -----------------*/
  const [titleSearch, setTitleSearch] = useState("");
  const [year, setYearId] = useState<number | undefined>();
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [authorId, setAuthorId] = useState<number | undefined>();

  /*----------------- Data state -----------------*/
  const [years, setYears] = useState<any[]>([]);
  const [authors, setAuthors] = useState<AuthorListItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  /*----------------- UI state for rotation -----------------*/
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

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

  const handleTitleSearch = useCallback(() => {
    const params = new URLSearchParams();
    params.set("mode", "search");
    const value = titleSearch.trim();
    if (value) {
      params.set("search", value);
      if (/^\d{4}$/.test(value)) {
        params.set("year", value);
      }
    }
    if (year) params.append("year", year.toString());
    if (categoryId) params.append("category_id", categoryId.toString());
    if (authorId) params.append("author_id", authorId.toString());

    onClose();
    router.push(`/archive?${params.toString()}`);
  }, [titleSearch, year, categoryId, authorId, onClose, router]);

  const handleFilterSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (categoryId) params.append("category_id", categoryId.toString());
    if (authorId) params.append("author_id", authorId.toString());

    onClose();
    router.push(`/archive?${params.toString()}`);
  }, [year, categoryId, authorId, onClose, router]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleTitleSearch();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white cursor-pointer hover:text-gray-300"
      >
        <X size={38} />
      </button>

      <div className="w-full max-w-6xl px-4">
        <div className="relative mb-6">
          <input
            value={titleSearch}
            onChange={(e) => setTitleSearch(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search here..."
            className="w-full bg-transparent border border-gray-300 text-white placeholder:text-white px-5 py-2 pr-14 text-lg focus:outline-none hover:bg-white/15"
          />
          <Search
            onClick={handleTitleSearch}
            className="absolute cursor-pointer right-5 top-1/2 -translate-y-1/2 text-white hover:scale-110 transition-transform"
          />
        </div>

        <p className="text-center text-gray-300 mb-6">or</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* --- Year Filter --- */}
          <div className="relative h-[48px]">
            <select
              value={year ?? ""}
              onFocus={() => setActiveField("year")}
              onBlur={() => setActiveField(null)}
              onChange={(e) => {
                setYearId(e.target.value ? Number(e.target.value) : undefined);
                setActiveField(null); // Reset rotation on selection
                e.target.blur();
              }}
              className="w-full h-full bg-transparent border border-gray-400 text-white px-4 py-2 appearance-none cursor-pointer focus:outline-none relative z-10"
              disabled={loading}
              style={{ WebkitAppearance: "none", MozAppearance: "none" }}
            >
              <option className="text-black" value="">
                Select Year
              </option>
              {years.map((y: any) => (
                <option key={y} value={y} className="text-white bg-black">
                  {y}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-20">
              <ChevronDown
                size={18}
                className={`text-white transition-transform duration-300 
            ${activeField === "year" ? "rotate-180" : "rotate-0"}`}
              />
            </div>
          </div>

          {/* --- Category Filter --- */}
          <div className="relative h-[48px]">
            <select
              value={categoryId ?? ""}
              onFocus={() => setActiveField("category")}
              onBlur={() => setActiveField(null)}
              onChange={(e) => {
                setCategoryId(
                  e.target.value ? Number(e.target.value) : undefined,
                );
                setActiveField(null);
                e.target.blur();
              }}
              className="w-full h-full bg-transparent border border-gray-400 text-white px-4 py-2 appearance-none cursor-pointer focus:outline-none relative z-10"
              disabled={loading}
              style={{ WebkitAppearance: "none", MozAppearance: "none" }}
            >
              <option className="text-black" value="">
                Select Category
              </option>
              {categories.map((cat) => (
                <option
                  key={cat.id}
                  value={cat.id}
                  className="text-white bg-black"
                >
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-20">
              <ChevronDown
                size={18}
                className={`text-white transition-transform duration-300 
            ${activeField === "category" ? "rotate-180" : "rotate-0"}`}
              />
            </div>
          </div>

          {/* --- Author Filter --- */}
          <div className="relative h-[48px]">
            <select
              value={authorId ?? ""}
              onFocus={() => setActiveField("author")}
              onBlur={() => setActiveField(null)}
              onChange={(e) => {
                setAuthorId(
                  e.target.value ? Number(e.target.value) : undefined,
                );
                setActiveField(null);
                e.target.blur();
              }}
              className="w-full h-full bg-transparent border border-gray-400 text-white px-4 py-2 appearance-none cursor-pointer focus:outline-none relative z-10"
              disabled={loading}
              style={{ WebkitAppearance: "none", MozAppearance: "none" }}
            >
              <option className="text-black" value="">
                Select Author
              </option>
              {authors.map((auth) => (
                <option
                  key={auth.id}
                  value={auth.id}
                  className="text-white bg-black"
                >
                  {auth.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-20">
              <ChevronDown
                size={18}
                className={`text-white transition-transform duration-300 
            ${activeField === "author" ? "rotate-180" : "rotate-0"}`}
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleFilterSearch}
            className="bg-[#c9060a] text-white text-xl px-6 py-2 h-[48px] hover:bg-[#333] transition-colors cursor-pointer font-medium"
          >
            FILTER
          </button>
        </div>
      </div>
    </div>
  );
}
