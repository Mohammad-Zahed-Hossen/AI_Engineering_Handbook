# AENS Workflow Content Architecture & Documentation UX Convergence Audit

**Scope:** Workflow schema (`lib/schemas/workflow.ts`, `base.ts`), all 5 workflow JSON documents in `data/workflows/`, and the rendering tree (`page.tsx`, `WorkflowStepList.tsx`, `OfficialResources.tsx`, `Prose.tsx`, `lib/resources.ts`, `SectionCard.tsx`, `BadgeRow.tsx`, `CodeBlock.tsx`/`CodeBlockInteractive.tsx`)
**Verification method:** Direct repository inspection, including parsing all 5 JSON files programmatically for structural counts (steps, step-level code, worked examples, `related_step` bindings, footnote-marker occurrences per field).

> **Note on this audit's starting point:** This is a continuation of the Round 6 convergence review. Several items from that review's Windsurf prompt have since been implemented in the repository (Prose-wrapping of fallback text, the `#steps` anchor fix, per-example anchor IDs, `BadgeRow` density caps, `aria-pressed` on the wrap toggle, the "Collapse" label fix, and the citation-count affordance). One of those implementations — the Citations/Official Resources de-duplication — introduced the specific regression this audit's Deliverable D describes in detail below. Evidence throughout this report reflects the **current** state of the code, verified fresh, not assumptions carried over from the prior round.

---

## Deliverable A: Executive Summary

| Metric | Score /100 | Basis |
|---|---|---|
| Overall Workflow Architecture Score | 58 | Schema is well-designed and the 2 reference workflows fully realize it (8/8 steps with code, 3/3 worked examples bound via `related_step`). The 3 older workflows realize 0% of the step-level-code and step-binding parts of the same schema, despite validating against the same Zod types. |
| Overall Documentation UX Score | 54 | Step-level code blocks and the accordion pattern are genuinely strong. This score is dragged down by one severe, currently-live regression (Deliverable D) that silently deletes the entire Official Resources section site-wide, and by unresolved footnote clutter in step-level content. |
| Overall Content Consistency Score | 40 | The gap between "reference" and "older" workflows is not stylistic — it's a structural feature gap (missing code, missing example-to-step bindings) that will read as visibly incomplete once readers compare workflows side by side. |

**Top strengths**
- The Zod schema (`WorkflowStepSchema`, `WorkedExampleSchema`) already supports everything the reference workflows use — no schema change is required to bring the older workflows up to parity, only content authoring.
- Step-level code blocks are now wired end-to-end (`page.tsx` pre-highlights via `highlightCodeSnippet`, `WorkflowStepList.tsx` renders via `CodeBlockInteractive` inside each step) — this closes the "code snippet discoverability" gap a prior round of this review would have flagged.
- The density-cap pattern (`BadgeRow`) is now applied consistently to both Starter Stack and per-step `Uses:` badges, extracted as a single shared component rather than duplicated — good factoring.

**Top weaknesses**
1. **Official Resources is currently dead on every workflow page** (Deliverable D) — not a hypothetical risk, a live regression, verified in the current file contents.
2. **Footnote markers (`[^N]`) are only converted to working links inside the `overview` field.** They remain as literal, non-functional `[^1]`-style text inside every step's `what` field and every worked example's `implementation_notes` field — confirmed present in 4 of 5 workflows, up to 44 occurrences in a single file.
3. **3 of 5 workflows (`build-rag-system`, `rag-evaluation-harness`, `vector-database-setup-indexing-strategy`) have zero step-level code and zero `related_step` bindings**, while the 2 reference workflows have full coverage of both — a hard content gap, not a formatting nit.

**Highest-priority fixes:** The Official Resources regression (D-01) is promoted above everything else in the roadmap — it is the only finding in this audit that is currently making a whole page section vanish for every single reader, on every single workflow.

---

## Deliverable B: Workflow Standardization Audit

