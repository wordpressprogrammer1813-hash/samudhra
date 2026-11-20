import { Router } from 'express';
import { z } from 'zod';
import {
  isSectionKind,
  parseSectionContent,
  updatePageSchema,
  updateSectionSchema,
  type Page,
  type PageSection,
  type PageWithSections,
} from '@samudra/shared';
import { authOf, requireAuth, requireSuperAdmin } from '../../middleware/auth.js';
import { HttpError, ok } from '../../lib/http.js';
import { supabaseAdmin } from '../../supabase.js';
import { recordAudit } from '../../lib/audit.js';

export const contentRouter = Router();

const slugParam = z.object({ slug: z.string().trim().min(1).max(60) });
const sectionParams = slugParam.extend({ key: z.string().trim().min(1).max(60) });

type Row = Record<string, unknown>;

function toPage(row: Row): Page {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    navLabel: (row.nav_label as string | null) ?? null,
    seoTitle: (row.seo_title as string | null) ?? null,
    seoDescription: (row.seo_description as string | null) ?? null,
    isPublished: Boolean(row.is_published),
    position: Number(row.position ?? 0),
    updatedAt: String(row.updated_at),
  };
}

function toSection(row: Row): PageSection {
  const kind = isSectionKind(row.kind) ? row.kind : 'hero';
  return {
    id: String(row.id),
    pageId: String(row.page_id),
    key: String(row.key),
    kind,
    label: String(row.label),
    position: Number(row.position ?? 0),
    isVisible: Boolean(row.is_visible),
    content: (row.content as Record<string, unknown>) ?? {},
    updatedAt: String(row.updated_at),
  };
}

// Everything here is the client's own panel: super admin only.
contentRouter.use(requireAuth, requireSuperAdmin);

/** Every page, for the admin list. */
contentRouter.get('/pages', async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from('pages')
    .select('*, page_sections(count)')
    .order('position');

  if (error) throw HttpError.internal(error.message);

  const pages = (data ?? []).map((row) => ({
    ...toPage(row),
    sectionCount: Number((row.page_sections as { count: number }[] | null)?.[0]?.count ?? 0),
  }));

  ok(res, { pages });
});

/** One page with its sections, in order. */
contentRouter.get('/pages/:slug', async (req, res) => {
  const { slug } = slugParam.parse(req.params);

  const { data, error } = await supabaseAdmin
    .from('pages')
    .select('*, page_sections(*)')
    .eq('slug', slug)
    .single();

  if (error || !data) throw HttpError.notFound(`No page "${slug}"`);

  const sections = ((data.page_sections as Row[] | null) ?? [])
    .map(toSection)
    .sort((a, b) => a.position - b.position);

  const page: PageWithSections = { ...toPage(data), sections };
  ok(res, { page });
});

/** Page-level settings: title, SEO, published. */
contentRouter.patch('/pages/:slug', async (req, res) => {
  const actor = authOf(req);
  const { slug } = slugParam.parse(req.params);
  const input = updatePageSchema.parse(req.body);

  const patch: Record<string, unknown> = { updated_by: actor.profile.id };
  if (input.title !== undefined) patch.title = input.title;
  if (input.navLabel !== undefined) patch.nav_label = input.navLabel;
  if (input.seoTitle !== undefined) patch.seo_title = input.seoTitle;
  if (input.seoDescription !== undefined) patch.seo_description = input.seoDescription;
  if (input.isPublished !== undefined) patch.is_published = input.isPublished;

  const { data, error } = await supabaseAdmin
    .from('pages')
    .update(patch)
    .eq('slug', slug)
    .select('*')
    .single();

  if (error || !data) throw HttpError.badRequest(error?.message ?? 'Could not update the page');

  await recordAudit(req, {
    action: 'page.updated',
    entity: 'page',
    entityId: slug,
    meta: { patch: input },
  });

  ok(res, { page: toPage(data) });
});

/**
 * Save one section. The content is validated against the schema for that
 * section's kind, so a malformed save cannot corrupt the page.
 */
contentRouter.patch('/pages/:slug/sections/:key', async (req, res) => {
  const actor = authOf(req);
  const { slug, key } = sectionParams.parse(req.params);
  const input = updateSectionSchema.parse(req.body);

  const { data: pageRow, error: pageError } = await supabaseAdmin
    .from('pages')
    .select('id')
    .eq('slug', slug)
    .single();
  if (pageError || !pageRow) throw HttpError.notFound(`No page "${slug}"`);

  const { data: existing, error: findError } = await supabaseAdmin
    .from('page_sections')
    .select('*')
    .eq('page_id', pageRow.id)
    .eq('key', key)
    .single();
  if (findError || !existing) throw HttpError.notFound(`No section "${key}" on "${slug}"`);

  const kind = isSectionKind(existing.kind) ? existing.kind : null;
  if (!kind) throw HttpError.internal(`Section "${key}" has an unknown kind`);

  const patch: Record<string, unknown> = { updated_by: actor.profile.id };

  if (input.content !== undefined) {
    // Throws a ZodError the error handler turns into a 400 with field details.
    patch.content = parseSectionContent(kind, input.content);
  }
  if (input.isVisible !== undefined) patch.is_visible = input.isVisible;
  if (input.position !== undefined) patch.position = input.position;

  const { data, error } = await supabaseAdmin
    .from('page_sections')
    .update(patch)
    .eq('id', existing.id)
    .select('*')
    .single();

  if (error || !data) throw HttpError.badRequest(error?.message ?? 'Could not save the section');

  await recordAudit(req, {
    action: 'section.updated',
    entity: 'page_section',
    entityId: `${slug}/${key}`,
    meta: { kind, fields: Object.keys(input.content ?? {}) },
  });

  ok(res, { section: toSection(data) });
});

/** Reorder the sections of a page in one go. */
contentRouter.put('/pages/:slug/order', async (req, res) => {
  const { slug } = slugParam.parse(req.params);
  const { keys } = z.object({ keys: z.array(z.string().trim().min(1)).min(1) }).parse(req.body);

  const { data: pageRow, error: pageError } = await supabaseAdmin
    .from('pages')
    .select('id')
    .eq('slug', slug)
    .single();
  if (pageError || !pageRow) throw HttpError.notFound(`No page "${slug}"`);

  await Promise.all(
    keys.map((key, index) =>
      supabaseAdmin
        .from('page_sections')
        .update({ position: index })
        .eq('page_id', pageRow.id)
        .eq('key', key),
    ),
  );

  await recordAudit(req, {
    action: 'page.reordered',
    entity: 'page',
    entityId: slug,
    meta: { keys },
  });

  ok(res, { reordered: true });
});
