
---

# AENS Home Page — Reconciled Pre-Freeze Plan

This document synthesizes the first audit, the external review (Document 2), and the actual codebase state as of this inspection. It supersedes the previous roadmap wherever the two disagree.

---

## Where the External Review Is Right

The external reviewer made three corrections that are valid and improve on the first audit.

**1. Do not remove Quick Access yet.** The reviewer is correct that removing it before sufficient usage data exists is premature. The section has real mobile utility. The correct call at this stage is to fix its bugs (uncapped Workflows, dead `popularPackages` variable) and leave the structural decision for Phase 2 of content expansion. The first audit was too aggressive here.

**2. Recently Updated should stay.** At 500+ entries being added weekly, knowing what changed since last session is useful. The first audit's instinct to differentiate it visually from Recent Knowledge is still valid, but the section itself should not be cut.

**3. Micro-optimizations are not worth touching.** The clock icon, badge sizes, subtitle text — these do not reduce time-to-knowledge. Skip all of them.

---

## Where the External Review Is Wrong

Two positions in the external review do not survive scrutiny against the actual code.

**1. "Sidebar scalability" as Priority 1.** Reading `Sidebar.tsx` fully: the sidebar already has `MAX_VISIBLE_ITEMS = 12` with `applyItemLimit()` logic and a "See all N →" fallback link for every section. It is already built to handle 500 packages without overflow. This is not the most urgent problem. The reviewer suggested alphabetical grouping and in-sidebar search without inspecting whether the cap mechanism exists. It does. Sidebar scalability is real but it is not Priority 1 because the current implementation handles growth without breaking.

**2. "Categories → add one-line descriptions."** The Categories section in `page.tsx` renders 7 compact count cards in a tight grid. They are `p-3` cards with a `text-sm` label and `text-[10px]` count. There is physically no room for descriptions without expanding the card height, which breaks the grid density. Adding descriptions to these cards means either enlarging every card (increases scroll depth) or making text so small it becomes unreadable. The reviewer suggested this without reading the actual card markup. The correct improvement here is something else: collapsing ML/DL/LLM into a single Models card to free up slots, which is achievable without touching card dimensions.

---

## Bug Inventory (from re-reading the code)

Before anything else, these are confirmed defects in the current codebase:

**Bug 1 — Dead variable: `popularPackages` is computed and never rendered**
Location: `app/page.tsx` lines 14-17
The array `popularPackageIds` is defined, `popularPackages` is computed with a `.map().filter()` chain, and then `packages.slice(0, 6)` is used in the render instead. `popularPackages` is referenced nowhere in JSX. This is a silent failure.

**Bug 2 — Uncapped Workflows list**
Location: `app/page.tsx` Workflows SectionCard
`workflows.map(wf => ...)` has no `.slice()`. At 200 workflows this renders 200 list items on the Home page.

**Bug 3 — `getRecentContent(8)` vs `.slice(0, 6)` mismatch**
Location: `app/page.tsx` line 9 and the Recently Updated render
8 items fetched, 6 rendered. Two items are always wasted per render cycle. Minor, but inconsistent.

**Bug 4 — `formatContentType` doesn't handle `'registry'` type**
Location: `lib/resources.ts`
`formatContentType('registry')` returns the raw string `'registry'` (lowercase). All other types return a capitalized string. ContentTypeBadge on Registry items shows inconsistent formatting.

---

## Reconciled Priority Matrix

### Critical (fix before any freeze)

**C1 — Fix `popularPackages` dead variable**
One-line fix. The most egregious silent defect. `popularPackageIds` was curated with intent and is completely ignored at render time.

**C2 — Cap the Workflows SectionCard**
One-line fix. Guaranteed layout explosion at scale. Add `.slice(0, 6)` and a conditional "See all →" link.

---

### High (complete before freeze)

**H1 — Expand Continue Reading from single-item to multi-item (max 3)**

This is the highest-value feature on the entire Home page. The external reviewer confirmed it. Reading `useReadingSession.ts` and `session-tracking.ts` fully: the qualification logic (45s dwell + 15% scroll) is solid. The storage shape is a single object. Changing to an array of max 3 items requires modifying only `lib/session-tracking.ts` (storage read/write) and `components/shared/ContinueReadingSection.tsx` (render). The `saveContinueReading` call signature in `useReadingSession.ts` does not change.

