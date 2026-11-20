import Link from 'next/link';
import type { PageSection } from '@samudra/shared';
import { ArrowLink, Container, Diamond, Eyebrow, Lattice, PillLink, Prose } from './primitives';
import { list, text } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * One component per section `kind`. Each reads its fields out of the JSON the
 * client edits in the admin panel, and every field is optional — a half-filled
 * section still renders rather than crashing the page.
 */

/* ------------------------------------------------------------- utilities */

/**
 * Content images come from the CMS as arbitrary URLs, so they go through a
 * plain <img> rather than next/image, which would need every host allow-listed.
 */
function Photo({
  src,
  alt,
  className,
  rounded = 'rounded-soft',
}: {
  src?: string;
  alt: string;
  className?: string;
  rounded?: string;
}) {
  if (!src) {
    return (
      <div
        aria-hidden
        className={cn(
          'relative grid place-items-center overflow-hidden bg-heath-14',
          rounded,
          className,
        )}
      >
        <Lattice opacity={0.25} />
        <span className="u-eyebrow relative text-heath-35">Photo</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- CMS images, arbitrary hosts
    <img src={src} alt={alt} loading="lazy" className={cn('object-cover', rounded, className)} />
  );
}

/** The amber petal ring that frames the round dish photos. */
function MandalaFrame({ children }: { children: React.ReactNode }) {
  const petals = Array.from({ length: 16 }, (_, i) => i * (360 / 16));

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[20rem]">
      <svg
        aria-hidden
        viewBox="0 0 120 120"
        className="absolute inset-0 size-full text-zest"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
      >
        {petals.map((angle) => (
          <path
            key={angle}
            d="M60 22 C51 16, 51 6, 60 2 C69 6, 69 16, 60 22 Z"
            transform={`rotate(${angle} 60 60)`}
          />
        ))}
      </svg>
      <div className="absolute inset-[14%] overflow-hidden rounded-full border-4 border-heath">
        {children}
      </div>
    </div>
  );
}

/** Circular arrow button used at the end of the dining rows. */
function ArrowCircle() {
  return (
    <span
      aria-hidden
      className="grid size-11 shrink-0 place-items-center rounded-full border border-heath-25 text-heath transition-colors group-hover:border-heath group-hover:bg-heath group-hover:text-serenade"
    >
      <svg
        viewBox="0 0 20 10"
        className="h-2.5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M0 5h18M14 1l4 4-4 4" />
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------------ hero */

export function Hero({ content }: { content: Record<string, unknown> }) {
  const image = text(content, 'backgroundImage');
  const actions = list(content, 'actions');

  return (
    <section className="relative isolate flex min-h-[clamp(34rem,78vh,52rem)] items-center overflow-hidden bg-creole">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- CMS image, arbitrary host
        <img src={image} alt="" className="absolute inset-0 -z-20 size-full object-cover" />
      ) : null}

      {/* Warm overlay so the type always holds up over any photograph. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,var(--color-creole-55)_0%,var(--color-creole-82)_60%,var(--color-creole)_100%)]"
      />
      <Lattice className="-z-10" opacity={0.08} />

      {/* Inset hairline frame with the diamond markers from the design. */}
      <div aria-hidden className="absolute inset-5 border border-serenade-22 sm:inset-8" />
      <Diamond className="absolute left-1/2 top-4 -translate-x-1/2 sm:top-7" />
      <Diamond className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:bottom-7" />

      <Container className="relative py-24 text-center">
        <Eyebrow rules onDark>
          {text(content, 'eyebrow')}
        </Eyebrow>

        <h1 className="mt-8 text-[clamp(3rem,9vw,6.625rem)] font-normal leading-[0.95] tracking-tight text-serenade">
          {text(content, 'titleLine1')}
          {text(content, 'titleLine2') ? (
            <span className="block pl-[0.12em] text-zest">{text(content, 'titleLine2')}</span>
          ) : null}
        </h1>

        {text(content, 'subtitle') ? (
          <p className="mt-8 flex items-center justify-center gap-4 text-link text-serenade-78">
            <Diamond />
            {text(content, 'subtitle')}
            <Diamond />
          </p>
        ) : null}

        {actions.length > 0 ? (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {actions.map((action) => (
              <PillLink
                key={`${action.label}-${action.href}`}
                href={action.href}
                variant="outlineOnDark"
              >
                {action.label}
              </PillLink>
            ))}
          </div>
        ) : null}
      </Container>

      <svg
        aria-hidden
        viewBox="0 0 24 12"
        className="absolute bottom-12 left-1/2 h-3 w-6 -translate-x-1/2 text-serenade-75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M1 1l11 10L23 1" />
      </svg>
    </section>
  );
}

