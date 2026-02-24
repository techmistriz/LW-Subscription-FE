import api from "@/lib/api/axios";

// Unified Posts API - Single source of truth
interface GetPostsParams {
  search?: string;
  category_id?: number;
  year?: number;
  author_id?: number;
  magazine_id?: number;
  page?: number;
  limit?: number;
  per_page?:number;
  latest?:number;
}

// Main posts fetch - handles ALL search/filter cases
export async function getPosts({
  search,
  category_id,
  year,
  author_id,
  magazine_id,
  page = 1,
  per_page = 10,
  // latest,
}: GetPostsParams = {}) {
  const params: any = {
    page,
    per_page,
    ...(magazine_id && { magazine_id }), // Only include if exists
    ...(search && { search }),
    ...(category_id && { category_id }),
    ...(year && { year}),
    ...(author_id && { author_id }),
    // latest
  };

  // console.log("Posts API params:", params); // Debug log

  const response = await api.get("/posts", { params });
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
  category_id?: number;
  limit?: number;
}) {
  const response = await api.get("/posts", {
    params: {
      category_id: 5 ,
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


