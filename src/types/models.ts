import { ReactNode } from "react";

/*==================== POST ====================*/
export interface Post {
  id: number;
  title: string;
  slug: string;

  content?: ReactNode;

  published_at?: string;
  publish_date?: string;
  date?: string;

  image?: string;

  short_description?: string;
  excerpt?: string;

  author?: Author | string;

  authors?: Author[];

  tags?: Tag[];

  magazine?: Magazine;

  tag?: boolean;
}

/*==================== ARTICLE ====================*/
export interface Article {
  id: number;
  title: string;
  slug: string;

  content?: string;
  description?: string | null;

  short_description?: string;
  excerpt?: string;

  published_at?: string;
  publish_date?: string;
  date?: string;

  image?: string;

  category?: ArticleCategoryType;
  category_id?: number;

  author?: Author | string;
  author_id?: number;
  author_slug?: string;

  authors?: Author[];

  tags?: Tag[];

  magazine?: Magazine;
  magazine_id?: number;

  reader_feedbacks?: ReaderFeedback[] | null;
}

/*==================== TAG ====================*/
export interface Tag {
  id: number;
  name: string;
  slug: string;
}

/*==================== CATEGORY ====================*/
export interface ArticleCategory {
  id: number;
  name: string;
  slug?: string;
}

export type ArticleCategoryType =
  | ArticleCategory
  | string;

/*==================== AUTHOR ====================*/
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

  linkedin?: string;
}

export interface AuthorListItem {
  id: number;
  name: string;

  slug?: string;

  linkedin?: string;
}

/*==================== READER FEEDBACK ====================*/
export interface ReaderFeedback {
  id: number;

  reader_name: string;

  reader_designation: string;

  reader_feedback: string;

  status?: number;

  created_at?: string;

  updated_at?: string;
}

/*==================== MAGAZINE ====================*/
export interface Magazine {
  data(data: any): unknown;
  id: number;

  slug: string;

  title: string;

  year?: string;

  image?: string;

  magazine_name?: string;

  description?: string;

  posts?: Article[];

  month?: {
    id: number;
    name: string;
  };
}

/*==================== CATEGORY ====================*/
export interface Category {
  id: number;

  name: string;

  slug?: string;
}

/*==================== YEAR ====================*/
export type Year = number;

export type YearResponse = Year[];

/*==================== AUTH ====================*/
export interface RegisterForm {
  first_name: string;

  last_name: string;

  email: string;

  password: string;

  password_confirmation: string;

  contact: string;

  address: string;
}

export interface FormData
  extends RegisterForm {
  plan: string;

  auto_renew: boolean;

  otp: string;

  dob: string;

  organisation: string;

  city: string;

  pincode: string;

  state: string;

  country: string;
}

export interface RegisterPayload
  extends RegisterForm {
  membership_plan_id: number;
}