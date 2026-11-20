# Architecture

## Why a separate API at all

Next.js route handlers could do this job. A standalone Express app was chosen so
that the service-role Supabase key lives in exactly one process that the browser
can never reach, and so background work (emails, imports, cron) has somewhere to
go later without reshaping the front end.

## Request paths

There are two, on purpose.

**Reads that the page renders** go straight from a server component to Supabase
with the *user's* session, so RLS applies:

```
browser -> Next.js server component -> Supabase (as the user, RLS on)
```

**Privileged writes** go through the API, which checks the role itself and then
uses the service-role key:

```
browser -> Next.js server action -> Express (/api, Bearer token) -> Supabase (service role)
```

A server action never trusts its caller: it calls `requireRole()` first, and the
API checks the role again from the token. The browser never holds a service key
and never calls the API directly.

## Auth flow

1. `/login` posts to a server action running `signInWithPassword`.
2. `@supabase/ssr` writes the session into cookies.
3. `src/proxy.ts` (Next 16's rename of middleware) refreshes the token on every
   navigation and redirects anonymous or under-privileged visitors away from
   `/admin`.
4. Server pages call `requireRole()`, which re-reads the profile (and therefore
   the role) from Postgres — not from the JWT, so a demotion takes effect at once.

## Role enforcement, three layers

| Layer | File | Fails how |
| --- | --- | --- |
| Postgres RLS | `supabase/migrations/*_init_roles_profiles.sql` | Query returns nothing / errors |
| API | `apps/api/src/middleware/auth.ts` | 401 or 403 JSON |
| Next.js | `apps/web/src/proxy.ts`, `src/lib/auth.ts` | Redirect |

The `profiles` update policy is the important one: a signed-in user may edit
their own row, but the `with check` clause compares `role` and `status` against
their current values, so they cannot promote themselves even by crafting the
request by hand.

`current_app_role()` and friends are `SECURITY DEFINER` because a policy on
`profiles` that reads `profiles` would otherwise recurse through its own RLS.

## Guard rails in the user routes

- You cannot change your own role or status.
- The last remaining super admin cannot be demoted or deleted.
- Nobody can grant a role at or above their own rank (`assignableRoles`).
- Every change writes an `audit_logs` row; a failed audit write is logged but
  never fails the request it describes.

## Shared package

`@samudra/shared` holds the role hierarchy, the API response shapes and the zod
schemas. The API parses request bodies with them; the web app parses form data
with the same ones, so validation cannot drift between the two.

It compiles to `dist/` and both apps consume the build. `npm run dev` runs
`tsc --watch` on it, so edits propagate while you work.

## Database objects

| Object | Purpose |
| --- | --- |
| `app_role`, `user_status` | Enums; `app_role` mirrors `ROLES` in the shared package |
| `profiles` | One row per `auth.users`, carries the role |
| `handle_new_user()` trigger | Creates the profile on sign-up |
| `current_app_role()`, `has_min_role()`, `is_admin()`, `is_superadmin()` | Policy helpers |
| `audit_logs` | Append-only; admin-readable, service-role writable |
| `settings` | Key/value JSON config; rows flagged `is_public` are world-readable |

## Conventions

- Postgres is `snake_case`, TypeScript is `camelCase`; the mapping lives in
  `apps/api/src/lib/mappers.ts` and `apps/web/src/lib/auth.ts`.
- Colours are tokens in `apps/web/src/app/globals.css`. Nothing hardcodes a hex
  value, so swapping in the Figma palette is a one-file change.
- Every API response is `{ ok, data }` or `{ ok, error }` — the client branches
  on one field.

## Deployment sketch

| Piece | Where | Notes |
| --- | --- | --- |
| `apps/web` | Vercel | Root dir `apps/web`, build command at the repo root |
| `apps/api` | Render / Railway / Fly | `npm run build:api` then `npm run start:api` |
| Database | Supabase | `supabase db push` from CI on main |

Set `CORS_ORIGINS` on the API to the deployed web origin, and
`NEXT_PUBLIC_API_URL` on the web app to the deployed API origin.
