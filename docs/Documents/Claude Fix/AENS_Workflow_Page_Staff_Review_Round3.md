# AENS Workflow Detail Page — Staff Engineering & Product Design Review

**Roles:** Principal Staff Software Engineer / Senior Product Designer / Documentation Systems Architect / Design System Reviewer
**Scope:** `app/workflows/[id]/page.tsx` and full render tree, re-inspected against the live repository state (not against either prior review document).

---

## 0. Verification Pass — What's Actually True Right Now

Two things changed since the last inspection round, and one claim in your "Do NOT rediscover" list doesn't hold up. Stating this first because it changes what's actually left to do.

**Genuinely fixed since last round (confirmed by direct inspection, not by trusting a changelog):**
- `resolveWorkflowStepLinks()` now really exists in `lib/data.ts` and `page.tsx` imports it — the resolution logic was extracted out of the page component as recommended.
- `WorkflowStepList.tsx` toggle buttons now have `aria-controls` wired to a real panel `id` (`step-panel-${s.step}`).
- The Production Profile panel now has five real per-field anchor ids (`production-deployment`, `-scaling`, `-cost`, `-latency`, `-observability`), and `CollapsibleRow`'s hash-matching logic now supports `hash.startsWith(id + '-')` — genuine sub-navigation infrastructure is in place, just not yet surfaced as visible sub-nav UI.
- `common_failure_points` and per-step `failure_points` now share one color (amber) instead of the previous rose/amber split.
- `SectionCard` wrapping the step list now shows a `"{n} steps"` badge.

**Your "finished features" list is not fully accurate — confirmed by direct inspection:**
- *"beforematch event listeners for search compatibility"* — **this does not exist anywhere in the codebase.** `grep`-confirmed zero matches for `beforematch`, `onBeforeMatch`, or `until-found` in any `.ts`/`.tsx` file. `WorkflowStepList.tsx` still conditionally unmounts closed steps (`isOpen && (...)`) — Ctrl+F still cannot find closed step content, exactly as before. `CollapsibleRow.tsx` was changed to `{...(!isOpen && { hidden: true })}` (a boolean `hidden` attribute) instead of its previous Tailwind-class toggle — this is a genuine partial step, but a boolean `hidden` attribute still computes to `display: none`, which native find-in-page still cannot search. **This is not finished; it's an attempted fix that doesn't achieve the stated goal.** Section 3, Finding F1, is the real, complete fix.
- A previously-reviewed, separate report claimed a CLS bug in `CodeBlockInteractive.tsx` from a `wrapped` state toggled via `useEffect`/`matchMedia`. When I checked this two inspection rounds ago, that code did not exist and I correctly dismissed the finding. **It exists now** — a wrap-toggle feature (a good, legitimate feature addition, confirmed working) was added since, and it was implemented with exactly that pattern (`useState(false)` + `useEffect(() => setWrapped(isMobile), [])`). The finding was wrong when I said so; it's right now, on the current code. See F5.

**Not yet touched (confirmed still open, matching prior rounds):**
- Starter Stack tools are still hand-rolled `<span>` elements, not the shared `ContentTypeBadge`, still not clickable.
- No clause-structure parsing for the `Failure:/Trigger:/Downstream Effect:/Detection:` and `Benefit:/Trade-off:/...` labeled strings — still rendered as flat prose.
- `WorkflowStepSchema.uses` still only supports `packages`/`models`/`cheatsheets`.
- Table of Contents is still `hidden xl:block`. A prior interim review marked this "verified, no action needed" reasoning that "most laptop viewports (1280px+) clear this" — **I disagree with that conclusion, not the verification method.** 1280px is a CSS logical-pixel threshold, not a physical screen-size threshold; it's cleared by most laptops running near-100% OS scaling in a *maximized, single-pane* browser window, but not by: 13–14" laptops at higher DPI scaling settings (common default on Windows), any two-pane split-screen layout (browser beside an editor/terminal — the specific, stated primary use case for a page "kept open for hours while building"), or browser zoom above 100%. Restated as a real, open finding below (F7), not re-litigated as a settled non-issue.

The rest of this report proceeds from this corrected baseline.

---

## 1. Executive Summary

**Overall Rating: 6.5/10** (up from a prior 6/10 baseline — real progress landed, but the highest-leverage item, genuine find-in-page support, is still not actually done despite being reported as done).

**Top Strengths:**
- Clean separation of data resolution (`lib/data.ts`) from presentation (`page.tsx`), now improved further by extracting `resolveWorkflowStepLinks`.
- Real, working sub-anchor infrastructure for the Production Profile (five ids + hash-prefix matching) — this is good, underused architecture; it just needs a visible sub-nav UI to pay off.
- `content-prose` (72ch max-width) exists as a considered typographic decision — it's just not applied everywhere it should be.
- Zero heavy dependencies added anywhere in this component tree; everything is Tailwind-first, matching your stated technology constraint.

**Top Weaknesses:**
- The single most-cited usability problem (native find-in-page) is still broken, despite being reported as fixed. This is a process risk as much as a code risk — verify claims like this against the actual DOM before marking anything else "finished."
- Code truncation happens on raw source before syntax highlighting (H1 below) — a real correctness bug that will visibly mis-color any worked example whose code exceeds 20 lines with an unclosed multi-line construct crossing that boundary. With two new workflows just added (`rag-evaluation-harness`, `vector-database-setup-indexing-strategy`), this is no longer a theoretical edge case — it should be checked against their actual worked-example code today.
- Long-form text fields (`step.what`, `step.decision`, all five Production Profile notes, `implementation_notes`, `common_failure_points` items) have no line-length constraint, unlike the Overview field which correctly uses `content-prose` (72ch cap) — on a wide monitor these stretch to full container width, undermining the one typographic guardrail that does exist.
- A newly-real CLS bug in the code-block wrap toggle (F5) — ship-worthy feature, shipped with a hydration-order bug.

