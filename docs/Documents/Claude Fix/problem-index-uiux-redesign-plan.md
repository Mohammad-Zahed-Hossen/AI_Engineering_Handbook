# Problem Index — Production-Grade UI/UX Redesign Plan

**Scope:** `app/problem-index/page.tsx`, `app/problem-index/ProblemIndexDashboard.tsx` only
**Type:** UI/UX only — no architecture, schema, routing, or content-model changes
**Basis:** Direct read of the current implementation (both files, in full)

---

## Part 1 — Current UX Audit

| Area | Score (1–10) | Verdict |
|---|---|---|
| Visual Hierarchy | 4 | Everything competes at similar weight; no clear primary path |
| Information Density | 3 | Card is doing 8+ jobs at once with almost no breathing room |
| Card Design | 4 | Functionally complete, visually flat and cluttered |
| Search Experience | 6 | Solid mechanics, awkward "icon-collapse" affordance |
| Filter Experience | 5 | Powerful but presented as 5 equal-weight dropdowns with no grouping |
| Navigation (category jump/sticky) | 5 | Good idea, over-engineered 3-state animation adds jitter risk |
| Mobile Experience | 3 | Never designed for narrow width — everything just reflows |
| Desktop Experience | 6 | Usable, but no max-width/reading-column discipline |
| Visual Consistency | 4 | 6+ distinct micro-font sizes, inconsistent badge treatments |
| Accessibility | 3 | Broad `select-none`, unlabeled icon color coding, weak focus styling |

**Overall: 4.3 / 10 — functionally complete, presentation-layer needs a full pass.**

### 1. Visual Hierarchy
The page currently gives near-equal visual weight to: page title, a 4-metric stats bar, search, 5 filter dropdowns, active-filter chips, category jump chips, bulk toggle buttons, category headers, and then — three logical scroll-levels deep — the actual problem cards. A first-time user has to parse ~9 UI regions before reaching content. Nothing signals "this is the thing you came here for" versus "this is a control."

Inside each card, the same flatness repeats: problem name, status badge, solution-count badge, description, a 6-cell metadata grid, prerequisites, recommended solutions, decision guides, and a 5-category related-resources block are all rendered with comparable font weight/size (mostly 9–11px). The engineer cannot tell at a glance "where do I start" versus "what is this filed under."

### 2. Information Density
Every card renders a full 6-field metadata grid (`Problem Type / Input Modality / Complexity / Maturity / Coverage / Traits`) even when several values are redundant with badges already shown above (solution count, Active/Coming Soon). Cross-reference sections (Models/Patterns/Debug/Packages/Registry) each get their own icon+label+chip row even when a category is empty or has one item — there is no compaction for the common case.

Font sizes are mostly `text-[9px]`–`text-[11px]` throughout the card. This isn't "dense," it's just small — density should come from smart grouping and progressive disclosure, not from shrinking type until everything fits.

### 3. Card Design
The card layout, top to bottom, is:
name/aliases/badges → description → 6-cell metadata grid → prerequisites → recommended solutions (nested cards) → decision guides (nested cards) → related resources (5 sub-groups).

This is effectively **three cards stacked inside one card** (the problem itself, the workflow list, the decision-guide list) with a resource-tag cloud at the bottom. There's no visual anchor telling the eye "the answer to *where do I start* is right here" — the primary CTA (open a workflow) is visually identical in weight to a related-pattern chip.

### 4. Search Experience
Mechanically strong: debounced, URL-synced, keyboard-shortcut-enabled (`/`, `Ctrl+K`), highlights matches. UX-wise, the "icon state" — where the search box collapses to a bare icon button on scroll-down — is an unfamiliar pattern for a documentation-style tool. Users expect search to always be reachable in one motion, not two (click icon → wait → type). It also fully hides filters at the same time, so a user scrolling to browse loses filtering ability without warning.

### 5. Filter Experience
Five dropdowns (Type, Modality, Complexity, Maturity, Characteristics) are presented as equal, independent, unordered buttons in a `flex-wrap` row. There's no grouping by "how often would I use this" (Maturity and Complexity are used constantly; Characteristics is a power-user filter). Active-filter chips appear in a *separate* strip below, which means a user has to look in two places to understand current state. Reset only appears once a filter is active, which is fine, but it's the same visual weight as the sort control right next to it.

