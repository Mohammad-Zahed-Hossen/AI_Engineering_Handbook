# Repository Foundation Specification v2
**Version:** 2.1
**Status:** Authoritative Architecture Specification
**Scope:** Defines the canonical architecture for AENS repository rebuild
**Freeze Date:** 2026-06-30

---

# Purpose

This document is the **single source of truth** for the AENS repository architecture. It defines:

- What must exist
- Where it must exist
- How components interact
- What is authoritative for each concept

This document **does not contain implementation details**. Implementation is governed by the AENS_REBUILD_MASTER_PLAN.md and executed according to the AI_EXECUTION_PROTOCOL.md.

---

# Core Principles

## Principle R1: One Source, Many References

Every concept has exactly one authoritative source. Other systems reference it; they do not duplicate it.

**Violations:**
- Duplicate schema systems (Zod + JSON Schema as equal authorities)
- Duplicate metadata (tags in content files + metadata/tags.json)
- Duplicate constraints (schema maxItems + config limits)

**Correct Pattern:**
- Schema is the contract
- Config references schema
- Content references schema
- Validation enforces schema

---

## Principle R2: Schema is the Contract

JSON Schema 2020-12 is the canonical schema. All content must validate against it. TypeScript types derive from it. Configuration references it.

**Implications:**
- Zod is deprecated as canonical authority
- TypeScript types are derived from JSON Schema, not maintained in parallel
- Configuration constraints must match schema constraints
- Validation uses JSON Schema validators (Ajv or equivalent)

---

## Principle R3: Content-First Architecture

The repository exists to serve content. All architecture decisions optimize for:

- Content authoring efficiency
- Content validation reliability
- Content searchability
- Content maintainability

**Implications:**
- Schema design prioritizes content authoring ergonomics
- Validation provides clear, actionable error messages
- Search indexing is build-time, not runtime
- Content files are self-documenting

---

## Principle R4: Configuration is Centralized

All configuration lives in `aens.config.json` at repository root. No hardcoded constants in code.

**Scope:**
- Content type registrations
- Schema version mappings
- Size budgets
- Stability tiers
- Review cadences
- Validation rules

---

## Principle R5: Metadata is Authoritative

Controlled vocabularies (tags, aliases, categories) are registered in `metadata/` and are the canonical source.

**Implications:**
- Content files reference registered tags/aliases
- Unregistered tags/aliases are validation errors
- Metadata files are manually maintained
- Search indexes read from metadata

---

## Principle R6: Validation Before Rendering

Content must pass all validation layers before it can be rendered. No partial validation. No rendering of invalid content.

**Validation Layers:**
1. **Layer 1:** Structural (JSON Schema)
2. **Layer 2:** Constraints (size budgets from config)
3. **Layer 3:** Cross-Reference (relationship integrity)
4. **Layer 4:** Semantic (taxonomy conformance, status consistency)

---

## Principle R7: Build-Time Verification

All verification happens at build time. No runtime validation in production.

**Build-Time Artifacts:**
- `search-index.json` (committed to git)
- `_nav.json` files (generated from content)
- Validation reports
- Migration reports

---

## Principle R8: Deterministic Generation

Given the same content, the build produces the same artifacts. No nondeterministic generation.

**Implications:**
- Search index is deterministic
- Navigation is deterministic
- Type generation is deterministic
- Validation results are deterministic

---

## Principle R9: Documentation-First

All architectural decisions are documented before implementation. No undocumented architecture.

**Documentation Locations:**
- `docs/adr/` - Architectural Decision Records
- `docs/migration/` - Migration artifacts
- `REPOSITORY_FOUNDATION_SPECIFICATION_v2.md` - This document
- `AENS_REBUILD_MASTER_PLAN.md` - Rebuild strategy
- `AI_EXECUTION_PROTOCOL.md` - AI agent rules

---

## Principle R10: AI-Readable Repository

The repository structure is optimized for AI-assisted content creation and maintenance.

