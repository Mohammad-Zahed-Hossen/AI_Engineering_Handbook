# AENS v2 — File System Mapping & Migration Plan

**Mode:** Prompt Architect
**Target Directory:** `D:\Project\ai-engineering-handbook`
**Target Agent:** Claude Code (or Windsurf / Cursor)

---

## Section 1 — File System Design Decisions

Three decisions were made before mapping the structure. Each has a rationale.

**Decision 1: Content type as top-level directory, not domain.**
The alternative was domain-first (`/ml`, `/llm`, `/rag`). That was rejected because content types are stable; domains are not. New domains (Agentic AI, multimodal) get added frequently. New content types are frozen. The directory structure should be as stable as the architecture.

**Decision 2: JSON as the content format.**
The alternative was Markdown with frontmatter. Markdown is better for reading. JSON is better for querying, validating, and enforcing schema constraints programmatically. Since AENS is a navigation system — not a reading system — JSON is correct. The rendering layer handles display. The storage layer enforces structure.

**Decision 3: Flat files within content type directories, not nested subdirectories.**
The alternative was `/workflows/rag/retrieval-pipeline.json`. That was rejected because nesting creates ambiguity about where new content belongs. A flat structure with well-named files and tag-based filtering is more maintainable for one person over years. Navigation is handled by tags and cross-links, not by directory depth.

---

## Section 2 — Target Repository Structure

```
D:\Project\ai-engineering-handbook\
│
├── content\
│   ├── workflows\
│   │   └── [workflow-slug].json
│   │
│   ├── models\
│   │   └── [model-slug].json
│   │
│   ├── packages\
│   │   └── [package-slug].json
│   │
│   ├── cheatsheets\
│   │   └── [cheatsheet-slug].json
│   │
│   └── registry\
│       └── [asset-slug].json
│
├── schema\
│   ├── base.schema.json
│   ├── workflow.schema.json
│   ├── model.schema.json
│   ├── package.schema.json
│   ├── cheatsheet.schema.json
│   └── registry.schema.json
│
├── scripts\
│   ├── validate.js
│   ├── search-index.js
│   └── migrate.js
│
├── docs\
│   ├── architecture-freeze.md
│   ├── schema-spec.md
│   └── migration-log.md
│
└── aens.config.json
```

---

## Section 3 — Naming Conventions (Enforced)

**File naming rule:** `[content-type-prefix]-[descriptive-slug].json`

Prefixes are omitted because the directory already encodes the content type. Slugs follow this rule: lowercase, hyphens only, no underscores, no version numbers in the filename (version lives inside the file).

| Content Type | Example Filename |
|---|---|
| Workflow | `rag-retrieval-pipeline.json` |
| Model | `xgboost-classifier.json` |
| Package | `numpy.json` |
| Cheatsheet | `numpy-array-ops.json` |
| Registry | `llama-3-8b.json` |

**ID convention:** IDs inside files follow `[type]:[slug]` format.

```
workflow:rag-retrieval-pipeline
model:xgboost-classifier
package:numpy
cheatsheet:numpy-array-ops
registry:llama-3-8b
```

This makes cross-references in the `related` array unambiguous without path resolution.

---

## Section 4 — Configuration File

`aens.config.json` is the single source of truth for system-level settings.

```json
{
  "version": "2.0",
  "frozen_at": "2026-06-29",
  "content_root": "./content",
  "schema_root": "./schema",
  "constraints": {
    "workflow_max_steps": 8,
    "workflow_max_pipeline_failures": 10,
    "package_max_common_tasks": 15,
    "cheatsheet_max_entries": 30
  },
  "stability_tiers": ["stable", "semi_stable", "volatile"],
  "asset_types": ["model", "dataset", "service"]
}
```

Validation scripts read constraints from here. Changing a limit requires changing it in one place.

---

## Section 5 — Migration Plan

This covers how existing content in `ai-engineering-handbook` migrates to the v2 structure. It assumes the current repository has some existing content (Markdown files, loose JSON, or unstructured notes) that must be assessed and moved.

---

