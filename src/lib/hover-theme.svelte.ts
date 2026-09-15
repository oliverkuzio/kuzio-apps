// Shared, page-wide hover state: an AppLink sets this on pointer enter/leave so
// Page.svelte — several components up the tree — can re-theme the article that
// wraps the whole page. A module-level rune (rather than context) because Page.svelte
// and every AppLink live in unrelated parts of the component tree, not an ancestor
// chain a Svelte context could bridge.
export interface HoverTheme {
  /** Raw CSS color, overrides the base background var on the hovered page. */
  background: string
  /** Raw CSS color, overrides --color-base-content on the hovered page. */
  text: string
  /** daisyUI theme to switch to, so all component tokens (not just text) get contrast. */
  theme: 'dark' | 'light'
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