/* ---------------------------------------------------------- menuShowcase */

export function MenuShowcase({ content }: { content: Record<string, unknown> }) {
  const cards = list(content, 'cards');
  const ctaLabel = text(content, 'ctaLabel');

  return (
    <section className="relative overflow-hidden bg-serenade py-24 sm:py-32">
      <Lattice opacity={0.14} />

      <Container className="relative text-center">
        <Eyebrow rules>{text(content, 'eyebrow')}</Eyebrow>

        <h2 className="mx-auto mt-6 max-w-4xl text-[clamp(2.25rem,5vw,4rem)] font-normal leading-tight tracking-tight text-heath">
          {text(content, 'heading')}
        </h2>

        <div className="mx-auto mt-6 max-w-xl text-heath-75">
          <Prose text={text(content, 'body')} />
        </div>

        {cards.length > 0 ? (
          <div className="mt-20 grid gap-14 md:grid-cols-3">
            {cards.map((card) => (
              <div key={card.title} className="flex flex-col items-center">
                <MandalaFrame>
                  <Photo
                    src={card.image}
                    alt={card.title ?? ''}
                    rounded="rounded-full"
                    className="size-full"
                  />
                </MandalaFrame>

                <h3 className="mt-8 text-h3 text-heath">{card.title}</h3>
                {card.description ? (
                  <p className="mt-3 text-small normal-case tracking-normal text-heath-75">
                    {card.description}
                  </p>
                ) : null}
                {card.linkLabel ? (
                  <ArrowLink href={card.href ?? '#'} className="mt-5">
                    {card.linkLabel}
                  </ArrowLink>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {ctaLabel ? (
          <div className="mt-20">
            <PillLink href={text(content, 'ctaHref')} variant="solid">
              {ctaLabel}
            </PillLink>
          </div>
        ) : null}
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------- weekendThali */

export function WeekendThali({ content }: { content: Record<string, unknown> }) {
  const actions = list(content, 'actions');

  return (
    <section className="relative overflow-hidden bg-zest py-20 sm:py-28">
      <Container className="relative">
        <div className="relative z-10 max-w-xl">
          <span className="u-eyebrow text-heath">{text(content, 'eyebrow')}</span>
          <h2 className="mt-4 text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-tight text-heath">
            {text(content, 'heading')}
          </h2>
        </div>

        <div className="relative mt-10 grid items-end gap-10 lg:mt-0 lg:grid-cols-[1fr_22rem]">
          <div className="relative mx-auto w-full max-w-[32rem] lg:-mt-8">
            <Photo
              src={text(content, 'image')}
              alt={text(content, 'heading')}
              rounded="rounded-full"
              className="aspect-square w-full border-4 border-serenade-22"
            />
          </div>

          <div className="text-left lg:pb-10 lg:text-right">
            <div className="text-small normal-case tracking-normal text-creole">
              <Prose text={text(content, 'body')} />
            </div>

            {actions.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-3 lg:justify-end">
                {actions.map((action, i) => (
                  <PillLink
                    key={`${action.label}-${action.href}`}
                    href={action.href}
                    variant={i === 0 ? 'solid' : 'outline'}
                  >
                    {action.label}
                  </PillLink>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------- diningLounge */

export function DiningLounge({ content }: { content: Record<string, unknown> }) {
  const cards = list(content, 'cards');

  return (
    <section className="relative overflow-hidden bg-serenade py-24 sm:py-28">
      <Lattice className="left-auto w-1/4" opacity={0.18} />

      <Container className="relative">
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <Eyebrow>{text(content, 'eyebrow')}</Eyebrow>
            <h2 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-normal leading-tight tracking-tight text-heath">
              {text(content, 'heading')}
            </h2>
          </div>
          <div className="text-small normal-case tracking-normal text-heath-75">
            <Prose text={text(content, 'body')} />
          </div>
        </div>

        <ul className="mt-12 border-t border-heath-14">
          {cards.map((card) => (
            <li key={card.title} className="border-b border-heath-14">
              <Link href={card.href || '#'} className="group flex items-center gap-5 py-5 sm:gap-8">
                <Photo
                  src={card.image}
                  alt={card.title ?? ''}
                  className="hidden h-20 w-32 shrink-0 sm:block"
                />
                <p className="hidden w-52 shrink-0 text-small normal-case tracking-normal text-heath-75 lg:block">
                  {card.description}
                </p>
                <h3 className="flex-1 text-[clamp(1.6rem,3.5vw,2.75rem)] font-normal leading-tight text-heath transition-colors group-hover:text-zest">
                  {card.title}
                </h3>
                <ArrowCircle />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------- ourStory */

export function OurStory({ content }: { content: Record<string, unknown> }) {
  const body = text(content, 'body');
  const [lead, ...rest] = body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const ctaLabel = text(content, 'ctaLabel');

  return (
    <section className="relative overflow-hidden bg-zest py-20 sm:py-24">
      <Container className="relative grid items-center gap-12 lg:grid-cols-2">
        <Photo
          src={text(content, 'image')}
          alt={text(content, 'heading')}
          className="aspect-4/5 w-full max-w-md"
        />

        <div>
          <Eyebrow rules={false} className="text-creole">
            {text(content, 'eyebrow')}
          </Eyebrow>

          <h2 className="mt-4 text-[clamp(2.25rem,5vw,4rem)] font-normal leading-tight tracking-tight text-heath">
            {text(content, 'heading')}
          </h2>

          {lead ? (
            <p className="mt-5 max-w-md text-[clamp(1.1rem,2vw,1.4rem)] leading-snug text-heath">
              {lead}
            </p>
          ) : null}

          <hr className="my-7 w-16 border-heath-35" />

          {rest.length > 0 ? (
            <div className="max-w-lg text-small normal-case tracking-normal text-creole">
              <Prose text={rest.join('\n\n')} />
            </div>
          ) : null}

          {ctaLabel ? (
            <div className="mt-8">
              <PillLink href={text(content, 'ctaHref')} variant="solid">
                {ctaLabel}
              </PillLink>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------- cateringEvents */

export function CateringEvents({ content }: { content: Record<string, unknown> }) {
  const cards = list(content, 'cards');

  return (
    <section className="relative overflow-hidden bg-heath py-20 sm:py-28">
      <Lattice opacity={0.07} />

      <Container className="relative grid items-center gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <Eyebrow>{text(content, 'eyebrow')}</Eyebrow>
          <h2 className="mt-4 text-[clamp(2.25rem,5vw,3.75rem)] font-normal leading-tight tracking-tight text-serenade">
            {text(content, 'heading')}
          </h2>
          <div className="mt-6 max-w-sm text-small normal-case tracking-normal text-serenade-75">
            <Prose text={text(content, 'body')} />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {cards.map((card, i) => (
            <article
              key={card.title}
              className={cn(
                'relative rounded-panel bg-serenade px-7 pb-7 pt-24',
                i % 2 === 1 && 'sm:mt-12',
              )}
            >
              <div className="absolute -top-14 left-1/2 size-32 -translate-x-1/2 overflow-hidden rounded-full border-4 border-heath">
                <Photo
                  src={card.image}
                  alt={card.title ?? ''}
                  rounded="rounded-full"
                  className="size-full"
                />
              </div>

              <h3 className="text-[clamp(1.5rem,3vw,2.25rem)] font-normal uppercase leading-tight text-heath">
                {card.title}
              </h3>
              {card.description ? (
                <p className="mt-2 text-small normal-case tracking-normal text-heath-75">
                  {card.description}
                </p>
              ) : null}
              {card.linkLabel ? (
                <ArrowLink href={card.href ?? '#'} className="mt-6 w-full justify-between">
                  {card.linkLabel}
                </ArrowLink>
              ) : null}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------ contactCta */

export function ContactCta({ content }: { content: Record<string, unknown> }) {
  const actions = list(content, 'actions');

  return (
    <section className="relative overflow-hidden bg-serenade py-20 sm:py-24">
      <Container className="relative max-w-[73rem] text-center">
        <Eyebrow rules>{text(content, 'eyebrow')}</Eyebrow>

        <h2 className="mt-5 text-[clamp(2rem,4.5vw,3.5rem)] font-normal leading-tight tracking-tight text-heath">
          {text(content, 'heading')}
        </h2>

        <div className="mx-auto mt-5 max-w-lg text-heath-75">
          <Prose text={text(content, 'body')} />
        </div>

        {actions.length > 0 ? (
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {actions.map((action, i) => (
              <PillLink
                key={`${action.label}-${action.href}`}
                href={action.href}
                variant={i === 0 ? 'solid' : 'outline'}
              >
                {action.label}
              </PillLink>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------- renderer */

/** Maps a section row from the database to the component that draws it. */
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
    // header and footer are drawn by the layout, not inside the page flow.
    case 'header':
    case 'footer':
      return null;
    default:
      return null;
  }
}
