# Rebuild Phase Checklist
**Version:** 1.0
**Purpose:** Detailed checklist with acceptance criteria for each rebuild phase
**Governed by:** AENS_REBUILD_MASTER_PLAN.md

---

# Phase 0: Freeze

## Goal
Freeze current repository to enable rollback if needed.

## Checklist

### 0.1 Tag Repository
- [ ] Create git tag `pre-rebuild-v2` on current commit
- [ ] Verify tag is pushed to remote
- [ ] Document tag in migration notes

**Acceptance Criteria:**
- Tag exists in git history
- Tag is accessible from remote
- Tag is documented in `docs/migration/`

---

### 0.2 Create Backup Branch
- [ ] Create branch `backup-pre-rebuild` from current commit
- [ ] Push branch to remote
- [ ] Verify branch matches current working state

**Acceptance Criteria:**
- Branch exists in remote repository
- Branch is identical to current HEAD
- Branch is protected from deletion

---

### 0.3 Create Legacy Branch
- [ ] Create branch `legacy-pre-rebuild` from current commit
- [ ] Push branch to remote
- [ ] Document branch purpose in README

**Acceptance Criteria:**
- Branch exists in remote repository
- Branch is documented as the pre-rebuild reference
- Branch is protected from deletion

---

## Phase 0 Definition of Done
- [ ] Tag `pre-rebuild-v2` exists and is pushed
- [ ] Branch `backup-pre-rebuild` exists and is pushed
- [ ] Branch `legacy-pre-rebuild` exists and is pushed
- [ ] All references documented in `docs/migration/`
- [ ] Repository can be restored to pre-rebuild state via git checkout

---

# Phase 1: Archive

## Goal
Move every replaceable subsystem into `legacy/` without breaking the build.

## Checklist

### 1.1 Create Legacy Directory Structure
- [ ] Create `legacy/` directory
- [ ] Create `legacy/content/` directory
- [ ] Create `legacy/scripts/` directory
- [ ] Create `legacy/schema/` directory
- [ ] Create `legacy/search/` directory
- [ ] Create `legacy/data/` directory
- [ ] Create `legacy/loaders/` directory
- [ ] Add `.gitkeep` to each empty directory

**Acceptance Criteria:**
- All legacy directories exist
- Each directory has `.gitkeep`
- Directory structure matches plan

---

### 1.2 Archive Old Data Loaders
- [ ] Move `lib/data.ts` to `legacy/loaders/data.ts`
- [ ] Move `lib/resources.ts` to `legacy/loaders/resources.ts`
- [ ] Move `lib/route-params.ts` to `legacy/loaders/route-params.ts`
- [ ] Update imports in app routes to point to legacy (temporary)
- [ ] Verify build succeeds

**Acceptance Criteria:**
- Files moved to `legacy/loaders/`
- App routes import from legacy
- Build succeeds
- No runtime errors

---

### 1.3 Archive Old Schemas
- [ ] Move `lib/schemas/` directory to `legacy/schemas/`
- [ ] Update imports in validation script to point to legacy (temporary)
- [ ] Verify validation script runs

**Acceptance Criteria:**
- Directory moved to `legacy/schemas/`
- Validation script imports from legacy
- Validation script runs without errors

---

### 1.4 Archive Old Search Implementation
- [ ] Move `lib/search/` directory to `legacy/search/`
- [ ] Update imports in components to point to legacy (temporary)
- [ ] Verify search component works

**Acceptance Criteria:**
- Directory moved to `legacy/search/`
- Search component imports from legacy
- Search component renders without errors

---

### 1.5 Archive Old Metadata
- [ ] Move `lib/config/registry.ts` to `legacy/config/registry.ts`
- [ ] Update imports to point to legacy (temporary)
- [ ] Verify build succeeds

**Acceptance Criteria:**
- File moved to `legacy/config/`
- Imports updated
- Build succeeds

---

### 1.6 Archive Old Content
- [ ] Copy entire `data/` directory to `legacy/content/`
- [ ] Do NOT delete `data/` yet (needed for Phase 2)
- [ ] Verify copy is complete

**Acceptance Criteria:**
- `legacy/content/` contains complete copy of `data/`
- File counts match
- No data loss

---

### 1.7 Archive Old Scripts
- [ ] Move `scripts/validate-content.ts` to `legacy/scripts/validate-content.ts`
- [ ] Move `scripts/build-nav-index.ts` to `legacy/scripts/build-nav-index.ts`
- [ ] Update any references to point to legacy (temporary)
- [ ] Verify scripts run

**Acceptance Criteria:**
- Scripts moved to `legacy/scripts/`
- Scripts run without errors
- No broken references

---

### 1.8 Create Legacy README
- [ ] Create `legacy/README.md`
- [ ] Document what each legacy subsystem does
- [ ] Document why it was archived
- [ ] Document migration path (if any)

**Acceptance Criteria:**
- `legacy/README.md` exists
- All legacy subsystems documented
- Migration paths documented

---

## Phase 1 Definition of Done
- [ ] All replaceable subsystems moved to `legacy/`
- [ ] Application builds successfully
- [ ] Application runs without errors
- [ ] No production code depends on non-legacy versions
- [ ] `legacy/README.md` documents all archived systems
- [ ] Nothing deleted permanently (only moved)

---

# Phase 2: Foundation

## Goal
Create new directory structure for content, schema, metadata, types, config, and scripts.

## Checklist

