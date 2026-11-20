'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Everything interactive on the public site, ported from the approved
 * homepage's script:
 *
 *  - the slide-in menu panel
 *  - the "Reserve a table" / "Order online" location picker
 *  - the event enquiry form
 *  - the hero's cursor-following highlight and the pause control
 *
 * Sections stay server components: they render plain buttons carrying
 * `data-act` / `data-enq`, and this component attaches the listeners once,
 * the same way the original page did.
 *
 * Every word in the two dialogs comes from the admin panel, so the owner can
 * reword or translate them without touching code.
 */

type Intent = 'reserve' | 'order';
type Text = Record<string, string>;

export interface SiteBehaviourProps {
  locations: string[];
  booking: Text;
  enquiry: Text;
}

/** Falls back to the approved wording if a field was cleared in the panel. */
function pick(text: Text, key: string, fallback: string): string {
  const value = text[key];
  return typeof value === 'string' && value.trim() ? value : fallback;
}

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

export function SiteBehaviour({ locations, booking, enquiry }: SiteBehaviourProps) {
  const [intent, setIntent] = useState<Intent>('reserve');
  const [location, setLocation] = useState<string | null>(null);
  const [actOpen, setActOpen] = useState(false);
  const [enqOpen, setEnqOpen] = useState(false);
  const [enqLocation, setEnqLocation] = useState<string | null>(null);
  const [enqError, setEnqError] = useState(false);
  const [enqSent, setEnqSent] = useState(false);

  // Where focus was before a dialog opened, so it can go back.
  const lastFocus = useRef<HTMLElement | null>(null);

  const setMenu = useCallback((open: boolean) => {
    const panel = document.getElementById('ov');
    const trigger = document.getElementById('openMenu');
    panel?.classList.toggle('on', open);
    panel?.setAttribute('aria-hidden', open ? 'false' : 'true');
    trigger?.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      window.setTimeout(() => panel?.querySelector<HTMLElement>('.ov-x')?.focus(), 60);
    }
  }, []);

  const closeAll = useCallback(() => {
    setActOpen(false);
    setEnqOpen(false);
    setMenu(false);
    lastFocus.current?.focus?.();
  }, [setMenu]);

  // Wire up the buttons the server rendered.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const act = target?.closest<HTMLElement>('[data-act]');
      const enq = target?.closest<HTMLElement>('[data-enq]');
      const open = target?.closest<HTMLElement>('#openMenu');
      const mclose = target?.closest<HTMLElement>('[data-mclose]');

      if (act) {
        event.preventDefault();
        lastFocus.current = document.activeElement as HTMLElement;
        setIntent((act.dataset.act as Intent) ?? 'reserve');
        setLocation(act.dataset.loc ?? null);
        setMenu(false);
        setActOpen(true);
        return;
      }
      if (enq) {
        event.preventDefault();
        lastFocus.current = document.activeElement as HTMLElement;
        setEnqError(false);
        setEnqSent(false);
        setEnqLocation((current) => current ?? location);
        setMenu(false);
        setEnqOpen(true);
        return;
      }
      if (open) {
        setMenu(true);
        return;
      }
      if (mclose) setMenu(false);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAll();
    };

    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [closeAll, location, setMenu]);

  // Hero: the highlight follows the cursor, and the pause button stops motion.
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('.hero');
    const site = document.getElementById('site');
    const pause = document.getElementById('pause');
    if (!hero) return;

    const onMove = (event: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      hero.style.setProperty('--my', `${event.clientY - rect.top}px`);
      hero.dataset.track = '1';
    };

    const PLAY =
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4v16l13-8z"></path></svg>';
    const PAUSE =
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"></path></svg>';

    const onPause = () => {
      const paused = !site?.classList.contains('paused');
      site?.classList.toggle('paused', paused);
      pause?.setAttribute('aria-pressed', paused ? 'true' : 'false');
      // Both labels are editable on the hero section.
      pause?.setAttribute(
        'aria-label',
        paused
          ? (pause.dataset.playLabel ?? 'Play animations')
          : (pause.dataset.pauseLabel ?? 'Pause animations'),
      );
      const icon = document.getElementById('pi');
      if (icon) icon.innerHTML = paused ? PLAY : PAUSE;
    };

    hero.addEventListener('mousemove', onMove);
    pause?.addEventListener('click', onPause);
    return () => {
      hero.removeEventListener('mousemove', onMove);
      pause?.removeEventListener('click', onPause);
    };
  }, []);

  const isReserve = intent === 'reserve';
  const title = pick(
    booking,
    isReserve ? 'reserveTitle' : 'orderTitle',
    isReserve ? 'Reserve a Table' : 'Order Online',
  );
  const prompt = pick(
    booking,
    isReserve ? 'reservePrompt' : 'orderPrompt',
    isReserve ? 'Where would you like to dine?' : 'Order from which location?',
  );
  const lead = pick(booking, isReserve ? 'reserveLead' : 'orderLead', '');
  const note = pick(booking, isReserve ? 'reserveNote' : 'orderNote', '');
  const closeLabel = pick(booking, 'closeLabel', 'Close');
  const picked = location !== null;

  return (
    <>
      {/* Reserve / order location picker */}
      <div className="md" id="act" hidden={!actOpen}>
        <button
          type="button"
          className="md-s"
          tabIndex={-1}
          aria-label={closeLabel}
          onClick={closeAll}
        />
        <div className="md-b" role="dialog" aria-modal="true" aria-labelledby="act-t">
          <button type="button" className="md-x" aria-label={closeLabel} onClick={closeAll}>
            <CloseIcon />
          </button>

          <p className="cap" id="act-k">
            {location ?? pick(booking, 'choosePrompt', 'Choose a location')}
          </p>
          <h2 className="md-t" id="act-t">
            {picked ? title : prompt}
          </h2>

          {!picked ? (
            <div className="pk" id="act-pick">
              {locations.map((name) => (
                <button key={name} type="button" className="pk-o" onClick={() => setLocation(name)}>
                  {name}
                  <ArrowIcon />
                </button>
              ))}
            </div>
          ) : (
            <div id="act-done">
              <p className="md-p" id="act-b">
                {lead} {location}.
              </p>
              <p className="proto">
                <span className="proto-k">{pick(booking, 'noticeTag', 'Prototype')}</span>
                <span id="act-p">{note}</span>
              </p>
              <div className="md-a">
                <button type="button" className="btn b-fill b-sm" onClick={closeAll}>
                  {closeLabel}
                </button>
                <button
                  type="button"
                  className="btn b-line b-sm"
                  id="act-sw"
                  onClick={() => setLocation(null)}
                >
                  {pick(booking, 'switchLabel', 'Switch Location')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event enquiry */}
      <div className="md" id="enq" hidden={!enqOpen}>
        <button
          type="button"
          className="md-s"
          tabIndex={-1}
          aria-label={pick(enquiry, 'closeLabel', 'Close')}
          onClick={closeAll}
        />
        <div className="md-b md-w" role="dialog" aria-modal="true" aria-labelledby="eq-t">
          <button
            type="button"
            className="md-x"
            aria-label={pick(enquiry, 'closeLabel', 'Close')}
            onClick={closeAll}
          >
            <CloseIcon />
          </button>

          <p className="cap">{pick(enquiry, 'eyebrow', 'Catering & Events')}</p>
          <h2 className="md-t" id="eq-t">
            {pick(enquiry, 'title', 'Event Inquiry')}
          </h2>

          <form
            className="fm"
            id="eqForm"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              setEnqError(!enqLocation);
              setEnqSent(Boolean(enqLocation));
            }}
          >
            <fieldset className="fd fd-f">
              <legend className="fl">{pick(enquiry, 'locationLabel', 'Location')}</legend>
              <div className="rdr">
                {locations.map((name) => (
                  <label key={name} className={`rd${enqLocation === name ? ' rd-on' : ''}`}>
                    <input
                      type="radio"
                      name="eq-loc"
                      value={name}
                      checked={enqLocation === name}
                      onChange={() => {
                        setEnqLocation(name);
                        setEnqError(false);
                        setEnqSent(false);
                      }}
                    />
                    {name}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="fd">
              <label className="fl" htmlFor="eq-n">
                {pick(enquiry, 'nameLabel', 'Name')}
              </label>
              <input className="fi" id="eq-n" type="text" autoComplete="name" />
            </div>
            <div className="fd">
              <label className="fl" htmlFor="eq-e">
                {pick(enquiry, 'emailLabel', 'Email')}
              </label>
              <input className="fi" id="eq-e" type="email" autoComplete="email" />
            </div>
            <div className="fd">
              <label className="fl" htmlFor="eq-d">
                {pick(enquiry, 'dateLabel', 'Date')}
              </label>
              <input className="fi" id="eq-d" type="date" />
            </div>
            <div className="fd">
              <label className="fl" htmlFor="eq-g">
                {pick(enquiry, 'guestsLabel', 'Guests')}
              </label>
              <input className="fi" id="eq-g" type="number" min={1} inputMode="numeric" />
            </div>
            <div className="fd fd-f">
              <label className="fl" htmlFor="eq-m">
                {pick(enquiry, 'occasionLabel', 'Your occasion')}
              </label>
              <textarea className="fi" id="eq-m" />
            </div>

            <p className="f-err" id="eqErr" hidden={!enqError} role="alert">
              {pick(enquiry, 'errorText', 'Choose a location for your inquiry.')}
            </p>
            <div className="f-note" id="eqNote" hidden={!enqSent} role="status">
              <span className="f-k">{pick(enquiry, 'sentTag', 'Prototype — not sent')}</span>
              <p className="md-p">{pick(enquiry, 'sentText', '')}</p>
            </div>

            <div
              className="fd-f"
              style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}
            >
              <button type="submit" className="btn b-fill">
                {pick(enquiry, 'submitLabel', 'Send Inquiry')}
              </button>
              <span style={{ fontSize: 12, color: 'rgba(77,15,16,.78)' }}>
                {pick(enquiry, 'footnote', '')}
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
