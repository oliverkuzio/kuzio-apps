<script lang="ts">
	interface Props {
		/** Name of the webapp */
		name: string;
		/** URL of the webapp */
		href: string;
		/** Color of the webapp */
		color: string;
		/** Image URL of the webapp */
		image: string;
		/** Active state of the webapp */
		active: boolean;
	}
	let { name, href, color, image, active }: Props = $props();
</script>

<article class="flex flex-col items-stretch text-center text-white">
	<a href={active ? href : '#'} class="d-block">
		<picture
			class="block aspect-square rounded-full {`bg-${color}`} mb-3 flex w-52 w-52 items-center justify-center p-4"
		>
			<img src={image} alt={name} class="w-48 w-48 rounded-full" />
		</picture>
		<h2 class="text-lg font-semibold">
			<img src={`${href}/favicon.png`} alt={`${name} icon`} class="inline-block w-5 w-5" />
			{name}
		</h2>
	</a>
</article>
