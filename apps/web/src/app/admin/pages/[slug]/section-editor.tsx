'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { ArrowDown, ArrowUp, Check, Eye, EyeOff, Loader2, Plus, Trash2 } from 'lucide-react';
import {
  SECTION_DEFS,
  isRepeater,
  type FieldDef,
  type PageSection,
  type RepeaterDef,
  type SectionField,
} from '@samudra/shared';
import { saveSectionAction, toggleSectionAction, type SaveState } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const inputClass =
  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring';

type Content = Record<string, unknown>;
type Item = Record<string, string>;

function asItems(value: unknown): Item[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is Item => typeof v === 'object' && v !== null);
}

function asText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/* ------------------------------------------------------------ one field */

function FieldInput({
  field,
  value,
  onChange,
  id,
}: {
  field: FieldDef;
  value: string;
  onChange: (next: string) => void;
  id: string;
}) {
  if (field.type === 'textarea') {
    return (
      <textarea
        id={id}
        rows={field.rows ?? 3}
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputClass, 'resize-y')}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputClass, 'h-10')}
      >
        {(field.options ?? []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="space-y-2">
      <input
        id={id}
        type="text"
        value={value}
        placeholder={field.placeholder ?? (field.type === 'image' ? 'https://…' : undefined)}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
      {field.type === 'image' && value ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin preview of a pasted URL
        <img
          src={value}
          alt=""
          className="h-20 w-32 rounded-lg border border-border object-cover"
        />
      ) : null}
    </div>
  );
}

function Labelled({
  field,
  id,
  children,
}: {
  field: FieldDef;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {field.label}
      </label>
      {children}
      {field.help ? <p className="text-xs text-muted-foreground">{field.help}</p> : null}
    </div>
  );
}

/* -------------------------------------------------------------- repeater */

function Repeater({
  def,
  items,
  onChange,
}: {
  def: RepeaterDef;
  items: Item[];
  onChange: (next: Item[]) => void;
}) {
  const blank = (): Item => Object.fromEntries(def.fields.map((f) => [f.name, ''])) as Item;

  const update = (index: number, name: string, value: string) => {
    const next = items.map((item, i) => (i === index ? { ...item, [name]: value } : item));
    onChange(next);
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    if (moved) next.splice(target, 0, moved);
    onChange(next);
  };

  const atMax = def.max !== undefined && items.length >= def.max;

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{def.label}</p>

      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-border bg-muted/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {def.itemLabel} {index + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Move ${def.itemLabel} ${index + 1} up`}
                className="rounded p-1 text-muted-foreground hover:bg-border disabled:opacity-30"
              >
                <ArrowUp className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label={`Move ${def.itemLabel} ${index + 1} down`}
                className="rounded p-1 text-muted-foreground hover:bg-border disabled:opacity-30"
              >
                <ArrowDown className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                aria-label={`Remove ${def.itemLabel} ${index + 1}`}
                className="rounded p-1 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {def.fields.map((sub) => {
              const id = `${def.name}-${index}-${sub.name}`;
              return (
                <div key={sub.name} className={sub.type === 'textarea' ? 'sm:col-span-2' : ''}>
                  <Labelled field={sub} id={id}>
                    <FieldInput
                      field={sub}
                      id={id}
                      value={asText(item[sub.name])}
                      onChange={(value) => update(index, sub.name, value)}
                    />
                  </Labelled>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange([...items, blank()])}
        disabled={atMax}
      >
        <Plus className="size-4" aria-hidden />
        Add {def.itemLabel}
      </Button>
      {atMax ? (
        <p className="text-xs text-muted-foreground">
          The design fits {def.max} — remove one to add another.
        </p>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------- save button */

function SaveButton({ dirty }: { dirty: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending || !dirty}>
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
      {pending ? 'Saving' : dirty ? 'Save changes' : 'Saved'}
    </Button>
  );
}

/* ------------------------------------------------------------- the card */

export function SectionEditor({ slug, section }: { slug: string; section: PageSection }) {
  const def = SECTION_DEFS[section.kind];
  const [content, setContent] = useState<Content>(section.content ?? {});
  const [dirty, setDirty] = useState(false);
  const [visible, setVisible] = useState(section.isVisible);

  const [state, formAction] = useActionState<SaveState, FormData>(async (prev, formData) => {
    const result = await saveSectionAction(prev, formData);
    if (!result.error) setDirty(false);
    return result;
  }, {});

  const [toggleState, toggleAction] = useActionState<SaveState, FormData>(toggleSectionAction, {});

  const set = (name: string, value: unknown) => {
    setContent((prev) => ({ ...prev, [name]: value }));
    setDirty(true);
  };

  return (
    <Card id={section.key}>
      <CardHeader
        title={def.label}
        description={def.description}
        action={
          <form action={toggleAction}>
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="key" value={section.key} />
            <input type="hidden" name="isVisible" value={String(!visible)} />
            <button
              type="submit"
              onClick={() => setVisible((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            >
              {visible ? (
                <>
                  <Eye className="size-3.5" aria-hidden /> Visible
                </>
              ) : (
                <>
                  <EyeOff className="size-3.5" aria-hidden /> Hidden
                </>
              )}
            </button>
          </form>
        }
      />

      <CardBody>
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="key" value={section.key} />
          <input type="hidden" name="content" value={JSON.stringify(content)} />

          {def.fields.map((field: SectionField) => {
            if (isRepeater(field)) {
              return (
                <Repeater
                  key={field.name}
                  def={field}
                  items={asItems(content[field.name])}
                  onChange={(next) => set(field.name, next)}
                />
              );
            }

            const id = `${section.key}-${field.name}`;
            return (
              <Labelled key={field.name} field={field} id={id}>
                <FieldInput
                  field={field}
                  id={id}
                  value={asText(content[field.name])}
                  onChange={(value) => set(field.name, value)}
                />
              </Labelled>
            );
          })}

          <div className="flex items-center gap-3 border-t border-border pt-4">
            <SaveButton dirty={dirty} />

            {state.error ? (
              <span role="alert" className="text-sm text-destructive">
                {state.error}
              </span>
            ) : null}
            {toggleState.error ? (
              <span role="alert" className="text-sm text-destructive">
                {toggleState.error}
              </span>
            ) : null}
            {!dirty && state.savedAt ? (
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
