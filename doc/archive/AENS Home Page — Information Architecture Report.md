
---

# AENS Home Page — Information Architecture Report

---

## 1. Inspection Report

### Finding 1 — Quick Access is architecturally misplaced and will not scale

Quick Access renders full data from `getAllPackages()`, `getAllModels()`, `getAllWorkflows()`, and `getRegistryTasks()` — every single record, all loaded on the home page. Today this is 6 packages, 3 workflows, 7 models. At 500 packages this becomes 500 full JSON objects fetched and partially rendered on every home page load.

More critically, Quick Access is a **list page duplicate with less information**. The Packages card shows 6 packages out of N — which 6? The first 6 alphabetically from `packages.slice(0, 6)`. There is no curation, no relevance, no recency signal. The user already has a dedicated `/packages` page with all packages, a filter bar, and summaries. The Quick Access card adds nothing except noise and scroll length.

The Models Library card renders pill-shaped model name chips with no `use_when`, no category signal beyond "ML/DL/LLM". Tapping a chip navigates directly to a model detail page — skipping the model category list page entirely. At 300 models this card will show 4 out of 300 with no principle for which 4.

Registry Tasks card renders raw task slugs (`embedding`, `reranker`, etc.) as pill links. This is the only place on the Home page where the label is not human-readable. It is inconsistent with every other element.

**Verdict: Quick Access must be removed entirely.** The Categories section already provides direct navigation to every section. Quick Access duplicates that navigation with worse information and more scroll cost.

---

### Finding 2 — Categories section is the right abstraction but is undersized

Categories currently renders 7 small cards in a `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5` grid. Each card shows only a label and an entry count. This is the most efficient navigation element on the page — one tap to any section — but it communicates almost nothing useful. "Packages — 6 entries" tells you nothing you don't already know.

At 500 packages, "Packages — 500 entries" is still meaningless. The count is not a useful discriminator. What would actually help at scale is a one-line description of what kind of content lives in each section — a stable description that does not change as counts grow.

Additionally, the Categories grid forces a 2-column layout on 390px mobile. Seven cards = 4 rows of 2 + 1 orphan. This is 4 rows of vertical scroll just for navigation entry points. It should be denser.

---

### Finding 3 — Recently Updated and Recent Knowledge are duplicates with different data sources

**Recently Updated** shows the 6 most recently `updated_at` items from static JSON — content the author updated.

**Recent Knowledge** shows the 6 most recently visited pages from `localStorage` — content the user visited.

Both render identical card layouts. Both show a name, a type badge, and a timestamp. Both have 6 items in a 2-column grid. A user returning to the home page sees two sections of similar-looking cards with different headings, requiring conscious effort to distinguish them.

At scale — 500 packages, 1000 cheatsheets — "Recently Updated" becomes increasingly useless because: (a) it only surfaces 6 items regardless of catalog size, (b) there is no reason for the user to care which of 1500 items was updated 3 days ago unless they are actively tracking changes, (c) on mobile this section occupies 3 card rows (6 items / 2 columns) of vertical space every single day even if the user never looks at it.

**Recent Knowledge is more valuable** because it reflects actual user behavior. It is personalized. Recently Updated is the same for every session.

---

### Finding 4 — Section ordering does not match actual usage frequency

Current order after Phase 2 implementation:

1. Search
2. Continue Reading *(conditional)*
3. Recent Knowledge *(conditional)*
4. Categories
5. Recently Updated
6. Quick Access

The problem: **Categories is the primary navigation hub** — the one element a user needs on every session to reach any section. It is currently in position 4, below two conditional sections that may or may not be present. On a fresh session with no localStorage data, the user sees: Search → [nothing] → [nothing] → Categories. That is correct. But on a returning session with data, the user sees: Search → Continue Reading → Recent Knowledge → Categories. The most important static navigation element (Categories) is pushed down by dynamic sections.

"Recently Updated" has no session value. It is static, does not change between sessions, and rewards reading only if the user is actively tracking catalog updates. It is positioned above Quick Access but below Categories — there is no hierarchy logic here.

