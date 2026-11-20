import { Router } from 'express';
import { listAuditLogsSchema } from '@samudra/shared';
import { requireAdmin, requireAuth } from '../../middleware/auth.js';
import { HttpError, ok, paginate } from '../../lib/http.js';
import { toAuditLog } from '../../lib/mappers.js';
import { supabaseAdmin } from '../../supabase.js';

export const auditRouter = Router();

auditRouter.use(requireAuth, requireAdmin);

/** Paged audit trail, newest first. */
auditRouter.get('/', async (req, res) => {
  const { page, pageSize, search, action, actorId } = listAuditLogsSchema.parse(req.query);
  const from = (page - 1) * pageSize;

  let query = supabaseAdmin.from('audit_logs').select('*', { count: 'exact' });
  if (action) query = query.eq('action', action);
  if (actorId) query = query.eq('actor_id', actorId);
  if (search) query = query.or(`actor_email.ilike.%${search}%,entity.ilike.%${search}%`);

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) throw HttpError.internal(error.message);
  ok(res, paginate((data ?? []).map(toAuditLog), count ?? 0, page, pageSize));
});
