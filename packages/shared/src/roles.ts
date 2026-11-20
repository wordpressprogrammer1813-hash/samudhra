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

/** Anyone who may open the admin panel at all. */
export function canAccessAdmin(role: Role | null | undefined): boolean {
  return hasMinRole(role, 'editor');
}

export function isSuperAdmin(role: Role | null | undefined): boolean {
  return role === 'superadmin';
}

/**
 * Which roles a given actor is allowed to assign. Nobody can grant a role
 * at or above their own rank, except a superadmin (who can grant anything).
 */
export function assignableRoles(actor: Role | null | undefined): Role[] {
  if (!actor) return [];
  if (actor === 'superadmin') return [...ROLES];
  return ROLES.filter((r) => ROLE_RANK[r] < ROLE_RANK[actor]);
}
