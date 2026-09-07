import type { Db } from './index'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import * as schema from './schema'

export function createAuth(
  db: Db,
  secret: string,
  baseURL: string,
  adminEmail: string,
  github: { clientId: string, clientSecret: string },
) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema,
    }),
    secret,
    baseURL,
    socialProviders: {
      github,
    },
    user: {
      // This app only ever has one admin account. Gating identities here (rather than
      // just a specific sign-up route) covers account creation, account linking, and
      // every OAuth sign-in — so it stays correct even if the GitHub account's email
      // ever changes, and for any auth method added later.
      validateUserInfo: async ({ user }) => {
        if (user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
          return {
            error: 'not_admin',
            errorDescription: 'This app only supports a single admin account.',
          }
        }
      },
    },
  })
}

export type Auth = ReturnType<typeof createAuth>
