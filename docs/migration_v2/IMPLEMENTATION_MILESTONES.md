# Implementation Milestones

**Version:** 2.1
**Purpose:** Break the 14-phase implementation into independently reviewable milestones
**Scope:** AENS rebuild implementation

Each milestone is independently reviewable and can be completed before moving to the next. This approach allows for incremental verification and reduces risk.

---

# Milestone 1: Foundation

**Phases:** 1-2
**Goal:** Establish repository structure and configuration

## Included Phases
- Phase 1: Repository Skeleton
- Phase 2: Configuration

## Deliverables
- Complete directory tree
- aens.config.json with example configuration
- schema/config.schema.json
- lib/config/loader.ts
- types/config.ts

## Definition of Done
- [ ] Directory tree matches FOUNDATION_IMPLEMENTATION_BLUEPRINT.md
- [ ] aens.config.json exists and is valid
- [ ] schema/config.schema.json validates config
- [ ] lib/config/loader.ts loads and validates config
- [ ] types/config.ts exports Config interface
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without warnings
- [ ] Unit tests for config loader pass
- [ ] No TODO comments
- [ ] No console.log statements

## Review Criteria
- Directory structure is correct
- Config loads successfully
- Config validates against schema
- TypeScript types are correct

## Tag
`v2.1-milestone-1-complete`

---

# Milestone 2: Schemas

**Phases:** 3
**Goal:** Create all JSON Schema files

## Included Phases
- Phase 3: JSON Schema

## Deliverables
- schema/v2/base.schema.json
- schema/v2/package.schema.json
- schema/v2/model.schema.json
- schema/v2/workflow.schema.json
- schema/v2/cheatsheet.schema.json
- schema/v2/registry.schema.json
- schema/v2/metadata.schema.json

## Definition of Done
- [ ] All 7 schema files exist
- [ ] All schemas valid JSON Schema 2020-12
- [ ] All $ref references resolve
- [ ] No circular references
- [ ] Schemas compile with Ajv
- [ ] Schema structure matches FOUNDATION_IMPLEMENTATION_BLUEPRINT.md examples
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without warnings
- [ ] Unit tests for schema validation pass
- [ ] No TODO comments
- [ ] No console.log statements

## Review Criteria
- All schemas are valid JSON Schema 2020-12
- $ref patterns are correct
- Required fields match specification
- Constraints match specification

## Tag
`v2.1-milestone-2-complete`

---

# Milestone 3: Metadata & Types

**Phases:** 4-5
**Goal:** Create metadata files and generate TypeScript types

## Included Phases
- Phase 4: Metadata
- Phase 5: Types

## Deliverables
- metadata/tags.json
- metadata/aliases.json
- metadata/categories.json
- metadata/registry.json
- scripts/generate-types.ts
- types/base.ts
- types/package.ts
- types/model.ts
- types/workflow.ts
- types/cheatsheet.ts
- types/registry.ts
- types/metadata.ts
- types/index.ts

## Definition of Done
- [ ] All 4 metadata files exist
- [ ] All metadata files validate against schema
- [ ] json-schema-to-typescript package installed
- [ ] scripts/generate-types.ts generates all types
- [ ] All type files exist
- [ ] All types have JSDoc documentation
- [ ] types/index.ts exports all types
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without warnings
- [ ] Unit tests for type generation pass
- [ ] Unit tests for metadata validation pass
- [ ] No TODO comments
- [ ] No console.log statements

## Review Criteria
- Metadata files are valid
- Types are correctly generated
- Type exports are correct
- JSDoc documentation is present

## Tag
`v2.1-milestone-3-complete`

---

# Milestone 4: Validation

**Phases:** 6
**Goal:** Implement 4-layer validation pipeline

## Included Phases
- Phase 6: Validation

## Deliverables
- lib/validation/layer1-schema.ts
- lib/validation/layer2-constraints.ts
- lib/validation/layer3-crossref.ts
- lib/validation/layer4-semantic.ts
- scripts/validate.ts

