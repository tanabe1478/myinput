import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { items } from './items';
import { users } from './users';
import { ITEM_STATUS_VALUES } from '../types';

/**
 * Item States table
 * Stores per-user reading status for each item
 */
export const itemStates = sqliteTable(
  'item_states',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    itemId: text('item_id')
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }),

    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    // Status: unread, read, kept, skipped
    status: text('status', { enum: ITEM_STATUS_VALUES })
      .notNull()
      .default('unread'),

    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (table) => ({
    // Unique constraint: one status per item per user
    itemUserUnique: uniqueIndex('item_states_item_id_user_id_unique').on(
      table.itemId,
      table.userId
    ),
    // Performance indexes
    userIdIdx: index('item_states_user_id_idx').on(table.userId),
    statusIdx: index('item_states_status_idx').on(table.status),
  })
);

export type ItemState = typeof itemStates.$inferSelect;
export type NewItemState = typeof itemStates.$inferInsert;
