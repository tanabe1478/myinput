# Claude Code Development Rules

## Purpose & Philosophy

This defines the development OS for **You (Developer) × LLM collaboration**.

**Core Principles**:
1. Team operations (GitHub) stay minimal and noise-free
2. Specs and work logs managed in `.claude/` directory (committed to git)
3. LLM context compression accepted; compensate with external memory
4. Every task gets its own branch and PR, no matter how small

---

## Quick Start

### File Organization
```
.claude/                                    # Committed to repository
├── issues/YYYY-MM/<slug>-<id>.md         # Task descriptions
├── specs/YYYY-MM/<slug>-<id>.md          # Specifications (planned + as-built)
├── log/YYYY-MM/<slug>-<id>.md            # Work logs
├── templates/                             # Templates for consistency
└── rules/                                 # Detailed rules (auto-loaded)
```

**One Task = Three Files** with same `slug-id`:
- `<slug>`: English kebab-case (`auth-fix`, `api-refactor`)
- `<id>`: 6-8 digit hex (`9f3a7c`, `a1b2c3`)
- Example: `auth-403-fix-9f3a7c.md`

### Two-Gate Workflow

**Gate A (Task Start)**:
1. LLM creates branch `claude/<slug>-<id>`
2. LLM creates three `.claude/` files with unique `slug-id`
3. Commit and push `.claude/` files
4. Review Goal and Acceptance Criteria
5. Begin development

**Gate B (Before PR)**:
1. LLM updates spec's **As-Built** section
2. Document **Differences** from plan
3. Commit and push spec updates
4. Create PR from updated spec

---

## Documentation Structure

This CLAUDE.md provides the overview. Detailed rules are in modular files:

### Core Rules (Auto-Loaded)
@./.claude/rules/branching.md
@./.claude/rules/workflow.md
@./.claude/rules/naming.md
@./.claude/rules/specs.md
@./.claude/rules/github.md
@./.claude/rules/llm-instructions.md

### Reference Documentation
@./docs/examples.md

### Templates
Available in `.claude/templates/`:
- `issue-template.md`: Task description structure
- `spec-template.md`: Specification format
- `log-template.md`: Work log format

---

## Key Concepts

### Specification Philosophy
- **Planned Spec**: Intended design (before coding)
- **As-Built Spec**: Reality (after coding) ← **Source of Truth**
- Document differences explicitly when they diverge
- Keep design notes minimal (1-3 lines per decision)

### GitHub Integration
- **Issues**: High-level coordination only
- **PRs**: Every task gets a PR, no matter how small
- **Branches**: Always `claude/<slug>-<id>` format
- **`.claude/`**: Committed to repository for traceability

### For LLMs
You MUST:
- Create branch `claude/<slug>-<id>` BEFORE creating files
- Create files in `.claude/` with proper `slug-id`
- Commit and push `.claude/` files immediately
- Use `YYYY-MM/` directories
- Update As-Built before every PR
- Keep same `slug-id` across branch and all three files
- Follow naming rules: `[a-z0-9-]` for slug, `[0-9a-f]{6,8}` for id
- Create PR for EVERY task, even small ones

### Testing Philosophy

**Test-Driven Development (TDD) is MANDATORY for all implementation tasks.**

#### Core Principles
1. **Write tests FIRST, then implementation**
   - Unit tests before functions
   - Integration tests before modules
   - E2E tests before features
2. **Every PR must include tests**
   - New features → New tests
   - Bug fixes → Regression tests
   - Refactoring → Existing tests must pass
3. **Tests are executable documentation**
   - Tests describe expected behavior
   - Tests serve as usage examples
   - Tests prevent regressions

#### Test Pyramid
```
       E2E Tests (Few)
    ─────────────────
   Integration Tests (Some)
  ─────────────────────────
 Unit Tests (Many)
───────────────────────────
```

**Distribution**:
- **70% Unit Tests**: Functions, utilities, business logic
- **20% Integration Tests**: API endpoints, database operations, service interactions
- **10% E2E Tests**: Critical user flows (login, Today consumption, feed management)

#### Test Infrastructure
- **Unit/Integration**: Vitest (fast, Vite-native)
- **E2E**: Playwright (cross-browser, reliable)
- **GraphQL**: Mock Service Worker (MSW) for API mocking
- **Database**: In-memory D1 for tests (via Wrangler)

#### Test Requirements
Before committing:
- ✅ All tests pass (`npm test`)
- ✅ Coverage > 80% for new code
- ✅ E2E tests for critical paths pass
- ✅ No skipped tests without documented reason

#### CI/CD Integration
Every PR triggers:
1. Unit + Integration tests
2. E2E tests (on staging environment)
3. Coverage report
4. Build verification

**RED → GREEN → REFACTOR cycle is expected for all development.**

---

## Quick Reference

| Action | Location | When |
|--------|----------|------|
| Start task | `.claude/issues/` + `.claude/specs/` | Gate A |
| Log work | `.claude/log/` | During work |
| Update spec | `.claude/specs/` (As-Built) | Gate B (before PR) |
| Share results | GitHub PR | PR creation |

---

## Examples

**Good**:
```
Task: Fix auth 403 error
Files:
  - .claude/issues/2025-01/auth-403-fix-9f3a7c.md
  - .claude/specs/2025-01/auth-403-fix-9f3a7c.md
  - .claude/log/2025-01/auth-403-fix-9f3a7c.md
PR: Based on updated As-Built spec
```

**Bad**:
```
❌ Specs in docs/ instead of .claude/specs/
❌ Uppercase or spaces in slug
❌ Creating PR without updating As-Built
❌ Detailed investigation in GitHub Issue
```

For more examples: @./docs/examples.md
