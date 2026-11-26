'use client';

import { useState } from 'react';
import { sanitizeHref, sanitizeImageUrl } from '@/lib/safe-url';

export interface LocationGateCard {
  name: string;
  description: string;
  backgroundImage: string;
  reserveLabel: string;
  orderLabel: string;
}

const DEFAULT_CARDS: [LocationGateCard, LocationGateCard] = [
  {
    name: '',
    description: '',
    backgroundImage: '',
    reserveLabel: '',
    orderLabel: '',
  },
  {
    name: '',
    description: '',
    backgroundImage: '',
    reserveLabel: '',
    orderLabel: '',
  },
];

export interface LocationGateNavLink {
  label: string;
  href: string;
}

const DEFAULT_NAV_LINKS: LocationGateNavLink[] = [
  { label: 'MENU', href: '#menu' },
  { label: 'DINING EXPERIENCE', href: '#dining' },
  { label: 'GALLERY', href: '#dining' },
  { label: 'CATERING & EVENTS', href: '#catering' },
  { label: 'OUR STORY', href: '#story' },
  { label: 'LOCATION & HOURS', href: '#contact' },
];

function CardBackground({ image }: { image: string }) {
  const safeImage = sanitizeImageUrl(image);
  if (safeImage) {
    return (
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        style={{ backgroundImage: `url('${safeImage}')` }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="absolute inset-0 grid place-items-center bg-heath" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="size-16 text-serenade/15"
      >
        <rect x="3" y="4" width="18" height="16" rx="1.5" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="m4 17 5-5 3 3 4-4 4 4" />
      </svg>
    </div>
  );
}

export interface LocationGateProps {
  isOpen: boolean;
  onSelectLocation: (location: string, index: number) => void;
  onNavigate: (href: string) => void;
  onOpenMenu: () => void;
  logoUrl?: string;
  cards?: [LocationGateCard, LocationGateCard];
  navLinks?: LocationGateNavLink[];
  socialLinks?: {
    instagramUrl?: string;
    tiktokUrl?: string;
  };
}

export function LocationGate({
  isOpen,
  onSelectLocation,
  onNavigate,
  onOpenMenu,
  logoUrl = '/images/samudhra-logo.png',
  cards = DEFAULT_CARDS,
  navLinks = DEFAULT_NAV_LINKS,
  socialLinks = {
    instagramUrl: '',
    tiktokUrl: '',
  },
}: LocationGateProps) {
  const [cardOne, cardTwo] = cards;
  const [isRendered, setIsRendered] = useState(isOpen);
  const safeInstagramUrl = sanitizeHref(socialLinks.instagramUrl, '');
  const safeTiktokUrl = sanitizeHref(socialLinks.tiktokUrl, '');

  // Keep element in DOM while transition completes
  if (!isOpen && !isRendered) {
    return null;
  }

  const handleTransitionEnd = () => {
    if (!isOpen) {
      setIsRendered(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Samudhra - Choose Location"
      onTransitionEnd={handleTransitionEnd}
      className={`location-gate-dialog fixed inset-0 z-60 flex flex-col justify-between overflow-y-auto bg-serenade text-heath transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${isOpen
        ? 'opacity-100 scale-100 pointer-events-auto'
        : 'opacity-0 scale-105 pointer-events-none'
        }`}
    >
      {/* ================= BOTTOM-HALF DIAMOND PATTERN WATERMARK ================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[56%] overflow-hidden select-none"
      >
        <div
          className="size-full opacity-30"
          style={{
            backgroundImage: "url('/images/diamond-pattern.png')",
            backgroundRepeat: 'repeat',
            backgroundPosition: 'bottom center',
            backgroundSize: '1920px auto',
            WebkitMaskImage:
              'linear-gradient(to top, #000 0%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,0.25) 82%, transparent 100%)',
            maskImage:
              'linear-gradient(to top, #000 0%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,0.25) 82%, transparent 100%)',
          }}
        />
      </div>

      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="relative z-10 w-full px-5 pt-5 pb-3 sm:px-8 sm:pt-7 sm:pb-4">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between">
          {/* Logo on Left */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#top');
            }}
            aria-label="Samudhra, Home"
            className="flex items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Samudhra"
              className="h-[32px] w-auto sm:h-[40px] object-contain"
              onError={(e) => {
                // Graceful fallback to styled brand wordmark if logo image is missing
                const target = e.currentTarget;
                target.style.display = 'none';
                if (target.nextElementSibling) {
                  (target.nextElementSibling as HTMLElement).style.display = 'block';
                }
              }}
            />
            <span
              style={{ display: 'none' }}
              className="font-serif text-[26px] font-bold tracking-tight text-heath sm:text-[32px]"
            >
              samudhra
            </span>
          </a>

          {/* Hamburger Icon on Right - Opens Site Sidebar Drawer */}
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open navigation menu"
            className="group flex size-10 flex-col items-end justify-center gap-[6px] py-1.5 pl-1.5 pr-0 text-heath transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-heath cursor-pointer"
          >
            <span className="block h-[1.5px] w-7 bg-current transition-transform duration-300" />
            <span className="block h-[1.5px] w-7 bg-current transition-transform duration-300" />
            <span className="block h-[1.5px] w-7 bg-current transition-transform duration-300" />
          </button>
        </div>
      </header>

      {/* ================= CENTER LOCATION CARDS (NEW JERSEY & NEW YORK) ================= */}
      <main className="relative z-10 flex w-full flex-1 items-center px-5 py-2 sm:px-8">
        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:gap-6">
          {/* ----- CARD 1 ----- */}
          <article className="group relative flex min-h-[440px] sm:min-h-[500px] lg:min-h-[580px] xl:min-h-[630px] flex-col items-center justify-center overflow-hidden rounded-none bg-creole text-center shadow-md transition-shadow duration-500 hover:shadow-xl">
            {/* Background Image */}
            <CardBackground image={cardOne.backgroundImage} />

            {/* Dark Twilight Gradient Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/30"
              aria-hidden="true"
            />

            {/* Content Overlay */}
            <div className="relative z-10 flex w-full max-w-[380px] flex-col items-center px-6 py-8">
              {cardOne.name ? (
                <h2 className="text-[30px] sm:text-[34px] lg:text-[40px] leading-tight font-bold tracking-[0.05em] text-white uppercase drop-shadow-sm">
                  {cardOne.name}
                </h2>
              ) : null}

              {cardOne.description ? (
                <p className="mt-3 max-w-[320px] text-[13px] sm:text-[14px] leading-[1.6] font-normal text-white/90 drop-shadow-sm">
                  {cardOne.description}
                </p>
              ) : null}

              {/* Stacked Action Buttons */}
              {cardOne.reserveLabel || cardOne.orderLabel ? (
                <div className="mt-7 flex flex-col items-center gap-3">
                  {cardOne.reserveLabel ? (
                    <button
                      type="button"
                      onClick={() => onSelectLocation(cardOne.name, 0)}
                      className="inline-flex min-h-[40px] sm:min-h-[42px] w-[185px] sm:w-[200px] items-center justify-center border border-white/75 bg-black/15 px-5 text-[10.5px] sm:text-[11px] font-medium tracking-[0.18em] text-white uppercase backdrop-blur-[1px] transition-all duration-300 hover:border-white hover:bg-white hover:text-heath cursor-pointer"
                    >
                      {cardOne.reserveLabel}
                    </button>
                  ) : null}

                  {cardOne.orderLabel ? (
                    <button
                      type="button"
                      onClick={() => onSelectLocation(cardOne.name, 0)}
                      className="inline-flex min-h-[40px] sm:min-h-[42px] w-[185px] sm:w-[200px] items-center justify-center border border-white/75 bg-black/15 px-5 text-[10.5px] sm:text-[11px] font-medium tracking-[0.18em] text-white uppercase backdrop-blur-[1px] transition-all duration-300 hover:border-white hover:bg-white hover:text-heath cursor-pointer"
                    >
                      {cardOne.orderLabel}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </article>

          {/* ----- CARD 2 ----- */}
          <article className="group relative flex min-h-[440px] sm:min-h-[500px] lg:min-h-[580px] xl:min-h-[630px] flex-col items-center justify-center overflow-hidden rounded-none bg-creole text-center shadow-md transition-shadow duration-500 hover:shadow-xl">
            {/* Background Image */}
            <CardBackground image={cardTwo.backgroundImage} />

            {/* Dark Twilight Gradient Overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/30"
              aria-hidden="true"
            />

            {/* Content Overlay */}
            <div className="relative z-10 flex w-full max-w-[380px] flex-col items-center px-6 py-8">
              {cardTwo.name ? (
                <h2 className="text-[30px] sm:text-[34px] lg:text-[40px] leading-tight font-bold tracking-[0.05em] text-white uppercase drop-shadow-sm">
                  {cardTwo.name}
                </h2>
              ) : null}

              {cardTwo.description ? (
                <p className="mt-3 max-w-[320px] text-[13px] sm:text-[14px] leading-[1.6] font-normal text-white/90 drop-shadow-sm">
                  {cardTwo.description}
                </p>
              ) : null}

              {/* Stacked Action Buttons */}
              {cardTwo.reserveLabel || cardTwo.orderLabel ? (
                <div className="mt-7 flex flex-col items-center gap-3">
                  {cardTwo.reserveLabel ? (
                    <button
                      type="button"
                      onClick={() => onSelectLocation(cardTwo.name, 1)}
                      className="inline-flex min-h-[40px] sm:min-h-[42px] w-[185px] sm:w-[200px] items-center justify-center border border-white/75 bg-black/15 px-5 text-[10.5px] sm:text-[11px] font-medium tracking-[0.18em] text-white uppercase backdrop-blur-[1px] transition-all duration-300 hover:border-white hover:bg-white hover:text-heath cursor-pointer"
                    >
                      {cardTwo.reserveLabel}
                    </button>
                  ) : null}

                  {cardTwo.orderLabel ? (
                    <button
                      type="button"
                      onClick={() => onSelectLocation(cardTwo.name, 1)}
                      className="inline-flex min-h-[40px] sm:min-h-[42px] w-[185px] sm:w-[200px] items-center justify-center border border-white/75 bg-black/15 px-5 text-[10.5px] sm:text-[11px] font-medium tracking-[0.18em] text-white uppercase backdrop-blur-[1px] transition-all duration-300 hover:border-white hover:bg-white hover:text-heath cursor-pointer"
                    >
                      {cardTwo.orderLabel}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </article>
        </div>
      </main>

      {/* ================= BOTTOM BAR ================= */}
      <footer className="relative z-10 w-full px-5 pt-6 pb-10 sm:px-8 sm:pt-8 sm:pb-14">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4">
          {/* Social Icons on Left */}
          <div className="flex items-center gap-5 text-heath">
            {/* Instagram */}
            <a
              href={safeInstagramUrl || '#'}
              target={safeInstagramUrl ? '_blank' : undefined}
              rel={safeInstagramUrl ? 'noopener noreferrer' : undefined}
              aria-label="Instagram"
              className="transition-colors hover:text-korma"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* TikTok */}
            <a
              href={safeTiktokUrl || '#'}
              target={safeTiktokUrl ? '_blank' : undefined}
              rel={safeTiktokUrl ? 'noopener noreferrer' : undefined}
              aria-label="TikTok"
              className="transition-colors hover:text-korma"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-[17px]">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.92c-.01 2.37-1.02 4.67-2.77 6.27-1.74 1.6-4.14 2.37-6.51 2.12-2.36-.25-4.54-1.57-5.89-3.53-1.35-1.97-1.72-4.52-1-6.83.72-2.31 2.5-4.15 4.77-4.94 1.42-.49 2.96-.54 4.45-.16v4.18c-.87-.31-1.84-.33-2.71-.05-.88.28-1.61.94-2 1.79-.39.85-.39 1.85-.01 2.7.38.85 1.1 1.51 1.98 1.8 1.07.35 2.27.23 3.25-.32.97-.55 1.59-1.58 1.62-2.71V.02z" />
              </svg>
            </a>
          </div>

          {/* Navigation Links on Right */}
          <nav
            aria-label="Welcome screen navigation"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:gap-x-8"
          >
            {navLinks.map((item) => {
              const safeHref = sanitizeHref(item.href);
              return (
                <a
                  key={item.label}
                  href={safeHref}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(safeHref);
                  }}
                  className="text-[10.5px] sm:text-[11px] font-medium tracking-[0.16em] text-heath/85 transition-colors hover:text-korma uppercase whitespace-nowrap"
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </footer>
    </div>
  );
}
