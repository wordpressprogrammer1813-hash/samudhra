'use client';

import { useMemo, useState, useTransition } from 'react';
import { updateSectionContent } from '@/app/admin/(protected)/pages/[id]/actions';
import { CustomizeTextField } from '@/components/customize-text-field';
import { MediaPicker } from '@/components/media-picker';
import type { MediaItem } from '@/lib/media';
import type { OurStoryContent } from '@/lib/pages';

export function OurStoryForm({
  pageId,
  sectionId,
  content,
  media,
}: {
  pageId: string;
  sectionId: string;
  content: OurStoryContent;
  media: MediaItem[];
}) {
  const [saved, setSaved] = useState(content);
  const [draft, setDraft] = useState(content);
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  function setField<K extends keyof OurStoryContent>(key: K, value: OurStoryContent[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
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
          label="Kicker"
          value={draft.kicker}
          onChange={(v) => setField('kicker', v)}
        />
        <CustomizeTextField
          label="Heading"
          value={draft.heading}
          onChange={(v) => setField('heading', v)}
        />
        <CustomizeTextField
          label="Quote"
          value={draft.quote}
          multiline
          onChange={(v) => setField('quote', v)}
        />
        <CustomizeTextField
          label="Body"
          value={draft.body}
          multiline
          onChange={(v) => setField('body', v)}
        />
      </div>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row">
        <div className="flex-1">
          <CustomizeTextField
            label="Button label"
            value={draft.ctaLabel}
            onChange={(v) => setField('ctaLabel', v)}
          />
        </div>
        <div className="flex-1">
          <CustomizeTextField
            label="Button link"
            value={draft.ctaHref}
            onChange={(v) => setField('ctaHref', v)}
          />
        </div>
      </div>

      <div className="mt-6">
        <span className="mb-1.5 block text-xs font-medium tracking-[0.2em] text-heath/60 uppercase">
          Image
        </span>
        <MediaPicker
          value={draft.image.startsWith('http') ? draft.image : null}
          media={media}
          onChange={(v) => setField('image', v)}
        />
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
