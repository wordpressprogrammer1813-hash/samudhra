'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { sanitizeHref } from '@/lib/safe-url';
import { lockBodyScroll, unlockBodyScroll } from '@/lib/scroll-lock';
import type { HeaderButton } from '@/lib/settings';

export interface NavGroup {
  label: string;
  links: { label: string; href: string }[];
}

export function SiteHeader({
  navGroups,
  logoUrl,
  buttons,
}: {
  navGroups: NavGroup[];
  logoUrl: string | null;
  buttons: [HeaderButton, HeaderButton];
}) {
  const [outlineButton, filledButton] = buttons;
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleExternalOpen = () => setOpen(true);
    window.addEventListener('samudhra:open-menu', handleExternalOpen);
    return () => window.removeEventListener('samudhra:open-menu', handleExternalOpen);
  }, []);

  const handleNavClick = () => {
    setOpen(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('samudhra:dismiss-gate'));
    }
  };

  useEffect(() => {
    if (!open) return;

    const triggerButton = openButtonRef.current;
    closeButtonRef.current?.focus();
    lockBodyScroll();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      unlockBodyScroll();
      document.removeEventListener('keydown', onKeyDown);
      triggerButton?.focus();
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-30 bg-serenade shadow-[0_8px_30px_-10px_rgba(77,15,16,0.12)]">
        <div className="grid min-h-[72px] grid-cols-[1fr_auto] items-center gap-3 px-5 sm:min-h-[92px] sm:grid-cols-[1fr_auto_1fr] sm:px-12">
          <button
            ref={openButtonRef}
            type="button"
            className="group order-2 inline-flex min-h-11 flex-row-reverse items-center justify-self-end gap-3 text-heath sm:order-1 sm:col-start-1 sm:flex-row sm:justify-self-start sm:gap-4"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(true)}
          >
            <span className="flex w-[30px] flex-col items-end gap-1.5 sm:items-start" aria-hidden="true">
              <i className="block h-px w-full bg-current" />
              <i className="block h-px w-[18px] bg-current transition-[width] duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
            </span>
            <span className="text-[11px] font-medium tracking-[0.3em] uppercase">
              Menu
            </span>
            <span className="sr-only">Open site menu</span>
          </button>

          <a
            href="#top"
            aria-label="Samudhra, home"
            className="order-1 flex min-h-11 items-center justify-self-start sm:order-2 sm:col-start-2 sm:justify-self-center"
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary storage URL, not a next/image case yet
              <img src={logoUrl} alt="Samudhra" className="h-[26px] w-auto sm:h-10" />
            ) : (
              <span className="text-[22px] font-medium tracking-wide text-heath sm:text-[26px]">
                Samudhra
              </span>
            )}
          </a>

          <div className="hidden items-center justify-self-end gap-3 sm:order-3 sm:flex">
            <a
              href={sanitizeHref(outlineButton.link)}
              className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-heath px-5 text-[11px] font-medium tracking-[0.24em] text-heath uppercase transition-colors duration-[350ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:bg-heath hover:text-serenade"
            >
              {outlineButton.label}
            </a>
            <a
              href={sanitizeHref(filledButton.link)}
              className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-heath bg-heath px-5 text-[11px] font-medium tracking-[0.24em] text-serenade uppercase transition-colors duration-[350ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:border-zest hover:bg-zest hover:text-heath"
            >
              {filledButton.label}
            </a>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-70 ${open ? 'visible' : 'invisible delay-[600ms]'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        id={panelId}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 w-full cursor-pointer border-0 bg-creole/50 p-0 transition-opacity duration-500 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-y-0 left-0 w-full overflow-y-auto bg-serenade p-8 text-heath shadow-[20px_0_60px_-30px_rgba(0,0,0,0.5)] transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[min(420px,100vw)] sm:p-10`}
          style={{ transform: open ? 'none' : 'translateX(-100%)' }}
        >
          <div className="mb-10 flex items-center justify-between">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary storage URL, not a next/image case yet
              <img src={logoUrl} alt="Samudhra" className="h-[30px] w-auto" />
            ) : (
              <span className="text-lg font-medium tracking-wide text-heath">Samudhra</span>
            )}
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="grid size-11 place-items-center text-heath"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                aria-hidden="true"
                className="size-5"
              >
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>

          <nav aria-label="Site" className="flex flex-col">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="mt-6 mb-1.5 text-xs font-medium tracking-[0.24em] text-heath uppercase first:mt-0">
                  {group.label}
                </p>
                {group.links.map((link) => (
                  <a
                    key={link.label}
                    href={sanitizeHref(link.href)}
                    onClick={handleNavClick}
                    className="flex min-h-[34px] items-center pl-5 text-xs font-medium tracking-[0.2em] text-heath/75 uppercase transition-[color,padding] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:pl-6.5 hover:text-korma"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>

          <div className="mt-10 flex flex-col gap-3 border-t border-heath/18 pt-6">
            <a
              href={sanitizeHref(filledButton.link)}
              onClick={handleNavClick}
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-heath bg-heath px-5 text-[11px] font-medium tracking-[0.24em] text-serenade uppercase transition-colors duration-[350ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:border-zest hover:bg-zest hover:text-heath"
            >
              {filledButton.label}
            </a>
            <a
              href={sanitizeHref(outlineButton.link)}
              onClick={handleNavClick}
              className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-heath px-5 text-[11px] font-medium tracking-[0.24em] text-heath uppercase transition-colors duration-[350ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:bg-heath hover:text-serenade"
            >
              {outlineButton.label}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
