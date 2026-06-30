# AENS v2 — Repository Foundation Specification
**Step 2A: Architecture Contract**
**Status: Pending Freeze**
**Supersedes:** All prior informal repository decisions

---

## 1. Repository Design Principles

These principles govern every decision in this specification. When a conflict arises between any two architectural choices, these principles resolve it in order of priority.

**Principle R1: One Source, Many References**
Every piece of information has exactly one authoritative location. All other locations reference it. This is the repository expression of the architecture freeze's Single Owner rule. When a concept could live in two places, the principle forces a decision about which one owns it.

**Principle R2: Schema is the Contract**
The JSON Schema files are the canonical definition of what valid content looks like. TypeScript types are derived from or synchronized with schemas. Validation scripts enforce schemas. No content ships without passing schema validation. The schema is never loosened to accommodate content — content is corrected to satisfy the schema.

**Principle R3: Maintainability Over Elegance**
A solution that a single maintainer can operate reliably for five years is better than an elegant solution that requires regular architectural attention. When two approaches produce equivalent outcomes, the simpler one is chosen.

**Principle R4: Configuration is Centralized**
System-level constraints, content type definitions, size budgets, and stability tiers live in one configuration file. Scripts, validators, and tooling read from that file. No architectural constant is hardcoded in more than one place.

**Principle R5: Explicit Over Implicit**
Every status, version, stability tier, and relationship is declared explicitly in content files. Nothing is inferred from file location, naming convention, or modification date alone. This makes content portable, auditable, and migration-safe.

**Principle R6: Search is Designed In**
Every content file carries enough metadata to be discoverable by search without navigation. Search is not added after the content layer is built — it is a design constraint on the content layer itself.

**Principle R7: Schema Versions Survive Content**
Content files must declare which schema version they conform to. This allows the repository to contain content at multiple schema versions simultaneously during migrations, and allows tooling to validate each file against the correct schema version.

**Principle R8: Extension is Additive**
New content types, new fields, and new relationships are added without modifying existing valid content. Backward compatibility is the default. Breaking changes require an explicit schema version increment and a migration plan.

---

## 2. Repository Structure

```
ai-engineering-handbook/
│
├── content/
│   ├── workflows/
│   ├── models/
│   ├── packages/
│   ├── cheatsheets/
│   └── registry/
│
├── schema/
│   ├── v2/
│   │   ├── base.schema.json
│   │   ├── workflow.schema.json
│   │   ├── model.schema.json
│   │   ├── package.schema.json
│   │   ├── cheatsheet.schema.json
│   │   └── registry.schema.json
│   └── [future: v3/]
│
├── types/
│   ├── base.types.ts
│   ├── workflow.types.ts
│   ├── model.types.ts
│   ├── package.types.ts
│   ├── cheatsheet.types.ts
│   └── registry.types.ts
│
├── metadata/
│   ├── tags.json
│   ├── aliases.json
│   └── categories.json
│
├── scripts/
│   ├── validate.js
│   ├── search-index.js
│   ├── migrate.js
│   └── audit.js
│
├── search-index.json          ← generated, never manually edited
│
├── docs/
│   ├── architecture-freeze.md
│   ├── schema-spec.md
│   ├── repository-foundation.md  ← this document
│   ├── adr/
│   │   └── [adr-NNN-title.md]
│   ├── migration-log.md
│   └── review-queue.md
│
└── aens.config.json
```

**Rationale for top-level `types/` directory:**
TypeScript interfaces are the human-readable contract for content authors and frontend developers. They must be immediately visible at the top level — not nested inside `src/` or `scripts/`. The `types/` directory is a first-class citizen of this repository, not an implementation detail.

**Rationale for versioned schema subdirectory (`schema/v2/`):**
Placing schemas under a version subdirectory means that when schema v3 is introduced, `schema/v2/` remains intact. Content files referencing `schema_version: "2.0"` are still validatable without any migration. The alternative — a flat `schema/` directory — would require renaming files on every schema version increment, breaking any tooling that references them by path.

**Rationale for `metadata/` directory:**
System-level taxonomy (tags, aliases, categories) is shared across all content types. It does not belong inside any single content file. It belongs in a dedicated directory that all tooling can reference as a shared dictionary. This prevents individual content files from defining tags or aliases that are inconsistent with system-wide taxonomy.

