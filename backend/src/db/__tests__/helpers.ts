import { beforeAll, afterAll, afterEach } from 'vitest';
import { createDbClient, type DbClient } from '../client';
import * as schema from '../schema';
import type { User, NewUser } from '../schema/users';
import type { Feed, NewFeed } from '../schema/feeds';
import type { Item, NewItem } from '../schema/items';
import type { ItemState, NewItemState } from '../schema/item-states';
import type { Theme, NewTheme } from '../schema/themes';
import type { ThemeKeyword, NewThemeKeyword } from '../schema/theme-keywords';
import type { TodaySnapshot, NewTodaySnapshot } from '../schema/today-snapshots';
import type { TodaySnapshotItem, NewTodaySnapshotItem } from '../schema/today-snapshot-items';

/**
 * Test database context
 */
export interface TestDbContext {
  db: DbClient;
  d1: D1Database;
}

/**
 * Setup test database with migrations applied
 * Call this in beforeAll() hook
 */
export async function setupTestDb(d1: D1Database): Promise<TestDbContext> {
  const db = createDbClient(d1);

  // Apply migrations if needed
  // Note: In Cloudflare Workers test environment, migrations should be auto-applied
  // by wrangler or test setup

  return { db, d1 };
}

/**
 * Teardown test database
 * Call this in afterAll() hook
 */
export async function teardownTestDb(context: TestDbContext): Promise<void> {
  // Clean up all tables in reverse order of dependencies
  const { d1 } = context;

  await d1.exec(`DELETE FROM today_snapshot_items`);
  await d1.exec(`DELETE FROM today_snapshots`);
  await d1.exec(`DELETE FROM theme_keywords`);
  await d1.exec(`DELETE FROM themes`);
  await d1.exec(`DELETE FROM item_states`);
  await d1.exec(`DELETE FROM items`);
  await d1.exec(`DELETE FROM feeds`);
  await d1.exec(`DELETE FROM users`);
}

/**
 * Clean all data from test database
 * Call this in afterEach() hook
 */
export async function cleanTestDb(context: TestDbContext): Promise<void> {
  await teardownTestDb(context);
}

/**
 * Seed test data with common fixtures
 */
export async function seedTestData(context: TestDbContext) {
  const { db } = context;

  // Create test user
  const testUser: NewUser = {
    email: 'test@example.com',
    authId: 'auth_test_user_123',
  };
  const [user] = await db.insert(schema.users).values(testUser).returning();

  // Create test feed
  const testFeed: NewFeed = {
    userId: user.id,
    title: 'Test Feed',
    url: 'https://example.com/feed.xml',
  };
  const [feed] = await db.insert(schema.feeds).values(testFeed).returning();

  // Create test item
  const testItem: NewItem = {
    feedId: feed.id,
    guid: 'test-item-guid-1',
    title: 'Test Article',
    link: 'https://example.com/article',
    publishedAt: new Date('2025-01-01T00:00:00Z'),
    summary: 'Test article summary',
  };
  const [item] = await db.insert(schema.items).values(testItem).returning();

  // Create test theme
  const testTheme: NewTheme = {
    userId: user.id,
    name: 'Technology',
    priority: 'high',
  };
  const [theme] = await db.insert(schema.themes).values(testTheme).returning();

  // Create test keyword
  const testKeyword: NewThemeKeyword = {
    themeId: theme.id,
    keyword: 'javascript',
  };
  const [keyword] = await db.insert(schema.themeKeywords).values(testKeyword).returning();

  return {
    user,
    feed,
    item,
    theme,
    keyword,
  };
}
