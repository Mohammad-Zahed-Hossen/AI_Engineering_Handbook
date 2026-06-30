# AENS v2 — Repository Freeze Decision Register
**Step 2A: Official Architectural Decision Log**
**Repository Version:** v2.0
**Specification Version:** 1.1
**Status:** Final
**Authority:** Repository Architecture Review Board
**Scope:** All issues raised during Claude Audit and Kimi Audit of the Repository Foundation Specification v1.0

---

## Purpose

This register is the permanent rationale record for every significant architectural issue raised before the Step 2A freeze. It is not a revision document. It does not rewrite the specification. It records what was raised, what was decided, and why — so that future maintainers understand the reasoning behind the frozen architecture without reconstructing it from audit trails.

When a future change is proposed that touches any section recorded here, this register must be consulted first.

---

## Issue Index

| ID | Title | Raised By | Decision |
|---|---|---|---|
| RFD-001 | JSON Schema standard: Draft-07 vs 2020-12 | Kimi | Accepted |
| RFD-002 | `related` array replaced by typed `relationships` object | Kimi + Claude | Accepted |
| RFD-003 | `aliases` missing from BaseMeta | Kimi + Claude | Accepted |
| RFD-004 | `status` field missing from BaseMeta | Kimi + Claude | Accepted |
| RFD-005 | `sources` field undefined in structure | Kimi + Claude | Accepted |
| RFD-006 | `schema_version` missing from BaseMeta | Kimi | Accepted |
| RFD-007 | Deprecation mechanism missing | Kimi | Partially Accepted |
| RFD-008 | `mental_trigger` missing from Model schema | Kimi | Accepted |
| RFD-009 | Page size budgets as governance guidance vs architectural constraint | Kimi + Claude | Accepted |
| RFD-010 | Search index fields insufficient | Kimi + Claude | Partially Accepted |
| RFD-011 | TypeScript as canonical source vs parallel maintenance | Kimi | Rejected |
| RFD-012 | Navigation metadata in BaseMeta | Kimi | Rejected |
| RFD-013 | Data tier as first-class content type | Kimi | Rejected |
| RFD-014 | `decision_notes` renamed to `decision_guide` for Package schema | Kimi | Rejected |
| RFD-015 | Registry extensibility for future asset types | Kimi | Partially Accepted |
| RFD-016 | Validation script scope: link integrity, duplicates, circular references | Kimi + Claude | Accepted |
| RFD-017 | Machine-readable migration report | Kimi + Claude | Accepted |
| RFD-018 | `metadata/` directory for controlled vocabularies | Kimi | Accepted |
| RFD-019 | Cross-link typed relationships (`depends_on`, `replaces`, etc.) | Kimi | Rejected |
| RFD-020 | Production Notes ownership ambiguity | Claude | Accepted |
| RFD-021 | Cheatsheet and Package Common Tasks boundary rule | Claude | Accepted |
| RFD-022 | Split content and index file pattern | Claude | Accepted |
| RFD-023 | `content_role` field for index and child files | Claude | Accepted |
| RFD-024 | `keywords` field distinct from `aliases` and `tags` | Both | Accepted |
| RFD-025 | `docs/migration/` subdirectory for migration artifacts | Review Board | Accepted |
| RFD-026 | ADR strategy missing from specification | Review Board | Accepted |
| RFD-027 | Backward compatibility policy undefined | Review Board | Accepted |
| RFD-028 | Extension rules for future content types undefined | Review Board | Accepted |
| RFD-029 | `aens.config.json` as single constraint source | Claude | Accepted |
| RFD-030 | Alias collision as hard validation failure | Review Board | Accepted |

---

## Detailed Decision Records

---

### RFD-001
**Title:** JSON Schema standard: Draft-07 vs 2020-12
**Raised By:** Kimi
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Schema
**Summary:** The initial specification referenced JSON Schema Draft-07 as the schema standard. Kimi flagged that Draft-07 is outdated with diminishing tooling investment. For a repository intended to operate for many years, a more current standard should be used.
**Decision:** Accepted
**Reasoning:** JSON Schema 2020-12 is the current active standard. It offers more expressive composition support through `$ref`, `$defs`, and `unevaluatedProperties`. For a long-lived repository, adopting the current standard at initialization is lower total maintenance cost than migrating from Draft-07 to a later standard in the future. No tooling available at the time of this decision supports Draft-07 exclusively — all major validators support 2020-12.
**Repository Sections Affected:** Section 10 (JSON Schema Architecture)
**Final Resolution:** All schema files in `schema/v2/` use JSON Schema 2020-12. Draft-07 is explicitly rejected in the specification. The rationale for this rejection is recorded here and in Section 10.
**Implementation Impact:** Low — affects schema file headers only. No content structure changes.

---

