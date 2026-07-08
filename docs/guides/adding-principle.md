---
id: guide-adding-principle
title: Adding a Principle
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

# Adding a Principle

This guide outlines the step-by-step workflow and requirements for adding a fundamental, long-term invariant truth (Principle) to the AI Engineering Handbook.

## Steps

1. **Create JSON File**
   Create a JSON file under `data/principles/` using a lowercase, kebab-case ID as the filename:
   ```bash
   touch data/principles/{id}.json
   ```
   *Example:* `data/principles/bias-variance-tradeoff.json`

2. **Write Content**
   - Populate the JSON content according to the schema defined in [`lib/schemas/principle.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/principle.ts) and [`lib/schemas/base.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/base.ts).
   - Ensure the internal `id` matches the filename exactly.

3. **Build Navigation Index**
   Rebuild the navigation index so the new principle is registered and discoverable in the UI:
   ```bash
   npm run build:nav
   ```

4. **Validate**
   Run the content validation test suite locally to verify schema compliance and referential integrity:
   ```bash
   npm run validate
   ```

---

## Required Fields

Every principle JSON must include the following global metadata and principle-specific fields:

### Global Metadata Fields (BaseMeta)
- `id`: Unique kebab-case identifier (must match the filename exactly).
- `title`: Display title for the principle (e.g., `"Bias-Variance Trade-off"`).
- `name`: Official title of the principle (e.g., `"Bias-Variance Trade-off"`).
- `slug`: URL-friendly slug (typically matches the `id`).
- `description`: 1-2 sentence overview of the principle.
- `created_at`: Strict `YYYY-MM-DD` date format.
- `updated_at`: Strict `YYYY-MM-DD` date format.
- `sources`: Array of URLs representing core papers, textbook chapters, or reference articles (must contain at least one valid URL).

### Principle-Specific Fields
- `category`: Strict category enum: `"learning_theory"` | `"optimization"` | `"representation"` | `"systems"` | `"information_theory"` | `"statistics"` | `"probability"`.
- `statement`: The core mathematical or logical statement summarizing the principle (e.g., `"The total generalization error of a model can be decomposed into the sum of bias error, variance error, and irreducible noise."`).
- `intuition`: A clear, intuitive explanation of the principle for engineers.

---

## Optional & Relationship Fields

### Optional Parameters
- `mathematical_formulation`: (Optional) TeX or mathematical notation representing the principle formulation.
- `implications`: (Optional, default `[]`) Array of statements describing practical engineering implications (e.g., `"Overparameterization can lead to low bias but high training variance"`).
- `limitations`: (Optional, default `[]`) Array of scenarios where this principle does not hold or requires special interpretation (e.g., `"Double descent phenomenon challenges classical bias-variance curves in overparameterized regimes"`).
- `related_concepts`: (Optional, default `[]`) Array of related principle IDs.

### Inverse Cross-References (Relationship Fields)
Unlike other content schemas that link outward using `ContentRef` object arrays, principles define *inverse references* using plain string ID arrays:
- `referenced_by_patterns`: Array of pattern IDs that reference this principle.
- `referenced_by_models`: Array of model IDs that reference this principle.
- `referenced_by_workflows`: Array of workflow IDs that reference this principle.

---

## Common Mistakes

- **Adding Implementation Details**: Principles own the fundamental "why" and theoretical foundations. They must never own library APIs, installation commands, or code examples. Implementation details belong in `Package`, `Model`, or `Workflow` guides.
- **Using ContentRef Shapes for Inverse Links**: Declaring `referenced_by_patterns` using objects (e.g., `{"id": "...", "type": "..."}`) instead of plain strings of IDs (causes validator failure).
- **Missing Sources**: Omitting academic papers or textbook references, which are critical for justifying fundamental principles.

## References

- See [`docs/engineering/content-schema.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/content-schema.md) for detailed field guidelines.
- See [`docs/engineering/validation.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/validation.md) for validation rules.
