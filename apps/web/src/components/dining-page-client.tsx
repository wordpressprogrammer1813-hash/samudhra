'use client';

import { useRef, useState, type CSSProperties, type FormEvent } from 'react';
import Link from 'next/link';
import { ActionModal } from '@/components/action-modal';
import { EventInquiryModal } from '@/components/event-inquiry-modal';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { Reveal } from '@/components/scroll-reveal';
import { HERO_GLINT_SIZE, HERO_GLINT_URL } from '@/lib/constants';

interface RoomRow {
  id: string;
  title: string;
  meta: string;
  description: string;
  ctaLabel: string;
  image: string;
  imageSide: 'left' | 'right';
}

const ROOMS: RoomRow[] = [
  {
    id: 'dining-room',
    title: 'The Dining Room',
    meta: 'MAIN ROOM · UP TO 60 GUESTS',
    description:
      'The main room, where the menu is served course by course and the evening unfolds at its own pace — familiar flavours in a refined setting.',
    ctaLabel: 'Request Dining Room',
    image: '/images/beetroot-dish.jpg',
    imageSide: 'left',
  },
  {
    id: 'the-lounge',
    title: 'The Lounge',
    meta: 'SEMI-PRIVATE · UP TO 30 GUESTS',
    description:
      'Cocktails and conversation, poured with the same care for spice and balance as the kitchen — an intimate room to linger before or after dinner.',
    ctaLabel: 'Request The Lounge',
    image: '/images/bartender-mixing.jpg',
    imageSide: 'right',
  },
  {
    id: 'private-dining',
    title: 'Private Dining',
    meta: 'PRIVATE · UP TO 40 GUESTS',
    description:
      'A room of your own for celebrations, family occasions and gatherings, with a menu shaped around your table and service paced to your evening.',
    ctaLabel: 'Request Private Dining',
    image: '/images/thali-plate.jpg',
    imageSide: 'left',
  },
];

const GALLERY_IMAGES = [
  { src: '/images/beetroot-dish.jpg', alt: 'Signature plated dish at Samudhra' },
  { src: '/images/cocktails-bar.jpg', alt: 'Craft cocktails at The Lounge' },
  { src: '/images/biryani-dish.jpg', alt: 'Hyderabadi dum biryani' },
  { src: '/images/bartender-mixing.jpg', alt: 'Bartender pouring signature cocktail' },
  { src: '/images/thali-plate.jpg', alt: 'Samudhra Weekend Thali' },
];

const OPENING_HOURS = [
  { day: 'Monday', hours: '11:30 AM – 10:30 PM' },
  { day: 'Tuesday', hours: '11:30 AM – 10:30 PM' },
  { day: 'Wednesday', hours: '11:30 AM – 10:30 PM' },
  { day: 'Thursday', hours: '11:30 AM – 10:30 PM' },
  { day: 'Friday', hours: '11:30 AM – 11:00 PM' },
  { day: 'Saturday', hours: '12:00 PM – 11:00 PM' },
  { day: 'Sunday', hours: '12:00 PM – 10:30 PM' },
];

