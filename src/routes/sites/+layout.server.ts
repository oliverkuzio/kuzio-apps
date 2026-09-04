import type { LayoutServerLoad } from './$types'
import { requireUser } from '$lib/server/require-user'

export const load: LayoutServerLoad = async ({ locals, url }) => {
  requireUser(locals.user, url.pathname)
}
