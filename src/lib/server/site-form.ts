export interface SiteFormValues {
  name: string
  href: string
  color: string
  borderColor: string
  hoverBackgroundColor: string
  hoverTextColor: string
  hoverTheme: 'dark' | 'light'
  icon: boolean
  active: boolean
}

export interface SiteFormError {
  error: string
}

export interface ParsedSiteForm {
  values: SiteFormValues
  /**
   * The uploaded image file, if one was chosen. Undefined when the file input was left
   * untouched — browsers omit the filename for an empty file input, so it round-trips
   * through FormData as a plain string rather than a File, not just an empty one.
   * `storeSiteImage` falls back to `currentImage` in that case.
   */
  image?: File
  /** Existing image path carried in a hidden field, so edits can keep it unchanged. */
  currentImage?: string
}

function isValidUrl(value: string) {
  return URL.canParse(value)
}

export async function parseSiteForm(request: Request): Promise<ParsedSiteForm | SiteFormError> {
  const data = await request.formData()
  const name = data.get('name')
  const href = data.get('href')
  const color = data.get('color')
  const borderColor = data.get('borderColor')
  const hoverBackgroundColor = data.get('hoverBackgroundColor')
  const hoverTextColor = data.get('hoverTextColor')
  const hoverTheme = data.get('hoverTheme')
  const image = data.get('image')
  const currentImage = data.get('currentImage')

  if (typeof name !== 'string' || !name.trim()) {
    return { error: 'Name is required.' }
  }
  if (typeof href !== 'string' || !isValidUrl(href)) {
    return { error: 'A valid URL is required.' }
  }
  if (typeof color !== 'string' || !color.trim()) {
    return { error: 'Color is required.' }
  }
  if (typeof borderColor !== 'string' || !borderColor.trim()) {
    return { error: 'Border color is required.' }
  }
  if (typeof hoverBackgroundColor !== 'string' || !hoverBackgroundColor.trim()) {
    return { error: 'Hover background color is required.' }
  }
  if (typeof hoverTextColor !== 'string' || !hoverTextColor.trim()) {
    return { error: 'Hover text color is required.' }
  }
  if (hoverTheme !== 'dark' && hoverTheme !== 'light') {
    return { error: 'Hover theme must be dark or light.' }
  }

  return {
    values: {
      name: name.trim(),
      href,
      color: color.trim(),
      borderColor: borderColor.trim(),
      hoverBackgroundColor: hoverBackgroundColor.trim(),
      hoverTextColor: hoverTextColor.trim(),
      hoverTheme,
      icon: data.get('icon') === 'on',
      active: data.get('active') === 'on',
    },
    image: image instanceof File ? image : undefined,
    currentImage: typeof currentImage === 'string' && currentImage ? currentImage : undefined,
  }
}
