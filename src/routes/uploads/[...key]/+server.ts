import type { RequestHandler } from './$types'
import { error } from '@sveltejs/kit'

// Serves site images uploaded to R2 — see src/lib/server/site-image.ts. Public: these
// are the same logos shown on the homepage, so no auth check.
export const GET: RequestHandler = async ({ params, platform }) => {
  const object = await platform!.env.BUCKET.get(params.key)
  if (!object) {
    throw error(404, 'Not found')
  }

  return new Response(object.body, {
    headers: {
      'content-type': object.httpMetadata?.contentType ?? 'application/octet-stream',
      'etag': object.httpEtag,
      'cache-control': 'public, max-age=31536000, immutable',
    },
  })
}
