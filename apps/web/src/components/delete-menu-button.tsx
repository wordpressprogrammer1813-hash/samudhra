'use client';

import { useState, useTransition } from 'react';
import { deleteMenu } from '@/app/admin/(protected)/menu/actions';
import { ConfirmDialog } from '@/components/confirm-dialog';

export function DeleteMenuButton({ menuId, menuName }: { menuId: string; menuName: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-medium tracking-[0.2em] text-heath/60 uppercase hover:text-red-700"
      >
        Delete
      </button>
      <ConfirmDialog
        open={open}
        title={`Delete "${menuName}"?`}
        description="This also deletes all of its items and sub-items. This can't be undone."
        pending={pending}
        onCancel={() => setOpen(false)}
        onConfirm={() => startTransition(() => deleteMenu(menuId))}
      />
    </>
  );
}
