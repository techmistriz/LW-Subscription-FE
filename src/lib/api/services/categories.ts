import { request } from "@/lib/api/request";
import { Category } from "@/types";

export async function getCategories(): Promise<Category[]> {
  const response = await request<any>("GET", "/categories?is_show_in_menu=1");

  // console.log("CATEGORIES RESPONSE:", response);

  if (response?.data?.status === false) {
    console.error("❌ Categories API Error");
    console.error("Message:", response.data.message);
    console.error("Developer Message:", response.data.developer_message);
    console.error("Code:", response.data.code);
    console.error("Full Response:", response.data);

    throw new Error(response.data.message);
  }

  return response.data?.data ?? [];
}

export async function getAllCategories(): Promise<Category[]> {
  const response = await request<any>("GET", "/categories");

  if (!response?.status) return [];

  return response.data?.data ?? [];
}

/*----------------- GET CATEGORY BY SLUG -----------------*/
export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const categories = await getAllCategories();

  return categories.find((cat) => cat.slug === slug) ?? null;
}
