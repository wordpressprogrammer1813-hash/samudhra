import Link from 'next/link';
import { CreateMenuForm } from '@/components/create-menu-form';
import { DeleteMenuButton } from '@/components/delete-menu-button';
import { listMenus } from '@/lib/menus';

export default async function AdminMenuPage() {
  const menus = await listMenus();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-heath">Menus</h1>
        <CreateMenuForm />
      </div>

      <div className="mt-8 overflow-hidden rounded-[3px] border border-heath/15">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-heath/15 bg-heath/5 px-5 py-3 text-xs font-medium tracking-[0.2em] text-heath/60 uppercase">
          <span>Menu</span>
          <span>Items</span>
          <span />
        </div>

        {menus.length === 0 ? (
          <p className="px-5 py-6 text-sm text-heath/60">No menus yet — create one above.</p>
        ) : (
          menus.map((menu) => (
            <div
              key={menu.id}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-heath/10 px-5 py-4 last:border-b-0"
            >
              <Link
                href={`/admin/menu/${menu.id}`}
                className="text-sm font-medium text-heath hover:underline"
              >
                {menu.name}
              </Link>
              <span className="text-sm text-heath/60">{menu.itemCount}</span>
              <DeleteMenuButton menuId={menu.id} menuName={menu.name} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
