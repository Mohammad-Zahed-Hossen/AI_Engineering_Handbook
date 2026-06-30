# Critical Audit: AENS v2 Repository Foundation Specification

**Audit Scope:** Architectural consistency, missing contracts, hidden maintenance risks, and violations of the Architecture Freeze principles.  
**Audit Method:** Cross-reference of Repository Foundation Specification (`docs/migration/AENS v2 — Repository Foundation Specification.md`) against the Architecture Freeze Decision Document (`docs/migration/AENS v2 — Architecture Freeze Decision Document.md`).  
**Auditor Position:** No redesign. Only defects.

---

## Executive Summary

The specification is **75% sound** but contains **five freeze-blocking issues** that undermine the architectural principles the document claims to enforce. Several "nice-to-have" structural choices introduce hidden maintenance costs that will compound for a single maintainer. The most dangerous category is **internal contradictions** — the specification violates its own invariants.

---

## Category 1: Freeze-Blocking Issues (Must Fix Before Implementation)

### Issue 1: **Invariant 6 Directly Contradicts Section 11**

**The Problem:**  
- **Invariant 6** states: *"Schema files in `schema/v2/` are never modified after the v2 freeze. The schema directory is append-only at the version level."*
- **Section 11** states: *"New minor version → add optional fields to existing schemas in `schema/v2/` → existing content remains valid."*

**Impact:** These are mutually exclusive. You cannot both freeze `schema/v2/` and add new fields to it. Minor version increments require modifying files in `schema/v2/`.

**The Freeze Violation:** This is a direct contradiction of Invariant 6. If implemented literally, the repository can never evolve without a major version bump for every new optional field.

**Required Fix:** Clarify that Invariant 6 means **"schemas in `schema/v2/` are never modified in ways that break existing v2 content"** — i.e., backward-compatible additions (new optional fields) are permitted, but breaking changes (renaming, removing, or adding required fields) require `schema/v3/`. Or, move Invariant 6 to apply only to major versions.

---

### Issue 2: **`deprecated` Object Redundantly Duplicates `status`**

**The Problem:**  
BaseMeta defines:
- `status` enum: `draft | stub | complete | deprecated`
- `deprecated` object: contains `is_deprecated: true` and `replaced_by`

If `status === "deprecated"`, then `deprecated.is_deprecated` is **always true**. It adds no information. If `status !== "deprecated"`, the `deprecated` object should not exist.

**Impact:** Two sources of truth for deprecation status. A content file could theoretically have `status: "complete"` with `deprecated.is_deprecated: true`, or `status: "deprecated"` with no `deprecated` object. The validator has no rule for this.

**The Freeze Violation:** Principle R1 (*One Source, Many References*) — deprecation status is in two places.

**Required Fix:** Remove `is_deprecated` from the `deprecated` object. The object should only contain `replaced_by` (required) and `reason` (optional). The `status` field alone owns the deprecation state.

---

### Issue 3: **Search Architecture Expects `mental_trigger` on Workflows, but Workflow Schema Does Not Have It**

**The Problem:**  
- **Section 8** (Search Architecture): *"`mental_trigger` — indexed for workflow and package content types, this is the highest-value search field for the target use case."*
- **Migration Plan's `workflow.schema.json`**: The additional required fields are `entry_points`, `prerequisites`, `pipeline_failure_patterns`, `steps`, `production_notes`. No `mental_trigger`.

**Impact:** The search-index generator will attempt to extract a field that does not exist in the schema. This is a contract gap between the search layer and the content layer.

**The Freeze Violation:** Principle 8 (*Search-First Architecture*) — search is designed into the content layer, but the content layer lacks the field search depends on.

**Required Fix:** Add `mental_trigger` (string) to `workflow.schema.json` as a required field, OR remove `mental_trigger` from the search-indexed fields and relegate it to Package-only.

---

### Issue 4: **`aliases` Duplicated Between `metadata/aliases.json` and Content Files**

**The Problem:**  
- **Section 4**: *"aliases are registered in `metadata/aliases.json` as the system-wide canonical list and are also present in the content file for self-containment."*
- **Section 16**: *"The `metadata/` files are the canonical source of all tags and aliases."*

**Impact:** Two sources of truth. If `metadata/aliases.json` says `alias: "np" → canonical_id: "package:numpy"`, but the `package:numpy` file has `aliases: ["numpy", "numerical-python"]` (missing "np"), which wins? The spec provides no synchronization mechanism, no validation rule for disagreements, and no specification of which is authoritative during search indexing.

