'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

export type RevealVariant = 'up' | 'scale' | 'clip' | 'left' | 'right';

export interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
}

const INITIAL_STYLES: Record<RevealVariant, CSSProperties> = {
  up: { opacity: 0, transform: 'translate3d(0, 48px, 0) scale(0.97)' },
  scale: { opacity: 0, transform: 'scale(0.88)' },
  clip: { opacity: 0, clipPath: 'inset(14% 0% 14% 0%)', transform: 'scale(1.06)' },
  left: { opacity: 0, transform: 'translate3d(-44px, 0, 0)' },
  right: { opacity: 0, transform: 'translate3d(44px, 0, 0)' },
};

/**
 * Scroll-triggered reveal wrapper using IntersectionObserver.
 * Never applies `clipPath` once visible so negative-margin children and
 * magnetic hover shifts are never clipped.
 */
export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  duration = 900,
  className = '',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const checkAndObserve = () => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          if (document.body.style.overflow === 'hidden') return;

          if (entry.isIntersecting) {
            setVisible(true);
          } else if (entry.boundingClientRect.top > window.innerHeight * 0.85) {
            setVisible(false);
          }
        },
        { threshold: 0.08, rootMargin: '0px 0px -12% 0px' },
      );

      observer.observe(el);
      return observer;
    };

    let observer = checkAndObserve();

    const onGateDismiss = () => {
      observer.disconnect();
      observer = checkAndObserve();
    };
    window.addEventListener('samudhra:dismiss-gate', onGateDismiss);

    const bodyObserver = new MutationObserver(() => {
      if (document.body.style.overflow !== 'hidden') {
        observer.disconnect();
        observer = checkAndObserve();
      }
    });
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    return () => {
      observer.disconnect();
      bodyObserver.disconnect();
      window.removeEventListener('samudhra:dismiss-gate', onGateDismiss);
    };
  }, []);

  const visibleStyle: CSSProperties =
    variant === 'clip'
      ? { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)', clipPath: 'inset(0% 0% 0% 0%)' }
      : { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' };

  const style: CSSProperties = {
    ...(visible ? visibleStyle : INITIAL_STYLES[variant]),
    transitionProperty: variant === 'clip' ? 'opacity, transform, clip-path' : 'opacity, transform',
    transitionDuration: `${duration}ms`,
    transitionDelay: visible ? `${delay}ms` : '0ms',
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: visible ? 'auto' : 'opacity, transform',
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}

/**
 * GPU-accelerated scroll parallax wrapper for floating cards & imagery.
 */
export function ScrollParallax({
  children,
  speed = 24,
  className = '',
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = ((rect.top + rect.height / 2) / vh - 0.5) * 2;
      const clamped = Math.max(-1, Math.min(1, progress));
      el.style.transform = `translate3d(0, ${(clamped * speed).toFixed(2)}px, 0)`;
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
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
