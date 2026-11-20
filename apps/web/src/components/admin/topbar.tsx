import { LogOut } from 'lucide-react';
import type { Profile } from '@samudra/shared';
import { signOutAction } from '@/app/login/actions';
import { RoleBadge } from '@/components/ui/badge';
import { initials } from '@/lib/utils';

export function Topbar({ profile }: { profile: Profile }) {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 sm:px-6">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{profile.fullName ?? profile.email}</p>
        <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
      </div>

      <div className="flex items-center gap-3">
        <RoleBadge role={profile.role} />

        <span
          aria-hidden
          className="grid size-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
        >
          {initials(profile.fullName, profile.email)}
        </span>

        <form action={signOutAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <LogOut className="size-4" aria-hidden />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </form>
      </div>
    </header>
  );
}
