'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { uniqueHandle } from '@/lib/menus';
import { supabaseAdmin } from '@/lib/supabase-admin';

export interface CreateMenuState {
  error?: string;
}

export async function createMenu(
  _prev: CreateMenuState,
  formData: FormData,
): Promise<CreateMenuState> {
  const name = String(formData.get('name') ?? '').trim();
  if (!name) return { error: 'Enter a menu name.' };

  const handle = await uniqueHandle(name);
  const { data, error } = await supabaseAdmin()
    .from('menus')
    .insert({ handle, name })
    .select('id')
    .single();

  if (error || !data) return { error: 'Could not create the menu.' };

  revalidatePath('/admin/menu');
  redirect(`/admin/menu/${data.id}`);
}

export async function deleteMenu(menuId: string): Promise<void> {
  await supabaseAdmin().from('menus').delete().eq('id', menuId);
  revalidatePath('/admin/menu');
  redirect('/admin/menu');
}

export async function renameMenu(menuId: string, name: string): Promise<void> {
  if (!name.trim()) return;
  await supabaseAdmin().from('menus').update({ name: name.trim() }).eq('id', menuId);
  revalidatePath(`/admin/menu/${menuId}`);
  revalidatePath('/admin/menu');
}

export async function addMenuItem(input: {
  menuId: string;
  parentId: string | null;
  label: string;
  link: string;
}): Promise<void> {
  const label = input.label.trim();
  if (!label) return;

  const db = supabaseAdmin();
  const { data: siblings } = await db
    .from('menu_items')
    .select('position')
    .eq('menu_id', input.menuId)
    .is('parent_id', input.parentId)
    .order('position', { ascending: false })
    .limit(1);

  const nextPosition = (siblings?.[0]?.position ?? -1) + 1;

  await db.from('menu_items').insert({
    menu_id: input.menuId,
    parent_id: input.parentId,
    label,
    link: input.link.trim(),
    position: nextPosition,
  });

  revalidatePath(`/admin/menu/${input.menuId}`);
}

export async function updateMenuItem(input: {
  id: string;
  menuId: string;
  label: string;
  link: string;
}): Promise<void> {
  const label = input.label.trim();
  if (!label) return;

  await supabaseAdmin()
    .from('menu_items')
    .update({ label, link: input.link.trim() })
    .eq('id', input.id);

  revalidatePath(`/admin/menu/${input.menuId}`);
}

export async function deleteMenuItem(id: string, menuId: string): Promise<void> {
  await supabaseAdmin().from('menu_items').delete().eq('id', id);
  revalidatePath(`/admin/menu/${menuId}`);
}

export async function reorderMenuItems(menuId: string, orderedIds: string[]): Promise<void> {
  const db = supabaseAdmin();
  await Promise.all(
    orderedIds.map((id, position) => db.from('menu_items').update({ position }).eq('id', id)),
  );
  revalidatePath(`/admin/menu/${menuId}`);
}
