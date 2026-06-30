Since **Claude, Codex, Kimi Agent, Windsurf (Devin), and Antigravity all have direct filesystem access**, they can inspect the real repository instead of relying on prompts alone. That means we should stop writing implementation prompts that assume the repository structure. Instead, every phase should begin with a repository inspection and produce an implementation plan before any edits.

I also recommend treating each agent according to its strengths instead of using one agent for everything.

| Agent            | Primary responsibility                                                                |
| ---------------- | ------------------------------------------------------------------------------------- |
| Claude           | Architecture, specifications, repository-wide reasoning, documentation                |
| Codex            | Refactoring, TypeScript, Zod, validation, scripts                                     |
| Windsurf / Devin | Large multi-file implementation and migration                                         |
| Kimi Agent       | Independent architecture review and consistency checking                              |
| ChatGPT          | Architecture governance, decision review, implementation planning, prompt engineering |

---

PROJECT CONSTRAINTS

This repository is NOT a greenfield project.

An existing Next.js + TypeScript + Zod codebase already exists.

Your job is to MIGRATE the repository toward the Repository Foundation Specification v1.1.

Do NOT redesign working architecture.

Do NOT rename directories unless required by the specification.

Prefer extension over replacement.

Preserve existing routes, components, search engine, navigation builder, validation scripts, and data organization whenever possible.

When conflicts arise, explicitly document:
1. Existing implementation
2. Specification requirement
3. Migration strategy
4. Breaking change risk
5. Final recommendation

Never rewrite large parts of the repository without first producing a migration plan.


# Step 2B Roadmap

From now on I would structure the project like this.

```
Step 2B
│
├── 2B.1 Repository Architecture Audit
├── 2B.2 Migration Specification
├── 2B.3 Foundation Layer
├── 2B.4 Metadata Layer
├── 2B.5 Schema Layer
├── 2B.6 Type Layer
├── 2B.7 Validation Layer
├── 2B.8 Search Layer
├── 2B.9 Navigation Layer
├── 2B.10 Content Migration Layer
├── 2B.11 Frontend Compatibility Layer
├── 2B.12 Repository Verification
└── Freeze
```

Notice that nothing starts with "implement."

Everything starts with **audit → design → migrate → verify**.

That greatly reduces the chance of architectural drift.

---

# Step 2B.1 — Repository Architecture Audit

## Goal

Produce a complete understanding of the existing repository.

Not the specification.

The actual code.

---

### Expected outputs

* Repository Inventory
* Directory Dependency Graph
* Type Dependency Graph
* Schema Dependency Graph
* Search Architecture
* Validation Pipeline
* Navigation Pipeline
* Content Loading Pipeline
* Route Architecture
* Technical Debt Report
* Migration Risk Report

Nothing is modified.

---

### Best agent

**Claude**

Reason:

Claude is still the strongest at repository-level reasoning.

---

# Step 2B.2 — Migration Specification

Now compare

```
Current Repository

↓

Repository Foundation Specification

↓

Decision Register

↓

Required Migration
```

Produce

* compatibility matrix
* conflict matrix
* migration order
* breaking change analysis
* implementation phases

Again

No code.

---

### Best agent

Claude

---

# Step 2B.3 — Foundation Layer

Only now begin implementation.

Implement

```
aens.config.json

metadata/

docs/adr/

docs/migration/

repository constants
```

No existing code should break.

---

### Best agent

Windsurf

or

Codex

---

# Step 2B.4 — Metadata Layer

Implement

```
BaseMeta

aliases

keywords

relationships

status

schema_version

sources

content_role

deprecated
```

without touching the UI.

---

### Best agent

Codex

---

# Step 2B.5 — Schema Layer

Update

```
lib/schemas/
```

only.

No frontend.

---

### Best agent

Codex

---

# Step 2B.6 — Type Layer

Synchronize

```
types/

↓

lib/schemas/

↓

BaseMeta
```

---

### Best agent

Codex

---

# Step 2B.7 — Validation Layer

Upgrade

```
validate-content.ts
```

into

```
Layer 1

↓

Layer 2

↓

Layer 3

↓

Layer 4
```

Then add

```
audit.ts

migrate.ts
```

---

### Best agent

Codex

---

# Step 2B.8 — Search Layer

Upgrade search.

Current

```
title

description

tags
```

↓

Target

```
aliases

keywords

mental_trigger

problem_statement

status

error_messages

relationships

...
```

---

### Best agent

Windsurf

---

# Step 2B.9 — Navigation Layer

Synchronize

```
_nav.json

↓

metadata

↓

content_role

↓

relationships
```

---

### Best agent

Windsurf

---

# Step 2B.10 — Content Migration

Migrate

```
packages

models

workflows

registry

cheatsheets
```

one type at a time.

Generate

```
migration-report.json

review-queue.md
```

---

### Best agent

Windsurf

---

# Step 2B.11 — Frontend Compatibility

Now inspect

```
app/

components/

hooks/

search/

layout/
```

Ensure

* nothing breaks
* all pages compile
* search works
* routing still works
* existing components remain reusable

---

### Best agent

Windsurf

---

# Step 2B.12 — Repository Verification

Perform a complete repository audit.

Checklist includes:

* Schema validation
* Type synchronization
* Alias uniqueness
* Relationship integrity
* Navigation consistency
* Search index completeness
* Route coverage
* Build success
* Lint success
* Dead code detection
* Duplicate schema detection
* Broken references
* Documentation synchronization

Only after every check passes should the repository be frozen.

---

### Best agent

Kimi Agent

Final architecture review

↓

Claude

Final specification consistency review

↓

ChatGPT

Final governance review

---

# Suggested workflow

Instead of letting a single agent own the migration, use a review pipeline:

```
Claude
    ↓
Architecture Audit

        ↓

Claude
    ↓
Migration Specification

        ↓

Codex
    ↓
Foundation
Schema
Types
Validation

        ↓

Windsurf
    ↓
Search
Navigation
Migration
Frontend

        ↓

Kimi
    ↓
Repository Audit

        ↓

Claude
    ↓
Final Architecture Verification

        ↓

Freeze
```

This approach separates **planning, implementation, and verification**, making it much less likely that an implementation agent will unintentionally diverge from your Repository Foundation Specification or introduce regressions into your existing AENS codebase. It also aligns well with your setup, where each agent can inspect the repository directly instead of relying solely on textual descriptions.
