import antfu from '@antfu/eslint-config'

export default antfu(
  {
    svelte: true,
    typescript: true,
    ignores: ['drizzle/**'],
  },
  {
    files: ['**/*.svelte'],
    rules: {
      // `export let data` is the standard SvelteKit page-props pattern, not a mutable export bug.
      'import/no-mutable-exports': 'off',
      // Requires SvelteKit's typed-routing `resolve()` helper, which this app doesn't use.
      'svelte/no-navigation-without-resolve': 'off',
    },
  },
  {
    files: ['pnpm-workspace.yaml'],
    rules: {
      // Enforces supply-chain policy settings unrelated to this repo's config; not a formatting concern.
      'pnpm/yaml-enforce-settings': 'off',
    },
  },
)
