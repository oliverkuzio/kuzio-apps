import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { user } from './auth-schema'

export * from './auth-schema'

// Mirrors the ItemType shape from src/routes/+page.svelte and is public on the homepage
// regardless of who created it — there's only ever one admin account, so `userId` just
// records who created the row rather than scoping visibility or edit access.
export const sites = sqliteTable('sites', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  href: text('href').notNull(),
  // Raw CSS colors (hex, rgb, oklch, ...), applied as inline styles/CSS var overrides — see
  // AppLink.svelte and Page.svelte.
  color: text('color').notNull(),
  // Falls back to an invisible border for sites created before this field existed.
  borderColor: text('border_color').notNull().default('transparent'),
  // Page-wide background override applied while this site's AppLink is hovered — see Page.svelte.
  hoverBackgroundColor: text('hover_background_color').notNull().default('#d4d4d8'),
  // Overrides --color-base-content the same way hoverBackgroundColor overrides the base
  // background var — see Page.svelte.
  hoverTextColor: text('hover_text_color').notNull().default('#000000'),
  // daisyUI theme ('dark'/'light') applied page-wide while hovered, so all component tokens
  // (not just text) get contrast appropriate for the custom hover colors above.
  hoverTheme: text('hover_theme', { enum: ['dark', 'light'] }).notNull().default('dark'),
  image: text('image').notNull(),
  icon: integer('icon', { mode: 'boolean' }).notNull().default(false),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export type Site = typeof sites.$inferSelect
export type NewSite = typeof sites.$inferInsert
