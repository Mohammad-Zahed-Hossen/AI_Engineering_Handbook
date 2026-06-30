---
id: guide-adding-cheatsheet
title: Adding a Cheatsheet
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

# Adding a Cheatsheet

## Steps

1. **Create JSON File**
   ```bash
   touch data/cheatsheets/{id}.json
   ```

2. **Write Content**
   - Follow the schema in `/lib/schemas/cheatsheet.ts`
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
- `name`: cheatsheet name
- `summary`: 1-2 sentence description
- `entries`: at least 1 entry
- `sources`: at least one valid URL
- `created_at`: YYYY-MM-DD format
- `updated_at`: YYYY-MM-DD format

## Entry Structure

Each entry must include:
- `problem`: the problem being solved
- `trigger`: mental trigger for when to use
- `snippet`: code snippet
- `minimal_notes`: brief explanation
- `common_bug`: common mistake to avoid
- `docs_url`: link to official documentation

## Common Mistakes

- No entries in cheatsheet
- Missing docs_url for entries
- Leaving sources array empty
- Vague problem descriptions

## Reference

- See `engineering/content-schema.md` for detailed field guidelines
- See `engineering/validation.md` for validation rules
