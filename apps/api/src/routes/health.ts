import { Router } from 'express';
import { ok } from '../lib/http.js';
import { supabaseAdmin } from '../supabase.js';

export const healthRouter = Router();

/** Liveness - does the process answer at all. */
healthRouter.get('/', (_req, res) => {
  ok(res, { status: 'up', uptime: Math.round(process.uptime()), now: new Date().toISOString() });
});

/** Readiness - can we actually reach Supabase. */
healthRouter.get('/ready', async (_req, res) => {
  const started = Date.now();
  const { error } = await supabaseAdmin.from('settings').select('key').limit(1);
  ok(res, {
    status: error ? 'degraded' : 'ready',
    database: error ? { reachable: false, message: error.message } : { reachable: true },
    latencyMs: Date.now() - started,
  });
});