**Key Interventions (highest impact, in order):**
1. Implement find-in-page correctly, using `hidden="until-found"` + `onBeforeMatch` — not a boolean `hidden` toggle (F1).
2. Fix the truncate-before-highlight ordering in `CodeBlock.tsx` (F2).
3. Apply `content-prose` (or an equivalent max-width utility) to every long-form text field, not just Overview (F3).
4. Parse and visually structure the labeled-clause failure/production-note strings instead of rendering them as flat prose (F4).
5. Fix the wrap-toggle default via CSS media query instead of post-hydration JS state (F5).

---

## 2. Deep Design Review

### Information Architecture
The page's section order (Overview → Steps → Worked Examples → Failures → Production → Evaluation → Next/Related) is sound and matches how an engineer actually consumes a pipeline: understand it, walk it, see it wired up, know what breaks, know how to run it, know how to verify it. The gap isn't ordering — it's that several sections carry structured, multi-attribute information (a failure mode has a trigger, an effect, and a detection method; a production note has a benefit, a trade-off, and an operational impact) but are rendered with the information architecture of a single flat sentence. This is the same "populated but not surfaced" pattern already caught once in this project (the earlier Design Report's finding that `production_notes`/`worked_examples` existed in data but weren't rendered at all) — recurring one layer deeper: the fields are rendered now, but their *internal structure* still isn't.

### Visual Hierarchy & Typography
Rhythm is mostly consistent — `space-y-8` at the page level, `space-y-3`/`space-y-4` within sections, a repeated `text-[10px] font-semibold uppercase tracking-wider` convention for eyebrow labels used consistently across Starter Stack, Key Decision, Watch Out, Production sub-sections, and Evaluation Checklist. That consistency is a genuine strength — it's a real design system, just an implicit one (never named/documented as a token). The one real hierarchy gap: line-length. `content-prose`'s 72ch cap is a correct typographic decision (72ch is within the widely-used 50–75ch readability range) but is applied to exactly one field (`workflow.overview`) out of roughly a dozen long-form text fields on the page. On anything wider than a laptop screen, every other paragraph on the page (step descriptions, decisions, all five production notes, implementation notes, failure point text) runs edge-to-edge across the content column, which — given the content column itself has no independent max-width in `ContentPageLayout` (`flex-1`, no cap) — could span 900px+ of line length on a wide monitor. This is the single most impactful, cheapest typography fix available (see F3).

### Interaction Design & Disclosure Modes
The accordion pattern (steps, Production Profile) is appropriate for progressive disclosure at this content density, and `ExpandableText`'s line-clamp-with-cache-key approach is a reasonable middle ground for the Overview. The real disclosure-mode issue isn't *whether* to collapse content — it's that the collapse mechanism (conditional unmount / `display:none`) has a side effect (search-blocking) that a "kept open for hours, referenced constantly" reference page cannot actually tolerate. This is the correct place to spend engineering effort, more than any layout change: a reference page's core promise is "the information is in here somewhere, and I can find it," and that promise is currently broken for anything not expanded by default.

### Navigation & Breakpoint Usability
The `xl`-only ToC (F7) is the main open issue. Everything else in the nav shell (`ReadingProgress`, `BackToTop`, `StickyActionBar`, the `#main-scroll` convention) is correctly wired and consistent. The unused sub-anchor infrastructure in the Production Profile (F6) is a second, related opportunity — the ids and hash-matching already exist; the missing piece is purely a visual sub-nav (even a simple inline pill row inside the expanded panel) to make that infrastructure discoverable rather than something only reachable by a hand-typed URL hash.

### Documentation UX & Industry Alignment
Compared to MDN/Stripe/PyTorch-style references, the biggest structural gap isn't visual — those sites succeed because (a) everything is find-in-page-searchable without exception, and (b) dense reference content is broken into scannable sub-units (definition lists, labeled fields, sidebar-anchored subsections) rather than paragraphs. AENS's Workflow page is closer to those sites in raw information density than in presentation shape for exactly the two reasons above (F1 and F4). Fixing those two closes most of the perceived gap without touching layout.

### Design System Consistency
The implicit eyebrow-label convention (mentioned above) is used consistently for section labels but is broken by the Starter Stack badges (F8) and the Worked Examples code/notes cards, which use ad hoc styling rather than the shared `ContentTypeBadge`/`SectionCard` primitives already used elsewhere on the same page. This is a "different implementer, different day" pattern, not a fundamental inconsistency — the fix is a straightforward component-reuse pass, not a redesign.

### Long-term Scalability
The schema-enforced 8-step ceiling and the 9-block frozen page architecture (from the earlier Design Report) already bound structural growth — "30+ sections" isn't a realistic risk for *this* page's shape. The two newly-added workflows (`rag-evaluation-harness`, `vector-database-setup-indexing-strategy`) are the first real test of this at scale beyond the original `build-rag-system` — worth spot-checking their rendered output specifically for the truncate-before-highlight bug (F2) and the line-length issue (F3), since both are the kind of bug that's invisible on short example content and only shows up once real, denser content exists.

---

## 3. Verified Findings

