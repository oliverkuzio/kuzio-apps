import type { Actions } from './$types'
import { sites } from '$lib/db'
import { requireUser } from '$lib/server/require-user'
import { parseSiteForm } from '$lib/server/site-form'
import { fail, redirect } from '@sveltejs/kit'

export const actions: Actions = {
  default: async ({ request, locals, url }) => {
    const user = requireUser(locals.user, url.pathname)
    const values = await parseSiteForm(request)
    if ('error' in values) {
      return fail(400, { error: values.error })
    }

    await locals.db.insert(sites).values({ ...values, userId: user.id })
    throw redirect(303, '/sites')
  },
}
