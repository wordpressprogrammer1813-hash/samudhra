'use client';

import { ImageWithFallback } from '@/components/image-with-fallback';
import { Reveal } from '@/components/scroll-reveal';

export interface DiningRowItem {
  image: string;
  description: string;
  title: string;
  href: string;
}

export interface DiningLoungeProps {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  rows?: DiningRowItem[];
}

const DEFAULT_ROWS: DiningRowItem[] = [
  {
    image: '/images/beetroot-dish.jpg',
    description: 'The dining room, service and the evening at the table.',
    title: 'Dining Experience',
    href: '#dining',
  },
  {
    image: '/images/bartender-mixing.jpg',
    description: 'Cocktails and conversation, poured with care for spice and balance.',
    title: 'The Lounge',
    href: '#dining',
  },
  {
    image: '/images/cocktails-bar.jpg',
    description: 'Food, drinks and the rooms they’re served in.',
    title: 'Photo Gallery',
    href: '#dining',
  },
];

export function DiningLounge({
  eyebrow = '02 — DINING & LOUNGE',
  heading = 'Stay a While',
  intro = 'From the first plate to the last pour — an evening at Samudhra is meant to be lingered over.',
  rows = DEFAULT_ROWS,
}: DiningLoungeProps) {
  return (
    <section
      id="dining"
      aria-labelledby="dining-title"
      className="relative overflow-hidden bg-serenade py-[clamp(75px,8vw,120px)] text-heath select-none"
    >
      {/* Right-Side Luxury Diamond Pattern Texture (From Banner Section) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-[60%] lg:w-[48%] select-none overflow-hidden"
      >
        <div
          className="size-full opacity-25"
          style={{
            backgroundImage: "url('/images/diamond-pattern.png')",
            backgroundRepeat: 'repeat',
            backgroundPosition: 'right center',
            backgroundSize: 'auto 100%',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.8) 55%, #000 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 20%, rgba(0,0,0,0.8) 55%, #000 100%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-14">
        {/* Section Header (No bottom border — matches screenshot design) */}
        <Reveal>
          <div className="mb-8 flex flex-col justify-between gap-4 md:mb-12 md:flex-row md:items-end">
            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] xl:text-[12px] font-semibold tracking-[0.24em] text-zest uppercase">
                {eyebrow}
              </span>
              <h2
                id="dining-title"
                className="text-[clamp(42px,4.8vw,70px)] leading-[0.94] font-normal tracking-[-0.02em] text-heath"
              >
                {heading}
              </h2>
            </div>
            <p className="max-w-[340px] text-[13px] xl:text-[14px] leading-[1.65] font-normal text-heath/80 md:text-right">
              {intro}
            </p>
          </div>
        </Reveal>

        {/* Interactive List Rows (Single top border, dividers between rows, and bottom border) */}
        <div className="divide-y divide-heath/20 border-t border-b border-heath/20">
          {rows.map((row, idx) => (
            <Reveal key={idx} delay={idx * 110}>
              <a
                href={row.href}
                className="group grid grid-cols-[100px_1fr_44px] items-center gap-4 py-5 no-underline transition-colors duration-400 hover:bg-heath/[0.03] sm:grid-cols-[150px_1fr_52px] sm:gap-6 md:grid-cols-[200px_minmax(0,1fr)_minmax(0,1.8fr)_56px] md:gap-8 md:py-6 lg:grid-cols-[210px_minmax(0,1fr)_minmax(0,2fr)_60px]"
              >
              {/* Column 1: Thumbnail */}
              <div className="aspect-[16/10] w-full overflow-hidden rounded-[16px] bg-heath/10 shadow-[0_12px_24px_-10px_rgba(77,15,16,0.3)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_16px_30px_-10px_rgba(77,15,16,0.4)]">
                <ImageWithFallback
                  src={row.image}
                  alt={row.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
              </div>

              {/* Column 2: Caption (Visible on md and above) */}
              <p className="hidden text-[13px] xl:text-[14px] leading-[1.6] font-normal text-heath/75 md:block md:max-w-[230px]">
                {row.description}
              </p>

              {/* Column 3: Big Display Title (Stacked lines if two words, like 'Dining Experience') */}
              <div className="flex flex-col justify-center">
                <h3 className="max-w-[320px] text-[clamp(28px,3.6vw,52px)] leading-[1.02] font-normal tracking-[-0.01em] text-heath transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                  {row.title === 'Dining Experience' ? (
                    <>
                      Dining
                      <br />
                      Experience
                    </>
                  ) : (
                    row.title
                  )}
                </h3>
                {/* Mobile-only short description fallback */}
                <p className="mt-1 text-[12px] leading-snug text-heath/70 md:hidden">
                  {row.description}
                </p>
              </div>

              {/* Column 4: Trailing Round Arrow Button */}
              <div className="flex size-11 items-center justify-center justify-self-end rounded-full border border-heath/35 text-heath transition-all duration-300 group-hover:border-heath group-hover:bg-heath group-hover:text-serenade sm:size-[52px]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  className="size-[18px] transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M4 12h16M14 6l6 6-6 6" />
                </svg>
              </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
