<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:ai-documentation-loading-order -->
# AI Documentation Loading Order

When scanning `docs/` for project context, load documents in this order:

## Priority 1: Agent Configuration (Always Load First)
1. **AGENTS.md** (this file) - Agent configuration and loading order
2. **CLAUDE.md** - Claude-specific agent configuration

## Priority 2: Engineering (Contributor Rules)
3. **engineering/project-rules.md** - Project identity, tech stack, hard rules (ai_priority: 1)
4. **engineering/content-schema.md** - Content schema and writing guidelines (ai_priority: 2)
5. **engineering/validation.md** - Content validation rules and implementation (ai_priority: 2)

## Priority 3: Architecture (System Design)
6. **architecture/overview.md** - High-level architecture and system diagrams (ai_priority: 2)
7. **architecture/data-flow.md** - Data flows and pipelines (ai_priority: 3)
8. **architecture/components.md** - Component architecture and relationships (ai_priority: 3)
9. **architecture/search.md** - Search architecture (if search-related task) (ai_priority: 3)
10. **architecture/navigation.md** - Navigation architecture (if navigation-related task) (ai_priority: 3)
11. **architecture/repository.md** - Repository directory structure (ai_priority: 4)
12. **architecture/design-principles.md** - Design philosophy and principles (ai_priority: 4)

## Priority 4: Guides (How-To Procedures)
13. **guides/validation-workflow.md** - Validation workflow guide (ai_priority: 3)
14. **guides/adding-package.md** - Package addition guide (ai_priority: 4)
15. **guides/adding-model.md** - Model addition guide (ai_priority: 4)
16. **guides/adding-workflow.md** - Workflow addition guide (ai_priority: 4)
17. **guides/adding-cheatsheet.md** - Cheatsheet addition guide (ai_priority: 4)

## Priority 5: Reference (Quick Lookups)
18. **reference/naming.md** - Naming conventions (ai_priority: 5)
19. **reference/schemas.md** - Schema reference (ai_priority: 5)
20. **reference/quick-reference.md** - Quick reference lookup (ai_priority: 5)

## Priority 6: ADR (Architecture Decision Records)
21. **adr/** - Load ADRs only if architecture decisions are relevant (ai_priority: 6)

## Priority 7: Migration (Active Implementation Specifications)
22. **migration/** - Load ONLY when performing repository migration tasks
    - Contains: legacy migration plans and specifications
    - Status: Historical reference only (Step 2A completed)
    - DO NOT load for current implementation guidance
23. **migration_v2/** - Load when implementing AENS rebuild (Step 2B)
    - Contains: REPOSITORY_FOUNDATION_SPECIFICATION_v2.md, FOUNDATION_IMPLEMENTATION_BLUEPRINT.md, IMPLEMENTATION_ROADMAP.md, AI_IMPLEMENTATION_PLAYBOOK.md
    - Status: Authoritative while Step 2B is in progress
    - DO NOT treat as historical
    - Use for current implementation guidance
    - Canonical authority for AENS rebuild

## Priority 8: Archive (Historical Only)
24. **archive/** - Load ONLY if explicitly asked for historical context
    - Contains: completed migration plans, historical audits, superseded specifications
    - DO NOT load for current implementation guidance
    - DO NOT load for architecture decisions (use adr/ instead)

## Context Optimization Rules

- **Load on demand**: Only load architecture modules relevant to the current task
- **Skip archive**: Never load archive/ unless explicitly requested
- **Prefer engineering**: Always load engineering/ before architecture/ for rule context
- **Follow ai_priority**: Use ai_priority in frontmatter to determine loading order
- **Modular loading**: Load specific architecture modules (e.g., search.md) instead of all architecture docs
- **Canonical sources**: Each topic has exactly one canonical document (marked with frontmatter)

## Document Taxonomy

- **Architecture**: System design, data flows, components (architecture/)
- **Engineering**: Authoritative rules, constraints, contributor guidelines (engineering/)
- **Guide**: How-to procedures and workflows (guides/)
- **Reference**: Quick references and lookup tables (reference/)
- **ADR**: Architecture Decision Records (adr/)
- **Historical**: Completed work, superseded documents (archive/)

## Dependency Graph

See `DEPENDENCY_GRAPH.md` for the complete documentation dependency graph and task-based loading examples.

## Task-Based Loading Examples

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
<!-- END:ai-documentation-loading-order -->