**Rationale for `search-index.json` at root:**
The search index is a derived artifact — generated from content, never authored directly. Placing it at the root signals this: it is an output, not a source. It is excluded from content audits and included in `.gitignore` if the frontend regenerates it at build time, or committed if the frontend consumes it statically.

---

## 3. Content Directory Strategy

Content lives in `content/[type]/[slug].json`. This is a flat structure within each type directory. No subdirectories within content type directories.

**Why flat:**
Nested content directories (`content/workflows/rag/retrieval-pipeline.json`) create an implicit taxonomy that competes with the tag and relationship system. A workflow about RAG retrieval might belong under `rag/`, `retrieval/`, or `nlp/` — and this ambiguity compounds as content grows. Flat files eliminate the ambiguity. Discovery is handled by tags and search, not by directory position.

**Why type-first (not domain-first):**
Content types are frozen. Domains are not. A flat `content/rag/` directory would need to contain workflows, models, packages, and cheatsheets mixed together — or require subdirectories per type within the domain, which recreates the type hierarchy anyway. Type-first directories are stable because the content types will not change.

**File ownership rule:**
One file, one content entity. A single JSON file never represents more than one logical content entity. If content grows beyond the size budget for a single entity, it is split into multiple files with cross-references, not expanded within a single file.

---

## 4. Base Metadata Architecture (BaseMeta)

BaseMeta is the universal metadata layer present in every content file regardless of type. It defines the fields that are the responsibility of the metadata layer, not the content layer.

**Fields and their rationale:**

`schema_version` — The version of the JSON Schema this file conforms to (e.g., `"2.0"`). This is distinct from `versioning.verified_against`, which describes the external library version. Schema version tracks the structural contract. Library version tracks the content's accuracy. Both are required. Neither substitutes for the other.

`id` — The canonical identifier for this content entity, in `type:slug` format (e.g., `package:numpy`). Globally unique within the repository. Used in all cross-references. Never changes after creation because cross-references depend on it. If a slug must change, the old ID is added to `aliases` and the new ID is used going forward.

`title` — The human-readable name of the content entity. Used as the primary display label and the primary search term.

`aliases` — An array of alternative names, abbreviations, common misspellings, and informal references that engineers use to refer to this entity. This is the primary mechanism for search-first discoverability. Example: a package with title `NumPy` carries aliases `["np", "numpy library", "numerical python"]`. Aliases are registered in `metadata/aliases.json` as the system-wide canonical list and are also present in the content file for self-containment.

`description` — One to three sentence description optimized for search result previews and orientation for engineers arriving cold. Not a teaching description — an orientation description. Answers: what is this, and when would I reach for it?

`tags` — An array of tag strings drawn from the controlled vocabulary in `metadata/tags.json`. Tags are the primary filtering mechanism. They must conform to the registered taxonomy — an unregistered tag is a validation error, not a warning.

`status` — The lifecycle state of this content entity. Enum: `draft | stub | complete | deprecated`. `stub` means the entity exists in the graph but content is incomplete. `draft` means content is being authored. `complete` means content satisfies all schema requirements and has been verified. `deprecated` means the entity is superseded and should not be used for new work.

`deprecated` — An optional object present only when `status` is `deprecated`. Contains two fields: `is_deprecated: true` and `replaced_by: string` (an ID in `type:slug` format). This provides a machine-readable deprecation trail that tooling can follow to surface replacement content automatically.

`stability` — The maintenance tier for this content entity. Enum: `stable | semi_stable | volatile`. Drives maintenance scheduling. `stable` content (algorithms, mathematical concepts, architectural patterns) requires annual review at most. `volatile` content (library APIs, SDK usage, deployment configs) requires review whenever the referenced library releases a major version.

`versioning` — An object containing `verified_against` (the specific library, model, or tool version this content was verified against, e.g., `"numpy 2.1"`) and `last_verified_at` (ISO 8601 date). For `stable` content with no external library dependency, `verified_against` is set to `"timeless"`. This explicit declaration prevents the implicit assumption that stable content needs no version information.

`sources` — An array of structured source objects. Each source object contains: `title` (string), `url` (string), `accessed_at` (ISO 8601 date), `notes` (optional string). Unstructured source strings are not permitted — a source with no URL or access date is not a verifiable source.

`relationships` — The structured cross-reference object. Defined in Section 7.

