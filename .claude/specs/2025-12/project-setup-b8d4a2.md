# Spec: RSS Reader MVP - Project Setup

**ID**: `project-setup-b8d4a2`
**Created**: 2025-12-30
**Updated**: 2025-12-30

## Status
`implementing`

## Goal
ローカルで `npm run dev` を実行すれば即座に開発開始できる、テスト済みのプロジェクト環境を構築する。

## Acceptance Criteria
- [ ] `npm install` でフロント・バック・テストの依存関係がすべてインストールされる
- [ ] `npm run dev` でフロントエンド（Vite）とバックエンド（Wrangler）が並行起動する
- [ ] フロントエンドで GraphQL クエリが実行でき、バックエンドから応答が返る
- [ ] `npm test` でユニット・統合テストが実行され、すべて通る
- [ ] `npm run test:e2e` でPlaywright E2Eテストが実行され、通る
- [ ] TypeScript の型チェックが通る（`npm run typecheck`）
- [ ] Linter が通る（`npm run lint`）
- [ ] README.md にセットアップ手順が記載されている

## Planned Spec (Intended)

### Overview
Monorepo 構成で、フロントエンド・バックエンド・共通型定義を1つのリポジトリで管理。GraphQL による型安全な通信とTDDによる品質保証を実現。

### Directory Structure
```
myinput/
├── .claude/                    # Development logs (already exists)
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── main.tsx           # Entry point
│   │   ├── App.tsx            # Root component
│   │   ├── lib/               # GraphQL client, utils
│   │   ├── components/        # UI components
│   │   └── generated/         # GraphQL codegen output
│   ├── tests/
│   │   └── setup.ts
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json           # Frontend dependencies
├── backend/                    # Cloudflare Workers
│   ├── src/
│   │   ├── index.ts           # Workers entry point
│   │   ├── graphql/
│   │   │   ├── schema.ts      # Pothos schema
│   │   │   └── resolvers/     # Query, Mutation resolvers
│   │   ├── db/                # D1 access layer
│   │   └── utils/
│   ├── tests/
│   │   └── setup.ts
│   ├── wrangler.toml
│   └── package.json           # Backend dependencies
├── e2e/                        # Playwright E2E tests
│   ├── tests/
│   │   └── health-check.spec.ts
│   └── playwright.config.ts
├── shared/                     # Shared types (optional)
│   └── types/
├── package.json                # Root package (workspaces)
├── tsconfig.json               # Root TypeScript config
├── .eslintrc.json
├── .prettierrc
└── README.md
```

### Key Components

#### Root Configuration
- **package.json**: Workspaces for frontend, backend, e2e
- **Scripts**:
  - `dev`: Concurrently run frontend + backend
  - `test`: Run all unit/integration tests
  - `test:e2e`: Run Playwright tests
  - `build`: Build frontend + backend
  - `typecheck`: Check TypeScript types
  - `lint`: Run ESLint
  - `format`: Run Prettier

#### Frontend (React + Vite + GraphQL)
- **Dependencies**:
  - `react`, `react-dom`, `react-router-dom`
  - `@tanstack/react-query`
  - `graphql-request` or `urql`
  - `@graphql-codegen/cli`, `@graphql-codegen/client-preset`
  - `tailwindcss`, `@shadcn/ui` (via CLI)
  - `vitest`, `@testing-library/react`, `msw`
- **Vite Config**:
  - Proxy `/graphql` to `http://localhost:8787`
  - TypeScript paths
  - Test setup for Vitest
- **GraphQL Codegen**:
  - Watch mode for schema changes
  - Generate typed hooks

#### Backend (Workers + Hono + GraphQL)
- **Dependencies**:
  - `hono`
  - `graphql-yoga`, `graphql`
  - `@pothos/core`, `@pothos/plugin-simple-objects`
  - `@cloudflare/workers-types`
  - `drizzle-orm`, `drizzle-kit`
  - `vitest`, `@cloudflare/vitest-pool-workers`