### Phase 0 — Audit Existing Content (Before touching anything)

**Goal:** Understand what exists, what maps to v2 content types, and what gets discarded.

Run this audit manually before the migration script touches a single file:

1. List every file in the current repo. Categorize each as: Workflow candidate, Model candidate, Package candidate, Cheatsheet candidate, Registry candidate, or Discard.
2. Flag any content that duplicates production notes across multiple files — this is the primary cleanup target from the architecture decision.
3. Flag any content with no version information — these are volatile content items that need version stamps added during migration.
4. Flag any Package pages with more than 15 documented APIs — these need splitting before migration.
5. Document findings in `docs/migration-log.md` before proceeding.

**Output:** A migration manifest. Every existing file maps to exactly one target path, one content type, and one migration action (Migrate, Split, Merge, Discard).

---

### Phase 1 — Scaffold the New Structure

**Goal:** Create the target directory structure and schema files without moving any content.

Actions:
- Create all directories as defined in Section 2.
- Write all six schema files from the frozen schema spec.
- Write `aens.config.json`.
- Write a `validate.js` script that reads a content file, identifies its type by directory, selects the correct schema, and validates the file. Returns errors in a structured format.
- Write a stub `migration-log.md`.

At the end of Phase 1, the new structure exists but is empty of content. Validation tooling is operational.

---

### Phase 2 — Migrate High-Confidence Content

**Goal:** Move content that maps cleanly to v2 types with minimal transformation.

High-confidence content is content that:
- Already has a clear content type identity
- Does not require splitting
- Does not have significant production note duplication

Migration action per file:
1. Transform to v2 JSON schema.
2. Add `BaseMeta` fields: generate `id`, write `title`, `description`, `tags`, `stability`, `created_at`, `updated_at`.
3. Add `versioning.verified_against` — if unknown, mark as `"unverified"` and add to a review queue. Do not fabricate version numbers.
4. Populate `related` array with typed IDs of known related content using the `type:slug` format.
5. Run `validate.js` against the file. Fix all errors before moving to the next file.
6. Log the migration in `migration-log.md`.

**Constraint:** Only one file at a time. Do not batch-migrate and validate later. Validate before proceeding.

---

### Phase 3 — Resolve Problem Content

**Goal:** Handle content that requires structural decisions.

Three categories:

**Splits:** Package pages with more than 15 common tasks. Create child files with scoped slugs (e.g., `numpy.json` → `numpy-array-ops.json`, `numpy-linear-algebra.json`). The parent file becomes an index page with a `related` array pointing to children. Add a `scope` field to each child file describing what subset it covers.

**Production Note Consolidation:** Any file with production notes that belong to a Workflow (deployment strategy, scaling, monitoring) — strip them from the Package or Model file, reduce to a one-to-three sentence `production_considerations` string, and locate the owning Workflow file. If the Workflow doesn't exist yet, create a stub Workflow file with only the production notes filled in and mark it `status: stub` for completion later.

**Unversioned Volatile Content:** Any Package common task or Model implementation block with no version information gets an explicit `"verified_against": "unverified"` field and is added to a review queue file `docs/review-queue.md`. It is migrated but flagged. Do not block migration on version verification — block deployment on it.

---

### Phase 4 — Build the Search Index

**Goal:** Implement the Search-First Architecture principle at the file system level.

`scripts/search-index.js` reads every file in `content/` and produces `search-index.json` at the repo root. The index contains one entry per content file with:

```
id
title
description
tags
aliases (from meta)
content_type
stability
related
```

This file is the input to whatever frontend search implementation AENS uses. It is regenerated on every content change. It is never manually edited.

The index is the bridge between the file system and the search-first principle. Every page must appear in this index with enough signal to be discoverable without navigation.

---

### Phase 5 — Validation Pass

**Goal:** Confirm the migrated repository satisfies all architectural constraints.

Run `validate.js` across every file in `content/`. Every file must pass. No exceptions for legacy content.