`created_at` — ISO 8601 datetime when this file was first created.

`updated_at` — ISO 8601 datetime when this file was last modified.

---

## 5. Content Metadata Responsibilities

This section defines precisely what belongs at each layer. No layer may absorb responsibility that belongs to another.

**BaseMeta is responsible for:** identity, discoverability, lifecycle, maintenance scheduling, cross-references, and provenance. BaseMeta fields answer: what is this, where does it fit, is it current, and what else relates to it.

**Content type schema is responsible for:** the structured knowledge payload specific to that content type. Workflow steps, model benchmarks, package common tasks — these are content responsibilities, not metadata responsibilities.

**`metadata/` directory is responsible for:** system-wide controlled vocabularies. Tags that exist. Alias registrations. Category definitions. Individual content files reference these vocabularies; they do not define them.

**`aens.config.json` is responsible for:** system-level architectural constraints. Size budgets. Content type registry. Schema version mapping. Scripts read from here; content files do not.

**`search-index.json` is responsible for:** a flattened, search-optimized projection of all content. It is generated from content files and metadata. It is never a source of truth for anything — only a derived artifact for search performance.

**Validation scripts are responsible for:** enforcing the contract between content files and schemas, configuration constraints, cross-reference integrity, and taxonomy conformance. Validation is the enforcement mechanism; it does not define the rules. Rules are defined in schemas and configuration.

---

## 6. ID, Slug, and Naming Strategy

**ID format:** `type:slug` where type is one of `workflow | model | package | cheatsheet | registry` and slug is a lowercase, hyphen-separated identifier derived from the content title.

**Slug rules:**
- Lowercase only
- Hyphens as separators, no underscores
- No version numbers (version lives in `versioning.verified_against`, not in the slug)
- No special characters beyond hyphens
- Maximum 60 characters
- Derived from the canonical title, not from the domain or use case

**Slug stability rule:**
Once assigned, a slug is permanent. IDs are used in cross-references across the entire repository. Changing a slug without a migration plan corrupts every cross-reference pointing to it. If a title changes, the slug does not automatically change. If a slug must change, the migration plan includes updating every `relationships` entry that references the old ID, the old ID is added to `aliases`, and the change is logged in `docs/migration-log.md`.

**File naming:**
Files are named `[slug].json`. The directory provides the type prefix. There is no redundant type prefix in the filename because the directory already encodes the type.

**Collision policy:**
If two content entities would produce the same slug (e.g., two packages named `core`), the more specific entity takes a qualified slug: `[domain]-[slug]` (e.g., `pytorch-core`, `jax-core`). The qualification is minimal — only enough to disambiguate.

---

## 7. Relationship Model

Relationships are declared in the `relationships` field of BaseMeta. This field is a structured object, not a flat array, for two reasons: it is queryable by type without string parsing, and it communicates the semantics of the relationship explicitly.

**Structure:**

```
relationships: {
  workflows: string[],
  models: string[],
  packages: string[],
  cheatsheets: string[],
  registry: string[]
}
```

Each array contains IDs in `type:slug` format. The relationship type is encoded in the array key, not in a separate `type` or `reason` field on each entry.

**Why this structure over typed links (`depends_on`, `replaces`, `requires`):**
Typed links were explicitly rejected in the Architecture Freeze Decision. The enforcement burden on a single maintainer makes typed links a liability — they will either be inaccurate or incomplete. The structured object by content type gives the system the ability to query "what packages relate to this workflow?" without requiring accurate relationship type declarations per entry. This is the minimum structure needed for useful graph traversal with the minimum maintenance burden.

**Relationship directionality:**
Relationships are declared bidirectionally by convention. If `workflow:rag-retrieval` lists `package:numpy` in its relationships, then `package:numpy` should list `workflow:rag-retrieval` in its relationships. The cross-reference validator checks this — a relationship declared in one direction but not the other is a warning, not an error, because unidirectional references are legitimate during content creation.

**`related` vs `relationships`:**
The earlier schema design used a flat `related: string[]` array. This specification replaces it with `relationships: { ... }` for the reasons above. The flat array is not used.

---

## 8. Search Architecture

Search in AENS is not a frontend feature — it is an architectural requirement defined at the content layer. Every design decision about content metadata is evaluated against whether it improves search quality.

