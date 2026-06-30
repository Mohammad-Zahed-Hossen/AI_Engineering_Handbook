# ADR-002: Category Assignment Strategy

**Status:** Accepted
**Date:** 2026-06-30
**Context:** v2.1 Specification Freeze

## Decision

Categories will be assigned to content items through tag-based inference using rules defined in `metadata/categories.json`. Content files will NOT contain a `category` field.

## Rationale

1. **Separation of Concerns:** Categories are a presentation/navigation concern, while tags are semantic content attributes. Keeping them separate allows navigation structure to evolve without touching thousands of content files.

2. **Scalability:** If the UI reorganization requires changing category groupings, only `metadata/categories.json` needs updating. Content files remain unchanged.

3. **Flexibility:** A single content item can belong to multiple categories through different tag combinations, enabling cross-category navigation without duplication.

4. **Semantic Purity:** Content should describe what it is (tags), not where it appears (categories). This follows information architecture best practices.

## Implementation

### metadata/categories.json Structure
```json
{
  "id": "ml",
  "display_name": "Machine Learning",
  "content_types": ["model", "package"],
  "tag_rules": {
    "required_tags": ["ml", "machine-learning"],
    "priority": ["ml", "dl", "llm"]
  }
}
```

### Assignment Algorithm
For each content item:
1. Extract the item's `tags` array
2. For each category in `metadata/categories.json`, count matching tags between the item's tags and the category's `tag_rules.priority` array
3. Assign the category with the highest match count
4. If tie, use the first matching category in priority order
5. If no match, assign "uncategorized" and emit a validation warning

### Validation
- Layer 3 validation verifies that assigned categories exist in `metadata/categories.json`
- Warning emitted for content with no category match
- Error if category's `content_types` does not include the item's type

## Alternatives Considered

### Alternative 1: Add `category` field to BaseMeta
**Rejected:** Would require updating thousands of content files if navigation structure changes. Violates separation of concerns (content should not know about presentation).

### Alternative 2: Manual category assignment in metadata/registry.json
**Rejected:** Adds manual maintenance burden. Automated inference is more maintainable and less error-prone.

### Alternative 3: First-match tag algorithm
**Rejected:** Less flexible. Priority-based matching allows for more nuanced category assignment and better handling of overlapping categories.

## Consequences

- Positive: Navigation can evolve independently of content
- Positive: Content remains semantically pure
- Positive: Single source of truth for category rules
- Negative: Slightly more complex assignment algorithm (acceptable)
- Negative: Requires well-defined tag vocabulary (mitigated by validation)

## Affected Documents

- `REPOSITORY_FOUNDATION_SPECIFICATION_v2.md` (metadata system section)
- `IMPLEMENTATION_SPECIFICATION.md` (build-nav.js algorithm)
- `metadata/categories.json` (structure expanded)
