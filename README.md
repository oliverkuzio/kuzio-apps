# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Database & auth

Data lives in a Cloudflare D1 database (binding `DB`), with schema and queries managed by
[Drizzle](https://orm.drizzle.team) under [`src/lib/db`](src/lib/db). User accounts are handled by
[Better Auth](https://www.better-auth.com) (email/password), with its core tables and a
project-specific `sites` entity (mirroring the `ItemType` shape from the homepage) both defined in
[`src/lib/db/schema.ts`](src/lib/db/schema.ts). File uploads go to an R2 bucket (binding `BUCKET`).

This app only ever has one admin account: sign-up is rejected for any email other than the one set
in the `ADMIN_EMAIL` env var (a database hook in [`src/lib/db/auth.ts`](src/lib/db/auth.ts)
enforces this, so it holds for any sign-up method, not just email/password). Set it locally in
`.dev.vars` and in production with `wrangler secret put ADMIN_EMAIL`. Any signed-in user can manage
every site under `/sites` — there's no per-user ownership, since only the one admin is expected to
ever sign in.

- `pnpm db:generate` — generate a SQL migration from schema changes
- `pnpm db:migrate` — apply migrations to the local D1 replica (used by `pnpm dev`/`pnpm preview`)
- `pnpm db:migrate:remote` — apply migrations to the production D1 database
- `pnpm db:studio` — browse the database with Drizzle Studio

## Linting

Formatting and linting are both handled by [`@antfu/eslint-config`](https://github.com/antfu/eslint-config)
(no Prettier). `pnpm lint` checks the project and `pnpm lint:fix` applies fixes; the same check
also runs in CI via [`.github/workflows/lint.yml`](.github/workflows/lint.yml). A Husky
`pre-commit` hook runs `lint-staged`, which lints staged files before each commit.
