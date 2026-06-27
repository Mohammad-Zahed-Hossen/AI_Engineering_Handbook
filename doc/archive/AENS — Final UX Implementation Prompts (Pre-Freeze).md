
---

# AENS — Final UX Implementation Prompts (Pre-Freeze)

Each prompt is independently executable. Run them in order. Do not skip phases.

---

## Phase 1 — Sidebar Section Limits (Scale Protection)

**Problem being solved:** When Packages grows to 500 items, Cheatsheets to 1000, the sidebar expanded section becomes an unusable infinite scroll of tiny links. The sidebar must cap visible items per section and offer a "See all N →" escape to the list page. This is the only sidebar change needed before freeze.

```
AENS — Phase 1: Sidebar Section Limits
Target: D:\Project\ai-engineering-handbook
Files to modify:
  - components/layout/Sidebar.tsx
  - components/layout/MobileSidebarTrigger.tsx

Do NOT modify any other files.
Do NOT change the data layer, search, or layout.
Do NOT add new dependencies.
Architecture is frozen. This is an additive UI-only change.

═══════════════════════════════════════════════════
CONTEXT
═══════════════════════════════════════════════════
The sidebar renders all items in every expanded section with no cap.
Today sections have <10 items. At scale (500 packages, 1000 cheatsheets),
the expanded section becomes an unscrollable list of hundreds of tiny links.

The fix: cap each section at MAX_VISIBLE items. Show a "See all N →" link
to the section list page when the section has more items than the cap.
The active item must always be visible regardless of the cap.

═══════════════════════════════════════════════════
CONSTANTS (define at the top of each file)
═══════════════════════════════════════════════════
const MAX_VISIBLE_ITEMS = 12;

This constant controls how many items are shown in any expanded section
before the "See all N →" link appears. It applies to:
  - Packages
  - ML Models
  - DL Models
  - LLM Models
  - Registries
  - Workflows
  - Cheatsheets

═══════════════════════════════════════════════════
LOGIC — applyItemLimit()
═══════════════════════════════════════════════════
Write a pure function (not a component) inside each file:

  function applyItemLimit<T extends { id: string }>(
    items: T[],
    activeId: string | null,
    max: number
  ): { visible: T[]; truncated: boolean; total: number } {
    if (items.length <= max) {
      return { visible: items, truncated: false, total: items.length };
    }
    const activeIndex = items.findIndex(item => item.id === activeId);
    let visible = items.slice(0, max);
    // If active item exists but is outside the cap, replace the last visible
    // item with the active item so it is always shown.
    if (activeIndex >= max) {
      visible = [...items.slice(0, max - 1), items[activeIndex]];
    }
    return { visible, truncated: true, total: items.length };
  }

═══════════════════════════════════════════════════
USAGE — how to determine activeId per section
═══════════════════════════════════════════════════
Extract the active item ID from the current pathname:

  - Packages: if pathname starts with /packages/, extract parts[1]
  - ML Models: if pathname starts with /models/ml/, extract parts[2]
  - DL Models: if pathname starts with /models/dl/, extract parts[2]
  - LLM Models: if pathname starts with /models/llm/, extract parts[2]
  - Registries: if pathname starts with /registry/, extract parts[1]
  - Workflows: if pathname starts with /workflows/, extract parts[1]
  - Cheatsheets: if pathname starts with /cheatsheets/, extract parts[1]

If no match, activeId = null.

═══════════════════════════════════════════════════
RENDERING — "See all N →" link
═══════════════════════════════════════════════════
When truncated === true, render this link AFTER the visible item list,
INSIDE the section's <ul> as the last <li>:

  <li>
    <Link
      href={sectionHref}
      className="block py-1 px-2.5 rounded text-[10px] font-mono text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40 transition-none select-none"
    >
      See all {total} →
    </Link>
  </li>

Section hrefs:
  - Packages → /packages
  - ML Models → /models/ml
  - DL Models → /models/dl
  - LLM Models → /models/llm
  - Registries → /registry/embedding   (first registry task; already used in home page)
  - Workflows → /workflows
  - Cheatsheets → /cheatsheets

In MobileSidebarTrigger, the "See all N →" link must also call setOpen(false)
via onClick so the sheet closes after navigation.

═══════════════════════════════════════════════════
IMPLEMENTATION STEPS
═══════════════════════════════════════════════════
1. In Sidebar.tsx:
   a. Add MAX_VISIBLE_ITEMS = 12 constant at top.
   b. Add applyItemLimit() function.
   c. For each section that renders a list (packages, ml, dl, llm, registry,
      workflows, cheatsheets), wrap the items array with applyItemLimit()
      before mapping. Pass the correct activeId based on pathname.
   d. After the items map, if truncated, render the "See all N →" li.
   e. Do NOT change the section heading, toggle logic, or expand/collapse
      behavior in any way.

2. In MobileSidebarTrigger.tsx:
   a. Apply the identical change (same constant, same function, same rendering).
   b. The "See all N →" link inside the mobile sheet must call setOpen(false).

═══════════════════════════════════════════════════
VALIDATION CHECKLIST
═══════════════════════════════════════════════════
□ With < 12 items in a section: no "See all" link appears
□ With > 12 items in a section: "See all N →" appears as the last list item
□ When the active item is beyond position 12: it is still visible in the list
□ "See all N →" link navigates to the correct list page
□ Mobile: "See all N →" closes the sheet on tap
□ No layout shift; existing section heading and toggle behavior unchanged
□ TypeScript: npx tsc --noEmit passes clean
□ npm run lint — zero errors

REGRESSION CHECKLIST
□ Active item highlight still works for all sections
□ Sections still collapse and expand correctly
□ Section item count badge still shows the full count (not capped count)
□ No changes to TopBar, SearchBox, layout, or data layer
□ No new npm dependencies introduced
```

