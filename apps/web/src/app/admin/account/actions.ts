'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { apiFetch, ApiRequestError } from '@/lib/api';
import { requireRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export interface AccountState {
  error?: string;
  message?: string;
}

const profileSchema = z.object({
  fullName: z.string().trim().min(1, 'Enter your name').max(120),
  phone: z.string().trim().max(20).optional(),
});

export async function saveProfileAction(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  await requireRole('superadmin');

  const parsed = profileSchema.safeParse({
    fullName: formData.get('fullName'),
    phone: formData.get('phone') || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Check the form' };
  }

  try {
    await apiFetch('/me', {
      method: 'PATCH',
      body: JSON.stringify({
        fullName: parsed.data.fullName,
        phone: parsed.data.phone ?? null,
      }),
    });
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.message };
    return { error: 'Could not save. Try again.' };
  }

  revalidatePath('/admin', 'layout');
  return { message: 'Saved.' };
}

const passwordSchema = z
  .object({
    password: z.string().min(8, 'Use at least 8 characters'),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: 'The two passwords do not match',
    path: ['confirm'],
  });

/** Password changes go straight to Supabase Auth for the signed-in user. */
export async function changePasswordAction(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  await requireRole('superadmin');

  const parsed = passwordSchema.safeParse({
    password: formData.get('password'),
    confirm: formData.get('confirm'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Check the form' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };

  return { message: 'Password changed.' };
}