### 2.1 Create Content Directory
- [ ] Create `content/` directory
- [ ] Create `content/packages/` directory
- [ ] Create `content/models/` directory
- [ ] Create `content/models/ml/` directory
- [ ] Create `content/models/dl/` directory
- [ ] Create `content/models/llm/` directory
- [ ] Create `content/workflows/` directory
- [ ] Create `content/cheatsheets/` directory
- [ ] Create `content/registry/` directory
- [ ] Add `.gitkeep` to each empty directory

**Acceptance Criteria:**
- All content directories exist
- Each directory has `.gitkeep`
- Structure matches specification

---

### 2.2 Create Schema Directory
- [ ] Create `schema/` directory
- [ ] Create `schema/v2/` directory
- [ ] Add `.gitkeep` to `schema/v2/`

**Acceptance Criteria:**
- `schema/v2/` directory exists
- Directory has `.gitkeep`

---

### 2.3 Create Metadata Directory
- [ ] Create `metadata/` directory
- [ ] Add `.gitkeep` to `metadata/`

**Acceptance Criteria:**
- `metadata/` directory exists
- Directory has `.gitkeep`

---

### 2.4 Create Types Directory
- [ ] Verify `types/` directory exists (already exists)
- [ ] Clear existing types (they will be regenerated)
- [ ] Add `.gitkeep` if empty

**Acceptance Criteria:**
- `types/` directory exists
- Directory is ready for new types

---

### 2.5 Create Config Directory
- [ ] Verify root directory is ready for `aens.config.json`
- [ ] No action needed (config lives at root)

**Acceptance Criteria:**
- Root directory is ready for config file

---

### 2.6 Create Scripts Directory
- [ ] Verify `scripts/` directory exists (already exists)
- [ ] Clear old scripts (already moved to legacy)
- [ ] Add `.gitkeep` if empty

**Acceptance Criteria:**
- `scripts/` directory exists
- Directory is ready for new scripts

---

### 2.7 Create Lib Content Directory
- [ ] Create `lib/content/` directory
- [ ] Create `lib/content/loaders.ts` (empty)
- [ ] Create `lib/content/resolvers.ts` (empty)
- [ ] Create `lib/content/registry.ts` (empty)
- [ ] Create `lib/content/cache.ts` (empty)

**Acceptance Criteria:**
- `lib/content/` directory exists
- All placeholder files exist
- Files are empty (implementation in Phase 8)

---

### 2.8 Create Lib Validation Directory
- [ ] Create `lib/validation/` directory
- [ ] Create `lib/validation/layer1-schema.ts` (empty)
- [ ] Create `lib/validation/layer2-constraints.ts` (empty)
- [ ] Create `lib/validation/layer3-crossref.ts` (empty)
- [ ] Create `lib/validation/layer4-semantic.ts` (empty)

**Acceptance Criteria:**
- `lib/validation/` directory exists
- All placeholder files exist
- Files are empty (implementation in Phase 7)

---

### 2.9 Delete Old Data Directory
- [ ] Delete `data/` directory (now that content/ exists)
- [ ] Verify no imports reference `data/`
- [ ] Verify build succeeds

**Acceptance Criteria:**
- `data/` directory deleted
- No imports reference `data/`
- Build succeeds

---

## Phase 2 Definition of Done
- [ ] `content/` directory structure created
- [ ] `schema/v2/` directory created
- [ ] `metadata/` directory created
- [ ] `types/` directory ready
- [ ] `scripts/` directory ready
- [ ] `lib/content/` directory with placeholder files
- [ ] `lib/validation/` directory with placeholder files
- [ ] Old `data/` directory deleted
- [ ] No functionality implemented (only structure)

---

# Phase 3: Configuration

## Goal
Create `aens.config.json` as central configuration authority.

## Checklist

### 3.1 Create aens.config.json
- [ ] Create `aens.config.json` at repository root
- [ ] Add version field: `"version": "2.0"`
- [ ] Add content_types array: ["package", "model", "workflow", "cheatsheet", "registry"]
- [ ] Add schema_version_mapping object
- [ ] Add size_budgets object
- [ ] Add stability_tiers object
- [ ] Add validation_rules object
- [ ] Add registry_asset_types array

**Acceptance Criteria:**
- `aens.config.json` exists at root
- All required sections present
- JSON is valid
- Structure matches specification

---

### 3.2 Validate Config Schema
- [ ] Create `schema/config.schema.json`
- [ ] Define schema for `aens.config.json`
- [ ] Validate `aens.config.json` against schema
- [ ] Fix any validation errors

**Acceptance Criteria:**
- `schema/config.schema.json` exists
- `aens.config.json` validates successfully
- No schema validation errors

---

### 3.3 Create Config Loader
- [ ] Create `lib/config/loader.ts`
- [ ] Implement `loadConfig()` function
- [ ] Add error handling for missing config
- [ ] Add error handling for invalid JSON
- [ ] Add TypeScript types for config
- [ ] Export config object

**Acceptance Criteria:**
- `lib/config/loader.ts` exists
- `loadConfig()` function works
- Errors are handled gracefully
- TypeScript types are defined
- Config is exported

---

### 3.4 Update Legacy References
- [ ] Update any remaining references to old config in legacy code
- [ ] Ensure legacy code can still read old config format
- [ ] Verify legacy scripts still work

**Acceptance Criteria:**
- Legacy code references updated
- Legacy scripts still run
- No breaking changes to legacy

---

## Phase 3 Definition of Done
- [ ] `aens.config.json` exists at repository root
- [ ] Config matches specification structure
- [ ] Config validates against schema
- [ ] Config loader exists and works
- [ ] Legacy code still references old config correctly
- [ ] No code depends on hardcoded constants

---

# Phase 4: Schema

## Goal
Create JSON Schema 2020-12 files for all content types.

## Checklist

