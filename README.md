# Samudhra

Website for Samudhra, a contemporary Indian restaurant, plus the admin panel
its owner uses to edit the content of every page without touching code.

Next.js front end, a separate Node/Express API, Supabase for auth and Postgres.

The home page is a faithful port of the approved single-file build: its
stylesheet lives verbatim in `apps/web/src/styles/site.css`, the React sections
emit the same markup, and every string and photo comes from the database so the
owner can change them. See [docs/DESIGN.md](docs/DESIGN.md).

```
Samudhra/
├─ apps/
│  ├─ web/          Next.js 16 (App Router, Tailwind 4) — public site + /admin
│  └─ api/          Express 5 + TS — REST API, service-role Supabase client
├─ packages/
│  └─ shared/       Roles, API types, zod schemas, and the content model
├─ supabase/
│  └─ migrations/   Schema, RLS policies, triggers, seeded page content
├─ scripts/         setup-env.mjs
└─ docs/            ARCHITECTURE.md, DESIGN.md
```

## How content works

Nothing on the public site is hardcoded. A **page** owns an ordered list of
**sections**; each section has a `kind` (which React component draws it) and a
JSON `content` blob. The fields of every kind are declared once, in
[`packages/shared/src/content.ts`](packages/shared/src/content.ts), and that one
declaration produces three things:

- the form the owner sees in the admin panel,
- the zod schema the API validates a save against,
- the typed content the React section component receives.

Adding a field is a one-line change there. The header and footer are sections
too — they live on a special `global` page — so the navigation and footer links
are editable from the same place as everything else.

| Page | Slug | State |
| --- | --- | --- |
| Header & footer | `global` | Built |
| Home | `home` | Built — 7 sections |
| Menu | `menu` | Page exists, sections not built yet |
| Dining & Lounge | `dining` | Page exists, sections not built yet |
| Our Story | `about` | Page exists, sections not built yet |
| Catering & Events | `catering` | Page exists, sections not built yet |
| Contact | `contact` | Page exists, sections not built yet |

## Who can sign in

One role matters: **super admin**. The panel exists for the person who edits the
site, so there is no public sign-up, no user list and no second dashboard. The
`editor` and `admin` values stay in the Postgres enum for when staff accounts
are wanted later, but nothing grants them access today.

Access is enforced in three places, so a gap in one does not open a hole:

1. **Postgres RLS** — the real boundary. Visitors read published pages only; a
   user can never raise their own role.
2. **Express API** — `requireSuperAdmin` on every content route.
3. **Next.js** — a redirect in `src/proxy.ts` plus `requireRole('superadmin')`
   in every admin page.

## Setup

```bash
npm install
```

```bash
node scripts/setup-env.mjs
```

That writes `.env` (the API reads it) and `apps/web/.env.local` (Next.js reads
it). Both already hold the project URL and anon key for the `Samudhra` Supabase
project (`tqionuvoxgaqxoosbjty`). **One value is still missing:**

- `SUPABASE_SERVICE_ROLE_KEY` — Supabase dashboard → Project settings → API
  keys. Put it in `.env` only, never in the web app. Until it is set the admin
  panel cannot load and `/api/health/ready` reports `degraded`.

The database schema and the seeded home-page content are already applied to that
project. For a fresh project: `supabase link --project-ref …` then
`npm run db:push`, or run the files in `supabase/migrations/` in order in the
SQL editor.

### Your login

There is no sign-up page. Create the account once in the Supabase dashboard
(Authentication → Users → Add user, with a password), then make it super admin:

```sql
update public.profiles set role = 'superadmin' where email = 'you@example.com';
```

## Run

```bash
npm run dev
```

- site → http://localhost:3000
- API → http://localhost:4000/api
- admin → http://localhost:3000/admin

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | shared (watch) + api + web together |
| `npm run build` | Builds shared, then api, then web |
| `npm run typecheck` | `tsc --noEmit` across every workspace |
| `npm run lint` | ESLint |
| `npm run format` | Prettier over the repo |
| `npm run db:push` | Applies `supabase/migrations` to the linked project |
| `npm run db:types` | Regenerates `packages/shared/src/database.types.ts` |

## API

All routes are under `/api`. Everything except `/api/health` needs
`Authorization: Bearer <supabase access token>`; everything under
`/api/admin` needs the super admin role.

| Method | Route |
| --- | --- |
| GET | `/api/health`, `/api/health/ready` |
| GET, PATCH | `/api/me` |
| GET | `/api/admin/content/pages` |
| GET, PATCH | `/api/admin/content/pages/:slug` |
| PATCH | `/api/admin/content/pages/:slug/sections/:key` |
| PUT | `/api/admin/content/pages/:slug/order` |
| GET | `/api/admin/settings`, `/api/admin/settings/:key` |
| PUT | `/api/admin/settings/:key` |

Every response is `{ ok: true, data }` or `{ ok: false, error: { code, message } }`.

## Still to do

- The other six pages' sections (menu, dining, about, catering, contact).
- Real photography. Every image field is empty, so sections show a placeholder.
- Image uploads to Supabase Storage — today an image field takes a URL.
- The real wordmark as an SVG; it is currently set in Montserrat with the
  brand gradient.
- The `[bracketed]` copy in the design: addresses, phone numbers, opening
  hours, chef names.
