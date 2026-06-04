import { request } from "@/lib/api/request";
import { Author } from "@/types";

/*----------------- GET ALL AUTHORS -----------------*/
export async function getAuthors(): Promise<Author[]> {
  const response = await request<any>("GET", "/authors");

  if (!response?.status) return [];

  const authors = response.data?.data ?? [];
  return authors;
}
