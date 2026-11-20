import type { Request } from 'express';
import { supabaseAdmin } from '../supabase.js';
import { logger } from '../logger.js';

export interface AuditEntry {
  action: string;
  entity?: string | null;
  entityId?: string | null;
  meta?: Record<string, unknown> | null;
}

/**
 * Append one row to public.audit_logs. Never throws: a failed audit write
 * should not fail the request it describes, but it must be visible in logs.
 */
export async function recordAudit(req: Request, entry: AuditEntry): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from('audit_logs').insert({
      actor_id: req.auth?.user.id ?? null,
      actor_email: req.auth?.profile.email ?? null,
      action: entry.action,
      entity: entry.entity ?? null,
      entity_id: entry.entityId ?? null,
      meta: entry.meta ?? null,
      ip: req.ip ?? null,
      user_agent: req.get('user-agent') ?? null,
    });
    if (error) throw error;
  } catch (err) {
    logger.error({ err, action: entry.action }, 'failed to write audit log');
  }
}