**The Freeze Violation:** Principle 2 (*Single Owner, Single Source*) — aliases are owned by two locations. Principle R1 (*One Source, Many References*) — content files should reference the canonical alias list, not duplicate it.

**Required Fix:** One of:
- **Option A (Recommended):** Content files reference `metadata/aliases.json` via a lookup. The `aliases` field in content files is removed. Search reads from `metadata/aliases.json`.
- **Option B:** `aliases` live only in content files. `metadata/aliases.json` is auto-generated from content files (derived artifact, like `search-index.json`). Collision detection runs during generation.

---

### Issue 5: **Schema and Config Are Two Sources of Truth for Constraints**

**The Problem:**  
- **Section 10**: *"Hard limits... are expressed as `maxItems` constraints in the schema. They are also present in `aens.config.json` for programmatic access. The schema is the source of truth."*
- **Section 13 (Layer 2):** *"Reads `aens.config.json` and checks that content-specific size budgets are honored."*

**Impact:** If `schema/v2/package.schema.json` has `maxItems: 15` on `common_tasks`, but `aens.config.json` has `package_max_common_tasks: 20`, which is correct? The schema says it is the source of truth, but the validator reads from config for human-readable error messages. If they disagree, the validator will enforce the config value while the schema enforces a different value. A content file could pass schema validation but fail constraint validation, or vice versa.

**The Freeze Violation:** Principle R2 (*Schema is the Contract*) — the schema claims to be the source of truth, but the validator is wired to a different source.

**Required Fix:** Either:
- Remove `maxItems` from schemas and let config be the sole constraint source (with schema remaining structurally valid but not enforcing size limits).
- Or, have the validator verify that config values match schema `maxItems` at startup, and fail if they disagree. This is the "single source" solution.

---

## Category 2: Missing Contracts (Will Cause Ambiguity During Implementation)

### Issue 6: **`metadata/` Files Have No Schemas

**The Problem:** `tags.json`, `aliases.json`, and `categories.json` are described structurally but have no JSON Schema files. They are "modified as part of major schema version decisions" but have no validation contract.

**Impact:** Format drift over time. The first time someone edits `tags.json` and introduces a malformed entry, the validation script will fail with an unhelpful error.

**Required Fix:** Add `schema/v2/metadata.schema.json` or individual schemas: `tags.schema.json`, `aliases.schema.json`, `categories.schema.json`.

---

### Issue 7: **`search-index.json` Has No Schema or Contract**

**The Problem:** Section 9 explicitly says: *"The search index is not a content file — it does not have a schema or a validation contract."* Yet the frontend will consume it.

**Impact:** The search-index generator can produce any shape, and nothing validates it. A bug in `search-index.js` (e.g., a missing field, a typo in a key name) will only be discovered when the frontend fails to render search results.

**Required Fix:** Add an implicit contract at minimum — a comment block in `search-index.js` that defines the exact output shape, or a lightweight JSON Schema that is validated in CI. Even a JSDoc type definition would be better than nothing.

---

### Issue 8: **No Schema for `aens.config.json`**

**The Problem:** This file is described as "an architectural contract expressed as data" and "part of the frozen architecture." It is read by all scripts. It has no schema.

**Impact:** Typos, missing fields, or wrong types in `aens.config.json` will cause scripts to fail at runtime with unclear errors. A malformed config could corrupt the entire validation pipeline.

**Required Fix:** Add `aens.config.schema.json` to `schema/` and validate `aens.config.json` against it before any script proceeds.

---

### Issue 9: **No `category` Field in BaseMeta, Despite `categories.json` Existing**

**The Problem:** `metadata/categories.json` defines categories, but BaseMeta has no `category` field. Content files cannot declare which category they belong to.

**Impact:** Categories are defined but unused. Navigation grouping by category is impossible without manual curation.

**Required Fix:** Either add `category` (string, drawn from `metadata/categories.json`) to BaseMeta, or remove `categories.json` from the architecture as unused baggage.

---

### Issue 10: **No Stability Tier Review Cadence Defined**

**The Problem:** Section 13 (Audit Script) checks *"files with `status: complete` and `verified_at` older than their stability tier implies."* But nowhere are the actual review cadences defined.

**Impact:** The audit script cannot implement this check without hardcoding values.

