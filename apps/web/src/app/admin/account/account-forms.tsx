'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Check, Loader2 } from 'lucide-react';
import type { Profile } from '@samudra/shared';
import { changePasswordAction, saveProfileAction, type AccountState } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';

const inputClass =
  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring';

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
      {pending ? 'Saving' : label}
    </Button>
  );
}

function Feedback({ state }: { state: AccountState }) {
  if (state.error) {
    return (
      <span role="alert" className="text-sm text-destructive">
        {state.error}
      </span>
    );
  }
  if (state.message) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-success">
        <Check className="size-4" aria-hidden />
        {state.message}
      </span>
    );
  }
  return null;
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState<AccountState, FormData>(saveProfileAction, {});

  return (
    <Card>
      <CardHeader title="Your details" description="Shown in the top corner of this panel." />
      <CardBody>
        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-sm font-medium">
                Name
              </label>
              <input
                id="fullName"
                name="fullName"
                defaultValue={profile.fullName ?? ''}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone (optional)
              </label>
              <input
                id="phone"
                name="phone"
                defaultValue={profile.phone ?? ''}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-sm font-medium">Email</span>
            <p className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
              {profile.email}
            </p>
          </div>

          <div className="flex items-center gap-3 border-t border-border pt-4">
            <Submit label="Save details" />
            <Feedback state={state} />
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export function PasswordForm() {
  const [state, formAction] = useActionState<AccountState, FormData>(changePasswordAction, {});

  return (
    <Card>
      <CardHeader title="Password" description="Use at least 8 characters." />
      <CardBody>
        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                New password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="confirm" className="text-sm font-medium">
                Repeat it
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-border pt-4">
            <Submit label="Change password" />
            <Feedback state={state} />
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
