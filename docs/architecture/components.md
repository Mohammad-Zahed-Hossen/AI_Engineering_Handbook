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

## Shared Components

### CollapsibleRow (`components/shared/CollapsibleRow.tsx`)
**Purpose**: Shared primitive for collapsible sections

**Responsibilities**:
- Render collapsible row with chevron indicator
- Support hash-based deep linking
- Handle aria-expanded and aria-controls for accessibility

**Used By**: ModelCollapsibleSections, CheatsheetEntry, PackageTaskList

**Dependencies**: None

**Design Philosophy**: Reusable collapsible UI primitive

---

### CollapsibleSection (`components/shared/CollapsibleSection.tsx`)
**Purpose**: Render collapsible content section

**Responsibilities**:
- Render section with title and content
- Handle expand/collapse state
- Support custom trigger rendering

**Used By**: Model pages, Package pages

**Dependencies**: None

**Design Philosophy**: Consistent section collapse behavior

---

### RecentActivity (`components/shared/RecentActivity.tsx`)
**Purpose**: Render recent and continue reading content

**Responsibilities**:
- Display recently updated content
- Show continue reading items with progress
- Handle empty states gracefully

**Used By**: Home page (app/page.tsx)

**Dependencies**: `lib/data.ts`, `lib/session-tracking.ts`

**Design Philosophy**: Session-aware content discovery

---

### RecommendedNextSection (`components/shared/RecommendedNextSection.tsx`)
**Purpose**: Render curriculum progression recommendations

**Responsibilities**:
- Resolve recommended next items
- Render as clickable cards
- Only show if valid recommendations exist

**Used By**: Model detail pages

**Dependencies**: `lib/data.ts`

**Design Philosophy**: Guided learning progression

---

### ModelDecisionStrip (`components/shared/ModelDecisionStrip.tsx`)
**Purpose**: Render model decision badges

**Responsibilities**:
- Display difficulty, stability, confidence, maturity badges
- Use appropriate icons (Gauge, Activity, CheckCircle2, Shield)
- Color badges semantically

**Used By**: Model detail pages

**Dependencies**: `lucide-react`

**Design Philosophy**: Quick decision context

---

### ModelHubExplorer (`components/shared/ModelHubExplorer.tsx`)
**Purpose**: Model hub exploration interface

**Responsibilities**:
- Display model variants and families
- Support filtering and search
- Render model comparison views

**Used By**: Model category pages

**Dependencies**: None

**Design Philosophy**: Model discovery and comparison

---

### ModelListFilter (`components/shared/ModelListFilter.tsx`)
**Purpose**: Model-specific filter by problem type

**Responsibilities**:
- Filter models by problem_type
- Render mobile card view
- Render desktop table view

**Used By**: Model category pages

**Dependencies**: `FilterBar`

**Design Philosophy**: Responsive model filtering

---

### PatternSnapshot (`components/shared/PatternSnapshot.tsx`)
**Purpose**: Render pattern summary cards

**Responsibilities**:
- Display pattern concept and applicability
- Link to full pattern page
- Show related content

**Used By**: Pattern list pages

**Dependencies**: None

**Design Philosophy**: Quick pattern overview

---

### ProductionExamples (`components/shared/ProductionExamples.tsx`)
**Purpose**: Render production example cards

**Responsibilities**:
- Display real-world usage examples
- Link to related workflows
- Show implementation context

**Used By**: Model and Package pages

**Dependencies**: None

**Design Philosophy**: Practical application context

---

### Prose (`components/shared/Prose.tsx`)
**Purpose**: Render formatted text content

**Responsibilities**:
- Apply consistent typography styles
- Handle markdown-like formatting
- Support custom className

**Used By**: Various content pages

**Dependencies**: None

**Design Philosophy**: Consistent text presentation

---

### QuickIdentificationChecklist (`components/shared/QuickIdentificationChecklist.tsx`)
**Purpose**: Render quick identification checklists

**Responsibilities**:
- Display checklist items
- Support interactive toggling
- Show completion state

