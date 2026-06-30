# AENS Repository Foundation v2 — Architecture Decision Review
**Status:** Second Pass Review
**Created:** 2026-06-30
**Reviewer:** Principal Architect Review
**Scope:** Critical re-evaluation of INTEGRATION_ARCHITECTURE.md recommendations

---

# Executive Summary

The INTEGRATION_ARCHITECTURE.md document was written with a bias toward preserving the existing implementation. While this is a reasonable instinct for operational continuity, it fails to optimize for the repository's 5-10 year lifespan. Several recommendations in that document are driven primarily by "avoiding work" rather than building the best long-term architecture.

**Critical finding:** The Repository Foundation Specification is architecturally superior to the current implementation in several key areas. The integration strategy should be more aggressive in adopting the specification's architecture, not less.

**Key reversals from INTEGRATION_ARCHITECTURE.md:**
1. **Schema Authority:** Should migrate to JSON Schema as canonical, not keep Zod
2. **Content Directory:** Should migrate to `content/`, not keep `data/`
3. **Navigation:** Should migrate to metadata-driven, not keep `_nav.json` as primary
4. **Search Index:** Should be static committed artifact, not dynamic generation
5. **Type Derivation:** Should be parallel maintenance, not Zod-derived

**Key acceptances from INTEGRATION_ARCHITECTURE.md:**
1. **Configuration:** aens.config.json as central authority is correct
2. **Metadata Directory:** metadata/ as controlled vocabulary is correct
3. **Relationships:** Structured relationships object is correct
4. **Validation:** 4-layer validation architecture is correct

**Overall assessment:** The Repository Foundation Specification v1.1 should be implemented more faithfully than INTEGRATION_ARCHITECTURE.md recommends. The migration pain is justified by the long-term architectural benefits.

---

# Decisions Reviewed

## Decision 1: Schema Authority

### Current Implementation
- **Authority:** Zod schemas in `lib/schemas/*.ts`
- **Validation:** Zod.safeParse() in `scripts/validate-content.ts`
- **Type Derivation:** TypeScript types derived via `z.infer<typeof Schema>`
- **Synchronization:** Automatic (types are re-exported inferences)

### Specification
- **Authority:** JSON Schema 2020-12 in `schema/v2/*.json`
- **Validation:** Ajv or equivalent JSON Schema validator
- **Type Derivation:** Parallel manual maintenance in `types/*.ts`
- **Synchronization:** Manual (types kept in sync with schemas)

### INTEGRATION_ARCHITECTURE Recommendation
Keep Zod as canonical. Add JSON Schema as secondary layer for interoperability only.

### Critical Analysis

**Benefits of Current (Zod) Approach:**
- Automatic type derivation guarantees type safety
- Single source of truth (Zod schema)
- No manual synchronization burden
- Excellent TypeScript integration
- Familiar to current maintainer

**Benefits of Specification (JSON Schema) Approach:**
- Industry standard with long-term support horizon
- Language-agnostic (can be used by non-TypeScript tools)
- Better tooling ecosystem for validation
- Schema can be consumed by external systems
- More expressive for complex constraints
- Future-proof for AI-assisted content generation
- Better documentation for non-TypeScript contributors

**Long-term Maintenance Cost:**
- **Zod:** Low maintenance burden, but limits future tooling options
- **JSON Schema:** Higher maintenance burden (manual type sync), but enables broader ecosystem

**Migration Cost:**
- **Zod → JSON Schema:** High. Requires rewriting all validation logic, creating JSON Schema files, establishing type synchronization process
- **Keep Zod:** Low. No migration required

**Future Extensibility:**
- **Zod:** Limited to TypeScript ecosystem. Cannot be used by Python tools, Rust validators, or external systems
- **JSON Schema:** Can be consumed by any language. Enables external validation tools, AI content generators, cross-language tooling

**Complexity:**
- **Zod:** Simple, single-system
- **JSON Schema:** More complex, requires synchronization discipline

**Risk:**
- **Zod:** Risk of ecosystem lock-in. If TypeScript/Zod decline, migration becomes harder
- **JSON Schema:** Risk of type drift if synchronization discipline fails

### Recommendation

**REVERSE INTEGRATION_ARCHITECTURE.** Migrate to JSON Schema as canonical authority.

