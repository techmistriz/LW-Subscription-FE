import { request } from "@/lib/api/request";
import { Category } from "@/types";


  //  GET ALL CATEGORIES
// export async function getCategories(): Promise<Category[]> {
//   const response = await request<any>("GET", "/categories");

//   if (!response?.status) return [];

//   // Extract nested data correctly
//   return response.data?.data ?? [];
// }


export async function getCategories(): Promise<Category[]> {
  const response = await request<any>(
    "GET",
    "/categories?is_show_in_menu=1"
  );

  if (!response?.status) return [];

  return response.data?.data ?? [];
}

  //  GET CATEGORY BY SLUG
export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const categories = await getCategories();

  return categories.find((cat) => cat.slug === slug) ?? null;
}
