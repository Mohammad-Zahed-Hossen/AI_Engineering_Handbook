# AENS Repository Rebuild Master Plan (v1)

## Goal

Rebuild the AENS repository on top of the existing Next.js application while preserving all proven UI/UX assets and replacing the entire content architecture with a clean Repository Foundation.

This is **not** a migration.

This is **not** a rewrite of the frontend.

This is a **Foundation-Preserving Rebuild**.

---

# Guiding Principle

> Keep everything that already works.

> Archive everything that prevents long-term evolution.

> Rebuild the repository foundation from first principles.

---

# Repository Philosophy

The repository should optimize for

* 5-10 year maintainability
* AI-assisted content creation
* AI-assisted maintenance
* deterministic architecture
* predictable repository evolution
* documentation-first engineering

Never optimize for minimizing today's work if it creates tomorrow's technical debt.

---

# What MUST Be Preserved

These systems are considered stable.

They are **not** part of the rebuild.

### Application

* Next.js
* App Router
* Routing
* Layouts
* Providers
* Theme
* Fonts

---

### UI

* shadcn/ui
* Tailwind
* Components
* Icons
* Motion
* Responsive behavior
* Accessibility improvements

---

### UX

Navigation style

Cards

Search experience

Layout structure

Spacing

Typography

Animations

Design language

---

### Infrastructure

package.json

eslint

prettier

typescript config

github workflows

deployment

testing setup

---

### Assets

public/

icons

images

logos

fonts

---

# What becomes Legacy

Everything below becomes archived.

Nothing here should remain in production.

Examples

```
old data loaders

old metadata

old search

old registry

old schema

old validation

old content model

old generators

old utilities tightly coupled to old content

bridge code

temporary compatibility code
```

These should be moved into

```
legacy/
```

or preserved on

```
legacy-pre-rebuild
```

---

# New Foundation

Everything below is rebuilt from zero.

```
content/

schema/

metadata/

types/

scripts/

lib/content/

lib/search/

lib/validation/

config/
```

No compatibility layers.

No bridge period.

No dual systems.

---

# Canonical Authorities

Exactly one authority exists for every concept.

| Concept       | Authority                            |
| ------------- | ------------------------------------ |
| Schema        | JSON Schema                          |
| Content       | content/                             |
| Metadata      | metadata/                            |
| Configuration | aens.config.json                     |
| Navigation    | _nav.json + metadata/categories.json |
| Search        | search-index.json                    |
| Validation    | validation pipeline                  |
| Types         | types/                               |
| IDs           | metadata registry                    |

Never duplicate authority.

---

# Engineering Principles

1. Single source of truth.

2. Content-first architecture.

3. Schema before implementation.

4. Validation before rendering.

5. Build-time verification.

6. Deterministic generation.

7. Documentation-first.

8. AI-readable repository.

9. Human-readable repository.

10. Zero hidden conventions.

---

# Rebuild Strategy

The rebuild is executed in independent phases.

Each phase must finish completely.

No overlapping implementation.

No partial migration.

No hybrid architecture.

---

# Phase 0

Freeze

Goal

Freeze current repository.

Deliverables

* tag repository
* create backup branch
* create legacy branch

Success

Current repository can always be restored.

---

# Phase 1

Archive

Goal

Move every replaceable subsystem into legacy.

Deliverables

```
legacy/

legacy/content

legacy/scripts

legacy/schema

legacy/search

legacy/data

legacy/loaders
```

Nothing deleted permanently.

Success

Application still builds.

---

# Phase 2

Foundation

Create

```
content/

schema/

metadata/

types/

config/

scripts/

```

No functionality.

Only structure.

---

# Phase 3

Configuration

Create

```
aens.config.json
```

Register

content types

schema versions

budgets

status

validation rules

No code yet.

---

# Phase 4

Schema

Create

```
JSON Schema 2020-12
```

Every content type.

No renderer.

Only contracts.

---

# Phase 5

Metadata

Create

```
metadata/

aliases

tags

categories

relationships

registry
```

---

# Phase 6

Types

Generate

TypeScript types.

Review manually.

Add documentation.

---

# Phase 7

Validation

Implement

Layer 1

Schema

Layer 2

Constraints

Layer 3

Cross references

Layer 4

Semantic validation

Validation must pass before rendering.

---

# Phase 8

Content Engine

Build

Loaders

Resolvers

Registry

Caching

Utilities

No UI changes.

---

# Phase 9

Navigation

Generate

```
_nav.json
```

from content.

Validate against metadata.

---

# Phase 10

Search

Generate

```
search-index.json
```

Build search engine.

No runtime generation.

---

# Phase 11

Renderer Integration

Connect

UI

Search

Navigation

Content engine

Nothing legacy remains.

---

# Phase 12

Content Recreation

Recreate

* AI concepts
* workflows
* tools
* packages
* models
* prompts
* registry

using the new architecture.

---

# Phase 13

Quality Audit

Run

Validation

Search audit

Broken link audit

Relationship audit

Schema audit

Performance audit

Repository audit

Everything must pass.

---

# Definition of Done

The rebuild is complete only if:

* No production code depends on `legacy/`.
* Every content file validates successfully.
* Every relationship resolves correctly.
* Search index is generated successfully.
* Navigation is generated successfully.
* All quality checks pass.
* The UI/UX remains visually consistent with the pre-rebuild application.