export function DiningPageClient() {
  const heroRef = useRef<HTMLElement>(null);
  const [tracking, setTracking] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupDone, setSignupDone] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  function onHeroMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    heroRef.current!.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    heroRef.current!.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    if (!tracking) setTracking(true);
  }

  function scrollToId(id: string) {
    window.dispatchEvent(
      new CustomEvent('samudhra:scroll-to', { detail: { target: `#${id}`, offset: -80 } }),
    );
  }

  function handleSignup(e: FormEvent) {
    e.preventDefault();
    if (!signupEmail.trim()) return;
    setSignupDone(true);
  }

  const prevIdx = (galleryIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
  const nextIdx = (galleryIndex + 1) % GALLERY_IMAGES.length;

  return (
    <main id="top" className="overflow-x-hidden bg-serenade text-heath">
      {/* ================= 01. HERO BANNER ================= */}
      <section
        ref={heroRef}
        onMouseMove={onHeroMouseMove}
        className="relative flex h-[calc(100dvh-72px)] min-h-[480px] items-center justify-center overflow-hidden bg-creole text-center text-serenade sm:h-[calc(100dvh-92px)]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/cocktails-bar.jpg')" }}
        />

        {/* #1404059E Overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: '#1404059E' }}
        />

        {/* Left-to-right diagonal sweep reveal on page load */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-screen animate-sweep motion-reduce:animate-none"
          style={
            {
              backgroundImage: `url(${HERO_GLINT_URL})`,
              backgroundSize: HERO_GLINT_SIZE,
              backgroundPosition: '0 0',
              backgroundRepeat: 'repeat',
              WebkitMaskImage: 'linear-gradient(105deg, transparent 40%, #000 50%, transparent 60%)',
              maskImage: 'linear-gradient(105deg, transparent 40%, #000 50%, transparent 60%)',
              WebkitMaskSize: '300% 100%',
              maskSize: '300% 100%',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
            } as CSSProperties
          }
        />

        {/* Cursor-tracking hover glint */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={
            {
              backgroundImage: `url(${HERO_GLINT_URL})`,
              backgroundSize: HERO_GLINT_SIZE,
              backgroundPosition: '0 0',
              backgroundRepeat: 'repeat',
              WebkitMaskImage:
                'radial-gradient(circle 240px at var(--mx, 50%) var(--my, 50%), #000 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
              maskImage:
                'radial-gradient(circle 240px at var(--mx, 50%) var(--my, 50%), #000 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
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
                    animationDelay: '0s, 1.5s',
                    animationIterationCount: 'infinite, 1',
                    animationTimingFunction: 'ease-in-out, ease',
                    animationDirection: 'alternate, normal',
                    animationFillMode: 'none, both',
                  }),
            } as CSSProperties
          }
        />

        {/* Inner Banner Border */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[14px] rounded-2xl border border-serenade/22 sm:inset-[22px]"
        >
          <span className="absolute top-0 left-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-zest" />
          <span className="absolute bottom-0 left-1/2 size-[7px] -translate-x-1/2 translate-y-1/2 rotate-45 bg-zest" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1000px] px-6">
          <p className="flex items-center justify-center gap-3 text-[10px] font-semibold tracking-[0.28em] text-serenade/85 uppercase sm:text-[11px]">
            <span className="h-px w-6 bg-zest" />
            Samudhra · Dining &amp; Lounge
            <span className="h-px w-6 bg-zest" />
          </p>

          <h1 className="mt-5 text-[clamp(52px,9.4vw,136px)] leading-[0.92] font-normal tracking-[0.04em] uppercase">
            Dining
            <span className="mt-1 block text-[clamp(34px,6.4vw,92px)] leading-[0.98] font-light tracking-normal text-zest normal-case">
              &amp; Lounge
            </span>
          </h1>

          <p className="mt-5 text-[clamp(14px,1.25vw,18px)] tracking-[0.08em] text-serenade/85">
            ✦ An evening meant to be lingered over ✦
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setReserveOpen(true)}
              className="inline-flex min-h-[38px] items-center justify-center rounded-full border border-serenade/55 bg-creole/30 px-5 text-[10px] font-medium tracking-[0.2em] text-serenade uppercase transition-colors hover:border-serenade hover:bg-serenade hover:text-heath cursor-pointer"
            >
              Reserve a Table
            </button>
            <button
              type="button"
              onClick={() => scrollToId('private-dining')}
              className="inline-flex min-h-[38px] items-center justify-center rounded-full border border-serenade/55 bg-creole/30 px-5 text-[10px] font-medium tracking-[0.2em] text-serenade uppercase transition-colors hover:border-serenade hover:bg-serenade hover:text-heath cursor-pointer"
            >
              Private Dining
            </button>
            <button
              type="button"
              onClick={() => scrollToId('gallery')}
              className="inline-flex min-h-[38px] items-center justify-center rounded-full border border-serenade/55 bg-creole/30 px-5 text-[10px] font-medium tracking-[0.2em] text-serenade uppercase transition-colors hover:border-serenade hover:bg-serenade hover:text-heath cursor-pointer"
            >
              Gallery
            </button>
          </div>
        </div>
      </section>

      {/* ================= 02. INTRO SAFFRON BANNER ================= */}
      <section className="relative overflow-hidden border-t border-b border-heath/15 bg-zest py-[clamp(64px,7vw,100px)] text-center text-heath">
        {/* Animated Left & Right Corner Mandalas */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/story-mandala.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 -left-32 size-[320px] -translate-y-1/2 animate-[spin_55s_linear_infinite] opacity-22 select-none motion-reduce:animate-none sm:-left-24 sm:size-[360px]"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/story-mandala.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 -right-32 size-[320px] -translate-y-1/2 animate-[spin_65s_linear_infinite_reverse] opacity-22 select-none motion-reduce:animate-none sm:-right-24 sm:size-[360px]"
        />

        <div className="relative z-10 mx-auto max-w-[920px] px-6">
          <Reveal>
            <p className="text-[clamp(16px,1.6vw,23px)] leading-[1.65] text-heath/90">
              Samudhra is a contemporary Indian restaurant where each dish begins with the
              traditions, spices and regional flavours that shape Indian cooking, interpreted
              through a modern dining experience. Across New Jersey &amp; New York, guests can take
              a seat in the dining room, settle into the lounge, or gather privately — familiar
              flavours brought into a refined setting, rooted in tradition and distinctly Samudhra.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/menu"
                className="inline-flex min-h-[38px] items-center justify-center rounded-full border border-heath/50 px-5 text-[10px] font-semibold tracking-[0.2em] text-heath uppercase transition-colors hover:bg-heath hover:text-serenade"
              >
                View Menus
              </Link>
              <button
                type="button"
                onClick={() => scrollToId('gallery')}
                className="inline-flex min-h-[38px] items-center justify-center rounded-full border border-heath/50 px-5 text-[10px] font-semibold tracking-[0.2em] text-heath uppercase transition-colors hover:bg-heath hover:text-serenade cursor-pointer"
              >
                Virtual Tour
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= 03–05. ALTERNATING ROOM SHOWCASE ROWS ================= */}
      {ROOMS.map((room) => {
        const photoEl = (
          <div className="relative aspect-[4/3.6] w-full overflow-hidden bg-creole lg:h-full lg:min-h-[460px] lg:aspect-auto">
            <ImageWithFallback
              src={room.image}
              alt={room.title}
              loading="lazy"
              className="size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
            />
            {/* Inner inset border inside image */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-3 border border-serenade/30 sm:inset-4"
            />
          </div>
        );

        const textEl = (
          <div className="relative flex items-center justify-center overflow-hidden bg-serenade px-8 py-16 text-center sm:px-14 lg:px-16">
            {/* Animated left & right side circle mandalas (tinted warm heath so visible on serenade) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/story-mandala.svg"
              alt=""
              aria-hidden="true"
              style={{
                filter:
                  'invert(13%) sepia(56%) saturate(2800%) hue-rotate(338deg) brightness(82%) contrast(102%)',
              }}
              className="pointer-events-none absolute top-1/2 -left-36 size-[320px] -translate-y-1/2 animate-[spin_55s_linear_infinite] opacity-[0.16] select-none motion-reduce:animate-none"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/story-mandala.svg"
              alt=""
              aria-hidden="true"
              style={{
                filter:
                  'invert(13%) sepia(56%) saturate(2800%) hue-rotate(338deg) brightness(82%) contrast(102%)',
              }}
              className="pointer-events-none absolute top-1/2 -right-36 size-[320px] -translate-y-1/2 animate-[spin_65s_linear_infinite_reverse] opacity-[0.16] select-none motion-reduce:animate-none"
            />
            <Reveal className="relative z-10 flex max-w-[440px] flex-col items-center">
              <h2 className="text-[clamp(28px,3vw,42px)] font-normal tracking-[0.12em] text-heath uppercase">
                {room.title}
              </h2>
              <p className="mt-2.5 text-[clamp(10px,0.8vw,11px)] font-semibold tracking-[0.22em] text-korma uppercase">
                {room.meta}
              </p>
              <p className="mt-5 text-[clamp(15px,1.5vw,21px)] leading-[1.6] text-heath/80">
                {room.description}
              </p>
              <button
                type="button"
                onClick={() => setInquiryOpen(true)}
                className="mt-7 inline-flex min-h-[38px] items-center justify-center rounded-full border border-heath/45 px-6 text-[10px] font-semibold tracking-[0.18em] text-heath uppercase transition-colors hover:bg-heath hover:text-serenade cursor-pointer"
              >
                {room.ctaLabel}
              </button>
            </Reveal>
          </div>
        );

        return (
          <section
            key={room.id}
            id={room.id}
            aria-label={room.title}
            className={`scroll-mt-20 grid grid-cols-1 border-b border-heath/15 ${
              room.imageSide === 'left' ? 'lg:grid-cols-[45%_55%]' : 'lg:grid-cols-[55%_45%]'
            }`}
          >
            {room.imageSide === 'left' ? (
              <>
                <div className="border-b border-heath/15 lg:border-r lg:border-b-0">
                  {photoEl}
                </div>
                {textEl}
              </>
            ) : (
              <>
                <div className="order-2 lg:order-1">{textEl}</div>
                <div className="order-1 border-b border-heath/15 lg:order-2 lg:border-b-0 lg:border-l">
                  {photoEl}
                </div>
              </>
            )}
          </section>
        );
      })}

      {/* ================= 06. CALLING ALL SAMUDHRA REGULARS ================= */}
      <section className="bg-heath py-[clamp(64px,7vw,96px)] px-6">
        <Reveal>
          <div className="mx-auto max-w-[540px] bg-serenade p-4 shadow-2xl">
            <div className="flex flex-col items-center border border-heath/20 px-6 py-10 text-center sm:px-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/footer-mark.png" alt="" className="h-8 w-auto object-contain" />
              <p className="mt-4 flex items-center gap-3 text-[9.5px] font-semibold tracking-[0.26em] text-korma uppercase">
                <span className="h-px w-6 bg-zest" />
                Calling All
                <span className="h-px w-6 bg-zest" />
              </p>
              <h2 className="mt-2 text-[clamp(28px,3.4vw,48px)] leading-[1.1] font-normal text-heath">
                Samudhra <span className="text-zest">regulars</span>
              </h2>
              <p className="mt-3 max-w-[420px] text-[clamp(14px,1.25vw,18px)] leading-[1.65] text-heath/75">
                Step into a world of good food and good company — sign up for kitchen updates, new
                menus, seasonal tables and events.
              </p>

              {signupDone ? (
                <p className="mt-6 text-[12px] font-medium text-korma">
                  Thank you for joining Samudhra Regulars.
                </p>
              ) : signupOpen ? (
                <form
                  onSubmit={handleSignup}
                  className="mt-6 flex w-full max-w-[320px] items-center gap-2"
                >
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="flex-1 border-b border-heath/35 bg-transparent py-1.5 text-[12px] text-heath outline-none focus:border-zest"
                  />
                  <button
                    type="submit"
                    className="inline-flex min-h-[34px] items-center rounded-full bg-heath px-4 text-[10px] font-semibold tracking-[0.16em] text-serenade uppercase hover:bg-zest hover:text-heath cursor-pointer"
                  >
                    Join
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSignupOpen(true)}
                  className="mt-6 inline-flex min-h-[36px] items-center justify-center rounded-full border border-heath/40 px-6 text-[10px] font-semibold tracking-[0.2em] text-heath uppercase transition-colors hover:bg-heath hover:text-serenade cursor-pointer"
                >
                  Sign Up
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ================= 07. PHOTO GALLERY CAROUSEL ================= */}
      <section
        id="gallery"
        aria-label="Photo Gallery"
        className="relative scroll-mt-20 overflow-hidden bg-serenade py-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 h-40 -translate-y-1/2 opacity-20"
          style={{
            backgroundImage: "url('/images/diamond-pattern.png')",
            backgroundRepeat: 'repeat-x',
            backgroundSize: '260px auto',
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-[1320px] items-center justify-center gap-4 px-4 sm:gap-8">
          {/* Prev Peek */}
          <div className="hidden aspect-[16/10] w-[200px] shrink-0 overflow-hidden opacity-45 md:block lg:w-[260px]">
            <ImageWithFallback
              src={GALLERY_IMAGES[prevIdx].src}
              alt={GALLERY_IMAGES[prevIdx].alt}
              className="size-full object-cover"
            />
          </div>

          <button
            type="button"
            onClick={() => setGalleryIndex(prevIdx)}
            aria-label="Previous photo"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-heath/30 bg-serenade text-heath transition-colors hover:bg-heath hover:text-serenade cursor-pointer"
          >
            ←
          </button>

          {/* Active Center Slide */}
          <div className="aspect-[16/10] w-full max-w-[600px] overflow-hidden bg-creole shadow-xl">
            <ImageWithFallback
              src={GALLERY_IMAGES[galleryIndex].src}
              alt={GALLERY_IMAGES[galleryIndex].alt}
              className="size-full object-cover transition-all duration-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setGalleryIndex(nextIdx)}
            aria-label="Next photo"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-heath/30 bg-serenade text-heath transition-colors hover:bg-heath hover:text-serenade cursor-pointer"
          >
            →
          </button>

          {/* Next Peek */}
          <div className="hidden aspect-[16/10] w-[200px] shrink-0 overflow-hidden opacity-45 md:block lg:w-[260px]">
            <ImageWithFallback
              src={GALLERY_IMAGES[nextIdx].src}
              alt={GALLERY_IMAGES[nextIdx].alt}
              className="size-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ================= 08. GET IN TOUCH & OPENING HOURS ================= */}
      <section className="relative overflow-hidden bg-serenade py-[clamp(64px,7vw,100px)] text-center text-heath">
        <div className="relative z-10 mx-auto max-w-[460px] px-6">
          <Reveal>
            <h2 className="text-[clamp(28px,3.1vw,44px)] font-normal tracking-[0.14em] uppercase">
              Get in Touch
            </h2>

            <p className="mt-4 text-[clamp(20px,1.8vw,26px)] font-normal text-heath">
              New Jersey &amp; New York
            </p>

            <div className="mt-3 flex items-center justify-center gap-4 text-[clamp(14px,1.25vw,18px)] font-medium text-korma underline underline-offset-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </div>

            <div className="mt-5 space-y-1 text-[clamp(14px,1.25vw,18px)] text-heath/80">
              <p className="font-medium text-heath">Samudhra</p>
              <p>379 Thornall Street, Edison, NJ 08837</p>
              <p>+1 (732) 548-1111</p>
            </div>

            <div className="mt-6">
              <p className="text-[clamp(14px,1.25vw,18px)] text-heath/75">For all inquiries</p>
              <Link
                href="/contact"
                className="mt-2 inline-flex min-h-[34px] items-center justify-center rounded-full border border-heath/35 px-6 text-[9.5px] font-semibold tracking-[0.18em] uppercase transition-colors hover:bg-heath hover:text-serenade"
              >
                Click Here
              </Link>
            </div>

            <div className="mt-5">
              <p className="text-[clamp(14px,1.25vw,18px)] text-heath/75">
                For private &amp; group dining
              </p>
              <button
                type="button"
                onClick={() => setInquiryOpen(true)}
                className="mt-2 inline-flex min-h-[34px] items-center justify-center rounded-full border border-heath/35 px-6 text-[9.5px] font-semibold tracking-[0.18em] uppercase transition-colors hover:bg-heath hover:text-serenade cursor-pointer"
              >
                Click Here
              </button>
            </div>

            {/* Opening Hours Table */}
            <div className="mt-10">
              <h3 className="text-[clamp(18px,1.5vw,22px)] font-normal text-heath">
                Opening Hours
              </h3>
              <div className="mt-4 divide-y divide-heath/15 border-t border-b border-heath/15 text-[clamp(14px,1.25vw,18px)]">
                {OPENING_HOURS.map((item) => (
                  <div key={item.day} className="flex items-center justify-between py-2.5">
                    <span className="text-heath/85">{item.day}</span>
                    <span className="text-korma">{item.hours}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setReserveOpen(true)}
                className="mt-6 inline-flex min-h-[38px] items-center justify-center rounded-full border border-heath/45 px-7 text-[10px] font-semibold tracking-[0.2em] text-heath uppercase transition-colors hover:bg-heath hover:text-serenade cursor-pointer"
              >
                Reservations
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <ActionModal
        isOpen={reserveOpen}
        intent="reserve"
        onClose={() => setReserveOpen(false)}
      />
      <EventInquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </main>
  );
}
