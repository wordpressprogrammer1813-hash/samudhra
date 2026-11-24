import Link from 'next/link';
import type { ReactNode } from 'react';
import { AdminNav } from '@/components/admin-nav';
import { getSiteSettings } from '@/lib/settings';
import { logout } from '../login/actions';

const NAV_ITEMS = [
  { label: 'Website Customize', href: '/admin/customize' },
  { label: 'Pages', href: '/admin/pages' },
  { label: 'Menus', href: '/admin/menu' },
  { label: 'Media', href: '/admin/media' },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const site = await getSiteSettings();

  return (
    <div className="flex min-h-dvh flex-col sm:flex-row">
      <aside className="flex shrink-0 flex-col justify-between bg-heath text-serenade sm:sticky sm:top-0 sm:h-dvh sm:w-64">
        <div>
          <div className="px-6 py-6">
            {site.logoUrl ? (
              <div className="inline-flex rounded-[3px] bg-serenade px-3 py-2">
                {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary storage URL, not a next/image case yet */}
                <img src={site.logoUrl} alt="Samudhra" className="h-6 w-auto" />
              </div>
            ) : (
              <p className="text-sm font-medium tracking-[0.2em] uppercase">Samudhra Admin</p>
            )}
          </div>
          <AdminNav items={NAV_ITEMS} />
        </div>

        <form action={logout} className="border-t border-serenade/15 p-4">
          <button
            type="submit"
            className="w-full rounded-[3px] border border-serenade/30 px-4 py-2.5 text-left text-xs font-medium tracking-[0.2em] text-serenade uppercase transition-colors duration-300 hover:bg-serenade hover:text-heath"
          >
            Log out
          </button>
        </form>
      </aside>

      <main className="flex-1 bg-serenade">
        <div className="flex items-center justify-end border-b border-heath/10 px-6 py-3 sm:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-heath uppercase hover:text-zest"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="size-4"
            >
              <path d="M11 5 4 12l7 7M4 12h16" />
            </svg>
            Back to website
          </Link>
        </div>
        <div className="p-6 sm:p-10">{children}</div>
      </main>
    </div>
  );
}
