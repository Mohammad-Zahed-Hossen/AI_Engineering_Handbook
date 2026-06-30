# Implementation Roadmap
**Repository Foundation v2 Migration**
**Status: Active**
**Created:** 2026-06-30
**Last updated:** 2026-06-30

---

## Purpose

This is the single source of truth for implementation progress. It replaces scattered notes and chat history. Every task is atomic, has defined dependencies, and tracks completion status.

---

## Epic Structure

- **Epic 1:** Repository Foundation (directories, config, ADR infrastructure)
- **Epic 2:** BaseMeta Implementation (core metadata fields)
- **Epic 3:** Schema Layer (JSON Schema v2 files)
- **Epic 4:** Type Layer (TypeScript synchronization)
- **Epic 5:** Validation Layer (4-layer validation architecture)
- **Epic 6:** Search Layer (search index upgrade)
- **Epic 7:** Navigation Layer (navigation synchronization)
- **Epic 8:** Content Migration (migrate existing content to v2)
- **Epic 9:** Frontend Compatibility (ensure nothing breaks)
- **Epic 10:** Repository Verification (final audit)

---

## Legend

- **Status:** Todo | In Progress | Blocked | Completed
- **Difficulty:** Low | Medium | High
- **Dependencies:** Task IDs that must complete first

---

# Epic 1: Repository Foundation

## RF-001
**Title:** Create metadata/ directory
**Description:** Create the metadata/ directory at repository root for controlled vocabularies
**Affected files:** metadata/
**Dependencies:** None
**Difficulty:** Low
**Status:** Completed
**Reviewer:** Claude (Phase 1A)
**Completed date:** 2026-06-30
**Notes:** Created at D:\Project\ai-engineering-handbook\metadata\. Contains .gitkeep with intent comment. RF-002, RF-003, RF-004 unblocked.

## RF-002
**Title:** Create metadata/tags.json
**Description:** Create the controlled tag vocabulary file with tag objects containing tag, description, and category fields
**Affected files:** metadata/tags.json
**Dependencies:** RF-001
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-003
**Title:** Create metadata/aliases.json
**Description:** Create the alias registry file with alias registration objects containing alias and canonical_id fields
**Affected files:** metadata/aliases.json
**Dependencies:** RF-001
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-004
**Title:** Create metadata/categories.json
**Description:** Create the category registry file with category objects containing category, label, description, and content_types fields
**Affected files:** metadata/categories.json
**Dependencies:** RF-001
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-005
**Title:** Create schema/ directory
**Description:** Create the schema/ directory at repository root for JSON Schema files
**Affected files:** schema/
**Dependencies:** None
**Difficulty:** Low
**Status:** Completed
**Reviewer:** Claude (Phase 1A)
**Completed date:** 2026-06-30
**Notes:** Created at D:\Project\ai-engineering-handbook\schema\. RF-006 unblocked.

## RF-006
**Title:** Create schema/v2/ directory
**Description:** Create the versioned schema subdirectory for v2 schemas
**Affected files:** schema/v2/
**Dependencies:** RF-005
**Difficulty:** Low
**Status:** Completed
**Reviewer:** Claude (Phase 1A)
**Completed date:** 2026-06-30
**Notes:** Created at D:\Project\ai-engineering-handbook\schema\v2\. Contains .gitkeep with governance comment (append-only, no modification after freeze, v3/ path for breaking changes). Epic 3 tasks RF-040 through RF-045 unblocked after RF-007.

## RF-007
**Title:** Create aens.config.json
**Description:** Create the central configuration file with system version, content paths, content types, schema versions, size constraints, stability tiers, asset types, and vocabulary file paths
**Affected files:** aens.config.json
**Dependencies:** None
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-008
**Title:** Create docs/adr/ directory
**Description:** Create the Architecture Decision Record directory
**Affected files:** docs/adr/
**Dependencies:** None
**Difficulty:** Low
**Status:** Completed
**Reviewer:** Claude (Phase 1A)
**Completed date:** 2026-06-30
**Notes:** Created at D:\Project\ai-engineering-handbook\docs\adr\. Contains .gitkeep with ADR format reminder and immutability rule. Integrated into existing docs/ root (not created as parallel folder). First ADR (adr-001-repository-foundation.md) to be created in next phase.

