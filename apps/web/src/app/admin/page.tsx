import Link from 'next/link';
import { AlertTriangle, ShieldCheck, UserCheck, UserX, Users } from 'lucide-react';
import { hasMinRole } from '@samudra/shared';
import { requireRole } from '@/lib/auth';
import { apiFetchSafe } from '@/lib/api';
import { Card, CardBody, CardHeader, StatCard } from '@/components/ui/card';

interface UserStats {
  total: number;
  active: number;
  suspended: number;
  admins: number;
}

export default async function AdminDashboardPage() {
  const { profile } = await requireRole('editor');
  const canSeeUsers = hasMinRole(profile.role, 'admin');

  // Null when the API is not running or the role is too low - the page still renders.
  const stats = canSeeUsers ? await apiFetchSafe<UserStats>('/admin/users/stats') : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as {profile.fullName ?? profile.email}.
        </p>
      </div>

      {canSeeUsers && !stats ? (
        <Card className="border-warning/40 bg-warning/10">
          <CardBody className="flex items-start gap-3 text-sm">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
            <div>
              <p className="font-medium">The API did not answer.</p>
              <p className="mt-1 text-muted-foreground">
                Start it with <code className="font-mono">npm run dev</code> at the repo root, and
                check that <code className="font-mono">NEXT_PUBLIC_API_URL</code> points at it.
              </p>
            </div>
          </CardBody>
        </Card>
      ) : null}

      {stats ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total users" value={stats.total} icon={<Users className="size-5" aria-hidden />} />
          <StatCard label="Active" value={stats.active} icon={<UserCheck className="size-5" aria-hidden />} />
          <StatCard label="Suspended" value={stats.suspended} icon={<UserX className="size-5" aria-hidden />} />
          <StatCard
            label="Admins"
            value={stats.admins}
            hint="admin + super admin"
            icon={<ShieldCheck className="size-5" aria-hidden />}
          />
        </div>
      ) : null}

      <Card>
        <CardHeader
          title="What is wired up"
          description="The scaffold is complete; the screens come from the Figma file next."
        />
        <CardBody className="space-y-3 text-sm text-muted-foreground">
          <ul className="list-inside list-disc space-y-1.5">
            <li>Supabase auth with email + password, session refresh in middleware</li>
            <li>Four roles (user, editor, admin, super admin) enforced in Postgres via RLS</li>
            <li>Express API at <code className="font-mono">/api</code> with per-role route guards</li>
            <li>Audit trail for every privileged change</li>
          </ul>
          {hasMinRole(profile.role, 'admin') ? (
            <p>
              Manage accounts under{' '}
              <Link href="/admin/users" className="font-medium text-primary hover:underline">
                Users
              </Link>
              .
            </p>
          ) : (
            <p>Your role can see this dashboard. Ask a super admin for more access.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