**Primary discovery path:**
An engineer arrives at AENS with a problem statement, an error message, a package name, or a workflow need. Search must route them to the correct content entity without requiring them to know the content type or the navigation hierarchy. This is the operational definition of Search-First Architecture.

**Fields indexed for search:**
The search index extracts these fields from each content file and from the `metadata/` directory:

- `id` — exact match
- `title` — primary text search
- `aliases` — all alias strings, weighted equally to title
- `description` — full-text search, lower weight than title
- `tags` — filter and faceted search
- `content_type` — derived from directory, used for type filtering
- `status` — used to exclude `deprecated` content from default results
- `stability` — available as a filter
- `mental_trigger` — indexed for workflow and package content types, this is the highest-value search field for the target use case (engineer mid-problem)
- `problem_statement` — from workflow `entry_points`, indexed as a long-form search field
- `error_messages` — from package `debugging.error` fields, indexed for error-driven search

**Fields not indexed:**
Code examples, gotcha descriptions, parameter lists, and detailed implementation notes are not indexed in the search layer. These are retrieved after the engineer navigates to the correct page. Indexing them would pollute search results with implementation noise.

**Search index regeneration:**
The search index is a derived artifact generated by `scripts/search-index.js`. It is regenerated whenever content files change. It is never manually edited. The search index is not a content file — it does not have a schema or a validation contract. Its contract is defined implicitly by the fields listed in this section.

---

## 9. Search Index Contract

`search-index.json` is an array of entry objects. Each object contains the fields listed in Section 8 for one content entity. The structure is flat — no nesting, no arrays within entries, no objects within entries. Multi-value fields (tags, aliases) are represented as space-separated strings to maximize compatibility with search libraries.

The search index entry for any content entity must be derivable from the content file alone plus the `metadata/` directory. No other source of information is required to generate it. If a field required for search cannot be derived from these two sources, it belongs in the content file's BaseMeta, not in a separate lookup.

---

## 10. JSON Schema Architecture

**Schema standard:** JSON Schema 2020-12. Draft-07 is not used because it is a prior standard with less expressive composition support and diminishing tooling investment. JSON Schema 2020-12 is the current standard and will have the longest support horizon for a repository intended to operate for many years.

**Schema composition strategy:**
`base.schema.json` defines the complete BaseMeta structure. Each content type schema (`workflow.schema.json`, `model.schema.json`, etc.) uses `$ref` to include `base.schema.json` and adds content-type-specific fields. The base schema is never duplicated — it is always referenced.

**Schema location:**
Schemas live in `schema/v2/`. When schema v3 is introduced, schemas live in `schema/v3/`. Schemas are never overwritten in place. Old schema versions are preserved permanently because content files at those versions must remain validatable.

**Schema authority:**
The JSON Schema files are the canonical structural contract. TypeScript types must conform to the schema, not the other way around. If a TypeScript type and a JSON Schema disagree, the JSON Schema wins. This is because JSON Schema is the validation enforcement mechanism — TypeScript is a development convenience.

**Field constraints in schema:**
Hard limits (maximum 15 common_tasks, maximum 8 workflow steps, maximum 30 cheatsheet entries, maximum 10 pipeline failure patterns) are expressed as `maxItems` constraints in the schema. They are also present in `aens.config.json` for programmatic access. The schema is the source of truth; config mirrors them for tooling convenience.

---

## 11. Schema Versioning Strategy

**`schema_version` field:**
Every content file declares `schema_version` in BaseMeta. The value is a string matching a known schema version (e.g., `"2.0"`). This is the only mechanism by which a validation script knows which schema to apply to a given file.

**Version format:**
Schema versions use major.minor format (`2.0`, `2.1`, `3.0`). Minor version increments are additive — new optional fields only. Major version increments are breaking — required fields added, existing fields renamed or removed, or structural changes made.

**Compatibility rule:**
A file at schema version `2.0` must be validatable against `schema/v2/[type].schema.json` indefinitely. Files are not automatically upgraded to new schema versions. Migration to a new schema version is a deliberate act, logged in `docs/migration-log.md`, and run by `scripts/migrate.js`.

**Schema evolution lifecycle:**
New minor version → add optional fields to existing schemas in `schema/v2/` → existing content remains valid → new content may use new fields.

