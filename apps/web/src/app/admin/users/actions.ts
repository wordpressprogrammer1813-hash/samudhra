'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { inviteUserSchema, roleSchema, userStatusSchema } from '@samudra/shared';
import { apiFetch, ApiRequestError } from '@/lib/api';
import { requireRole } from '@/lib/auth';

export interface ActionState {
  error?: string;
  message?: string;
}

/** Turn any failure into a message the form can show. */
async function run(fn: () => Promise<string>): Promise<ActionState> {
  try {
    const message = await fn();
    revalidatePath('/admin/users');
    return { message };
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.message };
    return { error: 'Something went wrong. Try again.' };
  }
}

const idSchema = z.string().uuid();

export async function inviteUserAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole('superadmin');

  const parsed = inviteUserSchema.safeParse({
    email: formData.get('email'),
    fullName: formData.get('fullName') || undefined,
    role: formData.get('role') || 'user',
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Check the form' };
  }

  return run(async () => {
    await apiFetch('/admin/users/invite', {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    });
    return `Invite sent to ${parsed.data.email}.`;
  });
}

export async function changeRoleAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('superadmin');

  const id = idSchema.safeParse(formData.get('id'));
  const role = roleSchema.safeParse(formData.get('role'));
  if (!id.success || !role.success) return { error: 'Invalid request' };

  return run(async () => {
    await apiFetch(`/admin/users/${id.data}`, {
      method: 'PATCH',
      body: JSON.stringify({ role: role.data }),
    });
    return 'Role updated.';
  });
}

export async function changeStatusAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole('superadmin');

  const id = idSchema.safeParse(formData.get('id'));
  const status = userStatusSchema.safeParse(formData.get('status'));
  if (!id.success || !status.success) return { error: 'Invalid request' };

  return run(async () => {
    await apiFetch(`/admin/users/${id.data}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: status.data }),
    });
    return 'Status updated.';
  });
}
