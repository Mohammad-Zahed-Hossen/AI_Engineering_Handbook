# AENS V1.0 FINAL Mobile UI/UX Freeze Audit

**Principal UX Architect / HCI Researcher Assessment**  
**Date:** July 2026  
**Scope:** UI / UX / Interaction / Layout / Mobile Ergonomics ONLY  
**Architecture, Schemas, Navigation Hierarchy, Data Layer:** FROZEN — not reviewed  
**Previous Audit:** Claude audit (M1–M5) has been fully implemented and verified in code.

---

## Ground Truth — What the Previous Audit Fixed

The prior audit correctly identified 5 critical issues. All 5 have been implemented in the current codebase:

| Fix | Status | Evidence in Code |
|---|---|---|
| **M1** Content padding | ✅ | `app/layout.tsx:79` — `px-4 py-5 md:px-8 md:py-8` |
| **M2** Menu icon button | ✅ | `MobileSidebarTrigger.tsx:89-94` — 44×44px `Menu` icon button |
| **M3** Code block overflow + copy | ✅ | `CodeBlock.tsx:25-58` — fade overlay + mobile bottom copy bar |
| **M4** Mobile TOC bottom sheet | ✅ | `MobileTOC.tsx` — sticky § bar + `Sheet side="bottom"` |
| **M5** Collapsible package tasks | ✅ | `PackageTaskList.tsx` — `Set<number>` expanded state, hash auto-expand |

These 5 fixes are **well-implemented** and should be protected. The following audit builds upon them.

---

## Executive Scores

| Dimension | Current Score | Target Score | Gap |
|---|---|---|---|
| **Overall Mobile UX** | 6.8 / 10 | 9.0 / 10 | -2.2 |
| **Overall Cognitive Load** | 6.5 / 10 | 9.0 / 10 | -2.5 |
| **Overall Long-term Usability** | 7.0 / 10 | 9.0 / 10 | -2.0 |
| **Overall Mobile Ergonomics** | 6.5 / 10 | 9.0 / 10 | -2.5 |

*Scores are calibrated against Obsidian Mobile, GitHub Mobile, and DevDocs as reference benchmarks for personal knowledge tools.*

---

## Top 20 Usability Problems (Ranked by Daily Impact)

### Critical (Session-breaking without workaround)

**P1 — Cheatsheet entries are not collapsible**
- **File:** `app/cheatsheets/[id]/page.tsx:56-132`
- **HCI Principle:** Progressive Disclosure, Miller's Law (7±2 chunks), Long-session Fatigue
- **Evidence:** Every `entry` renders its full problem statement, trigger, notes, common bug, docs link, and code snippet unconditionally. A 15-entry cheatsheet becomes 10,000+ px of vertical scrolling.
- **Impact:** The user specifically called this "the highest priority page." A 6-hour study session with frequent cheatsheet reference means this is the single most mentally exhausting page in the app.
- **Daily frequency:** Very high (cheatsheets are study-session workhorses)
- **Severity:** 🔴 Critical

**P2 — Model category list renders as a 6-column table on mobile**
- **File:** `components/shared/FilterBar.tsx:112-178`
- **HCI Principle:** Fitts' Law, Mobile Information Architecture, Thumb Reach
- **Evidence:** The `ModelListFilter` renders a `<table>` with 6 columns (Name, Summary, Problem Types, Inference, Memory, Action). On a 390px screen, each column is ~65px wide. Text wraps aggressively, row heights become unpredictable, and the "Action" column is in the far thumb-opposite corner.
- **Impact:** A user cannot scan models on mobile. They must pinch-zoom or horizontal-scroll to read a single row. This defeats the purpose of a model library.
- **Daily frequency:** High (model comparison is a core workflow)
- **Severity:** 🔴 Critical

**P3 — Registry page renders as a 4-column table on mobile**
- **File:** `app/registry/[task]/page.tsx:76-117`
- **HCI Principle:** Same as P2 — table abuse on mobile
- **Evidence:** The table has columns for Model ID, Task, Size, Link. While it has `overflow-x-auto`, the user must horizontal-scroll to see the "Link" column, which is the primary action.
- **Impact:** Registry navigation requires two-handed interaction (scroll left, then tap).
- **Daily frequency:** Medium
- **Severity:** 🔴 Critical

---

### High (Major friction, but workaround exists)

**P4 — Cheatsheet code blocks do not use the `CodeBlock` component**
- **File:** `app/cheatsheets/[id]/page.tsx:124-128`
- **HCI Principle:** Consistency, Recognition over Recall, Fitt's Law
- **Evidence:** The code snippet is rendered as a raw `<pre>` with no copy button, no overflow fade signal, no syntax highlighting class, and no mobile bottom copy bar. The user must manually select and copy code on mobile — a high-friction operation.
- **Impact:** Every code snippet on the highest-priority page requires manual selection. The user explicitly stated "Copy Snippet → Continue Reading" happens hundreds of times per session.
- **Severity:** 🟠 High

**P5 — Search results dropdown is not keyboard-aware on mobile**
- **File:** `components/shared/SearchBox.tsx:153-266`
- **HCI Principle:** Visual Affordance, Cognitive Load, Context Preservation
- **Evidence:** When the mobile virtual keyboard opens (occupying ~45% of screen height), the search results dropdown (`absolute z-20 mt-1 ...`) appears below the input. If the user types 3+ characters, only the top 2-3 results are visible above the keyboard. The remaining results are hidden behind the keyboard with no visual signal that more exist.
- **Impact:** The user cannot see all results without dismissing the keyboard, which adds a tap. Search is the heart of the app; this friction compounds across hundreds of daily searches.
- **Severity:** 🟠 High

**P6 — No reading progress indicator on long content pages**
- **File:** Global (all detail pages)
- **HCI Principle:** Information Scent, Cognitive Load, Long-session Fatigue
- **Evidence:** A package with 10 collapsed tasks, a cheatsheet with 15 entries, or a workflow with 8 steps has no progress bar, "X of Y" indicator, or scroll position memory. The user has no sense of "how much more is there?"
- **Impact:** In a 6-hour session, this creates scroll anxiety. The user doesn't know if they're 20% or 80% through the content.
- **Severity:** 🟠 High

