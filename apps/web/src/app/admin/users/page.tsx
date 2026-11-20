import type { Metadata } from 'next';
import { Search } from 'lucide-react';
import { isSuperAdmin, type Paginated, type Profile } from '@samudra/shared';
import { requireRole } from '@/lib/auth';
import { apiFetchSafe, buildQuery } from '@/lib/api';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { RoleBadge, StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { InviteUserForm, RoleSelect, StatusSelect } from './user-controls';

export const metadata: Metadata = { title: 'Users' };

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { profile } = await requireRole('admin');
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const search = params.search?.trim() ?? '';
  const superAdmin = isSuperAdmin(profile.role);

  const result = await apiFetchSafe<Paginated<Profile>>(
    `/admin/users${buildQuery({ page, pageSize: 20, search })}`,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {superAdmin
            ? 'Invite accounts and change roles or access.'
            : 'Read-only. Only a super admin can change roles.'}
        </p>
      </div>

      {superAdmin ? (
        <Card>
          <CardHeader title="Invite someone" description="Supabase sends the invitation email." />
          <CardBody>
            <InviteUserForm actorRole={profile.role} />
          </CardBody>
        </Card>
      ) : null}

      <Card>
        <CardHeader
          title="All accounts"
          description={result ? `${result.total} total` : 'Could not reach the API'}
          action={
            <form method="get" className="flex items-center gap-2">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <input
                  name="search"
                  defaultValue={search}
                  placeholder="Search name or email"
                  aria-label="Search users"
                  className="h-9 w-48 rounded-lg border border-input bg-background pl-8 pr-3 text-sm outline-none focus:border-ring"
                />
              </div>
              <Button type="submit" variant="secondary" size="sm">
                Search
              </Button>
            </form>
          }
        />

        {!result ? (
          <CardBody className="text-sm text-muted-foreground">
            The API did not answer. Start it with <code className="font-mono">npm run dev</code> at
            the repo root.
          </CardBody>
        ) : result.items.length === 0 ? (
          <CardBody className="text-sm text-muted-foreground">No accounts matched.</CardBody>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Name</th>
                  <th scope="col" className="px-5 py-3 font-medium">Role</th>
                  <th scope="col" className="px-5 py-3 font-medium">Status</th>
                  <th scope="col" className="px-5 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((user) => {
                  const isSelf = user.id === profile.id;
                  return (
                    <tr key={user.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-3">
                        <p className="font-medium">
                          {user.fullName ?? '--'}
                          {isSelf ? (
                            <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                          ) : null}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </td>
                      <td className="px-5 py-3">
                        {superAdmin && !isSelf ? (
                          <RoleSelect
                            userId={user.id}
                            current={user.role}
                            actorRole={profile.role}
                          />
                        ) : (
                          <RoleBadge role={user.role} />
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {superAdmin && !isSelf ? (
                          <StatusSelect userId={user.id} current={user.status} />
                        ) : (
                          <StatusBadge status={user.status} />
                        )}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  );
                })}
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
                  href={`/admin/users${buildQuery({ page: result.page - 1, search })}`}
                  className="rounded-lg border border-border px-3 py-1.5 font-medium hover:bg-muted"
                >
                  Previous
                </a>
              ) : null}
              {result.page < result.totalPages ? (
                <a
                  href={`/admin/users${buildQuery({ page: result.page + 1, search })}`}
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
