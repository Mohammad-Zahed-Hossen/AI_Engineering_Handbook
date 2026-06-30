# AENS Repository Foundation v2 — Integration Architecture Audit
**Status:** Draft
**Created:** 2026-06-30
**Scope:** Current Repository → Repository Foundation v2 Migration

---

## 1. Executive Summary

### Why Implementation Must Pause

The Repository Foundation Specification v1.1 is architecturally sound but was designed as a greenfield specification without full consideration of the existing production repository. Implementing it literally would create:

- **Duplicate schema systems:** Zod (lib/schemas/) + JSON Schema (schema/v2/)
- **Duplicate validation systems:** Single-layer Zod validation + 4-layer JSON Schema validation
- **Duplicate metadata systems:** BaseMeta in Zod + BaseMeta in JSON Schema
- **Duplicate search systems:** Dynamic index generation (lib/search.ts) + static search-index.json
- **Duplicate configuration:** lib/config/registry.ts + aens.config.json
- **Duplicate content roots:** data/ + content/

These parallel systems violate the Repository Foundation's own Principle R1 (One Source, Many References) and would create long-term maintenance burden for a single maintainer.

### Main Architectural Risks

1. **Schema Authority Conflict:** Current system uses Zod as the canonical schema. Specification requires JSON Schema 2020-12 as canonical. Both cannot be authoritative simultaneously.
2. **Type Derivation Conflict:** Current types derive from Zod schemas. Specification requires parallel maintenance with JSON Schema. This breaks the existing type-safety guarantee.
3. **Content Directory Rename:** data/ → content/ would break all imports in lib/data.ts and require updating every route in app/.
4. **Relationship Model Incompatibility:** Current uses flat `alternatives` array. Specification requires structured `relationships` object. This is a breaking change for all content files.
5. **Navigation Architecture Mismatch:** Current uses _nav.json index files. Specification wants metadata/categories.json-driven navigation. These are fundamentally different approaches.
6. **Search Index Placement:** Current builds index dynamically at build time. Specification wants search-index.json at root as a committed artifact. This changes the build contract.

### Overall Recommendation

**Do not implement the Repository Foundation Specification v1.1 literally.**

Instead, create an **integration strategy** that:
1. Preserves the working Zod-based validation system
2. Extends BaseMeta with new fields incrementally
3. Adds JSON Schema as a secondary validation layer (not replacement)
4. Keeps data/ directory (rename is unnecessary breaking change)
5. Adopts the structured relationships model via migration
6. Integrates metadata/ directory as a vocabulary layer
7. Adds aens.config.json as a central configuration source
8. Enhances search with new fields without changing architecture
9. Adds ADR infrastructure without disrupting existing docs

The migration should be **evolutionary, not revolutionary**.

---

## 2. Current Repository Architecture

### Directory Structure

```
ai-engineering-handbook/
├── app/                          # Next.js 16.2.9 app router
│   ├── layout.tsx               # Root layout with data loading
│   ├── page.tsx                 # Dashboard
│   ├── packages/[id]/page.tsx  # Package routes
│   ├── models/[category]/[id]/page.tsx  # Model routes
│   ├── workflows/[id]/page.tsx # Workflow routes
│   ├── cheatsheets/[id]/page.tsx # Cheatsheet routes
│   └── registry/[task]/page.tsx # Registry routes
├── components/
│   ├── layout/                  # Sidebar, TopBar, MobileSidebar
│   ├── shared/                  # Reusable components (SearchBox, etc.)
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── data.ts                  # Core data loading (607 lines)
│   ├── search.ts                # Search index builder (177 lines)
│   ├── search/                  # Search engine implementation
│   │   ├── engine.ts
│   │   ├── inverted-index.ts
│   │   ├── related-search.ts
│   │   ├── synonym-expander.ts
│   │   └── tokenizer.ts
│   ├── schemas/                 # Zod schemas (canonical)
│   │   ├── meta.ts              # BaseMetaSchema
│   │   ├── package.ts
│   │   ├── model.ts
│   │   ├── workflow.ts
│   │   ├── cheatsheet.ts
│   │   └── registry.ts
│   ├── config/
│   │   └── registry.ts          # Registry task mappings
│   ├── search-types.ts          # TypeScript search types
│   ├── resources.ts             # Content type formatting
│   ├── route-params.ts          # Route validation
│   ├── session-tracking.ts      # Session management
│   └── utils.ts
├── types/                       # TypeScript types (derived from Zod)
│   ├── package.ts
│   ├── model.ts
│   ├── workflow.ts
│   ├── cheatsheet.ts
│   ├── registry.ts
│   └── meta.ts
├── scripts/
│   ├── validate-content.ts      # Zod validation (338 lines)
│   └── build-nav-index.ts       # Navigation index builder
├── data/                        # Content storage (NOT content/)
│   ├── packages/                # Package JSON files
│   │   ├── _nav.json           # Navigation index
│   │   └── [id].json
│   ├── models/
│   │   ├── ml/
│   │   ├── dl/
│   │   ├── llm/
│   │   └── [category]/_nav.json
│   ├── workflows/
│   │   ├── _nav.json
│   │   └── [id].json
│   ├── cheatsheets/
│   │   ├── _nav.json
│   │   └── [id].json
│   └── registry/
│       └── [task].json
├── docs/
│   ├── migration/               # Migration artifacts
│   └── adr/                     # Empty (no ADRs yet)
└── package.json                 # Dependencies: zod, fuse.js, next, react
```

