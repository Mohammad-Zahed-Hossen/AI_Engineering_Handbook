# ADR-003: Search Behavior Specification

**Status:** Accepted
**Date:** 2026-06-30
**Context:** v2.1 Specification Freeze

## Decision

Search functionality will be specified through behavioral requirements rather than library-specific configuration. The architecture will define what search must do, not how it must be implemented.

## Rationale

1. **Implementation Independence:** Behavior-focused specification allows the search implementation to evolve (e.g., switching from fuse.js to a different library) without requiring architecture document updates.

2. **Future Flexibility:** If a better search library emerges or custom search logic is needed, the architecture does not need to change. Only the implementation changes.

3. **Clearer Contracts:** Behavioral requirements are easier to validate and test than implementation details. AI agents can implement search correctly using any tool that meets the behavioral spec.

4. **Avoids Premature Optimization:** Binding to specific library configuration (thresholds, weights) may be inappropriate until actual usage patterns are known.

## Implementation

### Required Search Behaviors

The search engine must support:

1. **Fuzzy Text Matching**
   - Tolerant of typos and partial matches
   - Configurable fuzziness level (default: moderate)

2. **Alias Search**
   - Search by alternative names/aliases
   - Aliaries should be weighted highly in ranking

3. **Tag Search**
   - Filter results by specific tags
   - Search within tagged content
   - Tag matches should influence ranking

4. **Keyword Search**
   - Search within keyword fields
   - Keyword matches should influence ranking

5. **Ranked Output**
   - Results ordered by relevance score (0-1, higher is better)
   - Score should be deterministic for identical inputs

6. **Field-Weighted Ranking**
   - Title: highest weight
   - Aliases: high weight
   - Tags/Keywords: medium weight
   - Description/Content Preview: low weight

### API Specification
```typescript
interface SearchEngine {
  search(query: string, options?: SearchOptions): SearchResult[]
}

interface SearchOptions {
  limit?: number           // Max results to return
  category?: string        // Filter by category
  contentType?: string     // Filter by content type
  tags?: string[]          // Filter by tags
}

interface SearchResult {
  id: string
  type: string
  title: string
  score: number            // 0-1, higher is better
}
```

### Implementation Guidance
- Current implementation uses fuse.js
- Future implementations may use different libraries
- The architecture does not prescribe specific library configuration
- Implementations must meet the behavioral requirements above

### Directory Structure Clarification
- `lib/search/engine.ts`: Main search engine, implements SearchEngine interface
- `lib/search/inverted-index.ts`: If needed for O(1) tag-based lookup, specify purpose. If not needed for behavioral requirements, remove from directory structure.
- `lib/search/related-search.ts`: If needed for "related content suggestions", specify purpose. If not needed, remove from directory structure.

## Alternatives Considered

### Alternative 1: Specify fuse.js configuration in architecture
**Rejected:** Locks architecture to a specific library. If fuse.js is abandoned or a better library emerges, architecture would require updates. Behavior-focused spec is more durable.

### Alternative 2: Leave search completely unspecified
**Rejected:** Search is a core user-facing feature. Without specification, different AI agents would implement different behaviors, leading to inconsistent UX.

### Alternative 3: Specify both behavior AND implementation
**Rejected:** Adds unnecessary detail. Implementation details can be decided during implementation based on actual needs and library capabilities.

## Consequences

- Positive: Implementation can evolve without architecture changes
- Positive: Clear testable requirements
- Positive: AI agents have sufficient guidance
- Negative: Less prescriptive guidance for initial implementation (acceptable - implementation phase can choose library and config)

## Affected Documents

- `IMPLEMENTATION_SPECIFICATION.md` (search behavior section added)
- `REPOSITORY_FOUNDATION_SPECIFICATION_v2.md` (directory structure clarified)