Verified structural comparison across all 5 workflow JSON files (counts obtained by parsing each file's `steps` and `worked_examples` arrays directly, not estimated):

| Workflow | Steps | Steps w/ `code` | Worked Examples | Examples w/ `related_step` | Footnotes in `what` | Footnotes in `implementation_notes` |
|---|---|---|---|---|---|---|
| `llm-application-serving.json` (reference) | 8 | 8/8 | 3 | 3/3 | 12 | 5 |
| `production-llm-cost-latency-optimization.json` (reference) | 8 | 8/8 | 3 | 3/3 | 16 | 4 |
| `build-rag-system.json` | 7 | 0/7 | 2 | 0/2 | 0 | 0 |
| `rag-evaluation-harness.json` | 8 | 0/8 | 3 | 0/3 | 35 | 4 |
| `vector-database-setup-indexing-strategy.json` | 8 | 0/8 | 3 | 0/3 | 44 | 8 |

**Reading this table:**
- The "reference" designation in the source material is earned: those two files are the only ones that use every field the schema offers (`step.code`, `step.language`, `worked_example.related_step`).
- The step-count divergence (7 vs. 8) is minor and not inherently wrong — `WorkflowStepSchema` doesn't mandate a count — but is worth flagging against the brief's stated goal of standardization, since a reader moving between workflows will notice the shape shift.
- The footnote-count column is the most consequential finding in this table: it is not that older workflows merely lack code, they also carry **far more unresolved inline footnote clutter** (up to 44 markers in one file) than the reference workflows — the exact opposite of what "reference quality" should mean, and directly contradicts the stated "Zero Academic Clutter" goal.

**Recommended canonical JSON architecture**
- Make `step.code` a soft requirement for `type: 'pipeline'` workflows via content-linting (not a hard Zod `.min(1)`, since `type: 'snippet'` workflows may legitimately have prose-only steps) — enforced in a CI content-check script, not the schema itself, to avoid breaking existing valid documents.
- Require every `worked_example` to set `related_step` OR explicitly opt out (see Deliverable C — this recommendation is superseded if the "decoupled worked examples" redesign is adopted, since standalone examples wouldn't need step binding at all).
- Add a content-lint rule (can run as a Node script against `data/workflows/*.json`, no schema change needed) that fails CI if any narrative field (`overview`, `what`, `decision`, `implementation_notes`, `production_notes`, etc.) contains a `[^\d+]` pattern that has no corresponding resolution path — this would have caught the current footnote gap automatically.

---

## Deliverable C: Worked Examples Audit

**Current architecture:** Worked examples are schema-embedded in the workflow document (`worked_examples: WorkedExampleSchema[]`), rendered as a card grid in a dedicated `#worked-examples` section, cross-linked to their originating step via `related_step` (now bidirectional and anchor-correct as of the Round 6 fix: `Used in Step N` → `#step-N`, and `View worked example →` → `#example-{idx}`).

**Tension identified:** With step-level code blocks now implemented (`step.code` rendered inline via `CodeBlockInteractive` inside `WorkflowStepList.tsx`), there are now **two different code-bearing surfaces per workflow**: the step's own inline snippet, and a worked example that may cover the same step at greater length. For the 2 reference workflows, every worked example maps to exactly one step (`related_step` set, 1:1), which reads as reasonable — the step shows the micro-decision's code, the worked example shows the fuller end-to-end version referenced from that step.

For the 3 older workflows, worked examples exist with **no step binding at all** (`related_step` absent, not merely `null` — the key doesn't appear in the JSON). This is architecturally different from "unmapped": these examples are drifting, unanchored content that happens to render at the bottom of the page with no cross-reference either direction.

**Readability/scalability bottleneck:** At the workflow author level, embedding worked examples inside the workflow JSON (rather than as standalone content objects) means an example useful across multiple workflows (e.g. "load-testing a vLLM endpoint") must be copy-pasted into each workflow's JSON rather than referenced once and reused — this is a real scalability ceiling as the corpus grows past 5 workflows, independent of the step-binding question.

**Recommendation aligned with the stated design philosophy** ("Decoupled Worked Examples... production-grade recipes... rather than linking them to specific step-level micro-concerns"):
- Keep worked examples in the workflow document for now (avoiding a cross-content-type schema migration in this pass), but change their framing from "linked to Step N" to "full pipeline recipes" — i.e., stop presenting them as a footnote to a specific step and instead present them as end-to-end blueprints that happen to touch several steps.
- Concretely: de-emphasize (not necessarily remove) the `Used in Step N` per-example badge, and stop requiring `related_step` as a completeness signal — a worked example that spans the whole pipeline shouldn't be forced into a single-step binding just to satisfy a "reference workflow" completeness pattern.
- This resolves the older-workflow content gap by reframing it as intentional rather than incomplete: those 3 workflows' unbound examples are already "full recipes," they just need the UI treatment to say so instead of implying they're missing a `related_step`.

---

## Deliverable D: Citation Architecture Audit

### D-01 — Official Resources is unconditionally suppressed on every workflow page (Critical, currently live)

**Repository evidence:**
- `app/workflows/[id]/page.tsx`: `<OfficialResources sources={workflow.sources} githubRepo={workflow.github_repo} hasCitations={!!(workflow.sources && workflow.sources.length > 0)} />`
- `components/shared/OfficialResources.tsx`: `export default function OfficialResources({ sources, githubRepo, hasLearningResources = false, hasCitations = false }: OfficialResourcesProps) { if (hasCitations) return null; ... }`
- `lib/schemas/base.ts`: `sources: z.array(z.string().url(...)).min(1, { message: "At least one source is required" })`

**Root cause:** `BaseMetaSchema` — which every workflow document validates against — requires `sources` to have **at least one** entry. That means `workflow.sources.length > 0` is true for every workflow that has ever passed schema validation, with no exceptions. The expression `hasCitations={!!(workflow.sources && workflow.sources.length > 0)}` therefore evaluates to `true` unconditionally, on every page, for every workflow, always. Combined with `if (hasCitations) return null;` at the top of `OfficialResources`, the component **never renders its content on any workflow page** — this is not a conditional suppression, it is a permanent one, because the condition it's gated on can never be false for valid content.

**This appears to be a regression introduced while implementing a prior recommendation** to de-duplicate the Citations block against Official Resources (the intent — "if Citations is already showing the sources, don't show them again in Official Resources" — was reasonable; the implementation used the wrong signal to detect duplication, since *presence of sources* is not the same as *presence of a rendered Citations block*, and the former is guaranteed by schema while the latter should have been the actual condition).

**User/engineering impact:**
- The entire "Official Resources" card — Documentation, Model Cards, Research Papers, Source Code (GitHub repo) links, all with their parsed titles and category icons — is invisible on every workflow page in the current build.
- The Citations block in the page header now links to it: each footnote in `page.tsx`'s Citations list builds `href={`#${resourceId}`}` where `resourceId = `resource-${category}-${index}``, matching the `id` that `OfficialResources.tsx`'s `ResourceCategory` assigns to each `<li>`. Because `OfficialResources` returns `null` before ever rendering those `<li>` elements, **every one of these anchor links points to an element that does not exist in the DOM.** Clicking a citation number does nothing (no scroll, no error, just a silent no-op hash change).
- The GitHub repo link (`workflow.github_repo`), Documentation cards, Model Card cards, and Research Paper cards are all casualties of this same suppression, not just the "Further Reading" bucket the original de-duplication intent was aimed at.

**Recommended solution — supersede the patch with the "Further Study" redesign:**
Rather than re-threading a corrected boolean condition through two components that were never meant to both own the same data, this is the right moment to implement the brief's stated goal: **consolidate Citations and Official Resources into one "Further Study" section, rendered once, at the bottom of the page.**
- Remove the header Citations block from `page.tsx` entirely (the `<div className="text-[10px] ... Citations ...">` block).
- Remove the `hasCitations` prop and its `return null` guard from `OfficialResources.tsx` — revert to always rendering when it has content, as it did before this regression was introduced.
- Rename/restyle `OfficialResources` (or wrap it) as the page's single "Further Study" section, positioned at the bottom of the page (near `next_links`/`RelatedContent`, per the brief), keeping its existing category grouping (Documentation / Model Cards / Research Papers / Further Reading / Source Code) — this grouping is already good and shouldn't be rebuilt.
- Inline citation markers (`[^1]` → today's `[[1]](#footnote-1)`) should link directly to the relevant "Further Study" card's `id` (the `resource-${category}-${index}` scheme already exists and is sound) instead of to a separate, intermediate footnote list — eliminating the double-hop (marker → footnote list → resources) and the duplicate rendering in one move.

**Risks & trade-offs:** This is a bigger change than a one-line boolean fix, but the one-line fix (e.g., changing the condition to something like `hasCitations={false}` or removing the prop) would just restore the pre-regression state, which itself still had the *original* duplication problem (same URLs rendered twice — once as bare list, once as rich cards) that motivated this change in the first place. Given the brief explicitly asks for the "Further Study" consolidation, doing the complete fix now avoids a third pass at this same area. Complexity: Medium — touches 2 files, no schema change, no data migration.

### D-02 — Footnote markers unresolved outside the `overview` field (High, currently live)

**Repository evidence:** `page.tsx` performs `workflow.overview.replace(/\[\^(\d+)\]/g, ' [[$1]](#footnote-$1)')` — this regex runs **only** against `workflow.overview`. `WorkflowStepList.tsx` renders `s.what` via `<Prose content={s.what} .../>` with no equivalent replacement. `page.tsx`'s worked-example rendering does the same for `example.implementation_notes` (`<Prose content={example.implementation_notes} .../>`, no replacement).
Verified counts of literal, non-functional `[^N]` markers currently rendering in these unconverted fields: `llm-application-serving.json` — 12 in step `what` text, 5 in worked-example notes; `production-llm-cost-latency-optimization.json` — 16 / 4; `rag-evaluation-harness.json` — 35 / 4; `vector-database-setup-indexing-strategy.json` — 44 / 8. (`build-rag-system.json` has none in these fields — its footnotes are confined to `overview`, where they already work.)

**Root cause:** The footnote-to-link conversion was implemented once, inline, at the one call site that happened to need it first (the overview), rather than as a shared utility applied everywhere narrative markdown is rendered.

**User/engineering impact:** In the worst case (`vector-database-setup-indexing-strategy.json`), a reader opening most steps will see raw `[^3]`, `[^4]`-style text sitting in the middle of sentences with no link, no styling, and no way to reach the source it refers to — the exact "academic clutter" the brief is asking to eliminate, and currently the single most visible symptom of it in the live content.

**Recommended solution:** Extract the regex replacement into a small shared helper (e.g. `lib/text/linkFootnotes.ts`, exporting `linkFootnotes(text: string): string`) and apply it at every call site that renders workflow narrative text sourced from content authors: `overview`, `step.what`, `example.implementation_notes`, and for completeness `step.decision` and the `common_failure_points`/`production_notes` family (even though today's grep found no markers there, the helper should be applied uniformly so a future content edit doesn't reintroduce the gap silently).
Given the brief's "Zero Academic Clutter" goal, consider going further than linking: replace bracketed numeric markers with **descriptive inline text links** (e.g. render `[^1]` as a small superscript link styled distinctly from body text, or convert to a named inline link like "(see vLLM docs)" if source titles are available) rather than preserving the `[N]` numeral convention at all — this is a content-authoring change as much as a code change, so treat it as Phase 4 polish rather than blocking the Phase 2 anchor fix.

**Risks & trade-offs:** Purely additive utility extraction; low risk. The "replace numerals with descriptive text" version of this fix requires resolving each footnote to a human-readable title at render time, which is exactly the same `parseResourceUrl`/title-resolution logic already used in `lib/resources.ts` — no new parsing logic needs to be invented, just reused across more call sites.

### D-03 — Duplicate source rendering (Superseded by D-01's fix, documented for completeness)

Prior to the current regression, this repository had a live duplication issue where the same `workflow.sources` array was rendered twice: once as a bare, unstyled URL list (Citations) and once as titled, categorized cards (Official Resources). D-01's recommended fix (consolidate into one "Further Study" section) resolves this at the same time it resolves the broken-anchor regression — these are not two separate fixes, they're one.

---

## Deliverable E: Documentation UX Audit

**Reading flow:** The page now follows a defensible top-to-bottom order — overview, starter stack, resources, steps (each with inline code), worked examples, failure points, production profile, evaluation checklist, next workflow. This is a reasonable "orient → equip → execute → verify → extend" arc for an engineering handbook, and no structural reordering is recommended here.

**Cognitive load:** The step accordion (collapsed by default except Step 1, each header showing name + tool badges before expansion) keeps initial cognitive load low. The one thing working against this today is D-02 — raw `[^N]` clutter breaks reading flow specifically inside step bodies, which is exactly where a reader is trying to focus on a single actionable unit of the pipeline.

**Ease of discovery of code snippets:** This is now solid. `step.code` renders inline, in-context, immediately below the step's `what` description and above its `Uses:`/`Key Decision`/`Watch Out` blocks — a reader does not need to jump to a separate Worked Examples section to see a step's code, closing the gap a review of an earlier build of this page would have flagged. The remaining opportunity (Deliverable C) is making clear *why* a worked example exists in addition to a step's own code, which is a labeling/framing issue, not a discoverability one.

---

## Deliverable F: Verified Findings Table

| ID | Severity | Files | Repository Evidence | Root Cause & Impact | Recommended Solution | Trade-offs / Complexity |
|---|---|---|---|---|---|---|
| D-01 | Critical | `app/workflows/[id]/page.tsx`, `components/shared/OfficialResources.tsx`, `lib/schemas/base.ts` | `hasCitations={!!(workflow.sources && workflow.sources.length > 0)}` combined with `sources: z.array(...).min(1)` and `if (hasCitations) return null;` | Condition is always true by schema guarantee → Official Resources never renders, all `#resource-*` anchor links are dead | Remove header Citations block; consolidate into a bottom "Further Study" section that always renders when it has content | Medium complexity, 2 files, no schema change |
| D-02 | High | `app/workflows/[id]/page.tsx`, `components/shared/WorkflowStepList.tsx` | Footnote regex applied only to `workflow.overview`; up to 44 raw `[^N]` markers found in `step.what` across the corpus | Conversion logic implemented at one call site instead of extracted as a shared helper | Extract `linkFootnotes()` helper; apply to `what`, `implementation_notes`, and other narrative fields | Low complexity; optional Phase 4 upgrade to descriptive-text links is separate content work |
| B-01 | Medium | `data/workflows/build-rag-system.json`, `rag-evaluation-harness.json`, `vector-database-setup-indexing-strategy.json` | 0/7 and 0/8 steps have `code`; 0 worked examples have `related_step` in all 3 files, vs. 8/8 and 3/3 in the 2 reference workflows | Content authoring gap, not a schema or rendering bug — schema already supports these fields | Content-author task to backfill `step.code` where the step is code-bearing; or reframe (per Deliverable C) so missing `related_step` is intentional, not a gap | Content work, not engineering work; no code change required for the reframing option |
| C-01 | Medium | `app/workflows/[id]/page.tsx`, `components/shared/WorkflowStepList.tsx` | Worked examples always show a `Used in Step N` badge when `related_step` is set; no distinct treatment for standalone/multi-step examples | UI implies every good worked example should map 1:1 to a step, discouraging full-pipeline recipes | De-emphasize per-step binding as a completeness signal; add a "Full Pipeline" or similar label for unbound examples | Low complexity, presentation-only change |
| B-02 | Low | `data/workflows/*.json` | Step counts vary (7 vs. 8) across workflows with no schema constraint | Not a bug — schema permits variable step counts — but works against the "canonical architecture" standardization goal | Optional content-lint guidance (not a hard schema rule) recommending a step-count range | Low complexity; purely advisory tooling |

---

## Deliverable G: Prioritized Roadmap

### Phase 1 — Workflow Content Architecture
1. Add a content-lint script (Node, run in CI) that checks every `data/workflows/*.json` against: (a) presence of `step.code` for `type: 'pipeline'` workflows, flagging but not failing on missing coverage; (b) any `[^\d+]` marker in a narrative field with no corresponding entry in `sources`; (c) worked examples with `related_step` referencing a nonexistent step number.
2. Backfill `step.code` for `build-rag-system.json`, `rag-evaluation-harness.json`, and `vector-database-setup-indexing-strategy.json` where steps are code-bearing (content task, tracked separately from this engineering roadmap).

### Phase 2 — Citation & Further Study Refactor
3. **(Blocking, do first)** Fix D-01: remove the `hasCitations` suppression, remove the header Citations block from `page.tsx`, and merge its title-resolution logic into `OfficialResources.tsx`.
4. Rename/reposition `OfficialResources` as a bottom-of-page "Further Study" section (move its render call in `page.tsx` to just above `RelatedContent`).
5. Point inline footnote links (`[[N]](#footnote-N)`) directly at the "Further Study" section's existing `resource-${category}-${index}` anchor IDs, removing the intermediate footnote-list hop.
6. Fix D-02: extract and apply `linkFootnotes()` to `step.what` and `example.implementation_notes` (and, defensively, `step.decision`).

### Phase 3 — Worked Example Architecture
7. Reframe worked-example presentation per Deliverable C: de-emphasize `Used in Step N` as an implied completeness marker; add explicit "Full Pipeline Recipe" framing for examples without a single-step binding.
8. (Optional, larger scope — flag for a future architecture review, not this pass) Evaluate extracting frequently-reused worked examples into a standalone content type referenced by `id` from multiple workflows, to solve the copy-paste-across-workflows scalability ceiling noted in Deliverable C.

### Phase 4 — Documentation UX Polish
9. Content-authoring pass: convert numeral-style footnote markers (`[1]`) to descriptive inline links where source titles are available, per the "Zero Academic Clutter" goal — using the same `parseResourceUrl` title-resolution already built for Further Study.
10. Optional: standardize step counts across workflows per B-02 (advisory, not enforced).

**Dependency note:** Phase 2, item 3 must land before item 4 and 5 (you cannot reposition or re-link a section that's currently returning `null`). Item 6 (footnote helper) is independent of items 3–5 and can ship in parallel. Phase 3 and Phase 4 have no hard dependency on each other or on Phase 1 completing first, aside from the general preference to fix the live regression (Phase 2) before any content-authoring work that would otherwise render invisibly.

---

## Deliverable H: Windsurf Implementation Prompt

```
You are implementing the Workflow Content Architecture & Documentation UX Convergence audit findings.
This repository has a CURRENTLY LIVE regression (D-01) — treat Phase 2, Task 1 below as blocking and
implement it first, verified in isolation, before touching anything else in this prompt.

TARGET FILES TO MODIFY:
- app/workflows/[id]/page.tsx
- components/shared/OfficialResources.tsx
- components/shared/WorkflowStepList.tsx
- lib/text/linkFootnotes.ts (NEW FILE)
- lib/resources.ts (only if sharing title-resolution helpers; do not change categorizeSources'
  host-matching logic)

FILES TO AVOID (verified correct, no changes needed):
- lib/schemas/workflow.ts, lib/schemas/base.ts — schema already supports every field this prompt
  needs; DO NOT add a hard `.min(1)` requirement on step.code or relax the sources.min(1) rule.
- components/shared/CodeBlock.tsx, CodeBlockInteractive.tsx — code rendering and truncation are
  correct and already have aria-pressed on the wrap toggle; no changes.
- components/shared/BadgeRow.tsx — density-cap pattern is correct and already shared between
  Starter Stack and per-step Uses:; do not fork it.
- components/shared/SectionCard.tsx — id/className passthrough already correct.
- lib/text/parseLabeledClauses.ts — do not touch its matching logic.
- data/workflows/*.json — do not hand-edit JSON content as part of this engineering pass; content
  backfill (Phase 1, Task 2 of the roadmap) is a separate content-authoring task, not a refactor.

=== PHASE 2, TASK 1 (BLOCKING — implement and verify before proceeding) ===
Fix D-01 (Official Resources permanently suppressed):
  a. In components/shared/OfficialResources.tsx, remove the `hasCitations` prop from
     OfficialResourcesProps and remove the `if (hasCitations) return null;` guard at the top of
     the component body. Restore the original `if (!hasContent) return null;` as the sole early
     return.
  b. In app/workflows/[id]/page.tsx, remove the `hasCitations={...}` prop from the
     <OfficialResources ... /> call.
  c. Remove the entire header "Citations" block in page.tsx (the `<div className="text-[10px]
     text-muted-foreground border-t border-border/50 ...">` containing the `<ol
     className="list-decimal ...">` of footnote `<li id={`footnote-${idx+1}`}>` entries) — this
     content moves to Further Study in Task 2, it should not remain duplicated in the header.
  d. Keep the small "N sources cited" span next to the overview's ExpandableText — that stays,
     it's a citation-count affordance, not a duplicate render of the sources.
Acceptance criteria (verify before continuing):
  - On every workflow page, Official Resources (Documentation / Model Cards / Research Papers /
    Further Reading / Source Code) renders its content.
  - No dead anchor links remain — confirm by searching the rendered HTML of a sample workflow
    page for any `href="#resource-"` that has no matching `id="resource-..."` element in the DOM.
  - `npm run build` (or equivalent) succeeds with no TypeScript errors from the removed prop.

=== PHASE 2, TASK 2 — Reposition as "Further Study" and re-link footnotes ===
  a. Move the <OfficialResources .../> render call in page.tsx from its current position (directly
     after the header) to just above <RelatedContent items={relatedContent} /> at the bottom of
     the page.
  b. Rename the section header inside OfficialResources.tsx from "Official Resources" to
     "Further Study" (single string change in the JSX `<h2>`).
  c. Update the overview's footnote-link regex in page.tsx: instead of `[[$1]](#footnote-$1)`,
     resolve each footnote number directly to its Further Study anchor. This requires knowing,
     at the point the overview is rendered, which `resource-${category}-${index}` id each source
     number maps to — reuse the same `categorizeSources` + index-mapping logic that currently
     builds `urlToResource` in the (now-removed) Citations block; move that mapping computation
     up to where the overview is rendered, or lift it into a small helper both call sites can share.
Acceptance criteria:
  - Clicking an inline `[[1]]`-style marker in the overview scrolls directly to the matching card
    in the Further Study section at the bottom of the page (single hop, no intermediate list).
  - Further Study section still renders correctly when a workflow has a `github_repo` but the
    fewest possible sources (exactly 1, the schema minimum) — verify with
    llm-application-serving.json or any workflow with a small sources array.

=== PHASE 2, TASK 3 — Fix unresolved footnotes outside overview (D-02) ===
  a. Create lib/text/linkFootnotes.ts exporting:
     `export function linkFootnotes(text: string): string { return text.replace(/\[\^(\d+)\]/g, ' [[$1]](#footnote-$1)'); }`
     (Extract the existing inline regex from page.tsx verbatim — do not change its behavior, only
     its location. If Task 2's re-linking changes the target anchor scheme, keep this helper's
     OUTPUT FORMAT in sync with whatever page.tsx now uses for the overview.)
  b. In page.tsx, replace the inline regex on workflow.overview with a call to `linkFootnotes(workflow.overview)`.
  c. In page.tsx, apply `linkFootnotes(example.implementation_notes)` before passing to
     `<Prose content={...} />` for worked examples.
  d. In components/shared/WorkflowStepList.tsx, apply `linkFootnotes(s.what)` before passing to
     `<Prose content={...} />` for each step. Import linkFootnotes from '@/lib/text/linkFootnotes'.
Acceptance criteria:
  - Search the rendered text of vector-database-setup-indexing-strategy.json's page (the file
    with the most footnote markers — 44 in `what` fields) for literal `[^` substrings — none
    should remain unconverted.
  - Steps and worked examples with footnote markers now show clickable, styled links matching the
    overview's existing footnote-link appearance.

=== PHASE 3 — Worked Example reframing (C-01) ===
  a. In page.tsx's worked-examples section, change the condition that shows "Used in Step N" from
     an implied completeness badge to a neutral cross-reference: keep the link, but do not treat
     its absence as a gap — do not add any "missing related_step" visual indicator anywhere.
  b. For worked examples without `related_step`, add a small label (e.g. "Full Pipeline Recipe")
     in place of where "Used in Step N" would appear, so their absence of step-binding reads as
     intentional framing rather than missing metadata.
Acceptance criteria:
  - Workflows with fully-bound examples (llm-application-serving, production-llm-cost-latency-optimization)
    render unchanged.
  - Workflows with unbound examples (build-rag-system, rag-evaluation-harness,
    vector-database-setup-indexing-strategy) show the new "Full Pipeline Recipe" label instead of
    empty space where "Used in Step N" used to conditionally render nothing.

=== VALIDATION CHECKLIST (run after all phases) ===
[ ] Zod validation: run the existing content-validation script/build step against all 5
    data/workflows/*.json — all must still pass (no schema was changed, so this should be a no-op,
    but confirm no accidental JSON edits were made).
[ ] Official Resources / Further Study renders on all 5 workflow pages with correct category
    grouping (Documentation, Model Cards, Research Papers, Further Reading, Source Code).
[ ] No `href="#resource-*"` or `href="#footnote-*"` anchor points to a non-existent element on
    any of the 5 workflow pages.
[ ] Find-in-page (Ctrl/Cmd+F) still locates text inside collapsed steps and collapsed Production
    Profile sections — this prompt did not touch the beforematch/until-found wiring, confirm no
    incidental regression from moving OfficialResources' render position.
[ ] TOC and StickyActionBar anchors (#overview, #steps, #worked-examples, #failures, #production,
    #evaluation) are unaffected by moving the Official Resources/Further Study render call.
[ ] No literal `[^` substrings remain visible in rendered step or worked-example text on any of
    the 5 workflow pages.
[ ] Mobile viewport: Further Study section (now at page bottom) still renders its 2-column grid
    correctly at narrow widths — unchanged from its prior position, but re-verify since it's
    moved further down the scroll.
```
