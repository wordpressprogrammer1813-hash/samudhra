/**
 * Types both apps agree on. Keep this package small: it exists so the web app
 * and the API cannot drift apart, not as a dumping ground.
 */

/** Every API route answers in this shape, so the client branches on one field. */
export type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: ApiError };

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
