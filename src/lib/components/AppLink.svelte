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
  class='flex flex-col items-stretch text-center {active ? 'cursor-pointer' : 'cursor-not-allowed'}'
  onpointerenter={onPointerEnter}
  onpointerleave={onPointerLeave}
>
  <a href={active ? href : '#'} class='block'>
    <picture
      class='aspect-square rounded-full mb-3 flex h-48 w-48 items-center justify-center border-8'
      style='background-color: {color}; border-color: {borderColor}'
    >
      <img src={image} alt={name} class='h-auto w-48 rounded-full' />
    </picture>
    <h2 class='text-lg font-semibold'>
      {#if icon}
        <img src={`${href}/favicon.png`} alt={`${name} icon`} class='inline-block h-5 w-5' />
      {/if}
      {name}
    </h2>
  </a>
</article>
