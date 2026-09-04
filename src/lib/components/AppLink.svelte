<script lang='ts'>
  interface Props {
    /** Name of the webapp */
    name: string
    /** URL of the webapp */
    href: string
    /** Color of the webapp */
    color: string
    /** Image URL of the webapp */
    image: string
    /** Icon */
    icon: boolean
    /** Active state of the webapp */
    active: boolean
  }
  const { name, href, color, image, icon, active }: Props = $props()
</script>

<article class='flex flex-col items-stretch text-center text-white'>
  <a href={active ? href : '#'} class='d-block'>
    <picture
      class='block aspect-square rounded-full {color} mb-3 flex h-52 w-52 items-center justify-center p-4'
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
