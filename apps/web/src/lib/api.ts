import type { ApiResponse } from '@samudra/shared';
import { publicEnv } from '@/lib/env';
import { getAccessToken } from '@/lib/auth';

export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

/**
 * Server-side call to the Express API with the caller's Supabase token
 * attached. Returns the unwrapped `data` and throws ApiRequestError otherwise.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();

  const res = await fetch(`${publicEnv.apiUrl}/api${path.startsWith('/') ? path : `/${path}`}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
    // Admin data is per-user and must never be cached across requests.
    cache: 'no-store',
  });

  let body: ApiResponse<T> | null = null;
  try {
    body = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new ApiRequestError(res.status, 'bad_response', `API returned ${res.status}`);
  }

  if (!res.ok || !body.ok) {
    const error = body.ok === false ? body.error : undefined;
    throw new ApiRequestError(
      res.status,
      error?.code ?? 'unknown',
      error?.message ?? `API returned ${res.status}`,
      error?.details,
    );
  }

  return body.data;
}

/** Same as apiFetch but returns null instead of throwing. */
export async function apiFetchSafe<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    return await apiFetch<T>(path, init);
  } catch {
    return null;
  }
}

export function buildQuery(params: Record<string, string | number | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}
