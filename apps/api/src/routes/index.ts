import { Router } from 'express';
import { healthRouter } from './health.js';
import { meRouter } from './me.js';
import { settingsRouter } from './admin/settings.js';
import { contentRouter } from './admin/content.js';
import { ok } from '../lib/http.js';

export const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  ok(res, {
    name: 'samudra-api',
    version: 1,
    endpoints: [
      'GET    /api/health',
      'GET    /api/health/ready',
      'GET    /api/me',
      'PATCH  /api/me',
      'GET    /api/admin/content/pages',
      'GET    /api/admin/content/pages/:slug',
      'PATCH  /api/admin/content/pages/:slug',
      'PATCH  /api/admin/content/pages/:slug/sections/:key',
      'PUT    /api/admin/content/pages/:slug/order',
      'GET    /api/admin/settings',
      'GET    /api/admin/settings/:key',
      'PUT    /api/admin/settings/:key',
    ],
  });
});

apiRouter.use('/health', healthRouter);
apiRouter.use('/me', meRouter);
apiRouter.use('/admin/content', contentRouter);
apiRouter.use('/admin/settings', settingsRouter);
