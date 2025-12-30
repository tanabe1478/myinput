# Development with Claude Code

This repository uses a structured approach for LLM-assisted development with local specification and log management.

## Quick Start

### For Developers Using LLMs

1. **Read the rules**: See [CLAUDE.md](./CLAUDE.md) for complete development rules
2. **Share with your LLM**: Point Claude Code or Cursor to `CLAUDE.md` when starting work
3. **Follow the workflow**: Two-gate process (Task Start → PR Creation)

### Key Concepts

- **Development OS**: `.claude/` directory manages all specs and logs
- **Committed**: Your `.claude/` folder is committed for traceability
- **Branch per task**: Every task gets its own `claude/<slug>-<id>` branch
- **PR always**: Every task gets a PR, no matter how small
- **Team info in PRs**: Share results and impact with team via pull requests
- **Minimal GitHub Issues**: Use only for coordination, not detailed logs

## Directory Structure

```
myinput/
├── .claude/                    # Committed to repository
│   ├── issues/YYYY-MM/        # Task descriptions
│   ├── specs/YYYY-MM/         # Specifications (planned + as-built)
│   ├── log/YYYY-MM/           # Work logs and investigations
│   ├── rules/                 # Detailed rules (auto-loaded)
│   └── templates/             # Templates for consistency
├── docs/                       # Reference documentation
├── CLAUDE.md                   # Development rules for LLMs
└── README.md                   # This file
```

## Workflow Summary

### Gate A: Starting a Task
1. LLM creates branch `claude/<slug>-<id>`
2. LLM creates 3 files with same `<slug>-<id>`:
   - `.claude/issues/YYYY-MM/<slug>-<id>.md`
   - `.claude/specs/YYYY-MM/<slug>-<id>.md` (Status: draft)
   - `.claude/log/YYYY-MM/<slug>-<id>.md`
3. Commit and push `.claude/` files
4. Review Goal and Acceptance Criteria
5. Begin implementation

### Gate B: Before PR
1. LLM updates spec to reflect reality (as-built)
2. Document differences between planned and as-built
3. Commit and push spec updates
4. Create PR based on updated spec (required for every task)

## Why This Approach?

### Problems It Solves
- **LLM context loss**: External memory in structured logs
- **Stale documentation**: As-built specs match reality
- **Noisy collaboration**: Team sees only relevant info in PRs
- **Lost decisions**: Design notes captured without clutter

### What Makes It Work
- **Traceable**: All work committed to git for complete history
- **Branch-based**: Every task gets its own branch and PR
- **Minimal overhead**: Two simple gates, reusable templates
- **LLM-friendly**: Clear rules for AI assistants to follow
- **Living docs**: Specs evolve with implementation

## For Team Members

The `.claude/` folder contains the complete development history. For quick reference, check:
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

**Philosophy**: Detailed specs and logs are committed for traceability. Clean, actionable information is surfaced in PRs.