**Required Fix:** Add to `aens.config.json`:
```json
"review_cadences": {
  "stable": 365,
  "semi_stable": 90,
  "volatile": 30
}
```

---

### Issue 11: **No `schema_version` to Directory Mapping Contract**

**The Problem:** Content files have `schema_version: "2.0"`. Schemas live in `schema/v2/`. The mapping from `"2.0"` to `v2` is implicit. What about `"2.1"`? `"2.0.1"`? `"3.0"`?

**Impact:** The validator must implement an implicit parsing rule. Different implementations might map differently.

**Required Fix:** Add to `aens.config.json`:
```json
"schema_version_mapping": {
  "2.0": "schema/v2",
  "2.1": "schema/v2",
  "3.0": "schema/v3"
}
```

---

### Issue 12: **No Constraint-to-Field Mapping in Config**

**The Problem:** `aens.config.json` has `workflow_max_steps: 8`, but the schema field is `steps`. The validator must know that `workflow_max_steps` maps to `steps.length`. This mapping is implicit.

**Impact:** The validator script must hardcode this mapping. Violates Invariant 7 (no hardcoded constraints).

**Required Fix:** Add a mapping structure to config:
```json
"constraint_mappings": {
  "workflow_max_steps": "steps",
  "package_max_common_tasks": "common_tasks",
  "cheatsheet_max_entries": "entries"
}
```

---

### Issue 13: **No Validation Rule for `deprecated` Object Presence**

**The Problem:** What if `status: "deprecated"` but `deprecated` object is missing? What if `status: "complete"` but `deprecated` object exists?

**Impact:** Ambiguous state. The validator has no rule.

**Required Fix:** Add to Layer 4 (Semantic Validation):
- `status === "deprecated"` → `deprecated` object MUST exist.
- `status !== "deprecated"` → `deprecated` object MUST NOT exist.

---

### Issue 14: **No `replaced_by` Non-Deprecated Requirement**

**The Problem:** `deprecated.replaced_by` points to another content entity. Could it point to a deprecated entity? A chain of `deprecated → deprecated → deprecated` is useless.

**Impact:** Engineers following deprecation chains will hit dead ends.

**Required Fix:** Layer 3 (Cross-Reference Validation) should verify that `replaced_by` resolves to an entity with `status !== "deprecated"`.

---

### Issue 15: **No Maximum Size on `aliases` or `tags`**

**The Problem:** Size budgets exist for `common_tasks` (15), `steps` (8), `entries` (30), but no limit on `aliases` or `tags`.

**Impact:** A content file with 200 aliases or 100 tags is valid under the schema but defeats the purpose of scannability.

**Required Fix:** Add `maxItems` to `aliases` and `tags` in `base.schema.json`. Suggest `aliases: 10 max`, `tags: 8 max`.

---

### Issue 16: **`sources` Required on All Content, But Not All Content Has External Sources**

**The Problem:** `sources` is a required BaseMeta field. But original content (e.g., an internal workflow pattern, a personal observation about model behavior) may have no external URL to cite.

**Impact:** Forces dummy entries like `{"title": "Original", "url": "n/a", "accessed_at": "2026-06-24"}` or encourages fabrication.

**Required Fix:** Make `sources` optional, or allow `sources: []` with a minimum of 0 items. Alternatively, add a `"source_type": "original"` option.

---

### Issue 17: **No `maxLength` on `description`**

**The Problem:** `description` is "one to three sentences." But the schema has no `maxLength`. A content author could write a 500-word description.

**Impact:** Descriptions become narratives, violating the execution-first philosophy.

**Required Fix:** Add `maxLength: 300` to `description` in `base.schema.json`.

---

### Issue 18: **No `maxLength` on `production_considerations` (Model & Package)**

**The Problem:** The Architecture Freeze specifies `max 300 characters` for Model and Package `production_considerations`. But the schema spec doesn't mention this limit.

**Impact:** The 300-character limit is unenforceable by schema.

**Required Fix:** Add `maxLength: 300` to `production_considerations` in `model.schema.json` and `package.schema.json`.

---

### Issue 19: **`accessed_at` Required for Sources, Even Timeless Ones**

**The Problem:** Every source object requires `accessed_at`. A citation to a classic paper (e.g., "Attention Is All You Need") has no meaningful access date.

**Impact:** Forces fabricated dates.

