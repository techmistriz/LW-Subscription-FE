import api from "./axios";

/* =========================   GET ALL CATEGORIES   ========================= */

export async function categories() {
  try {
    const response = await api.get("/categories");

    const json = response.data;

    // Normalize response
    const list = Array.isArray(json)
      ? json
      : json.data || json.categories || [];

    return list.map((item: any) => ({
      name: item.name,
      slug: item.slug,
      id: item.id,
    }));
  } catch (error) {
    console.error("Categories API error:", error);
    return [];
  }
}

/* =========================   GET CATEGORY BY SLUG  ========================= */

export async function getCategoryBySlug(slug: string) {
  try {
    const response = await api.get("/categories");

    const json = response.data;

    const list = Array.isArray(json)
      ? json
      : json.data || json.categories || [];

    const category = list.find((item: any) => item.slug === slug);

    return category || null;
  } catch (error) {
    console.error("Slug → ID resolve failed:", error);
    return null;
  }
}