New major version → create `schema/v3/` with updated schemas → write migration scripts → migrate content files explicitly → validate at new schema version → update `schema_version` field in migrated files → archive old content as needed.

**No schema deprecation without migration completion:**
A schema version is never marked deprecated until all content files referencing it have been migrated or explicitly archived. The presence of a `schema/v2/` directory is a guarantee that v2 content can be validated.

---

## 12. TypeScript Type Architecture

**Relationship to JSON Schema:**
TypeScript types are maintained in parallel with JSON Schemas. They are not auto-generated from schemas, and schemas are not auto-generated from types. Both are maintained manually and kept in sync. The rationale: auto-generation adds build tooling complexity that a single maintainer must maintain; manual synchronization of a frozen schema is low-burden and produces more readable types.

**When they diverge:**
If a TypeScript type and a JSON Schema field disagree, the resolution procedure is: consult this specification, determine which layer owns the field definition (Section 5), update the non-authoritative layer to match the authoritative one, and log the discrepancy as a finding in the next repository audit.

**Type file organization:**
One type file per content type, matching the schema file structure. `base.types.ts` exports the `BaseMeta` interface. Each content type file imports `BaseMeta` and extends it. No type is defined in more than one file.

**Type export convention:**
All types are named exports. No default exports. This makes import statements self-documenting and prevents naming conflicts when multiple types are imported together.

**TypeScript as documentation:**
The `types/` directory serves as human-readable schema documentation for developers who find JSON Schema syntax unfamiliar. Types should be written with JSDoc comments that explain the purpose of each field. This transforms the types directory into an always-current reference for content authors.

---

## 13. Validation Architecture

Validation is split into four distinct layers. Each layer has a defined scope and runs independently. A content file must pass all four layers before its `status` can be set to `complete`.

**Layer 1 — Structural Validation (JSON parse + Schema validation)**
Checks that the file is valid JSON and that it conforms to the appropriate JSON Schema for its content type and schema version. This layer is purely mechanical. It catches missing required fields, incorrect types, values outside allowed enums, and violations of `maxItems` constraints. Tooling: Ajv or equivalent JSON Schema 2020-12 validator.

**Layer 2 — Constraint Validation (Configuration enforcement)**
Reads `aens.config.json` and checks that content-specific size budgets are honored. Although size budgets are expressed in the schema as `maxItems`, this layer provides human-readable error messages that identify which constraint was violated and by how much. Example: "Package `numpy` has 17 common_tasks. Maximum is 15. Split required." This layer runs after Layer 1.

**Layer 3 — Cross-Reference Validation (Graph integrity)**
For every ID in every `relationships` array, checks that a file with that ID exists in `content/`. Checks that relationship declarations are bidirectional where expected. Checks that `deprecated.replaced_by` references an existing, non-deprecated content entity. This layer requires access to the full content directory, not just the single file being validated. Running it per-file is valid only after the full content graph has been loaded.

**Layer 4 — Semantic Validation (Content quality)**
Checks rules that cannot be expressed in JSON Schema. Examples: `status` is `complete` but `versioning.verified_against` is `"unverified"` — this is a semantic error (a complete content entity must have a real version stamp). `stability` is `volatile` but `versioning.last_verified_at` is more than 6 months ago — this is a maintenance warning. Tags in `tags` array are not present in `metadata/tags.json` — this is a taxonomy conformance error. This layer enforces the qualitative contracts that the architecture requires but schema syntax cannot express.

**Validation modes:**
`validate --file [path]` — runs all four layers on one file. Used during content authoring.
`validate --all` — runs Layer 1 and 2 on all files, then Layer 3 on the full graph, then Layer 4 on all files. Used before releases or migrations.
`validate --links` — runs Layer 3 only. Used after renaming or moving content.

**Audit script (`scripts/audit.js`):**
Separate from the validator. The audit script checks repository-level health: duplicate IDs, duplicate aliases, slugs that differ only by hyphen/underscore, files with `status: stub` older than 90 days, files with `status: complete` and `verified_at` older than their stability tier implies. The audit script produces `migration-report.json` (machine-readable) and a summary to stdout. It does not validate individual files — it assesses the health of the repository as a whole.

---

## 14. Configuration Architecture

`aens.config.json` is the single configuration file. It is read by all scripts. It is not read by content files. Content files do not reference configuration — they declare their own values which are validated against configuration.

