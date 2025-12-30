# Spec: RSS Reader MVP

**ID**: `rss-reader-spec-a3f7e9`
**Created**: 2025-12-30
**Updated**: 2025-12-30

## Status
`implemented`

## Goal
Build a web-based RSS reader that solves the "unread pile-up" problem through automatic daily curation (Today queue) and priority-based consumption, optimizing for speed and simplicity over feature richness.

## Acceptance Criteria
- [ ] Users can register/login with authentication
- [ ] Users can subscribe to RSS feeds
- [ ] System automatically generates "Today" queue daily at 6AM with up to 80 articles
- [ ] Articles are categorized into High/Med/Low/Other priority based on user-defined themes
- [ ] Users can Open (read), Keep (save), or Skip articles, which immediately remove them from Today
- [ ] Saved articles are viewable in Saved screen
- [ ] Skipped articles are viewable in Backlog screen (read-only)
- [ ] Application loads and responds quickly (<1s for Today screen)
- [ ] RSS feeds are fetched every 1 hour in background

## Planned Spec (Intended)

### Overview
A web application built with React SPA frontend and backend API, hosted on Cloudflare Workers/Pages with D1 database. Users authenticate, subscribe to RSS feeds, and consume articles through an auto-generated "Today" queue that prioritizes content based on user-defined themes and article recency.

### Platform & Hosting
- **Platform**: Web application (not desktop native)
- **Frontend**: React SPA with TypeScript
- **Backend**: API hosted on Cloudflare Workers
- **Hosting**: Cloudflare Pages (frontend) + Workers (backend)
- **Database**: Cloudflare D1 (SQLite at the edge)
- **Future**: PWA support for offline/mobile experience

### Technical Stack

#### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui + Tailwind CSS
  - Radix UI primitives for accessibility
  - Dark mode support built-in
  - Customizable components copied into project
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: React Router v6

#### Backend
- **Runtime**: Cloudflare Workers (V8 edge runtime)
- **Framework**: Hono (lightweight, fast, designed for edge)
- **Database**: Cloudflare D1 (SQLite)
  - ORM: Drizzle ORM (edge-compatible)
- **Authentication**: Clerk or Auth.js (Cloudflare Workers compatible)
- **RSS Parsing**: RSS Parser (edge-compatible library)

#### DevOps
- **Deployment**: Cloudflare Pages (auto-deploy from git)
- **CI/CD**: GitHub Actions
- **Monitoring**: Cloudflare Analytics + Workers Analytics

#### Local Development Environment

**Tools**:
- **Wrangler CLI**: Official Cloudflare developer tool for local Workers/D1 emulation
- **Vite**: Frontend dev server with HMR (Hot Module Replacement)
- **Node.js**: v18+ (LTS) for running Wrangler and build tools

**Local Stack**:
```
Frontend Dev: Vite (localhost:5173)
    ↓ Proxy /api/*
Backend Dev: Wrangler dev (localhost:8787)
    ↓ SQL Queries
D1 Local: SQLite (.wrangler/state/v3/d1/)
```

**Key Commands**:
```bash
# Frontend development
npm run dev              # Start Vite dev server

# Backend development
wrangler dev            # Start Workers locally with D1

# Database operations
wrangler d1 execute DB --local --command "SELECT * FROM users"
wrangler d1 migrations apply DB --local

# Full-stack (run both)
npm run dev:full        # Concurrently run Vite + Wrangler
```

**Development Features**:
- Hot reload for both frontend (Vite HMR) and backend (Wrangler auto-restart)
- Local D1 uses actual SQLite files (same as production)
- Migrations work identically in local and production
- Can seed database with test data for development
- Authentication uses dev/test API keys (Clerk) or local session (Auth.js)

**Production Parity**:
- Same API surface: D1, KV, Durable Objects (if needed)
- Same runtime: V8 isolates (not Node.js)
- Same limits: Can test Workers limits locally
- No Docker needed: Lightweight, fast startup

