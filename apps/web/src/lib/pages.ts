import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabasePublic } from '@/lib/supabase-public';

export interface PageSummary {
  id: string;
  slug: string;
  title: string;
  isPublished: boolean;
  sectionCount: number;
}

export interface PageSection {
  id: string;
  pageId: string;
  key: string;
  kind: string;
  label: string;
  position: number;
  isVisible: boolean;
  content: Record<string, unknown>;
}

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroContent {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  backgroundImage: string;
  actions: HeroAction[];
}

export function toHeroContent(content: Record<string, unknown>): HeroContent {
  const actionsRaw = Array.isArray(content.actions) ? content.actions : [];
  const actions: HeroAction[] = actionsRaw.slice(0, 3).map((a) => {
    const action = a as Record<string, unknown>;
    return { label: String(action.label ?? ''), href: String(action.href ?? '') };
  });
  while (actions.length < 3) actions.push({ label: '', href: '' });

  return {
    eyebrow: String(content.eyebrow ?? ''),
    titleLine1: String(content.titleLine1 ?? ''),
    titleLine2: String(content.titleLine2 ?? ''),
    subtitle: String(content.subtitle ?? ''),
    backgroundImage: String(content.backgroundImage ?? ''),
    actions,
  };
}

export interface DishCard {
  numeral: string;
  title: string;
  description: string;
  image: string;
  href: string;
  linkLabel: string;
}

export interface MenuShowcaseContent {
  eyebrow: string;
  heading: string;
  body: string;
  starImage: string;
  ctaLabel: string;
  ctaHref: string;
  cards: DishCard[];
}

export function toMenuShowcaseContent(content: Record<string, unknown>): MenuShowcaseContent {
  const cardsRaw = Array.isArray(content.cards) ? content.cards : [];
  const cards: DishCard[] = cardsRaw.map((c) => {
    const card = c as Record<string, unknown>;
    return {
      numeral: String(card.numeral ?? ''),
      title: String(card.title ?? ''),
      description: String(card.description ?? ''),
      image: String(card.image ?? ''),
      href: String(card.href ?? ''),
      linkLabel: String(card.linkLabel ?? 'View menu'),
    };
  });

  return {
    eyebrow: String(content.eyebrow ?? ''),
    heading: String(content.heading ?? ''),
    body: String(content.body ?? ''),
    starImage: String(content.starImage ?? ''),
    ctaLabel: String(content.ctaLabel ?? ''),
    ctaHref: String(content.ctaHref ?? ''),
    cards,
  };
}

export interface WeekendThaliContent {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  reserveLabel: string;
  reserveHref: string;
  menuLabel: string;
  menuHref: string;
  plateImage: string;
  figureImages: { fig1: string; fig2: string; fig3: string; fig4: string };
}

export function toWeekendThaliContent(content: Record<string, unknown>): WeekendThaliContent {
  const actions = Array.isArray(content.actions) ? (content.actions as Record<string, unknown>[]) : [];
  const frames = Array.isArray(content.frames) ? (content.frames as Record<string, unknown>[]) : [];
  const fig = (content.figureImages ?? {}) as Record<string, unknown>;

  return {
    eyebrow: String(content.eyebrow ?? ''),
    titleLine1: String(content.titleLine1 ?? ''),
    titleLine2: String(content.titleLine2 ?? ''),
    description: String(content.description ?? content.body ?? ''),
    reserveLabel: String(content.reserveLabel ?? actions[0]?.label ?? ''),
    reserveHref: String(content.reserveHref ?? actions[0]?.href ?? ''),
    menuLabel: String(content.menuLabel ?? actions[1]?.label ?? ''),
    menuHref: String(content.menuHref ?? actions[1]?.href ?? ''),
    plateImage: String(content.plateImage ?? ''),
    figureImages: {
      fig1: String(fig.fig1 ?? frames[0]?.image ?? ''),
      fig2: String(fig.fig2 ?? frames[1]?.image ?? ''),
      fig3: String(fig.fig3 ?? frames[2]?.image ?? ''),
      fig4: String(fig.fig4 ?? frames[3]?.image ?? ''),
    },
  };
}