**Implications:**
- Schema files are machine-readable
- Metadata is centralized
- Validation rules are explicit
- Documentation is comprehensive
- No hidden conventions

---

# Canonical Authorities

| Concept       | Authority                            | Location                     |
| ------------- | ------------------------------------ | ---------------------------- |
| Schema        | JSON Schema 2020-12                  | `schema/v2/*.json`           |
| Content       | Content files                        | `content/[type]/[id].json`   |
| Metadata      | Controlled vocabularies              | `metadata/*.json`            |
| Configuration | Central configuration                | `aens.config.json`           |
| Navigation    | Generated from content + metadata    | `[type]/_nav.json`           |
| Search        | Static committed artifact            | `search-index.json`          |
| Validation    | 4-layer pipeline                     | `scripts/validate.js`        |
| Types         | Derived from JSON Schema             | `types/*.ts`                 |
| IDs           | Metadata registry                    | `metadata/registry.json`     |
| ADRs          | Architectural decisions              | `docs/adr/*.md`              |

---

# Directory Structure

```
ai-engineering-handbook/
├── aens.config.json              # Central configuration (canonical)
├── search-index.json             # Static search index (committed artifact)
│
├── content/                      # Content files (canonical)
│   ├── packages/
│   │   ├── _nav.json
│   │   └── [id].json
│   ├── models/
│   │   ├── ml/
│   │   ├── dl/
│   │   ├── llm/
│   │   └── [category]/_nav.json
│   ├── workflows/
│   │   ├── _nav.json
│   │   └── [id].json
│   ├── cheatsheets/
│   │   ├── _nav.json
│   │   └── [id].json
│   └── registry/
│       └── [task].json
│
├── schema/v2/                    # JSON Schema 2020-12 (canonical)
│   ├── base.schema.json
│   ├── package.schema.json
│   ├── model.schema.json
│   ├── workflow.schema.json
│   ├── cheatsheet.schema.json
│   ├── registry.schema.json
│   └── metadata.schema.json
│
├── metadata/                     # Controlled vocabularies (canonical)
│   ├── tags.json
│   ├── aliases.json
│   ├── categories.json
│   └── registry.json
│
├── types/                        # TypeScript types (derived from schema)
│   ├── base.ts
│   ├── package.ts
│   ├── model.ts
│   ├── workflow.ts
│   ├── cheatsheet.ts
│   ├── registry.ts
│   └── index.ts
│
├── scripts/                      # Build and validation scripts (TypeScript, executed with tsx)
│   ├── validate.ts              # 4-layer validation
│   ├── build-search-index.ts    # Search index generation
│   ├── build-nav.ts             # Navigation generation
│   ├── generate-types.ts        # TypeScript generation
│   └── audit.ts                 # Repository health checks
│
├── lib/                         # Application code (preserved)
│   ├── content/                 # Content engine (new)
│   │   ├── loaders.ts
│   │   ├── resolvers.ts
│   │   ├── registry.ts
│   │   └── cache.ts
│   ├── search/                  # Search engine (preserved)
│   │   ├── engine.ts
│   │   ├── inverted-index.ts
│   │   └── related-search.ts
│   ├── validation/              # Validation logic (new)
│   │   ├── layer1-schema.ts
│   │   ├── layer2-constraints.ts
│   │   ├── layer3-crossref.ts
│   │   └── layer4-semantic.ts
│   └── config/                  # Config loader (preserved)
│       └── loader.ts
│
├── app/                         # Next.js app (preserved)
│   ├── layout.tsx
│   ├── page.tsx
│   └── [type]/[id]/page.tsx
│
├── components/                   # UI components (preserved)
│   ├── layout/
│   ├── shared/
│   └── ui/
│
├── docs/                        # Documentation (preserved)
│   ├── adr/                     # Architectural Decision Records
│   └── migration/               # Migration artifacts
│
└── legacy/                      # Archived old systems (new)
    ├── data/
    ├── lib/schemas/
    ├── scripts/
    └── schema/
```

