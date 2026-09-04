<script lang='ts'>
  import type { PageProps } from './$types'
  import AppLink from '$lib/components/AppLink.svelte'

  const { data }: PageProps = $props()
</script>

<svelte:head>
  <title>Launch an app from the Kuzio Apps suite • Kuzio Apps</title>
  <meta name='description' content='Launch an app from the Kuzio Apps suite' />
</svelte:head>

<div class='my-auto flex h-full flex-col items-stretch justify-around'>
  <nav>
    <ul class='flex flex-row flex-wrap items-center justify-center gap-4'>
      {#each data.sites as site (site.id)}
        <li>
          <AppLink
            name={site.name}
            href={site.href}
            color={site.color}
            image={site.image}
            icon={site.icon}
            active={site.active}
          />
        </li>
      {/each}
    </ul>
  </nav>

  {#if data.user}
    <div class='flex justify-center gap-4 pb-4 text-sm'>
      <a href='/sites/new' class='rounded bg-gray-900 px-4 py-2 text-white'>+ Add site</a>
      <a href='/sites' class='self-center underline'>Manage sites</a>
    </div>
  {/if}
</div>