### 4.1 Create Base Schema
- [ ] Create `schema/v2/base.schema.json`
- [ ] Define `$schema`: "https://json-schema.org/draft/2020-12/schema"
- [ ] Define `$id`: "https://aens.dev/schema/v2/base.schema.json"
- [ ] Add all BaseMeta fields
- [ ] Add constraints (maxLength, maxItems)
- [ ] Add required fields array
- [ ] Add field descriptions

**Acceptance Criteria:**
- `schema/v2/base.schema.json` exists
- Schema is valid JSON Schema 2020-12
- All BaseMeta fields defined
- Constraints defined
- Required fields listed
- Descriptions present

---

### 4.2 Create Package Schema
- [ ] Create `schema/v2/package.schema.json`
- [ ] Extend base schema using `$ref`
- [ ] Add package-specific fields
- [ ] Add `common_tasks` with maxItems: 15
- [ ] Add `production_considerations` with maxLength: 300
- [ ] Add `decision_notes` field
- [ ] Add required fields

**Acceptance Criteria:**
- `schema/v2/package.schema.json` exists
- Extends base schema correctly
- Package-specific fields defined
- Size budgets enforced
- Required fields listed

---

### 4.3 Create Model Schema
- [ ] Create `schema/v2/model.schema.json`
- [ ] Extend base schema using `$ref`
- [ ] Add model-specific fields
- [ ] Add `architecture` object
- [ ] Add `evaluation` object
- [ ] Add `production_considerations` with maxLength: 300
- [ ] Add `decision_guide` object
- [ ] Add required fields

**Acceptance Criteria:**
- `schema/v2/model.schema.json` exists
- Extends base schema correctly
- Model-specific fields defined
- Required fields listed

---

### 4.4 Create Workflow Schema
- [ ] Create `schema/v2/workflow.schema.json`
- [ ] Extend base schema using `$ref`
- [ ] Add workflow-specific fields
- [ ] Add `mental_trigger` field (required)
- [ ] Add `entry_points` array
- [ ] Add `prerequisites` object with `confirmed_env`
- [ ] Add `pipeline_failure_patterns` array
- [ ] Add `steps` array with maxItems: 8
- [ ] Add `production_notes` object
- [ ] Add required fields

**Acceptance Criteria:**
- `schema/v2/workflow.schema.json` exists
- Extends base schema correctly
- Workflow-specific fields defined
- Size budgets enforced
- Required fields listed

---

### 4.5 Create Cheatsheet Schema
- [ ] Create `schema/v2/cheatsheet.schema.json`
- [ ] Extend base schema using `$ref`
- [ ] Add cheatsheet-specific fields
- [ ] Add `entries` array with maxItems: 30
- [ ] Add required fields

**Acceptance Criteria:**
- `schema/v2/cheatsheet.schema.json` exists
- Extends base schema correctly
- Cheatsheet-specific fields defined
- Size budgets enforced
- Required fields listed

---

### 4.6 Create Registry Schema
- [ ] Create `schema/v2/registry.schema.json`
- [ ] Extend base schema using `$ref`
- [ ] Add registry-specific fields
- [ ] Add `asset_type` enum (enum: ["model", "dataset", "service"])
- [ ] Add `deployment` object
- [ ] Add `hardware_requirements` object
- [ ] Add required fields

**Acceptance Criteria:**
- `schema/v2/registry.schema.json` exists
- Extends base schema correctly
- Registry-specific fields defined
- Required fields listed

---

### 4.7 Create Metadata Schema
- [ ] Create `schema/v2/metadata.schema.json`
- [ ] Define schema for `tags.json`
- [ ] Define schema for `aliases.json`
- [ ] Define schema for `categories.json`
- [ ] Define schema for `registry.json`
- [ ] Add constraints

**Acceptance Criteria:**
- `schema/v2/metadata.schema.json` exists
- All metadata file schemas defined
- Constraints defined

---

### 4.8 Validate All Schemas
- [ ] Validate each schema file is valid JSON Schema 2020-12
- [ ] Validate all `$ref` references resolve
- [ ] Validate no circular references
- [ ] Validate schema compiles with Ajv

**Acceptance Criteria:**
- All schemas are valid JSON Schema 2020-12
- All references resolve
- No circular references
- Schemas compile with Ajv

---

## Phase 4 Definition of Done
- [ ] `schema/v2/base.schema.json` exists and is valid
- [ ] `schema/v2/package.schema.json` exists and is valid
- [ ] `schema/v2/model.schema.json` exists and is valid
- [ ] `schema/v2/workflow.schema.json` exists and is valid
- [ ] `schema/v2/cheatsheet.schema.json` exists and is valid
- [ ] `schema/v2/registry.schema.json` exists and is valid
- [ ] `schema/v2/metadata.schema.json` exists and is valid
- [ ] All schemas are valid JSON Schema 2020-12
- [ ] All references resolve correctly
- [ ] No renderer implementation (only contracts)

---

# Phase 5: Metadata

## Goal
Create controlled vocabulary files in `metadata/`.

## Checklist

### 5.1 Create tags.json
- [ ] Create `metadata/tags.json`
- [ ] Define structure: `{ "tags": [...] }`
- [ ] Add initial tags from legacy content
- [ ] Extract tags from `legacy/content/`
- [ ] Deduplicate tags
- [ ] Add category field to each tag
- [ ] Validate against metadata schema

**Acceptance Criteria:**
- `metadata/tags.json` exists
- Structure matches schema
- Tags extracted from legacy content
- No duplicates
- Each tag has category
- Validates against schema

---

