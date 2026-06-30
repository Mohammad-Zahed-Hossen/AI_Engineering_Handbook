# AENS Final Architecture Audit Report

**Date:** 2026-06-30  
**Auditor:** Independent Principal Software Architect / Review Board  
**Scope:** `docs/migration_v2/` — System-wide audit of all 8 migration specifications  
**Repository State:** Pre-implementation. Legacy architecture (`data/`, `lib/data.ts`, Zod schemas) remains active. Rebuild design layers are frozen for review.

---

## Executive Summary

### Overall Readiness Score: **3.5 / 10**

**Status: NOT READY for implementation.**

The proposed AENS repository rebuild has a solid conceptual foundation based on strong architecture principles, including single source of truth contracts, a 4-layer validation pipeline, build-time static generation, and a rigorous execution protocol.

However, a thorough architectural review has revealed **12 Critical Blockers** and **10 High-Priority Gaps** that represent physical impossibilities, design contradictions, path-resolution failures, and incomplete schemas. If implementation starts in this state, AI coding agents will be forced to violate the core directive of the `AI_EXECUTION_PROTOCOL.md` ("Never invent architecture") and make critical design decisions themselves. This will lead to compile/build failures from day one, platform-dependent inconsistencies, and severe database/path mapping bugs.

**Final Recommendation: Perform one final design iteration to resolve these blockers before implementation begins.**

---

## Critical Blockers

These issues must be resolved before any coding begins. They represent contradictions or missing specifications that will block compilation, validation, or path resolution.

### BLOCKER-1: Script Execution Model is Physically Impossible
* **Affected Documents:** `BUILD_PIPELINE_SPECIFICATION.md`, `FOUNDATION_IMPLEMENTATION_BLUEPRINT.md`, `IMPLEMENTATION_SPECIFICATION.md`
* **Issue:** The build pipeline specifies running scripts as `.js` files via Node.js (e.g., `node scripts/validate.js`, `node scripts/build-nav.js`). However, the specifications require these scripts to import modules from `lib/validation/*.ts`, `lib/content/*.ts`, and `types/*.ts` — all TypeScript files. Node.js cannot directly import or resolve TypeScript files without a compiler/transpiler (like `ts-node`, `tsx`, or `tsm`) or pre-compilation. 
* **Impact:** The validation pipeline, navigation generator, and search indexer will crash immediately upon execution.
* **Required Fix:** Update all script invocations in `package.json` and the specifications to use a transpiled runtime like `tsx` (e.g., `tsx scripts/validate.ts`), or define a pre-build compilation step.

---

### BLOCKER-2: Loader ↔ Validation Module Isolation Contradiction
* **Affected Documents:** `IMPLEMENTATION_SPECIFICATION.md`
* **Issue:** The module isolation rules explicitly state:
  > *"Content Loader (lib/content/) — MUST NOT import validation logic"*
  
  Yet, the specification for `loadContentFile(path)` states:
  > *"Validate against appropriate schema"*  
  > *"Dependencies: lib/validation/layer1-schema.ts"*
  
  This is a direct contradiction. The content loader cannot validate files without importing validation logic, violating isolation.
* **Impact:** AI agents will either violate module isolation or skip load-time validation, resulting in diverging implementations.
* **Required Fix:** Explicitly declare that `loadContentFile` is a pure file-reading loader that does *not* run validation (delegating validation entirely to the build-time pipeline), or modify the isolation rules to allow Layer 1 schema imports. (Option 1 is recommended).

---

### BLOCKER-3: Broken Singular/Plural Directory and Subdirectory Path Resolution
* **Affected Documents:** `REPOSITORY_FOUNDATION_SPECIFICATION_v2.md`, `IMPLEMENTATION_SPECIFICATION.md`
* **Issue:** Content IDs are formatted as `type:slug` (e.g., `package:numpy`, `model:transformer`). The specified path resolver `resolveById(id)` constructs file paths as: `content/{type}/{slug}.json`. This is broken in two ways:
  1. The directories in the workspace are plural (`content/packages/`, `content/workflows/`), whereas the type is singular (`package`, `workflow`). The resolver will look for `content/package/numpy.json`, which does not exist.
  2. Model files are nested in subdirectories: `content/models/ml/`, `content/models/dl/`, `content/models/llm/`. The flat string `content/models/{slug}.json` fails to specify the subdirectory, making resolution of models impossible.
