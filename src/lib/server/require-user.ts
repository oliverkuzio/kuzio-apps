import type { User } from 'better-auth'
import { redirect } from '@sveltejs/kit'

// Load functions guard pages against unauthenticated GET navigation, but actions run
// independently of a route's load functions, so every /sites action must call this too.
export function requireUser(user: User | null, redirectFrom: string): User {
  if (!user) {
    throw redirect(303, `/login?redirectTo=${encodeURIComponent(redirectFrom)}`)
  }
  return user
}