**Trade-offs**:
- Wrangler dev slightly slower than plain Node.js (acceptable)
- Some Workers APIs may have minor differences in local mode (rare)
- Cron triggers can be tested manually or with `wrangler dev --test-scheduled`

### Key Components

#### Frontend Components
- **Today Screen**: Priority-bucketed article list (High/Med/Low/Other)
- **Themes Screen**: CRUD interface for themes with keywords
- **Saved Screen**: List of kept articles
- **Backlog Screen**: Read-only list of skipped articles (MVP: view only)
- **Feeds Screen**: CRUD interface for RSS feed subscriptions

#### Backend Services
- **Auth Service**: User registration, login, session management
- **Feed Service**: RSS feed CRUD, fetch, parse, store articles
- **Article Service**: Article state management, Today generation
- **Theme Service**: Theme CRUD, keyword matching logic
- **Scheduler**: Cron-triggered jobs for feed fetching and Today generation

### Architecture

#### Data Flow
```
User Browser (React SPA)
    ↓ HTTPS
Cloudflare Pages (Static Assets)
    ↓ API Calls
Cloudflare Workers (API)
    ↓ SQL Queries
Cloudflare D1 (SQLite Database)

Cloudflare Cron Triggers
    ↓
Workers (Background Jobs)
    ↓ Fetch RSS
External RSS Feeds
    ↓ Parse & Store
D1 Database
```

#### Authentication Flow
```
User → Login → Clerk/Auth.js → JWT Token → API Requests (with token)
```

### Data Model (D1 Schema)

#### Tables

**users**
- `id` TEXT PRIMARY KEY (UUID)
- `email` TEXT UNIQUE NOT NULL
- `auth_id` TEXT UNIQUE NOT NULL (from Clerk/Auth.js)
- `created_at` INTEGER NOT NULL (unix timestamp)
- `updated_at` INTEGER NOT NULL

**feeds**
- `id` TEXT PRIMARY KEY (UUID)
- `user_id` TEXT NOT NULL REFERENCES users(id)
- `title` TEXT NOT NULL
- `url` TEXT NOT NULL
- `created_at` INTEGER NOT NULL
- `last_fetched_at` INTEGER
- `fetch_error` TEXT (nullable, stores last error message)
- UNIQUE(user_id, url)

**items**
- `id` TEXT PRIMARY KEY (UUID)
- `feed_id` TEXT NOT NULL REFERENCES feeds(id)
- `guid` TEXT NOT NULL (RSS item guid or link)
- `title` TEXT NOT NULL
- `link` TEXT NOT NULL
- `published_at` INTEGER NOT NULL
- `summary` TEXT (nullable)
- `content` TEXT (nullable)
- `created_at` INTEGER NOT NULL
- UNIQUE(feed_id, guid)

**item_states**
- `id` TEXT PRIMARY KEY (UUID)
- `item_id` TEXT NOT NULL REFERENCES items(id)
- `user_id` TEXT NOT NULL REFERENCES users(id)
- `status` TEXT NOT NULL (unread/read/kept/skipped)
- `updated_at` INTEGER NOT NULL
- UNIQUE(item_id, user_id)

**themes**
- `id` TEXT PRIMARY KEY (UUID)
- `user_id` TEXT NOT NULL REFERENCES users(id)
- `name` TEXT NOT NULL
- `priority` TEXT NOT NULL (high/med/low)
- `created_at` INTEGER NOT NULL
- `updated_at` INTEGER NOT NULL

**theme_keywords**
- `id` TEXT PRIMARY KEY (UUID)
- `theme_id` TEXT NOT NULL REFERENCES themes(id)
- `keyword` TEXT NOT NULL
- `created_at` INTEGER NOT NULL
- UNIQUE(theme_id, keyword)

**today_snapshots**
- `id` TEXT PRIMARY KEY (UUID)
- `user_id` TEXT NOT NULL REFERENCES users(id)
- `date` TEXT NOT NULL (YYYY-MM-DD)
- `created_at` INTEGER NOT NULL
- UNIQUE(user_id, date)

