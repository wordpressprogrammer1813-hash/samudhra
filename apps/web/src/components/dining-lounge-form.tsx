'use client';

import { useMemo, useState, useTransition } from 'react';
import { updateSectionContent } from '@/app/admin/(protected)/pages/[id]/actions';
import { CustomizeTextField } from '@/components/customize-text-field';
import { MediaPicker } from '@/components/media-picker';
import type { MediaItem } from '@/lib/media';
import type { DiningLoungeContent, DiningRowContent } from '@/lib/pages';

export function DiningLoungeForm({
  pageId,
  sectionId,
  content,
  media,
}: {
  pageId: string;
  sectionId: string;
  content: DiningLoungeContent;
  media: MediaItem[];
}) {
  const [saved, setSaved] = useState(content);
  const [draft, setDraft] = useState(content);
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  function setField<K extends keyof DiningLoungeContent>(key: K, value: DiningLoungeContent[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function setRow(index: number, patch: Partial<DiningRowContent>) {
    setDraft((prev) => {
      const rows = prev.rows.map((r, i) => (i === index ? { ...r, ...patch } : r));
      return { ...prev, rows };
    });
  }

  function handleSave() {
    startTransition(async () => {
      await updateSectionContent(sectionId, pageId, { ...draft });
      setSaved(draft);
    });
  }

  return (
    <div className="pb-24">
      <div className="flex flex-col gap-5">
        <CustomizeTextField
          label="Eyebrow"
          value={draft.eyebrow}
          onChange={(v) => setField('eyebrow', v)}
        />
        <CustomizeTextField
          label="Heading"
          value={draft.heading}
          onChange={(v) => setField('heading', v)}
        />
        <CustomizeTextField
          label="Intro"
          value={draft.intro}
          multiline
          onChange={(v) => setField('intro', v)}
        />
      </div>

      <div className="mt-8">
        <span className="mb-3 block text-xs font-medium tracking-[0.2em] text-heath/60 uppercase">
          Rows
        </span>
        <div className="flex flex-col gap-5">
          {draft.rows.map((row, index) => (
            <div key={index} className="rounded-[3px] border border-heath/15 p-4">
              <span className="mb-3 block text-xs font-medium tracking-[0.2em] text-heath/50 uppercase">
                Row {index + 1}
              </span>
              <div className="flex flex-col gap-4 sm:flex-row">
                <MediaPicker
                  value={row.image.startsWith('http') ? row.image : null}
                  media={media}
                  onChange={(v) => setRow(index, { image: v })}
                />
                <div className="flex flex-1 flex-col gap-3">
                  <CustomizeTextField
                    label="Title"
                    value={row.title}
                    onChange={(v) => setRow(index, { title: v })}
                  />
                  <CustomizeTextField
                    label="Description"
                    value={row.description}
                    multiline
                    onChange={(v) => setRow(index, { description: v })}
                  />
                  <CustomizeTextField
                    label="Link"
                    value={row.href}
                    onChange={(v) => setRow(index, { href: v })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-heath/15 bg-serenade px-6 py-4 shadow-[0_-10px_30px_-15px_rgba(29,5,6,0.3)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:left-64 sm:px-10 ${
          dirty ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <p className="text-sm text-heath/70">You have unsaved changes.</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setDraft(saved)}
            disabled={pending}
            className="rounded-full border border-heath/30 px-5 py-2 text-xs font-medium tracking-[0.2em] text-heath uppercase hover:bg-heath/5 disabled:opacity-60"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="rounded-full border border-heath bg-heath px-5 py-2 text-xs font-medium tracking-[0.2em] text-serenade uppercase transition-colors duration-300 hover:bg-zest hover:text-heath disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
