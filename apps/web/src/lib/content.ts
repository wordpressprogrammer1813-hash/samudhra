import { isSectionKind, type PageSection, type PageWithSections } from '@samudra/shared';
import { createClient } from '@/lib/supabase/server';

type Row = Record<string, unknown>;

function toSection(row: Row): PageSection | null {
  if (!isSectionKind(row.kind)) return null;
  return {
    id: String(row.id),
    pageId: String(row.page_id),
    key: String(row.key),
    kind: row.kind,
    label: String(row.label),
    position: Number(row.position ?? 0),
    isVisible: Boolean(row.is_visible),
    content: (row.content as Record<string, unknown>) ?? {},
    updatedAt: String(row.updated_at),
  };
}

/**
 * Reads a page and its sections for the public site.
 *
 * This goes through the visitor's own Supabase session, so row level security
 * decides what comes back: anonymous visitors only ever see published pages,
 * while a signed-in super admin also sees drafts — which gives preview for
 * free, with no separate code path.
 */
export async function getPage(slug: string): Promise<PageWithSections | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('pages')
    .select('*, page_sections(*)')
    .eq('slug', slug)
    .maybeSingle();

  if (!data) return null;

  const sections = ((data.page_sections as Row[] | null) ?? [])
    .map(toSection)
    .filter((s): s is PageSection => s !== null && s.isVisible)
    .sort((a, b) => a.position - b.position);

  return {
    id: String(data.id),
    slug: String(data.slug),
    title: String(data.title),
    navLabel: (data.nav_label as string | null) ?? null,
    seoTitle: (data.seo_title as string | null) ?? null,
    seoDescription: (data.seo_description as string | null) ?? null,
    isPublished: Boolean(data.is_published),
    position: Number(data.position ?? 0),
    updatedAt: String(data.updated_at),
    sections,
  };
}

/** The header and footer, which live on the special "global" page. */
export async function getChrome(): Promise<{
  header: PageSection | null;
  footer: PageSection | null;
}> {
  const page = await getPage('global');
  return {
    header: page?.sections.find((s) => s.kind === 'header') ?? null,
    footer: page?.sections.find((s) => s.kind === 'footer') ?? null,
  };
}

/* ------------------------------------------------------------- accessors */

/** Reads a string field out of a section's JSON content. */
export function text(content: Record<string, unknown>, key: string, fallback = ''): string {
  const value = content[key];
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

/** Reads a repeater field as a list of plain objects. */
export function list(content: Record<string, unknown>, key: string): Record<string, string>[] {
  const value = content[key];
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is Record<string, string> => typeof item === 'object' && item !== null,
  );
}

/**
 * Location names for the reserve / order picker.
 *
 * They live on the home page's contact section, which is where they are shown
 * and edited; the picker reads them from there rather than duplicating the
 * list, so the client only maintains one copy.
 */
export async function getLocationNames(): Promise<string[]> {
  const page = await getPage('home');
  const contact = page?.sections.find((s) => s.kind === 'contactCta');
  if (!contact) return [];
  return list(contact.content, 'locations')
    .map((l) => l.name)
    .filter((name): name is string => Boolean(name));
}
