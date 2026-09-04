import type { PageServerLoad } from './$types'
import { user } from '$lib/db'
import { sql } from 'drizzle-orm'

// Defense-in-depth alongside the ADMIN_EMAIL check in src/lib/db/auth.ts: once an
// account exists, this page stops offering the form even if someone finds the URL.
export const load: PageServerLoad = async ({ locals }) => {
  const [row] = await locals.db.select({ count: sql<number>`count(*)` }).from(user)
  return { alreadySetUp: (row?.count ?? 0) > 0 }
}
