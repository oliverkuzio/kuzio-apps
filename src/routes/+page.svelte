<script lang="ts">
	import AppLink from '$lib/components/AppLink.svelte';

	let items = [
		{
			name: 'Baby Sign',
			href: 'https://babysign.kuzio.app',
			color: 'pink-500',
			image:
				'https://res.cloudinary.com/spiralyze/image/upload/f_auto,w_auto/BabySignLanguage/DictionaryPages/hello.svg',
			active: true
		}
	];
</script>

<div class="my-auto flex h-full flex-col items-stretch justify-around">
	<h1 class="-mt-32 mb-16 text-center text-3xl font-bold">Choose an application:</h1>
	<nav>
		<ul class="mt-4 flex flex-col items-center justify-center">
			{#if items.length > 0}
				{#each items as item (item.href.replace(/http:\/\/|https:\/\//gi, ''))}
					<li>
						<AppLink
							name={item.name}
							href={item.href}
							color={item.color}
							image={item.image}
							active={item.active}
						/>
					</li>
				{/each}
			{/if}
		</ul>
	</nav>
</div>