---

## Phase 2 — Home Page Section Order & Hierarchy Fix

**Problem being solved:** The current Home page renders ContinueReading and RecentKnowledge first, then "Recently Updated", then Popular Packages, then Quick Access, then Categories. After years of use the hierarchy is wrong: the most stable high-value navigation (Categories) is at the bottom, below volatile sections (Popular Packages). The section ordering must be fixed to match actual usage patterns at scale.

```
AENS — Phase 2: Home Page Section Order & Hierarchy
Target: D:\Project\ai-engineering-handbook
Files to modify:
  - app/page.tsx

Do NOT modify any component files.
Do NOT change any component's internal logic or JSX.
Do NOT change data fetching calls.
Architecture is frozen. This is a reordering-only change.

═══════════════════════════════════════════════════
CONTEXT
═══════════════════════════════════════════════════
The home page sections exist and are correct. Only their ORDER is wrong.
At scale (500+ packages, daily use for years), the correct reading priority is:

1. Global Search            — always first; primary navigation at scale
2. Continue Reading         — session restoration; high value if present
3. Recent Knowledge         — browsing history; secondary session tool
4. Categories               — stable navigation hub; grows in value over time
5. Recently Updated         — content discovery; shows new additions
6. Quick Access             — secondary shortcuts; useful but not primary

The "Popular Packages" hardcoded section must be REMOVED. It is a static
list of 6 manually chosen packages that becomes misleading as the catalog
grows. It adds cognitive noise without navigation value.

═══════════════════════════════════════════════════
NEW SECTION ORDER in app/page.tsx
═══════════════════════════════════════════════════
Reorder the JSX inside the return() to match this exact sequence:

  1. Global Search section (already exists — keep unchanged)
  2. <ContinueReadingSection />  (already exists — keep unchanged)
  3. <RecentKnowledgeSection />  (already exists — keep unchanged)
  4. Categories section (currently last — move to position 4)
  5. Recently Updated section (currently position 4 — move to position 5)
  6. Quick Access section (currently position 6 — keep, move to position 6)

DELETE the entire "Popular Packages" section block (the section with
popularPackages.map(...)) from the JSX. It is identifiable by the comment
{/* Popular Packages */} and the popularPackages.map() call.

After removing Popular Packages, also remove these now-unused variables
from the function body:
  - const popularPackageIds = [...]
  - const popularPackages = packages.find(...)

Do NOT remove:
  - const packages = getAllPackages()
  - Any other data fetch calls (they are used by Quick Access)

═══════════════════════════════════════════════════
CATEGORIES SECTION — minor label fix
═══════════════════════════════════════════════════
While moving the Categories section, update the Registry entry in the
category grid. Currently it links to /registry/embedding with a hardcoded
label "Registry". This is architecturally wrong — it implies there is only
one registry entry point.

Change the Registry category card to:
  label: 'Registries'
  count: counts.registry_tasks    (already available)
  href: '/registry/embedding'     (keep as-is; it is the first valid entry)

No other changes to the Categories section.

═══════════════════════════════════════════════════
VALIDATION CHECKLIST
═══════════════════════════════════════════════════
□ Home page renders without errors
□ Section order from top to bottom: Search → Continue Reading → Recent Knowledge
  → Categories → Recently Updated → Quick Access
□ "Popular Packages" section is gone entirely
□ Categories grid still shows all 7 category cards
□ Registry card now shows label "Registries" and count from counts.registry_tasks
□ Continue Reading and Recent Knowledge still conditionally hide when empty
□ TypeScript: npx tsc --noEmit passes clean
□ npm run lint — zero errors

REGRESSION CHECKLIST
□ ContinueReadingSection and RecentKnowledgeSection behavior unchanged
□ Quick Access SectionCards unchanged
□ Recently Updated grid unchanged
□ Search still works from home page
□ No data fetching changes
```

