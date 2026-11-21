# Samudra

A Next.js web app and a separate Node/Express API in one repository, with a
small shared package so the two cannot drift apart.

This is the starting point — no features yet.

```
Samudra/
├─ apps/
│  ├─ web/          Next.js 16 (App Router, TypeScript, Tailwind 4)
│  └─ api/          Express 5 + TypeScript
├─ packages/
│  └─ shared/       Types used by both apps
└─ scripts/         setup-env.mjs
```

## Getting started

```bash
npm install
```

```bash
node scripts/setup-env.mjs
```

That writes `.env` (the API reads it) and `apps/web/.env.local` (Next.js reads
it) from `.env.example`. The defaults work for local development as they are.

```bash
npm run dev
```

- web → http://localhost:3000
- api → http://localhost:4000/api

The home page calls `GET /api/health`, so it tells you straight away whether
the two are talking to each other.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | shared (watch) + api + web together |
| `npm run build` | Builds shared, then api, then web |
| `npm run typecheck` | `tsc --noEmit` across every workspace |
| `npm run lint` | ESLint |
| `npm run format` | Prettier over the repository |

## How it fits together

- **`apps/web`** renders the site. Server components fetch from the API.
- **`apps/api`** is a plain Express app: helmet, CORS limited to
  `CORS_ORIGINS`, rate limiting, request logging, and one error handler that
  turns any thrown error into a JSON body.
- **`packages/shared`** holds the response shape both sides use:
  `{ ok: true, data }` or `{ ok: false, error: { code, message } }`. It
  compiles to `dist/` and both apps consume the build; `npm run dev` watches
  it, so edits flow through while you work.

## Conventions

- TypeScript everywhere, `strict` on.
- Prettier settles formatting (single quotes, 100 columns); ESLint is for
  correctness, not style.
- Environment variables are validated at boot in `apps/api/src/env.ts`, so a
  missing value fails on start rather than on the first request.