---

### Finding 5 — Recent Knowledge grid is inefficient on mobile

6 items in `grid-cols-2` = 3 rows. Each card has a name (truncated), a type badge, and a timestamp. At 390px, each card is ~183px wide. The name truncates at approximately 16 characters. For entries like "Gradient Boosting Classifier" or "Fine-tuning with LoRA", truncation destroys the label before the user can read it.

The type badge on each card is redundant in context — if you're looking at Recent Knowledge, all items are knowledge items. The badge only matters if you want to filter by type, which is not currently possible in this section.

The timestamp ("2h ago", "3d ago") is displayed with a Clock icon. At 390px, the Clock icon + timestamp text competes with the name for horizontal space. The Clock icon is decorative — it does not add information the word "ago" doesn't already convey.

---

### Finding 6 — Quick Access SectionCard headers consume significant space with no navigation value

Each SectionCard has a header with a title (e.g. "Python Packages") and a subtitle (e.g. "6 cataloged"). The header is `px-4 py-3` — 40px tall. The card has `p-4` content padding. On mobile, a 2-column grid means each card is roughly half the viewport width. The header alone uses ~40px of a card that may be 200px tall — 20% of card height just for a label.

The SectionCard headers duplicate the section-level navigation already in Categories. "Python Packages — 6 cataloged" in a Quick Access card and "Packages — 6 entries" in a Categories card convey identical information.

---

### Finding 7 — Models Library card in Quick Access is structurally wrong

The Models Library card groups ML, DL, LLM models into three sub-sections with separate labels and pill chips. This is the only card in Quick Access with internal grouping. Every other card is a flat list. This structural inconsistency creates a longer card that forces the Workflows card into a third row on mobile (the 2-column grid breaks because one card is taller than the other).

At 300 models, `mlModels.slice(0, 4)` will show 4 of 300 ML models. There is no signal for which 4 matter. They will be the first 4 alphabetically from `getAllModels('ml')`. The user has no reason to trust or use these 4 chips as entry points.

---

### Finding 8 — The home page subtitle is permanently wrong

```
"Static reference for packages, models, workflows, registries, and cheatsheets."
```

This is accurate now. In 5 years, if new content types are added, this line becomes stale. More importantly, the subtitle takes up 2 lines on mobile and describes what the user can already see in the Categories section. It adds no navigation value.

---

## 2. Priority Matrix

### Critical

**C1 — Remove Quick Access entirely.**
It duplicates Categories, loads unnecessary data, will not scale, and adds 400–600px of scroll on mobile. Categories already handles all navigation. No information is lost.

**C2 — Merge "Recently Updated" into "Recent Knowledge" as a tab or remove it.**
Two near-identical card sections with different data sources creates confusion. Users should not spend cognitive effort distinguishing them. Recent Knowledge (personalized, dynamic) is more valuable than Recently Updated (static, impersonal). The resolution: keep Recent Knowledge, remove Recently Updated. If content update tracking is wanted in future, it belongs on the individual list pages (e.g. `/packages` sorted by `updated_at`), not the home page.

**C3 — Fix Categories section information density.**
Add a one-line stable description per category. Replace the useless entry count with something more informative: for Packages, show task count; for Models, show category breakdown; for Cheatsheets, show entry count. The count is fine — but "6 entries" vs "47 tasks across 6 packages" is the difference between decoration and information.

### High

**H1 — Remove the home page subtitle.**
"Static reference for packages, models, workflows, registries, and cheatsheets." It occupies 2 lines of mobile space and duplicates Categories. The title "AI Engineering Handbook" is sufficient.

**H2 — Reduce Recent Knowledge to a compact horizontal scroll or slim list.**
The 2-column grid of 6 cards is too tall on mobile. 3 rows × card height ≈ 240–280px of scroll for what is essentially a "recently visited" list. A slim single-column list of 5 items with name + type + time is more readable and takes half the vertical space.

**H3 — Remove the Clock icon from Recent Knowledge timestamps.**
Decorative. The word "ago" is already clear. Removing the icon recovers 16px of horizontal space per card, allowing longer names to display without truncation.

