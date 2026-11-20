'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Check, Loader2 } from 'lucide-react';
import type { Page } from '@samudra/shared';
import { savePageAction, type SaveState } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';

const inputClass =
  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring';

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
      {pending ? 'Saving' : 'Save page settings'}
    </Button>
  );
}

/** Title, search-engine text and whether the page is live. */
export function PageSettings({ page }: { page: Page }) {
  const [state, formAction] = useActionState<SaveState, FormData>(savePageAction, {});

  return (
    <Card>
      <CardHeader
        title="Page settings"
        description="The name in this panel, the text search engines show, and whether the page is live."
      />
      <CardBody>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="slug" value={page.slug} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-sm font-medium">
                Page name
              </label>
              <input id="title" name="title" defaultValue={page.title} className={inputClass} />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="seoTitle" className="text-sm font-medium">
                Browser tab / search title
              </label>
              <input
                id="seoTitle"
                name="seoTitle"
                defaultValue={page.seoTitle ?? ''}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="seoDescription" className="text-sm font-medium">
              Search description
            </label>
            <textarea
              id="seoDescription"
              name="seoDescription"
              rows={2}
              defaultValue={page.seoDescription ?? ''}
              className={inputClass}
            />
            <p className="text-xs text-muted-foreground">
              Around 150 characters. This is what shows under the link on Google.
            </p>
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-border p-3">
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={page.isPublished}
              className="mt-0.5 size-4 accent-[var(--primary)]"
            />
            <span className="text-sm">
              <span className="font-medium">Live on the website</span>
              <span className="block text-muted-foreground">
                Turn this off to hide the page from visitors. You can still see it while signed in.
              </span>
            </span>
          </label>

          <div className="flex items-center gap-3 border-t border-border pt-4">
            <SaveButton />
            {state.error ? (
              <span role="alert" className="text-sm text-destructive">
                {state.error}
              </span>
            ) : null}
            {state.savedAt ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-success">
                <Check className="size-4" aria-hidden />
                Saved
              </span>
            ) : null}
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