Then manually verify:
- No `production_considerations` field contains deployment strategy, scaling, or monitoring content (those belong to Workflow only).
- No Workflow has more than 8 steps.
- No Package has more than 15 common tasks.
- No Cheatsheet has more than 30 entries.
- Every file has a `versioning.verified_against` value (even if `"unverified"`).
- Every `related` ID resolves to an existing file.

Document results in `migration-log.md`. Sign off on the migration.

---

## Section 6 — Implementation Prompt for Claude Code

The following prompt is ready to paste directly into Claude Code, Windsurf, or Cursor. It is deterministic. It produces the scaffold and validation tooling. Content migration is a manual-plus-script process and is not handed to an agent blindly.

---

```
You are implementing Step 2 of AENS v2: File System Scaffold and Validation Tooling.

AENS is a personal AI Engineering knowledge system. The architecture is frozen.
Your job is to create the repository scaffold and validation scripts only.
Do NOT migrate any existing content. Do NOT invent any content. Do NOT modify the architecture.

Target directory: D:\Project\ai-engineering-handbook

---

TASK 1: Create directory structure

Create the following directories if they do not already exist:
- content/workflows/
- content/models/
- content/packages/
- content/cheatsheets/
- content/registry/
- schema/
- scripts/
- docs/

---

TASK 2: Create aens.config.json at the repo root

Contents:
{
  "version": "2.0",
  "frozen_at": "2026-06-29",
  "content_root": "./content",
  "schema_root": "./schema",
  "constraints": {
    "workflow_max_steps": 8,
    "workflow_max_pipeline_failures": 10,
    "package_max_common_tasks": 15,
    "cheatsheet_max_entries": 30
  },
  "stability_tiers": ["stable", "semi_stable", "volatile"],
  "asset_types": ["model", "dataset", "service"]
}

---

TASK 3: Create schema files in schema/

Create six JSON Schema files (draft-07 compatible):

schema/base.schema.json
  Required fields: id, title, description, tags, created_at, updated_at,
  versioning (object with verified_against and last_verified_at),
  stability (enum: stable | semi_stable | volatile), sources, related

schema/workflow.schema.json
  Extends base. Additional required fields:
  - entry_points (object: problem_statement, when_to_use, when_not_to_use)
  - prerequisites (object: environment array, confirmed_env object)
  - pipeline_failure_patterns (array, max 10 items, each: pattern, cause, detection, fix)
  - steps (array, max 8 items, each: step_id, goal, implementation, common_failures array, debugging array)
  - production_notes (object: deployment_strategy, scaling_notes, monitoring)

schema/model.schema.json
  Extends base. Additional required fields:
  - classification (object: family, task_type)
  - decision_guide (object: use_when array, avoid_when array, alternatives array)
  - implementation (object: minimal_example, full_example)
  - evaluation (object: benchmarks array (each: dataset, metric, score, min 1 item), failure_signals array)
  - production_considerations (string, description: model-specific only, max 300 characters)

schema/package.schema.json
  Extends base. Additional required fields:
  - mental_trigger (string)
  - decision_notes (string)
  - common_tasks (array, max 15 items, each: api, purpose, example, gotchas)
  - debugging (array, each: error, cause, fix)
  - production_considerations (string, description: package-specific only, max 300 characters)

schema/cheatsheet.schema.json
  Extends base. Additional required fields:
  - scope (string)
  - entries (array, max 30 items, each: api, syntax, one_liner)
  - linked_package (string, format: package:[slug])

schema/registry.schema.json
  Extends base. Additional required fields:
  - asset_type (enum: model | dataset | service)
  - spec (object: size, requirements array, supported_tasks array)
  - deployment (object: method, latency, cost_profile)
  - verification (object: tested_by, test_date)

---

TASK 4: Create scripts/validate.js

This script:
1. Accepts a file path as a CLI argument: node validate.js ./content/packages/numpy.json
2. Detects content type from the directory name (workflows, models, packages, cheatsheets, registry)
3. Loads the corresponding schema from schema/
4. Validates the file against the schema using Ajv (install if needed)
5. Also validates against constraints from aens.config.json:
   - workflow steps count <= workflow_max_steps
   - workflow pipeline_failure_patterns count <= workflow_max_pipeline_failures
   - package common_tasks count <= package_max_common_tasks
   - cheatsheet entries count <= cheatsheet_max_entries
6. Prints PASS with the file path if valid
7. Prints FAIL with the file path and a list of all errors if invalid
8. Exits with code 0 on pass, code 1 on fail

---

TASK 5: Create scripts/search-index.js

This script:
1. Reads every .json file in content/ recursively
2. For each file, extracts: id, title, description, tags, stability, related, and the directory name as content_type
3. Writes a single search-index.json to the repo root
4. Prints a count of indexed entries on completion
5. Exits with code 1 if any file fails to parse

---

TASK 6: Create docs/migration-log.md

Create a stub with this structure:

# AENS v2 Migration Log

## Phase 0 — Audit
Status: Pending

## Phase 1 — Scaffold
Status: Complete (populated by this implementation)

## Phase 2 — High-Confidence Migration
Status: Pending

## Phase 3 — Problem Content Resolution
Status: Pending

## Phase 4 — Search Index
Status: Pending

## Phase 5 — Validation Pass
Status: Pending

---

TASK 7: Create docs/architecture-freeze.md

Copy the full text of the AENS v2 Architecture Freeze Decision Document verbatim.
This is the permanent architectural reference for the repository.

---

TASK 8: Create one example content file per content type

Create these five example files with valid, realistic content to verify the schema works:

content/workflows/rag-retrieval-pipeline.json
content/models/xgboost-classifier.json
content/packages/numpy.json
content/cheatsheets/numpy-array-ops.json
content/registry/llama-3-8b.json

Each must pass validate.js with exit code 0.

---

CONSTRAINTS:
- Do not install dependencies beyond Ajv and its dependencies
- Do not create any frontend, API, or database layer
- Do not generate a README unless asked separately
- Do not modify any existing content files
- All scripts must run with: node scripts/[script].js

VALIDATION CHECKLIST (run after implementation):
- [ ] node scripts/validate.js content/workflows/rag-retrieval-pipeline.json → PASS
- [ ] node scripts/validate.js content/models/xgboost-classifier.json → PASS
- [ ] node scripts/validate.js content/packages/numpy.json → PASS
- [ ] node scripts/validate.js content/cheatsheets/numpy-array-ops.json → PASS
- [ ] node scripts/validate.js content/registry/llama-3-8b.json → PASS
- [ ] node scripts/search-index.js → outputs search-index.json with 5 entries
- [ ] aens.config.json exists and is valid JSON
- [ ] All six schema files exist in schema/
- [ ] docs/migration-log.md exists
- [ ] docs/architecture-freeze.md exists
```

