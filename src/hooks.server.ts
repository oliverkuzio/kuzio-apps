import type { Handle } from '@sveltejs/kit'
import { building } from '$app/environment'
import { PUBLIC_SENTRY_DSN } from '$env/static/public'
import { createDb } from '$lib/db'
import { createAuth } from '$lib/db/auth'
import * as Sentry from '@sentry/sveltekit'
import { sequence } from '@sveltejs/kit/hooks'
import { svelteKitHandler } from 'better-auth/svelte-kit'

const authHandle: Handle = async ({ event, resolve }) => {
  const db = createDb(event.platform!.env.DB)
  const auth = createAuth(
    db,
    event.platform!.env.BETTER_AUTH_SECRET,
    event.platform!.env.BETTER_AUTH_URL,
    event.platform!.env.ADMIN_EMAIL,
    {
      clientId: event.platform!.env.GITHUB_CLIENT_ID,
      clientSecret: event.platform!.env.GITHUB_CLIENT_SECRET,
    },
  )

  const session = await auth.api.getSession({ headers: event.request.headers })
  event.locals.db = db
  event.locals.user = session?.user ?? null
  event.locals.session = session?.session ?? null

  return svelteKitHandler({ event, resolve, auth, building })
}

export const handle = sequence(
  Sentry.initCloudflareSentryHandle({ dsn: PUBLIC_SENTRY_DSN, tracesSampleRate: 1.0 }),
  Sentry.sentryHandle(),
  authHandle,
)

export const handleError = Sentry.handleErrorWithSentry()
