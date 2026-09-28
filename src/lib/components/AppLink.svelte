<script lang='ts'>
  import { hoverTheme as pageHoverTheme } from '$lib/hover-theme.svelte'

  interface Props {
    /** Name of the webapp */
    name: string
    /** URL of the webapp */
    href: string
    /** Background color of the webapp (raw CSS color) */
    color: string
    /** Border color of the webapp (raw CSS color) */
    borderColor: string
    /** Background color applied to the whole page while this app is hovered (raw CSS color) */
    hoverBackgroundColor: string
    /** Text color applied to the whole page while this app is hovered (raw CSS color) */
    hoverTextColor: string
    /** daisyUI theme applied to the whole page while this app is hovered */
    hoverTheme: 'dark' | 'light'
    /** Image URL of the webapp */
    image: string
    /** Icon */
    icon: boolean
    /** Active state of the webapp */
    active: boolean
  }
  const {
    name,
    href,
    color,
    borderColor,
    hoverBackgroundColor,
    hoverTextColor,
    hoverTheme,
    image,
    icon,
    active,
  }: Props = $props()

  function onPointerEnter() {
    pageHoverTheme.set({ background: hoverBackgroundColor, text: hoverTextColor, theme: hoverTheme })
  }

  function onPointerLeave() {
    pageHoverTheme.set(null)
  }
</script>

<article
  class='flex flex-col items-stretch text-left sm:text-center {active ? 'cursor-pointer' : 'cursor-not-allowed'}'
  onpointerenter={onPointerEnter}
  onpointerleave={onPointerLeave}
>
  <a href={active ? href : '#'} class='flex items-center gap-4 sm:block sm:gap-8'>
    <picture
      class='aspect-square rounded-full flex h-16 w-16 shrink-0 items-center justify-center border-4 sm:mb-3 sm:h-48 sm:w-48 sm:border-8'
      style='background-color: {color}; border-color: {borderColor}'
    >
      <img src={image} alt={name} class='h-auto w-full rounded-full sm:w-48' />
    </picture>
    <h2 class='text-lg font-semibold'>
      {#if icon}
        <img src={`${href}/favicon.png`} alt={`${name} icon`} class='inline-block h-5 w-5' />
      {/if}
      {name}
    </h2>
    <!-- A span, not a <button>: interactive elements can't be nested inside the link -->
    <span class='btn btn-primary btn-sm ml-auto sm:hidden {active ? '' : 'btn-disabled'}'>Open</span>
  </a>
</article>
