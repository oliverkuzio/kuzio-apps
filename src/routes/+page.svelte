<script lang='ts'>
  import type { PageProps } from './$types'
  import AppLink from '$lib/components/AppLink.svelte'

  const { data }: PageProps = $props()
</script>

<svelte:head>
  <title>Launch an app from the Kuzio Apps suite • Kuzio Apps</title>
  <meta name='description' content='Launch an app from the Kuzio Apps suite' />
</svelte:head>

<div class='my-auto flex h-full gap-8 flex-col items-stretch justify-around'>
  <nav>
    <ul class='flex flex-row flex-wrap items-center justify-center gap-8'>
      {#each data.sites as site (site.id)}
        <li>
          <AppLink
            name={site.name}
            href={site.href}
            color={site.color}
            borderColor={site.borderColor}
            hoverBackgroundColor={site.hoverBackgroundColor}
            hoverTextColor={site.hoverTextColor}
            image={site.image}
            icon={site.icon}
            active={site.active}
          />
        </li>
      {/each}
    </ul>
  </nav>

  {#if data.user}
    <div class='flex items-center justify-center gap-4 pb-4'>
      <a href='/sites/new' class='btn btn-secondary'>+ Add app</a>
      <a href='/sites' class='btn btn-neutral'>Manage apps</a>
    </div>
  {/if}
</div>
