/* eslint-disable @next/next/no-img-element -- CMS images come from arbitrary hosts */
import Link from 'next/link';
import type { PageSection } from '@samudra/shared';
import { list, text } from '@/lib/content';
import { ActionButton } from './site-header';

/**
 * One component per section kind, emitting the same markup and class names as
 * the approved homepage so the ported stylesheet in src/styles/site.css draws
 * it exactly as designed. Every string and image comes from the admin panel.
 */

const ARROW = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

/** `object-position` only when the client set one, so CSS defaults win. */
function pos(value: string | undefined) {
  return value ? { objectPosition: value } : undefined;
}

/** Focus point plus an optional zoom, as the design uses on some photos. */
function posZoom(position: string | undefined, scale: string | undefined) {
  const zoom = Number(scale);
  return {
    ...(position ? { objectPosition: position } : {}),
    ...(Number.isFinite(zoom) && zoom > 0 ? { transform: `scale(${zoom})` } : {}),
  };
}

/* ------------------------------------------------------------------ hero */

export function Hero({ content }: { content: Record<string, unknown> }) {
  const photo = text(content, 'backgroundImage');
  const line1 = text(content, 'titleLine1');
  const line2 = text(content, 'titleLine2');
  const actions = list(content, 'actions');
  const letters = [...line1];

  return (
    <section className="hero" id="top" aria-labelledby="hero-t">
      {photo ? (
        <div className="h-photo" aria-hidden="true">
          <img
            src={photo}
            alt=""
            width={2400}
            height={1600}
            style={pos(text(content, 'imagePosition', '52% 56%'))}
          />
        </div>
      ) : null}
      <div className="wash" aria-hidden="true" />
      <div className="glint g-sweep" aria-hidden="true" />
      <div className="glint g-spot" aria-hidden="true" />
      <div className="rim" aria-hidden="true" />

      <div className="ct">
        <p className="eb">{text(content, 'eyebrow')}</p>

        <h1
          id="hero-t"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            fontWeight: 400,
          }}
        >
          <span className="sr">
            {line1}
            {line2 ? `, ${line2}` : ''}
          </span>
          <span className="t1" aria-hidden="true">
            {letters.map((letter, i) => (
              <span key={`${letter}-${i}`} style={{ animationDelay: `${0.45 + i * 0.05}s` }}>
                {letter}
              </span>
            ))}
          </span>
          {line2 ? (
            <span className="t2" aria-hidden="true">
              {line2}
            </span>
          ) : null}
        </h1>

        <p className="lede">
          <i aria-hidden="true" />
          {text(content, 'subtitle')}
          <i aria-hidden="true" />
        </p>

        <div className="acts">
          {actions.map((action) => (
            <ActionButton key={`${action.label}-${action.action}`} action={action} className="lb" />
          ))}
        </div>
      </div>

      <a className="chev" href="#menu" aria-label="Scroll down">
        <svg
          viewBox="0 0 34 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M2 2l15 13L32 2" />
        </svg>
      </a>

      <button
        type="button"
        className="pause"
        aria-pressed="false"
        aria-label="Pause animations"
        id="pause"
      >
        <span id="pi">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
          </svg>
        </span>
      </button>
    </section>
  );
}

/* ---------------------------------------------------------- menuShowcase */

export function MenuShowcase({ content }: { content: Record<string, unknown> }) {
  const cards = list(content, 'cards');
  const star = text(content, 'starImage');
  const ctaLabel = text(content, 'ctaLabel');

  return (
    <section className="sig" id="menu" aria-labelledby="sig-t">
      <div className="sig-h">
        <p className="sig-k rv">{text(content, 'eyebrow')}</p>
        <h2 className="sig-t rv rv2" id="sig-t">
          {text(content, 'heading')}
        </h2>
        <p className="sig-p rv">{text(content, 'body')}</p>
      </div>

      <div className="trio">
        {cards.map((card, i) => (
          <Link
            key={`${card.title}-${i}`}
            className={`dish-c rv${i === 1 ? ' rv2' : ''}`}
            href={card.href || '#menu'}
          >
            <div className="dc-st">
              {star ? (
                <div className="dc-star" aria-hidden="true">
                  <img src={star} alt="" loading="lazy" />
                </div>
              ) : null}

              {card.imageMode === 'cutout' ? (
                <div className="dc-cut">
                  <img src={card.image} alt={card.title ?? ''} loading="lazy" />
                </div>
              ) : (
                <div className="dc-plate">
                  <img
                    src={card.image}
                    alt={card.title ?? ''}
                    loading="lazy"
                    style={posZoom(card.imagePosition, card.imageScale)}
                  />
                </div>
              )}
            </div>

            <span className="dc-n">{card.numeral}</span>
            <h3 className="dc-t">{card.title}</h3>
            <p className="dc-d">{card.description}</p>
            <span className="dc-go">
              {card.linkLabel}
              {ARROW}
            </span>
          </Link>
        ))}
      </div>

      {ctaLabel ? (
        <div className="sig-cta rv">
          <ActionButton
            action={{
              label: ctaLabel,
              action: text(content, 'action', 'order'),
              href: text(content, 'ctaHref'),
            }}
            className="btn b-fill"
          />
        </div>
      ) : null}
    </section>
  );
}

