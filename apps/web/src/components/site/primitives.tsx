import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Shared pieces of the Samudhra visual language, so every section stays
 * consistent and a design tweak happens in one place.
 */

/* -------------------------------------------------------------- wordmark */

/**
 * Placeholder wordmark. The real one is a retro display face in an
 * orange-to-maroon gradient and should be dropped in as an SVG; until then
 * this reproduces the colour treatment with the body face.
 */
export function Wordmark({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <span
      className={cn(
        'bg-clip-text font-extrabold lowercase tracking-tight text-transparent',
        onDark
          ? 'bg-[linear-gradient(95deg,var(--color-zest)_0%,var(--color-serenade)_90%)]'
          : 'bg-[linear-gradient(95deg,var(--color-zest)_0%,var(--color-heath)_60%,var(--color-creole)_100%)]',
        className,
      )}
    >
      samudhra
    </span>
  );
}

/* --------------------------------------------------------------- eyebrow */

/** Small uppercase label, optionally flanked by hairlines as in the design. */
export function Eyebrow({
  children,
  rules = false,
  onDark = false,
  className,
}: {
  children: ReactNode;
  rules?: boolean;
  onDark?: boolean;
  className?: string;
}) {
  if (!children) return null;

  const label = (
    <span className={cn('u-eyebrow', onDark ? 'text-serenade-78' : 'text-zest', className)}>
      {children}
    </span>
  );

  if (!rules) return label;

  return (
    <span className="flex items-center justify-center gap-4">
      <Rule onDark={onDark} />
      {label}
      <Rule onDark={onDark} />
    </span>
  );
}

function Rule({ onDark }: { onDark?: boolean }) {
  return <span aria-hidden className={cn('h-px w-10', onDark ? 'bg-serenade-22' : 'bg-zest-20')} />;
}

/** The small amber diamond used as a text ornament. */
export function Diamond({ className }: { className?: string }) {
  return <span aria-hidden className={cn('inline-block size-1.5 rotate-45 bg-zest', className)} />;
}

/* --------------------------------------------------------------- buttons */

type PillVariant = 'solid' | 'outline' | 'outlineOnDark';

const pillVariants: Record<PillVariant, string> = {
  solid: 'bg-heath text-serenade hover:bg-creole',
  outline:
    'border border-heath-35 text-heath hover:border-heath hover:bg-heath hover:text-serenade',
  outlineOnDark:
    'border border-serenade-22 text-serenade hover:border-serenade hover:bg-serenade hover:text-creole',
};

/** The pill button used across the site. Renders as a link. */
export function PillLink({
  href,
  children,
  variant = 'outline',
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: PillVariant;
  className?: string;
}) {
  return (
    <Link
      href={href || '#'}
      className={cn(
        'u-eyebrow inline-flex h-11 items-center justify-center rounded-pill px-6 transition-colors duration-200',
        pillVariants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** Underlined "VIEW MENU →" style link. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href || '#'}
      className={cn(
        'u-eyebrow group inline-flex items-center gap-2 border-b border-heath-25 pb-1.5 text-heath transition-colors hover:border-heath',
        className,
      )}
    >
      {children}
      <svg
        aria-hidden
        viewBox="0 0 20 10"
        className="h-2.5 w-5 transition-transform duration-200 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M0 5h18M14 1l4 4-4 4" />
      </svg>
    </Link>
  );
}

/* -------------------------------------------------------------- backdrop */

/**
 * The faint diamond lattice that sits behind several sections. Drawn as an
 * inline SVG pattern so it scales and costs no network request.
 */
export function Lattice({ className, opacity = 0.5 }: { className?: string; opacity?: number }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><g fill="none" stroke="%23DB851D" stroke-width="0.7"><path d="M28 2 54 28 28 54 2 28z"/><path d="M28 14 42 28 28 42 14 28z"/></g></svg>`;

  return (
    <span
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,${svg}")`,
        backgroundSize: '56px 56px',
      }}
    />
  );
}

/* --------------------------------------------------------------- layout */

/** Page container at the design's 1320px width. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto w-full max-w-[82.5rem] px-5 sm:px-8', className)}>{children}</div>
  );
}

/** Splits a textarea value into paragraphs on blank lines. */
export function Prose({ text, className }: { text: string | undefined; className?: string }) {
  if (!text) return null;
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p key={i} className={cn('text-body', i > 0 && 'mt-4', className)}>
          {paragraph}
        </p>
      ))}
    </>
  );
}
