import { relations } from 'drizzle-orm'
import { index, pgTable, text } from 'drizzle-orm/pg-core'
import { users } from '@/auth/schema'

export const posts = pgTable(
  'posts',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => [index('posts_userId_idx').on(table.userId)],
)

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}))