**Required Fix:** Make `accessed_at` optional, or allow `"timeless"` as a sentinel value.

---

### Issue 20: **No Schema Enforcement of `relationships` Array Element Types**

**The Problem:** The `relationships` object has arrays per content type: `workflows: string[]`, `models: string[]`, etc. But the string pattern only validates `type:slug` format. It does not validate that the `type` prefix matches the array key. `relationships.workflows` could contain `package:numpy` and the schema would not catch it.

**Impact:** Cross-reference pollution. A workflow could list a package under its `workflows` array.

**Required Fix:** JSON Schema 2020-12 supports `patternProperties` or `propertyNames` with dynamic validation, but a simpler fix is to define the pattern per array: `workflows` items must match `^workflow:[a-z0-9-]+$`, etc.

---

## Category 3: Hidden Maintenance Risks (Will Compound Over Time)

### Issue 21: **Manual TypeScript / JSON Schema Sync**

**The Problem:** Section 12: *"TypeScript types are not auto-generated from schemas, and schemas are not auto-generated from types. Both are maintained manually."*

**Impact:** For a single maintainer, this is guaranteed to drift. The spec says: *"If a TypeScript type and a JSON Schema field disagree, the resolution procedure is: consult this specification, update the non-authoritative layer to match, and log the discrepancy."* This procedure will be followed exactly zero times after the first month.

**The Freeze Violation:** Principle 7 (*Maintenance Cost Is a First-Class Architectural Criterion*) and Principle R3 (*Maintainability Over Elegance*). The manual sync is elegant (no build tooling) but unmaintainable.

**Required Fix:** Either accept the drift and drop the `types/` directory (relying on JSON Schema as the single contract), or add a one-time script that generates TypeScript from JSON Schema. Even a simple `json-schema-to-typescript` script run once at schema freeze would be better than manual maintenance.

---

### Issue 22: **`metadata/` Governance Overhead**

**The Problem:** Adding a new tag requires:
1. Editing `metadata/tags.json`
2. Updating `metadata/categories.json` if needed
3. Then using the tag in a content file

**Impact:** For a single maintainer, this friction will be ignored. Tags will be added to content files first, then retroactively to metadata, or not at all. The spec says *"an unregistered tag in a content file is a validation error"* — this will create a cycle of validation failures during content authoring.

**The Freeze Violation:** Principle 7 (*Maintenance Cost Is a First-Class Architectural Criterion*). The rejected Data tier was rejected for being too much maintenance, but `metadata/` governance may be equally burdensome.

**Required Fix:** Add a `scripts/normalize-metadata.js` script that:
- Reads all content files
- Extracts all tags and aliases
- Updates `metadata/tags.json` and `metadata/aliases.json` automatically
- Reports new additions for review

This makes metadata files **derived artifacts** (like `search-index.json`), not manually maintained vocabularies.

---

### Issue 23: **`scripts/audit.js` and `scripts/migrate.js` Both Write to `migration-report.json`**

**The Problem:** Section 15 says `migrate.js` produces `migration-report.json`. Section 13 says `audit.js` produces `migration-report.json`.

**Impact:** File collision. Two different scripts overwrite each other's output.

**Required Fix:** `audit.js` should produce `audit-report.json`.

---

### Issue 24: **Space-Separated Strings in `search-index.json` Break Aliases with Spaces**

**The Problem:** Section 9: *"Multi-value fields (tags, aliases) are represented as space-separated strings to maximize compatibility with search libraries."*

**Impact:** An alias like `"numpy library"` becomes indistinguishable from two separate aliases `"numpy"` and `"library"` in a space-separated string. Search indexing will be incorrect.

**Required Fix:** Use JSON arrays in `search-index.json`. If the search library requires space-separated strings, the transformation happens at the frontend or search adapter layer, not in the generated index.

---

### Issue 25: **90-Day Experimental Window Is Untracked**

**The Problem:** Section 17: *"The new type is considered experimental for 90 days after introduction."* But nothing tracks the introduction date.

**Impact:** The 90-day rule will be ignored. The author will forget which types are experimental and when the window expires.

**Required Fix:** Add an `experimental_since` field to the content type registration in `aens.config.json`, or remove the 90-day rule and rely on `status` (use `draft` until stable).

---

### Issue 26: **`version` vs `schema_version` Naming Confusion**

