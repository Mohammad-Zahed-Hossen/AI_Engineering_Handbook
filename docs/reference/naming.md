---
id: reference-naming
title: Naming Conventions
type: reference
status: active
owner: contributors
canonical: true
version: 1.0
related:
  - engineering-content-schema
  - engineering-validation
ai_priority: 5
---

# Naming Conventions

## Content IDs

### Format
- **Pattern**: `/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/`
- **Examples**: `numpy`, `scikit-learn`, `random-forest`, `rag`
- **Invalid**: `NumPy`, `numpy.json`, `my_package`, `-invalid`, `invalid-`

### Rules
- Must be kebab-case (lowercase with hyphens)
- Must match the filename exactly
- Single-character IDs are allowed (e.g., `a`, `1`)
- Cannot start or end with hyphen

### Common Mistakes
- Using camelCase: `myPackage` ❌
- Using underscores: `my_package` ❌
- Using uppercase: `MyPackage` ❌
- Including extension: `package.json` ❌

---

## Package Aliases

### Hardcoded Mappings
| Alias | Full Name |
|-------|-----------|
| np | numpy |
| torch | pytorch |
| pd | pandas |
| sklearn | scikit-learn |
| tf | tensorflow |
| plt | matplotlib |

### Usage
Used in search tokenization to expand queries:
- Query "np" → searches for "numpy"
- Query "torch" → searches for "pytorch"

---

## Model Categories

### Categories
- `ml`: Machine Learning (traditional ML models)
- `dl`: Deep Learning (neural networks)
- `llm`: Large Language Models

### Problem Types
- `classification`
- `regression`
- `clustering`
- `dimensionality-reduction`
- `anomaly-detection`
- `reinforcement-learning`
- `generation`
- `embedding`
- `vision`
- `nlp`
- `multimodal`
- `speech`
- `ocr`

---

## Registry Tasks

### Task Names
- `embedding`
- `llms`
- `rerankers`
- `vision`
- `speech`
- `multimodal`
- `ocr`

### Configuration
Defined in `lib/config/registry.ts` (single source of truth)

---

## File Naming

### JSON Files
- Pattern: `{id}.json`
- Example: `numpy.json`, `random-forest.json`

### Navigation Indexes
- Pattern: `_nav.json`
- Location: One per content directory

### TypeScript Files
- Pattern: `kebab-case.ts`
- Example: `data.ts`, `search.ts`, `validation.ts`

### Component Files
- Pattern: `PascalCase.tsx`
- Example: `Sidebar.tsx`, `SearchBox.tsx`

---

## ContentRef Format

### Structure
```json
{
  "id": "numpy",
  "type": "package"
}
```

### Valid Types
- `package`
- `model`
- `workflow`
- `cheatsheet`

### Legacy Format (Deprecated)
```json
"numpy"  // String format is deprecated, use object format
```

---

## Date Formats

### Required Format
- **Pattern**: `YYYY-MM-DD`
- **Examples**: `2024-01-15`, `2026-06-30`

### Invalid Formats
- `2024/01/15` ❌
- `01-15-2024` ❌
- `2024-01-15T10:30:00Z` ❌
- `today` ❌

---

## Related Documentation

- **Content Schema**: See `engineering/content-schema.md`
- **Validation Rules**: See `engineering/validation.md`
