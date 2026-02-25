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

export const getHeroPost = async () => {
  const response = await api.get("/posts", {
    params: {
      is_featured_post: 1,
     
    },
  });
  return response.data?.data || [];
};

