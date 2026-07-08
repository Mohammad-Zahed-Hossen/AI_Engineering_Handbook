---
id: guide-adding-workflow
title: Adding a Workflow
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

# Adding a Workflow

This guide outlines the step-by-step workflow and requirements for adding a detailed engineering pipeline or code walkthrough (workflow) to the AI Engineering Handbook.

## Steps

1. **Create JSON File**
   Create a JSON file under `data/workflows/` using the lowercase, kebab-case ID as the filename:
   ```bash
   touch data/workflows/{id}.json
   ```
   *Example:* `data/workflows/rag.json`

2. **Write Content**
   - Populate the JSON content according to the schema defined in [`lib/schemas/workflow.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/workflow.ts) and [`lib/schemas/base.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/base.ts).
   - Ensure the internal `id` matches the filename exactly.

3. **Build Navigation Index**
   Rebuild the navigation index so the new workflow is registered and discoverable in the UI:
   ```bash
   npm run build:nav
   ```

4. **Validate**
   Run the content validation test suite locally to verify schema compliance, step indexing, and referential integrity:
   ```bash
   npm run validate
   ```

---

## Required Fields

Every workflow JSON must include the following global metadata and workflow-specific fields:

### Global Metadata Fields (BaseMeta)
- `id`: Unique kebab-case identifier (must match the filename exactly).
- `title`: Display title for the workflow (e.g., `"Retrieval-Augmented Generation"`).
- `name`: Official title of the workflow (e.g., `"Retrieval-Augmented Generation"`).
- `slug`: URL-friendly slug (typically matches the `id`).
- `description`: 1-2 sentence overview of the pipeline's goal.
- `created_at`: Strict `YYYY-MM-DD` date format.
- `updated_at`: Strict `YYYY-MM-DD` date format.
- `sources`: Array of URLs representing primary documentation sources (must contain at least one valid URL).

### Workflow-Specific Fields
- `type`: Strict enum: `"pipeline"` (multi-step workflow) | `"snippet"` (quick coding walkthrough).
- `category`: Engineering category name (e.g., `"Inference"`, `"Fine-Tuning"`, `"Evaluation"`).
- `overview`: A high-level description of what the workflow achieves.
- `starter_stack`: Array of recommended libraries/technologies (e.g., `["LlamaIndex", "ChromaDB", "SentenceTransformers"]`).
- `steps`: Array of workflow steps (minimum of 3 steps).
- `common_failure_points`: Array of overall pipeline failure warnings.

---

## Steps Structure

Each object inside the `steps` array must adhere to the following schema:

```typescript
interface WorkflowStep {
  step: number;                 // Sequential 1-indexed step number (1, 2, 3, etc.)
  name: string;                 // Title of the step
  what: string;                 // Technical description of the operation performed
  tools: string[];              // Specific software tools or class references utilized (e.g., ["PyMuPDF", "FAISS"])
  decision: string;             // Structural parameter guidelines or architectural decision notes
  uses: {                       // References to cataloged packages, models, and cheatsheets used in this step
    packages: string[];         // Array of package IDs
    models: string[];           // Array of model IDs
    cheatsheets: string[];      // Array of cheatsheet IDs
  };
  failure_points: string[];     // Specific failure scenarios for this step with root causes
}
```

---

## Relationship & Optional Fields

### Cross-Reference Fields (ContentRef Arrays)
Relationships linking the workflow to other content types must use arrays of `ContentRef` objects:
- `related_patterns`
- `related_models`
- `related_packages`
- `related_debug_guides`

*Example:*
```json
"related_debug_guides": [
  { "id": "cuda-oom", "type": "debug_guide" }
]
```

### Optional Metadata & Tuning
- `evaluation_checks`: (Optional) Measurable success criteria or validation metrics.
- `next_links`: (Optional) Plain string IDs of workflows to explore next.
- `worked_examples`: (Optional) Array of objects: `{ "name": string, "description": string, "implementation_notes"?: string }`.
- `production_notes`: (Optional) Production deployment notes.
- `scaling_notes`: (Optional) Scaling considerations.

---

## Common Mistakes

- **Incorrect Step Indexing**: Starting step numbers at `0` instead of `1`, or using strings (`"1"`) instead of integers.
- **Too Few Steps**: Providing less than 3 steps.
- **Incorrect `uses` Object Format**: Forgetting to define `packages`, `models`, or `cheatsheets` as arrays inside `uses`, or leaving the parent `uses` object out entirely.
- **Plain Strings in Relationships**: Using string arrays for `related_packages` or `related_models` instead of the required `ContentRef` format.

## References

- See [`docs/engineering/content-schema.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/content-schema.md) for detailed field guidelines.
- See [`docs/engineering/validation.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/validation.md) for validation rules.
