<script lang='ts'>
  import type { PageProps } from './$types'
  import SiteForm from '$lib/components/SiteForm.svelte'

  const { form }: PageProps = $props()
</script>

<svelte:head>
  <title>Add site • Kuzio Apps</title>
</svelte:head>

<h1 class='text-xl font-semibold'>Add site</h1>
<SiteForm submitLabel='Add site' error={form?.error} />

<a href='/sites' class='link text-sm'>‹ Back to your sites</a>
