'use client';

import { useTransition } from 'react';
import { renameMenu } from '@/app/admin/(protected)/menu/actions';

export function RenameMenuInput({ menuId, name }: { menuId: string; name: string }) {
  const [, startTransition] = useTransition();

  return (
    <input
      defaultValue={name}
      onBlur={(e) => {
        const next = e.target.value;
        if (next.trim() && next.trim() !== name) {
          startTransition(() => renameMenu(menuId, next));
        }
      }}
      className="rounded-[3px] border border-transparent bg-transparent px-2 py-1 text-xl font-semibold text-heath outline-none focus-visible:border-heath/30"
    />
  );
}
