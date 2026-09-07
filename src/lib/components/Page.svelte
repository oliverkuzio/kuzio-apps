<script lang='ts'>
  const { children } = $props()
</script>

<article class='flex min-h-screen flex-col items-stretch bg-base-300 text-base-content'>
  {@render children()}
</article>
