import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { pinoHttp } from 'pino-http';
import type { IncomingMessage } from 'node:http';
import { env } from './env.js';
import { logger } from './logger.js';
import { apiRouter } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

export function createApp(): Express {
  const app = express();

  // Behind a proxy (Render/Railway/Nginx) so req.ip is the real client.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  app.use(
    cors({
      origin(origin, callback) {
        // Allow server-to-server calls (no Origin header) and listed origins.
        if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 86400,
    }),
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.use(
    pinoHttp({
      logger,
      // Health checks would otherwise drown the log.
      autoLogging: {
        ignore: (req: IncomingMessage) => req.url?.startsWith('/api/health') ?? false,
      },
    }),
  );

  app.use(
    '/api',
    rateLimit({
      windowMs: 60_000,
      limit: env.isProd ? 120 : 1000,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      message: { ok: false, error: { code: 'rate_limited', message: 'Too many requests' } },
    }),
  );

  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
