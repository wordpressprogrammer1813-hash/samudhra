'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { DIAMOND_PATTERN_URL } from '@/lib/constants';
import type { HeroAction } from '@/lib/pages';

export function HeroSection({
  eyebrow,
  titleLine1,
  titleLine2,
  subtitle,
  backgroundImage,
  actions,
}: {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  backgroundImage: string;
  actions: HeroAction[];
}) {
  const heroRef = useRef<HTMLElement>(null);
  const [tracking, setTracking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [gateClosed, setGateClosed] = useState(false);
  const hasPhoto =
    Boolean(backgroundImage) &&
    (backgroundImage.startsWith('http') || backgroundImage.startsWith('/'));
  const visibleActions = actions.filter((a) => a.label);

  useEffect(() => {
    const handleGateClosed = () => setGateClosed(true);
    window.addEventListener('samudhra:gate-closed', handleGateClosed);
    return () => window.removeEventListener('samudhra:gate-closed', handleGateClosed);
  }, []);

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    heroRef.current!.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    heroRef.current!.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    if (!tracking) setTracking(true);
  }

  return (
    <section
      id="top"
      ref={heroRef}
      onMouseMove={onMouseMove}
      className="relative mx-2 flex min-h-[600px] items-center justify-center overflow-hidden rounded-2xl bg-creole text-serenade sm:mx-3.5 sm:min-h-[860px] sm:rounded-[22px]"
    >
      {hasPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary storage URL, not a next/image case yet
        <img src={backgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(29,5,6,0.55), rgba(29,5,6,0.2) 100%), linear-gradient(180deg, rgba(77,15,16,0.72), rgba(77,15,16,0.5) 40%, rgba(29,5,6,0.82))',
        }}
      />

      {/* One-time diagonal left-to-right sweep reveal, held until the
          location gate closes so it isn't wasted underneath that overlay. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-[length:1100px] mix-blend-screen motion-reduce:animate-none sm:bg-[length:1920px] ${
          gateClosed ? 'animate-sweep' : ''
        }`}
        style={
          {
            backgroundImage: `url(${DIAMOND_PATTERN_URL})`,
            backgroundRepeat: 'repeat',
            WebkitMaskImage: 'linear-gradient(105deg, transparent 40%, #000 50%, transparent 60%)',
            maskImage: 'linear-gradient(105deg, transparent 40%, #000 50%, transparent 60%)',
            WebkitMaskSize: '300% 100%',
            maskSize: '300% 100%',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            opacity: gateClosed ? undefined : 0,
          } as CSSProperties
        }
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[length:1100px] mix-blend-screen sm:bg-[length:1920px]"
        style={
          {
            backgroundImage: `url(${DIAMOND_PATTERN_URL})`,
            backgroundRepeat: 'repeat',
            WebkitMaskImage:
              'radial-gradient(circle 240px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
            maskImage:
              'radial-gradient(circle 240px at var(--mx) var(--my), #000 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
            ...(tracking
              ? {
                  animationName: 'spot-in',
                  animationDuration: '1.6s',
                  animationDelay: '0s',
                  animationIterationCount: '1',
                  animationTimingFunction: 'ease',
                  animationDirection: 'normal',
                  animationFillMode: 'both',
                }
              : {
                  animationName: 'wander, spot-in',
                  animationDuration: '26s, 1.6s',
                  animationDelay: '0s, 3s',
                  animationIterationCount: 'infinite, 1',
                  animationTimingFunction: 'ease-in-out, ease',
                  animationDirection: 'alternate, normal',
                  animationFillMode: 'none, both',
                }),
            animationPlayState: paused ? 'paused' : 'running',
          } as CSSProperties
        }
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-[14px] rounded-2xl border border-serenade/22 sm:inset-[22px]"
      >
        <span className="absolute top-0 left-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-zest" />
        <span className="absolute bottom-0 left-1/2 size-[7px] -translate-x-1/2 translate-y-1/2 rotate-45 bg-zest" />
      </div>

      <div className="relative z-3 flex w-full max-w-[1100px] flex-col items-center px-6 text-center">
        {eyebrow ? (
          <div className="mb-8 flex items-center gap-[18px] text-[13px] font-medium tracking-[0.42em] text-serenade/78 uppercase [animation:up_1.2s_.3s_var(--ease-samudhra-out)_both]">
            <span className="h-px w-[46px] bg-zest/80" />
            {eyebrow}
            <span className="h-px w-[46px] bg-zest/80" />
          </div>
        ) : null}

        <h1 className="flex flex-col items-center">
          {titleLine1 ? (
            <span className="mr-[-0.14em] flex overflow-hidden pb-[0.06em] text-[clamp(2rem,9.4vw,150px)] leading-[0.9] font-normal">
              {titleLine1.split('').map((ch, i) => (
                <span
                  key={i}
                  className="inline-block [animation:letter_1.3s_var(--ease-samudhra-out)_both]"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  {ch === ' ' ? ' ' : ch}
                </span>
              ))}
            </span>
          ) : null}
          {titleLine2 ? (
            <span className="mt-[-0.08em] self-end text-[clamp(1.75rem,6.6vw,106px)] leading-none text-zest [animation:up_1.4s_1.1s_var(--ease-samudhra-out)_both]">
              {titleLine2}
            </span>
          ) : null}
        </h1>

        {subtitle ? (
          <p className="mt-9 flex items-center gap-[22px] text-[clamp(15px,1.25vw,18px)] leading-[1.5] tracking-[0.04em] text-serenade/78 [animation:up_1.2s_1.4s_var(--ease-samudhra-out)_both]">
            <i className="block size-[6px] shrink-0 rotate-45 bg-zest not-italic" aria-hidden />
            {subtitle}
            <i className="block size-[6px] shrink-0 rotate-45 bg-zest not-italic" aria-hidden />
          </p>
        ) : null}

        {visibleActions.length > 0 ? (
          <div className="mt-11 flex flex-wrap justify-center gap-4 [animation:up_1.2s_1.6s_var(--ease-samudhra-out)_both]">
            {visibleActions.map((action, i) => (
              <a
                key={i}
                href={action.href || '#contact'}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-serenade/75 px-6 text-[13px] font-medium tracking-[0.1em] text-serenade uppercase transition-colors duration-300 hover:bg-serenade hover:text-heath"
              >
                {action.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <a
        href="#menu"
        aria-label="Scroll down"
        className="absolute bottom-[46px] left-1/2 z-3 -translate-x-1/2 text-serenade/78 [animation:fade-in_1s_2.2s_both]"
      >
        <svg
          viewBox="0 0 34 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          style={{
            animationName: 'bob',
            animationDuration: '2.6s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationPlayState: paused ? 'paused' : 'running',
          }}
          className="h-[18px] w-[34px]"
        >
          <path d="M2 2l15 13L32 2" />
        </svg>
      </a>

      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? 'Play animations' : 'Pause animations'}
        className="absolute right-[22px] bottom-[42px] z-4 grid size-10 place-items-center rounded-full border border-serenade/35 text-serenade sm:right-[46px]"
      >
        {paused ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-3">
            <path d="M7 4l12 8-12 8V4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-3">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        )}
      </button>
    </section>
  );
}
