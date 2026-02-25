"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { toTitleCase } from "@/lib/utils/helper/toTitleCase";
import { getPosts } from "@/lib/api/services/posts";
import { getAuthors } from "@/lib/api/services/author";
import { getYears } from "@/lib/api/services/years";

import PageLoader from "@/components/Loader/PageLoader";
import YearFilter from "@/components/Common/YearFilter";
import PostList from "@/components/Common/PostList";
import Pagination from "@/components/Pagination/Pagination";
import { Post } from "@/types/models";

// Post interface matching your API + Author normalization
// interface Post {
//   id: number;
//   slug: string;
//   title: string;
//   image?: string;
//   publish_date?: string;
//   short_description?: string;
//   author?:
//     | {
//         id: number;
//         name: string;
//         slug: string;
//         linkedin: string; // ensure linkedin exists
//       }
//     | string;
// }

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

  // Load Author
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

  // Fetch Posts
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

        // Normalize posts so each author has a linkedin
        const normalizedPosts = (response.data ?? []).map((post: Post) => ({
          ...post,
          author:
            post.author && typeof post.author !== "string"
              ? { ...post.author, linkedin: post.author.linkedin || "" }
              : post.author,
        }));

        setPosts(normalizedPosts);
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

  // Load Years
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

  // Apply Year Filter
  const handleApplyFilter = () => {
    fetchPosts(1, selectedYear);
  };

  const postsWithContent: Post[] = posts.map((p) => ({
    ...p,
    content: p.content ? <>{p.content}</> : <></>,
  }));

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
        ) : !authorId ? (
          <div className="py-10 text-center text-gray-200">loading..</div>
        ) : (
          <>
            <PostList
              posts={postsWithContent} //  mapped with content
              fallbackAuthorName={authorTitle}
              postBaseUrl={postBaseUrl}
              loading={loading}
              emptyMessage={
                selectedYear
                  ? `${authorTitle} has not published any posts in ${selectedYear}`
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
    </section>
  );
}