---

## Phase 3 — List Pages: Summary Text & Count Badges

**Problem being solved:** At scale, list pages are the primary way to browse and choose entries. Currently the Cheatsheets list page shows only a title per entry — no summary, no metadata. The Packages list page shows summary but no entry count (tasks). The Models list page has no summary text. All list pages need a minimum of one discriminating detail per card so the user can choose without opening every entry. No pagination needed yet — that is a future concern addressed below.

```
AENS — Phase 3: List Pages — Discriminating Details
Target: D:\Project\ai-engineering-handbook
Files to modify:
  - app/cheatsheets/page.tsx
  - app/packages/page.tsx
  - app/models/page.tsx

Do NOT modify any component files.
Do NOT change routing or data fetching patterns.
Do NOT add new data fields, schema changes, or API calls.
Use only data already available from existing functions.
Architecture is frozen.

═══════════════════════════════════════════════════
CONTEXT
═══════════════════════════════════════════════════
List pages must show one discriminating line of metadata per card so the
user can identify entries without opening them. This is purely a display
improvement — no data changes required.

═══════════════════════════════════════════════════
FILE 1 — app/cheatsheets/page.tsx
═══════════════════════════════════════════════════
Current: shows only cs.name per card.
Fix: also show entry count.

The cheatsheet object has a .entries array. Show entries.length.

Update each card to render:
  <h2 className="text-sm font-medium text-foreground">{cs.name}</h2>
  <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
    {cs.entries.length} {cs.entries.length === 1 ? 'entry' : 'entries'}
  </p>

Keep all existing className values on the outer Link unchanged.
Change h2 from text-lg to text-sm (consistent with other list pages).

═══════════════════════════════════════════════════
FILE 2 — app/packages/page.tsx
═══════════════════════════════════════════════════
Current: shows pkg.name, pkg.summary, pkg.version. Missing: task count.

Fix: add task count alongside the version badge.

In the top-right corner metadata span, change from:
  <span ...>v{pkg.version}</span>

To render both version and task count:
  <div className="shrink-0 flex flex-col items-end gap-0.5">
    <span className="text-xs font-mono text-muted-foreground">v{pkg.version}</span>
    <span className="text-[10px] font-mono text-muted-foreground/70">
      {pkg.tasks.length} {pkg.tasks.length === 1 ? 'task' : 'tasks'}
    </span>
  </div>

No other changes to this file.

═══════════════════════════════════════════════════
FILE 3 — app/models/page.tsx
═══════════════════════════════════════════════════
Current: shows only m.name per card in all three sections. No summary,
no problem types, no speed indicator.

Fix: add m.use_when (truncated) and problem_types to each card.

For EACH of the three sections (ml, dl, llm), update the card to:

  <Link
    key={m.id}
    href={`/models/${category}/${m.id}`}
    className="block rounded-lg border border-border bg-card p-3 hover:border-foreground/20 hover:bg-muted/30 transition-colors"
  >
    <div className="flex items-start justify-between gap-2 mb-1">
      <h3 className="text-sm font-medium text-foreground">{m.name}</h3>
      <span className={[
        "shrink-0 text-[9px] font-mono px-1 rounded capitalize",
        m.inference_speed === 'fast' ? 'text-emerald-500' :
        m.inference_speed === 'medium' ? 'text-amber-500' : 'text-rose-500'
      ].join(' ')}>
        {m.inference_speed}
      </span>
    </div>
    {m.use_when && (
      <p className="text-[10px] text-muted-foreground line-clamp-1 leading-relaxed mb-1.5">
        {m.use_when}
      </p>
    )}
    <div className="flex flex-wrap gap-1">
      {m.problem_types.map(pt => (
        <span
          key={pt}
          className="px-1 py-0 rounded bg-secondary border border-border text-[8px] font-mono capitalize text-muted-foreground"
        >
          {pt}
        </span>
      ))}
    </div>
  </Link>

The category variable in each section is the string 'ml', 'dl', or 'llm'
respectively — use it directly as a string literal in the href template,
not a variable from props.

═══════════════════════════════════════════════════
VALIDATION CHECKLIST
═══════════════════════════════════════════════════
□ /cheatsheets: each card shows name + entry count
□ /packages: each card shows name + summary + version + task count
□ /models/ml, /models/dl, /models/llm: each card shows name + use_when
  (truncated to 1 line) + problem type badges + inference speed
□ All links navigate correctly to detail pages
□ No layout breaks on mobile (375px viewport)
□ TypeScript: npx tsc --noEmit passes clean
□ npm run lint — zero errors

REGRESSION CHECKLIST
□ FilterBar on model category pages unaffected (those are [category] pages,
  not the /models list page)
□ Cheatsheet detail pages unaffected
□ Package detail pages unaffected
□ No changes to search index or data layer
```

