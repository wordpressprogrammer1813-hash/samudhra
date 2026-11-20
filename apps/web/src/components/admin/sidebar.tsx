'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { hasMinRole, type Role } from '@samudra/shared';
import { adminNav, brandIcon as BrandIcon } from './nav';
import { cn } from '@/lib/utils';

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = adminNav.filter((item) => hasMinRole(role, item.minRole));

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
      <Link href="/" className="flex h-16 items-center gap-2 border-b border-border px-5 font-semibold">
        <BrandIcon className="size-5 text-zest" aria-hidden />
        Samudhra
      </Link>

      <nav aria-label="Admin" className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-zest-20 text-heath dark:text-serenade'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <p className="border-t border-border p-4 text-xs text-muted-foreground">
        Samudhra admin &middot; v0.1
      </p>
    </aside>
  );
}

/** Horizontal nav shown instead of the sidebar on small screens. */
export function MobileNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = adminNav.filter((item) => hasMinRole(role, item.minRole));

  return (
    <nav
      aria-label="Admin"
      className="flex gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2 lg:hidden"
    >
      {items.map((item) => {
        const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
              active ? 'bg-zest-20 text-heath dark:text-serenade' : 'text-muted-foreground',
            )}
          >
            <Icon className="size-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
