# AENS Inspection Report — Problem Index Sticky Header + Cross-Resource Task Architecture

**Scope**: `D:\Project\ai-engineering-handbook` (branch `feature/repository-foundation-v2`)
**Method**: Direct inspection of source (not assumption-based). Files read in full: `ProblemIndexDashboard.tsx`, `PackageTaskList.tsx`, `WorkflowStepList.tsx`, `CheatsheetEntry.tsx`, `CollapsibleRow.tsx`, `ModelCollapsibleSections.tsx`, `ContentPageLayout.tsx`, `StickyActionBar.tsx`, all four "thin" pages (`patterns`, `principles`, `decision-guides`, `debug-guides`), `workflows/[id]/page.tsx`, `models/[category]/[id]/page.tsx`, all Zod schemas in `lib/schemas/`, `aens.config.json`, `docs/architecture/design-principles.md`.

---

## 1. Executive Summary

The two-issue framing you were given is **correct on Issue 1** and **wrong on Issue 2**. I'm not softening that.

**Issue 1 (sticky header)** is real and the current implementation is genuinely bad: a full-width sticky bar with search + a toolbar row that only *fades in opacity* (`opacity-0 h-0 overflow-hidden`) after 80px of scroll, while the search input itself stays permanently pinned at `top-14 md:top-16` for the entire page. On a long category list this eats ~60-70px of viewport permanently and the transition is a blunt fade, not a redesign. Fixable in one component, no schema involvement, no architecture risk.

**Issue 2 (cross-resource "Task Lists") is a misdiagnosis.** I read the actual page source for Pattern, Principle, Decision Guide, and Debug Guide. They are not "missing Task Lists." They are **incomplete stub pages** that don't even render fields that **already exist** in their Zod schemas:

| Content type | Schema fields that exist | Fields actually rendered on the page |
|---|---|---|
| Pattern | `concept`, `applicability`, `anti_patterns`, `implementation_notes`, `examples`, `related_workflows/models/packages/principles` | `concept`, `applicability` only |
| Principle | `statement`, `intuition`, `mathematical_formulation`, `implications`, `limitations`, `related_concepts`, `referenced_by_*` | `statement`, `intuition` only |
| Decision Guide | `problem`, `evaluation_criteria`, `options[].strengths/weaknesses/avoid_when`, `comparison_table`, `recommendations`, `use_cases` | `problem`, and `option.name`/`best_for` only (as a flat `<li>`) |
| Debug Guide | `symptoms`, `root_causes`, `diagnosis`, `solutions[].steps`, `prevention` | `symptoms` only |

None of these four pages use `ContentPageLayout`, `MetadataBadges`, `RelatedContent`, breadcrumbs, or a TOC — the exact composition pattern your own `docs/architecture/design-principles.md` documents as the mandatory shell (*"Use composition over inheritance… `<ContentPageLayout><Breadcrumbs/><TableOfContents/><StickyActionBar/>{children}</ContentPageLayout>`"*). Model, Package, Workflow, and Cheatsheet all follow it. These four don't.

So the proposed plan — **"add a `tasks` field to multiple schemas"** — is solving a problem you don't have (missing data) by expanding schema surface, while ignoring the problem you do have (missing rendering, missing shell, missing polish for data that's sitting right there in the JSON). I'm rejecting that part of the plan. Full reasoning in §4 and §6.

**Bonus finding, unprompted but material**: the four stub pages also mean any content already authored into `anti_patterns`, `implications`, `root_causes`, `diagnosis`, `solutions`, `prevention`, `evaluation_criteria`, etc. for existing Pattern/Principle/Decision Guide/Debug Guide JSON files is currently invisible to readers. If your content generation pipeline has been populating these fields, you have a live content-loss bug, not just a UX gap.

---

## 2. Review of the Existing Implementation Plan

Going claim by claim.

| Plan claim | Verdict | Why |
|---|---|---|
| "Sticky search blocks reading" | **Correct** | Confirmed in code: `sticky top-14 md:top-16 z-20` wrapper never leaves the DOM flow; only the chips/actions row collapses via opacity+height. |
| Fix option A: "hide everything" | **Reject** | Removes search entirely while scrolling a taxonomy with (per the stats bar) N categories × M problems — the single most-used affordance on the busiest content-discovery page in the app. Violates "Search Discoverability" as a UX principle. |
| Fix option B: "keep a slim sticky search row" | **Partially accept, needs refinement** | Directionally right, but as stated it's still just "shrink the same bar," not a state-machine redesign. See §7 for the actual recommended interaction. |
| "Only Model, Package, Cheatsheet have Task Lists" | **Factually incomplete** | Workflow also has an equivalent (`WorkflowStepList`) — the plan didn't even count it. This suggests the audit that produced this plan looked at component *names* ("TaskList") rather than component *function* (collapsible, numbered, progressively-disclosed item lists), which is exactly the category error driving the rest of the plan. |
| "Add `tasks` field to Pattern/Principle/Decision Guide/Debug Guide schemas" | **Reject** | See §4. This is schema expansion to solve a rendering-layer + content-modeling problem, and it would require an ADR-worthy Architecture Freeze exception you don't need to spend. |

