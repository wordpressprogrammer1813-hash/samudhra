import type { ReactNode } from 'react';
import { SiteHeader, type HeaderContent } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { getChrome, list, text } from '@/lib/content';

/**
 * Chrome for every public page. The header and footer are themselves editable
 * content — they live as sections on the "global" page — so the client changes
 * the navigation and footer links from the same panel as everything else.
 */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const { header, footer } = await getChrome();

  const headerContent: HeaderContent = {
    menuLabel: header ? text(header.content, 'menuLabel', 'Menu') : 'Menu',
    actions: header
      ? list(header.content, 'actions').map((a) => ({
          label: a.label ?? '',
          href: a.href ?? '#',
          style: a.style,
        }))
      : [],
    navLinks: header
      ? list(header.content, 'navLinks').map((l) => ({
          label: l.label ?? '',
          href: l.href ?? '#',
        }))
      : [],
  };

  return (
    <div id="top" className="flex min-h-dvh flex-col bg-serenade">
      <SiteHeader content={headerContent} />
      <main className="flex-1">{children}</main>
      {footer ? <SiteFooter content={footer.content} /> : null}
    </div>
  );
}
