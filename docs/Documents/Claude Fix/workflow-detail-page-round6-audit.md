# AENS Workflow Detail Page — Final Convergence Review (Round 6)

**Scope:** `app/workflows/[id]/page.tsx` and its rendering tree
**Reviewer posture:** Principal UX/UI + Documentation Architect + Design System Reviewer
**Verification method:** Direct repository inspection (no simulated findings)

---

## 1. Executive Summary

| Score | Value | Rationale |
|---|---|---|
| Documentation UX | 6/10 | Citation and resource systems are functionally complete but duplicate each other and lose fidelity in the fallback path. |
| Workflow UX | 6.5/10 | Step accordion is solid at small scale, but density controls that exist elsewhere in the codebase (capped lists) were never applied to Starter Stack or per-step `Uses:` badges. |
| Interaction Quality | 7/10 | Accordion, hash deep-linking, and find-in-page support are genuinely good. A few anchor targets and one toggle button lost ARIA state along the way. |

**Top strengths**
- The `until-found` + `beforematch` pattern is correctly wired in both `WorkflowStepList` and `CollapsibleRow`, so native browser find-in-page works against collapsed content — this is still rare in production React apps and is implemented correctly.
- `CodeBlock`'s Shiki truncation walker is a genuinely careful piece of engineering (balanced-tag depth walk rather than a naive string slice) and shows no regressions.
- `ResourceCategory` in `OfficialResources.tsx` already solves the "N items at scale" problem (cap at 3, "See more (+N)") — this pattern just hasn't been reused where it's now needed.

**Top remaining weaknesses**
1. The **Citations block duplicates Official Resources** with a lower-fidelity, unlinked, uncategorized presentation of the exact same URLs.
2. **Markdown fallback paths silently drop `<Prose>` rendering** for Common Failure Points and Production Profile notes — any content that doesn't parse into the expected labeled-clause shape renders as a raw, unformatted string, including literal markdown syntax.
3. **The "Steps" TOC anchor scrolls past its own section header** because the scroll-target `id` lives on the inner `<ol>` rather than the `SectionCard` wrapper that contains the "Workflow Steps" title.
4. **Per-step "View worked example →" links are not example-specific** — they all point to the top of the `#worked-examples` section regardless of which example the step is actually related to, because individual worked examples have no `id`.
5. **Starter Stack and per-step `Uses:` badges have no density cap**, unlike the sibling `ResourceCategory` pattern — at the stated future scale (30 steps, 50 tools) these will produce unbounded badge walls.

**Highest-priority fixes:** #2 (silent markdown breakage) and #3 (broken scroll target) are the two items that actively produce visibly wrong output today, not just at future scale — both are promoted to Phase 1.

---

## 2. Verified Findings

### F-01 — Citations block duplicates Official Resources with lower fidelity
**Severity:** High
**Evidence:** `app/workflows/[id]/page.tsx` — the inline `Citations` block (`workflow.sources.map(...)`, rendering `{url}` as raw text inside an `<ol>`) sits directly above `<OfficialResources sources={workflow.sources} ... />`, which receives the **same `workflow.sources` array** and renders it through `categorizeSources()` + `parseResourceUrl()` into titled, categorized (Documentation / Model Cards / Papers / Further Reading), icon-bearing cards.
**Root cause & impact:** Two components independently render the same source list with no awareness of each other. A reader sees the same arXiv or HuggingFace URL twice: once as a bare, truncated URL string under "Citations," and once as a nicely titled card under "Official Resources." This is the opposite of how Stripe/MDN/Vercel docs treat footnotes — they treat the reference list as a *pointer into* the resources section, not a second copy of it.
**Recommended solution:** Keep the `Citations` block only as an ordered index of *footnote numbers*, but instead of rendering the raw URL, resolve each source through `parseResourceUrl()` (already exported logic in `lib/resources.ts`, just not imported into this block) to get its title, and link with `<a href={link-into-Official-Resources-anchor}>`. Concretely:
  - Give each `ResourceCategory` list item in `OfficialResources.tsx` a stable `id` (e.g. slug of URL or index-based `id={`resource-${idx}`}`).
  - In the `Citations` block, render `[1] {resolvedTitle}` linking to that anchor instead of the raw URL and instead of a same-page `footnote-N` div with no other purpose.
  - Keep `footnote-N` ids only as the *inline anchor target* (so `[[1]](#footnote-1)` still works), but have the footnote list itself immediately redirect visually/semantically toward the Official Resources entry.
