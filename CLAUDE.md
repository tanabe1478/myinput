# Claude Code Development Rules

## Purpose & Philosophy

This document defines the development operating system for **You (Developer) × LLM collaboration**.

### Core Principles
1. **Team operations (GitHub Issues/PRs) should be minimal and noise-free**
2. **Specifications and work logs are managed locally in `.claude/`**
3. **LLM context compression is accepted; compensate with external memory (logs/specs)**

---

## File Organization

### Storage Strategy
- All specs (planned and as-built) and work logs default to **`.claude/` directory**
- `.claude/` is **LOCAL ONLY** - add to `.gitignore`, never commit to repository
- GitHub Issues are for team priority coordination only - **do not place detailed logs there**
- Information needed by team goes in **PRs** (results, impact, verification, reasoning when necessary)

### Directory Structure

```
.claude/
├── issues/YYYY-MM/<slug>-<id>.md      # Task initiation point
├── specs/YYYY-MM/<slug>-<id>.md       # Living specification document
└── log/YYYY-MM/<slug>-<id>.md         # Work log (trials, investigations)
```

### Naming Convention

**Format**: `<slug>-<id>.md`

- **slug**: English kebab-case, `[a-z0-9-]` only
- **id**: LLM-generated lowercase hex, 6-8 digits (regenerate on collision)
- **Example**: `auth-403-spike-9f3a7c.md`

**One Task = Three Files** (same `slug-id` across all):
1. Task description in `issues/`
2. Specification in `specs/`
3. Work log in `log/`

---

## Specification Philosophy (Planned + As-Built)

### What We Want
- **Planned Spec**: Intended design before implementation
- **As-Built Spec**: Reality after implementation ← **This is the source of truth**

### Key Concepts
- **As-Built is the primary spec and "correct" representation**
- Planned remains as original intent; document differences explicitly
- Design decisions (intent, constraints, pitfalls) should be **minimal annotations** (not the main content)

### Spec Structure (Minimal)

```markdown
## Status
[draft / implementing / implemented / changed]

## Goal
[What we want to achieve]

## Acceptance Criteria
[How we know it's done]

## Planned Spec (Intended)
[Original design intention]

## As-Built Spec (Current Truth)
[← Update this before PR creation]
[Actual implementation details]

## Differences
[Planned vs As-Built differences, or "None"]

## Design Notes
[Minimal: 1-3 lines / Maximum: a few bullet points]
[Only essential decisions, constraints, or gotchas]
```

---

## Development Workflow (Low-Cost, Complete: Two Gates)

### Gate A: Task Start
1. Ask LLM (Claude Code/Cursor) to create:
   - `.claude/issues/YYYY-MM/<slug>-<id>.md`
   - `.claude/specs/YYYY-MM/<slug>-<id>.md` (Status: draft)
2. Quickly review Goal / Acceptance Criteria
3. Begin development

### Gate B: Before PR Creation
1. Ask LLM to update specs based on implementation and logs:
   - Update **As-Built Spec**
   - Document **Differences**
   - Update **Status**
2. Use updated spec to **create PR description**
   - Essential: Results, Impact, Verification (expressed in tests)
   - When needed: Why (difficult decisions, complexity, tradeoffs)

---

## GitHub Integration (Minimize Noise)

### GitHub Issues
- Used for **team operation and priority coordination**
- **Do not place detailed logs** in GitHub Issues
- Link from `.claude/` files to GitHub Issues if needed
- **Do not link back** from GitHub to local `.claude/` files

### Pull Requests
- **Consolidate team-relevant information in PRs**
- Content focus:
  - Results: What was implemented
  - Impact: What changed for users/system
  - Verification: How it was tested
  - Why (optional): Reasoning when decision was difficult/complex

---

## LLM Instructions (The Short Constitution)

**As an LLM assistant, you MUST follow these rules:**

### 1. Default Storage
- All specifications and logs default to `.claude/` directory
- Never place detailed work logs in GitHub Issues

### 2. Task Initialization
- At task start, create using `slug-id` format:
  - `.claude/issues/YYYY-MM/<slug>-<id>.md`
  - `.claude/specs/YYYY-MM/<slug>-<id>.md` (Status: draft)
- Generate unique `id` as lowercase hex (6-8 digits)
- If collision occurs, regenerate

### 3. During Work
- Append progress and findings to `.claude/log/YYYY-MM/<slug>-<id>.md`
- Keep same `slug-id` across all three files

### 4. Before PR Creation
- **MUST update spec to as-built** before writing PR description
- Update: As-Built Spec, Differences, Status
- Use updated spec as basis for PR content

### 5. Naming Rules
- **slug**: English kebab-case only (`[a-z0-9-]`)
- **id**: Lowercase hexadecimal, 6-8 digits
- Regenerate `id` on collision

### 6. Date-Based Directories
- Always use `YYYY-MM/` subdirectories (e.g., `2025-01/`)
- Create directory if it doesn't exist

---

## Examples

### Good Example
```
Task: Fix authentication 403 error

Generated files:
- .claude/issues/2025-01/auth-403-fix-9f3a7c.md
- .claude/specs/2025-01/auth-403-fix-9f3a7c.md
- .claude/log/2025-01/auth-403-fix-9f3a7c.md

PR links to GitHub Issue #42 if it exists
PR description based on updated as-built spec
```

### Bad Example
```
❌ Writing detailed investigation in GitHub Issue
❌ Creating specs in docs/ instead of .claude/specs/
❌ Using slug with uppercase or spaces
❌ Forgetting to update as-built before PR
```

---

## Quick Reference

| Action | Location | When |
|--------|----------|------|
| Start task | Create in `.claude/issues/` & `.claude/specs/` | Task start (Gate A) |
| Log work | Append to `.claude/log/` | During implementation |
| Update spec | Update `.claude/specs/` as-built | Before PR (Gate B) |
| Team info | GitHub PR description | PR creation |
| Coordination | GitHub Issues (minimal) | Team priorities only |

---

## Template Usage

Templates are available in `.claude/templates/` for:
- Issue creation
- Spec creation
- Log entries

Use these templates to maintain consistency across tasks.
