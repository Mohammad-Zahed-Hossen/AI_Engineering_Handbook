
## Step 2B Roadmap

### Phase 1 — Repository Skeleton

This establishes the repository structure exactly as defined in the specification.

Deliverables include:

* directory hierarchy
* `schema/v2/`
* `types/`
* `metadata/`
* `content/`
* `registry/`
* `scripts/`
* `docs/adr/`
* `docs/migration/`
* placeholder README files where required

No application logic yet.

---

### Phase 2 — Configuration Layer

Implement the repository's single source of architectural truth.

Deliverables:

* `aens.config.json`
* architectural constants
* schema versions
* content types
* asset types
* size budgets
* validation settings
* search configuration

This corresponds directly to RFD-029.

---

### Phase 3 — Metadata Layer

Implement controlled vocabularies.

Files:

* `metadata/tags.json`
* `metadata/categories.json`
* `metadata/aliases.json`

Initially these may contain only a few entries.

---

### Phase 4 — JSON Schemas

Build every schema using JSON Schema 2020-12.

Suggested order:

1. BaseMeta
2. Package
3. Model
4. Workflow
5. Cheatsheet
6. Registry
7. Shared definitions

This is the architectural core.

---

### Phase 5 — TypeScript Types

Mirror the schemas.

Important:

JSON Schema remains authoritative.

TypeScript mirrors the schema.

Exactly as decided in RFD-011.

---

### Phase 6 — Validation Engine

Implement

```
scripts/
    validate.js
```

The validator should implement the four validation layers defined in the specification.

Layer 1

* JSON parsing

Layer 2

* Schema validation

Layer 3

* Cross-reference validation

Layer 4

* Repository policy validation

This is one of the largest implementation tasks.

---

### Phase 7 — Audit Engine

Implement

```
scripts/
    audit.js
```

Responsibilities include:

* duplicate IDs
* alias collisions
* schema/type synchronization
* repository health
* orphan detection
* statistics

---

### Phase 8 — Migration Engine

Implement

```
scripts/
    migrate.js
```

Generate

* migration-log.md
* migration-report.json
* review-queue.md

Exactly as defined in RFD-017 and RFD-025.

---

### Phase 9 — Search Index Generator

Implement

```
scripts/
    build-search.js
```

Generate the repository search index using the weighted fields defined in Section 8.

---

### Phase 10 — Sample Content

Create a few canonical examples.

Examples:

```
numpy
pandas
pytorch

xgboost

rag-basic

numpy-cheatsheet
```

These act as reference implementations.

---

### Phase 11 — ADR Initialization

Create

```
docs/adr/

adr-001-repository-foundation.md
```

This records adoption of the frozen architecture.

---

### Phase 12 — Repository Verification

Execute every script.

Verify

* every schema
* every validator
* every audit
* every migration artifact
* every search index
* every example file

No warnings.

No validation failures.

No duplicate IDs.

No alias collisions.

Repository reaches **v2 Foundation Complete**.

---

# My recommendation before writing any code

Although the roadmap above is technically correct, I would introduce one additional checkpoint that will reduce rework significantly.

## Step 2B.0 — Implementation Blueprint (Recommended)

Before creating any files, produce a single implementation document that maps every specification section to concrete files.

For example:

| Specification Section | Files to Create                                         |
| --------------------- | ------------------------------------------------------- |
| BaseMeta              | `schema/v2/base-meta.schema.json`, `types/base-meta.ts` |
| Validation            | `scripts/validate.js`                                   |
| Search                | `scripts/build-search.js`                               |
| Metadata              | `metadata/*.json`                                       |
| ADR                   | `docs/adr/adr-001-repository-foundation.md`             |

For each file, define:

* purpose
* owner
* dependencies
* input/output
* implementation order

This blueprint becomes the execution plan for the entire implementation. It keeps the work aligned with the frozen specification and makes it easier for coding agents (Claude Code, Codex, Kimi Agent, Windsurf, etc.) to build the repository incrementally without drifting from the architecture.

Given the maturity of your Step 2A documents, I would treat this Implementation Blueprint as the first artifact of Step 2B, followed by the actual repository implementation.