## RF-009
**Title:** Create docs/migration/ directory
**Description:** Create the migration artifacts directory
**Affected files:** docs/migration/
**Dependencies:** None
**Difficulty:** Low
**Status:** Completed
**Reviewer:** Claude (Phase 1A)
**Completed date:** 2026-06-30
**Notes:** Directory already existed at D:\Project\ai-engineering-handbook\docs\migration\ and contained all AENS v2 architecture documents. No action required. Verified present. RF-010, RF-011 unblocked.

## RF-010
**Title:** Create docs/migration/migration-log.md
**Description:** Create the human-readable migration log for narrative migration history
**Affected files:** docs/migration/migration-log.md
**Dependencies:** RF-009
**Difficulty:** Low
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-011
**Title:** Create docs/migration/review-queue.md
**Description:** Create the review queue for tracking content requiring human review
**Affected files:** docs/migration/review-queue.md
**Dependencies:** RF-009
**Difficulty:** Low
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

---

# Epic 2: BaseMeta Implementation

## RF-020
**Title:** Add schema_version field to BaseMeta
**Description:** Add required schema_version field to BaseMeta schema and TypeScript type
**Affected files:** schema/v2/base.schema.json, types/base.types.ts
**Dependencies:** RF-006, RF-007
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-021
**Title:** Add id field to BaseMeta
**Description:** Add required id field in type:slug format to BaseMeta schema and TypeScript type
**Affected files:** schema/v2/base.schema.json, types/base.types.ts
**Dependencies:** RF-020
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-022
**Title:** Add title field to BaseMeta
**Description:** Add required title field to BaseMeta schema and TypeScript type
**Affected files:** schema/v2/base.schema.json, types/base.types.ts
**Dependencies:** RF-021
**Difficulty:** Low
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-023
**Title:** Add aliases field to BaseMeta
**Description:** Add aliases array field to BaseMeta schema and TypeScript type
**Affected files:** schema/v2/base.schema.json, types/base.types.ts
**Dependencies:** RF-022
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-024
**Title:** Add description field to BaseMeta
**Description:** Add required description field to BaseMeta schema and TypeScript type
**Affected files:** schema/v2/base.schema.json, types/base.types.ts
**Dependencies:** RF-022
**Difficulty:** Low
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-025
**Title:** Add tags field to BaseMeta
**Description:** Add tags array field to BaseMeta schema and TypeScript type
**Affected files:** schema/v2/base.schema.json, types/base.types.ts
**Dependencies:** RF-022
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-026
**Title:** Add status field to BaseMeta
**Description:** Add status enum field (draft | stub | complete | deprecated) to BaseMeta schema and TypeScript type
**Affected files:** schema/v2/base.schema.json, types/base.types.ts
**Dependencies:** RF-022
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-027
**Title:** Add deprecated field to BaseMeta
**Description:** Add optional deprecated object field (is_deprecated, replaced_by) to BaseMeta schema and TypeScript type
**Affected files:** schema/v2/base.schema.json, types/base.types.ts
**Dependencies:** RF-026
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-028
**Title:** Add stability field to BaseMeta
**Description:** Add stability enum field (stable | semi_stable | volatile) to BaseMeta schema and TypeScript type
**Affected files:** schema/v2/base.schema.json, types/base.types.ts
**Dependencies:** RF-022
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-029
**Title:** Add versioning field to BaseMeta
**Description:** Add versioning object field (verified_against, last_verified_at) to BaseMeta schema and TypeScript type
**Affected files:** schema/v2/base.schema.json, types/base.types.ts
**Dependencies:** RF-028
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-030
**Title:** Add sources field to BaseMeta
**Description:** Add sources array field with structured source objects (title, url, accessed_at, notes) to BaseMeta schema and TypeScript type
**Affected files:** schema/v2/base.schema.json, types/base.types.ts
**Dependencies:** RF-022
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-031
**Title:** Add relationships field to BaseMeta
**Description:** Add relationships object field with five typed arrays (workflows, models, packages, cheatsheets, registry) to BaseMeta schema and TypeScript type
**Affected files:** schema/v2/base.schema.json, types/base.types.ts
**Dependencies:** RF-022
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-032
**Title:** Add created_at field to BaseMeta
**Description:** Add created_at ISO 8601 datetime field to BaseMeta schema and TypeScript type
**Affected files:** schema/v2/base.schema.json, types/base.types.ts
**Dependencies:** RF-022
**Difficulty:** Low
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-033
**Title:** Add updated_at field to BaseMeta
**Description:** Add updated_at ISO 8601 datetime field to BaseMeta schema and TypeScript type
**Affected files:** schema/v2/base.schema.json, types/base.types.ts
**Dependencies:** RF-032
**Difficulty:** Low
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-034
**Title:** Add keywords field to BaseMeta
**Description:** Add keywords array field to BaseMeta schema and TypeScript type for search optimization
**Affected files:** schema/v2/base.schema.json, types/base.types.ts
**Dependencies:** RF-023
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-035
**Title:** Add content_role field to BaseMeta
**Description:** Add content_role enum field (index | child) to BaseMeta schema and TypeScript type for index/child hierarchy
**Affected files:** schema/v2/base.schema.json, types/base.types.ts
**Dependencies:** RF-022
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