**What belongs in `aens.config.json`:**
- System version and freeze date
- Content root and schema root paths
- Supported content types (the closed set of valid type prefixes for IDs)
- Schema version mapping (which schema version is current, which are legacy)
- Architectural size constraints (all `max*` values)
- Stability tier definitions and review cadences
- Asset types for Registry content
- Controlled vocabulary file paths

**What does not belong in `aens.config.json`:**
- Content-specific values (those live in content files)
- Frontend configuration (that belongs to the frontend layer)
- Environment-specific settings (the repository has no environment-specific behavior)
- Search configuration (that belongs to the search layer)

**Configuration stability:**
`aens.config.json` is considered part of the frozen architecture. Changes to it require the same deliberation as changes to the architecture specification. It is not an operational configuration file — it is an architectural contract expressed as data.

---

## 15. Migration Architecture

Migration in AENS means one of three things: migrating existing pre-v2 content into v2 structure, migrating v2 content to a future schema version, or restructuring content that has exceeded size budgets.

**Migration tooling (`scripts/migrate.js`):**
The migration script is not a general-purpose ETL tool. It implements specific, named migration tasks. Each task is identified by a `--task` argument. Tasks are additive — a new migration task is added for each migration event; existing tasks are never modified. This creates an auditable migration history in the script itself.

**Migration report:**
Every migration run produces `migration-report.json` at the repo root. This file is machine-readable and contains: timestamp, task name, files processed, files succeeded, files failed, warnings, and a list of files added to the review queue. It supplements `docs/migration-log.md` (human-readable narrative) rather than replacing it. Both are maintained.

**Review queue:**
`docs/review-queue.md` is a tracked list of content entities that require human review before they can be marked `complete`. It is the primary tool for managing content that cannot be automatically migrated — specifically, content with `verified_against: "unverified"` that needs a human to look up and confirm the correct library version.

**Migration phases (canonical order):**
Phase 0 (Audit), Phase 1 (Scaffold), Phase 2 (High-Confidence Migration), Phase 3 (Problem Content Resolution), Phase 4 (Search Index), Phase 5 (Validation Pass). These phases are defined in detail in the migration plan and are referenced here for continuity. The migration script implements Phase 2 and Phase 3 mechanics. Phases 0, 4, and 5 are human-driven with script support.

---

## 16. Machine-Readable Repository Metadata

Three files in the `metadata/` directory define the controlled vocabularies that all content references.

**`metadata/tags.json`:**
The canonical list of all valid tags in the repository. Structured as an array of tag objects, each with: `tag` (the string used in content files), `description` (one sentence explaining what content this tag applies to), and `category` (a grouping label such as `domain`, `task`, `complexity`, `modality`). Tags not present in this file are invalid. New tags are added here before being used in content.

**`metadata/aliases.json`:**
A registry of all aliases across the repository. Structured as an array of alias registration objects, each with: `alias` (the alias string), `canonical_id` (the `type:slug` ID of the content entity this alias refers to). This file serves two purposes: it prevents the same alias from being registered to two different content entities (collision detection), and it provides a lookup table for search systems that need to resolve an alias to a canonical ID without loading all content files.

**`metadata/categories.json`:**
A registry of content categories used for navigation grouping. Structured as an array of category objects, each with: `category` (the category identifier), `label` (human-readable name), `description`, and `content_types` (which content types can belong to this category). Examples: `nlp`, `computer-vision`, `time-series`, `deployment`. Categories are navigational; tags are taxonomic. A content entity can have multiple tags but typically belongs to one primary category.

**Metadata governance:**
The `metadata/` files are not content — they are vocabulary definitions. They are modified less frequently than content and reviewed as part of major schema version decisions. Adding a new tag or category requires a deliberate addition to the appropriate metadata file; it cannot be done implicitly by adding it to a content file.

---

## 17. Extension Rules for Future Content Types

The architecture freeze prohibits new content types without explicit revision. However, the process for introducing a new content type is defined here so that, when the need eventually arises, the repository has a clear procedure rather than an improvised one.

**Qualification criteria for a new content type:**
A new content type is warranted only when: (1) a category of knowledge cannot be adequately represented in any existing content type, (2) the proposed type has a distinct schema that cannot be expressed as a section within an existing type, and (3) at least five concrete instances exist that would populate the new type immediately. A type created speculatively with zero content is a maintenance liability.