### RFD-002
**Title:** `related` array replaced by typed `relationships` object
**Raised By:** Kimi + Claude
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Schema
**Summary:** The initial draft used a flat `related: string[]` array in BaseMeta. Kimi proposed typed links with explicit relationship semantics (`depends_on`, `replaces`, etc.). Claude proposed a structured object keyed by content type. The flat array was agreed by both reviewers to be insufficient for useful graph traversal.
**Decision:** Accepted (Claude's structured object approach; Kimi's typed links rejected — see RFD-019)
**Reasoning:** The flat array requires string parsing to extract the content type component for any type-filtered query. A structured object keyed by content type (`workflows`, `models`, `packages`, `cheatsheets`, `registry`) makes type-filtered queries native without parsing. This is the minimum viable structure for relationship traversal at single-maintainer maintenance cost. Typed links (Kimi's alternative) were rejected separately under RFD-019.
**Repository Sections Affected:** Section 4 (BaseMeta), Section 7 (Relationship Model)
**Final Resolution:** `relationships` replaces `related` in BaseMeta. The object contains five named arrays, each containing IDs in `type:slug` format. All five arrays are required in every content file, even if empty. Absence of an array is a schema validation error.
**Implementation Impact:** Medium — affects BaseMeta schema, TypeScript base type, and all content file templates.

---

### RFD-003
**Title:** `aliases` missing from BaseMeta
**Raised By:** Kimi + Claude
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Metadata
**Summary:** Both reviewers independently identified that the initial BaseMeta did not include an `aliases` field. The Architecture Freeze Principle 8 (Search-First Architecture) requires every page to be independently discoverable. Without aliases, engineers searching by informal names, abbreviations, or alternate terminology cannot find content. Example: searching for `np` or `numerical python` should resolve to the NumPy package page.
**Decision:** Accepted
**Reasoning:** Aliases are the primary mechanism for search-first discoverability. The Architecture Freeze explicitly defines search-first as a core principle. Without aliases, the search index cannot surface content under the informal terminology engineers actually use during development. This is a direct conflict with a frozen architectural principle, making this a blocking omission.
**Repository Sections Affected:** Section 4 (BaseMeta), Section 8 (Search Architecture), Section 9 (Search Index Contract), Section 16 (Machine-Readable Repository Metadata)
**Final Resolution:** `aliases: string[]` added to BaseMeta. Aliases are registered in `metadata/aliases.json` as the system-wide canonical list. An alias present in a content file but absent from `metadata/aliases.json` is a Layer 4 validation error. All aliases are indexed for search at equal weight to `title`.
**Implementation Impact:** Medium — affects BaseMeta schema, TypeScript type, search index generator, and validation layer 4.

---

### RFD-004
**Title:** `status` field missing from BaseMeta
**Raised By:** Kimi + Claude
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Metadata
**Summary:** The initial specification referenced `status: stub` in the migration plan but did not include a `status` field in the BaseMeta schema. This created an internal inconsistency — the migration architecture assumed a lifecycle state concept that the schema did not define.
**Decision:** Accepted
**Reasoning:** Content lifecycle management is a baseline requirement for a long-lived repository maintained by one person. Without explicit status, there is no machine-readable mechanism to distinguish content that is complete from content that is in progress, and no way to exclude incomplete content from search results. The inconsistency between the migration plan (which used `status: stub`) and the schema (which had no `status` field) was a freeze-blocking contradiction.
**Repository Sections Affected:** Section 4 (BaseMeta), Section 8 (Search Architecture)
**Final Resolution:** `status` added to BaseMeta as an enum: `draft | stub | complete | deprecated`. `stub` = entity exists in the graph, content incomplete. `draft` = content being authored. `complete` = satisfies all schema requirements and verified. `deprecated` = superseded. Only `complete` content surfaces in default search results.
**Implementation Impact:** Medium — affects BaseMeta schema, TypeScript type, search index generator, and validation layers 2 and 4.

---

### RFD-005
**Title:** `sources` field undefined in structure
**Raised By:** Kimi + Claude
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Schema
**Summary:** The initial draft listed `sources` as a BaseMeta field but defined it only as `string[]`. Both reviewers identified that an unstructured string array provides no verifiability — a source without a URL and access date cannot be checked or updated.
**Decision:** Accepted
**Reasoning:** A knowledge system meant to serve as an engineering reference for years must carry verifiable source provenance. Unstructured strings are not verifiable. The structured object format adds minimal authoring overhead while enabling tooling to check for sources with missing URLs and to surface sources that have not been accessed recently.
**Repository Sections Affected:** Section 4 (BaseMeta)
**Final Resolution:** `sources` is an array of structured source objects. Each object requires: `title` (string), `url` (string), `accessed_at` (ISO 8601 date). `notes` is optional. A source entry without a URL is not permitted — informal references belong in `notes` on an existing source, not as standalone entries.
**Implementation Impact:** Low — affects BaseMeta schema and TypeScript type only. Content authoring overhead is minimal.

---

### RFD-006
**Title:** `schema_version` missing from BaseMeta
**Raised By:** Kimi
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Schema
**Summary:** The initial specification included `versioning.verified_against` to track external library versions but had no field to declare which JSON Schema version a content file conforms to. Kimi correctly identified these as two different concerns: content accuracy (library version) versus structural contract (schema version). Without `schema_version`, validation tooling cannot determine which schema to apply to a given file.
**Decision:** Accepted
**Reasoning:** Schema versioning is a prerequisite for any multi-year repository that will evolve. Without `schema_version` in every file, a migration from schema v2 to v3 cannot be executed safely — there is no reliable way to identify which files are at which schema version. This is a freeze-blocking omission because the schema versioning strategy in Section 11 depends on it. The concern is entirely distinct from `versioning.verified_against` and the two fields must coexist.
**Repository Sections Affected:** Section 4 (BaseMeta), Section 11 (Schema Versioning Strategy)
**Final Resolution:** `schema_version` added to BaseMeta as a required string field. Valid values are registered in `aens.config.json` under `schema_versions`. A `schema_version` value not present in `aens.config.json` is a Layer 2 validation failure. `schema_version` tracks structural conformance. `versioning.verified_against` tracks content accuracy. Neither substitutes for the other.
**Implementation Impact:** Medium — affects BaseMeta schema, TypeScript type, validation layer 2, and `aens.config.json` structure.

---

### RFD-007
**Title:** Deprecation mechanism missing
**Raised By:** Kimi
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Metadata
**Summary:** Kimi raised that AI tooling changes fast and content that was correct for LangChain v0.1 may be entirely wrong for LangChain v0.3. Without a deprecation mechanism, superseded content silently coexists with current content and the system gives engineers no signal that they are reading stale guidance.
**Decision:** Partially Accepted
**Reasoning:** The concern is valid and the deprecation mechanism is accepted. The scope is constrained. Kimi's proposal included migration path tracking, upgrade guides, and version-specific content branching. These were rejected as overengineering for a single-maintainer system. The accepted scope is the minimum viable deprecation signal: a `deprecated` object on the content entity with `is_deprecated: true` and `replaced_by` pointing to the replacement. This enables tooling to surface "this content is deprecated, see X" notices and enables the cross-reference validator to ensure the replacement exists and is not itself deprecated.
**Repository Sections Affected:** Section 4 (BaseMeta), Section 18 (Backward Compatibility Policy)
**Final Resolution:** `deprecated` object added to BaseMeta as optional. Present only when `status` is `deprecated`. Contains `is_deprecated: true` and `replaced_by: string` (ID in `type:slug` format). Replacement entity must exist and must not itself be deprecated — enforced by Layer 3 cross-reference validation. No silent deprecation rule added as Architectural Invariant 12. Version-specific content branching rejected as out of scope.
**Implementation Impact:** Low — adds optional object to BaseMeta. Validation adds one cross-reference check.

---

### RFD-008
**Title:** `mental_trigger` missing from Model schema
**Raised By:** Kimi
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Schema
**Summary:** The Package schema included `mental_trigger` as a high-value field — the cognitive cue that tells an engineer when to reach for a given API. Kimi noted that the Model schema lacked an equivalent field, despite models requiring the same "when would I reach for this?" orientation signal. Example: XGBoost's mental trigger is "when I have tabular data with mixed categorical and numerical features and need interpretable predictions."
**Decision:** Accepted
**Reasoning:** Consistency between content types is an architectural requirement, not a preference. Package pages carry `mental_trigger` because it is the most valuable search-time signal for engineers mid-problem. Models require the same signal for the same reason — an engineer choosing between XGBoost and LightGBM has the same need to quickly identify "is this the right tool for my situation?" The omission was an oversight in the initial schema design.
**Repository Sections Affected:** Section 8 (Search Architecture — `mental_trigger` indexed for both Package and Model types)
**Final Resolution:** `mental_trigger` added to Model schema as a required string field. It is indexed for search at high weight, equal to `mental_trigger` on Package pages. The search index contract in Section 9 reflects this.
**Implementation Impact:** Low — adds one field to the Model schema and TypeScript type. Affects search index generator to extract this field from Model content files.

---

### RFD-009
**Title:** Page size budgets as governance guidance vs architectural constraint
**Raised By:** Kimi + Claude
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Governance
**Summary:** The initial specification listed page size budgets (15 common tasks, 8 workflow steps, 30 cheatsheet entries) as "content governance rules." Both reviewers raised that describing them as guidance rather than enforceable constraints undermines the primary mechanism preventing content from degrading into encyclopedic documentation over time.
**Decision:** Accepted
**Reasoning:** The Architecture Freeze Document promotes size budgets to mandatory architectural constraints with the explicit statement: "Violation of these limits is an architectural defect, not an editorial preference." The initial specification contradicted the frozen architecture by calling these "governance guidance." This was a freeze-blocking contradiction between the specification and the frozen Architecture Decision Document. Size budgets are the mechanism by which AENS remains scannable rather than encyclopedic. Encoding them as optional guidance makes them effectively meaningless over time.
**Repository Sections Affected:** Section 10 (JSON Schema Architecture), Section 13 (Validation Architecture), Architectural Invariant 6 (now Invariant 1 in revised numbering — enforced through schema `maxItems`)
**Final Resolution:** Size budgets expressed as `maxItems` constraints in the JSON Schema (enforcement) and mirrored in `aens.config.json` (programmatic access). Layer 2 constraint validation produces human-readable error messages when limits are exceeded. Schema is the source of truth when config and schema disagree. Size budgets are listed as Architectural Invariants. The word "guidance" does not appear in the final specification in connection with size budgets.
**Implementation Impact:** Medium — requires `maxItems` in schema files and constraint validation logic in `validate.js`.

---

### RFD-010
**Title:** Search index fields insufficient
**Raised By:** Kimi + Claude
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Search
**Summary:** The initial specification defined a minimal search index containing `id`, `title`, `description`, `tags`, `content_type`, `status`, and `related`. Kimi proposed a significantly expanded index including `aliases`, `mental_trigger`, `keywords`, `problem_statements`, `decision_terms`, `error_messages`, `package_names`, and `model_names`. Claude independently flagged that `mental_trigger` and `error_messages` were high-value missing fields.
**Decision:** Partially Accepted
**Reasoning:** The core additions are accepted: `aliases`, `mental_trigger`, `problem_statement`, `error_messages`, and `keywords`. These directly serve the Search-First Architecture principle and represent fields that engineers would plausibly search by mid-problem. Rejected from Kimi's expanded list: `decision_terms`, `package_names`, and `model_names`. These are implementation-specific terms that would introduce search noise rather than signal — they are implicit in the content and recoverable through `keywords` if a maintainer chooses to add them there. The `keywords` field (RFD-024) is the correct mechanism for any informal terminology not captured by other fields.
**Repository Sections Affected:** Section 8 (Search Architecture), Section 9 (Search Index Contract)
**Final Resolution:** Search field registry in Section 8 expanded to include a weighted table of all indexed fields: `id`, `title`, `aliases`, `keywords`, `description`, `tags`, `mental_trigger`, `problem_statement`, `error_messages`, `content_type`, `status`, `stability`. Each field carries a defined weight tier or filter designation. Unweighted catch-all terms (`decision_terms`, `package_names`, `model_names`) rejected as they belong in `keywords` if needed.
**Implementation Impact:** Medium — affects search index generator, which must extract more fields from content files.

---

### RFD-011
**Title:** TypeScript as canonical source vs parallel maintenance
**Raised By:** Kimi
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Schema
**Summary:** Kimi proposed that TypeScript interfaces should be the canonical source of truth, with JSON Schemas generated from them (or kept strictly synchronized). The rationale was that TypeScript-first systems avoid dual-maintenance burden and ensure type safety at the implementation layer.
**Decision:** Rejected
**Reasoning:** Auto-generation from TypeScript to JSON Schema adds build tooling dependency that a single maintainer must sustain indefinitely. The tooling ecosystem for TypeScript-to-JSON-Schema generation (ts-json-schema-generator, zod, etc.) requires version management, configuration, and occasional manual correction of generated output. For a frozen schema with rare changes, the maintenance burden of the tooling exceeds the maintenance burden of manual synchronization. The specification correctly establishes JSON Schema as authoritative because it is the validation enforcement layer — TypeScript types are a developer convenience. Manual synchronization of a stable, rarely-changing schema is low burden. Architectural Principle R3 (Maintainability Over Elegance) directly governs this decision.
**Repository Sections Affected:** Section 12 (TypeScript Type Architecture)
**Final Resolution:** TypeScript types maintained in parallel with JSON Schemas. JSON Schema is authoritative when the two disagree. `scripts/audit.js` includes a type-schema sync check that reports field name and required/optional status discrepancies as audit findings. No auto-generation tooling is introduced.
**Implementation Impact:** None — no change from revised specification.

---

### RFD-012
**Title:** Navigation metadata in BaseMeta
**Raised By:** Kimi
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Metadata
**Summary:** Kimi proposed adding navigation-oriented fields to BaseMeta: `breadcrumbs`, `section`, `difficulty`, `estimated_read_time`, and `priority`. The rationale was that frontend search and navigation would benefit from these fields being available in the content files.
**Decision:** Rejected
**Reasoning:** These fields are frontend concerns, not content concerns. Breadcrumbs are derived from the navigation hierarchy and content type at render time — they are not authored in content files. `difficulty` and `estimated_read_time` are qualitative assessments that have no schema-enforceable accuracy and would require ongoing maintenance as content changes. `section` is equivalent to `category` which is handled through `metadata/categories.json`. `priority` is an editorial judgment that changes as the system grows and is not appropriate as a stable content field. Adding these to BaseMeta violates Principle R1 (One Source, Many References) by placing frontend rendering concerns in the content layer. BaseMeta is responsible for identity, discoverability, lifecycle, and provenance — not for frontend display optimization.
**Repository Sections Affected:** Section 4 (BaseMeta), Section 5 (Content Metadata Responsibilities)
**Final Resolution:** No navigation metadata fields added to BaseMeta. The responsibility boundary table in Section 5 explicitly assigns frontend display concerns to the frontend layer.
**Implementation Impact:** None.

---

### RFD-013
**Title:** Data tier as first-class content type
**Raised By:** Kimi
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Repository
**Summary:** Kimi argued that data work represents 50–70% of an AI engineer's time and deserves its own content type covering data profiling, validation, preprocessing, augmentation, feature engineering, and versioning. This was also raised in the Architecture Freeze review.
**Decision:** Rejected
**Reasoning:** This decision was made at the Architecture Freeze level and is recorded in the Architecture Freeze Decision Document under "Explicitly Rejected — Data as a First-Class Content Tier." The reasoning: for a single engineer building ML, LLM, RAG, and Agentic systems, data preprocessing is a step within Workflows, not a separate knowledge domain. The Architecture Freeze is immutable without a formal revision process. Re-litigating a frozen decision at the specification level is not within the authority of this review. Architectural Invariant 8 (the content type set is closed) enforces this decision.
**Repository Sections Affected:** Section 17 (Extension Rules for Future Content Types)
**Final Resolution:** Data as a content type remains rejected. Data handling lives in Workflow Prerequisites and Implementation steps. Section 17 defines the qualification criteria and procedure for introducing a new content type in the future if this decision is ever revisited through a formal Architecture Freeze revision.
**Implementation Impact:** None.

---

### RFD-014
**Title:** `decision_notes` renamed to `decision_guide` for Package schema
**Raised By:** Kimi
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Schema
**Summary:** Kimi proposed renaming `decision_notes` on Package pages to `decision_guide` to match the terminology used on Model pages. The argument was that consistent naming reduces cognitive overhead when navigating between content types.
**Decision:** Rejected
**Reasoning:** The Architecture Freeze Decision Document explicitly preserves the distinction. `decision_notes` on Package pages is intentionally lightweight — a brief note about when to use one API over another within the same package. `decision_guide` on Model pages is a richer structured section with `use_when`, `avoid_when`, and `alternatives` arrays. The different names communicate different depth and scope. Renaming them to the same term would imply the same depth of content, which is incorrect and would mislead content authors. The Architecture Freeze review record specifically states: "I actually prefer the difference. Package Decision Notes is lightweight. Model Decision Guide is much richer. Different names communicate different depth. I wouldn't rename."
**Repository Sections Affected:** None — no change required.
**Final Resolution:** `decision_notes` (Package) and `decision_guide` (Model) remain as distinct fields with distinct depth semantics.
**Implementation Impact:** None.

---

### RFD-015
**Title:** Registry extensibility for future asset types
**Raised By:** Kimi
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Schema
**Summary:** The initial Registry schema defined `asset_type` as an enum of `model | dataset | service`. Kimi noted that the Registry will eventually need to accommodate embedding models, rerankers, vector databases, inference engines, APIs, and SDKs as distinct asset types rather than forcing them all into a generic `service` category.
**Decision:** Partially Accepted
**Reasoning:** The concern is valid for long-term maintainability. However, the resolution is not to expand the enum now — it is to ensure the enum is defined in `aens.config.json` rather than hardcoded in the schema. This means adding new asset types requires only a config change and a minor schema version increment, not a major schema revision. The current three types (`model | dataset | service`) are sufficient for v2. The extensibility mechanism is the accepted resolution; the immediate expansion of the enum is rejected as premature.
**Repository Sections Affected:** Section 10 (JSON Schema Architecture), Section 14 (Configuration Architecture)
**Final Resolution:** `asset_type` enum values are defined in `aens.config.json` under `asset_types`. The schema references the config-defined list. New asset types are added via config change and minor schema version increment. Current v2 values: `model | dataset | service`. The `service` category is the current catch-all for embedding models, rerankers, vector databases, inference engines, APIs, and SDKs until the volume of any specific type justifies its own enum value.
**Implementation Impact:** Low — affects how `aens.config.json` defines asset types and how the schema references them.

---

### RFD-016
**Title:** Validation script scope: link integrity, duplicates, circular references
**Raised By:** Kimi + Claude
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Validation
**Summary:** Both reviewers identified that the initial validation architecture was limited to schema validation and did not cover cross-reference integrity, duplicate ID detection, or alias collision detection. Kimi additionally raised circular reference detection. Claude raised that stale cross-links are a maintenance liability that the architecture must address systematically.
**Decision:** Accepted
**Reasoning:** A relationship system with no cross-reference validation is a liability that degrades silently. Dangling references, duplicate IDs, and alias collisions are architecture violations (Invariants 2 and 9) that require enforcement mechanisms. Circular reference detection was evaluated and narrowly scoped — circular references in `relationships` arrays are not inherently invalid (a workflow can reference a package that references the workflow), but circular `parent` references in index/child hierarchies are structural errors. Only the latter requires detection.
**Repository Sections Affected:** Section 13 (Validation Architecture)
**Final Resolution:** Four-layer validation architecture defined. Layer 3 (Cross-Reference Validation) handles: ID existence checks for all `relationships` entries; bidirectional relationship checks (warning, not error); `deprecated.replaced_by` existence and non-deprecated status; `parent` field resolution for child files; alias registration in `metadata/aliases.json`; alias collision detection (hard failure). Circular `parent` references detected in Layer 3. `scripts/audit.js` handles repository-level duplicate ID detection and alias collision in `metadata/aliases.json`.
**Implementation Impact:** High — Layer 3 validation requires full content directory loading and graph traversal. Significant implementation scope for `validate.js`.

---

### RFD-017
**Title:** Machine-readable migration report
**Raised By:** Kimi + Claude
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Migration
**Summary:** The initial specification specified only a human-readable `migration-log.md`. Kimi proposed a `migration-report.json` machine-readable output. Claude independently proposed the same. Both noted that a machine-readable report enables future tooling to query migration history and audit completion status without parsing Markdown.
**Decision:** Accepted
**Reasoning:** A machine-readable migration report adds negligible authoring overhead (it is generated by the migration script, not written by hand) and provides meaningful future value. As the repository grows, being able to programmatically query "how many files were migrated in phase 2, how many are in the review queue, how many failed" is a maintenance tool, not a luxury. The two formats serve different audiences: `migration-log.md` is for human narrative, `migration-report.json` is for tooling.
**Repository Sections Affected:** Section 2 (Repository Structure), Section 15 (Migration Architecture)
**Final Resolution:** `docs/migration/migration-report.json` added as a generated artifact produced by every `scripts/migrate.js` run. Contains: timestamp, task name, files processed, succeeded, failed with error details, warnings, and review queue additions. `docs/migration/migration-log.md` retained as human-readable narrative. Both live in `docs/migration/`. The `docs/migration/` subdirectory is established as the canonical location for all migration artifacts.
**Implementation Impact:** Low — the migration script generates this file; no manual authoring required.

---

### RFD-018
**Title:** `metadata/` directory for controlled vocabularies
**Raised By:** Kimi
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Metadata
**Summary:** Kimi proposed a dedicated `metadata/` directory containing `tags.json`, `aliases.json`, `navigation.json`, and `categories.json` as system-wide controlled vocabulary files rather than allowing vocabulary to be implicitly defined within content files.
**Decision:** Accepted (with scope reduction)
**Reasoning:** Controlled vocabularies are essential for a system where tag consistency, alias uniqueness, and category coherence must be maintained across hundreds of content files. Without a canonical vocabulary source, individual content files will drift: the same concept gets different tags, the same package gets different aliases, and search quality degrades over time. The proposal is accepted with `navigation.json` removed. Navigation structure is frontend-specific and belongs in the frontend layer, not in the content metadata layer. The three accepted files (`tags.json`, `aliases.json`, `categories.json`) cover the vocabulary concerns that belong to the content and search architecture layers.
**Repository Sections Affected:** Section 2 (Repository Structure), Section 16 (Machine-Readable Repository Metadata)
**Final Resolution:** `metadata/` directory with three files: `tags.json` (controlled tag vocabulary with descriptions and categories), `aliases.json` (alias registry and ID registry with collision prevention), `categories.json` (navigational grouping definitions). All three files are consulted by Layer 4 validation. `navigation.json` rejected.
**Implementation Impact:** Medium — affects search index generator, Layer 4 validation, and content authoring workflow.

---

### RFD-019
**Title:** Cross-link typed relationships (`depends_on`, `replaces`, `requires`, `complements`)
**Raised By:** Kimi
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Schema
**Summary:** Kimi proposed replacing the generic `relationships` object with explicitly typed link objects where each relationship carries a `type` field indicating its semantic role. This would enable more precise graph traversal and relationship queries.
**Decision:** Rejected
**Reasoning:** This decision was made explicitly in the Architecture Freeze Decision Document: "Maintaining link type accuracy across hundreds of cross-references introduces a correctness burden that will either be ignored (making it useless) or maintained incorrectly (making it worse than untyped links). Generic 'Related Content' sections, maintained honestly, are more reliable than typed links maintained poorly." This is a direct application of Architectural Principle R3 (Maintainability Over Elegance). The structured object by content type (RFD-002) provides sufficient relationship semantics — "what packages relate to this workflow?" — without requiring per-entry type declarations that a single maintainer cannot reliably maintain.
**Repository Sections Affected:** Section 7 (Relationship Model)
**Final Resolution:** Typed cross-links rejected. The `relationships` object with five named arrays remains the final design. The rationale for this rejection is recorded in Section 7 and in the Architecture Freeze Decision Document.
**Implementation Impact:** None.

---

### RFD-020
**Title:** Production Notes ownership ambiguity
**Raised By:** Claude
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Metadata
**Summary:** The initial specification stated that Production Notes are owned exclusively by Workflow pages. Claude identified that this creates a gap: package-specific production facts (PyTorch's `torch.compile`, inference mode, CUDA graphs) and model-specific production facts (XGBoost thread safety, serialization format) are not workflow-specific and do not belong in any particular workflow. Assigning them to Workflow pages only would require duplicating them across every workflow that uses the package or model.
**Decision:** Accepted
**Reasoning:** The Architecture Freeze Document's final position on this is explicit: "Each layer owns only its own concern. Workflow pages own production strategy, deployment architecture, scaling, monitoring. Model pages keep concise model-specific production considerations. Package pages keep concise package-specific production considerations. Avoid any duplicated ownership." The original specification's overcorrection (Workflow-only ownership) contradicted the Architecture Freeze. The layered ownership model is the correct resolution.
**Repository Sections Affected:** Section 4 (BaseMeta — `production_considerations` field), Section 5 (Content Metadata Responsibilities — responsibility table), Architectural Invariant 3
**Final Resolution:** Three-tier production notes ownership. Workflow pages own production strategy, deployment architecture, scaling, and monitoring. Model pages carry `production_considerations` as a string field (max 300 characters) for entity-specific facts. Package pages carry `production_considerations` as a string field (max 300 characters) for entity-specific facts. The 300-character limit enforces conciseness. Length is enforced by the JSON Schema `maxLength` constraint. Ownership test: if the fact is true regardless of workflow context, it belongs on Model or Package. If it only makes sense within a deployment pipeline, it belongs on Workflow.
**Implementation Impact:** Medium — affects Model and Package schema (adding `production_considerations`), TypeScript types, and validation.

---

### RFD-021
**Title:** Cheatsheet and Package Common Tasks boundary rule
**Raised By:** Claude
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Governance
**Summary:** Claude identified that without a hard rule defining what distinguishes a Cheatsheet entry from a Package Common Task, the two content types will drift and contradict each other over time. An engineer would not know which to consult.
**Decision:** Accepted
**Reasoning:** The Architecture Freeze Decision Document defines this boundary explicitly: "Package Common Tasks: top 15 APIs maximum, full context — parameters, gotchas, mental trigger, example. Cheatsheet: top 30 APIs maximum, minimal context — syntax, one-line description, link to Package page. They serve different depths, not different content." This rule must be encoded in the schema and stated in the specification to be enforceable.
**Repository Sections Affected:** Section 10 (JSON Schema Architecture), Section 13 (Validation Architecture — Layer 2 constraint)
**Final Resolution:** Boundary rule encoded in schema constraints and documented in the specification. Package Common Tasks: max 15 entries, each with full context (purpose, example, gotchas). Cheatsheet entries: max 30 entries, each with minimal context (syntax, one-liner only). Cheatsheets must carry a `linked_package` field pointing to the source Package page. Different depth, not different content — this principle is the authoritative rule for future content placement decisions.
**Implementation Impact:** Low — schema constraints and one additional field in Cheatsheet schema.

---

### RFD-022
**Title:** Split content and index file pattern
**Raised By:** Claude
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Repository
**Summary:** The specification defined size budgets as mandatory constraints but did not define what happens when a content entity legitimately exceeds a budget. Claude identified that without a defined split pattern, maintainers would either ignore the constraints or handle splits inconsistently.
**Decision:** Accepted
**Reasoning:** A mandatory constraint without an enforcement mechanism and a defined resolution path is not a constraint — it is aspirational guidance. The split pattern is the defined resolution path for budget violations. It must be specified in the architecture, not left to per-case improvisation.
**Repository Sections Affected:** Section 3 (Content Directory Strategy), Section 4 (BaseMeta — `content_role` field)
**Final Resolution:** Split content pattern defined: the original file becomes an index file retaining the original slug and ID. Index file replaces its content array with a `children` array of child IDs. Child files carry qualified slugs (`numpy-array-ops`, `numpy-linear-algebra`). Both index and child files carry `content_role` (RFD-023). This is the only permitted nesting pattern. It is declared explicitly in files, never inferred from directory structure. Child files are excluded from default search results; index files are included.
**Implementation Impact:** Medium — affects validation (child file detection), search index generator (exclusion of child files), and content authoring guidelines.

---

### RFD-023
**Title:** `content_role` field for index and child files
**Raised By:** Claude
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Schema
**Summary:** The split content pattern (RFD-022) requires tooling to distinguish standard content files, index files, and child files. Without an explicit field, this distinction must be inferred from file content or directory position — both are fragile approaches.
**Decision:** Accepted
**Reasoning:** Principle R5 (Explicit Over Implicit) directly governs this decision. Inferring file role from content structure or directory position violates this principle. An explicit `content_role` field makes the distinction unambiguous for all tooling: validators, search index generators, and frontend renderers.
**Repository Sections Affected:** Section 4 (BaseMeta), Section 3 (Content Directory Strategy)
**Final Resolution:** `content_role` added to BaseMeta as a required enum field: `standard | index | child`. Default value is `standard`. `index` files have a `children` array. `child` files have a `parent` field. `standard` files have neither. The `parent` field is a structural pointer that exists outside the `relationships` object in BaseMeta, because it is a structural hierarchy declaration rather than a knowledge graph relationship.
**Implementation Impact:** Low — one field added to BaseMeta. Affects validation, search index generator, and TypeScript types.

---

### RFD-024
**Title:** `keywords` field distinct from `aliases` and `tags`
**Raised By:** Both (Claude indexed error messages; Kimi proposed informal terms)
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Metadata
**Summary:** Claude proposed indexing `error_messages` for error-driven search. Kimi proposed indexing informal terms, decision terms, and package/model names. Both identified a gap between the formal taxonomy (`tags`) and the formal alternate names (`aliases`) — there was no field for informal, uncontrolled search terms that improve recall without polluting the taxonomy.
**Decision:** Accepted
**Reasoning:** Three distinct search term categories serve different purposes and should not be conflated. `tags` are controlled vocabulary for filtering and faceting. `aliases` are registered alternate names for exact-match resolution. `keywords` are informal, uncontrolled terms — error message fragments, common variable names, informal concepts — that improve search recall without requiring taxonomy governance. Conflating them would either require governing all informal terms (high maintenance) or contaminating the controlled taxonomy (degrades filter quality). A separate `keywords` field with no controlled vocabulary requirement is the correct resolution.
**Repository Sections Affected:** Section 4 (BaseMeta), Section 8 (Search Architecture)
**Final Resolution:** `keywords: string[]` added to BaseMeta. Not validated against any controlled vocabulary. Indexed for search at high weight. Includes error message fragments, informal terminology, common abbreviations that are not suitable as registered aliases. `error_messages` from Package `debugging[].error` fields are also indexed separately at high weight for error-driven search — they are not placed in `keywords` because they are structured content, not BaseMeta fields.
**Implementation Impact:** Low — one field added to BaseMeta. Search index generator updated to extract and index it.

---

### RFD-025
**Title:** `docs/migration/` subdirectory for migration artifacts
**Raised By:** Review Board
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Repository
**Summary:** The initial specification placed `migration-log.md` and `review-queue.md` at the top level of `docs/`. With the addition of `migration-report.json` (RFD-017), three migration artifacts would clutter `docs/` if not grouped.
**Decision:** Accepted
**Reasoning:** Grouping migration artifacts in a dedicated subdirectory keeps `docs/` navigable as the repository scales. Migration artifacts are consulted as a group during migration phases and audits — they belong together. This is a minor structural improvement with no architectural implications.
**Repository Sections Affected:** Section 2 (Repository Structure), Section 15 (Migration Architecture)
**Final Resolution:** `docs/migration/` subdirectory established as the canonical location for: `migration-log.md`, `migration-report.json`, `review-queue.md`. All references in the specification updated accordingly.
**Implementation Impact:** Low — directory naming only.

---

### RFD-026
**Title:** ADR strategy missing from specification
**Raised By:** Review Board
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Governance
**Summary:** The initial specification made multiple architectural decisions without defining how those decisions would be recorded for future maintainers. Without an ADR strategy, future decisions have no structured rationale trail and future maintainers cannot understand why the architecture is the way it is.
**Decision:** Accepted
**Reasoning:** A repository intended to operate for many years requires a decision audit trail. Without ADRs, every future maintainer must reconstruct reasoning from conversation history or accept architectural decisions as unexplained givens. ADRs are low-overhead (one Markdown file per decision) and high-value (permanent rationale record). Section 19 defines the format, the triggers, and the immutability rule.
**Repository Sections Affected:** Section 2 (Repository Structure — `docs/adr/`), Section 19 (ADR Strategy)
**Final Resolution:** Section 19 added to specification. ADR format defined (Title, Date, Status, Context, Decision, Rationale, Consequences, Supersedes). Triggers defined (structural changes, new content types, major schema versions, validation architecture changes, principle changes, invariant changes). ADR immutability rule defined. `adr-001-repository-foundation.md` designated as the first ADR acknowledging this specification.
**Implementation Impact:** Low — documentation process, no tooling changes required.

---

### RFD-027
**Title:** Backward compatibility policy undefined
**Raised By:** Review Board
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Governance
**Summary:** The specification defined schema versioning mechanics but did not define the compatibility guarantees associated with minor vs major version changes. Without explicit policy, future schema changes would be made without a consistent framework.
**Decision:** Accepted
**Reasoning:** Backward compatibility policy is a prerequisite for a multi-year schema evolution strategy. Without it, minor version changes might introduce breaking changes (invalidating the minor/major distinction) and major version changes might happen without proper migration procedures. The policy must be explicit before the first schema version is frozen.
**Repository Sections Affected:** Section 18 (Backward Compatibility Policy)
**Final Resolution:** Section 18 defines: minor version changes are strictly additive (new optional fields only, no removals, no renames); major version changes permit breaking changes with explicit migration; schema files are never deleted; v2 files remain validatable against v2 schemas indefinitely; no silent deprecation rule (a content entity cannot be deprecated without completing the full deprecation procedure).
**Implementation Impact:** Low — policy document. Affects schema evolution procedures but no current implementation.

---

### RFD-028
**Title:** Extension rules for future content types undefined
**Raised By:** Review Board
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Governance
**Summary:** The Architecture Freeze closes the content type set but provides no procedure for the eventual case where a new content type might legitimately qualify. Without a defined procedure, any future extension would be improvised and potentially inconsistent.
**Decision:** Accepted
**Reasoning:** Defining the extension procedure now costs nothing and prevents future improvisation. The procedure enforces the same rigor as the original architecture design — qualification criteria, ADR requirement, experimental period — while acknowledging that AENS may legitimately grow over a multi-year horizon. The procedure is conservative by design: five concrete instances must exist before a type is introduced; the type must be genuinely unreservable in existing types.
**Repository Sections Affected:** Section 17 (Extension Rules for Future Content Types), Architectural Invariant 8
**Final Resolution:** Section 17 defines: qualification criteria (three conditions, all must be met); extension procedure (ADR → review → config update → schema file → TypeScript type → metadata update → search index update → validation update); 90-day experimental period before schema freeze. Invariant 8 records the closed content type set and references Section 17 as the revision path.
**Implementation Impact:** None at v2. Defines procedure for future decisions.

---

### RFD-029
**Title:** `aens.config.json` as single constraint source
**Raised By:** Claude
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Configuration
**Summary:** Claude identified that architectural constants (size budgets, content types, schema versions) could end up hardcoded in multiple locations — schema files, validation scripts, TypeScript types — creating inconsistency risks when any value changes.
**Decision:** Accepted
**Reasoning:** Principle R4 (Configuration is Centralized) directly governs this decision. A constraint value hardcoded in a validation script and also hardcoded in a schema file is two maintenance points. When the value changes, both must be updated consistently. The config-as-single-source pattern ensures one update propagates to all consumers. The schema is the enforcement source; config mirrors the value for programmatic access by scripts. When they disagree, the schema wins and config is corrected.
**Repository Sections Affected:** Section 14 (Configuration Architecture), Architectural Invariant 7
**Final Resolution:** `aens.config.json` defined as the single source for all architectural constraint values. Schema files enforce constraints via `maxItems` and other keywords. Scripts read constraint values from config rather than defining them internally. Architectural Invariant 7 records this as a permanent rule. The only config field that changes without an ADR is `last_audit_at` (audit timestamp).
**Implementation Impact:** Medium — all scripts must read constraints from `aens.config.json` rather than hardcoding values.

---

### RFD-030
**Title:** Alias collision as hard validation failure
**Raised By:** Review Board
**Decision Date:** 2026-06-29
**Supersedes:** None
**Category:** Validation
**Summary:** With `aliases` added to BaseMeta (RFD-003) and `metadata/aliases.json` as the alias registry (RFD-018), the question of what happens when two content entities register the same alias required an explicit decision. Without a collision rule, an alias could silently resolve to the wrong content entity.
**Decision:** Accepted
**Reasoning:** An alias collision means an engineer searching for "np" could be routed to either of two content entities depending on which was indexed last. This is a correctness failure in a system whose primary purpose is reliable information retrieval. Alias collisions must be hard failures, not warnings, because there is no correct resolution that does not require human intervention. Only a human can determine which entity legitimately owns an ambiguous alias and whether the other entity needs a different alias.
**Repository Sections Affected:** Section 4 (BaseMeta — alias registration rule), Section 13 (Validation Architecture — Layer 3), Section 16 (Machine-Readable Repository Metadata)
**Final Resolution:** Alias collision defined as a hard Layer 3 validation failure (exit code 1, not a warning). `metadata/aliases.json` is the collision detection registry. The audit script additionally checks for collisions across the full alias registry as a repository-level health check. Resolution requires human intervention: determine canonical owner, assign distinct aliases to the other entity, update both content files and `metadata/aliases.json`.
**Implementation Impact:** Medium — Layer 3 validation must load the full alias registry and check for collisions before validating any individual file's aliases.

---

## Related ADRs

*This section will be populated as ADRs are created that reference decisions recorded in this register.*

---

## Summary Statistics

| Decision | Count |
|---|---|
| Accepted | 22 |
| Partially Accepted | 4 |
| Rejected | 4 |
| **Total Issues Reviewed** | **30** |

---

## Freeze Authorization

All thirty issues raised during the Claude and Kimi audits have been reviewed and resolved. The decisions recorded in this register are reflected in the Final Revised Repository Foundation Specification (v1.1).

No issues remain open. No decisions are deferred.

**Step 2A is authorized for freeze.**
**Step 2B implementation may proceed against the Final Revised Repository Foundation Specification.**

---

*This register is permanently immutable. Future revisions are recorded in a new Decision Register. The new register references the previous register as superseded; the previous register itself is never edited.*