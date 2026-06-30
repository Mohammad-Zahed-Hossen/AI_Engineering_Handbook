---
id: architecture-components
title: Component Architecture
type: architecture
status: active
owner: system
canonical: true
version: 2.0
related:
  - architecture-overview
  - architecture-data-flow
ai_priority:3
---

# Component Architecture

**Date**: 2026-06-29
**Version**: 2.0

---

## Layout Components

### Sidebar (`components/layout/Sidebar.tsx`)
**Purpose**: Desktop navigation sidebar with expandable sections

**Responsibilities**:
- Render navigation for packages, models (ml/dl/llm), registries, workflows, cheatsheets
- Expand/collapse sections with state management
- Group items by first letter when >30 items (ALPHA_GROUP_THRESHOLD)
- Limit visible items to 12 with "See all N →" links
- Highlight active item based on current pathname
- Auto-scroll active item into view on navigation

**Used By**: Root layout (`app/layout.tsx`)

**Dependencies**: `lib/data.ts` (nav items), `lucide-react` (icons)

**Design Philosophy**: Performance-first with item limits and grouping for scalability

---

### TopBar (`components/layout/TopBar.tsx`)
**Purpose**: Header with search box and mobile trigger

**Responsibilities**:
- Render search box with full search index
- Render mobile sidebar trigger (hidden on desktop)
- Render dark mode toggle
- Display "Static" badge

**Used By**: Root layout (`app/layout.tsx`)

**Dependencies**: `components/shared/SearchBox`, `components/layout/MobileSidebarTrigger`, `components/layout/DarkModeToggle`

**Design Philosophy**: Minimal header, search-focused

---

### MobileSidebarTrigger (`components/layout/MobileSidebarTrigger.tsx`)
**Purpose**: Mobile navigation via Sheet component

**Responsibilities**:
- Render full navigation in a bottom sheet on mobile
- Reuse Sidebar logic for navigation rendering
- Handle sheet open/close state

**Used By**: TopBar (mobile only)

**Dependencies**: `components/ui/sheet`, Sidebar logic

**Design Philosophy**: Mobile-first navigation pattern

---

### DarkModeToggle (`components/layout/DarkModeToggle.tsx`)
**Purpose**: Theme toggle between light/dark modes

**Responsibilities**:
- Toggle theme in localStorage
- Update document class for Tailwind dark mode
- Persist preference across sessions

**Used By**: TopBar

**Dependencies**: `lucide-react` (icons)

**Design Philosophy**: Simple toggle with persistence

---

### ThemeInitializer (`components/layout/ThemeInitializer.tsx`)
**Purpose**: Initialize theme on app load

**Responsibilities**:
- Read theme preference from localStorage
- Apply theme to document class
- Prevent flash of wrong theme

**Used By**: Root layout

**Dependencies**: None

**Design Philosophy**: Prevent FOUC (Flash of Unstyled Content)

---

## Shared Components

### ContentPageLayout (`components/shared/ContentPageLayout.tsx`)
**Purpose**: Wrapper for all content detail pages

**Responsibilities**:
- Render breadcrumbs
- Render table of contents
- Render sticky action bar
- Provide consistent layout structure

**Used By**: All detail pages (packages, models, workflows, cheatsheets)

**Dependencies**: `Breadcrumbs`, `TableOfContents`, `StickyActionBar`, `ScrollRestore`

**Design Philosophy**: Composition pattern for consistent page structure

---

### SearchBox (`components/shared/SearchBox.tsx`)
**Purpose**: Global search with keyboard navigation

**Responsibilities**:
- Accept search query with keyboard shortcut (/)
- Display results grouped by type (package, model, function, workflow, cheatsheet, registry)
- Support keyboard navigation (arrow keys, enter, escape)
- Highlight matching text in results
- Store recent searches in localStorage
- Support both Fuse.js fuzzy matching and custom engine

**Used By**: TopBar, Home page

**Dependencies**: `lib/search-types`, `lucide-react`

**Design Philosophy**: Keyboard-first, accessible, performant

---

### FilterBar (`components/shared/FilterBar.tsx`)
**Purpose**: Generic filter bar with toggle buttons