## Definition of Done
- [ ] All 4 validation layers implemented
- [ ] Validation script exists with CLI interface
- [ ] Each layer catches expected errors
- [ ] Valid content passes all layers
- [ ] Error messages are clear and actionable
- [ ] CLI flags work (--file, --all, --layer)
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without warnings
- [ ] Unit tests for all validation layers pass
- [ ] Unit tests for CLI script pass
- [ ] No TODO comments
- [ ] No console.log statements

## Review Criteria
- All 4 layers are implemented correctly
- Validation catches expected errors
- Error messages are clear
- CLI interface works

## Tag
`v2.1-milestone-4-complete`

---

# Milestone 5: Content Engine

**Phases:** 7
**Goal:** Implement content loading, resolution, registry, and caching

## Included Phases
- Phase 7: Content Loader

## Deliverables
- lib/content/loaders.ts
- lib/content/resolvers.ts
- lib/content/registry.ts
- lib/content/cache.ts
- lib/content/index.ts

## Definition of Done
- [ ] All content engine files created
- [ ] All functions implemented
- [ ] Caching works
- [ ] Registry integration works
- [ ] resolveById handles model ID format (model:category:slug)
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without warnings
- [ ] Unit tests for all functions pass
- [ ] Unit tests for cache pass
- [ ] Unit tests for registry pass
- [ ] No TODO comments
- [ ] No console.log statements

## Review Criteria
- Content loading works
- Resolution works for all ID formats
- Caching works correctly
- Registry collision detection works

## Tag
`v2.1-milestone-5-complete`

---

# Milestone 6: Search & Navigation

**Phases:** 8-9
**Goal:** Implement search indexing and navigation generation

## Included Phases
- Phase 8: Search Engine
- Phase 9: Navigation

## Deliverables
- scripts/build-search-index.ts
- lib/search/index.ts
- search-index.json
- scripts/build-nav.ts
- content/packages/_nav.json
- content/models/_nav.json
- content/models/ml/_nav.json
- content/models/dl/_nav.json
- content/models/llm/_nav.json
- content/workflows/_nav.json
- content/cheatsheets/_nav.json

## Definition of Done
- [ ] Search index generation script exists
- [ ] search-index.json generated with correct structure
- [ ] Search engine implements exact match on title/aliases/tags
- [ ] Search engine implements substring match on keywords/description
- [ ] No ranking required
- [ ] Simple array.filter() implementation
- [ ] Search performance acceptable (< 100ms for < 1000 entries)
- [ ] Navigation generator created
- [ ] All _nav.json files generated
- [ ] Category assignment works via tag_rules
- [ ] Deterministic sorting (title ascending, then id ascending)
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without warnings
- [ ] Unit tests for search pass
- [ ] Unit tests for navigation pass
- [ ] No TODO comments
- [ ] No console.log statements

## Review Criteria
- Search function works correctly
- Navigation generation works correctly
- Category assignment uses tag_rules
- Sorting is deterministic
- Performance is acceptable

## Tag
`v2.1-milestone-6-complete`

---

# Milestone 7: UI Integration

**Phases:** 10-11
**Goal:** Update UI components and pages to use new systems

## Included Phases
- Phase 10: UI Foundation
- Phase 11: Pages

## Deliverables
- Updated components/shared/SearchBox.tsx
- Updated components/layout/Sidebar.tsx
- Updated app/packages/[id]/page.tsx
- Updated app/models/[category]/[id]/page.tsx
- Updated app/workflows/[id]/page.tsx
- Updated app/cheatsheets/[id]/page.tsx
- Updated app/registry/[task]/page.tsx

