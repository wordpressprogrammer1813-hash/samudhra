'use client';

import { useMemo, useState, useTransition } from 'react';
import { updateSectionContent } from '@/app/admin/(protected)/pages/[id]/actions';
import { CustomizeTextField } from '@/components/customize-text-field';
import { MediaPicker } from '@/components/media-picker';
import type { MediaItem } from '@/lib/media';
import type { DishCard, MenuShowcaseContent } from '@/lib/pages';

const EMPTY_CARD: DishCard = {
  numeral: '',
  title: '',
  description: '',
  image: '',
  href: '#menu',
  linkLabel: 'View menu',
};

export function MenuShowcaseForm({
  pageId,
  sectionId,
  content,
  media,
}: {
  pageId: string;
  sectionId: string;
  content: MenuShowcaseContent;
  media: MediaItem[];
}) {
  const [saved, setSaved] = useState(content);
  const [draft, setDraft] = useState(content);
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  function setField<K extends keyof MenuShowcaseContent>(key: K, value: MenuShowcaseContent[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function setCard(index: number, patch: Partial<DishCard>) {
    setDraft((prev) => {
      const cards = prev.cards.map((c, i) => (i === index ? { ...c, ...patch } : c));
      return { ...prev, cards };
    });
  }

  function addCard() {
    setDraft((prev) => ({ ...prev, cards: [...prev.cards, { ...EMPTY_CARD }] }));
  }

  function removeCard(index: number) {
    setDraft((prev) => ({ ...prev, cards: prev.cards.filter((_, i) => i !== index) }));
  }

  function moveCard(index: number, dir: -1 | 1) {
    setDraft((prev) => {
      const next = [...prev.cards];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, cards: next };
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
          label="Body"
          value={draft.body}
          multiline
          onChange={(v) => setField('body', v)}
        />
      </div>

      <div className="mt-6">
        <span className="mb-1.5 block text-xs font-medium tracking-[0.2em] text-heath/60 uppercase">
          Decorative frame (rotates around each dish)
        </span>
        <MediaPicker
          value={draft.starImage.startsWith('http') ? draft.starImage : null}
          media={media}
          onChange={(v) => setField('starImage', v)}
        />
      </div>

      <div className="mt-6 flex flex-col gap-5 sm:flex-row">
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

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium tracking-[0.2em] text-heath/60 uppercase">
            Dishes ({draft.cards.length})
          </span>
          <button
            type="button"
            onClick={addCard}
            className="rounded-full border border-heath px-4 py-1.5 text-xs font-medium tracking-[0.2em] text-heath uppercase hover:bg-heath hover:text-serenade"
          >
            + Add dish
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-5">
          {draft.cards.map((card, index) => (
            <div key={index} className="rounded-[3px] border border-heath/15 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium tracking-[0.2em] text-heath/50 uppercase">
                  Dish {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveCard(index, -1)}
                    disabled={index === 0}
                    aria-label="Move up"
                    className="grid size-7 place-items-center text-heath/50 hover:text-heath disabled:opacity-30"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="size-4"
                    >
                      <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveCard(index, 1)}
                    disabled={index === draft.cards.length - 1}
                    aria-label="Move down"
                    className="grid size-7 place-items-center text-heath/50 hover:text-heath disabled:opacity-30"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="size-4"
                    >
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCard(index)}
                    aria-label="Remove dish"
                    className="grid size-7 place-items-center text-heath/50 hover:text-red-700"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="size-4"
                    >
                      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <MediaPicker
                  value={card.image.startsWith('http') ? card.image : null}
                  media={media}
                  onChange={(v) => setCard(index, { image: v })}
                />
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex gap-3">
                    <div className="w-20">
                      <CustomizeTextField
                        label="No."
                        value={card.numeral}
                        onChange={(v) => setCard(index, { numeral: v })}
                      />
                    </div>
                    <div className="flex-1">
                      <CustomizeTextField
                        label="Title"
                        value={card.title}
                        onChange={(v) => setCard(index, { title: v })}
                      />
                    </div>
                  </div>
                  <CustomizeTextField
                    label="Description"
                    value={card.description}
                    onChange={(v) => setCard(index, { description: v })}
                  />
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <CustomizeTextField
                        label="Link label"
                        value={card.linkLabel}
                        onChange={(v) => setCard(index, { linkLabel: v })}
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
