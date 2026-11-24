'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';

const BUCKET = 'media';

export async function updateMedia(input: {
  id: string;
  alt: string;
  caption: string;
  url: string;
}): Promise<void> {
  const url = input.url.trim();
  if (!url) return;

  await supabaseAdmin()
    .from('media')
    .update({ alt: input.alt.trim(), caption: input.caption.trim(), url })
    .eq('id', input.id);

  revalidatePath('/admin/media');
}

export async function deleteMedia(id: string, storagePath: string | null): Promise<void> {
  const db = supabaseAdmin();

  if (storagePath) {
    const { error } = await db.storage.from(BUCKET).remove([storagePath]);
    if (error) console.error('[media] storage delete failed:', error);
  }

  await db.from('media').delete().eq('id', id);
  revalidatePath('/admin/media');
}
