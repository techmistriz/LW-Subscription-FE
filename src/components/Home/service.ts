import api from "@/lib/api/axios";
import { Author } from "@/types";
import { Category } from "@/types";

export interface Post {
  id: number;
  title: string;
  slug?: string;
  image?: string; 
  publish_date?: string;
  category?: Category;
  author?: Author;
}

export const get1LatestPost = async () => {
  const response = await api.get("/posts", {
    params: {
      limit: 1,
      latest: 1,
    },
  });

  return response.data?.data?.[0] || response.data?.[0] || null;
};

export const get2LatestPost = async () => {
  const response = await api
    .get("/posts", {
      params: {
        limit: 2,
        latest: 1,
        skip_limit: 1,
      },
    })

  return response?.data?.data || [];
};

export const get4LatestPost = async () => {
  const response = await api.get("/posts", {
    params: {
      limit: 4,
      latest: 1,
      skip_limit: 3,
    },
  });

  return response?.data?.data || [];
};
