import { request } from "@/network/request";
import type { Category } from "@/types/models";

interface CategoriesData {
  data?: Category[];
}

export async function getCategories(): Promise<Category[]> {
  const response = await request<CategoriesData>(
    "GET",
    "/categories?is_show_in_menu=1",
  );

  if (!response.status) {
    console.error("❌ Categories API Error");
    console.error("Message:", response.message);
    console.error("Full Response:", response);

    throw new Error(response.message || "Failed to fetch categories");
  }

  return response.data?.data ?? [];
}

export async function getAllCategories(): Promise<Category[]> {
  const response = await request<CategoriesData>("GET", "/categories");

  if (!response.status) return [];

  return response.data?.data ?? [];
}

/*----------------- GET CATEGORY BY SLUG -----------------*/
export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const categories = await getAllCategories();

  return categories.find((cat) => cat.slug === slug) ?? null;
}
