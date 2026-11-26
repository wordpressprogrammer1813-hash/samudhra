'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { Reveal, ScrollParallax } from '@/components/scroll-reveal';
import { HERO_GLINT_SIZE, HERO_GLINT_URL } from '@/lib/constants';

export interface CateringEventsProps {
  eyebrow?: string;
  headingLine1?: string;
  headingLine2?: string;
  headingLine3?: string;
  description?: string;
  card1?: {
    image: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ctaLabel: string;
    href: string;
  };
  card2?: {
    image: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ctaLabel: string;
    href: string;
  };
  onInquiryClick?: () => void;
}

export function CateringEvents({
  eyebrow = '04 — CATERING & EVENTS',
  headingLine1 = 'Bring the',
  headingLine2 = 'Table to',
  headingLine3 = 'You',
  description = 'Celebrations, gatherings and occasions large or small — shaped around your guests, at Samudhra or wherever you host.',
  card1 = {
    image: '/images/biryani-dish.jpg',
    titleLine1: 'CATERING',
    titleLine2: 'MENU',
    subtitle: 'For gatherings of every size',
    ctaLabel: 'VIEW THE MENU',
    href: '#menu',
  },
  card2 = {
    image: '/images/thali-plate.jpg',
    titleLine1: 'EVENT',
    titleLine2: 'INQUIRY',
    subtitle: 'Tell us about your occasion',
    ctaLabel: 'START AN INQUIRY',
    href: '#contact',
  },
  onInquiryClick,
}: CateringEventsProps) {
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
      className="relative overflow-hidden bg-heath py-[clamp(85px,9vw,140px)] text-serenade select-none"
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

      <div className="relative z-10 mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* ================= LEFT COLUMN: Display Heading & Description ================= */}
          <Reveal className="lg:col-span-5">
            <div className="flex flex-col items-start gap-5">
              <span className="text-[11px] xl:text-[12px] font-semibold tracking-[0.24em] text-zest uppercase">
                {eyebrow}
              </span>

              <h2
                id="catering-title"
                className="text-[clamp(44px,5.2vw,74px)] leading-[0.96] font-normal tracking-[-0.02em] text-serenade"
              >
                {headingLine1}
                <br />
                {headingLine2}
                <br />
                {headingLine3}
              </h2>

              <p className="max-w-[340px] text-[14px] xl:text-[15px] leading-[1.7] font-normal text-serenade/75">
                {description}
              </p>
            </div>
          </Reveal>

          {/* ================= RIGHT COLUMN: 2 Circular Overlapping Cards ================= */}
          <div className="grid grid-cols-1 gap-14 pt-20 pb-14 sm:grid-cols-2 sm:gap-6 sm:pt-24 sm:pb-16 lg:col-span-7 lg:gap-8">
            {/* Card 1: Catering Menu */}
            <ScrollParallax speed={-18} className="flex">
              <Reveal delay={80} className="flex w-full">
                <a
                  href={card1.href}
                  className="group relative flex w-full flex-col justify-between gap-6 rounded-[28px] bg-serenade px-7 pt-24 pb-7 text-heath no-underline shadow-[0_20px_45px_-15px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 sm:pt-28 lg:pt-[138px] xl:pt-[160px]"
                >
              {/* Overlapping Top Circular Image */}
              <div className="absolute -top-14 left-1/2 aspect-square w-[150px] -translate-x-1/2 overflow-hidden rounded-full shadow-[0_0_0_6px_#FFF8ED,0_0_0_9px_#4D0F10,0_20px_35px_-10px_rgba(0,0,0,0.6)] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1/2 group-hover:scale-[1.04] group-hover:rotate-[-6deg] sm:-top-16 sm:w-[165px] lg:-top-20 lg:w-[210px] xl:-top-24 xl:w-[250px]">
                <ImageWithFallback
                  src={card1.image}
                  alt={card1.titleLine1}
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>

              {/* Title & Subtitle */}
              <div className="flex flex-col items-start gap-2 pt-4">
                <h3 className="text-[clamp(28px,2.8vw,38px)] leading-[0.96] font-bold tracking-[-0.01em] text-heath uppercase">
                  {card1.titleLine1}
                  <br />
                  {card1.titleLine2}
                </h3>
                <p className="text-[13px] xl:text-[14px] leading-normal font-normal text-heath/75">
                  {card1.subtitle}
                </p>
              </div>

              {/* Divider & Action CTA */}
              <div className="flex flex-col gap-4">
                <div className="h-px w-full bg-heath/15" />
                <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.16em] text-heath uppercase">
                  <span>{card1.ctaLabel}</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    className="size-4 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                  >
                    <path d="M4 12h16M14 6l6 6-6 6" />
                  </svg>
                </div>
              </div>
                </a>
              </Reveal>
            </ScrollParallax>

            {/* Card 2: Event Inquiry (triggers Event Inquiry Modal) */}
            <ScrollParallax speed={18} className="flex">
              <Reveal delay={180} className="flex w-full">
                {onInquiryClick ? (
                  <button
                    type="button"
                    onClick={onInquiryClick}
                    className="group relative flex w-full flex-col justify-between gap-6 rounded-[28px] bg-serenade px-7 pt-24 pb-7 text-left text-heath no-underline shadow-[0_20px_45px_-15px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 sm:pt-28 lg:pt-[138px] xl:pt-[160px]"
                  >
                {/* Overlapping Top Circular Image */}
                <div className="absolute -top-14 left-1/2 aspect-square w-[150px] -translate-x-1/2 overflow-hidden rounded-full shadow-[0_0_0_6px_#FFF8ED,0_0_0_9px_#4D0F10,0_20px_35px_-10px_rgba(0,0,0,0.6)] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1/2 group-hover:scale-[1.04] group-hover:rotate-[-6deg] sm:-top-16 sm:w-[165px] lg:-top-20 lg:w-[210px] xl:-top-24 xl:w-[250px]">
                  <ImageWithFallback
                    src={card2.image}
                    alt={card2.titleLine1}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                </div>

                {/* Title & Subtitle */}
                <div className="flex flex-col items-start gap-2 pt-4">
                  <h3 className="text-[clamp(28px,2.8vw,38px)] leading-[0.96] font-bold tracking-[-0.01em] text-heath uppercase">
                    {card2.titleLine1}
                    <br />
                    {card2.titleLine2}
                  </h3>
                  <p className="text-[13px] xl:text-[14px] leading-normal font-normal text-heath/75">
                    {card2.subtitle}
                  </p>
                </div>

                {/* Divider & Action CTA */}
                <div className="flex w-full flex-col gap-4">
                  <div className="h-px w-full bg-heath/15" />
                  <div className="flex w-full items-center justify-between text-[11px] font-semibold tracking-[0.16em] text-heath uppercase">
                    <span>{card2.ctaLabel}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      className="size-4 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                    >
                      <path d="M4 12h16M14 6l6 6-6 6" />
                    </svg>
                  </div>
                </div>
              </button>
            ) : (
              <a
                href={card2.href}
                className="group relative flex flex-col justify-between gap-6 rounded-[28px] bg-serenade px-7 pt-24 pb-7 text-heath no-underline shadow-[0_20px_45px_-15px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 sm:pt-28 lg:pt-[138px] xl:pt-[160px]"
              >
                {/* Overlapping Top Circular Image */}
                <div className="absolute -top-14 left-1/2 aspect-square w-[150px] -translate-x-1/2 overflow-hidden rounded-full shadow-[0_0_0_6px_#FFF8ED,0_0_0_9px_#4D0F10,0_20px_35px_-10px_rgba(0,0,0,0.6)] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1/2 group-hover:scale-[1.04] group-hover:rotate-[-6deg] sm:-top-16 sm:w-[165px] lg:-top-20 lg:w-[210px] xl:-top-24 xl:w-[250px]">
                  <ImageWithFallback
                    src={card2.image}
                    alt={card2.titleLine1}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                </div>

                {/* Title & Subtitle */}
                <div className="flex flex-col items-start gap-2 pt-4">
                  <h3 className="text-[clamp(28px,2.8vw,38px)] leading-[0.96] font-bold tracking-[-0.01em] text-heath uppercase">
                    {card2.titleLine1}
                    <br />
                    {card2.titleLine2}
                  </h3>
                  <p className="text-[13px] xl:text-[14px] leading-normal font-normal text-heath/75">
                    {card2.subtitle}
                  </p>
                </div>

                {/* Divider & Action CTA */}
                <div className="flex flex-col gap-4">
                  <div className="h-px w-full bg-heath/15" />
                  <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.16em] text-heath uppercase">
                    <span>{card2.ctaLabel}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      className="size-4 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                    >
                      <path d="M4 12h16M14 6l6 6-6 6" />
                    </svg>
                  </div>
                </div>
              </a>
            )}
              </Reveal>
            </ScrollParallax>
          </div>
        </div>
      </div>
    </section>
  );
}