### 6. Navigation
Category "Jump To" chips + intersection-observer active state + sticky positioning is a good structural idea, but the three-state sticky behavior (`full` → `compact` → `icon`, with separate scroll thresholds and a 50ms timeout debounce) is complex enough to introduce visible jitter, and it fights with the filter-collapse threshold (`scrollY > 120`) which uses a different cutoff than the sticky-state thresholds (`40`/`200`). Two independent scroll-driven state machines on the same element is a maintenance and jank risk, and from a UX view it means controls appear/disappear at different scroll points than users expect.

### 7. Mobile Experience
No mobile-specific treatment exists — the stats bar drops to `grid-cols-2`, cards drop to 1 column, and filter dropdowns just wrap. On a narrow viewport, 5 filter buttons + sort + reset wrapping in a `flex-wrap` row can consume 3–4 lines before any content is visible, and the sticky region compounds this by staying pinned at the top. Tap targets on badges/chips (`px-1.5 py-0.2`, `text-[9px]`) are well under the ~44px comfortable tap target guidance.

### 8. Desktop Experience
No content max-width is enforced — the grid stretches to whatever the parent container allows, and at very wide viewports the 2-column card grid (`xl:grid-cols-2`) produces long, hard-to-scan card widths with no reading-width discipline on the description text.

### 9. Visual Consistency
Badge treatments are inconsistent: some badges are pill-shaped with `rounded-full`, others `rounded`/`rounded-md`/`rounded-lg`; opacity-based tinting (`/10`, `/5`, `/20`, `/30`, `/40`) is applied ad hoc rather than from a fixed token set; icon sizes range `w-2.5` to `w-5` with no clear size tier tied to hierarchy level.

### 10. Accessibility
- `select-none` is applied at multiple container levels, including around problem descriptions — an engineer cannot select/copy problem text, which is a real workflow cost on a reference tool.
- Maturity/Coverage rely on color alone (`text-emerald-600` etc.) with no icon or text-weight reinforcement beyond the label text itself already present — acceptable since the word is shown, but contrast on `text-muted-foreground` at 9–10px should be verified against WCAG AA at that size.
- No visible `focus-visible` treatment beyond the search input; buttons rely on default browser outline which is frequently suppressed by the surrounding CSS reset.
- Collapsible category regions correctly use `aria-expanded`/`aria-controls`, which is good — but the equivalent isn't done for the filter dropdowns (no `aria-expanded` on the filter trigger buttons).

---

## Part 2 — Redesign Strategy

**Principle: one primary path, everything else demoted.**
The primary path for this page is *Problem → Recommended Solution → Open*. Every other element (metadata, cross-references, prerequisites) is supporting context and should be visually subordinate to that path, not competing with it.

| Change | Why | Expected Improvement |
|---|---|---|
| Collapse the 4-metric stats bar into a single compact inline strip (or fold into the page header) | A KPI dashboard at the top of a navigation tool contradicts the stated "documentation-like, not dashboard" philosophy and pushes real content below the fold | Faster time-to-first-card, less scroll before content |
| Establish a 3-tier type scale (primary / secondary / tertiary) and apply it consistently instead of ad hoc `text-[9px]`–`text-[11px]` | Consistent scale = predictable scanning rhythm | Faster scanning, fewer distinct sizes to parse |
| Redesign the card into clear zones: Header → Summary → **Primary Action (solutions)** → Supporting metadata (collapsed by default or de-emphasized) → Cross-references (collapsed/secondary) | Currently all 8 blocks compete equally | User identifies "what to click" in under 2 seconds |
| Merge the metadata grid and status badges into one compact "fact strip," and drop fields that duplicate visible information | Complexity/Maturity/Coverage are informative; Traits and Problem Type/Modality are useful but currently equal-weighted with them | Same information, less area, faster to scan |
| Group filters by usage frequency (Primary: Maturity, Complexity — Secondary: Type, Modality, Characteristics in an overflow "More filters") and merge active-chip display into the filter row itself | Reduces the two-places-to-look problem and shortens the control row | Fewer wrapped rows on mobile, faster filter comprehension |
| Replace the 3-state icon-collapsing search with a single persistent compact search bar that never fully hides | Removes an unfamiliar interaction pattern and a state-machine race condition | Search is always one click away; removes jank risk |
| Unify the two independent scroll-state machines (filter-collapse threshold + sticky state) into one coordinated scroll controller with matched thresholds | Currently two different cutoffs (`120` vs `40/200`) drive different UI, which desyncs on fast scroll | Predictable, non-janky sticky behavior |
| Scope `select-none` to interactive chrome only (nav chips, buttons) and never to readable content (problem name/description) | Currently blocks text selection on content it shouldn't | Restores expected copy/select behavior on a reference tool |
| Add visible `focus-visible` rings to all interactive elements (buttons, chips, dropdown triggers) and `aria-expanded` to filter dropdown triggers | Matches the existing good practice already used on the category-collapse buttons | Keyboard users get consistent, visible focus feedback |
| Set a content max-width and single-column priority on mobile for filters (stacked, not wrapped inline) | Currently filters can consume several vertical rows on narrow viewports before any content shows | Faster mobile access to actual problems |