---

# Epic 3: Schema Layer

## RF-040
**Title:** Create schema/v2/base.schema.json
**Description:** Create the base schema file with all BaseMeta fields using JSON Schema 2020-12 standard
**Affected files:** schema/v2/base.schema.json
**Dependencies:** RF-020 through RF-035
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-041
**Title:** Create schema/v2/workflow.schema.json
**Description:** Create the workflow schema extending BaseMeta with workflow-specific fields
**Affected files:** schema/v2/workflow.schema.json
**Dependencies:** RF-040
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-042
**Title:** Create schema/v2/model.schema.json
**Description:** Create the model schema extending BaseMeta with model-specific fields including mental_trigger
**Affected files:** schema/v2/model.schema.json
**Dependencies:** RF-040
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-043
**Title:** Create schema/v2/package.schema.json
**Description:** Create the package schema extending BaseMeta with package-specific fields including mental_trigger
**Affected files:** schema/v2/package.schema.json
**Dependencies:** RF-040
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-044
**Title:** Create schema/v2/cheatsheet.schema.json
**Description:** Create the cheatsheet schema extending BaseMeta with cheatsheet-specific fields
**Affected files:** schema/v2/cheatsheet.schema.json
**Dependencies:** RF-040
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-045
**Title:** Create schema/v2/registry.schema.json
**Description:** Create the registry schema extending BaseMeta with registry-specific fields and asset_type enum
**Affected files:** schema/v2/registry.schema.json
**Dependencies:** RF-040, RF-007
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

---

# Epic 4: Type Layer

## RF-050
**Title:** Create types/base.types.ts
**Description:** Create the BaseMeta TypeScript interface with JSDoc comments
**Affected files:** types/base.types.ts
**Dependencies:** RF-040
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-051
**Title:** Create types/workflow.types.ts
**Description:** Create the Workflow TypeScript interface extending BaseMeta
**Affected files:** types/workflow.types.ts
**Dependencies:** RF-050, RF-041
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-052
**Title:** Create types/model.types.ts
**Description:** Create the Model TypeScript interface extending BaseMeta
**Affected files:** types/model.types.ts
**Dependencies:** RF-050, RF-042
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-053
**Title:** Create types/package.types.ts
**Description:** Create the Package TypeScript interface extending BaseMeta
**Affected files:** types/package.types.ts
**Dependencies:** RF-050, RF-043
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-054
**Title:** Create types/cheatsheet.types.ts
**Description:** Create the Cheatsheet TypeScript interface extending BaseMeta
**Affected files:** types/cheatsheet.types.ts
**Dependencies:** RF-050, RF-044
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-055
**Title:** Create types/registry.types.ts
**Description:** Create the Registry TypeScript interface extending BaseMeta
**Affected files:** types/registry.types.ts
**Dependencies:** RF-050, RF-045
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-056
**Title:** Synchronize types with existing lib/schemas/
**Description:** Ensure new types/ directory is synchronized with existing Zod schemas in lib/schemas/
**Affected files:** types/, lib/schemas/
**Dependencies:** RF-050 through RF-055
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