### Medium

**M1 — Add stable descriptions to Categories cards.**
Each category card should have a one-line description that never changes regardless of catalog size. This is a static string — no data dependency.

**M2 — Reorder sections to: Search → Continue Reading → Categories → Recent Knowledge.**
Categories is the primary navigation hub and should appear before Recent Knowledge. Continue Reading sits directly after Search because it is the highest-priority action (resume interrupted reading). Recent Knowledge comes after Categories because it is supplementary — "where I was" vs "where I can go."

**M3 — Remove "Sorted by updated_at" label from Recently Updated.**
If the section is removed (C2), this is moot. If kept, the label adds no value to the user — it is an implementation detail.

### Low

**L1 — Remove type badge from Recent Knowledge cards.**
In a section titled "Recent Knowledge", the badge adds no discriminating value. The content type is already implied. Removing it recovers horizontal space and reduces visual noise.

**L2 — Reduce recent items from 6 to 5 in Recent Knowledge.**
5 items in a single-column slim list is more readable than 6 items in a 2-column grid. Odd numbers also eliminate the orphaned card problem on 2-column grids.

---

## 3. Rejected Ideas

**Merge Recently Updated into Recent Knowledge as tabs.**
Rejected. Tab components require client-side state. The architecture is frozen. The solution is simpler: remove Recently Updated entirely. It is the weaker of the two sections. Tab UI adds complexity for zero information gain.

**Add reading progress percentage to Recent Knowledge cards.**
Rejected. Reading progress is stored only for `ContinueReadingItem` (items that met the 45-second dwell threshold). Recent Knowledge stores all visits — most items will have no scroll data. Displaying "0%" on recently visited items is misleading and requires fallback logic. The Continue Reading card already surfaces progress for the most important item.

**Group Recent Knowledge cards by content type.**
Rejected. Grouping requires client-side sorting and group headers, which adds DOM complexity. The benefit is marginal: the user can already see types via the (optional) badge. At 6 items, grouping adds cognitive overhead without navigation benefit.

**Add a "Pinned" or "Favorites" section.**
Rejected. Requires persistent storage writes from content pages, a new data shape in `session-tracking.ts`, and UI to add/remove pins. This is architecture work disguised as a home page improvement. The Continue Reading system already handles "return to important content."

**Show summary text inside Categories cards.**
Rejected. The category descriptions should be short static strings (one line), not pulled from data. Adding summary data to the category grid requires either hardcoding or a new data contract. The categories are section-level navigation — they should communicate "what kind of thing" with a single short phrase, not a paragraph.

**Replace Categories grid with a sidebar-style vertical nav on desktop.**
Rejected. The sidebar already IS that vertical nav. Duplicating it on the home page creates redundancy. The home page Categories grid is the mobile entry point — on desktop the sidebar handles section navigation. This proposal eliminates a mobile affordance to solve a desktop problem that does not exist.

**Add icons to Categories cards.**
Rejected. Decorative. No icons exist in the current design system for content types. Adding them requires choosing, importing, and maintaining a set of semantic icons. The label is sufficient.

**Show "last visited" on Categories cards.**
Rejected. This requires cross-referencing Recent Knowledge data with category hrefs at render time — client-side logic inside a server component. Architecture violation.

**Paginate Recent Knowledge beyond 6 items.**
Rejected. If the user wants their full visit history, the relevant tool is the browser's own history. Recent Knowledge's value is recency — showing the last 5 items is the correct scope. More items = more scroll = less value.

**Add a "New content this week" section.**
Rejected. Requires comparing `updated_at` dates against the current date at runtime. The home page is a server component with static data. This would require either a client component or a build-time constant, both of which add complexity. The `/packages`, `/cheatsheets`, etc. list pages already sort by `updated_at` on dedicated list pages.

---

## 4. Implementation Prompts

### Phase 1 — Remove Quick Access and Recently Updated