**Risks & trade-offs:** Requires `OfficialResources` to expose or share its title-resolution logic with the citations block (either lift `parseResourceUrl` usage up, or export a lightweight `resolveSourceTitle(url)` helper from `lib/resources.ts`). Low risk — pure additive refactor, no data shape changes.

### F-02 — Inline citation markers can be truncated out of reach by `ExpandableText`
**Severity:** Medium
**Evidence:** `page.tsx` wraps the overview markdown (which contains the rewritten `[[1]](#footnote-1)` links) in `<ExpandableText maxLines={4}>`. `ExpandableText.tsx` applies `WebkitLineClamp: maxLines` when collapsed and visually truncates anything beyond line 4 (`shouldClamp` + `line-clamp`).
**Root cause & impact:** If a citation marker `[[N]]` falls beyond the 4th visible line, it is invisible until the reader clicks "See more" — but nothing signals that a citation exists past the fold. A reader who never expands the overview will never know there's a `[3]` reference to follow, even though the Citations list below still lists source 3 as if it were referenced inline.
**Recommended solution:** Either (a) render at least one visual affordance in the collapsed state indicating "N references" independent of line position, or (b) exclude citation-bearing sentences from the clamp boundary calculation isn't practical — simplest fix is a small badge next to "... See more" such as "3 sources cited" so truncation doesn't hide the existence of citations, only their position.
**Risks & trade-offs:** Purely additive; no state logic changes required in `ExpandableText` itself.

### F-03 — Failure Points and Production Profile fallback text bypasses `<Prose>` rendering
**Severity:** Critical UX Bug
**Evidence:**
- `page.tsx`, Common Failure Points block: the fallback path when `parseLabeledClauses` returns `null` renders `<li className="content-prose list-disc pl-4">{pt}</li>` — `pt` is the raw string, not passed through `<Prose>`.
- Same file, every Production Profile sub-section (`production-deployment`, `production-scaling`, `production-cost`, `production-latency`, `production-observability`): the fallback path renders `<p className="text-sm leading-relaxed content-prose">{workflow.production_notes}</p>` — again raw string interpolation, not `<Prose>`.
- Even in the **structured (happy-path)** rendering of Production Profile clauses, `clause.text` is rendered as a plain `<span>`, never through `<Prose>` — unlike `WorkflowStepList`, which correctly threads `s.what` and `s.decision` through `<Prose>`.
**Root cause & impact:** `parseLabeledClauses` is a strict all-or-nothing matcher (it returns `null` if even one expected label is missing). Any content author who writes a failure point or production note that doesn't perfectly match the exact label set falls through to a path that was never given Markdown rendering. In practice this means any embedded `**bold**`, backtick code, or link syntax in that content renders as literal asterisks/backticks on the page — a visible, credibility-damaging regression risk that is easy to trigger simply by editing content, with no code change required to expose it.
**Recommended solution:** Wrap every text-bearing leaf in these two blocks — both fallback and structured `clause.text` paths — in `<Prose content={...} className="..." />` (or `<ProseInline>` where block-level `<p>` wrapping would break layout, e.g. inside the labeled-clause `<span>`).
**Risks & trade-offs:** None functionally — `Prose`/`ProseInline` already handle plain, non-markdown strings gracefully (they just render as a paragraph). This is a drop-in wrap, not a rewrite.

