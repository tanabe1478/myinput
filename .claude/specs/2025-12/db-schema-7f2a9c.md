# Spec: Database Schema Setup with Drizzle ORM

**ID**: `db-schema-7f2a9c`
**Created**: 2025-12-31
**Updated**: 2025-12-31

## Status
`draft`

## Goal
RSS Reader MVPのデータベース層を構築する。Drizzle ORMで8つのテーブルを定義し、マイグレーションシステムをセットアップする。

## Acceptance Criteria
- [ ] Drizzle ORM + Drizzle Kit導入完了
- [ ] 8テーブルのスキーマ定義完了
- [ ] マイグレーション生成・適用が動作
- [ ] スキーマ検証テスト通過
- [ ] マイグレーションテスト通過
- [ ] GraphQL context統合完了

## Planned Spec (Intended)

### Overview
Cloudflare D1（SQLite）とDrizzle ORMを使用して、RSS ReaderのデータベーススキーマとORM層を構築する。TDDアプローチで、テストファーストで実装する。

### Database Schema (8 Tables)

#### Core Tables
1. **users**: ユーザー基本情報
   - id (TEXT, UUID, PK)
   - email (TEXT, UNIQUE, NOT NULL)
   - auth_id (TEXT, UNIQUE, NOT NULL) - Auth.jsのユーザーID
   - created_at (INTEGER, NOT NULL)
   - updated_at (INTEGER, NOT NULL)

2. **feeds**: RSSフィード
   - id (TEXT, UUID, PK)
   - user_id (TEXT, FK→users, NOT NULL)
   - title (TEXT, NOT NULL)
   - url (TEXT, NOT NULL)
   - created_at (INTEGER, NOT NULL)
   - last_fetched_at (INTEGER)
   - fetch_error (TEXT)
   - UNIQUE(user_id, url)

3. **items**: RSS記事
   - id (TEXT, UUID, PK)
   - feed_id (TEXT, FK→feeds, NOT NULL)
   - guid (TEXT, NOT NULL) - RSS item GUID
   - title (TEXT, NOT NULL)
   - link (TEXT, NOT NULL)
   - published_at (INTEGER, NOT NULL)
   - summary (TEXT)
   - content (TEXT)
   - created_at (INTEGER, NOT NULL)
   - UNIQUE(feed_id, guid)
   - INDEX(feed_id, published_at)

4. **item_states**: ユーザーごとの記事状態
   - id (TEXT, UUID, PK)
   - item_id (TEXT, FK→items, NOT NULL)
   - user_id (TEXT, FK→users, NOT NULL)
   - status (TEXT, ENUM: unread/read/kept/skipped, NOT NULL)
   - updated_at (INTEGER, NOT NULL)
   - UNIQUE(item_id, user_id)
   - INDEX(user_id, status)

#### Theme Tables
5. **themes**: キーワードテーマ
   - id (TEXT, UUID, PK)
   - user_id (TEXT, FK→users, NOT NULL)
   - name (TEXT, NOT NULL)
   - priority (TEXT, ENUM: high/med/low, NOT NULL)
   - created_at (INTEGER, NOT NULL)
   - updated_at (INTEGER, NOT NULL)
   - INDEX(user_id)

6. **theme_keywords**: テーマのキーワード
   - id (TEXT, UUID, PK)
   - theme_id (TEXT, FK→themes, NOT NULL)
   - keyword (TEXT, NOT NULL)
   - created_at (INTEGER, NOT NULL)
   - UNIQUE(theme_id, keyword)
   - INDEX(theme_id)

#### Today Queue Tables
7. **today_snapshots**: Today キュースナップショット
   - id (TEXT, UUID, PK)
   - user_id (TEXT, FK→users, NOT NULL)
   - date (TEXT, YYYY-MM-DD, NOT NULL)
   - created_at (INTEGER, NOT NULL)
   - UNIQUE(user_id, date)
   - INDEX(user_id, date)

8. **today_snapshot_items**: Todayキューの記事
   - id (TEXT, UUID, PK)
   - snapshot_id (TEXT, FK→today_snapshots, NOT NULL)
   - item_id (TEXT, FK→items, NOT NULL)
   - bucket (TEXT, ENUM: high/med/low/other, NOT NULL)
   - rank_in_bucket (INTEGER, NOT NULL)
   - score (REAL)
   - matched_theme_ids (TEXT, JSON array)
   - UNIQUE(snapshot_id, item_id)
   - INDEX(snapshot_id)

