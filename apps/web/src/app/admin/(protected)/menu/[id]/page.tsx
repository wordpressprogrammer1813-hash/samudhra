import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MenuEditor } from '@/components/menu-editor';
import { RenameMenuInput } from '@/components/rename-menu-input';
import { getMenuWithItems } from '@/lib/menus';

export default async function AdminMenuEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const menu = await getMenuWithItems(id);
  if (!menu) notFound();

  return (
    <div>
      <Link href="/admin/menu" className="text-sm text-heath/60 hover:text-heath">
        ← Menus
      </Link>

      <div className="mt-2 mb-8">
        <RenameMenuInput menuId={menu.id} name={menu.name} />
        <p className="px-2 text-xs text-heath/50">Handle: {menu.handle}</p>
      </div>

      <MenuEditor menuId={menu.id} items={menu.items} />
    </div>
  );
}