### Data Flow

```
Content Files (data/[type]/[id].json)
    ↓
lib/data.ts (React cache() + readJSON())
    ↓
lib/schemas/*.ts (Zod validation)
    ↓
types/*.ts (TypeScript types derived from Zod)
    ↓
app/[type]/[id]/page.tsx (Route components)
    ↓
components/shared/ (Display components)
```

### Search Flow

```
Content Files (data/[type]/[id].json)
    ↓
lib/data.ts (getAllPackages, getAllModels, etc.)
    ↓
lib/search.ts (buildSearchIndex)
    ↓
lib/search/engine.ts (createSearchEngine)
    ↓
components/shared/SearchBox.tsx
```

### Validation Flow

```
Content Files (data/[type]/[id].json)
    ↓
scripts/validate-content.ts
    ↓
lib/schemas/*.ts (Zod.safeParse)
    ↓
Error/Warning reporting
```

### Navigation Flow

```
Content Files (data/[type]/[id].json)
    ↓
scripts/build-nav-index.ts
    ↓
_nav.json files (lightweight navigation indexes)
    ↓
lib/data.ts (getPackageNavItems, etc.)
    ↓
components/layout/Sidebar.tsx
```

### Content Loading

- **Mechanism:** React `cache()` wrapper functions in lib/data.ts
- **Entry points:** `getPackage()`, `getModel()`, `getWorkflow()`, `getCheatsheet()`, `getRegistryByTask()`
- **Path resolution:** `path.join(process.cwd(), 'data', ...)`
- **Caching:** React cache() at build time for static generation

### Frontend Coupling

- **Routes:** app/[type]/[id]/page.tsx pattern
- **Imports:** All routes import from `@/lib/data` and `@/types/[type]`
- **Components:** Shared components import from `@/lib/data` for content resolution
- **Search:** SearchBox imports from `@/lib/search-types`

### Type System

- **Authority:** Zod schemas in lib/schemas/
- **Derivation:** TypeScript types in types/ use `z.infer<typeof Schema>`
- **Synchronization:** Manual (types are re-exported inferences)
- **Validation:** Zod.safeParse() in validate-content.ts

### Schema System

- **Standard:** Zod (not JSON Schema)
- **Location:** lib/schemas/
- **Composition:** BaseMetaSchema extended by content type schemas
- **Current BaseMeta fields:** created_at, updated_at, sources (array of URLs), github_repo (optional)

### Configuration

- **Location:** lib/config/registry.ts
- **Scope Registry:** REGISTRY_TASK_FILES and REGISTRY_FILE_TO_TASK mappings
- **No central config:** Size budgets, content types, schema versions are NOT centralized

---

## 3. Repository Foundation Target Architecture

### New Concepts

1. **JSON Schema 2020-12 as canonical schema** (schema/v2/)
2. **TypeScript types in parallel maintenance** (types/ at root, not derived)
3. **BaseMeta expansion:** schema_version, id, title, aliases, description, tags, status, deprecated, stability, versioning, relationships, keywords, content_role
4. **Structured relationships object:** `{ workflows: [], models: [], packages: [], cheatsheets: [], registry: [] }`
5. **metadata/ directory:** tags.json, aliases.json, categories.json (controlled vocabularies)
6. **aens.config.json:** Central configuration (content types, schema versions, size budgets, stability tiers)
7. **4-layer validation:** Structural, Constraint, Cross-Reference, Semantic
8. **search-index.json at root:** Static committed artifact
9. **ADR infrastructure:** docs/adr/ for architectural decisions
10. **Migration artifacts:** docs/migration/ for migration reports

### New Metadata Fields

- **schema_version:** String (e.g., "2.0")
- **aliases:** Array of strings (search optimization)
- **keywords:** Array of strings (search optimization)
- **status:** Enum (draft | stub | complete | deprecated)
- **deprecated:** Object (is_deprecated, replaced_by)
- **stability:** Enum (stable | semi_stable | volatile)
- **versioning:** Object (verified_against, last_verified_at)
- **relationships:** Structured object (replaces alternatives)
- **content_role:** Enum (index | child)

### New Validation Layers

- **Layer 1:** JSON parse + JSON Schema validation (Ajv)
- **Layer 2:** Configuration enforcement (aens.config.json constraints)
- **Layer 3:** Cross-Reference validation (graph integrity)
- **Layer 4:** Semantic validation (content quality rules)

### New Governance

- **Schema authority:** JSON Schema (not Zod)
- **Type authority:** Parallel maintenance (not derived)
- **Configuration authority:** aens.config.json (not scattered)
- **Metadata authority:** metadata/ directory (not implicit)

---

## 4. Architecture Divergence Matrix

