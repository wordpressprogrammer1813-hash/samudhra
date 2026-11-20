import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth';
import { PasswordForm, ProfileForm } from './account-forms';

export const metadata: Metadata = { title: 'Account' };

export default async function AccountPage() {
  const { profile } = await requireRole('superadmin');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your own sign-in details for this panel.
        </p>
      </div>

      <ProfileForm profile={profile} />
      <PasswordForm />
    </div>
  );
}
