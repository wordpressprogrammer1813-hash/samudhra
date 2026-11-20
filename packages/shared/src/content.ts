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
 * The field sets mirror the approved homepage markup one-to-one, so anything
 * visible on the page is editable and nothing on the page is hardcoded.
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
  help?: string;
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
  'bookingDialog',
  'enquiryForm',
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

/**
 * What a button does. `reserve` and `order` open the location picker;
 * `enquiry` opens the event enquiry form; `link` just navigates.
 */
export const BUTTON_ACTIONS = ['link', 'reserve', 'order', 'enquiry'] as const;
export type ButtonAction = (typeof BUTTON_ACTIONS)[number];

const actionField: FieldDef = {
  name: 'action',
  label: 'On click',
  type: 'select',
  options: [
    { value: 'link', label: 'Go to a link' },
    { value: 'reserve', label: 'Open "Reserve a table"' },
    { value: 'order', label: 'Open "Order online"' },
    { value: 'enquiry', label: 'Open the event enquiry form' },
  ],
};

const buttonFields: FieldDef[] = [
  { name: 'label', label: 'Label', type: 'text', placeholder: 'Reserve a Table' },
  actionField,
  { name: 'href', label: 'Link (only when "Go to a link")', type: 'url', placeholder: '/menu' },
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
    description: 'The bar at the top of every page, and the slide-in menu panel.',
    fields: [
      { name: 'menuLabel', label: 'Menu button text', type: 'text', placeholder: 'Menu' },
      { name: 'logo', label: 'Wordmark image', type: 'image', placeholder: '/images/samudhra.png' },
      {
        name: 'openMenuLabel',
        label: 'Menu button, spoken label',
        type: 'text',
        help: 'Read out by screen readers. Not shown on screen.',
        placeholder: 'Open site menu',
      },
      {
        name: 'closeMenuLabel',
        label: 'Close button text',
        type: 'text',
        placeholder: 'Close menu',
      },
      {
        name: 'actions',
        label: 'Header buttons',
        type: 'repeater',
        itemLabel: 'button',
        max: 3,
        fields: [
          ...buttonFields,
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
        name: 'navGroups',
        label: 'Menu panel',
        type: 'repeater',
        itemLabel: 'group',
        help: 'Each group is a heading with links under it.',
        fields: [
          { name: 'heading', label: 'Group heading', type: 'text', placeholder: 'Our Menu' },
          {
            name: 'links',
            label: 'Links, one "Label | /path" per line',
            type: 'textarea',
            rows: 3,
          },
        ],
      },
      {
        name: 'panelAddress',
        label: 'Address under the menu',
        type: 'textarea',
        rows: 2,
        help: 'One address per line.',
      },
    ],
  },

  footer: {
    kind: 'footer',
    label: 'Footer',
    description: 'The bottom of every page.',
    fields: [
      { name: 'logo', label: 'Wordmark image', type: 'image' },
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
            label: 'Links, one "Label | /path" per line',
            type: 'textarea',
            rows: 3,
          },
        ],
      },
      { name: 'legal', label: 'Copyright line', type: 'text', placeholder: '© 2026 Samudhra' },
      { name: 'note', label: 'Small note', type: 'text' },
      { name: 'markImage', label: 'Corner monogram', type: 'image' },
    ],
  },

  hero: {
    kind: 'hero',
    label: 'Hero',
    description: 'The opening panel. The first heading line animates in letter by letter.',
    fields: [
      eyebrow,
      {
        name: 'titleLine1',
        label: 'Heading, first line',
        type: 'text',
        help: 'Shown in capitals, one letter at a time.',
        placeholder: 'Tradition',
      },
      {
        name: 'titleLine2',
        label: 'Heading, second line',
        type: 'text',
        help: 'Shown in amber, tucked to the right.',
        placeholder: 'Reinterpreted',
      },
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'backgroundImage', label: 'Background photo', type: 'image' },
      {
        name: 'imagePosition',
        label: 'Photo focus point',
        type: 'text',
        help: 'CSS object-position, e.g. "52% 56%".',
        placeholder: '52% 56%',
      },
      {
        name: 'actions',
        label: 'Buttons',
        type: 'repeater',
        itemLabel: 'button',
        max: 4,
        fields: buttonFields,
      },
      {
        name: 'scrollLabel',
        label: 'Scroll arrow, spoken label',
        type: 'text',
        help: 'Read out by screen readers. Not shown on screen.',
        placeholder: 'Scroll down',
      },
      {
        name: 'pauseLabel',
        label: 'Pause button, spoken label',
        type: 'text',
        placeholder: 'Pause animations',
      },
      {
        name: 'playLabel',
        label: 'Play button, spoken label',
        type: 'text',
        placeholder: 'Play animations',
      },
    ],
  },

  menuShowcase: {
    kind: 'menuShowcase',
    label: 'Menu showcase',
    description: 'Centred heading and three dishes in rotating star frames.',
    fields: [
      eyebrow,
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Intro paragraph', type: 'textarea', rows: 3 },
      { name: 'starImage', label: 'Star frame graphic', type: 'image' },
      {
        name: 'cards',
        label: 'Dishes',
        type: 'repeater',
        itemLabel: 'dish',
        max: 3,
        fields: [
          { name: 'numeral', label: 'Numeral', type: 'text', placeholder: 'i.' },
          { name: 'title', label: 'Title', type: 'text', placeholder: 'Curries' },
          { name: 'description', label: 'One line', type: 'text' },
          { name: 'image', label: 'Photo', type: 'image' },
          {
            name: 'imageMode',
            label: 'Photo style',
            type: 'select',
            options: [
              { value: 'plate', label: 'Round plate' },
              { value: 'cutout', label: 'Cut-out, no circle' },
            ],
          },
          {
            name: 'imagePosition',
            label: 'Focus point',
            type: 'text',
            placeholder: '47% 52%',
          },
          {
            name: 'imageScale',
            label: 'Zoom',
            type: 'text',
            help: 'How far to zoom into the photo, e.g. 1.25. Leave empty for none.',
            placeholder: '1.25',
          },
          { name: 'linkLabel', label: 'Link text', type: 'text', placeholder: 'View menu' },
          { name: 'href', label: 'Links to', type: 'url', placeholder: '/menu' },
        ],
      },
      { name: 'ctaLabel', label: 'Button text', type: 'text', placeholder: 'Order Online' },
      actionField,
      { name: 'ctaHref', label: 'Button link (only when "Go to a link")', type: 'url' },
    ],
  },

  weekendThali: {
    kind: 'weekendThali',
    label: 'Weekend thali',
    description: 'Amber poster: big heading, the thali in the middle, photos scattered around.',
    fields: [
      eyebrow,
      { name: 'titleLine1', label: 'Heading, first line', type: 'text', placeholder: 'Weekend' },
      { name: 'titleLine2', label: 'Heading, second line', type: 'text', placeholder: 'Thali' },
      { name: 'body', label: 'Paragraph', type: 'textarea', rows: 4 },
      { name: 'plateImage', label: 'Centre photo', type: 'image' },
      {
        name: 'frames',
        label: 'Scattered photos',
        type: 'repeater',
        itemLabel: 'photo',
        max: 4,
        help: 'Exactly four, in the fixed positions from the design. They show in black and white until hovered.',
        fields: [
          { name: 'image', label: 'Photo', type: 'image' },
          { name: 'alt', label: 'Description for screen readers', type: 'text' },
          { name: 'imagePosition', label: 'Focus point', type: 'text', placeholder: '45% 60%' },
        ],
      },
      {
        name: 'actions',
        label: 'Buttons',
        type: 'repeater',
        itemLabel: 'button',
        max: 2,
        fields: buttonFields,
      },
    ],
  },

  diningLounge: {
    kind: 'diningLounge',
    label: 'Dining & lounge',
    description: 'A heading and a list of rows, each with a thumbnail.',
    fields: [
      eyebrow,
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Paragraph', type: 'textarea', rows: 3 },
      {
        name: 'rows',
        label: 'Rows',
        type: 'repeater',
        itemLabel: 'row',
        fields: [
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'description', label: 'One line', type: 'text' },
          { name: 'image', label: 'Thumbnail', type: 'image' },
          { name: 'imagePosition', label: 'Focus point', type: 'text', placeholder: '45% 40%' },
          { name: 'href', label: 'Links to', type: 'url' },
        ],
      },
    ],
  },

  ourStory: {
    kind: 'ourStory',
    label: 'Our story',
    description: 'Amber panel with the drifting mark on the left.',
    fields: [
      eyebrow,
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'quote', label: 'Large line under the heading', type: 'textarea', rows: 2 },
      { name: 'body', label: 'Paragraph', type: 'textarea', rows: 5 },
      { name: 'markImage', label: 'Decorative mark', type: 'image' },
      { name: 'ctaLabel', label: 'Button text', type: 'text' },
      actionField,
      { name: 'ctaHref', label: 'Button link (only when "Go to a link")', type: 'url' },
    ],
  },

  cateringEvents: {
    kind: 'cateringEvents',
    label: 'Catering & events',
    description: 'Dark panel with two cards whose photos sit above them.',
    fields: [
      eyebrow,
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Paragraph', type: 'textarea', rows: 4 },
      {
        name: 'cards',
        label: 'Cards',
        type: 'repeater',
        itemLabel: 'card',
        max: 2,
        fields: [
          { name: 'titleLine1', label: 'Title, first line', type: 'text', placeholder: 'Catering' },
          { name: 'titleLine2', label: 'Title, second line', type: 'text', placeholder: 'Menu' },
          { name: 'note', label: 'Line under the title', type: 'text' },
          { name: 'image', label: 'Photo', type: 'image' },
          { name: 'imagePosition', label: 'Focus point', type: 'text', placeholder: '45% 55%' },
          { name: 'linkLabel', label: 'Link text', type: 'text' },
          actionField,
          { name: 'href', label: 'Links to (only when "Go to a link")', type: 'url' },
        ],
      },
    ],
  },

  contactCta: {
    kind: 'contactCta',
    label: 'Contact',
    description: 'Intro, buttons and one block per location.',
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
        fields: buttonFields,
      },
      {
        name: 'locations',
        label: 'Locations',
        type: 'repeater',
        itemLabel: 'location',
        max: 4,
        help: 'These also fill the location picker on the Reserve and Order buttons.',
        fields: [
          { name: 'label', label: 'Small label', type: 'text', placeholder: 'Location 01' },
          { name: 'name', label: 'Name', type: 'text', placeholder: 'New Jersey' },
          { name: 'address', label: 'Address', type: 'text' },
          { name: 'hours', label: 'Hours', type: 'text' },
          { name: 'phone', label: 'Phone', type: 'text' },
          { name: 'email', label: 'Email', type: 'text' },
          { name: 'linkLabel', label: 'Link text', type: 'text', placeholder: 'Reserve here' },
        ],
      },
    ],
  },

  bookingDialog: {
    kind: 'bookingDialog',
    label: 'Reserve & order dialog',
    description:
      'The box that opens from every "Reserve a table" and "Order online" button. The locations in it come from the Contact section.',
    fields: [
      {
        name: 'choosePrompt',
        label: 'Label before a location is picked',
        type: 'text',
        placeholder: 'Choose a location',
      },
      { name: 'closeLabel', label: 'Close button', type: 'text', placeholder: 'Close' },
      { name: 'switchLabel', label: 'Switch button', type: 'text', placeholder: 'Switch Location' },
      { name: 'noticeTag', label: 'Notice tag', type: 'text', placeholder: 'Prototype' },

      {
        name: 'reserveTitle',
        label: 'Reserve: heading',
        type: 'text',
        placeholder: 'Reserve a Table',
      },
      {
        name: 'reservePrompt',
        label: 'Reserve: question',
        type: 'text',
        placeholder: 'Where would you like to dine?',
      },
      {
        name: 'reserveLead',
        label: 'Reserve: sentence before the location name',
        type: 'textarea',
        rows: 2,
        help: 'The chosen location is added to the end of this sentence.',
      },
      { name: 'reserveNote', label: 'Reserve: notice', type: 'textarea', rows: 2 },

      { name: 'orderTitle', label: 'Order: heading', type: 'text', placeholder: 'Order Online' },
      {
        name: 'orderPrompt',
        label: 'Order: question',
        type: 'text',
        placeholder: 'Order from which location?',
      },
      {
        name: 'orderLead',
        label: 'Order: sentence before the location name',
        type: 'textarea',
        rows: 2,
      },
      { name: 'orderNote', label: 'Order: notice', type: 'textarea', rows: 2 },
    ],
  },

  enquiryForm: {
    kind: 'enquiryForm',
    label: 'Event enquiry form',
    description: 'The form that opens from the "Start an inquiry" card.',
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text', placeholder: 'Catering & Events' },
      { name: 'title', label: 'Heading', type: 'text', placeholder: 'Event Inquiry' },
      {
        name: 'closeLabel',
        label: 'Close button, spoken label',
        type: 'text',
        placeholder: 'Close',
      },

      { name: 'locationLabel', label: 'Field: location', type: 'text', placeholder: 'Location' },
      { name: 'nameLabel', label: 'Field: name', type: 'text', placeholder: 'Name' },
      { name: 'emailLabel', label: 'Field: email', type: 'text', placeholder: 'Email' },
      { name: 'dateLabel', label: 'Field: date', type: 'text', placeholder: 'Date' },
      { name: 'guestsLabel', label: 'Field: guests', type: 'text', placeholder: 'Guests' },
      {
        name: 'occasionLabel',
        label: 'Field: message',
        type: 'text',
        placeholder: 'Your occasion',
      },

      { name: 'submitLabel', label: 'Submit button', type: 'text', placeholder: 'Send Inquiry' },
      { name: 'footnote', label: 'Note beside the button', type: 'text' },
      {
        name: 'errorText',
        label: 'Message when no location is chosen',
        type: 'text',
        placeholder: 'Choose a location for your inquiry.',
      },
      { name: 'sentTag', label: 'After sending: tag', type: 'text' },
      { name: 'sentText', label: 'After sending: message', type: 'textarea', rows: 2 },
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
 * Link columns are edited as "Label | /path" lines, which keeps the form
 * simple. This turns one of those blocks into links.
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

/** Splits a textarea into non-empty lines. */
export function parseLines(value: unknown): string[] {
  if (typeof value !== 'string') return [];
  return value
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}