| Subsystem | Current | Proposed | Conflict | Severity | Migration Strategy | Owner |
|-----------|---------|----------|----------|----------|-------------------|-------|
| **Schema Authority** | Zod (lib/schemas/) | JSON Schema 2020-12 (schema/v2/) | Two canonical schemas cannot coexist | **HIGH** | Keep Zod as primary, add JSON Schema as secondary validation layer | TBD |
| **Type Derivation** | Derived from Zod via `z.infer` | Parallel maintenance with JSON Schema | Breaks type-safety guarantee | **HIGH** | Keep Zod derivation, add JSON Schema types as documentation only | TBD |
| **Content Directory** | data/ | content/ | All imports in lib/data.ts would break | **HIGH** | Keep data/ (rename is unnecessary breaking change) | TBD |
| **Configuration** | lib/config/registry.ts | aens.config.json | Scattered config vs central config | **MEDIUM** | Add aens.config.json, migrate registry.ts to read from it | TBD |
| **BaseMeta Fields** | created_at, updated_at, sources, github_repo | 11 additional fields | Missing fields in current content | **MEDIUM** | Extend Zod BaseMetaSchema incrementally | TBD |
| **Relationships** | alternatives array (ContentRef[]) | relationships object (5 typed arrays) | Structurally incompatible | **HIGH** | Migration script to transform alternatives → relationships | TBD |
| **Navigation** | _nav.json index files | metadata/categories.json driven | Different approaches entirely | **MEDIUM** | Keep _nav.json, add metadata/categories.json as supplementary | TBD |
| **Search Index** | Dynamic build in lib/search.ts | Static search-index.json at root | Build contract change | **MEDIUM** | Keep dynamic build, add option to export static index | TBD |
| **Search Fields** | title, summary, category | aliases, keywords, mental_trigger, problem_statement, error_messages, status | Missing search fields | **LOW** | Extend buildSearchIndex() to extract new fields | TBD |
| **Validation** | Single-layer Zod validation | 4-layer validation (Ajv + semantic) | Validation architecture mismatch | **HIGH** | Keep Zod as primary, add Layer 3-4 as post-Zod checks | TBD |
| **Metadata Directory** | None | metadata/ (tags.json, aliases.json, categories.json) | New controlled vocabulary system | **LOW** | Add metadata/ directory, integrate with validation | TBD |
| **ADR Infrastructure** | None (docs/adr/ empty) | docs/adr/ with ADR format | Missing governance | **LOW** | Add ADR template, document key decisions | TBD |
| **Migration Artifacts** | docs/migration/ exists | docs/migration/ with specific files | Partial alignment | **LOW** | Add migration-report.json, review-queue.md | TBD |
| **Content Types** | 5 types (package, model, workflow, cheatsheet, registry) | Same 5 types (closed set) | Aligned | **NONE** | No change needed | TBD |
| **ID Format** | type:slug (implicit) | type:slug (explicit) | Aligned | **NONE** | No change needed | TBD |
| **Slug Rules** | Regex validation in validate-content.ts | Specified in specification | Aligned | **NONE** | No change needed | TBD |

---

## 5. Integration Principles

### Principle 1: No Parallel Architecture

**Rule:** Never maintain two authoritative systems for the same concern.

**Application:**
- Zod remains the canonical schema. JSON Schema is added as a secondary validation layer for interoperability, not as a replacement.
- TypeScript types remain derived from Zod. JSON Schema types are added as documentation only.
- data/ directory remains the content root. content/ is NOT created.
- _nav.json remains the navigation mechanism. metadata/categories.json is added as supplementary vocabulary.

### Principle 2: One Source of Truth

**Rule:** Every piece of information has exactly one authoritative location.

