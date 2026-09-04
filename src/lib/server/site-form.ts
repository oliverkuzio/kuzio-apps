export interface SiteFormValues {
  name: string
  href: string
  color: string
  image: string
  icon: boolean
  active: boolean
}

export interface SiteFormError {
  error: string
}

function isValidUrl(value: string) {
  return URL.canParse(value)
}

export async function parseSiteForm(request: Request): Promise<SiteFormValues | SiteFormError> {
  const data = await request.formData()
  const name = data.get('name')
  const href = data.get('href')
  const color = data.get('color')
  const image = data.get('image')

  if (typeof name !== 'string' || !name.trim()) {
    return { error: 'Name is required.' }
  }
  if (typeof href !== 'string' || !isValidUrl(href)) {
    return { error: 'A valid URL is required.' }
  }
  if (typeof color !== 'string' || !color.trim()) {
    return { error: 'Color is required.' }
  }
  if (typeof image !== 'string' || !isValidUrl(image)) {
    return { error: 'A valid image URL is required.' }
  }

  return {
    name: name.trim(),
    href,
    color: color.trim(),
    image,
    icon: data.get('icon') === 'on',
    active: data.get('active') === 'on',
  }
}
