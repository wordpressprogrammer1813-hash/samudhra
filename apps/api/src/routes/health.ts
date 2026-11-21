import { Router } from 'express';
import { ok } from '../lib/http.js';

export const healthRouter = Router();

/** Liveness: does the process answer at all. */
healthRouter.get('/', (_req, res) => {
  ok(res, {
    status: 'up',
    uptime: Math.round(process.uptime()),
    now: new Date().toISOString(),
  });
});