**today_snapshot_items**
- `id` TEXT PRIMARY KEY (UUID)
- `snapshot_id` TEXT NOT NULL REFERENCES today_snapshots(id)
- `item_id` TEXT NOT NULL REFERENCES items(id)
- `bucket` TEXT NOT NULL (high/med/low/other)
- `rank_in_bucket` INTEGER NOT NULL
- `score` REAL (nullable, for sorting)
- `matched_theme_ids` TEXT (nullable, JSON array of theme IDs)
- UNIQUE(snapshot_id, item_id)

### Core Features

#### 1. Today Queue Generation

**Trigger**: Daily at 6:00 AM (Cloudflare Cron)

**Algorithm**:
1. **Candidate Selection**:
   - Articles published within last 3 days
   - Exclude articles with status: read, kept, skipped
   - Limit to first 200 candidates per user (performance)

2. **Scoring & Prioritization**:
   - For each article:
     - Check title (+ summary if available) against all user themes
     - Keyword matching: case-insensitive partial match (OR logic within theme)
     - If matches multiple themes: take highest priority
     - If matches no themes: assign to "Other"
     - Apply recency boost: +10 points if published within 24 hours

3. **Bucketing**:
   - High: Articles matching "high" priority themes
   - Med: Articles matching "med" priority themes
   - Low: Articles matching "low" priority themes
   - Other: Articles matching no themes

4. **Ranking within Buckets**:
   - Sort by: (base_score + recency_boost) DESC, then published_at DESC
   - Assign rank_in_bucket: 1, 2, 3...

5. **Cap at 80 Total**:
   - Select top articles across buckets, prioritizing High → Med → Low → Other
   - Store in today_snapshot_items with metadata

**Storage**: Create new today_snapshots record and associated today_snapshot_items

#### 2. Article Consumption (State Transitions)

**Operations**:

**Open (Read)**:
- Opens article link in new browser tab/window
- Immediately sets item_state.status = "read"
- Removes from Today view (frontend filters out non-unread)
- Guard: Validate URL is non-empty and well-formed

**Keep (Save)**:
- Sets item_state.status = "kept"
- Removes from Today view
- Article remains accessible in Saved screen
- Can be opened later without changing kept status

**Skip (Defer)**:
- Sets item_state.status = "skipped"
- Removes from Today view
- Article appears in Backlog screen (read-only in MVP)

**UI Behavior**:
- All operations are immediate (optimistic UI updates)
- Today count updates in real-time
- No undo in MVP (can add later)

#### 3. Themes & Keyword Matching

**Theme Structure**:
- Name: User-defined string (e.g., "React Development")
- Priority: high | med | low
- Keywords: Array of strings (e.g., ["react", "nextjs", "vercel"])

**Matching Logic**:
```typescript
function matchesTheme(article: Article, theme: Theme): boolean {
  const searchText = `${article.title} ${article.summary || ''}`.toLowerCase();
  return theme.keywords.some(keyword =>
    searchText.includes(keyword.toLowerCase())
  );
}
```

**Priority Resolution**:
- Article can match multiple themes
- Take highest priority: high > med > low
- Tie-breaker: First matched theme (arbitrary but consistent)

#### 4. RSS Feed Management

**Feed Fetching**:
- **Frequency**: Every 1 hour (Cloudflare Cron)
- **Process**:
  1. Fetch all feeds for all users
  2. Parse XML/RSS
  3. Extract items (title, link, guid, published_at, summary, content)
  4. Deduplicate by guid
  5. Insert new items into items table
  6. Create item_states records (status="unread") for each user
  7. Update feeds.last_fetched_at
  8. On error: log to feeds.fetch_error, continue to next feed

**Error Handling**:
- Non-blocking: One feed failure doesn't stop others
- Retry: Automatic retry on next scheduled run
- User notification: Show error in Feeds screen if persistent

### UI/UX Requirements

#### Today Screen (Primary View)
- **Layout**: Single column, sectioned by priority
- **Sections**: High, Med, Low, Other (collapsible)
- **Article Card**:
  - Title (bold, clickable → Open)
  - Feed name (small, muted)
  - Published date (relative, e.g., "2h ago")
  - Matched theme tags (if any, small badges)
  - Actions: Open (button/icon), Keep (icon), Skip (icon)
