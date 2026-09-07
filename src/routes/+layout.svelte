<script lang='ts'>
  import type { LayoutProps } from './$types'
  import Footer from '$lib/components/Footer.svelte'
  import Header from '$lib/components/Header.svelte'
  import Page from '$lib/components/Page.svelte'
  import '../app.css'

  const { children, data }: LayoutProps = $props()
</script>

<Page>
  <Header user={data.user} />
  <main class='relative flex items-stretch grow flex-col'>
    {@render children?.()}
  </main>
  <Footer />
</Page>
