---
id: guide-adding-debug-guide
title: Adding a Debug Guide
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

# Adding a Debug Guide

This guide outlines the step-by-step workflow and requirements for adding a symptom-first troubleshooting guide to the AI Engineering Handbook.

## Steps

1. **Create JSON File**
   Create a JSON file under `data/debug-guides/` using a lowercase, kebab-case ID as the filename:
   ```bash
   touch data/debug-guides/{id}.json
   ```
   *Example:* `data/debug-guides/cuda-oom.json`

2. **Write Content**
   - Populate the JSON content according to the schema defined in [`lib/schemas/debug-guide.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/debug-guide.ts) and [`lib/schemas/base.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/base.ts).
   - Ensure the internal `id` matches the filename exactly.

3. **Build Navigation Index**
   Rebuild the navigation index so the new debug guide is registered and discoverable in the UI:
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

Every debug guide JSON must include the following global metadata and debug-specific fields:

### Global Metadata Fields (BaseMeta)
- `id`: Unique kebab-case identifier (must match the filename exactly).
- `title`: Display title for the debug guide (e.g., `"CUDA Out of Memory"`).
- `name`: Official title of the guide (e.g., `"CUDA Out of Memory Troubleshooting Guide"`).
- `slug`: URL-friendly slug (typically matches the `id`).
- `description`: 1-2 sentence overview of the troubleshooting topic.
- `created_at`: Strict `YYYY-MM-DD` date format.
- `updated_at`: Strict `YYYY-MM-DD` date format.
- `sources`: Array of URLs representing documentation, forums, or issue threads (must contain at least one valid URL).

### Debug-Specific Fields
- `category`: Strict enum: `"training"` | `"gpu"` | `"data"` | `"llm"` | `"python"` | `"deployment"` | `"performance"` | `"memory"`.
- `symptoms`: Array containing observable failure states (minimum of 1 symptom).
- `root_causes`: Array containing potential root causes, ordered by probability (minimum of 1 cause).
- `diagnosis`: Array of steps showing how to isolate and identify the cause (minimum of 1 diagnosis check).
- `solutions`: Array of step-by-step procedures to resolve the error (minimum of 1 solution).
- `prevention`: Array detailing how to avoid encountering the problem again (minimum of 1 prevention plan).

---

## Nested Structures & Subschemas

### Symptoms Array
```typescript
interface DebugSymptom {
  symptom: string;           // Title or short description of failure (e.g., "RuntimeError: CUDA out of memory.")
  description?: string;      // (Optional) Verbose log output snippet or diagnostic description
}
```

### Root Causes Array
```typescript
interface DebugRootCause {
  cause: string;                             // Short description of the cause (e.g., "Batch size is too large for GPU VRAM")
  probability?: "high" | "medium" | "low";  // Likelihood (defaults to "medium")
  explanation?: string;                      // (Optional) Theoretical reason for why this cause triggers the failure
}
```

### Diagnosis Checks Array
```typescript
interface DebugDiagnosis {
  test: string;             // Diagnostic command or code snippet to run
  expected_result: string;  // Expected output if this is indeed the root cause
  how_to_perform: string;   // Steps detailing how to execute the test
}
```

### Solutions Array
```typescript
interface DebugSolution {
  solution: string;          // Overview of the fix (e.g., "Enable Gradient Accumulation")
  steps: string[];           // Bullet points detailing the implementation steps
  verification?: string;     // (Optional) How to verify the fix works (e.g., check that training resumes)
}
```

### Prevention Array
```typescript
interface DebugPrevention {
  prevention: string;        // Overview of the preventative practice
  practices: string[];       // Specific code patterns or configurations to adopt
}
```

### Relationship Fields
Unlike core entities, debug guide relationship fields must use arrays of `ContentRef` objects:
- `related_packages`
- `related_workflows`
- `related_patterns`
- `related_models`
- `related_registry`

*Example:*
```json
"related_packages": [
  { "id": "pytorch", "type": "package" }
]
```

---

## Common Mistakes

- **Technology-First Instead of Symptom-First**: Naming guides after the library (e.g., `pytorch-errors.json`) rather than the error itself (e.g., `nan-loss.json`).
- **Unactionable Solutions**: Providing generic suggestions like `"Rewrite your code"` without actionable, step-by-step commands or code patches.
- **Using Plain Strings in Cross-References**: Defining `related_packages` as `["pytorch"]` instead of `[{"id": "pytorch", "type": "package"}]`.

## References

- See [`docs/engineering/content-schema.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/content-schema.md) for detailed field guidelines.
- See [`docs/engineering/validation.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/validation.md) for validation rules.
