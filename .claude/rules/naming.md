# Naming Conventions

## Slug-ID Format

Every task uses a unique identifier: `<slug>-<id>`

### Slug Rules

**Format**: English kebab-case
**Allowed**: `[a-z0-9-]` only (lowercase letters, numbers, hyphens)
**Length**: 2-5 words recommended

**Good Examples**:
```
auth-fix
api-refactor
user-profile-update
payment-gateway-integration
database-migration
```

**Bad Examples**:
```
AuthFix          # No uppercase
auth_fix         # No underscores
auth fix         # No spaces
authentication-bug-fix-for-403-error  # Too long
```

### ID Rules

**Format**: Lowercase hexadecimal
**Length**: 6-8 digits
**Generation**: Random by LLM
**Collision**: Regenerate if exists

**Examples**:
```
9f3a7c
a1b2c3
ff00aa
1234567
```

### ID Generation Method

Use this approach to generate IDs:
1. Generate random 6-8 digit hex string (lowercase)
2. Check if file with that `slug-id` already exists
3. If exists, regenerate
4. If unique, use it

Example generation logic:
```python
import random
import os

def generate_id():
    return ''.join(random.choices('0123456789abcdef', k=6))

def get_unique_slug_id(slug, base_dir='.claude/issues'):
    while True:
        id = generate_id()
        slug_id = f"{slug}-{id}"
        # Check if any file with this slug_id exists
        if not file_exists_with_slug_id(slug_id, base_dir):
            return slug_id
```

## File Naming

### Three Files Per Task

All three files share the same `slug-id`:

```
.claude/issues/YYYY-MM/<slug>-<id>.md
.claude/specs/YYYY-MM/<slug>-<id>.md
.claude/log/YYYY-MM/<slug>-<id>.md
```

### Directory Structure

**Month-based organization**:
```
.claude/
├── issues/
│   ├── 2025-01/
│   │   ├── auth-fix-9f3a7c.md
│   │   └── api-refactor-a1b2c3.md
│   └── 2025-02/
│       └── payment-integration-ff00aa.md
├── specs/
│   ├── 2025-01/
│   │   ├── auth-fix-9f3a7c.md
│   │   └── api-refactor-a1b2c3.md
│   └── 2025-02/
│       └── payment-integration-ff00aa.md
└── log/
    ├── 2025-01/
    │   ├── auth-fix-9f3a7c.md
    │   └── api-refactor-a1b2c3.md
    └── 2025-02/
        └── payment-integration-ff00aa.md
```

## Creating Slug from Task Description

### Process

1. **Extract key words** from task description
2. **Convert to lowercase**
3. **Join with hyphens**
4. **Remove special characters**
5. **Keep 2-5 words maximum**

### Examples

| Task Description | Slug |
|-----------------|------|
| Fix authentication 403 error | `auth-403-fix` |
| Refactor API endpoints | `api-refactor` |
| Add user profile page | `user-profile-add` |
| Update payment gateway integration | `payment-gateway-update` |
| Database schema migration for users table | `db-users-migration` |
| Performance optimization for dashboard | `dashboard-perf` |

### Slug Selection Tips

- **Be specific but concise**: `auth-fix` not `fix-bug`
- **Include key identifier**: `api-v2-migration` not `migration`
- **Use domain terms**: `payment-stripe` not `payment-service-1`
- **Avoid generic terms**: `user-profile` not `new-feature`

## Quick Reference

```bash
# Good slug-id examples
auth-403-fix-9f3a7c
api-refactor-a1b2c3
user-profile-ff00aa
payment-integration-1234567

# Pattern
[a-z0-9-]{5,30}-[0-9a-f]{6,8}
```
