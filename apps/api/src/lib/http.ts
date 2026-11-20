import type { Response } from 'express';
import type { ApiResponse, Paginated } from '@samudra/shared';

/** Thrown anywhere in a route; turned into a JSON body by the error handler. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }

  static badRequest(message = 'Bad request', details?: unknown) {
    return new HttpError(400, 'bad_request', message, details);
  }
  static unauthorized(message = 'Not signed in') {
    return new HttpError(401, 'unauthorized', message);
  }
  static forbidden(message = 'You do not have access to this') {
    return new HttpError(403, 'forbidden', message);
  }
  static notFound(message = 'Not found') {
    return new HttpError(404, 'not_found', message);
  }
  static conflict(message = 'Already exists') {
    return new HttpError(409, 'conflict', message);
  }
  static internal(message = 'Something went wrong', details?: unknown) {
    return new HttpError(500, 'internal_error', message, details);
  }
}

export function ok<T>(res: Response, data: T, status = 200): Response {
  const body: ApiResponse<T> = { ok: true, data };
  return res.status(status).json(body);
}

export function paginate<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): Paginated<T> {
  return {
    items,
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
