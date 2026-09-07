<script lang='ts'>
  import { enhance } from '$app/forms'
  import { onDestroy, untrack } from 'svelte'

  interface Props {
    site?: {
      name: string
      href: string
      color: string
      borderColor: string
      image: string
      icon: boolean
      active: boolean
    }
    error?: string
    submitLabel: string
    action?: string
  }

  const { site, error, submitLabel, action }: Props = $props()

  // Live preview — mirrors AppLink.svelte's rendering so the admin can check the
  // icon looks right before submitting. Snapshotted once: `site` doesn't change
  // during this component's lifetime (new/edit are separate routes).
  const initialSite = untrack(() => site)
  let previewColor = $state(initialSite?.color ?? '')
  let previewBorderColor = $state(initialSite?.borderColor ?? '')
  let previewImage = $state(initialSite?.image ?? '')
  let previewObjectUrl: string | undefined

  function onImageChange(event: Event) {
    const file = (event.currentTarget as HTMLInputElement).files?.[0]
    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl)
      previewObjectUrl = undefined
    }
    if (file) {
      previewObjectUrl = URL.createObjectURL(file)
      previewImage = previewObjectUrl
    }
    else {
      previewImage = initialSite?.image ?? ''
    }
  }

  onDestroy(() => {
    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl)
    }
  })
</script>

<form method='POST' {action} enctype='multipart/form-data' use:enhance class='flex flex-col gap-3'>
  <fieldset class='fieldset'>
    <legend class='fieldset-legend'>Name</legend>
    <input class='input w-full' type='text' name='name' value={site?.name ?? ''} required />
  </fieldset>
  <fieldset class='fieldset'>
    <legend class='fieldset-legend'>URL</legend>
    <input class='input w-full' type='url' name='href' value={site?.href ?? ''} required />
  </fieldset>
  <fieldset class='fieldset'>
    <legend class='fieldset-legend'>Tailwind background color class</legend>
    <input
      class='input w-full'
      type='text'
      name='color'
      placeholder='bg-pink-500'
      bind:value={previewColor}
      required
    />
  </fieldset>
  <fieldset class='fieldset'>
    <legend class='fieldset-legend'>Tailwind border color class</legend>
    <input
      class='input w-full'
      type='text'
      name='borderColor'
      placeholder='border-pink-700'
      bind:value={previewBorderColor}
      required
    />
  </fieldset>
  <fieldset class='fieldset'>
    <legend class='fieldset-legend'>Image</legend>
    {#if site?.image}
      <div class='flex items-center gap-3'>
        <img src={site.image} alt='' class='h-12 w-12 rounded object-cover' />
        <input type='hidden' name='currentImage' value={site.image} />
      </div>
    {/if}
    <input
      class='file-input w-full'
      type='file'
      name='image'
      accept='image/webp,image/jpeg,image/png'
      required={!site?.image}
      onchange={onImageChange}
    />
    <p class='label'>
      WEBP, JPG, or PNG. 512×512 or smaller, under 1MB.
      {#if site?.image}Leave empty to keep the current image.{/if}
    </p>
  </fieldset>

  <div class='flex flex-col gap-2'>
    <p class='text-sm opacity-70'>Icon preview:</p>
    <picture
      class='flex h-28 w-28 items-center justify-center rounded-full border-8 {previewColor} {previewBorderColor}'
    >
      {#if previewImage}
        <img src={previewImage} alt='' class='h-auto w-28 rounded-full object-cover' />
      {/if}
    </picture>
  </div>
  <label class='label gap-2'>
    <input type='checkbox' class='checkbox' name='icon' checked={site?.icon ?? false} />
    Show favicon next to name
  </label>
  <label class='label gap-2'>
    <input type='checkbox' class='checkbox' name='active' checked={site?.active ?? true} />
    Active (link is clickable)
  </label>
  {#if error}
    <div role='alert' class='alert alert-error text-sm'>{error}</div>
  {/if}
  <button class='btn btn-neutral' type='submit'>{submitLabel}</button>
</form>