---

## Phase 4 — Sidebar Section-Level List Page Links

**Problem being solved:** The sidebar section headings (Packages, Workflows, Cheatsheets, etc.) are currently collapse/expand toggles only. They navigate nowhere. A user who wants to see all packages must know to click into the expanded list. At scale with hundreds of items, the section heading must link to the list page — this is the standard pattern in every knowledge tool (Obsidian, Notion, Linear). It eliminates one navigation step.

```
AENS — Phase 4: Sidebar Section Headings → List Page Links
Target: D:\Project\ai-engineering-handbook
Files to modify:
  - components/layout/Sidebar.tsx
  - components/layout/MobileSidebarTrigger.tsx

Do NOT change the expand/collapse toggle behavior.
Do NOT change the chevron rendering.
Do NOT change link styles or section heading styles.
Architecture is frozen.

═══════════════════════════════════════════════════
CONTEXT
═══════════════════════════════════════════════════
Currently renderSectionHeader() renders a plain <div> that only toggles
the section. There is no way to navigate to the list page from the sidebar
heading — the user must either know the URL or navigate via home page.

The fix: make the section TITLE text a Link to the list page, while keeping
the chevron as the expand/collapse toggle. The two affordances must be
visually and functionally separate.

═══════════════════════════════════════════════════
SECTION HREF MAP
═══════════════════════════════════════════════════
Map each section to its list page:
  'packages'    →  /packages
  'ml'          →  /models/ml
  'dl'          →  /models/dl
  'llm'         →  /models/llm
  'registry'    →  /registry/embedding
  'workflows'   →  /workflows
  'cheatsheets' →  /cheatsheets

The "Models Library" group heading (the non-collapsible parent label above
ml/dl/llm) should link to /models. It has no toggle, so the entire heading
can be a Link.

═══════════════════════════════════════════════════
IMPLEMENTATION
═══════════════════════════════════════════════════
In Sidebar.tsx, update renderSectionHeader() to split the heading into
two interaction zones:

  const renderSectionHeader = (title: string, count: number, section: string, href: string) => (
    <div className={sectionHeadingClass}>
      {/* Chevron toggle — expands/collapses; does NOT navigate */}
      <span
        onClick={() => toggleSection(section)}
        className="flex items-center cursor-pointer"
        aria-label={`Toggle ${title}`}
      >
        {expanded === section ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </span>
      {/* Title — navigates to list page; does NOT toggle */}
      <Link
        href={href}
        className="flex-1 hover:text-foreground/90 transition-none"
        onClick={e => e.stopPropagation()}
      >
        {title}
      </Link>
      <span className="ml-auto text-[8px] bg-muted px-1 rounded text-muted-foreground">{count}</span>
    </div>
  );

Update all renderSectionHeader() call sites to pass the href:
  renderSectionHeader('Packages', packages.length, 'packages', '/packages')
  renderSectionHeader('Registries', registryTasks.length, 'registry', '/registry/embedding')
  renderSectionHeader('Workflows', workflows.length, 'workflows', '/workflows')
  renderSectionHeader('Cheatsheets', cheatsheets.length, 'cheatsheets', '/cheatsheets')

For the ml/dl/llm sub-headings (which use inline divs, not renderSectionHeader):
  Wrap only the text <span> in a Link to the corresponding href.
  Keep the chevron as a separate onClick element.

For the "Models Library" parent label (non-collapsible div):
  Replace the entire div with:
  <Link
    href="/models"
    className={sectionHeadingClass}
  >
    Models Library
  </Link>
  Remove the onClick from this element since it has no toggle.

Apply the IDENTICAL changes to MobileSidebarTrigger.tsx.
In the mobile version, the title Link must NOT call setOpen(false) —
navigation will close the sheet automatically via the router.
The chevron toggle must NOT close the sheet.

═══════════════════════════════════════════════════
VALIDATION CHECKLIST
═══════════════════════════════════════════════════
□ Clicking the chevron icon toggles the section without navigating
□ Clicking the section title text navigates to the list page
□ Clicking "Models Library" heading navigates to /models
□ Active state on list page (e.g. /packages) highlights the section in sidebar
□ Mobile: tapping the title navigates; sheet closes due to Next.js navigation
□ Mobile: tapping the chevron only toggles; sheet stays open
□ TypeScript: npx tsc --noEmit passes clean
□ npm run lint — zero errors

REGRESSION CHECKLIST
□ Section expand/collapse behavior identical to before
□ Active item highlight within sections unchanged
□ Item count badges unchanged
□ Phase 1 "See all N →" links still work
□ No changes to TopBar, SearchBox, or data layer
```

