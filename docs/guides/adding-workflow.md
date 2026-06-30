---
id: guide-adding-workflow
title: Adding a Workflow
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

# Adding a Workflow

## Steps

1. **Create JSON File**
   ```bash
   touch data/workflows/{id}.json
   ```

2. **Write Content**
   - Follow the schema in `/lib/schemas/workflow.ts`
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
- `name`: workflow name
- `summary`: 1-2 sentence description
- `starter_stack`: tools and libraries
- `steps`: at least 3 steps
- `sources`: at least one valid URL
- `created_at`: YYYY-MM-DD format
- `updated_at`: YYYY-MM-DD format

## Step Structure

Each step must include:
- `name`: step name
- `what`: what this step does
- `tools`: tools used in this step
- `decision`: decision guidance
- `uses`: related packages, models, or cheatsheets

## Common Mistakes

- Less than 3 steps
- Missing decision guidance
- Leaving sources array empty
- Not linking to related content

## Reference

- See `engineering/content-schema.md` for detailed field guidelines
- See `engineering/validation.md` for validation rules
