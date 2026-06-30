---
id: guide-validation-workflow
title: Validation Workflow
type: guide
status: active
owner: contributors
canonical: true
version: 1.0
related:
  - engineering-validation
ai_priority: 3
---

# Validation Workflow

## Running Validation

```bash
npm run validate
```

## What It Checks

### 1. Schema Validation (Zod)
Every JSON file must conform to its Zod schema:
- Packages → PackageSchema
- Models → ModelSchema
- Workflows → WorkflowSchema
- Cheatsheets → CheatsheetSchema
- Registry → RegistryModelSchema

### 2. Naming Conventions (kebab-case)
All IDs must match: `/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/`

### 3. File Name vs ID Match
Filename must exactly match internal `"id"` property.

### 4. Cross-Folder ID Collisions
- Core entities (package, model, workflow) share global namespace
- No two core entities can share an ID across types
- Cheatsheets can share IDs with packages/models

### 5. Referential Integrity
- All alternative references must exist
- Referenced type must match actual type
- Legacy string references detected and rejected

## Minimum Content Quality

- **Models**: 3 pros, 3 cons, 1 key_hyperparam
- **Packages**: 1 task
- **Workflows**: 3 steps
- **Cheatsheets**: 1 entry

## Placeholder Detection

Rejects: "Placeholder", "TODO", "TBD", "Coming soon", "# Instantiate model here"

## Exit Codes

- 0: Success
- 1: Validation failed

## Environment Variables

- `STRICT_REFERENCE_MODE=true`: Treat broken references as errors instead of warnings

## Reference

- See `engineering/validation.md` for detailed rules