---

## Phase 5 — Registry Categories Section Consistency Fix

**Problem being solved:** The Categories section on the Home page links to `/registry/embedding` with the label "Registry". This is the only category card that deep-links to a specific sub-page rather than a top-level list page. This is an inconsistency that will confuse navigation as registry tasks grow. The fix requires a `/registry` redirect page that forwards to the first available registry task.

```
AENS — Phase 5: Registry Navigation Consistency
Target: D:\Project\ai-engineering-handbook
Files to modify:
  - app/registry/page.tsx  (CREATE — does not exist)

Do NOT modify app/page.tsx (already handled in Phase 2).
Do NOT modify the registry [task] page.
Do NOT change any data files or schemas.
Architecture is frozen.

═══════════════════════════════════════════════════
CONTEXT
═══════════════════════════════════════════════════
There is no /registry landing page. The app/registry/ directory contains
only [task]/ subdirectory. The home page Categories links directly to
/registry/embedding, hardcoding the first task.

A /registry page must exist so that:
  - The sidebar "Registries" heading (Phase 4) links somewhere valid
  - The /models pattern is followed: /models exists as a page, /models/ml
    exists as a sub-page — registry should follow the same structure
  - Future registry tasks can be added without updating hardcoded links

═══════════════════════════════════════════════════
IMPLEMENTATION — app/registry/page.tsx
═══════════════════════════════════════════════════
Create app/registry/page.tsx as a server component (no 'use client').

The page should:
  1. Call getRegistryTasks() to get the sorted list of tasks.
  2. If tasks.length > 0, immediately redirect to /registry/{tasks[0]}
     using Next.js redirect() from 'next/navigation'.
  3. If tasks.length === 0, render a simple "No registry entries found"
     message with a link back to home.

Implementation:

  import { redirect } from 'next/navigation';
  import { getRegistryTasks } from '@/lib/data';

  export default function RegistryPage() {
    const tasks = getRegistryTasks();

    if (tasks.length > 0) {
      redirect(`/registry/${tasks[0]}`);
    }

    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">Registries</h1>
        <p className="text-sm text-muted-foreground">No registry entries have been added yet.</p>
      </div>
    );
  }

This is a static redirect — Next.js will resolve it at build time since
getRegistryTasks() is a cached server function reading static JSON.
No client-side logic needed.

═══════════════════════════════════════════════════
VALIDATION CHECKLIST
═══════════════════════════════════════════════════
□ Navigating to /registry redirects to /registry/embedding (or first task)
□ If no registry tasks exist, a graceful message is shown
□ No runtime errors; no hydration warnings
□ npm run build completes without errors
□ TypeScript: npx tsc --noEmit passes clean

REGRESSION CHECKLIST
□ /registry/embedding and all other task pages unaffected
□ Sidebar Registries section link behavior unchanged
□ Home page Categories Registry card still works (now links to /registry
  which redirects correctly)
□ No changes to data layer
```

---

## Freeze Clearance Note

After Phase 5 completes, run the full validation suite:

```
npx tsc --noEmit          # Must be zero errors
npm run lint              # Must be zero errors
npm run build             # Must complete without warnings
```

Then do a manual walkthrough on a mobile viewport (375px) confirming:

Sidebar collapses correctly → section titles link correctly → list pages show discriminating details → home page section order is correct → continue reading persists and restores scroll → `/registry` redirects correctly.

After this walkthrough passes, the UI is ready for freeze. No further structural changes should be accepted.