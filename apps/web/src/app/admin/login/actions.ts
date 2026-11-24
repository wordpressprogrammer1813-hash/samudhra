'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAdminKey } from '@/lib/admin-key';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  createSessionToken,
} from '@/lib/admin-session';
import { supabaseAdmin } from '@/lib/supabase-admin';

export interface LoginState {
  error?: string;
}

export async function loginWithKey(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const key = String(formData.get('key') ?? '').trim();
  const next = String(formData.get('next') ?? '/admin');

  if (!key) {
    return { error: 'Enter the superadmin key.' };
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return { error: 'Server is not configured (missing SESSION_SECRET).' };
  }

  const { data, error } = await supabaseAdmin()
    .from('settings')
    .select('value')
    .eq('key', 'superadmin_key_hash')
    .maybeSingle();

  if (error) {
    console.error('[admin login] settings query failed:', error);
    return { error: 'Incorrect key.' };
  }

  const storedHash = (data?.value as { hash?: string } | null)?.hash;
  if (!storedHash) {
    console.error('[admin login] no superadmin_key_hash row found in settings');
    return { error: 'Incorrect key.' };
  }

  if (!verifyAdminKey(key, storedHash)) {
    console.error('[admin login] key did not match stored hash');
    return { error: 'Incorrect key.' };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createSessionToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });

  redirect(next.startsWith('/admin') ? next : '/admin');
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect('/admin/login');
}
