'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function updateSectionContent(
  sectionId: string,
  pageId: string,
  content: Record<string, unknown>,
): Promise<void> {
  await supabaseAdmin().from('page_sections').update({ content }).eq('id', sectionId);

  revalidatePath(`/admin/pages/${pageId}`);
  revalidatePath('/');
}
