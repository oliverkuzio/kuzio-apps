<script lang='ts'>
  import { hoverTheme } from '$lib/hover-theme.svelte'

  const { children } = $props()
</script>

<article
  class='flex min-h-screen flex-col items-stretch bg-base-100 text-base-content transition-colors duration-300'
  data-theme={hoverTheme.current?.theme}
  style={hoverTheme.current
    ? `--color-base-100: ${hoverTheme.current.background}; --color-base-content: ${hoverTheme.current.text}`
    : undefined}
>
  {@render children()}
</article>
