# Implementation Roadmap

**Version:** 2.1
**Purpose:** Developer execution guide for autonomous AI coding agents
**Scope:** All 14 phases of AENS rebuild

This document translates the architectural blueprint into executable steps for AI coding agents. Each phase includes concrete deliverables, dependencies, acceptance criteria, and exit criteria.

---

# Phase 1: Repository Skeleton

## Goal
Create the directory structure for the new architecture.

## Deliverables
- Complete directory tree matching specification
- .gitkeep files in empty directories

## Files to Create
- `aens.config.json`
- `schema/`
- `schema/config.schema.json`
- `schema/v2/`
- `schema/v2/base.schema.json`
- `schema/v2/package.schema.json`
- `schema/v2/model.schema.json`
- `schema/v2/workflow.schema.json`
- `schema/v2/cheatsheet.schema.json`
- `schema/v2/registry.schema.json`
- `schema/v2/metadata.schema.json`
- `lib/`
- `lib/config/`
- `lib/validation/`
- `lib/content/`
- `lib/search/`
- `types/`
- `metadata/`
- `scripts/`
- `content/`
- `content/packages/`
- `content/models/`
- `content/models/ml/`
- `content/models/dl/`
- `content/models/llm/`
- `content/workflows/`
- `content/cheatsheets/`
- `content/registry/`

## Dependencies
- None

## Acceptance Criteria
- All directories exist
- .gitkeep files in empty directories
- Directory structure matches FOUNDATION_IMPLEMENTATION_BLUEPRINT.md

## Unit Tests
- None (file system only)

## Exit Criteria
- Directory tree verified
- Ready for Phase 2

---

# Phase 2: Configuration

## Goal
Create central configuration and schema validation.

## Deliverables
- `aens.config.json` with example configuration
- `schema/config.schema.json` for config validation
- `lib/config/loader.ts` to load and validate config
- `types/config.ts` TypeScript types for config

## Files to Create
- `aens.config.json`
- `schema/config.schema.json`
- `lib/config/loader.ts`
- `types/config.ts`

## Dependencies
- Phase 1 (directory structure)

## Acceptance Criteria
- `aens.config.json` exists with valid structure
- `schema/config.schema.json` validates config
- `lib/config/loader.ts` loads and validates config
- `types/config.ts` exports Config interface
- TypeScript compiles

## Unit Tests
- Test loader with valid config
- Test loader with invalid config (should throw)
- Test config schema validation

## Exit Criteria
- Config loads successfully
- Config validates against schema
- Ready for Phase 3

---

# Phase 3: JSON Schema

## Goal
Create all JSON Schema files for content types.

## Deliverables
- 7 JSON Schema files in `schema/v2/`
- All schemas valid JSON Schema 2020-12
- All $ref references resolve

## Files to Create
- `schema/v2/base.schema.json`
- `schema/v2/package.schema.json`
- `schema/v2/model.schema.json`
- `schema/v2/workflow.schema.json`
- `schema/v2/cheatsheet.schema.json`
- `schema/v2/registry.schema.json`
- `schema/v2/metadata.schema.json`

## Dependencies
- Phase 2 (config schema for reference)

## Acceptance Criteria
- All 7 schema files exist
- All schemas valid JSON Schema 2020-12
- All $ref references resolve
- No circular references
- Schemas compile with Ajv
- Schema structure matches FOUNDATION_IMPLEMENTATION_BLUEPRINT.md examples

## Unit Tests
- Test each schema with valid sample
- Test each schema with invalid sample (should fail)
- Test $ref resolution
- Test Ajv compilation

## Exit Criteria
- All schemas valid
- All schemas compile with Ajv
- Ready for Phase 4

---

# Phase 4: Metadata

## Goal
Create controlled vocabulary files.

## Deliverables
- 4 metadata JSON files with initial data
- All files validate against metadata schema

## Files to Create
- `metadata/tags.json`
- `metadata/aliases.json`
- `metadata/categories.json`
- `metadata/registry.json`

## Dependencies
- Phase 3 (metadata schema)

## Acceptance Criteria
- All 4 metadata files exist
- All files validate against `schema/v2/metadata.schema.json`
- Data extracted from legacy content
- No duplicates or collisions
- tag_rules defined in categories.json

## Unit Tests
- Test metadata files against schema
- Test tag_rules structure

## Exit Criteria
- All metadata files valid
- Ready for Phase 5

---

# Phase 5: Types

## Goal
Generate TypeScript types from JSON Schema.

## Deliverables
- 7 TypeScript type files
- Central export file
- Type generation script

## Files to Create
- `scripts/generate-types.ts`
- `types/base.ts`
- `types/package.ts`
- `types/model.ts`
- `types/workflow.ts`
- `types/cheatsheet.ts`
- `types/registry.ts`
- `types/metadata.ts`
- `types/index.ts`