**The Problem:** `aens.config.json` has `"version": "2.0"` (system version). Content files have `"schema_version": "2.0"` (schema version). Same value, different semantics.

**Impact:** Confusion during debugging and migration. A developer might think they are the same thing.

**Required Fix:** Rename config field to `"system_version"` or `"aens_version"`.

---

### Issue 27: **No Size Budget on `relationships`**

**The Problem:** A content file could have 500 entries in `relationships.workflows`. No `maxItems` constraint exists on the relationship arrays.

**Impact:** Scannability is destroyed. The spec's size budgets (15 tasks, 8 steps) are designed to keep pages scannable, but relationships are unbounded.

**Required Fix:** Add `maxItems` per relationship array. Suggest 20 per type, 50 total.

---

### Issue 28: **No `maxLength` on `title` or `slug`**

**The Problem:** `slug` max 60 characters is documented in Section 6, but not in the schema. `title` has no maximum.

**Impact:** Extremely long titles break display layouts.

**Required Fix:** `title: maxLength 100`, `slug: maxLength 60`.

---

### Issue 29: **No Content-Type Validation on `id` Field**

**The Problem:** The `id` format is `type:slug`. But the schema does not validate that the `type` prefix matches the directory the file lives in. A file in `content/models/` could have `id: "package:numpy"`.

**Impact:** Cross-reference validation will fail later, but structural validation should catch this at Layer 1.

**Required Fix:** Layer 1 should validate that the `type` prefix in `id` matches the directory name.

---

### Issue 30: **Bidirectional Relationship Is a "Warning," Not an Error**

**The Problem:** Section 7: *"a relationship declared in one direction but not the other is a warning, not an error."*

**Impact:** In `--all` mode, warnings are likely to be ignored. The spec says relationships are *"declared bidirectionally by convention"* but does not enforce it. This means the graph is effectively directed, not undirected, which limits the usefulness of cross-reference traversal.

**Required Fix:** In `--all` validation mode, unidirectional relationships should be errors. They can remain warnings in `--file` mode (since the other file may not exist yet).

---

## Category 4: Minor Inconsistencies

### Issue 31: **`verified_at` vs `last_verified_at`**
The audit script description uses `verified_at` (Section 13), but the BaseMeta field is `last_verified_at` (Section 4). These should be the same name.

### Issue 32: **`asset_types` in Config**
`aens.config.json` has `"asset_types": ["model", "dataset", "service"]`. This name is ambiguous — it sounds like content types. Should be `"registry_asset_types"`.

### Issue 33: **`decision_notes` vs `decision_guide`**
The Migration Plan uses `decision_notes` (string) for Package and `decision_guide` (object) for Model. These serve the same cognitive purpose. The spec should acknowledge this asymmetry or rename for consistency.

### Issue 34: **Schema Version in Implementation Prompt**
The spec says JSON Schema 2020-12. The Migration Plan's Claude Code prompt says "draft-07 compatible." These are different. The implementation prompt will produce draft-07 schemas if followed literally.

### Issue 35: **`docs/` vs `doc/`**
The spec uses `docs/` but the existing repository may have `doc/`. This creates a second directory.

---

## Summary Table

| Category | Count | Severity |
|----------|-------|----------|
| Freeze-blocking contradictions | 5 | Critical |
| Missing contracts | 16 | High |
| Hidden maintenance risks | 10 | Medium |
| Minor inconsistencies | 5 | Low |

---

## Final Assessment

**Verdict: Needs Revision Before Implementation**

The Repository Foundation Specification is a **strong structural document** with good intentions, but it contains **internal contradictions** that would cause the implementation to deviate from the architecture from day one.

**The five freeze-blocking issues must be resolved before any schema file is written:**

1. **Invariant 6 vs minor version schema changes** — resolve the contradiction.
2. **`deprecated` object redundancy** — remove `is_deprecated`.
3. **`mental_trigger` missing from Workflow schema** — add it or remove from search.
4. **`aliases` duplicated** — choose one source of truth.
5. **Schema vs Config dual constraint sources** — enforce a single source.

**The missing contracts are the second-highest priority** because they will cause implementation ambiguity that the developer (or Claude Code) will resolve arbitrarily, leading to drift.

**The hidden maintenance risks are the third priority** because they will not break the system immediately, but they will degrade it over 12–24 months.

The specification is **not ready to freeze** as Step 2A. Fix the five blockers, add the missing contracts, and then proceed to Step 2B.