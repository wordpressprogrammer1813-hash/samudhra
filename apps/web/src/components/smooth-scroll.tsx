'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function SmoothScroll() {
  useEffect(() => {
    // Initialize Lenis for momentum smooth scrolling
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Global listener for custom smooth scroll events (uses getElementById to prevent selector injection)
    const handleScrollEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ target: string; offset?: number }>;
      const targetRef = customEvent.detail?.target;
      if (targetRef && targetRef.startsWith('#')) {
        const id = targetRef.slice(1);
        const elem = id ? document.getElementById(id) : null;
        if (elem) {
          lenis.scrollTo(elem, {
            offset: customEvent.detail.offset ?? -40,
            duration: 1.4,
          });
        }
      }
    };

    window.addEventListener('samudhra:scroll-to', handleScrollEvent);

    return () => {
      window.removeEventListener('samudhra:scroll-to', handleScrollEvent);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