---

# Content Model

## BaseMeta

All content types extend BaseMeta. These fields are present on every content file.

```json
{
  "schema_version": "2.0",
  "id": "type:slug" (models: "model:category:slug"),
  "title": "string",
  "slug": "string",
  "aliases": ["string"],
  "description": "string",
  "tags": ["string"],
  "status": "draft|stub|complete|deprecated",
  "deprecated": {
    "replaced_by": "type:slug",
    "reason": "string"
  },
  "stability": "stable|semi_stable|volatile",
  "versioning": {
    "verified_against": "string",
    "last_verified_at": "ISO8601"
  },
  "created_at": "ISO8601",
  "updated_at": "ISO8601",
  "sources": [{
    "url": "string",
    "title": "string",
    "accessed_at": "ISO8601"
  }],
  "relationships": {
    "workflows": ["workflow:id"],
    "models": ["model:category:slug"],
    "packages": ["package:id"],
    "cheatsheets": ["cheatsheet:id"],
    "registry": ["registry:id"]
  },
  "keywords": ["string"],
  "content_role": "index|child"
}
```

**ID Format (v2.1):**
- Packages, Workflows, Cheatsheets, Registry: `{type}:{slug}` (e.g., `package:numpy`)
- Models: `{type}:{category}:{slug}` where category is `ml`, `dl`, or `llm` (e.g., `model:ml:transformer`)
- See ADR-004 for rationale

## Content Types

### Package

Package pages document software libraries, SDKs, and frameworks.

**Required Fields:**
- BaseMeta
- `common_tasks` (max 15)
- `production_considerations` (max 300 chars)
- `decision_notes` (string)

**Size Budget:**
- `common_tasks`: 15 entries maximum

**Field Structures:**
```json
{
  "common_tasks": [
    {
      "task": "string",
      "priority": "high|medium|low"
    }
  ]
}
```

### Model

Model pages document ML models, their architectures, and evaluation.

**Required Fields:**
- BaseMeta
- `architecture` (object)
- `evaluation` (object)
- `production_considerations` (max 300 chars)
- `decision_guide` (object)

**Size Budget:**
- No specific budget (model complexity varies)

**Field Structures:**
```json
{
  "architecture": {
    "layers": ["string"],
    "parameters": "number",
    "type": "string"
  },
  "evaluation": {
    "metrics": {
      "accuracy": "number",
      "f1_score": "number"
    },
    "dataset": "string"
  },
  "decision_guide": {
    "when_to_use": ["string"],
    "when_to_avoid": ["string"],
    "alternatives": ["string"]
  }
}
```

### Workflow

Workflow pages document end-to-end ML/LLM/RAG/Agentic pipelines.

**Required Fields:**
- BaseMeta
- `mental_trigger` (string)
- `entry_points` (array)
- `prerequisites` (object with `confirmed_env`)
- `pipeline_failure_patterns` (array)
- `steps` (max 8)
- `production_notes` (object)

**Size Budget:**
- `steps`: 8 entries maximum

**Field Structures:**
```json
{
  "entry_points": ["string"],
  "prerequisites": {
    "confirmed_env": ["string"],
    "required_packages": ["string"]
  },
  "pipeline_failure_patterns": ["string"],
  "steps": [
    {
      "title": "string",
      "description": "string",
      "code": "string"
    }
  ],
  "production_notes": {
    "performance": "string",
    "scaling": "string",
    "monitoring": "string"
  }
}
```

### Cheatsheet

Cheatsheets provide quick reference syntax for common operations.

**Required Fields:**
- BaseMeta
- `entries` (max 30)

**Size Budget:**
- `entries`: 30 entries maximum

**Field Structures:**
```json
{
  "entries": [
    {
      "syntax": "string",
      "description": "string",
      "example": "string"
    }
  ]
}
```

### Registry

Registry entries document deployment configurations for models, datasets, and services.