**P7 — No "Back to Top" affordance on mobile**
- **File:** Global
- **HCI Principle:** Fitts' Law, Navigation Efficiency, Thumb Reach
- **Evidence:** After scrolling through 6,000px of package tasks or cheatsheet entries, returning to the top requires either (a) a long thumb swipe, or (b) tapping the TOC sticky bar then selecting "Setup." Both are multi-step operations. There is no floating action button or bottom-bar shortcut.
- **Impact:** Every long page requires a thumb marathon to get back to the top. In a 6-hour session, this happens dozens of times.
- **Severity:** 🟠 High

**P8 — Cheatsheet listing page has extremely low information density**
- **File:** `app/cheatsheets/page.tsx:10-24`
- **HCI Principle:** Information Scent, Scanning Speed
- **Evidence:** Each cheatsheet card shows only `cs.name`. No entry count, no summary, no last-updated date, no problem domain preview. The user must tap into each cheatsheet to understand what it contains.
- **Impact:** With 10+ cheatsheets, the user cannot quickly identify which one contains the snippet they need. This defeats the purpose of a quick-reference system.
- **Severity:** 🟠 High

**P9 — Model listing page (category page) has extremely low information density**
- **File:** `app/models/[category]/page.tsx` (implicit — the FilterBar table is the only view)
- **HCI Principle:** Same as P8
- **Evidence:** The model category page offers only a table view (P2). There is no card-based alternative that shows summary, problem types, and performance metrics in a scannable format.
- **Impact:** The user cannot quickly scan and compare models on mobile.
- **Severity:** 🟠 High

---

### Medium (Noticeable friction, workaround is trivial)

**P10 — Home page "Recently Updated" 2-column grid is cramped on mobile**
- **File:** `app/page.tsx:53`
- **HCI Principle:** Reading Comfort, Information Density
- **Evidence:** `sm:grid-cols-2` means on a 390px screen, each card has ~170px of content width. The card contains a name, type badge, and date — all crammed into a narrow space. The badge and text compete for horizontal space.
- **Impact:** Reduced scannability. The user must read more carefully to identify the right card.
- **Severity:** 🟡 Medium

**P11 — No search history or recent searches**
- **File:** `components/shared/SearchBox.tsx`
- **HCI Principle:** Recognition over Recall, Navigation Efficiency
- **Evidence:** The search box shows only a `/` shortcut hint. When focused, it shows no recent searches, no frequently visited items, no "last 5 queries." The user must retype queries they've already used.
- **Impact:** The user's workflow is "Search → Model → Workflow → Package → Cheatsheet → Search → Another Model → Compare." Repeated searches for the same terms are common. Re-typing is friction.
- **Severity:** 🟡 Medium

**P12 — No "Continue Reading" or session resumption on home page**
- **File:** `app/page.tsx`
- **HCI Principle:** Context Preservation, Cognitive Load
- **Evidence:** The home page shows "Recently Updated" (sorted by `updated_at`) but not "Continue Reading" or "Last Visited." The user must remember where they left off and navigate there manually.
- **Impact:** In a multi-day study cycle, the user loses context between sessions. They must reconstruct their mental state each time.
- **Severity:** 🟡 Medium

**P13 — Dark mode toggle may be smaller than 44×44px**
- **File:** `components/layout/DarkModeToggle.tsx:88-98`
- **HCI Principle:** Fitts' Law, Touch Target Minimum
- **Evidence:** The button uses `size="icon-sm"` from shadcn/ui. The shadcn default for `icon-sm` is typically 32×32px or 36×36px, below the Apple HIG and Material Design minimum of 44×44px.
- **Impact:** The toggle is in the top-right corner (harder thumb reach) and may be too small for reliable tapping. Missed taps accumulate frustration.
- **Severity:** 🟡 Medium

**P14 — Mobile sidebar link text is very small (`text-[11px]`)**
- **File:** `MobileSidebarTrigger.tsx:69`
- **HCI Principle:** Reading Comfort, Accessibility
- **Evidence:** Navigation links use `text-[11px]` which is 0.6875rem. While legible on high-density screens, in a 6-hour session with varied lighting, this can cause eye strain. The section headings are `text-[9px]` (0.5625rem).
- **Impact:** Long-term reading comfort. The user will be using this app for years.
- **Severity:** 🟡 Medium

**P15 — Cheatsheet TOC truncates to 12 entries maximum**
- **File:** `app/cheatsheets/[id]/page.tsx:39-42`
- **HCI Principle:** Navigation Completeness, Information Scent
- **Evidence:** `cheatsheet.entries.slice(0, 12)` means entries 13+ have no TOC anchor. The user cannot jump to them via the MobileTOC. They must scroll manually.
- **Impact:** For large cheatsheets (e.g., NumPy operations with 20+ entries), the last 8 entries are navigationally orphaned.
- **Severity:** 🟡 Medium

**P16 — No sticky action bar for quick copy/navigate on detail pages**
- **File:** Global (all detail pages)
- **HCI Principle:** Thumb Reach, Navigation Efficiency
- **Evidence:** After reading a task or code snippet, there's no floating bottom bar with "Copy" or "Next Task" actions. The user must scroll back to the task header to expand/collapse or scroll to the code block to copy.
- **Impact:** Repeated thumb travel to interact with content elements.
- **Severity:** 🟡 Medium

**P17 — Package task list doesn't show progress indicator**
- **File:** `components/shared/PackageTaskList.tsx`
- **HCI Principle:** Progress Tracking, Cognitive Load
- **Evidence:** No "Task 3 of 8" or progress bar. The user has no sense of how many tasks remain in a package.
- **Impact:** In a 6-hour session, this creates uncertainty about scope.
- **Severity:** 🟡 Medium

**P18 — Workflow steps lack visual decision-map feel**
- **File:** `app/workflows/[id]/page.tsx:65-92`
- **HCI Principle:** Spatial Memory, Visual Hierarchy
- **Evidence:** Steps are rendered as a vertical numbered list with `border-b` separators. While functional, it doesn't leverage the "decision map" potential. No branching visualization, no conditional paths, no color-coding for decision points.
- **Impact:** The user explicitly stated workflows should feel like "interactive decision maps, not articles." The current layout is article-like.
- **Severity:** 🟡 Medium

