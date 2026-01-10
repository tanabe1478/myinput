import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex, index } from 'drizzle-orm/sqlite-core';
import { themes } from './themes';

/**
 * Theme Keywords table
 * Stores keywords associated with each theme for content matching
 */
export const themeKeywords = sqliteTable(
  'theme_keywords',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    themeId: text('theme_id')
      .notNull()
      .references(() => themes.id, { onDelete: 'cascade' }),

    keyword: text('keyword')
      .notNull(),

    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    // Unique constraint: one theme cannot have duplicate keywords
    themeKeywordUnique: uniqueIndex('theme_keywords_theme_id_keyword_unique').on(
      table.themeId,
      table.keyword
    ),
    // Performance index
    themeIdIdx: index('theme_keywords_theme_id_idx').on(table.themeId),
  })
);

export type ThemeKeyword = typeof themeKeywords.$inferSelect;
export type NewThemeKeyword = typeof themeKeywords.$inferInsert;
