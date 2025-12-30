# Development Workflow

## Two-Gate Process

### Gate A: Task Start

When starting any task, you MUST:

1. **Create three files** with the same `slug-id`:
   - `.claude/issues/YYYY-MM/<slug>-<id>.md`
   - `.claude/specs/YYYY-MM/<slug>-<id>.md` (Status: draft)
   - `.claude/log/YYYY-MM/<slug>-<id>.md` (create empty initially)

2. **Use templates** from `.claude/templates/`:
   - Copy structure from `issue-template.md`
   - Copy structure from `spec-template.md`
   - Fill in Goal and Acceptance Criteria

3. **Quick review** with user:
   - Confirm Goal is clear
   - Verify Acceptance Criteria
   - Begin development immediately after

### Gate B: Before PR Creation

Before creating any PR, you MUST:

1. **Update the spec** in `.claude/specs/YYYY-MM/<slug>-<id>.md`:
   - Fill in **As-Built Spec** section with actual implementation
   - Document **Differences** between Planned and As-Built
   - Update **Status** field (draft → implementing → implemented)
   - Add **Design Notes** if any non-obvious decisions were made

2. **Create PR description** based on updated spec:
   - **Results**: What was implemented (from As-Built)
   - **Impact**: What changed for users/system
   - **Verification**: How it was tested (test names, scenarios)
   - **Why** (optional): Only if decision was difficult/complex

3. **Never skip Gate B**:
   - Spec MUST reflect reality before PR
   - PR description MUST be based on updated spec
   - This ensures living documentation stays accurate

## During Development

### Logging Work

As you work, continuously append to `.claude/log/YYYY-MM/<slug>-<id>.md`:

- Investigation findings
- Decisions made and reasoning
- Issues encountered and solutions
- Code locations explored
- API behaviors discovered
- Next steps and todos

### When Spec Changes

If your implementation diverges from the planned spec:

1. **Don't worry** - this is expected and normal
2. **Keep working** - finish implementation first
3. **Document at Gate B** - update As-Built and Differences sections

## Date-Based Directories

**IMPORTANT**: Always use `YYYY-MM/` subdirectories:

```bash
# Correct
.claude/issues/2025-12/auth-fix-a1b2c3.md
.claude/specs/2025-12/auth-fix-a1b2c3.md
.claude/log/2025-12/auth-fix-a1b2c3.md

# Wrong
.claude/issues/auth-fix-a1b2c3.md
```

Create the month directory if it doesn't exist:
```bash
mkdir -p .claude/issues/$(date +%Y-%m)
mkdir -p .claude/specs/$(date +%Y-%m)
mkdir -p .claude/log/$(date +%Y-%m)
```

## Quick Checklist

### Starting Task (Gate A)
- [ ] Generate unique `slug-id` (hex 6-8 digits)
- [ ] Create three files in `YYYY-MM/` directories
- [ ] Fill Goal and Acceptance Criteria
- [ ] Confirm with user before proceeding

### Before PR (Gate B)
- [ ] Update As-Built Spec section
- [ ] Document Differences (or write "None")
- [ ] Update Status field
- [ ] Create PR description from updated spec
- [ ] Include test verification details
