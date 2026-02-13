// src/lib/types.ts
export interface Magazine {
  id: number | string;
  slug: string;
  title: string;
  image?: string;          // ✅ make optional
  magazine_name?: string;  // optional
  description?: string;    // optional
}


export function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}


 export interface RegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  contact: string;
}

export type Author = {
  id: number;
  name: string;
  slug?: string;
};


export type ArticleCategory =
  | {
      id: number;
      name: string;
      slug: string;
    }
  | string;

export type Article = {
  id: number;
  name:number;
  title: string;
  slug: string;
  image?: string;
  published_at?: string;
   publish_date?: string; // only if API sends this
  date?: string;         // only if API sends this

  category?: ArticleCategory;
    author?: Author;
      short_description?: string;
  excerpt?: string;

};


export type Category = {
  id: number;
  name: string;
  slug: string;
};


export type Year = {
  id: number;
  name: number;
};

export interface PaginationMeta {
  paging: {
    current_page: number;
    last_page: number;
    total: number;
    per_page?: number;
  };
}



export interface Post {
  id: number;
  title: string;
  slug: string;
  published_at?: string;
  author?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
  };
}
