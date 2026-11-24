'use client';

import { useMemo, useState, useTransition } from 'react';
import { updateSectionContent } from '@/app/admin/(protected)/pages/[id]/actions';
import { CustomizeTextField } from '@/components/customize-text-field';
import type { ContactContent, ContactLocationContent } from '@/lib/pages';

export function ContactSectionForm({
  pageId,
  sectionId,
  content,
}: {
  pageId: string;
  sectionId: string;
  content: ContactContent;
}) {
  const [saved, setSaved] = useState(content);
  const [draft, setDraft] = useState(content);
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  function setField<K extends keyof ContactContent>(key: K, value: ContactContent[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function setLocation(index: number, patch: Partial<ContactLocationContent>) {
    setDraft((prev) => {
      const locations = prev.locations.map((l, i) => (i === index ? { ...l, ...patch } : l));
      return { ...prev, locations };
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

      <div className="mt-5 flex flex-col gap-5 sm:flex-row">
        <div className="flex-1">
          <CustomizeTextField
            label="Reserve button label"
            value={draft.reserveCtaLabel}
            onChange={(v) => setField('reserveCtaLabel', v)}
          />
        </div>
        <div className="flex-1">
          <CustomizeTextField
            label="Reserve button link"
            value={draft.reserveCtaHref}
            onChange={(v) => setField('reserveCtaHref', v)}
          />
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-5 sm:flex-row">
        <div className="flex-1">
          <CustomizeTextField
            label="Order button label"
            value={draft.orderCtaLabel}
            onChange={(v) => setField('orderCtaLabel', v)}
          />
        </div>
        <div className="flex-1">
          <CustomizeTextField
            label="Order button link"
            value={draft.orderCtaHref}
            onChange={(v) => setField('orderCtaHref', v)}
          />
        </div>
      </div>

      <div className="mt-8">
        <span className="mb-3 block text-xs font-medium tracking-[0.2em] text-heath/60 uppercase">
          Locations
        </span>
        <div className="flex flex-col gap-5">
          {draft.locations.map((loc, index) => (
            <div key={index} className="rounded-[3px] border border-heath/15 p-4">
              <span className="mb-3 block text-xs font-medium tracking-[0.2em] text-heath/50 uppercase">
                Location {index + 1}
              </span>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <div className="w-24">
                    <CustomizeTextField
                      label="No."
                      value={loc.numberLabel}
                      onChange={(v) => setLocation(index, { numberLabel: v })}
                    />
                  </div>
                  <div className="flex-1">
                    <CustomizeTextField
                      label="Name"
                      value={loc.name}
                      onChange={(v) => setLocation(index, { name: v })}
                    />
                  </div>
                </div>
                <CustomizeTextField
                  label="Address"
                  value={loc.address}
                  multiline
                  onChange={(v) => setLocation(index, { address: v })}
                />
                <CustomizeTextField
                  label="Hours"
                  value={loc.hours}
                  multiline
                  onChange={(v) => setLocation(index, { hours: v })}
                />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <CustomizeTextField
                      label="Phone"
                      value={loc.phone}
                      onChange={(v) => setLocation(index, { phone: v })}
                    />
                  </div>
                  <div className="flex-1">
                    <CustomizeTextField
                      label="Email"
                      value={loc.email}
                      onChange={(v) => setLocation(index, { email: v })}
                    />
                  </div>
                </div>
                <CustomizeTextField
                  label="Reserve link"
                  value={loc.reserveHref}
                  onChange={(v) => setLocation(index, { reserveHref: v })}
                />
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
