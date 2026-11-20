-- =============================================================================
-- Samudra :: 0004 :: page-wise content
--
-- The admin panel exists so the client can edit each page's copy without
-- touching code. A page owns an ordered list of sections; a section carries a
-- `kind` (which React component renders it) and a `content` JSON blob whose
-- shape is defined once in packages/shared/src/content.ts.
-- =============================================================================

create table if not exists public.pages (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  nav_label       text,
  seo_title       text,
  seo_description text,
  is_published    boolean not null default false,
  position        int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  updated_by      uuid references auth.users (id) on delete set null
);

comment on table public.pages is 'One row per editable page. The "global" row holds the header and footer.';

create index if not exists pages_position_idx on public.pages (position, slug);

drop trigger if exists pages_set_updated_at on public.pages;
create trigger pages_set_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

create table if not exists public.page_sections (
  id         uuid primary key default gen_random_uuid(),
  page_id    uuid not null references public.pages (id) on delete cascade,
  key        text not null,
  kind       text not null,
  label      text not null,
  position   int  not null default 0,
  is_visible boolean not null default true,
  content    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  constraint page_sections_key_unique unique (page_id, key)
);

comment on table public.page_sections is 'Ordered content blocks within a page; `kind` picks the renderer.';

create index if not exists page_sections_page_idx on public.page_sections (page_id, position);

drop trigger if exists page_sections_set_updated_at on public.page_sections;
create trigger page_sections_set_updated_at
  before update on public.page_sections
  for each row execute function public.set_updated_at();

-- --------------------------------------------------------------------- RLS
alter table public.pages         enable row level security;
alter table public.page_sections enable row level security;

drop policy if exists "pages: public read published"    on public.pages;
drop policy if exists "pages: superadmin all"           on public.pages;
drop policy if exists "sections: public read visible"   on public.page_sections;
drop policy if exists "sections: superadmin all"        on public.page_sections;

-- Visitors (signed in or not) see published pages only.
create policy "pages: public read published"
  on public.pages for select
  to anon, authenticated
  using (is_published);

create policy "pages: superadmin all"
  on public.pages for all
  to authenticated
  using (public.is_superadmin())
  with check (public.is_superadmin());

-- A section is public when it is visible and its page is published.
create policy "sections: public read visible"
  on public.page_sections for select
  to anon, authenticated
  using (
    is_visible
    and exists (
      select 1 from public.pages p
       where p.id = page_sections.page_id
         and p.is_published
    )
  );

create policy "sections: superadmin all"
  on public.page_sections for all
  to authenticated
  using (public.is_superadmin())
  with check (public.is_superadmin());

grant select on public.pages         to anon, authenticated;
grant select on public.page_sections to anon, authenticated;

-- ============================================================= seed: pages
insert into public.pages (slug, title, nav_label, seo_title, seo_description, is_published, position) values
  ('global',   'Header & footer', null,                 null, null, true,  0),
  ('home',     'Home',            'Home',               'Samudhra | Contemporary Indian Dining',
     'Tradition, reinterpreted. A contemporary expression of Indian warmth, in New Jersey and New York.', true, 1),
  ('menu',     'Menu',            'Menu',               'The Menu', 'Regional recipes, seasonal produce and a few family secrets.', false, 2),
  ('dining',   'Dining & Lounge', 'Dining Experience',  'Dining & Lounge', 'An evening meant to be lingered over.', false, 3),
  ('about',    'Our Story',       'Our Story',          'About Samudhra', 'Bringing the flavours of home to your table.', false, 4),
  ('catering', 'Catering & Events','Catering & Events', 'Catering & Events', 'We bring the table to you.', false, 5),
  ('contact',  'Contact',         'Contact',            'Contact & Reservations', 'Make a reservation or send us a note.', false, 6)
on conflict (slug) do nothing;

-- ========================================================== seed: global
insert into public.page_sections (page_id, key, kind, label, position, content)
select p.id, 'header', 'header', 'Header', 0, $json$
{
  "menuLabel": "Menu",
  "actions": [
    { "label": "Order Online",  "href": "/order",   "style": "outline" },
    { "label": "Reservations",  "href": "/contact", "style": "solid"   }
  ],
  "navLinks": [
    { "label": "Menu",               "href": "/menu" },
    { "label": "Dining Experience",  "href": "/dining" },
    { "label": "Gallery",            "href": "/dining#gallery" },
    { "label": "Catering & Events",  "href": "/catering" },
    { "label": "Our Story",          "href": "/about" },
    { "label": "Location & Hours",   "href": "/contact" },
    { "label": "Contact",            "href": "/contact#details" }
  ]
}
$json$::jsonb
from public.pages p where p.slug = 'global'
on conflict (page_id, key) do nothing;

insert into public.page_sections (page_id, key, kind, label, position, content)
select p.id, 'footer', 'footer', 'Footer', 1, $json$
{
  "tagline": "Tradition, reinterpreted. A contemporary expression of Indian warmth.",
  "columns": [
    { "heading": "Our Menu",          "links": "Food & Drinks | /menu\nWeekend Thali | /menu#thali" },
    { "heading": "Dining & Lounge",   "links": "Dining Experience | /dining\nPhoto Gallery | /dining#gallery" },
    { "heading": "Catering & Events", "links": "Catering Menu | /catering\nEvent Inquiry | /catering#inquiry" },
    { "heading": "Our Story",         "links": "About Samudhra | /about" },
    { "heading": "Contact",           "links": "Location & Hours | /contact\nContact Details | /contact#details" }
  ],
  "legal": "© 2026 Samudhra",
  "note": "Prototype — [bracketed] details are placeholders"
}
$json$::jsonb
from public.pages p where p.slug = 'global'
on conflict (page_id, key) do nothing;

