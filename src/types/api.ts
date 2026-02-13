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

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
