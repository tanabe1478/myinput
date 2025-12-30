# Claude Code Development Rules

## Purpose & Philosophy

This defines the development OS for **You (Developer) × LLM collaboration**.

**Core Principles**:
1. Team operations (GitHub) stay minimal and noise-free
2. Specs and work logs managed locally in `.claude/`
3. LLM context compression accepted; compensate with external memory

---

## Quick Start

### File Organization
```
.claude/                                    # Local only (gitignored)
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
1. LLM creates three files with unique `slug-id`
2. Review Goal and Acceptance Criteria
3. Begin development

**Gate B (Before PR)**:
1. LLM updates spec's **As-Built** section
2. Document **Differences** from plan
3. Create PR from updated spec

---

## Documentation Structure

This CLAUDE.md provides the overview. Detailed rules are in modular files:

### Core Rules (Auto-Loaded)
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
- **PRs**: Results, Impact, Verification, Why (if complex)
- **`.claude/`**: Detailed logs stay local

### For LLMs
You MUST:
- Create files in `.claude/` with proper `slug-id`
- Use `YYYY-MM/` directories
- Update As-Built before every PR
- Keep same `slug-id` across all three files
- Follow naming rules: `[a-z0-9-]` for slug, `[0-9a-f]{6,8}` for id

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