- **Wrangler Config**:
  - D1 database binding (create later)
  - Local dev port: 8787
  - Compatibility date
- **GraphQL Setup**:
  - Pothos schema builder
  - Basic Query: `hello`, `health`
  - Basic Mutation: `ping`
  - GraphQL Playground enabled (dev only)

#### E2E Tests (Playwright)
- **Dependencies**:
  - `@playwright/test`
- **Config**:
  - Base URL: `http://localhost:5173`
  - Browsers: chromium, firefox, webkit
  - Test: Health check endpoint, GraphQL query

### Approach

#### Step 1: Initialize Root Project
```bash
npm init -y
npm install -D typescript @types/node eslint prettier
npm install -D concurrently
```

#### Step 2: Setup Frontend
```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install @tanstack/react-query graphql-request graphql
npm install -D @graphql-codegen/cli @graphql-codegen/client-preset
npm install -D vitest @testing-library/react @testing-library/jest-dom msw
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Step 3: Setup Backend
```bash
cd backend
npm init -y
npm install hono graphql-yoga graphql @pothos/core
npm install -D wrangler @cloudflare/workers-types
npm install -D vitest @cloudflare/vitest-pool-workers
```

#### Step 4: Setup E2E
```bash
cd e2e
npm init playwright@latest
```

#### Step 5: Configure Workspaces
Root `package.json`:
```json
{
  "workspaces": ["frontend", "backend", "e2e"],
  "scripts": {
    "dev": "concurrently \"npm run dev -w frontend\" \"npm run dev -w backend\"",
    "test": "npm test -ws --if-present",
    "test:e2e": "npm run test -w e2e",
    "build": "npm run build -ws --if-present",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write ."
  }
}
```

#### Step 6: Write Verification Tests (TDD)
**Backend Test** (`backend/tests/graphql.test.ts`):
```typescript
describe('GraphQL API', () => {
  it('should respond to health query', async () => {
    const response = await request('/graphql')
      .post({ query: '{ health }' });
    expect(response.data.health).toBe('ok');
  });
});
```

**E2E Test** (`e2e/tests/health-check.spec.ts`):
```typescript
test('should load frontend and query GraphQL', async ({ page }) => {
  await page.goto('/');
  // Frontend makes GraphQL query to backend
  await expect(page.locator('text=Health: ok')).toBeVisible();
});
```

#### Step 7: Implement to Pass Tests
- Backend: Implement `health` query resolver
- Frontend: Implement GraphQL client + health query UI
- Run tests: `npm test && npm run test:e2e`

## As-Built Spec (Current Truth)
_← Update this section before PR creation_

(To be filled after implementation)

## Differences
**Planned vs As-Built**:
(To be filled after implementation)

## Design Notes

### Monorepo with Workspaces
- Single `node_modules` at root (dedupe dependencies)
- Each workspace has own `package.json`
- Allows shared scripts and tooling

### Wrangler Local D1
- D1 database created later (separate task)
- Local dev uses `.wrangler/state/` for SQLite

### GraphQL Playground
- Enabled in development mode only
- Useful for schema exploration and manual testing

### TDD Approach
- Write tests first for health check
- Implement minimal code to pass
- Refactor as needed

## Testing Strategy

### Unit Tests
- **Backend**: GraphQL resolvers (isolated)
- **Frontend**: GraphQL client setup, utilities

### Integration Tests
- **Backend**: Full GraphQL API (query + mutation)
- **Frontend**: React Query hooks with MSW

### E2E Tests
- **Health Check**: Frontend → GraphQL → Backend → Response
- **Basic Navigation**: Router works

### Verification
- All tests pass before commit
- TypeScript compiles without errors
- Linter passes
- README instructions work on fresh clone

## Related
- Issue: `.claude/issues/2025-12/project-setup-b8d4a2.md`
- Log: `.claude/log/2025-12/project-setup-b8d4a2.md`
- Reference: `.claude/specs/2025-12/rss-reader-spec-a3f7e9.md`
