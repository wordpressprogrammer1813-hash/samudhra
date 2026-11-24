'use client';

import { useEffect, useRef, useState } from 'react';

export type ActionIntent = 'reserve' | 'order';

export interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  intent: ActionIntent;
  initialLocation?: string | null;
}

const INTENT_COPY: Record<
  ActionIntent,
  {
    title: string;
    prompt: string;
    confirmedPrefix: string;
    note: string;
  }
> = {
  reserve: {
    title: 'Reserve a Table',
    prompt: 'Where would you like to dine?',
    confirmedPrefix: 'On the live site this opens the reservation system for ',
    note: 'The booking link hasn’t been supplied, so no table has been reserved.',
  },
  order: {
    title: 'Order Online',
    prompt: 'Order from which location?',
    confirmedPrefix: 'On the live site this opens online ordering for ',
    note: 'The ordering link hasn’t been supplied, so no order has been placed.',
  },
};

const LOCATIONS = ['New Jersey', 'New York'];

export function ActionModal({ isOpen, onClose, intent, initialLocation = null }: ActionModalProps) {
  const [selectedLoc, setSelectedLoc] = useState<string | null>(initialLocation);
  const dialogRef = useRef<HTMLDivElement>(null);

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

  const copy = INTENT_COPY[intent];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="action-modal-title"
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
      <div
        ref={dialogRef}
        className="relative z-10 flex w-[min(560px,100%)] max-h-[calc(100vh-32px)] flex-col gap-5 overflow-y-auto rounded-[20px] border-t-[3px] border-zest bg-serenade p-7 text-heath shadow-2xl sm:p-10"
      >
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

        {/* Kicker & Title */}
        <div>
          <p className="text-[11px] font-semibold tracking-[0.24em] text-zest uppercase">
            {selectedLoc || 'Choose a location'}
          </p>
          <h2
            id="action-modal-title"
            className="mt-1 text-[clamp(28px,3.5vw,36px)] leading-tight font-normal"
          >
            {selectedLoc ? copy.title : copy.prompt}
          </h2>
        </div>

        {/* Location Picker */}
        {!selectedLoc ? (
          <div className="divide-y divide-heath/15 border-t border-b border-heath/15">
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setSelectedLoc(loc)}
                className="group flex min-h-[72px] w-full items-center justify-between py-2 text-left text-[clamp(20px,2.4vw,26px)] font-normal text-heath transition-all duration-300 hover:pl-3"
              >
                <span>{loc}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M4 12h16M14 6l6 6-6 6" />
                </svg>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 pt-2">
            <p className="text-[15px] leading-relaxed text-heath/85">
              {copy.confirmedPrefix}{' '}
              <strong className="font-semibold text-heath">{selectedLoc}</strong>.
            </p>
            <div className="rounded-[8px] bg-zest/15 p-3.5 text-[12px] leading-relaxed text-heath/90">
              <span className="font-semibold tracking-wider text-korma uppercase">Prototype: </span>
              {copy.note}
            </div>
            <div className="mt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-heath bg-heath px-6 text-[11px] font-semibold tracking-[0.2em] text-serenade uppercase transition-colors hover:bg-zest hover:text-heath"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setSelectedLoc(null)}
                className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-heath/50 bg-transparent px-6 text-[11px] font-semibold tracking-[0.2em] text-heath uppercase transition-colors hover:bg-heath hover:text-serenade"
              >
                Switch Location
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