**Application:**
- Schema truth: lib/schemas/*.ts (Zod)
- Type truth: types/*.ts (derived from Zod)
- Content truth: data/[type]/[id].json
- Configuration truth: aens.config.json (new, replaces scattered config)
- Navigation truth: _nav.json files (generated from content)
- Metadata truth: metadata/*.json (controlled vocabularies)

### Principle 3: Backward Compatibility First

**Rule:** Never break existing functionality without explicit migration path.

**Application:**
- data/ → content/ rename is BLOCKED (unnecessary breaking change)
- alternatives → relationships transformation requires migration script
- New BaseMeta fields must be optional initially (migration period)
- Existing routes must continue to work during migration

### Principle 4: Incremental Migration

**Rule:** Migrate one subsystem at a time, verify, then proceed.

**Application:**
- Phase 1: Configuration (add aens.config.json)
- Phase 2: Metadata extension (extend BaseMetaSchema)
- Phase 3: Vocabulary system (add metadata/)
- Phase 4: Relationships migration (transform alternatives → relationships)
- Phase 5: Search enhancement (add new search fields)
- Phase 6: Validation enhancement (add Layer 3-4)
- Phase 7: ADR infrastructure (document decisions)
- Phase 8: Final verification

### Principle 5: No Frontend Breakage

**Rule:** Frontend must continue to work throughout migration.

**Application:**
- All routes in app/ must remain functional
- All components in components/ must remain compatible
- Search must continue to work
- Navigation must continue to work

### Principle 6: No Runtime Regressions

**Rule:** Performance and correctness must not degrade.

**Application:**
- React cache() in lib/data.ts must remain
- Search index build time must not increase significantly
- Validation time must not increase significantly

### Principle 7: One Validation System

**Rule:** Validation must have a single entry point.

**Application:**
- scripts/validate-content.ts remains the entry point
- Layer 1 (Zod) remains the primary validation
- Layer 3-4 are added as post-Zod checks, not replacements

### Principle 8: One Schema Authority

**Rule:** Schema must have a single authoritative definition.

**Application:**
- lib/schemas/*.ts (Zod) remains authoritative
- schema/v2/*.json (JSON Schema) is added as secondary representation for interoperability
- JSON Schema is generated from Zod or manually synchronized, but Zod is the source of truth

### Principle 9: One Configuration Authority

**Rule:** Configuration must have a single source.

**Application:**
- aens.config.json becomes the single configuration source
- lib/config/registry.ts is refactored to read from aens.config.json
- No hardcoded constants in scripts or lib/

---

## 6. Migration Strategy

### Subsystem: Schema Authority

**Current owner:** lib/schemas/*.ts (Zod)
**Future owner:** lib/schemas/*.ts (Zod) - NO CHANGE
**Bridge period:** JSON Schema added as secondary layer
**Deprecation strategy:** None (Zod remains primary)
**Final state:** Zod primary, JSON Schema secondary for interoperability

**Rationale:** The existing Zod-based validation works perfectly. Replacing it with JSON Schema would require rewriting all validation logic, updating all type derivations, and breaking the existing build pipeline. The Repository Foundation's Principle R3 (Maintainability Over Elegance) supports keeping the working system.

### Subsystem: Type Derivation

**Current owner:** types/*.ts (derived from Zod)
**Future owner:** types/*.ts (derived from Zod) - NO CHANGE
**Bridge period:** JSON Schema types added as documentation
**Deprecation strategy:** None (Zod derivation remains)
**Final state:** Zod-derived types for runtime, JSON Schema types for documentation

**Rationale:** Zod derivation provides compile-time type safety that manual synchronization cannot guarantee. Breaking this would introduce type errors across the entire codebase.

### Subsystem: Content Directory

**Current owner:** data/
**Future owner:** data/ - NO CHANGE
**Bridge period:** N/A
**Deprecation strategy:** None (data/ remains)
**Final state:** data/ remains content root

**Rationale:** Renaming data/ to content/ would require updating every import in lib/data.ts, every route in app/, and every reference in documentation. This is a breaking change with no functional benefit. The Repository Foundation's Principle R8 (Extension is Additive) supports keeping the existing structure.

### Subsystem: Configuration

**Current owner:** lib/config/registry.ts (partial)
**Future owner:** aens.config.json (central)
**Bridge period:** registry.ts migrates to read from aens.config.json
**Deprecation strategy:** registry.ts deprecated after migration
**Final state:** aens.config.json as single source

**Migration steps:**
1. Create aens.config.json with content types, schema versions, size budgets
2. Update lib/config/registry.ts to read from aens.config.json
3. Update scripts to read from aens.config.json
4. Remove hardcoded constants
5. Deprecate lib/config/registry.ts

### Subsystem: BaseMeta Fields

**Current owner:** lib/schemas/meta.ts (4 fields)
**Future owner:** lib/schemas/meta.ts (15 fields)
**Bridge period:** New fields added as optional
**Deprecation strategy:** None (all fields become required after migration)
**Final state:** Full BaseMeta with all fields

**Migration steps:**
1. Add schema_version field (optional initially)
2. Add aliases field (optional initially)
3. Add keywords field (optional initially)
4. Add status field (optional initially)
5. Add deprecated field (optional initially)
6. Add stability field (optional initially)
7. Add versioning field (optional initially)
8. Add relationships field (optional initially, coexists with alternatives)
9. Add content_role field (optional initially)
10. Migration script to populate new fields in existing content
11. Make fields required after migration complete

### Subsystem: Relationships

**Current owner:** alternatives array (ContentRef[])
**Future owner:** relationships object (5 typed arrays)
**Bridge period:** Both coexist during migration
**Deprecation strategy:** alternatives deprecated after relationships migration
**Final state:** relationships object only

**Migration steps:**
1. Add relationships field to BaseMetaSchema (optional)
2. Migration script to transform alternatives → relationships
   - alternatives with type="package" → relationships.packages
   - alternatives with type="model" → relationships.models
   - alternatives with type="workflow" → relationships.workflows
   - alternatives with type="cheatsheet" → relationships.cheatsheets
   - alternatives with type="registry" → relationships.registry
3. Update lib/data.ts to use relationships for getRelatedContent()
4. Update components to use relationships
5. Deprecate alternatives field
6. Remove alternatives field after migration complete

### Subsystem: Navigation

**Current owner:** _nav.json files (generated)
**Future owner:** _nav.json files (generated) + metadata/categories.json (supplementary)
**Bridge period:** Both coexist
**Deprecation strategy:** None (_nav.json remains primary)
**Final state:** _nav.json primary, metadata/categories.json for vocabulary validation

**Rationale:** _nav.json files work perfectly for navigation. Replacing them with metadata/categories.json would require rewriting the entire navigation system. The metadata/categories.json should be used for vocabulary validation, not navigation generation.

### Subsystem: Search Index

**Current owner:** Dynamic build in lib/search.ts
**Future owner:** Dynamic build in lib/search.ts + optional static export
**Bridge period:** Both coexist
**Deprecation strategy:** None (dynamic build remains)
**Final state:** Dynamic build primary, static export optional for external tools

**Rationale:** Dynamic build at runtime ensures search index is always up-to-date with content changes. Static search-index.json would require a build step and could become stale. The dynamic approach is better for a single-maintainer system.

### Subsystem: Search Fields

**Current owner:** title, summary, category, keywords (derived)
**Future owner:** title, summary, category, aliases, keywords, mental_trigger, problem_statement, error_messages, status
**Bridge period:** New fields added incrementally
**Deprecation strategy:** None (all fields additive)
**Final state:** All fields indexed

**Migration steps:**
1. Extend buildSearchIndex() to extract aliases from content
2. Extend buildSearchIndex() to extract keywords from content
3. Extend buildSearchIndex() to extract mental_trigger from models/packages
4. Extend buildSearchIndex() to extract problem_statement from workflows
5. Extend buildSearchIndex() to extract error_messages from packages
6. Extend buildSearchIndex() to filter by status
7. Update SearchBox component to handle new fields

### Subsystem: Validation

**Current owner:** Single-layer Zod validation
**Future owner:** 4-layer validation (Zod + semantic)
**Bridge period:** Layer 3-4 added incrementally
**Deprecation strategy:** None (Zod remains Layer 1)
**Final state:** Zod (Layer 1) + Constraint (Layer 2) + Cross-Reference (Layer 3) + Semantic (Layer 4)

**Migration steps:**
1. Keep Layer 1 (Zod validation) as-is
2. Add Layer 2 (Constraint validation) reading from aens.config.json
3. Add Layer 3 (Cross-Reference validation) checking relationships integrity
4. Add Layer 4 (Semantic validation) checking status/version consistency, taxonomy conformance
5. Update validate-content.ts to run all 4 layers
6. Add --layer flag to validate-content.ts for selective validation

### Subsystem: Metadata Directory

**Current owner:** None
**Future owner:** metadata/ (tags.json, aliases.json, categories.json)
**Bridge period:** metadata/ created, validation updated
**Deprecation strategy:** None
**Final state:** metadata/ as controlled vocabulary source

**Migration steps:**
1. Create metadata/ directory
2. Create metadata/tags.json with existing tags extracted from content
3. Create metadata/aliases.json with existing aliases extracted from content
4. Create metadata/categories.json with category definitions
5. Update Layer 4 validation to check tag/alias/category conformance
6. Update build-nav-index.ts to read from metadata/ for validation

### Subsystem: ADR Infrastructure

**Current owner:** None (docs/adr/ empty)
**Future owner:** docs/adr/ with ADR format
**Bridge period:** ADRs added for key decisions
**Deprecation strategy:** None
**Final state:** ADRs for all architectural decisions

**Migration steps:**
1. Create ADR template in docs/adr/
2. Document decision to keep Zod as primary schema
3. Document decision to keep data/ directory
4. Document decision to keep _nav.json navigation
5. Document decision for relationships migration strategy
6. Document decision for validation architecture

### Subsystem: Migration Artifacts

**Current owner:** docs/migration/ (partial)
**Future owner:** docs/migration/ (complete with migration-report.json, review-queue.md)
**Bridge period:** New files added
**Deprecation strategy:** None
**Final state:** Complete migration artifact set

**Migration steps:**
1. Create docs/migration/migration-report.json template
2. Update scripts/validate-content.ts to generate migration-report.json
3. Create docs/migration/review-queue.md
4. Update migration scripts to populate review-queue.md

---

## 7. Dependency Graph

```
Configuration (aens.config.json)
    ↓
Metadata Directory (metadata/)
    ↓
BaseMeta Extension (lib/schemas/meta.ts)
    ↓
Relationships Migration (alternatives → relationships)
    ↓
Validation Enhancement (Layer 2-4)
    ↓
Search Enhancement (new fields)
    ↓
Content Migration (populate new fields)
    ↓
Navigation Update (metadata/ integration)
    ↓
Frontend Compatibility (components update)
    ↓
ADR Infrastructure (document decisions)
    ↓
Final Verification
```

### Critical Path

1. **Configuration must come first** because validation and metadata depend on it
2. **Metadata directory must come before validation** because Layer 4 checks taxonomy conformance
3. **BaseMeta extension must come before relationships migration** because relationships is a BaseMeta field
4. **Relationships migration must come before validation** because Layer 3 checks relationship integrity
5. **Validation must come before content migration** because migrated content must pass validation
6. **Content migration must come before search enhancement** because search reads from content
7. **Search enhancement must come before frontend compatibility** because components use search
8. **Frontend compatibility must come before final verification** because verification checks frontend

### Parallel Work Opportunities

- **ADR infrastructure** can be done in parallel with any phase (documentation-only)
- **Navigation update** can be done in parallel with search enhancement (independent subsystems)
- **Metadata directory creation** can be done in parallel with BaseMeta extension (independent until validation)

---

## 8. ADR Requirements

### ADR-001: Schema Authority Decision

**Status:** Required before Phase 1
**Question:** Should Zod or JSON Schema be the canonical schema?
**Decision:** Zod remains canonical. JSON Schema added as secondary layer.
**Rationale:** Existing Zod-based validation works perfectly. Replacing it would require rewriting all validation logic and breaking type safety. Principle R3 (Maintainability Over Elegance) supports keeping the working system.

### ADR-002: Content Directory Decision

**Status:** Required before Phase 1
**Question:** Should data/ be renamed to content/?
**Decision:** Keep data/. Do not rename.
**Rationale:** Renaming would break all imports in lib/data.ts and all routes in app/. This is a breaking change with no functional benefit. Principle R8 (Extension is Additive) supports keeping the existing structure.

### ADR-003: Navigation Architecture Decision

**Status:** Required before Phase 6
**Question:** Should _nav.json be replaced with metadata/categories.json-driven navigation?
**Decision:** Keep _nav.json as primary. Add metadata/categories.json as supplementary vocabulary validation.
**Rationale:** _nav.json works perfectly for navigation. Replacing it would require rewriting the entire navigation system. metadata/categories.json should be used for vocabulary validation, not navigation generation.

### ADR-004: Search Index Architecture Decision

**Status:** Required before Phase 5
**Question:** Should search-index.json be a static committed artifact or dynamically generated?
**Decision:** Keep dynamic generation. Add optional static export for external tools.
**Rationale:** Dynamic build ensures search index is always up-to-date with content changes. Static index would require a build step and could become stale. Dynamic approach is better for single-maintainer system.

### ADR-005: Relationships Migration Strategy

**Status:** Required before Phase 3
**Question:** How should alternatives array be migrated to relationships object?
**Decision:** Migration script transforms alternatives → relationships by type. Both coexist during bridge period. alternatives deprecated after migration.
**Rationale:** Structured relationships object provides better query capability. Migration script ensures no data loss. Bridge period allows gradual frontend update.

### ADR-006: Validation Architecture Decision

**Status:** Required before Phase 4
**Question:** Should Zod validation be replaced with 4-layer JSON Schema validation?
**Decision:** Keep Zod as Layer 1. Add Layer 2-4 as post-Zod checks.
**Rationale:** Zod validation works perfectly. Replacing it would require rewriting all validation logic. Layer 2-4 add value without breaking existing system.

### ADR-007: Type Derivation Decision

**Status:** Required before Phase 1
**Question:** Should TypeScript types be manually maintained or derived from Zod?
**Decision:** Keep Zod derivation. Add JSON Schema types as documentation only.
**Rationale:** Zod derivation provides compile-time type safety. Manual maintenance would introduce type errors. JSON Schema types are useful for documentation but not for runtime type safety.

### ADR-008: Configuration Authority Decision

**Status:** Required before Phase 1
**Question:** Should configuration be centralized in aens.config.json?
**Decision:** Yes. Create aens.config.json as single configuration source. Migrate lib/config/registry.ts to read from it.
**Rationale:** Centralized configuration reduces duplication and makes constraints explicit. Aligns with Principle R4 (Configuration is Centralized).

### ADR-009: Metadata Authority Decision

**Status:** Required before Phase 2
**Question:** Should metadata/ directory be created for controlled vocabularies?
**Decision:** Yes. Create metadata/ with tags.json, aliases.json, categories.json.
**Rationale:** Controlled vocabularies prevent drift and ensure consistency. Aligns with Repository Foundation specification.

### ADR-010: BaseMeta Extension Strategy

**Status:** Required before Phase 2
**Question:** Should new BaseMeta fields be added as required or optional?
**Decision:** Add as optional initially. Make required after migration complete.
**Rationale:** Optional fields allow incremental migration without breaking existing content. Required status enforced after all content is migrated.

---

## 9. Roadmap Corrections

### IMPLEMENTATION_ROADMAP.md Corrections

#### Epic 1: Repository Foundation

**RF-001 through RF-004 (metadata/ directory):** VALID - Keep as-is
**RF-005 through RF-006 (schema/ directory):** **BLOCKED** - schema/v2/ should NOT be created. JSON Schema should be added as secondary layer only if needed for interoperability. Zod remains primary.
**RF-007 (aens.config.json):** VALID - Keep as-is
**RF-008 through RF-011 (docs/adr/ and docs/migration/):** VALID - Keep as-is

**Correction:** Remove RF-005 and RF-006. schema/v2/ is not needed if Zod remains primary.

#### Epic 2: BaseMeta Implementation

**RF-020 through RF-035 (BaseMeta fields):** VALID - Keep as-is, but note that these should be added to lib/schemas/meta.ts (Zod), not schema/v2/base.schema.json (JSON Schema).

**Correction:** All BaseMeta field additions should target lib/schemas/meta.ts, not schema/v2/base.schema.json.

#### Epic 3: Schema Layer

**RF-040 through RF-045 (schema/v2/ JSON Schema files):** **BLOCKED** - These should not be created if Zod remains primary. If JSON Schema is needed for interoperability, it should be generated from Zod or manually synchronized, but not as the primary schema.

**Correction:** Remove Epic 3 entirely. Zod schemas in lib/schemas/ remain the primary schema.

#### Epic 4: Type Layer

**RF-050 through RF-056 (types/ synchronization):** **BLOCKED** - types/ should remain derived from Zod. Manual synchronization with JSON Schema is not needed if JSON Schema is not primary.

**Correction:** Remove Epic 4 entirely. types/ remain derived from Zod via z.infer.

#### Epic 5: Validation Layer

**RF-060 (Layer 1 - JSON Schema validation):** **BLOCKED** - Layer 1 should remain Zod validation, not JSON Schema validation.
**RF-061 through RF-064 (Layer 2-4):** VALID - Keep as-is, but implement as post-Zod checks, not replacements.
**RF-065 through RF-067 (audit.js and migrate.js):** VALID - Keep as-is.

**Correction:** RF-060 should be "Keep Layer 1 as Zod validation". RF-061 through RF-064 should be implemented as additions to validate-content.ts, not replacements.

#### Epic 6: Search Layer

**RF-070 through RF-078 (search enhancements):** VALID - Keep as-is, but note that search-index.json should remain dynamically generated, not a static committed artifact.

**Correction:** RF-078 should be "Verify dynamic search index generation continues to work" rather than "Verify search-index.json placement at root".

#### Epic 7: Navigation Layer

**RF-080 through RF-083 (navigation updates):** **PARTIALLY BLOCKED** - _nav.json should remain primary. metadata/categories.json should be added as supplementary vocabulary validation, not as navigation generation source.

**Correction:** RF-081 should be "Add metadata/categories.json as supplementary vocabulary validation" rather than "Synchronize _nav.json with metadata/categories.json". RF-082 and RF-083 should focus on vocabulary validation, not navigation generation.

#### Epic 8: Content Migration

**RF-090 through RF-098 (content migration):** VALID - Keep as-is, but note that content should remain in data/, not content/.

**Correction:** All references to content/ should be changed to data/.

#### Epic 9: Frontend Compatibility

**RF-100 through RF-108 (frontend compatibility):** VALID - Keep as-is.

#### Epic 10: Repository Verification

**RF-110 through RF-126 (verification):** VALID - Keep as-is, but remove references to schema/v2/ and content/.

### Missing Prerequisites

**PREREQUISITE-1:** ADR-001 through ADR-010 must be created before any implementation begins.
**PREREQUISITE-2:** Configuration (aens.config.json) must be created before metadata extension.
**PREREQUISITE-3:** metadata/ directory must be created before validation enhancement.
**PREREQUISITE-4:** BaseMeta extension must be completed before relationships migration.
**PREREQUISITE-5:** Relationships migration must be completed before validation enhancement.
**PREREQUISITE-6:** Validation enhancement must be completed before content migration.

### Wrong Ordering

**ORDERING ISSUE:** Epic 3 (Schema Layer) and Epic 4 (Type Layer) are incorrectly placed before Epic 5 (Validation Layer). If Zod remains primary, there is no need for separate schema and type layers.

**Correction:** Remove Epic 3 and Epic 4 entirely. Proceed directly from BaseMeta extension (Epic 2) to Validation enhancement (Epic 5).

### Tasks Requiring ADR Approval

**ADR-REQUIRED-1:** RF-007 (aens.config.json) requires ADR-008 approval
**ADR-REQUIRED-2:** RF-020 through RF-035 (BaseMeta extension) requires ADR-010 approval
**ADR-REQUIRED-3:** RF-031 (relationships field) requires ADR-005 approval
**ADR-REQUIRED-4:** RF-060 through RF-064 (validation enhancement) requires ADR-006 approval
**ADR-REQUIRED-5:** RF-071 through RF-077 (search enhancement) requires ADR-004 approval
**ADR-REQUIRED-6:** RF-081 through RF-083 (navigation update) requires ADR-003 approval

### Parallel Work Opportunities

**PARALLEL-1:** ADR infrastructure (docs/adr/) can be done in parallel with any phase
**PARALLEL-2:** metadata/ directory creation can be done in parallel with BaseMeta extension
**PARALLEL-3:** Navigation update can be done in parallel with search enhancement

---

## 10. Final Recommended Migration Order

### Phase 0: Architecture Reconciliation

**Goal:** Create ADRs documenting all architectural decisions before implementation.

**Deliverables:**
- ADR-001: Schema Authority Decision
- ADR-002: Content Directory Decision
- ADR-003: Navigation Architecture Decision
- ADR-004: Search Index Architecture Decision
- ADR-005: Relationships Migration Strategy
- ADR-006: Validation Architecture Decision
- ADR-007: Type Derivation Decision
- ADR-008: Configuration Authority Decision
- ADR-009: Metadata Authority Decision
- ADR-010: BaseMeta Extension Strategy

**Exit criteria:** All 10 ADRs created and reviewed.

**Risk level:** LOW (documentation-only)

---

### Phase 1: Configuration

**Goal:** Create aens.config.json as central configuration source.

**Deliverables:**
- aens.config.json with content types, schema versions, size budgets, stability tiers
- Updated lib/config/registry.ts to read from aens.config.json
- Updated scripts to read from aens.config.json
- Removal of hardcoded constants

**Exit criteria:** All configuration reads from aens.config.json. No hardcoded constants remain.

**Risk level:** MEDIUM (configuration changes affect validation and navigation)

---

### Phase 2: Metadata Directory

**Goal:** Create metadata/ directory for controlled vocabularies.

**Deliverables:**
- metadata/tags.json with existing tags extracted from content
- metadata/aliases.json with existing aliases extracted from content
- metadata/categories.json with category definitions
- Updated Layer 4 validation to check tag/alias/category conformance

**Exit criteria:** metadata/ directory created. Validation checks taxonomy conformance.

**Risk level:** LOW (new directory, validation enhancement only)

---

### Phase 3: BaseMeta Extension

**Goal:** Extend BaseMetaSchema with new fields from Repository Foundation specification.

**Deliverables:**
- schema_version field added to lib/schemas/meta.ts (optional initially)
- aliases field added to lib/schemas/meta.ts (optional initially)
- keywords field added to lib/schemas/meta.ts (optional initially)
- status field added to lib/schemas/meta.ts (optional initially)
- deprecated field added to lib/schemas/meta.ts (optional initially)
- stability field added to lib/schemas/meta.ts (optional initially)
- versioning field added to lib/schemas/meta.ts (optional initially)
- relationships field added to lib/schemas/meta.ts (optional initially, coexists with alternatives)
- content_role field added to lib/schemas/meta.ts (optional initially)
- TypeScript types updated via z.infer

**Exit criteria:** All new BaseMeta fields added to Zod schema. TypeScript types updated.

**Risk level:** MEDIUM (schema changes affect all content validation)

---

### Phase 4: Relationships Migration

**Goal:** Transform alternatives array to relationships object.

**Deliverables:**
- Migration script to transform alternatives → relationships
- Migration script run on all content files
- Updated lib/data.ts to use relationships for getRelatedContent()
- Updated components to use relationships
- alternatives field deprecated

**Exit criteria:** All content has relationships populated. Components use relationships. alternatives deprecated.

**Risk level:** HIGH (structural change to all content files)

---

### Phase 5: Validation Enhancement

**Goal:** Add Layer 2-4 validation to existing Zod validation.

**Deliverables:**
- Layer 2 (Constraint validation) reading from aens.config.json
- Layer 3 (Cross-Reference validation) checking relationships integrity
- Layer 4 (Semantic validation) checking status/version consistency, taxonomy conformance
- Updated validate-content.ts to run all 4 layers
- --layer flag added to validate-content.ts for selective validation

**Exit criteria:** validate-content.ts runs all 4 layers. All content passes 4-layer validation.

**Risk level:** HIGH (validation changes affect build pipeline)

---

### Phase 6: Search Enhancement

**Goal:** Extend search index with new fields from Repository Foundation specification.

**Deliverables:**
- buildSearchIndex() extended to extract aliases from content
- buildSearchIndex() extended to extract keywords from content
- buildSearchIndex() extended to extract mental_trigger from models/packages
- buildSearchIndex() extended to extract problem_statement from workflows
- buildSearchIndex() extended to extract error_messages from packages
- buildSearchIndex() extended to filter by status
- SearchBox component updated to handle new fields

**Exit criteria:** Search index includes all new fields. SearchBox handles new fields.

**Risk level:** MEDIUM (search changes affect user experience)

---

### Phase 7: Content Migration

**Goal:** Populate new BaseMeta fields in existing content files.

**Deliverables:**
- Migration script to populate schema_version in all content files
- Migration script to populate aliases in all content files
- Migration script to populate keywords in all content files
- Migration script to populate status in all content files
- Migration script to populate stability in all content files
- Migration script to populate versioning in all content files
- Migration script to populate content_role in all content files
- migration-report.json generated
- review-queue.md populated

**Exit criteria:** All content has new BaseMeta fields populated. migration-report.json generated. review-queue.md populated.

**Risk level:** HIGH (bulk content changes)

---

### Phase 8: Navigation Update

**Goal:** Integrate metadata/categories.json with navigation system.

**Deliverables:**
- build-nav-index.ts updated to read from metadata/categories.json for validation
- Navigation components updated to display categories from metadata/categories.json
- _nav.json files remain primary navigation source

**Exit criteria:** Navigation validates against metadata/categories.json. Categories displayed from metadata/categories.json.

**Risk level:** LOW (navigation enhancement only)

---

### Phase 9: Frontend Compatibility

**Goal:** Ensure all frontend components work with migrated content.

**Deliverables:**
- All routes in app/ verified to work with new content structure
- All components in components/ verified to work with new content structure
- Search verified to work with new search fields
- Navigation verified to work with updated metadata
- Build verified to succeed
- Lint verified to pass

**Exit criteria:** All frontend components work. Build succeeds. Lint passes.

**Risk level:** HIGH (frontend changes affect user experience)

---

### Phase 10: ADR Infrastructure

**Goal:** Document all architectural decisions in ADR format.

**Deliverables:**
- ADR-001 through ADR-010 created in docs/adr/
- Additional ADRs created for any decisions made during migration
- ADR index created

**Exit criteria:** All architectural decisions documented in ADR format.

**Risk level:** LOW (documentation-only)

---

### Phase 11: Final Verification

**Goal:** Perform complete repository audit.

**Deliverables:**
- Schema validation on all content
- Type synchronization check
- Alias uniqueness check
- Relationship integrity check
- Navigation consistency check
- Search index completeness check
- Route coverage check
- Build success check
- Lint success check
- Dead code detection
- Duplicate schema detection
- Broken references check
- Documentation synchronization check

**Exit criteria:** All checks pass. Repository ready for freeze.

**Risk level:** HIGH (final gate before freeze)

---

### Phase 12: Repository Freeze

**Goal:** Mark repository as frozen and merge implementation branch to main.

**Deliverables:**
- Implementation branch merged to main
- Repository marked as frozen in documentation
- Freeze date recorded

**Exit criteria:** Repository frozen. Implementation complete.

**Risk level:** HIGH (final merge)

---

## Summary

The Repository Foundation Specification v1.1 is architecturally sound but cannot be implemented literally without creating parallel systems that violate its own principles. The integration strategy outlined above preserves the working Zod-based validation system, extends it incrementally with new metadata fields, and adds the governance infrastructure (metadata/, aens.config.json, ADRs) without breaking existing functionality.

**Key decisions:**
1. Keep Zod as canonical schema (not JSON Schema)
2. Keep data/ directory (not content/)
3. Keep _nav.json navigation (not metadata/categories.json-driven)
4. Keep dynamic search index generation (not static search-index.json)
5. Add aens.config.json as central configuration
6. Add metadata/ directory for controlled vocabularies
7. Extend BaseMeta with new fields incrementally
8. Migrate alternatives to relationships via script
9. Add Layer 2-4 validation as post-Zod checks
10. Extend search with new fields without changing architecture

This evolutionary approach respects the Repository Foundation's principles while protecting the existing production repository from unnecessary breaking changes.