**P19 — No font size adjustment for long sessions**
- **File:** Global (CSS in `globals.css`)
- **HCI Principle:** Reading Comfort, Accessibility, Personalization
- **Evidence:** Font sizes are hardcoded. In a 3–6 hour continuous session, eye fatigue is real. The user cannot increase text size for comfort or decrease it for density.
- **Impact:** Reduced long-session comfort. The user may need to take breaks due to eye strain rather than mental fatigue.
- **Severity:** 🟡 Medium

**P20 — Hover states on cards create sticky active states on mobile**
- **File:** Global (e.g., `app/page.tsx:69`, `app/packages/page.tsx:15`)
- **HCI Principle:** Touch Feedback, Visual Consistency
- **Evidence:** Cards use `hover:border-foreground/20 hover:bg-muted/30 transition-colors`. On mobile (touch devices), `:hover` often sticks after a tap until the user taps elsewhere. This creates a visually "selected" card that isn't actually selected.
- **Impact:** Visual confusion. The user may think a card is active when it's not.
- **Severity:** 🟡 Medium

---

## Top 20 Highest-Impact Improvements (Ranked by Effort-Benefit)

### Phase 1: Pre-Freeze Mandatory (Do Before Content Freeze)

| # | Improvement | Target File(s) | Effort | Impact | Principle |
|---|---|---|---|---|---|
| **1** | **Make cheatsheet entries collapsible** | `app/cheatsheets/[id]/page.tsx` | 2–3 hrs | 🔥 Critical | Progressive Disclosure, Miller's Law |
| **2** | **Add card-based mobile view for model list** | `components/shared/FilterBar.tsx` | 3–4 hrs | 🔥 Critical | Fitts' Law, Information Scent |
| **3** | **Add card-based mobile view for registry** | `app/registry/[task]/page.tsx` | 2 hrs | 🔥 Critical | Mobile Information Architecture |
| **4** | **Use `CodeBlock` component in cheatsheet entries** | `app/cheatsheets/[id]/page.tsx` | 30 min | 🔥 High | Consistency, Fitt's Law |
| **5** | **Make search dropdown keyboard-aware** | `components/shared/SearchBox.tsx` | 2 hrs | 🔥 High | Visual Affordance, Context Preservation |
| **6** | **Add "Back to Top" floating button** | New component + `app/layout.tsx` | 1 hr | 🔥 High | Fitts' Law, Thumb Reach |
| **7** | **Add reading progress indicator** | New component + `ContentPageLayout.tsx` | 1–2 hrs | 🔥 High | Information Scent, Cognitive Load |
| **8** | **Enrich cheatsheet listing with metadata** | `app/cheatsheets/page.tsx` | 30 min | 🟠 High | Information Scent, Scanning Speed |
| **9** | **Add card view toggle for model category** | `components/shared/FilterBar.tsx` | 2 hrs | 🟠 High | Information Scent, Mobile Ergonomics |
| **10** | **Add search history (localStorage)** | `components/shared/SearchBox.tsx` | 2–3 hrs | 🟠 Medium | Recognition over Recall |

### Phase 2: Post-Freeze Quality of Life (Can be added after freeze)

| # | Improvement | Target File(s) | Effort | Impact | Principle |
|---|---|---|---|---|---|
| **11** | **Add "Continue Reading" section to home** | `app/page.tsx` + localStorage | 2 hrs | 🟠 Medium | Context Preservation |
| **12** | **Fix dark mode toggle touch target** | `components/layout/DarkModeToggle.tsx` | 15 min | 🟡 Medium | Fitts' Law |
| **13** | **Increase sidebar link font size** | `MobileSidebarTrigger.tsx` | 15 min | 🟡 Medium | Reading Comfort |
| **14** | **Remove hover sticky states on mobile** | Global CSS + Tailwind | 30 min | 🟡 Medium | Touch Feedback |
| **15** | **Add "X of Y" progress to package tasks** | `components/shared/PackageTaskList.tsx` | 30 min | 🟡 Medium | Progress Tracking |
| **16** | **Remove 12-entry TOC limit on cheatsheets** | `app/cheatsheets/[id]/page.tsx` | 5 min | 🟡 Medium | Navigation Completeness |
| **17** | **Add sticky bottom action bar** | New component | 3 hrs | 🟡 Medium | Thumb Reach |
| **18** | **Add font size adjustment** | `globals.css` + new component | 2 hrs | 🟡 Medium | Accessibility, Reading Comfort |
| **19** | **Enhance workflow visual decision-map feel** | `app/workflows/[id]/page.tsx` | 4 hrs | 🟡 Medium | Spatial Memory |
| **20** | **Add "Recently Searched" to home** | `app/page.tsx` + localStorage | 1 hr | 🟡 Medium | Recognition over Recall |

---

## Page-by-Page Recommendations

### Home (`app/page.tsx`)

| Item | Finding | Recommendation | Priority |
|---|---|---|---|
| Recently Updated grid | `sm:grid-cols-2` is cramped on 390px | Change to `grid-cols-1` below `md`. Use `md:grid-cols-2`. | High |
| Popular Packages grid | `sm:grid-cols-2 lg:grid-cols-3` — same issue | Change to `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` | High |
| Quick Access section | `grid-cols-1 md:grid-cols-2` is correct | ✅ Protect | — |
| Categories grid | `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5` — 2-col on mobile is acceptable | ✅ Acceptable | — |
| Search prominence | Search box is first element, full-width | ✅ Good | — |
| Missing section | No "Continue Reading" or "Last Visited" | Add `localStorage`-based "Continue Reading" section above "Recently Updated" | Medium |
| Missing section | No "Recent Searches" | Add `localStorage`-based recent search pills | Medium |
| Hover states | `hover:bg-muted/30` on cards | Add `active:bg-muted/50` for touch feedback; remove sticky hover on mobile | Low |

### Search (`components/shared/SearchBox.tsx`)

| Item | Finding | Recommendation | Priority |
|---|---|---|---|
| Keyboard shortcut | `/` global shortcut works | ✅ Good | — |
| Mobile keyboard | Results hidden behind virtual keyboard | Add `scrollIntoView` for the dropdown container when results appear; constrain `max-h` to `calc(50vh - keyboard-height)` via `visualViewport` API | High |
| Result grouping | All types mixed in one flat list | Group results by type (Packages, Models, etc.) with sticky group headers | Medium |
| Empty state | "No results found." is minimal | Add "Did you mean?" suggestions or "Try searching for..." examples | Low |
| Recent searches | None | Store last 10 queries in `localStorage`; show as chips below the search input when focused with empty query | Medium |
| Active index | `scrollIntoView({ block: 'nearest' })` on arrow keys | ✅ Good | — |
| Highlight | `mark` with `bg-primary/15` | ✅ Good | — |
| Touch target | Each result is a full-width `Link` block | ✅ Good | — |

