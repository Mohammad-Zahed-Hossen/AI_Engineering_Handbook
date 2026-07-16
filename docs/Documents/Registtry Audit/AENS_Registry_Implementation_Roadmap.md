# AENS Registry Implementation Roadmap

**Document Status:** Authoritative Implementation Plan  
**Source:** AENS Registry Architecture Review (2026-07-16)  
**Purpose:** Production-grade roadmap for Registry improvements

---

## 1. Finding Classification Matrix

| Finding | Category | Root Cause | Architectural Impact | Maintenance Impact | UX Impact | Freeze Violation | Blocks Content | Can Wait |
|---------|----------|------------|---------------------|-------------------|-----------|------------------|----------------|----------|
| No modality/task field | **Critical Architecture** | Legacy `RegistryTaskSchema` deleted without replacement | Hard extensibility wall for non-LLM families | High - will require schema migration later | High - users can't filter by model type | Yes - violates AENS extensibility goals | Yes - cannot add embedding/vision families | No |
| Registry schemas don't extend BaseMetaSchema | **Critical Architecture** | Undocumented schema drift post-freeze | Registry is an architectural island | High - inconsistent governance | High - no lifecycle/stability metadata | Yes - contradicts ARCHITECTURE_FREEZE.md | Yes - blocks typed relationships | No |
| related_models untyped/unvalidated | **Validation** | Bespoke schema + isRegistry exemption | No relationship graph integration | High - silent data quality issues | High - badges don't link | Yes - bypasses integrity checks | Yes - bad data merges silently | No |
| Faceted search built but not wired | **Search** | API/UI developed in isolation | Wasted engineering effort | Medium - maintenance trap | High - filters mislead users | No | No | No |
| _families.json is dead/stale cache | **Technical Debt** | Hand-maintained denormalized data | Two sources of truth | Medium - will drift further | Low - not currently used | No | No | Yes |
| Dead schema exports (IdentitySchema, MissingModelRefSchema) | **Maintainability** | Incomplete cleanup | Code bloat | Low - unused code | None | No | No | Yes |
| related_models renders as inert badges | **Navigation / UX** | No href in badge component | No cross-navigation | Low | High - false affordance | No | No | No |
| Unvalidated date strings | **Schema Design** | Bare z.string() instead of .date() | Data quality hole | Medium - bad dates pass validation | None | No | No | Yes |
| size_mb required on all variants | **Schema Design** | Not optional for API-only models | Will encourage bad data | Low | None | No | No | Yes |
| variants array duplicates filesystem | **Technical Debt** | Two sources of truth | Potential drift | Low | None | No | No | Yes |
| No capability facets in search | **Search** | Index doesn't include capability booleans | Can't answer capability queries | Low | Medium - missing filter | No | No | No |
| Reference sorting ignores priority | **Navigation / UX** | Arbitrary .slice(0,5) | Poor information hierarchy | Low | Medium - harder to find official docs | No | No | Yes |
| Registry/Model boundary unclear | **Knowledge Architecture** | No documented ownership | Content duplication | High - confusion on edits | Medium - inconsistent knowledge | No | No | No |
| Deployment knowledge duplicated | **Knowledge Architecture** | No clear boundary with Pattern/Workflow | Knowledge sprawl | High - unclear ownership | Medium | No | No | No |

---

## 2. Phase 0: Must Fix Before Generating Any Registry Content

**Criteria:** Issues that would make future content expensive to migrate or permanently damage the Registry architecture.

### P0-1: Add Modality Field to RegistryFamilySchema
- **Priority:** Critical
- **Complexity:** Low (1-2 hours)
- **Risk:** Low
- **Dependencies:** None
- **Schema Migration:** Yes (add field)
- **Affects Content:** Yes (backfill 2 families)
- **Implementation Order:** 1

**Justification:** The single highest-priority fix. With only 2 families currently, adding `modality: 'llm'` to each is trivial. Once dozens of families exist, retrofitting will be expensive.

**Recommendation:** Keep. This is explicitly required in the audit and matches the original `RegistryTaskSchema` intent.

### P0-2: Extend Registry Schemas from BaseMetaSchema
- **Priority:** Critical
- **Complexity:** Medium (4-6 hours)
- **Risk:** Medium
- **Dependencies:** P0-1
- **Schema Migration:** Yes (major)
- **Affects Content:** Yes (add slug, title, lifecycle, etc.)
- **Implementation Order:** 2

**Justification:** Registry is currently an "architectural island" with no typed relationships, no lifecycle metadata, and no governance consistency. With only 3 data files, migration is cheap.

**Recommendation:** Keep. This aligns with AENS v2 architecture and enables cross-content-type relationships.

