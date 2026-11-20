import { redirect } from 'next/navigation';
import { canAccessAdmin, hasMinRole, isRole, type Profile, type Role } from '@samudra/shared';
import { createClient } from '@/lib/supabase/server';

export interface SessionUser {
  id: string;
  email: string;
  profile: Profile;
}

function toProfile(row: Record<string, unknown>): Profile {
  return {
    id: String(row.id),
    email: String(row.email ?? ''),
    fullName: (row.full_name as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    avatarUrl: (row.avatar_url as string | null) ?? null,
    role: isRole(row.role) ? row.role : 'user',
    status: (row.status as Profile['status']) ?? 'active',
    lastSeenAt: (row.last_seen_at as string | null) ?? null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

/** The signed-in user with their profile, or null. Safe in any server context. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: row } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!row) return null;

  return { id: user.id, email: user.email ?? '', profile: toProfile(row) };
}

/** Use at the top of any page that needs a signed-in user. */
export async function requireUser(nextPath = '/admin'): Promise<SessionUser> {
  const session = await getSessionUser();
  if (!session) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return session;
}

/** Use at the top of any admin page. Defaults to the lowest panel role. */
export async function requireRole(minimum: Role = 'editor'): Promise<SessionUser> {
  const session = await requireUser();
  if (!canAccessAdmin(session.profile.role)) redirect('/?error=forbidden');
  if (!hasMinRole(session.profile.role, minimum)) redirect('/admin?error=insufficient_role');
  return session;
}

/** The access token to forward to the Express API. */
export async function getAccessToken(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}