export interface DiningRowContent {
  image: string;
  description: string;
  title: string;
  href: string;
}

export interface DiningLoungeContent {
  eyebrow: string;
  heading: string;
  intro: string;
  rows: DiningRowContent[];
}

export function toDiningLoungeContent(content: Record<string, unknown>): DiningLoungeContent {
  const rowsRaw = Array.isArray(content.rows) ? (content.rows as Record<string, unknown>[]) : [];
  const rows: DiningRowContent[] = rowsRaw.map((r) => ({
    image: String(r.image ?? ''),
    description: String(r.description ?? ''),
    title: String(r.title ?? ''),
    href: String(r.href ?? ''),
  }));
  while (rows.length < 3) rows.push({ image: '', description: '', title: '', href: '' });

  return {
    eyebrow: String(content.eyebrow ?? ''),
    heading: String(content.heading ?? ''),
    intro: String(content.intro ?? content.body ?? ''),
    rows,
  };
}

export interface OurStoryContent {
  kicker: string;
  heading: string;
  quote: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
}

export function toOurStoryContent(content: Record<string, unknown>): OurStoryContent {
  return {
    kicker: String(content.kicker ?? content.eyebrow ?? ''),
    heading: String(content.heading ?? ''),
    quote: String(content.quote ?? ''),
    body: String(content.body ?? ''),
    ctaLabel: String(content.ctaLabel ?? ''),
    ctaHref: String(content.ctaHref ?? ''),
    image: String(content.image ?? content.markImage ?? ''),
  };
}

export interface CateringCardContent {
  image: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
}

export interface CateringEventsContent {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  headingLine3: string;
  description: string;
  card1: CateringCardContent;
  card2: CateringCardContent;
}

function toCateringCard(
  card: Record<string, unknown> | undefined,
  fallback: Record<string, unknown> | undefined,
): CateringCardContent {
  const c = card ?? {};
  const f = fallback ?? {};
  return {
    image: String(c.image ?? f.image ?? ''),
    titleLine1: String(c.titleLine1 ?? f.titleLine1 ?? ''),
    titleLine2: String(c.titleLine2 ?? f.titleLine2 ?? ''),
    subtitle: String(c.subtitle ?? f.note ?? ''),
    ctaLabel: String(c.ctaLabel ?? f.linkLabel ?? ''),
    href: String(c.href ?? f.href ?? ''),
  };
}

export function toCateringEventsContent(content: Record<string, unknown>): CateringEventsContent {
  const cardsRaw = Array.isArray(content.cards) ? (content.cards as Record<string, unknown>[]) : [];

  return {
    eyebrow: String(content.eyebrow ?? ''),
    headingLine1: String(content.headingLine1 ?? 'Bring the'),
    headingLine2: String(content.headingLine2 ?? 'Table to'),
    headingLine3: String(content.headingLine3 ?? 'You'),
    description: String(content.description ?? content.body ?? ''),
    card1: toCateringCard(content.card1 as Record<string, unknown>, cardsRaw[0]),
    card2: toCateringCard(content.card2 as Record<string, unknown>, cardsRaw[1]),
  };
}

export interface ContactLocationContent {
  numberLabel: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  email: string;
  reserveHref: string;
}

export interface ContactContent {
  eyebrow: string;
  heading: string;
  intro: string;
  reserveCtaLabel: string;
  reserveCtaHref: string;
  orderCtaLabel: string;
  orderCtaHref: string;
  locations: ContactLocationContent[];
}

