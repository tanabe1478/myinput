import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { users } from './users';

/**
 * Feeds table
 * Stores RSS feed subscriptions for each user
 */
export const feeds = sqliteTable(
  'feeds',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    title: text('title')
      .notNull(),

    url: text('url')
      .notNull(),

    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),

    lastFetchedAt: integer('last_fetched_at', { mode: 'timestamp' }),

    fetchError: text('fetch_error'),
  },
  (table) => ({
    // Unique constraint: one user cannot subscribe to the same feed URL twice
    userUrlUnique: uniqueIndex('feeds_user_id_url_unique').on(table.userId, table.url),
  })
);

export type Feed = typeof feeds.$inferSelect;
export type NewFeed = typeof feeds.$inferInsert;
