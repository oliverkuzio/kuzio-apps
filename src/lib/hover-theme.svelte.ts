// Shared, page-wide hover state: an AppLink sets this on pointer enter/leave so
// Page.svelte — several components up the tree — can re-theme the article that
// wraps the whole page. A module-level rune (rather than context) because Page.svelte
// and every AppLink live in unrelated parts of the component tree, not an ancestor
// chain a Svelte context could bridge.
export interface HoverTheme {
  background: string
  text: string
}

let current = $state<HoverTheme | null>(null)

export const hoverTheme = {
  get current() {
    return current
  },
  set(theme: HoverTheme | null) {
    current = theme
  },
}