### F-04 — "Steps" TOC/hash anchor scrolls past the section header
**Severity:** High
**Evidence:** `page.tsx` TOC config includes `{ id: 'steps', label: 'Steps' }`. The only element in the DOM with `id="steps"` is the `<ol id="steps" className="... scroll-mt-24">` inside `WorkflowStepList.tsx` — which is rendered as a **child** of `<SectionCard title="Workflow Steps" subtitle="Sequential pipeline" badge={...}>`. `SectionCard.tsx` renders its own header block (`"Workflow Steps"` title + subtitle + step-count badge) **above** `children` inside the same bordered card.
**Root cause & impact:** Clicking "Steps" in the TOC (sidebar, horizontal pill row, or `StickyActionBar`) scrolls the `<ol>` itself to the top of the viewport, which visually clips off the "Workflow Steps / Sequential pipeline / N steps" card header above it — plus the "Expand All / Collapse All" controls that sit between the card header and the `<ol>`. The reader lands inside the card mid-way, with the immediate context (and the Expand All/Collapse All controls) cut off above the fold.
**Recommended solution:** Move `id="steps"` (and `scroll-mt-24`) to the outer `SectionCard` wrapper instead of the inner `<ol>`. Since `SectionCard` currently doesn't accept an `id`/`className` prop for its root, add an optional `id`/`className` passthrough to `SectionCard`, or wrap it in a plain `<div id="steps" className="scroll-mt-24">` in `page.tsx`. Remove `id="steps"` from the `<ol>` at that point (keep `scroll-mt-24` there only if still needed for redundancy — it isn't).
**Risks & trade-offs:** Trivial, isolated change. Verify no other code (e.g. `StickyActionBar`'s `getBoundingClientRect` active-section detection) depends on `#steps` resolving specifically to the `<ol>` rather than its wrapper — a quick grep confirms only the anchor scroll target and intersection observer read this id, both of which work equally well against the wrapper.

### F-05 — Per-step "View worked example →" links are not example-specific
**Severity:** High
**Evidence:** `WorkflowStepList.tsx`: `relatedExample && <Link href="#worked-examples">View worked example →</Link>`. `page.tsx`: each worked example is rendered as `<div key={idx} className="border border-border rounded-lg ...">` with **no `id` attribute** — only the section wrapper has `id="worked-examples"`.
**Root cause & impact:** When a workflow has more than one worked example, every step's backlink points to the same generic anchor (`#worked-examples`), not to the specific example that step is related to. A developer on Step 12 of a 30-step workflow who clicks "View worked example" lands at the top of the worked-examples list and has to visually scan for the right one — defeating the purpose of the "Used in Step N" cross-reference that was clearly designed to make this a two-way link (the forward direction, `Used in Step {N}` → `#step-{N}`, works correctly; only the reverse direction is broken).
**Recommended solution:** Give each worked-example `<div>` a deterministic `id`, e.g. `id={`example-${idx}`}` or, more robustly, `id={`example-related-step-${example.related_step}`}` if `related_step` is guaranteed present/unique. Update the step-side link to `href={`#example-${matchedIndex}`}` (compute the index alongside the existing `.find()` call, or switch to `.findIndex()`).
**Risks & trade-offs:** Low risk. If multiple worked examples share the same `related_step` (not currently prevented by the schema), decide whether the step should link to the first match or list all matches — worth a one-line acceptance criterion in the implementation ticket rather than leaving it ambiguous.

### F-06 — Starter Stack and per-step `Uses:` badges have no density cap
**Severity:** Medium (High at stated future scale of 30 steps / 50 tools)
**Evidence:** `page.tsx`'s Starter Stack renders `workflow.starter_stack.map(...)` with no `.slice()` or "show more" affordance — just `flex flex-wrap`. `WorkflowStepList.tsx`'s `renderAllUses` likewise maps every id in every `uses` category with no cap. Contrast with `OfficialResources.tsx`'s `ResourceCategory`, which already implements `urls.slice(0, 3)` + a "See more (+N)" toggle for exactly this problem.
**Root cause & impact:** At small scale (today's content) this is invisible. At the review's stated future assumption — 30 steps, 50 tools — the Starter Stack row alone could wrap across many lines before any workflow content is visible, and a single step's `Uses:` row could do the same inside an already-expanded card, working against the "scan the whole checklist in seconds" goal named in the brief.
**Recommended solution:** Reuse the existing cap pattern: default to showing the first 6–8 Starter Stack badges with a "+N more" toggle (matching `ResourceCategory`'s interaction, for consistency); cap per-category `Uses:` badges similarly (e.g. first 4 packages, "+N more" inline).
**Risks & trade-offs:** Introduces new local state (`useState` for expanded/collapsed) in two more places — keep it as a small extracted shared component (e.g. `BadgeRow`) rather than copy-pasting the `ResourceCategory` expand logic a third time, to avoid drift between three near-identical implementations.

### F-07 — Wrap-toggle button lacks `aria-pressed`
**Severity:** Low
**Evidence:** `CodeBlockInteractive.tsx`: the wrap toggle `<button onClick={() => setWrapped(prev => prev === true ? false : true)} aria-label="Toggle line wrap" ...>` — has an `aria-label` but no `aria-pressed={wrapped === true}`. Compare to `WorkflowStepItem`'s expand button, which correctly sets `aria-expanded={isOpen}`.
**Root cause & impact:** Screen reader users get an accessible name ("Toggle line wrap") but no indication of the button's current state (on/off), unlike every other stateful toggle in this same file (`isExpanded` → `aria-expanded`, copy button's implicit state via visible text change).
**Recommended solution:** Add `aria-pressed={wrapped === true}` to the wrap toggle button.
**Risks & trade-offs:** None — one-line addition.

### F-08 — "Collapse All" does not collapse Step 1
**Severity:** Low
**Evidence:** `WorkflowStepList.tsx`: `const collapseAll = () => { setExpandedSteps(new Set([0])); }` — the comment even notes `// Keep Step 1 open by default`.
**Root cause & impact:** The button is labeled "Collapse All" but does not, in fact, collapse all steps — Step 1 remains open. This is a minor label/behavior mismatch; a developer who has manually re-collapsed Step 1 and then clicks "Collapse All" will see it snap back open, which reads as a bug even though it's intentional.
**Recommended solution:** Either rename the control (e.g. "Reset" or "Collapse") or make it a true collapse-all and let the page's natural default (Step 1 open) only apply on initial mount, not on every "Collapse All" click. Given the brief's "Ignore Cosmetic Nits" constraint, the label change is the lower-risk of the two options.
**Risks & trade-offs:** Behavioral change (true collapse-all) could be seen as a regression if Step 1-open-by-default was a deliberate content-discoverability decision — recommend the label fix only, not the behavior change, absent explicit sign-off.

---

## 3. Workflow UX Audit

**Step scannability:** The accordion pattern (header always visible with name + tool badges, body collapsed via native `until-found`) is the correct shape for 30-step scanning — the header alone gives step number, name, and tools without opening anything. The one thing standing between this and true "scan in seconds" territory is F-06 (unbounded tool badge wrapping) — at 50 tools spread across steps, some individual step headers could themselves wrap 2–3 lines before any card is opened, working against scan speed more than the accordion body ever would.

**Code example layout:** Card-level association between a worked example and its step is real but currently one-directional (F-05). Implementation notes are visually attached to their code block (same card, `border-t` separator, position directly below) — this part is solid and needs no change.

**Failures presentation:** The `border-l-2 border-amber-500` treatment with labeled-clause parsing is a good scannable-engineering-spec pattern *when it hits the happy path*. The silent fallback-to-raw-string issue (F-03) is the single biggest risk to this section's credibility, since it can be triggered by content changes alone with zero code changes.

**Resources grouping:** `OfficialResources.tsx`'s categorization (Documentation / Model Cards / Papers / Further Reading, each with a distinct icon and color) is genuinely good documentation-system design — the issue is entirely that the `Citations` block in `page.tsx` doesn't know this categorization exists and re-renders the same data more poorly (F-01).

**Citations behavior:** Functionally wired (footnote markers → anchor targets) but visually and semantically disconnected from the richer resource system sitting a few hundred pixels below it, and vulnerable to being scrolled out of reach by truncation (F-02).

---

## 4. Prioritized Roadmap

### Phase 1 — Critical UX Bugs (fix before freeze; each is currently producing wrong output, not just a future risk)
1. F-03 — Wrap Failure Points and Production Profile text (both fallback and structured paths) in `<Prose>`/`<ProseInline>`.
2. F-04 — Move the `#steps` anchor target from the inner `<ol>` to the `SectionCard` wrapper.
3. F-05 — Give worked examples individual `id`s and fix the step→example backlink to target the specific example.

### Phase 2 — Interaction Improvements
4. F-01 — De-duplicate Citations against Official Resources; link footnotes into the resource cards instead of re-rendering raw URLs.
5. F-06 — Apply the existing `ResourceCategory` cap-and-expand pattern to Starter Stack and per-step `Uses:` badges.
6. F-07 — Add `aria-pressed` to the wrap-toggle button.

### Phase 3 — Documentation UX Polish
7. F-02 — Surface a citation-count affordance so truncation doesn't hide the existence of references.
8. F-08 — Rename "Collapse All" (or resolve the Step-1-stays-open mismatch) — cosmetic/labeling only, lowest risk tolerance for behavior change.

Dependency note: Phase 2 item F-01 benefits from doing F-04's `SectionCard` id-prop change first only in the sense of code-review hygiene (same file, same PR shape) — there is no functional dependency between roadmap items; they can ship in any order within their phase.

---

## 5. Windsurf Implementation Prompt

```
You are implementing Phase 1–3 fixes identified in the AENS Workflow Detail Page Round 6 convergence
audit. Follow this prompt exactly — do not expand scope beyond what is listed.

FILES TO MODIFY:
- app/workflows/[id]/page.tsx
- components/shared/WorkflowStepList.tsx
- components/shared/CodeBlockInteractive.tsx
- components/shared/OfficialResources.tsx
- components/shared/SectionCard.tsx
- lib/resources.ts (only if adding a shared title-resolution export for F-01)

FILES TO AVOID (already correct per prior rounds — do not refactor):
- components/shared/CodeBlock.tsx (Shiki truncation logic — verified correct, no changes)
- components/shared/ExpandableText.tsx (do not change clamp/measurement logic — only page.tsx
  may add an adjacent citation-count element per F-02, not touch this file's internals)
- components/shared/TableOfContents.tsx
- components/shared/ContentPageLayout.tsx
- components/shared/CollapsibleRow.tsx
- lib/text/parseLabeledClauses.ts (do not loosen its all-or-nothing matching — the fix is to
  wrap its OUTPUT in Prose, not to change how/when it returns null)

=== PHASE 1 ===

TASK 1 — Prose-wrap Failure Points and Production Profile text (F-03)
In app/workflows/[id]/page.tsx:
  a. In the Common Failure Points fallback branch (`return <li key={idx} className="content-prose
     list-disc pl-4">{pt}</li>`), replace `{pt}` with `<Prose content={pt} className="inline"
     />` — or, if block-level <p> breaks the <li> layout, use `<ProseInline content={pt} />`
     imported from '@/components/shared/Prose'.
  b. In every Production Profile sub-section (deployment, scaling, cost, latency, observability),
     wrap BOTH the structured-clause `<span className="ml-1">{clause.text}</span>` AND the
     fallback `<p className="text-sm leading-relaxed content-prose">{workflow.production_notes}</p>`
     (and the equivalent for scaling_notes, cost_notes, latency_notes, observability_notes) so that
     `clause.text` / the raw note string is passed through `<ProseInline content={...} />`
     instead of raw interpolation.
  c. In WorkflowStepList.tsx, apply the same treatment to the labeled-clause fallback rendering
     for `s.failure_points` (the `<li key={fpIdx} className="text-xs ...">{fp}</li>` fallback
     branch) and to `clause.text` in the structured branch.
Acceptance criteria:
  - A failure point or production note containing `**bold**`, `` `code` ``, or a markdown link
    renders as formatted output, not literal markdown syntax, in BOTH the structured and
    fallback code paths.
  - No visual regression to spacing/line-height in the amber Watch Out blocks or Production
    Profile sub-sections (ProseInline must not introduce block-level margin where inline was
    previously used).

TASK 2 — Fix the #steps scroll anchor (F-04)
  a. Add an optional `id?: string` and `className?: string` prop to SectionCard.tsx, applied to
     the outer `<div>` (merge with existing classes via the project's `cn()` utility).
  b. In page.tsx, pass `id="steps" className="scroll-mt-24"` to the `<SectionCard title="Workflow
     Steps" ...>` instance.
  c. In WorkflowStepList.tsx, remove `id="steps"` from the `<ol>` (keep `scroll-mt-24` removed
     too, since the anchor now lives on the wrapper).
Acceptance criteria:
  - Clicking "Steps" in the sidebar TOC, the horizontal pill TOC, and the StickyActionBar's
    section jumper all scroll such that the "Workflow Steps / Sequential pipeline / N steps"
    card header AND the Expand All/Collapse All controls are visible above the first step.
  - useActiveSection's IntersectionObserver still correctly marks "Steps" as active when
    scrolled into that region (no id collision — verify only one `id="steps"` exists in the DOM
    after the change).

TASK 3 — Fix step→example backlinks (F-05)
  a. In page.tsx, add `id={`example-${idx}`}` to each worked example's outer `<div key={idx}
     className="border border-border rounded-lg ...">`.
  b. In WorkflowStepList.tsx, when computing `relatedExample`, also compute its index:
     `const relatedExampleIndex = workedExamples?.findIndex(ex => ex.related_step === s.step);`
     and pass both down, OR pass the full `workedExamples` array with index to `WorkflowStepItem`
     and resolve there.
  c. Change the Link's href from `"#worked-examples"` to `` `#example-${relatedExampleIndex}` ``.
Acceptance criteria:
  - On a workflow with 2+ worked examples, each step's "View worked example →" link scrolls
    directly to ITS OWN related example, not to the top of the worked-examples section.
  - The forward link ("Used in Step N" on the example card, pointing to `#step-{N}`) continues
    to work unchanged — do not modify that part.

=== PHASE 2 ===

TASK 4 — De-duplicate Citations against Official Resources (F-01)
  a. In lib/resources.ts, export a lightweight helper (or reuse `parseResourceUrl` by exporting
     it from OfficialResources.tsx, whichever keeps the parsing logic in one place) that resolves
     a URL to a short display title.
  b. In OfficialResources.tsx, add a stable `id` to each rendered resource `<li>` (e.g. slugify
     the URL or use a `resource-${category}-${index}` scheme) so it can be deep-linked.
  c. In page.tsx's Citations block, replace the raw `{url}` text with the resolved title, and
     link to the corresponding Official Resources anchor instead of (or in addition to) the raw
     URL. Keep the `id="footnote-{idx+1}"` on the citation `<li>` so inline `[[1]]` links still
     resolve to this list — only the DESTINATION shown here changes.
Acceptance criteria:
  - No source URL is rendered as bare, unstyled text anywhere on the page.
  - Clicking a Citations entry navigates to (or highlights) the matching Official Resources card.
  - No functional change to how inline `[^1]` → `[[1]](#footnote-1)` rewriting works in the
    overview text.

TASK 5 — Cap Starter Stack and per-step Uses: badges (F-06)
  a. Extract a small shared component (e.g. components/shared/BadgeRow.tsx) implementing the
     same cap-and-expand interaction already in OfficialResources.tsx's ResourceCategory
     (default visible count + "+N more" toggle).
  b. Use it for the Starter Stack row in page.tsx (suggest default visible: 8) and for
     renderAllUses in WorkflowStepList.tsx (suggest default visible: 4 per category).
Acceptance criteria:
  - With a workflow.starter_stack of 50 items, only 8 badges plus a "+42 more" control render
    initially; clicking it reveals the rest without page jump/scroll shift.
  - Existing workflows with small Starter Stack / Uses counts render identically to today (no
    "+N more" control appears when count is below the cap).

TASK 6 — Add aria-pressed to wrap toggle (F-07)
  In CodeBlockInteractive.tsx, add `aria-pressed={wrapped === true}` to the wrap toggle button.
Acceptance criteria: axe/accessibility scan shows the button reporting a pressed state.

=== PHASE 3 ===

TASK 7 — Citation-count affordance under truncated overview (F-02)
  In page.tsx, when `workflow.sources.length > 0` and the overview is collapsed, render a small
  inline label near ExpandableText's "See more" control indicating the citation count (e.g.
  "3 sources cited"). Do not modify ExpandableText.tsx internals — compose around it.
Acceptance criteria: label only appears when sources exist; disappears/is redundant once expanded
  (or persists harmlessly — no functional requirement either way, reviewer's call).

TASK 8 — "Collapse All" label fix (F-08)
  In WorkflowStepList.tsx, rename the "Collapse All" button label to something accurate given
  that Step 1 remains open (e.g. "Collapse"), OR add a one-line comment/tooltip clarifying the
  behavior. Do NOT change the underlying collapseAll() behavior without explicit product sign-off.
Acceptance criteria: label no longer overpromises full collapse; no behavior change.

=== REGRESSION CHECKLIST (run after all phases) ===
[ ] Find-in-page (Ctrl/Cmd+F) still locates text inside collapsed steps and collapsed
    Production Profile sections (beforematch handlers untouched).
[ ] All existing TOC anchors (#overview, #steps, #worked-examples, #failures, #production,
    #evaluation) still resolve to a sensible scroll position with correct scroll-mt-24 offset.
[ ] Hash deep-links directly into #production-cost / #production-latency / etc. still
    auto-expand the Production Profile CollapsibleRow.
[ ] StickyActionBar's active-section label still updates correctly while scrolling past every
    section, including the relocated #steps anchor.
[ ] CodeBlock server-side Shiki rendering and truncation are visually unchanged (Task list did
    not touch CodeBlock.tsx).
[ ] No new client-side state was introduced into any Server Component (SectionCard's new id/
    className props must remain plain pass-through, no 'use client' added to it).
[ ] Mobile viewport (< md breakpoint): Starter Stack and Uses: badge caps render correctly and
    the "+N more" control is reachable and tappable.
```