**Required Fields:**
- BaseMeta
- `asset_type` (model|dataset|service)
- `deployment` (object)
- `hardware_requirements` (object)

**Size Budget:**
- No specific budget

**Field Structures:**
```json
{
  "deployment": {
    "provider": "string",
    "region": "string",
    "config": {}
  },
  "hardware_requirements": {
    "gpu": "string",
    "memory": "string",
    "cpu": "string"
  }
}
```

---

# Metadata System

## tags.json

Controlled vocabulary for content tags.

```json
{
  "tags": [
    {
      "id": "machine-learning",
      "display_name": "Machine Learning",
      "category": "domain"
    }
  ]
}
```

## aliases.json

Controlled vocabulary for content aliases.

```json
{
  "aliases": [
    {
      "alias": "np",
      "canonical_id": "package:numpy",
      "type": "package"
    }
  ]
}
```

## categories.json

Category definitions for navigation grouping with tag-based inference rules.

```json
{
  "categories": [
    {
      "id": "ml",
      "display_name": "Machine Learning",
      "content_types": ["model", "package"],
      "tag_rules": {
        "required_tags": ["ml", "machine-learning"],
        "priority": ["ml", "dl", "llm"]
      }
    }
  ]
}
```

**Category Assignment (v2.1):**
- Categories are assigned to content through tag-based inference, not explicit `category` field in content
- See ADR-002 for complete assignment algorithm

## registry.json

ID registry to prevent collisions. Uses full ID format including category for models.

```json
{
  "ids": [
    {
      "id": "package:numpy",
      "type": "package",
      "status": "active"
    },
    {
      "id": "model:ml:transformer",
      "type": "package",
      "status": "active"
    }
  ]
}
```

---

# Configuration System

## aens.config.json

Central configuration for the entire repository.

```json
{
  "version": "2.0",
  "content_types": ["package", "model", "workflow", "cheatsheet", "registry"],
  "schema_version_mapping": {
    "2.0": "schema/v2"
  },
  "size_budgets": {
    "package_max_common_tasks": 15,
    "workflow_max_steps": 8,
    "cheatsheet_max_entries": 30,
    "max_relationships_per_type": 20,
    "max_total_relationships": 50
  },
  "stability_tiers": {
    "stable": {
      "review_cadence_days": 365,
      "verification_required": true
    },
    "semi_stable": {
      "review_cadence_days": 90,
      "verification_required": true
    },
    "volatile": {
      "review_cadence_days": 30,
      "verification_required": false
    }
  },
  "validation_rules": {
    "require_bidirectional_relationships": true,
    "allow_unregistered_tags": false,
    "allow_unregistered_aliases": false
  },
  "registry_asset_types": ["model", "dataset", "service"]
}
```

---

# Validation Architecture

## Layer 1: Structural Validation

Validates content against JSON Schema.

**Tool:** Ajv or equivalent JSON Schema validator

**Checks:**
- Required fields present
- Field types correct
- Enum values valid
- Format constraints satisfied
- Pattern constraints satisfied

**Failure:** Error (content invalid)

---

## Layer 2: Constraint Validation

Validates size budgets and configuration constraints.

**Tool:** Custom validation logic reading from `aens.config.json`

**Checks:**
- Size budgets (maxItems, maxLength)
- Stability tier consistency
- Schema version valid
- Content type registered

**Failure:** Error (content invalid)

---

## Layer 3: Cross-Reference Validation

Validates relationship integrity.

**Tool:** Custom validation logic

**Checks:**
- Referenced IDs exist
- ID format valid (`type:slug`)
- Bidirectional relationships (if required)
- No self-references
- No circular references

**Failure:** Error (content invalid)

---

## Layer 4: Semantic Validation

Validates taxonomy conformance and business rules.

**Tool:** Custom validation logic

**Checks:**
- Tags registered in `metadata/tags.json`
- Aliases registered in `metadata/aliases.json`
- Category valid (if `category` field exists)
- Status consistency (deprecated flag matches status)
- Verification date within stability tier cadence