**Rationale:**
1. **Repository longevity:** This is a 5-10 year system. JSON Schema 2020-12 is an industry standard with a long support horizon. Zod is a library that may evolve or decline.
2. **AI-assisted content generation:** Future AI tools will need to validate content against schemas. JSON Schema is the universal language for this. Zod is TypeScript-specific.
3. **Ecosystem compatibility:** External tools (Python validators, Rust processors, documentation generators) can consume JSON Schema. They cannot consume Zod.
4. **Single-maintainer sustainability:** While manual type synchronization adds burden, it's a disciplined process that scales. The alternative (Zod lock-in) creates technical debt that becomes harder to pay off over time.
5. **Principle R2 compliance:** The Repository Foundation's "Schema is the Contract" principle is violated by keeping Zod as canonical. JSON Schema is the actual contract; Zod is an implementation detail.

**Migration Strategy:**
1. Create `schema/v2/` with JSON Schema 2020-12 files
2. Keep Zod schemas temporarily as TypeScript convenience layer
3. Generate TypeScript types from JSON Schema using a tool (e.g., json-schema-to-typescript)
4. Migrate validation to Ajv
5. Deprecate Zod schemas after validation is confirmed
6. Establish manual type sync discipline for any hand-edited types

**Confidence:** HIGH (85%)

---

## Decision 2: Content Directory

### Current Implementation
- **Location:** `data/`
- **Path resolution:** `path.join(process.cwd(), 'data', ...)`
- **Frontend coupling:** All routes import from `@/lib/data` which hardcodes `data/`

### Specification
- **Location:** `content/`
- **Path resolution:** `path.join(process.cwd(), 'content', ...)`
- **Rationale:** Semantic clarity, standard convention

### INTEGRATION_ARCHITECTURE Recommendation
Keep `data/`. Rename is unnecessary breaking change with no functional benefit.

### Critical Analysis

**Benefits of Current (data/) Approach:**
- No breaking changes required
- No import updates needed
- Familiar to current maintainer
- Works correctly

**Benefits of Specification (content/) Approach:**
- Semantic clarity: `content/` describes what lives there
- Industry standard: most content systems use `content/`
- Better for new contributors: self-documenting
- Aligns with Repository Foundation specification
- Future-proof: if the repository is forked or shared, `content/` is expected

**Long-term Maintenance Cost:**
- **data/:** No cost, but creates cognitive dissonance (why is content in `data/`?)
- **content/:** One-time migration cost, then zero cost

**Migration Cost:**
- **data/ → content/:** Medium. Requires updating `lib/data.ts` (607 lines), all route imports, documentation references
- **Keep data/:** Zero

**Future Extensibility:**
- **data/:** No impact
- **content/:** No impact, but better for external tooling expectations

**Complexity:**
- **data/:** No complexity
- **content/:** One-time complexity during migration

**Risk:**
- **data/:** Risk of confusion for new contributors
- **content/:** Risk of missing an import reference during migration

### Recommendation

**REVERSE INTEGRATION_ARCHITECTURE.** Migrate to `content/`.

**Rationale:**
1. **Semantic clarity:** `content/` is self-documenting. `data/` is ambiguous (could be database dumps, test data, etc.)
2. **Repository longevity:** Over 5-10 years, this repository may have multiple maintainainers. `content/` is the expected convention.
3. **Migration cost is acceptable:** This is a one-time find-replace operation. The risk is low and the benefit is permanent.
4. **Specification alignment:** The Repository Foundation specified `content/` for good reasons. Ignoring it creates a permanent divergence.
5. **Principle R1 compliance:** "One Source, Many References" - the specification is the source; the implementation should reference it, not diverge.

**Migration Strategy:**
1. Rename `data/` to `content/`
2. Update `lib/data.ts` to use `content/`
3. Global find-replace for imports and references
4. Run build to verify no broken references
5. Update documentation

**Confidence:** MEDIUM (70%)

---

## Decision 3: Navigation Architecture

### Current Implementation
- **Primary:** `_nav.json` index files in each content directory
- **Generation:** `scripts/build-nav-index.ts` generates these from content
- **Consumption:** `lib/data.ts` reads `_nav.json` for navigation
- **Authority:** Generated files are the navigation source

### Specification
- **Primary:** `metadata/categories.json` as category definitions
- **Generation:** Navigation derived from content + metadata
- **Consumption:** Navigation components read from metadata
- **Authority:** `metadata/categories.json` is authoritative

