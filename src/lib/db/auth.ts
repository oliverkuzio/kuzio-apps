import type { Db } from './index'
import { APIError, betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as schema from './schema'

export function createAuth(db: Db, secret: string, adminEmail: string) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema,
    }),
    secret,
    emailAndPassword: {
      enabled: true,
    },
    databaseHooks: {
      user: {
        create: {
          // This app only ever has one admin account. Rejecting at the database layer
          // (rather than just the email/password sign-up route) keeps the restriction in
          // force for any future sign-up method too, e.g. an added OAuth provider.
          before: async (user) => {
            if (user.email !== adminEmail) {
              throw new APIError('FORBIDDEN', {
                message: 'Sign-up is closed. This app only supports a single admin account.',
              })
            }
          },
        },
      },
    },
  })
}

export type Auth = ReturnType<typeof createAuth>