This is H1 not C1 because the current single-item behavior is functional — it just has a limitation. The bugs above are silent failures.

**H2 — Collapse Categories grid: 3 model cards → 1 Models card**

Currently 7 category cards. ML Models, DL Models, LLM Models are 3 separate cards. A single "Models" card linking to `/models` is the right call because:
- `/models/page.tsx` already exists and renders all three subcategories with full model listings
- `totalModelsCount` is already computed in `page.tsx`
- This reduces the grid from 7 → 5 items, freeing space for future content types (Datasets, Papers, Experiments)
- On mobile, 5 cards in a 2-column grid is cleaner than 7

The change is 3 lines in `page.tsx`.

**H3 — Fix `formatContentType` missing registry case**

ContentTypeBadge shows lowercase `'registry'` for all registry items everywhere in the app (Home page Recently Updated section, search results). `lib/resources.ts` `formatContentType` function — add `registry: 'Registry'` to the labels map. One line.

**H4 — Fix `getRecentContent(8)` vs `.slice(0, 6)`**

Change the call to `getRecentContent(6)`. Aligns fetch limit with render limit. Eliminates wasted I/O.

---

### Medium (implement before freeze if possible)

**M1 — Sidebar: add alphabetical group headers at threshold**

The sidebar already handles item capping (MAX_VISIBLE_ITEMS = 12 + "See all →"). The reviewer's concern is correct but the current mechanism is sufficient for the next phase of growth. The real issue is that at 50+ packages, the user cannot locate a specific package by scanning — they need to know the first letter. The fix is not a redesign: when `packages.length > 30`, render alphabetical section dividers (A, B, C...) above groups inside the expanded list. This reuses the existing sidebar structure with minimal markup addition. It does not change routing, schema, or nav data.

Implementation constraint: the `_nav.json` items are already sorted alphabetically by `scanDirectoryForIds` which uses `localeCompare`. Grouping is purely a render transform on already-sorted data.

**M2 — Visual differentiation between "Recent Knowledge" and "Recently Updated"**

Both sections currently render identical card grids. They look the same. They mean different things. The fix does not require restyling either component. The solution: change the "Recently Updated" section in `page.tsx` to render a compact `<ul>` list (name + badge + date in a single row) instead of a card grid. This is a render-only change in `page.tsx`. `RecentKnowledgeSection.tsx` is untouched.

**M3 — Add `"See all →"` fallback to Packages SectionCard**

Currently the Packages SectionCard shows 6 items with no way to reach the rest. At 500 packages, this becomes a dead end. Add a conditional "See all {N} packages →" link at the bottom of the list when `packages.length > 6`. Same pattern as Workflows fix.

---

### Low (skip for now — revisit after content expansion phase)

**L1 — `slugToTitle` maintenance dictionary in PageVisitTracker**

Real problem, wrong time to fix. At 6 packages it's fine. At 500 packages it will drift. The correct fix requires passing canonical names through a pre-serialized client-accessible lookup, which is a non-trivial architecture decision. Defer until the dictionary has actually become a maintenance burden.

**L2 — Remove the H1 + description block from Home page**

The external reviewer says skip it. The first audit was correct that it's dead weight after session one. But both analyses agree it is the lowest-impact change on the list. At pre-freeze, this is not worth a code change. The title serves as a visual anchor when the page loads empty (no localStorage data, no recently updated items). Leave it.

**L3 — Quick Access structural decision (keep vs. remove vs. repurpose)**

The external reviewer recommends keeping it and eventually turning it into "Frequently Used" or "Pinned." That is the right long-term direction. But that feature requires usage signal that does not exist yet. For now: fix the bugs in it (C1 + C2 above), leave its structure intact, and defer the "Frequently Used" decision until after the first major content expansion. Do not delete it. Do not redesign it. Fix the bugs and move on.

---

## Rejected Proposals (Final Reconciliation)

**Reject: Remove TopBar SearchBox duplicate from Home page (previously H1 in first audit)**

