<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Page from '$lib/components/Page.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<Page>
	<Header />
	<main class="relative flex grow flex-col items-stretch">
		{@render children?.()}
	</main>
	<Footer />
</Page>
