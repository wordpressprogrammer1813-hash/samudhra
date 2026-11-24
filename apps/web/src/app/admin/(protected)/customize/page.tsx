import { CustomizeForm } from '@/components/customize-form';
import { listMedia } from '@/lib/media';
import { listMenus } from '@/lib/menus';
import { getLayoutSettings, getLocationGateSettings, getSiteSettings } from '@/lib/settings';

export default async function AdminCustomizePage() {
  const [site, layout, locationGate, media, menus] = await Promise.all([
    getSiteSettings(),
    getLayoutSettings(),
    getLocationGateSettings(),
    listMedia(),
    listMenus(),
  ]);

  return (
    <CustomizeForm
      site={site}
      layout={layout}
      locationGate={locationGate}
      media={media}
      menus={menus}
    />
  );
}
