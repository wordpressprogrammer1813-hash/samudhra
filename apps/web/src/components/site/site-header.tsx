/* eslint-disable @next/next/no-img-element -- CMS images come from arbitrary hosts */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { parseLines, parseLinkLines } from '@samudra/shared';
import { list, text } from '@/lib/content';

/**
 * A button or a link, depending on what the client chose in the panel.
 * `data-act` / `data-enq` are the hooks <SiteBehaviour /> listens for, which
 * lets every section stay a plain server component.
 */
export function ActionButton({
  action,
  className,
  children,
}: {
  action: Record<string, string>;
  className: string;
  children?: ReactNode;
}) {
  const label = children ?? action.label;
  const kind = action.action || 'link';

  if (kind === 'reserve' || kind === 'order') {
    return (
      <button type="button" className={className} data-act={kind}>
        {label}
      </button>
    );
  }
  if (kind === 'enquiry') {
    return (
      <button type="button" className={className} data-enq="">
        {label}
      </button>
    );
  }
  return (
    <Link className={className} href={action.href || '#'}>
      {label}
    </Link>
  );
}

/**
 * Header and the slide-in menu panel, as plain markup matching the approved
 * homepage. Opening and closing is handled by <SiteBehaviour />, which toggles
 * the `on` class on #ov exactly as the original script did.
 */
export function SiteHeader({ content }: { content: Record<string, unknown> }) {
  const logo = text(content, 'logo', '/images/samudhra.png');
  const actions = list(content, 'actions');
  const groups = list(content, 'navGroups');
  const addressLines = parseLines(content.panelAddress);

  return (
    <>
      <header className="nav">
        <div className="nav-in">
          <button
            type="button"
            className="burger"
            aria-expanded="false"
            aria-controls="ov"
            id="openMenu"
          >
            <span className="bi" aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="burger-t">{text(content, 'menuLabel', 'Menu')}</span>
            <span className="sr">Open site menu</span>
          </button>

          <Link className="logo" href="/" aria-label="Samudhra, home">
            <img src={logo} alt="Samudhra" width={1400} height={230} />
          </Link>

          <div className="nav-r">
            {actions.map((action) => (
              <ActionButton
                key={`${action.label}-${action.action}`}
                action={action}
                className={`ob${action.style === 'solid' ? ' ob-f' : ''}`}
              />
            ))}
          </div>
        </div>
      </header>

      <div
        className="ov"
        id="ov"
        aria-hidden="true"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <button
          type="button"
          className="sn-scrim"
          tabIndex={-1}
          aria-label="Close menu"
          data-mclose=""
        />

        <div className="sn-panel">
          <div className="sn-head">
            <Link href="/" data-mclose="">
              <img className="sn-logo" src={logo} alt="Samudhra" width={1400} height={230} />
            </Link>
            <button type="button" className="ov-x" aria-label="Close menu" data-mclose="">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                aria-hidden="true"
              >
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>

          <nav className="sn-nav" aria-label="Site">
            {groups.flatMap((group, i) => [
              <p className="sn-g" key={`h-${i}`}>
                {group.heading}
              </p>,
              ...parseLinkLines(group.links).map((link) => (
                <Link
                  key={`l-${i}-${link.label}`}
                  className="sn-s"
                  href={link.href || '#'}
                  data-mclose=""
                >
                  {link.label}
                </Link>
              )),
            ])}
          </nav>

          <div className="sn-cta">
            {actions.map((action) => (
              <ActionButton key={`panel-${action.label}`} action={action} className="sn-l" />
            ))}
          </div>

          {addressLines.length > 0 ? (
            <p className="sn-addr">
              {addressLines.map((line, i) => (
                <span key={line}>
                  {i > 0 ? <br /> : null}
                  <span className="ph">{line}</span>
                </span>
              ))}
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
}
