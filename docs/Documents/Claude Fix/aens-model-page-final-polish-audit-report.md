# AENS Model Detail Page — Final Polish Audit & Windsurf Prompt Package

**Scope:** Model Detail Page, post-implementation of both prior audit rounds
**Commit inspected:** `7af1f7a` ("implement model page audit fixes with markdown, math, and syntax highlighting"), diffed against `770f00e` to isolate this round's changes; all six issues re-verified against the live current state of the codebase, not the diff alone
**Method:** Direct commit diff, byte-level inspection of `data/models/**`, and a live Shiki render (`codeToHtml`) executed in this environment to get exact hex values for the "double background" claim, rather than inferring it.

---

## 1. Executive Summary

Five of the six issues are confirmed, concrete, and small in scope — each is a single component or a single CSS rule away from resolved, and none require touching architecture, schema, or routing. The sixth (Also Worth Knowing / Related Content) is a genuine design question rather than a bug, and the recommendation below is to clarify and lightly connect the two, not merge or redesign them.

The standout finding: **`ModelDecisionStrip.tsx` was never touched by either of the last two audit rounds.** Both previous rounds correctly rolled `Prose`/`ProseInline` out across `page.tsx` and `ModelCollapsibleSections.tsx`, but `ModelDecisionStrip.tsx` — a third, separate component that independently renders `decisionsummary.interpretability` — was out of scope both times and still does raw `{interpretability}` string interpolation. For `logistic-regression.json`, that field contains real LaTeX (`$w_j$`, `$e^{w_j}$`), so the "Interpretability & Explainability Profile" callout still shows literal dollar signs and backslashes. This isn't a flaw in the markdown/math pipeline built over the last two rounds — the pipeline works correctly everywhere it's been applied. It's a coverage gap: one component was missed.

The "double background" in the code block is confirmed with exact color values: the outer wrapper uses Tailwind's `bg-zinc-950` (`#09090b`) while Shiki's `github-dark` theme independently sets its own inline `background-color:#24292e` on the `<pre>` it generates — two different dark shades stacked, producing a visible inner rectangle. This is a one-line CSS override away from resolved.

The collapse-state scroll jump has a precise, evidence-backed mechanism: expanding the code block removes any height cap, so reading through a long snippet scrolls the whole page down by however many pixels the extra lines add. Collapsing then shrinks that same region abruptly with no compensating scroll adjustment anywhere in `CodeBlockInteractive.tsx` — if the browser's prior scroll offset no longer fits the shorter document, it clamps to the new maximum, which lands the viewport at or near the bottom of the page. This matches the reported symptom exactly and has a standard, well-known fix (capture and restore the anchor element's viewport position across the mutation).

---

## 2. Current Implementation Review

Confirmed via direct inspection of the current (`7af1f7a`) state:

