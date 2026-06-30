---
id: meta-dependency-graph
title: Documentation Dependency Graph
type: meta
status: active
owner: system
canonical: true
version: 1.0
related: []
ai_priority: 0
---

# Documentation Dependency Graph

This document defines the dependency relationships between documentation files and the recommended loading order for AI agents.

---

## High-Level Dependency Graph

```
AGENTS.md (Entry Point)
    ↓
├─→ Engineering Layer
│   ├─→ project-rules.md (ai_priority: 1)
│   │   └─→ content-schema.md (ai_priority: 2)
│   │   └─→ validation.md (ai_priority: 2)
│   └─→ Reference Layer
│       ├─→ naming.md (ai_priority: 5)
│       ├─→ schemas.md (ai_priority: 5)
│       └─→ quick-reference.md (ai_priority: 5)
│
├─→ Architecture Layer
│   ├─→ overview.md (ai_priority: 2)
│   │   └─→ repository.md (ai_priority: 4)
│   │   └─→ data-flow.md (ai_priority: 3)
│   │   └─→ design-principles.md (ai_priority: 4)
│   ├─→ components.md (ai_priority: 3)
│   ├─→ search.md (ai_priority: 3)
│   └─→ navigation.md (ai_priority: 3)
│
├─→ Guides Layer
│   ├─→ validation-workflow.md (ai_priority: 3)
│   ├─→ adding-package.md (ai_priority: 4)
│   ├─→ adding-model.md (ai_priority: 4)
│   ├─→ adding-workflow.md (ai_priority: 4)
│   └─→ adding-cheatsheet.md (ai_priority: 4)
│
└─→ ADR Layer
    └─→ adr/*.md (ai_priority: 6)
```

---

## Document-Level Dependencies

### AGENTS.md
- **Depends on**: None (entry point)
- **Loaded by**: AI agents first
- **Purpose**: Defines loading order and context rules

### Engineering Layer

#### project-rules.md
- **Depends on**: None
- **Dependents**: content-schema.md, validation.md, all guides
- **ai_priority**: 1 (highest priority after AGENTS.md)
- **Purpose**: Project identity, tech stack, hard rules

#### content-schema.md
- **Depends on**: project-rules.md
- **Dependents**: validation.md, all guides, reference/schemas.md
- **ai_priority**: 2
- **Purpose**: Content schema and field guidelines

#### validation.md
- **Depends on**: project-rules.md, content-schema.md
- **Dependents**: validation-workflow.md
- **ai_priority**: 2
- **Purpose**: Content validation rules and implementation

### Architecture Layer

#### overview.md
- **Depends on**: None
- **Dependents**: repository.md, data-flow.md, design-principles.md
- **ai_priority**: 2
- **Purpose**: High-level system architecture

#### repository.md
- **Depends on**: overview.md
- **Dependents**: None
- **ai_priority**: 4
- **Purpose**: Repository directory structure

#### data-flow.md
- **Depends on**: overview.md
- **Dependents**: None
- **ai_priority**: 3
- **Purpose**: Data flows and pipelines

#### design-principles.md
- **Depends on**: overview.md
- **Dependents**: None
- **ai_priority**: 4
- **Purpose**: Design philosophy and principles

#### components.md
- **Depends on**: overview.md, data-flow.md
- **Dependents**: None
- **ai_priority**: 3
- **Purpose**: Component architecture

#### search.md
- **Depends on**: overview.md, data-flow.md
- **Dependents**: None
- **ai_priority**: 3
- **Purpose**: Search architecture

#### navigation.md
- **Depends on**: overview.md, data-flow.md, repository.md
- **Dependents**: None
- **ai_priority**: 3
- **Purpose**: Navigation architecture

### Guides Layer

#### validation-workflow.md
- **Depends on**: validation.md
- **Dependents**: None
- **ai_priority**: 3
- **Purpose**: Validation workflow guide

#### adding-package.md
- **Depends on**: content-schema.md, validation.md
- **Dependents**: None
- **ai_priority**: 4
- **Purpose**: Package addition guide

#### adding-model.md
- **Depends on**: content-schema.md, validation.md
- **Dependents**: None
- **ai_priority**: 4
- **Purpose**: Model addition guide

#### adding-workflow.md
- **Depends on**: content-schema.md, validation.md
- **Dependents**: None
- **ai_priority**: 4
- **Purpose**: Workflow addition guide

#### adding-cheatsheet.md
- **Depends on**: content-schema.md, validation.md
- **Dependents**: None
- **ai_priority**: 4
- **Purpose**: Cheatsheet addition guide

### Reference Layer

#### naming.md
- **Depends on**: content-schema.md, validation.md
- **Dependents**: None
- **ai_priority**: 5
- **Purpose**: Naming conventions reference

#### schemas.md
- **Depends on**: content-schema.md, validation.md
- **Dependents**: None
- **ai_priority**: 5
- **Purpose**: Schema reference

#### quick-reference.md
- **Depends on**: project-rules.md, validation.md
- **Dependents**: None
- **ai_priority**: 5
- **Purpose**: Quick reference lookup

### ADR Layer

#### adr/*.md
- **Depends on**: None
- **Dependents**: None
- **ai_priority**: 6
- **Purpose**: Architecture decision records

---

## AI Loading Strategy

### Priority-Based Loading

AI agents should load documents in this order:

1. **Priority 0**: AGENTS.md (always first)
2. **Priority 1**: engineering/project-rules.md
3. **Priority 2**: engineering/content-schema.md, engineering/validation.md, architecture/overview.md
4. **Priority 3**: architecture/data-flow.md, architecture/components.md, architecture/search.md, architecture/navigation.md, guides/validation-workflow.md
5. **Priority 4**: architecture/repository.md, architecture/design-principles.md, guides/adding-*.md
6. **Priority 5**: reference/*.md
7. **Priority 6**: adr/*.md (only if architecture decisions are relevant)

### Context Optimization Rules

- **Load on demand**: Only load architecture modules relevant to the current task
- **Skip archive**: Never load archive/ unless explicitly requested
- **Prefer engineering**: Always load engineering/ before architecture/ for rule context
- **Modular loading**: Load specific architecture modules instead of all architecture docs
- **Canonical sources**: Each topic has exactly one canonical document

### Task-Based Loading Examples

**Task: Add a new package**
1. AGENTS.md
2. engineering/project-rules.md
3. engineering/content-schema.md
4. engineering/validation.md
5. guides/adding-package.md
6. reference/naming.md (if needed)

**Task: Fix search functionality**
1. AGENTS.md
2. architecture/overview.md
3. architecture/data-flow.md
4. architecture/search.md

**Task: Understand system architecture**
1. AGENTS.md
2. architecture/overview.md
3. architecture/data-flow.md
4. architecture/components.md
5. architecture/design-principles.md

---

## Circular Dependencies

**None detected.** The documentation is designed to be acyclic to prevent circular dependency issues.

---

## Versioning

When a document is updated:
1. Increment `version` in frontmatter
2. Update `last_reviewed` date (if added)
3. Check if dependent documents need updates
4. Update `related` links if dependencies change

---

## Related Documentation

- **AI Loading Order**: See `AGENTS.md`
- **Project Rules**: See `engineering/project-rules.md`
