# AI Execution Protocol
**Version:** 1.0
**Purpose:** Rules every AI agent must follow during AENS repository rebuild
**Scope:** All AI-assisted implementation work

---

# Core Directive

> Never skip phases. Never introduce compatibility layers unless explicitly authorized. Never invent architecture. Always update documentation before implementation.

This protocol governs all AI agent behavior during the AENS repository rebuild. AI agents must follow these rules without exception.

---

# Governing Documents Hierarchy

AI agents must consult documents in this order when making decisions:

1. **AENS_REBUILD_MASTER_PLAN.md** - Overall rebuild strategy and phase definitions
2. **REPOSITORY_FOUNDATION_SPECIFICATION_v2.md** - Canonical architecture specification
3. **REBUILD_PHASE_CHECKLIST.md** - Detailed checklist for current phase
4. **AI_EXECUTION_PROTOCOL.md** - This document (agent behavior rules)
5. **docs/adr/*.md** - Specific architectural decisions (if applicable)

**Rule:** If a question is not answered by a higher-priority document, consult the next document. If still unanswered, ask the user for clarification.

---

# Phase Execution Rules

## Rule 1: Complete Phases Sequentially

**Never start Phase N until Phase N-1 is complete.**

**Definition of Complete:**
- All checklist items in REBUILD_PHASE_CHECKLIST.md are checked
- All acceptance criteria are met
- No blocking errors remain
- Phase Definition of Done is satisfied

**Violation:** Starting Phase 2 before Phase 1 Definition of Done is met is a protocol violation.

---

## Rule 2: No Overlapping Implementation

**Never implement parts of Phase N+1 while working on Phase N.**

**Rationale:** Overlapping implementation creates hybrid architecture and violates the "no bridge period" principle.

**Example:** While implementing Phase 4 (Schema), do not create TypeScript types (Phase 6). While implementing Phase 7 (Validation), do not create content loaders (Phase 8).

**Violation:** Implementing features from a future phase is a protocol violation.

---

## Rule 3: No Partial Migration

**Never leave a subsystem in a partially migrated state.**

**Definition of Partial Migration:**
- Some files use old system, some use new system
- Compatibility layers exist without explicit authorization
- Bridge periods without clear exit strategy
- Dual systems running simultaneously

**Correct Pattern:**
- Either old system is fully in place
- Or new system is fully in place
- No in-between state

**Violation:** Leaving a subsystem partially migrated is a protocol violation.

---

## Rule 4: No Hybrid Architecture

**Never combine old and new architectural patterns.**

**Examples of Hybrid Architecture (FORBIDDEN):**
- Zod schema + JSON Schema as equal authorities
- Dynamic search generation + static search-index.json
- Manual types + auto-generated types
- Legacy data.ts + new content engine
- Old validation + new validation

**Correct Pattern:**
- One schema authority (JSON Schema)
- One search architecture (static)
- One type system (derived)
- One content engine (new)
- One validation pipeline (4-layer)

**Violation:** Creating hybrid architecture is a protocol violation.

---

# Architecture Rules

## Rule 5: Never Invent Architecture

**Never make architectural decisions not specified in governing documents.**

**What Requires User Authorization:**
- New content types
- New metadata fields
- New validation layers
- New directory structures
- New configuration sections
- New build artifacts
- Changes to canonical authorities

**What AI Can Decide:**
- Implementation details (function names, variable names)
- Code organization within specified structure
- Error message wording
- Test case specifics
- Minor optimizations that don't change architecture

**Protocol:**
1. Check if decision is architectural (affects structure, contracts, authorities)
2. If yes, check governing documents for specification
3. If not specified, ask user for authorization
4. If no, proceed with implementation

**Violation:** Making unauthorized architectural decisions is a protocol violation.

---

## Rule 6: Follow Canonical Authorities

**Always respect the canonical authorities defined in REPOSITORY_FOUNDATION_SPECIFICATION_v2.md.**

**Canonical Authorities (Never Duplicate):**
- Schema → JSON Schema 2020-12 in `schema/v2/`
- Content → `content/[type]/[id].json`
- Metadata → `metadata/*.json`
- Configuration → `aens.config.json`
- Navigation → Generated `_nav.json` from content
- Search → Static `search-index.json`
- Validation → 4-layer pipeline
- Types → Derived from JSON Schema
- IDs → `metadata/registry.json`

**Protocol:**
1. Before creating a new source of truth, check if concept already has canonical authority
2. If yes, use the canonical authority
3. If no, ask user if this is a new concept requiring architecture decision

**Violation:** Creating a duplicate authority is a protocol violation.

---

## Rule 7: Single Source of Truth

**Never duplicate information across multiple authoritative sources.**

**Examples of Duplication (FORBIDDEN):**
- Size budgets in schema AND config without synchronization
- Tags in content files AND metadata/tags.json without clear authority
- Aliases in content files AND metadata/aliases.json without clear authority
- Constraints in schema AND config without validation

**Correct Pattern:**
- Schema is the contract
- Config references schema
- Content references metadata
- Validation enforces single source

**Violation:** Duplicating authoritative information is a protocol violation.

---

# Implementation Rules

## Rule 8: Update Documentation Before Implementation

**Never implement without first updating documentation.**

**Protocol:**
1. If implementation requires architectural decision, create ADR first
2. If implementation changes specification, update specification first
3. If implementation affects phase checklist, update checklist first
4. Then implement

**Exception:** Bug fixes that don't change architecture can be implemented directly.

**Violation:** Implementing before documentation is a protocol violation.

---

## Rule 9: Follow Acceptance Criteria

**Never consider a task complete until all acceptance criteria are met.**

**Protocol:**
1. Read acceptance criteria in REBUILD_PHASE_CHECKLIST.md
2. Implement to meet criteria
3. Verify each criterion is met
4. Only then mark task complete

**Violation:** Marking task complete without meeting all acceptance criteria is a protocol violation.

---

## Rule 10: Test Before Marking Complete

**Never mark implementation complete without testing.**

**Minimum Testing:**
- Code compiles without errors
- Script runs without errors
- Component renders without errors
- Validation passes on test content
- Build succeeds

**Preferred Testing:**
- Unit tests for critical functions
- Integration tests for subsystems
- End-to-end tests for user flows

**Protocol:**
1. Implement feature
2. Run minimum testing
3. If errors, fix and re-test
4. Only then mark complete

**Violation:** Marking implementation complete without testing is a protocol violation.

---

# Error Handling Rules

## Rule 11: Stop on Blocking Errors

**Never continue implementation when a blocking error occurs.**

**Definition of Blocking Error:**
- Error that prevents completion of current task
- Error that indicates architectural violation
- Error that suggests specification is unclear
- Error that cannot be resolved without user input

**Protocol:**
1. Identify error as blocking or non-blocking
2. If blocking, stop immediately
3. Report error to user with context
4. Wait for user guidance
5. Do not work around blocking errors

**Non-Blocking Errors:**
- Typos
- Minor syntax errors
- Missing imports
- Simple configuration errors

**Protocol for Non-Blocking:**
1. Fix error
2. Re-test
3. Continue

**Violation:** Continuing past blocking errors is a protocol violation.

---

## Rule 12: Ask for Clarification on Ambiguity

**Never assume when specification is ambiguous.**

**Protocol:**
1. Identify ambiguity in governing documents
2. Check all governing documents for clarification
3. If still ambiguous, ask user for clarification
4. Do not make assumptions

**Examples of Ambiguity:**
- Conflicting requirements in documents
- Missing acceptance criteria
- Unclear data structures
- Undefined behavior

**Violation:** Making assumptions on ambiguous specifications is a protocol violation.

---

# Compatibility Layer Rules

## Rule 13: No Compatibility Layers Without Authorization

**Never create compatibility layers unless explicitly authorized by user.**

**Definition of Compatibility Layer:**
- Code that translates between old and new systems
- Bridge code that allows dual systems to coexist
- Adapter code that converts old format to new format
- Temporary code with no clear removal plan

**When Compatibility Layers Are Allowed:**
- User explicitly authorizes in prompt
- ADR explicitly authorizes for specific phase
- Phase checklist explicitly requires bridge period

**Protocol:**
1. Check if compatibility layer is needed
2. Check if user authorized it
3. Check if ADR authorizes it
4. Check if phase checklist requires it
5. If none of the above, do not create it

**Violation:** Creating unauthorized compatibility layers is a protocol violation.

---

## Rule 14: Compatibility Layers Must Have Exit Strategy

**If a compatibility layer is authorized, it must have a clear exit strategy.**

**Exit Strategy Requirements:**
- Which phase removes the layer
- Which checklist item removes the layer
- What triggers removal
- How removal is verified

**Protocol:**
1. Before creating compatibility layer, define exit strategy
2. Document exit strategy in code comments
3. Document exit strategy in phase checklist
4. Ensure exit strategy is achievable

**Violation:** Creating compatibility layer without exit strategy is a protocol violation.

---

# File and Directory Rules

## Rule 15: Follow Specified Directory Structure

**Never create directories or files outside the specified structure.**

**Specified Structure:**
- `content/` - Content files
- `schema/v2/` - JSON Schema files
- `metadata/` - Controlled vocabularies
- `types/` - TypeScript types
- `scripts/` - Build and validation scripts
- `lib/content/` - Content engine
- `lib/validation/` - Validation logic
- `legacy/` - Archived old systems
- `docs/adr/` - Architectural decisions
- `docs/migration/` - Migration artifacts

**Protocol:**
1. Check REPOSITORY_FOUNDATION_SPECIFICATION_v2.md for structure
2. Only create directories specified
3. Only create files in specified directories
4. If new directory is needed, ask user for authorization

**Violation:** Creating files/directories outside specified structure is a protocol violation.

---

## Rule 16: Never Delete Without Confirmation

**Never delete files or directories without explicit user confirmation.**

**Exceptions:**
- Files explicitly marked for deletion in phase checklist
- Files in `legacy/` that are confirmed duplicates
- Temporary build artifacts (with user authorization)

**Protocol:**
1. Before deleting, check if deletion is in phase checklist
2. If not in checklist, ask user for confirmation
3. Only delete after confirmation
4. Document deletion in migration notes

**Violation:** Deleting files without confirmation is a protocol violation.

---

# Validation Rules

## Rule 17: Validation Must Pass Before Rendering

**Never allow content to render if it fails validation.**

**Protocol:**
1. Implement validation pipeline
2. Run validation before any rendering
3. If validation fails, block rendering
4. Show validation errors to user
5. Do not render invalid content

**Exception:** Development mode with explicit user override.

**Violation:** Rendering invalid content is a protocol violation.

---

## Rule 18: All 4 Validation Layers Must Pass

**Never skip validation layers.**

**4 Layers:**
1. Layer 1: Structural (JSON Schema)
2. Layer 2: Constraints (size budgets)
3. Layer 3: Cross-Reference (relationship integrity)
4. Layer 4: Semantic (taxonomy conformance)

**Protocol:**
1. Implement all 4 layers
2. Run all 4 layers in sequence
3. If any layer fails, validation fails
4. Do not skip layers
5. Do not reorder layers

**Violation:** Skipping validation layers is a protocol violation.

---

# Build Artifact Rules

## Rule 19: Build Artifacts Must Be Deterministic

**Never generate non-deterministic build artifacts.**

**Deterministic Definition:**
- Same input → same output
- No randomness
- No timestamps in output (except metadata field)
- No system-dependent values

**Build Artifacts:**
- `search-index.json`
- `_nav.json` files
- TypeScript types
- Validation reports

**Protocol:**
1. Ensure generation is deterministic
2. Test with same input multiple times
3. Verify output is identical
4. If non-deterministic, fix before committing

**Violation:** Generating non-deterministic artifacts is a protocol violation.

---

## Rule 20: Build Artifacts Must Be Committed

**Never leave build artifacts uncommitted.**

**Committed Artifacts:**
- `search-index.json`
- `_nav.json` files
- TypeScript types (if not auto-generated at build time)

**Protocol:**
1. Generate artifact
2. Verify artifact is correct
3. Commit artifact to git
4. Add to build process for regeneration

**Exception:** Artifacts explicitly marked as .gitignore in specification.

**Violation:** Leaving build artifacts uncommitted is a protocol violation.

---

# Communication Rules

## Rule 21: Report Progress Clearly

**Always report progress in a clear, structured way.**

**Progress Report Format:**
```
Phase X: [Phase Name]
Task: [Current Task]
Status: [In Progress/Complete/Blocked]
- [Completed item 1]
- [Completed item 2]
- [Pending item 3]
```

**Protocol:**
1. Report progress after each significant task
2. Use structured format
3. Highlight any blockers
4. Be concise

---

## Rule 22: Ask Before Assuming

**Never assume user intent is clear if it's not.**

**Protocol:**
1. If user request is ambiguous, ask for clarification
2. If multiple interpretations exist, ask user to choose
3. If specification is unclear, ask user for guidance
4. Do not proceed with assumptions

**Violation:** Proceeding with assumptions is a protocol violation.

---

# Quality Rules

## Rule 23: Code Must Be Type-Safe

**Never use `any` type unless explicitly necessary.**

**Protocol:**
1. Use TypeScript types from `types/`
2. Define types for all functions
3. Avoid type assertions
4. Use `unknown` instead of `any` if type is truly unknown
5. Only use `any` with explicit comment explaining why

**Violation:** Using `any` without justification is a protocol violation.

---

## Rule 24: Code Must Be Documented

**Never commit undocumented code.**

**Documentation Requirements:**
- JSDoc comments on all exported functions
- Inline comments for complex logic
- README for new modules
- Type definitions for all data structures

**Protocol:**
1. Add JSDoc to all exports
2. Add inline comments for complex logic
3. Add README for new modules
4. Only commit after documentation is complete

**Violation:** Committing undocumented code is a protocol violation.

---

## Rule 25: Code Must Follow Existing Style

**Never introduce new code style without reason.**

**Protocol:**
1. Check existing code for style patterns
2. Follow existing patterns
3. Use existing linting configuration
4. Run linter before committing
5. Fix all linting errors

**Violation:** Introducing inconsistent code style is a protocol violation.

---

# Testing Rules

## Rule 26: Write Tests for Critical Paths

**Never leave critical paths untested.**

**Critical Paths:**
- Content loading
- Validation pipeline
- Search indexing
- Navigation generation
- ID resolution
- Relationship resolution

**Protocol:**
1. Identify critical paths
2. Write tests for each critical path
3. Run tests before committing
4. Fix all test failures

**Violation:** Leaving critical paths untested is a protocol violation.

---

## Rule 27: Tests Must Be Deterministic

**Never write flaky or non-deterministic tests.**

**Protocol:**
1. Ensure tests have no external dependencies
2. Ensure tests have no randomness
3. Ensure tests are isolated
4. Ensure tests run consistently
5. Fix flaky tests before committing

**Violation:** Committing flaky tests is a protocol violation.

---

# Security Rules

## Rule 28: Never Commit Secrets

**Never commit API keys, passwords, or secrets.**

**Protocol:**
1. Check all files for secrets before committing
2. Use environment variables for secrets
3. Add secrets to .gitignore
4. Never hardcode secrets

**Violation:** Committing secrets is a critical security violation.

---

## Rule 29: Validate External Inputs

**Never trust external inputs without validation.**

**External Inputs:**
- User-provided JSON files
- API responses
- File system reads
- Environment variables

**Protocol:**
1. Validate all external inputs
2. Use schema validation for JSON
3. Sanitize file paths
4. Handle errors gracefully

**Violation:** Trusting external inputs without validation is a protocol violation.

---

# Performance Rules

## Rule 30: Consider Performance Impact

**Never implement without considering performance impact.**

**Protocol:**
1. Consider time complexity
2. Consider space complexity
3. Consider I/O operations
4. Add caching where appropriate
5. Measure performance if critical

**Guidelines:**
- Search index generation: < 5 seconds
- Navigation generation: < 2 seconds
- Validation: < 10 seconds
- Page load: < 2 seconds

**Violation:** Implementing performance-critical code without consideration is a protocol violation.

---

# Protocol Violations

## What Constitutes a Violation

A protocol violation occurs when an AI agent:

1. Skips a phase or implements out of order
2. Creates hybrid architecture
3. Makes unauthorized architectural decisions
4. Duplicates canonical authorities
5. Implements without documentation
6. Marks tasks complete without meeting acceptance criteria
7. Continues past blocking errors
8. Makes assumptions on ambiguous specifications
9. Creates unauthorized compatibility layers
10. Creates files/directories outside specified structure
11. Deletes files without confirmation
12. Renders invalid content
13. Skips validation layers
14. Generates non-deterministic artifacts
15. Leaves build artifacts uncommitted
16. Proceeds with assumptions
17. Uses `any` type without justification
18. Commits undocumented code
19. Introduces inconsistent code style
20. Leaves critical paths untested
21. Commits flaky tests
22. Commits secrets
23. Trusts external inputs without validation
24. Ignores performance impact

## Violation Response

If a protocol violation is detected:

1. **Stop immediately** - Do not continue with current task
2. **Report violation** - Clearly state which rule was violated
3. **Explain context** - Describe what led to the violation
4. **Request guidance** - Ask user how to proceed
5. **Do not auto-correct** - Wait for user guidance

## Violation Prevention

AI agents should:

1. **Check rules before acting** - Consult this protocol before each significant action
2. **Verify against specification** - Ensure action aligns with REPOSITORY_FOUNDATION_SPECIFICATION_v2.md
3. **Confirm acceptance criteria** - Ensure action meets REBUILD_PHASE_CHECKLIST.md criteria
4. **Ask when uncertain** - If unsure whether action violates protocol, ask user

---

# Emergency Protocols

## Emergency Stop

**Trigger:** Critical error that could corrupt repository or lose data

**Protocol:**
1. Stop all operations immediately
2. Report error to user with full context
3. Do not attempt auto-recovery
4. Wait for user guidance

## Emergency Rollback

**Trigger:** Implementation cannot proceed without breaking system

**Protocol:**
1. Stop current implementation
2. Identify rollback point (last completed phase)
3. Report rollback recommendation to user
4. Wait for user confirmation before rolling back
5. If confirmed, execute rollback using git
6. Verify repository is in stable state

## Emergency Documentation

**Trigger:** Architectural decision must be made immediately to proceed

**Protocol:**
1. Create emergency ADR in `docs/adr/`
2. Document decision with rationale
3. Note as emergency decision
4. Proceed with implementation
5. Schedule proper ADR review for later

---

# AI Agent Responsibilities

## Before Starting Work

1. **Read governing documents** - Consult all 4 governing documents
2. **Understand current phase** - Identify which phase is active
3. **Review checklist** - Read REBUILD_PHASE_CHECKLIST.md for current phase
4. **Verify acceptance criteria** - Understand what must be achieved
5. **Check for blockers** - Ensure no blocking issues exist

## During Work

1. **Follow protocol** - Adhere to all rules in this document
2. **Report progress** - Provide structured progress updates
3. **Ask for clarification** - Don't assume on ambiguity
4. **Stop on errors** - Halt on blocking errors
5. **Test before complete** - Verify implementation works

## After Completing Work

1. **Verify acceptance criteria** - Ensure all criteria met
2. **Run tests** - Execute all relevant tests
3. **Update documentation** - Document any changes
4. **Report completion** - Notify user with summary
5. **Prepare for next phase** - Ensure ready for next phase

---

# Protocol Versioning

This protocol follows semantic versioning:

**Major (X.0):** Rule changes that require different behavior
**Minor (0.X):** New rules added
**Patch (0.0.X):** Clarifications, corrections

Current version: **1.0**

---

# Change Process

1. Propose protocol change via ADR
2. Update this protocol
3. Update AENS_REBUILD_MASTER_PLAN.md if affected
4. Communicate changes to all AI agents

No protocol changes without ADR. No protocol changes without updating this document.

---

# Final Directive

> When in doubt, ask. Never assume. Never skip. Never invent.

The cost of asking is a few seconds. The cost of assuming is hours of debugging. The cost of skipping is days of rework. The cost of inventing is weeks of architectural debt.

**Follow the protocol. Trust the specification. Ask when uncertain.**
