import { request } from "@/lib/api/request";
import type { Author } from "@/types/models";

interface AuthorsResponse {
  data?: Author[];
}

export async function getAuthors(): Promise<Author[]> {
  const response = await request<AuthorsResponse>("GET", "/authors");

  if (!response?.status) return [];

  return response.data?.data ?? [];
}
