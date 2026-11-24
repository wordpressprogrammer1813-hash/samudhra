'use client';

import { useState } from 'react';
import { MediaPickerModal } from '@/components/media-picker-modal';
import type { MediaItem } from '@/lib/media';

export function MediaPicker({
  value,
  media,
  onChange,
}: {
  value: string | null;
  media: MediaItem[];
  onChange: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative grid size-28 shrink-0 place-items-center overflow-hidden rounded-[3px] border border-heath/20 bg-heath/5"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary external/storage URL preview
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            className="size-8 text-heath/30"
          >
            <rect x="3" y="4" width="18" height="16" rx="1.5" />
            <circle cx="8.5" cy="9.5" r="1.5" />
            <path d="m4 17 5-5 3 3 4-4 4 4" />
          </svg>
        )}
        <span className="absolute inset-0 grid place-items-center bg-creole/0 text-xs text-serenade opacity-0 transition-[opacity,background-color] duration-200 group-hover:bg-creole/50 group-hover:opacity-100">
          Change
        </span>
      </button>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-heath px-5 py-2 text-xs font-medium tracking-[0.2em] text-heath uppercase hover:bg-heath hover:text-serenade"
      >
        {value ? 'Change Image' : 'Choose Image'}
      </button>

      {open ? (
        <MediaPickerModal
          media={media}
          currentUrl={value}
          onClose={() => setOpen(false)}
          onSet={(url) => {
            onChange(url);
            setOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
