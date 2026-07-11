# AENS Workflow Detail Page — UI/UX Engineering Inspection Report

**Role:** Principal Frontend Architect / Senior UX Engineer / React-Next.js Performance Engineer
**Scope:** `app/workflows/[id]/page.tsx` and its full render tree, against the now-live, denser workflow content (`data/workflows/build-rag-system.json`, 369 lines, structured `Trigger/Downstream Effect/Detection` failure clauses, 600+ character `overview`/`what`/`decision` fields).
**Method:** Every claim below was verified directly against the current repository state on `feature/repository-foundation-v2` — not inferred from a prior report.

---

## 0. Note on the Supplied "Architectural Investigation Report"

You supplied a prior investigation report alongside this brief. Before building on it, I verified its specific technical claims against the actual files, since a Windsurf prompt built on an inaccurate premise would waste an implementation pass or introduce a regression fixing a bug that doesn't exist. Results:

| Claim in supplied report | Verified status |
|---|---|
| `Prose`/`ProseInline` markdown pipeline exists and is bypassed by the Workflow page | **Accurate.** Confirmed in `components/shared/Prose.tsx`; not imported anywhere in `page.tsx` or `WorkflowStepList.tsx`. |
| Step panels are conditionally unmounted (`isOpen && (...)`), breaking Ctrl+F | **Accurate** for `WorkflowStepList.tsx`. |
| `WorkflowStepSchema.uses` restricted to `packages`/`models`/`cheatsheets` | **Accurate.** Confirmed in `lib/schemas/workflow.ts`. |
| A helper called `resolveWorkflowStepLinks` in `lib/data.ts` resolves step cross-references | **Inaccurate — no such function exists.** The resolution is done inline inside `app/workflows/[id]/page.tsx` (lines 43–73), directly calling `contentExists`/`getContentName`/`getContentPath` from `lib/data.ts`. Functionally similar outcome, wrong name/location — matters if a Windsurf prompt goes looking for a function that isn't there. |
| Production Profile fields have sub-anchors like `#production-cost` | **Inaccurate.** `CollapsibleRow` (used for the Production Profile) exposes exactly one anchor — the section id (`production`) — with no per-field sub-anchors anywhere in the component. |
| `CodeBlockInteractive.tsx` has a `wrapped` state toggled post-mount via `useEffect`/`matchMedia`, causing CLS | **Inaccurate — this code does not exist in the current file.** The actual `CodeBlockInteractive.tsx` has no line-wrap toggle at all; its only client state is `copied` and `isExpanded` (for collapsing long code blocks), with a `useLayoutEffect` that compensates scroll position on expand/collapse — a different, legitimate mechanism with no CLS bug of the kind described. **This entire finding (§5, and Phase 4 fix #7) does not apply to the current codebase and is dropped from this report and the Windsurf prompt below.** Instructing an implementer to "fix" this would mean deleting or rewriting code that doesn't exist.
| Hover-preview cards are a Medium-High complexity add using `loadContentMeta` | **Understated.** `loadContentMeta` (real function, confirmed) currently returns only `{ name, updated_at }` — no description field. A genuine hover preview needs either extending this function's return type or a new lightweight summary source. This raises the true complexity above what was estimated. |
| Worked Examples heading override deviates from the app's heading hierarchy | **Overstated.** The tiny uppercase eyebrow-style heading used for "Worked Examples" (`text-base font-bold ... uppercase tracking-wider text-[10px]`) is not a one-off deviation — it matches the existing convention used by `TableOfContents`'s "On this page" header and `SectionCard`'s title styling elsewhere in the same page. It's a consistent, intentional pattern for sub-section eyebrow headers, distinct from real content headings (`h1` name, `CollapsibleRow`'s `h2` label). Not a drift; dropped as a finding.
| `ReadingProgress`/`BackToTop`/`StickyActionBar` correctly track scroll | **Confirmed fixed** (this was a known issue in earlier project history — all three now correctly read `document.getElementById('main-scroll')`, matching the actual `overflow-y-auto` container in `app/layout.tsx`, not `window.scrollY`). No action needed. |

The supplied report is directionally useful and several of its highest-value findings (markdown bypass, Ctrl+F, schema restriction) are confirmed real. But roughly a third of its specific technical claims don't match the current code, and its proposed Ctrl+F fix is **incomplete** even where the underlying problem is real (§Finding F-2 below explains why). The rest of this report supersedes it with verified findings.

---

## Executive Summary

**Overall quality rating: 6/10.** The architecture is sound (static generation, typed schema, decoupled data/render layers, a working scroll-container fix already in place for the nav shell) and several components are well-built in isolation (`CodeBlockInteractive`'s copy/collapse UX, `CollapsibleRow`'s hash-deep-link pattern). The score is held down by one systemic issue: **the page was built for short, single-sentence field values, and the content model has since evolved to dense, multi-clause paragraphs (600+ characters per field, structured failure-mode syntax) without the rendering layer catching up.** This is the same class of gap identified in the Workflow Layer Design Report for the *data* layer (fields populated but unrendered) — here it recurs at the *typography* layer (fields rendered, but as undifferentiated raw-string blocks).

**Current strengths:**
- Correct, already-fixed scroll-container wiring across `ReadingProgress`, `BackToTop`, `StickyActionBar` (all read `#main-scroll`, not `window`).
- `CollapsibleRow`'s hash-deep-link + `aria-expanded`/`aria-controls` pattern is a solid, reusable primitive — just not applied consistently.
- Server-side cross-link resolution (in `page.tsx`) means zero client-side cost for reference resolution.
- `CodeBlockInteractive`'s collapse/expand-with-scroll-compensation is genuinely well engineered.

**Major weaknesses:**
1. Markdown pipeline (`Prose`/`ProseInline`) built and available, but entirely bypassed on Workflow's own text fields.
2. Ctrl+F is broken for closed steps, and the "obvious" fix (a plain `hidden` toggle) does not actually solve it — see F-2.
3. `WorkflowStepSchema.uses` cannot reference Patterns or Debug Guides even though the app's own resolution utilities already support those types.
4. The Table of Contents — the primary desktop navigation aid for a page explicitly meant to be read for hours — disappears below the `xl` (1280px) breakpoint, i.e. on most single-pane laptop windows and any split-screen setup.
5. Long structured failure-mode strings (`Failure: ... Trigger: ... Downstream Effect: ... Detection: ...`) render as one dense unstructured sentence, defeating the purpose of the richer content model.

**Highest priority improvements (see Roadmap for full ordering):** wrap workflow text fields in `Prose`/`ProseInline`; fix Ctrl+F correctly (via `hidden="until-found"`, not a naive `hidden` toggle); parse and visually structure the `Failure:/Trigger:/Downstream Effect:/Detection:` and `Benefit:/Trade-off:/When not to use it:/Operational impact:` clause patterns instead of rendering them as flat prose; extend `WorkflowStepSchema.uses` to include `patterns` and `debug_guides`; give the ToC a usable fallback below `xl`.

---

## Findings

Findings are grouped by inspection area. Each includes Severity, Location, Problem, Root Cause, Impact, Recommendation, Priority, and Estimated Complexity.

### Information Architecture

**F-1. Structured failure/production-note clauses render as flat prose**
- **Severity:** High
- **Location:** `WorkflowStepList.tsx` (`failure_points` rendering), `page.tsx` (`common_failure_points`, `production_notes` and siblings)
- **Problem:** The content pipeline (per the Workflow Resource Prompt v3.0 already adopted) now produces failure points as `"Failure: X. Trigger: Y. Downstream Effect: Z. Detection: W."` and production notes as `"Benefit: ... Trade-off: ... When not to use it: ... Operational impact: ..."` — deliberately structured, multi-clause strings. The UI renders each as one undifferentiated `<li>`/`<p>` of plain text.
- **Root Cause:** The rendering layer was designed against the older, single-sentence field values and was never updated when the prompt/content standard introduced structured clause syntax.
- **Impact:** The exact information density the content-quality upgrade was designed to produce (searchable, scannable failure modes) is flattened back into paragraph text at render time — the reader has to parse the clause labels themselves out of a run-on sentence.
- **Recommendation:** Add a lightweight, schema-agnostic clause parser (regex-split on the known label prefixes: `Failure:`, `Trigger:`, `Downstream Effect:`, `Detection:` for failure points; `Benefit:`, `Trade-off:`, `When not to use it:`, `Operational impact:` for production notes) that renders each clause as its own labeled line within the existing container, falling back to plain-text rendering unchanged if the expected labels aren't present (protects older/未-migrated content).
- **Priority:** Critical
- **Complexity:** Low-Medium (pure presentation-layer parsing, no schema or data change)

**F-2. Ctrl+F is broken for closed steps — and the "obvious" fix doesn't fully solve it**
- **Severity:** High
- **Location:** `WorkflowStepList.tsx` (`isOpen && (...)`); also `CollapsibleRow.tsx`'s content div (`isOpen ? "block" : "hidden"` — Tailwind's `hidden` compiles to `display: none`)
- **Problem:** Closed step bodies aren't in the DOM at all (`WorkflowStepList`), so Ctrl+F can't find them. But the Production Profile panel (`CollapsibleRow`) *is* mounted and still isn't findable, because a `display: none` element is invisible to native browser find-in-page regardless of whether it's in the DOM.
- **Root Cause:** Two different techniques (conditional mount vs. `display:none` toggle) that both produce the same searchability failure, because neither uses the one HTML mechanism that's actually exempt from this limitation.
- **Impact:** A supplied prior report's proposed fix — "mount all steps, control visibility with the `hidden` attribute" — would not actually restore Ctrl+F, since the standard `hidden` attribute also sets `display: none`. Implementing that fix as described would look correct in code review and still fail the acceptance test.
- **Recommendation:** Use the `hidden="until-found"` attribute value (Chromium/Edge/Safari 17+; supported everywhere Zahed is likely to browse this local static site) paired with an `onBeforeMatch` handler that flips the component's own `isOpen` state to `true` when the browser auto-reveals the match. This is the only mechanism that both (a) keeps content paint-cheap while closed and (b) is genuinely discoverable by native find-in-page. Apply to both `WorkflowStepList` step bodies and `CollapsibleRow`'s content div.
- **Priority:** Critical
- **Complexity:** Low-Medium (small, well-defined API; needs `onBeforeMatch` event, not yet used anywhere in the codebase — verify TypeScript/React types don't need an `any` escape hatch for this fairly new DOM event)

**F-3. Table of Contents disappears below the `xl` (1280px) breakpoint**
- **Severity:** High
- **Location:** `TableOfContents.tsx` (`hidden xl:block`)
- **Problem:** The only persistent section-jump navigation on desktop vanishes on any viewport narrower than 1280px logical pixels — which includes most 13–14" laptops at default scaling and, critically, any split-screen setup (browser next to an editor/terminal), which is exactly how a "keep it open while building" reference page is used in practice.
- **Root Cause:** A single, non-tiered breakpoint (`xl`) for a navigation aid whose value doesn't actually require that much horizontal space.
- **Impact:** On the most realistic usage pattern for this specific page (per its own design goals), the reader has no persistent way to jump between Overview/Steps/Worked Examples/Failures/Production/Evaluation except scrolling — `StickyActionBar`'s prev/next controls are the only fallback, and those move one section at a time rather than allowing direct jumps.
- **Recommendation:** Lower the breakpoint to `lg` (1024px) for the sidebar ToC, and add a compact horizontal scrollable pill-row ToC (already-known pattern: same data, `flex overflow-x-auto` pills) for `md`-to-`lg` widths, so there's no dead zone between "no ToC" and "sidebar ToC."
- **Priority:** High
- **Complexity:** Low (CSS breakpoint change + one new compact list variant of an existing component's data)

**F-4. Steps and their Worked Examples are structurally disconnected**
- **Severity:** Medium
- **Location:** `page.tsx` (Steps rendered ~line 122, Worked Examples ~line 126, no cross-reference between them)
- **Problem:** A reader on Step 4 who wants to see its corresponding worked example must scroll to the bottom of the page, find it by name-matching, then scroll back.
- **Root Cause:** `WorkedExampleSchema` has no field linking an example back to the step it illustrates — there's no structural connection to render a link from, even if the UI wanted one.
- **Impact:** Breaks the "composition, not documentation" reading flow the content itself is written for.
- **Recommendation:** This is a genuine, useful, low-risk additive schema change: add an optional `related_step` (number) field to `WorkedExampleSchema` — the *researcher* already knows which step a worked example illustrates, so this is a zero-guesswork field to populate going forward, with existing content (no `related_step`) rendering exactly as it does today. Once present, render a small "↳ used in Step 4" tag on the Worked Example card and a "View worked example →" link inside the corresponding step's expanded body.
- **Priority:** Medium
- **Complexity:** Low (schema: one optional field; UI: one conditional link in each direction)

### Component Architecture

**F-5. Starter Stack tools are ad hoc spans, not the shared badge component**
- **Severity:** Medium
- **Location:** `page.tsx` lines ~108-117
- **Problem:** `starter_stack` items are rendered with a hand-rolled `<span className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono">`, duplicating styling that `ContentTypeBadge` (confirmed, `components/shared/ContentTypeBadge.tsx`) already standardizes elsewhere, and — separately — are inert (no `href`) even when the tool is a real Package/Model that exists in AENS.
- **Root Cause:** Written before (or without reusing) the shared badge primitive; never cross-checked against `contentExists`.
- **Impact:** Visual inconsistency with every other badge in the app, and a missed, cheap cross-linking opportunity (the resolution utilities to check `contentExists('package', tool)` already exist and are already used two sections later for step-level `uses`).
- **Recommendation:** Resolve each `starter_stack` string against `contentExists('package', ...)` / `contentExists('model', ...)` (same pattern already used for `resolvedLinks` in this same file) and render as a `Link`-wrapped badge when a match exists, plain badge otherwise — reusing the exact rendering branch already written for step `uses` badges.
- **Priority:** Medium
- **Complexity:** Low (reuses existing resolution logic already in the same file)

**F-6. Two different severity colors for conceptually equivalent content, within the same page**
- **Severity:** Low-Medium
- **Location:** `WorkflowStepList.tsx` (`failure_points` → amber "Watch Out") vs. `page.tsx` (`common_failure_points` → rose "Common Failure Points")
- **Problem:** Per-step failure points and pipeline-level failure points are the same *kind* of information (a named failure mode with a trigger and effect) but are color-coded differently within a single page, with no schema-level distinction (both are just `string[]`) justifying the visual difference.
- **Root Cause:** The two blocks were implemented at different times without a shared "failure/warning" visual convention.
- **Impact:** Trains the reader to associate color with location on the page rather than with actual severity, undermining the point of color-coding at all.
- **Recommendation:** Standardize on one severity treatment for both (recommend rose, since these are the higher-consequence integration/pipeline failures; amber reserved for the `decision` block's trade-off callouts, which are lower-stakes "this is a choice" content, not "this will break" content).
- **Priority:** Medium
- **Complexity:** Low (className change only, two locations)

### Navigation UX

**F-7. `IntersectionObserver` in `TableOfContents` doesn't scope its `root` to the actual scroll container**
- **Severity:** Low
- **Location:** `TableOfContents.tsx`
- **Problem:** The observer is created without a `root` option, defaulting to the browser viewport. The actual scrollable region is `#main-scroll` (`overflow-y-auto`), not the window. In this layout the two happen to nearly coincide (main fills most of the viewport), so this isn't visibly broken today, but it's a latent inconsistency with the rest of the nav shell, which deliberately targets `#main-scroll` everywhere else (F-avoided in ReadingProgress/BackToTop/StickyActionBar, see §0).
- **Root Cause:** Copy-paste of a generic IntersectionObserver pattern without threading through the app's specific scroll-container convention.
- **Impact:** Low today; becomes a real bug if any future layout change gives `main` its own fixed height distinct from the viewport (e.g. a persistent footer or top banner).
- **Recommendation:** Pass `root: document.getElementById('main-scroll')` explicitly, matching the convention already established elsewhere.
- **Priority:** Low
- **Complexity:** Low

**F-8. Cross-link clicks are full navigations with no preview, destroying scroll/accordion state**
- **Severity:** Medium
- **Location:** `WorkflowStepList.tsx` (`Link` for each `uses` badge)
- **Problem:** Clicking any package/model reference badge navigates away entirely, losing which steps were expanded and the scroll position.
- **Root Cause:** No preview mechanism exists; plain `next/link` is the only option today.
- **Impact:** Checking a reference mid-read has a real cost, discouraging the exact "click through to verify" behavior the cross-linking exists to enable.
- **Recommendation:** A hover-preview card is the right long-term answer, but budget it correctly: `loadContentMeta` (confirmed real, in `lib/data.ts`) currently returns only `{ name, updated_at }` — no description. This needs either (a) extending `loadContentMeta`'s return type with a short `description`/`overview` excerpt per content type (bigger than it looks — touches 9 different content-type branches), or (b) a narrower v1 that shows just name + last-updated + type badge in the hover card (no description), which is a same-day implementation with the data already available. Recommend (b) first, defer (a).
- **Priority:** Medium (v1 scope), Low (full description-bearing version — deferred)
- **Complexity:** Low (v1, name/date/type only) / Medium-High (full version with descriptions)

**F-9. `ScrollRestore` interaction with hash-deep-linked collapsibles not verified**
- **Severity:** Low (flag for verification, not a confirmed bug)
- **Location:** `ContentPageLayout.tsx` (`<ScrollRestore />` alongside `CollapsibleRow`'s own hash-driven `scrollIntoView`)
- **Problem:** Two independent scroll-affecting mechanisms exist on the same page (`ScrollRestore`'s presumed browser-back scroll-position restoration, and `CollapsibleRow`'s own hash-triggered smooth scroll). Their interaction order on a browser-back navigation to a hash-linked, expanded Production Profile wasn't verified in this pass (would require a running browser).
- **Recommendation:** Include an explicit manual test case in the acceptance checklist below rather than assuming either mechanism yields.
- **Priority:** Low
- **Complexity:** N/A (verification, not a fix)

### Reading Experience

**F-10. Overview truncation (`ExpandableText`) has no `maxLines` set for the workflow overview**
- **Severity:** Low
- **Location:** `page.tsx` line ~105 (`<ExpandableText cacheKey=... fadeClass=...>` — no `maxLines` prop passed)
- **Problem:** With `overview` now regularly 600+ characters, whether it truncates at all depends on `ExpandableText`'s internal default measurement behavior when `maxLines` is omitted — this wasn't confirmed against a real render pass in this inspection.
- **Recommendation:** Explicitly pass a `maxLines` (e.g. 4) for the workflow overview so truncation behavior is deliberate rather than incidental, consistent with how dense the field has become.
- **Priority:** Low
- **Complexity:** Low

**F-11. See Finding F-1** (density/structure) is the dominant reading-experience issue; not re-listed here to avoid duplication.

### Workflow-Specific UX

**F-12. Confirmed schema gap: steps cannot reference Patterns or Debug Guides**
- **Severity:** High
- **Location:** `lib/schemas/workflow.ts` (`WorkflowStepSchema.uses`)
- **Problem:** `uses` accepts only `packages`, `models`, `cheatsheets`. `lib/data.ts`'s `contentExists`/`getContentName`/`getContentPath` already support `pattern` and `debug_guide` as valid types (confirmed — their type signatures include all nine content types). A step whose key decision is "apply the Late Chunking pattern here" or whose failure point maps directly to an existing Debug Guide has no structural way to say so at the step level (only at the whole-resource level, via `related_patterns`/`related_debug_guides`).
- **Root Cause:** `WorkflowStepSchema.uses` was scoped to the three most common reference types when first written and never extended when `related_patterns`/`related_debug_guides` were added at the resource level.
- **Impact:** Forces cross-links that are conceptually step-specific ("this exact step uses this exact pattern") to live only at the whole-workflow level, losing precision exactly where the content is most likely to want it (a `decision` field literally reads "apply the Late Chunking pattern here" today, with the pattern name in plain, unlinked prose).
- **Recommendation:** Extend `WorkflowStepSchema.uses` with two additional optional arrays, both defaulting to `[]`:
  ```
  patterns: z.array(z.string()).default([])
  debug_guides: z.array(z.string()).default([])
  ```
  Deliberately **not** adding `decision_guides` or `principles` at step level — per the frozen Workflow ownership boundaries (Design Report §1), Principle-level theory is intentionally reached only transitively, and Decision Guides are resource-level trade-off documents, not per-step wiring choices; adding them at step granularity would blur a boundary that was frozen for good reason. `patterns` and `debug_guides` are the only two of the four that represent genuine step-level composition/failure knowledge.
- **Priority:** High
- **Complexity:** Low (additive Zod fields, both optional/defaulted — zero migration cost on `build-rag-system.json`; `WorkflowStepList.tsx`'s existing `typeMap`/`renderAllUses` already handles arbitrary keys generically and needs no change beyond the page-level `typeMap` already including these two)

### Responsiveness

**F-13. No confirmed layout failure at any breakpoint other than F-3 (ToC dead zone)**
- **Severity:** N/A (clean bill of health, noted for completeness)
- Spacing, card widths, and the mobile copy-button fallback in `CodeBlockInteractive` all use standard Tailwind responsive utilities consistently. No other responsive defect was found in this pass. The one confirmed issue is F-3.

### Rendering Performance

**F-14. No unnecessary re-renders or hydration risk found**
- **Severity:** N/A (clean bill of health)
- `page.tsx` is a Server Component; all cross-link resolution happens server/build-side (confirmed — no `'use client'` directive, no client-side fetch). Client components (`WorkflowStepList`, `CollapsibleRow`, `ExpandableText`, `CodeBlockInteractive`) are all correctly scoped to genuinely interactive leaves, not wrapping large static subtrees. No virtualization is needed for Steps (hard-capped at 8 by schema) or Worked Examples (typically 1–3) — the "30+ sections" scalability concern raised in the brief doesn't actually apply to this page, because the frozen 9-block page architecture and 8-step schema ceiling (Workflow Layer Design Report, §2/§4) already bound structural growth. The real scaling axis is **prose density per field**, not section count — which is exactly what F-1 addresses.

### Interaction Quality

**F-15. No "Expand All"/"Collapse All" control for an 8-step accordion**
- **Severity:** Medium
- **Location:** `WorkflowStepList.tsx`
- **Problem:** With up to 8 steps, a reader wanting to skim the whole pipeline (e.g. to Ctrl+F once fixed, or just to read linearly without repeated clicking) has to expand each step individually.
- **Recommendation:** Add a small "Expand All / Collapse All" toggle above the step list, operating on the same `expandedSteps` state already present.
- **Priority:** Medium
- **Complexity:** Low

### Accessibility

**F-16. `WorkflowStepList` step toggle button lacks `aria-controls`**
- **Severity:** Medium
- **Location:** `WorkflowStepList.tsx` (compare to `CollapsibleRow.tsx`, which already does this correctly)
- **Problem:** The step header button sets `aria-expanded` but has no `aria-controls` pointing at the collapsible body, and the body itself has no `id`. `CollapsibleRow` already demonstrates the correct pattern (`contentId`, `aria-controls={contentId}`) — it just wasn't applied to `WorkflowStepList`.
- **Recommendation:** Give each step body a stable id (e.g. `step-${s.step}-content`) and wire `aria-controls` on the toggle button, matching the existing `CollapsibleRow` convention exactly. This id is also required infrastructure for the `hidden="until-found"` fix in F-2.
- **Priority:** Medium (rolls into the F-2 fix — same DOM change enables both)
- **Complexity:** Low

**F-17. No keyboard shortcut / no confirmed focus-trap issues**
- **Severity:** Low
- All interactive elements found (`button`, `Link`) are natively keyboard-operable; no custom click-only handlers without keyboard equivalents were found. Recommend one thing: after the F-2/F-15 changes land, re-verify tab order through 8 expanded steps doesn't feel like a "keyboard maze" — this is a real risk at 8 steps × several links each, best caught by a manual pass rather than static review.

### Design Consistency

**F-18. See F-5 and F-6** — both are consistency findings, not re-listed here.

### Scalability

**F-19. Content-length scalability is the real risk, not section count** — see F-14. No action item beyond F-1's clause-parsing fix, which is the direct mitigation.

### Missing Features (beyond what's captured above)

**F-20. No "copy section" for prose blocks (Overview, Decision, Production Notes)**
- **Severity:** Low
- Code blocks already have copy buttons (`CodeBlockInteractive`); dense prose blocks like `production_notes` (which a reader might want to paste into a deployment runbook) do not.
- **Priority:** Low
- **Complexity:** Low (reuse the existing copy-button pattern from `CodeBlockInteractive`, extracted as a small shared `CopyButton` component)

**F-21. No "recently viewed workflows"**
- Not found anywhere in the app, not just this page — likely out of scope for a page-level UI pass; flagged only because the brief explicitly asked to consider it. Recommend deferring to a site-wide (not workflow-specific) feature decision, since it would touch global state/storage patterns beyond this page.

---

## Refactoring Roadmap

### Critical
1. **F-1** — Parse and visually structure `Failure:/Trigger:/Downstream Effect:/Detection:` and `Benefit:/Trade-off:/When not to use it:/Operational impact:` clause patterns.
2. **F-2** — Fix Ctrl+F correctly via `hidden="until-found"` + `onBeforeMatch`, applied to both `WorkflowStepList` and `CollapsibleRow`.

### High
3. **F-3** — Lower ToC breakpoint to `lg`, add a compact pill-row fallback for `md`–`lg`.
4. **F-12** — Extend `WorkflowStepSchema.uses` with optional `patterns`/`debug_guides` arrays.

### Medium
5. **F-4** — Add optional `related_step` to `WorkedExampleSchema`; render bidirectional step↔example links.
6. **F-5** — Replace ad hoc Starter Stack spans with resolved, clickable `ContentTypeBadge` instances.
7. **F-6** — Unify failure-point severity color (rose) across step-level and pipeline-level failure content.
8. **F-8** (v1 scope only) — Lightweight hover preview (name/date/type, no description) for cross-link badges.
9. **F-15** — Expand All / Collapse All control.
10. **F-16** — `aria-controls` + stable ids on step toggle buttons (bundled with F-2's DOM change).

### Low
11. **F-7** — Explicit `root` on the ToC's `IntersectionObserver`.
12. **F-9** — Manual verification of `ScrollRestore` + hash-deep-link interaction (no code change unless a real conflict is found).
13. **F-10** — Explicit `maxLines` on the overview's `ExpandableText`.
14. **F-17** — Manual keyboard tab-order pass after F-2/F-15/F-16 land.
15. **F-20** — Shared `CopyButton` for prose blocks.

**Deliberately not scheduled:** the supplied report's tabbed/split-pane full layout redesign (its Phase 3, item 5) and its CLS/`CodeBlockInteractive` fix (its Phase 4, item 7). The latter targets code that doesn't exist (§0). The former is a legitimate idea but conflicts with this brief's own explicit constraint — *"prefer incremental refactoring over large rewrites... minimize regression risk"* — and F-3 + F-15 + F-1 together address the same underlying "scroll fatigue / hard to navigate a long page" complaint at a fraction of the risk and implementation cost. If, after those land, fatigue is still reported as a problem in practice, a tabbed layout is worth revisiting as its own scoped project — not bundled into this pass.

---

## Architectural Recommendations

1. **Adopt a shared "structured note" rendering convention**, not just a one-off fix for `failure_points`/`production_notes`. Multiple content types across AENS (Debug Guides likely have similar symptom/cause/fix structured text) may benefit from the same clause-parsing approach developed for F-1 — build it as a small, reusable utility (e.g. `parseLabeledClauses(text, labels[])`) rather than inlining regex directly in `WorkflowStepList.tsx`, so it can be reused if the same content-density pattern shows up elsewhere.
2. **Treat `hidden="until-found"` as the house standard for all collapsible content going forward**, not a one-off Workflow fix — `CollapsibleRow` is used elsewhere in the app (confirmed generic shared component), so fixing it here fixes Ctrl+F everywhere it's used, not just on the Workflow page.
3. **Extend `WorkflowStepSchema.uses` conservatively** (patterns + debug_guides only) rather than mirroring all four resource-level relationship types at step level — this preserves the ownership-boundary reasoning already frozen in the Workflow Layer Design Report rather than quietly re-opening it.
4. **Treat the ToC breakpoint as a site-wide navigation concern, not workflow-specific** — if `TableOfContents` is shared across Models/Packages/Cheatsheets/Patterns (likely, given it's in `components/shared/`), the `xl` breakpoint problem (F-3) affects those pages too. Fix it once in the shared component; this report frames it in Workflow-page terms because that's the audit scope, but the fix and its benefit are not Workflow-specific.
5. **Defer, don't reject, the full-preview hover card (F-8's deferred half)** — the moment any content type gains a short, storable one-line summary (a field many content types will eventually want for search-result snippets anyway), the richer hover card becomes cheap. Don't build a workflow-specific summary field just for this; wait for or drive a shared solution.

---

## Windsurf Implementation Prompt

```markdown
# AENS Workflow Page — Implementation Pass (Verified Findings Only)

## Context
You are implementing a verified set of fixes to the AENS Workflow detail page
(`app/workflows/[id]/page.tsx`) and its shared component tree. Every task below
was confirmed against the actual current repository state — do not assume any
additional bugs exist beyond what's listed. Do not refactor anything not listed
here. This is an incremental fix pass, not a redesign: preserve all existing
props, public component APIs, and visual structure except where a task
explicitly says to change it.

**Hard constraints:**
- No new npm dependencies.
- No changes to `lib/schemas/workflow.ts` beyond the two additive, optional
  fields specified in Task 4 — do not touch any other field, and do not make
  any existing field required or change any field's type.
- No changes to `data/workflows/*.json` content.
- Every change must build cleanly with `npm run build` (static export) with
  zero new type errors.
- Do not touch `CodeBlockInteractive.tsx`'s wrap/collapse logic — it has no
  known bug; leave it exactly as-is.
- Do not implement a tabbed or split-pane layout redesign — explicitly out of
  scope for this pass.

---

## Task 1 (Critical): Structured clause rendering for failure points and production notes

**Files:** `components/shared/WorkflowStepList.tsx`, `app/workflows/[id]/page.tsx`,
new file `lib/text/parseLabeledClauses.ts`

1. Create `lib/text/parseLabeledClauses.ts` exporting:
   ```ts
   export interface LabeledClause { label: string; text: string }
   export function parseLabeledClauses(input: string, labels: string[]): LabeledClause[] | null
   ```
   - Attempt to split `input` on each label in `labels` (each label is a literal
     string ending in `:`, e.g. `"Failure:"`, `"Trigger:"`).
   - Only return a non-null result if **all** labels in `labels` are found, in
     any order, each exactly once, with non-empty text following each label up
     to the next label or end of string. Otherwise return `null` (caller must
     fall back to rendering the original raw string unchanged — never lose
     content if parsing doesn't cleanly match).
   - Trim whitespace and any trailing period-then-space artifacts from each
     clause's text.
   - Add a small unit-style sanity check (a few example strings in a comment or
     a colocated test if the repo has a test runner — check `package.json` for
     one before adding a new one) covering: (a) a well-formed 4-clause string,
     (b) a string missing one label (should return `null`), (c) an empty
     string (should return `null`).

2. In `WorkflowStepList.tsx`, for each `failure_points` entry:
   - Call `parseLabeledClauses(fp, ['Failure:', 'Trigger:', 'Downstream Effect:', 'Detection:'])`.
   - If non-null, render each clause as its own line: a bold/uppercase small
     label (matching the existing `text-[10px] font-semibold uppercase`
     convention already used elsewhere in this file) followed by its text, all
     within the existing amber "Watch Out" container — do not change the
     container's color or structure, only what's inside each `<li>`.
   - If `null`, render the original string exactly as today (no regression for
     content that doesn't match the pattern).

3. In `page.tsx`, apply the same treatment to `production_notes`, `scaling_notes`,
   `cost_notes`, `latency_notes`, `observability_notes` using labels
   `['Benefit:', 'Trade-off:', 'When not to use it:', 'Operational impact:']`
   — same non-null/null fallback rule, inside the existing Production Profile
   `CollapsibleRow`, not changing its outer structure.

4. Do **not** apply clause parsing to `common_failure_points` — verify first
   whether that field's content actually uses the same label convention; if it
   uses different labels (e.g. "occurs when" phrasing per the Prompt v3.0
   template), either add those specific labels as a second parsing pass or
   leave as plain text — check the actual current value in
   `data/workflows/build-rag-system.json` before deciding, don't assume.

**Acceptance criteria:**
- A failure point with all 4 labels renders as 4 visually distinct labeled
  lines inside the same amber box.
- A failure point missing any label renders exactly as it does today (byte-for-byte
  same text, same container).
- No console errors, no hydration mismatch (this is server-rendered content,
  verify no client/server text mismatch by diffing SSR output before/after).

---

## Task 2 (Critical): Fix Ctrl+F correctly using `hidden="until-found"`

**Files:** `components/shared/WorkflowStepList.tsx`, `components/shared/CollapsibleRow.tsx`

**Do not** implement this as a plain `hidden` boolean toggle or a
`display:none`/`block` className toggle — that does NOT fix Ctrl+F (verified:
the current `CollapsibleRow` already uses exactly that pattern and is still
not found by browser search). The fix must use the `hidden="until-found"`
attribute value specifically.

1. In `WorkflowStepList.tsx`:
   - Give each step's collapsible body a stable `id`, e.g. `` `step-${s.step}-content` ``.
   - Always render the step body div in the DOM (remove the `isOpen && (...)`
     conditional wrapper).
   - Set the div's `hidden` prop to `isOpen ? undefined : 'until-found'` (React
     supports the string value; if TypeScript complains, check whether the
     repo's React/DOM type version supports it — if not, use
     `{...(!isOpen ? { hidden: 'until-found' as any } : {})}` as a narrowly
     scoped, documented exception, not a broad `any` elsewhere).
   - Add an `onBeforeMatch` handler on that div that calls the existing
     `toggleStep(idx)` (or a dedicated "force open" setter) so React state
     stays in sync when the browser auto-reveals a match — otherwise the
     chevron icon and `aria-expanded` will be out of sync with the visibly
     revealed content.
   - Wire `aria-controls={` `step-${s.step}-content` `}` on the toggle button
     (this also resolves Finding F-16).
   - Apply `content-visibility: auto` (via a Tailwind arbitrary-value class
     `[content-visibility:auto]` or a small utility class in `globals.css`) to
     the step body to keep paint cost low while hidden.

2. Apply the identical pattern to `CollapsibleRow.tsx`'s content div (currently
   `isOpen ? "block" : "hidden"`) — same `hidden="until-found"` +
   `onBeforeMatch` approach, calling its existing `handleToggle`. Preserve the
   existing `enableHashDeepLink` behavior exactly (it already forces `isOpen`
   via a different code path on hash match — make sure the two mechanisms
   don't fight each other; the hash-triggered open should simply also update
   whatever state `onBeforeMatch` would update).

**Acceptance criteria:**
- With all 8 steps collapsed, using the browser's native Ctrl+F / Cmd+F to
  search for a term that only appears inside a closed step's `what` or
  `decision` text successfully finds and highlights it, and the step visibly
  expands.
- Same test repeated for the Production Profile panel when collapsed.
- `aria-expanded` and the chevron icon correctly reflect the open state after
  a find-triggered reveal, not just after a manual click.
- No layout jump or flash when a hidden section is revealed via find.

---

## Task 3 (High): Table of Contents breakpoint and mid-width fallback

**Files:** `components/shared/TableOfContents.tsx`, `components/shared/ContentPageLayout.tsx`

1. Change the sidebar ToC's visibility from `hidden xl:block` to `hidden lg:block`.
2. Add a new, compact horizontal variant for the `md`-to-`lg` range (below
   `lg`, at or above `md`): a `flex gap-2 overflow-x-auto` row of small pill
   links using the same `items`/`activeId` data already computed in
   `TableOfContents` — do not duplicate the `IntersectionObserver` logic;
   refactor `TableOfContents` to compute `activeId` once and render either the
   sidebar list (`lg+`) or the pill row (`md` to `lg`) from the same state,
   controlled by Tailwind responsive classes (both markup blocks can exist,
   toggled via responsive `hidden`/`flex` classes, since this is small, static
   nav markup — not subject to the Ctrl+F concern from Task 2).
3. Below `md`, no persistent ToC (matches current behavior) — `StickyActionBar`
   remains the mobile navigation aid, unchanged.

**Acceptance criteria:**
- At 1024–1279px width, the sidebar ToC now appears (previously hidden).
- At 768–1023px width, a horizontal pill-row ToC appears with working
  click-to-jump and active-section highlighting.
- Below 768px, behavior is unchanged (no persistent ToC, `StickyActionBar` only).
- No layout overflow or horizontal scroll introduced on the page itself (only
  the pill row scrolls, not the page).

---

## Task 4 (High): Extend step-level `uses` to include patterns and debug guides

**Files:** `lib/schemas/workflow.ts`, `types/workflow.ts` (if manually maintained
alongside the Zod schema — check whether types are inferred via `z.infer` or
hand-duplicated before editing), `app/workflows/[id]/page.tsx` (the `typeMap`
around line 45), `components/shared/WorkflowStepList.tsx` (the `typeMap` inside
`renderAllUses` around line 67)

1. In `lib/schemas/workflow.ts`, update `WorkflowStepSchema`:
   ```ts
   uses: z.object({
     packages: z.array(z.string()),
     models: z.array(z.string()),
     cheatsheets: z.array(z.string()),
     patterns: z.array(z.string()).default([]),
     debug_guides: z.array(z.string()).default([]),
   }),
   ```
   Keep `packages`/`models`/`cheatsheets` exactly as they are (still required,
   no default) — only the two new fields are optional/defaulted, so existing
   `data/workflows/*.json` files validate unchanged.
2. If `types/workflow.ts` hand-declares the `WorkflowStep` interface separately
   from the Zod-inferred type, add the same two optional fields there too, kept
   in sync.
3. In `app/workflows/[id]/page.tsx`, the `typeMap` already includes `patterns:
   'pattern'` and `debug_guides: 'debug_guide'` — verify no change is actually
   needed there (it was already written generically); if it is missing either
   key, add it.
4. In `WorkflowStepList.tsx`'s `renderAllUses`'s internal `typeMap`, same check
   — add `patterns`/`debug_guides` mappings if not already present (they may
   already be there from earlier generic-key handling; confirm before adding
   duplicate entries).
5. Do not add `decision_guides` or `principles` to the step-level `uses`
   schema — this is a deliberate scope boundary, not an oversight. If asked to
   add them in a future pass, that requires a separate architectural decision,
   not a quiet inclusion here.

**Acceptance criteria:**
- A workflow step JSON with `uses.patterns: ["late-chunking"]` validates
  successfully and renders a resolved pattern badge in the step body, using
  the exact same rendering path already used for `packages`/`models`/`cheatsheets`.
- Existing `build-rag-system.json` (with no `patterns`/`debug_guides` keys in
  any step's `uses`) still validates and renders identically to before this
  change.
- `npm run validate` passes with zero new errors.

---

## Task 5 (Medium): Step ↔ Worked Example linking

**Files:** `lib/schemas/workflow.ts` (`WorkedExampleSchema`), `app/workflows/[id]/page.tsx`,
`components/shared/WorkflowStepList.tsx`

1. Add one optional field to `WorkedExampleSchema`:
   ```ts
   related_step: z.number().optional(),
   ```
2. In `page.tsx`'s Worked Examples section, if `example.related_step` is set,
   render a small tag on the example card: `"Used in Step {n}"`, linking to
   `#step-${n}` (requires each step's `<li>` to have a stable anchor id — check
   whether one already exists; if not, add `id={` `step-${s.step}` `}` to the
   step's outer `<li>` in `WorkflowStepList.tsx`, distinct from the new
   `step-${s.step}-content` id from Task 2, which is the collapsible body, not
   the whole `<li>`).
3. Inside each step's expanded body in `WorkflowStepList.tsx`, if any worked
   example has a matching `related_step === s.step`, render a small
   "View worked example →" link to `#worked-examples` (or, if you can pass the
   worked-examples list into `WorkflowStepList` as a prop, link directly to
   that specific example's own anchor — prefer this if it doesn't meaningfully
   complicate the component's props; otherwise the section-level anchor is an
   acceptable fallback).

**Acceptance criteria:**
- Existing worked examples with no `related_step` render exactly as before, no tag shown.
- A worked example with `related_step: 3` shows a "Used in Step 3" tag and links correctly.
- Step 3's expanded body shows a link back to the worked example section.

---

## Task 6 (Medium): Starter Stack badges — reuse shared component, make clickable

**Files:** `app/workflows/[id]/page.tsx`

1. Replace the hand-rolled `<span>` for each `starter_stack` tool with the same
   resolve-then-render pattern already used for `steps[].uses` earlier in this
   same file (`contentExists('package', tool)` then `contentExists('model', tool)`
   as a fallback check, in that order since Starter Stack items are more often
   packages).
2. Render using `ContentTypeBadge` (import from `@/components/shared/ContentTypeBadge`)
   wrapped in a `Link` when a match is found (same conditional pattern as
   `WorkflowStepList`'s `renderUses`), plain `ContentTypeBadge` (no link) when not.

**Acceptance criteria:**
- Starter Stack tools that match an existing package or model are now
  clickable and navigate correctly.
- Tools with no match render identically to today (same visual style, just via
  the shared component instead of a hand-rolled span).
- No visual regression in spacing/wrapping of the Starter Stack row.

---

## Task 7 (Medium): Unify failure-point severity color

**Files:** `app/workflows/[id]/page.tsx` (`common_failure_points` block, ~line 163)

Change the container's border/background/text color classes from
`border-rose-500`/`bg-rose-500/5`/`text-rose-700 dark:text-rose-400` to match
whichever color is chosen as the house standard — recommend keeping rose here
(higher-stakes pipeline-level failures) and changing `WorkflowStepList.tsx`'s
per-step "Watch Out" block from amber to rose instead, since per-step failure
points are the same *kind* of information, just narrower in scope.

**Acceptance criteria:** Both failure-point containers (per-step and
pipeline-level) use the same color treatment on the same page.

---

## Task 8 (Medium): Expand All / Collapse All

**Files:** `components/shared/WorkflowStepList.tsx`

Add a small text-button row above the `<ol>` ("Expand All" / "Collapse All"),
operating on the existing `expandedSteps` `Set<number>` state — "Expand All"
sets it to contain every step index, "Collapse All" clears it to an empty set
(or back to `new Set([0])` if you want Step 1 to always stay open by
convention — confirm which behavior is preferred before implementing, default
to fully empty if no preference is stated).

**Acceptance criteria:** Both buttons work, keyboard-focusable, and don't
interfere with the `hidden="until-found"` mechanism from Task 2 (a
find-triggered reveal should still work correctly regardless of Expand-All state).

---

## Task 9 (Low): Explicit ToC `IntersectionObserver` root

**Files:** `components/shared/TableOfContents.tsx`

Change the observer instantiation to pass
`{ root: document.getElementById('main-scroll'), rootMargin: '-88px 0px -65% 0px', threshold: [0, 1] }`,
guarding against `main-scroll` not being found (fall back to default/null root
exactly as today if it's null, so this can't introduce a regression on a page
that doesn't use the standard layout).

---

## Task 10 (Low): Explicit overview truncation

**Files:** `app/workflows/[id]/page.tsx`

Pass `maxLines={4}` explicitly to the `ExpandableText` wrapping `workflow.overview`.

---

## Regression Prevention Checklist (run after all tasks)
- [ ] `npm run build` completes with zero errors.
- [ ] `npm run validate` passes with zero new schema errors on all existing content.
- [ ] `build-rag-system.json` renders visually identically wherever no new
      optional field is populated (screenshot diff or manual side-by-side).
- [ ] Ctrl+F test (Task 2 acceptance criteria) passes in at least one Chromium
      browser and one non-Chromium browser if available; confirm graceful
      degradation (content still reachable by click, even if find-and-reveal
      isn't supported) on any browser lacking `hidden="until-found"` support.
- [ ] Keyboard-only pass: tab through the entire page (breadcrumbs → ToC →
      header → steps → worked examples → production profile → evaluation →
      next links → related content) with no dead-ends or skipped focusable elements.
- [ ] Screen reader spot check (VoiceOver/NVDA, whichever is available):
      confirm `aria-expanded`/`aria-controls` announce correctly for both step
      toggles and the Production Profile toggle after Task 2/Task 4 changes.
- [ ] Responsive pass at 375px, 768px, 1024px, 1280px, 1440px, and 1920px —
      confirm Task 3's three-tier ToC behavior (none / pill-row / sidebar) and
      no regression at any width not explicitly changed.
- [ ] Dark mode pass (the app supports it — confirm via existing
      `dark:` classes) for the color changes in Task 7.
- [ ] No new console warnings/errors introduced (check for the
      `onBeforeMatch`/`hidden="until-found"` TypeScript typing in particular —
      this is a newer DOM API and may need a type augmentation).

## Implementation Order
1. Task 2 (Ctrl+F) — do this first since Task 5 and Task 8 both touch the same
   step-body DOM structure and should be built on top of the final shape from
   Task 2, not around it.
2. Task 1 (clause parsing) — independent of Task 2, can be done in parallel by
   a different pass if working incrementally.
3. Task 4 (schema extension) — independent, do early since Task 4's `typeMap`
   changes are small and low-risk.
4. Task 6 (Starter Stack badges) — depends on nothing above, can be done anytime.
5. Task 7 (color unification) — trivial, do anytime.
6. Task 3 (ToC breakpoints) — independent.
7. Task 5 (step↔example linking) — do after Task 2, since it adds an anchor to
   the same step `<li>` Task 2 already touches.
8. Task 8 (Expand All/Collapse All) — do after Task 2, for the same reason.
9. Task 9, Task 10 — trivial, do last as cleanup.
```
