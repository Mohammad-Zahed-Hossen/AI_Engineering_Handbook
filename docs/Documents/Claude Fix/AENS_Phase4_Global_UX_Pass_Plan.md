# AENS Phase 4 — Global UX Pass: Implementation Plan (Stage 1, Planning Only)

**Role:** AENS Chief Architect (Mode 2 — Repository Audit / Mode 7 — Freeze Guardian lens)
**Status:** Planning only. No files modified. No code written. Awaiting approval before Stage 2.
**Method:** Every claim below is grounded in one of: `ARCHITECTURE_FREEZE.md`, `CURRENT_PROJECT_STATE_REPORT.md`, the Round 8 UI/UX Consistency Audit, direct inspection of `lib/search/*`, `lib/validator/rules/*`, `app/layout.tsx`, `aens.config.json`, and `package.json`. Where a prior document's finding could not be re-verified in this pass, it is marked **unverified — carry forward for re-check**, not presented as current fact.

---

## 1. Executive Summary

AENS has completed Phases 1–3 (content generation, remaining knowledge types, cross-reference pass) and is architecturally frozen at v1.2. The codebase is in noticeably better shape than a purely memory-based audit would assume: a Knowledge Quality Validator (KQV) rule engine already exists (`lib/validator/rules/*`) with automated checks for orphaned pages, duplicate/self-referential relationships, relationship budgets, and bidirectional link integrity. The Round 8 repository-wide UI/UX audit found the design system 90%+ converged, with only three residual, already-scoped issues.

**This changes the shape of Phase 4.** The highest-leverage work is not "build new audits" — most of the audit tooling already exists — it is: **(a) run the tools that already exist and act on their output, (b) close the small number of already-identified, already-scoped gaps, and (c) do the two or three genuinely new audits (search relevance quality, related-content ranking, prev/next navigation) that no existing tool covers.** This keeps Phase 4 small and prevents re-discovering things Claude has already found in prior sessions.

Phase 4 is the final polish before daily use. The plan below is scoped to be completable end-to-end without expanding architecture, schemas, or content types, per the Freeze Guardian constraints and the `aens-chief-architech` skill.

---

## 2. UX Audit (Ranked by Priority)

### Critical
None. No dead ends, broken navigation, or data-loss-risk issues were found or reported anywhere in the source material.

### High

**H1 — Search index is shipped as full client props on every page, not just built once.**
`app/layout.tsx` calls `buildSearchIndex()` (cached per-render via React `cache()`) and passes the full result into `TopBar`, a client component, on **every route**. Even with build-time memoization, this means the entire ~2,000–2,800-item search index is serialized into every page's hydration payload. For a "final polish before daily use," this is the single largest concrete performance concern — it's paid on every page load, not just at build time.
*Effort: Medium. Impact: Direct, measurable (payload size, hydration time).*

**H2 — Related Content ranking is generic across content types; some `Model`/`Package` relatedness signals (shared `parent_name`, keyword overlap) exist in `lib/search/related-search.ts` but are unused in the actual page-rendered "Related Content" component.**
`CURRENT_PROJECT_STATE_REPORT.md` confirms the current related-content algorithm is per-type (alternatives array, same category, matching package, etc.) with no ranking beyond list order. A scoring function (`calculateRelatedScore`) already exists in `lib/search/related-search.ts` but is a documented placeholder, never integrated into the UI. This directly matches the brief's ask ("recommend showing better items, not more items").
*Effort: Medium (wire an existing, already-written scoring function into the existing `RelatedContent` component — not a rewrite). Impact: High, directly serves daily-use discovery quality.*

### Medium

**M1 — Synonym / concept-group expansion is an empty stub.**
`lib/search/synonym-expander.ts` has empty `synonyms` and `conceptGroups` objects with a standing TODO. This means acronym search (e.g. "RAG" → "retrieval augmented generation"), abbreviation search, and cross-terminology search (e.g. "LR" → "learning rate") currently fall through to Fuse.js fuzzy matching alone, which is weaker for these cases than exact alias resolution.
*Effort: Low-Medium (data population, not architecture — the expansion mechanism itself is already correctly wired into `lib/search/engine.ts`). Impact: High for a personal reference tool used under time pressure, where the whole point is typing an abbreviation and finding the right page immediately.*

