# Specification Gap Log

**Purpose:** Track architectural decisions, resolved issues, and deferred items to prevent reopening closed discussions.
**Maintained:** During v2.1 freeze and throughout implementation
**Status:** Active

---

# Resolved (v2.1 Freeze)

These issues were identified and resolved during the v2.1 specification freeze.

| Issue | Resolution | Date | ADR/Reference |
|-------|-----------|------|---------------|
| JS/TS Execution Model | Use `tsx` runtime for all scripts | 2026-06-30 | V2.1 Fix 1 |
| Loader vs Validator Contradiction | Pure loader; validation in pipeline only | 2026-06-30 | V2.1 Fix 2 |
| Blueprint Phase Ordering | Swap Validation and Metadata phases | 2026-06-30 | V2.1 Fix 3 |
| Content Schema Specification Approach | Expand REPOSITORY_FOUNDATION_SPECIFICATION_v2.md | 2026-06-30 | ADR-001 |
| Navigation Ordering | Sort by title ascending, then id ascending | 2026-06-30 | V2.1 Fix 5 |
| Build Script Mismatch | Add type-check and lint to build:prod | 2026-06-30 | V2.1 Fix 6 |
| Category Assignment Strategy | Tag-based inference with rules in metadata | 2026-06-30 | ADR-002 |
| Search Behavior Specification | Behavior-focused spec, not library-specific | 2026-06-30 | ADR-003 |
| Model ID Format | Encode category: `model:ml:transformer` | 2026-06-30 | ADR-004 |
| Schema Evolution Policy | Define compatible vs breaking changes | 2026-06-30 | V2.1 Fix 11 |

---

# Deferred (Implementation Phase)

These items were consciously deferred to the implementation phase. They are not architectural concerns.

| Item | Reason | When to Address |
|------|--------|-----------------|
| .gitignore clarification | Implementation detail - decide based on workflow | Phase 1 implementation |
| Validation CLI flags (fail-fast vs aggregate) | UX decision - decide based on developer needs | Phase 6 implementation |
| generated_at in search-index.json | Implementation detail - address if causes git churn | Phase 8 implementation |
| Windows-compatible Git hooks | Depends on supported environments | Phase 14 implementation |
| Migration automation | Manual migration acceptable for v2 | Phase 12 if painful |
| Snapshot testing | Add if needed during implementation | Phase 13 implementation |
| ADR template | Create when first ADR needed | When writing ADR-005+ |

---

# Future (Post-v2.1)

These items are out of scope for v2.1 but may be considered in future versions.

| Item | Status | Notes |
|------|--------|-------|
| Search optimization | Future | Consider after initial implementation and usage data |
| Plugin system | Future | Consider if extensibility needs emerge |
| Multi-language content | Future | Consider if internationalization is needed |
| Real-time search | Future | Consider if static search is insufficient |
| Content versioning | Future | Consider if content history tracking is needed |
| Collaborative editing | Future | Consider if multi-author workflow is needed |
| Advanced analytics | Future | Consider if usage analytics are needed |

---

# Closed Discussions

These architectural debates are closed. Do not reopen without new significant information.

| Discussion | Decision | Date | Closed By |
|------------|----------|------|-----------|
| Separate content schema document vs expand existing | Expand existing canonical authority | 2026-06-30 | ADR-001 |
| Category field in content vs tag-based inference | Tag-based inference | 2026-06-30 | ADR-002 |
| Library-specific search config vs behavior spec | Behavior-focused specification | 2026-06-30 | ADR-003 |
| Recursive model search vs encoded category | Encode category in ID | 2026-06-30 | ADR-004 |
| Additional architecture audits | Stop auditing, start freezing | 2026-06-30 | Project decision |

---

# Notes

- This log is maintained to prevent decision fatigue and circular discussions
- Items in "Resolved" should not be revisited without an ADR
- Items in "Deferred" should be addressed during the appropriate implementation phase
- Items in "Future" can be reconsidered after v2.1 is complete and in production
- New items discovered during implementation should be added to the appropriate section
