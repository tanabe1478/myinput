# GitHub Integration Rules

## Core Principle

**Minimize noise. Maximize signal.**

- GitHub Issues: Team coordination only
- Pull Requests: Consolidate essential information
- `.claude/` files: Detailed logs stay local

## GitHub Issues

### What Goes in GitHub Issues

**Only high-level information**:
- Problem statement or feature request
- Business context or user impact
- Priority and dependencies
- Links to external resources (if any)

### What NEVER Goes in GitHub Issues

**Avoid detailed logs**:
- Investigation notes
- Trial-and-error attempts
- Design iterations
- Code exploration findings
- LLM conversation logs

These belong in `.claude/log/YYYY-MM/<slug>-<id>.md`

### Linking

**Allowed**: Link FROM `.claude/` files TO GitHub Issues
```markdown
## Related
- GitHub Issue: [#42](https://github.com/org/repo/issues/42)
```

**Avoid**: Linking FROM GitHub Issues TO `.claude/` files
- `.claude/` is local only, not shared with team
- Team members can't access these links

## Pull Requests

### What Goes in PRs

**Essential information only**:

1. **Results**: What was implemented
   - Features added
   - Bugs fixed
   - Improvements made

2. **Impact**: What changed for users/system
   - User-facing changes
   - API changes
   - Performance impact
   - Breaking changes

3. **Verification**: How it was tested
   - Test names and scenarios
   - Manual testing steps (if any)
   - Edge cases covered

4. **Why** (optional): Reasoning for complex decisions
   - Only when decision was non-obvious
   - Only when trade-offs were significant
   - Keep brief (2-3 lines per decision)

### PR Description Template

```markdown
## Summary
[One-line description of what was done]

## Changes
- Change 1
- Change 2
- Change 3

## Impact
- Impact on users: [description]
- Impact on system: [description]
- Breaking changes: [Yes/No, details if yes]

## Testing
- [ ] Unit tests: `test_name_1`, `test_name_2`
- [ ] Integration tests: `test_name_3`
- [ ] Manual testing: [describe if applicable]

## Notes
[Optional: Complex decisions or trade-offs, if any]

## Related
- Closes #42
- Related to #38
```

### When to Include "Why"

**Include reasoning when**:
- Decision was difficult or controversial
- Multiple valid approaches existed
- Trade-offs were significant
- Unusual pattern or architecture used
- Future maintainers need context

**Skip reasoning when**:
- Implementation is straightforward
- Pattern is standard/conventional
- Change is obvious bug fix
- Trade-offs are minimal

### Example: PR with Good "Why"

```markdown
## Summary
Implement authentication using JWT with httpOnly cookies

## Changes
- Add JWT token generation and validation
- Implement refresh token rotation
- Add authentication middleware
- Create login/logout endpoints

## Impact
- Users can now log in and access protected routes
- Tokens automatically refresh before expiry
- No breaking changes (new feature)

## Testing
- [ ] Unit tests: `jwt_generation`, `token_validation`, `refresh_rotation`
- [ ] Integration tests: `login_flow`, `protected_route_access`
- [ ] Manual: Tested login/logout in browser

## Notes
**Token Storage**: Using httpOnly cookies instead of localStorage to prevent XSS attacks. This prevents JavaScript from accessing tokens, significantly reducing attack surface.

**Short Access Token**: 15-minute expiry (not 1 hour) after security review. Balances security (shorter = less risk if compromised) with UX (auto-refresh prevents user disruption).

## Related
- Closes #42
```

## Information Flow

### Development to Team

```
┌─────────────────────┐
│ .claude/ (local)    │
│ - Detailed logs     │
│ - Investigations    │
│ - Design iterations │
└──────────┬──────────┘
           │
           │ Distill & Polish
           ▼
┌─────────────────────┐
│ Pull Request        │
│ - Results           │
│ - Impact            │
│ - Verification      │
│ - Why (if needed)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Team Review         │
└─────────────────────┘
```

### Coordination Flow

```
GitHub Issue (High-level)
    │
    ├─→ .claude/issues/ (Task context)
    │
    ├─→ .claude/specs/ (Design & As-Built)
    │
    ├─→ .claude/log/ (Detailed work)
    │
    └─→ Pull Request (Polished results)
```

## Quick Checklist

### For GitHub Issues
- [ ] High-level problem/feature only
- [ ] No detailed investigation logs
- [ ] No code exploration notes
- [ ] Can link TO from .claude/ files

### For Pull Requests
- [ ] Based on As-Built spec (not Planned)
- [ ] Includes Results, Impact, Verification
- [ ] Includes "Why" only if decision was complex
- [ ] References related GitHub Issues
- [ ] Test coverage described

### For .claude/ files
- [ ] All detailed logs here
- [ ] Can link to GitHub Issues
- [ ] Never committed to repo
- [ ] Personal development memory
