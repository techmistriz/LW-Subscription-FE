"use client";

import {
  useParams,
  useSearchParams,
  useRouter,
  usePathname,
} from "next/navigation";

import { useState, useEffect, useCallback } from "react";

import { getPosts } from "@/lib/api/services/posts";
import { getYears } from "@/lib/api/services/years";

import PageLoader from "@/components/Loader/PageLoader";
import YearFilter from "@/components/Common/YearFilter";
import PostList from "@/components/Common/PostList";
import Pagination from "@/components/Pagination/Pagination";

import { Post } from "@/types/models";

const postBaseUrl =
  process.env.NEXT_PUBLIC_POSTS_BASE_URL || "";

export default function TagPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tagId = params?.id ? Number(params.id) : null;
  const tagSlug = params?.slug as string;
  const tagTitle = tagSlug?.replace(/-/g, " ") || "";

  const yearParam = searchParams.get("year");
  const pageParam = Number(searchParams.get("page")) || 1;

  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(
    yearParam ? Number(yearParam) : null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [years, setYears] = useState<number[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastPage, setLastPage] = useState(1);

  /* ---------------- FETCH POSTS ---------------- */
  const fetchPosts = useCallback(
    async (page: number = 1, year: number | null = null) => {
      if (!tagId) return;

      setLoading(true);

      try {
        const response = await getPosts({
          tag_id: tagId, 
          page,
          ...(year ? { year } : {}),
        });

        setPosts(response.data ?? []);
        setLastPage(response.meta?.paging?.last_page ?? 1);
        setCurrentPage(page);
      } catch (error) {
        console.error("Failed to fetch tag posts:", error);
        setPosts([]);
        setLastPage(1);
      } finally {
        setLoading(false);
      }
    },
    [tagId]
  );

  /* ---------------- LOAD YEARS ---------------- */
  const loadYears = useCallback(async () => {
    try {
      const data = await getYears();
      setYears(data ?? []);
    } catch (error) {
      console.error("Failed to load years:", error);
    }
  }, []);

  useEffect(() => {
    loadYears();
  }, [loadYears]);

  useEffect(() => {
    if (!tagId) return;

    const year = yearParam ? Number(yearParam) : null;
    fetchPosts(pageParam, year);
  }, [tagId, pageParam, yearParam, fetchPosts]);

  /* ---------------- APPLY FILTER ---------------- */
  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedYear) {
      params.set("year", selectedYear.toString());
    } else {
      params.delete("year");
    }

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <section className="bg-white">
      <div className="lg:col-span-9">
        <YearFilter
          years={years}
          selectedYear={selectedYear}
          onSelect={setSelectedYear}
          onApply={handleApplyFilter}
        />

        {loading ? (
          <PageLoader />
        ) : (
          <>
            <PostList
              posts={posts} // ✅ no JSX mutation
              fallbackAuthorName={tagTitle}
              postBaseUrl={postBaseUrl}
              loading={loading}
              emptyMessage={
                selectedYear
                  ? `No posts found for ${tagTitle} in ${selectedYear}`
                  : `No posts found for ${tagTitle}`
              }
            />

            {lastPage > 1 && (
              <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                loading={loading}
                onPageChange={(page) => {
                  const params = new URLSearchParams(searchParams.toString());

                  params.set("page", page.toString());

                  if (selectedYear) {
                    params.set("year", selectedYear.toString());
                  }

                  router.push(`${pathname}?${params.toString()}`);
                }}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}