### Packages List (`app/packages/page.tsx`)

| Item | Finding | Recommendation | Priority |
|---|---|---|---|
| Card structure | Name + summary + version in a clean card | ✅ Good | — |
| Information density | Could show task count | Add `{pkg.tasks.length} tasks` below summary | Low |
| Scannability | Cards are large, easy to tap | ✅ Good | — |

### Package Detail (`app/packages/[id]/page.tsx` + `PackageTaskList.tsx`)

| Item | Finding | Recommendation | Priority |
|---|---|---|---|
| M5 collapsible tasks | Implemented correctly | ✅ Good | — |
| TOC | Includes task anchors + setup/summary | ✅ Good | — |
| Install/Import grid | `grid-cols-1 md:grid-cols-2` | ✅ Good | — |
| Progress indicator | No "Task X of Y" | Add a small "3 of 8 tasks" text below the task list header | Medium |
| Sticky actions | No quick access to copy or next task | Consider a floating bottom bar when scrolled past first task | Low |
| Task header | Number + name + trigger is scannable | ✅ Good | — |
| Chevron indicator | Clear expand/collapse affordance | ✅ Good | — |
| Hash auto-expand | Works via `useEffect` + hash listener | ✅ Good | — |
| Multiple open | Multiple tasks can be open simultaneously | ✅ Good (user may compare) | — |

### Cheatsheets List (`app/cheatsheets/page.tsx`)

| Item | Finding | Recommendation | Priority |
|---|---|---|---|
| Card content | Only shows `cs.name` | Add entry count, summary preview, and last-updated date | High |
| Card density | Very low — lots of empty space | Add `line-clamp-2` summary and `text-[10px]` entry count | High |
| Grid | Single column `space-y-3` | ✅ Good for mobile | — |

### Cheatsheet Detail (`app/cheatsheets/[id]/page.tsx`)

| Item | Finding | Recommendation | Priority |
|---|---|---|---|
| Collapse | No progressive disclosure | **Critical fix:** Make each entry collapsible like `PackageTaskList`. Show problem + trigger always visible; body (notes, bug, code) collapsed by default. | Critical |
| Code block | Raw `<pre>` without `CodeBlock` | **Replace with `<CodeBlock>` component** for copy button, overflow fade, and consistent styling | High |
| TOC limit | `slice(0, 12)` orphans entries | Remove limit; show all entries in TOC | Medium |
| Two-column grid | `lg:grid-cols-[1fr_1.2fr]` stacks on mobile | On mobile, the left column (trigger+notes+bug) should be first, then code below. This is correct. | ✅ Acceptable |
| Entry number | `#1`, `#2` etc. is clear | ✅ Good | — |
| Common bug | Amber border-left callout is visually distinct | ✅ Good | — |
| Docs link | "Docs ↗" is small but clear | ✅ Good | — |
| Scroll margin | `scroll-mt-24` on each entry | ✅ Good | — |

### Models List (`app/models/page.tsx`)

| Item | Finding | Recommendation | Priority |
|---|---|---|---|
| Grouping | ML / DL / LLM sections are clear | ✅ Good | — |
| Card density | Only shows name | Add summary preview and problem type tags | Medium |
| Grid | `space-y-2` single column | ✅ Good | — |

### Model Category (`app/models/[category]/page.tsx` + `FilterBar.tsx`)

| Item | Finding | Recommendation | Priority |
|---|---|---|---|
| Table on mobile | 6-column table is unusable | **Add a mobile card view:** render models as cards below `md` breakpoint, showing name, summary, problem type tags, and colored inference/memory badges. Keep table for `md+`. | Critical |
| Filter bar | Tags wrap correctly | ✅ Good | — |
| Filter state | Client-side only, no URL sync | Acceptable for a personal tool | — |
| Clear filters | "Clear Filters (N)" button is clear | ✅ Good | — |
| Empty state | "No models match..." is appropriate | ✅ Good | — |

### Model Detail (`app/models/[category]/[id]/page.tsx`)

| Item | Finding | Recommendation | Priority |
|---|---|---|---|
| Decision guide | Use When / Avoid When side-by-side cards | ✅ Good | — |
| Pros/Cons | Same split-card pattern | ✅ Good | — |
| Performance grid | `grid-cols-2 sm:grid-cols-4` — 2-col on mobile is fine | ✅ Good | — |
| Performance colors | Emerald/amber/rose for speed/memory | ✅ Good | — |
| Hyperparameters table | `overflow-x-auto` wrapper | Table is readable on mobile (3 columns: Name, Default, Description). The Name column is narrow but `font-mono text-primary` helps. | ✅ Acceptable |
| Quick Start | `CodeBlock` with syntax highlighting class | ✅ Good | — |
| TOC | 6 sections, well-structured | ✅ Good | — |
| Comparison | No explicit comparison UI | The Use/Avoid split already enables mental comparison. Acceptable per prompt constraint. | ✅ Acceptable |
| Missing | No "Competitors" or "Alternatives" section | Add `AlternativesList` component (already exists!) showing similar models in the same category | Medium |

### Workflows List (`app/workflows/page.tsx`)

| Item | Finding | Recommendation | Priority |
|---|---|---|---|
| Card structure | Name + overview + category | ✅ Good | — |
| Scannability | Clean, easy to tap | ✅ Good | — |

### Workflow Detail (`app/workflows/[id]/page.tsx`)

| Item | Finding | Recommendation | Priority |
|---|---|---|---|
| Step numbering | Circular badge with step number | ✅ Good | — |
| Step layout | Number on left, content on right | ✅ Good | — |
| Tools tags | Flex-wrap gap tags | ✅ Good | — |
| Key Decision | Highlighted box per step | ✅ Good | — |
| Failure points | Rose border-left callout | ✅ Good | — |
| Decision map feel | Linear list, no branching | Add color-coded step connectors (e.g., a vertical line connecting step badges) or conditional path indicators. Consider a Mermaid-like flow diagram for complex workflows. | Medium |
| Missing | No step collapse (not needed per prompt) | Acceptable for 4-8 steps | — |

