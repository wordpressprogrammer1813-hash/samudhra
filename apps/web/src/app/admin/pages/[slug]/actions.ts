'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { apiFetch, ApiRequestError } from '@/lib/api';
import { requireRole } from '@/lib/auth';

export interface SaveState {
  error?: string;
  savedAt?: string;
}

const slugSchema = z.string().trim().min(1).max(60);
const keySchema = z.string().trim().min(1).max(60);

/** Saves one section's content. The API validates it against the section kind. */
export async function saveSectionAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireRole('superadmin');

  const slug = slugSchema.safeParse(formData.get('slug'));
  const key = keySchema.safeParse(formData.get('key'));
  if (!slug.success || !key.success) return { error: 'Invalid request' };

  let content: unknown;
  try {
    content = JSON.parse(String(formData.get('content') ?? '{}'));
  } catch {
    return { error: 'The form could not be read. Reload the page and try again.' };
  }

  try {
    await apiFetch(
      `/admin/content/pages/${encodeURIComponent(slug.data)}/sections/${encodeURIComponent(key.data)}`,
      { method: 'PATCH', body: JSON.stringify({ content }) },
    );
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.message };
    return { error: 'Could not save. Try again.' };
  }

  revalidatePath('/', 'layout');
  return { savedAt: new Date().toISOString() };
}

/** Shows or hides a section on the live site. */
export async function toggleSectionAction(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  await requireRole('superadmin');

  const slug = slugSchema.safeParse(formData.get('slug'));
  const key = keySchema.safeParse(formData.get('key'));
  const isVisible = formData.get('isVisible') === 'true';
  if (!slug.success || !key.success) return { error: 'Invalid request' };

  try {
    await apiFetch(
      `/admin/content/pages/${encodeURIComponent(slug.data)}/sections/${encodeURIComponent(key.data)}`,
      { method: 'PATCH', body: JSON.stringify({ isVisible }) },
    );
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.message };
    return { error: 'Could not update. Try again.' };
  }

  revalidatePath('/', 'layout');
  return { savedAt: new Date().toISOString() };
}

/** Page-level fields: title, SEO and whether the page is live. */
export async function savePageAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireRole('superadmin');

  const slug = slugSchema.safeParse(formData.get('slug'));
  if (!slug.success) return { error: 'Invalid request' };

  const body = {
    title: String(formData.get('title') ?? '').trim() || undefined,
    seoTitle: String(formData.get('seoTitle') ?? '').trim() || null,
    seoDescription: String(formData.get('seoDescription') ?? '').trim() || null,
    isPublished: formData.get('isPublished') === 'on',
  };

  try {
    await apiFetch(`/admin/content/pages/${encodeURIComponent(slug.data)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  } catch (err) {
    if (err instanceof ApiRequestError) return { error: err.message };
    return { error: 'Could not save. Try again.' };
  }

  revalidatePath('/', 'layout');
  return { savedAt: new Date().toISOString() };
}
