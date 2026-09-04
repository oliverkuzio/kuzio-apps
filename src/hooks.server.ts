import type { Handle } from '@sveltejs/kit'
import { building } from '$app/environment'
import { createDb } from '$lib/db'
import { createAuth } from '$lib/db/auth'
import { svelteKitHandler } from 'better-auth/svelte-kit'

export const handle: Handle = async ({ event, resolve }) => {
  const db = createDb(event.platform!.env.DB)
  const auth = createAuth(db, event.platform!.env.BETTER_AUTH_SECRET, event.platform!.env.ADMIN_EMAIL)

  const session = await auth.api.getSession({ headers: event.request.headers })
  event.locals.db = db
  event.locals.user = session?.user ?? null
  event.locals.session = session?.session ?? null

  return svelteKitHandler({ event, resolve, auth, building })
}
