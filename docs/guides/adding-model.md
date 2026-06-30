---
id: guide-adding-model
title: Adding a Model
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

# Adding a Model

## Steps

1. **Create JSON File**
   ```bash
   touch data/models/{ml|dl|llm}/{id}.json
   ```

2. **Write Content**
   - Follow the schema in `/lib/schemas/model.ts`
   - See `engineering/content-schema.md` for detailed field guidelines
   - Ensure ID is kebab-case matching the filename
   - Choose appropriate category (ml, dl, or llm)

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
- `name`: official model name
- `category`: ml | dl | llm
- `summary`: 1-2 sentence description
- `use_when`: when to use this model
- `avoid_when`: when to avoid this model
- `pros`: at least 3 pros
- `cons`: at least 3 cons
- `inference_speed`: fast | medium | slow
- `memory_usage`: low | medium | high
- `problem_types`: array of problem types
- `key_hyperparams`: at least 1 hyperparameter (unless detection-only)
- `quick_start`: example code snippet
- `sources`: at least one valid URL
- `created_at`: YYYY-MM-DD format
- `updated_at`: YYYY-MM-DD format

## Common Mistakes

- Wrong category for model type
- Less than 3 pros/cons
- Missing key hyperparameters
- Leaving sources array empty

## Reference

- See `engineering/content-schema.md` for detailed field guidelines
- See `engineering/validation.md` for validation rules