## Dependencies
- Phase 3 (JSON Schema files)
- Phase 4 (metadata schema)

## Acceptance Criteria
- `json-schema-to-typescript` package installed
- `scripts/generate-types.ts` generates all types
- All type files exist
- All types have JSDoc documentation
- `types/index.ts` exports all types
- TypeScript compiles without errors
- No manual type maintenance required

## Unit Tests
- Test type generation script
- Test type exports

## Exit Criteria
- All types generated
- TypeScript compiles
- Ready for Phase 6

---

# Phase 6: Validation

## Goal
Implement 4-layer validation pipeline.

## Deliverables
- 4 validation layer modules
- CLI validation script

## Files to Create
- `lib/validation/layer1-schema.ts`
- `lib/validation/layer2-constraints.ts`
- `lib/validation/layer3-crossref.ts`
- `lib/validation/layer4-semantic.ts`
- `scripts/validate.ts`

## Dependencies
- Phase 3 (JSON Schema files)
- Phase 4 (metadata files)
- Phase 5 (TypeScript types)

## Acceptance Criteria
- All 4 validation layers implemented
- Validation script exists with CLI interface
- Each layer catches expected errors
- Valid content passes all layers
- Error messages are clear and actionable
- CLI flags work (--file, --all, --layer)

## Unit Tests
- Test layer 1 with valid/invalid schema
- Test layer 2 with constraint violations
- Test layer 3 with broken references
- Test layer 4 with unregistered tags/aliases
- Test CLI script with all flags

## Exit Criteria
- All validation layers work
- CLI script works
- Ready for Phase 7

---

# Phase 7: Content Loader

## Goal
Implement content loading, resolution, registry, and caching.

## Deliverables
- Content loader module
- Content resolver module
- Content registry module
- In-memory cache module
- Central export

## Files to Create
- `lib/content/loaders.ts`
- `lib/content/resolvers.ts`
- `lib/content/registry.ts`
- `lib/content/cache.ts`
- `lib/content/index.ts`

## Dependencies
- Phase 5 (TypeScript types)
- Phase 4 (metadata registry)

## Acceptance Criteria
- All content engine files created
- All functions implemented
- Caching works
- Registry integration works
- resolveById handles model ID format (model:category:slug)
- TypeScript compiles
- Tests pass

## Unit Tests
- Test loadContentFile
- Test loadContentDirectory
- Test loadAllContent
- Test resolveById with various ID formats
- Test resolveBySlug
- Test resolveByTag
- Test resolveByAlias
- Test cache get/set/clear
- Test registry collision detection

## Exit Criteria
- Content engine works
- TypeScript compiles
- Ready for Phase 8

---

# Phase 8: Search Engine

## Goal
Implement search indexing and search engine.

## Deliverables
- Search index generation script
- Search engine module

## Files to Create
- `scripts/build-search-index.ts`
- `lib/search/index.ts`

## Dependencies
- Phase 7 (content engine)

## Acceptance Criteria
- Search index generation script exists
- `search-index.json` generated with correct structure
- Search engine implements exact match on title/aliases/tags
- Search engine implements substring match on keywords/description
- No ranking required
- Simple array.filter() implementation
- Search performance acceptable (< 100ms for < 1000 entries)

## Unit Tests
- Test search index generation
- Test search with exact match
- Test search with substring match
- Test search with no results
- Test search case-insensitivity

## Exit Criteria
- Search index generates
- Search function works
- Ready for Phase 9

---

# Phase 9: Navigation

## Goal
Implement navigation generation.

## Deliverables
- Navigation generation script
- All _nav.json files

## Files to Create
- `scripts/build-nav.ts`
- `content/packages/_nav.json`
- `content/models/_nav.json`
- `content/models/ml/_nav.json`
- `content/models/dl/_nav.json`
- `content/models/llm/_nav.json`
- `content/workflows/_nav.json`
- `content/cheatsheets/_nav.json`

## Dependencies
- Phase 7 (content engine)
- Phase 4 (metadata categories)

## Acceptance Criteria
- Navigation generator created
- All _nav.json files generated
- Category assignment works via tag_rules
- Deterministic sorting (title ascending, then id ascending)
- Validation against metadata works
- Files are valid JSON

## Unit Tests
- Test navigation generation
- Test category assignment
- Test deterministic sorting
- Test _nav.json validation

## Exit Criteria
- All _nav.json files generated
- Navigation works
- Ready for Phase 10

---

# Phase 10: UI Foundation

## Goal
Update UI components to use new systems.

## Deliverables
- Updated SearchBox component
- Updated Sidebar component

## Files to Update
- `components/shared/SearchBox.tsx`
- `components/layout/Sidebar.tsx`

## Dependencies
- Phase 8 (search engine)
- Phase 9 (navigation files)

