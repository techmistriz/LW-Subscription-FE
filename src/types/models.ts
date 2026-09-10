import type { ReactNode } from "react";

/* ==================== POST ==================== */

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

  category?: Category;

  author?: Author | string;
  authors?: Author[];

  tags?: Tag[];

  magazine?: Magazine;

  tag?: boolean;
}

/* ==================== ARTICLE ==================== */

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

  category?: Category;
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

/* ==================== TAG ==================== */

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

/* ==================== AUTHOR ==================== */

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

/* ==================== READER FEEDBACK ==================== */

export interface ReaderFeedback {
  id: number;
  reader_name: string;
  reader_designation: string;
  reader_feedback: string;
  text_aligment?: string;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

/* ==================== MAGAZINE ==================== */

export interface MagazineMonth {
  id: number;
  name: string;
}

export interface Magazine {
  id: number;

  slug: string;

  title: string;

  year?: string;

  image?: string;

  magazine_name?: string;

  description?: string;

  posts?: Article[];

  month?: MagazineMonth;
}

/* ==================== CATEGORY ==================== */

export interface Category {
  id: number;
  name: string;
  slug?: string;
}

/* ==================== YEAR ==================== */

export type Year = number;

export type YearResponse = Year[];

/* ==================== USER ==================== */

export interface User {
  id: number;

  first_name?: string;
  last_name?: string;
  name?: string;

  email?: string;
  contact?: string;
  phone?: string;

  address?: string;
  gst_number?: string;

  dob?: string;
  gender?: string;
  age_group?: string;

  country_id?: number;
  state_id?: number;
  city_id?: number;
  custom_city?: string;

  interest?: string | string[];
  interests?: string[];

  hearabout?: string;
  subscribe?: boolean;

  visited?: boolean;
  visited_year?: string | string[];

  role_id?: number;
  membership_plan_id?: number;

  active_subscription?: Subscription | null;

  created_at?: string;
  updated_at?: string;
}

/* ==================== PAYMENT ==================== */

export interface PaymentDetails {
  amount: number;
  currency: string;
  order_id: string;
  razorpay_key: string;
}

/* ==================== SUBSCRIPTION ==================== */

export interface SubscriptionPlan {
  id: number;
  name: string;
  title?: string;
  price?: number | string;
  actual_price?: string | number;
  amount?: number | string;
  duration_value?: number;
  duration_unit?: string;
  duration?: number | string;
  duration_type?: string;
  feature?: string;
  features?: string;
  is_trial?: boolean | number | string;
  tag?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface Subscription {
  id: number;
  plan_id?: number;
  membership_plan_id?: number;
  name?: string;
  amount?: number;
  total_amount?: number;
  subtotal_amount?: number;
  tax_amount?: number;
  tax_percent?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  duration_value?: number;
  duration_unit?: string;
  purchase_type?: string;
  features?: string;
  is_trial?: string;
  tag?: string;
  next_subscription_id?: number | null;
  previous_subscription_id?: number | null;
  created_at?: string | number | Date;
  updated_at?: string | number | Date;
  plan?: SubscriptionPlan;
}
