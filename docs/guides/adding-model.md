---
id: guide-adding-model
title: Adding a Model
type: guide
status: active
owner: contributors
canonical: true
version: 2.0
related:
  - engineering-content-schema
  - engineering-validation
ai_priority: 4
---

# Adding a Model

This guide outlines the step-by-step workflow and requirements for adding a Machine Learning, Deep Learning, or Large Language Model profile to the AI Engineering Handbook.

## Steps

1. **Create JSON File**
   Create a JSON file under the appropriate category subdirectory in `data/models/`:
   - Classic ML: `data/models/ml/{id}.json`
   - Deep Learning: `data/models/dl/{id}.json`
   - Large Language Models: `data/models/llm/{id}.json`
   
   *Example:* `data/models/llm/llama-3-8b.json`

2. **Write Content**
   - Populate the JSON content according to the schema defined in [`lib/schemas/model.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/model.ts) and [`lib/schemas/base.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/base.ts).
   - Ensure the internal `id` matching the filename exactly.
   - Match the internal `category` field with the folder name (`"ml"`, `"dl"`, or `"llm"`).

3. **Build Navigation Index**
   Rebuild the navigation index so the new model is registered and discoverable in the UI:
   ```bash
   npm run build:nav
   ```

4. **Validate**
   Run the content validation test suite locally to verify schema compliance, rating enums, and referential integrity:
   ```bash
   npm run validate
   ```

---

## Required Fields

Every model JSON must include the following global metadata and model-specific fields:

### Global Metadata Fields (BaseMeta)
- `id`: Unique kebab-case identifier (must match the filename exactly).
- `title`: Display title for the model (e.g., `"Random Forest"` or `"Llama 3 8B"`).
- `name`: Official name of the model (e.g., `"Random Forest Classifier"`).
- `slug`: URL-friendly slug (typically matches the `id`).
- `description`: 1-2 sentence overview of the model's architecture or purpose.
- `created_at`: Strict `YYYY-MM-DD` date format.
- `updated_at`: Strict `YYYY-MM-DD` date format.
- `sources`: Array of URLs representing documentation, paper, or model cards (must contain at least one valid URL).

### Model-Specific Fields
- `category`: Strict enum: `"ml"` | `"dl"` | `"llm"`.
- `problem_types`: Array of supported task types: `"classification"` | `"regression"` | `"clustering"` | `"generation"` | `"embedding"` | `"detection"` | `"segmentation"`.
- `summary`: Brief conceptual explanation of how the model works under the hood.
- `use_when`: Concise rule of thumb outlining when to select this model.
- `avoid_when`: Concise rule of thumb outlining when to bypass this model.
- `pros`: Array of technical advantages (minimum of 3).
- `cons`: Array of technical disadvantages/limitations (minimum of 3).
- `key_hyperparams`: Array of key hyperparameter settings (minimum of 1, unless the model is strictly `detection`-only).
- `training_speed`: Strict enum: `"fast"` | `"medium"` | `"slow"`.
- `inference_speed`: Strict enum: `"fast"` | `"medium"` | `"slow"`.
- `memory_usage`: Strict enum: `"low"` | `"medium"` | `"high"`.
- `interpretability`: Strict enum: `"high"` | `"medium"` | `"low"`.
- `quick_start`: Multi-line Python snippet demonstrating instantiation, fitting, or inference.
- `alternatives`: Array of `ContentRef` objects pointing to alternative models.
- `related_workflows`: Array of plain string IDs representing engineering workflows utilizing the model.

---

## Field Guidance & Structure

### `key_hyperparams` Array Structure
Each object inside the `key_hyperparams` array must follow this shape:
```typescript
interface HyperParameter {
  name: string;                   // Framework-specific parameter name (e.g., "n_estimators", "temperature")
  default: string | number | null; // The default value. MUST be a JSON primitive. Boolean or objects are not allowed.
  note: string;                   // Tuning advice or performance impact
}
```

### `alternatives` Array Structure
Must use typed `ContentRef` objects instead of plain strings:
```json
"alternatives": [
  { "id": "lightgbm", "type": "model" }
]
```

### `quick_start` Snippet Rules
- **No Markdown Code Fences**: Write the snippet as raw text inside the JSON string (do not wrap in `` ```python ``). Fencing is applied automatically by the UI renderer.
- **Runnable**: Ensure it is clean, executable code demonstrating imports, initialization, and inference.

---

## Common Mistakes

- **Incorrect Ratings**: Using ratings like `"very fast"` or `"high"` for speed fields, which only accept `"fast" | "medium" | "slow"`.
- **Too Few Pros or Cons**: Providing less than 3 advantages or 3 limitations.
- **Markdown Fences in code**: Surrounding the `quick_start` snippet with markdown backticks inside the JSON value.
- **Non-Primitive Defaults**: Using booleans (e.g., `true`) or nested objects in the `default` field of `key_hyperparams`.

## References

- See [`docs/engineering/content-schema.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/content-schema.md) for detailed field guidelines.
- See [`docs/engineering/validation.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/validation.md) for validation rules.