---

## Part 3 — Exact Component-Level Changes

### 3.1 Page Header (`page.tsx` — static header block)
**Current:** Title + one-line description in a bordered card, `text-xl` title, `text-xs` description.
**Proposed:** No structural change — this section is already appropriately minimal. Only adjust vertical spacing to sit closer to the search bar (currently separated by the full-width stats bar, which is being removed/relocated).
**Reason:** Already matches the "clean, documentation-like" philosophy; the noise is introduced by what follows it, not by this block itself.

### 3.2 Statistics Bar
**Current:** 4-cell grid (`Total Categories`, `Total Problems`, `Solutions Available`, `Largest Category`) in its own bordered/padded section, full width, always visible above the fold.
**Proposed:** Collapse into a single-line inline stat strip directly inside or beneath the header card (e.g., `128 problems · 94 with solutions (73%) · 9 categories`), non-boxed, small type, no separate section chrome.
**Reason:** A 4-card dashboard grid is the least "engineering-navigator" element on the page and is explicitly against the stated design philosophy ("avoid dashboards"). The information is useful as ambient context, not as a headline feature — one line preserves it without competing with search/filters for the top of the viewport.

### 3.3 Search Bar
**Current:** Full-width input that fully collapses into an icon-only button once `stickyState === 'icon'`, requiring a click + focus to reopen; visibility tied to same scroll state as filters.
**Proposed:** Persistent, always-visible compact search bar (single fixed height) that never collapses to icon-only. On scroll, only its *chrome* (border/shadow) may compact — the input itself stays present and typable at all times.
**Reason:** Search is the primary way engineers reach a problem when they know what they're looking for; hiding it behind an extra click contradicts "fast to scan, fast to reach." Existing keyboard shortcuts (`/`, `Ctrl+K`) remain fully valid and become even more discoverable once the box is always visible (the `kbd` hint stays visible instead of disappearing with the input).

### 3.4 Filter Row
**Current:** 5 independent dropdown buttons (Type, Modality, Complexity, Maturity, Characteristics) in one `flex-wrap` row, Reset button same row, Sort dropdown pushed right via `ml-auto`; active-filter chips rendered in a *separate* strip below.
**Proposed:** Two-tier grouping:
- **Primary row:** Maturity, Complexity, Sort (highest-frequency, decision-driving filters), plus Reset when active.
- **Secondary/overflow:** Type, Modality, Characteristics collapsed behind a single "More filters (n)" control that opens a panel with all three.
Active filter chips move *into* the same row area (directly adjacent to their trigger, or as a single inline summary next to "More filters") rather than a separate strip beneath.
**Reason:** Reduces the number of always-visible controls from 6 to 3–4, cuts vertical space on mobile, and removes the two-places-to-look problem for "what's currently active." Frequency-based grouping matches how engineers actually narrow a search (maturity/complexity first, edge-case traits second).