**M2 — The Round 8 UI/UX audit's three already-scoped findings may or may not have been implemented since that report was written.**
Finding 1 (`ProseClient` consumers on the Package page never get syntax-highlighted embedded code), Finding 2 (three coexisting table-rendering conventions), Finding 3 (`shadow-sm` on the Registry task header, the one remaining shadow in the app). All three already have a fully specified Windsurf implementation prompt in `AENS_Repository_Wide_Audit_Round8.md`. **Unverified — carry forward for re-check:** confirm current implementation status before re-scoping any of this work.
*Effort: Low (verification), then Low if unimplemented (the fix is already written). Impact: Medium — visible but narrow.*

**M3 — Knowledge graph health (orphans, duplicate relationships, relationship budget violations, bidirectional integrity) has never been run and triaged as an output, even though the tooling to detect it already exists.**
`lib/validator/rules/orphans.ts` (KQV006), `related.ts` (KQV007/008), and `cross-ref.ts` (KQV004/005) implement exactly the checks Phase 4 asks for: orphan detection with suggested-link recommendations based on tag overlap, self-reference and duplicate-relationship detection, over-linked-page budget checks (`aens.config.json`'s `max_relationships_per_type: 20` / `max_total_relationships: 50`), and bidirectional relationship enforcement. `npm run validate:navigation` runs this category directly today.
*Effort: Low (run + read report) for discovery; effort for fixes depends entirely on what's found — unknown until run.*

**M4 — Prev/Next and sequential navigation exists for Workflows (`next_links`) but its presence/absence for other content types has not been audited.**
Patterns, Principles, Debug Guides, and Decision Guides are not inherently sequential, so prev/next may be a non-goal for them — but this has never been explicitly decided, only defaulted. Needs a short, deliberate decision (not an assumption) per content type: does "next" make sense here, or does `related_content` already cover it?
*Effort: Low (decision + audit, likely zero code for most types). Impact: Medium.*

### Low

**L1 — Mobile experience was only "spot-checked, not exhaustively re-tested at every breakpoint" per Round 8.** The one concretely verified mobile strength (Workflow's tiered ToC) has not been confirmed present or absent on Model/Package/Cheatsheet.
*Effort: Low (audit only, likely small/no fixes — Workflow's pattern already exists to extend if a gap is found).*

**L2 — `aens.config.json`'s declared `stability_tiers` review cadence (`review_cadence_days`) has no corresponding validator rule found in `lib/validator/rules/*` (no "content overdue for review" check was located).** This is a real but low-urgency gap — a personal knowledge base benefits from knowing which of its ~200 resources haven't been reviewed against the stated cadence, but this is a "nice for daily use," not a blocker.
*Effort: Low (one new validator rule, additive, matches the existing rule-engine pattern — this is a tooling addition, not an architecture change, and stays within "respect existing schemas/architecture").*

---

## 3. Execution Plan

Ordered to front-load the highest-ROI, lowest-effort items and to avoid re-auditing what's already known.

### Phase 4.1 — Run What Already Exists (Discovery, no fixes yet)
- Run `npm run validate:navigation` (KQV orphans, related-resource audit, cross-ref/bidirectional integrity) and capture the report.
- Re-verify current implementation status of Round 8's three findings (M2) directly against current file state.
- This phase produces a triage list for 4.4 and 4.5 — it does not fix anything yet, to avoid duplicating effort with unknowns.

### Phase 4.2 — Search
- Populate `lib/search/synonym-expander.ts`'s `synonyms` and `conceptGroups` with real AI-engineering aliases/acronyms/abbreviations relevant to AENS's actual content (RAG, LR, DL, LLM family names, common package aliases already partially covered by the tokenizer's abbreviation expansion — check for overlap first to avoid duplicating what `lib/search/tokenizer.ts` already does).
- Fix H1: move the search index off the render-time client-prop path — either build it once at the module level outside `RootLayout` (if static-export semantics allow it) or lazy-load it client-side on first search interaction instead of embedding it in every page's initial payload. Decide the exact mechanism during Stage 2 investigation; do not commit to one here without checking Next.js 16's static-export constraints first.

### Phase 4.3 — Related Content
- Wire `lib/search/related-search.ts`'s existing `calculateRelatedScore` (or an evolved version of it) into whatever component actually renders "Related Content" on each detail page, replacing simple list-order with a relevance-ranked order.
- Explicitly do **not** add more related items than today — only reorder/improve selection quality, per the brief's constraint.

### Phase 4.4 — Knowledge Graph
- Triage the Phase 4.1 KQV report: fix real orphans (using the tool's own tag-overlap suggestions where available), remove any duplicate/self-referential relationships found, and resolve any budget or bidirectional-integrity violations.
- This phase's effort is unknown until 4.1 runs — scope it as "however many issues the report contains," not a fixed estimate.

### Phase 4.5 — Consistency
- Close out Round 8's three findings (ProseClient highlighting, table styling, Registry shadow) — implementation prompt already exists in that document; only needs re-verification (4.1) and execution.
- Decide and document (M4) whether prev/next navigation is a real gap for any of the four non-sequential content types, or a deliberate non-goal.

### Phase 4.6 — Mobile
- Confirm or refute whether Workflow's tiered ToC pattern needs extending to Model/Package/Cheatsheet. Fix only if a real gap is found (L1) — do not extend speculatively.

### Phase 4.7 — Performance
- Verify H1's fix from 4.2 with an actual before/after payload-size measurement (not just "should be better").
- No other performance work is indicated by current evidence — build time is already documented as acceptable in `ARCHITECTURE_FREEZE.md`.

### Phase 4.8 — Final QA
- Full `npm run build` + `npm run validate` clean run.
- Manual click-through of all nine content types' detail pages plus Dashboard, Problem Index, and global search.
- Re-run Round 8-style spot-check on the three consistency findings to confirm closure.

**Repeated-work minimization:** 4.1 exists specifically so 4.4 and 4.5 don't re-discover what a tool or a prior report has already found. No phase re-audits UI consistency from scratch — Round 8 already did that.

---

## 4. Validation Strategy

**Automated:**
- `npm run validate` / `npm run validate:navigation` (KQV rule engine — orphans, relationships, cross-refs, bidirectional integrity, placeholders).
- `npm run build` — zero errors, and a manual note of build time before/after (should stay in the documented ~30–40s acceptable range).
- `npx tsc --noEmit` and `npm run lint` — zero new errors/warnings (matches the standard already used in prior AENS UX polish rounds).

**Manual:**
- Search: try at least 10 real acronym/abbreviation queries before and after 4.2's synonym population; confirm the right resource surfaces where it previously didn't.
- Related Content: spot-check at least 3 resources per content type before/after 4.3; confirm the top-ranked related item is genuinely more relevant, not just reordered arbitrarily.
- Mobile: manual test at 375px/768px/1024px on at least one page per content type (only if 4.6 finds a real gap to fix).

**Regression checks:**
- Every existing cross-reference and relationship must still resolve after 4.4's fixes (KQV cross-ref rule re-run is itself the regression check).
- No content file's plain-string or existing structured fields should require migration — all fixes in this phase are additive or corrective, never schema-breaking, per Freeze Guardian constraints.
- Confirm no `SectionCard`, `DataTable`, `CheatsheetEntry`, `BadgeRow`, `Prose`/`ProseClient` split, or other components already verified-correct-and-frozen in Round 8 are altered outside of the specific, listed Round 8 tasks.

---

## 5. Definition of Done

Phase 4 is complete when:

1. `npm run validate` and `npm run build` both pass cleanly with zero errors.
2. The KQV report (4.1/4.4) shows zero unaddressed Critical/High findings, and any remaining Medium/Low findings are explicitly triaged as "accepted, not worth fixing" with a one-line rationale (not silently ignored).
3. Round 8's three consistency findings are confirmed closed (or were already closed, and this is documented).
4. Synonym/acronym search returns the correct resource for a representative sample of real AI-engineering shorthand terms actually used day-to-day.
5. Related Content on at least one page per content type visibly surfaces a more relevant item at the top than it did before, without showing more items than before.
6. The search index is no longer duplicated into every page's initial client payload (H1 resolved and measured).
7. AENS has been used for real day-to-day reference lookups for at least a few sessions without hitting a dead end, a confusing inconsistency, or a search miss for something that should have been findable.

This is the finish line: **AENS is ready for daily use**, not "every possible improvement has been made." Anything not listed above (further redesign, new content types, semantic search, analytics, etc.) is explicitly out of scope, per the brief's own constraints, and should be logged as a future consideration rather than pulled into Phase 4.

---

## Open Items Requiring Decision Before Stage 2

1. **H1's exact fix mechanism** (module-level build vs. lazy client load) depends on Next.js 16's static-export constraints and needs a quick technical spike, not a decision made blind in this planning doc.
2. **M2** needs a fast re-verification pass — better to confirm current state than assume Round 8's report is still accurate.
3. **M4** needs a judgment call: do Patterns/Principles/Debug Guides/Decision Guides actually want prev/next, or does `related_content` already serve that need well enough for a personal reference tool?
4. **L2** (review-cadence validator rule) is additive and low-effort — flagging it as optional scope-creep-adjacent; can be dropped from Phase 4 entirely to keep this phase tighter.

Awaiting approval (or edits) before Stage 2 begins.