### INTEGRATION_ARCHITECTURE Recommendation
Keep `_nav.json` as primary. Add `metadata/categories.json` as supplementary vocabulary validation only.

### Critical Analysis

**Benefits of Current (_nav.json) Approach:**
- Simple, file-per-directory structure
- No cross-directory dependencies
- Easy to understand
- Works correctly

**Benefits of Specification (metadata-driven) Approach:**
- Single source of truth for categories
- Categories can be defined once, reused across types
- Better for category-level operations (filtering, grouping)
- Enables category-level metadata (descriptions, icons)
- Aligns with "metadata is authoritative" principle
- Better for AI-assisted content generation (AI can read categories from one place)

**Long-term Maintenance Cost:**
- **_nav.json:** Low cost, but category definitions are scattered across multiple files
- **metadata-driven:** Low cost, category definitions centralized

**Migration Cost:**
- **_nav.json → metadata-driven:** High. Requires rewriting navigation generation, updating all navigation components, restructuring category data
- **Keep _nav.json:** Low

**Future Extensibility:**
- **_nav.json:** Limited. Adding category metadata requires touching multiple files
- **metadata-driven:** High. Category metadata can be added in one place

**Complexity:**
- **_nav.json:** Simple
- **metadata-driven:** More complex, requires understanding of metadata system

**Risk:**
- **_nav.json:** Risk of category inconsistency across directories
- **metadata-driven:** Risk of breaking navigation if metadata is incorrect

### Recommendation

**ACCEPT INTEGRATION_ARCHITECTURE.** Keep `_nav.json` as primary navigation mechanism.

**Rationale:**
1. **Principle R3 compliance:** "Maintainability Over Elegance." The current `_nav.json` system works perfectly and is simple. The metadata-driven approach adds complexity without clear functional benefit for navigation.
2. **Migration cost is unjustified:** The navigation system works. Rewriting it would be high-risk, low-reward.
3. **Hybrid approach is optimal:** Use `metadata/categories.json` for vocabulary validation and category-level metadata, but keep `_nav.json` for actual navigation generation. This gives the benefits of both.
4. **Single-maintainer sustainability:** The current system is easier to understand and maintain. The metadata-driven approach requires understanding the entire metadata system to make navigation changes.

**Refined Strategy:**
- Keep `_nav.json` as primary navigation source
- Add `metadata/categories.json` for category definitions and validation
- Update `build-nav-index.ts` to validate categories against `metadata/categories.json`
- Use `metadata/categories.json` for category-level metadata (descriptions, icons)
- Navigation components continue to read from `_nav.json`

**Confidence:** HIGH (80%)

---

## Decision 4: Search Index Architecture

### Current Implementation
- **Generation:** Dynamic build in `lib/search.ts` at runtime
- **Storage:** In-memory (React cache)
- **Authority:** Generated from content on demand
- **Commitment:** Not committed to git

### Specification
- **Generation:** Generated by `scripts/search-index.js`
- **Storage:** `search-index.json` at repository root
- **Authority:** Static committed artifact
- **Commitment:** Committed to git (or .gitignored if regenerated at build time)

### INTEGRATION_ARCHITECTURE Recommendation
Keep dynamic generation. Add optional static export for external tools.

### Critical Analysis

**Benefits of Current (Dynamic) Approach:**
- Always up-to-date with content changes
- No build step required
- No stale index risk
- Simple for development

**Benefits of Specification (Static) Approach:**
- Build-time validation of search index
- Can be committed for version control
- Enables external tools to consume search index
- Faster runtime (no generation overhead)
- Better for CI/CD (search index is an artifact)
- Enables search index auditing
- Better for static site generation (if ever needed)

**Long-term Maintenance Cost:**
- **Dynamic:** Low cost, but runtime generation overhead
- **Static:** Low cost, requires build step discipline

**Migration Cost:**
- **Dynamic → Static:** Low. Requires extracting generation logic to script, adding to build process
- **Keep Dynamic:** Zero

**Future Extensibility:**
- **Dynamic:** Limited. Cannot be consumed by external tools
- **Static:** High. Can be consumed by external search systems, AI tools, documentation generators

**Complexity:**
- **Dynamic:** Simple
- **Static:** Slightly more complex (requires build step)

