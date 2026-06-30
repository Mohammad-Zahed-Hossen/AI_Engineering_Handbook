# ADR-001: Content Schema Specification Approach

**Status:** Accepted
**Date:** 2026-06-30
**Context:** v2.1 Specification Freeze

## Decision

Content type schema definitions will be expanded within the existing `REPOSITORY_FOUNDATION_SPECIFICATION_v2.md` document rather than creating a separate governing document.

## Rationale

1. **Single Source of Truth:** The canonical authority table in `REPOSITORY_FOUNDATION_SPECIFICATION_v2.md` already establishes this document as the authority for content types. Creating a new document would introduce a second authority and risk drift.

2. **Prevent Duplication:** A separate schema specification document would require keeping two documents synchronized. Expanding the existing authority maintains the "one source, many references" principle.

3. **Follow Established Pattern:** The architecture explicitly prioritizes expanding canonical authorities over creating new ones. This decision aligns with that philosophy.

## Implementation

- Add complete nested object shapes to the Content Types section of `REPOSITORY_FOUNDATION_SPECIFICATION_v2.md`
- Define all field structures: `Package.common_tasks`, `Model.architecture`, `Model.evaluation`, `Workflow.steps`, etc.
- Include constraints, examples, and validation rules inline
- Update the canonical authority table to reflect the expanded scope
- All other documents (Blueprint, Implementation Spec) will reference this section

## Alternatives Considered

### Alternative 1: Create CONTENT_TYPE_SCHEMA_SPECIFICATION.md
**Rejected:** Would create a second authority for content types, violating the single-source-of-truth principle. Would require ongoing synchronization between two documents.

### Alternative 2: Define schemas only in JSON Schema files
**Rejected:** JSON Schema files are implementation artifacts. The governing specification should be human-readable and authoritative. JSON Schema should be generated from the specification, not vice versa.

## Consequences

- Positive: Single canonical source for content type definitions
- Positive: No drift between specification documents
- Positive: Easier for AI agents to locate the authoritative definition
- Negative: `REPOSITORY_FOUNDATION_SPECIFICATION_v2.md` will be longer (acceptable for a foundational document)

## Affected Documents

- `REPOSITORY_FOUNDATION_SPECIFICATION_v2.md` (expanded)
- `FOUNDATION_IMPLEMENTATION_BLUEPRINT.md` (references updated)
- `IMPLEMENTATION_SPECIFICATION.md` (references updated)
