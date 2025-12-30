# Work Log: RSS Reader MVP Specification

**ID**: `rss-reader-spec-a3f7e9`
**Started**: 2025-12-30

---

## 2025-12-30 - Requirements Gathering

### What I Did
Used AskUserQuestion tool to gather detailed requirements from user across multiple dimensions.

### Findings
- **Platform**: Initially considered desktop native, but pivoted to Web-first with PWA support later
- **Architecture**: SPA + Backend API chosen
- **Hosting**: Cloudflare Workers/Pages for global edge distribution
- **Database**: Need free/cheap option during development (PostgreSQL or NoSQL)
  - Cloudflare D1 (SQLite) is natural fit with Workers
- **Authentication**: Multi-user support required from start
- **UI**: shadcn/ui + Tailwind CSS for modern, customizable components
- **RSS Fetch**: 1-hour interval (balance between freshness and server load)
- **Today Generation**: Daily at 6AM (scheduled background job)
- **Keyword Matching**: Case-insensitive partial match
- **Backlog**: Include read-only view in MVP
- **Keyboard Shortcuts**: Omit from MVP to simplify
- **Recency Boost**: Strong boost for articles within 24 hours

### Decisions Made
1. **Web over Desktop**: Better for MVP iteration, PWA provides offline later
2. **Cloudflare Stack**: D1 database + Workers + Pages = unified platform, generous free tier
3. **Auth from Start**: Essential for web multi-user, can use Clerk or Auth.js
4. **No Shortcuts**: Reduces MVP scope, mobile-friendly by default

### Next Steps
- [x] Write comprehensive spec document
- [x] Define data schema for D1
- [x] Document API endpoints
- [x] Specify UI components and layouts

---

## 2025-12-30 - Local Development Environment

### Question from User
"ローカルで動かす時の技術スタックは？"

### Investigation: Cloudflare Local Development Tools

**Wrangler CLI**: Official Cloudflare developer tool
- Local Workers emulation with Miniflare v3
- D1 local database (actual SQLite file)
- Hot reload support
- Same API surface as production

**Key Tools**:
- `wrangler dev` - Run Workers locally with live reload
- `wrangler d1 execute` - Run SQL against local D1
- `wrangler d1 migrations` - Apply schema migrations
- `wrangler pages dev` - Run Pages locally (SSG/SSR)

**Frontend**:
- Vite dev server (standard React development)
- Proxy API calls to Wrangler dev server
- Fast HMR, TypeScript type checking

**Database**:
- D1 local: `.wrangler/state/v3/d1/` (SQLite files)
- Same schema as production
- Migrations work identically
- Can seed with test data

**Authentication**:
- Clerk: Use test/dev API keys
- Auth.js: Local session handling
- Can stub auth in early development

### Findings
- **No separate stack needed**: Wrangler provides full local environment
- **True parity**: Local D1 = production D1 (both SQLite)
- **Fast DX**: Wrangler dev has hot reload, instant feedback
- **Free**: All local dev tools are free, no cloud costs during development

### Architecture Decision
Use Wrangler for full-stack local development:
```
Frontend: Vite (localhost:5173)
    ↓ Proxy
Backend: Wrangler dev (localhost:8787)
    ↓
D1 Local: SQLite (.wrangler/state/)
```

### Trade-offs
- **Pro**: Perfect production parity, single toolchain
- **Pro**: No Docker needed, lightweight
- **Con**: Wrangler dev can be slower than plain Node.js (acceptable for MVP)
- **Con**: Some Workers limitations in local mode (rare edge cases)

---