/* ---------------------------------------------------------- weekendThali */

export function WeekendThali({ content }: { content: Record<string, unknown> }) {
  const frames = list(content, 'frames');
  const actions = list(content, 'actions');
  const plate = text(content, 'plateImage');

  return (
    <section className="spl" id="thali" aria-labelledby="thali-t">
      <div className="wrap">
        <div className="col">
          <div className="sp-h">
            <p className="sp-eb rv">{text(content, 'eyebrow')}</p>
            <h2 className="sp-t rv rv2" id="thali-t">
              {text(content, 'titleLine1')}
              <br />
              {text(content, 'titleLine2')}
            </h2>
          </div>

          {frames.slice(0, 4).map((frame, i) => (
            <figure key={`frame-${i}`} className={`fr fr-${i + 1} rv${i >= 2 ? ' rv2' : ''}`}>
              <img
                src={frame.image}
                alt={frame.alt ?? ''}
                loading="lazy"
                style={pos(frame.imagePosition)}
              />
            </figure>
          ))}

          {plate ? (
            <div className="sp-plate rv">
              <img src={plate} alt={text(content, 'titleLine2', 'Thali')} loading="lazy" />
            </div>
          ) : null}

          <div className="sp-d rv">
            <p className="sp-p">{text(content, 'body')}</p>
            <div className="sp-a">
              {actions.map((action, i) => (
                <ActionButton
                  key={`${action.label}-${i}`}
                  action={action}
                  className={`btn ${i === 0 ? 'b-bu' : 'b-bl'} b-sm`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- diningLounge */

export function DiningLounge({ content }: { content: Record<string, unknown> }) {
  const rows = list(content, 'rows');

  return (
    <section className="sec" id="dining" aria-labelledby="dining-t">
      <div className="wrap">
        <div className="sh">
          <div className="sh-l">
            <span className="sh-n rv">{text(content, 'eyebrow')}</span>
            <h2 className="sh-t rv rv2" id="dining-t">
              {text(content, 'heading')}
            </h2>
          </div>
          <div className="sh-r rv">
            <p className="sh-p">{text(content, 'body')}</p>
          </div>
        </div>

        <div className="rows">
          {rows.map((row, i) => (
            <Link key={`${row.title}-${i}`} className="row rv" href={row.href || '#'}>
              <div className="r-th">
                <img src={row.image} alt="" loading="lazy" style={pos(row.imagePosition)} />
              </div>
              <p className="r-d">{row.description}</p>
              <h3 className="r-t">{row.title}</h3>
              <span className="r-a" aria-hidden="true">
                {ARROW}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- ourStory */

export function OurStory({ content }: { content: Record<string, unknown> }) {
  const mark = text(content, 'markImage');
  const ctaLabel = text(content, 'ctaLabel');

  return (
    <section className="story" id="story" aria-labelledby="story-t">
      <div className="wrap st-g">
        {mark ? (
          <div className="st-mk" aria-hidden="true">
            <img src={mark} alt="" loading="lazy" />
          </div>
        ) : null}

        <div className="st-c">
          <p className="st-k rv">{text(content, 'eyebrow')}</p>
          <h2 className="st-t rv rv2" id="story-t">
            {text(content, 'heading')}
          </h2>
          <p className="st-q rv rv2">{text(content, 'quote')}</p>
          <span className="st-rule rv" aria-hidden="true" />
          <p className="st-p rv">{text(content, 'body')}</p>

          {ctaLabel ? (
            <div className="st-a rv">
              <ActionButton
                action={{
                  label: ctaLabel,
                  action: text(content, 'action', 'link'),
                  href: text(content, 'ctaHref'),
                }}
                className="btn b-bu"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- cateringEvents */

export function CateringEvents({ content }: { content: Record<string, unknown> }) {
  const cards = list(content, 'cards');

  return (
    <section
      className="sec cat dk"
      id="catering"
      aria-labelledby="cat-t"
      style={{ background: '#4D0F10', color: '#FFF8ED' }}
    >
      <div className="wrap ce-g">
        <div className="ce-c">
          <span className="sh-n rv">{text(content, 'eyebrow')}</span>
          <h2 className="sh-t rv rv2" id="cat-t">
            {text(content, 'heading')}
          </h2>
          <p className="ce-p rv">{text(content, 'body')}</p>
        </div>

        <div className="cards">
          {cards.map((card, i) => {
            const inner = (
              <>
                <div className="c-img">
                  <img
                    src={card.image}
                    alt={`${card.titleLine1 ?? ''} ${card.titleLine2 ?? ''}`.trim()}
                    loading="lazy"
                    style={pos(card.imagePosition)}
                  />
                </div>
                <span className="c-row">
                  <span className="c-t">
                    {card.titleLine1}
                    <br />
                    {card.titleLine2}
                  </span>
                  <span className="c-n">{card.note}</span>
                </span>
                <span className="c-rule" />
                <span className="c-go">
                  {card.linkLabel}
                  {ARROW}
                </span>
              </>
            );

            return card.action === 'enquiry' ? (
              <button key={`card-${i}`} type="button" className="card rv-card" data-enq="">
                {inner}
              </button>
            ) : (
              <Link key={`card-${i}`} className="card rv-card" href={card.href || '#catering'}>
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ contactCta */

export function ContactCta({ content }: { content: Record<string, unknown> }) {
  const actions = list(content, 'actions');
  const locations = list(content, 'locations');

  return (
    <section className="sec" id="contact" aria-labelledby="contact-t">
      <div className="wrap">
        <div className="ct-g">
          <div className="ct-i">
            <span className="sh-n rv">{text(content, 'eyebrow')}</span>
            <h2 className="sh-t rv rv2" id="contact-t">
              {text(content, 'heading')}
            </h2>
            <p className="sh-p rv">{text(content, 'body')}</p>
            <div className="rv" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {actions.map((action, i) => (
                <ActionButton
                  key={`${action.label}-${i}`}
                  action={action}
                  className={`btn ${i === 0 ? 'b-fill' : 'b-line'} b-sm`}
                />
              ))}
            </div>
          </div>

          {locations.map((loc, i) => (
            <div className="loc rv" key={`${loc.name}-${i}`}>
              <p className="ct-sub">{loc.label}</p>
              <h3 className="loc-n">{loc.name}</h3>
              <div className="spec">
                <Spec label="Address" value={loc.address} />
                <Spec label="Hours" value={loc.hours} />
                <Spec label="Phone" value={loc.phone} />
                <Spec label="Email" value={loc.email} />
              </div>
              <div className="loc-a">
                <button type="button" className="arrow" data-act="reserve" data-loc={loc.name}>
                  {loc.linkLabel || 'Reserve here'}
                  {ARROW}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** One Address / Hours / Phone / Email row. */
function Spec({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  // Square brackets mark copy the client has not supplied yet; the design
  // highlights those so they are obvious on the page.
  const placeholder = value.startsWith('[') && value.endsWith(']');
  return (
    <p className="sp">
      <span className="sp-k">{label}</span>
      <span className="sp-v">{placeholder ? <span className="ph">{value}</span> : value}</span>
    </p>
  );
}

/* -------------------------------------------------------------- renderer */

export function SectionRenderer({ section }: { section: PageSection }) {
  switch (section.kind) {
    case 'hero':
      return <Hero content={section.content} />;
    case 'menuShowcase':
      return <MenuShowcase content={section.content} />;
    case 'weekendThali':
      return <WeekendThali content={section.content} />;
    case 'diningLounge':
      return <DiningLounge content={section.content} />;
    case 'ourStory':
      return <OurStory content={section.content} />;
    case 'cateringEvents':
      return <CateringEvents content={section.content} />;
    case 'contactCta':
      return <ContactCta content={section.content} />;
    // The header and footer are drawn by the layout, not in the page flow.
    case 'header':
    case 'footer':
      return null;
    default:
      return null;
  }
}