**Failure:** Error (content invalid)

---

# Search Architecture

## search-index.json

Static committed artifact containing all searchable content.

**Generated by:** `scripts/build-search-index.js`

**Structure:**
```json
{
  "version": "2.0",
  "generated_at": "ISO8601",
  "entries": [
    {
      "id": "type:slug",
      "type": "package|model|workflow|cheatsheet|registry",
      "title": "string",
      "aliases": ["string"],
      "tags": ["string"],
      "description": "string",
      "keywords": ["string"],
      "content_preview": "string",
      "category": "string"
    }
  ]
}
```

**Indexed Fields:**
- `title` (highest weight)
- `aliases` (high weight)
- `tags` (medium weight)
- `keywords` (medium weight)
- `description` (low weight)
- `content_preview` (low weight)

**Generation:**
- Deterministic from content
- No runtime generation
- Committed to git
- Regenerated on content change

---

# Navigation Architecture

## _nav.json Files

Generated navigation indexes for each content directory.

**Generated by:** `scripts/build-nav.js`

**Structure:**
```json
{
  "items": [
    {
      "id": "type:slug",
      "title": "string",
      "slug": "string",
      "category": "string"
    }
  ]
}
```

**Generation:**
- Derived from content files
- Category assigned via tag-based inference from `metadata/categories.json`
- Items sorted by `title` ascending, then by `id` ascending (deterministic)
- No manual editing
- Regenerated on content change

**Deterministic Ordering (v2.1):**
- Navigation items are explicitly sorted to ensure platform-independent deterministic generation
- Sort order: `title` ascending, then `id` ascending as tiebreaker

---

# Type System

## TypeScript Types

Derived from JSON Schema using `scripts/generate-types.js`.

**Generation:**
- Automated from JSON Schema
- Manual review after generation
- Committed to git
- Regenerated on schema change

**No manual maintenance.** Types are derived artifacts.

---

# Architecture Freeze Invariants

Once the rebuild is complete, these invariants must hold:

## Invariant 1: Schema Append-Only

Schemas in `schema/v2/` are never modified in breaking ways. Backward-compatible additions (new optional fields) are permitted. Breaking changes require `schema/v3/`.

## Invariant 2: Single Schema Authority

JSON Schema is the only schema authority. Zod schemas do not exist in production code.

## Invariant 3: Configuration Matches Schema

All constraints in `aens.config.json` must match constraints in schemas. The validator enforces this at startup.

## Invariant 4: Metadata is Authoritative

Content files reference registered tags/aliases. Unregistered references are validation errors.

## Invariant 5: Build-Time Artifacts

`search-index.json` and `_nav.json` are generated at build time and committed to git. No runtime generation.

## Invariant 6: Deterministic Builds

Given the same content, the build produces identical artifacts.

## Invariant 7: Validation Before Rendering

Content must pass all 4 validation layers before rendering. No exceptions.

## Invariant 8: No Legacy Dependencies

No production code depends on `legacy/`. The legacy directory exists only for reference.

---

# Content Governance

## Size Budgets

Size budgets are **mandatory architectural constraints**, not editorial preferences.

**Enforcement:**
- Schema-level (`maxItems`, `maxLength`)
- Config-level (redundant for human-readable errors)
- Validation-level (Layer 2)

**When Limits Are Reached:**
- Split content into focused sub-pages
- Parent page becomes an index
- Do not expand limits

## Version Stamps

All volatile artifacts carry version stamps.

**Volatile:**
- APIs
- SDKs
- Library interfaces
- Deployment tooling
- Model versions

**Timeless (exempt):**
- Algorithms
- Mathematical concepts
- Architectural patterns

**Field:** `versioning.verified_against`

## Status Lifecycle

Content moves through status lifecycle:

1. **draft** - Initial authoring
2. **stub** - Minimum viable content
3. **complete** - Full content, verified
4. **deprecated** - Replaced by newer content

