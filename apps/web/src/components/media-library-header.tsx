'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, type DragEvent } from 'react';
import { uploadFileWithProgress } from '@/lib/upload-client';

export function MediaLibraryHeader({ fileCount }: { fileCount: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{
    index: number;
    total: number;
    percent: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0) return;

    setError(null);
    for (let i = 0; i < list.length; i++) {
      setProgress({ index: i + 1, total: list.length, percent: 0 });
      try {
        await uploadFileWithProgress(list[i], (percent) =>
          setProgress({ index: i + 1, total: list.length, percent }),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed.');
      }
    }
    setProgress(null);
    router.refresh();
  }

  return (
    <div className="border-b border-heath/10 pb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-heath">Media Library</h1>
          <p className="mt-1 text-sm text-heath/55">
            {fileCount} file{fileCount === 1 ? '' : 's'} · available across the site
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-medium tracking-[0.2em] uppercase transition-colors duration-300 ${
            open
              ? 'border-zest bg-zest text-heath'
              : 'border-heath bg-heath text-serenade hover:bg-zest hover:text-heath'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="size-4"
          >
            <path d="M12 16V4M12 4l-4 4M12 4l4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
          </svg>
          Add Media File
        </button>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'mt-5 grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
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
            className={`flex flex-col items-center justify-center gap-3 rounded-[3px] border-2 border-dashed p-12 text-center transition-colors duration-200 ${
              dragging ? 'border-zest bg-zest/5' : 'border-heath/25'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              className={`size-8 ${dragging ? 'text-zest' : 'text-heath/40'}`}
            >
              <path d="M7 18a5 5 0 0 1-1-9.9 6 6 0 0 1 11.3-2A4.5 4.5 0 0 1 18 15" />
              <path d="M12 12v7M9.5 16.5 12 14l2.5 2.5" />
            </svg>

            {progress ? (
              <div className="w-full max-w-xs">
                <p className="mb-2 text-sm text-heath">
                  Uploading {progress.index} of {progress.total}… {progress.percent}%
                </p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-heath/15">
                  <div
                    className="h-full rounded-full bg-zest transition-[width] duration-150"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-heath">Drop files to upload</p>
                <span className="text-xs text-heath/50">or</span>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-full border border-heath px-5 py-2 text-xs font-medium tracking-[0.2em] text-heath uppercase transition-colors duration-200 hover:bg-heath hover:text-serenade"
                >
                  Select Files
                </button>
              </>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                if (e.target.files) void uploadFiles(e.target.files);
                e.target.value = '';
              }}
            />
            {error ? <p className="text-xs text-red-700">{error}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
