'use client';

import { useMemo, useState, useTransition } from 'react';
import { updateSectionContent } from '@/app/admin/(protected)/pages/[id]/actions';
import { CustomizeTextField } from '@/components/customize-text-field';
import { MediaPicker } from '@/components/media-picker';
import type { MediaItem } from '@/lib/media';
import type { WeekendThaliContent } from '@/lib/pages';

export function WeekendThaliForm({
  pageId,
  sectionId,
  content,
  media,
}: {
  pageId: string;
  sectionId: string;
  content: WeekendThaliContent;
  media: MediaItem[];
}) {
  const [saved, setSaved] = useState(content);
  const [draft, setDraft] = useState(content);
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  function setField<K extends keyof WeekendThaliContent>(key: K, value: WeekendThaliContent[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function setFigure(key: keyof WeekendThaliContent['figureImages'], value: string) {
    setDraft((prev) => ({ ...prev, figureImages: { ...prev.figureImages, [key]: value } }));
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
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex-1">
            <CustomizeTextField
              label="Heading — line 1"
              value={draft.titleLine1}
              onChange={(v) => setField('titleLine1', v)}
            />
          </div>
          <div className="flex-1">
            <CustomizeTextField
              label="Heading — line 2"
              value={draft.titleLine2}
              onChange={(v) => setField('titleLine2', v)}
            />
          </div>
        </div>
        <CustomizeTextField
          label="Description"
          value={draft.description}
          multiline
          onChange={(v) => setField('description', v)}
        />
      </div>

      <div className="mt-6 flex flex-col gap-5 sm:flex-row">
        <div className="flex-1">
          <CustomizeTextField
            label="Reserve button label"
            value={draft.reserveLabel}
            onChange={(v) => setField('reserveLabel', v)}
          />
        </div>
        <div className="flex-1">
          <CustomizeTextField
            label="Reserve button link"
            value={draft.reserveHref}
            onChange={(v) => setField('reserveHref', v)}
          />
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-5 sm:flex-row">
        <div className="flex-1">
          <CustomizeTextField
            label="Menu button label"
            value={draft.menuLabel}
            onChange={(v) => setField('menuLabel', v)}
          />
        </div>
        <div className="flex-1">
          <CustomizeTextField
            label="Menu button link"
            value={draft.menuHref}
            onChange={(v) => setField('menuHref', v)}
          />
        </div>
      </div>

      <div className="mt-8">
        <span className="mb-1.5 block text-xs font-medium tracking-[0.2em] text-heath/60 uppercase">
          Thali plate image
        </span>
        <MediaPicker
          value={draft.plateImage.startsWith('http') ? draft.plateImage : null}
          media={media}
          onChange={(v) => setField('plateImage', v)}
        />
      </div>

      <div className="mt-8">
        <span className="mb-3 block text-xs font-medium tracking-[0.2em] text-heath/60 uppercase">
          Surrounding photos
        </span>
        <div className="flex flex-wrap gap-5">
          {(['fig1', 'fig2', 'fig3', 'fig4'] as const).map((key, index) => (
            <div key={key}>
              <span className="mb-1.5 block text-xs text-heath/50">Photo {index + 1}</span>
              <MediaPicker
                value={draft.figureImages[key].startsWith('http') ? draft.figureImages[key] : null}
                media={media}
                onChange={(v) => setFigure(key, v)}
              />
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