-- ============================================================ seed: home
insert into public.page_sections (page_id, key, kind, label, position, content)
select p.id, 'hero', 'hero', 'Hero', 0, $json$
{
  "eyebrow": "Contemporary Indian Dining",
  "titleLine1": "Tradition",
  "titleLine2": "Reinterpreted",
  "subtitle": "A contemporary expression of Indian warmth",
  "backgroundImage": "",
  "actions": [
    { "label": "Reserve a Table", "href": "/contact" },
    { "label": "Order Online",    "href": "/order" },
    { "label": "Private Events",  "href": "/dining#private" }
  ]
}
$json$::jsonb
from public.pages p where p.slug = 'home'
on conflict (page_id, key) do nothing;

insert into public.page_sections (page_id, key, kind, label, position, content)
select p.id, 'menu-showcase', 'menuShowcase', 'Menu showcase', 1, $json$
{
  "eyebrow": "Our Menu",
  "heading": "From the Samudhra kitchen",
  "body": "Each dish begins with the traditions, spices and regional flavours that shape Indian cooking — interpreted through a modern dining experience.",
  "cards": [
    { "title": "Curries",          "description": "Rooted in tradition, rich with spice.",    "image": "", "linkLabel": "View menu", "href": "/menu#curries" },
    { "title": "Signature Plates", "description": "Familiar flavours, refined for the table.", "image": "", "linkLabel": "View menu", "href": "/menu#signature" },
    { "title": "Biryani",          "description": "Fresh, vibrant and distinctly Samudhra.",   "image": "", "linkLabel": "View menu", "href": "/menu#biryani" }
  ],
  "ctaLabel": "Order Online",
  "ctaHref": "/order"
}
$json$::jsonb
from public.pages p where p.slug = 'home'
on conflict (page_id, key) do nothing;

insert into public.page_sections (page_id, key, kind, label, position, content)
select p.id, 'weekend-thali', 'weekendThali', 'Weekend thali', 2, $json$
{
  "eyebrow": "Our Menu · Weekends at Samudhra",
  "heading": "Weekend Thali",
  "body": "Many small bowls around one plate — curries, dal, rice and accompaniments. A generous way to taste a little of everything.",
  "image": "",
  "actions": [
    { "label": "Reserve for the Weekend", "href": "/contact" },
    { "label": "View Thali Menu",         "href": "/menu#thali" }
  ]
}
$json$::jsonb
from public.pages p where p.slug = 'home'
on conflict (page_id, key) do nothing;

insert into public.page_sections (page_id, key, kind, label, position, content)
select p.id, 'dining-lounge', 'diningLounge', 'Dining & lounge', 3, $json$
{
  "eyebrow": "02 — Dining & Lounge",
  "heading": "Stay a While",
  "body": "From the first plate to the last pour — an evening at Samudhra is meant to be lingered over.",
  "cards": [
    { "title": "Dining Experience", "description": "The dining room, service and the evening at the table.",     "image": "", "href": "/dining" },
    { "title": "The Lounge",        "description": "Cocktails and conversation, poured with care for spice and balance.", "image": "", "href": "/dining#lounge" },
    { "title": "Photo Gallery",     "description": "Food, drinks and the rooms they are served in.",             "image": "", "href": "/dining#gallery" }
  ]
}
$json$::jsonb
from public.pages p where p.slug = 'home'
on conflict (page_id, key) do nothing;

insert into public.page_sections (page_id, key, kind, label, position, content)
select p.id, 'our-story', 'ourStory', 'Our story', 4, $json$
{
  "eyebrow": "03 — About Samudhra",
  "heading": "Our Story",
  "body": "What begins in tradition becomes something new at the table.\n\nEach dish begins with the traditions, spices, and regional flavors that shape Indian cooking, interpreted through a modern dining experience. The menu brings familiar flavors into a refined setting — rooted in tradition, still fresh, vibrant, and distinctly Samudhra.",
  "image": "",
  "ctaLabel": "About Samudhra",
  "ctaHref": "/about"
}
$json$::jsonb
from public.pages p where p.slug = 'home'
on conflict (page_id, key) do nothing;

insert into public.page_sections (page_id, key, kind, label, position, content)
select p.id, 'catering-events', 'cateringEvents', 'Catering & events', 5, $json$
{
  "eyebrow": "04 — Catering & Events",
  "heading": "Bring the Table to You",
  "body": "Celebrations, gatherings and occasions large or small — shaped around your guests, at Samudhra or wherever you host.",
  "image": "",
  "cards": [
    { "title": "Catering Menu", "description": "For gatherings of every size", "linkLabel": "View the menu",  "href": "/catering" },
    { "title": "Event Inquiry", "description": "Tell us about your occasion",  "linkLabel": "Start an inquiry", "href": "/catering#inquiry" }
  ]
}
$json$::jsonb
from public.pages p where p.slug = 'home'
on conflict (page_id, key) do nothing;

insert into public.page_sections (page_id, key, kind, label, position, content)
select p.id, 'contact', 'contactCta', 'Contact band', 6, $json$
{
  "eyebrow": "05 — Contact",
  "heading": "Find Us",
  "body": "Location & hours, and how to reach the team for reservations, orders and events.",
  "actions": [
    { "label": "Reserve a Table", "href": "/contact" },
    { "label": "Order Online",    "href": "/order" }
  ]
}
$json$::jsonb
from public.pages p where p.slug = 'home'
on conflict (page_id, key) do nothing;
