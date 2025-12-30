---
target: ".claude/specs/**/*"
---

# Specification Documentation Rules

## Philosophy: Planned + As-Built

### The Two Truths

1. **Planned Spec**: What we intended to build (design phase)
2. **As-Built Spec**: What we actually built (reality) ← **Source of Truth**

### Key Principle

**As-Built is always correct**. It reflects reality. The code is the final authority, and the As-Built spec must match it.

Planned spec remains as **historical context** showing original intent. Document the differences explicitly.

## Spec Structure

Every spec file MUST follow this structure:

```markdown
# Spec: [Feature/Fix Name]

**ID**: `<slug>-<id>`
**Created**: YYYY-MM-DD
**Updated**: YYYY-MM-DD

## Status
[draft / implementing / implemented / changed]

## Goal
[Clear one-line statement of what we want to achieve]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Planned Spec (Intended)
### Overview
[Original design intention before implementation]

### Key Components
[Planned components/modules/files]

### Approach
[How we planned to implement]

## As-Built Spec (Current Truth)
[← Update this before PR creation]

### Overview
[What was actually implemented]

### Key Components
[Actual components/modules/files created]

### Implementation Details
[Real implementation approach and structure]

## Differences
[List Planned vs As-Built differences, or write "None"]

## Design Notes
[Minimal: 1-3 lines / Maximum: a few bullet points]
[Only essential decisions, constraints, or gotchas]

## Testing Strategy
[How this was/will be verified]

## Related
- Issue: `.claude/issues/YYYY-MM/<slug>-<id>.md`
- Log: `.claude/log/YYYY-MM/<slug>-<id>.md`
- GitHub Issue: [#000](link) _(if exists)_
- PR: [#000](link) _(when created)_
```

## Status Field

Use these values only:

- **draft**: Initial planning, not started coding
- **implementing**: Currently working on it
- **implemented**: Done and merged/deployed
- **changed**: Previously implemented, now modified

Update status at key milestones:
- Start: `draft`
- First commit: `implementing`
- PR merged: `implemented`
- Later modification: `changed`

## Writing As-Built Spec

### When to Write

**CRITICAL**: Update As-Built section **before creating PR**.

Never create a PR with empty As-Built section. The PR description should be based on As-Built content.

### What to Include

1. **Overview**: What actually exists now (1-2 sentences)
2. **Key Components**: Actual files/modules created
3. **Implementation Details**:
   - Real approaches used
   - Actual libraries/frameworks chosen
   - Key functions/classes created
   - Important patterns applied

### Example: Good As-Built

```markdown
## As-Built Spec (Current Truth)

### Overview
Implemented token-based authentication using JWT stored in httpOnly cookies with refresh token rotation.

### Key Components
- `src/auth/jwt.ts`: JWT token generation and validation
- `src/auth/middleware.ts`: Express middleware for route protection
- `src/auth/refresh.ts`: Refresh token rotation logic
- `src/routes/auth.ts`: Login, logout, and refresh endpoints

### Implementation Details
- Using `jsonwebtoken` library for JWT operations
- Access token expires in 15 minutes, refresh in 7 days
- Refresh tokens stored in database with user association
- Automatic token refresh on 401 response (client-side)
- CSRF protection via SameSite cookie attribute
```

## Documenting Differences

### When Planned ≠ As-Built

This happens often. **It's normal and expected**.

Document differences clearly:

```markdown
## Differences

1. **Token Storage**: Planned to use localStorage, but used httpOnly cookies for better XSS protection
2. **Token Expiry**: Planned 1-hour access tokens, but reduced to 15 minutes after security review
3. **Additional Feature**: Added refresh token rotation (not in original plan) to prevent token reuse
```

### When No Differences

```markdown
## Differences

None. Implementation follows planned spec exactly.
```

## Design Notes: Keep Minimal

### What to Include (Minimal)

Only document:
- **Non-obvious decisions**: Why X over Y when both are valid
- **Important constraints**: Technical limitations that affected design
- **Gotchas**: Things to watch out for in future changes

### What to AVOID

Don't document:
- Obvious choices (e.g., "Used JWT because it's standard")
- Implementation details (those go in As-Built)
- Long justifications (keep to 1-3 lines per point)

### Example: Good Design Notes

```markdown
## Design Notes

- httpOnly cookies over localStorage: Prevents XSS token theft
- 15-min access token: Balance between security and UX (too short = annoying, too long = risky)
- Refresh rotation: Prevents token reuse if refresh token is compromised (see OWASP guidelines)
```

### Example: Bad Design Notes

```markdown
## Design Notes

JWT is a widely-used standard for authentication in modern web applications.
It provides stateless authentication which scales better than session-based
approaches. We chose JWT because it's industry standard and well-supported
by libraries. The token contains user information in the payload...
[continues for 20 more lines]
```

## Quick Checklist

### Creating New Spec (Gate A)
- [ ] Use template from `.claude/templates/spec-template.md`
- [ ] Fill Status as `draft`
- [ ] Write clear Goal (one line)
- [ ] List Acceptance Criteria (3-5 items)
- [ ] Describe Planned approach

### Before PR (Gate B)
- [ ] Fill As-Built Spec completely
- [ ] Document Differences (or "None")
- [ ] Update Status to `implemented`
- [ ] Add Design Notes if needed (keep minimal)
- [ ] Verify Acceptance Criteria are met
