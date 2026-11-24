'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-admin';
import type {
  HeaderButton,
  LayoutSettings,
  LocationGateSettings,
  SiteSettings,
} from '@/lib/settings';

async function patchSetting<T extends object>(key: string, patch: Partial<T>): Promise<void> {
  const db = supabaseAdmin();
  const { data } = await db.from('settings').select('value').eq('key', key).maybeSingle();
  const current = (data?.value as T) ?? {};
  await db
    .from('settings')
    .update({ value: { ...current, ...patch } })
    .eq('key', key);
}

export interface CustomizeDraft {
  logoUrl: string | null;
  tagline: string;
  headerMenuId: string | null;
  headerButtons: [HeaderButton, HeaderButton];
  footerMenuIds: (string | null)[];
  locationGate: LocationGateSettings;
}

export async function saveCustomize(draft: CustomizeDraft): Promise<void> {
  await Promise.all([
    patchSetting<SiteSettings>('site', { logoUrl: draft.logoUrl, tagline: draft.tagline }),
    patchSetting<LayoutSettings>('layout', {
      headerMenuId: draft.headerMenuId,
      headerButtons: draft.headerButtons,
      footerMenuIds: draft.footerMenuIds,
    }),
    patchSetting<LocationGateSettings>('locationGate', {
      cards: draft.locationGate.cards,
      menuId: draft.locationGate.menuId,
      socialLinks: draft.locationGate.socialLinks,
    }),
  ]);

  revalidatePath('/admin/customize');
  revalidatePath('/');
}
