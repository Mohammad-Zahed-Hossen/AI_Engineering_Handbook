# Stage 2 — Implementation Audit: Phase 4 Global UX Pass

*(Note: mid-audit, the Filesystem MCP tool for your local machine stopped responding after several calls — I proceeded on verified evidence gathered before that point rather than guessing at the remaining detail. Flagged inline where something still needs a quick manual confirmation.)*

## 1. Tasks to Remove

| Task | Why removed |
|---|---|
| **Round 8's three consistency findings** (ProseClient code-highlighting gap, table styling, Registry `shadow-sm`) | Verified directly against current code — **all three are already fixed or moot**. `app/packages/[id]/page.tsx` already renders `pkg.summary` with `<Prose>` (not `ProseClient`). `Prose.tsx` and `ProseClient` both already apply `DataTable`-matching table styling (bordered, rounded, header background). The old `app/registry/[task]/page.tsx` with the lone `shadow-sm` no longer exists — Registry was rebuilt into `families/[family]/[variant]` since that audit was written. Nothing to do here. |
| **Wire `related-search.ts`'s generic scoring into `RelatedContent`** | Misconceived in Stage 1. `components/shared/RelatedContent.tsx` already groups items by curated, typed `relationship_type` with clean semantic labels ("Applied In Workflows," "Governed by Principles," etc.) sourced from author-curated, KQV-validated bidirectional relationships. That's a *better* signal than a generic keyword-overlap score. Replacing it would be a downgrade, not an improvement, and counts as architectural overkill for a ~200-resource curated base. |
| **Prev/Next navigation audit for Patterns/Principles/Debug Guides/Decision Guides** | `RelatedContent`'s existing grouping already serves contextual "where do I go next" navigation well for non-linear content. Deciding this now rather than scheduling an audit: **not needed.** Workflows keep `next_links` (already correct, sequential by nature); other types don't need an artificial sequence imposed on them. |
| **New "review cadence overdue" validator rule** | Real gap (`aens.config.json` declares `review_cadence_days`, no rule enforces it), but purely additive scope-creep — doesn't block or improve daily use of the existing ~200 resources. |
| **Exhaustive mobile breakpoint audit** | No concrete evidence of an actual mobile defect anywhere in the source material — only "not exhaustively re-tested" language from Round 8. Speculative audit with likely-zero yield; revisit only if a real problem surfaces during actual use. |
| **General/broad synonym-expander population** (as originally scoped) | Narrowed, not fully removed — see Tasks to Keep. Package/Cheatsheet code fields already get acronym expansion for free via `lib/search/tokenizer.ts`'s `ABBREVIATION_EXPANSIONS` map (RAG, LLM, CNN, RNN, LSTM, SGD, SVD, etc. are already there). Building a whole new synonym system would duplicate this. |

## 2. Tasks to Keep

### Critical (must do before daily use)

**C1 — Run and triage the existing Knowledge Quality Validator**
- **Why still needed:** `lib/validator/rules/orphans.ts`, `related.ts`, `cross-ref.ts` already implement orphan detection, duplicate/self-reference detection, relationship-budget checks, and bidirectional-integrity enforcement — but the output has never been run and acted on. This is the one real "is the graph healthy" gate before daily use.
- **Time:** 30–60 min to run + read (`npm run validate:navigation`); 1–3 hrs to fix whatever it flags (unknown until run, typically small for a curated ~200-resource base).
- **Risk:** Low — discovery is read-only; fixes are additive JSON edits, no schema/architecture touched.
- **Files likely to change:** a handful of `data/**/*.json` content files (specific ones unknown until the report runs). No `lib/` or `app/` code.

**C2 — Fix the search-index-in-every-page-payload issue**
- **Why still needed:** `app/layout.tsx` builds the full ~200–2,800-entry search index and passes it as a prop into `TopBar` (client component) on every route, so it's serialized into every page's payload — the one concrete, measurable performance issue with actual code evidence behind it.
- **Time:** 1–2 hrs (defer building/loading the index until the search UI is actually interacted with, instead of eagerly on every route).
- **Risk:** Medium — touches the root layout and the search UI's data path; must confirm static-export mode still serves search correctly after the change.
- **Files:** `app/layout.tsx`, `components/layout/TopBar.tsx`, possibly `components/shared/SearchBox.tsx`.

**C3 — Populate synonym-expander with verified, narrow acronym gaps only**
- **Why still needed:** the acronym-expansion coverage that already exists (`tokenizer.ts`) only applies to Package task syntax and Cheatsheet snippets. Pattern/Principle/Workflow/Debug Guide/Decision Guide names & descriptions rely on plain keyword extraction with no expansion, so acronym search (typing "RAG" or "LR" to find a Pattern/Principle titled with the spelled-out term, or vice versa) can miss. **Before writing anything:** check `data/registered-aliases.json` for existing coverage — it wasn't fully reviewed this pass due to a tool timeout — to avoid duplicating what content-level `aliases` fields may already solve.
- **Time:** 1–2 hrs (mostly data entry into the already-wired `expandQuery` mechanism in `lib/search/synonym-expander.ts`).
- **Risk:** Low — pure data addition to an existing, already-integrated mechanism.
- **Files:** `lib/search/synonym-expander.ts` only.

**C4 — Final QA gate**
- **Why still needed:** standard close-out; confirms nothing regressed.
- **Time:** 15–30 min.
- **Risk:** Low.
- **Files:** none (verification only — `npm run build`, `npm run validate`, manual click-through).

### Recommended (high value, optional)
None. Once the misconceived/already-done items were removed, everything with real, verified evidence and non-trivial daily-use value fit into Critical. There's nothing left that clears the "high value but not blocking" bar without becoming speculative.

### Future (defer completely)
- Review-cadence validator rule (additive, not blocking).
- Mobile breakpoint deep audit (no evidence of a real defect).
- Any prev/next navigation for non-sequential content types (decided against, not deferred as "maybe").

## 3. Final Execution Order

1. **C1a** — Run `npm run validate:navigation`, read the report (discovery only, no fixes yet).
2. **C1b** — Fix whatever real orphans/duplicates/budget/bidirectional issues the report surfaces (content JSON edits only, zero app-code risk).
3. **C2** — Fix the search-index payload issue in `layout.tsx`/`TopBar`/`SearchBox`.
4. **C3** — Check `registered-aliases.json` for existing acronym coverage, then populate only the real gaps in `synonym-expander.ts`.
5. **C4** — Full `npm run build` + `npm run validate` + manual smoke test across all nine content types, Dashboard, and global search.

Rationale: cheapest and lowest-risk first (discovery, then content-only fixes), app-code change second, data-only search improvement third, QA gate last.

## 4. Estimated Total Implementation Time

**~4–8 hours (roughly half a day to one focused day).** The range's width is almost entirely C1's unknown fix volume — everything else is tightly bounded.

## 5. Definition of Done

- `npm run validate` and `npm run build` both pass with zero errors.
- KQV's navigation category shows zero unaddressed Critical/High findings.
- The search index is confirmed no longer duplicated into every page's initial payload (quick page-source/network check).
- A representative sample of acronym searches (RAG, LLM, CNN, LR, etc.) against Pattern/Principle/Workflow/Guide content surfaces the correct resource on the first try.
- No schema, architecture, or content-type changes were introduced anywhere in this pass.
- AENS has been used for a few real daily-reference sessions without hitting a dead end or a search miss that should have resolved.