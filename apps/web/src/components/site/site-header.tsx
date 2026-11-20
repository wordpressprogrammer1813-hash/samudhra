'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Container, PillLink, Wordmark } from './primitives';
import { cn } from '@/lib/utils';

export interface HeaderContent {
  menuLabel: string;
  actions: { label: string; href: string; style?: string }[];
  navLinks: { label: string; href: string }[];
}

/**
 * The bar at the top of every page: menu trigger on the left, wordmark in the
 * middle, call-to-action buttons on the right — plus the full-screen overlay
 * the menu trigger opens.
 */
export function SiteHeader({ content }: { content: HeaderContent }) {
  const [open, setOpen] = useState(false);

  // Lock the page behind the overlay while it is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-heath-14 bg-serenade/95 backdrop-blur">
      <Container className="flex h-[5.75rem] items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="site-menu"
          className="u-eyebrow flex items-center gap-3 text-heath transition-opacity hover:opacity-70"
        >
          <span aria-hidden className="flex w-6 flex-col gap-1.5">
            <span className="h-px w-6 bg-heath" />
            <span className="h-px w-4 bg-heath" />
          </span>
          {content.menuLabel || 'Menu'}
        </button>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2" aria-label="Samudhra, home">
          <Wordmark className="text-3xl sm:text-4xl" />
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          {content.actions.map((action) => (
            <PillLink
              key={`${action.label}-${action.href}`}
              href={action.href}
              variant={action.style === 'solid' ? 'solid' : 'outline'}
            >
              {action.label}
            </PillLink>
          ))}
        </div>
      </Container>

      {/* Full-screen navigation overlay */}
      <div id="site-menu" hidden={!open} className="fixed inset-0 z-50 bg-serenade">
        <Container className="flex h-[5.75rem] items-center justify-between">
          <span className="u-eyebrow text-heath-75">Menu</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="u-eyebrow flex items-center gap-2 text-heath transition-opacity hover:opacity-70"
          >
            Close
            <X className="size-4" aria-hidden />
          </button>
        </Container>

        {/* Any click in here closes the overlay, which also covers navigation. */}
        <div onClickCapture={() => setOpen(false)}>
          <Container>
            <nav aria-label="Site">
              <ul className="divide-y divide-heath-14 border-y border-heath-14">
                {content.navLinks.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <Link
                      href={link.href || '#'}
                      className={cn(
                        'group flex items-baseline justify-between py-5 transition-colors',
                        'text-h3 text-heath hover:text-zest',
                      )}
                    >
                      {link.label}
                      <span
                        aria-hidden
                        className="u-eyebrow opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        View
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-10 flex flex-wrap gap-3">
              {content.actions.map((action) => (
                <PillLink
                  key={`overlay-${action.label}`}
                  href={action.href}
                  variant={action.style === 'solid' ? 'solid' : 'outline'}
                >
                  {action.label}
                </PillLink>
              ))}
            </div>
          </Container>
        </div>
      </div>
    </header>
  );
}
