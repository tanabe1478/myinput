# Examples: Good and Bad Practices

## Good Example: Complete Workflow

### Task: Fix Authentication 403 Error

**Step 1: Task Start (Gate A)**
```bash
# Generated files with slug-id: auth-403-fix-9f3a7c
.claude/issues/2025-01/auth-403-fix-9f3a7c.md
.claude/specs/2025-01/auth-403-fix-9f3a7c.md
.claude/log/2025-01/auth-403-fix-9f3a7c.md
```

**Step 2: During Work**

Appended to `.claude/log/2025-01/auth-403-fix-9f3a7c.md`:
```markdown
## 2025-01-15 10:30 - Investigation

### Findings
- Token validation fails in `src/auth/middleware.ts:45`
- Issue: comparing wrong timestamp (issued vs expires)
- Root cause: typo in variable name `iat` vs `exp`

### Decision
- Fix typo and add test coverage
- Add validation for both issued and expiry times
```

**Step 3: Before PR (Gate B)**

Updated `.claude/specs/2025-01/auth-403-fix-9f3a7c.md`:
```markdown
## As-Built Spec (Current Truth)

### Overview
Fixed authentication middleware to correctly validate token expiry time.

### Key Changes
- `src/auth/middleware.ts`: Fixed typo `iat` → `exp` at line 45
- `tests/auth/middleware.test.ts`: Added test for expired token rejection

### Implementation Details
- Now checks `exp` (expiry) instead of `iat` (issued at)
- Added test case: `should_reject_expired_tokens`
- Validated with both unit and integration tests

## Differences
None. Simple bug fix, no design changes from plan.

## Design Notes
Added extra validation to prevent similar issues:
- Both `iat` and `exp` are now checked
- Clear error messages for debugging
```

**Step 4: Created PR**
```markdown
## Summary
Fix authentication 403 error caused by token validation typo

## Changes
- Fixed typo in token validation (iat → exp)
- Added test coverage for expired tokens

## Impact
- Users with valid tokens will no longer receive 403 errors
- Better error messages for debugging
- No breaking changes

## Testing
- [x] Unit test: `should_reject_expired_tokens`
- [x] Integration test: `auth_flow_with_token_expiry`
- [x] Manual: Verified login flow works correctly

## Related
- Closes #42
```

---

## Bad Example 1: Wrong File Location

### ❌ What Not to Do

```bash
# Creating spec in docs/ instead of .claude/specs/
docs/authentication-spec.md

# Putting work log in project root
WORK_LOG.md

# Creating GitHub Issue with detailed investigation
GitHub Issue #42:
"I spent 2 hours investigating the authentication issue. First I looked
at the middleware code in src/auth/middleware.ts and found that line 45
has a comparison that seems wrong. I then traced through the JWT library
and found... [continues for 50 lines]"
```

### ✓ Correct Approach

```bash
# All files in .claude/ with slug-id
.claude/issues/2025-01/auth-fix-9f3a7c.md
.claude/specs/2025-01/auth-fix-9f3a7c.md
.claude/log/2025-01/auth-fix-9f3a7c.md

# GitHub Issue stays high-level
GitHub Issue #42:
"Authentication returns 403 for valid tokens after recent deployment.
Users cannot log in. Priority: High"

# Detailed investigation in .claude/log/
```

---

## Bad Example 2: Wrong Naming

### ❌ What Not to Do

```bash
# Uppercase in slug
.claude/specs/2025-01/Auth-Fix-9F3A7C.md

# Spaces in slug
.claude/specs/2025-01/auth fix-9f3a7c.md

# Underscores in slug
.claude/specs/2025-01/auth_fix_9f3a7c.md

# No month directory
.claude/specs/auth-fix-9f3a7c.md

# Different slug-id across files
.claude/issues/2025-01/auth-403-fix-9f3a7c.md
.claude/specs/2025-01/authentication-bug-a1b2c3.md  # ❌ Different!
```

### ✓ Correct Approach

```bash
# Lowercase kebab-case with hex id
.claude/specs/2025-01/auth-403-fix-9f3a7c.md

# Same slug-id across all three files
.claude/issues/2025-01/auth-403-fix-9f3a7c.md
.claude/specs/2025-01/auth-403-fix-9f3a7c.md
.claude/log/2025-01/auth-403-fix-9f3a7c.md
```

