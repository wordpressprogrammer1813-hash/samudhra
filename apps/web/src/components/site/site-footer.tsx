/* eslint-disable @next/next/no-img-element -- CMS images come from arbitrary hosts */
import Link from 'next/link';
import { parseLinkLines } from '@samudra/shared';
import { list, text } from '@/lib/content';

/** Footer: wordmark, link columns and the legal strip. */
export function SiteFooter({ content }: { content: Record<string, unknown> }) {
  const columns = list(content, 'columns');
  const logo = text(content, 'logo', '/images/samudhra.png');
  const mark = text(content, 'markImage');

  return (
    <footer className="sf">
      <div className="sf-in">
        <div className="sf-g">
          <div className="sf-b">
            <img src={logo} alt="Samudhra" width={1400} height={230} loading="lazy" />
            <p className="sf-tag">{text(content, 'tagline')}</p>
          </div>

          {columns.map((column, i) => (
            <div key={`${column.heading}-${i}`}>
              <p className="sf-h">{column.heading}</p>
              <div className="sf-l">
                {parseLinkLines(column.links).map((link) => (
                  <Link key={`${link.label}-${link.href}`} href={link.href || '#'}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sf-bot">
          <p className="sf-c">
            <a href="#top">Back to top</a>
            <span>{text(content, 'legal')}</span>
            <span>{text(content, 'note')}</span>
          </p>
          {mark ? (
            <a href="#top" aria-label="Samudhra, home">
              <img className="sf-mk" src={mark} alt="" width={351} height={392} loading="lazy" />
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
