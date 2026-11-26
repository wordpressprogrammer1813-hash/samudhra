'use client';

import { ImageWithFallback } from '@/components/image-with-fallback';
import { Reveal } from '@/components/scroll-reveal';

export interface OurStoryProps {
  kicker?: string;
  heading?: string;
  quote?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: string;
  onCtaClick?: () => void;
}

export function OurStory({
  kicker = '— 03 — ABOUT SAMUDHRA',
  heading = 'Our Story',
  quote = 'What begins in tradition becomes something new at the table.',
  body = 'Each dish begins with the traditions, spices, and regional flavors that shape Indian cooking, interpreted through a modern dining experience. The menu brings familiar flavors into a refined setting — rooted in tradition, still fresh, vibrant, and distinctly Samudhra.',
  ctaLabel = 'ABOUT SAMUDHRA',
  ctaHref = '#contact',
  image = '/images/bartender-mixing.jpg',
  onCtaClick,
}: OurStoryProps) {
  return (
    <section
      id="story"
      aria-labelledby="story-title"
      className="relative overflow-hidden bg-zest py-[clamp(80px,8vw,130px)] text-heath select-none"
    >
      {/* Background Soft Ambience Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_35%_50%,rgba(255,248,237,0.16),transparent_100%)]" />

      {/* Rotating Sacred Mandala SVG — anchored to the section's own top-left
          corner, independent of the image card, not tucked behind it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -left-10 size-[460px] select-none sm:-top-14 sm:-left-14 sm:size-[540px] xl:-top-16 xl:-left-16 xl:size-[600px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/story-mandala.svg"
          alt=""
          className="size-full animate-[spin_55s_linear_infinite] opacity-40 drop-shadow-sm motion-reduce:animate-none"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          {/* ================= LEFT COLUMN: Image Card ================= */}
          <div className="relative flex justify-center lg:col-span-6 lg:justify-start">
            <div className="relative w-full max-w-[420px] sm:max-w-[460px] xl:max-w-[490px]">
              {/* Main Photo Card (Rounded Corners with Rich Elevation) */}
              <Reveal variant="clip">
                <div className="group relative z-10 aspect-[3.3/4] w-full overflow-hidden rounded-[24px] sm:rounded-[28px] bg-white p-1.5 shadow-[0_24px_50px_-15px_rgba(77,15,16,0.45)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1">
                  <ImageWithFallback
                    src={image}
                    alt="Samudhra Heritage & Culinary Craft"
                    loading="lazy"
                    className="size-full rounded-[20px] sm:rounded-[24px] object-cover object-[45%_35%] transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                </div>
              </Reveal>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Typography & Action Button ================= */}
          <Reveal variant="up" delay={140} className="lg:col-span-6 lg:pl-4 xl:pl-6">
            <div className="flex flex-col items-start gap-5">
            {/* Kicker / Eyebrow */}
            <p className="text-[11px] xl:text-[12px] font-semibold tracking-[0.24em] text-heath/90">
              {kicker}
            </p>

            {/* Display Heading */}
            <h2
              id="story-title"
              className="text-[clamp(44px,5.2vw,76px)] leading-[0.96] font-normal tracking-[-0.02em] text-heath"
            >
              {heading}
            </h2>

            {/* Lead Quote */}
            <p className="text-[clamp(19px,2.2vw,28px)] leading-[1.35] font-normal tracking-[-0.01em] text-heath">
              {quote}
            </p>

            {/* Divider */}
            <div className="h-px w-16 bg-heath/35" aria-hidden="true" />

            {/* Narrative Body Copy */}
            <p className="max-w-[490px] text-[14px] xl:text-[15px] leading-[1.7] font-normal text-heath/85">
              {body}
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              {onCtaClick ? (
                <button
                  type="button"
                  onClick={onCtaClick}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-heath bg-heath px-8 text-[11px] font-semibold tracking-[0.2em] text-serenade uppercase transition-colors duration-300 hover:bg-serenade hover:text-heath shadow-md"
                >
                  {ctaLabel}
                </button>
              ) : (
                <a
                  href={ctaHref}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-heath bg-heath px-8 text-[11px] font-semibold tracking-[0.2em] text-serenade uppercase transition-colors duration-300 hover:bg-serenade hover:text-heath shadow-md"
                >
                  {ctaLabel}
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
