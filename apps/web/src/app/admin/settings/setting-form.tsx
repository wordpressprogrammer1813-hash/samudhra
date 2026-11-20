'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2, Save } from 'lucide-react';
import { saveSettingAction, type SettingFormState } from './actions';
import { Button } from '@/components/ui/button';

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <Save className="size-4" aria-hidden />
      )}
      {pending ? 'Saving' : 'Save'}
    </Button>
  );
}

/** One editable settings row. The value is edited as raw JSON. */
export function SettingForm({
  settingKey,
  value,
  isPublic,
}: {
  settingKey: string;
  value: unknown;
  isPublic: boolean;
}) {
  const [state, formAction] = useActionState<SettingFormState, FormData>(saveSettingAction, {});
  const pretty = JSON.stringify(value ?? {}, null, 2);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="key" value={settingKey} />

      <div className="flex items-center justify-between gap-3">
        <label htmlFor={`setting-${settingKey}`} className="font-mono text-sm font-medium">
          {settingKey}
          {isPublic ? (
            <span className="ml-2 font-sans text-xs font-normal text-muted-foreground">
              readable by anyone
            </span>
          ) : null}
        </label>
        <SaveButton />
      </div>

      <textarea
        id={`setting-${settingKey}`}
        name="value"
        defaultValue={pretty}
        rows={Math.min(12, pretty.split('\n').length + 1)}
        spellCheck={false}
        className="w-full resize-y rounded-lg border border-input bg-background p-3 font-mono text-xs outline-none focus:border-ring"
      />

      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      {state.message ? <p className="text-sm text-success">{state.message}</p> : null}
    </form>
  );
}