**Risk:**
- **Dynamic:** Risk of stale index if cache invalidation fails
- **Static:** Risk of stale index if build step is forgotten

### Recommendation

**REVERSE INTEGRATION_ARCHITECTURE.** Migrate to static `search-index.json` as committed artifact.

**Rationale:**
1. **Repository longevity:** Over 5-10 years, external tools may need to consume the search index. A static committed artifact enables this.
2. **Build-time validation:** Generating the index at build time catches errors before deployment. Dynamic generation defers error discovery to runtime.
3. **CI/CD best practices:** The search index is a build artifact. It should be generated in the build process, not at runtime.
4. **Performance:** Static index is faster than dynamic generation. For a single-maintainer system, this matters.
5. **Auditability:** A committed search index can be audited for changes. A dynamic index cannot.
6. **Specification alignment:** The Repository Foundation specified static generation for good reasons.

**Migration Strategy:**
1. Extract search index generation logic from `lib/search.ts` to `scripts/search-index.js`
2. Add `search-index.json` to git
3. Update build process to regenerate `search-index.json` when content changes
4. Update `lib/search.ts` to read from `search-index.json` instead of generating
5. Add pre-commit hook to regenerate `search-index.json` if content changed

**Confidence:** MEDIUM-HIGH (75%)

---

## Decision 5: Type Derivation

### Current Implementation
- **Derivation:** TypeScript types derived from Zod via `z.infer<typeof Schema>`
- **Synchronization:** Automatic
- **Authority:** Zod schema is source of truth

### Specification
- **Derivation:** Manual parallel maintenance in `types/*.ts`
- **Synchronization:** Manual discipline
- **Authority:** JSON Schema is source of truth, types kept in sync

### INTEGRATION_ARCHITECTURE Recommendation
Keep Zod derivation. Add JSON Schema types as documentation only.

### Critical Analysis

**Note:** This decision is dependent on Decision 1 (Schema Authority). If we migrate to JSON Schema as canonical (as recommended above), then type derivation must change.

**Assuming JSON Schema as canonical:**

**Benefits of Manual Parallel Maintenance:**
- Types can be more readable than auto-generated
- Types can include JSDoc documentation
- Types can be optimized for TypeScript ergonomics
- No build-time dependency on code generation tools
- Types can deviate from schema when appropriate (with documentation)

**Benefits of Auto-Generation:**
- Zero synchronization burden
- Guaranteed type safety
- Single source of truth
- Less manual work

**Long-term Maintenance Cost:**
- **Manual:** Medium burden, but enables better types
- **Auto-generated:** Low burden, but types may be less readable

**Migration Cost:**
- **Manual:** Requires establishing sync discipline
- **Auto-generated:** Requires selecting and configuring generation tool

**Future Extensibility:**
- **Manual:** High flexibility
- **Auto-generated:** Limited by generation tool capabilities

**Complexity:**
- **Manual:** Requires discipline
- **Auto-generated:** Requires tooling

**Risk:**
- **Manual:** Risk of type drift
- **Auto-generated:** Risk of tool lock-in

### Recommendation

**ACCEPT Specification (with modification).** Use manual parallel maintenance, but with tool-assisted synchronization.

**Rationale:**
1. **TypeScript as documentation:** The Repository Foundation explicitly states that `types/` serves as human-readable documentation. Auto-generated types are often not human-readable.
2. **JSDoc integration:** Manual types can include JSDoc comments that explain field purposes. Auto-generated types cannot.
3. **Flexibility:** Manual maintenance allows types to be optimized for TypeScript ergonomics (e.g., using discriminated unions, utility types) that may not match the JSON Schema exactly.
4. **Tool-assisted sync:** Use a tool like `json-schema-to-typescript` to generate initial types, then hand-edit for documentation and ergonomics. Establish a sync discipline (e.g., run generator after schema changes, then review and edit).
5. **Single-maintainer sustainability:** Manual sync is a disciplined process that scales. The alternative (auto-generation only) creates types that may be less useful for documentation.

**Migration Strategy:**
1. Select a JSON Schema to TypeScript generator (e.g., json-schema-to-typescript)
2. Generate initial types from `schema/v2/*.json`
3. Hand-edit types to add JSDoc documentation and improve ergonomics
4. Establish sync discipline: run generator after schema changes, then review and edit
5. Document the sync process in ADR