### 3.5 Category Navigation ("Jump To" chips)
**Current:** Horizontally scrollable chip row, active state driven by IntersectionObserver, sits inside the same sticky container as search/filters and disappears when `isFilterCollapsed` is true.
**Proposed:** Keep the mechanic (it's a good pattern for a long, categorized index) but decouple its visibility from the filter-collapse state — category chips should remain reachable independent of whether filters are expanded, since jumping to a category is a distinct, frequent action from filtering.
**Reason:** Currently, scrolling down for a few seconds hides category navigation entirely (tied to the same `isFilterCollapsed` flag as the bulk-action toolbar), which removes a wayfinding tool exactly when a user is deep in a long list and most likely to want it.

### 3.6 Bulk Actions (Expand All / Collapse All)
**Current:** Two full buttons with icon + label, positioned inline with the "Found N matching problems" counter, both disappear with the same collapse trigger as category chips.
**Proposed:** Demote to a single compact toggle ("Expand all / Collapse all," state-dependent single button) or icon-only pair with tooltips, positioned consistently near the category chip row rather than the results counter.
**Reason:** Two full-width labeled buttons for a secondary, infrequently-used bulk action currently take as much visual weight as the primary "how many results" signal next to them.

### 3.7 Category Section Header
**Current:** Icon + name + problem-count pill + solved/total counter + description, all on one header row with a chevron; already uses `aria-expanded`.
**Proposed:** No structural change — retain as is. Only normalize the count-pill and solved/total text to the unified type scale (Part 3.9) for consistency with the rest of the page.
**Reason:** This section already reads clearly and uses correct accessibility affordances; it's a template for how other regions should behave.

### 3.8 Problem Card — full redesign
**Current structure (top→bottom):** Name/aliases + status badge + solution-count badge → description → 6-cell metadata grid (Type/Modality/Complexity/Maturity/Coverage/Traits) → Prerequisites chip row → Recommended Solutions (nested workflow cards) → Decision Guides (nested cards) → Related Resources (5 icon-labeled chip groups).

**Proposed structure:**
1. **Header zone:** Problem name (primary weight) + aliases (de-emphasized, single line, truncate with "+n more" if long) + a single combined status/maturity indicator (fold "Active/Coming Soon" and "Maturity" into one badge — they currently express overlapping information).
2. **Summary zone:** Description, unchanged in content, but given a defined max line-length so it reads as a paragraph, not a run-on inside a narrow card.
3. **Primary action zone (new visual anchor):** The single most relevant solution (highest-maturity workflow) surfaced immediately below the description as a clear "Start here" row — name + Open action — everything else (additional workflows, decision guides) collapses under a "N more solutions" disclosure.
4. **Fact strip (compact, de-emphasized):** Complexity, Modality, and Traits condensed into one small inline row of plain labels (not a bordered grid) — Coverage and Maturity are already represented via the header badge, so they're not repeated here.
5. **Prerequisites:** Unchanged mechanically, but visually folded to appear only when non-empty and styled at the same de-emphasized tier as the fact strip.
6. **Related Resources:** Collapsed by default behind a single "Related resources (n)" disclosure rather than always-rendered 5-category chip cloud; expands in place on click.

**Reason:** This directly answers the stated navigator questions in visual order: *what problem* (header) → *is it worth pursuing* (badge) → *where do I start* (primary action) → *anything else I should know* (everything else, now opt-in). Collapsing related resources and secondary solutions by default is the single highest-leverage change for information density — it doesn't remove any existing feature, it just stops rendering all of it at once for every card, every time.

### 3.9 Typography Scale (applies across all of the above)
**Current:** At least 6 distinct sizes in active use (`text-[8px]`, `text-[9px]`, `text-[10px]`, `text-[11px]`, `text-xs`, `text-sm`), assigned inconsistently (e.g., some labels are `9px`, others functionally identical labels are `10px`).
**Proposed:** Consolidate to a 4-step scale: **Primary** (card titles, category names) / **Body** (descriptions) / **Label** (field labels, badges) / **Micro** (tag chips only, used sparingly). Every text element in the redesigned card maps to exactly one of these four.
**Reason:** A fixed scale is what makes a dense page still feel "clean" rather than "cramped" — right now density comes from shrinking type ad hoc; it should come from a disciplined, small set of sizes applied consistently.

### 3.10 Badge & Chip System
**Current:** Mixed corner radii (`rounded`, `rounded-md`, `rounded-lg`, `rounded-full`), inconsistent opacity tokens (`/5`, `/10`, `/20`, `/30`, `/40`) applied per-instance.
**Proposed:** Define two badge shapes only — **status pill** (`rounded-full`, used for maturity/active state) and **tag chip** (`rounded-md`, used for everything else: type, modality, cross-reference tags) — with one consistent tint scale (e.g., a single `/10` background + solid text token per semantic color).
**Reason:** Reduces visual noise from shape/opacity variation that currently carries no meaning (two `rounded` vs `rounded-lg` badges next to each other don't communicate anything different, they're just inconsistent).

### 3.11 Mobile Layout
**Current:** Filters wrap inline (`flex-wrap`), can consume multiple rows before content appears; stats grid drops to 2 columns; cards drop to 1 column with unchanged padding.
**Proposed:** On mobile, Primary filter row (3.4) stacks as a horizontally-scrollable single row (not wrapped) so it never exceeds one line; "More filters" opens as a full-height sheet rather than an inline dropdown; card internal padding and tap targets increase to meet a ~44px minimum for interactive elements (Open buttons, filter chips, disclosure toggles).
**Reason:** Wrapping controls currently cost several screen-heights of vertical space on mobile before a single problem card is visible; a horizontally-scrollable single-line filter bar is a well-understood mobile pattern that keeps controls reachable without pushing content down.

### 3.12 Focus & Keyboard
**Current:** Search input has `focus:ring-1`; most buttons/chips rely on default focus styling, filter dropdown triggers lack `aria-expanded`.
**Proposed:** Apply a consistent `focus-visible` ring token to every interactive element (buttons, chips, dropdown triggers, links inside cards); add `aria-expanded`/`aria-controls` to each filter dropdown trigger, matching the pattern already used correctly on category collapse buttons.
**Reason:** Extends an already-correct pattern (category header) to the rest of the interactive surface, closing a real keyboard-navigation gap without inventing new interaction models.

### 3.13 `select-none` Scope
**Current:** Applied at outer container level and inherited into regions containing problem names/descriptions.
**Proposed:** Remove from content-bearing containers; retain only on purely interactive chrome (nav chips, buttons, badges) where accidental text selection during clicking is the actual concern.
**Reason:** A navigator/reference tool should allow copying a problem name or description; the current blanket application is a regression against normal reference-page behavior.

---

## Part 4 — Implementation Plan

### Phase 1 — Structural De-clutter (Foundation)
- **Objective:** Remove/relocate the stats dashboard block; collapse it to a single inline stat line; unify the two competing scroll-state thresholds into one coordinated controller.
- **Files affected:** `page.tsx` (header/stats markup only), `ProblemIndexDashboard.tsx` (scroll-effect hooks, sticky container markup).
- **Exact UI changes:** Replace the 4-cell stats grid section with a single-line stat summary; merge the `isFilterCollapsed` threshold and the 3-state `stickyState` threshold logic into one scroll controller with matched breakpoints.
- **Regression risk:** Medium — touches the scroll-effect `useEffect` hooks directly; must preserve existing category active-state highlighting (IntersectionObserver) and the debounced search-to-URL sync, which are independent of this change but share the same component.
- **Complexity:** Medium.

### Phase 2 — Search & Filter Presentation
- **Objective:** Make search persistent (remove icon-collapse state); regroup filters into primary/overflow tiers; merge active-filter chips into the filter row.
- **Files affected:** `ProblemIndexDashboard.tsx` (sticky filter/search markup and the `stickyState`/`isSearchExpanded` state usage).
- **Exact UI changes:** Remove the icon-only search collapse branch; add a "More filters" trigger housing Type/Modality/Characteristics; move active-chip rendering adjacent to the filter row.
- **Regression risk:** Low-medium — filter *logic* (`selectedTypes`, `selectedModalities`, etc., and the `filteredTaxonomy` memo) is untouched; only the presentation/grouping of the existing controls changes. Must confirm all existing filter values remain reachable, just relocated.
- **Complexity:** Medium.

### Phase 3 — Card Redesign
- **Objective:** Restructure the problem card into header / summary / primary-action / fact-strip / prerequisites / collapsed-related-resources zones; unify typography scale and badge system.
- **Files affected:** `ProblemIndexDashboard.tsx` (card render block only).
- **Exact UI changes:** Reorder card sections per §3.8; add a disclosure control for "additional solutions" and "related resources"; apply the 4-step type scale and 2-shape badge system across the card.
- **Regression risk:** Medium — this is the largest visual change; all existing data bindings (workflowMap, decisionGuideMap, modelMap, patternMap, debugGuideMap, packageMap, registryMap, `resolveLink`/`resolveName`/`getProblemMaturity`/`getProblemCoverage`) must remain wired exactly as-is, since none of this task touches data logic. Cross-reference and highlight-match behavior (`HighlightText`) must continue to function inside the new collapsed/disclosed sections.
- **Complexity:** Medium-high (most surface area, but purely presentational).

### Phase 4 — Mobile & Accessibility Pass
- **Objective:** Apply mobile-specific filter layout (horizontal scroll / sheet), increase tap targets, add `focus-visible` and `aria-expanded` across interactive elements, scope down `select-none`.
- **Files affected:** `ProblemIndexDashboard.tsx` (className-level changes only, no new state beyond a possible mobile "more filters" sheet open/close flag).
- **Exact UI changes:** Per §3.11–3.13.
- **Regression risk:** Low — purely additive/className-level; no logic paths change.
- **Complexity:** Low-medium.

### Phase 5 — Visual QA & Consistency Sweep
- **Objective:** Final pass to confirm the 4-step type scale, 2-shape badge system, spacing rhythm, and hover/transition treatments are applied uniformly across every section touched in Phases 1–4, and match the rest of AENS (Workflow, Model, Pattern pages) in spacing/typography conventions without importing their layouts.
- **Files affected:** `page.tsx`, `ProblemIndexDashboard.tsx`.
- **Exact UI changes:** No new features — audit and correct any leftover inconsistent `text-[Npx]` values, badge radii, or icon sizes missed in earlier phases.
- **Regression risk:** Low.
- **Complexity:** Low.

---

## Part 5 — Regression Checklist

Everything below must behave identically after the redesign — only its presentation may change:

- [ ] Search matches the same fields (name, description, category, aliases, keywords, search tokens, tags, prerequisites, related models/patterns/debug guides/packages/registry, workflow title/description/tags, decision guide title/description) — `matchesSearch` logic untouched.
- [ ] Debounced search-to-URL query param sync (`?q=`) continues to work, including on initial load from a shared URL.
- [ ] Keyboard shortcuts `/` and `Ctrl+K`/`Cmd+K` continue to focus search from anywhere on the page (excluding when a text field is already focused); `Escape` still collapses/closes search.
- [ ] All five filters (Type, Modality, Complexity, Maturity, Characteristics) retain full functional parity — every option, multi-select behavior, and combination logic.
- [ ] Sort options (Maturity, Complexity, Name, Solution Count) and their exact ordering logic (production-first, easy-to-hard, most-solutions-first) are unchanged.
- [ ] "Reset" clears all filters and sort back to default (`maturity`) exactly as today.
- [ ] Category collapse/expand state continues to persist via `localStorage` (`problem_index_collapsed_categories`) and continues to auto-expand-all when a search or filter is active.
- [ ] "Expand All" / "Collapse All" bulk actions retain identical behavior and localStorage sync.
- [ ] Category "Jump To" navigation and IntersectionObserver-driven active-category highlighting continue to function.
- [ ] All routing/links are unchanged: `/workflows/[id]`, `/models/[category]/[id]`, `/patterns/[id]`, `/debug-guides/[id]`, `/packages/[id]`, `/registry/families/[id]`, `/decision-guides/[id]`, `/models/[category]/compare/[subcategory]`.
- [ ] `resolveLink` / `resolveName` cross-reference resolution logic is untouched.
- [ ] `getProblemMaturity` and `getProblemCoverage` computed-value logic is untouched (only their visual presentation changes).
- [ ] `HighlightText` search-term highlighting continues to work on all text it currently covers (problem name, description, workflow/decision-guide titles and descriptions), including inside any newly-collapsed/disclosed sections.
- [ ] Empty-state ("No matches found") behavior and its "Clear Search & Filters" action are unchanged.
- [ ] No changes to `data/problem-index/taxonomy.json` loading, `lib/data` calls, or any prop shape passed from `page.tsx` into `ProblemIndexDashboard`.
- [ ] No new content types, fields, or metadata are introduced — every data point shown post-redesign already exists in the current card.
- [ ] No changes outside `app/problem-index/**`.
