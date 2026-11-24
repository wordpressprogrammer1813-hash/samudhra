'use client';

import { ImageWithFallback } from '@/components/image-with-fallback';
import { Reveal, ScrollParallax } from '@/components/scroll-reveal';

export interface WeekendThaliProps {
  eyebrow?: string;
  titleLine1?: string;
  titleLine2?: string;
  description?: string;
  reserveLabel?: string;
  reserveHref?: string;
  menuLabel?: string;
  menuHref?: string;
  plateImage?: string;
  figureImages?: {
    fig1: string;
    fig2: string;
    fig3: string;
    fig4: string;
  };
  onReserveClick?: () => void;
}

export function WeekendThali({
  eyebrow = 'Our Menu - Weekends at Samudhra',
  titleLine1 = 'Weekend',
  titleLine2 = 'Thali',
  description = 'Many small bowls around one plate — curries, dal, rice and accompaniments. A generous way to taste a little of everything.',
  reserveLabel = 'Reserve for the Weekend',
  reserveHref = '#contact',
  menuLabel = 'View Thali Menu',
  menuHref = '#menu',
  plateImage = '/images/thali-plate.jpg',
  figureImages = {
    fig1: '/images/cocktails-bar.jpg',
    fig2: '/images/bartender-mixing.jpg',
    fig3: '/images/biryani-dish.jpg',
    fig4: '/images/beetroot-dish.jpg',
  },
  onReserveClick,
}: WeekendThaliProps) {
  return (
    <section
      id="thali"
      aria-labelledby="thali-title"
      className="relative overflow-hidden bg-zest py-[clamp(70px,7vw,110px)] text-heath select-none"
    >
      {/* Background Ambience & Decorative Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_50%,rgba(255,248,237,0.18),transparent_100%)]" />

      {/* Main Container - Controlled width with ample gutters to guarantee zero right-side clipping */}
      <div className="relative mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-12">
        {/* ================= DESKTOP POSTER CANVAS (lg and above: 1024px+) ================= */}
        <div className="relative hidden h-[760px] xl:h-[840px] lg:block">
          {/* Top-Left: Eyebrow + Display Heading */}
          <div className="absolute top-2 left-2 z-20 flex max-w-[500px] flex-col gap-3">
            <p className="text-[12px] xl:text-[13px] font-semibold tracking-[0.2em] text-heath/90">
              {eyebrow}
            </p>
            <h2
              id="thali-title"
              className="text-[clamp(62px,6.8vw,110px)] leading-[0.92] font-bold tracking-[-0.03em] text-heath"
            >
              {titleLine1}
              <br />
              {titleLine2}
            </h2>
          </div>

          {/* ================= CENTERPIECE: Rotating Sacred Mandala + Thali Plate ================= */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {/* Rotating Sacred Mandala SVG */}
            <div className="pointer-events-none absolute top-[52%] left-[48%] -translate-x-1/2 -translate-y-1/2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/thali-mandala.svg"
                alt=""
                className="size-[580px] xl:size-[700px] animate-[spin_50s_linear_infinite] opacity-45 drop-shadow-sm motion-reduce:animate-none"
              />
            </div>
          </div>

          {/* Centered Circular Thali Plate (Sitting in front of the rotating mandala) */}
          <div className="absolute top-[52%] left-[48%] z-20 aspect-square w-[340px] xl:w-[420px] -translate-x-1/2 -translate-y-1/2">
            <Reveal variant="scale" className="size-full">
              <div className="group size-full overflow-hidden rounded-full shadow-[0_0_0_12px_#FFF8ED,0_0_0_13px_rgba(77,15,16,0.3),0_40px_65px_-20px_rgba(77,15,16,0.65)] transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:rotate-[-6deg]">
                <ImageWithFallback
                  src={plateImage}
                  alt="Samudhra Weekend Thali Spread"
                  loading="lazy"
                  className="size-full scale-105 object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100"
                />
              </div>
            </Reveal>
          </div>

          {/* ================= 4 SURROUNDING CARDS (Coordinates calibrated to screenshot) ================= */}
          {/* Card 1: Top-Right (Tall rectangular card) */}
          <div className="group absolute top-[4%] right-[16%] z-10 w-[170px] xl:right-[18%] xl:w-[210px]">
            <ScrollParallax speed={-34}>
              <Reveal delay={100}>
                <div className="aspect-[3.2/4] overflow-hidden rounded-[24px] bg-white p-1.5 shadow-[0_20px_35px_-12px_rgba(77,15,16,0.4)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5">
                  <ImageWithFallback
                    src={figureImages.fig1}
                    alt="Cocktails on the bar"
                    loading="lazy"
                    className="size-full rounded-[20px] object-cover object-[45%_60%] contrast-[1.05] grayscale brightness-95 transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:filter-none"
                  />
                </div>
              </Reveal>
            </ScrollParallax>
          </div>

          {/* Card 2: Mid-Right (Square card above text description) */}
          <div className="group absolute top-[40%] right-[13%] z-10 w-[160px] xl:right-[15%] xl:w-[190px]">
            <ScrollParallax speed={30}>
              <Reveal delay={200}>
                <div className="aspect-square overflow-hidden rounded-[24px] bg-white p-1.5 shadow-[0_20px_35px_-12px_rgba(77,15,16,0.4)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5">
                  <ImageWithFallback
                    src={figureImages.fig3}
                    alt="Biryani with egg and lime"
                    loading="lazy"
                    className="size-full rounded-[20px] object-cover contrast-[1.05] grayscale brightness-95 transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:filter-none"
                  />
                </div>
              </Reveal>
            </ScrollParallax>
          </div>

          {/* Card 3: Mid-Left (Below title) */}
          <div className="group absolute top-[45%] left-[5%] z-10 w-[150px] xl:left-[7%] xl:w-[185px]">
            <ScrollParallax speed={-26}>
              <Reveal delay={160}>
                <div className="aspect-square overflow-hidden rounded-[24px] bg-white p-1.5 shadow-[0_20px_35px_-12px_rgba(77,15,16,0.4)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5">
                  <ImageWithFallback
                    src={figureImages.fig2}
                    alt="A bartender mixing a drink"
                    loading="lazy"
                    className="size-full rounded-[20px] object-cover object-[45%_40%] contrast-[1.05] grayscale brightness-95 transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:filter-none"
                  />
                </div>
              </Reveal>
            </ScrollParallax>
          </div>

          {/* Card 4: Bottom-Left (Landscape card) */}
          <div className="group absolute bottom-[6%] left-[12%] z-10 w-[175px] xl:left-[15%] xl:w-[215px]">
            <ScrollParallax speed={34}>
              <Reveal delay={240}>
                <div className="aspect-[4/3] overflow-hidden rounded-[24px] bg-white p-1.5 shadow-[0_20px_35px_-12px_rgba(77,15,16,0.4)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5">
                  <ImageWithFallback
                    src={figureImages.fig4}
                    alt="Plated dish with beetroot"
                    loading="lazy"
                    className="size-full rounded-[20px] object-cover contrast-[1.05] grayscale brightness-95 transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:filter-none"
                  />
                </div>
              </Reveal>
            </ScrollParallax>
          </div>

          {/* ================= BOTTOM-RIGHT: Description & Stacked Pill Buttons ================= */}
          {/* Positioned comfortably inside right gutter (right-[13%]..right-[15%]) with generous width and NO screen cut-off */}
          <div className="absolute right-[13%] bottom-[6%] z-20 flex w-full max-w-[310px] xl:right-[15%] xl:max-w-[340px] flex-col items-end gap-5 text-right">
            <p className="text-[14px] xl:text-[15px] leading-[1.65] font-normal text-heath">
              {description}
            </p>
            <div className="flex flex-col items-end gap-2.5">
              {onReserveClick ? (
                <button
                  type="button"
                  onClick={onReserveClick}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-heath bg-heath px-6 text-[12px] font-semibold tracking-[0.14em] text-serenade transition-colors duration-300 hover:bg-serenade hover:text-heath shadow-md"
                >
                  {reserveLabel}
                </button>
              ) : (
                <a
                  href={reserveHref}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-heath bg-heath px-6 text-[12px] font-semibold tracking-[0.14em] text-serenade transition-colors duration-300 hover:bg-serenade hover:text-heath shadow-md"
                >
                  {reserveLabel}
                </a>
              )}
              <a
                href={menuHref}
                className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-heath bg-transparent px-6 text-[12px] font-semibold tracking-[0.14em] text-heath transition-colors duration-300 hover:bg-heath hover:text-serenade"
              >
                {menuLabel}
              </a>
            </div>
          </div>
        </div>

        {/* ================= MOBILE & TABLET LAYOUT (< lg screens) ================= */}
        <div className="flex flex-col gap-8 lg:hidden">
          {/* Header */}
          <div>
            <p className="mb-2 text-[12px] font-semibold tracking-[0.2em] text-heath/90">
              {eyebrow}
            </p>
            <h2 className="text-[clamp(42px,8vw,68px)] leading-[0.94] font-bold tracking-[-0.03em]">
              {titleLine1} {titleLine2}
            </h2>
          </div>

          {/* Centerpiece Thali Plate with Rotating Mandala */}
          <div className="relative mx-auto my-4 flex aspect-square w-full max-w-[360px] items-center justify-center">
            {/* Rotating Sacred Mandala SVG */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/thali-mandala.svg"
                alt=""
                className="size-[135%] animate-[spin_50s_linear_infinite] opacity-45 motion-reduce:animate-none"
              />
            </div>

            {/* Circular Plate */}
            <div className="relative z-10 size-[74%] overflow-hidden rounded-full shadow-[0_0_0_8px_#FFF8ED,0_0_0_9px_rgba(77,15,16,0.3),0_28px_45px_-15px_rgba(77,15,16,0.65)]">
              <ImageWithFallback
                src={plateImage}
                alt="Samudhra Weekend Thali Spread"
                loading="lazy"
                className="size-full scale-105 object-cover"
              />
            </div>
          </div>

          {/* 4 Cards Responsive Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[figureImages.fig1, figureImages.fig2, figureImages.fig3, figureImages.fig4].map(
              (img, idx) => (
                <div
                  key={idx}
                  className="aspect-[4/3] overflow-hidden rounded-[18px] bg-white p-1.5 shadow-md"
                >
                  <ImageWithFallback
                    src={img}
                    alt=""
                    loading="lazy"
                    className="size-full rounded-[14px] object-cover contrast-[1.05]"
                  />
                </div>
              ),
            )}
          </div>

          {/* Description & Action Buttons */}
          <div className="flex flex-col gap-4 pt-1">
            <p className="text-[15px] leading-[1.65] text-heath">{description}</p>
            <div className="flex flex-wrap gap-3">
              {onReserveClick ? (
                <button
                  type="button"
                  onClick={onReserveClick}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-heath bg-heath px-6 text-[12px] font-semibold tracking-[0.14em] text-serenade shadow-sm"
                >
                  {reserveLabel}
                </button>
              ) : (
                <a
                  href={reserveHref}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-heath bg-heath px-6 text-[12px] font-semibold tracking-[0.14em] text-serenade shadow-sm"
                >
                  {reserveLabel}
                </a>
              )}
              <a
                href={menuHref}
                className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-heath bg-transparent px-6 text-[12px] font-semibold tracking-[0.14em] text-heath"
              >
                {menuLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