**Confidence:** MEDIUM (65%)

---

## Decision 6: BaseMeta Extension

### Current Implementation
- **Fields:** `created_at`, `updated_at`, `sources`, `github_repo`
- **Location:** `lib/schemas/meta.ts`
- **Structure:** Zod object

### Specification
- **Fields:** 15 fields including current 4 plus: `schema_version`, `id`, `title`, `aliases`, `description`, `tags`, `status`, `deprecated`, `stability`, `versioning`, `relationships`, `content_role`
- **Location:** `schema/v2/base.schema.json`
- **Structure:** JSON Schema with $ref composition

### INTEGRATION_ARCHITECTURE Recommendation
Extend current BaseMetaSchema incrementally. Add new fields as optional initially.

### Critical Analysis

**Benefits of Current (Incremental Extension) Approach:**
- Gradual migration
- No breaking changes
- Low risk

**Benefits of Specification (Complete BaseMeta) Approach:**
- All metadata fields available from day one
- No incremental migration complexity
- Clear contract from the start
- Better for AI-assisted content generation (AI has complete metadata to work with)

**Long-term Maintenance Cost:**
- **Incremental:** Higher total cost (multiple migration phases)
- **Complete:** One-time cost

**Migration Cost:**
- **Incremental:** Spread over time, lower immediate risk
- **Complete:** Higher immediate cost, but done once

**Future Extensibility:**
- **Incremental:** No difference
- **Complete:** No difference

**Complexity:**
- **Incremental:** More complex (multiple phases)
- **Complete:** Less complex (single migration)

**Risk:**
- **Incremental:** Lower per-phase risk
- **Complete:** Higher immediate risk

### Recommendation

**ACCEPT INTEGRATION_ARCHITECTURE.** Extend BaseMeta incrementally.

**Rationale:**
1. **Principle R3 compliance:** "Maintainability Over Elegance." Incremental extension is more maintainable for a single maintainer.
2. **Risk management:** Adding 11 new fields at once increases risk. Incremental addition allows validation at each step.
3. **Principle R8 compliance:** "Extension is Additive." The specification itself supports incremental addition via optional fields.
4. **Single-maintainer sustainability:** Smaller changes are easier to verify and debug.

**Refined Strategy:**
- Add new fields to BaseMeta as optional
- Migration script to populate new fields in existing content
- Make fields required after migration is complete
- Follow the dependency graph in INTEGRATION_ARCHITECTURE.md

**Confidence:** HIGH (90%)

---

## Decision 7: Relationships Model

### Current Implementation
- **Structure:** Flat `alternatives` array of `ContentRef` objects
- **ContentRef:** `{ id: string, type: enum }`
- **Location:** In content files

### Specification
- **Structure:** Structured `relationships` object with typed arrays
- **Structure:** `{ workflows: string[], models: string[], packages: string[], cheatsheets: string[], registry: string[] }`
- **Location:** In BaseMeta

### INTEGRATION_ARCHITECTURE Recommendation
Migrate to structured relationships object via migration script. Both coexist during bridge period.

### Critical Analysis

**Benefits of Current (alternatives array) Approach:**
- Simple structure
- Works correctly
- No type enforcement on array contents

**Benefits of Specification (relationships object) Approach:**
- Type-safe (each array is strongly typed)
- Queryable by type without string parsing
- Communicates relationship semantics explicitly
- Better for graph traversal
- Better for AI-assisted content generation (AI can understand relationship types)
- Enables type-safe relationship queries in TypeScript

**Long-term Maintenance Cost:**
- **alternatives:** Low cost, but limited query capability
- **relationships:** Low cost, better query capability

**Migration Cost:**
- **alternatives → relationships:** Medium. Requires migration script, updating components, updating lib/data.ts
- **Keep alternatives:** Zero

**Future Extensibility:**
- **alternatives:** Limited. Adding relationship types requires string parsing
- **relationships:** High. New relationship types are new typed arrays

**Complexity:**
- **alternatives:** Simple
- **relationships:** Slightly more complex

**Risk:**
- **alternatives:** Risk of type errors (type field is string enum, but not enforced at runtime)
- **relationships:** Lower risk (type safety)

### Recommendation

**ACCEPT INTEGRATION_ARCHITECTURE.** Migrate to structured relationships object.