### Registry (`app/registry/[task]/page.tsx`)

| Item | Finding | Recommendation | Priority |
|---|---|---|---|
| Table | 4-column table with `overflow-x-auto` | **Add card view for mobile:** render each model as a card with ID, size, and a prominent "View →" button. Hide table below `md`. | Critical |
| Header | Task badge + title is clear | ✅ Good | — |
| Empty state | Centered message with padding | ✅ Good | — |
| Model ID | `select-all` is useful for copying | ✅ Good | — |

### Navigation / Sidebar (`MobileSidebarTrigger.tsx`)

| Item | Finding | Recommendation | Priority |
|---|---|---|---|
| Sheet width | 280px is appropriate | ✅ Good | — |
| Touch targets | Section headers are tappable, 44px+ | ✅ Good | — |
| Link size | `text-[11px]` is small | Increase to `text-xs` (12px) minimum | Medium |
| Section counts | Badge with count is helpful | ✅ Good | — |
| Auto-close | Closes on navigation | ✅ Good | — |
| Models Library | Heading is not collapsible but subsections are | Make "Models Library" collapsible for consistency, or remove it as a heading and inline the ML/DL/LLM sections | Low |
| Active state | `bg-primary text-primary-foreground` is clear | ✅ Good | — |
| Scroll position | Sidebar doesn't remember scroll position | Add `localStorage` scroll position restoration | Low |

### Breadcrumbs (`components/shared/Breadcrumbs.tsx`)

| Item | Finding | Recommendation | Priority |
|---|---|---|---|
| Flex-wrap | Handles long paths correctly | ✅ Good | — |
| Separator | `/` is clear and minimal | ✅ Good | — |
| Last item | Bolded, non-clickable | ✅ Good | — |
| Mobile visibility | Hidden on very small screens? No, always visible | Acceptable — takes minimal space | — |

### Code Blocks (`components/shared/CodeBlock.tsx`)

| Item | Finding | Recommendation | Priority |
|---|---|---|---|
| M3 overflow fade | `bg-gradient-to-l from-zinc-950` on mobile | ✅ Good | — |
| M3 copy button | Desktop absolute + mobile bottom bar | ✅ Good | — |
| Font size | `text-[11px]` is very small | Acceptable for code density; consider `text-xs` for non-code blocks | — |
| Syntax highlighting | Only a CSS class `language-python` | No actual syntax highlighting library is applied. Consider adding `prismjs` or `shiki` for lightweight syntax highlighting. This is a content-quality issue, not strictly UI. | Low |
| Line numbers | None | Not needed for short snippets | — |
| Padding | `p-4 pt-8` gives room for desktop copy button | ✅ Good | — |
| Scrollbar | `scrollbar-thin` | ✅ Good | — |

### Mobile TOC (`components/shared/MobileTOC.tsx`)

| Item | Finding | Recommendation | Priority |
|---|---|---|---|
| Sticky bar | `sticky top-14` below TopBar | ✅ Good | — |
| § prefix | Clear section indicator | ✅ Good | — |
| Bottom sheet | `max-h-[60vh]` with scrollable list | ✅ Good | — |
| Active highlighting | `bg-muted/30` + `font-medium` | ✅ Good | — |
| URL update | `window.history.pushState` on click | ✅ Good | — |
| Scroll behavior | `scrollIntoView({ behavior: 'smooth' })` | ✅ Good | — |
| Minimum items | `items.length < 2` returns null | ✅ Good | — |

### Related Content (`components/shared/RelatedContent.tsx`)

| Item | Finding | Recommendation | Priority |
|---|---|---|---|
| Layout | Flex-wrap gap tags | ✅ Good | — |
| Badge + name | Compact and scannable | ✅ Good | — |
| Missing link handling | Falls back to `span` if no href | ✅ Good | — |
| Position | Bottom of page after all content | ✅ Good | — |

---

## Consistency Improvements

1. **Code block rendering inconsistency** — Package pages use `<CodeBlock>`; cheatsheet pages use raw `<pre>`. **Fix:** Always use `<CodeBlock>` for any code rendering.
2. **Table rendering inconsistency** — Model list and registry use tables; packages and cheatsheets use cards. **Fix:** Tables should have card-based mobile alternatives below `md`.
3. **Collapse behavior inconsistency** — Package tasks are collapsible; cheatsheet entries are not. **Fix:** Both should follow the same progressive disclosure pattern.
4. **Listing page density inconsistency** — Packages and workflows show summaries; cheatsheets and models (category) do not. **Fix:** All listing pages should show summary + metadata.
5. **SectionCard vs raw cards** — Home page uses `SectionCard` for quick access but raw `Link` cards for recent/packages. **Fix:** Standardize on `SectionCard` for all bordered content containers, or remove `SectionCard` and use a unified card primitive.
6. **Hover state inconsistency** — Some cards have `hover:bg-muted/30`, others have `hover:bg-muted`. **Fix:** Standardize on one hover state. Remove hover on mobile using `@media (hover: hover)`.
7. **Heading hierarchy** — `h1` is used for page titles, but some pages wrap `MetadataBadges` inside the `h1` header, others don't. **Fix:** Standardize header structure across all detail pages.
8. **TOC presence** — Some pages have TOC, some don't. **Fix:** All detail pages with 3+ sections should have TOC.
9. **"Official Resources" placement** — Always after header, before main content. **Fix:** Consistent placement is already mostly achieved. Verify all pages follow this.
10. **Border styling** — Some cards use `border-border`, others use `border-border/50`. **Fix:** Standardize on `border-border` for all cards.

---

## Reading Improvements

1. **Max line length** — `content-prose` uses `max-width: 72ch`. This is optimal for prose. ✅ Good.
2. **Line height** — `leading-relaxed` (1.625) on body text. Good for readability. ✅ Good.
3. **Paragraph rhythm** — `space-y-8` on `ContentPageLayout` children creates clear section breaks. ✅ Good.
4. **Code readability** — `text-[11px]` is small but necessary for mobile code density. Consider increasing to `text-xs` (12px) for non-code blocks.
5. **Section spacing** — `space-y-8` between sections, `space-y-4` within sections. Good rhythm. ✅ Good.
6. **Card padding** — `p-4` (16px) on cards. On mobile, this is appropriate. ✅ Good.
7. **Dark mode contrast** — Dark mode uses `oklch` values with sufficient contrast ratios. ✅ Good.
8. **Font family** — Geist Sans for UI, Geist Mono for code. Good pairing. ✅ Good.
9. **Heading sizes** — `text-2xl` (h1), `text-lg` (h2), `text-sm` (h3). Clear hierarchy. ✅ Good.
10. **Cheatsheet reading** — The highest-priority page has the worst reading experience due to non-collapsible entries. This is the single most impactful reading improvement.