* **Impact:** Content lookup is completely non-functional.
* **Required Fix:** Define a clear type-to-directory mapping table in `lib/content/loaders.ts` (mapping singular `package` to plural `packages`). For models, either encode the category in the ID (e.g., `model:ml:transformer`), make slugs globally unique across all model subdirectories and use recursive lookup, or flatten the directory to `content/models/` and store category as a metadata field inside the file.

---

### BLOCKER-4: Blueprint Phase Ordering Circular Dependency
* **Affected Documents:** `FOUNDATION_IMPLEMENTATION_BLUEPRINT.md` (Phases 5 and 6)
* **Issue:** The implementation sequence in the blueprint graph places Phase 5 (Validation) before Phase 6 (Metadata). However, Layer 4 (Semantic validation) of the validation pipeline has a hard dependency on the metadata files (`metadata/tags.json`, `metadata/aliases.json`, etc.), which are not created until Phase 6.
* **Impact:** AI agents cannot test or verify Layer 4 validation during Phase 5 because the necessary metadata files do not exist.
* **Required Fix:** Swap Phase 5 and Phase 6 in the blueprint. Note that `REBUILD_PHASE_CHECKLIST.md` already has the correct order (Metadata in Phase 5, Validation in Phase 7); the blueprint must be corrected to match.

---

### BLOCKER-5: Incomplete JSON Schema Field Definitions (Shapes)
* **Affected Documents:** `REPOSITORY_FOUNDATION_SPECIFICATION_v2.md`, `FOUNDATION_IMPLEMENTATION_BLUEPRINT.md` (Phases 3, 4)
* **Issue:** The specifications list the required field names and high-level types for each content type, but completely omit their internal data structures.
  * What is the shape of `Package.common_tasks`?
  * What fields are inside `Model.architecture`, `Model.evaluation`, and `Model.decision_guide`?
  * What is the structure of `Workflow.steps`, `Workflow.prerequisites` (`confirmed_env`), and `Workflow.production_notes`?
  * What is the shape of `Registry.deployment` and `Registry.hardware_requirements`?
  * What is the shape of `Cheatsheet.entries`?
* **Impact:** Coding agents will invent the schemas and data properties from scratch, producing inconsistent models and broken validation.
* **Required Fix:** Define the complete JSON Schema bodies or LLD models for every nested object before starting Phase 4.

---

### BLOCKER-6: Non-Deterministic Nav Item Ordering (readdir Platform Differences)
* **Affected Documents:** `IMPLEMENTATION_SPECIFICATION.md` (scripts/build-nav.js)
* **Issue:** Navigation generation is specified to write `_nav.json` files based on directory scanning. However, Node.js `fs.readdir` does not guarantee any order, and ordering differs between Windows, macOS, and Linux filesystems.
* **Impact:** Staged `_nav.json` files will randomly change order depending on the developer's OS, violating the "Deterministic Generation" invariant (Principle R8) and causing constant git merge conflicts and noise.
* **Required Fix:** Add an explicit sorting rule to the navigation generator algorithm (e.g., sort items alphabetically by `slug` or `title` ascending).

---

### BLOCKER-7: Non-Deterministic Search Index (git Churn from Timestamps)
* **Affected Documents:** `REPOSITORY_FOUNDATION_SPECIFICATION_v2.md`, `IMPLEMENTATION_SPECIFICATION.md` (scripts/build-search-index.js)
* **Issue:** The `search-index.json` structure contains a `generated_at` timestamp.
* **Impact:** Every single build or commit will modify `search-index.json` even if no content has changed. This violates the deterministic build invariant and causes massive repository churn.
* **Required Fix:** Remove the `generated_at` timestamp field from `search-index.json`. The configuration `version` field is sufficient for validation.

---

### BLOCKER-8: Undefined Category Assignment Algorithm in Navigation
* **Affected Documents:** `IMPLEMENTATION_SPECIFICATION.md` (scripts/build-nav.js), `REPOSITORY_FOUNDATION_SPECIFICATION_v2.md`
* **Issue:** The specification says packages, workflows, and cheatsheets get their category assigned "based on tags" from `metadata/categories.json`. However, `metadata/categories.json` only lists category IDs and allowed `content_types`. It does not contain any mapping of tags to categories.
* **Impact:** The generator has no logic to automatically assign categories, causing build errors or arbitrary defaults.
* **Required Fix:** Add `category` as a required field in `BaseMeta` (explicit authoring), or define a strict `tag_to_category` mapping in `metadata/categories.json` with conflict resolution rules.

