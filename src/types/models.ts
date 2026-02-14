// POST
export interface Post {
  id: number;
  title: string;
  slug: string;
  published_at?: string;
  author?: string;
  page?: number;
  publish_date?: string;
}

// CATEGORY
export type ArticleCategory =
  | {
      id: number;
      name: string;
      slug: string;
    }
  | string;

// ARTICLE
export interface Article {
  id: number;
  name?: string; //  fixed (was number)
  title: string;
  slug: string;
  image?: string;
  published_at?: string;
  authorId?: number;
  publish_date?: string;
  date?: string;
  category?: ArticleCategory;
  author?: Author;
  short_description?: string;
  excerpt?: string;
}

// YEAR
export interface Year {
  id: number;
  name: string;
}

// MAGAZINE
export interface Magazine {
  id: number; //  better to keep number unless backend sends string
  slug: string;
  title: string;
  image?: string;
  magazine_name?: string;
  description?: string;
}

// CATEGORY
export interface Category {
  id: number;
  name: string;
  slug: string;
}

// AUTHOR
export interface Author {
  id: number;
  name: string;
  email: string;
  description: string;
  slug: string;
  image?: string;
  role_id: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
}

export interface AuthorListItem {
  id: number;
  name: string;
  slug: string;
}

// AUTH
export interface RegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  contact: string;
}

