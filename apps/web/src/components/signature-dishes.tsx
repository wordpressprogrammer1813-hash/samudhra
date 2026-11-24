import { Reveal } from '@/components/scroll-reveal';
import type { DishCard } from '@/lib/pages';

function DishImage({
  card,
  starImage,
  index,
}: {
  card: DishCard;
  starImage: string;
  index: number;
}) {
  const hasStar = Boolean(starImage) && (starImage.startsWith('http') || starImage.startsWith('/'));
  const hasPhoto =
    Boolean(card.image) && (card.image.startsWith('http') || card.image.startsWith('/'));
  // Odd dishes (1st, 3rd, …) spin clockwise; even dishes (2nd, 4th, …) spin
  // counter-clockwise, so neighbouring frames turn opposite ways.
  const reverse = index % 2 === 1;

  return (
    <div className="relative aspect-square w-[min(100%,400px)]">
      {hasStar ? (
        <div
          aria-hidden
          className={`absolute inset-0 motion-reduce:animate-none ${
            reverse ? 'animate-frame-ccw' : 'animate-frame-cw'
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary storage URL, not a next/image case yet */}
          <img src={starImage} alt="" className="h-full w-full object-contain" />
        </div>
      ) : null}

      <div className="absolute inset-[16.5%] overflow-hidden rounded-full bg-heath/5 shadow-[0_0_0_7px_#fff,0_30px_50px_-18px_rgba(77,15,16,0.55)] transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
        {hasPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary storage URL, not a next/image case yet
          <img src={card.image} alt={card.title} className="h-full w-full object-cover" />
        ) : null}
      </div>
    </div>
  );
}

export function SignatureDishes({
  eyebrow,
  heading,
  body,
  starImage,
  ctaLabel,
  ctaHref,
  cards,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  starImage: string;
  ctaLabel: string;
  ctaHref: string;
  cards: DishCard[];
}) {
  return (
    <section
      id="menu"
      className="relative overflow-hidden bg-serenade py-[clamp(96px,10vw,150px)] text-heath"
    >
      <Reveal>
        <div className="mb-[clamp(56px,6vw,88px)] flex flex-col items-center gap-[18px] px-5 text-center">
          {eyebrow ? (
            <p className="flex items-center gap-4 text-[11px] font-semibold tracking-[0.32em] text-zest uppercase">
              <span className="h-px w-10 bg-zest" />
              {eyebrow}
              <span className="h-px w-10 bg-zest" />
            </p>
          ) : null}
          {heading ? (
            <h2 className="text-[clamp(36px,5vw,76px)] leading-none font-normal tracking-[-0.01em]">
              {heading}
            </h2>
          ) : null}
          {body ? (
            <p className="max-w-[520px] text-[16px] leading-[1.75] text-heath/78">{body}</p>
          ) : null}
        </div>
      </Reveal>

      <div className="mx-auto grid max-w-[1320px] gap-[clamp(32px,3vw,48px)] px-[clamp(20px,4vw,56px)] [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
        {cards.map((card, index) => (
          <Reveal key={index} delay={index * 120}>
            <a
              href={card.href || '#menu'}
              className="group flex flex-col items-center gap-5 text-center text-heath no-underline"
            >
              <DishImage card={card} starImage={starImage} index={index} />
              {card.numeral ? (
                <span className="text-[15px] text-zest italic">{card.numeral}</span>
              ) : null}
              {card.title ? (
                <h3 className="text-[clamp(28px,2.4vw,36px)] leading-[1.1] font-normal">
                  {card.title}
                </h3>
              ) : null}
              {card.description ? (
                <p className="max-w-[280px] text-[14px] leading-[1.6] text-heath/78">
                  {card.description}
                </p>
              ) : null}
              <span className="inline-flex items-center gap-3 border-b border-zest pb-1.5 text-[11px] font-semibold tracking-[0.24em] uppercase">
                {card.linkLabel || 'View menu'}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  className="size-[18px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
                >
                  <path d="M4 12h16M14 6l6 6-6 6" />
                </svg>
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      {ctaLabel ? (
        <Reveal delay={200}>
          <div className="mt-[clamp(56px,6vw,80px)] flex justify-center">
            <a
              href={ctaHref || '#contact'}
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-heath bg-heath px-8 text-[12px] font-medium tracking-[0.2em] text-serenade uppercase transition-colors duration-300 hover:bg-zest hover:text-heath"
            >
              {ctaLabel}
            </a>
          </div>
        </Reveal>
      ) : null}
    </section>
  );
}
