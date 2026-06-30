---
id: reference-quick-reference
title: Quick Reference
type: reference
status: active
owner: contributors
canonical: true
version: 1.0
related:
  - engineering-project-rules
  - engineering-validation
ai_priority: 5
---

# Quick Reference

## CLI Commands

### Content Addition Workflow
```bash
# 1. Create JSON file
touch data/packages/{id}.json

# 2. Build navigation index
npm run build:nav

# 3. Validate
npm run validate

# 4. Build
npm run build
```

### Validation
```bash
npm run validate
```

### Build Navigation Index
```bash
npm run build:nav
```

### Full Build
```bash
npm run build
```

---

## Directory Structure

```
data/
├── packages/          # Package JSON files
├── models/
│   ├── ml/            # Machine Learning models
│   ├── dl/            # Deep Learning models
│   └── llm/           # Large Language Models
├── workflows/         # Workflow JSON files
├── cheatsheets/       # Cheatsheet JSON files
└── registry/          # Registry JSON arrays
```

---

## Content Type Quick Reference

### Packages
- **Location**: `data/packages/{id}.json`
- **Required**: 1 task minimum
- **Schema**: `lib/schemas/package.ts`
- **Guide**: `guides/adding-package.md`

### Models
- **Location**: `data/models/{ml|dl|llm}/{id}.json`
- **Required**: 3 pros, 3 cons, 1 hyperparam
- **Schema**: `lib/schemas/model.ts`
- **Guide**: `guides/adding-model.md`

### Workflows
- **Location**: `data/workflows/{id}.json`
- **Required**: 3 steps minimum
- **Schema**: `lib/schemas/workflow.ts`
- **Guide**: `guides/adding-workflow.md`

### Cheatsheets
- **Location**: `data/cheatsheets/{id}.json`
- **Required**: 1 entry minimum
- **Schema**: `lib/schemas/cheatsheet.ts`
- **Guide**: `guides/adding-cheatsheet.md`

---

## Validation Rules Summary

### ID Format
- Pattern: `/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/`
- Must match filename exactly

### Date Format
- Pattern: `YYYY-MM-DD`
- No timestamps, no relative dates

### Sources
- Must contain at least one valid URL
- All values must be valid URLs (Zod validation)

### ContentRef
- Use object format: `{ id: "...", type: "..." }`
- Legacy string format deprecated

### Minimum Content Quality
- **Models**: 3 pros, 3 cons, 1 hyperparam
- **Packages**: 1 task
- **Workflows**: 3 steps
- **Cheatsheets**: 1 entry

---

## Environment Variables

### STRICT_REFERENCE_MODE
- **Purpose**: Treat broken ContentRef references as errors instead of warnings
- **Usage**: `STRICT_REFERENCE_MODE=true npm run validate`
- **Default**: false (warnings only)

---

## Common Validation Errors

### Filename Mismatch
```
Error: ID "numpy" does not match filename "NumPy.json"
Fix: Rename file to "numpy.json"
```

### Invalid ID Format
```
Error: ID "MyPackage" does not match kebab-case pattern
Fix: Change to "my-package"
```

### Empty Sources
```
Error: sources array cannot be empty
Fix: Add at least one URL to sources array
```

### Broken ContentRef
```
Warning: ContentRef target "invalid-id" does not exist
Fix: Remove or fix the reference
```

### Placeholder Detection
```
Error: Placeholder detected in summary field
Fix: Replace "TODO" with actual content
```

---

## Tech Stack

- **Next.js**: 16.2.9 (App Router)
- **React**: 19.2.4
- **TypeScript**: 5 (strict mode)
- **Tailwind CSS**: v4
- **shadcn/ui**: 4.11.0
- **Fuse.js**: 7.4.2
- **Zod**: 4.4.3
- **Lucide React**: 1.21.0

---

## Related Documentation

- **Project Rules**: See `engineering/project-rules.md`
- **Validation**: See `engineering/validation.md`
- **Naming**: See `reference/naming.md`
- **Schemas**: See `reference/schemas.md`
