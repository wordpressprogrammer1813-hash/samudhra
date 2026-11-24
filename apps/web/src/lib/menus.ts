import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabasePublic } from '@/lib/supabase-public';

export interface MenuItemNode {
  id: string;
  label: string;
  link: string;
  position: number;
  children: MenuItemNode[];
}

export interface MenuSummary {
  id: string;
  handle: string;
  name: string;
  itemCount: number;
}

export interface MenuWithItems {
  id: string;
  handle: string;
  name: string;
  items: MenuItemNode[];
}

interface MenuItemRow {
  id: string;
  menu_id: string;
  parent_id: string | null;
  label: string;
  link: string;
  position: number;
}

function buildTree(rows: MenuItemRow[]): MenuItemNode[] {
  const byParent = new Map<string | null, MenuItemRow[]>();
  for (const row of rows) {
    const list = byParent.get(row.parent_id) ?? [];
    list.push(row);
    byParent.set(row.parent_id, list);
  }

  const toNode = (row: MenuItemRow): MenuItemNode => ({
    id: row.id,
    label: row.label,
    link: row.link,
    position: row.position,
    children: (byParent.get(row.id) ?? []).sort((a, b) => a.position - b.position).map(toNode),
  });

  return (byParent.get(null) ?? []).sort((a, b) => a.position - b.position).map(toNode);
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'menu'
  );
}

export async function uniqueHandle(name: string): Promise<string> {
  const base = slugify(name);
  const db = supabaseAdmin();

  let handle = base;
  for (let suffix = 2; ; suffix++) {
    const { data } = await db.from('menus').select('id').eq('handle', handle).maybeSingle();
    if (!data) return handle;
    handle = `${base}-${suffix}`;
  }
}

export async function listMenus(): Promise<MenuSummary[]> {
  const db = supabaseAdmin();

  const [{ data: menus, error: menusError }, { data: items, error: itemsError }] =
    await Promise.all([
      db.from('menus').select('id, handle, name').order('name'),
      db.from('menu_items').select('menu_id'),
    ]);

  if (menusError) throw menusError;
  if (itemsError) throw itemsError;

  const counts = new Map<string, number>();
  for (const item of items ?? []) {
    counts.set(item.menu_id, (counts.get(item.menu_id) ?? 0) + 1);
  }

  return (menus ?? []).map((menu) => ({
    ...menu,
    itemCount: counts.get(menu.id) ?? 0,
  }));
}

export async function getMenuWithItems(id: string): Promise<MenuWithItems | null> {
  const db = supabaseAdmin();

  const { data: menu, error: menuError } = await db
    .from('menus')
    .select('id, handle, name')
    .eq('id', id)
    .maybeSingle();
  if (menuError) throw menuError;
  if (!menu) return null;

  const { data: rows, error: itemsError } = await db
    .from('menu_items')
    .select('id, menu_id, parent_id, label, link, position')
    .eq('menu_id', id)
    .order('position');
  if (itemsError) throw itemsError;

  return { ...menu, items: buildTree(rows ?? []) };
}

async function fetchPublicMenu(
  column: 'handle' | 'id',
  value: string,
): Promise<MenuWithItems | null> {
  const db = supabasePublic();

  const { data: menu, error: menuError } = await db
    .from('menus')
    .select('id, handle, name')
    .eq(column, value)
    .maybeSingle();
  if (menuError) {
    console.error(`[menus] failed to read menu "${value}":`, menuError);
    return null;
  }
  if (!menu) return null;

  const { data: rows, error: itemsError } = await db
    .from('menu_items')
    .select('id, menu_id, parent_id, label, link, position')
    .eq('menu_id', menu.id)
    .order('position');
  if (itemsError) {
    console.error(`[menus] failed to read items for "${value}":`, itemsError);
    return { ...menu, items: [] };
  }

  return { ...menu, items: buildTree(rows ?? []) };
}

/**
 * For the live site (not the admin panel): reads a menu by its handle or id
 * through the public anon client, so edits in the superadmin panel show up
 * here on next render — no hardcoded nav arrays.
 */
export async function getPublicMenuByHandle(handle: string): Promise<MenuWithItems | null> {
  return fetchPublicMenu('handle', handle);
}

export async function getPublicMenuById(id: string): Promise<MenuWithItems | null> {
  return fetchPublicMenu('id', id);
}

/** Flattens a menu tree into a single-level list of links (children replace their parent group). */
export function flattenMenuLinks(items: MenuItemNode[]): { label: string; href: string }[] {
  return items.flatMap((item) =>
    item.children.length > 0
      ? item.children.map((child) => ({ label: child.label, href: child.link }))
      : [{ label: item.label, href: item.link }],
  );
}
