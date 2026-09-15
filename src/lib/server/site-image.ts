import { detectImage } from './image-format'

const MAX_BYTES = 1024 * 1024
const MAX_DIMENSION = 512
const UPLOAD_PREFIX = 'sites/'

export interface SiteImageError {
  error: string
}

function pathToKey(path: string) {
  return path.replace(/^\/uploads\//, '')
}

/**
 * Validates and stores a site image upload in R2, returning the `/uploads/...` path
 * to serve it from. If no new file was chosen, falls back to `currentImage` (edit
 * forms let you leave the image untouched) — replacing an image deletes the old
 * object so uploads don't pile up.
 */
export async function storeSiteImage(
  bucket: R2Bucket,
  file: File | undefined,
  currentImage?: string,
): Promise<string | SiteImageError> {
  const noFileChosen = !file || (file.size === 0 && file.name === '')
  if (noFileChosen) {
    return currentImage ?? { error: 'An image file is required.' }
  }

  if (file.size > MAX_BYTES) {
    return { error: 'Image must be under 1MB.' }
  }

  const bytes = new Uint8Array(await file.arrayBuffer())
  const image = detectImage(bytes)
  if (!image) {
    return { error: 'Image must be a .webp, .jpg, or .png file.' }
  }
  if (image.width > MAX_DIMENSION || image.height > MAX_DIMENSION) {
    return {
      error: `Image must be ${MAX_DIMENSION}×${MAX_DIMENSION} pixels or smaller `
        + `(this one is ${image.width}×${image.height}).`,
    }
  }

  const key = `${UPLOAD_PREFIX}${crypto.randomUUID()}.${image.extension}`
  await bucket.put(key, bytes, { httpMetadata: { contentType: image.contentType } })

  if (currentImage) {
    await deleteSiteImage(bucket, currentImage)
  }

  return `/uploads/${key}`
}

export async function deleteSiteImage(bucket: R2Bucket, image: string) {
  // Best-effort cleanup — a failed delete shouldn't block the site update/delete itself.
  await bucket.delete(pathToKey(image)).catch(() => {})
}
