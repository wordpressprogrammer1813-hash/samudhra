'use client';

import { useMemo, useState, useTransition } from 'react';
import { updateSectionContent } from '@/app/admin/(protected)/pages/[id]/actions';
import { CustomizeTextField } from '@/components/customize-text-field';
import { MediaPicker } from '@/components/media-picker';
import type { MediaItem } from '@/lib/media';
import type { HeroContent } from '@/lib/pages';

export function HeroSectionForm({
  pageId,
  sectionId,
  content,
  media,
}: {
  pageId: string;
  sectionId: string;
  content: HeroContent;
  media: MediaItem[];
}) {
  const [saved, setSaved] = useState(content);
  const [draft, setDraft] = useState(content);
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  function setAction(index: number, field: 'label' | 'href', value: string) {
    setDraft((prev) => {
      const actions = [...prev.actions];
      actions[index] = { ...actions[index], [field]: value };
      return { ...prev, actions };
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
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="flex-1">
          <CustomizeTextField
            label="Eyebrow"
            value={draft.eyebrow}
            onChange={(eyebrow) => setDraft((prev) => ({ ...prev, eyebrow }))}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row">
        <div className="flex-1">
          <CustomizeTextField
            label="Headline — line 1"
            value={draft.titleLine1}
            onChange={(titleLine1) => setDraft((prev) => ({ ...prev, titleLine1 }))}
          />
        </div>
        <div className="flex-1">
          <CustomizeTextField
            label="Headline — line 2"
            value={draft.titleLine2}
            onChange={(titleLine2) => setDraft((prev) => ({ ...prev, titleLine2 }))}
          />
        </div>
      </div>

      <div className="mt-5">
        <CustomizeTextField
          label="Sub-line"
          value={draft.subtitle}
          multiline
          onChange={(subtitle) => setDraft((prev) => ({ ...prev, subtitle }))}
        />
      </div>

      <div className="mt-6">
        <span className="mb-1.5 block text-xs font-medium tracking-[0.2em] text-heath/60 uppercase">
          Background image
        </span>
        <MediaPicker
          value={draft.backgroundImage.startsWith('http') ? draft.backgroundImage : null}
          media={media}
          onChange={(backgroundImage) => setDraft((prev) => ({ ...prev, backgroundImage }))}
        />
      </div>

      <div className="mt-8">
        <span className="mb-3 block text-xs font-medium tracking-[0.2em] text-heath/60 uppercase">
          Buttons
        </span>
        <div className="flex flex-wrap gap-4">
          {draft.actions.map((action, index) => (
            <div
              key={index}
              className="flex min-w-60 flex-1 flex-col gap-3 rounded-[3px] border border-heath/15 p-4"
            >
              <CustomizeTextField
                label="Label"
                value={action.label}
                onChange={(value) => setAction(index, 'label', value)}
              />
              <CustomizeTextField
                label="Link"
                value={action.href}
                onChange={(value) => setAction(index, 'href', value)}
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
