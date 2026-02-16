import api from "@/lib/api/axios";

// Unified Posts API - Single source of truth
interface GetPostsParams {
  search?: string;
  category_id?: number;
  year_id?: number;
  author_id?: number;
  magazine_id?: number;
  page?: number;
  limit?: number;
  per_page?:number
}

// Main posts fetch - handles ALL search/filter cases
export async function getPosts({
  search,
  category_id,
  year_id: yearId,
  author_id,
  magazine_id,
  page = 1,
  per_page = 5,
}: GetPostsParams = {}) {
  const params: any = {
    page,
    per_page,
    ...(magazine_id && { magazine_id }), // Only include if exists
    ...(search && { search }),
    ...(category_id && { category_id }),
    ...(yearId && { year_id: yearId }),
    ...(author_id && { author_id }),
  };

  // console.log("Posts API params:", params); // Debug log

  const response = await api.get("/posts", { params });

  // console.log("Posts API response:", response.data);
  return response.data;
}

// Single article by slug
export async function getArticleBySlug(slug: string) {
  try {
    const response = await api.get(`/posts/${slug}`);
    return response.data.data || response.data.post || response.data;
  } catch (error) {
    console.error("getArticleBySlug error:", error);
    return null;
  }
}

// Single article by ID
export async function getArticleById(id: number) {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data.post || response.data.data || response.data;
  } catch (error: any) {
    console.error("getArticleById failed:", error.response?.status);
    return null;
  }
}

// Magazine posts (no pagination)
export async function getPostsByMagazine(magazineId: number) {
  const res = await api.get("/posts", {
    params: { magazine_id: magazineId },
  });
  return res.data.data || [];
}

// Related posts (limited)
export async function getRelatedPosts(params: {
  category_id?: number;
  author_id?: number;
  magazine_id?: number;
}) {
  const response = await api.get("/posts", {
    params: {
      ...params,
      limit: 10,
    },
  });
  return response.data?.data || [];
}

// Editor picks posts (limited 5)
export async function getEditorPicksPosts(params?: {
  search?: string;
  limit?: number;
}) {
  const response = await api.get("/posts", {
    params: {
      search: params?.search ?? "Editor's Pick",
      limit: params?.limit ?? 5,
      latest: 1,
    },
  });

  return response.data?.data || [];
}

export interface Magazine {
  image: string;
  id: number;
  title: string;
  slug: string;
  featured_image: string;
  created_at: string;
  category?: {
    name: string;
  };
}

export async function getLatestSinglePosts(): Promise<Magazine | null> {
  try {
    const response = await api.get("/posts", {
      params: {
        page: 1,
        limit: 1,
        sort: "created_at",
        latest: 1,
      },
    });

    const result = response.data;

    // Adjust according to your backend structure
    const posts = result?.data?.data ?? result?.data ?? result ?? [];
    // console.log(posts[0]);
    return posts[0] ?? null; //  return first latest post
  } catch (error) {
    console.error("Error fetching latest post:", error);
    return null;
  }
}

// Article interface
export interface Article {
  id: number;
  title: string;
  search: string;
  slug: string;
  author_id: number;
  author_slug?: string;
  content: string;
  published_at: string;
  image?: string;
  short_description?: string;
  excerpt?: string;
  publish_date?: string;
  category?: ArticleCategory;
  author?: Author | string;
}

export interface ArticleCategory {
  id: number;
  name: string;
  slug?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Author {
  id: number;
  name: string;
  slug?: string;
}
