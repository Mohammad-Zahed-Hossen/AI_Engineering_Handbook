# AI Implementation Playbook

**Version:** 2.1
**Purpose:** Permanent instruction document for AI coding agents (Claude Code, Codex, Windsurf, Kimi Agent, etc.)
**Scope:** AENS rebuild implementation

This playbook defines the rules and constraints that AI coding agents must follow when implementing the AENS rebuild. These rules are permanent and must not be violated.

---

# Core Principles

## 1. No Architectural Decisions
- **Never** invent schemas, APIs, or data structures
- **Always** use the exact specifications from FOUNDATION_IMPLEMENTATION_BLUEPRINT.md
- **Never** add fields, functions, or modules not specified
- **Never** remove fields, functions, or modules specified
- **Never** change the structure of specified components

## 2. Canonical Authority
- **REPOSITORY_FOUNDATION_SPECIFICATION_v2.md** is the single source of truth
- **IMPLEMENTATION_SPECIFICATION.md** provides implementation details
- **FOUNDATION_IMPLEMENTATION_BLUEPRINT.md** provides the execution plan
- **IMPLEMENTATION_ROADMAP.md** provides the developer guide
- **Never** contradict these documents
- **Never** prefer your own judgment over these documents

## 3. ADR Compliance
- **Never** modify ADR decisions
- **ADR-001:** Content schema is canonical authority - always check schema/v2/ for structure
- **ADR-002:** Category assignment uses tag-based inference - never hardcode categories
- **ADR-003:** Search behavior is specified - no fuzzy matching, no ranking
- **ADR-004:** Model IDs use category encoding - always use `model:{category}:{slug}` format

---

# Prohibited Actions

## Never Invent Schemas
- **Do not** create JSON Schema structures not specified in FOUNDATION_IMPLEMENTATION_BLUEPRINT.md
- **Do not** add fields to schemas not listed in the specification
- **Do not** change field types from the specification
- **Do not** remove required fields from schemas

## Never Modify IDs
- **Do not** change ID formats
- **Do not** invent new ID patterns
- **Do not** use legacy ID formats (e.g., `package/numpy` → use `package:numpy`)
- **Do not** change model ID format (must be `model:{category}:{slug}`)

## Never Rename Directories
- **Do not** change directory structure from FOUNDATION_IMPLEMENTATION_BLUEPRINT.md
- **Do not** move files to different directories
- **Do not** create directories not specified
- **Do not** use alternative directory names

## Never Skip Validation
- **Do not** skip validation layers
- **Do not** disable validation for convenience
- **Do not** ignore validation errors
- **Do not** proceed with invalid content

## Never Edit Generated Artifacts Manually
- **Do not** manually edit TypeScript types generated from JSON Schema
- **Do not** manually edit search-index.json
- **Do not** manually edit _nav.json files
- **Do not** manually edit any generated content

## Never Change Dependencies
- **Do not** add dependencies not specified
- **Do not** remove dependencies specified
- **Do not** use alternative libraries for specified tools (e.g., use json-schema-to-typescript, not manual types)

## Never Exceed Milestone Scope
- **Do not** create files belonging to future milestones
- **Do not** implement features from future phases
- **Do not** modify files not specified in current milestone
- **Before creating, modifying, renaming, or deleting any file, verify the action belongs to the current milestone**
- **If the requested action belongs to a future milestone, STOP and ask for confirmation**

---

# Required Actions

## Always Update Tests with Implementation
- **Do** write unit tests as you implement each phase
- **Do** ensure tests pass before proceeding to next phase
- **Do** test edge cases and error conditions
- **Do** verify test coverage for all public APIs

## Always Ask for Clarification
- **Do** ask when specification is ambiguous
- **Do** ask when multiple interpretations are possible
- **Do** ask when a required dependency is unclear
- **Do not** invent behavior when specification is unclear

## Always Respect Canonical Authority Documents
- **Do** check REPOSITORY_FOUNDATION_SPECIFICATION_v2.md for schema structure
- **Do** check IMPLEMENTATION_SPECIFICATION.md for API contracts
- **Do** check FOUNDATION_IMPLEMENTATION_BLUEPRINT.md for file structure
- **Do** check IMPLEMENTATION_ROADMAP.md for execution steps

## Always Use Specified Tools
- **Do** use `json-schema-to-typescript` for type generation
- **Do** use `Ajv` for JSON Schema validation
- **Do** use `tsx` for TypeScript script execution
- **Do** use `array.filter()` for search (no external search library)

## Always Follow Phase Order
- **Do** implement phases in numerical order (1-14)
- **Do** verify phase dependencies before starting
- **Do** complete phase acceptance criteria before proceeding
- **Do not** skip phases or implement out of order

---

# Specific Rules by Component

## JSON Schema (Phase 3)
- Use exact JSON Schema 2020-12 format from FOUNDATION_IMPLEMENTATION_BLUEPRINT.md
- Use `$ref` to extend base.schema.json
- Never add fields not in the specification
- Never change field types from the specification
- Validate all schemas with Ajv

