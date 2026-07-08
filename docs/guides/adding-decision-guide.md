---
id: guide-adding-decision-guide
title: Adding a Decision Guide
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

# Adding a Decision Guide

This guide outlines the step-by-step workflow and requirements for adding an engineering trade-off comparison (Decision Guide) to the AI Engineering Handbook.

## Steps

1. **Create JSON File**
   Create a JSON file under `data/decision-guides/` using a lowercase, kebab-case ID as the filename:
   ```bash
   touch data/decision-guides/{id}.json
   ```
   *Example:* `data/decision-guides/pytorch-vs-tensorflow.json`

2. **Write Content**
   - Populate the JSON content according to the schema defined in [`lib/schemas/decision-guide.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/decision-guide.ts) and [`lib/schemas/base.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/base.ts).
   - Ensure the internal `id` matches the filename exactly.

3. **Build Navigation Index**
   Rebuild the navigation index so the new decision guide is registered and discoverable in the UI:
   ```bash
   npm run build:nav
   ```

4. **Validate**
   Run the content validation test suite locally to verify schema compliance, minimum choices, and referential integrity:
   ```bash
   npm run validate
   ```

---

## Required Fields

Every decision guide JSON must include the following global metadata and decision-specific fields:

### Global Metadata Fields (BaseMeta)
- `id`: Unique kebab-case identifier (must match the filename exactly).
- `title`: Display title for the decision guide (e.g., `"PyTorch vs TensorFlow"`).
- `name`: Official title of the comparison (e.g., `"PyTorch vs TensorFlow Comparison"`).
- `slug`: URL-friendly slug (typically matches the `id`).
- `description`: 1-2 sentence overview of the trade-off topic.
- `created_at`: Strict `YYYY-MM-DD` date format.
- `updated_at`: Strict `YYYY-MM-DD` date format.
- `sources`: Array of URLs representing documentation, benchmark papers, or articles (must contain at least one valid URL).

### Decision-Specific Fields
- `category`: Strict enum: `"models"` | `"frameworks"` | `"llm"` | `"infrastructure"` | `"data_processing"` | `"deployment"`.
- `problem`: Description of the core engineering decision problem (e.g., `"Choosing the deep learning framework for production model training and serving"`).
- `evaluation_criteria`: Array of criteria to compare the options against (minimum of 1 criteria).
- `options`: Array of options compared in the guide (minimum of 2 option objects).
- `recommendations`: Detailed guidance mapping scenario parameters to recommended options.

---

## Subschemas & Field Shapes

### Evaluation Criteria Schema
```typescript
interface DecisionCriteria {
  criterion: string;       // Name of the criteria (e.g., "Developer Velocity", "Inference Speed")
  weight?: number;         // (Optional) Weight from 0 to 1 for decision matrices (defaults to 1)
  description?: string;    // (Optional) Explanation of what this criteria checks
}
```

### Options Schema
```typescript
interface DecisionOption {
  name: string;             // Display name (e.g., "PyTorch")
  id: string;               // Reference ID to corresponding catalog content (e.g., "pytorch")
  strengths: string[];      // Array of advantages/strengths
  weaknesses: string[];     // Array of disadvantages/weaknesses
  best_for: string;         // Summary of when this option is the optimal choice
  avoid_when: string;       // Summary of when this option should be bypassed
}
```

### Comparison Table (Optional)
A record containing structured comparative parameter mappings:
```json
"comparison_table": {
  "Autograd System": "Dynamic (Define-by-Run) for PyTorch vs Static/Dynamic for TensorFlow",
  "Distributed Training": "Excellent native support via torch.distributed"
}
```

### Relationship Fields
Decision guides reference related catalog nodes using standard `ContentRef` object arrays:
- `related_workflows`
- `related_packages`
- `related_models`

---

## Common Mistakes

- **Comparing Less Than 2 Options**: Compiling a decision guide that only contains one option (causes validation script failure).
- **Vague Recommendations**: Recommending options based on subjective preference rather than concrete criteria and parameters.
- **Malformed Cross-References**: Using plain string arrays for `related_packages` or `related_models` instead of `ContentRef` arrays.

## References

- See [`docs/engineering/content-schema.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/content-schema.md) for detailed field guidelines.
- See [`docs/engineering/validation.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/validation.md) for validation rules.
