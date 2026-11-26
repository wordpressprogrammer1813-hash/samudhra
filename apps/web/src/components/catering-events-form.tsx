'use client';

import { useMemo, useState, useTransition } from 'react';
import { updateSectionContent } from '@/app/admin/(protected)/pages/[id]/actions';
import { CustomizeTextField } from '@/components/customize-text-field';
import { MediaPicker } from '@/components/media-picker';
import type { MediaItem } from '@/lib/media';
import type { CateringCardContent, CateringEventsContent } from '@/lib/pages';

export function CateringEventsForm({
  pageId,
  sectionId,
  content,
  media,
}: {
  pageId: string;
  sectionId: string;
  content: CateringEventsContent;
  media: MediaItem[];
}) {
  const [saved, setSaved] = useState(content);
  const [draft, setDraft] = useState(content);
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  function setField<K extends keyof CateringEventsContent>(
    key: K,
    value: CateringEventsContent[K],
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function setCard(index: number, patch: Partial<CateringCardContent>) {
    setDraft((prev) => {
      const cards = prev.cards.map((c, i) => (i === index ? { ...c, ...patch } : c));
      return { ...prev, cards };
    });
  }

  function addCard() {
    setDraft((prev) => ({
      ...prev,
      cards: [
        ...prev.cards,
        { image: '', titleLine1: '', titleLine2: '', subtitle: '', ctaLabel: '', href: '' },
      ],
    }));
  }

  function removeCard(index: number) {
    setDraft((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index),
    }));
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
              value={draft.headingLine1}
              onChange={(v) => setField('headingLine1', v)}
            />
          </div>
          <div className="flex-1">
            <CustomizeTextField
              label="Heading — line 2"
              value={draft.headingLine2}
              onChange={(v) => setField('headingLine2', v)}
            />
          </div>
          <div className="flex-1">
            <CustomizeTextField
              label="Heading — line 3"
              value={draft.headingLine3}
              onChange={(v) => setField('headingLine3', v)}
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

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium tracking-[0.2em] text-heath/60 uppercase">
            Cards ({draft.cards.length})
          </span>
          <button
            type="button"
            onClick={addCard}
            className="rounded-full border border-heath/30 px-4 py-1.5 text-[11px] font-medium tracking-[0.16em] text-heath uppercase transition-colors hover:bg-heath hover:text-serenade"
          >
            + Add card
          </button>
        </div>

        <div className="flex flex-col gap-5">
          {draft.cards.map((card, index) => (
            <div key={index} className="rounded-[3px] border border-heath/15 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium tracking-[0.2em] text-heath/50 uppercase">
                  Card {index + 1}
                </span>
                {draft.cards.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeCard(index)}
                    className="text-xs font-medium tracking-[0.12em] text-korma uppercase hover:text-heath"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <MediaPicker
                  value={card.image.startsWith('http') ? card.image : null}
                  media={media}
                  onChange={(v) => setCard(index, { image: v })}
                />
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <CustomizeTextField
                        label="Title — line 1"
                        value={card.titleLine1}
                        onChange={(v) => setCard(index, { titleLine1: v })}
                      />
                    </div>
                    <div className="flex-1">
                      <CustomizeTextField
                        label="Title — line 2"
                        value={card.titleLine2}
                        onChange={(v) => setCard(index, { titleLine2: v })}
                      />
                    </div>
                  </div>
                  <CustomizeTextField
                    label="Subtitle"
                    value={card.subtitle}
                    onChange={(v) => setCard(index, { subtitle: v })}
                  />
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <CustomizeTextField
                        label="Link label"
                        value={card.ctaLabel}
                        onChange={(v) => setCard(index, { ctaLabel: v })}
                      />
                    </div>
                    <div className="flex-1">
                      <CustomizeTextField
                        label="Link"
                        value={card.href}
                        onChange={(v) => setCard(index, { href: v })}
                      />
                    </div>
                  </div>
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