## Acceptance Criteria
- SearchBox imports from `lib/search/index.ts`
- SearchBox imports `search-index.json`
- SearchBox uses `search(query, searchIndex)` function
- Sidebar imports from _nav.json files
- Sidebar reads from content/*/_nav.json
- UI styling unchanged
- Search UI works
- Navigation works
- Expand/collapse works
- Active state works

## Unit Tests
- Test SearchBox with search function
- Test Sidebar with _nav.json data
- Test UI rendering

## Exit Criteria
- UI components updated
- UI works correctly
- No visual changes
- Ready for Phase 11

---

# Phase 11: Pages

## Goal
Update app routes to use new content engine.

## Deliverables
- Updated page components for all content types

## Files to Update
- `app/packages/[id]/page.tsx`
- `app/models/[category]/[id]/page.tsx`
- `app/workflows/[id]/page.tsx`
- `app/cheatsheets/[id]/page.tsx`
- `app/registry/[task]/page.tsx`

## Dependencies
- Phase 7 (content engine)

## Acceptance Criteria
- All pages import `resolveById` from `lib/content/resolvers.ts`
- All pages use `resolveById(id)` for data loading
- All pages handle null return with 404
- Route-specific ID formats used:
  - packages: `package:${id}`
  - models: `model:${category}:${id}`
  - workflows: `workflow:${id}`
  - cheatsheets: `cheatsheet:${id}`
  - registry: `registry:${task}`
- Page structure unchanged
- Page styling unchanged
- All routes work

## Unit Tests
- Test each page with valid ID
- Test each page with invalid ID (404)
- Test page rendering

## Exit Criteria
- All pages updated
- All routes work
- Ready for Phase 12

---

# Phase 12: Content Migration

## Goal
Migrate all content to new architecture.

## Deliverables
- All content migrated from legacy to new structure
- All content validates

## Files to Migrate
- All files from `legacy/content/packages/` to `content/packages/`
- All files from `legacy/content/models/` to `content/models/`
- All files from `legacy/content/workflows/` to `content/workflows/`
- All files from `legacy/content/cheatsheets/` to `content/cheatsheets/`
- All files from `legacy/content/registry/` to `content/registry/`

## Dependencies
- Phase 6 (validation)
- Phase 4 (metadata)

## Acceptance Criteria
- All packages migrated
- All models migrated
- All workflows migrated
- All cheatsheets migrated
- All registry entries migrated
- Schema version updated to "2.0"
- BaseMeta fields complete
- Alternatives converted to relationships
- Tags registered
- Aliases registered
- Model IDs use category encoding
- All content validates

## Unit Tests
- Validate all migrated content
- Test ID formats
- Test relationships

## Exit Criteria
- All content migrated
- All content validates
- Ready for Phase 13

---

# Phase 13: Testing

## Goal
Comprehensive testing and validation.

## Deliverables
- All audits pass
- Performance acceptable

## Tests to Run
- Validation audit
- Search audit
- Link audit
- Relationship audit
- Performance audit
- UI/UX consistency audit

## Dependencies
- Phase 12 (content migration)
- Phase 8 (search)
- Phase 9 (navigation)
- Phase 10 (UI)
- Phase 11 (pages)

## Acceptance Criteria
- Validation passes with zero errors
- All content searchable
- All search methods work
- No broken external links
- No broken internal references
- All relationships bidirectional
- No self-references
- No circular references
- All referenced IDs exist
- Search index generation < 5 seconds
- Navigation generation < 2 seconds
- Validation < 10 seconds
- Page load < 2 seconds
- UI visually consistent
- Navigation behavior consistent
- Search behavior consistent

## Unit Tests
- Run all audits
- Measure performance

## Exit Criteria
- All audits pass
- Performance acceptable
- Ready for Phase 14

---

# Phase 14: Polish

## Goal
Performance optimization and cleanup.

## Deliverables
- Performance optimized
- Documentation updated
- TODOs resolved

## Tasks
- Performance optimization
- Code cleanup
- Documentation updates
- TODO resolution

## Dependencies
- Phase 13 (testing)

## Acceptance Criteria
- Performance optimized
- Documentation updated
- No TODOs remaining
- Code clean

## Unit Tests
- Performance tests
- Documentation review

## Exit Criteria
- Project ready for production
- Implementation complete

---

# Implementation Notes

## Execution Order
Phases must be executed in numerical order (1-14) due to dependencies.

## Parallel Execution
Some phases can be parallelized within themselves (e.g., creating multiple schema files in Phase 3), but phase boundaries must be sequential.

## Validation
Each phase must pass its acceptance criteria before proceeding to the next phase.

## Testing
Unit tests should be written as each phase is completed, not deferred to the end.

## Documentation
Update documentation as changes are made, not as a separate phase.

## Error Handling
All modules must handle errors gracefully with clear error messages.

## TypeScript
TypeScript must compile without errors at the end of each phase.

## Git Commits
Commit after each phase completion with descriptive commit messages.
