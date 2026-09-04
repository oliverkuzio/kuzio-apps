<script lang='ts'>
  import type { PageProps } from './$types'
  import { enhance } from '$app/forms'

  const { data, form }: PageProps = $props()
</script>

<svelte:head>
  <title>Manage sites • Kuzio Apps</title>
</svelte:head>

<div class='flex items-center justify-between'>
  <h1 class='text-xl font-semibold'>Manage sites</h1>
  <a href='/sites/new' class='rounded bg-gray-900 px-3 py-2 text-sm text-white'>+ Add site</a>
</div>

{#if form?.error}
  <p class='text-sm text-red-600'>{form.error}</p>
{/if}

{#if data.sites.length === 0}
  <p class='text-sm text-gray-500'>No sites yet.</p>
{:else}
  <ul class='flex flex-col gap-3'>
    {#each data.sites as site (site.id)}
      <li class='flex items-center justify-between gap-4 rounded border p-3'>
        <div>
          <p class='font-medium'>{site.name}</p>
          <p class='text-sm text-gray-500'>{site.href}</p>
          {#if !site.active}
            <p class='text-xs text-gray-400'>Inactive</p>
          {/if}
        </div>
        <div class='flex items-center gap-3 text-sm'>
          <a href={`/sites/${site.id}/edit`} class='underline'>Edit</a>
          <form
            method='POST'
            action='?/delete'
            use:enhance
            onsubmit={(event) => {
              // eslint-disable-next-line no-alert -- simple admin UI, no custom modal needed
              if (!confirm(`Delete ${site.name}?`))
                event.preventDefault()
            }}
          >
            <input type='hidden' name='id' value={site.id} />
            <button type='submit' class='text-red-600 underline'>Delete</button>
          </form>
        </div>
      </li>
    {/each}
  </ul>
{/if}

<a href='/' class='text-sm underline'>‹ Back to home</a>
