<script lang='ts'>
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { authClient } from '$lib/auth-client'

  let email = $state('')
  let password = $state('')
  let error = $state('')

  async function submit(event: SubmitEvent) {
    event.preventDefault()
    error = ''

    const { error: authError } = await authClient.signIn.email({ email, password })

    if (authError) {
      error = authError.message ?? 'Something went wrong'
      return
    }

    const redirectTo = page.url.searchParams.get('redirectTo') ?? '/'
    await goto(redirectTo, { invalidateAll: true })
  }
</script>

<svelte:head>
  <title>Sign in • Kuzio Apps</title>
</svelte:head>

<div class='mx-auto flex w-full max-w-sm flex-col gap-4 p-8'>
  <h1 class='text-center text-xl font-semibold'>Sign in</h1>

  <form class='flex flex-col gap-3' onsubmit={submit}>
    <input
      class='rounded border p-2'
      type='email'
      placeholder='Email'
      bind:value={email}
      required
    />
    <input
      class='rounded border p-2'
      type='password'
      placeholder='Password'
      bind:value={password}
      required
      minlength='8'
    />
    {#if error}
      <p class='text-sm text-red-600'>{error}</p>
    {/if}
    <button class='rounded bg-gray-900 p-2 text-white' type='submit'>Sign in</button>
  </form>
</div>
