import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteBehaviour } from '@/components/site/site-behaviour';
import { getChrome, getLocationNames } from '@/lib/content';
import '@/styles/site.css';

/**
 * Chrome for every public page.
 *
 * `#site.k` is the wrapper the ported stylesheet is scoped to, so these
 * styles never reach the admin panel. The header and footer are themselves
 * editable content - they are sections on the "global" page - which means the
 * client edits navigation in the same place as everything else.
 */
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [{ header, footer }, locations] = await Promise.all([getChrome(), getLocationNames()]);

  return (
    <div className="k" id="site">
      {header ? <SiteHeader content={header.content} /> : null}
      <main>{children}</main>
      {footer ? <SiteFooter content={footer.content} /> : null}
      <SiteBehaviour locations={locations} />
    </div>
  );
}
