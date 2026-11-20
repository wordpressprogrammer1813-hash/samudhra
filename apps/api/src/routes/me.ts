import { Router } from 'express';
import { updateProfileSchema } from '@samudra/shared';
import { authOf, requireAuth } from '../middleware/auth.js';
import { HttpError, ok } from '../lib/http.js';
import { toProfile } from '../lib/mappers.js';
import { supabaseAsUser } from '../supabase.js';

export const meRouter = Router();

meRouter.use(requireAuth);

/** The signed-in user's own profile + what the UI may show them. */
meRouter.get('/', (req, res) => {
  const { profile } = authOf(req);
  ok(res, { profile });
});

/**
 * Self-service profile edit. Goes through the *user's* client so RLS
 * enforces that role and status cannot be touched here.
 */
meRouter.patch('/', async (req, res) => {
  const { accessToken, profile } = authOf(req);
  const input = updateProfileSchema.parse(req.body);

  const patch: Record<string, unknown> = {};
  if (input.fullName !== undefined) patch.full_name = input.fullName;
  if (input.phone !== undefined) patch.phone = input.phone;
  if (input.avatarUrl !== undefined) patch.avatar_url = input.avatarUrl;

  const { data, error } = await supabaseAsUser(accessToken)
    .from('profiles')
    .update(patch)
    .eq('id', profile.id)
    .select('*')
    .single();

  if (error) throw HttpError.badRequest(error.message);
  ok(res, { profile: toProfile(data) });
});

/** Cheap heartbeat so the admin list can show who is around. */
meRouter.post('/seen', async (req, res) => {
  const { accessToken, profile } = authOf(req);
  await supabaseAsUser(accessToken)
    .from('profiles')
    .update({ last_seen_at: new Date().toISOString() })
    .eq('id', profile.id);
  ok(res, { seen: true });
});
