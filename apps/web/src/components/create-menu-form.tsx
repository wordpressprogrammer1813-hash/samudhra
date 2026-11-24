'use client';

import { useActionState } from 'react';
import { createMenu, type CreateMenuState } from '@/app/admin/(protected)/menu/actions';

const initialState: CreateMenuState = {};

export function CreateMenuForm() {
  const [state, formAction, pending] = useActionState(createMenu, initialState);

  return (
    <form action={formAction} className="flex items-start gap-3">
      <div>
        <input
          name="name"
          placeholder="Menu name"
          required
          className="w-56 rounded-[3px] border border-heath/30 bg-transparent px-3 py-2 text-sm text-heath outline-none focus-visible:border-heath"
        />
        {state.error ? <p className="mt-1 text-xs text-red-700">{state.error}</p> : null}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-heath bg-heath px-5 py-2 text-xs font-medium tracking-[0.2em] text-serenade uppercase transition-colors duration-300 hover:bg-zest hover:text-heath disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Creating…' : 'Create menu'}
      </button>
    </form>
  );
}