---

## Bad Example 3: Skipping Gate B

### ❌ What Not to Do

```markdown
# Creating PR without updating As-Built

## .claude/specs/2025-01/feature-x-a1b2c3.md

[Only Planned Spec filled in, As-Built is empty]

## Pull Request
"I implemented feature X. It works now. Please review."
[No details about what was actually built]
```

### ✓ Correct Approach

```markdown
# Update spec FIRST, then create PR

## .claude/specs/2025-01/feature-x-a1b2c3.md

### As-Built Spec (Current Truth)
Implemented feature X using approach Y...
[Complete details of what exists]

### Differences
- Planned to use library A, but used B (better TypeScript support)
- Added caching layer (not in original plan) for performance

## Pull Request
Based on the As-Built spec:

## Summary
Implement feature X with library B and caching

## Changes
- Added feature X module in src/features/x/
- Integrated library B for better TypeScript support
- Added Redis caching layer for 10x performance improvement
...
```

---

## Bad Example 4: Over-Documenting in Design Notes

### ❌ What Not to Do

```markdown
## Design Notes

We chose to implement this feature using a microservices architecture
because microservices provide better scalability and maintainability
compared to monolithic applications. The decision was made after
extensive research into industry best practices. We evaluated multiple
frameworks including Express, Fastify, and Koa, and ultimately selected
Express due to its widespread adoption and extensive middleware ecosystem.

The authentication flow was designed with security as the top priority.
We researched various authentication mechanisms including session-based,
token-based, and certificate-based approaches. Token-based authentication
using JWT was selected because it provides stateless authentication which
scales horizontally. We also considered OAuth2 and SAML but decided they
were too complex for our current needs...

[Continues for 100 more lines]
```

### ✓ Correct Approach

```markdown
## Design Notes

- Microservices over monolith: Better scalability for our growth projections
- Express framework: Wide adoption, good TypeScript support
- JWT tokens: Stateless = horizontal scaling, simpler than OAuth2 for our case
- 15-min token expiry: Security vs UX balance (auto-refresh handles UX)
```

---

## Good Example: When Planned ≠ As-Built

### Scenario: Implementation Diverged from Plan

```markdown
## Planned Spec (Intended)

### Approach
Store session data in PostgreSQL for persistence across restarts.

## As-Built Spec (Current Truth)

### Approach
Store session data in Redis with PostgreSQL backup.

### Implementation Details
- Primary: Redis for fast access (< 1ms reads)
- Backup: PostgreSQL for persistence
- Sync: Write to both, read from Redis
- Fallback: Read from PostgreSQL if Redis miss

## Differences

1. **Session Storage**: Added Redis as primary store (not in plan)
   - Reason: 50x faster than PostgreSQL for session lookups
   - Trade-off: Added complexity of dual-write and sync logic

2. **Backup Strategy**: Added PostgreSQL as backup (was supposed to be primary)
   - Reason: Redis data loss on restart is unacceptable
   - Trade-off: Extra storage cost, but improved reliability

## Design Notes

- Dual-write ensures data safety: Redis failure falls back to PostgreSQL
- Tested failure scenarios: Redis down, PostgreSQL down, both down (graceful degradation)
- Monitor Redis hit rate to validate 99%+ served from cache
```

This shows:
- Clear documentation of changes
- Honest about trade-offs
- Explains reasoning briefly
- Focuses on reality (As-Built)

---

## Summary: Key Patterns

### ✓ Good Practices

1. **File organization**: All work files in `.claude/` with consistent `slug-id`
2. **Naming**: Lowercase kebab-case, hex id, month directories
3. **Gate B**: Always update As-Built before PR
4. **Design notes**: Minimal (1-3 lines per decision)
5. **Differences**: Honest documentation when plan changes
6. **GitHub**: High-level issues, detailed PRs, local logs

### ❌ Avoid These

1. Creating specs outside `.claude/`
2. Using uppercase or spaces in filenames
3. Skipping As-Built update before PR
4. Writing essay-length design notes
5. Putting detailed logs in GitHub Issues
6. Inconsistent slug-id across three files