- **Header**: Today date, total count, progress indicator
- **Empty State**: Encouraging message when Today is clear

#### Themes Screen
- **List View**: All themes with name, priority badge, keyword count
- **Add/Edit Form**:
  - Name (text input)
  - Priority (dropdown: High/Med/Low)
  - Keywords (tag input, enter to add)
- **Delete**: With confirmation dialog

#### Saved Screen
- **List View**: Similar to Today, but all kept articles
- **Actions**: Open (doesn't change kept status), Remove from Saved

#### Backlog Screen (MVP: Read-Only)
- **List View**: All skipped articles
- **Display Only**: No actions in MVP
- **Future**: Add "Move to Today" action

#### Feeds Screen
- **List View**: All subscribed feeds with title, URL, last fetched time, error status
- **Add Form**: URL input (auto-fetch title on blur)
- **Delete**: With confirmation dialog
- **Manual Refresh**: Button to trigger immediate fetch for a feed

#### Design System
- **Colors**: Tailwind default palette, customizable via shadcn/ui
- **Typography**: Inter or System font stack
- **Spacing**: Tailwind spacing scale (4px base)
- **Dark Mode**: Automatic based on system preference
- **Responsive**: Mobile-first, 640px/768px/1024px breakpoints

### Background Jobs (Cloudflare Cron)

#### Job 1: Fetch RSS Feeds
- **Schedule**: `0 * * * *` (every hour at :00)
- **Function**: Iterate all feeds, fetch, parse, store new items
- **Timeout**: 50s (Workers limit is 50s for cron)
- **Optimization**: Batch process, use Durable Objects if needed for coordination

#### Job 2: Generate Today Queues
- **Schedule**: `0 6 * * *` (daily at 6:00 AM UTC)
- **Function**: For each user, run Today generation algorithm
- **Timeout**: 50s (may need to batch process users)
- **Optimization**: Generate for active users first, lazy-generate for others on first visit

### Non-Functional Requirements

#### Performance
- **Goal**: Fast, responsive, never feels slow
- **Metrics**:
  - Today screen loads in < 1s (P95)
  - Article state change (Open/Keep/Skip) reflects in < 200ms (optimistic UI)
  - RSS fetch completes in < 30s per feed (P95)
  - Today generation completes in < 5s per user (P95)

#### Reliability
- **Error Handling**: Graceful degradation, never crash
- **Data Integrity**: Transactions for critical operations
- **Offline**: MVP doesn't require offline support (future PWA)

#### Scalability
- **Target**: 1000 users, 100 feeds/user, 50 items/feed = 5M items
- **Cloudflare Workers**: Auto-scales globally
- **D1 Database**: SQLite limits ~1GB for free tier, sufficient for MVP

#### Security
- **Authentication**: Required for all API endpoints (except public pages)
- **Authorization**: Users can only access their own data
- **Input Validation**: Sanitize all user inputs, especially URLs
- **XSS Prevention**: Escape all user-generated content in UI
- **CSRF**: Not needed (API uses JWT, not cookies)

### API Endpoints (REST)

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

#### Feeds
- `GET /api/feeds` - List user's feeds
- `POST /api/feeds` - Add new feed
- `GET /api/feeds/:id` - Get feed details
- `DELETE /api/feeds/:id` - Delete feed
- `POST /api/feeds/:id/refresh` - Manually refresh feed

#### Today
- `GET /api/today` - Get today's queue (auto-generates if not exists)
- `GET /api/today/:date` - Get today queue for specific date

#### Items
- `POST /api/items/:id/read` - Mark as read (Open action)
- `POST /api/items/:id/keep` - Mark as kept (Keep action)
- `POST /api/items/:id/skip` - Mark as skipped (Skip action)

#### Saved
- `GET /api/saved` - List kept articles
- `POST /api/saved/:id/remove` - Remove from saved (unkeep)

#### Backlog
- `GET /api/backlog` - List skipped articles

#### Themes
- `GET /api/themes` - List user's themes
- `POST /api/themes` - Create theme
- `GET /api/themes/:id` - Get theme details
- `PUT /api/themes/:id` - Update theme
- `DELETE /api/themes/:id` - Delete theme

### Success Metrics (MVP)

#### Engagement
- **Daily Active Users (DAU)**: % of users who open Today at least once per day
- **Today Completion Rate**: % of High priority articles consumed (Open/Keep/Skip)
- **Return Rate**: % of users who return 7 days after signup

#### Performance
- **Load Time**: P95 for Today screen < 1s
- **Action Response**: P95 for Open/Keep/Skip < 200ms

#### Subjective
- **User Feedback**: "Does this help you avoid article pile-up?" (Yes/No survey)
- **NPS**: Net Promoter Score after 1 week of usage

### MVP Exclusions (Explicitly Out of Scope)

#### Features
- Multi-device sync (built-in via web + auth)
- Keyboard shortcuts (deferred post-MVP)
- AI summarization / importance prediction
- Social / sharing features
- Complex folder/tag organization
- Article annotations / highlights
- Email digests
- Import/export (OPML)
- Read-it-later integrations (Pocket, Instapaper)
- Full-text search (deferred)
- Backlog re-consumption (view only in MVP)

#### Technical
- Mobile native apps (web-first, PWA later)
- Desktop native apps (web-first)
- Advanced analytics / metrics dashboard
- A/B testing infrastructure
- i18n / multiple languages
- Custom domains
- White-label / multi-tenant

## As-Built Spec (Current Truth)

### Overview
RSS Reader MVP の包括的な仕様書を作成しました。ユーザーへの質問（AskUserQuestion）を通じて要件を収集し、技術スタック・機能範囲・データモデル・UI/UX要件を明確化した完全な設計ドキュメントです。

### Key Components
作成したドキュメント：
- **仕様書本体**: `.claude/specs/2025-12/rss-reader-spec-a3f7e9.md` (約587行)
- **Issue定義**: `.claude/issues/2025-12/rss-reader-spec-a3f7e9.md`
- **作業ログ**: `.claude/log/2025-12/rss-reader-spec-a3f7e9.md`

### Implementation Details

#### 収集した要件（AskUserQuestion による質問）
**第1ラウンド（4質問）**:
1. 技術スタック → Web版（デスクトップネイティブではなく、PWA対応視野）
2. Today生成タイミング → 日次定時生成（朝6時）
3. キーワードマッチング → 部分一致（大文字小文字区別なし）
4. Backlog画面 → 含める（閲覧のみ）

**第2ラウンド（4質問）**:
1. アーキテクチャ → SPA + バックエンドAPI
2. RSS取得頻度 → 1時間おき
3. データストレージ → NoSQL/PostgreSQL（安価・無料希望） → Cloudflare D1採用
4. 新しさ加点 → 24時間以内を強めに加点

**第3ラウンド（4質問）**:
1. 認証 → 必要（マルチユーザー対応）
2. UIライブラリ → shadcn/ui + Tailwind CSS
3. ホスティング → Cloudflare Workers/Pages
4. キーボードショートカット → 実装しない（MVP）

**追加調査**:
- ローカル開発環境 → Wrangler CLI で本番環境と同一スタック使用

#### 仕様書の構成
1. **技術スタック**: React + Cloudflare Workers + D1 + shadcn/ui
2. **データモデル**: 8テーブル（users, feeds, items, item_states, themes, theme_keywords, today_snapshots, today_snapshot_items）
3. **コア機能**:
   - Today キュー自動生成（毎朝6時、最大80件）
   - 優先度バケット（High/Med/Low/Other）
   - テーマベースの自動優先度付け
   - 記事消化（Open/Keep/Skip）
   - 5画面（Today/Themes/Saved/Backlog/Feeds）
4. **API設計**: 17エンドポイント定義
5. **ローカル開発環境**: Wrangler CLI による本番パリティ確保
6. **成功指標**: DAU、Today完了率、パフォーマンスメトリクス
7. **MVP除外項目**: 明示的にスコープ外を定義

#### 文書の特徴
- **網羅性**: 技術・機能・UX・テスト・デプロイ全領域をカバー
- **具体性**: 抽象論ではなく、実装可能なレベルの詳細度
- **決定の記録**: Design Notes で各選択の理由・トレードオフを明記
- **日英併記**: 質問は日本語、仕様書本体は英語（国際標準）

## Differences
**Planned vs As-Built**:

なし。仕様書作成という性質上、Planned Spec と As-Built Spec の乖離は発生しませんでした。ユーザーからの追加質問（ローカル開発環境）に対応してセクションを追加しましたが、これは計画の変更ではなく自然な拡張です。

## Design Notes

### Key Decisions

**Web-first over Desktop Native**:
- Faster MVP iteration, easier deployment
- PWA provides offline/install later
- Single codebase for all devices
- Trade-off: No deep OS integration (notifications, background sync)

**Cloudflare Stack**:
- Workers + Pages + D1 = unified platform, global edge
- Generous free tier: 100K requests/day, 5GB D1 storage
- Trade-off: D1 is newer, less mature than PostgreSQL
- Constraint: 50s Worker timeout requires batching for large operations

**No Keyboard Shortcuts in MVP**:
- Reduces scope, faster to ship
- Mobile-friendly by default (touch-first)
- Can add post-MVP based on user demand
- Trade-off: Power users may prefer keyboard nav

**1-hour RSS Fetch**:
- Balance between freshness and server cost
- Most RSS feeds update hourly or less
- Cloudflare Cron is free for reasonable frequency
- Trade-off: Not "real-time" but sufficient for news/blogs

**Today at 6AM**:
- Users start day with fresh queue
- Background generation = fast app startup
- Trade-off: Fixed time (no user customization in MVP)
- Future: Allow user to set preferred time

**Priority Buckets (High/Med/Low/Other)**:
- Simple mental model (not 1-10 scale)
- Clear consumption order
- Matches GTD/Eisenhower matrix familiarity
- Trade-off: Less granular than numeric scoring

**Partial Match Keywords**:
- User-friendly (doesn't require exact terms)
- Higher recall (catches variations)
- Trade-off: Lower precision (more false positives)
- Case-insensitive reduces cognitive load

**24-hour Recency Boost**:
- Prioritizes breaking news / timely content
- Aligns with "avoid pile-up" goal (consume recent first)
- +10 points is significant but not overwhelming
- Trade-off: Older "evergreen" content may never surface in Today

**Wrangler for Local Development**:
- True production parity: same runtime (V8), same database (SQLite)
- No Docker needed, lightweight setup
- Hot reload for fast iteration
- Free local development, no cloud costs
- Trade-off: Wrangler dev slightly slower than plain Node.js (acceptable for MVP)

## Testing Strategy

### Unit Tests
- Keyword matching logic (various edge cases)
- Scoring and bucketing algorithm
- Date/time utilities

### Integration Tests
- RSS feed fetch and parse
- Today generation end-to-end
- Item state transitions (unread → read/kept/skipped)
- Authentication flow

### E2E Tests (Playwright)
- User registration and login
- Add feed → fetch articles → appear in Today
- Create theme → articles prioritize correctly
- Open/Keep/Skip actions → Today updates
- Navigate between screens (Today/Saved/Backlog/Themes/Feeds)

### Performance Tests
- Today generation for 1000 articles (< 5s)
- API endpoint response times (< 1s)
- RSS fetch for 100 feeds (< 30s)

### Manual QA
- Mobile responsiveness (iOS Safari, Android Chrome)
- Dark mode appearance
- Error states (network failure, invalid feed URL)
- Empty states (no feeds, no articles, Today cleared)

## Related
- Issue: `.claude/issues/2025-12/rss-reader-spec-a3f7e9.md`
- Log: `.claude/log/2025-12/rss-reader-spec-a3f7e9.md`
