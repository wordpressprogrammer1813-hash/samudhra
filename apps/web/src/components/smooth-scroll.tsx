'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function SmoothScroll() {
  useEffect(() => {
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

    const scrollToHash = (hash: string) => {
      if (hash === '#top') {
        lenis.scrollTo(0, { duration: 1.4 });
        return true;
      }
      const id = hash.slice(1);
      const elem = id ? document.getElementById(id) : null;
      if (elem) {
        lenis.scrollTo(elem, { offset: -80, duration: 1.3 });
        return true;
      }
      return false;
    };

    // Smooth-scroll any in-page anchor clicks (including Footer "Back to top")
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.length < 2) return;
      if (scrollToHash(href)) {
        e.preventDefault();
      }
    };

    const handleScrollEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ target: string; offset?: number }>;
      const targetRef = customEvent.detail?.target;
      if (targetRef && targetRef.startsWith('#')) {
        if (targetRef === '#top') {
          lenis.scrollTo(0, { duration: 1.4 });
          return;
        }
        const id = targetRef.slice(1);
        const elem = id ? document.getElementById(id) : null;
        if (elem) {
          lenis.scrollTo(elem, {
            offset: customEvent.detail.offset ?? -80,
            duration: 1.3,
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    window.addEventListener('samudhra:scroll-to', handleScrollEvent);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('samudhra:scroll-to', handleScrollEvent);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
