# Development with Claude Code

This repository uses a structured approach for LLM-assisted development with local specification and log management.

## Quick Start

### For Developers Using LLMs

1. **Read the rules**: See [CLAUDE.md](./CLAUDE.md) for complete development rules
2. **Share with your LLM**: Point Claude Code or Cursor to `CLAUDE.md` when starting work
3. **Follow the workflow**: Two-gate process (Task Start → PR Creation)

### Key Concepts

- **Local Development OS**: `.claude/` directory manages all specs and logs locally
- **Not committed**: Your `.claude/` folder stays private (see `.gitignore`)
- **Team info in PRs**: Share results and impact with team via pull requests
- **Minimal GitHub Issues**: Use only for coordination, not detailed logs

## Directory Structure

```
myinput/
├── .claude/                    # Local only (in .gitignore)
│   ├── issues/YYYY-MM/        # Task descriptions
│   ├── specs/YYYY-MM/         # Specifications (planned + as-built)
│   ├── log/YYYY-MM/           # Work logs and investigations
│   └── templates/             # Templates for consistency
├── CLAUDE.md                   # Development rules for LLMs
└── README.md                   # This file
```

## Workflow Summary

### Gate A: Starting a Task
1. LLM creates 3 files with same `<slug>-<id>`:
   - `.claude/issues/YYYY-MM/<slug>-<id>.md`
   - `.claude/specs/YYYY-MM/<slug>-<id>.md` (Status: draft)
   - `.claude/log/YYYY-MM/<slug>-<id>.md`
2. Review Goal and Acceptance Criteria
3. Begin implementation

### Gate B: Before PR
1. LLM updates spec to reflect reality (as-built)
2. Document differences between planned and as-built
3. Create PR based on updated spec

## Why This Approach?

### Problems It Solves
- **LLM context loss**: External memory in structured logs
- **Stale documentation**: As-built specs match reality
- **Noisy collaboration**: Team sees only relevant info in PRs
- **Lost decisions**: Design notes captured without clutter

### What Makes It Work
- **Local-first**: Your detailed work stays private
- **Minimal overhead**: Two simple gates, reusable templates
- **LLM-friendly**: Clear rules for AI assistants to follow
- **Living docs**: Specs evolve with implementation

## For Team Members

You won't see `.claude/` folders in commits - they're local only. All relevant information will be in:
- **Pull Requests**: Results, impact, verification, reasoning
- **GitHub Issues**: High-level coordination and priorities
- **Code & Tests**: The source of truth

## Templates

Check `.claude/templates/` for:
- `issue-template.md`: Task description structure
- `spec-template.md`: Specification format (planned + as-built)
- `log-template.md`: Work log format

## Getting Help

- Full rules: [CLAUDE.md](./CLAUDE.md)
- Ask your LLM to follow CLAUDE.md rules
- Templates in `.claude/templates/`

---

**Philosophy**: Detailed specs and logs are for you and your LLM. Clean, useful information is for your team.
