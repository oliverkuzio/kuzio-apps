<script lang='ts'>
  const { children } = $props()
</script>

<article class='flex min-h-screen flex-col items-stretch bg-gray-900 text-white'>
  {@render children()}
</article>