Revisiting this: the TopBar SearchBox is compact-variant, smaller placeholder, and positioned in the header. The Home page SearchBox is full-width, more prominent, and arguably the primary interaction surface for the first action after opening the app. On mobile, the Home page SearchBox is directly visible without touching the TopBar. Removing it does reduce one Fuse instance at render time, but React `cache()` deduplicates the index build. The UX cost of removing the most prominent search entry point from the primary screen is higher than the theoretical benefit. Reject this change.

**Reject: Add one-line descriptions to Categories cards**

Physically impossible without enlarging cards. Card dimensions are `p-3` with fixed grid. The correct information hierarchy is: category name → count → click to list page. Descriptions belong on the list pages, not the count cards.

**Reject: Turn Quick Access into "Frequently Used" now**

No usage signal exists yet. Building frequency tracking requires new localStorage infrastructure. The external reviewer correctly says to defer this. Reject for pre-freeze.

**Reject: Sidebar in-sidebar search**

MAX_VISIBLE_ITEMS + "See all →" + TopBar global search already covers this need. Adding search inside the sidebar duplicates the global search and increases sidebar complexity. Reject.

**Reject: Any cosmetic changes** (badge size, clock icon, spacing, colors). None of these reduce time-to-knowledge. Reject all.

---

## Final Implementation Roadmap (Pre-Freeze)

These are the only phases worth executing before UI freeze. Everything is ordered by impact and independence.

---

### Phase 1 — Bug Fixes (Do First, Do Together)

**Purpose:** Fix silent failures that are wrong today and guaranteed catastrophic at scale.

**Files to inspect:**
- `app/page.tsx` (complete re-read before touching)

**Files to modify:**
- `app/page.tsx`
- `lib/resources.ts`

**Files that must remain untouched:**
- All components
- All data files
- `lib/data.ts`
- `lib/session-tracking.ts`

**Implementation instructions:**

Fix 1 — `popularPackages` dead variable:
In `app/page.tsx`, locate the Packages SectionCard render. Find `packages.slice(0, 6)` inside the `ul`. Replace with `popularPackages.slice(0, 6)`. Confirm that `popularPackages` is the filtered array already computed above the return statement. Do not touch the computation — only the render reference.

Fix 2 — Workflows cap:
In `app/page.tsx`, locate the Workflows SectionCard. Change `workflows.map(wf => ...)` to `workflows.slice(0, 6).map(wf => ...)`. Below the `</ul>` closing tag and before the closing `</SectionCard>`, add: `{workflows.length > 6 && (<Link href="/workflows" className="text-xs text-muted-foreground hover:text-foreground hover:underline font-mono">See all {workflows.length} workflows →</Link>)}`. Match the spacing class to the existing SectionCard content padding (`mt-2` or `mt-3` to match list spacing).

Fix 3 — `getRecentContent` fetch/render mismatch:
Change `getRecentContent(8)` to `getRecentContent(6)` on the data call line in `app/page.tsx`. Remove the `.slice(0, 6)` from the Recently Updated render — it is now redundant.

Fix 4 — Registry badge formatting:
In `lib/resources.ts`, inside the `formatContentType` function, add `registry: 'Registry'` to the `labels` object.

**Acceptance criteria:**
- Popular packages (numpy, pandas, jax, polars, cupy, dask) appear in the Packages SectionCard
- If a `popularPackageIds` entry has no JSON file, it is silently skipped (existing filter handles this)
- Adding a 7th workflow JSON file causes "See all 7 workflows →" to appear below the list
- ContentTypeBadge shows "Registry" (capitalized) for all registry-type items in Recently Updated and search results
- `getRecentContent` is called with limit 6; no `.slice()` needed at render

**Regression checklist:**
- [ ] All 6 Home page sections still render
- [ ] Packages SectionCard links still route to `/packages/{id}`
- [ ] Workflows SectionCard still links to `/workflows/{id}`
- [ ] TypeScript: no errors from changed variable references
- [ ] `popularPackages` is not an empty array (requires at least one `popularPackageIds` entry to have a matching JSON file)

**Validation checklist:**
- [ ] Open Home page. Packages SectionCard shows NumPy, pandas, JAX, Polars, CuPy, Dask — not alphabetical-first-6
- [ ] Search results for a registry entry show "Registry" badge in capitalized form
- [ ] No browser console errors

---

### Phase 2 — Categories Grid Cleanup

