import { Router } from 'express';
import { healthRouter } from './health.js';
import { ok } from '../lib/http.js';

export const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  ok(res, {
    name: 'samudra-api',
    version: 1,
    endpoints: ['GET /api', 'GET /api/health'],
  });
});

apiRouter.use('/health', healthRouter);
