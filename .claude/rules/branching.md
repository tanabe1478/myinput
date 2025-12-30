# Branch Strategy and PR Rules

## Core Rule: One Task = One Branch = One PR

**Every task requires**:
1. A new git branch
2. Completion of the task
3. A pull request (PR)

**No exceptions**, even for small tasks. This ensures:
- Commit history is clean and traceable
- Every change is reviewed and documented
- Easy rollback if issues arise
- Clear history of what was done when

---

## Branch Naming Convention

### Format
```
claude/<slug>-<id>
```

- **Prefix**: Always `claude/` for LLM-created branches
- **slug**: Same kebab-case slug from task files
- **id**: Same hex ID from task files

### Examples
```bash
# Task: Fix authentication 403 error
# slug-id: auth-403-fix-9f3a7c
claude/auth-403-fix-9f3a7c

# Task: Refactor API endpoints
# slug-id: api-refactor-a1b2c3
claude/api-refactor-a1b2c3

# Task: Add user profile page
# slug-id: user-profile-add-ff00aa
claude/user-profile-add-ff00aa
```

### Consistency
Branch name MUST match the `slug-id` used in `.claude/` files:
```
.claude/issues/2025-01/auth-403-fix-9f3a7c.md   ✓
.claude/specs/2025-01/auth-403-fix-9f3a7c.md    ✓
.claude/log/2025-01/auth-403-fix-9f3a7c.md      ✓
Branch: claude/auth-403-fix-9f3a7c              ✓
```

---

## Workflow: From Task to PR

### Step 1: Task Start (Gate A)

When user requests a new task:

1. **Generate `slug-id`** (e.g., `auth-fix-9f3a7c`)

2. **Create branch**:
   ```bash
   git checkout -b claude/auth-fix-9f3a7c
   ```

3. **Create three `.claude/` files**:
   - `.claude/issues/YYYY-MM/auth-fix-9f3a7c.md`
   - `.claude/specs/YYYY-MM/auth-fix-9f3a7c.md` (Status: draft)
   - `.claude/log/YYYY-MM/auth-fix-9f3a7c.md`

4. **Commit the `.claude/` files**:
   ```bash
   git add .claude/
   git commit -m "Start task: auth-fix-9f3a7c - Fix authentication issue"
   ```

5. **Push branch**:
   ```bash
   git push -u origin claude/auth-fix-9f3a7c
   ```

6. **Begin implementation**

### Step 2: During Work

As you work:

1. **Make code changes**
2. **Update `.claude/log/`** with findings
3. **Commit regularly**:
   ```bash
   git add .
   git commit -m "Implement token validation fix"
   ```
4. **Push updates**:
   ```bash
   git push
   ```

### Step 3: Before PR (Gate B)

Before creating PR:

1. **Update spec** in `.claude/specs/YYYY-MM/<slug>-<id>.md`:
   - Fill **As-Built Spec** section
   - Document **Differences**
   - Update **Status** to `implemented`

2. **Commit spec update**:
   ```bash
   git add .claude/specs/
   git commit -m "Update spec with as-built details"
   git push
   ```

3. **Create PR** using `gh pr create`:
   ```bash
   gh pr create \
     --title "Fix authentication 403 error" \
     --body "$(cat <<'EOF'
   ## Summary
   Fixed authentication middleware token validation

   ## Changes
   - Fixed typo in token expiry validation
   - Added test coverage for expired tokens

   ## Impact
   - Users with valid tokens no longer receive 403 errors
   - Better error messages for debugging

   ## Testing
   - [x] Unit test: should_reject_expired_tokens
   - [x] Integration test: auth_flow_with_token_expiry

   ## Related
   - Closes #42
   EOF
   )"
   ```

4. **Verify PR created**:
   - PR should link to the branch
   - PR description should be based on As-Built spec

---

## Important Rules for LLMs

### 1. Always Create a Branch

**NEVER work on main/master branch directly.**

When user says:
- "Fix the authentication bug"
- "Add a new feature"
- "Refactor the code"
- "Update the documentation"