---

# Epic 5: Validation Layer

## RF-060
**Title:** Implement Layer 1 validation (JSON parse + Schema validation)
**Description:** Implement structural validation using Ajv or equivalent JSON Schema 2020-12 validator
**Affected files:** scripts/validate.js
**Dependencies:** RF-040 through RF-045
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-061
**Title:** Implement Layer 2 validation (Configuration enforcement)
**Description:** Implement constraint validation reading aens.config.json and checking size budgets
**Affected files:** scripts/validate.js
**Dependencies:** RF-007, RF-060
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-062
**Title:** Implement Layer 3 validation (Cross-Reference Validation)
**Description:** Implement graph integrity validation checking ID existence, bidirectional relationships, deprecated.replaced_by, parent resolution, alias registration, alias collision, and circular parent references
**Affected files:** scripts/validate.js
**Dependencies:** RF-061
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-063
**Title:** Implement Layer 4 validation (Semantic Validation)
**Description:** Implement semantic validation checking status/version consistency, stability/verification age, taxonomy conformance, and other qualitative contracts
**Affected files:** scripts/validate.js
**Dependencies:** RF-062
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-064
**Title:** Implement validation modes (--file, --all, --links)
**Description:** Add CLI argument parsing for different validation modes
**Affected files:** scripts/validate.js
**Dependencies:** RF-063
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-065
**Title:** Create scripts/audit.js
**Description:** Create separate audit script for repository-level health checks (duplicate IDs, duplicate aliases, stale stubs, stale complete content)
**Affected files:** scripts/audit.js
**Dependencies:** RF-063
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-066
**Title:** Implement migration-report.json generation in audit.js
**Description:** Add machine-readable migration report output to audit script
**Affected files:** scripts/audit.js
**Dependencies:** RF-065
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-067
**Title:** Create scripts/migrate.js
**Description:** Create migration script with named task support for specific migration operations
**Affected files:** scripts/migrate.js
**Dependencies:** RF-065
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

---

# Epic 6: Search Layer

## RF-070
**Title:** Audit existing search architecture
**Description:** Inspect current search implementation to understand existing fields and indexing logic
**Affected files:** search/
**Dependencies:** None
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-071
**Title:** Add aliases to search index
**Description:** Update search index generator to extract and index aliases field
**Affected files:** search/
**Dependencies:** RF-070, RF-023
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-072
**Title:** Add keywords to search index
**Description:** Update search index generator to extract and index keywords field
**Affected files:** search/
**Dependencies:** RF-070, RF-034
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-073
**Title:** Add mental_trigger to search index
**Description:** Update search index generator to extract and index mental_trigger field from Model and Package schemas
**Affected files:** search/
**Dependencies:** RF-070, RF-042, RF-043
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-074
**Title:** Add problem_statement to search index
**Description:** Update search index generator to extract and index problem_statement field
**Affected files:** search/
**Dependencies:** RF-070
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-075
**Title:** Add error_messages to search index
**Description:** Update search index generator to extract and index error_messages field
**Affected files:** search/
**Dependencies:** RF-070
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-076
**Title:** Add status filtering to search
**Description:** Update search to filter out non-complete content from default results
**Affected files:** search/
**Dependencies:** RF-070, RF-026
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-077
**Title:** Add relationships to search index
**Description:** Update search index generator to extract and index relationships for related content suggestions
**Affected files:** search/
**Dependencies:** RF-070, RF-031
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-078
**Title:** Verify search-index.json placement at root
**Description:** Ensure search-index.json is at repository root as specified
**Affected files:** search-index.json
**Dependencies:** RF-071 through RF-077
**Difficulty:** Low
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

---

# Epic 7: Navigation Layer