---

## Navigation Improvements

1. **Mobile TOC** — Already implemented. The single most important navigation improvement. ✅ Good.
2. **Breadcrumbs** — Simple, functional, minimal. ✅ Good.
3. **Sidebar** — Sheet-based, auto-closing, collapsible sections. ✅ Good.
4. **Back to top** — Missing. Should be a floating button that appears after scrolling 300px.
5. **Search shortcut** — `/` global shortcut is excellent. ✅ Good.
6. **Search history** — Missing. Would reduce repeated typing friction.
7. **Continue reading** — Missing. Would help session resumption.
8. **Cross-linking** — `RelatedContent` at bottom of pages is good. Could be enhanced with "Related Tasks" within package pages.
9. **Model alternatives** — The `AlternativesList` component exists but is not used on model pages. It should show 3-5 similar models in the same category.
10. **Registry → Model linking** — Registry table shows model IDs but no link to the model detail page. If the model exists in the library, link to it.

---

## Information Density Improvements

1. **Home page grids** — `sm:grid-cols-2` for recent items is too cramped. Use `grid-cols-1` on mobile.
2. **Cheatsheet listing** — Only name shown. Add entry count + summary preview.
3. **Model listing** — Only name shown. Add summary + problem type tags.
4. **Package listing** — Good density (name + summary + version). ✅ Good.
5. **Workflow listing** — Good density (name + overview + category). ✅ Good.
6. **Task headers** — Good density (number + name + trigger). ✅ Good.
7. **Cheatsheet entries** — The two-column grid on desktop is good, but on mobile the stacked layout wastes vertical space. Collapse would fix this.
8. **Performance grid** — 2-col on mobile is a good density compromise. ✅ Good.
9. **Hyperparameter table** — 3 columns on mobile is readable. ✅ Good.
10. **Related content** — Compact flex-wrap tags. ✅ Good.

---

## Knowledge Discovery Improvements

1. **RelatedContent** — Already implemented at bottom of detail pages. ✅ Good.
2. **Package cross-links** — Task cards show related workflows and cheatsheets. ✅ Good.
3. **Model alternatives** — `AlternativesList` component exists but is unused. Add to model detail pages.
4. **Workflow starter stack** — Shows tools as tags. Good for discovery. ✅ Good.
5. **Cheatsheet docs links** — "Docs ↗" links to official docs. ✅ Good.
6. **Model problem types** — Shown as tags on detail page. Good for mental categorization. ✅ Good.
7. **Home page categories** — Quick access grid is good for discovery. ✅ Good.
8. **Search result metadata** — Shows type, category, and updated date. Good for disambiguation. ✅ Good.
9. **Missing:** "Frequently viewed together" or "Users who read X also read Y" — Could be added post-freeze based on `localStorage` analytics.
10. **Missing:** Inline cross-links within prose text — Package summaries could link to related models, model summaries could link to related packages.

---

## Search UX Improvements

1. **Opening** — Search is always visible in the TopBar. No extra tap to open. ✅ Good.
2. **Result grouping** — Flat list. Should be grouped by type with sticky headers.
3. **Result ranking** — Fuse.js handles this. ✅ Good.
4. **Recent searches** — Missing. Add `localStorage`-backed recent queries.
5. **Search history** — Same as above. Show 5-10 recent queries as pills below the input.
6. **Keyboard** — `/` shortcut is excellent. ✅ Good.
7. **Mobile interactions** — Dropdown hidden behind keyboard. Fix with `visualViewport` awareness.
8. **Search suggestions** — None. Could show "Popular searches" or "Try: PyTorch, Transformer, BERT" when empty.
9. **Search empty state** — "No results found." Minimal. Add suggestions.
10. **Search navigation** — Arrow keys + Enter work. ✅ Good.
11. **Search result density** — Each result shows name, type badge, category, summary, and date. Good density. ✅ Good.
12. **Search speed perception** — Fuse.js is fast. Results appear instantly. ✅ Good.
13. **Touch targets** — Each result is a full-width block. ✅ Good.
14. **Highlighting** — Match highlighting with `mark` element. ✅ Good.
15. **Close behavior** — Clicking a result clears the search. ✅ Good.

---

## Cheatsheet Redesign (Highest Priority Page)

### Current State
- Each entry is fully expanded
- 15 entries = 10,000+ px of scrolling
- Code blocks use raw `<pre>` without copy button
- No progressive disclosure
- TOC truncates at 12 entries

### Recommended Redesign

1. **Entry collapse** — Make each entry identical to the package task pattern:
   - Always visible: Problem statement + trigger (1-line summary)
   - Collapsed by default: Notes, common bug, code snippet, docs link
   - Tap header to expand/collapse
   - Multiple entries can be open simultaneously
   - Hash-based auto-expand on direct links

2. **CodeBlock integration** — Replace raw `<pre>` with `<CodeBlock>` component for every snippet.

3. **TOC completeness** — Remove the 12-entry limit. Show all entries in the TOC.

4. **Entry metadata** — Add entry count to the cheatsheet header: "15 entries".

5. **Copy workflow** — With `<CodeBlock>`, every snippet has a one-tap copy button.

6. **Visual grouping** — Add a subtle alternating background (`bg-card` vs `bg-muted/20`) or top-border accent to distinguish entries without relying solely on the border card.

### Implementation Sketch

```tsx
// CheatsheetEntry.tsx (new client component)
'use client';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CodeBlock } from '@/components/shared/CodeBlock';

export function CheatsheetEntry({ entry, idx, id }: ...) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <section id={id} className="scroll-mt-24 rounded-lg border border-border bg-card overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full px-4 py-3 ...">
        <span className="shrink-0 ...">#{idx + 1}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{entry.problem}</p>
          <p className="text-xs text-muted-foreground">{entry.trigger}</p>
        </div>
        {expanded ? <ChevronDown /> : <ChevronRight />}
      </button>
      {expanded && (
        <div className="p-4 space-y-3">
          {/* Notes, bug, CodeBlock, docs */}
        </div>
      )}
    </section>
  );
}
```