**Rationale:**
1. **Type safety:** The structured object provides compile-time type safety that the flat array cannot.
2. **Query capability:** Type-safe arrays enable better graph traversal and relationship queries.
3. **AI-assisted content generation:** AI tools can understand the structured relationships model more easily than a flat array with type fields.
4. **Specification alignment:** The Repository Foundation specified this structure for good reasons.
5. **Migration cost is acceptable:** This is a one-time migration with clear benefits.

**Migration Strategy:**
- Follow the strategy in INTEGRATION_ARCHITECTURE.md
- Migration script to transform `alternatives` → `relationships`
- Bridge period with both coexisting
- Update components to use `relationships`
- Deprecate `alternatives` after migration

**Confidence:** HIGH (90%)

---

## Decision 8: Validation Architecture

### Current Implementation
- **Layers:** Single-layer Zod validation
- **Tool:** Zod.safeParse()
- **Location:** `scripts/validate-content.ts`

### Specification
- **Layers:** 4-layer validation (Structural, Constraint, Cross-Reference, Semantic)
- **Tool:** Ajv for Layer 1, custom logic for Layers 2-4
- **Location:** `scripts/validate.js`

### INTEGRATION_ARCHITECTURE Recommendation
Keep Zod as Layer 1. Add Layers 2-4 as post-Zod checks.

### Critical Analysis

**Note:** This decision is dependent on Decision 1 (Schema Authority). If we migrate to JSON Schema as canonical (as recommended above), then Layer 1 must use Ajv, not Zod.

**Assuming JSON Schema as canonical:**

**Benefits of Current (Single-layer) Approach:**
- Simple
- Fast
- Easy to understand

**Benefits of Specification (4-layer) Approach:**
- Comprehensive validation
- Separation of concerns
- Better error messages
- Catches semantic errors that structural validation cannot
- Enables repository-level health checks
- Better for AI-assisted content generation (AI can validate at multiple layers)

**Long-term Maintenance Cost:**
- **Single-layer:** Low cost, but limited validation
- **4-layer:** Medium cost, but comprehensive validation

**Migration Cost:**
- **Single-layer → 4-layer:** Medium. Requires implementing Layers 2-4, updating validation script
- **Keep single-layer:** Zero

**Future Extensibility:**
- **Single-layer:** Limited. Adding new validation rules requires mixing concerns
- **4-layer:** High. New validation rules can be added to appropriate layer

**Complexity:**
- **Single-layer:** Simple
- **4-layer:** More complex, but well-structured

**Risk:**
- **Single-layer:** Risk of semantic errors slipping through
- **4-layer:** Risk of validation logic bugs

### Recommendation

**ACCEPT Specification (with modification).** Implement 4-layer validation with JSON Schema as Layer 1.

**Rationale:**
1. **Comprehensive validation:** 4-layer validation catches errors that single-layer cannot.
2. **Separation of concerns:** Each layer has a clear responsibility, making the system easier to understand and maintain.
3. **Repository health:** Layers 3-4 enable repository-level health checks (cross-reference integrity, semantic consistency).
4. **AI-assisted content generation:** AI tools can validate at multiple layers, ensuring higher quality content.
5. **Specification alignment:** The Repository Foundation specified 4-layer validation for good reasons.

**Migration Strategy:**
- Layer 1: JSON Schema validation using Ajv
- Layer 2: Constraint validation reading from aens.config.json
- Layer 3: Cross-Reference validation checking relationships integrity
- Layer 4: Semantic validation checking status/version consistency, taxonomy conformance
- Update validate-content.ts to run all 4 layers
- Add --layer flag for selective validation

**Confidence:** HIGH (85%)

---

## Decision 9: Metadata Directory Authority

### Current Implementation
- **Status:** Does not exist
- **Alternative:** Tags and aliases are inline in content files

### Specification
- **Status:** `metadata/` directory with `tags.json`, `aliases.json`, `categories.json`
- **Authority:** Controlled vocabularies are authoritative
- **Validation:** Content must reference registered tags/aliases

### INTEGRATION_ARCHITECTURE Recommendation
Add `metadata/` directory as controlled vocabulary source. Integrate with validation.

### Critical Analysis

**Benefits of Current (Inline) Approach:**
- Simple
- No separate files to maintain
- Tags and aliases are self-contained in content