**Purpose:** Collapse 3 model subcategory cards into 1 Models card. Drop the category grid from 7 items to 5 items. Free two slots for future content types.

**Files to inspect before implementing:**
- `app/page.tsx` (Categories section — the `.filter(item => item.count > 0).map(cat => ...)` block)
- `app/models/page.tsx` (confirm `/models` route exists and renders all three subcategories — it does)

**Files to modify:**
- `app/page.tsx` (Categories array only)

**Files that must remain untouched:**
- `app/models/ml/page.tsx`
- `app/models/dl/page.tsx`
- `app/models/llm/page.tsx`
- `app/models/page.tsx`
- `lib/data.ts`
- All components

**Implementation instructions:**

In `app/page.tsx`, locate the Categories section array. Remove the three entries:
```
{ label: 'ML Models', count: counts.models_ml, href: '/models/ml' },
{ label: 'DL Models', count: counts.models_dl, href: '/models/dl' },
{ label: 'LLM Models', count: counts.models_llm, href: '/models/llm' },
```

Replace with a single entry:
```
{ label: 'Models', count: totalModelsCount, href: '/models' },
```

`totalModelsCount` is already computed in `page.tsx` — do not recompute it.

The resulting array order should be: Packages, Models, Workflows, Cheatsheets, Registry.

**Acceptance criteria:**
- Categories grid shows exactly 5 items (assuming all categories have at least 1 entry)
- "Models" card shows combined count (currently 23) and links to `/models`
- `/models` page renders and shows all three subcategory sections
- No individual ML/DL/LLM cards appear in the grid

**Regression checklist:**
- [ ] `totalModelsCount` value is correct (sum of ml + dl + llm)
- [ ] `/models` route renders without error
- [ ] All 5 category cards link to correct routes
- [ ] Grid responsive layout is not broken on mobile (2-col) or desktop (5-col becomes 5-col of 5 items — verify layout)
- [ ] TypeScript: no errors

**Validation checklist:**
- [ ] Home page shows 5 category cards
- [ ] Click "Models" → lands on `/models` page
- [ ] `/models` page shows ML, DL, LLM sections
- [ ] Models card count matches actual file count across all three subdirectories

---

### Phase 3 — Visually Differentiate "Recently Updated" from "Recent Knowledge"

**Purpose:** Make the two temporal sections distinguishable by shape, not just by header text. On mobile, where both sections are adjacent, this is a navigation clarity fix.

**Files to inspect before implementing:**
- `app/page.tsx` (Recently Updated section render — the grid of Link cards)
- `components/shared/RecentKnowledgeSection.tsx` (the card grid with identical structure)

**Files to modify:**
- `app/page.tsx` (Recently Updated section only)

**Files that must remain untouched:**
- `components/shared/RecentKnowledgeSection.tsx`
- `lib/data.ts`
- `lib/session-tracking.ts`

**Implementation instructions:**

In `app/page.tsx`, locate the Recently Updated section. The current render is a `grid gap-2 grid-cols-2 md:grid-cols-3` of card-style Links. Replace this grid with a `<ul className="divide-y divide-border rounded-lg border border-border overflow-hidden">` where each item is a single-row layout:

Each `<li>` contains one `<Link>` styled as a horizontal row: `flex items-center justify-between px-3 py-2 hover:bg-muted/30 transition-colors`. Inside: left side has item name (`text-sm font-medium text-foreground truncate`), right side has ContentTypeBadge + updated_at date in `text-[10px] font-mono text-muted-foreground`.

The href construction logic (the `item.type === 'model' ? ...` ternary) stays identical — only the layout changes.

This makes "Recently Updated" look like a structured log (horizontal list) versus "Recent Knowledge" (card grid). Shape distinction, not color distinction.

**Acceptance criteria:**
- "Recently Updated" renders as a compact divider list, not a card grid
- "Recent Knowledge" is visually a card grid (unchanged)
- Both sections are recognizable as different information types by shape alone, without reading headers
- All hrefs in "Recently Updated" still correctly route to their content pages
- Name, ContentTypeBadge, and updated_at are all visible in each row
- On mobile (375px), each list row is tappable with adequate touch target height (min 40px effective)