You MUST:
1. Generate `slug-id`
2. Create branch `claude/<slug>-<id>`
3. Create `.claude/` files
4. Commit and push `.claude/` files
5. Then start implementation

### 2. Branch Before Files

**Order matters**:
```
✓ CORRECT ORDER:
1. git checkout -b claude/task-id
2. Create .claude/ files
3. git add .claude/
4. git commit
5. git push
6. Start implementation

✗ WRONG ORDER:
1. Create .claude/ files
2. Start implementation
3. [Forget to create branch]
4. Commit to main  ← WRONG!
```

### 3. Always Create PR

**Every task ends with a PR, no matter how small.**

Small tasks that still need PRs:
- Fixing a typo (still needs PR)
- Adding a single comment (still needs PR)
- Updating one line of config (still needs PR)

**Why**:
- Maintains clean commit history
- Provides documentation of changes
- Enables code review process
- Makes rollback easier

### 4. Commit .claude/ Files

**IMPORTANT**: `.claude/` directory is now **committed to git**.

Always commit:
- `.claude/issues/<slug>-<id>.md`
- `.claude/specs/<slug>-<id>.md`
- `.claude/log/<slug>-<id>.md`

Commit at key points:
- **Gate A**: After creating initial files
- **During work**: When significant findings are logged
- **Gate B**: After updating As-Built spec

### 5. Push Early, Push Often

Push your branch after:
- Creating initial `.claude/` files
- Every few commits during implementation
- Before creating PR

This ensures:
- Work is backed up
- Others can see progress
- Commit history is preserved

---

## Small Task Example

### User: "Fix typo in README"

**LLM Response**:

```bash
# 1. Generate slug-id
slug-id: readme-typo-fix-a1b2c3

# 2. Create and switch to branch
git checkout -b claude/readme-typo-fix-a1b2c3

# 3. Create .claude/ files
mkdir -p .claude/{issues,specs,log}/2025-01
# Create issue, spec, log files with slug-id

# 4. Commit .claude/ files
git add .claude/
git commit -m "Start task: readme-typo-fix-a1b2c3 - Fix typo in README"
git push -u origin claude/readme-typo-fix-a1b2c3

# 5. Fix the typo
# Edit README.md

# 6. Commit the fix
git add README.md
git commit -m "Fix typo: 'recieve' → 'receive'"
git push

# 7. Update spec (Gate B)
# Update .claude/specs/2025-01/readme-typo-fix-a1b2c3.md
git add .claude/specs/
git commit -m "Update spec with as-built details"
git push

# 8. Create PR
gh pr create --title "Fix typo in README" --body "..."
```

**Result**: PR #123 created for a simple typo fix. Clean, traceable, reviewable.

---

## Checklist for Every Task

### Gate A: Task Start
- [ ] Generated unique `slug-id`
- [ ] Created branch `claude/<slug>-<id>`
- [ ] Created three `.claude/` files
- [ ] Committed `.claude/` files
- [ ] Pushed branch to remote
- [ ] Confirmed with user

### During Work
- [ ] Making regular commits
- [ ] Updating `.claude/log/` with findings
- [ ] Pushing changes regularly

### Gate B: Before PR
- [ ] Updated As-Built Spec
- [ ] Documented Differences
- [ ] Updated Status to `implemented`
- [ ] Committed spec updates
- [ ] Pushed final changes
- [ ] Created PR with detailed description
- [ ] PR includes test verification
- [ ] PR links to related issues (if any)

---

## Summary

**Golden Rules**:
1. **One task = One branch = One PR**
2. **Branch name = `claude/<slug>-<id>`**
3. **Create branch BEFORE creating files**
4. **Commit `.claude/` files to git**
5. **Push early and often**
6. **Every task gets a PR, even tiny ones**
7. **Never work directly on main branch**

**Why This Matters**:
- Clean commit history
- Traceable changes
- Easy rollback
- Code review process
- Team visibility
- Documentation of decisions
