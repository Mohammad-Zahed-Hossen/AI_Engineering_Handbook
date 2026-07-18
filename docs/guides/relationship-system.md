---
id: guide-relationship-system
title: Relationship System
type: guide
status: active
owner: contributors
canonical: true
version: 2.0
related:
  - engineering-content-schema
  - engineering-validation
ai_priority: 3
---

# Relationship System

The AI Engineering Handbook uses a typed cross-reference system to link content across different types. This enables navigation between related packages, models, workflows, patterns, principles, debug guides, and decision guides.

## ContentRef Format

All cross-content references use the `ContentRef` object format:

```typescript
interface ContentRef {
  id: string;           // The kebab-case ID of the target content
  type: string;         // The content type: "package" | "model" | "workflow" | "pattern" | "principle" | "debug_guide" | "decision_guide" | "cheatsheet"
  relationship_type?: string;  // Optional: describes the nature of the relationship
}
```

## Adding Relationships

Relationships are added as arrays of `ContentRef` objects in the appropriate field. The field shape varies by content type:

### ContentRef Arrays (Object Format)

These content types use `ContentRef[]` for their relationship fields:

- **Workflows**: `related_patterns`, `related_models`, `related_packages`, `related_debug_guides`
- **Debug Guides**: `related_packages`, `related_workflows`, `related_patterns`, `related_models`, `related_registry`
- **Decision Guides**: `related_workflows`, `related_packages`, `related_models`
- **All content types**: `related_content` (inherited from BaseMetaSchema)

*Example:*
```json
{
  "related_packages": [
    { "id": "pytorch", "type": "package" },
    { "id": "tensorflow", "type": "package" }
  ],
  "related_models": [
    { "id": "transformer", "type": "model" }
  ]
}
```

### Plain String Arrays (ID Format)

These content types use `string[]` for their relationship fields:

- **Packages**: `related_workflows`, `related_cheatsheets` (nested in tasks)
- **Models**: `related_workflows`
- **Patterns**: `related_workflows`, `related_models`, `related_packages`, `related_principles`
- **Principles**: `referenced_by_patterns`, `referenced_by_models`, `referenced_by_workflows` (inverse direction)

*Example:*
```json
{
  "related_workflows": ["rag", "fine-tuning"],
  "related_models": ["transformer", "llama-3-8b"]
}
```

## Relationship Field Reference

| Content Type | Relationship Fields | Field Shape |
|-------------|-------------------|-------------|
| Package | `related_workflows`, `related_cheatsheets` (in tasks) | `string[]` (plain IDs) |
| Model | `related_workflows` | `string[]` |
| Pattern | `related_workflows`, `related_models`, `related_packages`, `related_principles` | `string[]` |
| Principle | `referenced_by_patterns`, `referenced_by_models`, `referenced_by_workflows` | `string[]` (inverse direction) |
| Workflow | `related_patterns`, `related_models`, `related_packages`, `related_debug_guides` | `ContentRef[]` |
| Debug Guide | `related_packages`, `related_workflows`, `related_patterns`, `related_models`, `related_registry` | `ContentRef[]` |
| Decision Guide | `related_workflows`, `related_packages`, `related_models` | `ContentRef[]` |
| Cheatsheet | `package_reference` (singular) | `string` |
| Registry | none | — |

## Validation Rules

The validation system enforces:

1. **Orphan Prevention**: All referenced IDs must exist in the catalog.
2. **Type Safety**: The `type` field must match the target's actual content type.
3. **Format Consistency**: String arrays and `ContentRef` arrays must not be mixed.
4. **Legacy String Detection**: Old string-only formats (e.g., `"cupy"`) are rejected in favor of `ContentRef` format.

## Common Mistakes

- **Plain Strings in ContentRef Fields**: Using `["pytorch"]` instead of `[{"id": "pytorch", "type": "package"}]` in workflow relationships.
- **ContentRef in String Fields**: Using objects in package `related_workflows` which expects plain strings.
- **Non-existent IDs**: Referencing content that doesn't exist in the catalog.
- **Type Mismatches**: Declaring `{"id": "rag", "type": "package"}` when `rag` is actually a workflow.

## References

- See [`docs/engineering/content-schema.md`](../../engineering/content-schema.md) for detailed field guidelines.
- See [`docs/engineering/validation.md`](../../engineering/validation.md) for validation rules.