**Purpose:** Eliminate the two largest sources of scroll waste and data over-fetching on the home page. After this phase, the home page will be significantly shorter and faster. No components are deleted — only page-level JSX and data fetches are removed.

```
AENS — Phase 1: Remove Quick Access and Recently Updated from Home
Target: D:\Project\ai-engineering-handbook
File to modify: app/page.tsx ONLY.
Do NOT modify any component file.
Do NOT modify any data file.
Do NOT modify any schema or type.

═══════════════════════════════════════════════════
REMOVALS
═══════════════════════════════════════════════════

1. Remove the entire {/* Quick Access */} section block from the JSX.
   This is the <section> containing the SectionCard grid with
   "Python Packages", "Models Library", "Workflows", "Registry Tasks".

2. Remove the entire {/* Recently Updated */} section block from the JSX.
   This is the <section> containing recent.slice(0, 6).map(...).

3. Remove these now-unused imports from the top of the file:
   - SectionCard (no longer used)
   - ContentTypeBadge (no longer used — was used only in Recently Updated)

4. Remove these now-unused data fetches from the function body:
   - const packages = getAllPackages()
   - const mlModels = getAllModels("ml")
   - const dlModels = getAllModels("dl")
   - const llmModels = getAllModels("llm")
   - const registryTasks = getRegistryTasks()
   - const workflows = getAllWorkflows()
   - const recent = getRecentContent(8)
   - const totalModelsCount = counts.models_ml + counts.models_dl + counts.models_llm

5. Remove these now-unused function imports from "@/lib/data":
   - getAllPackages
   - getAllModels
   - getRegistryTasks
   - getAllWorkflows
   - getRecentContent

   Keep: getDashboardCounts, buildSearchIndex

6. Keep all of the following unchanged:
   - The Global Search section
   - <ContinueReadingSection />
   - <RecentKnowledgeSection />
   - The Categories section (entire block unchanged)
   - All remaining imports

═══════════════════════════════════════════════════
EXPECTED RESULT
═══════════════════════════════════════════════════
The home page renders exactly four sections:
  1. Global Search (with title and SearchBox)
  2. Continue Reading (conditional, from localStorage)
  3. Recent Knowledge (conditional, from localStorage)
  4. Categories (7 cards, static)

═══════════════════════════════════════════════════
ACCEPTANCE CRITERIA
═══════════════════════════════════════════════════
□ Home page renders with no errors
□ No TypeScript errors: npx tsc --noEmit
□ No lint errors: npm run lint
□ npm run build completes successfully
□ The four sections above are visible; no other sections exist
□ SectionCard and ContentTypeBadge are NOT imported in app/page.tsx
□ getAllPackages, getAllModels, getAllWorkflows, getRecentContent
  are NOT imported in app/page.tsx

═══════════════════════════════════════════════════
REGRESSION CHECKLIST
═══════════════════════════════════════════════════
□ /packages page unaffected
□ /models/* pages unaffected
□ /workflows page unaffected
□ /cheatsheets page unaffected
□ /registry page unaffected
□ Sidebar navigation unaffected
□ Search unaffected
□ ContinueReadingSection behavior unaffected
□ RecentKnowledgeSection behavior unaffected
□ SectionCard component file itself is NOT deleted
  (it may be used elsewhere)
```

---

### Phase 2 — Add Stable Descriptions to Categories Cards

**Purpose:** Make each Categories card communicate what kind of content lives in that section — a one-line stable description that never changes regardless of catalog size. This is the difference between a navigation grid that tells the user nothing and one that helps them choose a destination.

