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
  color: text('color').notNull(),
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
