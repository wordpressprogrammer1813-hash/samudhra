'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch, ApiRequestError } from '@/lib/api';
import { requireRole } from '@/lib/auth';

export interface SettingFormState {
  error?: string;
  message?: string;
}

/** Save one settings row. The value field is raw JSON typed by the admin. */
export async function saveSettingAction(
  _prev: SettingFormState,
  formData: FormData,
): Promise<SettingFormState> {
  await requireRole('superadmin');

  const key = String(formData.get('key') ?? '').trim();
  const raw = String(formData.get('value') ?? '').trim();
  if (!key) return { error: 'Missing setting key' };

  let value: unknown;
  try {
    value = raw === '' ? {} : JSON.parse(raw);
  } catch {
    return { error: 'That is not valid JSON' };
  }

  try {
    await apiFetch(`/admin/settings/${encodeURIComponent(key)}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
    revalidatePath('/admin/settings');
    return { message: 'Saved.' };
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.message };
    return { error: 'Could not save. Try again.' };
  }
}
