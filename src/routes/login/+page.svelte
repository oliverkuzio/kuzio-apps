<script lang='ts'>
  import { goto } from '$app/navigation'
  import { authClient } from '$lib/auth-client'

  let mode: 'sign-in' | 'sign-up' = $state('sign-in')
  let name = $state('')
  let email = $state('')
  let password = $state('')
  let error = $state('')

  async function submit(event: SubmitEvent) {
    event.preventDefault()
    error = ''

    const { error: authError }
      = mode === 'sign-in'
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ name, email, password })

    if (authError) {
      error = authError.message ?? 'Something went wrong'
      return
    }

    await goto('/', { invalidateAll: true })
  }
</script>

<svelte:head>
  <title>Sign in • Kuzio Apps</title>
</svelte:head>

<div class='mx-auto flex w-full max-w-sm flex-col gap-4 p-8'>
  <div class='flex justify-center gap-4 text-sm'>
    <button
      class:underline={mode === 'sign-in'}
      onclick={() => (mode = 'sign-in')}
      type='button'>Sign in</button
    >
    <button
      class:underline={mode === 'sign-up'}
      onclick={() => (mode = 'sign-up')}
      type='button'>Sign up</button
    >
  </div>

  <form class='flex flex-col gap-3' onsubmit={submit}>
    {#if mode === 'sign-up'}
      <input
        class='rounded border p-2'
        type='text'
        placeholder='Name'
        bind:value={name}
        required
      />
    {/if}
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
    <button class='rounded bg-gray-900 p-2 text-white' type='submit'>
      {mode === 'sign-in' ? 'Sign in' : 'Sign up'}
    </button>
  </form>
</div>
