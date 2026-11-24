import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabasePublic } from '@/lib/supabase-public';

export interface SiteSettings {
  name: string;
  logoUrl: string | null;
  tagline: string;
}

export interface HeaderButton {
  label: string;
  link: string;
}

export interface LayoutSettings {
  headerMenuId: string | null;
  headerButtons: [HeaderButton, HeaderButton];
  footerMenuIds: (string | null)[];
}

export interface LocationGateCard {
  name: string;
  description: string;
  backgroundImage: string;
  reserveLabel: string;
  orderLabel: string;
}

export interface LocationGateSocialLinks {
  instagramUrl: string;
  tiktokUrl: string;
}

export interface LocationGateSettings {
  cards: [LocationGateCard, LocationGateCard];
  menuId: string | null;
  socialLinks: LocationGateSocialLinks;
}

const DEFAULT_SITE: SiteSettings = { name: 'Samudhra', logoUrl: null, tagline: '' };
const DEFAULT_LAYOUT: LayoutSettings = {
  headerMenuId: null,
  headerButtons: [
    { label: 'Order Online', link: '#contact' },
    { label: 'Reservations', link: '#contact' },
  ],
  footerMenuIds: [null, null, null, null, null],
};
const DEFAULT_LOCATION_GATE: LocationGateSettings = {
  cards: [
    {
      name: '',
      description: '',
      backgroundImage: '',
      reserveLabel: '',
      orderLabel: '',
    },
    {
      name: '',
      description: '',
      backgroundImage: '',
      reserveLabel: '',
      orderLabel: '',
    },
  ],
  menuId: null,
  socialLinks: {
    instagramUrl: '',
    tiktokUrl: '',
  },
};

async function getSettingValue<T>(db: SupabaseClient, key: string, fallback: T): Promise<T> {
  const { data, error } = await db.from('settings').select('value').eq('key', key).maybeSingle();
  if (error || !data) return fallback;
  return { ...fallback, ...(data.value as Partial<T>) };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return getSettingValue(supabaseAdmin(), 'site', DEFAULT_SITE);
}

export async function getLayoutSettings(): Promise<LayoutSettings> {
  return getSettingValue(supabaseAdmin(), 'layout', DEFAULT_LAYOUT);
}

export async function getPublicSiteSettings(): Promise<SiteSettings> {
  return getSettingValue(supabasePublic(), 'site', DEFAULT_SITE);
}

export async function getPublicLayoutSettings(): Promise<LayoutSettings> {
  return getSettingValue(supabasePublic(), 'layout', DEFAULT_LAYOUT);
}

export async function getLocationGateSettings(): Promise<LocationGateSettings> {
  return getSettingValue(supabaseAdmin(), 'locationGate', DEFAULT_LOCATION_GATE);
}

export async function getPublicLocationGateSettings(): Promise<LocationGateSettings> {
  return getSettingValue(supabasePublic(), 'locationGate', DEFAULT_LOCATION_GATE);
}
