<script lang='ts'>
  import type { PageProps } from './$types'
  import SiteForm from '$lib/components/SiteForm.svelte'

  const { form }: PageProps = $props()
</script>

<svelte:head>
  <title>Add app • Kuzio Apps</title>
</svelte:head>

<h1 class='text-xl font-semibold'>Add app</h1>
<SiteForm submitLabel='Add app' error={form?.error} />

<a href='/sites' class='link text-sm'>‹ Back to your apps</a>
