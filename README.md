# Samudhra

Restaurant website + super admin panel. Next.js front end, a separate
Node/Express API, and Supabase for auth and Postgres.

The public site is built from the Figma file — see
[docs/DESIGN.md](docs/DESIGN.md) for the screen inventory, the design tokens
and what is still missing from the design.

```
Samudra/
├─ apps/
│  ├─ web/          Next.js 16 (App Router, TS, Tailwind 4) - public site + /admin
│  └─ api/          Express 5 + TS - REST API at /api, service-role Supabase client
├─ packages/
│  └─ shared/       Roles, types and zod schemas used by both apps
├─ supabase/
│  ├─ migrations/   Schema, RLS policies, triggers
│  └─ seed.sql      Promotes the first account to super admin (local only)
├─ scripts/         setup-env.mjs
└─ docs/            ARCHITECTURE.md, DESIGN.md
```

## 1. Install

```bash
npm install
```

## 2. Environment

```bash
node scripts/setup-env.mjs
```

That creates `.env` (read by the API) and `apps/web/.env.local` (read by Next.js)
from `.env.example`.

**Both files already hold the project URL and anon key for the `Samudhra`
Supabase project (`tqionuvoxgaqxoosbjty`).** The one value still missing is
`SUPABASE_SERVICE_ROLE_KEY` — copy it from **Project settings → API keys** into
`.env` only. Until then the API answers `/api/health/ready` with
`"status": "degraded"` and `"Invalid API key"`.

| Variable | Where it is used | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | web + api | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | web + api | Safe in the browser |
| `SUPABASE_SERVICE_ROLE_KEY` | api only | **Bypasses RLS. Never put this in the web app.** |
| `NEXT_PUBLIC_API_URL` | web | `http://localhost:4000` in development |
| `CORS_ORIGINS` | api | Comma separated list of allowed browser origins |

## 3. Database

**Already applied** to the `Samudhra` project — `profiles`, `audit_logs` and
`settings` all exist with RLS on, and the auth trigger is verified working.
The three files in `supabase/migrations/` are the record of that.

For a fresh project, with the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase link --project-ref YOUR-PROJECT-REF
```

```bash
npm run db:push
```

No CLI? Run the files in `supabase/migrations/` in order in the SQL editor.

Make yourself super admin (SQL editor, once, after signing up):

```sql
update public.profiles set role = 'superadmin' where email = 'you@example.com';
```

## 4. Run

```bash
npm run dev
```

- web → http://localhost:3000
- api → http://localhost:4000/api
- admin panel → http://localhost:3000/admin

Sign up at `/login?mode=signup`, run the SQL above to promote yourself, then
reload `/admin`.

## Roles

A linear hierarchy — each role has everything below it:

| Role | Can do |
| --- | --- |
| `user` | Sign in, edit own profile |
| `editor` | Open the admin panel, see the dashboard |
| `admin` | Read all users, read the audit log |
| `superadmin` | Invite users, change roles and status, edit settings, delete accounts |

Enforced in three places, so a gap in one does not open a hole:

1. **Postgres RLS** — the real boundary. A user can never raise their own role.
2. **Express API** — `requireRole()` on every privileged route.
3. **Next.js** — a redirect in `src/proxy.ts` plus a `requireRole()` check in
   each page.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | shared (watch) + api + web together |
| `npm run build` | Builds shared, then api, then web |
| `npm run typecheck` | `tsc --noEmit` across every workspace |
| `npm run lint` | ESLint where configured |
| `npm run db:push` | Applies `supabase/migrations` to the linked project |
| `npm run db:types` | Regenerates `packages/shared/src/database.types.ts` |

## API

All routes are under `/api`. Everything except `/api/health` needs
`Authorization: Bearer <supabase access token>`.

| Method | Route | Minimum role |
| --- | --- | --- |
| GET | `/api/health`, `/api/health/ready` | public |
| GET / PATCH | `/api/me` | signed in |
| POST | `/api/me/seen` | signed in |
| GET | `/api/admin/users`, `/users/stats`, `/users/:id` | admin |
| POST | `/api/admin/users/invite` | superadmin |
| PATCH / DELETE | `/api/admin/users/:id` | admin / superadmin |
| GET | `/api/admin/settings`, `/settings/:key` | admin |
| PUT | `/api/admin/settings/:key` | superadmin |
| GET | `/api/admin/audit` | admin |

Every response is `{ ok: true, data }` or `{ ok: false, error: { code, message } }`.

## What is not built yet

The public site is still a placeholder page. The seven designed screens
(splash, home, menu, about, dining & lounge, catering, contact) and the content
tables behind them are the next piece of work — [docs/DESIGN.md](docs/DESIGN.md)
lists each frame, its node id, and the open questions.