**Used By**: Debug guide pages

**Dependencies**: None

**Design Philosophy**: Quick diagnostic reference

---

### RelatedPatternGraph (`components/shared/RelatedPatternGraph.tsx`)
**Purpose**: Render related patterns visualization

**Responsibilities**:
- Display pattern relationships
- Support graph navigation
- Show pattern connections

**Used By**: Model and Workflow pages

**Dependencies**: None

**Design Philosophy**: Visual pattern discovery

---

### RelationshipSection (`components/shared/RelationshipSection.tsx`)
**Purpose**: Render typed relationship sections

**Responsibilities**:
- Display related content by type
- Support ContentRef resolution
- Handle missing references

**Used By**: All detail pages

**Dependencies**: `lib/data.ts`

**Design Philosophy**: Structured relationship display

---

### SectionSummary (`components/shared/SectionSummary.tsx`)
**Purpose**: Render section summaries

**Responsibilities**:
- Display key points summary
- Support expand/collapse
- Show section metadata

**Used By**: Model and Workflow pages

**Dependencies**: None

**Design Philosophy**: Quick section overview

---

### TradeoffHeatmap (`components/shared/TradeoffHeatmap.tsx`)
**Purpose**: Render tradeoff visualization

**Responsibilities**:
- Display tradeoff matrix
- Use color coding for comparison
- Support interactive exploration

**Used By**: Model and Decision pages

**Dependencies**: None

**Design Philosophy**: Visual tradeoff comparison

---

### TradeoffTable (`components/shared/TradeoffTable.tsx`)
**Purpose**: Render tradeoff comparison tables

**Responsibilities**:
- Display side-by-side comparisons
- Support sorting and filtering
- Show quantitative metrics

**Used By**: Model and Decision pages

**Dependencies**: None

**Design Philosophy**: Detailed tradeoff analysis

---

### VariationCard (`components/shared/VariationCard.tsx`)
**Purpose**: Render model variation cards

**Responsibilities**:
- Display model variant information
- Show performance metrics
- Link to variant details

**Used By**: Model family pages

**Dependencies**: None

**Design Philosophy**: Variant comparison cards

---

### VerificationChecklist (`components/shared/VerificationChecklist.tsx`)
**Purpose**: Render verification checklists

**Responsibilities**:
- Display verification steps
- Support interactive checking
- Track completion state

**Used By**: Debug guide pages

**Dependencies**: None

**Design Philosophy**: Step-by-step verification

---

### VisualizationEquivalents (`components/shared/VisualizationEquivalents.tsx`)
**Purpose**: Render visualization equivalents

**Responsibilities**:
- Show alternative visualization methods
- Link to related packages
- Display code examples

**Used By**: Package pages

**Dependencies**: `CodeBlock`

**Design Philosophy**: Cross-package visualization

---

### VisualTrainingLoop (`components/shared/VisualTrainingLoop.tsx`)
**Purpose**: Render visual training loop diagram

**Responsibilities**:
- Display training loop visualization
- Show step-by-step process
- Support interactive exploration

**Used By**: Model and Workflow pages

**Dependencies**: None

**Design Philosophy**: Visual training understanding

---

### DebugChecklist (`components/shared/DebugChecklist.tsx`)
**Purpose**: Render debug checklist items

**Responsibilities**:
- Display diagnostic checklist
- Support interactive checking
- Link to solutions

**Used By**: Debug guide pages

**Dependencies**: None

**Design Philosophy**: Structured debugging

---

### DebugDecisionTree (`components/shared/DebugDecisionTree.tsx`)
**Purpose**: Render debug decision tree

**Responsibilities**:
- Display decision flow for debugging
- Support interactive navigation
- Show root cause paths

**Used By**: Debug guide pages

**Dependencies**: None

**Design Philosophy**: Visual debugging guidance

---

### DebugOverviewCard (`components/shared/DebugOverviewCard.tsx`)
**Purpose**: Render debug overview summary

**Responsibilities**:
- Display error summary
- Show key symptoms
- Link to detailed sections