```
AENS — Phase 2: Categories Cards — Add Stable Descriptions
Target: D:\Project\ai-engineering-handbook
File to modify: app/page.tsx ONLY.
Do NOT modify any component file.
Do NOT modify any data file.

═══════════════════════════════════════════════════
CONTEXT
═══════════════════════════════════════════════════
The Categories section currently renders cards with only a label and
an entry count. The descriptions below are static strings — they are
NOT fetched from data and do NOT change as content grows.

═══════════════════════════════════════════════════
CHANGE
═══════════════════════════════════════════════════
In the Categories section, replace the existing array of category objects:

  { label: 'Packages', count: counts.packages, href: '/packages' }
  etc.

With this new array that adds a `description` field to each entry:

  { label: 'Packages',    description: 'Python libraries, tasks, and API patterns', count: counts.packages,      href: '/packages'   },
  { label: 'ML Models',   description: 'Classical machine learning algorithms',      count: counts.models_ml,     href: '/models/ml'  },
  { label: 'DL Models',   description: 'Neural network architectures and backbones', count: counts.models_dl,     href: '/models/dl'  },
  { label: 'LLM Models',  description: 'Large language model checkpoints',           count: counts.models_llm,    href: '/models/llm' },
  { label: 'Workflows',   description: 'End-to-end ML pipelines and snippets',       count: counts.workflows,     href: '/workflows'  },
  { label: 'Cheatsheets', description: 'Syntax references and code patterns',        count: counts.cheatsheets,   href: '/cheatsheets'},
  { label: 'Registries',  description: 'Model checkpoints indexed by task',          count: counts.registry_tasks,href: '/registry'   },

Update the card JSX to render the description.
The current card body is:

  <div className="text-sm font-medium text-foreground">{cat.label}</div>
  <div className="text-[10px] font-mono text-muted-foreground mt-1">{cat.count} entries</div>

Replace with:

  <div className="text-sm font-medium text-foreground">{cat.label}</div>
  <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{cat.description}</div>
  <div className="text-[10px] font-mono text-muted-foreground/60 mt-1">{cat.count} entries</div>

Do NOT change the grid layout, Link wrapper, className, or filter logic.

═══════════════════════════════════════════════════
ACCEPTANCE CRITERIA
═══════════════════════════════════════════════════
□ Each category card shows: label (top), description (middle), count (bottom)
□ All 7 category cards render with their descriptions
□ Cards that have count === 0 are still filtered out (existing .filter logic)
□ npx tsc --noEmit passes
□ npm run lint passes

═══════════════════════════════════════════════════
REGRESSION CHECKLIST
═══════════════════════════════════════════════════
□ Category card links still navigate to correct hrefs
□ Grid layout unchanged (grid-cols-2 sm:grid-cols-3 lg:grid-cols-5)
□ No new imports required
□ No other sections modified
```

---

### Phase 3 — Compact Recent Knowledge Layout

**Purpose:** Replace the 2-column card grid with a slim single-column list. This halves the vertical space consumed by Recent Knowledge on mobile, eliminates the name truncation problem, removes the decorative Clock icon, and removes the type badge (redundant in this context). The section becomes a fast-scan "recently visited" list rather than a visual card gallery.

