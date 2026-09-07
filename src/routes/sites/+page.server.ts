import type { Actions, PageServerLoad } from './$types'
import { sites } from '$lib/db'
import { requireUser } from '$lib/server/require-user'
import { deleteSiteImage } from '$lib/server/site-image'
import { fail } from '@sveltejs/kit'
import { asc, eq } from 'drizzle-orm'

// There's only ever one admin account; any signed-in user manages every site,
// not just the ones they personally created.
export const load: PageServerLoad = async ({ locals, url }) => {
  requireUser(locals.user, url.pathname)
  const allSites = await locals.db.select().from(sites).orderBy(asc(sites.createdAt))
  return { sites: allSites }
}

export const actions: Actions = {
  delete: async ({ request, locals, url, platform }) => {
    requireUser(locals.user, url.pathname)
    const data = await request.formData()
    const id = data.get('id')
    if (typeof id !== 'string' || !id) {
      return fail(400, { error: 'Missing site id.' })
    }

    const [deleted] = await locals.db.delete(sites).where(eq(sites.id, id)).returning()

    if (!deleted) {
      return fail(404, { error: 'Site not found.' })
    }

    await deleteSiteImage(platform!.env.BUCKET, deleted.image)
  },
}