**Benefits of Specification (metadata directory) Approach:**
- Controlled vocabulary prevents drift
- Centralized tag/alias management
- Enables collision detection (same alias for two entities)
- Better for search (can read all aliases from one place)
- Better for AI-assisted content generation (AI can read vocabularies from one place)
- Enables category-level metadata
- Taxonomy conformance validation

**Long-term Maintenance Cost:**
- **Inline:** Low cost, but risk of vocabulary drift
- **metadata directory:** Medium cost, but prevents drift

**Migration Cost:**
- **Inline → metadata directory:** Medium. Requires extracting existing tags/aliases, creating metadata files, updating validation
- **Keep inline:** Zero

**Future Extensibility:**
- **Inline:** Limited. Adding vocabulary-level features requires touching all content files
- **metadata directory:** High. Vocabulary-level features can be added in one place

**Complexity:**
- **Inline:** Simple
- **metadata directory:** More complex, but well-structured

**Risk:**
- **Inline:** Risk of vocabulary inconsistency
- **metadata directory:** Risk of validation errors if metadata is incorrect

### Recommendation

**ACCEPT INTEGRATION_ARCHITECTURE.** Add `metadata/` directory as authoritative controlled vocabulary source.

**Rationale:**
1. **Vocabulary control:** Prevents drift and ensures consistency across the repository.
2. **Collision detection:** Can detect when the same alias is registered to two different entities.
3. **AI-assisted content generation:** AI tools can read vocabularies from one place, making content generation easier.
4. **Search optimization:** Search can read all aliases from one place, improving search quality.
5. **Specification alignment:** The Repository Foundation specified metadata directory for good reasons.
6. **Single-maintainer sustainability:** Centralized vocabulary management is easier than distributed inline management.

**Migration Strategy:**
- Follow the strategy in INTEGRATION_ARCHITECTURE.md
- Create metadata/ directory
- Extract existing tags/aliases from content
- Create tags.json, aliases.json, categories.json
- Update validation to check taxonomy conformance

**Confidence:** HIGH (90%)

---

## Decision 10: Configuration Authority

### Current Implementation
- **Location:** `lib/config/registry.ts` (partial)
- **Scope:** Registry task mappings only
- **Status:** Scattered, incomplete

### Specification
- **Location:** `aens.config.json` at root
- **Scope:** Content types, schema versions, size budgets, stability tiers
- **Status:** Centralized, complete

### INTEGRATION_ARCHITECTURE Recommendation
Create `aens.config.json` as central configuration source. Migrate `lib/config/registry.ts` to read from it.

### Critical Analysis

**Benefits of Current (Scattered) Approach:**
- Simple for current scope
- Works for current needs

**Benefits of Specification (Centralized) Approach:**
- Single source of truth for all configuration
- No hardcoded constants
- Easier to modify constraints
- Better for validation (validation reads from config)
- Better for AI-assisted content generation (AI can read constraints from one place)
- Aligns with Principle R4 (Configuration is Centralized)

**Long-term Maintenance Cost:**
- **Scattered:** Medium cost (constants scattered across codebase)
- **Centralized:** Low cost (all config in one place)

**Migration Cost:**
- **Scattered → centralized:** Low. Requires creating aens.config.json, updating scripts to read from it
- **Keep scattered:** Zero

**Future Extensibility:**
- **Scattered:** Limited. Adding new configuration requires finding the right place
- **Centralized:** High. New configuration can be added to aens.config.json

**Complexity:**
- **Scattered:** Simple for current scope, complex as scope grows
- **Centralized:** Slightly more complex initially, simpler as scope grows

**Risk:**
- **Scattered:** Risk of configuration inconsistency
- **centralized:** Risk of breaking changes if config is incorrect

### Recommendation

**ACCEPT INTEGRATION_ARCHITECTURE.** Create `aens.config.json` as central configuration authority.

**Rationale:**
1. **Principle R4 compliance:** "Configuration is Centralized." This is explicitly required by the Repository Foundation.
2. **Single source of truth:** All configuration in one place is easier to maintain.
3. **Validation integration:** Validation scripts can read constraints from config, ensuring consistency.
4. **AI-assisted content generation:** AI tools can read constraints from one place.
5. **Single-maintainer sustainability:** Centralized configuration is easier to understand and modify than scattered constants.

