'use client';

import { useEffect, useState, type FormEvent } from 'react';

export interface EventInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EventInquiryModal({ isOpen, onClose }: EventInquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [location, setLocation] = useState('Mayfair, London');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('');
  const [occasion, setOccasion] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
      className="fixed inset-0 z-50 grid place-items-center p-4"
    >
      {/* Backdrop */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-creole/70 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Modal Dialog Body */}
      <div className="relative z-10 flex w-[min(680px,100%)] max-h-[calc(100vh-32px)] flex-col gap-5 overflow-y-auto rounded-[20px] border-t-[3px] border-zest bg-serenade p-7 text-heath shadow-2xl sm:p-10">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex size-11 items-center justify-center rounded-full text-heath transition-colors hover:bg-heath/10"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            className="size-5"
          >
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>

        <div>
          <p className="text-[11px] font-semibold tracking-[0.24em] text-zest uppercase">
            Catering &amp; Events
          </p>
          <h2
            id="enquiry-modal-title"
            className="mt-1 text-[clamp(28px,3.5vw,36px)] leading-tight font-normal"
          >
            Event Inquiry
          </h2>
        </div>

        {submitted ? (
          <div className="flex flex-col gap-4 py-6">
            <div className="rounded-[12px] bg-zest/15 p-5 text-heath">
              <h3 className="text-xl font-medium">
                Thank you for your inquiry, {name || 'Guest'}!
              </h3>
              <p className="mt-2 text-sm text-heath/80">
                This is a prototype form. In production, our events team at {location} will receive
                your request and respond within 24 hours.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-heath bg-heath px-8 text-[11px] font-semibold tracking-[0.2em] text-serenade uppercase transition-colors hover:bg-zest hover:text-heath"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Location Radios */}
            <fieldset className="col-span-full flex flex-col gap-2.5">
              <legend className="text-[12px] font-semibold tracking-[0.18em] text-heath/75 uppercase">
                Location
              </legend>
              <div className="flex flex-wrap gap-4">
                {['Mayfair, London', 'Fitzrovia, London'].map((loc) => (
                  <label
                    key={loc}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-full border px-4 py-2 text-sm transition-colors ${
                      location === loc
                        ? 'border-heath bg-heath text-serenade'
                        : 'border-heath/30 bg-transparent text-heath hover:border-heath'
                    }`}
                  >
                    <input
                      type="radio"
                      name="location"
                      value={loc}
                      checked={location === loc}
                      onChange={() => setLocation(loc)}
                      className="sr-only"
                    />
                    {loc}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="eq-name"
                className="text-[12px] font-medium tracking-wider text-heath/70 uppercase"
              >
                Name
              </label>
              <input
                id="eq-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="min-h-[46px] border-b border-heath/35 bg-transparent px-1 text-[15px] text-heath outline-none focus:border-heath"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="eq-email"
                className="text-[12px] font-medium tracking-wider text-heath/70 uppercase"
              >
                Email
              </label>
              <input
                id="eq-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
                className="min-h-[46px] border-b border-heath/35 bg-transparent px-1 text-[15px] text-heath outline-none focus:border-heath"
              />
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="eq-date"
                className="text-[12px] font-medium tracking-wider text-heath/70 uppercase"
              >
                Event Date
              </label>
              <input
                id="eq-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="min-h-[46px] border-b border-heath/35 bg-transparent px-1 text-[15px] text-heath outline-none focus:border-heath"
              />
            </div>

            {/* Guests */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="eq-guests"
                className="text-[12px] font-medium tracking-wider text-heath/70 uppercase"
              >
                Estimated Guests
              </label>
              <input
                id="eq-guests"
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                placeholder="e.g. 25"
                className="min-h-[46px] border-b border-heath/35 bg-transparent px-1 text-[15px] text-heath outline-none focus:border-heath"
              />
            </div>

            {/* Occasion / Message */}
            <div className="col-span-full flex flex-col gap-1.5">
              <label
                htmlFor="eq-occasion"
                className="text-[12px] font-medium tracking-wider text-heath/70 uppercase"
              >
                Your Occasion &amp; Details
              </label>
              <textarea
                id="eq-occasion"
                rows={3}
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="Tell us about your celebration, dietary requirements or questions..."
                className="resize-y border-b border-heath/35 bg-transparent px-1 py-2 text-[15px] text-heath outline-none focus:border-heath"
              />
            </div>

            {/* Submit & Prototype notice */}
            <div className="col-span-full flex flex-wrap items-center justify-between gap-4 pt-3">
              <button
                type="submit"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-heath bg-heath px-8 text-[11px] font-semibold tracking-[0.2em] text-serenade uppercase transition-colors hover:bg-zest hover:text-heath"
              >
                Send Inquiry
              </button>
              <span className="text-xs text-heath/70">
                Prototype form — ready for inbox hookup.
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
