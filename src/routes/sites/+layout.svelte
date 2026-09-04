<script lang='ts'>
  const { children } = $props()
</script>

<div class='mx-auto flex w-full max-w-2xl flex-col gap-6 p-8'>
  {@render children()}
</div>
