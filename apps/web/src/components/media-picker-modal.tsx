'use client';

import { useRef, useState, type DragEvent } from 'react';
import { DIAMOND_PATTERN_URL } from '@/lib/constants';
import type { MediaItem } from '@/lib/media';
import { uploadFileWithProgress } from '@/lib/upload-client';

export function MediaPickerModal({
  media,
  currentUrl,
  onClose,
  onSet,
}: {
  media: MediaItem[];
  currentUrl: string | null;
  onClose: () => void;
  onSet: (url: string) => void;
}) {
  const [items, setItems] = useState(media);
  const [selectedUrl, setSelectedUrl] = useState(currentUrl);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const file = Array.from(files)[0];
    if (!file) return;

    setError(null);
    setProgress(0);
    try {
      const item = await uploadFileWithProgress(file, setProgress);
      setItems((prev) => [item, ...prev]);
      setSelectedUrl(item.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    }
    setProgress(null);
  }

  return (
    <div className="fixed inset-0 z-80 grid place-items-center bg-creole/60 p-4 [animation:fade-in_0.2s_ease-out]">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default border-0 bg-transparent p-0"
      />
      <div
        onDragOver={(e: DragEvent) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e: DragEvent) => {
          e.preventDefault();
          setDragging(false);
          void uploadFiles(e.dataTransfer.files);
        }}
        className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-[3px] bg-serenade shadow-[0_30px_80px_-20px_rgba(29,5,6,0.6)] [animation:scale-in_0.25s_cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="flex items-center justify-between border-b border-heath/10 px-6 py-4">
          <p className="text-sm font-medium text-heath">Choose an image</p>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid size-8 place-items-center text-heath/60 hover:text-heath"
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
        </div>

        <div className="relative max-h-[60vh] overflow-y-auto p-6">
          {dragging ? (
            <div className="pointer-events-none absolute inset-2 z-10 grid place-items-center rounded-[3px] border-2 border-dashed border-zest bg-serenade/95">
              <p className="text-sm font-medium text-zest">Drop to upload</p>
            </div>
          ) : null}

          <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={progress !== null}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-[3px] border-2 border-dashed border-heath/25 text-heath/50 transition-colors hover:border-heath hover:text-heath disabled:opacity-60"
            >
              {progress !== null ? (
                <div className="w-full px-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-heath/15">
                    <div
                      className="h-full rounded-full bg-zest transition-[width] duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-center text-[11px]">{progress}%</p>
                </div>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="size-5"
                  >
                    <path d="M12 16V4M12 4l-4 4M12 4l4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
                  </svg>
                  <span className="text-[11px] tracking-[0.1em] uppercase">Upload</span>
                </>
              )}
            </button>

            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedUrl(item.url)}
                className={`group relative aspect-square overflow-hidden rounded-[3px] border-2 transition-colors ${
                  selectedUrl === item.url ? 'border-zest' : 'border-transparent'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external/storage URL thumbnail */}
                <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
                <span
                  aria-hidden
                  style={{
                    backgroundImage: `url(${DIAMOND_PATTERN_URL})`,
                    backgroundSize: '100px',
                  }}
                  className="pointer-events-none absolute inset-0 bg-repeat opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-70"
                />
              </button>
            ))}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              if (e.target.files) void uploadFiles(e.target.files);
              e.target.value = '';
            }}
          />
          {error ? <p className="mt-3 text-xs text-red-700">{error}</p> : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-heath/10 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-heath/30 px-5 py-2 text-xs font-medium tracking-[0.2em] text-heath uppercase hover:bg-heath/5"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedUrl}
            onClick={() => {
              if (selectedUrl) onSet(selectedUrl);
            }}
            className="rounded-full border border-heath bg-heath px-5 py-2 text-xs font-medium tracking-[0.2em] text-serenade uppercase disabled:cursor-not-allowed disabled:opacity-50"
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
}