## Definition of Done
- [ ] SearchBox imports from lib/search/index.ts
- [ ] SearchBox imports search-index.json
- [ ] SearchBox uses search(query, searchIndex) function
- [ ] Sidebar imports from _nav.json files
- [ ] Sidebar reads from content/*/_nav.json
- [ ] UI styling unchanged
- [ ] Search UI works
- [ ] Navigation works
- [ ] Expand/collapse works
- [ ] Active state works
- [ ] All pages import resolveById from lib/content/resolvers.ts
- [ ] All pages use resolveById(id) for data loading
- [ ] All pages handle null return with 404
- [ ] Route-specific ID formats used correctly
- [ ] Page structure unchanged
- [ ] Page styling unchanged
- [ ] All routes work
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without warnings
- [ ] Unit tests for components pass
- [ ] Unit tests for pages pass
- [ ] No TODO comments
- [ ] No console.log statements

## Review Criteria
- UI components work correctly
- Pages load correctly
- No visual changes
- All routes work
- 404 handling works

## Tag
`v2.1-milestone-7-complete`

---

# Milestone 8: Migration & Testing

**Phases:** 12-13
**Goal:** Migrate content and run comprehensive testing

## Included Phases
- Phase 12: Content Migration
- Phase 13: Testing

## Deliverables
- All content migrated from legacy to new structure
- All content validates
- All audit reports

## Definition of Done
- [ ] All packages migrated
- [ ] All models migrated
- [ ] All workflows migrated
- [ ] All cheatsheets migrated
- [ ] All registry entries migrated
- [ ] Schema version updated to "2.0"
- [ ] BaseMeta fields complete
- [ ] Alternatives converted to relationships
- [ ] Tags registered
- [ ] Aliases registered
- [ ] Model IDs use category encoding
- [ ] All content validates
- [ ] Validation passes with zero errors
- [ ] All content searchable
- [ ] All search methods work
- [ ] No broken external links
- [ ] No broken internal references
- [ ] All relationships bidirectional
- [ ] No self-references
- [ ] No circular references
- [ ] All referenced IDs exist
- [ ] Search index generation < 5 seconds
- [ ] Navigation generation < 2 seconds
- [ ] Validation < 10 seconds
- [ ] Page load < 2 seconds
- [ ] UI visually consistent
- [ ] Navigation behavior consistent
- [ ] Search behavior consistent
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without warnings
- [ ] No TODO comments
- [ ] No console.log statements

## Review Criteria
- All content migrated successfully
- All content validates
- All audits pass
- Performance targets met
- UI/UX consistent

## Tag
`v2.1-milestone-8-complete`

---

# Milestone 9: Polish

**Phases:** 14
**Goal:** Performance optimization and cleanup

## Included Phases
- Phase 14: Polish

## Deliverables
- Optimized codebase
- Updated documentation
- Clean codebase

## Definition of Done
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] No TODOs remaining
- [ ] Code clean
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without warnings
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] No unused imports

## Review Criteria
- Performance is optimized
- Documentation is complete
- Code is clean
- No technical debt

## Tag
`v2.1-complete`

---

# Milestone Execution Guidelines

## Order
Milestones must be executed in numerical order (1-9) due to dependencies.

## Review Process
After each milestone:
1. Verify Definition of Done checklist
2. Run all unit tests
3. Verify TypeScript compilation
4. Verify ESLint
5. Review code against AI_IMPLEMENTATION_PLAYBOOK.md
6. Tag completion
7. Only proceed to next milestone after approval

## Rollback
If a milestone fails review:
1. Identify the failure
2. Fix the issue
3. Re-run verification
4. Do not proceed to next milestone until fixed

## Parallel Execution
Within a milestone, some phases can be parallelized (e.g., creating multiple schema files in Milestone 2), but milestone boundaries must be sequential.

## Continuous Integration
Each milestone should:
- Pass all tests
- Compile without errors
- Pass linting
- Be tagged for version control

---

# Summary

**Total Milestones:** 9
**Total Phases:** 14

**Milestone Breakdown:**
- Milestone 1: Foundation (Phases 1-2)
- Milestone 2: Schemas (Phase 3)
- Milestone 3: Metadata & Types (Phases 4-5)
- Milestone 4: Validation (Phase 6)
- Milestone 5: Content Engine (Phase 7)
- Milestone 6: Search & Navigation (Phases 8-9)
- Milestone 7: UI Integration (Phases 10-11)
- Milestone 8: Migration & Testing (Phases 12-13)
- Milestone 9: Polish (Phase 14)

Each milestone is independently reviewable and can be completed before moving to the next. This approach allows for incremental verification and reduces risk.
