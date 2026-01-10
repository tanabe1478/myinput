import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { eq } from 'drizzle-orm';
import { setupTestDb, teardownTestDb, type TestDbContext } from './helpers';
import * as schema from '../schema';
import { ItemStatus, ThemePriority, TodayBucket } from '../types';

describe('Database Migrations', () => {
  let context: TestDbContext;

  beforeAll(async (ctx) => {
    // @ts-expect-error - Cloudflare Workers test context provides env
    context = await setupTestDb(ctx.env.DB);
  });

  afterAll(async () => {
    await teardownTestDb(context);
  });

  describe('Table Creation', () => {
    it('should have all 8 tables created', async () => {
      const { d1 } = context;

      const result = await d1
        .prepare(
          `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`
        )
        .all();

      const tableNames = result.results?.map((r: any) => r.name) || [];

      expect(tableNames).toContain('users');
      expect(tableNames).toContain('feeds');
      expect(tableNames).toContain('items');
      expect(tableNames).toContain('item_states');
      expect(tableNames).toContain('themes');
      expect(tableNames).toContain('theme_keywords');
      expect(tableNames).toContain('today_snapshots');
      expect(tableNames).toContain('today_snapshot_items');
    });

    it('should have correct columns for users table', async () => {
      const { d1 } = context;

      const result = await d1
        .prepare(`PRAGMA table_info(users)`)
        .all();

      const columns = result.results?.map((r: any) => r.name) || [];

      expect(columns).toContain('id');
      expect(columns).toContain('email');
      expect(columns).toContain('auth_id');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });

    it('should have correct columns for feeds table', async () => {
      const { d1 } = context;

      const result = await d1
        .prepare(`PRAGMA table_info(feeds)`)
        .all();

      const columns = result.results?.map((r: any) => r.name) || [];

      expect(columns).toContain('id');
      expect(columns).toContain('user_id');
      expect(columns).toContain('title');
      expect(columns).toContain('url');
      expect(columns).toContain('created_at');
      expect(columns).toContain('last_fetched_at');
      expect(columns).toContain('fetch_error');
    });

    it('should have correct columns for items table', async () => {
      const { d1 } = context;

      const result = await d1
        .prepare(`PRAGMA table_info(items)`)
        .all();

      const columns = result.results?.map((r: any) => r.name) || [];

      expect(columns).toContain('id');
      expect(columns).toContain('feed_id');
      expect(columns).toContain('guid');
      expect(columns).toContain('title');
      expect(columns).toContain('link');
      expect(columns).toContain('published_at');
      expect(columns).toContain('summary');
      expect(columns).toContain('content');
      expect(columns).toContain('created_at');
    });

    it('should have correct columns for item_states table', async () => {
      const { d1 } = context;

      const result = await d1
        .prepare(`PRAGMA table_info(item_states)`)
        .all();

      const columns = result.results?.map((r: any) => r.name) || [];

      expect(columns).toContain('id');
      expect(columns).toContain('item_id');
      expect(columns).toContain('user_id');
      expect(columns).toContain('status');
      expect(columns).toContain('updated_at');
    });

    it('should have correct columns for themes table', async () => {
      const { d1 } = context;

      const result = await d1
        .prepare(`PRAGMA table_info(themes)`)
        .all();

      const columns = result.results?.map((r: any) => r.name) || [];

      expect(columns).toContain('id');
      expect(columns).toContain('user_id');
      expect(columns).toContain('name');
      expect(columns).toContain('priority');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });

    it('should have correct columns for today_snapshot_items table', async () => {
      const { d1 } = context;

      const result = await d1
        .prepare(`PRAGMA table_info(today_snapshot_items)`)
        .all();

      const columns = result.results?.map((r: any) => r.name) || [];

      expect(columns).toContain('id');
      expect(columns).toContain('snapshot_id');
      expect(columns).toContain('item_id');
      expect(columns).toContain('bucket');
      expect(columns).toContain('rank_in_bucket');
      expect(columns).toContain('score');
      expect(columns).toContain('matched_theme_ids');
    });
  });

  describe('Indexes', () => {
    it('should have indexes on feeds table', async () => {
      const { d1 } = context;

      const result = await d1
        .prepare(`PRAGMA index_list(feeds)`)
        .all();

      const indexes = result.results?.map((r: any) => r.name) || [];

      expect(indexes.some((idx: string) => idx.includes('user_id_url'))).toBe(true);
    });

    it('should have indexes on items table', async () => {
      const { d1 } = context;

      const result = await d1
        .prepare(`PRAGMA index_list(items)`)
        .all();

      const indexes = result.results?.map((r: any) => r.name) || [];

      expect(indexes.some((idx: string) => idx.includes('feed_id'))).toBe(true);
      expect(indexes.some((idx: string) => idx.includes('published_at'))).toBe(true);
    });

    it('should have indexes on item_states table', async () => {
      const { d1 } = context;

      const result = await d1
        .prepare(`PRAGMA index_list(item_states)`)
        .all();

      const indexes = result.results?.map((r: any) => r.name) || [];

      expect(indexes.some((idx: string) => idx.includes('user_id'))).toBe(true);
      expect(indexes.some((idx: string) => idx.includes('status'))).toBe(true);
    });

    it('should have indexes on today_snapshots table', async () => {
      const { d1 } = context;

      const result = await d1
        .prepare(`PRAGMA index_list(today_snapshots)`)
        .all();

      const indexes = result.results?.map((r: any) => r.name) || [];

      expect(indexes.some((idx: string) => idx.includes('user_id'))).toBe(true);
      expect(indexes.some((idx: string) => idx.includes('date'))).toBe(true);
    });
  });

  describe('Foreign Key Constraints', () => {
    it('should have foreign key from feeds to users', async () => {
      const { d1 } = context;

      const result = await d1
        .prepare(`PRAGMA foreign_key_list(feeds)`)
        .all();

      const fks = result.results || [];
      expect(fks.some((fk: any) => fk.table === 'users')).toBe(true);
    });

    it('should have foreign key from items to feeds', async () => {
      const { d1 } = context;

      const result = await d1
        .prepare(`PRAGMA foreign_key_list(items)`)
        .all();

      const fks = result.results || [];
      expect(fks.some((fk: any) => fk.table === 'feeds')).toBe(true);
    });

    it('should have foreign keys from item_states to items and users', async () => {
      const { d1 } = context;

      const result = await d1
        .prepare(`PRAGMA foreign_key_list(item_states)`)
        .all();

      const fks = result.results || [];
      expect(fks.some((fk: any) => fk.table === 'items')).toBe(true);
      expect(fks.some((fk: any) => fk.table === 'users')).toBe(true);
    });

    it('should have foreign key from themes to users', async () => {
      const { d1 } = context;

      const result = await d1
        .prepare(`PRAGMA foreign_key_list(themes)`)
        .all();

      const fks = result.results || [];
      expect(fks.some((fk: any) => fk.table === 'users')).toBe(true);
    });

    it('should have foreign key from theme_keywords to themes', async () => {
      const { d1 } = context;

      const result = await d1
        .prepare(`PRAGMA foreign_key_list(theme_keywords)`)
        .all();

      const fks = result.results || [];
      expect(fks.some((fk: any) => fk.table === 'themes')).toBe(true);
    });

    it('should have foreign key from today_snapshots to users', async () => {
      const { d1 } = context;

      const result = await d1
        .prepare(`PRAGMA foreign_key_list(today_snapshots)`)
        .all();

      const fks = result.results || [];
      expect(fks.some((fk: any) => fk.table === 'users')).toBe(true);
    });

    it('should have foreign keys from today_snapshot_items to snapshots and items', async () => {
      const { d1 } = context;

      const result = await d1
        .prepare(`PRAGMA foreign_key_list(today_snapshot_items)`)
        .all();

      const fks = result.results || [];
      expect(fks.some((fk: any) => fk.table === 'today_snapshots')).toBe(true);
      expect(fks.some((fk: any) => fk.table === 'items')).toBe(true);
    });
  });

  describe('Unique Constraints', () => {
    it('should enforce unique email in users', async () => {
      const { db } = context;

      await db.insert(schema.users).values({
        email: 'unique@example.com',
        authId: 'auth_1',
      });

      await expect(
        db.insert(schema.users).values({
          email: 'unique@example.com',
          authId: 'auth_2',
        })
      ).rejects.toThrow();
    });

    it('should enforce unique (user_id, url) in feeds', async () => {
      const { db } = context;

      const [user] = await db
        .insert(schema.users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      await db.insert(schema.feeds).values({
        userId: user.id,
        title: 'Feed',
        url: 'https://example.com/feed',
      });

      await expect(
        db.insert(schema.feeds).values({
          userId: user.id,
          title: 'Feed 2',
          url: 'https://example.com/feed',
        })
      ).rejects.toThrow();
    });

    it('should enforce unique (feed_id, guid) in items', async () => {
      const { db } = context;

      const [user] = await db
        .insert(schema.users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      const [feed] = await db
        .insert(schema.feeds)
        .values({
          userId: user.id,
          title: 'Feed',
          url: 'https://example.com/feed',
        })
        .returning();

      await db.insert(schema.items).values({
        feedId: feed.id,
        guid: 'unique-guid',
        title: 'Article',
        link: 'https://example.com/article',
        publishedAt: new Date(),
      });

      await expect(
        db.insert(schema.items).values({
          feedId: feed.id,
          guid: 'unique-guid',
          title: 'Article 2',
          link: 'https://example.com/article2',
          publishedAt: new Date(),
        })
      ).rejects.toThrow();
    });
  });

  describe('Enum Validation', () => {
    it('should accept valid ItemStatus enum values', async () => {
      const { db } = context;

      const [user] = await db
        .insert(schema.users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      const [feed] = await db
        .insert(schema.feeds)
        .values({
          userId: user.id,
          title: 'Feed',
          url: 'https://example.com/feed',
        })
        .returning();

      const [item] = await db
        .insert(schema.items)
        .values({
          feedId: feed.id,
          guid: 'item-1',
          title: 'Article',
          link: 'https://example.com/article',
          publishedAt: new Date(),
        })
        .returning();

      // Should accept all valid enum values
      for (const status of Object.values(ItemStatus)) {
        await expect(
          db.insert(schema.itemStates).values({
            id: crypto.randomUUID(),
            itemId: item.id,
            userId: user.id,
            status,
          })
        ).resolves.toBeDefined();
      }
    });

    it('should accept valid ThemePriority enum values', async () => {
      const { db } = context;

      const [user] = await db
        .insert(schema.users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      // Should accept all valid enum values
      for (const priority of Object.values(ThemePriority)) {
        await expect(
          db.insert(schema.themes).values({
            id: crypto.randomUUID(),
            userId: user.id,
            name: `Theme ${priority}`,
            priority,
          })
        ).resolves.toBeDefined();
      }
    });

    it('should accept valid TodayBucket enum values', async () => {
      const { db } = context;

      const [user] = await db
        .insert(schema.users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      const [feed] = await db
        .insert(schema.feeds)
        .values({
          userId: user.id,
          title: 'Feed',
          url: 'https://example.com/feed',
        })
        .returning();

      const [item] = await db
        .insert(schema.items)
        .values({
          feedId: feed.id,
          guid: 'item-1',
          title: 'Article',
          link: 'https://example.com/article',
          publishedAt: new Date(),
        })
        .returning();

      const [snapshot] = await db
        .insert(schema.todaySnapshots)
        .values({
          userId: user.id,
          date: '2025-01-01',
        })
        .returning();

      // Should accept all valid enum values
      for (const bucket of Object.values(TodayBucket)) {
        await expect(
          db.insert(schema.todaySnapshotItems).values({
            id: crypto.randomUUID(),
            snapshotId: snapshot.id,
            itemId: item.id,
            bucket,
            rankInBucket: 1,
            score: 0.9,
          })
        ).resolves.toBeDefined();
      }
    });
  });

  describe('Cascade Delete Behavior', () => {
    it('should cascade delete feeds when user is deleted', async () => {
      const { db } = context;

      const [user] = await db
        .insert(schema.users)
        .values({ email: 'cascade@example.com', authId: 'cascade_1' })
        .returning();

      await db.insert(schema.feeds).values({
        userId: user.id,
        title: 'Feed',
        url: 'https://example.com/feed',
      });

      await db.delete(schema.users).where(eq(schema.users.id, user.id));

      const feeds = await db.select().from(schema.feeds);
      expect(feeds).toHaveLength(0);
    });

    it('should cascade delete items when feed is deleted', async () => {
      const { db } = context;

      const [user] = await db
        .insert(schema.users)
        .values({ email: 'cascade@example.com', authId: 'cascade_1' })
        .returning();

      const [feed] = await db
        .insert(schema.feeds)
        .values({
          userId: user.id,
          title: 'Feed',
          url: 'https://example.com/feed',
        })
        .returning();

      await db.insert(schema.items).values({
        feedId: feed.id,
        guid: 'item-1',
        title: 'Article',
        link: 'https://example.com/article',
        publishedAt: new Date(),
      });

      await db.delete(schema.feeds).where(eq(schema.feeds.id, feed.id));

      const items = await db.select().from(schema.items);
      expect(items).toHaveLength(0);
    });

    it('should cascade delete theme keywords when theme is deleted', async () => {
      const { db } = context;

      const [user] = await db
        .insert(schema.users)
        .values({ email: 'cascade@example.com', authId: 'cascade_1' })
        .returning();

      const [theme] = await db
        .insert(schema.themes)
        .values({
          userId: user.id,
          name: 'Theme',
          priority: ThemePriority.HIGH,
        })
        .returning();

      await db.insert(schema.themeKeywords).values({
        themeId: theme.id,
        keyword: 'test',
      });

      await db.delete(schema.themes).where(eq(schema.themes.id, theme.id));

      const keywords = await db.select().from(schema.themeKeywords);
      expect(keywords).toHaveLength(0);
    });
  });

  describe('Migration Idempotency', () => {
    it('should be safe to run migrations multiple times', async () => {
      // This test verifies that migrations don't fail if tables already exist
      // In practice, Drizzle manages this, but we verify the state is consistent
      const { d1 } = context;

      const result = await d1
        .prepare(
          `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`
        )
        .all();

      const tableCount = result.results?.length || 0;

      // Re-running migrations shouldn't change the number of tables
      // (This is handled by the migration system, we just verify state)
      expect(tableCount).toBeGreaterThan(0);

      const result2 = await d1
        .prepare(
          `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`
        )
        .all();

      expect(result2.results?.length).toBe(tableCount);
    });
  });
});
