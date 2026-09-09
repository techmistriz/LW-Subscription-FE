import api from "@/lib/api/axios";
import type { Post } from "@/types"; // Magazine import removed, duplicate hata diya

interface GetPostsParams {
  search?: string;
  category_id?: number;
  year?: number;
  author_id?: number;
  magazine_id?: number;
  tag_id?: number;
  page?: number;
  per_page?: number;
}

export async function getPosts({
  page = 1,
  per_page = 10,
  ...filters
}: GetPostsParams = {}) {
  const params = { page, per_page, ...filters };
  const response = await api.get("/posts", { params });
  return response.data;
}

export async function getArticleBySlug(slug: string) {
  const response = await api.get(`/posts/${slug}`);
  const data = response.data;
  return data?.data ?? data?.post ?? data;
}

export async function getRelatedPosts(params: {
  category_id?: number;
  author_id?: number;
  magazine_id?: number;
}) {
  const response = await api.get("/posts", {
    params: { ...params, limit: 10 },
  });
  return response.data?.data || [];
}

export async function getEditorPicksPosts(params?: {
  category_id?: number;
  limit?: number;
}) {
  const response = await api.get("/posts", {
    params: { category_id: 5, limit: params?.limit ?? 5, latest: 1 },
  });
  return response.data?.data || [];
}
