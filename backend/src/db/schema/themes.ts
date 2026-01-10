import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { THEME_PRIORITY_VALUES } from '../types';

/**
 * Themes table
 * Stores user-defined themes with keywords for content prioritization
 */
export const themes = sqliteTable(
  'themes',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    name: text('name')
      .notNull(),

    // Priority: high, medium, low
    priority: text('priority', { enum: THEME_PRIORITY_VALUES })
      .notNull()
      .default('medium'),

    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),

    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (table) => ({
    // Performance index
    userIdIdx: index('themes_user_id_idx').on(table.userId),
  })
);

export type Theme = typeof themes.$inferSelect;
export type NewTheme = typeof themes.$inferInsert;