---

### BLOCKER-9: Undefined Search Engine and Weights Specification
* **Affected Documents:** `REPOSITORY_FOUNDATION_SPECIFICATION_v2.md`, `FOUNDATION_IMPLEMENTATION_BLUEPRINT.md` (Phase 8), `IMPLEMENTATION_SPECIFICATION.md`
* **Issue:** The search engine is specified to use `fuse.js` and read a static `search-index.json` index. However, the files `lib/search/engine.ts`, `inverted-index.ts`, and `related-search.ts` have no LLD specifications. The search configuration (weights for title, description, tags, keywords, fuzzy thresholds) is declared as high-level weights but never mapped to actual `fuse.js` parameters.
* **Impact:** AI agents must invent the search engine implementation, configurations, and ranking weights.
* **Required Fix:** Define the public APIs and the exact configurations (threshold, keys, distance) for `fuse.js`.

---

### BLOCKER-10: Type Generation Tooling and ADR is Deferred
* **Affected Documents:** `FOUNDATION_IMPLEMENTATION_BLUEPRINT.md` (Phase 6.1)
* **Issue:** Selecting a type generation tool (e.g., `json-schema-to-typescript`) is deferred to Phase 6 and marked as requiring an ADR, but no pre-defined command or configuration is specified.
* **Impact:** An agent implementing Phase 4 cannot generate types without choosing a tool. Since ADRs are required for architectural decisions, the agent will halt.
* **Required Fix:** Select the tool now (e.g., `json-schema-to-typescript`) and pre-write `docs/adr/001-type-generation-tool.md`.

---

### BLOCKER-11: Content Migration Gaps for Existing Data
* **Affected Documents:** `IMPLEMENTATION_SPECIFICATION.md` (Migration Specifications)
* **Issue:** The specification documents the `alternatives → relationships` transformation, but does not specify how to transform existing data fields like `name` (which becomes `title`), `tasks` (which becomes `common_tasks`), and `sources` (currently array of strings, becomes array of objects).
* **Impact:** The migration agent will fail or mangle content fields when moving old content to the new format.
* **Required Fix:** Audit the actual legacy content files and write a complete, explicit mapping schema for all legacy-to-v2 transformations.

---

### BLOCKER-12: Missing Changesets Dependency and Config
* **Affected Documents:** `BUILD_PIPELINE_SPECIFICATION.md`
* **Issue:** The release script uses `changeset version` and `changeset publish`, but `@changesets/cli` is missing from the devDependencies, and no `.changeset/` config directory is specified.
* **Impact:** The build pipeline and CI/CD release job will fail immediately in environment setup.
* **Required Fix:** Add `@changesets/cli` to the `package.json` devDependencies.

---

## High Priority Improvements

These gaps are not absolute blockers but will lead to developer confusion, broken scripts, or architectural drift.

### H1: Bash-Only Git Hooks on Windows OS
* **Issue:** The pre-commit and pre-push hooks use shell scripting (`#!/bin/sh` and bash utilities). Since the development environment is Windows, these scripts will fail to run without WSL or Git Bash configuration.
* **Fix:** Convert Huskey hooks to run Node.js scripts (cross-platform) instead of shell scripts.

### H2: Config Schema Is Too Loose
* **Issue:** The `schema/config.schema.json` defines `size_budgets`, `stability_tiers`, and `validation_rules` as generic `type: "object"`. This allows invalid configuration structures to pass schema validation.
* **Fix:** Fully define properties and constraints inside the config schema.

### H3: Validation Layer 1 and Layer 2 Duplication
* **Issue:** Schema validation (Layer 1) uses `maxItems` for lists. Layer 2 also checks size budgets from `aens.config.json`. Enforcing the same constraint in two separate layers violates the "Principle R1: One Source, Many References" (drift risk).
* **Fix:** Declare that JSON Schema defines the absolute hard limits, while the config is used by validators to display human-ergonomic error warnings, or remove the duplication.

### H4: Cache TTL in Static SSR/SSG Context
* **Issue:** The content engine features a `Cache` class with a 5-minute TTL. For a static site that builds once, this is mostly irrelevant. If used in SSR, a process-level LRU singleton can result in memory leaks or stale data between server component requests.
* **Fix:** Specify the lifecycle and scope of `cache.ts` in Next.js App Router (e.g. process-level, request-level, or completely build-time).

