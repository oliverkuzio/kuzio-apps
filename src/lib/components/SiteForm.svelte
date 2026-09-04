<script lang='ts'>
  import { enhance } from '$app/forms'

  interface Props {
    site?: {
      name: string
      href: string
      color: string
      image: string
      icon: boolean
      active: boolean
    }
    error?: string
    submitLabel: string
    action?: string
  }

  const { site, error, submitLabel, action }: Props = $props()
</script>

<form method='POST' {action} use:enhance class='flex flex-col gap-3'>
  <label class='flex flex-col gap-1 text-sm'>
    Name
    <input class='rounded border p-2' type='text' name='name' value={site?.name ?? ''} required />
  </label>
  <label class='flex flex-col gap-1 text-sm'>
    URL
    <input class='rounded border p-2' type='url' name='href' value={site?.href ?? ''} required />
  </label>
  <label class='flex flex-col gap-1 text-sm'>
    Tailwind background color class
    <input
      class='rounded border p-2'
      type='text'
      name='color'
      placeholder='bg-pink-500'
      value={site?.color ?? ''}
      required
    />
  </label>
  <label class='flex flex-col gap-1 text-sm'>
    Image URL
    <input class='rounded border p-2' type='url' name='image' value={site?.image ?? ''} required />
  </label>
  <label class='flex items-center gap-2 text-sm'>
    <input type='checkbox' name='icon' checked={site?.icon ?? false} />
    Show favicon next to name
  </label>
  <label class='flex items-center gap-2 text-sm'>
    <input type='checkbox' name='active' checked={site?.active ?? true} />
    Active (link is clickable)
  </label>
  {#if error}
    <p class='text-sm text-red-600'>{error}</p>
  {/if}
  <button class='rounded bg-gray-900 p-2 text-white' type='submit'>{submitLabel}</button>
</form>
