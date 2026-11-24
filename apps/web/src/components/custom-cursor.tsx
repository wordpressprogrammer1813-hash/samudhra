'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getSnapshot = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
const getServerSnapshot = () => false;

export function CustomCursor() {
  const isFinePointer = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const [visible, setVisible] = useState(false);
  const [hoverState, setHoverState] = useState<'default' | 'clickable' | 'card' | 'active'>('default');

  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  // Position & scale coordinates for smooth GPU interpolation (lerp)
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const currentScale = useRef(1);
  const targetScale = useRef(1);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!visible) setVisible(true);

      // Check element under cursor for special hover states
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest('a, button, [role="button"], input, textarea, select, label');
      const card = target.closest('[data-cursor="explore"], article, .group');

      if (clickable) {
        setHoverState('clickable');
        targetScale.current = 1.6;
      } else if (card) {
        setHoverState('card');
        targetScale.current = 2.1;
      } else {
        setHoverState('default');
        targetScale.current = 1.0;
      }
    };

    const handleMouseDown = () => {
      setHoverState('active');
      targetScale.current = 0.85;
    };

    const handleMouseUp = () => {
      targetScale.current = 1.0;
      setHoverState('default');
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth Lerp Animation Loop
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const render = () => {
      // Faster, responsive tracking (0.32) so ring never drifts or lags awkwardly
      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.32);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.32);
      currentScale.current = lerp(currentScale.current, targetScale.current, 0.22);

      // Inner dot follows mouse position instantaneously
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Outer ring follows smoothly with lerp and dynamic scale
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${currentScale.current})`;
      }

      rafId.current = requestAnimationFrame(render);
    };

    rafId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isFinePointer, visible]);

  if (!isFinePointer) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-9999 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Outer Smooth Luxury Ring (Fixed 32px base, scaled via GPU transform matrix) */}
      <div
        ref={cursorRingRef}
        style={{ willChange: 'transform' }}
        className={`fixed top-0 left-0 flex size-8 items-center justify-center rounded-full transition-colors duration-250 ease-out ${
          hoverState === 'clickable'
            ? 'border-2 border-zest bg-transparent shadow-[0_0_16px_rgba(219,133,29,0.35)]'
            : hoverState === 'card'
            ? 'border border-zest/80 bg-heath/85 text-serenade shadow-[0_4px_25px_rgba(77,15,16,0.5)]'
            : hoverState === 'active'
            ? 'border-2 border-korma bg-zest/15'
            : 'border border-zest/60 bg-transparent'
        }`}
      >
        {/* Subtle Heritage 4-Axis Cardinal Ticks in Default Mode */}
        {hoverState === 'default' && (
          <svg
            viewBox="0 0 32 32"
            className="absolute inset-0 size-full text-zest/45 animate-[spin_24s_linear_infinite]"
          >
            <circle cx="16" cy="2" r="0.8" fill="currentColor" />
            <circle cx="30" cy="16" r="0.8" fill="currentColor" />
            <circle cx="16" cy="30" r="0.8" fill="currentColor" />
            <circle cx="2" cy="16" r="0.8" fill="currentColor" />
          </svg>
        )}

        {/* Micro "VIEW" badge when hovering rich cards/images */}
        {hoverState === 'card' && (
          <span className="text-[7.5px] font-bold tracking-[0.24em] text-serenade uppercase select-none drop-shadow-sm">
            VIEW
          </span>
        )}
      </div>

      {/* Inner Amber Pearl Dot: Hides completely when hovering buttons/links so it NEVER covers text! */}
      <div
        ref={cursorDotRef}
        style={{ willChange: 'transform' }}
        className={`fixed top-0 left-0 size-2 rounded-full bg-zest shadow-[0_0_8px_rgba(219,133,29,0.8)] transition-[opacity,transform] duration-200 ease-out ${
          hoverState === 'clickable' || hoverState === 'card'
            ? 'scale-0 opacity-0'
            : hoverState === 'active'
            ? 'scale-75 opacity-80 bg-korma'
            : 'scale-100 opacity-100'
        }`}
      />
    </div>
  );
}
