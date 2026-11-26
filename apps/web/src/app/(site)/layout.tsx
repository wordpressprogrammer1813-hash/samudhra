import type { ReactNode } from 'react';
import { CustomCursor } from '@/components/custom-cursor';
import { MagneticButtons, ScrollProgress } from '@/components/micro-interactions';
import { SiteFooter, type FooterColumn } from '@/components/site-footer';
import { SiteHeader, type NavGroup } from '@/components/site-header';
import { SmoothScroll } from '@/components/smooth-scroll';
import { getPublicMenuById } from '@/lib/menus';
import { getPublicLayoutSettings, getPublicSiteSettings } from '@/lib/settings';

// ISR: regenerate at most once every 60s per path, instead of hitting
// Supabase on every single visit.
export const revalidate = 60;

const DEFAULT_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Our Menu',
    links: [
      { label: 'Food & Drinks', href: '/menu' },
      { label: 'Weekend Thali', href: '/menu#weekend-thali' },
    ],
  },
  {
    label: 'Dining & Lounge',
    links: [
      { label: 'Dining Experience', href: '/dining' },
      { label: 'Photo Gallery', href: '/dining#gallery' },
    ],
  },
  {
    label: 'Catering & Events',
    links: [
      { label: 'Catering Menu', href: '/#catering' },
      { label: 'Event Inquiry', href: '/#catering' },
    ],
  },
  {
    label: 'Our Story',
    links: [{ label: 'About Samudhra', href: '/#story' }],
  },
  {
    label: 'Contact',
    links: [
      { label: 'Location & Hours', href: '/contact' },
      { label: 'Contact Details', href: '/contact' },
    ],
  },
];

const DEFAULT_FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: 'Our Menu',
    links: [
      { label: 'Food & Drinks', href: '/menu' },
      { label: 'Weekend Thali', href: '/menu#weekend-thali' },
    ],
  },
  {
    heading: 'Dining & Lounge',
    links: [
      { label: 'Dining Experience', href: '/dining' },
      { label: 'Photo Gallery', href: '/dining#gallery' },
    ],
  },
  {
    heading: 'Catering & Events',
    links: [
      { label: 'Catering Menu', href: '/#catering' },
      { label: 'Event Inquiry', href: '/#catering' },
    ],
  },
  {
    heading: 'Our Story',
    links: [{ label: 'About Samudhra', href: '/#story' }],
  },
  {
    heading: 'Contact',
    links: [
      { label: 'Location & Hours', href: '/contact' },
      { label: 'Contact Details', href: '/contact' },
    ],
  },
];

async function getNavGroups(headerMenuId: string | null): Promise<NavGroup[]> {
  if (!headerMenuId) return [];
  const menu = await getPublicMenuById(headerMenuId);
  if (!menu) return [];

  return menu.items.map((item) => ({
    label: item.label,
    links: item.children.map((child) => ({ label: child.label, href: child.link })),
  }));
}

async function getFooterColumns(footerMenuIds: (string | null)[]): Promise<FooterColumn[]> {
  const menus = await Promise.all(
    footerMenuIds.map((id) => (id ? getPublicMenuById(id) : Promise.resolve(null))),
  );

  return menus
    .filter((menu) => menu !== null)
    .map((menu) => ({
      heading: menu.name,
      links: menu.items.map((item) => ({ label: item.label, href: item.link })),
    }));
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [site, layout] = await Promise.all([getPublicSiteSettings(), getPublicLayoutSettings()]);
  const [dbNavGroups, dbFooterColumns] = await Promise.all([
    getNavGroups(layout.headerMenuId),
    getFooterColumns(layout.footerMenuIds),
  ]);

  const navGroups = dbNavGroups.length > 0 ? dbNavGroups : DEFAULT_NAV_GROUPS;
  const footerColumns = dbFooterColumns.length > 0 ? dbFooterColumns : DEFAULT_FOOTER_COLUMNS;
  const logoUrl = site.logoUrl || '/images/samudhra-logo.png';
  const tagline =
    site.tagline || 'Tradition, reinterpreted. A contemporary expression of Indian warmth.';

  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <MagneticButtons />
      <CustomCursor />
      <SiteHeader navGroups={navGroups} logoUrl={logoUrl} buttons={layout.headerButtons} />
      {children}
      <SiteFooter columns={footerColumns} logoUrl={logoUrl} tagline={tagline} />
    </>
  );
}
