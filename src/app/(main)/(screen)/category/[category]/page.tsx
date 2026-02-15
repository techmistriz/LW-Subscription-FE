"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { toTitleCase } from "@/lib/utils/helper";
import { getPosts } from "@/lib/api/services/posts";
import { getYears } from "@/lib/api/services/years";
import { getCategoryBySlug } from "@/lib/api/services/categories";
import RightSidebar from "@/components/RightSidebar/RightSidebar";
import Pagination from "@/components/Pagination/Pagination";
import { Year } from "@/types";
import Banner from "@/components/Common/Banner";
import PostList from "@/components/Common/PostList";
import YearFilter from "@/components/Common/YearFilter";

const postBaseUrl = process.env.NEXT_PUBLIC_POSTS_BASE_URL || "";

export default function CategoryPage() {
  const { category } = useParams();
  const categorySlug = category as string;

  const categoryName = categorySlug?.replace(/-/g, " ") || "";
  const categoryTitle = toTitleCase(categoryName);

  const [loading, setLoading] = useState(true);
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [years, setYears] = useState<Year[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  // Fetch posts
  const fetchPosts = useCallback(
    async (year_id?: number, page: number = 1) => {
      if (!categoryId) return;

      setLoading(true);

      try {
        const response = await getPosts({
          category_id: categoryId,
          year_id,
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

  // Load category
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

  // Fetch posts when categoryId changes
  useEffect(() => {
    if (categoryId) {
      fetchPosts(undefined, 1);
    }
  }, [categoryId, fetchPosts]);

  // Load years
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
    fetchPosts(selectedYearId ?? undefined, 1);
  };

  const handlePageChange = (page: number) => {
    fetchPosts(selectedYearId ?? undefined, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="bg-white">
      <Banner title={categoryTitle} />

      <div className="max-w-6xl mx-auto px-4 py-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9">
          <YearFilter
            years={years}
            selectedYear={selectedYearId}
            onSelect={setSelectedYearId}
            onApply={handleApplyFilter}
            // disabled={loading}
          />

          <PostList
            posts={posts}
            loading={loading}
            postBaseUrl={postBaseUrl}
            emptyMessage={
              selectedYearId
                ? `No posts available in ${
                    years.find((y) => y.id === selectedYearId)?.name
                  } for ${categoryTitle}.`
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
        </div>

        <RightSidebar />
      </div>
    </section>
  );
}