**Transitions:**
- draft → stub → complete → deprecated
- complete → draft (for major updates)
- deprecated → archived (removed from navigation)

## Stability Tiers

Content stability determines review cadence.

**stable:** 365-day review cadence, verification required
**semi_stable:** 90-day review cadence, verification required
**volatile:** 30-day review cadence, verification optional

**Assignment:**
- Timeless concepts: stable
- Established libraries: semi_stable
- Rapidly evolving tools: volatile

---

# Architecture Principles from Freeze

These principles from the Architecture Freeze Decision Document are incorporated into this specification:

## Principle 1: Execution Over Education
Every section earns its place by answering "what do I need right now to solve the problem in front of me."

## Principle 2: Single Owner, Single Source
Every piece of information has exactly one home.

## Principle 3: Version Every Volatile Artifact
Any content coupled to a library version, model version, or API version carries a verification stamp.

## Principle 4: Depth Is Earned, Not Assumed
Content types are not added speculatively. They earn top-level status through use.

## Principle 5: Size Budgets Are Mandatory Architectural Constraints
Violation of size limits is an architectural defect, not an editorial preference.

## Principle 6: The Hierarchy Is the Learning Path, Not the Only Entry Point
Multiple valid entry points exist. Pages must be self-orienting.

## Principle 7: Maintenance Cost Is a First-Class Architectural Criterion
Features that create disproportionate maintenance burden are rejected.

## Principle 8: Search-First Architecture
Every page must be independently discoverable without relying on navigation.

---

# Non-Goals

This specification explicitly **does not** govern:

- UI/UX implementation details (preserved from existing application)
- Component architecture (preserved from existing application)
- Build tooling configuration (preserved from existing application)
- Deployment configuration (preserved from existing application)
- Testing strategy (preserved from existing application)

These areas are considered **stable foundation** and are not part of the rebuild scope.

---

# Schema Evolution Policy

## Compatible Changes (Do NOT Require New Schema Version)

The following changes can be made to the current schema version without requiring a new version:

- Adding optional fields to existing content types
- Adding new content types
- Relaxing constraints (e.g., increasing `maxLength`, expanding enum values)
- Adding new validation rules that are warnings, not errors

## Breaking Changes (Require New Schema Version)

The following changes require creating a new schema version (e.g., v3):

- Removing or renaming required fields
- Changing field types
- Tightening constraints (e.g., decreasing `maxLength`, restricting enum values)
- Changing the structure of nested objects
- Removing content types

## Migration Rules

When creating a new schema version (e.g., v3):
- Specify the migration path from v2 to v3
- Provide automated migration scripts if feasible
- Document manual migration steps if automation is not feasible
- Maintain backward compatibility for at least one transition period

## Deprecation Rules

- Fields can be marked as deprecated in the current version before removal in the next version
- Deprecated fields should emit validation warnings
- Deprecation period should be at least 90 days before removal

## Version Lifecycle

- Support at most 2 active schema versions at any time
- When v3 is released, v1 is deprecated
- Deprecated schema versions are archived to `legacy/schema/`

---

# Specification Versioning

This specification follows semantic versioning:

**Major (X.0):** Breaking architectural changes
**Minor (0.X):** Non-breaking additions
**Patch (0.0.X):** Clarifications, corrections

Current version: **2.1** (v2.1 Freeze - 2026-06-30)

---

# Change Process

1. Propose change via ADR in `docs/adr/`
2. Update this specification (canonical authority)
3. Update dependent documents to synchronize
4. Update `AENS_REBUILD_MASTER_PLAN.md` if implementation affected
5. Implement according to `AI_EXECUTION_PROTOCOL.md`

**v2.1 Freeze (2026-06-30):**
- Architecture is frozen except through ADR process
- No architectural changes without ADR
- Implementation-level decisions (CLI flags, git hooks, etc.) can be made during implementation
- See `SPECIFICATION_GAP_LOG.md` for resolved issues and deferred items

No architectural changes without ADR. No implementation without specification update.
