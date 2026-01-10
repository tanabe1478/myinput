import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { feeds } from './feeds';

/**
 * Items table
 * Stores RSS feed items (articles) from feeds
 */
export const items = sqliteTable(
  'items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    feedId: text('feed_id')
      .notNull()
      .references(() => feeds.id, { onDelete: 'cascade' }),

    // Unique identifier from RSS feed (usually GUID or link)
    guid: text('guid')
      .notNull(),

    title: text('title')
      .notNull(),

    link: text('link')
      .notNull(),

    publishedAt: integer('published_at', { mode: 'timestamp' })
      .notNull(),

    summary: text('summary'),

    content: text('content'),

    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    // Unique constraint: one feed cannot have duplicate GUIDs
    feedGuidUnique: uniqueIndex('items_feed_id_guid_unique').on(table.feedId, table.guid),
    // Performance indexes for common queries
    feedIdIdx: index('items_feed_id_idx').on(table.feedId),
    publishedAtIdx: index('items_published_at_idx').on(table.publishedAt),
  })
);

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