### P0-3: Remove isRegistry Validation Exemption
- **Priority:** High
- **Complexity:** Low (1 hour)
- **Risk:** Low
- **Dependencies:** P0-2
- **Schema Migration:** No
- **Affects Content:** Yes (fix dangling references)
- **Implementation Order:** 3

**Justification:** Registry currently bypasses the relationship-integrity checks that all other content types receive. This allows bad data to merge silently.

**Recommendation:** Keep. Registry should follow the same validation rules as other content types.

### P0-4: Fix Dangling related_models References
- **Priority:** High
- **Complexity:** Low (1-2 hours)
- **Risk:** Low
- **Dependencies:** P0-3
- **Schema Migration:** No
- **Affects Content:** Yes
- **Implementation Order:** 4

**Justification:** Four references in `llama-3/_index.json` point to non-existent families. These render as inert badges and will confuse users.

**Recommendation:** Keep. Either fix references or use `MissingModelRefSchema` for intentional placeholders.

---

## 3. Phase 1: Should Fix Before Public Use

**Criteria:** Important improvements that significantly improve the Registry experience.

### P1-1: Wire Faceted Filters to Filtering Logic
- **Priority:** High
- **Complexity:** Medium (3-4 hours)
- **Risk:** Medium
- **Dependencies:** P0-2
- **Schema Migration:** No
- **Affects Content:** No
- **Implementation Order:** 1

**Justification:** The filter UI collects param/context/GPU ranges but only applies 3 of 10 fields. This misleads users into believing queries execute correctly.

**Recommendation:** Keep. Either wire the filters correctly or remove them.

### P1-2: Resolve API vs. Client-Side Search
- **Priority:** Medium
- **Complexity:** Medium (2-3 hours)
- **Risk:** Medium
- **Dependencies:** P1-1
- **Schema Migration:** No
- **Affects Content:** No
- **Implementation Order:** 2

**Justification:** Two search implementations (API route + client filtering) with no clear contract. This is a "two sources of truth" failure pattern.

**Recommendation:** Modify. Keep the API route as the single source of truth, wire UI to call it, delete client-side filtering.

### P1-3: Delete or Generate _families.json
- **Priority:** Medium
- **Complexity:** Low (1 hour)
- **Risk:** Low
- **Dependencies:** None
- **Schema Migration:** No
- **Affects Content:** No
- **Implementation Order:** 3

**Justification:** Hand-maintained file that's already stale (`deepseek.variant_count: 0` while actual count is 1).

**Recommendation:** Keep. Delete the file; it serves no purpose and will only cause confusion.

### P1-4: Delete Dead Schema Exports
- **Priority:** Low
- **Complexity:** Low (30 min)
- **Risk:** Low
- **Dependencies:** P0-2
- **Schema Migration:** No
- **Affects Content:** No
- **Implementation Order:** 4

**Justification:** `IdentitySchema` and `MissingModelRefSchema` are unused.

**Recommendation:** Keep. Remove dead code.

### P1-5: Add Capabilities to Search Index
- **Priority:** Medium
- **Complexity:** Low (1-2 hours)
- **Risk:** Low
- **Dependencies:** P0-1
- **Schema Migration:** No
- **Affects Content:** No
- **Implementation Order:** 5

**Justification:** Capability booleans (vision, reasoning, tool_calling) aren't indexed, making queries like "70B models with vision support" impossible.

**Recommendation:** Keep. Add to `SearchResult` type and index builder.

---

## 4. Phase 2: Can Be Implemented Incrementally

**Criteria:** Enhancements that improve usability without requiring schema migrations.

### P2-1: Sort References by Priority
- **Priority:** Low
- **Complexity:** Low (1 hour)
- **Risk:** Low
- **Dependencies:** None
- **Schema Migration:** No
- **Affects Content:** No
- **Implementation Order:** Any

**Justification:** References are split at arbitrary 5-item boundary instead of using `priority` field.

**Recommendation:** Keep. Use `reference.priority` for sorting.

### P2-2: Add Registry/Model Boundary Statement
- **Priority:** Low
- **Complexity:** Low (1 hour)
- **Risk:** Low
- **Dependencies:** None
- **Schema Migration:** No
- **Affects Content:** No
- **Implementation Order:** Any

**Justification:** Both content types describe the same models with overlapping fields.

**Recommendation:** Keep. Add documentation to resolve ownership.

### P2-3: Make size_mb Optional
- **Priority:** Low
- **Complexity:** Low (30 min)
- **Risk:** Low
- **Dependencies:** None
- **Schema Migration:** Yes (minor)
- **Affects Content:** No
- **Implementation Order:** Any

**Justification:** API-only/closed-weight models may not have meaningful size values.

