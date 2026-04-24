"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { toTitleCase } from "@/lib/utils/helper/toTitleCase";
import { getPosts } from "@/lib/api/services/posts";
import { getYears } from "@/lib/api/services/years";
import { getCategoryBySlug } from "@/lib/api/services/categories";
import Pagination from "@/components/Pagination/Pagination";
import { Year } from "@/types";
import PostList from "@/components/Common/PostList";
import YearFilter from "@/components/Common/YearFilter";
import { useSearchParams, useRouter } from "next/navigation";

const postBaseUrl = process.env.NEXT_PUBLIC_POSTS_BASE_URL || "";

export default function CategoryPage() {
  const { category } = useParams();
  const categorySlug = category as string;

  const categoryName = categorySlug?.replace(/-/g, " ") || "";
  const categoryTitle = toTitleCase(categoryName);

  const router = useRouter();
  const searchParams = useSearchParams();

  const yearParam = searchParams.get("year");
  const pageParam = Number(searchParams.get("page")) || 1;

  const [loading, setLoading] = useState(true);
  const [selectYear, setselectYear] = useState<number | null>(
    yearParam ? Number(yearParam) : null,
  );

  const [currentPage, setCurrentPage] = useState(pageParam);
  const [years, setYears] = useState<Year[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  /*----------------- Fetch posts -----------------*/
  const fetchPosts = useCallback(
    async (year?: number, page: number = 1) => {
      if (!categoryId) return;

      setLoading(true);

      try {
        const response = await getPosts({
          category_id: categoryId,
          year,
          page,
        });

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

  /*----------------- Load category -----------------*/
  useEffect(() => {
    async function loadCategory() {
      if (!categorySlug) return;

      setLoading(true);
      setCategoryId(null);

      try {
        const category = await getCategoryBySlug(categorySlug);

        if (!category?.id) {
          setPosts([]);
          setLoading(false);
          return;
        }

        setCategoryId(Number(category.id));
      } catch (error) {
        console.error("Failed to load category:", error);
        setPosts([]);
        setLoading(false);
      }
    }

    loadCategory();
  }, [categorySlug]);

  /*----------------- Fetch posts when categoryId changes -----------------*/
  useEffect(() => {
    if (categoryId) {
      fetchPosts(yearParam ? Number(yearParam) : undefined, pageParam);
    }
  }, [categoryId, yearParam, pageParam, fetchPosts]);

  /*----------------- Load years -----------------*/
  useEffect(() => {
    async function loadYears() {
      try {
        const yearsData = await getYears();
        setYears(yearsData || []);
      } catch (error) {
        console.error("Failed to load years:", error);
        setYears([]);
      }
    }

    loadYears();
  }, []);

  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectYear) {
      params.set("year", selectYear.toString());
    } else {
      params.delete("year");
    }

    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());

    if (selectYear) {
      params.set("year", selectYear.toString());
    }

    router.push(`?${params.toString()}`);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="bg-white">
      <YearFilter
        years={years}
        selectedYear={selectYear}
        onSelect={setselectYear}
        onApply={handleApplyFilter}
        // disabled={loading}
      />

      <PostList
        posts={posts}
        loading={loading}
        postBaseUrl={postBaseUrl}
        emptyMessage={
          selectYear
            ? `No posts available in ${years.find(
                (y) => y === selectYear,
              )} for ${categoryTitle}.`
            : `No posts available in ${categoryTitle}.`
        }
      />

      {!loading && posts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          loading={loading}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
}