**Responsibilities**:
- Render filter options as toggle buttons
- Track selected options state
- Provide clear button

**Used By**: Model list pages (via ModelListFilter)

**Dependencies**: None

**Design Philosophy**: Reusable filter UI

---

### ModelListFilter (`components/shared/FilterBar.tsx`)
**Purpose**: Model-specific filter by problem type (exported from FilterBar.tsx)

**Responsibilities**:
- Filter models by problem_type (classification, regression, etc.)
- Render mobile card view
- Render desktop table view
- Handle empty state

**Used By**: Model category pages

**Dependencies**: `FilterBar` (same file), `types model`

**Design Philosophy**: Responsive design with mobile-first approach

**Note**: ModelListFilter is exported from the same file as FilterBar, providing a specialized version for model filtering

---

### CodeBlock (`components/shared/CodeBlock.tsx`)
**Purpose**: Code display with copy button

**Responsibilities**:
- Render code with syntax highlighting (via CSS)
- Provide copy-to-clipboard button
- Handle copy success/failure feedback

**Used By**: Package tasks, cheatsheet entries

**Dependencies**: `lucide-react` (icons)

**Design Philosophy**: Simple, functional code display

---

### TableOfContents (`components/shared/TableOfContents.tsx`)
**Purpose**: Table of contents with scroll spy

**Responsibilities**:
- Render TOC items as links
- Highlight active section based on scroll position
- Smooth scroll to section on click

**Used By**: ContentPageLayout

**Dependencies**: None

**Design Philosophy**: Scroll-aware navigation

---

### StickyActionBar (`components/shared/StickyActionBar.tsx`)
**Purpose**: Mobile section navigation (sticky bottom bar)

**Responsibilities**:
- Show current section label
- Provide prev/next section buttons
- Open sheet with full TOC
- Auto-hide when scrolling down, show when scrolling up

**Used By**: ContentPageLayout

**Dependencies**: `components/ui/sheet`, `lucide-react`

**Design Philosophy**: Mobile-optimized section navigation

---

### RelatedContent (`components/shared/RelatedContent.tsx`)
**Purpose**: Render ContentRef-based related content links

**Responsibilities**:
- Resolve ContentRef to name and URL
- Render as clickable links
- Handle missing references gracefully

**Used By**: All detail pages

**Dependencies**: `lib/data.ts` (getContentName, getContentPath), `ContentTypeBadge`

**Design Philosophy**: Type-safe cross-linking

---

### OfficialResources (`components/shared/OfficialResources.tsx`)
**Purpose**: Render sources and GitHub repo links

**Responsibilities**:
- Categorize sources (documentation, papers, model cards, external)
- Render as categorized links
- Render GitHub repo link if present

**Used By**: All detail pages

**Dependencies**: `lib/resources.ts` (categorizeSources)

**Design Philosophy**: Organized resource presentation

---

### MetadataBadges (`components/shared/MetadataBadges.tsx`)
**Purpose**: Render content metadata badges

**Responsibilities**:
- Render content type badge
- Render category badge (for models)
- Render updated_at date

**Used By**: All detail pages

**Dependencies**: `ContentTypeBadge`

**Design Philosophy**: Consistent metadata display

---

### PackageTaskList (`components/shared/PackageTaskList.tsx`)
**Purpose**: Render package tasks

**Responsibilities**:
- Render each task with mental trigger, syntax, example
- Render important params
- Render decision notes
- Render gotchas
- Link to official docs

**Used By**: Package detail pages

**Dependencies**: `CodeBlock`, `SectionCard`

**Design Philosophy**: Task-focused information hierarchy

---

### WorkflowStepList (`components/shared/WorkflowStepList.tsx`)
**Purpose**: Render workflow steps

**Responsibilities**:
- Render each step with name, description, tools
- Render decision points
- Render failure points
- Render uses (packages, models, cheatsheets)

**Used By**: Workflow detail pages

**Dependencies**: `SectionCard`

**Design Philosophy**: Sequential workflow visualization

---

### CheatsheetEntry (`components/shared/CheatsheetEntry.tsx`)
**Purpose**: Render expandable cheatsheet entry

**Responsibilities**:
- Render problem, trigger, snippet
- Render minimal notes
- Render common bug
- Expand/collapse functionality
- Link to docs

