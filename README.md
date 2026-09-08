# kuzio-apps

A [SvelteKit](https://svelte.dev/docs/kit) app deployed to [Cloudflare Workers](https://developers.cloudflare.com/workers/)
via [`@sveltejs/adapter-cloudflare`](https://svelte.dev/docs/kit/adapter-cloudflare), styled with
[Tailwind CSS](https://tailwindcss.com) and [daisyUI](https://daisyui.com) components.

## Developing

Install dependencies with `pnpm install`, then start a development server:

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

## Building

To create a production version of the app:

```bash
pnpm build
```

You can preview the production build (via `wrangler dev`) with `pnpm preview`.

To deploy to Cloudflare Workers:

```bash
pnpm deploy
```

## Cloudflare integrations

This app runs entirely on Cloudflare Workers, configured in [`wrangler.jsonc`](wrangler.jsonc):

- **D1** — the app's SQL database (binding `DB`), see [Database & auth](#database--auth) below.
- **R2** — object storage for uploaded site images (binding `BUCKET`), used by
  [`src/lib/server/site-image.ts`](src/lib/server/site-image.ts) and served back out via
  [`src/routes/uploads/[...key]`](src/routes/uploads/%5B...key%5D/+server.ts).
- **Workers Assets** — static asset serving (binding `ASSETS`).
- **nodejs_compat** — enabled since Better Auth pulls in Node built-ins (`node:crypto`, `node:fs`,
  `node:path`, `node:os`) that Workers doesn't provide otherwise.
- **Observability** — enabled for request/error logging in the Cloudflare dashboard.

Run `pnpm cf-typegen` after changing bindings in `wrangler.jsonc` to regenerate
`src/worker-configuration.d.ts`.

## Database & auth

Data lives in a Cloudflare D1 database (binding `DB`), with schema and queries managed by
[Drizzle](https://orm.drizzle.team) under [`src/lib/db`](src/lib/db). User accounts are handled by
[Better Auth](https://www.better-auth.com) via GitHub OAuth, with its core tables and a
project-specific `sites` entity (mirroring the `ItemType` shape from the homepage) both defined in
[`src/lib/db/schema.ts`](src/lib/db/schema.ts). File uploads go to an R2 bucket (binding `BUCKET`).

This app only ever has one admin account: signing in is rejected for any GitHub account whose email
isn't the one set in the `ADMIN_EMAIL` env var. That's enforced by a `validateUserInfo` hook in
[`src/lib/db/auth.ts`](src/lib/db/auth.ts), which Better Auth calls on every account creation,
account link, and OAuth sign-in — so it holds even if a future auth method is added, and re-checks
on every login rather than just once at sign-up. Any signed-in user can manage every site under
`/sites` — there's no per-user ownership, since only the one admin is expected to ever sign in.

Set `ADMIN_EMAIL` and a GitHub OAuth App's `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET` locally in
`.dev.vars` (see [`.dev.vars.example`](.dev.vars.example)) and in production with
`wrangler secret put <NAME>`. Create the OAuth App at
[github.com/settings/developers](https://github.com/settings/developers) with its callback URL set
to `<origin>/api/auth/callback/github`. Signing in with that GitHub account is all that's needed —
there's no separate sign-up step.

- `pnpm db:generate` — generate a SQL migration from schema changes
- `pnpm db:migrate` — apply migrations to the local D1 replica (used by `pnpm dev`/`pnpm preview`)
- `pnpm db:migrate:remote` — apply migrations to the production D1 database
- `pnpm db:studio` — browse the database with Drizzle Studio

## Error monitoring

Errors and performance traces are reported to [Sentry](https://sentry.io) via
[`@sentry/sveltekit`](https://docs.sentry.io/platforms/javascript/guides/sveltekit/), wired up in
[`src/hooks.server.ts`](src/hooks.server.ts) and [`src/hooks.client.ts`](src/hooks.client.ts).

The DSN is needed at module-evaluation time (before `platform.env` is available), so it's read as a
build-time `PUBLIC_SENTRY_DSN` env var rather than a Cloudflare binding — set it in `.env` locally
(see [`.env.example`](.env.example)) and wherever `pnpm build`/`pnpm deploy` runs (CI or your
machine). A DSN isn't a secret, so it's safe to commit to build logs/config.

## Linting

Formatting and linting are both handled by [`@antfu/eslint-config`](https://github.com/antfu/eslint-config)
(no Prettier). `pnpm lint` checks the project and `pnpm lint:fix` applies fixes; the same check
also runs in CI via [`.github/workflows/lint.yml`](.github/workflows/lint.yml). A Husky
`pre-commit` hook runs `lint-staged`, which lints staged files before each commit.

## Testing

Unit tests run with [Vitest](https://vitest.dev) (`pnpm test:unit`) and end-to-end tests with
[Playwright](https://playwright.dev) (`pnpm test:e2e`); `pnpm test` runs both.
