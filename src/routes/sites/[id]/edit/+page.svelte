<script lang='ts'>
  import type { PageProps } from './$types'
  import SiteForm from '$lib/components/SiteForm.svelte'

  const { data, form }: PageProps = $props()
</script>

<svelte:head>
  <title>Edit {data.site.name} • Kuzio Apps</title>
</svelte:head>

<h1 class='text-xl font-semibold'>Edit site</h1>
<SiteForm site={data.site} submitLabel='Save changes' error={form?.error} action='?/update' />

<form
  method='POST'
  action='?/delete'
  onsubmit={(event) => {
    // eslint-disable-next-line no-alert -- simple admin UI, no custom modal needed
    if (!confirm(`Delete ${data.site.name}?`))
      event.preventDefault()
  }}
>
  <button type='submit' class='text-sm text-red-600 underline'>Delete site</button>
</form>

<a href='/sites' class='text-sm underline'>‹ Back to your sites</a>
