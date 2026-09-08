# kuzio-apps

SvelteKit app (Svelte 5) deployed to Cloudflare Workers, showing/managing a list of "sites"
(`kuzio.app`) behind single-admin GitHub OAuth. See [README.md](README.md) for the full feature
rundown — this file is about working in the codebase, not the product.

## Package manager: pnpm — always

This repo uses **pnpm** (`packageManager: pnpm@11.2.2` in `package.json`, `pnpm-lock.yaml` and
`pnpm-workspace.yaml` present). Never run `npm install`/`npm run ...` or `yarn` — they'll ignore
the lockfile and can desync it. Use `pnpm <script>` for everything in `package.json`'s `scripts`.

## Common commands

```bash
pnpm dev              # start dev server (vite dev)
pnpm build            # production build
pnpm preview           # build + wrangler dev, closest thing to prod locally
pnpm deploy            # build + wrangler deploy
pnpm check             # svelte-kit sync + svelte-check (type checking)
pnpm lint               # eslint . (formatting + linting, no Prettier)
pnpm lint:fix           # eslint . --fix
pnpm test:unit          # vitest
pnpm test:e2e           # playwright
pnpm test               # test:unit --run + test:e2e
pnpm db:generate         # drizzle-kit generate (new SQL migration from schema.ts changes)
pnpm db:migrate          # apply migrations to local D1 replica (used by dev/preview)
pnpm db:migrate:remote   # apply migrations to production D1
pnpm db:studio           # Drizzle Studio
pnpm cf-typegen          # wrangler types -> src/worker-configuration.d.ts (run after editing wrangler.jsonc bindings)
```

Always run `pnpm lint` and `pnpm check` before considering a change done — CI
([`.github/workflows/lint.yml`](.github/workflows/lint.yml)) and a Husky pre-commit hook
(`lint-staged`) both enforce lint on push/commit.

## Architecture

- **Framework**: SvelteKit 2 + Svelte 5 (runes), deployed via `@sveltejs/adapter-cloudflare` as a
  Cloudflare Worker. Entry/build output referenced in [`wrangler.jsonc`](wrangler.jsonc) as
  `.svelte-kit/cloudflare/_worker.js`.
- **Styling**: Tailwind CSS v4 + daisyUI components (`@tailwindcss/vite` plugin, no separate
  Tailwind config file needed — see [`vite.config.ts`](vite.config.ts)).
- **Database**: Cloudflare D1 (binding `DB`), schema/queries via Drizzle ORM in
  [`src/lib/db`](src/lib/db). `src/lib/db/schema.ts` defines the `sites` table plus re-exports
  Better Auth's own tables from `auth-schema.ts`. Migrations live in [`drizzle/`](drizzle).
- **Auth**: Better Auth (`better-auth`) via GitHub OAuth only, wired in
  [`src/lib/db/auth.ts`](src/lib/db/auth.ts) and mounted in
  [`src/hooks.server.ts`](src/hooks.server.ts). Single-admin gate: any account whose email isn't
  `ADMIN_EMAIL` is rejected in a `validateUserInfo` hook — this runs on every login, not just
  sign-up, so don't bypass it when touching auth flow.
- **File storage**: R2 bucket (binding `BUCKET`) for uploaded site images, handled in
  [`src/lib/server/site-image.ts`](src/lib/server/site-image.ts) (validates size/dimensions/format
  via [`image-format.ts`](src/lib/server/image-format.ts)) and served through
  [`src/routes/uploads/[...key]/+server.ts`](src/routes/uploads/%5B...key%5D/+server.ts).
- **Error monitoring**: Sentry (`@sentry/sveltekit`), initialized in both
  `src/hooks.server.ts`/`src/hooks.client.ts`. DSN comes from a build-time `PUBLIC_SENTRY_DSN` env
  var (`.env`, not `.dev.vars` — it's needed before `platform.env` exists).
- **Routes**: public homepage lists active sites (`src/routes/+page.svelte`); `/sites` is the
  admin CRUD area (list/new/edit), gated by `src/routes/sites/+layout.server.ts`;
  `/login` is the GitHub sign-in page.

## Local env setup

Two separate env files, not interchangeable:

- `.dev.vars` (from [`.dev.vars.example`](.dev.vars.example)) — Wrangler-style secrets proxied
  into `platform.env`: `ADMIN_EMAIL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`,
  `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET`.
- `.env` (from [`.env.example`](.env.example)) — build-time only, currently just
  `PUBLIC_SENTRY_DSN`.

Production secrets are set with `wrangler secret put <NAME>`, not committed anywhere.

## Conventions

- No Prettier — formatting comes from `@antfu/eslint-config`; let `pnpm lint:fix` format rather
  than hand-formatting or introducing another formatter.
- Keep bindings in `wrangler.jsonc` and `src/worker-configuration.d.ts` in sync — edit the former,
  then regenerate the latter with `pnpm cf-typegen` rather than hand-editing it.
- When changing `src/lib/db/schema.ts`, run `pnpm db:generate` to produce the migration, then
  `pnpm db:migrate` locally before it's usable in dev/preview.
