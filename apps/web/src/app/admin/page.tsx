import Link from 'next/link';
import { AlertTriangle, ChevronRight, Layers, Pencil } from 'lucide-react';
import type { Page } from '@samudra/shared';
import { requireRole } from '@/lib/auth';
import { apiFetchSafe } from '@/lib/api';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';

type PageRow = Page & { sectionCount: number };

export default async function AdminPagesPage() {
  const { profile } = await requireRole('superadmin');
  const result = await apiFetchSafe<{ pages: PageRow[] }>('/admin/content/pages');

  const chrome = result?.pages.filter((p) => p.slug === 'global') ?? [];
  const pages = result?.pages.filter((p) => p.slug !== 'global') ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back, {profile.fullName ?? profile.email}. Pick a page to edit its text, photos
          and links.
        </p>
      </div>

      {!result ? (
        <Card className="border-warning/40 bg-warning/10">
          <CardBody className="flex items-start gap-3 text-sm">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
            <div>
              <p className="font-medium">The API did not answer.</p>
              <p className="mt-1 text-muted-foreground">
                Start it with <code className="font-mono">npm run dev</code> at the repo root.
              </p>
            </div>
          </CardBody>
        </Card>
      ) : null}

      {pages.length > 0 ? (
        <Card>
          <CardHeader
            title="Website pages"
            description="Each page is a list of sections you can edit."
          />
          <ul className="divide-y divide-border">
            {pages.map((page) => (
              <li key={page.id}>
                <Link
                  href={`/admin/pages/${page.slug}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-zest-20 text-korma dark:text-zest">
                    <Pencil className="size-4" aria-hidden />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-medium">{page.title}</span>
                      {page.isPublished ? (
                        <Badge tone="success">Live</Badge>
                      ) : (
                        <Badge tone="neutral">Draft</Badge>
                      )}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      /{page.slug === 'home' ? '' : page.slug} &middot; {page.sectionCount} section
                      {page.sectionCount === 1 ? '' : 's'} &middot; edited{' '}
                      {formatDateTime(page.updatedAt)}
                    </span>
                  </span>

                  <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {chrome.length > 0 ? (
        <Card>
          <CardHeader
            title="Across the whole site"
            description="The header and footer that appear on every page."
          />
          <ul className="divide-y divide-border">
            {chrome.map((page) => (
              <li key={page.id}>
                <Link
                  href={`/admin/pages/${page.slug}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                    <Layers className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-medium">{page.title}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      Menu links, buttons and footer columns
                    </span>
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
