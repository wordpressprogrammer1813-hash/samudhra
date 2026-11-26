'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { Reveal, ScrollParallax } from '@/components/scroll-reveal';
import { HERO_GLINT_SIZE, HERO_GLINT_URL } from '@/lib/constants';

export interface CateringCardItem {
  image: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
}

export interface CateringEventsProps {
  eyebrow?: string;
  headingLine1?: string;
  headingLine2?: string;
  headingLine3?: string;
  description?: string;
  cards?: CateringCardItem[];
  card1?: CateringCardItem;
  card2?: CateringCardItem;
  onInquiryClick?: () => void;
}

const DEFAULT_CARDS: CateringCardItem[] = [
  {
    image: '/images/biryani-dish.jpg',
    titleLine1: 'CATERING',
    titleLine2: 'MENU',
    subtitle: 'For gatherings of every size',
    ctaLabel: 'VIEW THE MENU',
    href: '#menu',
  },
  {
    image: '/images/thali-plate.jpg',
    titleLine1: 'EVENT',
    titleLine2: 'INQUIRY',
    subtitle: 'Tell us about your occasion',
    ctaLabel: 'START AN INQUIRY',
    href: '#contact',
  },
];

export function CateringEvents({
  eyebrow = '04 — CATERING & EVENTS',
  headingLine1 = 'Bring the',
  headingLine2 = 'Table to',
  headingLine3 = 'You',
  description = 'Celebrations, gatherings and occasions large or small — shaped around your guests, at Samudhra or wherever you host.',
  cards,
  card1,
  card2,
  onInquiryClick,
}: CateringEventsProps) {
  const activeCards =
    cards && cards.length > 0
      ? cards
      : card1 || card2
        ? [card1 ?? DEFAULT_CARDS[0], card2 ?? DEFAULT_CARDS[1]]
        : DEFAULT_CARDS;
  const sectionRef = useRef<HTMLElement>(null);
  const [tracking, setTracking] = useState(false);

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    sectionRef.current!.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    sectionRef.current!.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    if (!tracking) setTracking(true);
  }

  return (
    <section
      id="catering"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      aria-labelledby="catering-title"
      className="relative overflow-hidden bg-heath py-[clamp(75px,8vw,115px)] text-serenade select-none"
    >
      {/* Background Soft Ambience Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(255,248,237,0.06),transparent_100%)]" />

      {/* Interactive Cursor Spotlight Background Pattern (same glint tile and
          screen blend as the Hero section). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-screen select-none"
        style={
          {
            backgroundImage: `url(${HERO_GLINT_URL})`,
            backgroundSize: HERO_GLINT_SIZE,
            backgroundPosition: '0 0',
            backgroundRepeat: 'repeat',
            opacity: 0.5,
            WebkitMaskImage:
              'radial-gradient(circle 280px at var(--mx, 30%) var(--my, 50%), #000 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
            maskImage:
              'radial-gradient(circle 280px at var(--mx, 30%) var(--my, 50%), #000 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
            animation: tracking ? 'none' : 'wander 24s ease-in-out infinite alternate',
          } as CSSProperties
        }
      />

      <div className="relative z-10 mx-auto max-w-[960px] px-6 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* ================= LEFT COLUMN: Display Heading & Description ================= */}
          <Reveal className="lg:col-span-5">
            <div className="flex flex-col items-start gap-3.5">
              <span className="text-[9.5px] font-semibold tracking-[0.24em] text-zest uppercase">
                {eyebrow}
              </span>

              <h2
                id="catering-title"
                className="text-[clamp(32px,3.4vw,44px)] leading-[1.06] font-normal tracking-[-0.02em] text-serenade"
              >
                {headingLine1}
                <br />
                {headingLine2}
                <br />
                {headingLine3}
              </h2>

              <p className="max-w-[235px] text-[11px] xl:text-[11.5px] leading-[1.65] font-normal text-serenade/75">
                {description}
              </p>
            </div>
          </Reveal>

          {/* ================= RIGHT COLUMN: Staggered Circular Overlapping Cards ================= */}
          <div className="grid grid-cols-1 items-end gap-20 pt-16 sm:grid-cols-2 sm:gap-5 sm:pt-20 lg:col-span-7 lg:gap-6">
            {activeCards.map((card, index) => {
              const isStaggered = index % 2 === 1;
              const isInquiryTrigger =
                Boolean(onInquiryClick) &&
                (card.href === '#inquiry' || card.href === '#contact' || index === 1);

              const cardInner = (
                <>
                  {/* Overlapping Top Circular Image */}
                  <div
                    className={`absolute left-1/2 aspect-square -translate-x-1/2 overflow-hidden rounded-full shadow-[0_0_0_4px_#FFF8ED,0_0_0_6px_#4D0F10,0_16px_28px_-10px_rgba(0,0,0,0.55)] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1/2 group-hover:scale-[1.04] group-hover:rotate-[-6deg] ${
                      isStaggered
                        ? '-top-[72px] w-[148px] sm:-top-[82px] sm:w-[164px]'
                        : '-top-[72px] w-[144px] sm:-top-[80px] sm:w-[160px]'
                    }`}
                  >
                    <ImageWithFallback
                      src={card.image}
                      alt={card.titleLine1}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  </div>

                  {/* Title & Subtitle */}
                  <div className="flex flex-col items-start gap-1.5 pt-1">
                    <h3 className="text-[24px] lg:text-[27px] leading-[1.04] font-normal tracking-[-0.01em] text-heath uppercase">
                      {card.titleLine1}
                      <br />
                      {card.titleLine2}
                    </h3>
                    <p className="text-[11px] lg:text-[11.5px] leading-normal font-normal text-heath/75">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Divider & Action CTA */}
                  <div className="mt-3 flex w-full flex-col gap-3.5">
                    <div className="h-px w-full bg-heath/15" />
                    <div className="flex w-full items-center justify-between text-[9.5px] font-semibold tracking-[0.18em] text-heath uppercase">
                      <span>{card.ctaLabel}</span>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        className="size-3.5 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                      >
                        <path d="M4 12h16M14 6l6 6-6 6" />
                      </svg>
                    </div>
                  </div>
                </>
              );

              const cardClasses = `group relative flex w-full flex-col justify-between gap-4 rounded-[18px] bg-serenade px-6 pb-6 text-left text-heath no-underline shadow-[0_20px_45px_-15px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 ${
                isStaggered ? 'pt-[92px] sm:pt-[98px]' : 'pt-[104px] sm:pt-[118px]'
              }`;

              return (
                <ScrollParallax
                  key={index}
                  speed={isStaggered ? 8 : -8}
                  className={`w-full ${isStaggered ? 'sm:mt-8' : ''}`}
                >
                  <Reveal delay={80 + index * 100} className="w-full">
                    {isInquiryTrigger ? (
                      <button
                        type="button"
                        onClick={onInquiryClick}
                        className={`${cardClasses} cursor-pointer`}
                      >
                        {cardInner}
                      </button>
                    ) : (
                      <a href={card.href || '#'} className={cardClasses}>
                        {cardInner}
                      </a>
                    )}
                  </Reveal>
                </ScrollParallax>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
