import type { Metadata } from 'next';
import type { AuditLog, Paginated } from '@samudra/shared';
import { requireRole } from '@/lib/auth';
import { apiFetchSafe, buildQuery } from '@/lib/api';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Audit log' };

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireRole('admin');
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);

  const result = await apiFetchSafe<Paginated<AuditLog>>(
    `/admin/audit${buildQuery({ page, pageSize: 30 })}`,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every privileged change, newest first. Rows are never edited or deleted.
        </p>
      </div>

      <Card>
        <CardHeader title="Recent activity" description={result ? `${result.total} entries` : undefined} />

        {!result ? (
          <CardBody className="text-sm text-muted-foreground">The API did not answer.</CardBody>
        ) : result.items.length === 0 ? (
          <CardBody className="text-sm text-muted-foreground">
            Nothing logged yet. Change a role or a setting and it shows up here.
          </CardBody>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">When</th>
                  <th scope="col" className="px-5 py-3 font-medium">Action</th>
                  <th scope="col" className="px-5 py-3 font-medium">Actor</th>
                  <th scope="col" className="px-5 py-3 font-medium">Target</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((entry) => (
                  <tr key={entry.id} className="border-b border-border last:border-0 align-top">
                    <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">
                      {formatDateTime(entry.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={entry.action.includes('deleted') ? 'danger' : 'brand'}>
                        {entry.action}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">{entry.actorEmail ?? '--'}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {entry.entity ? (
                        <span className="font-mono text-xs">
                          {entry.entity}
                          {entry.entityId ? `:${entry.entityId.slice(0, 8)}` : ''}
                        </span>
                      ) : (
                        '--'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {result && result.totalPages > 1 ? (
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-sm">
            <span className="text-muted-foreground">
              Page {result.page} of {result.totalPages}
            </span>
            <div className="flex gap-2">
              {result.page > 1 ? (
                <a
                  href={`/admin/audit${buildQuery({ page: result.page - 1 })}`}
                  className="rounded-lg border border-border px-3 py-1.5 font-medium hover:bg-muted"
                >
                  Previous
                </a>
              ) : null}
              {result.page < result.totalPages ? (
                <a
                  href={`/admin/audit${buildQuery({ page: result.page + 1 })}`}
                  className="rounded-lg border border-border px-3 py-1.5 font-medium hover:bg-muted"
                >
                  Next
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
