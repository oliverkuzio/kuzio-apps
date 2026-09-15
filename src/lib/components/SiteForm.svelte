<script lang='ts'>
  import { enhance } from '$app/forms'
  import { hoverTheme } from '$lib/hover-theme.svelte'
  import { onDestroy, untrack } from 'svelte'

  interface Props {
    site?: {
      name: string
      href: string
      color: string
      borderColor: string
      hoverBackgroundColor: string
      hoverTextColor: string
      hoverTheme: 'dark' | 'light'
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
  let previewHoverBackgroundColor = $state(initialSite?.hoverBackgroundColor ?? '')
  let previewHoverTextColor = $state(initialSite?.hoverTextColor ?? '')
  let previewHoverTheme = $state<'dark' | 'light'>(initialSite?.hoverTheme ?? 'dark')
  let previewImage = $state(initialSite?.image ?? '')
  let previewObjectUrl: string | undefined

  // Hovering the icon preview retheme the actual page the same way a real AppLink
  // would, so the admin can check the combination before submitting.
  function onPreviewPointerEnter() {
    hoverTheme.set({
      background: previewHoverBackgroundColor,
      text: previewHoverTextColor,
      theme: previewHoverTheme,
    })
  }

  function onPreviewPointerLeave() {
    hoverTheme.set(null)
  }

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
    hoverTheme.set(null)
    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl)
    }
  })
</script>

<form method='POST' {action} enctype='multipart/form-data' use:enhance class='flex flex-col max-w-4xl gap-3'>
  <fieldset class='fieldset'>
    <legend class='fieldset-legend'>Name</legend>
    <input class='input w-full' type='text' name='name' value={site?.name ?? ''} required />
  </fieldset>
  <fieldset class='fieldset'>
    <legend class='fieldset-legend'>URL</legend>
    <input class='input w-full' type='url' name='href' value={site?.href ?? ''} required />
  </fieldset>
  <fieldset class='fieldset'>
    <legend class='fieldset-legend'>Background color</legend>
    <input
      class='input w-full'
      type='text'
      name='color'
      placeholder='#ec4899 / rgb(236 72 153) / oklch(65% 0.24 354)'
      bind:value={previewColor}
      required
    />
  </fieldset>
  <fieldset class='fieldset'>
    <legend class='fieldset-legend'>Border color</legend>
    <input
      class='input w-full'
      type='text'
      name='borderColor'
      placeholder='#9d174d'
      bind:value={previewBorderColor}
      required
    />
  </fieldset>
  <fieldset class='fieldset'>
    <legend class='fieldset-legend'>Hover background color</legend>
    <input
      class='input w-full'
      type='text'
      name='hoverBackgroundColor'
      placeholder='#500724'
      bind:value={previewHoverBackgroundColor}
      required
    />
    <p class='label whitespace-normal'>Applied to the whole page background while this app is hovered.</p>
  </fieldset>
  <fieldset class='fieldset'>
    <legend class='fieldset-legend'>Hover text color</legend>
    <input
      class='input w-full'
      type='text'
      name='hoverTextColor'
      placeholder='#fdf2f8'
      bind:value={previewHoverTextColor}
      required
    />
    <p class='label whitespace-normal'>Applied to the whole page text while this app is hovered.</p>
  </fieldset>
  <fieldset class='fieldset'>
    <legend class='fieldset-legend'>Hover theme</legend>
    <select class='select w-full' name='hoverTheme' bind:value={previewHoverTheme} required>
      <option value='dark'>Dark</option>
      <option value='light'>Light</option>
    </select>
    <p class='label whitespace-normal'>
      Applied to the whole page while this app is hovered, so other components (not just the text
      color above) keep good contrast against the hover background color.
    </p>
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
    <p class='label whitespace-normal'>
      WEBP, JPG, or PNG. 512×512 or smaller, under 1MB.
      {#if site?.image}Leave empty to keep the current image.{/if}
    </p>
  </fieldset>

  <div
    class='flex flex-col gap-2'
    role='presentation'
    onpointerenter={onPreviewPointerEnter}
    onpointerleave={onPreviewPointerLeave}
  >
    <p class='text-sm opacity-70'>Icon preview (hover it to preview the page-wide hover colors):</p>
    <picture
      class='flex h-28 w-28 cursor-pointer items-center justify-center rounded-full border-8'
      style='background-color: {previewColor}; border-color: {previewBorderColor}'
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
  <button class='btn btn-primary w-auto' type='submit'>{submitLabel}</button>
</form>
