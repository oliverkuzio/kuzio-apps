<script lang='ts'>
  import type { PageProps } from './$types'
  import { goto } from '$app/navigation'
  import { authClient } from '$lib/auth-client'

  const { data }: PageProps = $props()

  let name = $state('')
  let email = $state('')
  let password = $state('')
  let error = $state('')

  async function submit(event: SubmitEvent) {
    event.preventDefault()
    error = ''

    const { error: authError } = await authClient.signUp.email({ name, email, password })

    if (authError) {
      error = authError.message ?? 'Something went wrong'
      return
    }

    await goto('/', { invalidateAll: true })
  }
</script>

<svelte:head>
  <title>Set up admin account • Kuzio Apps</title>
</svelte:head>

<div class='mx-auto flex w-full max-w-sm flex-col gap-4 p-8'>
  {#if data.alreadySetUp}
    <p class='text-center text-sm text-gray-500'>
      Setup is already complete. <a href='/login' class='underline'>Sign in</a> instead.
    </p>
  {:else}
    <h1 class='text-center text-xl font-semibold'>Create the admin account</h1>
    <p class='text-center text-sm text-gray-500'>
      This only works once, and only for the email set as <code>ADMIN_EMAIL</code>.
    </p>

    <form class='flex flex-col gap-3' onsubmit={submit}>
      <input
        class='rounded border p-2'
        type='text'
        placeholder='Name'
        bind:value={name}
        required
      />
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
      <button class='rounded bg-gray-900 p-2 text-white' type='submit'>Create account</button>
    </form>
  {/if}
</div>