### 5.2 Create aliases.json
- [ ] Create `metadata/aliases.json`
- [ ] Define structure: `{ "aliases": [...] }`
- [ ] Add initial aliases from legacy content
- [ ] Extract aliases from `legacy/content/`
- [ ] Deduplicate aliases
- [ ] Add canonical_id field to each alias
- [ ] Add type field to each alias
- [ ] Validate against metadata schema

**Acceptance Criteria:**
- `metadata/aliases.json` exists
- Structure matches schema
- Aliases extracted from legacy content
- No duplicates
- Each alias has canonical_id and type
- Validates against schema

---

### 5.3 Create categories.json
- [ ] Create `metadata/categories.json`
- [ ] Define structure: `{ "categories": [...] }`
- [ ] Add categories from legacy navigation
- [ ] Extract categories from `legacy/content/*/_nav.json`
- [ ] Add display_name field
- [ ] Add content_types array
- [ ] Validate against metadata schema

**Acceptance Criteria:**
- `metadata/categories.json` exists
- Structure matches schema
- Categories extracted from legacy
- Each category has display_name and content_types
- Validates against schema

---

### 5.4 Create registry.json
- [ ] Create `metadata/registry.json`
- [ ] Define structure: `{ "ids": [...] }`
- [ ] Add all IDs from legacy content
- [ ] Extract IDs from `legacy/content/`
- [ ] Add type field to each ID
- [ ] Add status field (default: "active")
- [ ] Validate against metadata schema

**Acceptance Criteria:**
- `metadata/registry.json` exists
- Structure matches schema
- IDs extracted from legacy content
- Each ID has type and status
- Validates against schema

---

### 5.5 Validate Metadata Consistency
- [ ] Verify all tags in content are registered
- [ ] Verify all aliases in content are registered
- [ ] Verify all categories in content are registered
- [ ] Verify no ID collisions in registry
- [ ] Verify no alias collisions

**Acceptance Criteria:**
- All content tags registered
- All content aliases registered
- All content categories registered
- No ID collisions
- No alias collisions

---

## Phase 5 Definition of Done
- [ ] `metadata/tags.json` exists and is valid
- [ ] `metadata/aliases.json` exists and is valid
- [ ] `metadata/categories.json` exists and is valid
- [ ] `metadata/registry.json` exists and is valid
- [ ] All metadata extracted from legacy content
- [ ] No duplicates or collisions
- [ ] All files validate against schema

---

# Phase 6: Types

## Goal
Generate TypeScript types from JSON Schema.

## Checklist

### 6.1 Select Type Generation Tool
- [ ] Evaluate `json-schema-to-typescript`
- [ ] Evaluate `typescript-json-schema`
- [ ] Select tool (document decision in ADR)
- [ ] Install tool as dev dependency

**Acceptance Criteria:**
- Tool selected
- Tool installed
- Decision documented in ADR

---

### 6.2 Generate Base Types
- [ ] Run type generator on `schema/v2/base.schema.json`
- [ ] Output to `types/base.ts`
- [ ] Review generated types
- [ ] Add JSDoc documentation
- [ ] Improve type ergonomics if needed

**Acceptance Criteria:**
- `types/base.ts` exists
- Types generated from schema
- JSDoc documentation added
- Types are readable

---

### 6.3 Generate Content Type Types
- [ ] Run type generator on `schema/v2/package.schema.json`
- [ ] Output to `types/package.ts`
- [ ] Run type generator on `schema/v2/model.schema.json`
- [ ] Output to `types/model.ts`
- [ ] Run type generator on `schema/v2/workflow.schema.json`
- [ ] Output to `types/workflow.ts`
- [ ] Run type generator on `schema/v2/cheatsheet.schema.json`
- [ ] Output to `types/cheatsheet.ts`
- [ ] Run type generator on `schema/v2/registry.schema.json`
- [ ] Output to `types/registry.ts`
- [ ] Review all generated types
- [ ] Add JSDoc documentation

**Acceptance Criteria:**
- All content type types generated
- All types in respective files
- JSDoc documentation added
- Types are readable

---

### 6.4 Generate Metadata Types
- [ ] Run type generator on `schema/v2/metadata.schema.json`
- [ ] Output to `types/metadata.ts`
- [ ] Review generated types
- [ ] Add JSDoc documentation

**Acceptance Criteria:**
- `types/metadata.ts` exists
- Types generated from schema
- JSDoc documentation added

---

### 6.5 Generate Config Types
- [ ] Run type generator on `schema/config.schema.json`
- [ ] Output to `types/config.ts`
- [ ] Review generated types
- [ ] Add JSDoc documentation

**Acceptance Criteria:**
- `types/config.ts` exists
- Types generated from schema
- JSDoc documentation added

---

### 6.6 Create Index File
- [ ] Create `types/index.ts`
- [ ] Export all types
- [ ] Export utility types if needed
- [ ] Verify no export conflicts

**Acceptance Criteria:**
- `types/index.ts` exists
- All types exported
- No export conflicts

---

### 6.7 Verify Type Compilation
- [ ] Run TypeScript compiler
- [ ] Fix any type errors
- [ ] Verify no `any` types unless intentional
- [ ] Verify no type assertions unless necessary

**Acceptance Criteria:**
- TypeScript compiles without errors
- No unexpected `any` types
- No unnecessary type assertions

---

## Phase 6 Definition of Done
- [ ] All TypeScript types generated from JSON Schema
- [ ] All types have JSDoc documentation
- [ ] Types are human-readable
- [ ] `types/index.ts` exports all types
- [ ] TypeScript compiles without errors
- [ ] No manual type maintenance (types are derived)

---

# Phase 7: Validation

## Goal
Implement 4-layer validation pipeline.

## Checklist

