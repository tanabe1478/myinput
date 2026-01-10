import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, real, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { todaySnapshots } from './today-snapshots';
import { items } from './items';
import { TODAY_BUCKET_VALUES } from '../types';

/**
 * Today Snapshot Items table
 * Stores items in each daily snapshot with prioritization metadata
 */
export const todaySnapshotItems = sqliteTable(
  'today_snapshot_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    snapshotId: text('snapshot_id')
      .notNull()
      .references(() => todaySnapshots.id, { onDelete: 'cascade' }),

    itemId: text('item_id')
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }),

    // Bucket: high, medium, low, other
    bucket: text('bucket', { enum: TODAY_BUCKET_VALUES })
      .notNull(),

    // Rank within the bucket (lower = higher priority)
    rankInBucket: integer('rank_in_bucket')
      .notNull(),

    // Relevance score (higher = more relevant)
    score: real('score')
      .notNull(),

    // JSON array of theme IDs that matched this item
    matchedThemeIds: text('matched_theme_ids')
      .notNull()
      .default('[]'),
  },
  (table) => ({
    // Unique constraint: one item cannot appear twice in same snapshot
    snapshotItemUnique: uniqueIndex('today_snapshot_items_snapshot_id_item_id_unique').on(
      table.snapshotId,
      table.itemId
    ),
    // Performance index
    snapshotIdIdx: index('today_snapshot_items_snapshot_id_idx').on(table.snapshotId),
  })
);

export type TodaySnapshotItem = typeof todaySnapshotItems.$inferSelect;
export type NewTodaySnapshotItem = typeof todaySnapshotItems.$inferInsert;
