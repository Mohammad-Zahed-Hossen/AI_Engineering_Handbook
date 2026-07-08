---
id: guide-adding-pattern
title: Adding a Pattern
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

# Adding a Pattern

This guide outlines the step-by-step workflow and requirements for adding a tool-agnostic, concept-focused engineering pattern to the AI Engineering Handbook.

## Steps

1. **Create JSON File**
   Create a JSON file under `data/patterns/` using a lowercase, kebab-case ID as the filename:
   ```bash
   touch data/patterns/{id}.json
   ```
   *Example:* `data/patterns/early-stopping.json`

2. **Write Content**
   - Populate the JSON content according to the schema defined in [`lib/schemas/pattern.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/pattern.ts) and [`lib/schemas/base.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/base.ts).
   - Ensure the internal `id` matches the filename exactly.

3. **Build Navigation Index**
   Rebuild the navigation index so the new pattern is registered and discoverable in the UI:
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

Every pattern JSON must include the following global metadata and pattern-specific fields:

### Global Metadata Fields (BaseMeta)
- `id`: Unique kebab-case identifier (must match the filename exactly).
- `title`: Display title for the pattern (e.g., `"Early Stopping"`).
- `name`: Official title of the pattern (e.g., `"Early Stopping"`).
- `slug`: URL-friendly slug (typically matches the `id`).
- `description`: 1-2 sentence overview of the pattern's intent.
- `created_at`: Strict `YYYY-MM-DD` date format.
- `updated_at`: Strict `YYYY-MM-DD` date format.
- `sources`: Array of URLs representing documentation, paper, or research references (must contain at least one valid URL).

### Pattern-Specific Fields
- `concept`: A detailed explanation of the core engineering concept (how the pattern operates).
- `applicability`: Guidance outlining when this pattern should be applied.

---

## Optional & Relationship Fields

### Optional Guidance
- `anti_patterns`: (Optional, default `[]`) Array of common misapplications or incorrect implementations to avoid.
- `implementation_notes`: (Optional) Detailed guide on how to implement the pattern without referencing specific library packages.
- `examples`: (Optional, default `[]`) Language-agnostic or pseudo-code examples showing structural patterns.

### Cross-References (Relationship Fields)
Since patterns are concept-focused, relationship fields use simple string arrays of core entity IDs:
- `related_workflows`: Array of workflow IDs that implement this pattern.
- `related_models`: Array of model IDs that utilize this pattern.
- `related_packages`: Array of package IDs that support or implement this pattern.
- `related_principles`: Array of principle IDs that provide the theoretical foundation for this pattern.

---

## Common Mistakes

- **Library-Specific Snippets in Concept/Implementation**: Including imports or syntax for a specific library (e.g., PyTorch). Package-specific details belong in `Package` or `Cheatsheet` pages, while patterns must remain tool-agnostic.
- **Plain Strings in Alternatives**: Patterns don't have an `alternatives` field, but all cross-references in the metadata's `related_content` array must use the `ContentRef` object structure.
- **Vague Applicability Guidelines**: Writing generic recommendations instead of concrete engineering indicators (e.g., `"Use when training deep learning models that show signs of validation loss divergence"`).

## References

- See [`docs/engineering/content-schema.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/content-schema.md) for detailed field guidelines.
- See [`docs/engineering/validation.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/validation.md) for validation rules.
