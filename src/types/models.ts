// =========================
// POST
// =========================
// Base Post type (shared fields)
export interface Post {
  id: number;
  title: string;
  slug: string;
  published_at?: string;
  publish_date?: string;
  image?: string;
  author?: Author | string;

  short_description?: string; // ✅ make optional
  date?: string;
  excerpt?: string;
}

// Article extends Post
export interface Article extends Post {
  content?: string;
  short_description?: string;
  excerpt?: string;
  description?: string | null;

  category?: ArticleCategoryType;
  category_id?: number;

  author_id?: number;
  author_slug?: string;

  magazine_id?: number;
  reader_feedbacks?: ReaderFeedback[] | null;
}

// =========================
// CATEGORY
// =========================
export interface ArticleCategory {
  id: number;
  name: string;
  slug?: string;
}

// In some APIs, category may be a string
export type ArticleCategoryType = ArticleCategory | string;

// =========================
// AUTHOR
// =========================
export interface Author {
  id: number;
  name: string;
  slug?: string;
  email?: string;
  description?: string;
  image?: string;
  avatar?: string;
  bio?: string;
  role_id?: string;
  title?: string;
  excerpt?: string;
  publishedAt?: string;
}

export interface AuthorListItem {
  id: number;
  name: string;
  slug?: string;
}

// =========================
// ARTICLE
// =========================
// export interface Article {
//   id: number;
//   title: string;
//   slug: string;
//   search?: string;

//   content?: string;
//   short_description?: string;
//   excerpt?: string;
//   description?: string | null;
  
//   published_at?: string;
//   publish_date?: string;
//   date?: string;

//   image?: string;
//   category?: ArticleCategoryType;
//   category_id?: number;

//   author?: Author | string;
//   authorId?: number;
//   author_id?: number;
//   author_slug?: string;

//   magazine_id?: number;

//   // Reader Feedbacks (for verdict type posts)
//   reader_feedbacks?: ReaderFeedback[] | null;
// }

// =========================
// READER FEEDBACK
// =========================
export interface ReaderFeedback {
  id: number;
  reader_name: string;
  reader_designation: string;
  reader_feedback: string;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

// =========================
// MAGAZINE
// =========================
export interface Magazine {
  id: number;
  slug: string;
  title: string;
  image?: string;
  magazine_name?: string;
  description?: string;

  posts: Article[];
}

// =========================
// CATEGORY (general purpose)
// =========================
export interface Category {
  id: number;
  name: string;
  slug?: string;
}

// =========================
// YEAR
// =========================
export type Year = number;
export type YearResponse = Year[];

// =========================
// AUTH / FORM DATA
// =========================
export interface RegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  contact: string;
}

export interface FormData extends RegisterForm {
  plan: string;
  auto_renew: boolean;
}