### 7.1 Implement Layer 1 (Schema Validation)
- [ ] Install Ajv as dependency
- [ ] Create `lib/validation/layer1-schema.ts`
- [ ] Implement schema compilation
- [ ] Implement validation function
- [ ] Add error reporting
- [ ] Add support for all schema files
- [ ] Test with valid content
- [ ] Test with invalid content

**Acceptance Criteria:**
- Layer 1 implementation exists
- Ajv compiles schemas
- Validation function works
- Error reporting is clear
- Valid content passes
- Invalid content fails with clear error

---

### 7.2 Implement Layer 2 (Constraint Validation)
- [ ] Create `lib/validation/layer2-constraints.ts`
- [ ] Implement size budget checks
- [ ] Implement stability tier checks
- [ ] Implement schema version checks
- [ ] Implement content type checks
- [ ] Read constraints from `aens.config.json`
- [ ] Add error reporting
- [ ] Test with content that violates constraints

**Acceptance Criteria:**
- Layer 2 implementation exists
- Size budgets enforced
- Stability tiers checked
- Schema versions validated
- Content types validated
- Config is read correctly
- Violations reported clearly

---

### 7.3 Implement Layer 3 (Cross-Reference Validation)
- [ ] Create `lib/validation/layer3-crossref.ts`
- [ ] Implement ID existence checks
- [ ] Implement ID format validation
- [ ] Implement bidirectional relationship checks
- [ ] Implement self-reference detection
- [ ] Implement circular reference detection
- [ ] Add error reporting
- [ ] Test with broken references

**Acceptance Criteria:**
- Layer 3 implementation exists
- Referenced IDs exist
- ID format validated
- Bidirectional relationships checked
- Self-references detected
- Circular references detected
- Broken references reported clearly

---

### 7.4 Implement Layer 4 (Semantic Validation)
- [ ] Create `lib/validation/layer4-semantic.ts`
- [ ] Implement tag registration checks
- [ ] Implement alias registration checks
- [ ] Implement category validation
- [ ] Implement status consistency checks
- [ ] Implement verification date checks
- [ ] Implement deprecated object presence checks
- [ ] Add error reporting
- [ ] Test with unregistered tags/aliases

**Acceptance Criteria:**
- Layer 4 implementation exists
- Tags are registered
- Aliases are registered
- Categories are valid
- Status is consistent
- Verification dates within cadence
- Deprecated object presence correct
- Violations reported clearly

---

### 7.5 Create Validation Script
- [ ] Create `scripts/validate.js`
- [ ] Implement CLI interface
- [ ] Add --file flag for single file validation
- [ ] Add --all flag for full repository validation
- [ ] Add --layer flag for selective validation
- [ ] Integrate all 4 layers
- [ ] Add summary reporting
- [ ] Add exit codes (0 = success, 1 = error)

**Acceptance Criteria:**
- Validation script exists
- CLI flags work
- Single file validation works
- Full repository validation works
- Selective layer validation works
- Summary is clear
- Exit codes correct

---

### 7.6 Test Validation Pipeline
- [ ] Create test content file (valid)
- [ ] Create test content file (invalid schema)
- [ ] Create test content file (violates constraints)
- [ ] Create test content file (broken references)
- [ ] Create test content file (semantic violations)
- [ ] Run validation on each test file
- [ ] Verify each layer catches expected errors
- [ ] Verify valid content passes all layers

**Acceptance Criteria:**
- Test files created
- Each layer catches expected errors
- Valid content passes all layers
- Error messages are actionable

---

## Phase 7 Definition of Done
- [ ] All 4 validation layers implemented
- [ ] Validation script exists with CLI interface
- [ ] Each layer catches expected errors
- [ ] Valid content passes all layers
- [ ] Error messages are clear and actionable
- [ ] Validation must pass before rendering (enforced by build)

---

# Phase 8: Content Engine

## Goal
Build content loading, resolution, registry, and caching utilities.

## Checklist

### 8.1 Implement Content Loaders
- [ ] Implement `lib/content/loaders.ts`
- [ ] Implement `loadContentFile()` function
- [ ] Implement `loadContentDirectory()` function
- [ ] Implement `loadAllContent()` function
- [ ] Add error handling for missing files
- [ ] Add error handling for invalid JSON
- [ ] Add TypeScript types
- [ ] Test with sample content

**Acceptance Criteria:**
- Loaders implementation exists
- Single file loading works
- Directory loading works
- All content loading works
- Errors handled gracefully
- TypeScript types defined
- Tests pass

---

### 8.2 Implement Content Resolvers
- [ ] Implement `lib/content/resolvers.ts`
- [ ] Implement `resolveById()` function
- [ ] Implement `resolveBySlug()` function
- [ ] Implement `resolveByType()` function
- [ ] Implement `resolveByTag()` function
- [ ] Implement `resolveByAlias()` function
- [ ] Add caching layer
- [ ] Test with sample content

**Acceptance Criteria:**
- Resolvers implementation exists
- ID resolution works
- Slug resolution works
- Type resolution works
- Tag resolution works
- Alias resolution works
- Caching works
- Tests pass

---

### 8.3 Implement Content Registry
- [ ] Implement `lib/content/registry.ts`
- [ ] Implement `registerContent()` function
- [ ] Implement `unregisterContent()` function
- [ ] Implement `getAllIds()` function
- [ ] Implement `checkCollision()` function
- [ ] Integrate with `metadata/registry.json`
- [ ] Test with sample content

**Acceptance Criteria:**
- Registry implementation exists
- Registration works
- Unregistration works
- ID listing works
- Collision detection works
- Integration with metadata works
- Tests pass

---