**Migration Strategy:**
- Follow the strategy in INTEGRATION_ARCHITECTURE.md
- Create aens.config.json with content types, schema versions, size budgets, stability tiers
- Update lib/config/registry.ts to read from aens.config.json
- Update scripts to read from aens.config.json
- Remove hardcoded constants

**Confidence:** HIGH (95%)

---

# Decisions that Should Be Accepted

1. **BaseMeta Extension (Decision 6):** Incremental extension is the right approach for a single maintainer.
2. **Relationships Migration (Decision 7):** Structured relationships object provides type safety and query capability.
3. **Validation Architecture (Decision 8):** 4-layer validation provides comprehensive error checking.
4. **Metadata Directory (Decision 9):** Controlled vocabularies prevent drift and enable better tooling.
5. **Configuration Authority (Decision 10):** Centralized configuration is required by Principle R4.

---

# Decisions that Should Be Modified

1. **Navigation Architecture (Decision 3):** Keep `_nav.json` as primary navigation, but use `metadata/categories.json` for vocabulary validation and category-level metadata. This hybrid approach gives the benefits of both.

---

# Decisions that Should Be Reversed

1. **Schema Authority (Decision 1):** Migrate to JSON Schema as canonical. The long-term benefits (industry standard, language-agnostic, AI-friendly) outweigh the migration cost.
2. **Content Directory (Decision 2):** Migrate to `content/`. The semantic clarity and industry convention justify the one-time migration cost.
3. **Search Index (Decision 4):** Migrate to static `search-index.json`. Build-time generation and external tooling capabilities justify the change.
4. **Type Derivation (Decision 5):** Use manual parallel maintenance with tool-assisted synchronization. This enables better documentation and type ergonomics.

---

# Open Questions

1. **JSON Schema to TypeScript generator:** Which tool should be used? Options include `json-schema-to-typescript`, `ts-json-schema-generator`, `quicktype`. Evaluation required.
2. **Search index regeneration:** Should `search-index.json` be committed to git or .gitignored? If committed, when is it regenerated? If .gitignored, is it regenerated at build time or runtime?
3. **Type synchronization discipline:** How often should types be re-synced with JSON Schema? After every schema change? Before every release?
4. **Bridge period duration:** How long should the bridge period last for relationships migration? For schema migration?

---

# Architectural Assumptions That Still Require Validation

1. **JSON Schema 2020-12 tooling maturity:** The specification assumes mature tooling for JSON Schema 2020-12. This should be validated before committing to the migration.
2. **Ajv performance:** The specification assumes Ajv validation is performant enough for the repository size. This should be benchmarked.
3. **Manual type sync feasibility:** The recommendation for manual type sync assumes this is feasible for a single maintainer. This should be validated with a trial period.
4. **Static search index benefits:** The recommendation for static search index assumes external tooling will benefit from it. This should be validated against actual use cases.

---

# Recommended Final Architecture

The final architecture should more closely follow the Repository Foundation Specification v1.1 than INTEGRATION_ARCHITECTURE.md recommends. The key changes are:

1. **Schema Authority:** JSON Schema 2020-12 in `schema/v2/` as canonical
2. **Content Directory:** `content/` as content root
3. **Navigation:** Hybrid approach with `_nav.json` as primary navigation and `metadata/categories.json` as vocabulary authority
4. **Search Index:** Static `search-index.json` as committed artifact
5. **Type Derivation:** Manual parallel maintenance with tool-assisted synchronization
6. **BaseMeta:** Incremental extension following INTEGRATION_ARCHITECTURE.md strategy
7. **Relationships:** Structured object following INTEGRATION_ARCHITECTURE.md strategy
8. **Validation:** 4-layer validation with JSON Schema as Layer 1
9. **Metadata Directory:** `metadata/` as controlled vocabulary authority
10. **Configuration:** `aens.config.json` as central configuration authority

This architecture optimizes for:
- **Repository longevity:** Industry standards (JSON Schema) and conventions (content/)
- **AI-assisted content generation:** Language-agnostic schemas, centralized metadata, static artifacts
- **Single-maintainer sustainability:** Centralized configuration, controlled vocabularies, disciplined processes
- **Future extensibility:** External tooling compatibility, static artifacts, type-safe structures
- **Maintainability:** Clear separation of concerns, authoritative sources, comprehensive validation

The migration will be more painful than INTEGRATION_ARCHITECTURE.md recommends, but the long-term benefits justify the cost.