- **`Prose.tsx`** — server-renderable (no `'use client'`), wraps `react-markdown` + `remark-gfm` + `remark-math` + `rehype-katex`, and now includes a `normalizeContent()` pre-pass that fixes literal double-escaped `\n` sequences before parsing. This is working correctly everywhere it's used.
- **`CodeBlock.tsx`** — now an `async` Server Component; calls Shiki's `codeToHtml` at render time for both the full and the 20-line-collapsed variants, passing pre-rendered HTML strings down. No client-side Shiki execution occurs. This is the intended, build/server-time approach.
- **`CodeBlockInteractive.tsx`** — `'use client'`, owns only `copied`/`isExpanded` state and the two highlighted-HTML strings it was given; single collapse mechanism (20-line slice, no competing CSS height cap); both the mobile horizontal-scroll fade and the collapsed-state vertical fade are present.
- **`globals.css`** — has a `body .katex { font-size: 1em !important; }` override (resolves the prior round's "math looks larger" finding) and a pure-CSS line-numbers implementation via `counter()` targeting Shiki's `.line` spans (a clean, dependency-free way to restore the previously-removed line-number feature).
- **`ModelDecisionStrip.tsx`** — **not touched by either prior round.** Still renders `{interpretability}` as a raw string in a plain `<p>`. This is the one real coverage gap found in this pass.
- **`ModelCollapsibleSections.tsx`**'s Core Understanding teaser — now a computed count (`"6 specifications · N assumptions noted"`) routed through `ProseInline`, matching every other section's pattern. Confirmed fixed correctly.
- **"Also Worth Knowing"** (`ModelCollapsibleSections.tsx`, the last collapsible section, id `related-knowledge`-equivalent) renders `model.relatedknowledge.*` — plain display-name strings, grouped by category, as non-clickable `<span>` chips.
- **"Related Content"** (`RelatedContent.tsx`, always-visible, below all collapsible sections) renders `getRelatedContent()`'s output — `model.relatedcontent` typed refs plus same-category/same-problem-type model siblings — as clickable `<Link>`s, filtered through `contentExists()` so only resolvable pages appear.

---

## 3. Root Cause Analysis (per issue)

### Issue 1 — "Interpretability & Explainability Profile" still broken

**This is a UI/rendering-layer problem, not a content-layer problem.** Confirmed root cause: `components/shared/ModelDecisionStrip.tsx:138` renders `<p className="...">{interpretability}</p>` — a raw string interpolation, never routed through `Prose`/`ProseInline`. This component was simply not included in either of the last two rounds' `Prose` rollout (both rounds touched `page.tsx` and `ModelCollapsibleSections.tsx`, not this file). Confirmed data: `data/models/ml/logistic-regression.json`'s `decisionsummary.interpretability` contains `$w_j$` and `$e^{w_j}$` — real LaTeX that renders as literal text today.

**Secondary, content-layer observation (worth flagging, not fixing here):** `linear-regression.json`'s equivalent field writes the same kind of statement in plain-ASCII notation (`"coefficient beta_j"`, `"feature x_j"`) rather than LaTeX, while `logistic-regression.json` uses real LaTeX for conceptually the same kind of sentence. This is a content-authoring consistency question (should all models express this field the same way?) — separate from, and not blocking, the rendering fix.

### Issue 2 — Code Block UI/UX

The current implementation (server-rendered Shiki, single collapse mechanism, restored line numbers via CSS counters, restored mobile fade) is substantially improved from the prior round and is close to premium-docs quality. Two concrete gaps remain relative to Stripe/Vercel/Linear-caliber code blocks:
- The **double background** (see Issue 3) undermines the "single cohesive block" feel these products all share.
- The **copy button and language badge** sit in a fairly plain header bar (`bg-zinc-900/50`) with no visual separation of concerns beyond a single bottom border — comparable products typically give the header a very slightly distinct treatment (subtle shadow or extra padding) so it doesn't visually compete with the code below it — this is a minor, optional polish, not a defect.
- No language-icon (Python logo, bash icon, etc.) is used alongside the text label — most premium docs (Stripe, Vercel) pair a small language glyph with the label. Purely optional.

### Issue 3 — Double Background Inside Code Block

**Confirmed with exact values, not inferred.** A live render of `codeToHtml('print(1)', { lang: 'python', theme: 'github-dark' })` in this environment produces:

```html
<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" ...>
```

Shiki's `github-dark` theme sets its **own** inline `background-color:#24292e` on the `<pre>` it generates. Meanwhile `CodeBlockInteractive.tsx`'s outer wrapper independently sets `bg-zinc-950` (Tailwind's `#09090b`). Two different dark shades are stacked — the outer container's near-black `#09090b` and Shiki's lighter GitHub-gray `#24292e` — producing a visible rectangular seam around the code area. Root cause is simply that nothing in the codebase overrides Shiki's theme-supplied background, so both the custom card chrome and Shiki's own theme each contribute a background color.

### Issue 4 — Collapse State Instability (scroll jump)

**Confirmed mechanism, not a hack-requiring-a-hack:** When `isExpanded` is `true`, the code region has no height cap (by design, so "Show Less"/"Show More" fully reveals content in normal document flow) — reading a long snippet means scrolling the whole page down proportionally to the extra content. When the user then clicks "Show Less," React swaps `displayHtml` from `fullHighlighted` back to `collapsedHighlighted`, and the surrounding `<div>`'s rendered height collapses abruptly — often by thousands of pixels for a long snippet. Nothing in `CodeBlockInteractive.tsx` compensates for this: there is no `overflow-anchor` CSS control, and no code captures the pre-collapse scroll position relative to any stable element. If the browser's current scroll offset no longer fits within the new, much shorter document height, the browser clamps the scroll position to the new maximum — which lands the viewport at (or very near) the bottom of the page, exactly matching the reported "jumps toward the bottom" symptom, rather than a jump to a random or top position.

This is a well-known category of bug (collapsing content above/at the current viewport without adjusting scroll), and it has a standard, non-hacky fix: capture the anchor element's (e.g. the "Show Less" button, or the code block's top edge) position relative to the viewport immediately before the state change takes effect, then after the DOM updates, adjust `window.scrollBy` by the difference so that same element stays in the same visual position. This is exactly the technique used by chat apps and infinite-scroll feeds when content is inserted/removed above the viewport, and is fully doable in a `useLayoutEffect` with no external dependency.

### Issue 5 — "Also Worth Knowing" Card

**This is a content-ownership/duplication question, not a rendering defect.** Confirmed via `svm.json`: `relatedknowledge.alternative_models` includes `"Logistic Regression"` and `"Random Forest"` — both of which are real, existing pages in this same `ml` category (`data/models/ml/logistic-regression.json`, `data/models/ml/random-forest.json` both exist). "Also Worth Knowing" renders these as **inert, non-clickable** text chips (`<span>`, no `href`). Meanwhile, `RelatedContent.tsx` (further down the same page) independently computes `sameCategory`/`sameProblemType` model siblings via `getRelatedContent()` and is very likely **already surfacing Logistic Regression and Random Forest a second time**, this time as clickable links. The likely outcome on the live SVM page: the same two model names appear twice, once dead and once live.

This doesn't mean the two sections should be merged — they're backed by genuinely different schema fields with different intents (`relatedknowledge` is free-text terminology/awareness content that may reference things without pages; `relatedcontent`/category-siblings is confirmed-navigable). The fix is narrower: where a `relatedknowledge` chip's text happens to match the name of a real, existing page, it should link to it (reusing the same `getContentPath`/`contentExists` helpers `RelatedContent.tsx` already uses) rather than rendering as static text. Where no match exists, it correctly stays a plain chip.

### Issue 6 — Related Content Card

No defect found. `RelatedContent.tsx` is compact, responsive (`flex-wrap`), positioned consistently at the very end of the page content (after the collapsible accordion and learning/official resources), and only renders items confirmed to exist via `contentExists()`. Its visual weight (small badge + text chips) is appropriately lighter than the main collapsible sections, which is correct for a "see also" footer treatment. No changes recommended here beyond the cross-link fix described in Issue 5, which touches `ModelCollapsibleSections.tsx`, not this component.

---

## 4. Additional Issues Discovered

- **`CodeBlockInteractive.tsx`'s expand/collapse button has no `aria-expanded`.** `CollapsibleSection`'s accordion buttons correctly set `aria-expanded={open}`; the Quick Start code block's own "Show More/Show Less" button does not carry the equivalent attribute, so screen-reader users get no programmatic indication of the current state beyond the visible label text.
- **`CollapsibleSection`'s button has no `aria-controls`** pointing at its content region's id, and the content region itself has no id — a minor but real accessibility gap: assistive tech can't programmatically associate the toggle with what it toggles, even though the button/label/expanded-state semantics are otherwise solid.
- **`coreTeaser`'s "6 specifications" is a hardcoded literal**, not derived from the specs array's actual length. It happens to be correct today because the specs grid always renders exactly 6 fixed fields per the schema, but it's a magic number that would silently go stale if a 7th spec field were ever added to the grid without updating this string.

---

## 5. UI/UX Recommendations

1. Route `ModelDecisionStrip`'s `interpretability` prop through `ProseInline`, exactly as already done in `ModelCollapsibleSections.tsx` and `page.tsx` — closes the coverage gap directly.
2. Override Shiki's inline background with a single scoped CSS rule so only the outer card chrome's background shows.
3. Add scroll-position compensation to `CodeBlockInteractive`'s collapse toggle.
4. Cross-link "Also Worth Knowing" chips to real pages where they resolve, leaving non-resolving entries as plain text.
5. Add `aria-expanded`/`aria-controls` to the two remaining interactive toggles that lack them.

---

## 6. Performance Impact Analysis

All five recommended fixes are presentation-layer only:
- Issue 1's fix (wrap one more field in `ProseInline`) has the same negligible server-render cost already paid everywhere else `Prose` is used — no new client JS.
- Issue 3's fix is a pure CSS rule addition — zero runtime cost.
- Issue 4's fix (scroll compensation) is a small `useLayoutEffect` reading `getBoundingClientRect()` and calling `window.scrollBy` — negligible, synchronous, no new dependency, and only runs on the (already-existing) expand/collapse click, not on every render.
- Issue 5's fix reuses `getContentPath`/`contentExists`, which already exist and are already called once per page for `RelatedContent` — extending their use to `ModelCollapsibleSections.tsx` adds a bounded number of lookups (at most the count of `relatedknowledge` items, typically under 30 across all categories) at render time, not a new data-fetching pattern.
- None of the above adds a new dependency, moves any currently-server-rendered work to the client, or increases the client bundle.

---

## 7. Regression Risk Assessment

| Fix | Risk | Why |
|---|---|---|
| Issue 1 (Prose in ModelDecisionStrip) | Low | Identical pattern already proven correct in two other components |
| Issue 3 (CSS background override) | Low | Single scoped rule; verify it doesn't affect other Shiki-highlighted surfaces if any exist elsewhere in the app (check `CheatsheetEntry.tsx`/`PackageTaskList.tsx`, both touched in this same commit per the diff) |
| Issue 4 (scroll compensation) | Medium | Scroll-position code is easy to get subtly wrong (wrong ref, wrong timing relative to paint) — needs careful manual QA across at least two viewport sizes, not just a compile check |
| Issue 5 (cross-linking chips) | Low-Medium | Must not silently change `relatedknowledge`'s data shape or the frozen schema — purely a rendering-time lookup; watch for chips whose text loosely matches an unrelated page (name collisions) producing an incorrect link |

---

## 8. Priority Matrix

| # | Issue | Impact | Effort | Risk | Priority |
|---|---|---|---|---|---|
| 1 | Interpretability field bypasses Prose | High (visibly broken math on at least one live model page) | Low | Low | **Critical** |
| 2 | Double background in code block | Medium-High (visual polish, very visible) | Low | Low | **High** |
| 3 | Collapse scroll jump | Medium-High (breaks reading continuity) | Medium | Medium | **High** |
| 4 | Also Worth Knowing dead links / duplication | Medium | Low-Medium | Low-Medium | **Medium** |
| 5 | Missing aria-expanded/aria-controls | Low-Medium (accessibility) | Low | Low | **Medium** |
| 6 | Hardcoded "6 specifications" magic number | Low | Trivial | None | **Future** |

---

## 9. Windsurf Prompt #1 — Fix Interpretability & Explainability Rendering

### Objective
Route `ModelDecisionStrip`'s `interpretability` content through the existing `ProseInline` component so it renders identically to every other markdown/math-bearing field on the page.

### Root Cause
`components/shared/ModelDecisionStrip.tsx` was not included in either prior round's rollout of `Prose`/`ProseInline`. Line 138 currently renders `<p className="text-foreground leading-relaxed font-sans font-medium">{interpretability}</p>` — raw string interpolation. `data/models/ml/logistic-regression.json`'s `decisionsummary.interpretability` field contains real LaTeX (`$w_j$`, `$e^{w_j}$`) that displays as literal text today. This is a coverage gap, not a defect in the shared rendering pipeline, which is already correct elsewhere.

### Files to Inspect
- `components/shared/ModelDecisionStrip.tsx` (full file, especially line 138)
- `components/shared/Prose.tsx` (confirm `ProseInline`'s exact export signature/props before using it)
- `app/models/[category]/[id]/page.tsx` (confirm how `interpretability` is passed into `ModelDecisionStrip` today — no change needed here, just confirming the prop chain)

### Files to Modify
- `components/shared/ModelDecisionStrip.tsx`

### Exact Implementation Strategy
1. Import `ProseInline` from `./Prose` into `ModelDecisionStrip.tsx`.
2. Replace `<p className="text-foreground leading-relaxed font-sans font-medium">{interpretability}</p>` with `<ProseInline content={interpretability} className="text-foreground leading-relaxed font-sans font-medium" />`, matching the exact pattern already used for `value` in `ModelCollapsibleSections.tsx`'s specs grid.
3. No other lines in this component need to change — the pill row (`stability`/`confidence`/`engineeringMaturity`/`difficulty`) uses short enum-style values with no markdown risk and is out of scope for this fix.

### Performance Constraints
None beyond what `ProseInline` already costs everywhere else it's used — this is a one-field addition to an already-proven pattern, not a new rendering path.

### Accessibility Considerations
No change to this component's accessibility surface — it remains a static, non-interactive callout; `ProseInline`'s output (an inline-safe span/paragraph swap) doesn't introduce any new focusable elements.

### Regression Checklist
- [ ] `tsc --noEmit`, `npm run lint`, `npm run build` pass.
- [ ] Confirm `logistic-regression.json`'s Interpretability & Explainability Profile callout renders `$w_j$` and `$e^{w_j}$` as properly typeset inline math, not literal text.
- [ ] Confirm all other 3 existing models' Interpretability callouts (which use plain-ASCII notation, no LaTeX) render identically to before — this is the regression check proving the change is additive.
- [ ] Confirm the callout's existing spacing/typography/icon layout is unchanged — only the text-rendering method changed.

### Acceptance Criteria
Every model's Interpretability & Explainability Profile callout renders any embedded markdown/LaTeX correctly, with zero visual change for models whose field contains plain prose.

---

## 10. Windsurf Prompt #2 — Fix the Double Background in the Code Block

### Objective
Make the Quick Start code block read as a single, cohesive surface by removing the visible seam between the outer card's background and Shiki's own theme-supplied background.

### Root Cause
Shiki's `github-dark` theme sets its own inline `background-color:#24292e` on the `<pre>` element it generates via `codeToHtml`. `CodeBlockInteractive.tsx`'s outer wrapper independently sets Tailwind's `bg-zinc-950` (`#09090b`). Both are applied simultaneously — the outer card shows near-black, and the Shiki-rendered inner region shows a distinctly lighter gray, producing a visible rectangle-within-a-rectangle effect. Confirmed via a live `codeToHtml` render in this environment (see report body, Issue 3).

### Files to Inspect
- `components/shared/CodeBlockInteractive.tsx` (the `dangerouslySetInnerHTML` container and its surrounding wrapper's classes)
- `components/shared/CodeBlock.tsx` (confirm the exact theme string passed to `codeToHtml`, currently `'github-dark'`)
- `app/globals.css` (where to add the override rule)
- `components/shared/CheatsheetEntry.tsx` and `components/shared/PackageTaskList.tsx` (both were touched in the same commit that introduced server-side Shiki — confirm whether either also renders Shiki output and would be affected by a global override, since the fix should be scoped correctly either way)

### Files to Modify
- `app/globals.css` (primary fix)
- Optionally `components/shared/CodeBlockInteractive.tsx` if a class-based scoping hook is needed rather than a bare global selector

### Exact Implementation Strategy
1. Add a scoped CSS rule targeting Shiki's output class directly: `.shiki, .shiki pre { background-color: transparent !important; }` in `app/globals.css`. This overrides Shiki's inline style (an external stylesheet rule with `!important` beats a non-`!important` inline style) without needing to change how `codeToHtml` is called.
2. Verify this rule is scoped tightly enough (`.shiki` is Shiki's own root class, always present on its output) that it doesn't need any additional wrapper class to avoid collateral effects elsewhere.
3. If `CheatsheetEntry.tsx` or `PackageTaskList.tsx` also render Shiki output inside their own differently-colored containers, confirm the same transparent-background treatment is correct for them too (it should be, since the goal — "let the surrounding component's own background show through" — is the same in all three places), rather than special-casing the Model Detail Page only.
4. No change needed to the theme choice (`github-dark`) itself — only its background layer is being suppressed; text/token colors from the theme remain untouched.

### Performance Constraints
None — this is a pure CSS addition with zero runtime cost.

### Accessibility Considerations
None — purely visual; confirm text contrast is still sufficient against the outer `bg-zinc-950` once Shiki's own background is removed (Shiki's token colors were chosen against `#24292e`; verify against `#09090b` they remain readable — they should, since `#09090b` is darker, increasing contrast rather than reducing it, but a quick visual spot-check is still warranted).

### Regression Checklist
- [ ] `npm run build` passes.
- [ ] Visual check: Quick Start code block shows one continuous background color, no visible inner rectangle.
- [ ] Visual check: any other page using `CheatsheetEntry.tsx`/`PackageTaskList.tsx`'s Shiki-highlighted output is checked for the same fix, not just the Model Detail Page.
- [ ] Confirm dark mode and light mode both look correct (the code block itself is intentionally always dark-themed regardless of site theme — confirm this remains intentional and consistent).

### Acceptance Criteria
The code block appears as a single cohesive surface with no visible seam between outer chrome and highlighted code, on both the Model Detail Page and any other page rendering Shiki output.

---

## 11. Windsurf Prompt #3 — Fix Collapse-State Scroll Jump

### Objective
Preserve the user's visual reading position when collapsing an expanded Quick Start code block, instead of the viewport jumping toward the bottom of the page.

### Root Cause
`CodeBlockInteractive.tsx`'s expanded state has no height cap — a long snippet fully expands in normal document flow, and reading it scrolls the whole page down proportionally. Clicking "Show Less" swaps back to the 20-line collapsed HTML, shrinking the rendered region's height abruptly by potentially thousands of pixels, with no compensating scroll adjustment anywhere in the component and no `overflow-anchor` CSS control set. If the browser's current scroll offset no longer fits the new, shorter document, it clamps to the new maximum scrollable position — landing the viewport at or near the bottom of the page, matching the reported symptom exactly.

### Files to Inspect
- `components/shared/CodeBlockInteractive.tsx` (the `isExpanded` toggle and the button that triggers it)
- Confirm no other component up the tree (`ModelCollapsibleSections.tsx`, `ContentPageLayout.tsx`) sets `overflow-anchor` or any competing scroll-management behavior that this fix would need to coordinate with

### Files to Modify
- `components/shared/CodeBlockInteractive.tsx`

### Exact Implementation Strategy
1. Add a `useRef` to the "Show More/Show Less" button (or the code block's outer wrapper `<div>`).
2. In the toggle handler (or in a `useLayoutEffect` keyed on `isExpanded`), before the DOM updates take visual effect: capture the anchor element's current `getBoundingClientRect().top` (its position relative to the viewport).
3. After the state change triggers a re-render (inside the same `useLayoutEffect`, which runs synchronously after DOM mutations but before paint), read the anchor element's new `getBoundingClientRect().top` and compute the delta between the "before" and "after" values.
4. Call `window.scrollBy({ top: delta, behavior: 'instant' })` (or set `window.scrollTop` directly) to compensate, so the anchor element — and therefore the user's reading position — stays visually stationary across the collapse/expand transition.
5. Implement this with `useLayoutEffect` (not `useEffect`) specifically, since it must run before the browser paints the new layout, to avoid any visible flash of the uncompensated scroll position.
6. Do not attempt to use `overflow-anchor: none` as a workaround — that would disable a browser feature that's otherwise helpful elsewhere on the page; this fix should be scoped to this component's specific state transition, not a page-wide CSS change.

### Performance Constraints
Negligible — this only runs on the (already-existing) user-initiated expand/collapse click, uses no new dependency, and involves one layout read and one scroll write per toggle.

### Accessibility Considerations
- While implementing this, also add `aria-expanded={isExpanded}` to the "Show More/Show Less" button (currently missing — see Additional Issues Discovered), since this is the same interactive element being modified and it's a small, related fix worth bundling.
- Ensure the scroll compensation doesn't interfere with keyboard-triggered toggles (Enter/Space on the focused button) — test with keyboard-only navigation, not just mouse clicks, since focus position and scroll position need to remain consistent for keyboard users too.

### Regression Checklist
- [ ] `tsc --noEmit`, `npm run lint`, `npm run build` pass.
- [ ] Manual QA: expand a long code snippet, scroll down to read the middle/end of it, click "Show Less" — confirm the viewport stays on the same visual content (or the nearest still-visible content) rather than jumping to the bottom of the page.
- [ ] Repeat the same test triggering the toggle via keyboard (Tab to focus, Enter/Space to activate).
- [ ] Test on both desktop and mobile viewport widths — confirm the fix behaves consistently at both.
- [ ] Confirm expanding (not just collapsing) doesn't introduce a new, opposite jump — the compensation logic should work symmetrically in both directions.

### Acceptance Criteria
Collapsing an expanded code block preserves the user's visual reading position; the viewport does not jump to the bottom (or anywhere else unexpected) as a result of the height change.

---

## 12. Windsurf Prompt #4 — Cross-Link "Also Worth Knowing" Chips to Existing Pages

### Objective
Where a chip's text in the "Also Worth Knowing" section matches the name of a page that actually exists on the site, make it a real link instead of inert text — closing the gap where the same item can appear once as a dead chip and once as a live link in "Related Content" on the same page.

### Root Cause
`ModelCollapsibleSections.tsx`'s "Also Worth Knowing" section renders `model.relatedknowledge.*` (free-text display-name strings, e.g. `"Logistic Regression"`, `"Random Forest"` in `svm.json`'s `alternative_models`) as plain non-clickable `<span>` chips. `RelatedContent.tsx`, further down the same page, independently computes same-category/same-problem-type model links via `getRelatedContent()` and very likely surfaces the same models a second time — this time as clickable links. The result: some items appear twice on the page with inconsistent interactivity for no discernible reason to the reader.

### Files to Inspect
- `components/shared/ModelCollapsibleSections.tsx` (the `relatedKnowledgeSections` render block, lines ~514-531 in the current file)
- `components/shared/RelatedContent.tsx` (the existing `getContentName`/`getContentPath`/`contentExists`-based pattern to reuse)
- `lib/data.ts` (`getContentName`, `getContentPath`, `contentExists` — confirm exact signatures and what `type`/`id` values they expect, since `relatedknowledge` entries are display names like `"Logistic Regression"`, not slugs like `logistic-regression` — a name-to-slug resolution step is needed)
- `data/models/**/*.json` (spot-check a few more `relatedknowledge.relatedmodels`/`alternative_models` arrays across categories to confirm how consistently display names correspond to real slugs, before assuming a simple string-match will work everywhere)

### Files to Modify
- `components/shared/ModelCollapsibleSections.tsx`
- Possibly `lib/data.ts` if a new small helper (e.g. `findModelBySlugifiedName`) is needed to resolve a display name like `"Logistic Regression"` to the slug `logistic-regression` and confirm it exists via the category's model list

### Exact Implementation Strategy
1. Add a small resolution helper (in `lib/data.ts` or locally in `ModelCollapsibleSections.tsx`) that takes a display-name string (e.g. `"Logistic Regression"`) and the current model's category, slugifies it (lowercase, spaces to hyphens), and checks whether a model with that slug exists in the same category via the existing `getAllModels`/`contentExists`-style helpers already used by `RelatedContent.tsx`.
2. Only attempt this resolution for the `relatedmodels` and `alternative_models` groups specifically (these are the ones most likely to correspond to real model pages); leave `related_principles`, `related_workflows`, `related_patterns`, `related_packages`, `related_guides`, `related_registry` as plain text unless/until those content types are confirmed to have a similarly reliable name-to-route mapping — don't over-generalize the fix to categories where a false-positive link (linking to the wrong page due to a name collision) is more likely.
3. Where resolution succeeds, render the chip as a `<Link>` (matching `RelatedContent.tsx`'s existing visual treatment for consistency) instead of a `<span>`; where it fails, keep the current plain-text chip exactly as-is.
4. Do not attempt to de-duplicate chips against `RelatedContent.tsx`'s output across components (that would require passing computed state between two independent components and add real complexity for a cosmetic win) — simply making the matching chips clickable resolves the main complaint (a page that's one click away shouldn't render as dead text) without requiring the two sections to know about each other.

### Performance Constraints
The resolution check is a bounded, in-memory lookup against already-loaded model lists (via existing cached helpers) — no new network/file I/O per chip, and the total chip count per model is small (typically under 30 across all `relatedknowledge` categories combined).

### Accessibility Considerations
Ensure resolved chips rendered as `<Link>` retain the same visible affordance as `RelatedContent.tsx`'s links (hover/focus states, not just a color change) so keyboard and low-vision users can tell which chips are interactive — don't rely on color alone to distinguish a linked chip from a plain one; consider a subtle non-color cue (e.g., a small icon) consistent with how `RelatedContent.tsx` already differentiates its own linked vs. non-linked items via `ContentTypeBadge`.

### Regression Checklist
- [ ] `tsc --noEmit`, `npm run lint`, `npm run build` pass.
- [ ] Confirm `svm.json`'s "Also Worth Knowing" → Alternative Models now links "Logistic Regression" and "Random Forest" to their real pages, while non-existent entries (e.g. `"XGBoost"`, if no such page exists in this repo) remain plain text.
- [ ] Confirm no incorrect link is produced for a name that superficially resembles a real page but isn't actually a match (spot-check a few models manually, don't assume the slugify-and-match logic is airtight without a check).
- [ ] Confirm this change doesn't alter `data/models/**` or any schema — it's a rendering-time lookup only.

### Acceptance Criteria
Any "Also Worth Knowing" chip whose text corresponds to a real, existing page becomes a working link; all other chips remain unchanged plain text, with no false-positive links introduced.

---

## 13. Final Recommended Implementation Order

1. **Prompt #1 (Interpretability rendering)** — smallest, most isolated, highest-visibility content-correctness fix; do this first.
2. **Prompt #2 (double background)** — small, purely visual, no interaction with the other fixes; do this second as a quick, low-risk win.
3. **Prompt #3 (scroll jump)** — the most implementation-sensitive fix (requires careful manual QA across input methods and viewport sizes); do this third, once the simpler wins are banked, so it gets full attention.
4. **Prompt #4 (Also Worth Knowing cross-linking)** — do this last; it's the most exploratory of the four (requires spot-checking data patterns across categories before finalizing the resolution logic) and its outcome doesn't affect or get affected by the other three.

After each step: run `npm run validate`, `tsc --noEmit`, `npm run lint`, and `npm run build`, per the existing gated workflow, with particular attention to manual visual/interaction QA for Prompt #3, which cannot be fully verified by automated checks alone.
