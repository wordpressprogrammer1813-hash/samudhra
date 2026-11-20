import { Router } from 'express';
import { healthRouter } from './health.js';
import { meRouter } from './me.js';
import { usersRouter } from './admin/users.js';
import { settingsRouter } from './admin/settings.js';
import { auditRouter } from './admin/audit.js';
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
      'POST   /api/me/seen',
      'GET    /api/admin/users',
      'GET    /api/admin/users/stats',
      'GET    /api/admin/users/:id',
      'POST   /api/admin/users/invite',
      'PATCH  /api/admin/users/:id',
      'DELETE /api/admin/users/:id',
      'GET    /api/admin/settings',
      'GET    /api/admin/settings/:key',
      'PUT    /api/admin/settings/:key',
      'GET    /api/admin/audit',
    ],
  });
});

apiRouter.use('/health', healthRouter);
apiRouter.use('/me', meRouter);
apiRouter.use('/admin/users', usersRouter);
apiRouter.use('/admin/settings', settingsRouter);
apiRouter.use('/admin/audit', auditRouter);