---

## Package Page Redesign (Already M5-Implemented)

### Current State (Post-M5)
- Tasks are collapsible ✅
- TOC includes task anchors ✅
- Multiple tasks can be open ✅
- Hash auto-expand works ✅

### Remaining Improvements

1. **Progress indicator** — Add "Task 3 of 8" text below the task list header.
2. **Sticky filter** — If packages grow to 20+ tasks, add a sticky search/filter bar for task names.
3. **Quick copy** — Consider adding a "Copy all syntax" button at the package level for quick reference.

---

## Workflow Redesign

### Current State
- Linear numbered list with step cards
- Clear tools tags and decision boxes
- Failure points as callout

### Recommended Improvements

1. **Visual connector** — Add a vertical line connecting the circular step badges to create a "timeline" feel. This makes the sequence visually obvious without adding clutter.

2. **Decision color-coding** — Use border color to indicate step type:
   - Default: `border-border`
   - Decision step: `border-primary/30` (when the step contains a key decision)
   - Failure risk: `border-amber-500/30` (when the step has known failure points)

3. **Starter stack prominence** — The starter stack is shown as small tags. Consider making it a more prominent horizontal scroll or a dedicated section if the stack grows beyond 5 items.

4. **Decision map feel** — Add a simple text-based flow diagram using ASCII or a lightweight Mermaid rendering for complex workflows (e.g., `if (data > 10k) → use distributed; else → use single-node`).

---

## Model Page Redesign

### Current State
- Use When / Avoid When split cards ✅
- Pros / Cons split cards ✅
- Performance grid ✅
- Hyperparameters table ✅
- Quick Start code block ✅

### Recommended Improvements

1. **Alternatives list** — The `AlternativesList` component exists but is unused. Add it to show 3-5 similar models in the same category, enabling the user's comparison workflow without a dedicated comparison page.

2. **Performance sparkline** — Instead of text labels (fast/medium/slow), use a 3-dot visual scale: `●○○` (slow), `●●○` (medium), `●●●` (fast). This is scannable at a glance.

3. **Hyperparameter mobile view** — Below `md`, render hyperparameters as a card list instead of a table:
   ```
   ┌─────────────────────────┐
   │ n_estimators            │
   │ Default: 100              │
   │ Number of trees in the   │
   │ forest.                  │
   └─────────────────────────┘
   ```
   This is more readable than a cramped table on mobile.

---

## Micro-Interaction Recommendations

1. **Touch feedback** — Replace `hover:` states with `active:` states on mobile using `@media (hover: hover)` or Tailwind's `hover:` combined with `active:bg-muted/50`. This prevents sticky hover artifacts.

2. **Copy confirmation** — The current copy button shows "✓ Copied" for 1.5s. This is good. Consider adding a brief haptic-style visual feedback (e.g., a scale pulse) on the button.

3. **Task expand animation** — The collapsible tasks use `{isExpanded && (...)}` which has no animation. Add `transition-all duration-200` to the content wrapper, or use CSS grid `grid-template-rows` animation for a smooth expand/collapse.

4. **Mobile TOC sheet animation** — The Sheet primitive already has animation. ✅ Good.

5. **Scroll position memory** — When the user leaves a page and returns via the back button, scroll to the previous position. Next.js doesn't do this automatically in static export. Use `sessionStorage` to store scroll positions keyed by pathname.

6. **Pull-to-refresh** — Not needed for a static app. Reject.

7. **Swipe gestures** — The prompt correctly rejected custom swipe detection. The browser/OS handles back/forward. ✅ Good.

8. **Long press** — Not needed for this app. No complex actions require long-press. ✅ Good.

9. **Bottom sheet dismiss** — The MobileTOC sheet dismisses on backdrop tap and item selection. ✅ Good.

10. **Loading states** — As a static export, all content is instant. No loading skeletons needed. ✅ Good.

---

## Cognitive Load Analysis

### Intrinsic Load (Content itself — should NOT be reduced)
- Technical content: architecture patterns, hyperparameters, code snippets, decision notes
- **Verdict:** Correctly preserved. The app does not oversimplify technical content.

### Extraneous Load (UI overhead — should be minimized)

| Source | Current State | Recommendation |
|---|---|---|
| Scrolling to find section | Mobile TOC helps, but cheatsheets still require heavy scrolling | Make cheatsheet entries collapsible |
| Parsing table rows on mobile | Model list and registry tables are hard to parse | Add card views for mobile |
| Manual text selection for copy | Cheatsheet code blocks require manual selection | Use `CodeBlock` component |
| Re-typing search queries | No search history | Add `localStorage` recent searches |
| Re-finding last position | No "Continue Reading" | Add session resumption |
| Uncertainty about progress | No progress indicator | Add reading progress bar |
| Thumb travel to top | No "Back to Top" | Add floating button |
| Sticky hover states | Mobile cards show stuck hover | Replace with `active:` states |
| Table horizontal scrolling | Registry requires two-handed interaction | Card view for mobile |
| Cheatsheet TOC orphans | Entries 13+ not in TOC | Remove 12-entry limit |

### Germane Load (Learning-focused effort — should be MAXIMIZED)

| Source | Current State | Recommendation |
|---|---|---|
| Decision guide (Use/Avoid) | Clear split cards | ✅ Good — promotes active reasoning |
| Pros/Cons comparison | Side-by-side layout | ✅ Good — supports evaluation |
| Task trigger visibility | Always visible in collapsed header | ✅ Good — promotes recognition |
| Workflow decision boxes | Highlighted per step | ✅ Good — promotes decision-making |
| Code examples | Syntax + example side-by-side on desktop | ✅ Good — promotes understanding |
| Related content links | Bottom of page | ✅ Good — promotes discovery |

---

## Accessibility Review