**F1 — Find-in-page is still broken; the recent partial fix doesn't achieve it**
- **Component:** `WorkflowStepList.tsx` (conditional unmount), `CollapsibleRow.tsx` (boolean `hidden` attribute)
- **Severity:** Critical
- **Evidence & Location:** `WorkflowStepList.tsx` line ~129, `{isOpen && (<div id={...}>...)}`. `CollapsibleRow.tsx` line ~124, `{...(!isOpen && { hidden: true })}`. Confirmed via direct grep: zero occurrences of `beforematch`/`onBeforeMatch`/`until-found` anywhere in the repo.
- **Root Cause & User Impact:** A boolean `hidden` HTML attribute (and Tailwind's `.hidden` class, which is equivalent) both compute to `display: none`, which the browser's native find-in-page (Ctrl+F/Cmd+F) does not search. Closed steps and a closed Production Profile remain unreachable by search, which is a severe usability gap on a page explicitly meant to be a long-referenced document.
- **Engineering Impact:** Low maintainability cost either way; the correct fix is not meaningfully harder to write than the current incorrect one — it's a different attribute value plus one event handler.
- **Recommended Solution:** Set the attribute to the literal string `"until-found"` instead of `true`/`false`, and add an `onBeforeMatch` handler on the element that flips the corresponding `isOpen`/expansion state to true, so the chevron icon and `aria-expanded` stay in sync when the browser auto-reveals a match. Apply to both `WorkflowStepList`'s step bodies and `CollapsibleRow`'s content div.
- **Trade-offs:** `hidden="until-found"` is a newer DOM feature (Chromium/Edge/Safari 17.2+); on an unsupported browser, content simply stays hidden until manually expanded — same as today, no regression, just no improvement on that specific browser. No other real trade-off.
- **Complexity & Priority:** Low-Medium complexity. Critical priority.

**F2 — Code collapse truncates raw source before syntax highlighting, not the highlighted output**
- **Component:** `CodeBlock.tsx`
- **Severity:** High
- **Evidence & Location:** Lines ~44-57 — `lines.slice(0, MAX_COLLAPSED_LINES).join('\n')` is highlighted via a *second, independent* `codeToHtml()` call, separate from the full-source highlight.
- **Root Cause & User Impact:** Shiki tokenizes each call in isolation. If line 20 falls inside an unclosed multi-line construct (a triple-quoted docstring, a multi-line dict/list literal, a function signature spanning several lines), the truncated snippet is syntactically incomplete and the tokenizer guesses at scope for the remainder with no closing context — strings can bleed color, brackets can mis-color, keywords can render as plain text. This only affects the *collapsed* view; the expanded view (full, valid source) always highlights correctly, which is why this bug is easy to miss in casual review.
- **Engineering Impact:** Currently costs one extra Shiki invocation per long code block at build time (minor build-time cost, not runtime). Fixing it removes that second invocation as a side benefit.
- **Recommended Solution:** Highlight the full source exactly once, then truncate the **rendered HTML output** to the first N elements carrying Shiki's per-line wrapper class, not the raw source string before highlighting. This guarantees the collapsed view is always a syntactically-valid prefix of a correctly-tokenized highlight, and removes the redundant second `codeToHtml()` call entirely.
- **Trade-offs:** Slightly more string/DOM manipulation logic in `CodeBlock.tsx` in exchange for removing a whole second highlighting pass — net simplification, not added complexity.
- **Complexity & Priority:** Low-Medium complexity (isolated to one file, no schema/prop changes). High priority — check both newly-added workflows' worked examples for this specific symptom before considering it non-urgent.

**F3 — No line-length constraint on any long-form field except `overview`**
- **Component:** `page.tsx` (step `what`/`decision` via `WorkflowStepList`, all five Production Profile fields, `implementation_notes`, `common_failure_points`), `ContentPageLayout.tsx` (no independent content-column max-width)
- **Severity:** High
- **Evidence & Location:** `.content-prose { max-width: 72ch }` (confirmed in `app/globals.css`) is applied only to the `<p className="content-prose ...">` wrapping `workflow.overview` in `page.tsx`. No other long-form field in `WorkflowStepList.tsx` or the rest of `page.tsx` carries this class or any other max-width.
- **Root Cause & User Impact:** The typographic guardrail exists and was clearly a deliberate choice (72ch is textbook-correct readable line length) but was applied to only the one field present when it was first added, and never propagated to the newer, denser fields introduced by the content-density upgrade. On any viewport wider than roughly a laptop screen, every paragraph outside the Overview stretches to the full available width of the content column, which itself has no cap (`ContentPageLayout`'s `min-w-0 flex-1`).
- **Engineering Impact:** Trivial to fix — a shared className addition, no logic change.
- **Recommended Solution:** Apply `content-prose` (or a matching utility) to every long-form text render in `WorkflowStepList.tsx` and the Production Profile/Evaluation sections in `page.tsx`. Consider promoting this to a convention check (e.g. a comment or lint note) so future fields default to it rather than needing a retrofit again.
- **Trade-offs:** None of substance — this is a pure readability improvement with no functional cost.
- **Complexity & Priority:** Low complexity. High priority (cheapest fix on this list relative to its impact).

**F4 — Labeled-clause content (`Failure:/Trigger:/...`, `Benefit:/Trade-off:/...`) renders as flat prose**
- **Component:** `WorkflowStepList.tsx` (`failure_points`), `page.tsx` (`common_failure_points`, all five Production Profile fields)
- **Severity:** High
- **Evidence & Location:** Confirmed directly in `data/workflows/build-rag-system.json` — failure points follow `"Failure: X. Trigger: Y. Downstream Effect: Z. Detection: W."`; production notes follow `"Benefit: ... Trade-off: ... When not to use it: ... Operational impact: ..."`. Both render today as a single `<li>`/`<p>` of undifferentiated text.
- **Root Cause & User Impact:** The rendering layer predates the content-density upgrade that introduced this clause convention (per the adopted Workflow Resource Prompt v3.0) and was never updated to parse it. The reader has to visually parse the clause labels out of a run-on sentence themselves — exactly the opposite of what the structured-content upgrade was meant to achieve.
- **Engineering Impact:** A small, isolated parsing utility; no schema change; safe fallback path required for content that doesn't match the pattern.
- **Recommended Solution:** A small shared `parseLabeledClauses(text, labels[])` utility (return `null` if not all labels are found cleanly, so the caller falls back to the current raw-text rendering — never silently drop content). Apply to both locations, rendering each clause as its own labeled line within the existing containers (no change to container color/structure, only to what's inside).
- **Trade-offs:** A regex-based parser is inherently a little brittle against label wording drift; mitigated by the required "fall back to raw text if it doesn't parse cleanly" rule, which makes a parsing miss a readability regression-to-today, not data loss.
- **Complexity & Priority:** Low-Medium complexity. High priority.

**F5 — Wrap-toggle default causes a real hydration-order layout shift (CLS)**
- **Component:** `CodeBlockInteractive.tsx`
- **Severity:** Medium-High
- **Evidence & Location:** Lines ~32-39 — `const [wrapped, setWrapped] = useState(false)` followed by `useEffect(() => { setWrapped(window.matchMedia('(max-width: 767px)').matches) }, [])`.
- **Root Cause & User Impact:** During static generation/SSR, `wrapped` is always `false` (its initial state), so the server-rendered HTML always uses `overflow-x-auto` (no wrap). On a mobile client, after hydration, the `useEffect` fires and flips `wrapped` to `true`, switching to `whitespace-pre-wrap break-words` — this changes the rendered height of any code block with long lines, causing a visible layout shift immediately after the page becomes interactive on mobile. This is a real, currently-shippable Core Web Vitals regression (Cumulative Layout Shift), not a hypothetical one — I want to be explicit that I dismissed a version of this finding as non-existent in an earlier inspection pass; the wrap-toggle feature was added afterward, and it reintroduced exactly this pattern.
- **Engineering Impact:** No structural cost to fix; the fix is strictly simpler than the current implementation (removes a `useEffect` and a piece of client state entirely for the *default*, while still allowing user override).
- **Recommended Solution:** Set the default wrap behavior with a pure CSS media query (e.g. `max-md:whitespace-pre-wrap max-md:break-words`) applied unconditionally in the className, and reserve the `wrapped` React state purely for the user's manual toggle override (initialize it as `undefined`/`null` meaning "use the CSS default," only assign a concrete boolean once the user actually clicks the toggle). This removes the post-hydration state flip entirely for the common case.
- **Trade-offs:** Slightly more conditional className logic (three states: unset/CSS-default, manually-on, manually-off, instead of two) — a small complexity increase in exchange for removing a genuine CLS bug.
- **Complexity & Priority:** Medium complexity (the three-state logic needs care). Medium-High priority — CLS is a measurable, user-visible metric, not just a code-quality nit.

**F6 — Production Profile sub-anchor infrastructure exists but has no visible sub-navigation**
- **Component:** `page.tsx` (Production Profile block), `CollapsibleRow.tsx`
- **Severity:** Medium
- **Evidence & Location:** Five real ids (`production-deployment`, `-scaling`, `-cost`, `-latency`, `-observability`) and working hash-prefix matching in `CollapsibleRow.tsx` — but no UI element anywhere links to any of them; they're only reachable by a hand-typed or externally-linked URL hash.
- **Root Cause & User Impact:** The backing mechanism was built (correctly) ahead of the UI that would use it. Today, expanding the Production Profile presents five prose blocks with no way to jump directly to, say, just "Cost" without reading past Deployment and Scaling first.
- **Engineering Impact:** Trivial — the data (five known sub-section labels/ids) already exists in the same component; this is a rendering-only addition.
- **Recommended Solution:** Add a small inline pill row at the top of the expanded Production Profile panel — one pill per populated sub-field, each a plain anchor (`href="#production-cost"`) — using the same pill styling already established elsewhere on the page (e.g. Starter Stack, Next Workflow).
- **Trade-offs:** None of substance.
- **Complexity & Priority:** Low complexity. Medium priority (cheap win, but not as high-leverage as F1–F4).

**F7 — Table of Contents dead zone below `xl` (1280px)**
- **Component:** `TableOfContents.tsx`
- **Severity:** High
- **Evidence & Location:** `hidden xl:block` — confirmed still present, unchanged from the prior round.
- **Root Cause & User Impact:** 1280px is a CSS logical-pixel breakpoint, not a physical-screen-size guarantee — it is not reliably cleared by 13–14" laptops at higher-than-100% OS display scaling (a common Windows default, and Zahed's primary development machine per prior context is a Windows desktop, but any laptop use would hit this), nor by any split-screen/two-pane window arrangement, which is the specific, explicitly-stated primary use pattern for a page meant to stay open for hours while building. A prior interim review marked this "verified, no action needed" — that verification checked that the breakpoint value itself was unmodified and standard (correct, as far as it goes) but didn't re-examine whether 1280px is actually the right threshold for the stated usage pattern, which is a design judgment, not a fact-check. I disagree with the conclusion on that basis, restating it here as open.
- **Engineering Impact:** Trivial CSS change; the harder part (a usable fallback for the dead zone) requires a small new markup variant, not a schema or data change.
- **Recommended Solution:** Lower the sidebar ToC's breakpoint to `lg` (1024px), and add a compact horizontal pill-row variant (same underlying `items`/`activeId` state, different markup) for the `md`-to-`lg` range, so there's no width range with zero persistent section-jump navigation.
- **Trade-offs:** A horizontal pill row at `md` width competes for header space with other elements (breadcrumbs, badges) — needs a quick visual check that it doesn't crowd the page header at exactly 768–1023px.
- **Complexity & Priority:** Low-Medium complexity. High priority given the explicit "kept open for hours" design goal.

**F8 — Starter Stack badges remain ad hoc, unstyled-consistently, and inert**
- **Component:** `page.tsx` (~line 82)
- **Severity:** Medium
- **Evidence & Location:** `<span className="rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-mono">` — hand-rolled, not `ContentTypeBadge`; no `href`, even when `contentExists('package', tool)` (already computed and used two sections later for step-level `uses`) would resolve.
- **Root Cause & User Impact:** Written without reusing the shared badge primitive or checking the resolution utility that already exists in the same file's scope.
- **Engineering Impact:** Zero new logic needed — the exact resolve-then-render pattern already exists in `WorkflowStepList.tsx`'s `renderUses` and could be lifted directly.
- **Recommended Solution:** Resolve each Starter Stack string against `contentExists('package', ...)` then `contentExists('model', ...)`, rendering a `Link`-wrapped `ContentTypeBadge` on a match, plain badge otherwise.
- **Trade-offs:** None of substance.
- **Complexity & Priority:** Low complexity. Medium priority.

**F9 — `WorkflowStepSchema.uses` still cannot reference Patterns or Debug Guides**
- **Component:** `lib/schemas/workflow.ts`
- **Severity:** Medium-High
- **Evidence & Location:** `uses: z.object({ packages, models, cheatsheets })` — unchanged since the prior round. `WorkflowStepList.tsx`'s own `renderAllUses` already has a `typeMap` entry for `patterns`/`debug_guides`/`decision_guides`/`principles` (i.e. the rendering code is already written generically and ready), but no step JSON can ever populate those keys because the schema strips or rejects them first.
- **Root Cause & User Impact:** The step-level schema was scoped narrower than the resource-level relationship schema and never widened to match, even though the UI-side code is already prepared for it.
- **Recommended Solution:** Add `patterns: z.array(z.string()).default([])` and `debug_guides: z.array(z.string()).default([])` to `WorkflowStepSchema.uses`. Deliberately exclude `decision_guides`/`principles` at step level — per the frozen Workflow ownership boundaries, those belong at the whole-resource level, not per-step.
- **Trade-offs:** None — both fields optional/defaulted, zero migration cost on existing content.
- **Complexity & Priority:** Low complexity. Medium-High priority (unblocks content that's already being written with pattern/debug-guide references in prose, per the Prompt v3.0 template, but has nowhere structured to put them).

---

## 4. UX Scorecard

| Category | Score | Justification |
|---|---|---|
| Information Architecture | 8/10 | Section order and grouping are right; only loses points for structured content rendered flat (F4). |
| Visual Hierarchy | 6/10 | Consistent eyebrow-label convention is a real strength; the missing line-length cap on most fields (F3) is a genuine, page-wide typography gap. |
| Navigation & TOC | 5/10 | Solid nav-shell engineering (`#main-scroll` convention correctly used everywhere) undercut by the `xl`-only ToC dead zone (F7) on the exact usage pattern the page is designed for. |
| Documentation UX | 6/10 | Content depth is genuinely excellent; presentation shape (F1, F4) hasn't fully caught up to it yet. |
| Workflow Steps Scanning | 7/10 | Tool badges in the collapsed header already support fast scanning; step-count badge is a nice recent addition; would benefit from an Expand All control at higher step counts. |
| Code Experience | 6/10 | Copy, collapse, and wrap are all present and mostly well-built — held back by F2 (a real correctness bug) and F5 (a real CLS bug), both in code paths that looked complete on casual review. |
| Accessibility & ARIA | 6/10 | `aria-expanded`/`aria-controls` now correctly paired in `WorkflowStepList`; F1's fix will also meaningfully improve the accessibility tree once `hidden="until-found"` replaces unconditional unmounting. |
| Performance & Hydration | 6/10 | Server-side cross-link resolution is a genuine strength; F5 is a real, currently-shipping CLS regression that directly affects a Core Web Vitals metric. |
| Mobile & Responsive Scaling | 6/10 | No confirmed layout breakage at any tested width; F7's dead zone and F5's CLS are both mobile/narrow-viewport-relevant issues. |
| Maintainability & Clean Code | 7/10 | Recent extraction of `resolveWorkflowStepLinks` into `lib/data.ts` is a good trend; the remaining ad hoc styling (F8) and un-widened schema (F9) are the main debt items left. |
| Cross-Page Consistency | 6/10 | The implicit design-system conventions (eyebrow labels, card shells) are followed correctly in most places on this page; F8 is the one clear deviation found. |

---

## 5. Prioritized Roadmap

### Phase 1: Critical (Visual & Hierarchy)
1. **F1** — Implement genuine find-in-page support via `hidden="until-found"` + `onBeforeMatch`, in both `WorkflowStepList.tsx` and `CollapsibleRow.tsx`. *Validation:* Ctrl+F for a term that only exists in a closed step/panel; confirm it's found and the section visibly expands with correct `aria-expanded` state.
2. **F2** — Fix `CodeBlock.tsx`'s truncate-before-highlight ordering. *Validation:* find or construct a worked example with a multi-line construct crossing line 20; confirm collapsed and expanded views render identical colors for the visible portion.
3. **F3** — Apply `content-prose` to every long-form field, not just Overview. *Validation:* visual check at 1920px+ width — no paragraph should exceed ~72 characters per line.

### Phase 2: High (Navigation & IA)
4. **F4** — Parse and structurally render labeled-clause failure/production content, with safe raw-text fallback. *Validation:* a well-formed clause string renders as labeled lines; a malformed one renders exactly as today.
5. **F7** — Lower ToC breakpoint to `lg`, add `md`-to-`lg` pill-row fallback. *Validation:* test at 768px, 1024px, 1280px explicitly — confirm no dead zone.
6. **F5** — Fix wrap-toggle default via CSS media query instead of post-hydration state. *Validation:* Lighthouse/PageSpeed CLS metric before/after on a mobile-emulated run with a long-line code block present.
7. **F9** — Extend `WorkflowStepSchema.uses` with `patterns`/`debug_guides`. *Validation:* `npm run validate` passes; a test step JSON with `uses.patterns` populated renders a resolved badge.

### Phase 3: Medium (Polish & Consistency)
8. **F8** — Starter Stack badges via shared `ContentTypeBadge`, clickable where resolvable.
9. **F6** — Visible pill-row sub-navigation inside the expanded Production Profile panel.

### Phase 4: Low (Minor tweaks)
10. Explicit `maxLines` on the Overview's `ExpandableText` (carried from prior round, still unconfirmed either way — low-risk to make deliberate).
11. Explicit `root: document.getElementById('main-scroll')` on the ToC's `IntersectionObserver` (latent-only risk, no confirmed current bug).

---

## 6. Architectural Recommendations

1. **Do not mark a finding "done" without re-reading the file.** This round found one confidently-listed "finished feature" (find-in-page support) that isn't implemented, and one previously-dismissed finding (CLS on wrap-toggle) that has since become real because a new feature was added without re-checking for the exact failure pattern already documented elsewhere in the project's history. Both are process risks, not just code risks — worth a lightweight habit (a one-line grep or manual spot-check) before any status list is trusted, by any reviewer, human or AI.
2. **Promote `content-prose` to a documented convention, not an implicit one.** It's correctly designed (72ch) but was only applied to the field that existed when it was written. A short comment at its definition site ("apply this to any long-form text field rendered outside a code block") would have prevented F3 from recurring the way it did.
3. **`hidden="until-found"` should become the house standard for all collapsible content**, not a Workflow-page-specific fix — `CollapsibleRow` is a shared component; fixing it here fixes find-in-page everywhere it's used across AENS, not just on this page.
4. **Extend `WorkflowStepSchema.uses` conservatively** (patterns + debug_guides only, per F9) — resist the temptation to also add `decision_guides`/`principles` at step level; that boundary was deliberately frozen for reasons unrelated to this pass and shouldn't be quietly reopened as a side effect of an otherwise-small schema change.
5. **Use the two newly-added workflows as the real scale/regression test** for F2 and F3 specifically — they're the first content beyond the original example dense enough to actually exercise those bugs; check them directly rather than relying on synthetic test cases alone.

---

## 7. Implementation-Ready Windsurf Prompt

```markdown
# AENS Workflow Page — Verified Fix Pass (Round 3)

## Context
You are implementing a verified, re-confirmed set of fixes to the AENS Workflow
detail page and its shared component tree. Every item below was checked
directly against the current repository state immediately before this prompt
was written — none are carried over from an assumption or an unverified prior
report. Two important corrections to be aware of before starting:

1. A prior status list claimed "beforematch event listeners for search
   compatibility" were already implemented. **This is not true.** Grep the
   repo yourself for `beforematch`, `onBeforeMatch`, and `until-found` before
   starting Task 1 to confirm this for yourself — you will find zero matches.
   Task 1 is real, uncompleted work.
2. `CollapsibleRow.tsx` currently has `{...(!isOpen && { hidden: true })}` —
   this looks like a find-in-page fix but is not one (a boolean `hidden`
   attribute is `display:none`, same as the Tailwind class it replaced, and is
   equally invisible to native browser search). Do not skip Task 1's work on
   `CollapsibleRow.tsx` because this looks superficially already handled.

## Target Files & Components
- `components/shared/WorkflowStepList.tsx`
- `components/shared/CollapsibleRow.tsx`
- `components/shared/CodeBlock.tsx`
- `components/shared/CodeBlockInteractive.tsx`
- `app/workflows/[id]/page.tsx`
- `components/shared/TableOfContents.tsx`
- `lib/schemas/workflow.ts`
- New file: `lib/text/parseLabeledClauses.ts`

## Files to Avoid
- `lib/data.ts`'s `resolveWorkflowStepLinks` — already correctly implemented, do not modify.
- `components/shared/ContentPageLayout.tsx` — no changes needed for any task below.
- `components/shared/MetadataBadges.tsx`, `SectionCard.tsx` — not in scope, do not touch.
- Any `data/workflows/*.json` — content, not code; do not modify.
- Do not implement a tabbed/split-pane layout redesign — out of scope, explicitly rejected in the prior architectural review for this page.

## Refactoring Tasks (in order)

### Task 1 — Critical: Real find-in-page support
**Files:** `WorkflowStepList.tsx`, `CollapsibleRow.tsx`

In `WorkflowStepList.tsx`:
- Remove the `isOpen && (...)` conditional wrapper around the step body div —
  it must always render.
- Set the step body div's `hidden` prop to `isOpen ? undefined : 'until-found'`
  (verify your TypeScript/React version accepts the string value for the
  `hidden` prop; if it complains, use a narrowly-scoped `as any` cast on just
  that prop, documented with a one-line comment explaining why).
- Add an `onBeforeMatch` handler on that same div that calls `toggleStep(idx)`
  (or a dedicated force-open setter) so `expandedSteps` state — and therefore
  the chevron icon and `aria-expanded` — stay in sync when the browser reveals
  a match automatically.
- Apply `style={{ contentVisibility: 'auto' }}` (or an equivalent Tailwind
  arbitrary-value class) to the same div to keep paint cost low while hidden.

In `CollapsibleRow.tsx`:
- Replace `{...(!isOpen && { hidden: true })}` with the same
  `hidden={isOpen ? undefined : 'until-found'}` pattern.
- Add the equivalent `onBeforeMatch` handler calling the existing
  `handleToggle` (or the controlled `onToggle` if `isControlled`).
- Make sure this doesn't conflict with the existing `enableHashDeepLink`
  effect — both mechanisms should end up calling the same underlying
  open-state setter, not fighting each other.

**Acceptance Criteria:**
- With all steps collapsed, Ctrl+F/Cmd+F for a term that only appears in a
  closed step's `what` or `decision` text finds and highlights it, and the
  step visibly expands with `aria-expanded="true"`.
- Same test with the Production Profile collapsed, searching for a term only
  in one of the five sub-notes.
- No visual flash or layout jump when a match triggers an auto-reveal.

---

### Task 2 — Critical: Fix truncate-before-highlight in CodeBlock
**File:** `CodeBlock.tsx`

- Remove the second, separate `codeToHtml()` call currently run against
  `lines.slice(0, MAX_COLLAPSED_LINES).join('\n')`.
- Instead, run `codeToHtml()` once against the full source (as already
  happens for `fullHighlighted`), then derive `collapsedHighlighted` by
  truncating the **resulting HTML string** to the first `MAX_COLLAPSED_LINES`
  occurrences of Shiki's per-line wrapper (inspect the actual HTML Shiki
  produces — likely `<span class="line">...</span>` per source line — and
  truncate by counting/splitting on that marker, not by counting raw
  newlines in the HTML string, which will not align with visual lines once
  HTML tags are present).
- Ensure the truncated HTML remains well-formed (properly closed tags) —
  if Shiki wraps the whole output in an outer `<pre><code>...</code></pre>`,
  make sure your truncation preserves that wrapper around the sliced inner content.

**Acceptance Criteria:**
- Construct or find a code sample with a multi-line string/docstring/literal
  spanning across line 20. Confirm the collapsed view colors that construct
  identically to how the expanded view colors it (no bleed, no plain-text
  fallback in the collapsed view where the expanded view shows correct color).
- Confirm the second `codeToHtml()` invocation no longer exists (build-time
  perf check, not just a visual one).
- Spot-check both `rag-evaluation-harness.json` and
  `vector-database-setup-indexing-strategy.json`'s worked examples
  specifically, since these are the newest, most likely candidates to
  actually trigger this bug.

---

### Task 3 — Critical: Line-length constraint on all long-form fields
**Files:** `WorkflowStepList.tsx`, `page.tsx`

- Add the `content-prose` className (or an equivalent shared max-width
  utility if `content-prose` carries unwanted side effects when applied
  outside its original context — check its full definition in
  `app/globals.css` before reusing it verbatim) to:
  - `step.what` and the `Key Decision` text in `WorkflowStepList.tsx`
  - `production_notes`, `scaling_notes`, `cost_notes`, `latency_notes`,
    `observability_notes` in `page.tsx`
  - `example.implementation_notes` in `page.tsx`
  - Each `common_failure_points` list item in `page.tsx`
- Do not change font size, weight, or color — only apply the max-width constraint.

**Acceptance Criteria:**
- At a 1920px+ viewport width, no paragraph in any of the fields above exceeds
  roughly 72 characters per line.
- No visual regression at narrower widths (the constraint should have no
  effect when the natural column width is already under 72ch).

---

### Task 4 — High: Labeled-clause parsing for failure points and production notes
**Files:** new `lib/text/parseLabeledClauses.ts`, `WorkflowStepList.tsx`, `page.tsx`

1. Create `lib/text/parseLabeledClauses.ts`:
   ```ts
   export interface LabeledClause { label: string; text: string }
   export function parseLabeledClauses(input: string, labels: string[]): LabeledClause[] | null
   ```
   - Return non-null only if every label in `labels` is found exactly once,
     each with non-empty trailing text up to the next label or end of string.
   - Return `null` for any input that doesn't cleanly match — callers must
     fall back to rendering the original raw string unchanged.
   - Add a few inline sanity-check examples in a comment (well-formed input,
     input missing one label, empty input) demonstrating expected behavior.

2. In `WorkflowStepList.tsx`, for each `failure_points` entry, call
   `parseLabeledClauses(fp, ['Failure:', 'Trigger:', 'Downstream Effect:', 'Detection:'])`.
   If non-null, render each clause as its own labeled line inside the existing
   amber "Watch Out" container (do not change the container's color/structure).
   If `null`, render the raw string exactly as today.

3. In `page.tsx`, apply the same treatment to the five Production Profile
   fields using labels `['Benefit:', 'Trade-off:', 'When not to use it:', 'Operational impact:']`.

4. Before applying any parsing to `common_failure_points`, check its actual
   current string format in `data/workflows/build-rag-system.json` — it may
   use a different label convention than per-step failure points. If so, add
   that specific label set as a second call rather than assuming it matches
   the per-step pattern.

**Acceptance Criteria:**
- A well-formed 4-clause failure point renders as 4 visually distinct labeled
  lines inside the existing amber container.
- A failure point missing any expected label renders exactly as it does today
  (byte-identical text, same container) — verify with an intentionally
  malformed test string.
- No hydration mismatch (server and client render identically for the same input).

---

### Task 5 — High: Table of Contents breakpoint fix
**File:** `TableOfContents.tsx`

- Change the sidebar variant's visibility from `hidden xl:block` to `hidden lg:block`.
- Add a compact horizontal pill-row variant for `md`-to-`lg` width (768–1023px),
  reusing the same `items`/`activeId` state already computed in this component —
  do not duplicate the `IntersectionObserver` logic; render either the sidebar
  list or the pill row from the same underlying state via responsive Tailwind
  classes.
- Below `md`, behavior is unchanged (no persistent ToC).

**Acceptance Criteria:**
- At 1024–1279px, the sidebar ToC now appears (previously hidden).
- At 768–1023px, a horizontal pill row appears with working click-to-jump and
  active-section highlighting, with no page-level horizontal scroll introduced
  (only the pill row itself may scroll horizontally if it overflows).
- No change in behavior below 768px or above 1280px.

---

### Task 6 — High: Fix wrap-toggle CLS
**File:** `CodeBlockInteractive.tsx`

- Remove the `useEffect(() => { setWrapped(window.matchMedia(...).matches) }, [])`
  entirely.
- Change the code body's wrap-related classes to apply a default via pure CSS:
  add `max-md:whitespace-pre-wrap max-md:break-words` unconditionally, and only
  layer the `wrapped` state's explicit override on top when the user has
  actually clicked the toggle (track this with a nullable/three-state value —
  e.g. `wrapped: boolean | null`, where `null` means "no manual override, use
  the CSS default," and only becomes `true`/`false` once the user clicks).
- Update the toggle button's active/inactive visual state accordingly (it
  should reflect the *effective* wrap state — CSS default or manual override —
  not just the raw `wrapped` variable if it's `null`).

**Acceptance Criteria:**
- No `useEffect`-driven state change occurs on mount related to wrap behavior.
- Mobile default wrap behavior is visually identical to before this change
  (long lines wrap by default on mobile) — the difference is *when* that
  behavior takes effect (immediately, via CSS, not after a JS state flip).
- Manual toggle still works exactly as before.
- Run a Lighthouse mobile-emulated pass before and after on a workflow with a
  long-line code block; confirm CLS score improves or is unaffected (should
  improve).

---

### Task 7 — Medium-High: Extend step-level `uses` schema
**Files:** `lib/schemas/workflow.ts`, `types/workflow.ts` (check whether it's
hand-maintained separately from the Zod-inferred type before editing)

- Add to `WorkflowStepSchema`'s `uses` object:
  ```ts
  patterns: z.array(z.string()).default([]),
  debug_guides: z.array(z.string()).default([]),
  ```
- Keep `packages`/`models`/`cheatsheets` exactly as-is (still required, no default).
- Do NOT add `decision_guides` or `principles` at step level — explicitly out
  of scope for this task; those relationships belong at the whole-resource
  level only.
- Verify `WorkflowStepList.tsx`'s existing `typeMap` inside `renderAllUses`
  already has entries for `patterns`/`debug_guides` (it should, per prior
  inspection) — if missing, add them; do not duplicate if already present.

**Acceptance Criteria:**
- `npm run validate` passes with zero new errors on all existing content.
- A test step JSON with `uses.patterns: ["some-pattern-id"]` validates and
  renders a resolved pattern badge using the existing rendering path.
- Existing `build-rag-system.json`, `rag-evaluation-harness.json`, and
  `vector-database-setup-indexing-strategy.json` all still validate unchanged.

---

### Task 8 — Medium: Starter Stack badges via shared component
**File:** `page.tsx`

- Replace the hand-rolled `<span>` per Starter Stack tool with a
  resolve-then-render pattern: check `contentExists('package', tool)` then
  `contentExists('model', tool)` (same order of preference as elsewhere in
  this file), render via `ContentTypeBadge` wrapped in a `Link` when resolved,
  plain `ContentTypeBadge` otherwise.

**Acceptance Criteria:**
- Starter Stack tools matching an existing package/model are clickable and
  navigate correctly.
- Unmatched tools render visually identically to today, just via the shared
  component instead of a hand-rolled span.

---

### Task 9 — Medium: Visible Production Profile sub-navigation
**File:** `page.tsx`

- Inside the expanded Production Profile panel, above the five sub-sections,
  add a small pill row with one pill per **populated** sub-field (skip pills
  for fields that are empty/absent), each linking to its existing anchor
  (`#production-deployment`, etc.), styled consistently with existing pill
  patterns elsewhere on the page (Starter Stack, Next Workflow).

**Acceptance Criteria:**
- Clicking a pill scrolls smoothly to the corresponding sub-section (reuses
  the existing `scroll-mt-24` + anchor ids already in place — no new scroll
  logic needed).
- No pill appears for a sub-field that has no content.

---

## Validation Checklist
- [ ] `npm run build` completes with zero errors.
- [ ] `npm run validate` passes with zero new schema errors on all workflow content.
- [ ] `npm run lint` (or equivalent) passes with no new warnings introduced by
      the new `parseLabeledClauses.ts` file or any modified file.
- [ ] TypeScript compiles cleanly, including the `hidden="until-found"` typing
      resolution from Task 1 — confirm no `any` leaks beyond the single,
      documented, narrowly-scoped instance if one was needed.

## Regression Checklist
- [ ] `build-rag-system.json` renders visually identically wherever no new
      optional field (Task 7) is populated — side-by-side screenshot check.
- [ ] Step 1's default-open behavior is unchanged.
- [ ] The existing hash-deep-link behavior for the Production Profile
      (`#production`, `#production-cost`, etc.) still works after Task 1 and
      Task 9's changes — test both a bare `#production` link and a
      sub-field-specific `#production-cost` link.
- [ ] Dark mode: spot-check all changed components in dark mode (the app
      supports it via `dark:` classes) — Task 4's clause labels and Task 9's
      pill row in particular.
- [ ] Keyboard-only pass: tab through the full page after Task 1/Task 9
      changes; confirm no dead-ends, confirm the new pill row (Task 9) and
      any newly-focusable elements are reachable and operate via Enter/Space.
- [ ] Screen reader spot check: confirm `aria-expanded` announces correctly
      after a find-triggered reveal (Task 1), not just after a manual click.
- [ ] Responsive pass at 375px, 768px, 1024px, 1280px, 1440px, 1920px —
      confirm Task 5's three-tier ToC behavior and Task 3's line-length
      constraint at the wide end.
- [ ] Re-run Task 2's specific test against both newly-added workflows
      (`rag-evaluation-harness`, `vector-database-setup-indexing-strategy`),
      not just `build-rag-system`.
```
