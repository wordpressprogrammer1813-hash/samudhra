'use client';

import { useMemo, useState, useTransition, type ReactNode } from 'react';
import { saveCustomize } from '@/app/admin/(protected)/customize/actions';
import { CustomizeTextField } from '@/components/customize-text-field';
import { MediaPicker } from '@/components/media-picker';
import { MenuSelect } from '@/components/menu-select';
import type { MediaItem } from '@/lib/media';
import type { MenuSummary } from '@/lib/menus';
import type {
  HeaderButton,
  LayoutSettings,
  LocationGateCard,
  LocationGateSettings,
  LocationGateSocialLinks,
  SiteSettings,
} from '@/lib/settings';

const FOOTER_SLOT_LABELS = [
  'Footer column 1',
  'Footer column 2',
  'Footer column 3',
  'Footer column 4',
  'Footer column 5',
];

interface Draft {
  logoUrl: string | null;
  tagline: string;
  headerMenuId: string | null;
  headerButtons: [HeaderButton, HeaderButton];
  footerMenuIds: (string | null)[];
  locationGate: LocationGateSettings;
}

function toDraft(
  site: SiteSettings,
  layout: LayoutSettings,
  locationGate: LocationGateSettings,
): Draft {
  return {
    logoUrl: site.logoUrl,
    tagline: site.tagline,
    headerMenuId: layout.headerMenuId,
    headerButtons: layout.headerButtons,
    footerMenuIds: layout.footerMenuIds,
    locationGate,
  };
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-heath/10 py-8 first:pt-0 last:border-b-0">
      <h2 className="text-lg font-semibold text-heath">{title}</h2>
      {description ? <p className="mt-1 text-sm text-heath/55">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function CustomizeForm({
  site,
  layout,
  locationGate,
  media,
  menus,
}: {
  site: SiteSettings;
  layout: LayoutSettings;
  locationGate: LocationGateSettings;
  media: MediaItem[];
  menus: MenuSummary[];
}) {
  const [saved, setSaved] = useState(() => toDraft(site, layout, locationGate));
  const [draft, setDraft] = useState(saved);
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  function setHeaderButton(index: 0 | 1, field: keyof HeaderButton, value: string) {
    setDraft((prev) => {
      const headerButtons = [...prev.headerButtons] as [HeaderButton, HeaderButton];
      headerButtons[index] = { ...headerButtons[index], [field]: value };
      return { ...prev, headerButtons };
    });
  }

  function setFooterMenuSlot(index: number, menuId: string) {
    setDraft((prev) => {
      const footerMenuIds = [...prev.footerMenuIds];
      footerMenuIds[index] = menuId;
      return { ...prev, footerMenuIds };
    });
  }

  function setGateCard(index: 0 | 1, patch: Partial<LocationGateCard>) {
    setDraft((prev) => {
      const cards = [...prev.locationGate.cards] as [LocationGateCard, LocationGateCard];
      cards[index] = { ...cards[index], ...patch };
      return { ...prev, locationGate: { ...prev.locationGate, cards } };
    });
  }

  function setGateMenu(menuId: string) {
    setDraft((prev) => ({ ...prev, locationGate: { ...prev.locationGate, menuId } }));
  }

  function setGateSocial(field: keyof LocationGateSocialLinks, value: string) {
    setDraft((prev) => ({
      ...prev,
      locationGate: {
        ...prev.locationGate,
        socialLinks: {
          ...prev.locationGate.socialLinks,
          [field]: value,
        },
      },
    }));
  }

  function handleSave() {
    startTransition(async () => {
      await saveCustomize(draft);
      setSaved(draft);
    });
  }

  return (
    <div className="pb-24">
      <h1 className="text-2xl font-semibold text-heath">Website Customize</h1>
      <p className="mt-1 text-sm text-heath/55">
        Controls what the header and footer show on the live site.
      </p>

      <div className="mt-8">
        <Section title="Brand Logo" description="Shown in the header and footer.">
          <MediaPicker
            value={draft.logoUrl}
            media={media}
            onChange={(logoUrl) => setDraft((prev) => ({ ...prev, logoUrl }))}
          />
        </Section>

        <Section title="Header Menu" description="Which menu fills the header's nav drawer.">
          <MenuSelect
            value={draft.headerMenuId}
            menus={menus}
            onChange={(headerMenuId) => setDraft((prev) => ({ ...prev, headerMenuId }))}
          />
        </Section>

        <Section
          title="Header Buttons"
          description="The two buttons in the top-right of the header."
        >
          <div className="flex flex-wrap gap-5">
            {draft.headerButtons.map((button, index) => (
              <div
                key={index}
                className="flex min-w-60 flex-1 flex-col gap-3 rounded-[3px] border border-heath/15 p-4"
              >
                <CustomizeTextField
                  label="Label"
                  value={button.label}
                  onChange={(value) => setHeaderButton(index as 0 | 1, 'label', value)}
                />
                <CustomizeTextField
                  label="Link"
                  value={button.link}
                  onChange={(value) => setHeaderButton(index as 0 | 1, 'link', value)}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Footer Content" description="The tagline next to the logo in the footer.">
          <CustomizeTextField
            label="Tagline"
            value={draft.tagline}
            multiline
            onChange={(tagline) => setDraft((prev) => ({ ...prev, tagline }))}
          />
        </Section>

        <Section title="Footer Menu" description="Which menu fills each of the footer's 5 columns.">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {FOOTER_SLOT_LABELS.map((label, index) => (
              <label key={label} className="block min-w-36 flex-1">
                <span className="mb-1.5 block truncate text-xs font-medium tracking-[0.2em] text-heath/60 uppercase">
                  {label}
                </span>
                <MenuSelect
                  value={draft.footerMenuIds[index] ?? null}
                  menus={menus}
                  onChange={(menuId) => setFooterMenuSlot(index, menuId)}
                />
              </label>
            ))}
          </div>
        </Section>

        <Section
          title="Welcome Popup"
          description="The location-choice screen shown when the site first loads."
        >
          <div className="flex flex-col gap-5 lg:flex-row">
            {draft.locationGate.cards.map((card, index) => (
              <div
                key={index}
                className="flex flex-1 flex-col gap-4 rounded-[3px] border border-heath/15 p-4"
              >
                <span className="text-xs font-medium tracking-[0.2em] text-heath/50 uppercase">
                  Card {index + 1}
                </span>
                <MediaPicker
                  value={card.backgroundImage.startsWith('http') ? card.backgroundImage : null}
                  media={media}
                  onChange={(v) => setGateCard(index as 0 | 1, { backgroundImage: v })}
                />
                <CustomizeTextField
                  label="Location name"
                  value={card.name}
                  onChange={(v) => setGateCard(index as 0 | 1, { name: v })}
                />
                <CustomizeTextField
                  label="Description"
                  value={card.description}
                  multiline
                  onChange={(v) => setGateCard(index as 0 | 1, { description: v })}
                />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <CustomizeTextField
                      label="Reserve button label"
                      value={card.reserveLabel}
                      onChange={(v) => setGateCard(index as 0 | 1, { reserveLabel: v })}
                    />
                  </div>
                  <div className="flex-1">
                    <CustomizeTextField
                      label="Order button label"
                      value={card.orderLabel}
                      onChange={(v) => setGateCard(index as 0 | 1, { orderLabel: v })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <span className="mb-1.5 block text-xs font-medium tracking-[0.2em] text-heath/60 uppercase">
                Footer menu
              </span>
              <MenuSelect value={draft.locationGate.menuId} menus={menus} onChange={setGateMenu} />
            </div>
            <CustomizeTextField
              label="Instagram URL"
              value={draft.locationGate.socialLinks?.instagramUrl ?? ''}
              onChange={(v) => setGateSocial('instagramUrl', v)}
            />
            <CustomizeTextField
              label="TikTok URL"
              value={draft.locationGate.socialLinks?.tiktokUrl ?? ''}
              onChange={(v) => setGateSocial('tiktokUrl', v)}
            />
          </div>
        </Section>
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
