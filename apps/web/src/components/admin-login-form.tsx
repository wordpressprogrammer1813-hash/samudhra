'use client';

import { useActionState } from 'react';
import { loginWithKey, type LoginState } from '@/app/admin/login/actions';

const initialState: LoginState = {};

export function AdminLoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginWithKey, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="key" className="mb-2 block text-xs font-medium tracking-[0.2em] uppercase">
          Superadmin key
        </label>
        <input
          id="key"
          name="key"
          type="password"
          autoComplete="off"
          autoFocus
          required
          className="w-full rounded-[3px] border border-heath/30 bg-transparent px-4 py-3 text-sm text-heath outline-none focus-visible:border-heath"
        />
      </div>

      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-heath bg-heath px-5 py-3 text-xs font-medium tracking-[0.24em] text-serenade uppercase transition-colors duration-300 hover:bg-zest hover:text-heath disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Checking…' : 'Enter'}
      </button>
    </form>
  );
}