### Key Components

#### Dependencies
- `drizzle-orm@^0.30.0` - ORM core
- `drizzle-kit@^0.21.0` - Migration tool (devDependency)
- `@types/better-sqlite3@^7.6.0` - Type definitions (devDependency)

#### Configuration
- `backend/drizzle.config.ts` - Drizzle Kit設定
  - schema: `./src/db/schema/index.ts`
  - out: `./drizzle`
  - dialect: `sqlite`
  - driver: `d1-http`

#### Database Layer Structure
```
backend/src/db/
├── client.ts          # Drizzle client factory
├── utils.ts           # UUID, timestamp helpers
├── types.ts           # TypeScript types
├── schema/
│   ├── index.ts       # Export all schemas
│   ├── users.ts
│   ├── feeds.ts
│   ├── items.ts
│   ├── item-states.ts
│   ├── themes.ts
│   ├── theme-keywords.ts
│   ├── today-snapshots.ts
│   └── today-snapshot-items.ts
└── __tests__/
    ├── helpers.ts
    ├── schema.test.ts
    └── migrations.test.ts
```

### Approach

#### Step 1: Dependencies
```bash
cd backend
pnpm add drizzle-orm
pnpm add -D drizzle-kit @types/better-sqlite3
```

#### Step 2: Configuration
- Create `drizzle.config.ts`
- Define schema path, output directory, dialect

#### Step 3: Database Utilities
- UUID generation using `crypto.randomUUID()`
- Unix timestamp helpers
- Enum type helpers for CHECK constraints

#### Step 4: Schema Definition (TDD)
- Write schema validation tests first
- Define each table schema
- Use Drizzle's type-safe schema builders
- TEXT for UUIDs, INTEGER for timestamps
- TEXT + CHECK for enums
- Foreign keys with CASCADE delete
- Unique constraints and indexes

#### Step 5: Tests
- Schema structure tests
- Foreign key tests
- Unique constraint tests
- Enum validation tests
- Migration application tests
- Data integrity tests

#### Step 6: Migration Generation
```bash
pnpm db:generate
```
Generates `drizzle/0000_initial_schema.sql`

#### Step 7: Migration Application
```bash
pnpm db:migrate:local
```
Applies to local D1 via Wrangler

#### Step 8: GraphQL Integration
- Update `src/index.ts` to create Drizzle client
- Pass to GraphQL context
- Update `src/schema/builder.ts` context type

### Design Notes

**SQLite Specifics**:
- TEXT for UUIDs (no native UUID type)
- INTEGER for timestamps (unix seconds)
- TEXT + CHECK constraint for enums
- TEXT for JSON (no native JSON type)

**Foreign Key Cascade**:
- All FKs use `onDelete: CASCADE`
- User削除→全データ削除
- Feed削除→Items削除
- Theme削除→Keywords削除
- Snapshot削除→Items削除

**Index Strategy**:
- ユーザーIDでの検索（feeds, themes, item_states）
- 日付での検索（items.published_at, today_snapshots.date）
- 状態での検索（item_states.status）

**Unique Constraints**:
- データ整合性のため
- 重複防止（email, URL, GUID など）

### Testing Strategy

**Schema Tests**:
- テーブル存在確認
- Foreign key定義確認
- Unique constraint確認
- Enum値確認
- Index定義確認

**Migration Tests**:
- テーブル作成確認
- Index作成確認
- Foreign key動作確認
- Cascade delete確認
- CHECK constraint確認
- Idempotency確認

## As-Built Spec (Current Truth)
_← Update this section before PR creation_

(To be filled after implementation)

## Differences
**Planned vs As-Built**:
(To be filled after implementation)

## Related
- Issue: `.claude/issues/2025-12/db-schema-7f2a9c.md`
- Log: `.claude/log/2025-12/db-schema-7f2a9c.md`
- Reference: `.claude/specs/2025-12/rss-reader-spec-a3f7e9.md`
- Previous: PR #2 (Project Setup)
