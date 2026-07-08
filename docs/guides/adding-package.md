---
id: guide-adding-package
title: Adding a Package
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

# Adding a Package

This guide outlines the step-by-step workflow and requirements for adding an engineering library/package profile to the AI Engineering Handbook.

## Steps

1. **Create JSON File**
   Create a JSON file under `data/packages/` using the lowercase package ID as the filename:
   ```bash
   touch data/packages/{id}.json
   ```
   *Example:* `data/packages/numpy.json`

2. **Write Content**
   - Populate the JSON content according to the schema defined in [`lib/schemas/package.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/package.ts) and [`lib/schemas/base.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/base.ts).
   - Ensure the internal `id` matches the filename exactly.
   - Keep case alignment consistent (e.g., if the file is `pandas.json`, the `id` must be `pandas` and the `name` should be properly cased as `pandas` or `Pandas` depending on official branding).

3. **Build Navigation Index**
   Rebuild the navigation index so the new package is registered and discoverable in the UI:
   ```bash
   npm run build:nav
   ```

4. **Validate**
   Run the content validation test suite locally to verify schema compliance, first-person triggers, and referential integrity:
   ```bash
   npm run validate
   ```

---

## Required Fields

Every package JSON must include the following global metadata and package-specific fields:

### Global Metadata Fields (BaseMeta)
- `id`: Unique kebab-case identifier (must match the filename exactly).
- `title`: Display title for the package (e.g., `"NumPy"`).
- `name`: Official cased name of the library (e.g., `"NumPy"`).
- `slug`: URL-friendly slug (typically matches the `id`).
- `description`: 1-2 sentence overview of the library's primary domain.
- `created_at`: Strict `YYYY-MM-DD` date format.
- `updated_at`: Strict `YYYY-MM-DD` date format.
- `sources`: Array of URLs representing primary documentation sources (must contain at least one valid URL).

### Package-Specific Fields
- `name`: Duplicate of official name string (for schema indexing).
- `version`: Target semantic version string documented by this entry (e.g., `"2.0.0"`).
- `summary`: Concise, 1-2 sentence description of the library's primary purpose.
- `tasks`: Array containing task-based function references (minimum of 1).

---

## Tasks Array Structure

Each object inside the `tasks` array must adhere to the following schema:

```typescript
interface PackageTask {
  task: string;                  // What the function accomplishes (e.g., "Load CSV File")
  mental_trigger: string;        // First-person engineering thought triggering this (e.g., "I need to load tabular data from a CSV file")
  syntax: string;                // Callable signature with symbolic parameters (e.g., "pd.read_csv(filepath_or_buffer)")
  important_params?: string[];   // Array of the 3-5 most commonly used parameters (max 5)
  example: string;               // Clean, 1-2 line snippet showing usage (no import statements, no markdown code block fences)
  use_when: string;              // Rule of thumb for when to use this function
  avoid_when: string;            // Rule of thumb for when to avoid this function
  decision_notes?: string;       // Decision guidance on parameter choices
  gotchas?: string[];            // Warnings outlining silent bugs, performance issues, or edge cases
  official_docs?: string;        // Direct URL to the documentation for this specific function
  related_workflows?: string[];  // Plain string array of related workflow IDs
  related_cheatsheets?: string[]; // Plain string array of related cheatsheet IDs
}
```

---

## Field Guidance & Validation Rules

### `version`
- **What belongs**: Standard semantic version strings (`X.Y.Z`).
- **What does NOT belong**: Prefix characters like `"v"` (e.g., `"v2.0.0"`) or generic terms like `"latest"`.

### `tasks[].mental_trigger`
- **First-Person Rule**: Must be written as a first-person engineering intent. It must start with or include `"I need to..."` (e.g., `"I need to create an identity matrix"`).

### `tasks[].example`
- **What belongs**: Raw, copy-pasteable example usage.
- **What does NOT belong**: Markdown code block fences (`` ```python `` or `` ` ``) or helper `import` statements. Fencing is handled by the UI.

### `tasks[].important_params`
- **Size Limit**: Maximum of 5 entries. Only list parameters that are key to the task.

### `alternatives` Array
- **What belongs**: Array of alternative package dependencies using `ContentRef` objects.
- **What does NOT belong**: Plain strings.
  *Example:* `[ { "id": "polars", "type": "package" } ]`

---

## Common Mistakes

- **Incorrect Version Prefix**: Using `"v2.1"` instead of `"2.1.0"`.
- **Markdown Fences in code**: Surrounding the `install` command, `import_as` statement, or task `example` with markdown code fences inside the JSON string.
- **No First-Person Trigger**: Writing triggers like `"Loads files"` instead of `"I need to load a CSV file"`.
- **Plain Strings in Alternatives**: Using `"cupy"` instead of `{"id": "cupy", "type": "package"}`.

## References

- See [`docs/engineering/content-schema.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/content-schema.md) for detailed field guidelines.
- See [`docs/engineering/validation.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/validation.md) for validation rules.
