import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { users } from './users';

/**
 * Today Snapshots table
 * Stores daily generated reading queues for each user
 */
export const todaySnapshots = sqliteTable(
  'today_snapshots',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    // Date in YYYY-MM-DD format
    date: text('date')
      .notNull(),

    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    // Unique constraint: one snapshot per user per day
    userDateUnique: uniqueIndex('today_snapshots_user_id_date_unique').on(
      table.userId,
      table.date
    ),
    // Performance indexes
    userIdIdx: index('today_snapshots_user_id_idx').on(table.userId),
    dateIdx: index('today_snapshots_date_idx').on(table.date),
  })
);

export type TodaySnapshot = typeof todaySnapshots.$inferSelect;
export type NewTodaySnapshot = typeof todaySnapshots.$inferInsert;
