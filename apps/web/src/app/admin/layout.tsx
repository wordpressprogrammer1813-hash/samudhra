import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth';
import { MobileNav, Sidebar } from '@/components/admin/sidebar';
import { Topbar } from '@/components/admin/topbar';

export const metadata: Metadata = { title: { default: 'Admin', template: '%s | Samudhra admin' } };

/**
 * Server-side gate for the whole panel. The middleware already redirects
 * anonymous users; this check is the one that actually matters.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireRole('editor');

  return (
    <div className="flex min-h-dvh">
      <Sidebar role={profile.role} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar profile={profile} />
        <MobileNav role={profile.role} />
        <main className="flex-1 bg-background p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