**Recommendation:** Keep. Make optional with "unknown" convention.

### P2-4: Remove variants Array from Family Schema
- **Priority:** Low
- **Complexity:** Low (30 min)
- **Risk:** Low
- **Dependencies:** None
- **Schema Migration:** Yes (minor)
- **Affects Content:** Yes (remove field)
- **Implementation Order:** Any

**Justification:** Duplicates what `getRegistryVariantIds()` already derives from filesystem.

**Recommendation:** Keep. Remove to eliminate second source of truth.

---

## 5. Phase 3: Future Scalability

**Criteria:** Changes needed when Registry grows to hundreds or thousands of families.

### P3-1: Modality-Specific Optional Fields
- **Priority:** Future
- **Complexity:** High
- **Risk:** High
- **Dependencies:** P0-1
- **Schema Migration:** Yes (major)
- **Affects Content:** Yes
- **Implementation Order:** After 50+ families

**Justification:** Embedding variants care about `embedding_dimensions`, not `context_window`.

**Recommendation:** Keep. Plan for conditional fields keyed by modality.

### P3-2: Semantic Search
- **Priority:** Future
- **Complexity:** High
- **Risk:** High
- **Dependencies:** None
- **Schema Migration:** No
- **Affects Content:** No
- **Implementation Order:** After 100+ families

**Justification:** Fuse.js won't handle "models similar to X for RAG use cases" queries.

**Recommendation:** Reject for now. Fuse.js is appropriate for current scale.

---

## 6. Overengineering Evaluation

| Recommendation | Overengineering Risk | Justification |
|----------------|-------------------|-------------|
| Modality field | None | Required for stated extensibility goals |
| BaseMetaSchema extension | None | Aligns with AENS v2 architecture |
| MissingModelRefSchema | None | Already built, needed for intentional placeholders |
| Faceted search API | None | Good design, just needs wiring |
| _families.json generation | Yes | Delete instead; no consumer exists |
| Semantic search | Yes | Fuse.js sufficient for current scale |

---

## 7. AENS Philosophy Alignment

**Current State:** Registry partially fulfills the "AI Engineering Navigation System" purpose.

**Strengths:**
- ✅ Answers "Should I use this model?" via `engineering_snapshot`
- ✅ Answers "When should I avoid it?" via `avoid_for`
- ✅ Answers "What are the engineering tradeoffs?" via `deployment_complexity`
- ✅ Answers "How does it compare to alternatives?" via `related_models`
- ❌ "Where should I go next?" - No `prerequisites`/`recommended_next` fields

**Missing Knowledge Density:**
- No typed relationships to Patterns, Workflows, Debug Guides
- No `confidence` or `engineering_maturity` ratings
- No `related_content` links to canonical Decision Guides

**Information Hierarchy Issues:**
- References not sorted by priority
- No modality grouping on registry home page
- Filter UI misleads users

---

## 8. Final Implementation Order

| Order | Task | Phase | Effort |
|-------|------|-------|--------|
| 1 | Add modality field to RegistryFamilySchema | P0 | 1-2h |
| 2 | Extend Registry schemas from BaseMetaSchema | P0 | 4-6h |
| 3 | Remove isRegistry validation exemption | P0 | 1h |
| 4 | Fix dangling related_models references | P0 | 1-2h |
| 5 | Wire faceted filters to filtering logic | P1 | 3-4h |
| 6 | Delete _families.json | P1 | 1h |
| 7 | Delete dead schema exports | P1 | 30m |
| 8 | Add capabilities to search index | P1 | 1-2h |
| 9 | Resolve API vs. client-side search | P1 | 2-3h |
| 10 | Sort references by priority | P2 | 1h |
| 11 | Add Registry/Model boundary statement | P2 | 1h |
| 12 | Make size_mb optional | P2 | 30m |
| 13 | Remove variants array from family | P2 | 30m |

---

## 9. Success Metrics

After Phase 0 completion:
- [ ] Validation passes with 0 errors
- [ ] TypeScript compilation succeeds
- [ ] Build completes successfully
- [ ] Registry entries have `slug`, `title`, `lifecycle`, `stability` fields
- [ ] Registry entries have `modality` field
- [ ] Related models render as clickable links or use MissingModelRefSchema

After Phase 1 completion:
- [ ] All filter controls actually filter results
- [ ] Search API is either wired or deleted
- [ ] No dead code in schema files
- [ ] Capabilities are searchable

---

## 10. Rollback Plan

If any Phase 0 change causes issues:
1. Revert `lib/schemas/registry.ts` to pre-extension state
2. Revert `types/registry.ts` changes
3. Revert `scripts/validate-content.ts` changes
4. Restore original data files from git
5. The Family→Variant directory structure remains intact and functional