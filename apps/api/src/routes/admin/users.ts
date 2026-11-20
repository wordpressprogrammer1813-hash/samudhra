import { Router } from 'express';
import { z } from 'zod';
import {
  assignableRoles,
  inviteUserSchema,
  listUsersSchema,
  updateUserSchema,
} from '@samudra/shared';
import { authOf, requireAdmin, requireAuth, requireSuperAdmin } from '../../middleware/auth.js';
import { HttpError, ok, paginate } from '../../lib/http.js';
import { toProfile } from '../../lib/mappers.js';
import { supabaseAdmin } from '../../supabase.js';
import { recordAudit } from '../../lib/audit.js';
import { env } from '../../env.js';

export const usersRouter = Router();

const idParam = z.object({ id: z.string().uuid() });

usersRouter.use(requireAuth);

/** List / search users. Admin and above. */
usersRouter.get('/', requireAdmin, async (req, res) => {
  const { page, pageSize, search, role, status, sort, order } = listUsersSchema.parse(req.query);
  const from = (page - 1) * pageSize;

  let query = supabaseAdmin.from('profiles').select('*', { count: 'exact' });

  if (search) query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
  if (role) query = query.eq('role', role);
  if (status) query = query.eq('status', status);

  const { data, error, count } = await query
    .order(sort, { ascending: order === 'asc' })
    .range(from, from + pageSize - 1);

  if (error) throw HttpError.internal(error.message);
  ok(res, paginate((data ?? []).map(toProfile), count ?? 0, page, pageSize));
});

/** Counts for the dashboard cards. */
usersRouter.get('/stats', requireAdmin, async (_req, res) => {
  const [total, active, suspended, admins] = await Promise.all([
    supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).eq('status', 'suspended'),
    supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).in('role', ['admin', 'superadmin']),
  ]);

  ok(res, {
    total: total.count ?? 0,
    active: active.count ?? 0,
    suspended: suspended.count ?? 0,
    admins: admins.count ?? 0,
  });
});

/** Single user. Admin and above. */
usersRouter.get('/:id', requireAdmin, async (req, res) => {
  const { id } = idParam.parse(req.params);
  const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', id).single();
  if (error || !data) throw HttpError.notFound('No such user');
  ok(res, { profile: toProfile(data) });
});

/**
 * Invite a new user by email. Supabase sends the invite mail and the
 * auth trigger creates the profile; we then apply the requested role.
 */
usersRouter.post('/invite', requireSuperAdmin, async (req, res) => {
  const actor = authOf(req);
  const input = inviteUserSchema.parse(req.body);

  if (!assignableRoles(actor.profile.role).includes(input.role)) {
    throw HttpError.forbidden(`You cannot assign the ${input.role} role`);
  }

  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(input.email, {
    redirectTo: `${env.SITE_URL}/auth/callback`,
    data: input.fullName ? { full_name: input.fullName } : undefined,
  });

  if (error) {
    if (error.status === 422) throw HttpError.conflict('That email already has an account');
    throw HttpError.badRequest(error.message);
  }

  const { data: row, error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({ role: input.role, status: 'invited', full_name: input.fullName ?? null })
    .eq('id', data.user.id)
    .select('*')
    .single();

  if (updateError) throw HttpError.internal(updateError.message);

  await recordAudit(req, {
    action: 'user.invited',
    entity: 'profile',
    entityId: data.user.id,
    meta: { email: input.email, role: input.role },
  });

  ok(res, { profile: toProfile(row) }, 201);
});

/** Edit a user. Profile fields need admin; role/status need superadmin. */
usersRouter.patch('/:id', requireAdmin, async (req, res) => {
  const actor = authOf(req);
  const { id } = idParam.parse(req.params);
  const input = updateUserSchema.parse(req.body);

  const touchesPrivileges = input.role !== undefined || input.status !== undefined;
  if (touchesPrivileges && actor.profile.role !== 'superadmin') {
    throw HttpError.forbidden('Only a super admin can change roles or account status');
  }
  if (input.role && !assignableRoles(actor.profile.role).includes(input.role)) {
    throw HttpError.forbidden(`You cannot assign the ${input.role} role`);
  }

  const { data: target, error: findError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  if (findError || !target) throw HttpError.notFound('No such user');

  const before = toProfile(target);

  // Guard rails: do not let anyone lock themselves out, and never leave
  // the project without a superadmin.
  if (id === actor.profile.id && touchesPrivileges) {
    throw HttpError.badRequest('You cannot change your own role or status');
  }
  if (before.role === 'superadmin' && input.role && input.role !== 'superadmin') {
    const { count } = await supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'superadmin');
    if ((count ?? 0) <= 1) throw HttpError.badRequest('The last super admin cannot be demoted');
  }

  const patch: Record<string, unknown> = {};
  if (input.fullName !== undefined) patch.full_name = input.fullName;
  if (input.phone !== undefined) patch.phone = input.phone;
  if (input.role !== undefined) patch.role = input.role;
  if (input.status !== undefined) patch.status = input.status;

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw HttpError.badRequest(error.message);

  await recordAudit(req, {
    action: touchesPrivileges ? 'user.privileges_changed' : 'user.updated',
    entity: 'profile',
    entityId: id,
    meta: { before: { role: before.role, status: before.status }, patch },
  });

  ok(res, { profile: toProfile(data) });
});

/** Hard delete the auth user (profile cascades). Superadmin only. */
usersRouter.delete('/:id', requireSuperAdmin, async (req, res) => {
  const actor = authOf(req);
  const { id } = idParam.parse(req.params);

  if (id === actor.profile.id) throw HttpError.badRequest('You cannot delete your own account');

  const { data: target } = await supabaseAdmin
    .from('profiles')
    .select('email, role')
    .eq('id', id)
    .single();

  if (target?.role === 'superadmin') {
    const { count } = await supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'superadmin');
    if ((count ?? 0) <= 1) throw HttpError.badRequest('The last super admin cannot be deleted');
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) throw HttpError.badRequest(error.message);

  await recordAudit(req, {
    action: 'user.deleted',
    entity: 'profile',
    entityId: id,
    meta: { email: target?.email ?? null },
  });

  ok(res, { deleted: true });
});
