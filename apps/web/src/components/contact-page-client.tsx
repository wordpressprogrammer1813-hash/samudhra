'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ActionModal } from '@/components/action-modal';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { Reveal } from '@/components/scroll-reveal';

interface MapLocation {
  num: string;
  name: string;
  address: string;
  phone: string;
  transit: string;
  directionsHref: string;
}

const CONTACT_LOCATIONS: MapLocation[] = [
  {
    num: '01',
    name: 'New Jersey',
    address: '379 Thornall Street, Edison, NJ 08837',
    phone: '+1 (732) 548-1111',
    transit: 'Complimentary valet & adjacent parking deck',
    directionsHref: 'https://maps.google.com/?q=379+Thornall+Street+Edison+NJ+08837',
  },
  {
    num: '02',
    name: 'New York',
    address: '120 Lexington Avenue, New York, NY 10016',
    phone: '+1 (212) 686-2222',
    transit: '28th St Subway (6 line) · 2 min walk',
    directionsHref: 'https://maps.google.com/?q=120+Lexington+Avenue+New+York+NY+10016',
  },
];

const GUEST_OPTIONS = ['1 guest', '2 guests', '3 guests', '4 guests', '5 guests', '6 guests', '8+ guests'];
const TIME_OPTIONS = ['5:30 pm', '6:00 pm', '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm', '8:30 pm', '9:00 pm'];