**Extension procedure:**
1. Write an Architecture Decision Record (ADR) documenting the need, the proposed type, its schema, and why existing types are insufficient.
2. Review the ADR against the architecture freeze principles.
3. If approved: add the new content type to `aens.config.json` as a supported type, create the schema file in `schema/v[current]/`, create the TypeScript type file in `types/`, update `metadata/categories.json` if a new category is needed, and update the search index generator to extract the appropriate fields for the new type.
4. The new type is considered experimental for 90 days after introduction. During this period its schema may be revised without a major version increment if no content files have been marked `complete`.

**Field extension within existing types:**
New optional fields may be added to existing schemas as minor version increments. Required fields may only be added in major version increments because they invalidate all existing content. When in doubt, new fields are optional.

---

## 18. Backward Compatibility Policy

**Minor version changes (2.0 → 2.1):**
All existing content at version 2.0 remains valid at 2.1. New optional fields are available but not required. Existing content does not need to be updated. The version mapping in `aens.config.json` indicates that 2.0 and 2.1 content are both valid.

**Major version changes (2.x → 3.0):**
Existing content at version 2.x is not automatically valid at 3.0. A migration task is written and run explicitly. Content files are updated to declare `schema_version: "3.0"` only after passing validation against the v3 schema. The v2 schema files are never deleted. Content at v2 that has not been migrated remains validatable against v2 schemas indefinitely.

**ID stability guarantee:**
A content entity's `id` is permanent. Cross-references depend on it. Changing an ID without updating all references is a repository integrity violation. The cross-reference validator detects dangling references. The migration log must record any ID change with the old ID, the new ID, the reason, and the date.

**Relationship to the architecture freeze:**
Backward compatibility applies to content and schema. The architecture freeze applies to architectural decisions. These are separate. Architecture changes require an Architecture Decision Record and deliberate revision. Schema changes require a version increment. Content changes are operational and do not require either.

---

## 19. Architecture Decision Record (ADR) Strategy

An ADR is created for every decision that: changes the repository structure, introduces a new content type, increments the schema version, modifies the validation architecture, or changes a principle in this specification.

**ADR format:**
Each ADR is a Markdown file in `docs/adr/` named `adr-NNN-short-title.md` where `NNN` is a zero-padded sequential number. Each ADR contains: Title, Date, Status (`proposed | accepted | rejected | superseded`), Context (what situation prompted this decision), Decision (what was decided), Rationale (why this option over alternatives), Consequences (what becomes easier or harder as a result), and Supersedes (the ID of any prior ADR this replaces).

**When not to write an ADR:**
Content additions, content corrections, alias additions, tag additions, and routine maintenance do not require ADRs. ADRs are for architectural and structural decisions, not content decisions.

**ADR as the revision trail:**
The collection of ADRs is the authoritative record of why the repository is structured the way it is. When a decision seems arbitrary, the ADR explains it. When a future maintainer questions a choice, the ADR defends it or reveals that it should be revisited.

---

## 20. Architectural Invariants

These are the rules that must never be violated. They are not guidelines. A change that violates an invariant requires a formal revision to this specification and a new ADR before implementation.

**Invariant 1:** Every content file in `content/` conforms to the JSON Schema for its content type and schema version. No exceptions, no legacy files allowed to persist in an invalid state indefinitely.

**Invariant 2:** Every ID in the repository is unique. No two content files share an ID. No alias in `metadata/aliases.json` resolves to more than one canonical ID.

**Invariant 3:** Production strategy, deployment architecture, scaling, and monitoring content is owned exclusively by Workflow pages. Package and Model pages carry only concise, entity-specific production considerations of maximum 300 characters. This invariant enforces the Single Owner architectural principle at the content level.

**Invariant 4:** The `metadata/` vocabulary files are the canonical source of all tags and aliases. Content files reference these vocabularies; they do not extend them unilaterally. An unregistered tag in a content file is a validation error.

**Invariant 5:** `search-index.json` is generated, never manually edited. The search index is always a derivation of content. Manual edits to the search index are corruptions, not contributions.

**Invariant 6:** Schema files in `schema/v2/` are never modified after the v2 freeze. Modifications to existing schemas require a new schema version directory. The schema directory is append-only at the version level.