**Used By**: Debug guide pages

**Dependencies**: None

**Design Philosophy**: Quick error context

---

### DebugSolutionList (`components/shared/DebugSolutionList.tsx`)
**Purpose**: Render debug solution steps

**Responsibilities**:
- Display step-by-step solutions
- Support copy functionality
- Show verification steps

**Used By**: Debug guide pages

**Dependencies**: `CodeBlock`

**Design Philosophy**: Actionable solutions

---

### DecisionFlow (`components/shared/DecisionFlow.tsx`)
**Purpose**: Render decision flow diagrams

**Responsibilities**:
- Display decision flow visualization
- Support interactive navigation
- Show option paths

**Used By**: Decision guide pages

**Dependencies**: None

**Design Philosophy**: Visual decision making

---

### DecisionGuideSummary (`components/shared/DecisionGuideSummary.tsx`)
**Purpose**: Render decision guide summary

**Responsibilities**:
- Display comparison summary
- Show key differences
- Link to detailed sections

**Used By**: Decision guide pages

**Dependencies**: None

**Design Philosophy**: Quick decision overview

---

### DecisionMatrix (`components/shared/DecisionMatrix.tsx`)
**Purpose**: Render decision comparison matrix

**Responsibilities**:
- Display criteria comparison
- Support sorting
- Show weighted scores

**Used By**: Decision guide pages

**Dependencies**: None

**Design Philosophy**: Quantitative comparison

---

### DecisionOptionGrid (`components/shared/DecisionOptionGrid.tsx`)
**Purpose**: Render decision option grid

**Responsibilities**:
- Display options in grid layout
- Show strengths/weaknesses
- Support filtering

**Used By**: Decision guide pages

**Dependencies**: None

**Design Philosophy**: Visual option comparison

---

### DecisionSummary (`components/shared/DecisionSummary.tsx`)
**Purpose**: Render decision summary

**Responsibilities**:
- Display recommendation summary
- Show use cases
- Link to related content

**Used By**: Decision guide pages

**Dependencies**: None

**Design Philosophy**: Clear recommendations

---

### DecisionTree (`components/shared/DecisionTree.tsx`)
**Purpose**: Render decision tree visualization

**Responsibilities**:
- Display tree structure
- Support interactive navigation
- Show decision paths

**Used By**: Decision guide pages

**Dependencies**: None

**Design Philosophy**: Visual decision tree

---

### DiagnosticCommandList (`components/shared/DiagnosticCommandList.tsx`)
**Purpose**: Render diagnostic commands

**Responsibilities**:
- Display diagnostic commands
- Support copy to clipboard
- Show expected output

**Used By**: Debug guide pages

**Dependencies**: `CodeBlock`

**Design Philosophy**: Quick diagnostics

---

### HiddenCosts (`components/shared/HiddenCosts.tsx`)
**Purpose**: Render hidden cost analysis

**Responsibilities**:
- Display hidden implementation costs
- Show maintenance overhead
- Link to alternatives

**Used By**: Model and Package pages

**Dependencies**: None

**Design Philosophy**: Cost transparency

---

### HybridStrategy (`components/shared/HybridStrategy.tsx`)
**Purpose**: Render hybrid strategy recommendations

**Responsibilities**:
- Display hybrid approach options
- Show combination strategies
- Link to workflows

**Used By**: Model and Workflow pages

**Dependencies**: None

**Design Philosophy**: Flexible solutions

---

### LearningResources (`components/shared/LearningResources.tsx`)
**Purpose**: Render learning resource links

**Responsibilities**:
- Display curated learning resources
- Categorize by type
- Link to external content

**Used By**: Model and Package pages

**Dependencies**: None

**Design Philosophy**: Guided learning

---

### MigrationPath (`components/shared/MigrationPath.tsx`)
**Purpose**: Render migration path guidance

**Responsibilities**:
- Display migration steps
- Show breaking changes
- Link to alternatives

**Used By**: Package pages

**Dependencies**: None

**Design Philosophy**: Smooth transitions

---