---

## 3. Root Cause Analysis — Sticky Problem Index

### What's actually there
`ProblemIndexDashboard.tsx`:
- A stats bar (non-sticky, 4-stat grid) — fine as-is.
- A `<div className="sticky top-14 md:top-16 z-20 bg-background/95 backdrop-blur-md py-3 border-b">` containing:
  1. The search `<input>` — **always visible**, never collapses.
  2. A "Navigation & Action Toolbar" div — **category jump-chips + Expand All/Collapse All + result count** — collapses to `opacity-0 h-0 overflow-hidden pointer-events-none` once `mainElement.scrollTop > 80`.
- Scroll listener attached to a `#main-scroll` element (confirms this is a custom-scroll-container layout, not `window` scroll — important for any fix, see Accessibility notes below).
- A **second, independent** sticky mechanism already exists app-wide: `StickyActionBar.tsx`, a bottom-pinned floating pill (prev/next-section nav + "jump to section" sheet) that appears only when scrolling *up* or near the page bottom, hidden by default, `visible: false` until `scrollY > 200`. This is a *direction-aware, intent-based* reveal pattern — and it's already the established idiom in this codebase for "give people navigation without permanently taxing the viewport."

### Root cause
The Problem Index re-implements sticky/scroll logic **from scratch** instead of reusing the direction-aware reveal pattern already proven in `StickyActionBar`. The result is a single-purpose fade (opacity+height) rather than a state transition, and it optimizes for "keep search reachable" by **brute-force pinning**, at the cost of ~60-70px of permanent vertical tax across the *entire* scroll length of the page, not just near the top.

### Verdict
This is a **UX/interaction-design problem, not an architecture problem.** One component. Zero schema, zero routing, zero data-layer involvement. Safe to fix without any Architecture Freeze exception.

---

## 4. Root Cause Analysis — Cross-Resource Task Lists

