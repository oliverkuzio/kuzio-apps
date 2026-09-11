<script lang='ts'>
  import { hoverTheme } from '$lib/hover-theme.svelte'

  const { children } = $props()
</script>

<article
  class='flex min-h-screen flex-col items-stretch transition-colors duration-300 {hoverTheme.current?.background ?? 'bg-base-300'} {hoverTheme.current?.text ?? 'text-base-content'}'
>
  {@render children()}
</article>
