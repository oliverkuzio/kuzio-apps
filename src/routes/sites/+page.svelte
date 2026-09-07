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
  <a href='/sites/new' class='btn btn-neutral btn-sm'>+ Add site</a>
</div>

{#if form?.error}
  <div role='alert' class='alert alert-error text-sm'>{form.error}</div>
{/if}

{#if data.sites.length === 0}
  <p class='text-sm text-gray-500'>No sites yet.</p>
{:else}
  <ul class='list'>
    {#each data.sites as site (site.id)}
      <li class='list-row items-center'>
        <div>
          <p class='font-medium'>{site.name}</p>
          <p class='text-sm text-gray-500'>{site.href}</p>
          {#if !site.active}
            <p class='text-xs text-gray-400'>Inactive</p>
          {/if}
        </div>
        <div class='flex items-center gap-3 text-sm ml-auto'>
          <a href={`/sites/${site.id}/edit`} class='btn btn-sm'>Edit</a>
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
            <button type='submit' class='btn btn-error btn-sm'>Delete</button>
          </form>
        </div>
      </li>
    {/each}
  </ul>
{/if}

<div class='flex items-center justify-start gap-4 pb-4 text-sm'>
  <a href='/' class='btn btn-sm'>‹ Back to home</a>
</div>
