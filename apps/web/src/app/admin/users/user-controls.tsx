'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2, UserPlus } from 'lucide-react';
import { assignableRoles, ROLE_LABELS, type Role, type UserStatus } from '@samudra/shared';
import {
  changeRoleAction,
  changeStatusAction,
  inviteUserAction,
  type ActionState,
} from './actions';
import { Button } from '@/components/ui/button';

const selectClass =
  'h-9 rounded-lg border border-input bg-background px-2 text-xs outline-none focus:border-ring disabled:opacity-50';

function AutoSubmitOnChange() {
  const { pending } = useFormStatus();
  return pending ? <Loader2 className="size-3.5 animate-spin text-muted-foreground" aria-hidden /> : null;
}

/** Role dropdown that submits itself on change. Super admin only. */
export function RoleSelect({
  userId,
  current,
  actorRole,
  disabled,
}: {
  userId: string;
  current: Role;
  actorRole: Role;
  disabled?: boolean;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(changeRoleAction, {});
  const options = assignableRoles(actorRole);

  return (
    <form action={formAction} className="flex items-center gap-1.5">
      <input type="hidden" name="id" value={userId} />
      <select
        name="role"
        defaultValue={current}
        disabled={disabled}
        aria-label="Role"
        className={selectClass}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
      >
        {options.map((role) => (
          <option key={role} value={role}>
            {ROLE_LABELS[role]}
          </option>
        ))}
      </select>
      <AutoSubmitOnChange />
      {state.error ? <span className="text-xs text-destructive">{state.error}</span> : null}
    </form>
  );
}

/** Status dropdown that submits itself on change. Super admin only. */
export function StatusSelect({
  userId,
  current,
  disabled,
}: {
  userId: string;
  current: UserStatus;
  disabled?: boolean;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(changeStatusAction, {});

  return (
    <form action={formAction} className="flex items-center gap-1.5">
      <input type="hidden" name="id" value={userId} />
      <select
        name="status"
        defaultValue={current}
        disabled={disabled}
        aria-label="Status"
        className={selectClass}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
      >
        <option value="active">active</option>
        <option value="invited">invited</option>
        <option value="suspended">suspended</option>
      </select>
      <AutoSubmitOnChange />
      {state.error ? <span className="text-xs text-destructive">{state.error}</span> : null}
    </form>
  );
}

function InviteSubmit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <UserPlus className="size-4" aria-hidden />
      )}
      {pending ? 'Sending' : 'Send invite'}
    </Button>
  );
}

/** Invite form. Super admin only; Supabase sends the email. */
export function InviteUserForm({ actorRole }: { actorRole: Role }) {
  const [state, formAction] = useActionState<ActionState, FormData>(inviteUserAction, {});

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
        <div className="space-y-1.5">
          <label htmlFor="invite-email" className="text-xs font-medium text-muted-foreground">
            Email
          </label>
          <input
            id="invite-email"
            name="email"
            type="email"
            required
            placeholder="person@example.com"
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="invite-name" className="text-xs font-medium text-muted-foreground">
            Full name (optional)
          </label>
          <input
            id="invite-name"
            name="fullName"
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="invite-role" className="text-xs font-medium text-muted-foreground">
            Role
          </label>
          <select
            id="invite-role"
            name="role"
            defaultValue="user"
            className="h-10 rounded-lg border border-input bg-background px-2 text-sm outline-none focus:border-ring"
          >
            {assignableRoles(actorRole).map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        </div>

        <InviteSubmit />
      </div>

      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      {state.message ? <p className="text-sm text-success">{state.message}</p> : null}
    </form>
  );
}
