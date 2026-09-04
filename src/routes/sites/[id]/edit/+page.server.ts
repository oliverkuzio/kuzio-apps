import type { Actions, PageServerLoad } from './$types'
import { sites } from '$lib/db'
import { requireUser } from '$lib/server/require-user'
import { parseSiteForm } from '$lib/server/site-form'
import { error, fail, redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

// There's only ever one admin account; any signed-in user manages every site,
// not just the ones they personally created.
export const load: PageServerLoad = async ({ params, locals, url }) => {
  requireUser(locals.user, url.pathname)
  const [site] = await locals.db.select().from(sites).where(eq(sites.id, params.id))

  if (!site) {
    throw error(404, 'Site not found')
  }

  return { site }
}

export const actions: Actions = {
  update: async ({ request, params, locals, url }) => {
    requireUser(locals.user, url.pathname)
    const values = await parseSiteForm(request)
    if ('error' in values) {
      return fail(400, { error: values.error })
    }

    const [updated] = await locals.db
      .update(sites)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(sites.id, params.id))
      .returning()

    if (!updated) {
      return fail(404, { error: 'Site not found.' })
    }

    throw redirect(303, '/sites')
  },
  delete: async ({ params, locals, url }) => {
    requireUser(locals.user, url.pathname)
    const [deleted] = await locals.db.delete(sites).where(eq(sites.id, params.id)).returning()

    if (!deleted) {
      return fail(404, { error: 'Site not found.' })
    }

    throw redirect(303, '/sites')
  },
}