### 8.4 Implement Content Cache
- [ ] Implement `lib/content/cache.ts`
- [ ] Implement in-memory cache
- [ ] Implement cache invalidation
- [ ] Implement cache warming
- [ ] Add cache statistics
- [ ] Test cache performance

**Acceptance Criteria:**
- Cache implementation exists
- In-memory caching works
- Invalidation works
- Warming works
- Statistics available
- Performance improved

---

### 8.5 Replace Legacy Data Loading
- [ ] Update app routes to use new loaders
- [ ] Update components to use new resolvers
- [ ] Remove legacy imports
- [ ] Verify build succeeds
- [ ] Verify runtime works

**Acceptance Criteria:**
- App routes use new loaders
- Components use new resolvers
- No legacy imports remain
- Build succeeds
- Runtime works

---

## Phase 8 Definition of Done
- [ ] Content loaders implemented
- [ ] Content resolvers implemented
- [ ] Content registry implemented
- [ ] Content cache implemented
- [ ] Legacy data loading replaced
- [ ] Application builds successfully
- [ ] Application runs without errors
- [ ] No UI changes (only backend)

---

# Phase 9: Navigation

## Goal
Generate `_nav.json` files from content.

## Checklist

### 9.1 Implement Navigation Generator
- [ ] Create `scripts/build-nav.js`
- [ ] Implement content scanning
- [ ] Implement navigation item extraction
- [ ] Implement category assignment
- [ ] Implement `_nav.json` generation
- [ ] Add validation against `metadata/categories.json`
- [ ] Test with sample content

**Acceptance Criteria:**
- Navigation generator exists
- Content scanning works
- Navigation extraction works
- Category assignment works
- `_nav.json` generation works
- Validation against metadata works
- Tests pass

---

### 9.2 Generate Navigation for All Types
- [ ] Generate `content/packages/_nav.json`
- [ ] Generate `content/models/_nav.json`
- [ ] Generate `content/models/ml/_nav.json`
- [ ] Generate `content/models/dl/_nav.json`
- [ ] Generate `content/models/llm/_nav.json`
- [ ] Generate `content/workflows/_nav.json`
- [ ] Generate `content/cheatsheets/_nav.json`
- [ ] Verify all files generated

**Acceptance Criteria:**
- All `_nav.json` files generated
- Files are valid JSON
- Files contain expected content
- Categories match metadata

---

### 9.3 Update Navigation Components
- [ ] Update Sidebar component to read new `_nav.json`
- [ ] Update navigation logic
- [ ] Verify navigation works
- [ ] Verify categories display correctly

**Acceptance Criteria:**
- Sidebar reads new `_nav.json`
- Navigation works
- Categories display correctly
- No broken links

---

### 9.4 Add to Build Process
- [ ] Add navigation generation to build script
- [ ] Add pre-commit hook to regenerate on content change
- [ ] Verify build process works
- [ ] Verify pre-commit hook works

**Acceptance Criteria:**
- Build process regenerates navigation
- Pre-commit hook regenerates navigation
- Build succeeds
- Hook executes correctly

---

## Phase 9 Definition of Done
- [ ] Navigation generator implemented
- [ ] All `_nav.json` files generated
- [ ] Navigation components updated
- [ ] Navigation works correctly
- [ ] Navigation generation in build process
- [ ] Pre-commit hook configured

---

# Phase 10: Search

## Goal
Generate `search-index.json` and build search engine.

## Checklist

### 10.1 Implement Search Index Generator
- [ ] Create `scripts/build-search-index.js`
- [ ] Implement content scanning
- [ ] Implement field extraction (title, aliases, tags, description, keywords)
- [ ] Implement search entry creation
- [ ] Implement `search-index.json` generation
- [ ] Add version and timestamp
- [ ] Test with sample content

**Acceptance Criteria:**
- Search index generator exists
- Content scanning works
- Field extraction works
- Search entry creation works
- `search-index.json` generation works
- Version and timestamp added
- Tests pass

---

### 10.2 Generate Search Index
- [ ] Run search index generator
- [ ] Verify `search-index.json` created
- [ ] Verify index contains all content
- [ ] Verify all fields indexed
- [ ] Verify JSON is valid

**Acceptance Criteria:**
- `search-index.json` created
- All content indexed
- All fields present
- JSON is valid

---

### 10.3 Update Search Engine
- [ ] Update `lib/search/engine.ts` to read from `search-index.json`
- [ ] Remove dynamic generation logic
- [ ] Verify search works
- [ ] Verify search performance

**Acceptance Criteria:**
- Search engine reads static index
- Dynamic generation removed
- Search works
- Search performance acceptable

---

### 10.4 Update Search Components
- [ ] Update SearchBox component to use new search engine
- [ ] Verify search UI works
- [ ] Verify search results display correctly

**Acceptance Criteria:**
- SearchBox uses new engine
- Search UI works
- Results display correctly

---

### 10.5 Add to Build Process
- [ ] Add search index generation to build script
- [ ] Add pre-commit hook to regenerate on content change
- [ ] Verify build process works
- [ ] Verify pre-commit hook works

**Acceptance Criteria:**
- Build process regenerates search index
- Pre-commit hook regenerates search index
- Build succeeds
- Hook executes correctly

---

### 10.6 Commit search-index.json
- [ ] Add `search-index.json` to git
- [ ] Verify it's tracked
- [ ] Verify it's not in .gitignore

**Acceptance Criteria:**
- `search-index.json` in git
- File is tracked
- File not ignored

---

## Phase 10 Definition of Done
- [ ] Search index generator implemented
- [ ] `search-index.json` generated
- [ ] Search engine updated
- [ ] Search components updated
- [ ] Search works correctly
- [ ] Search index generation in build process
- [ ] Pre-commit hook configured
- [ ] `search-index.json` committed to git

