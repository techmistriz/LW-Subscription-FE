import api from "@/network/axios";
import type { Post } from "@/types/models";

export const getHeroPost = async (): Promise<Post[]> => {
  const response = await api.get("/posts", {
    params: { is_featured_post: 1 },
  });
  return response.data?.data || [];
};
