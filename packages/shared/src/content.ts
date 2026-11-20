import { z } from 'zod';

/**
 * The content model behind the admin panel.
 *
 * One place defines, for every kind of page section, which fields it has.
 * From that single definition we derive:
 *   - the form the client sees in the admin panel,
 *   - the zod schema the API validates a save against,
 *   - the typed content a React section component receives.
 *
 * Adding a field means editing one array here. Nothing else has to change.
 */

// ---------------------------------------------------------------- field defs

export type FieldType = 'text' | 'textarea' | 'url' | 'image' | 'boolean' | 'select';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  /** Rows for a textarea. */
  rows?: number;
  options?: { value: string; label: string }[];
}

export interface RepeaterDef {
  name: string;
  label: string;
  type: 'repeater';
  /** Singular noun shown on the "Add" button, e.g. "card". */
  itemLabel: string;
  min?: number;
  max?: number;
  fields: FieldDef[];
}

export type SectionField = FieldDef | RepeaterDef;

export function isRepeater(field: SectionField): field is RepeaterDef {
  return field.type === 'repeater';
}

// -------------------------------------------------------------- section defs

export const SECTION_KINDS = [
  'header',
  'footer',
  'hero',
  'menuShowcase',
  'weekendThali',
  'diningLounge',
  'ourStory',
  'cateringEvents',
  'contactCta',
] as const;

export type SectionKind = (typeof SECTION_KINDS)[number];

export function isSectionKind(value: unknown): value is SectionKind {
  return typeof value === 'string' && (SECTION_KINDS as readonly string[]).includes(value);
}

export interface SectionDef {
  kind: SectionKind;
  label: string;
  description: string;
  fields: SectionField[];
}

/** Shared sub-field sets, so a "link" means the same thing everywhere. */
const linkFields: FieldDef[] = [
  { name: 'label', label: 'Label', type: 'text', placeholder: 'Reserve a Table' },
  { name: 'href', label: 'Links to', type: 'url', placeholder: '/contact' },
];

const eyebrow: FieldDef = {
  name: 'eyebrow',
  label: 'Eyebrow',
  type: 'text',
  help: 'Small uppercase line above the heading.',
  placeholder: 'Our Menu',
};

export const SECTION_DEFS: Record<SectionKind, SectionDef> = {
  header: {
    kind: 'header',
    label: 'Header',
    description: 'The bar at the top of every page.',
    fields: [
      { name: 'menuLabel', label: 'Menu button text', type: 'text', placeholder: 'Menu' },
      {
        name: 'actions',
        label: 'Buttons',
        type: 'repeater',
        itemLabel: 'button',
        max: 3,
        fields: [
          ...linkFields,
          {
            name: 'style',
            label: 'Style',
            type: 'select',
            options: [
              { value: 'outline', label: 'Outlined' },
              { value: 'solid', label: 'Filled' },
            ],
          },
        ],
      },
      {
        name: 'navLinks',
        label: 'Menu overlay links',
        type: 'repeater',
        itemLabel: 'link',
        fields: linkFields,
      },
    ],
  },

  footer: {
    kind: 'footer',
    label: 'Footer',
    description: 'The bottom of every page.',
    fields: [
      { name: 'tagline', label: 'Tagline', type: 'textarea', rows: 3 },
      {
        name: 'columns',
        label: 'Link columns',
        type: 'repeater',
        itemLabel: 'column',
        max: 5,
        fields: [
          { name: 'heading', label: 'Heading', type: 'text' },
          {
            name: 'links',
            label: 'Links (one "Label | /path" per line)',
            type: 'textarea',
            rows: 4,
          },
        ],
      },
      { name: 'legal', label: 'Copyright line', type: 'text', placeholder: '© 2026 Samudhra' },
      { name: 'note', label: 'Small note', type: 'text' },
    ],
  },

  hero: {
    kind: 'hero',
    label: 'Hero',
    description: 'The full-screen opening panel.',
    fields: [
      eyebrow,
      { name: 'titleLine1', label: 'Heading, first line', type: 'text', placeholder: 'Tradition' },
      {
        name: 'titleLine2',
        label: 'Heading, second line',
        type: 'text',
        help: 'Shown in amber, slightly indented.',
        placeholder: 'Reinterpreted',
      },
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'backgroundImage', label: 'Background photo', type: 'image' },
      {
        name: 'actions',
        label: 'Buttons',
        type: 'repeater',
        itemLabel: 'button',
        max: 4,
        fields: linkFields,
      },
    ],
  },

  menuShowcase: {
    kind: 'menuShowcase',
    label: 'Menu showcase',
    description: 'Heading, intro and three round dish cards.',
    fields: [
      eyebrow,
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Intro paragraph', type: 'textarea', rows: 3 },
      {
        name: 'cards',
        label: 'Cards',
        type: 'repeater',
        itemLabel: 'card',
        max: 3,
        fields: [
          { name: 'title', label: 'Title', type: 'text', placeholder: 'Curries' },
          { name: 'description', label: 'One line', type: 'text' },
          { name: 'image', label: 'Photo', type: 'image' },
          { name: 'linkLabel', label: 'Link text', type: 'text', placeholder: 'View menu' },
          { name: 'href', label: 'Links to', type: 'url', placeholder: '/menu' },
        ],
      },
      { name: 'ctaLabel', label: 'Button text', type: 'text', placeholder: 'Order Online' },
      { name: 'ctaHref', label: 'Button links to', type: 'url' },
    ],
  },

  weekendThali: {
    kind: 'weekendThali',
    label: 'Weekend thali',
    description: 'Wide panel with a photo and two buttons.',
    fields: [
      eyebrow,
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Paragraph', type: 'textarea', rows: 4 },
      { name: 'image', label: 'Photo', type: 'image' },
      {
        name: 'actions',
        label: 'Buttons',
        type: 'repeater',
        itemLabel: 'button',
        max: 2,
        fields: linkFields,
      },
    ],
  },

  diningLounge: {
    kind: 'diningLounge',
    label: 'Dining & lounge',
    description: 'Two cards for the dining room and the lounge.',
    fields: [
      eyebrow,
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Paragraph', type: 'textarea', rows: 3 },
      {
        name: 'cards',
        label: 'Cards',
        type: 'repeater',
        itemLabel: 'card',
        max: 3,
        fields: [
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'description', label: 'One line', type: 'text' },
          { name: 'image', label: 'Photo', type: 'image' },
          { name: 'href', label: 'Links to', type: 'url' },
        ],
      },
    ],
  },

  ourStory: {
    kind: 'ourStory',
    label: 'Our story',
    description: 'Text panel with a photo and one button.',
    fields: [
      eyebrow,
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Paragraph', type: 'textarea', rows: 5 },
      { name: 'image', label: 'Photo', type: 'image' },
      { name: 'ctaLabel', label: 'Button text', type: 'text' },
      { name: 'ctaHref', label: 'Button links to', type: 'url' },
    ],
  },

  cateringEvents: {
    kind: 'cateringEvents',
    label: 'Catering & events',
    description: 'Text panel with a photo and two linked cards.',
    fields: [
      eyebrow,
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Paragraph', type: 'textarea', rows: 4 },
      { name: 'image', label: 'Photo', type: 'image' },
      {
        name: 'cards',
        label: 'Cards',
        type: 'repeater',
        itemLabel: 'card',
        max: 2,
        fields: [
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'description', label: 'One line', type: 'text' },
          { name: 'linkLabel', label: 'Link text', type: 'text' },
          { name: 'href', label: 'Links to', type: 'url' },
        ],
      },
    ],
  },

  contactCta: {
    kind: 'contactCta',
    label: 'Contact band',
    description: 'The last band before the footer.',
    fields: [
      eyebrow,
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Paragraph', type: 'textarea', rows: 3 },
      {
        name: 'actions',
        label: 'Buttons',
        type: 'repeater',
        itemLabel: 'button',
        max: 3,
        fields: linkFields,
      },
    ],
  },
};

