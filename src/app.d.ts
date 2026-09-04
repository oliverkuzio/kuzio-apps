// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session, User } from 'better-auth'

declare global {
  // Secrets set via `wrangler secret put` / .dev.vars aren't declared in wrangler.jsonc,
  // so they're added to the generated Env type here instead.
  interface Env {
    BETTER_AUTH_SECRET: string
  }

  namespace App {
    interface Locals {
      user: User | null
      session: Session | null
    }
    interface Platform {
      env: Env
      cf: CfProperties
      ctx: ExecutionContext
    }
  }
}

export {}