### H5: Non-Recursive Loaders for Subdirectories
* **Issue:** `loadContentDirectory` reads `.json` files in a flat directory. However, model files live in subdirectories (`models/ml/`, `models/dl/`). A flat read will miss all models.
* **Fix:** Update `loadContentDirectory` to recursively read subdirectories.

---

## Medium Priority Improvements

### M1: `content_role` Field is Dead Weight
* **Issue:** `content_role: "index" | "child"` is defined in `BaseMeta` but never used by the navigation generator, search index, or UI components.
* **Fix:** Document how `content_role` affects rendering/navigation, or remove it from the schema.

### M2: Missing E2E Test Suite and Runner Setup
* **Issue:** `TESTING_SPECIFICATION.md` lists E2E tests for Playwright but has no Playwright configuration, scripts, or runner execution specs.
* **Fix:** Define E2E runner scripts in `package.json` and configure `playwright.config.ts`.

### M3: Loose `content_preview` Truncation Logic
* **Issue:** Truncating text at 200 characters may cut words or HTML tags in half, creating malformed strings in the search index.
* **Fix:** Specify word-boundary truncation and markdown stripping for `content_preview`.

---

## Low Priority Suggestions

### L1: Automated Migration Script
* **Suggestion:** Rather than performing manual file migrations for 50+ files in Phase 12, specify a migration CLI script (`scripts/migrate.js`) to parse and transform the fields automatically.

### L2: ADR Template
* **Suggestion:** Create `docs/adr/TEMPLATE.md` to ensure future ADRs are generated with uniform structure.

---

## Missing Specifications Summary

The following specifications are completely missing and must be written:

| ID | Missing Specification | Phase Required |
|---|---|---|
| **MS-1** | Complete schema bodies for nested content fields | Phase 4 (Schema) |
| **MS-2** | Subdirectory and Singular/Plural Path resolver mappings | Phase 8 (Content Engine) |
| **MS-3** | `fuse.js` configuration keys, weights, and thresholds | Phase 10 (Search) |
| **MS-4** | Navigation item sorting algorithm | Phase 9 (Navigation) |
| **MS-5** | `scripts/generate-types.js` configuration | Phase 6 (Types) |
| **MS-6** | `scripts/audit.js` health checking details | Phase 13 (Quality) |
| **MS-7** | Cross-platform Node.js-based git hook scripts | Phase 14 (Polish) |
| **MS-8** | Category mapping vocabulary list | Phase 5 (Metadata) |

---

## Architectural Risks

| Risk | Likelihood | Impact | Description |
|---|---|---|---|
| **Divergent Content Schema** | High | High | If schema shapes are left to AI agents, database entities will become incompatible, blocking build/rendering. |
| **Silent File Resolution Failures** | Critical | High | Resolver paths that construct singular URLs (`content/package/`) will crash the runtime routing of Next.js. |
| **Git Noise / Repository Churn** | High | Low | Platform-dependent navigations and timestamps in the search index will create massive git noise on every commit. |
| **SSR Caching Stale Data** | Medium | Medium | In-memory process-level cache can cause stale data between Next.js server actions and renders if process persists. |

---

## Positive Findings

1. **Canonical Authority Table:** The single-source-of-truth table is outstanding. It clearly defines the owner of every concept, preventing architectural drift.
2. **AI Execution Protocol:** The rules of agent engagement are very strong. They strictly forbid AI agents from inventing designs, which would successfully protect the codebase if the specifications were complete.
3. **4-Layer Validation Design:** Dividing validation into schema, constraints, relationships, and metadata is clean, testable, and highly robust.

---

## Final Recommendation

### **Verdict: Perform One Final Design Iteration**

**Reasoning:**  
Implementation **cannot** begin today. While the high-level goals and project structures are well-conceived, the design fails on basic physical constraints (scripts trying to import TS files in node), direct path resolution (singular vs. plural directories, missing subdirectories), and circular implementation paths (validation before metadata). 

Forcing AI agents to implement this today will result in immediate deadlocks or arbitrary architectural inventions to bypass the physical bugs. Investing 8–10 hours in a final design iteration to resolve the 12 blockers will ensure that subsequent AI agents can implement the repository rebuild cleanly, deterministically, and with zero architectural debt.