---

# Phase 11: Renderer Integration

## Goal
Connect UI, search, navigation, and content engine.

## Checklist

### 11.1 Update App Routes
- [ ] Update `app/packages/[id]/page.tsx` to use new content engine
- [ ] Update `app/models/[category]/[id]/page.tsx` to use new content engine
- [ ] Update `app/workflows/[id]/page.tsx` to use new content engine
- [ ] Update `app/cheatsheets/[id]/page.tsx` to use new content engine
- [ ] Update `app/registry/[task]/page.tsx` to use new content engine
- [ ] Verify all routes work

**Acceptance Criteria:**
- All routes use new content engine
- All routes render correctly
- No 404 errors
- No runtime errors

---

### 11.2 Update Shared Components
- [ ] Update AlternativesList to use relationships
- [ ] Update Breadcrumbs to use new navigation
- [ ] Update any other content-dependent components
- [ ] Verify components work

**Acceptance Criteria:**
- Components use new data structures
- Components render correctly
- No broken references

---

### 11.3 Remove Legacy Dependencies
- [ ] Remove all imports from `legacy/` in production code
- [ ] Verify no production code depends on legacy
- [ ] Verify build succeeds
- [ ] Verify runtime works

**Acceptance Criteria:**
- No legacy imports in production code
- Build succeeds
- Runtime works

---

### 11.4 End-to-End Testing
- [ ] Test navigation from home page
- [ ] Test search functionality
- [ ] Test content page rendering
- [ ] Test cross-reference links
- [ ] Test all content types
- [ ] Verify UI/UX consistency with pre-rebuild

**Acceptance Criteria:**
- Navigation works
- Search works
- Content pages render
- Cross-references work
- All content types work
- UI/UX visually consistent

---

## Phase 11 Definition of Done
- [ ] All app routes use new content engine
- [ ] All shared components updated
- [ ] No production code depends on `legacy/`
- [ ] Application builds successfully
- [ ] Application runs without errors
- [ ] End-to-end testing passes
- [ ] UI/UX visually consistent with pre-rebuild

---

# Phase 12: Content Recreation

## Goal
Recreate all content using new architecture.

## Checklist

### 12.1 Migrate Package Content
- [ ] Migrate packages from `legacy/content/packages/` to `content/packages/`
- [ ] Update schema version to "2.0"
- [ ] Add missing BaseMeta fields
- [ ] Convert alternatives to relationships
- [ ] Add tags from metadata
- [ ] Add aliases from metadata
- [ ] Validate each package
- [ ] Fix validation errors

**Acceptance Criteria:**
- All packages migrated
- Schema version updated
- BaseMeta fields complete
- Relationships converted
- Tags registered
- Aliases registered
- All packages validate

---

### 12.2 Migrate Model Content
- [ ] Migrate models from `legacy/content/models/` to `content/models/`
- [ ] Update schema version to "2.0"
- [ ] Add missing BaseMeta fields
- [ ] Convert alternatives to relationships
- [ ] Add tags from metadata
- [ ] Add aliases from metadata
- [ ] Validate each model
- [ ] Fix validation errors

**Acceptance Criteria:**
- All models migrated
- Schema version updated
- BaseMeta fields complete
- Relationships converted
- Tags registered
- Aliases registered
- All models validate

---

### 12.3 Migrate Workflow Content
- [ ] Migrate workflows from `legacy/content/workflows/` to `content/workflows/`
- [ ] Update schema version to "2.0"
- [ ] Add missing BaseMeta fields
- [ ] Add mental_trigger field
- [ ] Add confirmed_env block
- [ ] Add pipeline_failure_patterns
- [ ] Convert alternatives to relationships
- [ ] Add tags from metadata
- [ ] Add aliases from metadata
- [ ] Validate each workflow
- [ ] Fix validation errors

**Acceptance Criteria:**
- All workflows migrated
- Schema version updated
- BaseMeta fields complete
- mental_trigger added
- confirmed_env added
- pipeline_failure_patterns added
- Relationships converted
- Tags registered
- Aliases registered
- All workflows validate

---

### 12.4 Migrate Cheatsheet Content
- [ ] Migrate cheatsheets from `legacy/content/cheatsheets/` to `content/cheatsheets/`
- [ ] Update schema version to "2.0"
- [ ] Add missing BaseMeta fields
- [ ] Convert alternatives to relationships
- [ ] Add tags from metadata
- [ ] Add aliases from metadata
- [ ] Validate each cheatsheet
- [ ] Fix validation errors

**Acceptance Criteria:**
- All cheatsheets migrated
- Schema version updated
- BaseMeta fields complete
- Relationships converted
- Tags registered
- Aliases registered
- All cheatsheets validate

---

### 12.5 Migrate Registry Content
- [ ] Migrate registry from `legacy/content/registry/` to `content/registry/`
- [ ] Update schema version to "2.0"
- [ ] Add missing BaseMeta fields
- [ ] Convert alternatives to relationships
- [ ] Add tags from metadata
- [ ] Add aliases from metadata
- [ ] Validate each registry entry
- [ ] Fix validation errors

**Acceptance Criteria:**
- All registry entries migrated
- Schema version updated
- BaseMeta fields complete
- Relationships converted
- Tags registered
- Aliases registered
- All registry entries validate

---

### 12.6 Regenerate Navigation
- [ ] Run navigation generator
- [ ] Verify all `_nav.json` files updated
- [ ] Verify navigation works

**Acceptance Criteria:**
- Navigation regenerated
- All `_nav.json` files updated
- Navigation works

---

