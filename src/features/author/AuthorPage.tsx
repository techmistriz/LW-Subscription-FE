"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { toTitleCase } from "@/lib/utils/helper/toTitleCase";
import { getPosts } from "@/lib/api/services/posts";
import { getAuthors } from "@/lib/api/services/author";
import { getYears } from "@/lib/api/services/years";

import RightSidebar from "@/components/RightSidebar/RightSidebar";
import PageLoader from "@/components/Loader/PageLoader";
import Banner from "@/components/Common/Banner";
import YearFilter from "@/components/Common/YearFilter";
import PostList from "@/components/Common/PostList";
import Pagination from "@/components/Pagination/Pagination";


interface Post {
  id: number;
  slug: string;
  title: string;
  image?: string;
  author?: {
    id: number;
    name: string;
    slug: string;
  };
  publish_date?: string;
  short_description?: string;
}

const postBaseUrl = process.env.NEXT_PUBLIC_POSTS_BASE_URL || "";

export default function AuthorPage() {
  const params = useParams();
  const authorSlug = params?.author as string;
  const authorName = authorSlug?.replace(/-/g, " ") || "";
  const authorTitle = toTitleCase(authorName);

  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [years, setYears] = useState<number[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [authorId, setAuthorId] = useState<number | null>(null);

  // 🔹 Load Author
  const loadAuthor = useCallback(async () => {
    if (!authorSlug) return;

    try {
      const authors = await getAuthors();
      const matched = authors.find((a) => a.slug === authorSlug);
      setAuthorId(matched?.id ?? null);
    } catch (error) {
      console.error("Failed to load author:", error);
      setAuthorId(null);
    }
  }, [authorSlug]);

  // 🔹 Fetch Posts
  const fetchPosts = useCallback(
    async (page: number = 1, year: number | null = null) => {
      if (!authorId) return;

      setLoading(true);

      try {
        const response = await getPosts({
          author_id: authorId,
          page,
          ...(year ? { year } : {}),
        });

        setPosts(response.data ?? []);
        setLastPage(response.meta?.paging?.last_page ?? 1);
        setCurrentPage(page);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
        setLastPage(1);
      } finally {
        setLoading(false);
      }
    },
    [authorId],
  );

  // 🔹 Load Years
  const loadYears = useCallback(async () => {
    try {
      const data = await getYears();
      setYears(data ?? []);
    } catch (error) {
      console.error("Failed to load years:", error);
    }
  }, []);

  useEffect(() => {
    loadAuthor();
    loadYears();
  }, [loadAuthor, loadYears]);

  useEffect(() => {
    if (authorId) {
      fetchPosts(1);
    }
  }, [authorId, fetchPosts]);

  // 🔹 Apply Filter (Manual)
  const handleApplyFilter = () => {
    fetchPosts(1, selectedYear);
  };

  return (
    <section className="bg-white">
      <Banner title={authorName} />

      <div className="max-w-6xl mx-auto px-4 my-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9">
          <YearFilter
            years={years}
            selectedYear={selectedYear}
            onSelect={setSelectedYear}
            onApply={handleApplyFilter}
            // disabled={loading || !authorId}
          />

          {/* CONTENT AREA */}
          {loading ? (
            <PageLoader />
          ) : !authorId ? (
            <div className="py-10 text-center text-gray-200">loading..</div>
          ) : (
            <>
              <PostList
                posts={posts}
                fallbackAuthorName={authorTitle}
                postBaseUrl={postBaseUrl}
                loading={loading}
                emptyMessage={
                  selectedYear
                    ? `${authorTitle} has not published any posts in ${
                        years.find((y) => y === selectedYear)
                      }`
                    : `${authorTitle} has not published any posts yet`
                }
              />

              {lastPage > 1 && (
                <Pagination
                  currentPage={currentPage}
                  lastPage={lastPage}
                  loading={loading}
                  onPageChange={(page) => fetchPosts(page, selectedYear)}
                />
              )}
            </>
          )}
        </div>

        <RightSidebar />
      </div>
    </section>
  );
}