**Used By**: Cheatsheet detail pages

**Dependencies**: `CodeBlock`

**Design Philosophy**: Problem-solution pattern with quick access

---

### ModelCollapsibleSections (`components/shared/ModelCollapsibleSections.tsx`)
**Purpose**: Render collapsible model sections

**Responsibilities**:
- Render collapsible sections for pros/cons, hyperparams, quick_start
- Handle expand/collapse state
- Render decision notes if present

**Used By**: Model detail pages

**Dependencies**: `components/ui/sheet` (for mobile)

**Design Philosophy**: Progressive disclosure for dense information

---

### ContinueReadingSection (`components/shared/ContinueReadingSection.tsx`)
**Purpose**: Render continue reading from session tracking

**Responsibilities**:
- Retrieve continue reading items from localStorage
- Render as clickable cards with scroll position
- Support dismissal of items
- Handle empty state

**Used By**: Home page

**Dependencies**: `lib/session-tracking.ts`

**Design Philosophy**: Session resumption for long-form content

---

### RecentKnowledgeSection (`components/shared/RecentKnowledgeSection.tsx`)
**Purpose**: Render recent knowledge from browsing history

**Responsibilities**:
- Retrieve recent knowledge from localStorage
- Render as clickable links
- Handle empty state

**Used By**: Home page

**Dependencies**: `lib/session-tracking.ts`

**Design Philosophy**: Browsing history for quick recall

---

### PageVisitTracker (`components/shared/PageVisitTracker.tsx`)
**Purpose**: Track page visits for recent knowledge

**Responsibilities**:
- Record page visit on mount
- Store in localStorage
- Limit to 8 most recent items

**Used By**: Root layout

**Dependencies**: `lib/session-tracking.ts`

**Design Philosophy**: Automatic visit tracking

---

### ReadingSessionTracker (`components/shared/ReadingSessionTracker.tsx`)
**Purpose**: Track reading session (scroll + dwell time)

**Responsibilities**:
- Track scroll position
- Track dwell time (45s threshold)
- Track scroll percentage (15% threshold)
- Save session on visibility change or beforeunload
- Only save if thresholds met

**Used By**: Detail pages

**Dependencies**: `lib/session-tracking.ts`

**Design Philosophy**: Qualitative session tracking for meaningful content

---

### ReadingProgress (`components/shared/ReadingProgress.tsx`)
**Purpose**: Render reading progress bar

**Responsibilities**:
- Calculate scroll percentage
- Render progress bar at top of page
- Update on scroll

**Used By**: Root layout

**Dependencies**: None

**Design Philosophy**: Visual reading feedback

---

### BackToTop (`components/shared/BackToTop.tsx`)
**Purpose**: Scroll to top button

**Responsibilities**:
- Show button after scrolling down
- Scroll to top on click
- Hide when at top

**Used By**: Root layout

**Dependencies**: `lucide-react`

**Design Philosophy**: Quick navigation aid

---

### ScrollRestore (`components/shared/ScrollRestore.tsx`)
**Purpose**: Restore scroll position on navigation

**Responsibilities**:
- Store scroll position on unmount
- Restore scroll position on mount
- Handle hash-based navigation

**Used By**: ContentPageLayout

**Dependencies**: None

**Design Philosophy**: Seamless navigation experience

---

### SectionCard (`components/shared/SectionCard.tsx`)
**Purpose**: Render content section with title and subtitle

**Responsibilities**:
- Render card with title and subtitle
- Render children content
- Provide consistent section styling

**Used By**: Multiple pages

**Dependencies**: None

**Design Philosophy**: Consistent section container

---

## UI Components (shadcn/ui)

The following shadcn/ui components are used:

- **button.tsx**: Button component
- **badge.tsx**: Badge component
- **card.tsx**: Card component
- **sheet.tsx**: Sheet component (for mobile navigation)
- **separator.tsx**: Separator component

---

## Related Documentation

- **System Overview**: See `architecture/overview.md`
- **Data Flow**: See `architecture/data-flow.md`
- **Search Architecture**: See `architecture/search.md`
- **Navigation Architecture**: See `architecture/navigation.md`