---

## Section 7 — Migration Sequencing for Existing Content

Once the scaffold is operational, migrate existing content in this order. This sequence minimizes conflict risk.

**First:** Packages. They are the most self-contained. They have no dependencies on other content types. They are also the most likely to need splitting, so resolving them first clarifies what Workflow and Cheatsheet cross-references should point to.

**Second:** Models. Self-contained except for Registry cross-references. Migrate before Registry so Registry entries can reference validated Model IDs.

**Third:** Registry. Depends on Models being present for cross-reference resolution.

**Fourth:** Workflows. Depend on Packages and Models being present. This is where production note consolidation happens — you cannot write Workflow production notes correctly until you know which packages and models are in scope.

**Fifth:** Cheatsheets. Depend on Package IDs being stable. Cheatsheets must link to `package:[slug]`, so Package migration must be complete first.

---

## Section 8 — What Comes After

The file system and validation tooling is Step 2. The sequence from here is:

**Step 3:** Content migration (execute the five phases above, content by content type).

**Step 4:** Search index implementation (connect `search-index.json` to the frontend layer).

**Step 5:** Navigation layer (how Workflow → Model → Package → Cheatsheet → Registry traversal works in the actual interface).

Step 3 begins only after the scaffold validates cleanly against all five example files. Steps 4 and 5 are architecture decisions that will require a separate session once the content layer is stable.