export function ContactPageClient() {
  const [activePin, setActivePin] = useState<'01' | '02'>('01');
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    guests: '2 guests',
    date: '',
    time: '7:00 pm',
    location: 'New Jersey',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main id="top" className="overflow-x-hidden">
      {/* ================= 01. CONTACT US / MAKE A RESERVATION (Dark Burgundy) ================= */}
      <section
        aria-labelledby="contact-hero-title"
        className="relative overflow-hidden bg-heath py-[clamp(64px,7vw,110px)] text-serenade"
      >
        {/* Right-edge decorative rotating mandala */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 -right-44 -translate-y-1/2 select-none sm:-right-36 lg:-right-28"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/story-mandala.svg"
            alt=""
            className="size-[420px] sm:size-[520px] lg:size-[600px] animate-[spin_65s_linear_infinite] opacity-25 motion-reduce:animate-none"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1160px] px-6 sm:px-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Heading, Intro & Underline Form */}
            <Reveal className="lg:col-span-6">
              <div className="flex flex-col items-start">
                <h1
                  id="contact-hero-title"
                  className="text-[clamp(34px,3.6vw,52px)] leading-[1.06] font-normal tracking-[-0.02em] text-serenade"
                >
                  Contact us /
                  <br />
                  Make a reservation
                </h1>

                <span className="my-5 block h-px w-8 bg-zest" aria-hidden="true" />

                <p className="max-w-[400px] text-[clamp(14px,1.15vw,16px)] leading-[1.65] text-serenade/80">
                  Planning a dinner, a celebration or just a question about the menu? Send us a note
                  or request a table and we’ll get back to you within a day.
                </p>

                {submitted ? (
                  <div className="mt-8 w-full rounded-[14px] border border-zest/40 bg-creole/45 p-6 text-serenade">
                    <p className="text-[11px] font-semibold tracking-[0.2em] text-zest uppercase">
                      Request Received
                    </p>
                    <p className="mt-2 text-[14px] leading-relaxed text-serenade/90">
                      Thank you{form.name ? `, ${form.name}` : ''}. Your table inquiry for{' '}
                      <strong className="font-medium text-serenade">{form.guests}</strong> at{' '}
                      <strong className="font-medium text-serenade">{form.location}</strong> has
                      been noted. Our team will confirm within a day.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-5 inline-flex min-h-[38px] items-center justify-center rounded-full border border-serenade/50 px-5 text-[11px] font-medium tracking-[0.14em] text-serenade uppercase transition-colors hover:bg-serenade hover:text-heath cursor-pointer"
                    >
                      Send another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 w-full space-y-6">
                    {/* Row 1: Name & Phone */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <label className="block">
                        <span className="block text-[clamp(11px,0.85vw,12px)] tracking-[0.14em] text-serenade/65">
                          Name
                        </span>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="mt-1.5 w-full border-b border-serenade/25 bg-transparent pb-2 text-[clamp(14px,1.05vw,15px)] text-serenade outline-none transition-colors focus:border-zest"
                        />
                      </label>

                      <label className="block">
                        <span className="block text-[clamp(11px,0.85vw,12px)] tracking-[0.14em] text-serenade/65">
                          Phone
                        </span>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="mt-1.5 w-full border-b border-serenade/25 bg-transparent pb-2 text-[clamp(14px,1.05vw,15px)] text-serenade outline-none transition-colors focus:border-zest"
                        />
                      </label>
                    </div>

                    {/* Row 2: Email & Number of guests */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <label className="block">
                        <span className="block text-[clamp(11px,0.85vw,12px)] tracking-[0.14em] text-serenade/65">
                          Email
                        </span>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="mt-1.5 w-full border-b border-serenade/25 bg-transparent pb-2 text-[clamp(14px,1.05vw,15px)] text-serenade outline-none transition-colors focus:border-zest"
                        />
                      </label>

                      <label className="block">
                        <span className="block text-[clamp(11px,0.85vw,12px)] tracking-[0.14em] text-serenade/65">
                          Number of guests
                        </span>
                        <select
                          value={form.guests}
                          onChange={(e) => setForm({ ...form, guests: e.target.value })}
                          className="mt-1.5 w-full border-b border-serenade/25 bg-heath pb-2 text-[clamp(14px,1.05vw,15px)] text-serenade outline-none transition-colors focus:border-zest cursor-pointer"
                        >
                          {GUEST_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} className="bg-heath text-serenade">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    {/* Row 3: Date & Time */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <label className="block">
                        <span className="block text-[clamp(11px,0.85vw,12px)] tracking-[0.14em] text-serenade/65">
                          Date
                        </span>
                        <input
                          type="date"
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="mt-1.5 w-full border-b border-serenade/25 bg-transparent pb-2 text-[clamp(14px,1.05vw,15px)] text-serenade scheme-dark outline-none transition-colors focus:border-zest"
                        />
                      </label>

                      <label className="block">
                        <span className="block text-[clamp(11px,0.85vw,12px)] tracking-[0.14em] text-serenade/65">
                          Time
                        </span>
                        <select
                          value={form.time}
                          onChange={(e) => setForm({ ...form, time: e.target.value })}
                          className="mt-1.5 w-full border-b border-serenade/25 bg-heath pb-2 text-[clamp(14px,1.05vw,15px)] text-serenade outline-none transition-colors focus:border-zest cursor-pointer"
                        >
                          {TIME_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} className="bg-heath text-serenade">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    {/* Row 4: Location */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <label className="block">
                        <span className="block text-[clamp(11px,0.85vw,12px)] tracking-[0.14em] text-serenade/65">
                          Location
                        </span>
                        <select
                          value={form.location}
                          onChange={(e) => setForm({ ...form, location: e.target.value })}
                          className="mt-1.5 w-full border-b border-serenade/25 bg-heath pb-2 text-[clamp(14px,1.05vw,15px)] text-serenade outline-none transition-colors focus:border-zest cursor-pointer"
                        >
                          {CONTACT_LOCATIONS.map((loc) => (
                            <option key={loc.num} value={loc.name} className="bg-heath text-serenade">
                              {loc.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    {/* Row 5: Message */}
                    <label className="block">
                      <span className="block text-[clamp(11px,0.85vw,12px)] tracking-[0.14em] text-serenade/65">
                        Write your message
                      </span>
                      <textarea
                        rows={2}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="mt-1.5 w-full resize-none border-b border-serenade/25 bg-transparent pb-2 text-[clamp(14px,1.05vw,15px)] text-serenade outline-none transition-colors focus:border-zest"
                      />
                    </label>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="group inline-flex min-h-[42px] items-center gap-2.5 rounded-full border border-serenade/55 bg-transparent px-7 text-[11px] font-medium tracking-[0.12em] text-serenade transition-colors duration-300 hover:border-serenade hover:bg-serenade hover:text-heath cursor-pointer"
                      >
                        <span>Reserve a table</span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        >
                          <path d="M4 12h16M14 6l6 6-6 6" />
                        </svg>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </Reveal>

            {/* Right Column: Rounded Bartender Photo */}
            <Reveal variant="clip" delay={140} className="lg:col-span-6">
              <div className="group mx-auto aspect-square w-full max-w-[460px] overflow-hidden rounded-[22px] bg-creole shadow-[0_28px_60px_-18px_rgba(0,0,0,0.65)]">
                <ImageWithFallback
                  src="/images/bartender-mixing.jpg"
                  alt="Samudhra bartender preparing signature cocktail"
                  className="size-full object-cover object-[45%_35%] transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= 02. HOW TO GET HERE (Warm Saffron / Zest) ================= */}
      <section
        aria-labelledby="directions-title"
        className="relative overflow-hidden bg-zest py-[clamp(70px,8vw,120px)] text-heath"
      >
        {/* Subtle Diamond Pattern on Right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-full overflow-hidden select-none sm:w-[60%] lg:w-[48%]"
        >
          <div
            className="size-full opacity-20"
            style={{
              backgroundImage: "url('/images/diamond-pattern.png')",
              backgroundRepeat: 'repeat',
              backgroundPosition: 'right center',
              backgroundSize: '360px auto',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 40%, #000 100%)',
              maskImage:
                'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 40%, #000 100%)',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1160px] px-6 sm:px-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Illustrative Dark Map Card */}
            <Reveal variant="scale" className="lg:col-span-5">
              <div className="relative aspect-[4/4.3] w-full overflow-hidden rounded-[22px] bg-[#300a0b] p-6 text-serenade shadow-[0_26px_55px_-16px_rgba(77,15,16,0.55)]">
                {/* Subtle Street Grid Lines */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(255,248,237,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,248,237,0.35) 1px, transparent 1px)',
                    backgroundSize: '78px 78px',
                  }}
                />

                {/* Diagonal / Curved Saffron Avenue SVG */}
                <svg
                  viewBox="0 0 400 430"
                  fill="none"
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 size-full"
                >
                  <path
                    d="M -20 320 C 90 290, 150 285, 230 250 C 310 215, 355 215, 425 225"
                    stroke="#db851d"
                    strokeOpacity="0.65"
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 160 -10 C 175 110, 145 200, 185 440"
                    stroke="#fff8ed"
                    strokeOpacity="0.14"
                    strokeWidth="1.5"
                  />
                </svg>

                {/* District Labels */}
                <span className="relative z-10 block pt-8 pl-6 text-[9px] tracking-[0.26em] text-serenade/45 uppercase">
                  NORTH
                </span>
                <span className="absolute top-[43%] right-8 z-10 text-[9px] tracking-[0.26em] text-serenade/45 uppercase">
                  MARKET
                </span>
                <span className="absolute bottom-12 left-10 z-10 text-[9px] tracking-[0.26em] text-serenade/45 uppercase">
                  RIVERSIDE
                </span>

                {/* Interactive Pin 01 */}
                <button
                  type="button"
                  onClick={() => setActivePin('01')}
                  aria-label="Highlight Location 01"
                  className="group absolute top-[38%] left-[31%] z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 cursor-pointer"
                >
                  <span
                    className={`grid size-7 place-items-center rounded-full transition-all duration-300 ${
                      activePin === '01'
                        ? 'bg-zest/35 ring-2 ring-zest scale-110'
                        : 'bg-zest/20 group-hover:bg-zest/35'
                    }`}
                  >
                    <span className="size-2.5 rounded-full bg-zest shadow-[0_0_12px_#db851d]" />
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.14em] text-serenade">
                    01
                  </span>
                </button>

                {/* Interactive Pin 02 */}
                <button
                  type="button"
                  onClick={() => setActivePin('02')}
                  aria-label="Highlight Location 02"
                  className="group absolute top-[57%] left-[72%] z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 cursor-pointer"
                >
                  <span
                    className={`grid size-7 place-items-center rounded-full transition-all duration-300 ${
                      activePin === '02'
                        ? 'bg-zest/35 ring-2 ring-zest scale-110'
                        : 'bg-zest/20 group-hover:bg-zest/35'
                    }`}
                  >
                    <span className="size-2.5 rounded-full bg-zest shadow-[0_0_12px_#db851d]" />
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.14em] text-serenade">
                    02
                  </span>
                </button>

                {/* Map Footer Caption */}
                <p className="absolute inset-x-6 bottom-5 z-10 text-[10px] text-serenade/55">
                  Illustrative map — live map once addresses are supplied
                </p>
              </div>
            </Reveal>

            {/* Right Column: Heading, Locations 01/02 & Opening Hours */}
            <Reveal delay={120} className="lg:col-span-7">
              <div className="flex flex-col">
                <h2
                  id="directions-title"
                  className="text-[clamp(34px,3.6vw,52px)] leading-[1.06] font-normal tracking-[-0.02em] text-heath"
                >
                  How to get here
                </h2>

                {/* 2-Column Locations Grid */}
                <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
                  {CONTACT_LOCATIONS.map((loc) => {
                    const isActive = activePin === loc.num;
                    return (
                      <div
                        key={loc.num}
                        onMouseEnter={() => setActivePin(loc.num as '01' | '02')}
                        className={`flex flex-col items-start gap-2 rounded-[10px] transition-opacity duration-300 ${
                          isActive ? 'opacity-100' : 'opacity-85 hover:opacity-100'
                        }`}
                      >
                        <span className="text-[10px] font-semibold tracking-[0.2em] text-heath/75">
                          {loc.num}
                        </span>
                        <h3 className="text-[clamp(16px,1.25vw,18px)] font-medium text-heath">
                          {loc.name}
                        </h3>
                        <p className="text-[clamp(13px,1vw,14px)] leading-[1.65] text-heath/85">
                          {loc.address}
                        </p>
                        <a
                          href={`tel:${loc.phone.replace(/[^0-9+]/g, '')}`}
                          className="text-[clamp(13px,1vw,14px)] text-heath/85 transition-colors hover:text-serenade"
                        >
                          {loc.phone}
                        </a>
                        <p className="text-[clamp(13px,1vw,14px)] leading-[1.55] text-heath/75">
                          {loc.transit}
                        </p>

                        <a
                          href={loc.directionsHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group mt-2 inline-flex items-center gap-2 border-b border-heath/35 pb-1.5 text-[11px] font-semibold tracking-[0.12em] text-heath transition-colors hover:border-heath"
                        >
                          <span>Get directions</span>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                          >
                            <path d="M4 12h16M14 6l6 6-6 6" />
                          </svg>
                        </a>
                      </div>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="my-7 h-px w-full bg-heath/18" />

                {/* Opening Hours */}
                <div className="flex flex-col gap-1.5 text-[clamp(13px,1vw,14px)] leading-[1.65] text-heath/85">
                  <p className="mb-1 text-[11px] font-semibold tracking-[0.12em] text-heath/75">
                    Opening hours
                  </p>
                  <p>Lunch: Mon–Fri, 11:30 AM – 2:30 PM</p>
                  <p>Dinner: Mon–Sun, 5:00 PM – 10:30 PM</p>
                  <p>Weekend Thali — Sat &amp; Sun, 12:00 PM – 3:30 PM</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= 03. TAKEAWAY & ORDER ONLINE (Dark Burgundy) ================= */}
      <section
        aria-labelledby="takeaway-title"
        className="relative overflow-hidden bg-heath py-[clamp(70px,8vw,120px)] text-serenade"
      >
        {/* Bottom-left decorative rotating mandala */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-36 -left-36 select-none sm:-bottom-28 sm:-left-28"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/thali-mandala.svg"
            alt=""
            className="size-[380px] sm:size-[460px] animate-[spin_65s_linear_infinite] opacity-25 motion-reduce:animate-none"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1160px] px-6 sm:px-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Heading, Copy & CTAs */}
            <Reveal className="lg:col-span-5">
              <div className="flex flex-col items-start">
                <h2
                  id="takeaway-title"
                  className="text-[clamp(34px,3.6vw,52px)] leading-[1.06] font-normal tracking-[-0.02em] text-serenade"
                >
                  Takeaway &amp;
                  <br />
                  order online
                </h2>

                <span className="my-5 block h-px w-8 bg-zest" aria-hidden="true" />

                <p className="max-w-[380px] text-[clamp(14px,1.15vw,16px)] leading-[1.65] text-serenade/80">
                  Biryani, curries and fresh bread from the tandoor — packed to travel and ready to
                  collect from either location.
                </p>

                <p className="mt-3 text-[clamp(13px,1vw,14px)] text-serenade/60">
                  Pickup &amp; local delivery daily during kitchen hours
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-6">
                  <button
                    type="button"
                    onClick={() => setOrderModalOpen(true)}
                    className="group inline-flex min-h-[42px] items-center gap-2.5 rounded-full bg-zest px-6 text-[11px] font-semibold tracking-[0.1em] text-heath transition-colors duration-300 hover:bg-serenade cursor-pointer"
                  >
                    <span>Order online</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path d="M4 12h16M14 6l6 6-6 6" />
                    </svg>
                  </button>

                  <Link
                    href="/#catering"
                    className="group inline-flex items-center gap-2 border-b border-serenade/35 pb-1 text-[11px] font-medium tracking-[0.08em] text-serenade/90 transition-colors hover:border-zest hover:text-zest"
                  >
                    <span>Catering &amp; events</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path d="M4 12h16M14 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Right Column: Rounded Biryani Photo */}
            <Reveal variant="clip" delay={140} className="lg:col-span-7">
              <div className="group mx-auto aspect-[4/3.6] w-full max-w-[490px] overflow-hidden rounded-[22px] bg-creole shadow-[0_28px_60px_-18px_rgba(0,0,0,0.65)]">
                <ImageWithFallback
                  src="/images/biryani-dish.jpg"
                  alt="Samudhra signature biryani packed for takeaway"
                  className="size-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Interactive Order Online Modal */}
      <ActionModal
        isOpen={orderModalOpen}
        intent="order"
        initialLocation={form.location}
        onClose={() => setOrderModalOpen(false)}
      />
    </main>
  );
}