### 12.7 Regenerate Search Index
- [ ] Run search index generator
- [ ] Verify `search-index.json` updated
- [ ] Verify search works

**Acceptance Criteria:**
- Search index regenerated
- `search-index.json` updated
- Search works

---

## Phase 12 Definition of Done
- [ ] All content migrated to new architecture
- [ ] All content validates successfully
- [ ] All relationships converted
- [ ] All tags and aliases registered
- [ ] Navigation regenerated
- [ ] Search index regenerated
- [ ] Application builds successfully
- [ ] Application runs without errors

---

# Phase 13: Quality Audit

## Goal
Run comprehensive quality checks.

## Checklist

### 13.1 Validation Audit
- [ ] Run full repository validation (`scripts/validate.js --all`)
- [ ] Verify no validation errors
- [ ] Fix any errors found
- [ ] Re-run validation until clean

**Acceptance Criteria:**
- Validation passes with zero errors
- All content validates
- No warnings (unless acceptable)

---

### 13.2 Search Audit
- [ ] Verify all content is searchable
- [ ] Test search for each content type
- [ ] Test search by title
- [ ] Test search by alias
- [ ] Test search by tag
- [ ] Test search by keyword
- [ ] Fix any search issues

**Acceptance Criteria:**
- All content searchable
- Search by title works
- Search by alias works
- Search by tag works
- Search by keyword works
- No missing content in search

---

### 13.3 Broken Link Audit
- [ ] Run link checker on all content
- [ ] Verify all external links resolve
- [ ] Verify all internal references resolve
- [ ] Fix broken links
- [ ] Re-run audit until clean

**Acceptance Criteria:**
- No broken external links
- No broken internal references
- All relationships resolve

---

### 13.4 Relationship Audit
- [ ] Verify all bidirectional relationships
- [ ] Verify no self-references
- [ ] Verify no circular references
- [ ] Verify all referenced IDs exist
- [ ] Fix any relationship issues
- [ ] Re-run audit until clean

**Acceptance Criteria:**
- All relationships bidirectional
- No self-references
- No circular references
- All referenced IDs exist

---

### 13.5 Schema Audit
- [ ] Verify all schemas are valid JSON Schema 2020-12
- [ ] Verify all schemas compile with Ajv
- [ ] Verify all references resolve
- [ ] Verify no circular schema references
- [ ] Fix any schema issues

**Acceptance Criteria:**
- All schemas valid
- All schemas compile
- All references resolve
- No circular references

---

### 13.6 Performance Audit
- [ ] Measure search index generation time
- [ ] Measure navigation generation time
- [ ] Measure validation time
- [ ] Measure page load time
- [ ] Verify performance is acceptable
- [ ] Optimize if needed

**Acceptance Criteria:**
- Search index generation < 5 seconds
- Navigation generation < 2 seconds
- Validation < 10 seconds
- Page load time < 2 seconds

---

### 13.7 Repository Audit
- [ ] Verify no production code depends on `legacy/`
- [ ] Verify no hardcoded constants
- [ ] Verify all configuration in `aens.config.json`
- [ ] Verify all metadata in `metadata/`
- [ ] Verify all schemas in `schema/v2/`
- [ ] Verify all types derived from schemas
- [ ] Fix any violations

**Acceptance Criteria:**
- No legacy dependencies in production
- No hardcoded constants
- All config centralized
- All metadata in metadata/
- All schemas in schema/v2/
- All types derived

---

### 13.8 UI/UX Consistency Audit
- [ ] Compare pre-rebuild screenshots with current
- [ ] Verify visual consistency
- [ ] Verify navigation behavior
- [ ] Verify search behavior
- [ ] Verify component behavior
- [ ] Fix any inconsistencies

**Acceptance Criteria:**
- UI visually consistent
- Navigation behavior consistent
- Search behavior consistent
- Component behavior consistent

---

## Phase 13 Definition of Done
- [ ] Validation audit passes (zero errors)
- [ ] Search audit passes
- [ ] Broken link audit passes
- [ ] Relationship audit passes
- [ ] Schema audit passes
- [ ] Performance audit passes
- [ ] Repository audit passes
- [ ] UI/UX consistency audit passes

---

# Final Definition of Done

The rebuild is complete only if:

- [ ] No production code depends on `legacy/`
- [ ] Every content file validates successfully
- [ ] Every relationship resolves correctly
- [ ] Search index is generated successfully
- [ ] Navigation is generated successfully
- [ ] All quality checks pass
- [ ] The UI/UX remains visually consistent with the pre-rebuild application
- [ ] All 13 phases are complete
- [ ] All acceptance criteria are met
- [ ] All ADRs are documented
- [ ] All documentation is updated

---

# Phase Transition Rules

## When to Move to Next Phase

1. **Current phase is complete** - All checklist items checked
2. **Definition of Done met** - All acceptance criteria satisfied
3. **No blocking issues** - No errors or warnings that prevent progress
4. **Documentation updated** - Any changes documented in ADRs

## When to Pause

1. **Blocking error** - Error that prevents completion
2. **Architecture question** - Unclear about specification
3. **Risk identified** - Potential issue that needs review
4. **User intervention needed** - Decision required from user

## When to Roll Back

1. **Critical failure** - Cannot proceed without breaking system
2. **Specification violation** - Implementation violates specification
3. **Unacceptable risk** - Risk too high to continue
4. **User decision** - User decides to roll back

---

# Notes

- Each phase must finish completely before moving to the next
- No overlapping implementation
- No partial migration
- No hybrid architecture
- Follow AI_EXECUTION_PROTOCOL.md for all AI-assisted work
- Document all decisions in ADRs
- Keep specification updated if architecture changes
