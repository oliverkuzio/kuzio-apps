export interface SiteFormValues {
  name: string
  href: string
  color: string
  borderColor: string
  hoverBackgroundColor: string
  hoverTextColor: string
  icon: boolean
  active: boolean
}

export interface SiteFormError {
  error: string
}

export interface ParsedSiteForm {
  values: SiteFormValues
  /** The uploaded image file, if one was chosen — see `storeSiteImage`. */
  image: File
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
  if (!(image instanceof File)) {
    return { error: 'An image file is required.' }
  }

  return {
    values: {
      name: name.trim(),
      href,
      color: color.trim(),
      borderColor: borderColor.trim(),
      hoverBackgroundColor: hoverBackgroundColor.trim(),
      hoverTextColor: hoverTextColor.trim(),
      icon: data.get('icon') === 'on',
      active: data.get('active') === 'on',
    },
    image,
    currentImage: typeof currentImage === 'string' && currentImage ? currentImage : undefined,
  }
}
