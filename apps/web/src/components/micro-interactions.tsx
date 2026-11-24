'use client';

import { useEffect, useRef } from 'react';

/**
 * Top golden scroll-progress hairline bar across the public site.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[2.5px] bg-transparent"
    >
      <div
        ref={barRef}
        className="size-full origin-left bg-gradient-to-r from-zest via-korma to-zest"
        style={{ transform: 'scaleX(0)', willChange: 'transform' }}
      />
    </div>
  );
}

/**
 * Subtle magnetic pull micro-interaction on pill CTA buttons on desktop (`pointer: fine`).
 */
export function MagneticButtons() {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !window.matchMedia('(pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let activeEl: HTMLElement | null = null;
    const MAX_SHIFT = 5;

    const resetActive = () => {
      if (!activeEl) return;
      activeEl.style.transform = '';
      activeEl.style.transition = 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1)';
      activeEl = null;
    };

    const onMouseMove = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(
        'a.rounded-full, button.rounded-full, [data-magnetic]',
      ) as HTMLElement | null;

      if (target !== activeEl) {
        resetActive();
        activeEl = target;
      }

      if (!activeEl) return;
      const rect = activeEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      const dx = Math.max(-1, Math.min(1, relX)) * MAX_SHIFT;
      const dy = Math.max(-1, Math.min(1, relY)) * MAX_SHIFT;

      activeEl.style.transition = 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1)';
      activeEl.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
    };

    const onMouseLeave = () => resetActive();

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      resetActive();
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return null;
}