## RF-080
**Title:** Audit existing navigation architecture
**Description:** Inspect current _nav.json and navigation builder to understand existing structure
**Affected files:** _nav.json, lib/navigation/
**Dependencies:** None
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-081
**Title:** Synchronize _nav.json with metadata/categories.json
**Description:** Update navigation to read from metadata/categories.json for category definitions
**Affected files:** _nav.json, metadata/categories.json
**Dependencies:** RF-004, RF-080
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-082
**Title:** Implement content_role-based navigation
**Description:** Update navigation builder to handle index/child hierarchy via content_role field
**Affected files:** lib/navigation/
**Dependencies:** RF-080, RF-035
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-083
**Title:** Synchronize navigation with relationships
**Description:** Update navigation to use relationships for related content links
**Affected files:** lib/navigation/
**Dependencies:** RF-080, RF-031
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

---

# Epic 8: Content Migration

## RF-090
**Title:** Audit existing content structure
**Description:** Inspect current content/ directory structure and file formats
**Affected files:** content/
**Dependencies:** None
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -
**Notes:** IMPORTANT — The existing repository uses data/ (not content/) for content storage. This naming divergence must be resolved in this epic before migration tasks begin. Detected in Phase 1A inspection.

## RF-091
**Title:** Migrate package content to v2 structure
**Description:** Migrate all package content files to v2 schema with BaseMeta fields
**Affected files:** content/packages/
**Dependencies:** RF-090, RF-043, RF-053
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-092
**Title:** Migrate model content to v2 structure
**Description:** Migrate all model content files to v2 schema with BaseMeta fields
**Affected files:** content/models/
**Dependencies:** RF-090, RF-042, RF-052
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-093
**Title:** Migrate workflow content to v2 structure
**Description:** Migrate all workflow content files to v2 schema with BaseMeta fields
**Affected files:** content/workflows/
**Dependencies:** RF-090, RF-041, RF-051
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-094
**Title:** Migrate registry content to v2 structure
**Description:** Migrate all registry content files to v2 schema with BaseMeta fields
**Affected files:** content/registry/
**Dependencies:** RF-090, RF-045, RF-055
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-095
**Title:** Migrate cheatsheet content to v2 structure
**Description:** Migrate all cheatsheet content files to v2 schema with BaseMeta fields
**Affected files:** content/cheatsheets/
**Dependencies:** RF-090, RF-044, RF-054
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-096
**Title:** Generate migration-report.json
**Description:** Run migration script and generate machine-readable migration report
**Affected files:** docs/migration/migration-report.json
**Dependencies:** RF-091 through RF-095
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-097
**Title:** Populate review-queue.md
**Description:** Identify content requiring human review and add to review queue
**Affected files:** docs/migration/review-queue.md
**Dependencies:** RF-096
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-098
**Title:** Update migration-log.md
**Description:** Document migration narrative in human-readable log
**Affected files:** docs/migration/migration-log.md
**Dependencies:** RF-096
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

---

# Epic 9: Frontend Compatibility

## RF-100
**Title:** Audit app/ directory for breaking changes
**Description:** Inspect app/ directory to identify components affected by schema changes
**Affected files:** app/
**Dependencies:** RF-098
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-101
**Title:** Audit components/ directory for breaking changes
**Description:** Inspect components/ directory to identify components affected by schema changes
**Affected files:** components/
**Dependencies:** RF-098
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-102
**Title:** Audit hooks/ directory for breaking changes
**Description:** Inspect hooks/ directory to identify hooks affected by schema changes
**Affected files:** hooks/
**Dependencies:** RF-098
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-103
**Title:** Update components for new BaseMeta fields
**Description:** Update frontend components to display new BaseMeta fields (aliases, keywords, status, etc.)
**Affected files:** components/
**Dependencies:** RF-100, RF-101
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-104
**Title:** Update components for relationships
**Description:** Update frontend components to display structured relationships
**Affected files:** components/
**Dependencies:** RF-103
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-105
**Title:** Verify all pages compile
**Description:** Build the frontend and verify all pages compile without errors
**Affected files:** app/
**Dependencies:** RF-103, RF-104
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-106
**Title:** Verify search still works
**Description:** Test search functionality with new search index fields
**Affected files:** search/
**Dependencies:** RF-105, RF-078
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-107
**Title:** Verify routing still works
**Description:** Test all routes to ensure navigation still functions correctly
**Affected files:** app/
**Dependencies:** RF-105, RF-083
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-108
**Title:** Verify existing components remain reusable
**Description:** Test that existing components can still be reused without breaking
**Affected files:** components/
**Dependencies:** RF-105
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