**Regression checklist:**
- [ ] All 6 recently-updated item links navigate to correct pages
- [ ] ContentTypeBadge still renders correct type labels (including "Registry" after Phase 1 fix)
- [ ] updated_at field renders for all item types
- [ ] Mobile: no horizontal overflow on 375px viewport
- [ ] Dark mode: list dividers and hover state visible

**Validation checklist:**
- [ ] Side by side on Home page: Recently Updated reads as a list, Recent Knowledge reads as cards
- [ ] Tap each item in Recently Updated on mobile — navigates correctly
- [ ] The two sections look different without reading their headers

---

### Phase 4 — Continue Reading: Expand to Multi-Item (Max 3)

**Purpose:** Extend Continue Reading from tracking one item to tracking the last 3 qualifying reading sessions. This is the highest long-term value change on the Home page.

**Files to inspect before implementing:**
- `lib/session-tracking.ts` (complete — `saveContinueReading`, `getContinueReading`, `clearContinueReading`, `CONTINUE_READING_KEY`)
- `components/shared/ContinueReadingSection.tsx` (complete)
- `lib/hooks/useReadingSession.ts` (the call site for `saveContinueReading` — confirm signature)

**Files to modify:**
- `lib/session-tracking.ts`
- `components/shared/ContinueReadingSection.tsx`

**Files that must remain untouched:**
- `lib/hooks/useReadingSession.ts` — the `saveContinueReading(item)` call signature must not change
- `app/page.tsx`
- All schema files

**Implementation instructions:**

In `lib/session-tracking.ts`:

Change `saveContinueReading` to:
1. Read the current stored value from `CONTINUE_READING_KEY`
2. Parse it — handle both legacy single-object and new array shape gracefully with try/catch
3. Normalize to an array
4. Filter out any item with the same `href` as the incoming item (deduplication)
5. Filter out items where `href === '/'`
6. Prepend the new item
7. Slice to max 3
8. Write the array back to `CONTINUE_READING_KEY`

Change `getContinueReading` to return `ContinueReadingItem[]` (array) instead of `ContinueReadingItem | null`. Return empty array on no data or parse failure. Handle legacy single-object shape: if parsed value is an object (not array), wrap in `[parsed]` before returning. This preserves backward compatibility with existing stored data.

Change `clearContinueReading` to keep the same behavior (removes the key).

Add a new export: `dismissContinueReadingItem(href: string): void` — reads the array, filters out the item with matching href, writes back.

In `components/shared/ContinueReadingSection.tsx`:

Change `useState<ContinueReadingItem | null>(null)` to `useState<ContinueReadingItem[]>([])`.

In `useEffect`, call `getContinueReading()` and `setItems(result)`.

Change the `handleDismiss` to accept an `href` parameter and call `dismissContinueReadingItem(href)` then remove the item from local state.

Rename the section button from "Dismiss" to "Clear all" — it now clears all items. Individual items get their own dismiss via an X button on each card.

Render: if `items.length === 0`, return null. If `items.length === 1`, render the existing single-item card layout unchanged. If `items.length > 1`, render each item as a card in a `space-y-2` stack. Each card retains the existing primary-tinted border style and the BookOpen icon. Each card gets a small `X` button in the top-right corner that calls the per-item dismiss.

The "Dismiss" button at the section level becomes "Clear all" and calls `clearContinueReading()` then `setItems([])`.

**Acceptance criteria:**
- Reading Item A (45s dwell + 15% scroll), then Item B — both appear in Continue Reading on return to Home
- Items appear in order: most recent first
- Dismissing Item A via its X button removes only Item A; Item B remains
- "Clear all" removes all items
- Maximum 3 items displayed; oldest is displaced when a 4th qualifies
- Home page visit (`href === '/'`) is never stored or displayed
- Existing stored single-object format is handled gracefully on first load after update

**Regression checklist:**
- [ ] `useReadingSession.ts` call site `saveContinueReading({...})` compiles without error — signature must be unchanged
- [ ] `getContinueReading()` now returns array — all callers updated (only `ContinueReadingSection.tsx` calls this)
- [ ] `clearContinueReading()` still wipes the key
- [ ] `ContinueReadingSection` returns null when array is empty
- [ ] TypeScript: `ContinueReadingItem | null` → `ContinueReadingItem[]` change propagated everywhere it's referenced
- [ ] SSR: component still initializes to empty array (no localStorage access before mount)

