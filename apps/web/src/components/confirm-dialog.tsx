'use client';

import { useEffect } from 'react';

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  pending = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-80 grid place-items-center bg-creole/50 p-4 [animation:fade-in_0.2s_ease-out]">
      <button
        type="button"
        aria-label={cancelLabel}
        onClick={onCancel}
        className="absolute inset-0 h-full w-full cursor-default border-0 bg-transparent p-0"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative w-full max-w-sm rounded-[3px] bg-serenade p-6 text-heath shadow-[0_30px_60px_-20px_rgba(29,5,6,0.5)] [animation:scale-in_0.22s_cubic-bezier(0.16,1,0.3,1)]"
      >
        <h2 id="confirm-dialog-title" className="text-lg font-semibold">
          {title}
        </h2>
        <p className="mt-2 text-sm text-heath/70">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-heath/30 px-5 py-2 text-xs font-medium tracking-[0.2em] text-heath uppercase transition-colors duration-200 hover:bg-heath/5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className="rounded-full border border-red-800 bg-red-800 px-5 py-2 text-xs font-medium tracking-[0.2em] text-serenade uppercase transition-colors duration-200 hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
