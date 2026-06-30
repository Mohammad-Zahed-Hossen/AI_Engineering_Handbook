# ADR-004: Model ID Format

**Status:** Accepted
**Date:** 2026-06-30
**Context:** v2.1 Specification Freeze

## Decision

Model IDs will use the format `model:{category}:{slug}` (e.g., `model:ml:transformer`, `model:dl:transformer`, `model:llm:transformer`). Category is explicitly encoded in the ID. Resolver will construct paths deterministically without recursive search.

## Rationale

1. **Deterministic Resolution:** Encoding category in the ID allows the resolver to construct the exact file path (`content/models/ml/transformer.json`) without searching. No ambiguity, no hidden behavior.

2. **Explicit Over Implicit:** The category is already implicit in the directory structure. Making it explicit in the ID removes ambiguity and makes the relationship clear.

3. **No Recursive Search:** Recursive directory search hides problems (e.g., duplicate files in unexpected locations) and adds unnecessary complexity. Explicit encoding is simpler and more predictable.

4. **Collision Prevention:** The encoded category prevents ID collisions between models with the same slug in different subdirectories (e.g., `ml/transformer.json` and `dl/transformer.json` would have distinct IDs).

5. **URL Compatibility:** The encoded category aligns with the routing structure `app/models/[category]/[id]/page.tsx`, making IDs URL-friendly.

## Implementation

### ID Format
- Models: `{type}:{category}:{slug}` where category is one of: `ml`, `dl`, `llm`
- Other content types: `{type}:{slug}` (unchanged)

### Examples
- `model:ml:transformer` → `content/models/ml/transformer.json`
- `model:dl:transformer` → `content/models/dl/transformer.json`
- `package:numpy` → `content/packages/numpy.json`
- `workflow:data-pipeline` → `content/workflows/data-pipeline.json`

### Resolver Behavior
```typescript
function resolveById(id: string): string {
  const [type, ...parts] = id.split(':')
  
  if (type === 'model') {
    const [category, slug] = parts
    return `content/models/${category}/${slug}.json`
  } else {
    const slug = parts[0]
    return `content/${type}s/${slug}.json`  // pluralize
  }
}
```

### Validation
- Layer 2 validation enforces that model IDs follow the `model:{category}:{slug}` format
- Layer 2 validation verifies that the encoded category matches the actual subdirectory
- Layer 2 validation verifies that category is one of: `ml`, `dl`, `llm`

### Registry
- `metadata/registry.json` will use the full ID format (e.g., `model:ml:transformer`)
- No collisions possible due to encoded category

## Alternatives Considered

### Alternative 1: Global slug uniqueness with recursive search
**Rejected:** Recursive search hides problems and is unnecessary magic. If a file exists in an unexpected location, recursive search might find it, masking the error. Explicit encoding is more predictable.

### Alternative 2: Flatten model directory structure
**Rejected:** Would lose the categorical organization that is useful for navigation and browsing. The subdirectory structure is valuable for human organization.

### Alternative 3: Use `model:ml-transformer` (single colon)
**Rejected:** Less readable. `model:ml:transformer` clearly separates the three components (type, category, slug) and is easier to parse.

## Consequences

- Positive: Deterministic path resolution
- Positive: No ID collisions possible
- Positive: Clear, explicit ID structure
- Positive: Aligns with URL routing
- Negative: Model IDs are longer (acceptable - IDs are internal identifiers)
- Negative: Breaking change if any existing models use different format (acceptable - this is pre-implementation)

## Affected Documents

- `REPOSITORY_FOUNDATION_SPECIFICATION_v2.md` (content ID format section)
- `IMPLEMENTATION_SPECIFICATION.md` (resolver behavior)
- `metadata/registry.json` (ID format)