## TypeScript Types (Phase 5)
- Use `json-schema-to-typescript` package
- Use the exact script specification from FOUNDATION_IMPLEMENTATION_BLUEPRINT.md
- Never manually edit generated types
- Regenerate types if schema changes

## Validation (Phase 6)
- Implement all 4 layers exactly as specified
- Layer 1: Ajv-based schema validation
- Layer 2: Constraint validation from config
- Layer 3: Cross-reference validation
- Layer 4: Semantic validation
- Never skip layers
- Never combine layers

## Content Loader (Phase 7)
- Implement resolveById with model ID format handling
- Parse `model:{category}:{slug}` format correctly
- Never hardcode category assignment
- Use metadata/categories.json for category inference

## Search (Phase 8)
- Use exact match on title, aliases, tags
- Use substring match on keywords, description
- No ranking required
- No fuzzy matching
- Simple array.filter() implementation
- No external search library

## Navigation (Phase 9)
- Use tag_rules from metadata/categories.json for category assignment
- Sort by title ascending, then by id ascending
- Never hardcode category assignments
- Generate _nav.json files for specified directories only

## UI Components (Phase 10)
- Maintain existing UI structure and styling
- Only change data sources (imports)
- SearchBox: import from lib/search/index.ts
- Sidebar: import from content/*/_nav.json
- No visual changes allowed

## Pages (Phase 11)
- Use resolveById for all data loading
- Handle null return with 404
- Use correct ID format for each route type
- Maintain existing page structure and styling
- No visual changes allowed

---

# Error Handling

## When Specification is Ambiguous
1. Stop implementation
2. Ask for clarification
3. Do not invent behavior
4. Wait for clarification before proceeding

## When Multiple Interpretations are Possible
1. Identify the ambiguity
2. Ask which interpretation is correct
3. Do not choose arbitrarily
4. Wait for clarification before proceeding

## When Required Dependency is Unclear
1. Check if dependency is specified in FOUNDATION_IMPLEMENTATION_BLUEPRINT.md
2. Check if dependency is specified in IMPLEMENTATION_SPECIFICATION.md
3. If not found, ask for clarification
4. Do not add dependencies without specification

## When Implementation Fails
1. Check if you followed the specification exactly
2. Check if all dependencies are installed
3. Check if previous phases are complete
4. If still failing, ask for help with specific error

---

# Quality Standards

## Code Quality
- TypeScript must compile without errors
- ESLint must pass without warnings
- No console.log statements in production code
- No TODO comments without tracking
- Clear, descriptive function names
- JSDoc comments on all public APIs

## Test Quality
- Unit tests for all public functions
- Tests for error conditions
- Tests for edge cases
- Tests pass before phase completion
- Test coverage > 80%

## Documentation Quality
- Update README.md as features are implemented
- Update inline comments for complex logic
- No outdated comments
- Clear commit messages

## Performance Standards
- Search index generation < 5 seconds
- Navigation generation < 2 seconds
- Validation < 10 seconds
- Page load < 2 seconds

---

# Git Workflow

## Commit Messages
- Use descriptive commit messages
- Format: `[Phase X] Description`
- Example: `[Phase 3] Create JSON Schema files`
- Commit after each phase completion

## Branch Strategy
- Work on main branch for this rebuild
- No feature branches required for single-agent implementation
- Tag each phase completion: `v2.1-phase-X-complete`

## Tagging
- Tag after each phase: `git tag v2.1-phase-X-complete`
- Tag final completion: `git tag v2.1-complete`
- Push tags to remote

---

# Verification Checklist

Before marking a phase complete, verify:
- [ ] All files specified in phase are created/updated
- [ ] All acceptance criteria are met
- [ ] All unit tests pass
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without warnings
- [ ] No TODO comments without tracking
- [ ] No console.log statements
- [ ] Code follows specification exactly
- [ ] No architectural decisions were made
- [ ] No violations of this playbook

---

# Emergency Procedures

## If You Accidentally Violate a Rule
1. Stop immediately
2. Revert the change
3. Identify which rule was violated
4. Ask for guidance on correct approach
5. Do not proceed until clarified

## If You Cannot Proceed
1. Identify the blocker
2. Check all specification documents
3. Check previous phases for completion
4. Ask for specific help with the blocker
5. Do not work around the blocker

## If Specification Contradicts Itself
1. Identify the contradiction
2. Note which documents contradict
3. Ask for clarification on which document takes precedence
4. Do not choose arbitrarily
5. Wait for clarification before proceeding

---

# Success Criteria

Implementation is successful when:
- All 14 phases are complete
- All acceptance criteria are met
- All unit tests pass
- TypeScript compiles without errors
- ESLint passes without warnings
- No violations of this playbook
- All audits in Phase 13 pass
- Performance targets in Phase 13 are met
- Project is ready for production

---

# Contact and Escalation

When in doubt:
1. Check this playbook first
2. Check specification documents
3. Check IMPLEMENTATION_ROADMAP.md
4. Ask for clarification

Never proceed with uncertainty. Always ask when specification is unclear.