**Validation checklist:**
- [ ] Open Package A. Read for 50s, scroll to 20%. Navigate away. Open Home. "Continue Reading" shows Package A.
- [ ] Open Package B. Read for 50s, scroll to 20%. Navigate away. Open Home. Both A and B appear, B first.
- [ ] Click X on Package A. Package B remains.
- [ ] Click "Clear all". Section disappears.
- [ ] Hard refresh. Items persist from localStorage.
- [ ] Visit Home page directly. Home page does not appear in Continue Reading.
- [ ] Read items C, D, E (each qualifying). Return to Home. Only C, D, E appear (max 3); A and B are gone.

---

### Phase 5 — Sidebar Scalability: Alphabetical Group Headers (Conditional)

**Purpose:** When any sidebar section exceeds 30 items, render alphabetical group headers inside the expanded list. At current scale (6 packages, 23 models), this is invisible — the condition is never true. As content grows, it activates automatically with no further changes.

**Files to inspect before implementing:**
- `components/layout/Sidebar.tsx` (complete — especially the `applyItemLimit` function, the `expanded` state, and each section's render block)

**Files to modify:**
- `components/layout/Sidebar.tsx`

**Files that must remain untouched:**
- `lib/data.ts`
- `lib/config/registry.ts`
- All nav JSON files
- `app/layout.tsx`

**Implementation instructions:**

Add a utility function `groupByFirstLetter<T extends { id: string; name: string }>(items: T[]): Map<string, T[]>` inside `Sidebar.tsx`. It takes a sorted array and returns a Map from first letter to items starting with that letter.

Add a constant `ALPHA_GROUP_THRESHOLD = 30`.

When rendering each section's item list (Packages, ML Models, DL Models, LLM Models, Workflows, Cheatsheets), check: `if (items.length >= ALPHA_GROUP_THRESHOLD)`. If true, render grouped by first letter with a small divider label per group (e.g., `<div className="px-2.5 mt-2 mb-0.5 text-[8px] font-bold text-muted-foreground/50 uppercase">A</div>`). If false, render the existing flat list (current behavior unchanged).

The `applyItemLimit` cap and "See all →" fallback still apply within each group in the grouped view.

Registry tasks use a string array (not NavItem). Apply the same grouping logic only to sections that receive NavItem arrays. Registry tasks are enumerated (max ~10 entries by design) and do not need grouping.

**Acceptance criteria:**
- At fewer than 30 items in any section, sidebar renders exactly as it does today
- At 30+ items in a section, items are grouped by first letter with a letter divider above each group
- The active item is still highlighted correctly in grouped view
- The "See all N →" fallback still appears when total items exceed MAX_VISIBLE_ITEMS
- Grouping is purely visual — no routing, data, or schema changes

**Regression checklist:**
- [ ] All existing sidebar behavior unchanged at current content volume (6 packages, 23 models — all below threshold)
- [ ] Active item auto-scroll still works in grouped view
- [ ] Dark mode: letter dividers visible
- [ ] Mobile: sidebar rendered via MobileSidebarTrigger renders identically

**Validation checklist:**
- [ ] Temporarily set `ALPHA_GROUP_THRESHOLD = 5` (to test with current content). Packages section groups by first letter (C for CuPy, D for Dask, J for JAX, N for NumPy, P for pandas/Polars). Restore to 30 after testing.
- [ ] Active package is highlighted inside its letter group
- [ ] "See all →" still appears when items exceed MAX_VISIBLE_ITEMS

---

## What Happens After This Roadmap

After Phase 1 through Phase 5 are complete:

**Freeze the Home page.** Do not change any section layout, any component structure, or any data flow until content volume reaches:
- 50+ packages
- 100+ models  
- 20+ workflows

At that threshold, revisit two deferred decisions:
1. Quick Access repurposing: at 50 packages, determine from actual usage which packages you access most, and build "Frequently Used" as a replacement. The data will tell you whether usage clusters exist.
2. `slugToTitle` dictionary: at 50+ packages, audit whether the fallback names are breaking. If they are, implement the canonical name lookup from `_nav.json` data.

Everything else on the "Low" and "Rejected" lists stays rejected permanently or until a concrete usage problem emerges, not a theoretical one.