// ------------------------------------------------------- derived zod schemas

function fieldSchema(field: FieldDef): z.ZodTypeAny {
  switch (field.type) {
    case 'boolean':
      return z.boolean().default(false);
    case 'select':
      return z
        .string()
        .trim()
        .default(field.options?.[0]?.value ?? '');
    case 'url':
    case 'image':
    case 'text':
    case 'textarea':
    default:
      // Everything is optional: the client may save a half-filled section.
      return z.string().trim().max(5000).default('');
  }
}

/** Builds the validation schema for one section kind from its field defs. */
export function sectionContentSchema(kind: SectionKind): z.ZodTypeAny {
  const def = SECTION_DEFS[kind];
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of def.fields) {
    if (isRepeater(field)) {
      const itemShape: Record<string, z.ZodTypeAny> = {};
      for (const sub of field.fields) itemShape[sub.name] = fieldSchema(sub);
      shape[field.name] = z
        .array(z.object(itemShape))
        .max(field.max ?? 24)
        .default([]);
    } else {
      shape[field.name] = fieldSchema(field);
    }
  }

  // Unknown keys are dropped rather than rejected, so removing a field from a
  // def cannot lock the client out of saving a section.
  return z.object(shape);
}

/** Empty but valid content for a section kind. */
export function emptySectionContent(kind: SectionKind): Record<string, unknown> {
  return sectionContentSchema(kind).parse({}) as Record<string, unknown>;
}

// ------------------------------------------------------------------- records

export interface PageSection {
  id: string;
  pageId: string;
  key: string;
  kind: SectionKind;
  label: string;
  position: number;
  isVisible: boolean;
  content: Record<string, unknown>;
  updatedAt: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  navLabel: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  isPublished: boolean;
  position: number;
  updatedAt: string;
}

export interface PageWithSections extends Page {
  sections: PageSection[];
}

// -------------------------------------------------------------- input schemas

export const updatePageSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  navLabel: z.string().trim().max(60).nullable().optional(),
  seoTitle: z.string().trim().max(160).nullable().optional(),
  seoDescription: z.string().trim().max(320).nullable().optional(),
  isPublished: z.boolean().optional(),
});
export type UpdatePageInput = z.infer<typeof updatePageSchema>;

export const updateSectionSchema = z.object({
  content: z.record(z.string(), z.unknown()).optional(),
  isVisible: z.boolean().optional(),
  position: z.number().int().min(0).optional(),
});
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;

/** Parses raw form content against the schema for that kind. */
export function parseSectionContent(kind: SectionKind, raw: unknown): Record<string, unknown> {
  return sectionContentSchema(kind).parse(raw ?? {}) as Record<string, unknown>;
}

/**
 * Footer link columns are edited as "Label | /path" lines, which keeps the
 * form simple. This turns one of those blocks into links.
 */
export function parseLinkLines(value: unknown): { label: string; href: string }[] {
  if (typeof value !== 'string') return [];
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = '', href = ''] = line.split('|').map((p) => p.trim());
      return { label, href };
    })
    .filter((l) => l.label.length > 0);
}
