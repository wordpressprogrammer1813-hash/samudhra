'use client';

import { Reveal } from '@/components/scroll-reveal';

export interface LocationDetail {
  numberLabel: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  email: string;
  reserveHref: string;
}

export interface ContactSectionProps {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  reserveCtaLabel?: string;
  reserveCtaHref?: string;
  orderCtaLabel?: string;
  orderCtaHref?: string;
  selectedLocation?: 'New Jersey' | 'New York' | string | null;
  selectedIndex?: number;
  locations?: LocationDetail[];
  onReserveClick?: (locationName?: string) => void;
  onOrderClick?: (locationName?: string) => void;
}

export const DEFAULT_LOCATIONS: LocationDetail[] = [
  {
    numberLabel: 'LOCATION 01',
    name: 'New Jersey',
    address: '379 Thornall Street, Edison, NJ 08837',
    hours: 'Mon–Sun: 11:30 AM – 10:30 PM',
    phone: '+1 (732) 548-1111',
    email: 'newjersey@samudhra.com',
    reserveHref: '#contact',
  },
  {
    numberLabel: 'LOCATION 02',
    name: 'New York',
    address: '120 Lexington Avenue, New York, NY 10016',
    hours: 'Mon–Sun: 12:00 PM – 11:00 PM',
    phone: '+1 (212) 686-2222',
    email: 'newyork@samudhra.com',
    reserveHref: '#contact',
  },
];

