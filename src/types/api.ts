// lib/types/api.ts

export type ApiResponse<T = unknown> =
  | {
      status: true;
      message: string;
      data: T;
    }
  | {
      status: false;
      message: string;
      data: null;
      errors?: Record<string, string[]>;
    };

export interface Paging {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export interface PaginationMeta {
  paging: Paging;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
