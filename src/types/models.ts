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
  title: string;
  slug: string;

  name?: string;
  image?: string;

  publish_date?: string;
  published_at?: string;
  date?: string;

  short_description?: string;
  excerpt?: string;

  content?: string;
  description?: string | null;

  category?: ArticleCategory;
  category_id?: number;

  author?: Author;
  authorId?: number;
  author_id?: number;

  magazine_id?: number;

  // ✅ Reader Feedbacks (for verdict type posts)
  reader_feedbacks?: ReaderFeedback[] | null;
}


export interface ReaderFeedback {
  id: number;
  reader_name: string;
  reader_designation: string;
  reader_feedback: string;
  status?: number;
  created_at?: string;
  updated_at?: string;
}


// YEAR
// export interface Year {
//   id: number;
//   name: string;
// }

export type Year = number;
export type YearResponse = Year[] 

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
  avatar?:string;
  bio?: string;
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

export interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  contact: string;
  plan: string;
  auto_renew: boolean;
}