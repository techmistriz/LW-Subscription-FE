import { request } from "@/lib/api/request";
import { Author } from "@/types";
//  GET ALL AUTHORS
export async function getAuthors(): Promise<Author[]> {
  const response = await request<any>("GET", "/authors");

  if (!response?.status) return [];

  const authors = response.data?.data ?? [];

  return authors.map((a: any) => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
  }));
}

//   //  GET AUTHOR BY SLUG
// export async function getAuthorBySlug(
//   slug: string
// ): Promise<Author | null> {
//   const response = await request<Author>("GET", `/authors/${slug}`);

//   return response.status ? response.data : null;
// }

//   //  GET ARTICLES BY AUTHOR
// export async function getArticlesByAuthor(
//   authorId: number
// ): Promise<Article[]> {
//   const response = await request<Article[]>("GET", "/articles", {
//     author_id: authorId,
//   });
// console.log(authorId)
//   return response.status ? response.data ?? [] : [];
// }
