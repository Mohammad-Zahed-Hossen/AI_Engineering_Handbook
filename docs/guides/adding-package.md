---
id: guide-adding-package
title: Adding a Package
type: guide
status: active
owner: contributors
canonical: true
version: 1.0
related:
  - engineering-content-schema
  - engineering-validation
ai_priority: 4
---

# Adding a Package

## Steps

1. **Create JSON File**
   ```bash
   touch data/packages/{id}.json
   ```

2. **Write Content**
   - Follow the schema in `/lib/schemas/package.ts`
   - See `engineering/content-schema.md` for detailed field guidelines
   - Ensure ID is kebab-case matching the filename

3. **Build Navigation Index**
   ```bash
   npm run build:nav
   ```

4. **Validate**
   ```bash
   npm run validate
   ```

## Required Fields

- `id`: kebab-case, must match filename
- `name`: official properly-cased name
- `version`: semantic version (X.Y.Z)
- `install`: exact CLI command
- `import_as`: canonical Python import
- `summary`: 1-2 sentence description
- `tasks`: at least 1 task
- `sources`: at least one valid URL
- `created_at`: YYYY-MM-DD format
- `updated_at`: YYYY-MM-DD format

## Common Mistakes

- Wrapping install command in markdown backticks
- Using "latest" instead of semantic version
- Leaving sources array empty
- Mismatching ID casing (e.g., "Pandas" vs "pandas")

## Reference

- See `engineering/content-schema.md` for detailed field guidelines
- See `engineering/validation.md` for validation rules