export function ContactSection({
  eyebrow = '05 — CONTACT',
  heading = 'Find Us',
  intro = 'Location & hours, and how to reach the team for reservations, orders and events.',
  reserveCtaLabel = 'RESERVE A TABLE',
  reserveCtaHref = '#contact',
  orderCtaLabel = 'ORDER ONLINE',
  orderCtaHref = '#contact',
  selectedLocation = 'New Jersey',
  selectedIndex = 0,
  locations = DEFAULT_LOCATIONS,
  onReserveClick,
  onOrderClick,
}: ContactSectionProps) {
  const normalizedSelected = (selectedLocation || '').trim().toLowerCase();

  const findByName = (list: LocationDetail[]) => {
    if (!normalizedSelected) return undefined;
    return (
      list.find((loc) => loc.name.trim().toLowerCase() === normalizedSelected) ||
      list.find((loc) => {
        const name = loc.name.trim().toLowerCase();
        return Boolean(name) && (name.includes(normalizedSelected) || normalizedSelected.includes(name));
      })
    );
  };

  // Match against custom DB locations first, then DEFAULT_LOCATIONS, then by card index
  const activeLoc =
    findByName(locations) ||
    findByName(DEFAULT_LOCATIONS) ||
    locations[selectedIndex] ||
    DEFAULT_LOCATIONS[selectedIndex] ||
    locations[0] ||
    DEFAULT_LOCATIONS[0];

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden bg-serenade py-[clamp(80px,8vw,130px)] text-heath select-none"
    >
      <div className="relative z-10 mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          {/* ================= LEFT COLUMN: Eyebrow, Heading, Intro & Action Buttons ================= */}
          <Reveal className="lg:col-span-5">
            <div className="flex flex-col items-start gap-5">
            <span className="text-[11px] xl:text-[12px] font-semibold tracking-[0.24em] text-zest uppercase">
              {eyebrow}
            </span>

            <h2
              id="contact-title"
              className="text-[clamp(44px,5.2vw,74px)] leading-[0.96] font-normal tracking-[-0.02em] text-heath"
            >
              {heading}
            </h2>

            <p className="max-w-[340px] text-[14px] xl:text-[15px] leading-[1.65] font-normal text-heath/80">
              {intro}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {onReserveClick ? (
                <button
                  type="button"
                  onClick={() => onReserveClick(activeLoc?.name)}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-heath bg-heath px-7 text-[11px] font-semibold tracking-[0.18em] text-serenade uppercase transition-colors duration-300 hover:bg-serenade hover:text-heath shadow-md cursor-pointer"
                >
                  {reserveCtaLabel}
                </button>
              ) : (
                <a
                  href={reserveCtaHref}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-heath bg-heath px-7 text-[11px] font-semibold tracking-[0.18em] text-serenade uppercase transition-colors duration-300 hover:bg-serenade hover:text-heath shadow-md"
                >
                  {reserveCtaLabel}
                </a>
              )}

              {onOrderClick ? (
                <button
                  type="button"
                  onClick={() => onOrderClick(activeLoc?.name)}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-heath bg-transparent px-7 text-[11px] font-semibold tracking-[0.18em] text-heath uppercase transition-colors duration-300 hover:bg-heath hover:text-serenade cursor-pointer"
                >
                  {orderCtaLabel}
                </button>
              ) : (
                <a
                  href={orderCtaHref}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-heath bg-transparent px-7 text-[11px] font-semibold tracking-[0.18em] text-heath uppercase transition-colors duration-300 hover:bg-heath hover:text-serenade"
                >
                  {orderCtaLabel}
                </a>
              )}
            </div>
            </div>
          </Reveal>

          {/* ================= RIGHT COLUMN: Location Table (No Tabs, Displays Chosen Location) ================= */}
          <Reveal delay={140} className="lg:col-span-7">
            <div className="flex w-full flex-col gap-4">
            {/* Header: Location Number Label + Location Name */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] xl:text-[12px] font-medium tracking-[0.24em] text-heath/70 uppercase">
                {activeLoc?.numberLabel}
              </span>

              <h3 className="text-[clamp(32px,3.4vw,46px)] leading-[1.0] font-normal tracking-[-0.01em] text-heath">
                {activeLoc?.name}
              </h3>
            </div>

            {/* Location Data Table with Hairline Dividers */}
            <div className="mt-2 divide-y divide-heath/20 border-t border-b border-heath/20">
              {/* Row 1: Address */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4 py-4 sm:grid-cols-[140px_1fr]">
                <span className="text-[11px] font-medium tracking-[0.2em] text-heath/70 uppercase">
                  ADDRESS
                </span>
                <span className="text-right text-[13px] xl:text-[14px] font-normal text-heath">
                  {activeLoc?.address}
                </span>
              </div>

              {/* Row 2: Hours */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4 py-4 sm:grid-cols-[140px_1fr]">
                <span className="text-[11px] font-medium tracking-[0.2em] text-heath/70 uppercase">
                  HOURS
                </span>
                <span className="text-right text-[13px] xl:text-[14px] font-normal text-heath">
                  {activeLoc?.hours}
                </span>
              </div>

              {/* Row 3: Phone */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4 py-4 sm:grid-cols-[140px_1fr]">
                <span className="text-[11px] font-medium tracking-[0.2em] text-heath/70 uppercase">
                  PHONE
                </span>
                <a
                  href={`tel:${activeLoc?.phone.replace(/[^0-9+]/g, '')}`}
                  className="text-right text-[13px] xl:text-[14px] font-normal text-heath transition-colors hover:text-zest"
                >
                  {activeLoc?.phone}
                </a>
              </div>

              {/* Row 4: Email */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4 py-4 sm:grid-cols-[140px_1fr]">
                <span className="text-[11px] font-medium tracking-[0.2em] text-heath/70 uppercase">
                  EMAIL
                </span>
                <a
                  href={`mailto:${activeLoc?.email}`}
                  className="text-right text-[13px] xl:text-[14px] font-normal text-heath transition-colors hover:text-zest"
                >
                  {activeLoc?.email}
                </a>
              </div>
            </div>

            {/* Action Link: Reserve Here */}
            <div className="pt-2">
              {onReserveClick ? (
                <button
                  type="button"
                  onClick={() => onReserveClick(activeLoc?.name)}
                  className="group inline-flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.22em] text-heath uppercase transition-colors hover:text-zest cursor-pointer"
                >
                  <span>RESERVE HERE</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                  >
                    <path d="M4 12h16M14 6l6 6-6 6" />
                  </svg>
                </button>
              ) : (
                <a
                  href={activeLoc?.reserveHref}
                  className="group inline-flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.22em] text-heath uppercase transition-colors hover:text-zest"
                >
                  <span>RESERVE HERE</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                  >
                    <path d="M4 12h16M14 6l6 6-6 6" />
                  </svg>
                </a>
              )}
            </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