**Invariant 7:** `aens.config.json` is the single source of all architectural constraints. No constraint value (size budgets, content types, schema versions) is hardcoded in more than one location in the repository. Scripts read from config; they do not define their own constraint values.

**Invariant 8:** The content type set is closed. The valid content types are `workflow`, `model`, `package`, `cheatsheet`, `registry`. No script, no content file, and no configuration value may reference a content type outside this set unless a formal extension procedure (Section 17) has been completed and approved.

**Invariant 9:** Every relationship ID in `relationships` arrays resolves to a real content file in `content/`. Dangling relationships are architecture violations, not maintenance debt.

**Invariant 10:** No content file is marked `status: complete` while `versioning.verified_against` is `"unverified"`. Verification is a prerequisite for completion, not a post-publication step.

---

## Repository Freeze Checklist (Step 2A → Step 2B Gate)

Step 2B implementation may not begin until every item on this checklist is confirmed.

**Specification Completeness**
- [ ] All 20 sections of this specification have been reviewed and accepted
- [ ] No section contains unresolved `TBD` or placeholder content
- [ ] The specification has been saved as `docs/repository-foundation.md` in the repository

**Schema Decisions**
- [ ] JSON Schema 2020-12 confirmed as the schema standard
- [ ] `schema/v2/` confirmed as the version directory pattern
- [ ] All six schema files are specified (base, workflow, model, package, cheatsheet, registry)
- [ ] `schema_version` field confirmed in BaseMeta
- [ ] `versioning.verified_against` and `versioning.last_verified_at` confirmed as distinct from `schema_version`

**BaseMeta Decisions**
- [ ] All BaseMeta fields confirmed: `schema_version`, `id`, `title`, `aliases`, `description`, `tags`, `status`, `deprecated`, `stability`, `versioning`, `sources`, `relationships`, `created_at`, `updated_at`
- [ ] `status` enum confirmed: `draft | stub | complete | deprecated`
- [ ] `stability` enum confirmed: `stable | semi_stable | volatile`
- [ ] `sources` structure confirmed as objects with `title`, `url`, `accessed_at`, `notes`
- [ ] `relationships` structure confirmed as typed object (not flat array)
- [ ] `deprecated` object confirmed with `is_deprecated` and `replaced_by` fields

**Naming and Identity**
- [ ] ID format `type:slug` confirmed
- [ ] Slug rules confirmed (lowercase, hyphens, no version numbers, 60-character maximum)
- [ ] Slug stability rule confirmed (slugs are permanent after creation)
- [ ] File naming convention confirmed (`[slug].json`, no type prefix in filename)

**Search Architecture**
- [ ] All indexed fields confirmed (Section 8)
- [ ] `search-index.json` location and generation policy confirmed
- [ ] `mental_trigger` and `problem_statement` confirmed as high-priority indexed fields

**Validation Architecture**
- [ ] Four validation layers confirmed (structural, constraint, cross-reference, semantic)
- [ ] Validation modes confirmed (`--file`, `--all`, `--links`)
- [ ] `audit.js` scope confirmed as distinct from `validate.js`
- [ ] `migration-report.json` confirmed as machine-readable migration output

**Configuration**
- [ ] `aens.config.json` field set confirmed
- [ ] All size budget values confirmed from architecture freeze document
- [ ] No constraint values to be hardcoded in scripts

**Metadata Governance**
- [ ] Three `metadata/` files confirmed: `tags.json`, `aliases.json`, `categories.json`
- [ ] Tag validation against `metadata/tags.json` confirmed as a validation error (not warning)
- [ ] Alias collision detection confirmed as a validation responsibility

**Invariants**
- [ ] All 10 architectural invariants reviewed and accepted
- [ ] No planned implementation in Step 2B violates any invariant

**Procedural**
- [ ] This specification stored as `docs/repository-foundation.md`
- [ ] ADR `adr-001-repository-foundation.md` written acknowledging this specification as the first architectural decision
- [ ] Step 2B implementation prompt reviewed against this specification for consistency

**Gate Decision**
- [ ] All checklist items above are confirmed
- [ ] No open questions remain in this specification
- [ ] Implementation (Step 2B) is authorized to begin

---

*This document is the architectural contract for the AENS v2 repository. No implementation begins until this checklist is complete. No implementation decision made in Step 2B may contradict a decision in this specification without a formal ADR and specification revision.*