### What "Task List" actually means in this codebase
I traced the shared primitive. `PackageTaskList` and `CheatsheetEntry` are both thin wrappers around **`CollapsibleRow`** (`components/shared/CollapsibleRow.tsx`): numbered icon badge, bold label, italic "teaser" line, hash-deep-linkable collapsible body, consistent header/content classNames. `ModelCollapsibleSections` uses the *exact same* `CollapsibleRow` primitive for its Hyperparameter Guide section (numbered, expandable, "Expand All/Collapse All" — structurally identical to `PackageTaskList`'s progress bar). `WorkflowStepList` independently reimplements the same visual pattern (numbered circle, expandable body, "Watch Out" callout) without using `CollapsibleRow` — a **minor** existing inconsistency worth fixing while you're in this code, but not blocking.

So: **the shared abstraction already exists.** `CollapsibleRow` is a generic, schema-agnostic, numbered/expandable list renderer. It is already used by 3 of the 4 "haves." The plan's framing — "Model/Package/Cheatsheet have Task Lists, others don't" — is really "3 content types already use the existing shared primitive against their own field arrays; 4 content types don't use it at all, because their pages don't render most of their own fields."

### Does each schema already contain what a "Task List" needs?
Checking field-by-field against what `CollapsibleRow` needs (a list of items, each with a title + expandable detail):

- **Debug Guide**: `solutions: DebugSolutionSchema[]` where each solution has `solution: string`, `steps: string[]`, `verification?: string`. This is **already a task list** — literally titled steps with verification criteria. Zero schema change needed; it needs a `DebugSolutionList` (or reuse `CollapsibleRow` directly) rendering `solutions.map(...)`.
- **Pattern**: `examples: string[]` (currently unrendered) and `anti_patterns: string[]` (currently unrendered) are list data but not task-shaped (no title+body pairs, just flat strings). Forcing these into a "Task List" would be misuse. They belong in a plain expandable list (`ExpandableText`/simple `<ul>`), not `CollapsibleRow`.
- **Principle**: `implications: string[]`, `limitations: string[]` — same shape as Pattern's flat arrays. Not task-shaped. A Principle is a "why," not a "how"; forcing a checklist UI onto a mathematical statement actively fights the content type's own purpose (your schema docstring literally says *"Patterns tell 'how', Principles tell 'why'"*).
- **Decision Guide**: `options: DecisionOptionSchema[]` (name/strengths/weaknesses/best_for/avoid_when) and `evaluation_criteria: DecisionCriteriaSchema[]` (criterion/weight/description). This is a **comparison matrix**, not a task list — it already has its own well-known UI pattern (you built it for Model's "Comparison with X" cards in `ModelCollapsibleSections`, reusable almost verbatim).

### Answer to the plan's own diagnostic question
> "Is this fundamentally a schema problem, a rendering problem, a UX problem, or a content modeling problem?"

**It's two different things wearing one name:**
1. **Debug Guide** genuinely has task-shaped data (`solutions[].steps`) sitting unrendered — this is a **pure rendering problem**. Reuse `CollapsibleRow`, zero schema change.
2. **Pattern, Principle, Decision Guide** do *not* have task-shaped data, and manufacturing a generic `tasks` field for them would be a **content-modeling anti-pattern**: you'd be asking content authors to duplicate `anti_patterns`/`limitations`/`options` into a redundant `tasks[]` array, which is exactly the "requires manual synchronization" failure mode Phase 4 of your own brief asks me to check for. It fails that check.

### Verdict
Reject "add `tasks` field to multiple schemas" outright. The real fix is: (a) finish building the four stub pages against their **existing** schema fields, using the **existing** `ContentPageLayout` shell and the **existing** `CollapsibleRow` primitive where the data is genuinely list-of-expandable-items shaped, and (b) stop calling this "Task Lists" — see §5.

---

## 5. Generic Learning Flow Evaluation

Per Phase 3: no, not every resource should expose a "Task List," and forcing one uniform name/shape across content types with fundamentally different epistemic purposes (a Principle is a proof, a Debug Guide is a runbook, a Decision Guide is a matrix) is itself a UX regression — it teaches the reader to expect the wrong interaction model for the content type.

Recommended mapping (naming matters here — these are the section headers, not new component names):

| Content type | What the "action items" section should be called | Actual UI pattern | Component |
|---|---|---|---|
| Package | Task List (keep name — it's genuinely a task catalog) | Numbered collapsible rows | `PackageTaskList` (unchanged) |
| Model | Hyperparameter Guide (keep) | Numbered collapsible rows | `ModelCollapsibleSections` (unchanged) |
| Cheatsheet | Entries (keep) | Numbered collapsible rows | `CheatsheetEntry` (unchanged) |
| Workflow | Steps (keep) | Numbered collapsible rows | `WorkflowStepList` (recommend: refactor onto `CollapsibleRow` for consistency — optional, non-blocking) |
| **Debug Guide** | **Solutions** | Numbered collapsible rows (steps + verification) | **New**: `DebugSolutionList` using `CollapsibleRow` |
| Pattern | Anti-Patterns / Examples | Flat expandable list (no numbering, no "task" framing) | `ExpandableText` + simple list, no new component |
| Principle | Implications / Limitations | Flat expandable list | Same as above |
| Decision Guide | Options Comparison | Comparison card grid (same visual language as `ModelCollapsibleSections`'s "Comparison with X") | New: `DecisionOptionGrid`, modeled on existing comparison cards |

This gives you **one shared interaction primitive** (`CollapsibleRow`) applied only where the data is genuinely task/step-shaped, and plain progressive-disclosure text elsewhere — consistent without being uniform-for-its-own-sake.

---

## 6. Architecture Assessment

Checking the plan against Phase 4's four questions:

- **Duplicate content?** Yes — a manufactured `tasks[]` field on Pattern/Principle/Decision Guide would duplicate data already expressed in `anti_patterns`/`implications`/`options`. Rejected on this basis alone.
- **Increase maintenance?** Yes — every future Pattern/Principle authored would need *both* the semantic field and a redundant task rendering of it kept in sync by hand (or by pipeline logic that doesn't exist yet).
- **Manual synchronization required?** Yes, per above.
- **Complicate schema evolution?** Yes — it adds a field whose meaning ("tasks") doesn't map to any of these content types' actual epistemic role, which will confuse the next person who has to decide "does this go in `tasks` or `implications`?" forever.

**My recommendation clears all four**: zero new schema fields, zero new top-level types, reuses `CollapsibleRow` (already-approved shared primitive), reuses `ContentPageLayout` (already-mandatory shell per your own design-principles doc). This is strictly additive at the *rendering* layer only — the smallest change that closes the actual gap.

---

## 7. Alternative Approaches Considered

**For Issue 1**, three options evaluated beyond the two given:

1. *Hide everything on scroll* (proposed A) — rejected, kills search discoverability.
2. *Slim sticky search row* (proposed B) — a valid direction but underspecified as stated.
3. **Two-tier sticky state machine** (recommended, see §10): full toolbar at scroll-top → compact single-row search-only bar past a threshold → the search input **shrinks into an icon-trigger** if the user keeps scrolling deep into a long list, matching the existing `StickyActionBar` direction-aware reveal idiom already in this codebase. This reuses the mental model users already learn elsewhere in the app instead of inventing a fourth scroll behavior.
4. *Floating/detached search* (a true floating pill independent of layout) — considered and rejected: would create two different sticky idioms (top-anchored shrinking bar vs. bottom-anchored floating pill) fighting for attention on the same page. Bad for information density.

**For Issue 2**, two options evaluated beyond the schema-expansion plan:

1. *Generic `tasks` field on all schemas* (proposed) — rejected, §4/§6.
2. **Type-aware rendering of existing fields via shared primitives** (recommended) — build the four missing page bodies against real schema fields, applying `CollapsibleRow` only to genuinely task-shaped arrays (Debug Guide solutions) and plain lists/cards elsewhere.
3. *Fully generic "any array of objects becomes a CollapsibleRow" renderer driven by config* — considered, rejected as over-engineering for 4 content types with genuinely different shapes; the complexity of a config-driven generic renderer would exceed the complexity of writing 3 small, explicit components. YAGNI.

---

## 8. Recommended Solution

1. **Problem Index**: replace the opacity/height fade with a 3-state sticky bar (full → compact → icon-triggered), scroll-direction aware, matching `StickyActionBar`'s existing idiom. One file (`ProblemIndexDashboard.tsx`), no new dependencies.
2. **Debug Guide page**: rebuild on `ContentPageLayout`, render `root_causes`, `diagnosis`, `prevention` as structured sections, and render `solutions` via a new `DebugSolutionList` built on `CollapsibleRow` (genuinely task-shaped data, genuinely warrants the pattern).
3. **Pattern / Principle / Decision Guide pages**: rebuild on `ContentPageLayout` with `MetadataBadges` + `RelatedContent` for consistency with Model/Package/Workflow; render all currently-dead schema fields using plain progressive-disclosure components (`ExpandableText`, simple lists) — **no** `CollapsibleRow`/"Task List" framing, because the data isn't task-shaped.
4. **Decision Guide options**: render as a comparison-card grid, visually consistent with (and possibly extracted from) `ModelCollapsibleSections`'s existing "Comparison with X" card markup.
5. **Optional cleanup (non-blocking)**: refactor `WorkflowStepList` onto `CollapsibleRow` for full primitive consistency across all four "numbered expandable" use sites.

This requires **zero Architecture Freeze exceptions** — no schema files change, no `aens.config.json` change, no routing change. Everything is additive JSX against fields that already validate under existing Zod schemas.

---

## 9. Additional Improvement Opportunities

Found during inspection, not asked for, offered because they have clear UX value and you should know about them before shipping the above:

- **Content-loss risk (real, not hypothetical)**: if your content generation pipeline (mentioned in your project context — Claude Skill ecosystem, T2/T3 content flows) has already populated `anti_patterns`, `implementation_notes`, `root_causes`, `diagnosis`, `evaluation_criteria`, etc. into existing JSON files, that content is currently 100% invisible on the live site. Worth a quick `grep`/JSON audit across `data/patterns/`, `data/principles/`, `data/decision-guides/`, `data/debug-guides/` to see how much authored content is already stranded before you scope the rebuild — the page-rebuild effort estimate depends heavily on whether you're writing render code for empty fields or for a backlog of real content.
- **`WorkflowStepList` inconsistency**: it duplicates `CollapsibleRow`'s visual language by hand instead of using it. Low priority, but every future change to the "numbered collapsible row" look now has to happen in two places.
- **Problem Index performance**: the `IntersectionObserver`-driven `activeCategory` highlight and the debounced search both re-run `useMemo` filtering over the full taxonomy on every keystroke (after debounce). Fine at current scale; if `stats.totalProblems` grows into the many hundreds, consider memoizing the lowercase category/problem strings once rather than re-lowercasing inside the `useMemo` filter callback on every keystroke.
- **Mobile note for the Problem Index chips row**: `overflow-x-auto` + `scrollbar-none` on the jump-to chips is a reasonable mobile pattern, but with the compact sticky state proposed below, make sure the compact-state search bar doesn't also need horizontal scroll affordance on small viewports — test at 360px width specifically.

---

## 10. Risk Assessment

| Change | Risk | Mitigation |
|---|---|---|
| Problem Index sticky state machine | Low — isolated component, client-only, no data dependency | Test scroll-direction logic on the `#main-scroll` custom container specifically (not `window`) since that's the actual scroll owner |
| Debug Guide rebuild | Low-medium — first time this page uses `ContentPageLayout`, verify TOC anchor IDs don't collide with existing `scroll-mt-24` conventions used elsewhere | Copy the TOC/anchor pattern verbatim from `workflows/[id]/page.tsx`, which is the closest structural analog (sequential steps + failure points + evaluation checklist) |
| Pattern/Principle rebuild | Low — purely additive rendering of already-validated fields | None needed; these fields are already required/optional per schema, no new validation surface |
| Decision Guide comparison grid | Low-medium — reusing card markup from `ModelCollapsibleSections` means extracting a shared sub-component or accepting some duplication | Recommend extracting a small shared `ComparisonCard` component now rather than copy-pasting, since you'll have two call sites (Model comparisons, Decision Guide options) |
| `WorkflowStepList` refactor onto `CollapsibleRow` | Medium if attempted — it currently renders `s.tools` badges in the *always-visible* header, which `CollapsibleRow`'s `teaser` slot would need to accommodate | Treat as optional/separate PR, not bundled with the above |

Nothing here breaks routing, search, or rendering for existing (already-complete) pages. Nothing here touches `aens.config.json`, `lib/schemas/*`, or `types/*`.

---

## 11. Windsurf Prompt #1 — Problem Index Sticky Header

```
## Objective
Replace the current sticky search/filter behavior on the Problem Index page with a
3-state, scroll-direction-aware sticky bar that preserves search discoverability
without permanently taxing vertical reading space.

## Root Cause
`app/problem-index/ProblemIndexDashboard.tsx` wraps the search input AND the
navigation/action toolbar in a single `sticky top-14 md:top-16` container. The
search input is always visible and always pinned. Only the toolbar row (chips +
expand/collapse + result count) collapses, via `opacity-0 h-0 overflow-hidden`
once `mainElement.scrollTop > 80`. This means ~60-70px of vertical space is
permanently consumed for the entire remaining scroll length of the page, and the
"collapse" is a blunt opacity fade rather than a real state transition.

## Why the Existing Plan Should Not Be Used As-Is
The two originally proposed options ("hide everything" / "slim sticky search row")
are directionally on the right track but incomplete. "Hide everything" kills
search discoverability on the busiest content-discovery page in the app. "Slim
sticky row" is correct in spirit but needs to be a real 3-state machine, not
just a smaller version of the same static bar — and it should reuse the
direction-aware reveal idiom already established in `StickyActionBar.tsx`
elsewhere in this codebase, rather than inventing a fourth distinct scroll
behavior for the app.

## Files to Inspect
- app/problem-index/ProblemIndexDashboard.tsx (primary target)
- components/shared/StickyActionBar.tsx (reference implementation for
  direction-aware sticky reveal — reuse the scroll-direction detection logic
  and the `#main-scroll` element pattern)
- app/problem-index/page.tsx (confirm how the dashboard is mounted / any layout
  wrapper that affects `#main-scroll` positioning)

## Files to Modify
- app/problem-index/ProblemIndexDashboard.tsx only. No other files should need
  changes. Do not touch lib/data.ts, schemas, or routing.

## Implementation Strategy
Implement three sticky states driven by `mainElement.scrollTop`, read from the
same `#main-scroll` element already used by the existing scroll listener:

1. **Full state** (scrollTop <= ~40px): current full bar — search input +
   full toolbar (chips, expand/collapse, result count) — exactly as it renders
   today at the top of the page.
2. **Compact state** (~40px < scrollTop <= ~200px): toolbar row collapses (keep
   existing opacity/height transition for this part, it works fine), search
   input remains full-width but the sticky container's vertical padding
   shrinks (e.g. `py-3` -> `py-1.5`) to reduce footprint.
3. **Icon-triggered state** (scrollTop > ~200px AND scroll direction is "down"):
   collapse the search input itself into a small icon-only trigger button
   (magnifying glass, ~36-40px square) pinned in a corner of the sticky bar.
   Clicking/tapping it (or pressing '/' or Ctrl+K, which already exist as
   focus shortcuts) expands it back into the full input inline, auto-focused.
   If the user scrolls back up past the threshold, or scroll direction becomes
   "up", automatically return to the compact or full state (mirror the
   direction-aware show/hide logic in StickyActionBar's `updateState` function
   — direction detection via comparing current scrollTop to `lastScrollY`).

Preserve ALL existing behavior that isn't part of this 3-state visual change:
debounced search-to-URL sync, the '/' and Ctrl+K keyboard shortcuts, the
IntersectionObserver category highlighting, expand/collapse-all, and the
localStorage persistence of collapsed categories.

Do not introduce a new global scroll listener — extend the existing one inside
the current `useEffect` that already listens on `#main-scroll`.

## Performance Considerations
- Continue using `{ passive: true }` on the scroll listener (already present).
- Do not add additional IntersectionObservers; derive all three states from
  the existing scrollTop-based effect to avoid duplicate scroll listeners.
- The icon-trigger expand/collapse transition should be a CSS transition on
  width/opacity, not a re-mount of the input (re-mounting would lose focus/
  cursor state and re-trigger the debounce timer unnecessarily).

## Accessibility Requirements
- The icon-only trigger button must have `aria-label="Open search"` (or
  similar) since it has no visible text.
- Focus must move into the input automatically when it expands from the
  icon-triggered state (reuse `searchInputRef.current?.focus()`, already
  imported).
- Keep the existing '/' and Ctrl+K shortcuts working from ALL three states,
  including icon-triggered (pressing '/' while collapsed should both expand
  AND focus the input, not just focus a hidden input).
- Do not use `tabIndex={-1}` tricks that break screen reader navigation order
  when the toolbar is collapsed — the existing code already applies
  `tabIndex={isFilterCollapsed ? -1 : undefined}` to the collapsed toolbar
  buttons; keep this pattern but extend it consistently to whatever's hidden
  in the icon-triggered state.

## Edge Cases
- User has JavaScript-disabled category collapse state in localStorage from
  before this change — must not break parsing (existing try/catch around
  localStorage read already handles this).
- User pastes a `?q=` URL param and lands mid-scroll (e.g. via anchor link) —
  initial state must be computed correctly from `mainElement.scrollTop` on
  mount, not always default to "full state".
- Very narrow viewports (360px and below) — verify the icon-trigger button
  doesn't overlap or crowd the "Ctrl K" kbd hint that currently renders inside
  the input on desktop-width (already conditionally hidden via
  `hidden sm:inline-flex`, confirm this still holds in compact state).
- Rapid scroll (fling gestures on mobile/trackpad) — ensure state transitions
  don't visibly flicker between compact and icon-triggered on fast scroll;
  consider a small debounce (~50-100ms) specifically on the state transition,
  not on the scroll listener itself.

## Acceptance Criteria
- [ ] At page top, full bar renders exactly as today (no visual regression).
- [ ] Between ~40-200px scroll, toolbar is hidden, search bar visible but
      more compact (reduced vertical padding).
- [ ] Past ~200px scroll while scrolling down, search collapses to an icon
      trigger; scrolling up re-expands it (or returns to compact state).
- [ ] Clicking/tapping the icon trigger expands and auto-focuses the search
      input.
- [ ] '/' and Ctrl+K work identically in all three states.
- [ ] No new scroll listeners added; existing debounce/URL-sync/
      IntersectionObserver logic unchanged.
- [ ] No layout shift/reflow jank measurable via Chrome DevTools Performance
      panel during scroll.

## Regression Checklist
- [ ] Search-to-URL query param sync still works (`?q=` updates on type,
      debounced).
- [ ] Category jump chips still scroll to the right section when clicked.
- [ ] Expand All / Collapse All still work and persist to localStorage.
- [ ] IntersectionObserver-driven active-category chip highlighting still
      works while scrolling.
- [ ] Empty-state ("No matches found") rendering unaffected.
- [ ] No hydration mismatch warnings introduced (this is a client component,
      but verify SSR/CSR initial scrollTop assumption is safe — scrollTop is
      always 0 on first paint, so initial state must always be "full" on
      server-rendered/hydrated output, only transitioning client-side after
      mount).
```

---

## 12. Windsurf Prompt #2 — Cross-Resource Learning/Task Architecture

```
## Objective
Bring Pattern, Principle, Decision Guide, and Debug Guide detail pages up to
parity with Model/Package/Workflow/Cheatsheet: full ContentPageLayout shell,
full rendering of existing schema fields, and — only where the underlying data
is genuinely task/step-shaped (Debug Guide solutions) — reuse of the existing
CollapsibleRow primitive. Do NOT add any new schema fields.

## Root Cause
These four pages are incomplete stubs. Confirmed by direct inspection:
- app/patterns/[id]/page.tsx renders only `concept` + `applicability`;
  `anti_patterns`, `implementation_notes`, `examples`, and all
  `related_*` cross-references defined in lib/schemas/pattern.ts are
  never rendered.
- app/principles/[id]/page.tsx renders only `statement` + `intuition`;
  `mathematical_formulation`, `implications`, `limitations`,
  `related_concepts`, `referenced_by_*` are never rendered.
- app/decision-guides/[id]/page.tsx renders only `problem` + a flat
  `<li>` of `option.name`/`option.best_for`; `evaluation_criteria`,
  `strengths`, `weaknesses`, `avoid_when`, `comparison_table`,
  `recommendations`, `use_cases` are never rendered.
- app/debug-guides/[id]/page.tsx renders only `symptoms`;
  `root_causes`, `diagnosis`, `solutions` (which include `steps` and
  `verification` — genuinely task-shaped data), and `prevention` are
  never rendered.
None of these four pages use ContentPageLayout, MetadataBadges, or
RelatedContent, unlike every other content type in the app.

## Why the Existing Plan Should Not Be Used
The existing plan proposes adding a generic `tasks` field to these schemas.
Rejected because: (1) Debug Guide's `solutions[].steps` is ALREADY
task-shaped data sitting unrendered — no new field needed, just a renderer.
(2) Pattern's `anti_patterns`/`examples` and Principle's
`implications`/`limitations` are flat string arrays, not task-shaped
(no title+body pairs) — forcing them into a "Task List" UI would
misrepresent the content type and require content authors to duplicate
data into a redundant new field, which is a content-modeling anti-pattern
(fails the "does it require manual synchronization" test). (3) Decision
Guide's `options` are a comparison matrix, which already has an established
UI pattern in this codebase (ModelCollapsibleSections' "Comparison with X"
cards) that should be reused, not reinvented as a task list.
The correct fix is entirely at the rendering layer: build out full page
bodies against fields that already exist and already validate under the
current Zod schemas. Zero schema changes, zero Architecture Freeze exception
needed.

## Files to Inspect
- lib/schemas/pattern.ts, principle.ts, decision-guide.ts, debug-guide.ts,
  base.ts (confirm exact field shapes before writing render code)
- components/shared/ContentPageLayout.tsx, MetadataBadges.tsx,
  RelatedContent.tsx, CollapsibleRow.tsx, ExpandableText.tsx (shared
  primitives to reuse)
- components/shared/ModelCollapsibleSections.tsx (reference for the
  "Comparison with X" card markup to extract/reuse for Decision Guide
  options, and for the general CollapsibleRow usage pattern)
- app/workflows/[id]/page.tsx (closest existing structural analog: has
  sequential steps + failure points + evaluation checklist + related
  content — use as the template for page structure/TOC conventions)
- app/models/[category]/[id]/page.tsx (reference for ContentPageLayout +
  MetadataBadges + toc array construction pattern)
- lib/data.ts (confirm getPattern/getPrinciple/getDecisionGuide/
  getDebugGuide and getRelatedContent signatures before wiring pages)
- data/patterns/, data/principles/, data/decision-guides/, data/debug-guides/
  (spot-check a few existing JSON files to confirm how much real content is
  already authored into the currently-unrendered fields, before estimating
  page-body scope)

## Files to Modify
- app/patterns/[id]/page.tsx (full rebuild)
- app/principles/[id]/page.tsx (full rebuild)
- app/decision-guides/[id]/page.tsx (full rebuild)
- app/debug-guides/[id]/page.tsx (full rebuild)
- New: components/shared/DebugSolutionList.tsx (Debug Guide solutions,
  built on CollapsibleRow — genuinely task-shaped: title = `solution`,
  body = numbered `steps` + `verification`)
- New: components/shared/DecisionOptionGrid.tsx (Decision Guide options,
  card-grid layout matching ModelCollapsibleSections' comparison cards;
  consider extracting a shared ComparisonCard sub-component if the Model
  comparisons markup can be reused directly rather than duplicated)
- Do NOT modify any file under lib/schemas/, types/, or aens.config.json.

## Implementation Strategy
For each of the four pages, follow the Workflow page as the structural
template:
1. Wrap in ContentPageLayout with breadcrumbs (Home > [Type Index] > [Title])
   and a toc array covering every major section that will be rendered.
2. Add a header section with MetadataBadges (reuse the same props pattern as
   Workflow/Model — updatedAt, category, etc., adapted per content type's
   actual base fields).
3. Render every currently-dead schema field:
   - Pattern: concept, applicability (keep existing), then add
     implementation_notes (prose block), examples (simple list, NOT
     CollapsibleRow), anti_patterns (list styled as a warning callout,
     visually similar to Workflow's "Common Failure Points" block), and
     related_workflows/models/packages/principles (reuse RelatedContent
     component, resolving via getRelatedContent if it supports pattern type,
     else simple linked chip list matching ModelCollapsibleSections'
     "Also Worth Knowing" chip style).
   - Principle: statement, intuition (keep), add
     mathematical_formulation (rendered as a distinct math/code-styled
     block, NOT prose — check if a KaTeX/math renderer already exists in
     the codebase before adding one; if none exists, render as monospace
     block only, do not introduce a new math-rendering dependency without
     flagging it separately), implications (list), limitations (list,
     styled as a caution callout), related_concepts and referenced_by_*
     (chip lists).
   - Decision Guide: problem (keep), evaluation_criteria (small table or
     chip list showing criterion + weight), then replace the flat <li>
     options list with the new DecisionOptionGrid component (one card per
     option: strengths/weaknesses/best_for/avoid_when, matching
     ModelCollapsibleSections' 3-column comparison card layout),
     comparison_table (render as an actual <table> if present — it's a
     Record<string,string>, so render as a simple 2-column key/value
     table), recommendations (prose block), use_cases (chip list),
     related_workflows/packages/models (RelatedContent).
   - Debug Guide: symptoms (keep, but render `description` too if present,
     currently dropped), root_causes (list with probability badge:
     high/medium/low, styled like Model's hyperparameter priority chips),
     diagnosis (numbered list: test / expected_result / how_to_perform),
     solutions (use the new DebugSolutionList/CollapsibleRow-based
     component — this is the one place a "Task List"-equivalent pattern is
     actually warranted), prevention (list: prevention statement +
     practices sub-list), related_packages/workflows/patterns/models/
     registry (RelatedContent).
4. Add ReadingSessionTracker to each page, matching the pattern already used
   on Model/Workflow pages, for consistency with existing analytics/reading-
   progress tracking.

Do not invent a "tasks" schema field anywhere in this work. Every field
rendered must already exist in the corresponding lib/schemas/*.ts file.

## Performance Considerations
- These are statically generated pages (generateStaticParams already exists
  on all four) — no new runtime data fetching, all rendering is build-time.
  No performance risk from this change beyond normal bundle size from new
  small components.
- DebugSolutionList and DecisionOptionGrid should be lightweight; avoid
  pulling in ModelCollapsibleSections wholesale — extract just the specific
  card markup needed rather than importing the whole component.
- If a comparison_table is large, render as a scrollable table on mobile
  (overflow-x-auto wrapper) rather than letting it break layout.

## Accessibility Requirements
- All new collapsible sections must carry `aria-expanded` and
  `aria-controls`, matching the existing CollapsibleRow implementation
  (already handles this — just ensure it's not bypassed).
- Comparison tables (Decision Guide comparison_table) must use proper
  `<table>`/`<th>`/`<td>` semantics, not div-based fake tables, for screen
  reader support.
- Priority/probability badges (Debug Guide root_causes) must not rely on
  color alone — include the text label (already the pattern used for
  hyperparameter tuning priority in ModelCollapsibleSections, reuse that
  convention).

## Edge Cases
- Optional fields that may be genuinely absent (e.g. Pattern's
  implementation_notes is `.optional()`, Principle's
  mathematical_formulation is `.optional()`, Decision Guide's
  comparison_table is `.optional()`) — every new section must conditionally
  render only when the field is present/non-empty, following the existing
  `{workflow.evaluation_checks && workflow.evaluation_checks.length > 0 && (...)}`
  pattern already used throughout the codebase.
- Decision Guide's `related_model_subcategory` optional field already has a
  "Compare Models" link built for it elsewhere (seen in
  ProblemIndexDashboard.tsx's decision guide card rendering) — reuse that
  same link pattern on the Decision Guide detail page itself if not already
  present.
- Debug Guide symptoms have an optional `description` field currently
  dropped entirely (only `symptom` string is rendered) — must render both
  when description is present.
- Existing content JSON files with these fields entirely empty (default
  `[]` for arrays) should not render empty section headers — check
  `.length > 0` before rendering each block, not just field presence.

## Acceptance Criteria
- [ ] All four pages use ContentPageLayout with breadcrumbs + TOC.
- [ ] Every non-optional and populated-optional schema field for each of
      the four content types is rendered somewhere on its detail page.
- [ ] Debug Guide solutions render via the new CollapsibleRow-based
      DebugSolutionList, matching the visual/interaction language of
      PackageTaskList and CheatsheetEntry.
- [ ] Decision Guide options render via the new DecisionOptionGrid,
      matching the visual language of ModelCollapsibleSections' comparison
      cards.
- [ ] Pattern and Principle pages render their list fields as plain
      progressive-disclosure content, NOT as CollapsibleRow/"task list" UI.
- [ ] Zero changes to any file under lib/schemas/, types/, or
      aens.config.json.
- [ ] All four pages pass existing prebuild validation (Zod schema
      validation untouched, since no schema changed).
- [ ] RelatedContent renders correctly for all four types where
      getRelatedContent supports them (verify support in lib/data.ts;
      extend if needed, but only the data-fetching function, not the
      schema).

## Regression Checklist
- [ ] generateStaticParams still produces the same set of static params for
      all four routes (no routes added/removed).
- [ ] Existing links INTO these pages from ProblemIndexDashboard.tsx
      (decision guide cards, workflow cross-links) still resolve correctly.
- [ ] Existing links from Model pages' relatedknowledge sections
      (related_principles, related_patterns, related_guides, etc.) still
      point to valid, now-fully-rendered pages instead of the old stubs.
- [ ] No search index breakage — verify lib/search.ts / search-types.ts
      don't reference these pages' old rendering assumptions.
- [ ] No visual/layout regression on Model/Package/Workflow/Cheatsheet pages
      (none of their files are touched, but re-verify after the shared
      ComparisonCard extraction, if done, that Model's own comparisons
      section still renders identically).
```

---

## 13. Final Recommended Implementation Order

1. **Windsurf Prompt #1 (Problem Index sticky header)** first — fully isolated, one file, zero dependency on anything else, immediate UX win, safest possible change to ship and verify in isolation.
2. **Audit existing content JSON** for Pattern/Principle/Decision Guide/Debug Guide (the "spot-check" step embedded in Prompt #2's "Files to Inspect") — do this *before* writing render code, since it tells you whether you're building UI for empty fields or unlocking a backlog of stranded content. This changes nothing about the plan, but it changes your time estimate.
3. **Debug Guide page rebuild** (within Prompt #2) — do this one first among the four stub pages, since it's the one genuine "Task List"-equivalent case and validates the `DebugSolutionList`/`CollapsibleRow` reuse pattern before you apply the same shell to the other three.
4. **Decision Guide page rebuild** — second, since `DecisionOptionGrid` benefits from having just built and tested one new shared component pattern in step 3.
5. **Pattern and Principle page rebuilds** — last, and can be done in parallel with each other since they're the simplest (plain progressive-disclosure content, no new interactive component needed).
6. **Optional cleanup**: `WorkflowStepList` refactor onto `CollapsibleRow` — do this only after everything above ships and is stable, as its own isolated PR, since it touches an already-working, already-shipped page and carries the highest risk of subtle regression (header content differs from other CollapsibleRow use sites — tools badges are always-visible, not just in the teaser).

No step in this order requires an Architecture Freeze exception. If you want to revisit that constraint later (e.g. if content modeling genuinely evolves to need task-shaped data for Pattern/Principle down the line), that's a real future ADR — but it isn't today's problem, and the plan you were handed was about to spend that exception on a problem that doesn't need it.
