---
id: guide-adding-cheatsheet
title: Adding a Cheatsheet
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

# Adding a Cheatsheet

This guide outlines the step-by-step workflow and requirements for adding a syntax cheatsheet to the AI Engineering Handbook.

## Steps

1. **Create JSON File**
   Create a JSON file under `data/cheatsheets/` using a kebab-case ID as the filename:
   ```bash
   touch data/cheatsheets/{id}.json
   ```
   *Example:* `data/cheatsheets/pytorch.json`

2. **Write Content**
   - Populate the JSON content according to the schema defined in [`lib/schemas/cheatsheet.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/cheatsheet.ts) and [`lib/schemas/base.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/base.ts).
   - Ensure all required metadata and cheatsheet-specific fields are provided.
   - Set the `id` field inside the JSON file to match the filename exactly.

3. **Build Navigation Index**
   Rebuild the navigation index so the new cheatsheet is register-mapped and discoverable in the UI:
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

Every cheatsheet JSON must include the following global metadata and cheatsheet-specific fields:

### Global Metadata Fields (BaseMeta)
- `id`: Unique kebab-case identifier (must match the filename exactly).
- `title`: Display title for the cheatsheet (e.g., `"PyTorch"`).
- `name`: Official cased name of the library (e.g., `"PyTorch"`).
- `slug`: URL-friendly slug (typically matches the `id`).
- `description`: 1-2 sentence overview of what syntax is covered.
- `created_at`: Strict `YYYY-MM-DD` date format.
- `updated_at`: Strict `YYYY-MM-DD` date format.
- `sources`: Array of URLs representing primary documentation sources (must contain at least one valid HTTP/HTTPS URL).

### Cheatsheet-Specific Fields
- `entries`: Array containing between 1 and 60 syntax entry objects.
- `package_reference`: (Optional) Singular string ID of the package this cheatsheet references (e.g., `"pytorch"`).

---

## Entry Structure

Each object inside the `entries` array must adhere to the following schema:

```typescript
interface CheatsheetEntry {
  problem: string;      // The problem being solved (e.g., "Create tensor from array")
  trigger: string;      // Mental trigger for when an engineer reaches for this (e.g., "Converting raw Python lists or arrays into GPU tensors")
  snippet: string;      // Raw, runnable code snippet
  minimal_notes: string; // The single most critical thing to remember
  common_bug: string;   // Actionable silent failure or gotcha to avoid
  docs_url: string;     // Direct URL to the official documentation page for the used API
}
```

---

## Field Guidance & Validation Rules

### `entries[].problem`
- **What belongs**: Concise, goal-oriented description of the task (e.g., `"Compute matrix multiplication"`).
- **What does NOT belong**: Function signatures or descriptions of how it works.

### `entries[].trigger`
- **What belongs**: Contextual scenarios or reasons why this approach is selected.
- **What does NOT belong**: Generic explanations repeating the problem statement.

### `entries[].snippet`
- **What belongs**: Raw, copy-pasteable code syntax.
- **What does NOT belong**: Markdown code block fences (`` ```python `` or `` ` ``) or import statements. Fencing is handled by the UI syntax highlighter.

### `entries[].docs_url`
- **What belongs**: A direct link to the specific class, function, or method documentation page.
- **What does NOT belong**: Generic library homepages or search URLs.

---

## Common Mistakes

- **Markdown Fences in Snippets**: Wrapping the code in backticks inside the JSON string (causes rendering issues).
- **Empty Sources Array**: Omitting source URLs in the metadata block.
- **Invalid Date Formatting**: Including timezone suffixes or timestamps in `created_at` or `updated_at`.
- **String References in Alternatives**: Using old string-only arrays instead of the `ContentRef` object array style when referencing other content.

## References

- See [`docs/engineering/content-schema.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/content-schema.md) for detailed field guidelines.
- See [`docs/engineering/validation.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/validation.md) for validation rules.
