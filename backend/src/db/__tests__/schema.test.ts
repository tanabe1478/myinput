import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { eq } from 'drizzle-orm';
import { setupTestDb, teardownTestDb, cleanTestDb, type TestDbContext } from './helpers';
import { users } from '../schema/users';
import { feeds } from '../schema/feeds';
import { items } from '../schema/items';
import { itemStates } from '../schema/item-states';
import { themes } from '../schema/themes';
import { themeKeywords } from '../schema/theme-keywords';
import { todaySnapshots } from '../schema/today-snapshots';
import { todaySnapshotItems } from '../schema/today-snapshot-items';
import { ItemStatus, ThemePriority, TodayBucket } from '../types';

describe('Database Schema', () => {
  let context: TestDbContext;

  beforeAll(async (ctx) => {
    // @ts-expect-error - Cloudflare Workers test context provides env
    context = await setupTestDb(ctx.env.DB);
  });

  afterEach(async () => {
    await cleanTestDb(context);
  });

  afterAll(async () => {
    await teardownTestDb(context);
  });

  describe('Users Table', () => {
    it('should create a user with required fields', async () => {
      const { db } = context;

      const [user] = await db
        .insert(users)
        .values({
          email: 'test@example.com',
          authId: 'auth_123',
        })
        .returning();

      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.authId).toBe('auth_123');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should enforce unique email constraint', async () => {
      const { db } = context;

      await db.insert(users).values({
        email: 'duplicate@example.com',
        authId: 'auth_1',
      });

      await expect(
        db.insert(users).values({
          email: 'duplicate@example.com',
          authId: 'auth_2',
        })
      ).rejects.toThrow();
    });

    it('should enforce unique authId constraint', async () => {
      const { db } = context;

      await db.insert(users).values({
        email: 'user1@example.com',
        authId: 'auth_duplicate',
      });

      await expect(
        db.insert(users).values({
          email: 'user2@example.com',
          authId: 'auth_duplicate',
        })
      ).rejects.toThrow();
    });
  });

  describe('Feeds Table', () => {
    it('should create a feed linked to user', async () => {
      const { db } = context;

      const [user] = await db
        .insert(users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      const [feed] = await db
        .insert(feeds)
        .values({
          userId: user.id,
          title: 'Test Feed',
          url: 'https://example.com/feed.xml',
        })
        .returning();

      expect(feed.id).toBeDefined();
      expect(feed.userId).toBe(user.id);
      expect(feed.title).toBe('Test Feed');
      expect(feed.url).toBe('https://example.com/feed.xml');
    });

    it('should enforce unique (userId, url) constraint', async () => {
      const { db } = context;

      const [user] = await db
        .insert(users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      await db.insert(feeds).values({
        userId: user.id,
        title: 'Feed 1',
        url: 'https://example.com/feed.xml',
      });

      await expect(
        db.insert(feeds).values({
          userId: user.id,
          title: 'Feed 2',
          url: 'https://example.com/feed.xml',
        })
      ).rejects.toThrow();
    });

    it('should cascade delete feeds when user is deleted', async () => {
      const { db } = context;

      const [user] = await db
        .insert(users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      await db.insert(feeds).values({
        userId: user.id,
        title: 'Test Feed',
        url: 'https://example.com/feed.xml',
      });

      await db.delete(users).where(eq(users.id, user.id));

      const remainingFeeds = await db.select().from(feeds);
      expect(remainingFeeds).toHaveLength(0);
    });
  });

  describe('Items Table', () => {
    it('should create an item linked to feed', async () => {
      const { db } = context;

      const [user] = await db
        .insert(users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      const [feed] = await db
        .insert(feeds)
        .values({
          userId: user.id,
          title: 'Test Feed',
          url: 'https://example.com/feed.xml',
        })
        .returning();

      const [item] = await db
        .insert(items)
        .values({
          feedId: feed.id,
          guid: 'item-123',
          title: 'Test Article',
          link: 'https://example.com/article',
          publishedAt: new Date('2025-01-01'),
        })
        .returning();

      expect(item.id).toBeDefined();
      expect(item.feedId).toBe(feed.id);
      expect(item.guid).toBe('item-123');
    });

    it('should enforce unique (feedId, guid) constraint', async () => {
      const { db } = context;

      const [user] = await db
        .insert(users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      const [feed] = await db
        .insert(feeds)
        .values({
          userId: user.id,
          title: 'Test Feed',
          url: 'https://example.com/feed.xml',
        })
        .returning();

      await db.insert(items).values({
        feedId: feed.id,
        guid: 'duplicate-guid',
        title: 'Article 1',
        link: 'https://example.com/article1',
        publishedAt: new Date(),
      });

      await expect(
        db.insert(items).values({
          feedId: feed.id,
          guid: 'duplicate-guid',
          title: 'Article 2',
          link: 'https://example.com/article2',
          publishedAt: new Date(),
        })
      ).rejects.toThrow();
    });
  });

  describe('Item States Table', () => {
    it('should create item state with valid status enum', async () => {
      const { db } = context;

      const [user] = await db
        .insert(users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      const [feed] = await db
        .insert(feeds)
        .values({
          userId: user.id,
          title: 'Test Feed',
          url: 'https://example.com/feed.xml',
        })
        .returning();

      const [item] = await db
        .insert(items)
        .values({
          feedId: feed.id,
          guid: 'item-123',
          title: 'Test Article',
          link: 'https://example.com/article',
          publishedAt: new Date(),
        })
        .returning();

      const [itemState] = await db
        .insert(itemStates)
        .values({
          itemId: item.id,
          userId: user.id,
          status: ItemStatus.READ,
        })
        .returning();

      expect(itemState.status).toBe(ItemStatus.READ);
    });

    it('should enforce unique (itemId, userId) constraint', async () => {
      const { db } = context;

      const [user] = await db
        .insert(users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      const [feed] = await db
        .insert(feeds)
        .values({
          userId: user.id,
          title: 'Test Feed',
          url: 'https://example.com/feed.xml',
        })
        .returning();

      const [item] = await db
        .insert(items)
        .values({
          feedId: feed.id,
          guid: 'item-123',
          title: 'Test Article',
          link: 'https://example.com/article',
          publishedAt: new Date(),
        })
        .returning();

      await db.insert(itemStates).values({
        itemId: item.id,
        userId: user.id,
        status: ItemStatus.UNREAD,
      });

      await expect(
        db.insert(itemStates).values({
          itemId: item.id,
          userId: user.id,
          status: ItemStatus.READ,
        })
      ).rejects.toThrow();
    });
  });

  describe('Themes Table', () => {
    it('should create theme with valid priority enum', async () => {
      const { db } = context;

      const [user] = await db
        .insert(users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      const [theme] = await db
        .insert(themes)
        .values({
          userId: user.id,
          name: 'Technology',
          priority: ThemePriority.HIGH,
        })
        .returning();

      expect(theme.priority).toBe(ThemePriority.HIGH);
    });
  });

  describe('Theme Keywords Table', () => {
    it('should create keyword linked to theme', async () => {
      const { db } = context;

      const [user] = await db
        .insert(users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      const [theme] = await db
        .insert(themes)
        .values({
          userId: user.id,
          name: 'Technology',
          priority: ThemePriority.HIGH,
        })
        .returning();

      const [keyword] = await db
        .insert(themeKeywords)
        .values({
          themeId: theme.id,
          keyword: 'javascript',
        })
        .returning();

      expect(keyword.keyword).toBe('javascript');
    });

    it('should enforce unique (themeId, keyword) constraint', async () => {
      const { db } = context;

      const [user] = await db
        .insert(users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      const [theme] = await db
        .insert(themes)
        .values({
          userId: user.id,
          name: 'Technology',
          priority: ThemePriority.HIGH,
        })
        .returning();

      await db.insert(themeKeywords).values({
        themeId: theme.id,
        keyword: 'duplicate',
      });

      await expect(
        db.insert(themeKeywords).values({
          themeId: theme.id,
          keyword: 'duplicate',
        })
      ).rejects.toThrow();
    });
  });

  describe('Today Snapshots Table', () => {
    it('should create snapshot for user and date', async () => {
      const { db } = context;

      const [user] = await db
        .insert(users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      const [snapshot] = await db
        .insert(todaySnapshots)
        .values({
          userId: user.id,
          date: '2025-01-01',
        })
        .returning();

      expect(snapshot.date).toBe('2025-01-01');
    });

    it('should enforce unique (userId, date) constraint', async () => {
      const { db } = context;

      const [user] = await db
        .insert(users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      await db.insert(todaySnapshots).values({
        userId: user.id,
        date: '2025-01-01',
      });

      await expect(
        db.insert(todaySnapshots).values({
          userId: user.id,
          date: '2025-01-01',
        })
      ).rejects.toThrow();
    });
  });

  describe('Today Snapshot Items Table', () => {
    it('should create snapshot item with valid bucket enum', async () => {
      const { db } = context;

      const [user] = await db
        .insert(users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      const [feed] = await db
        .insert(feeds)
        .values({
          userId: user.id,
          title: 'Test Feed',
          url: 'https://example.com/feed.xml',
        })
        .returning();

      const [item] = await db
        .insert(items)
        .values({
          feedId: feed.id,
          guid: 'item-123',
          title: 'Test Article',
          link: 'https://example.com/article',
          publishedAt: new Date(),
        })
        .returning();

      const [snapshot] = await db
        .insert(todaySnapshots)
        .values({
          userId: user.id,
          date: '2025-01-01',
        })
        .returning();

      const [snapshotItem] = await db
        .insert(todaySnapshotItems)
        .values({
          snapshotId: snapshot.id,
          itemId: item.id,
          bucket: TodayBucket.HIGH,
          rankInBucket: 1,
          score: 0.95,
          matchedThemeIds: JSON.stringify(['theme-1', 'theme-2']),
        })
        .returning();

      expect(snapshotItem.bucket).toBe(TodayBucket.HIGH);
      expect(snapshotItem.rankInBucket).toBe(1);
      expect(snapshotItem.score).toBe(0.95);
    });

    it('should enforce unique (snapshotId, itemId) constraint', async () => {
      const { db } = context;

      const [user] = await db
        .insert(users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      const [feed] = await db
        .insert(feeds)
        .values({
          userId: user.id,
          title: 'Test Feed',
          url: 'https://example.com/feed.xml',
        })
        .returning();

      const [item] = await db
        .insert(items)
        .values({
          feedId: feed.id,
          guid: 'item-123',
          title: 'Test Article',
          link: 'https://example.com/article',
          publishedAt: new Date(),
        })
        .returning();

      const [snapshot] = await db
        .insert(todaySnapshots)
        .values({
          userId: user.id,
          date: '2025-01-01',
        })
        .returning();

      await db.insert(todaySnapshotItems).values({
        snapshotId: snapshot.id,
        itemId: item.id,
        bucket: TodayBucket.HIGH,
        rankInBucket: 1,
        score: 0.95,
      });

      await expect(
        db.insert(todaySnapshotItems).values({
          snapshotId: snapshot.id,
          itemId: item.id,
          bucket: TodayBucket.MEDIUM,
          rankInBucket: 2,
          score: 0.75,
        })
      ).rejects.toThrow();
    });
  });

  describe('Cascade Deletes', () => {
    it('should cascade delete all related data when user is deleted', async () => {
      const { db } = context;

      // Create complete data hierarchy
      const [user] = await db
        .insert(users)
        .values({ email: 'user@example.com', authId: 'auth_1' })
        .returning();

      const [feed] = await db
        .insert(feeds)
        .values({
          userId: user.id,
          title: 'Test Feed',
          url: 'https://example.com/feed.xml',
        })
        .returning();

      const [item] = await db
        .insert(items)
        .values({
          feedId: feed.id,
          guid: 'item-123',
          title: 'Test Article',
          link: 'https://example.com/article',
          publishedAt: new Date(),
        })
        .returning();

      await db.insert(itemStates).values({
        itemId: item.id,
        userId: user.id,
        status: ItemStatus.UNREAD,
      });

      const [theme] = await db
        .insert(themes)
        .values({
          userId: user.id,
          name: 'Technology',
          priority: ThemePriority.HIGH,
        })
        .returning();

      await db.insert(themeKeywords).values({
        themeId: theme.id,
        keyword: 'javascript',
      });

      const [snapshot] = await db
        .insert(todaySnapshots)
        .values({
          userId: user.id,
          date: '2025-01-01',
        })
        .returning();

      await db.insert(todaySnapshotItems).values({
        snapshotId: snapshot.id,
        itemId: item.id,
        bucket: TodayBucket.HIGH,
        rankInBucket: 1,
        score: 0.95,
      });

      // Delete user - should cascade to all related data
      await db.delete(users).where(eq(users.id, user.id));

      // Verify all data is deleted
      expect(await db.select().from(feeds)).toHaveLength(0);
      expect(await db.select().from(items)).toHaveLength(0);
      expect(await db.select().from(itemStates)).toHaveLength(0);
      expect(await db.select().from(themes)).toHaveLength(0);
      expect(await db.select().from(themeKeywords)).toHaveLength(0);
      expect(await db.select().from(todaySnapshots)).toHaveLength(0);
      expect(await db.select().from(todaySnapshotItems)).toHaveLength(0);
    });
  });
});