export function toContactContent(content: Record<string, unknown>): ContactContent {
  const actions = Array.isArray(content.actions) ? (content.actions as Record<string, unknown>[]) : [];
  const locationsRaw = Array.isArray(content.locations)
    ? (content.locations as Record<string, unknown>[])
    : [];
  const locations: ContactLocationContent[] = locationsRaw.map((l) => ({
    numberLabel: String(l.numberLabel ?? l.label ?? ''),
    name: String(l.name ?? ''),
    address: String(l.address ?? ''),
    hours: String(l.hours ?? ''),
    phone: String(l.phone ?? ''),
    email: String(l.email ?? ''),
    reserveHref: String(l.reserveHref ?? '#contact'),
  }));
  while (locations.length < 2) {
    locations.push({
      numberLabel: '',
      name: '',
      address: '',
      hours: '',
      phone: '',
      email: '',
      reserveHref: '#contact',
    });
  }

  return {
    eyebrow: String(content.eyebrow ?? ''),
    heading: String(content.heading ?? ''),
    intro: String(content.intro ?? content.body ?? ''),
    reserveCtaLabel: String(content.reserveCtaLabel ?? actions[0]?.label ?? ''),
    reserveCtaHref: String(content.reserveCtaHref ?? actions[0]?.href ?? ''),
    orderCtaLabel: String(content.orderCtaLabel ?? actions[1]?.label ?? ''),
    orderCtaHref: String(content.orderCtaHref ?? actions[1]?.href ?? ''),
    locations,
  };
}

export async function listPages(): Promise<PageSummary[]> {
  const db = supabaseAdmin();

  const [{ data: pages, error: pagesError }, { data: sections, error: sectionsError }] =
    await Promise.all([
      db.from('pages').select('id, slug, title, is_published').order('position'),
      db.from('page_sections').select('page_id'),
    ]);

  if (pagesError) throw pagesError;
  if (sectionsError) throw sectionsError;

  const counts = new Map<string, number>();
  for (const row of sections ?? []) {
    counts.set(row.page_id, (counts.get(row.page_id) ?? 0) + 1);
  }

  return (pages ?? []).map((page) => ({
    id: page.id,
    slug: page.slug,
    title: page.title,
    isPublished: page.is_published,
    sectionCount: counts.get(page.id) ?? 0,
  }));
}

export async function getPageWithSections(
  id: string,
): Promise<{ id: string; slug: string; title: string; sections: PageSection[] } | null> {
  const db = supabaseAdmin();

  const { data: page, error: pageError } = await db
    .from('pages')
    .select('id, slug, title')
    .eq('id', id)
    .maybeSingle();
  if (pageError) throw pageError;
  if (!page) return null;

  const { data: rows, error: sectionsError } = await db
    .from('page_sections')
    .select('id, page_id, key, kind, label, position, is_visible, content')
    .eq('page_id', id)
    .order('position');
  if (sectionsError) throw sectionsError;

  return {
    ...page,
    sections: (rows ?? []).map((row) => ({
      id: row.id,
      pageId: row.page_id,
      key: row.key,
      kind: row.kind,
      label: row.label,
      position: row.position,
      isVisible: row.is_visible,
      content: row.content as Record<string, unknown>,
    })),
  };
}

/** Public (anon client) read of one section's content by page slug + section key. */
export async function getPublicSectionContent(
  pageSlug: string,
  sectionKey: string,
): Promise<Record<string, unknown> | null> {
  const db = supabasePublic();

  const { data: page, error: pageError } = await db
    .from('pages')
    .select('id')
    .eq('slug', pageSlug)
    .eq('is_published', true)
    .maybeSingle();
  if (pageError || !page) {
    if (pageError) console.error(`[pages] failed to read page "${pageSlug}":`, pageError);
    return null;
  }

  const { data: section, error: sectionError } = await db
    .from('page_sections')
    .select('content')
    .eq('page_id', page.id)
    .eq('key', sectionKey)
    .eq('is_visible', true)
    .maybeSingle();
  if (sectionError) {
    console.error(`[pages] failed to read section "${sectionKey}":`, sectionError);
    return null;
  }

  return (section?.content as Record<string, unknown>) ?? null;
}
