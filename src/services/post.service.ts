import { CONTENT, PAGINATION } from "@/config/constants";
import api from "@/network/axios";
import { cache } from "react";

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
  page = PAGINATION.DEFAULT_PAGE,
  per_page = PAGINATION.DEFAULT_LIMIT,
  ...filters
}: GetPostsParams = {}) {
  const params = { page, per_page, ...filters };
  const response = await api.get("/posts", { params });
  return response.data;
}

export const getArticleBySlug = cache(async (slug: string) => {
  const response = await api.get(`/posts/${slug}`);
  const data = response.data;

  if (!data?.status || !data?.data) {
    return null;
  }

  return data.data;
});

export async function getRelatedPosts(params: {
  category_id?: number;
  author_id?: number;
  magazine_id?: number;
}) {
  const response = await api.get("/posts", {
    params: { ...params, limit: PAGINATION.DEFAULT_LIMIT },
  });
  return response.data?.data || [];
}

export async function getEditorPicksPosts(params?: {
  category_id?: number;
  limit?: number;
}) {
  const response = await api.get("/posts", {
    params: {
      category_id: CONTENT.EDITOR_PICKS_CATEGORY_ID,
      limit: params?.limit ?? PAGINATION.EDITOR_PICKS_LIMIT,
      latest: 1,
    },
  });
  return response.data?.data || [];
}