| Criterion | Status | Notes |
|---|---|---|
| **Keyboard navigation** | ✅ Good | Search supports arrow keys, Enter, Escape. TOC supports click. |
| **Screen reader** | ⚠️ Partial | `aria-label` on menu, `aria-expanded` on search, `role="listbox"` on results. Task headers have `aria-expanded`. Good coverage. |
| **Touch targets** | ⚠️ Partial | Menu button is 44×44px. Dark mode toggle may be smaller. Card links are full-width. Filter buttons are small but usable. |
| **Color contrast** | ✅ Good | Dark mode uses `oklch` with sufficient contrast. Text on `bg-card` meets WCAG AA. |
| **Focus indicators** | ✅ Good | `focus:ring-2 focus:ring-ring/40` on search input. |
| **Font size** | ⚠️ Partial | `text-[11px]` sidebar links and `text-[9px]` headings are small. Consider increasing to `text-xs` minimum. |
| **Motion** | ✅ Good | No auto-playing animations. Sheet transitions are standard. |
| **Semantic HTML** | ✅ Good | Proper `<nav>`, `<section>`, `<header>`, `<table>`, `<ol>` usage. |
| **Alt text** | N/A | No images in the app. |
| **Reduced motion** | ⚠️ Missing | No `prefers-reduced-motion` media query. Add to disable smooth scroll and sheet animations. |

---

## Long-Session Fatigue Analysis (6-Hour Continuous Usage)

| Fatigue Source | Severity | Evidence | Mitigation |
|---|---|---|---|
| Excessive scrolling on cheatsheets | 🔴 High | 15 entries × ~600px = 9,000px | Collapsible entries |
| Table parsing on model list | 🔴 High | 6-column table on 390px screen | Card view for mobile |
| Eye strain from small sidebar text | 🟠 Medium | `text-[11px]` and `text-[9px]` | Increase to `text-xs` minimum |
| Thumb travel to top of page | 🟠 Medium | No back-to-top button | Floating action button |
| Re-typing search queries | 🟠 Medium | No search history | `localStorage` recent searches |
| Scroll anxiety (no progress) | 🟠 Medium | No reading progress indicator | Progress bar |
| Context loss between sessions | 🟡 Low | No "Continue Reading" | Session resumption |
| Sticky hover artifacts | 🟡 Low | Cards appear selected after tap | `active:` instead of `hover:` on mobile |
| Code block manual selection | 🟡 Low | Cheatsheet raw `<pre>` blocks | `CodeBlock` component |
| Monotonous layout | 🟡 Low | All detail pages follow same structure | Acceptable for consistency |
| Dark mode toggle reach | 🟡 Low | Top-right corner | Could be moved to bottom sheet or settings |
| No font size adjustment | 🟡 Low | Fixed sizes | Add font size toggle |

---

## Final Architecture Freeze Checklist

### ✅ Already Frozen (Protect These)

- [x] Next.js App Router static export architecture
- [x] JSON content layer and data schemas
- [x] Navigation hierarchy (packages, models, workflows, cheatsheets, registry)
- [x] Search engine (Fuse.js inverted index)
- [x] Cross-link system (`getRelatedContent`)
- [x] Dark mode toggle and theme system
- [x] Mobile sidebar Sheet navigation
- [x] Desktop TOC (`TableOfContents.tsx`)
- [x] `ContentPageLayout` wrapper pattern
- [x] Breadcrumb system
- [x] `MetadataBadges` component
- [x] `OfficialResources` component
- [x] `RelatedContent` component
- [x] `CodeBlock` component (with M3 fixes)
- [x] `MobileTOC` component (with M4 fixes)
- [x] `PackageTaskList` component (with M5 fixes)
- [x] `SectionCard` component
- [x] `FilterBar` component
- [x] Tailwind CSS + shadcn/ui component system
- [x] Geist Sans + Geist Mono font pairing

### 🔴 Must Fix Before Freeze (Phase 1)

- [ ] **C1:** Make cheatsheet entries collapsible (P1)
- [ ] **C2:** Add card-based mobile view for model list (P2)
- [ ] **C3:** Add card-based mobile view for registry (P3)
- [ ] **C4:** Use `CodeBlock` in cheatsheet entries (P4)
- [ ] **C5:** Make search dropdown keyboard-aware (P5)
- [ ] **C6:** Add "Back to Top" floating button (P7)
- [ ] **C7:** Add reading progress indicator (P6)
- [ ] **C8:** Enrich cheatsheet listing with metadata (P8)
- [ ] **C9:** Add card view toggle for model category (P9)
- [ ] **C10:** Add search history (P11)

### 🟡 Should Fix After Freeze (Phase 2 — Quality of Life)

- [ ] Add "Continue Reading" to home page (P12)
- [ ] Fix dark mode toggle touch target (P13)
- [ ] Increase sidebar link font size (P14)
- [ ] Remove hover sticky states on mobile (P20)
- [ ] Add "X of Y" progress to package tasks (P17)
- [ ] Remove 12-entry TOC limit on cheatsheets (P15)
- [ ] Add sticky bottom action bar (P16)
- [ ] Add font size adjustment (P19)
- [ ] Enhance workflow visual decision-map feel (P18)
- [ ] Add "Recently Searched" to home (P20)
- [ ] Add model alternatives to detail page
- [ ] Add registry → model detail links
- [ ] Add `prefers-reduced-motion` support
- [ ] Add scroll position memory

---

## Summary

The previous Claude audit (M1–M5) correctly identified and fixed the 5 most critical mobile issues. The codebase now has:

1. Proper mobile padding (`px-4`)
2. Accessible menu button (44×44px icon)
3. Code blocks with overflow signals and mobile-safe copy
4. Mobile TOC with sticky section indicator and bottom sheet
5. Collapsible package tasks with hash-based auto-expand

**The remaining 20 problems are real but less catastrophic.** The top 3 critical issues are:

1. **Cheatsheet entries are not collapsible** — This is the single highest-impact fix remaining. A 15-entry cheatsheet page is currently 9,000+ px of scrolling. Making entries collapsible (mirroring the `PackageTaskList` pattern) would reduce this to ~1,500px by default.

2. **Model category list uses a table on mobile** — A 6-column table on a 390px screen is effectively unusable. A card-based mobile view is essential.

3. **Registry page uses a table on mobile** — Same issue, 4-column table. Card view needed.

If **C1–C3** are implemented, the app will cross the threshold from "functional mobile reference" to "delightful mobile knowledge system." The remaining Phase 1 items (C4–C10) polish the experience to world-class.

After Phase 1, the UI/UX should be frozen. Only content should grow for the next five years.

---

*End of Audit.*
