import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth';
import { MobileNav, Sidebar } from '@/components/admin/sidebar';
import { Topbar } from '@/components/admin/topbar';

export const metadata: Metadata = { title: { default: 'Admin', template: '%s | Samudhra admin' } };

/**
 * Server-side gate for the whole panel. The proxy already redirects anonymous
 * visitors; this check is the one that actually matters, and it is super admin
 * only - the panel exists for the one person who edits the site.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireRole('superadmin');

  return (
    <div className="flex min-h-dvh">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar profile={profile} />
        <MobileNav />
        <main className="flex-1 bg-background p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
