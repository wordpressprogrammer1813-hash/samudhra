import Link from 'next/link';
import { parseLinkLines } from '@samudra/shared';
import { Container, Wordmark } from './primitives';
import { list, text } from '@/lib/content';

/** The footer: wordmark, tagline, link columns and the legal strip. */
export function SiteFooter({ content }: { content: Record<string, unknown> }) {
  const columns = list(content, 'columns');
  const tagline = text(content, 'tagline');
  const legal = text(content, 'legal');
  const note = text(content, 'note');

  return (
    <footer className="border-t border-heath-14 bg-serenade">
      <Container className="py-16">
        <div className="grid gap-10 lg:grid-cols-[18rem_1fr]">
          <div>
            <Wordmark className="text-3xl" />
            {tagline ? (
              <p className="mt-4 max-w-[18rem] text-link text-heath-75">{tagline}</p>
            ) : null}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {columns.map((column, i) => {
              const links = parseLinkLines(column.links);
              return (
                <div key={`${column.heading}-${i}`}>
                  <h2 className="u-eyebrow text-zest">{column.heading}</h2>
                  <ul className="mt-4 space-y-2.5">
                    {links.map((link) => (
                      <li key={`${link.label}-${link.href}`}>
                        <Link
                          href={link.href || '#'}
                          className="text-link text-heath transition-colors hover:text-zest"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-heath-14 pt-6">
          <a href="#top" className="u-eyebrow text-heath underline underline-offset-4">
            Back to top
          </a>
          {legal ? <span className="u-eyebrow text-heath-75">{legal}</span> : null}
          {note ? <span className="u-eyebrow text-heath-35">{note}</span> : null}

          <span
            aria-hidden
            className="ml-auto bg-[linear-gradient(95deg,var(--color-zest),var(--color-creole))] bg-clip-text text-3xl font-extrabold text-transparent"
          >
            S
          </span>
        </div>
      </Container>
    </footer>
  );
}