```
AENS — Phase 3: Compact Recent Knowledge Layout
Target: D:\Project\ai-engineering-handbook
File to modify: components/shared/RecentKnowledgeSection.tsx ONLY.
Do NOT modify app/page.tsx.
Do NOT modify session-tracking.ts.
Do NOT modify any other component.

═══════════════════════════════════════════════════
CONTEXT
═══════════════════════════════════════════════════
The current layout renders 6 items in a 2-column card grid.
On 390px mobile this creates ~280px of vertical scroll for navigation history.
Names truncate because each card is only ~183px wide.
The Clock icon and type badge add visual noise without navigation value.

The new layout is a single-column list of 5 items.
Each row: name on the left, "type · time" on the right.
No card borders. No grid. No icon. No badge.
This is a reading history list, not a gallery.

═══════════════════════════════════════════════════
NEW LAYOUT SPECIFICATION
═══════════════════════════════════════════════════
Replace the entire return() block with:

  <section className="space-y-2">
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold text-foreground">Recent Knowledge</h2>
      <button
        onClick={handleClear}
        className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
      >
        Clear
      </button>
    </div>
    <ul className="space-y-0">
      {items.slice(0, 5).map((item, idx) => (
        <li key={`${item.href}-${idx}`}>
          <Link
            href={item.href}
            className="flex items-center justify-between gap-3 py-1.5 hover:bg-muted/40 -mx-1 px-1 rounded transition-colors"
          >
            <span className="text-xs text-foreground truncate min-w-0 font-medium">
              {item.name}
            </span>
            <span className="shrink-0 text-[10px] font-mono text-muted-foreground whitespace-nowrap">
              {formatContentType(item.type)} · {formatTimeAgo(item.timestamp)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </section>

═══════════════════════════════════════════════════
IMPORTS TO ADD
═══════════════════════════════════════════════════
Add this import (formatContentType is already used in the codebase):
  import { formatContentType } from '@/lib/resources';

Remove these imports (no longer used):
  - Clock from 'lucide-react'
  - ContentTypeBadge

Keep:
  - X from 'lucide-react' — REMOVE (the clear button no longer uses it;
    the button now uses only text "Clear")
  - All session-tracking imports unchanged
  - formatTimeAgo function unchanged

═══════════════════════════════════════════════════
ACCEPTANCE CRITERIA
═══════════════════════════════════════════════════
□ Recent Knowledge renders as a single-column list (no grid)
□ Each row shows: name (left, truncated if needed) · type · time (right)
□ Maximum 5 items shown (slice(0, 5))
□ Section is hidden when items.length === 0 (existing behavior preserved)
□ Clear button still works and empties the list
□ No Clock icon, no type badge card, no 2-column grid
□ npx tsc --noEmit passes
□ npm run lint passes

═══════════════════════════════════════════════════
REGRESSION CHECKLIST
═══════════════════════════════════════════════════
□ localStorage read/write behavior unchanged
□ formatTimeAgo output unchanged
□ SSR-safe initialization (useState([]) + useEffect) unchanged
□ ContinueReadingSection unaffected
□ app/page.tsx unaffected
```

---

### Phase 4 — Remove Home Page Subtitle

**Purpose:** The subtitle "Static reference for packages, models, workflows, registries, and cheatsheets." occupies 2 lines on mobile and describes what the Categories section already shows. It is a first-impression description, not a navigation aid. After years of daily use, it is pure noise.

```
AENS — Phase 4: Remove Home Page Subtitle
Target: D:\Project\ai-engineering-handbook
File to modify: app/page.tsx ONLY.

═══════════════════════════════════════════════════
CHANGE
═══════════════════════════════════════════════════
In the Global Search section, find and remove ONLY this element:

  <p className="content-prose mt-1 text-xs text-muted-foreground">
    Static reference for packages, models, workflows, registries, and cheatsheets.
  </p>

Also remove the wrapping <div> around the h1 if it only contains
the h1 and this p — replace it with just the h1 directly, keeping
the same spacing. If the <div> wraps other content, leave the div
and only remove the <p>.

Keep:
  - The h1 "AI Engineering Handbook" unchanged
  - The SearchBox unchanged
  - The section className unchanged

═══════════════════════════════════════════════════
ACCEPTANCE CRITERIA
═══════════════════════════════════════════════════
□ The subtitle paragraph is gone
□ The h1 still renders correctly
□ The SearchBox still renders directly below the h1
□ npx tsc --noEmit passes
□ npm run lint passes

═══════════════════════════════════════════════════
REGRESSION CHECKLIST
═══════════════════════════════════════════════════
□ Search functionality unaffected
□ All other sections unaffected
□ No new imports or removals beyond the paragraph element
```

---

**Final state after all four phases:**

The home page will contain exactly:

1. **Search** — title + search box. No subtitle.
2. **Continue Reading** — single card, conditional, visible only when qualified reading session exists.
3. **Recent Knowledge** — slim 5-item list, conditional, personalized visit history.
4. **Categories** — 7 cards with label + description + count. Primary navigation hub.

Total mobile scroll on a cold session (no localStorage): approximately 300px — title, search box, 7 category cards. This is the correct target. Every subsequent session adds at most one Continue Reading card (~80px) and up to 5 Recent Knowledge rows (~120px). The page never grows beyond a single screen height on mobile regardless of how large the knowledge base becomes.