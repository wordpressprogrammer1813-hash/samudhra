'use client';

import { useEffect, useState, useTransition } from 'react';
import { deleteMedia, updateMedia } from '@/app/admin/(protected)/media/actions';
import { ConfirmDialog } from '@/components/confirm-dialog';
import type { MediaItem } from '@/lib/media';

function formatBytes(bytes: number | null): string {
  if (bytes == null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  return `${(kb / 1024).toFixed(kb / 1024 < 10 ? 1 : 0)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function MediaDetailsModal({
  item,
  onClose,
  onDeleted,
}: {
  item: MediaItem;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [alt, setAlt] = useState(item.alt);
  const [caption, setCaption] = useState(item.caption);
  const [url, setUrl] = useState(item.url);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [dimensions, setDimensions] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  function save(next: Partial<{ alt: string; caption: string; url: string }>) {
    startTransition(() =>
      updateMedia({
        id: item.id,
        alt: next.alt ?? alt,
        caption: next.caption ?? caption,
        url: next.url ?? url,
      }),
    );
  }

  return (
    <div className="fixed inset-0 z-80 grid place-items-center bg-creole/60 p-4 [animation:fade-in_0.2s_ease-out]">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default border-0 bg-transparent p-0"
      />
      <div className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-[3px] bg-serenade shadow-[0_30px_80px_-20px_rgba(29,5,6,0.6)] [animation:scale-in_0.25s_cubic-bezier(0.16,1,0.3,1)] sm:grid-cols-2">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full bg-serenade/80 text-heath hover:bg-serenade"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="size-4"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external/storage URL preview */}
        <img
          src={item.url}
          alt={item.alt}
          onLoad={(e) => {
            const img = e.currentTarget;
            setDimensions(`${img.naturalWidth} × ${img.naturalHeight}`);
          }}
          className="h-full max-h-[80vh] w-full bg-heath/5 object-contain"
        />

        <div className="flex flex-col overflow-y-auto p-6">
          <p className="truncate text-sm font-medium text-heath">{item.title}</p>

          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-heath/55">
            <dt>Uploaded on</dt>
            <dd>{formatDate(item.createdAt)}</dd>
            <dt>File type</dt>
            <dd>{item.mimeType ?? '—'}</dd>
            <dt>File size</dt>
            <dd>{formatBytes(item.sizeBytes)}</dd>
            <dt>Dimensions</dt>
            <dd>{dimensions ?? '—'}</dd>
          </dl>

          <label className="mt-5 text-xs font-medium tracking-[0.2em] text-heath/60 uppercase">
            Alternative text
          </label>
          <textarea
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            onBlur={() => save({ alt })}
            rows={2}
            className="mt-1.5 rounded-[3px] border border-heath/30 bg-transparent px-3 py-2 text-sm text-heath outline-none focus-visible:border-heath"
          />

          <label className="mt-4 text-xs font-medium tracking-[0.2em] text-heath/60 uppercase">
            Image caption
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            onBlur={() => save({ caption })}
            rows={2}
            className="mt-1.5 rounded-[3px] border border-heath/30 bg-transparent px-3 py-2 text-sm text-heath outline-none focus-visible:border-heath"
          />

          <label className="mt-4 text-xs font-medium tracking-[0.2em] text-heath/60 uppercase">
            File URL
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => save({ url })}
            className="mt-1.5 rounded-[3px] border border-heath/30 bg-transparent px-3 py-2 text-sm text-heath outline-none focus-visible:border-heath"
          />

          <div className="mt-auto flex items-center justify-between pt-6">
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="text-xs font-medium tracking-[0.2em] text-red-700 uppercase hover:text-red-900"
            >
              Delete
            </button>
            <a
              href={item.url}
              download
              className="rounded-full border border-heath px-5 py-2 text-xs font-medium tracking-[0.2em] text-heath uppercase hover:bg-heath hover:text-serenade"
            >
              Download
            </a>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        title={`Delete "${item.title}"?`}
        description="This can't be undone."
        pending={pending}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => {
          // Optimistic: drop it from the grid immediately rather than
          // waiting on the storage-delete + DB round trip.
          onDeleted();
          startTransition(async () => {
            try {
              await deleteMedia(item.id, item.storagePath);
            } catch (err) {
              console.error('[media] delete failed:', err);
            }
          });
        }}
      />
    </div>
  );
}
