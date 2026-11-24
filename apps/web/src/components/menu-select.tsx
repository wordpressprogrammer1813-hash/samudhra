'use client';

import type { MenuSummary } from '@/lib/menus';

export function MenuSelect({
  value,
  menus,
  onChange,
}: {
  value: string | null;
  menus: MenuSummary[];
  onChange: (menuId: string) => void;
}) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-[3px] border border-heath/30 bg-transparent px-3 py-2 text-sm text-heath outline-none focus-visible:border-heath"
    >
      <option value="" disabled>
        Choose a menu…
      </option>
      {menus.map((menu) => (
        <option key={menu.id} value={menu.id}>
          {menu.name}
        </option>
      ))}
    </select>
  );
}