### ModelCategoryComparison (`components/shared/ModelCategoryComparison.tsx`)
**Purpose**: Render model category comparison

**Responsibilities**:
- Compare models across categories
- Show performance metrics
- Support filtering

**Used By**: Model list pages

**Dependencies**: None

**Design Philosophy**: Cross-category analysis

---

### AntiPatternCard (`components/shared/AntiPatternCard.tsx`)
**Purpose**: Render anti-pattern warnings

**Responsibilities**:
- Display anti-pattern warnings
- Show consequences
- Link to correct patterns

**Used By**: Pattern pages

**Dependencies**: None

**Design Philosophy**: Prevent common mistakes

---

### BadgeRow (`components/shared/BadgeRow.tsx`)
**Purpose**: Render badge row component

**Responsibilities**:
- Display multiple badges in a row
- Support custom styling
- Handle overflow

**Used By**: Various pages

**Dependencies**: `badge.tsx`

**Design Philosophy**: Consistent badge display

---

### ConstraintRecommendations (`components/shared/ConstraintRecommendations.tsx`)
**Purpose**: Render constraint recommendations

**Responsibilities**:
- Display constraint-based recommendations
- Show trade-offs
- Link to related content

**Used By**: Model and Package pages

**Dependencies**: None

**Design Philosophy**: Constraint-aware guidance

---

### DataTable (`components/shared/DataTable.tsx`)
**Purpose**: Render data table component

**Responsibilities**:
- Display tabular data
- Support sorting and filtering
- Handle responsive layout

**Used By**: Model and Package pages

**Dependencies**: None

**Design Philosophy**: Clean data presentation

---

### ExpandableText (`components/shared/ExpandableText.tsx`)
**Purpose**: Render expandable text content

**Responsibilities**:
- Display truncated text
- Support expand/collapse
- Show read more link

**Used By**: Various content pages

**Dependencies**: None

**Design Philosophy**: Progressive disclosure

---

### StatusBadge (`components/shared/StatusBadge.tsx`)
**Purpose**: Render status indicator badge

**Responsibilities**:
- Display status (stable, experimental, etc.)
- Use appropriate colors
- Support custom variants

**Used By**: All detail pages

**Dependencies**: `badge.tsx`

**Design Philosophy**: Clear status indication

---

### ViolationWarningCard (`components/shared/ViolationWarningCard.tsx`)
**Purpose**: Render violation warning cards

**Responsibilities**:
- Display principle violation warnings
- Show consequences
- Link to correct practices

**Used By**: Principle pages

**Dependencies**: None

**Design Philosophy**: Principle guidance

---

### CodeBlockInteractive (`components/shared/CodeBlockInteractive.tsx`)
**Purpose**: Render interactive code block

**Responsibilities**:
- Display code with copy button
- Support syntax highlighting
- Handle multiple languages

**Used By**: Package and Cheatsheet pages

**Dependencies**: `CodeBlock`

**Design Philosophy**: Enhanced code display

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

### Breadcrumbs (`components/shared/Breadcrumbs.tsx`)
**Purpose**: Navigation breadcrumbs

**Responsibilities**:
- Render breadcrumb trail
- Handle dynamic path generation
- Support custom separators

**Used By**: ContentPageLayout

**Dependencies**: None

**Design Philosophy**: Clear navigation context

---

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

### ContentTypeBadge (`components/shared/ContentTypeBadge.tsx`)
**Purpose**: Type badge (package/model/etc)

**Responsibilities**:
- Display content type with appropriate styling
- Support custom variants
- Handle unknown types gracefully

**Used By**: Multiple components

**Dependencies**: `badge.tsx`

**Design Philosophy**: Clear type indication

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

### AlternativesList (`components/shared/AlternativesList.tsx`)
**Purpose**: Render ContentRef-based alternatives

**Responsibilities**:
- Resolve alternative ContentRefs
- Render as list of links
- Handle missing references

**Used By**: Model and Package pages

**Dependencies**: `lib/data.ts`

**Design Philosophy**: Quick alternative discovery

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