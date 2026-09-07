import type { Actions } from './$types'
import { sites } from '$lib/db'
import { requireUser } from '$lib/server/require-user'
import { parseSiteForm } from '$lib/server/site-form'
import { storeSiteImage } from '$lib/server/site-image'
import { fail, redirect } from '@sveltejs/kit'

export const actions: Actions = {
  default: async ({ request, locals, url, platform }) => {
    const user = requireUser(locals.user, url.pathname)
    const parsed = await parseSiteForm(request)
    if ('error' in parsed) {
      return fail(400, { error: parsed.error })
    }

    const image = await storeSiteImage(platform!.env.BUCKET, parsed.image)
    if (typeof image !== 'string') {
      return fail(400, { error: image.error })
    }

    await locals.db.insert(sites).values({ ...parsed.values, image, userId: user.id })
    throw redirect(303, '/sites')
  },
}
