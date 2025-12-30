# Instructions for LLM Assistants

**If you are an LLM (Claude Code, Cursor, etc.), you MUST follow these rules.**

## Core Rules

### 1. Default Storage Location

All specifications and work logs default to `.claude/` directory:

```
✓ CORRECT:
.claude/issues/2025-12/auth-fix-9f3a7c.md
.claude/specs/2025-12/auth-fix-9f3a7c.md
.claude/log/2025-12/auth-fix-9f3a7c.md

✗ WRONG:
docs/auth-fix-spec.md
notes/work-log.md
README-auth-fix.md
```

**Never** place detailed work logs in GitHub Issues.

### 2. File Creation at Task Start

When user starts a new task, immediately:

1. Generate unique `slug-id`:
   - slug: English kebab-case from task description
   - id: Random 6-8 digit lowercase hex
   - Check for collisions, regenerate if exists

2. Create THREE files with same `slug-id`:
   ```bash
   .claude/issues/YYYY-MM/<slug>-<id>.md
   .claude/specs/YYYY-MM/<slug>-<id>.md
   .claude/log/YYYY-MM/<slug>-<id>.md
   ```

3. Use templates from `.claude/templates/`
4. Fill Goal and Acceptance Criteria
5. Set Status to `draft`

### 3. During Work

As you investigate and implement:

- **Continuously append** to `.claude/log/YYYY-MM/<slug>-<id>.md`:
  - Findings from code exploration
  - Decisions made and why
  - Issues encountered
  - Solutions tried
  - Next steps

- **Update spec Status** when you start coding:
  - `draft` → `implementing`

### 4. Before PR Creation (CRITICAL)

**You MUST update the spec before creating any PR.**

Steps:
1. Open `.claude/specs/YYYY-MM/<slug>-<id>.md`
2. Fill **As-Built Spec** section:
   - What was actually implemented
   - Real files/components created
   - Actual approaches used
3. Document **Differences** between Planned and As-Built
4. Update **Status** to `implemented`
5. Add **Design Notes** if decisions were non-obvious (keep minimal)

**Only then** create PR description based on the updated spec.

### 5. PR Creation

Base PR description on the updated As-Built spec:

- **Results**: From As-Built Overview
- **Impact**: What changed for users/system
- **Verification**: Tests written and passed
- **Why** (optional): From Design Notes, only if complex

### 6. Naming Rules

**Slug**:
- English kebab-case: `[a-z0-9-]`
- 2-5 words
- Descriptive but concise
- Examples: `auth-fix`, `api-refactor`, `user-profile-add`

**ID**:
- Lowercase hex: `[0-9a-f]{6,8}`
- Random generation
- Check for uniqueness
- Examples: `9f3a7c`, `a1b2c3`, `1234567`

**Combined**:
- Format: `<slug>-<id>`
- Examples: `auth-fix-9f3a7c`, `api-refactor-a1b2c3`

### 7. Date-Based Directories

Always use `YYYY-MM/` format:

```bash
# Current month (e.g., December 2025)
.claude/issues/2025-12/
.claude/specs/2025-12/
.claude/log/2025-12/

# Create directories if they don't exist
mkdir -p .claude/{issues,specs,log}/$(date +%Y-%m)
```

## Workflow Summary for LLMs

### Gate A: Task Start
```
1. User: "Fix authentication 403 error"
2. You: Generate slug-id → "auth-403-fix-9f3a7c"
3. You: Create three files in 2025-12/
4. You: Fill Goal, Acceptance Criteria, Planned Spec
5. You: Confirm with user
6. You: Begin implementation
```

### During Implementation
```
1. You: Investigate code
2. You: Append findings to .claude/log/
3. You: Make changes
4. You: Append decisions to .claude/log/
5. You: Update Status to "implementing"
```

### Gate B: Before PR
```
1. You: Open .claude/specs/<slug>-<id>.md
2. You: Fill "As-Built Spec" with reality
3. You: Document "Differences" from plan
4. You: Update Status to "implemented"
5. You: Create PR from As-Built content
6. You: Include test verification
```

## Common Mistakes to Avoid

### ❌ Don't Do This

```markdown
# WRONG: Creating spec in docs/
docs/authentication-spec.md

# WRONG: Using uppercase or spaces in slug
.claude/specs/2025-12/Auth-Fix-9F3A7C.md
.claude/specs/2025-12/auth fix-9f3a7c.md

# WRONG: Forgetting month directory
.claude/specs/auth-fix-9f3a7c.md

# WRONG: Creating PR without updating As-Built
[Creates PR with empty As-Built section]

# WRONG: Putting detailed logs in GitHub Issue
GitHub Issue #42:
"I investigated the auth middleware and found that the token
validation fails when... [20 more lines of investigation]"
```

### ✓ Do This

```markdown
# CORRECT: All specs in .claude/
.claude/specs/2025-12/auth-fix-9f3a7c.md

# CORRECT: Lowercase kebab-case with hex id
.claude/specs/2025-12/auth-fix-9f3a7c.md

# CORRECT: Month directory included
.claude/specs/2025-12/auth-fix-9f3a7c.md

# CORRECT: Update As-Built before PR
[Updates spec, then creates PR from it]

# CORRECT: Keep GitHub Issue high-level
GitHub Issue #42:
"Authentication returns 403 for valid tokens after recent deployment"
[Detailed investigation in .claude/log/]
```

## Checklist for Every Task

### Starting (Gate A)
- [ ] Generated unique `slug-id`
- [ ] Created three files in `YYYY-MM/` directories
- [ ] Used correct naming: `[a-z0-9-]` for slug
- [ ] Filled Goal and Acceptance Criteria
- [ ] Set Status to `draft`
- [ ] Confirmed with user

### During Work
- [ ] Appending to `.claude/log/` regularly
- [ ] Updated Status to `implementing`
- [ ] Keeping same `slug-id` across files

### Before PR (Gate B)
- [ ] Filled As-Built Spec section
- [ ] Documented Differences (or "None")
- [ ] Updated Status to `implemented`
- [ ] Added Design Notes (minimal, if needed)
- [ ] Created PR from updated spec
- [ ] Included test verification

## Remember

**Your role**: Help developer create accurate, up-to-date documentation that stays local while sharing polished results with the team.

**The goal**: Living documentation that matches reality, with minimal overhead and maximum value.

**The secret**: Two simple gates (A and B) ensure completeness without slowing down development.
