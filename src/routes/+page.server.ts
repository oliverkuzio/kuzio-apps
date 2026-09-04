import type { PageServerLoad } from './$types'
import { sites } from '$lib/db'
import { asc } from 'drizzle-orm'

export const load: PageServerLoad = async ({ locals }) => {
  const allSites = await locals.db.select().from(sites).orderBy(asc(sites.createdAt))
  return { sites: allSites }
}