---

# Epic 10: Repository Verification

## RF-110
**Title:** Run schema validation on all content
**Description:** Run Layer 1 validation on all content files
**Affected files:** content/
**Dependencies:** RF-108
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-111
**Title:** Run type synchronization check
**Description:** Verify TypeScript types are synchronized with JSON schemas
**Affected files:** types/, schema/v2/
**Dependencies:** RF-110
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-112
**Title:** Run alias uniqueness check
**Description:** Verify all aliases are unique across the repository
**Affected files:** metadata/aliases.json, content/
**Dependencies:** RF-110
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-113
**Title:** Run relationship integrity check
**Description:** Verify all relationship references point to existing content
**Affected files:** content/
**Dependencies:** RF-110
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-114
**Title:** Run navigation consistency check
**Description:** Verify navigation is consistent with metadata and content
**Affected files:** _nav.json, metadata/
**Dependencies:** RF-110
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-115
**Title:** Run search index completeness check
**Description:** Verify search index includes all required fields
**Affected files:** search-index.json
**Dependencies:** RF-110
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-116
**Title:** Run route coverage check
**Description:** Verify all content has corresponding routes
**Affected files:** app/, content/
**Dependencies:** RF-110
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-117
**Title:** Run build success check
**Description:** Verify the entire repository builds successfully
**Affected files:** -
**Dependencies:** RF-116
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-118
**Title:** Run lint success check
**Description:** Verify the entire repository passes linting
**Affected files:** -
**Dependencies:** RF-117
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-119
**Title:** Run dead code detection
**Description:** Identify and remove any dead code introduced during migration
**Affected files:** -
**Dependencies:** RF-118
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-120
**Title:** Run duplicate schema detection
**Description:** Verify no duplicate schema definitions exist
**Affected files:** schema/v2/, lib/schemas/
**Dependencies:** RF-118
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-121
**Title:** Run broken references check
**Description:** Verify no broken cross-references exist in the repository
**Affected files:** content/
**Dependencies:** RF-118
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-122
**Title:** Run documentation synchronization check
**Description:** Verify all documentation is synchronized with implementation
**Affected files:** docs/
**Dependencies:** RF-118
**Difficulty:** Medium
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-123
**Title:** Final repository audit with Kimi
**Description:** Run independent architecture audit with Kimi Agent
**Affected files:** -
**Dependencies:** RF-122
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-124
**Title:** Final specification consistency review with Claude
**Description:** Verify implementation matches Repository Foundation Specification v1.1
**Affected files:** -
**Dependencies:** RF-123
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-125
**Title:** Final governance review
**Description:** Verify all architectural decisions are documented and justified
**Affected files:** docs/adr/
**Dependencies:** RF-124
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

## RF-126
**Title:** Repository freeze
**Description:** Mark repository as frozen and create implementation branch merge to main
**Affected files:** -
**Dependencies:** RF-125
**Difficulty:** High
**Status:** Todo
**Reviewer:** TBD
**Completed date:** -

---

## Summary Statistics

- **Total Tasks:** 126
- **Completed:** 5 (RF-001, RF-005, RF-006, RF-008, RF-009)
- **In Progress:** 0
- **Blocked:** 0
- **Todo:** 121

- **Epic 1 (Foundation):** 11 tasks — 5 completed, 6 remaining
- **Epic 2 (BaseMeta):** 16 tasks
- **Epic 3 (Schema):** 6 tasks
- **Epic 4 (Types):** 7 tasks
- **Epic 5 (Validation):** 8 tasks
- **Epic 6 (Search):** 9 tasks
- **Epic 7 (Navigation):** 4 tasks
- **Epic 8 (Migration):** 9 tasks
- **Epic 9 (Frontend):** 9 tasks
- **Epic 10 (Verification):** 17 tasks

---

## Next Steps

1. Create implementation branch: `git checkout -b feature/repository-foundation-v2`
2. Continue Epic 1: RF-002, RF-003, RF-004, RF-007, RF-010, RF-011
3. Update task statuses as work progresses
4. After each Epic, run architectural audit before proceeding
5. Only merge to main after Epic 10 completes successfully
