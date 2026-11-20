import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { PageWithSections } from '@samudra/shared';
import { requireRole } from '@/lib/auth';
import { apiFetchSafe } from '@/lib/api';
import { Card, CardBody } from '@/components/ui/card';
import { PageSettings } from './page-settings';
import { SectionEditor } from './section-editor';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Editing ${slug}` };
}

export default async function EditPagePage({ params }: { params: Promise<{ slug: string }> }) {
  await requireRole('superadmin');
  const { slug } = await params;

  const result = await apiFetchSafe<{ page: PageWithSections }>(
    `/admin/content/pages/${encodeURIComponent(slug)}`,
  );

  if (!result) {
    return (
      <Card>
        <CardBody className="text-sm text-muted-foreground">
          Could not load this page. Check that the API is running, then reload.
        </CardBody>
      </Card>
    );
  }

  const { page } = result;
  if (!page) notFound();

  // "global" holds the header and footer, which are not a route of their own.
  const livePath = page.slug === 'global' ? '/' : page.slug === 'home' ? '/' : `/${page.slug}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All pages
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{page.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {page.sections.length} section{page.sections.length === 1 ? '' : 's'}. Changes go live
            as soon as you save.
          </p>
        </div>

        <Link
          href={livePath}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <ExternalLink className="size-4" aria-hidden />
          View page
        </Link>
      </div>

      {page.slug !== 'global' ? <PageSettings page={page} /> : null}

      {page.sections.length === 0 ? (
        <Card>
          <CardBody className="text-sm text-muted-foreground">
            This page has no sections yet. They get added when the page is built from the design.
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          {page.sections.map((section) => (
            <SectionEditor key={section.id} slug={page.slug} section={section} />
          ))}
        </div>
      )}
    </div>
  );
}
