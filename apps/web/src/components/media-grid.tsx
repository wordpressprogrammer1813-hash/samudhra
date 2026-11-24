'use client';

import { useState } from 'react';
import { MediaDetailsModal } from '@/components/media-details-modal';
import { DIAMOND_PATTERN_URL } from '@/lib/constants';
import type { MediaItem } from '@/lib/media';

export function MediaGrid({ items: initialItems }: { items: MediaItem[] }) {
  // Local copy so a delete can remove a card instantly instead of waiting on
  // the server round-trip; re-synced (render-time, not an effect) whenever
  // the server sends a fresh list.
  const [items, setItems] = useState(initialItems);
  const [prevInitialItems, setPrevInitialItems] = useState(initialItems);
  if (initialItems !== prevInitialItems) {
    setPrevInitialItems(initialItems);
    setItems(initialItems);
  }

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = items.find((item) => item.id === selectedId) ?? null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[3px] border border-dashed border-heath/20 py-20 text-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          className="size-10 text-heath/30"
        >
          <rect x="3" y="4" width="18" height="16" rx="1.5" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="m4 17 5-5 3 3 4-4 4 4" />
        </svg>
        <p className="text-sm text-heath/60">No media yet — upload your first file above.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-4">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedId(item.id)}
            className="group relative block aspect-square overflow-hidden rounded-[3px] border border-heath/15 bg-heath/5 transition-shadow duration-300 hover:shadow-[0_14px_32px_-14px_rgba(29,5,6,0.4)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external/storage URL thumbnail */}
            <img
              src={item.url}
              alt={item.alt}
              className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
            />
            <span
              aria-hidden
              style={{ backgroundImage: `url(${DIAMOND_PATTERN_URL})`, backgroundSize: '140px' }}
              className="pointer-events-none absolute inset-0 bg-repeat opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-70"
            />
            <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-creole/85 to-transparent px-2 pt-8 pb-2 opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
              <span className="block truncate text-xs text-serenade">{item.title}</span>
            </span>
          </button>
        ))}
      </div>

      {selected ? (
        <MediaDetailsModal
          item={selected}
          onClose={() => setSelectedId(null)}
          onDeleted={() => {
            setItems((prev) => prev.filter((i) => i.id !== selected.id));
            setSelectedId(null);
          }}
        />
      ) : null}
    </>
  );
}
