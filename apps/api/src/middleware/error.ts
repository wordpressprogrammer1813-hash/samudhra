import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import type { ApiResponse } from '@samudra/shared';
import { HttpError } from '../lib/http.js';
import { logger } from '../logger.js';
import { env } from '../env.js';

export const notFoundHandler: RequestHandler = (req, res) => {
  const body: ApiResponse<never> = {
    ok: false,
    error: { code: 'not_found', message: `No route for ${req.method} ${req.originalUrl}` },
  };
  res.status(404).json(body);
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  // Zod validation failures become a 400 with per-field details.
  if (err instanceof ZodError) {
    const body: ApiResponse<never> = {
      ok: false,
      error: {
        code: 'validation_error',
        message: 'Some fields are invalid',
        details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      },
    };
    res.status(400).json(body);
    return;
  }

  if (err instanceof HttpError) {
    if (err.status >= 500) logger.error({ err, url: req.originalUrl }, err.message);
    const body: ApiResponse<never> = {
      ok: false,
      error: { code: err.code, message: err.message, details: err.details },
    };
    res.status(err.status).json(body);
    return;
  }

  logger.error({ err, url: req.originalUrl }, 'unhandled error');
  const body: ApiResponse<never> = {
    ok: false,
    error: {
      code: 'internal_error',
      message: 'Something went wrong',
      // Only leak the real message outside production.
      details: env.isProd ? undefined : String(err instanceof Error ? err.stack : err),
    },
  };
  res.status(500).json(body);
};
