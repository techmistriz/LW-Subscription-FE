import api from "./axios";

/* =========================
   TYPES
========================= */

export interface Author {
  id: number;
  name: string;
  email: string;
  description: string;
  slug: string;
  image?: string;
  role_id: string;
  title: string;
  authorId?: number;
  excerpt?: string;
  publishedAt?: string;
}

/* =========================
   GET ALL AUTHORS
========================= */

export type AuthorListItem = {
  id: number;
  name: string;
  slug: string;
};

export async function getAuthors(): Promise<AuthorListItem[]> {
  try {
    const { data } = await api.get("/authors");

    const list = Array.isArray(data) ? data : (data?.data ?? []);

    return list.map(
      (a: Partial<Author>): AuthorListItem => ({
        id: a.id ?? 0,
        name: a.name ?? "Unknown",
        slug: a.slug ?? "",
      }),
    );
  } catch (error) {
    console.error("Failed to fetch authors:", error);
    return [];
  }
}

/* =========================
   GET AUTHOR BY SLUG
========================= */

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    const { data } = await api.get(`/authors/${slug}`);

    return data?.data ?? null;
  } catch (err) {
    console.error("Failed to fetch author", err);
    return null;
  }
}

/* =========================
   GET ARTICLES BY AUTHOR
========================= */

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  publishedAt?: string;
  authorId: number;
}

export async function getArticlesByAuthor(
  authorId: number,
): Promise<Article[]> {
  try {
    const { data } = await api.get("/articles", {
      params: { author_id: authorId },
    });

    return data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return [];
  }
}
