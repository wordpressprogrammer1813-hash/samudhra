/**
 * Role model for Samudra.
 *
 * The hierarchy is linear: a higher rank implies every permission of the
 * ranks below it. Keep this in sync with the `app_role` enum in
 * `supabase/migrations/*_init_roles_profiles.sql`.
 */
export const ROLES = ['user', 'editor', 'admin', 'superadmin'] as const;

export type Role = (typeof ROLES)[number];

/** Higher number = more power. */
export const ROLE_RANK: Record<Role, number> = {
  user: 0,
  editor: 10,
  admin: 20,
  superadmin: 30,
};

export const ROLE_LABELS: Record<Role, string> = {
  user: 'User',
  editor: 'Editor',
  admin: 'Admin',
  superadmin: 'Super Admin',
};

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value);
}

/** True when `role` is at least as powerful as `minimum`. */
export function hasMinRole(role: Role | null | undefined, minimum: Role): boolean {
  if (!role) return false;
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

/**
 * Who may open the admin panel.
 *
 * The panel exists for one person - the client, who edits page content - so
 * this is super admin only. `editor` and `admin` stay in the enum (and in the
 * Postgres type) for when staff accounts are added later, but nothing grants
 * them panel access today.
 */
export function canAccessAdmin(role: Role | null | undefined): boolean {
  return role === 'superadmin';
}

export function isSuperAdmin(role: Role | null | undefined): boolean {
  return role === 'superadmin';
}
