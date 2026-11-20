import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth';
import { apiFetchSafe } from '@/lib/api';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';
import { SettingForm } from './setting-form';

export const metadata: Metadata = { title: 'Settings' };

interface SettingRow {
  key: string;
  value: unknown;
  isPublic: boolean;
  updatedAt: string;
}

export default async function SettingsPage() {
  await requireRole('superadmin');

  const result = await apiFetchSafe<{ settings: SettingRow[] }>('/admin/settings');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Site-wide configuration. Only a super admin can change these.
        </p>
      </div>

      {!result ? (
        <Card>
          <CardBody className="text-sm text-muted-foreground">
            The API did not answer. Start it with <code className="font-mono">npm run dev</code> at
            the repo root.
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {result.settings.map((setting) => (
            <Card key={setting.key}>
              <CardHeader
                title={<span className="font-mono text-sm">{setting.key}</span>}
                description={`Last changed ${formatDateTime(setting.updatedAt)}`}
              />
              <CardBody>
                <SettingForm
                  settingKey={setting.key}
                  value={setting.value}
                  isPublic={setting.isPublic}
                />
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
