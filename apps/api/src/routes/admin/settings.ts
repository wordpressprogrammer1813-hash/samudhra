import { Router } from 'express';
import { z } from 'zod';
import { authOf, requireAdmin, requireAuth, requireSuperAdmin } from '../../middleware/auth.js';
import { HttpError, ok } from '../../lib/http.js';
import { toSetting } from '../../lib/mappers.js';
import { supabaseAdmin } from '../../supabase.js';
import { recordAudit } from '../../lib/audit.js';

export const settingsRouter = Router();

const keyParam = z.object({ key: z.string().trim().min(1).max(100) });
const valueBody = z.object({ value: z.unknown(), isPublic: z.boolean().optional() });

settingsRouter.use(requireAuth);

/** All settings rows. Admin and above. */
settingsRouter.get('/', requireAdmin, async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('settings').select('*').order('key');
  if (error) throw HttpError.internal(error.message);
  ok(res, { settings: (data ?? []).map(toSetting) });
});

settingsRouter.get('/:key', requireAdmin, async (req, res) => {
  const { key } = keyParam.parse(req.params);
  const { data, error } = await supabaseAdmin.from('settings').select('*').eq('key', key).single();
  if (error || !data) throw HttpError.notFound(`No setting named "${key}"`);
  ok(res, { setting: toSetting(data) });
});

/** Upsert one setting. Superadmin only. */
settingsRouter.put('/:key', requireSuperAdmin, async (req, res) => {
  const actor = authOf(req);
  const { key } = keyParam.parse(req.params);
  const input = valueBody.parse(req.body);

  const { data: existing } = await supabaseAdmin
    .from('settings')
    .select('*')
    .eq('key', key)
    .maybeSingle();

  const { data, error } = await supabaseAdmin
    .from('settings')
    .upsert(
      {
        key,
        value: input.value ?? {},
        is_public: input.isPublic ?? existing?.is_public ?? false,
        updated_by: actor.profile.id,
      },
      { onConflict: 'key' },
    )
    .select('*')
    .single();

  if (error) throw HttpError.badRequest(error.message);

  await recordAudit(req, {
    action: 'setting.updated',
    entity: 'setting',
    entityId: key,
    meta: { before: existing?.value ?? null, after: input.value ?? null },
  });

  ok(res, { setting: toSetting(data) });
});
