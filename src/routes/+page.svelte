<script lang="ts">
	import AppLink from '$lib/components/AppLink.svelte';
	type ItemType = {
		name: string;
		href: string;
		color: string;
		image: string;
		icon: boolean;
		active: boolean;
	};

	let items: ItemType[] = [
		{
			name: 'Baby Sign',
			href: 'https://babysign.kuzio.app',
			color: 'bg-pink-500',
			image:
				'https://res.cloudinary.com/spiralyze/image/upload/f_auto,w_auto/BabySignLanguage/DictionaryPages/hello.svg',
			icon: true,
			active: true
		},
		{
			name: 'Travel Log',
			href: 'https://travel.kuzio.app',
			color: 'bg-teal-600',
			image: 'https://cdn-icons-png.flaticon.com/512/201/201623.png',
			icon: false,
			active: true
		}
	];
</script>

<svelte:head>
	<title>Launch an app from the Kuzio Apps suite • Kuzio Apps</title>
	<meta name="description" content="Launch an app from the Kuzio Apps suite" />
</svelte:head>

<div class="my-auto flex h-full flex-col items-stretch justify-around">
	<nav>
		<ul class="flex flex-row flex-wrap items-center justify-center gap-4">
			{#if items.length > 0}
				{#each items as item (item.href.replace(/http:\/\/|https:\/\//gi, ''))}
					<li>
						<AppLink
							name={item.name}
							href={item.href}
							color={item.color}
							image={item.image}
							icon={item.icon}
							active={item.active}
						/>
					</li>
				{/each}
			{/if}
		</ul>
	</nav>
</div>
