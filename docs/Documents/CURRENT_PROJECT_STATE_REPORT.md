# AENS Current State Audit & Architecture Report

**Generated:** July 9, 2026  
**Repository:** ai-engineering-handbook  
**Version:** 0.2.0  
**Audit Scope:** Complete repository inspection (excluding docs/ and data/ content)  
**Refactor Status:** AENS Knowledge Layer v1.0 Implementation Complete

---

## 1. Executive Summary

**Application Identity**
The AI Engineering Knowledge System & Handbook is a static-first, server-rendered Next.js application designed as a localized, zero-latency reference tool for AI/ML engineers. It provides offline access to Python package APIs, model architectures, production deployment workflows, and syntax cheatsheets.

**Primary Purpose**
- Serve as a personal knowledge base for AI/ML engineering reference materials
- Provide instant, offline access to package documentation, model specifications, and workflow guides
- Enable fast discovery through client-side fuzzy search
- Maintain content in version-controlled JSON files without external database dependencies
- Support 9 content types aligned with AENS Knowledge Layer Specification v1.0

**Current Maturity**
- **Development Stage:** Early production (v0.1.0)
- **Architecture Maturity:** High - well-structured with clear separation of concerns, fully aligned with AENS Knowledge Layer Specification
- **Content Maturity:** Initial - basic content populated across all 9 content types (10 JSON files in total)
- **Feature Completeness:** Core features implemented, all 9 content types supported with full infrastructure
- **Refactor Status:** Complete - AENS Knowledge Layer v1.0 implementation finished

**Overall Architecture**
- **Framework:** Next.js 16.2.9 with App Router (React 19.2.4)
- **Rendering Strategy:** Server Components with static generation, client-side interactivity where needed
- **Data Layer:** File-based JSON database with React cache for performance
- **Search:** Client-side Fuse.js fuzzy search with custom tokenizer
- **Styling:** Tailwind CSS v4 with shadcn/ui components
- **Validation:** Zod schemas with pre-build validation pipeline

---

## 2. High Level Architecture

### Architecture Style
- **Pattern:** Static Site Generation (SSG) with Server Components
- **Data Flow:** File system → React cache → Server Components → Client Components
- **Paradigm:** Content-first, local-first, schema-first

### Rendering Strategy
```
User Request → Next.js Server → React Cache → JSON Files → Server Component → HTML
                                                            ↓
                                                      Client Component (interactive)
```

- **Server Components:** All page components (`app/**/*.tsx`) are Server Components
- **Client Components:** Interactive components marked with `'use client'` (SearchBox, Sidebar, FilterBar, etc.)
- **Static Generation:** `generateStaticParams()` pre-generates all routes at build time
- **Caching:** React `cache()` function wraps all data loading functions

### Routing
```
/                          → Dashboard (app/page.tsx)
/packages/[id]             → Package detail
/models/[category]         → Model category list
/models/[category]/[id]    → Model detail
/registry/[task]           → Registry task page
/workflows/[id]            → Workflow detail
/cheatsheets/[id]          → Cheatsheet detail
/patterns/[id]             → Pattern detail
/debug-guides/[id]         → Debug guide detail
/decision-guides/[id]      → Decision guide detail
/principles/[id]           → Principle detail
```

### Data Flow
```
data/*.json files
    ↓
lib/data.ts (React cache wrappers)
    ↓
app/page components (Server Components)
    ↓
components/shared (Client Components for interactivity)
    ↓
Browser
```

### Search
```
lib/search.ts (buildSearchIndex)
    ↓
SearchResult[] array
    ↓
SearchBox component (Fuse.js + custom engine)
    ↓
User input → Fuzzy matching → Results display
```

### Navigation
```
data/*/_nav.json (lightweight indexes)
    ↓
lib/data.ts navigation functions
    ↓
Sidebar component (desktop) / MobileSidebarTrigger (mobile)
    ↓
Collapsible sections with item limits
```

### Content Pipeline
```
1. Author JSON files in data/
2. Run npm run validate (Zod schema validation)
3. Run npm run build:nav (generate _nav.json indexes)
4. Run npm run build (Next.js static generation)
5. Deploy static output
```

---

## 3. Repository Structure

### app/
**Purpose:** Next.js App Router pages and global layout

**Responsibilities:**
- Route definitions for all content types
- Global layout with Sidebar and TopBar
- Error handling (error.tsx, not-found.tsx)
- Global CSS (globals.css)

**Dependencies:** 
- `lib/data.ts` for data loading
- `lib/search.ts` for search index
- `components/layout` for navigation
- `components/shared` for page composition

**Communication:** Server Components import data functions and pass data to components

**Structure:**
```
app/
├── layout.tsx              # Root layout with Sidebar, TopBar, theme
├── page.tsx                # Dashboard homepage command center
├── error.tsx               # Global error boundary
├── not-found.tsx           # 404 page
├── globals.css             # Global styles and theme variables
├── cheatsheets/[id]/       # Cheatsheet detail pages
├── debug-guides/[id]/      # Debug guide detail pages (NEW)
├── decision-guides/[id]/   # Decision guide detail pages (NEW)
├── models/[category]/      # Model category listing pages
├── models/[category]/[id]/ # Model detail pages
├── packages/[id]/          # Package detail pages
├── patterns/[id]/          # Pattern detail pages (NEW)
├── principles/[id]/        # Principle detail pages (NEW)
├── problem-index/          # Problem Index catalog dashboard page (NEW)
│   ├── page.tsx            # Problem Index page route
│   └── ProblemIndexDashboard.tsx # Problems search & scroll dashboard component
├── registry/[task]/        # Registry task pages
└── workflows/[id]/         # Workflow detail pages
```

### components/
**Purpose:** Reusable UI components organized by concern

**Responsibilities:**
- Layout components (Sidebar, TopBar, ThemeInitializer)
- Shared page components (ContentPageLayout, SearchBox, FilterBar)
- shadcn/ui primitives (Button, Card, Badge, Sheet)

**Dependencies:**
- `lib/data.ts` for type definitions
- `lib/search-types.ts` for search types
- `lucide-react` for icons
- `radix-ui` for primitive components

**Communication:** Props-based data flow, no direct data loading

**Structure:**
```
components/
├── layout/                 # Navigation and global layout
│   ├── Sidebar.tsx         # Desktop navigation with collapsible sections
│   ├── TopBar.tsx          # Header with search and theme toggle
│   ├── DarkModeToggle.tsx  # Theme switcher
│   ├── MobileSidebarTrigger.tsx # Mobile navigation drawer
│   └── ThemeInitializer.tsx # Theme initialization
├── shared/                 # Reusable page components
│   ├── SearchBox.tsx       # Fuzzy search with keyboard navigation
│   ├── FilterBar.tsx       # Client-side filtering (ModelListFilter)
│   ├── ContentPageLayout.tsx # Page wrapper with breadcrumbs and TOC
│   ├── CodeBlock.tsx       # Code syntax display
│   ├── ExpandableText.tsx  # Text clamp & expansion component (NEW)
│   ├── TableOfContents.tsx # Sticky table of contents
│   ├── MetadataBadges.tsx  # Content type badges
│   ├── OfficialResources.tsx # External links display
│   ├── RelatedContent.tsx  # Cross-reference links
│   ├── PackageTaskList.tsx # Package task display
│   ├── WorkflowStepList.tsx # Workflow step display
│   ├── CheatsheetEntry.tsx # Expandable cheatsheet entries
│   ├── AlternativesList.tsx # Alternative items display
│   ├── ModelCollapsibleSections.tsx # Model detail sections
│   ├── QuickSetupSection.tsx # Package installation guide
│   ├── SectionCard.tsx     # Card container
│   ├── Breadcrumbs.tsx     # Navigation breadcrumbs
│   ├── ContentTypeBadge.tsx # Category badges
│   ├── StatusBadge.tsx     # Status indicators
│   ├── StickyActionBar.tsx # Mobile action bar
│   ├── ScrollRestore.tsx   # Scroll position restoration
│   ├── BackToTop.tsx       # Back to top button
│   ├── ReadingProgress.tsx # Reading progress indicator
│   ├── PageVisitTracker.tsx # Visit tracking
│   ├── ReadingSessionTracker.tsx # Session tracking
│   ├── ContinueReadingSection.tsx # Session resumption
│   └── RecentKnowledgeSection.tsx # Browsing history
└── ui/                     # shadcn/ui primitives
    ├── button.tsx
    ├── card.tsx
    ├── badge.tsx
    ├── sheet.tsx
    └── separator.tsx
```

### lib/
**Purpose:** Business logic, data loading, schemas, and search

**Responsibilities:**
- Data loading from JSON files with React cache
- Zod schema definitions for all content types
- Search engine implementation (Fuse.js + custom)
- Configuration loading and validation
- Route parameter validation

**Dependencies:**
- File system (Node.js fs module)
- React cache function
- Zod for validation
- Fuse.js for search
- AJV for config validation

**Communication:** Pure functions, no side effects, exported for use in app/

**Structure:**
```
lib/
├── data.ts                 # Data loading functions (React cached)
├── search.ts               # Search index building
├── search-types.ts         # Search result types and Fuse config
├── content-loader.ts       # Centralized content loader utilities (NEW)
├── config/
│   ├── loader.ts           # aens.config.json loading and validation
│   └── registry.ts         # Registry task mappings
├── schemas/                # Zod schemas for content types
│   ├── index.ts            # Schema exports
│   ├── base.ts             # Base metadata schema (RENAMED from meta.ts)
│   ├── package.ts          # Package schema
│   ├── model.ts            # Model schema
│   ├── workflow.ts         # Workflow schema
│   ├── cheatsheet.ts       # Cheatsheet schema
│   ├── pattern.ts          # Pattern schema (NEW)
│   ├── debug-guide.ts      # Debug guide schema (NEW)
│   ├── decision-guide.ts   # Decision guide schema (NEW)
│   ├── principle.ts        # Principle schema (NEW)
│   └── registry.ts         # Registry schema
├── search/                 # Search engine modules
│   ├── engine.ts           # Main search engine (hybrid Fuse + inverted index)
│   ├── tokenizer.ts        # Code tokenizer with abbreviation expansion
│   ├── inverted-index.ts   # Inverted index for exact token matching
│   ├── synonym-expander.ts  # Synonym expansion (placeholder, empty)
│   └── related-search.ts   # Related content search (placeholder)
├── hooks/                  # React hooks
│   ├── useLocalStorage.ts   # Local storage wrapper
│   └── useReadingSession.ts # Reading session tracking
├── resources.ts            # Content type formatting utilities
├── route-params.ts         # Route parameter validation
├── session-tracking.ts     # Session management utilities
└── utils.ts                # General utilities (cn function)
```

### scripts/
**Purpose:** Build-time validation and index generation

**Responsibilities:**
- Content validation against Zod schemas
- Navigation index generation (_nav.json files)
- Reference integrity checking

**Dependencies:**
- Zod schemas from lib/schemas/
- File system operations
- tsx for TypeScript execution

**Communication:** Standalone scripts, no runtime dependencies

**Structure:**
```
scripts/
├── validate-content.ts     # Comprehensive content validation
├── build-nav-index.ts      # Navigation index generation
└── migrate-to-v2.ts        # JSON migration script (NEW)
```

### types/
**Purpose:** TypeScript type definitions

**Responsibilities:**
- Export types inferred from Zod schemas
- Provide type safety across the application

**Dependencies:**
- lib/schemas/ (types are inferred from schemas)

**Communication:** Type-only exports, no runtime code

**Structure:**
```
types/
├── index.ts                # Type exports
├── meta.ts                 # Metadata types
├── package.ts              # Package types
├── model.ts                # Model types
├── workflow.ts             # Workflow types
├── cheatsheet.ts           # Cheatsheet types
├── pattern.ts              # Pattern types (NEW)
├── debug-guide.ts          # Debug guide types (NEW)
├── decision-guide.ts       # Decision guide types (NEW)
├── principle.ts            # Principle types (NEW)
└── registry.ts             # Registry types
```

### public/
**Purpose:** Static assets

**Responsibilities:**
- SVG icons (Next.js, Vercel, globe, window, file)
- Favicon

**Dependencies:** None

**Communication:** Referenced in HTML/Markdown

### schema/
**Purpose:** JSON Schema for configuration validation

**Responsibilities:**
- AJV schema for aens.config.json validation

**Dependencies:** None

**Communication:** Used by lib/config/loader.ts

### data/
**Purpose:** Content database (JSON files)

**Responsibilities:**
- Store all content as version-controlled JSON files
- Organize by content type (packages, models, workflows, cheatsheets, registry)

**Dependencies:** None

**Communication:** Read by lib/data.ts

**Structure:**
```
data/
├── packages/               # Package documentation
│   └── _nav.json          # Navigation index (generated)
├── models/                 # Model specifications
│   ├── ml/                # Machine Learning models
│   ├── dl/                # Deep Learning architectures
│   ├── llm/               # Large Language Models
│   └── (each has _nav.json)
├── workflows/              # Production workflows
│   └── _nav.json
├── cheatsheets/           # Syntax reference sheets
│   └── _nav.json
├── patterns/              # Design patterns (NEW)
│   └── _nav.json
├── debug-guides/          # Debugging guides (NEW)
│   └── _nav.json
├── decision-guides/       # Decision frameworks (NEW)
│   └── _nav.json
├── principles/            # Engineering principles (NEW)
│   └── _nav.json
└── registry/              # Model registry by task
    └── (task-specific JSON files)
```

---

## 4. Current Feature Inventory

### Implemented Features

#### Content Types (Complete - All 9 Types)
- **Packages** - Python package documentation with tasks
  - Status: Complete
  - Files: `app/packages/[id]/page.tsx`, `lib/schemas/package.ts`
  - Features: Quick setup, task list, alternatives, related content

- **Models** - Model library with ML/DL/LLM categories
  - Status: Complete
  - Files: `app/models/[category]/page.tsx`, `app/models/[category]/[id]/page.tsx`
  - Features: Category listing, problem type filtering, premium decision strip (difficulty, stability, confidence, maturity pills) with separate interpretability callout, unified 2x2 Decision Board & Tradeoffs grid, spec-sheet grid for core metrics, side-by-side comparative hyperparameter tuning with Expand/Collapse All and API mapping, alternative comparison matrix cards.

- **Registry** - Task-based model registry
  - Status: Complete
  - Files: `app/registry/[task]/page.tsx`
  - Features: Task-based model listing with size information and links

- **Workflows** - Production deployment workflows
  - Status: Complete
  - Files: `app/workflows/[id]/page.tsx`
  - Features: Step-by-step pipelines, failure points, evaluation checks, next workflow links

- **Cheatsheets** - Syntax reference sheets
  - Status: Complete
  - Files: `app/cheatsheets/[id]/page.tsx`
  - Features: Expandable entries with triggers, snippets, and common bugs

- **Patterns** - Reusable design patterns (NEW)
  - Status: Complete
  - Files: `app/patterns/[id]/page.tsx`, `lib/schemas/pattern.ts`
  - Features: Pattern documentation with context, examples, and anti-patterns

- **Debug Guides** - Troubleshooting guides (NEW)
  - Status: Complete
  - Files: `app/debug-guides/[id]/page.tsx`, `lib/schemas/debug-guide.ts`
  - Features: Symptom-based debugging with root cause analysis and solutions

- **Decision Guides** - Decision frameworks (NEW)
  - Status: Complete
  - Files: `app/decision-guides/[id]/page.tsx`, `lib/schemas/decision-guide.ts`
  - Features: Structured decision-making with options, trade-offs, and recommendations

- **Principles** - Engineering principles (NEW)
  - Status: Complete
  - Files: `app/principles/[id]/page.tsx`, `lib/schemas/principle.ts`
  - Features: Core engineering principles with intuition, examples, and applications

#### Search (Complete)
- **Fuzzy Search** - Client-side search with Fuse.js
  - Status: Complete
  - Files: `components/shared/SearchBox.tsx`, `lib/search.ts`, `lib/search-types.ts`
  - Features: Keyboard navigation, recent searches, result highlighting, type grouping

- **Advanced Search Engine** - Hybrid Fuse.js + inverted index
  - Status: Partial (engine implemented, synonym expansion placeholder)
  - Files: `lib/search/engine.ts`, `lib/search/inverted-index.ts`
  - Features: Token matching, fuzzy scoring, concept group boosting

- **Code Tokenizer** - Specialized tokenizer for code identifiers
  - Status: Complete
  - Files: `lib/search/tokenizer.ts`
  - Features: Dot-notation splitting, camelCase splitting, abbreviation expansion, package aliases

#### Navigation (Complete)
- **Sidebar Navigation** - Desktop navigation with collapsible sections
  - Status: Complete
  - Files: `components/layout/Sidebar.tsx`
  - Features: Alphabetical grouping, item limits, active state, expand/collapse

- **Mobile Navigation** - Mobile sidebar trigger
  - Status: Complete
  - Files: `components/layout/MobileSidebarTrigger.tsx`
  - Features: Full navigation in mobile drawer

- **TopBar** - Header with search and theme toggle
  - Status: Complete
  - Files: `components/layout/TopBar.tsx`
  - Features: Compact search, dark mode toggle, static indicator

- **Breadcrumbs** - Navigation breadcrumbs
  - Status: Complete
  - Files: `components/shared/Breadcrumbs.tsx`
  - Features: Hierarchical navigation

#### UI Features (Complete)
- **Dark Mode** - Theme switching
  - Status: Complete
  - Files: `components/layout/DarkModeToggle.tsx`, `components/layout/ThemeInitializer.tsx`
  - Features: System preference detection, manual toggle, localStorage persistence

- **Table of Contents** - Sticky TOC for long pages
  - Status: Complete
  - Files: `components/shared/TableOfContents.tsx`
  - Features: Scroll tracking, active section highlighting

- **Reading Progress** - Scroll progress indicator
  - Status: Complete
  - Files: `components/shared/ReadingProgress.tsx`
  - Features: Visual progress bar

- **Back to Top** - Scroll-to-top button
  - Status: Complete
  - Files: `components/shared/BackToTop.tsx`
  - Features: Appears after scrolling

- **Session Tracking** - Reading session management
  - Status: Complete
  - Files: `components/shared/ReadingSessionTracker.tsx`, `lib/hooks/useReadingSession.ts`
  - Features: Continue reading section, recent knowledge section

- **Client-side Filtering** - Interactive filtering
  - Status: Complete
  - Files: `components/shared/FilterBar.tsx`
  - Features: Problem type filtering for models, multi-select, clear filters

#### Build Pipeline (Complete)
- **Content Validation** - Pre-build validation
  - Status: Complete
  - Files: `scripts/validate-content.ts`
  - Features: Schema validation, slug format checks, filename/ID sync, placeholder detection, duplicate detection, reference integrity

- **Navigation Index Generation** - Build nav indexes
  - Status: Complete
  - Files: `scripts/build-nav-index.ts`
  - Features: Lightweight _nav.json generation, version field for packages, category for models

#### Infrastructure (Complete)
- **Type Safety** - Zod schemas + TypeScript
  - Status: Complete
  - Files: `lib/schemas/*.ts`, `types/*.ts`
  - Features: Runtime validation, type inference, strict mode

- **React Cache** - Data loading optimization
  - Status: Complete
  - Files: `lib/data.ts`
  - Features: Cached data loading functions, zero-latency repeated access

- **Static Generation** - Pre-rendered routes
  - Status: Complete
  - Files: All page components with `generateStaticParams()`
  - Features: Build-time route generation, zero runtime routing overhead

### Placeholder/Experimental Features

#### Search Extensions (Experimental)
- **Synonym Expansion** - Search query expansion
  - Status: Placeholder (empty data structures)
  - Files: `lib/search/synonym-expander.ts`
  - Note: TODO comment indicates re-implementation planned for Phase 2+

- **Related Search** - Related content discovery
  - Status: Placeholder (functions implemented but not integrated)
  - Files: `lib/search/related-search.ts`
  - Note: Functionality exists but not used in UI

### Unused Files
- **lib/validation/** - Empty directory
  - Status: Unused
  - Note: Directory exists but contains no files

- **lib/content/** - Empty directory
  - Status: Unused
  - Note: Directory exists but contains no files

---

## 5. Knowledge Architecture

### Current Knowledge Objects

**Primary Knowledge Entities (9 Total):**
1. **Package** - Python library/package documentation
   - Structure: Inherits `BaseMetaSchema` (ID, title, name, slug, description, tags, aliases, created_at, updated_at, sources, etc.).
   - Specific fields: `version` (semantic version), `install` command, `import_as` syntax, `language` (default: python), `summary`, `tasks` array, `alternatives` (ContentRef array), `package_specific_debugging`, `migration_notes`, `breaking_changes`.
   - Tasks contain: `task`, `mental_trigger` (first-person trigger starting with "I need to..."), `syntax`, `important_params` (max 5 parameters), `example` (raw python snippet), `use_when`, `avoid_when`, `decision_notes`, `gotchas`, `official_docs` URL, `related_workflows`, `related_cheatsheets`.
   - Relationships: `alternatives` (ContentRef array), `related_content` (ContentRef array), task-level `related_workflows` (string IDs array), task-level `related_cheatsheets` (string IDs array).

2. **Model** - Machine Learning, Deep Learning, or LLM specifications
   - Structure: Inherits `BaseMetaSchema` (Zod `ModelSchema`).
   - Specific fields:
     - `decisionsummary`: `summary`, `bestusecases` array, `avoidwhen` array, `strengths` (min 3), `limitations` (min 3), `interpretability`, `trainingcharacteristics`, `inferencecharacteristics`, `computationalcharacteristics`.
     - `coreunderstanding`: `intuition`, `learningmechanism`, `assumptions` array, `mathematicalintuition`, `complexity`, `memorycomplexity`, `robustness`, `scalability`, `overfittingtendency`, `biasvariance`.
     - `hyperparameters`: array of objects (`name`, `purpose`, `increaseeffect`, `decreaseeffect`, `tradeoffs`, `tuningpriority`, `interactions` array, `commonmistakes` array).
     - `engineeringconsiderations`: `datasetsuitability` array, `scalability` array, `parallelization`, `computationalcost`, `memorybehavior`, `inferencecharacteristics`, `robustness` array, `sensitivitytooutliers`, `featureengineeringdependency`, `featurescalingrequirement`, `classimbalancebehavior`, `commonlimitations` array, `pipelineposition`.
     - `comparisons`: array of direct alternative comparisons (`model`, `choose_this_when`, `prefer_other_when`, `tradeoffs`).
     - `relatedknowledge`: related models, alternatives, principles, workflows, patterns, packages, guides, registry references.
     - `quickstart` (optional): `language`, `implementation_package`, `code` (production-ready code snippet), `explanation`, `inputs` expected shape/type, `outputs` expected shape/type, `notes` (optional).
     - `learning_resources` (optional): array of curated educational resources (`title`, `url`, `type` [article|video|course|guide|documentation|tutorial], `why_to_read`, `expected_outcome`, `reading_time` optional).
   - Relationships: Bidirectional constraints enforced in validation; mapped in `relatedcontent` and `relatedknowledge`.

3. **Workflow** - Production deployment workflows
   - Structure: Inherits `BaseMetaSchema`.
   - Specific fields: `type` (pipeline | snippet), `category`, `overview`, `starter_stack` array, `steps` array (min 3), `common_failure_points` array, `evaluation_checks` (optional), `next_links` (optional), `worked_examples` array, `production_notes`, `scaling_notes`.
   - Steps contain: `step` (1-indexed sequential integer), `name`, `what`, `tools` array, `decision`, `uses` object (`{ packages: string[], models: string[], cheatsheets: string[] }`), `failure_points` array.
   - Relationships: `related_patterns` (ContentRef array), `related_models` (ContentRef array), `related_packages` (ContentRef array), `related_debug_guides` (ContentRef array), `related_content` (ContentRef array).

4. **Cheatsheet** - Rapid syntax reference sheets
   - Structure: Inherits `BaseMetaSchema`.
   - Specific fields: `name`, `entries` array (min 1, max 60), `package_reference` (optional singular string ID).
   - Entries contain: `problem` (task goal), `trigger`, `snippet` (raw code syntax), `minimal_notes`, `common_bug`, `docs_url`.
   - Relationships: `package_reference` (string ID), `related_content` (ContentRef array).

5. **Pattern** - Reusable design patterns
   - Structure: Inherits `BaseMetaSchema`.
   - Specific fields: `concept` (core concept description), `applicability`, `anti_patterns` array, `implementation_notes`, `examples` array.
   - Relationships: `related_workflows` (string array), `related_models` (string array), `related_packages` (string array), `related_principles` (string array), `related_content` (ContentRef array).

6. **Debug Guide** - Troubleshooting guides
   - Structure: Inherits `BaseMetaSchema`.
   - Specific fields: `category`, `symptoms` array (min 1), `root_causes` array (min 1), `diagnosis` array (min 1), `solutions` array (min 1), `prevention` array (min 1).
   - Symptoms contain: `symptom`, `description`.
   - Root Causes contain: `cause`, `probability` (high | medium | low), `explanation`.
   - Diagnosis contains: `test`, `expected_result`, `how_to_perform`.
   - Solutions contain: `solution`, `steps` array, `verification`.
   - Prevention contain: `prevention`, `practices` array.
   - Relationships: `related_packages` (ContentRef array), `related_workflows` (ContentRef array), `related_patterns` (ContentRef array), `related_models` (ContentRef array), `related_registry` (ContentRef array), `related_content` (ContentRef array).

7. **Decision Guide** - Tech trade-off comparisons
   - Structure: Inherits `BaseMetaSchema`.
   - Specific fields: `category`, `problem`, `evaluation_criteria` array (min 1), `options` array (min 2), `comparison_table` (optional record), `recommendations`, `use_cases` array.
   - Criteria contain: `criterion`, `weight` (number default 1), `description`.
   - Options contain: `name`, `id` (reference ID string), `strengths` array, `weaknesses` array, `best_for`, `avoid_when`.
   - Relationships: `related_workflows` (ContentRef array), `related_packages` (ContentRef array), `related_models` (ContentRef array), `related_content` (ContentRef array).

8. **Principle** - Fundamental engineering principles (the theoretical "why")
   - Structure: Inherits `BaseMetaSchema`.
   - Specific fields: `category`, `statement` (core principle statement), `mathematical_formulation` (TeX markup), `intuition` (intuitive reasoning), `implications` array, `limitations` array, `related_concepts` array.
   - Relationships (inverse plain string IDs): `referenced_by_patterns` (string array), `referenced_by_models` (string array), `referenced_by_workflows` (string array), `related_content` (ContentRef array).

9. **Registry** - Model registry entries
   - Structure: Inherits `BaseMetaSchema`.
   - Specific fields: `task` (embedding | reranker | vision | speech | llm | multimodal | ocr), `category` (models | datasets | benchmarks | services | leaderboards | mcp_servers | repos), `size_mb` (number), `link` (string download URL or MissingModelRef object), `hardware_requirements`, `download_location` URL, `license`, `supported_tasks` array, `version_compatibility` array, `official_resources` URLs array.
   - Relationships: `related_content` (ContentRef array).

### Current Relationships

**Cross-Reference Schema (ContentRef):**
```typescript
{
  id: string;
  type: 'model' | 'package' | 'workflow' | 'cheatsheet' | 'registry' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle';
}
```

**Relationship Types:**
- **alternatives** - Direct alternatives (packages, models)
- **competitors** - Competitive alternatives (models)
- **related_workflows** - Workflow references (packages, models)
- **related_cheatsheets** - Cheatsheet references (packages)
- **next_links** - Sequential workflow connections (workflows)
- **related_content** - Universal bidirectional relationships (all content types) (NEW)
- **recommended_next** - Learning path suggestions (new content types) (NEW)
- **prerequisites** - Learning path prerequisites (new content types) (NEW)

**Relationship Enforcement:**
- Validation script checks referential integrity
- STRICT_REFERENCE_MODE environment variable controls error vs warning
- Bidirectional relationship requirement in config (not enforced in validation)

### Content Organization

**Hierarchical Structure:**
```
data/
├── packages/           # Flat structure
├── models/             # Categorized by type
│   ├── ml/
│   ├── dl/
│   └── llm/
├── workflows/          # Flat structure
├── cheatsheets/       # Flat structure
├── patterns/          # Flat structure (NEW)
├── debug-guides/      # Flat structure (NEW)
├── decision-guides/   # Flat structure (NEW)
├── principles/        # Flat structure (NEW)
└── registry/          # Task-based files
```

**Naming Conventions:**
- Filenames must match internal `id` field
- IDs must match regex: `/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/`
- Kebab-case for multi-word IDs
- No uppercase, no spaces, no underscores (except in registry)

### Navigation Hierarchy

**Sidebar Structure:**
```
Dashboard
├── Packages (expandable)
├── Models Library
│   ├── Machine Learning (expandable)
│   ├── Deep Learning (expandable)
│   └── Large Language Models (expandable)
├── Registries (expandable)
├── Workflows (expandable)
├── Cheatsheets (expandable)
├── Patterns (expandable) (NEW)
├── Debug Guides (expandable) (NEW)
├── Decision Guides (expandable) (NEW)
└── Principles (expandable) (NEW)
```

**Navigation Indexes:**
- `_nav.json` files in each content directory
- Contains: id, name, version (packages only), updated_at, type, category (models only)
- Generated by `scripts/build-nav-index.ts`
- Used for lightweight navigation loading

### Cross References

**Resolution Strategy:**
- `getContentPath(type, id)` - Resolves href from type and ID
- `getContentName(type, id)` - Resolves name from type and ID
- `contentExists(type, id)` - Checks file existence
- `getRelatedContent(type, id)` - Computes related content based on type

**Related Content Algorithm:**
- **Packages:** alternatives array
- **Models:** alternatives + same category + same problem type
- **Workflows:** same category + shared tools
- **Cheatsheets:** matching package + package alternatives
- **Patterns:** related_content array (NEW)
- **Debug Guides:** related_content array (NEW)
- **Decision Guides:** related_content array (NEW)
- **Principles:** related_content array (NEW)

### Search Indexing

**Searchable Fields:**
- name (weight: 0.20)
- title (weight: 0.20) (NEW)
- mental_trigger (weight: 0.15)
- keywords (weight: 0.12)
- search_tokens (weight: 0.12) (NEW)
- tags (weight: 0.10) (NEW)
- aliases (weight: 0.08) (NEW)
- code_context (weight: 0.10)
- code_tokens (weight: 0.10)
- summary (weight: 0.08)
- fn_signature (weight: 0.05)
- id (weight: 0.03)
- category (weight: 0.02)
- parent_name (weight: 0.02)

**Index Structure:**
- Top-level entities: packages, models, workflows, cheatsheets, registry, patterns, debug_guides, decision_guides, principles
- Function-level entities: package tasks, cheatsheet entries
- Enriched fields: mental_trigger, code_context, code_tokens, keywords, title, tags, aliases, search_tokens

### Metadata Strategy

**Base Metadata (all entities) - Expanded BaseMetaSchema:**
- created_at (YYYY-MM-DD format)
- updated_at (YYYY-MM-DD format)
- sources (array of URLs, min 1 required)
- github_repo (optional, must be GitHub URL)
- title (string, primary display name) (NEW)
- slug (string, URL-friendly identifier) (NEW)
- description (string, content summary) (NEW)
- tags (array of strings, categorization) (NEW)
- aliases (array of strings, alternative names) (NEW)
- keywords (array of strings, search terms) (NEW)
- search_tokens (array of strings, search optimization) (NEW)
- domain (string, engineering domain) (NEW)
- category (string, content category) (NEW)
- difficulty (string, difficulty level) (NEW)
- engineering_area (string, engineering specialization) (NEW)
- estimated_reading_time (number, minutes) (NEW)
- prerequisites (array of ContentRef, learning prerequisites) (NEW)
- recommended_next (array of ContentRef, learning path) (NEW)
- related_content (array of ContentRef, bidirectional relationships) (NEW)
- last_verified (string, verification date) (NEW)
- review_frequency (string, review cadence) (NEW)
- verified_against (string, version reference) (NEW)
- compatible_versions (array of strings, version compatibility) (NEW)
- breaking_changes (array of strings, breaking changes) (NEW)
- canonical_status (string, canonical status) (NEW)
- lifecycle (string, lifecycle stage) (NEW)
- stability (string, stability level) (NEW)
- confidence (string, confidence level) (NEW)
- engineering_maturity (string, maturity level) (NEW)

**Entity-Specific Metadata:**
- **Packages:** version, language, tasks, alternatives (legacy fields maintained for compatibility)
- **Models:** category, problem_types, difficulty, engineering_maturity, decisionsummary, coreunderstanding, hyperparameters, engineeringconsiderations, comparisons, relatedknowledge, quickstart, learning_resources
- **Workflows:** type, category, starter_stack, steps, next_links
- **Cheatsheets:** entries array
- **Patterns:** context, examples, anti_patterns
- **Debug Guides:** symptoms, root_causes, solutions
- **Decision Guides:** problem, options, trade_offs, recommendations
- **Principles:** statement, intuition, examples, applications
- **Registry:** task, size_mb, link, hardware_requirements, download_location, license

### Current Limitations

**Relationship Limitations:**
- No bidirectional relationship enforcement (config requires it, validation doesn't enforce)
- No relationship strength or confidence scores
- No transitive relationship traversal

**Metadata Limitations:**
- No author/contributor fields
- No popularity metrics
- No usage statistics
- Tags, labels, and difficulty ratings now available (RESOLVED by refactor)

**Navigation Limitations:**
- No custom navigation ordering (alphabetical only)
- No bookmarking/favorites
- No recent visits in sidebar (only on dashboard)

**Search Limitations:**
- Synonym expansion is empty (placeholder)
- No concept groups populated
- No faceted search (only type grouping)
- No search history persistence beyond recent searches

---

## 6. Data Layer

### JSON Structure

**File Organization:**
- One JSON file per entity
- Filename matches entity ID
- Located in type-specific directories
- Registry uses task-based filenames

**Example Package Structure:**
```json
{
  "id": "numpy",
  "name": "NumPy",
  "version": "2.0.0",
  "language": "python",
  "created_at": "2024-01-01",
  "updated_at": "2024-01-15",
  "summary": "...",
  "sources": ["https://numpy.org/doc/"],
  "github_repo": "https://github.com/numpy/numpy",
  "install": "pip install numpy",
  "import_as": "np",
  "tasks": [...],
  "alternatives": [...]
}
```

### Schemas

**Schema Technology:** Zod (runtime validation + TypeScript inference)

**Schema Hierarchy:**
```
BaseMetaSchema (Identity, Discovery, Classification, Learning, Maintenance, Versioning, Governance, Sources)
├── PackageSchema (extends BaseMeta)
├── ModelSchema (extends BaseMeta)
├── WorkflowSchema (extends BaseMeta)
├── CheatsheetSchema (extends BaseMeta)
├── PatternSchema (extends BaseMeta)
├── DebugGuideSchema (extends BaseMeta)
├── DecisionGuideSchema (extends BaseMeta)
├── PrincipleSchema (extends BaseMeta)
└── RegistryModelSchema (extends BaseMeta)
```

**Schema Features:**
- Type coercion (date format validation)
- URL validation (sources, github_repo, docs_url)
- Enum constraints (categories, problem types, ratings)
- Array constraints (min/max lengths)
- Optional fields with defaults

**Schema Files:**
- `lib/schemas/base.ts` - Base metadata schema (renamed from meta.ts)
- `lib/schemas/package.ts` - Package and PackageTask schemas
- `lib/schemas/model.ts` - Model and related enums
- `lib/schemas/workflow.ts` - Workflow and WorkflowStep schemas
- `lib/schemas/cheatsheet.ts` - Cheatsheet and CheatsheetEntry schemas
- `lib/schemas/pattern.ts` - Pattern schema
- `lib/schemas/debug-guide.ts` - Debug guide schema
- `lib/schemas/decision-guide.ts` - Decision guide schema
- `lib/schemas/principle.ts` - Principle schema
- `lib/schemas/registry.ts` - Registry and MissingModelRef schemas

### Validation

**Validation Pipeline:**
1. JSON parse error checking
2. Schema validation (Zod)
3. Slug format validation (regex)
4. Filename/ID sync check
5. Placeholder text detection
6. Minimum content quality checks
7. Duplicate detection (ID and name)
8. Reference integrity checking
9. docs_url uniqueness check

**Validation Script:** `scripts/validate-content.ts`
- Runs via `npm run validate`
- Runs automatically in `prebuild` hook
- Exit code 1 on errors
- STRICT_REFERENCE_MODE env var for strict reference checking

**Quality Checks:**
- Models: min 3 pros, min 3 cons, min 1 key_hyperparam (except detection-only)
- Packages: min 1 task
- Workflows: min 3 steps
- Cheatsheets: min 1 entry
- Patterns: min 1 context (NEW)
- Debug Guides: min 1 symptom (NEW)
- Decision Guides: min 1 option (NEW)
- Principles: min 1 example (NEW)

### Registry

**Registry Structure:**
- Task-based JSON files (e.g., `embedding.json`, `vision.json`)
- Each file contains array of RegistryModel entries
- Filename mapped to task via `REGISTRY_FILE_TO_TASK`

**Registry Entry Structure:**
```json
{
  "id": "all-MiniLM-L6-v2",
  "task": "embedding",
  "size_mb": 80,
  "link": "https://huggingface.co/..."
}
```

**Missing Model References:**
```json
{
  "id": "missing-model",
  "task": "embedding",
  "size_mb": 0,
  "link": {
    "type": "missing",
    "reason": "Model not yet cataloged"
  }
}
```

**Registry Tasks:**
- embedding, reranker, vision, speech, llm, multimodal, ocr

### Navigation Indexes

**Purpose:** Lightweight navigation data to avoid loading full JSON files

**Structure:**
```json
[
  {
    "id": "numpy",
    "name": "NumPy",
    "version": "2.0.0",
    "updated_at": "2024-01-15",
    "type": "package"
  }
]
```

**Generation:** `scripts/build-nav-index.ts`
- Runs via `npm run build:nav`
- Runs automatically in `prebuild` hook
- Commits to Git alongside content

**Usage:**
- Sidebar navigation loading
- Recent content loading
- Dashboard counts

### Content Loading

**Loading Strategy:** React `cache()` function

**Data Loading Functions:**
- `getAllPackageIds()` - Scan directory for IDs
- `getPackage(id)` - Load single package
- `getAllPackages()` - Load all packages
- Similar functions for models, workflows, cheatsheets, registry

**Navigation Functions:**
- `getPackageNavItems()` - Load from _nav.json or fallback
- `getModelNavItems(category)` - Load from _nav.json or fallback
- Similar functions for workflows, cheatsheets

**Helper Functions:**
- `contentExists(type, id)` - Check file existence
- `getContentPath(type, id)` - Resolve href
- `getContentName(type, id)` - Resolve name
- `getRelatedContent(type, id)` - Compute related items
- `getRecentContent(limit)` - Get recently updated items

**Fallback Behavior:**
- If _nav.json missing, falls back to full file scan
- Ensures first-run compatibility before build scripts execute

### Caching

**Caching Strategy:** React `cache()` function

**Cached Functions:**
- All data loading functions in `lib/data.ts`
- `buildSearchIndex()` in `lib/search.ts`
- `buildSearchEngine()` in `lib/search.ts`

**Cache Scope:** Per-request (Server Components)
- Cache persists during single request
- Invalidated between requests
- No persistent caching

**Performance Impact:**
- Zero-latency repeated access within request
- No memory leaks (request-scoped)
- Optimal for static generation

### Build Pipeline

**Build Sequence:**
1. `npm run validate` - Content validation
2. `npm run build:nav` - Navigation index generation
3. `npm run build` - Next.js static generation

**Prebuild Hook:**
```json
"prebuild": "npm run validate && npm run build:nav"
```

**Validation Failures:**
- Exit code 1 on errors
- Blocks build process
- Ensures data integrity before deployment

**Static Generation:**
- `generateStaticParams()` for all dynamic routes
- Pre-renders all content pages at build time
- Zero runtime data loading

---

## 7. Search System

### Search Engine

**Primary Engine:** Fuse.js (fuzzy search)

**Secondary Engine:** Custom hybrid engine (inverted index + Fuse.js)

**Engine Implementation:** `lib/search/engine.ts`

**Search Strategy:**
1. Query expansion (synonyms, concept groups)
2. Inverted index exact token matching
3. Fuse.js fuzzy matching
4. Score combination and ranking

**Scoring Algorithm:**
- Exact name match: 1.0
- Name prefix match: 0.98
- Name contains: 0.90
- Summary contains: 0.85
- Concept group match: 0.96
- Token match ratio: up to 0.95
- Fuzzy score: up to 0.45

### Tokenizer

**Tokenizer Implementation:** `lib/search/tokenizer.ts`

**Tokenization Rules:**
1. **Dot-split** - `np.linalg.inv` → `["np", "linalg", "inv"]`
2. **Prefix segments** - `["np", "np.linalg", "np.linalg.inv"]`
3. **Package alias expansion** - `np` → `["np", "numpy"]`
4. **CamelCase split** - `CrossEntropyLoss` → `["Cross", "Entropy", "Loss", "cross", "entropy", "loss"]`
5. **Snake/kebab split** - `learning_rate` → `["learning", "rate"]`
6. **Abbreviation expansion** - `inv` → `["inv", "inverse"]`
7. **Deduplicate and lowercase**

**Package Aliases:**
- np ↔ numpy, torch ↔ pytorch, tf ↔ tensorflow
- pd ↔ pandas, sklearn ↔ scikit-learn
- plt ↔ matplotlib, sns ↔ seaborn, cv2 ↔ opencv

**Abbreviation Expansions:**
- inv → inverse, svd → singular value decomposition
- lstm → long short term memory, cnn → convolutional neural network
- rag → retrieval augmented generation, llm → large language model
- And 100+ more technical abbreviations

### Ranking

**Fuse.js Configuration:**
```typescript
{
  keys: [
    { name: 'name', weight: 0.25 },
    { name: 'mental_trigger', weight: 0.20 },
    { name: 'keywords', weight: 0.15 },
    { name: 'code_context', weight: 0.15 },
    { name: 'code_tokens', weight: 0.15 },
    { name: 'summary', weight: 0.10 },
    { name: 'fn_signature', weight: 0.08 },
    { name: 'id', weight: 0.05 },
    { name: 'category', weight: 0.02 },
    { name: 'parent_name', weight: 0.02 },
  ],
  threshold: 0.25,
  minMatchCharLength: 2,
  includeScore: true,
  includeMatches: true,
}
```

**Custom Engine Ranking:**
- Combines inverted index scores with Fuse.js scores
- Boosts exact matches heavily
- Penalizes partial matches
- Concept group boosting

### Synonyms

**Current State:** Empty (placeholder)

**Implementation:** `lib/search/synonym-expander.ts`

**Data Structures:**
```typescript
const synonyms: Record<string, string[]> = {};
const conceptGroups: Record<string, string[]> = {};
```

**Note:** TODO comment indicates re-implementation planned for Phase 2+

### Concept Groups

**Current State:** Empty (placeholder)

**Purpose:** Group related entities for search boosting

**Example (planned):**
```typescript
{
  "transformer": ["bert", "gpt", "t5", "attention"],
  "gradient-boosting": ["xgboost", "lightgbm", "catboost"]
}
```

### Index Generation

**Index Builder:** `lib/search.ts` - `buildSearchIndex()`

**Index Structure:**
```typescript
SearchResult {
  type: 'package' | 'model' | 'workflow' | 'cheatsheet' | 'registry' | 'function',
  id: string,
  name: string,
  summary: string,
  href: string,
  updated_at: string,
  category?: string,
  problem_types?: string[],
  fn_signature?: string,
  fn_section?: string,
  fn_package_id?: string,
  mental_trigger?: string,
  code_context?: string,
  code_tokens?: string[],
  keywords?: string[],
  parent_name?: string,
  aliases?: string[],
}
```

**Indexing Strategy:**
- Top-level entities: packages, models, workflows, cheatsheets, registry
- Function-level entities: package tasks, cheatsheet entries
- Keyword extraction from prose fields
- Code tokenization from syntax fields

**Index Size Check:**
- Development-only logging of index size
- Monitors for index bloat
- Logs entry count and KB size

### Search Lifecycle

**User Flow:**
1. User types in SearchBox
2. Query tokenized and expanded
3. Inverted index queried for exact matches
4. Fuse.js queried for fuzzy matches
5. Scores combined and ranked
6. Results grouped by type
7. Results displayed with highlighting

**Keyboard Navigation:**
- `/` to focus search
- Arrow keys to navigate results
- Enter to select
- Escape to close

**Recent Searches:**
- Stored in localStorage
- Max 5 recent searches
- Displayed when search focused and empty

**Result Highlighting:**
- Fuse.js match highlighting for indexed fields
- Text-based highlighting for engine path
- Highlighted with `<mark>` tags

---

## 8. UI Architecture

### Layouts

**Global Layout:** `app/layout.tsx`
- Three-column layout (Sidebar, Main, TOC)
- Responsive: Sidebar hidden on mobile
- Theme initialization
- Search index building
- Navigation data loading

**Content Page Layout:** `components/shared/ContentPageLayout`
- Breadcrumbs
- Main content area
- Table of Contents (desktop)
- Sticky action bar (mobile)
- Scroll restoration

**Mobile Layout:**
- Sidebar hidden by default
- Triggered via hamburger menu
- Full-screen drawer navigation
- Compact search in TopBar

### Shared Components

**Search Components:**
- `SearchBox` - Full-featured search with keyboard navigation
- `FilterBar` - Generic filter bar with multi-select
- `ModelListFilter` - Problem type filtering for models

**Content Display:**
- `CodeBlock` - Code syntax display
- `SectionCard` - Card container for sections
- `MetadataBadges` - Content type and metadata badges
- `OfficialResources` - External links display
- `RelatedContent` - Cross-reference links
- `ExpandableText` - Modern text clamping and expansion component with an absolute-positioned bottom-right overlay gradient fade for `... See more` trigger, inline flow trigger for `See less`, and performance optimization via height transition-safe clamping state tracking and ResizeObserver watching unconstrained inner content

**Specialized Components:**
- `PackageTaskList` - Developer task workbench that dynamically extracts category/module tags and trigger quotes, features split-panel syntax/runnable example layouts, side-by-side decision cards, blue warning alerts for performance notes, a parameter signature & return type grid, a unified amber runtime safety gotchas card, and related API chips with local task scroll-anchor link resolution
- `WorkflowStepList` - Workflow step display
- `CheatsheetEntry` - Two-column sandbox/card-based cheatsheet component that renders problem headers with modern background index badges, dynamic monospace tag badges parsed from official documentation URLs, details/gotchas cards with Lucide icons, and a styled code snippet panel
- `ModelCollapsibleSections` - Collapsible model detail sections
- `AlternativesList` - Alternative items display
- `QuickSetupSection` - Package installation guide

**Navigation Components:**
- `Breadcrumbs` - Hierarchical navigation
- `TableOfContents` - Sticky TOC with scroll tracking
- `StickyActionBar` - Mobile action bar
- `ContentTypeBadge` - Category badges
- `StatusBadge` - Status indicators

**Utility Components:**
- `ScrollRestore` - Scroll position restoration
- `BackToTop` - Scroll-to-top button
- `ReadingProgress` - Reading progress indicator
- `PageVisitTracker` - Visit tracking
- `ReadingSessionTracker` - Session tracking
- `ContinueReadingSection` - Session resumption
- `RecentKnowledgeSection` - Browsing history

### Page Composition

**Dashboard Page:** `app/page.tsx`
- Redesigned developer command center navigation hub
- Unified Continue Learning container (combines reading progress and search history)
- High-scanning Knowledge Explorer cards displaying custom Lucide icons, summaries, and dynamic entry tallies
- 6 Developer Intent shortcuts (troubleshoot GPU, RAG vs Fine-tuning, training loops, vector search, SSO config, PyTorch cheatsheet) and 6 overview metrics cards
- Dynamic Featured Collections (Most Complete Packages by task count, Complex Blueprints by step count, and top Neural Libraries category models)
- Content-dense recents feed displaying type badges, timestamp formatting, resolved description summaries, and "Open Reference" access buttons

**Package Detail Page:** `app/packages/[id]/page.tsx`
- Breadcrumbs
- Header with metadata badges
- Quick setup section
- Summary (integrated with `ExpandableText` capped to 2 lines to maintain compact layouts)
- Official resources
- Redesigned Developer task workbench (`PackageTaskList.tsx`) with category/module badge extraction, side-by-side split panels, decision framework cards, and clickable related API scroll anchors (local task resolution)
- Related content

**Model Category Page:** `app/models/[category]/page.tsx`
- Category header card
- Filter bar (problem types)
- Mobile card view
- Desktop table view

**Model Detail Page:** `app/models/[category]/[id]/page.tsx`
- Breadcrumbs
- Header with metadata badges
- Decision guide (use when / avoid when)
- Decision notes
- Pros and cons
- Collapsible sections (performance, hyperparams, quick start)
- Alternatives list
- Related content

**Registry Page:** `app/registry/[task]/page.tsx`
- Registry header
- Mobile card view
- Desktop table view
- Model size information
- External links

**Workflow Page:** `app/workflows/[id]/page.tsx`
- Breadcrumbs
- Header with metadata badges
- Overview
- Starter stack
- Workflow steps
- Common failure points
- Evaluation checks
- Next workflow links
- Related content

**Cheatsheet Page:** `app/cheatsheets/[id]/page.tsx`
- Breadcrumbs
- Header with metadata badges
- Official resources
- Redesigned Sandbox/card-based cheatsheet entries (`CheatsheetEntry.tsx`) featuring dynamic tag badges (e.g. `ax.bar`), numbered headers, details/gotchas cards with Lucide icons, and external API buttons
- Related content

**Problem Index Catalog Page:** `app/problem-index/page.tsx`
- Primary problem-first discovery layer wrapped in React Suspense boundary
- Stateful catalog dashboard (`ProblemIndexDashboard.tsx`) with 150ms debounced search filtering (synced to URL search params `?q=...` without layout jumps) and match highlighting
- Focus keyboard shortcuts (`Ctrl+K` and `/`)
- Horizontal viewport-spied category navigation tabs (IntersectionObserver)
- Collapsible categories with smooth CSS Grid transitions (height 0.3s) and localStorage collapse persistence
- Dynamic solved metrics in category headers (e.g., `(3/5 solved)`)
- Solved problems sorted to the top of category stacks with direct link buttons to workflow guides

### Reusable Patterns

**Card Pattern:**
- `SectionCard` - Reusable card container
- Consistent padding, border, shadow
- Title and subtitle props

**Badge Pattern:**
- `ContentTypeBadge` - Type-specific badges
- `StatusBadge` - Status indicators
- `MetadataBadges` - Composite metadata display

**Filter Pattern:**
- `FilterBar` - Generic multi-select filter
- Toggle buttons with active states
- Clear filters button

**Expandable Pattern:**
- `CheatsheetEntry` - Expandable content
- `ModelCollapsibleSections` - Collapsible sections
- Consistent expand/collapse UI

### Design Philosophy

**Principles:**
- **Content-first** - Content takes precedence over chrome
- **Minimal chrome** - Clean, distraction-free interface
- **Responsive design** - Mobile-first approach
- **Accessibility** - Keyboard navigation, ARIA labels
- **Performance** - Client-side search, cached data loading
- **Dark mode** - First-class dark mode support

**Styling Strategy:**
- Tailwind CSS v4 for utility classes
- CSS custom properties for theming
- shadcn/ui for component primitives
- Consistent spacing and typography scales

**Typography:**
- Inter font for body text
- Geist Sans for headings
- Geist Mono for code
- Consistent font sizes (text-xs to text-xl)

**Color System:**
- OKLCH color space for better perceptual uniformity
- Semantic color tokens (primary, secondary, muted, destructive)
- Dark mode color inversion
- Chart colors for data visualization

---

## 9. Navigation Architecture

### Sidebar

**Implementation:** `components/layout/Sidebar.tsx`

**Features:**
- Collapsible sections by content type
- Alphabetical grouping for large lists (30+ items)
- Item limits (12 visible, "see all" link)
- Active state highlighting
- Auto-scroll to active item on route change
- Expand/collapse state management

**Section Structure:**
```
Dashboard
Problem Index
Packages (expandable)
Models Library
  ├── Machine Learning (expandable)
  ├── Deep Learning (expandable)
  └── Large Language Models (expandable)
Registries (expandable)
Workflows (expandable)
Cheatsheets (expandable)
Patterns (expandable)
Debug Guides (expandable)
Decision Guides (expandable)
Principles (expandable)
```

**Grouping Strategy:**
- Groups by first letter when ≥ 30 items
- A-Z sorting within groups
- "See all" link when truncated

**Item Limits:**
- MAX_VISIBLE_ITEMS = 12
- ALPHA_GROUP_THRESHOLD = 30
- Active item always visible (replaces last item if needed)

**Mobile Behavior:**
- Hidden on mobile viewport, toggled via hamburger trigger (`MobileSidebarTrigger.tsx`)
- Full-screen drawer layout mimicking the desktop sidebar navigation and styling
- Restored "Problem Index" link within the mobile navigation drawer to align with the desktop menu structure

### TopBar

**Implementation:** `components/layout/TopBar.tsx`

**Features:**
- Mobile sidebar trigger (hamburger menu)
- Compact search box
- Dark mode toggle
- "Static" indicator
- App title (desktop only)

**Responsive Behavior:**
- Mobile: Hamburger menu + compact search
- Desktop: App title + compact search + theme toggle

### Dynamic Routes

**Route Generation:** `generateStaticParams()` in each page component

**Package Routes:**
- Source: `getAllPackageIds()`
- Pattern: `/packages/[id]`

**Model Routes:**
- Source: `getModelIds(category)` for each category
- Pattern: `/models/[category]/[id]`
- Categories: ml, dl, llm

**Registry Routes:**
- Source: `getRegistryTasks()`
- Pattern: `/registry/[task]`

**Workflow Routes:**
- Source: `getAllWorkflowIds()`
- Pattern: `/workflows/[id]`

**Cheatsheet Routes:**
- Source: `getAllCheatsheetIds()`
- Pattern: `/cheatsheets/[id]`

### Navigation Indexes

**Index Files:** `_nav.json` in each content directory

**Index Structure:**
```json
[
  {
    "id": "numpy",
    "name": "NumPy",
    "version": "2.0.0",
    "updated_at": "2024-01-15",
    "type": "package"
  }
]
```

**Index Generation:** `scripts/build-nav-index.ts`

**Usage:**
- Sidebar navigation loading
- Recent content loading
- Dashboard counts

**Fallback:**
- If _nav.json missing, falls back to full file scan
- Ensures first-run compatibility

### Discovery Strategy

**Dashboard Discovery:**
- Category cards with entry counts
- Recently updated list
- Quick access sections
- Popular packages (hardcoded list)
- Model category quick links

**Sidebar Discovery:**
- Alphabetical grouping
- Expandable sections
- Item limits with "see all"
- Active state highlighting

**Search Discovery:**
- Fuzzy search across all content
- Type grouping in results
- Recent searches
- Keyboard navigation

**Related Content Discovery:**
- Automatic related content computation
- Alternatives display
- Same category suggestions
- Same problem type suggestions (models)

### Performance Optimizations

**React Cache:**
- All navigation functions cached
- Zero-latency repeated access
- Request-scoped caching

**Lightweight Indexes:**
- _nav.json contains only navigation fields
- Avoids loading full JSON files
- Reduces memory footprint

**Static Generation:**
- All routes pre-generated at build time
- Zero runtime routing overhead
- Fast initial page load

**Lazy Loading:**
- Large sections collapsed by default
- Expand/collapse on demand
- Reduces initial DOM size

**Debounced Search:**
- Search results computed on demand
- No pre-computation
- Client-side only

---

## 10. Current Engineering Principles

### Content-First
- **Evidence:** All features serve content display and discovery
- **Implementation:** Minimal chrome, content-focused layouts, reading progress
- **Manifestation:** ContentPageLayout, SectionCard, reading session tracking

### Schema-First
- **Evidence:** Zod schemas defined before types, validation in build pipeline
- **Implementation:** lib/schemas/ directory, type inference from schemas
- **Manifestation:** scripts/validate-content.ts, prebuild validation hook

### Static-First
- **Evidence:** Static generation, no database, no API calls
- **Implementation:** generateStaticParams(), file-based data loading
- **Manifestation:** Next.js static export, React cache, _nav.json indexes

### Local-First
- **Evidence:** No external dependencies for data, offline-capable
- **Implementation:** JSON files in data/, no database connections
- **Manifestation:** File system data loading, localStorage for sessions

### Single Source of Truth
- **Evidence:** JSON files are the authoritative data source
- **Implementation:** No database sync, no external APIs
- **Manifestation:** data/ directory as sole content store

### Minimal Duplication
- **Evidence:** Navigation indexes avoid loading full files
- **Implementation:** _nav.json files, React cache
- **Manifestation:** Lightweight navigation data, cached data loading

### Type Safety
- **Evidence:** Strict TypeScript, Zod runtime validation
- **Implementation:** types/ directory inferred from schemas
- **Manifestation:** Strict mode in tsconfig, schema validation

### Performance-First
- **Evidence:** React cache, static generation, client-side search
- **Implementation:** Cached data loading, Fuse.js search
- **Manifestation:** Zero-latency data access, fast search

### Accessibility-First
- **Evidence:** Keyboard navigation, ARIA labels, semantic HTML
- **Implementation:** SearchBox keyboard shortcuts, proper heading hierarchy
- **Manifestation:** `/` to focus search, arrow key navigation

### Mobile-First
- **Evidence:** Responsive design, mobile sidebar, compact layouts
- **Implementation:** MobileSidebarTrigger, responsive breakpoints
- **Manifestation:** Hidden sidebar on mobile, full-screen drawer

---

## 11. Existing Knowledge Layer

### Knowledge Objects

**Primary Knowledge Abstractions:**
1. **Package** - Represents a Python package with API documentation
   - Abstraction level: High (package-level)
   - Granularity: Package → Tasks
   - Metadata: Version, language, installation, import alias

2. **Model** - Represents an ML/DL/LLM model architecture
   - Abstraction level: High (model architecture)
   - Granularity: Model → Hyperparameters
   - Metadata: Category, problem types, difficulty, engineering maturity

3. **Workflow** - Represents a production pipeline
   - Abstraction level: High (end-to-end pipeline)
   - Granularity: Workflow → Steps
   - Metadata: Type, category, starter stack

4. **Cheatsheet** - Represents syntax reference
   - Abstraction level: Medium (language/library)
   - Granularity: Cheatsheet → Entries
   - Metadata: None beyond base

5. **Registry** - Represents model checkpoint navigation
   - Abstraction level: Low (individual model)
   - Granularity: Single entry
   - Metadata: Task, size, link

### Knowledge Representation

**Data Structure:**
- Flat JSON files per entity
- Hierarchical directory organization
- No nested relationships in file structure
- Cross-references via ContentRef objects

**Schema-Driven:**
- Zod schemas define structure
- TypeScript types inferred from schemas
- Runtime validation ensures compliance

**Metadata-Enriched:**
- Base metadata on all entities (dates, sources)
- Entity-specific metadata (version, category, ratings)
- No free-form fields (all schema-defined)

### Knowledge Connections

**Relationship Types:**
- **Alternatives** - Direct substitutes (packages, models)
- **Competitors** - Competitive comparison (models)
- **Related Workflows** - Workflow references (packages, models)
- **Related Cheatsheets** - Cheatsheet references (packages)
- **Next Links** - Sequential workflows (workflows)

**Relationship Direction:**
- Unidirectional in data (source → target)
- Bidirectional validation in config (not enforced)
- Computed bidirectional in related content (same category, same problem type)

**Relationship Resolution:**
- `getContentPath()` resolves href from type and ID
- `getContentName()` resolves name from type and ID
- `contentExists()` validates target existence
- `getRelatedContent()` computes related items

### Navigation Abstractions

**Navigation Hierarchy:**
- Content type → Category (models only) → Entity
- Represented in sidebar structure
- Reflected in route structure

**Navigation Indexes:**
- Lightweight _nav.json files
- Contain only navigation fields
- Enable fast sidebar loading

**Navigation State:**
- Active item highlighting
- Expand/collapse state
- Scroll position restoration

### Metadata Abstractions

**Base Metadata Schema:**
```typescript
{
  created_at: string (YYYY-MM-DD)
  updated_at: string (YYYY-MM-DD)
  sources: string[] (URLs)
  github_repo: string (optional GitHub URL)
}
```

**Entity-Specific Metadata:**
- **Packages:** version, language
- **Models:** category, problem_types, difficulty, engineering maturity
- **Workflows:** type, category, starter_stack
- **Cheatsheets:** None
- **Registry:** task, size_mb

**Metadata Usage:**
- Display in UI (badges, headers)
- Sorting (recent content)
- Filtering (problem types, categories)

### Relationship Abstractions

**ContentRef Schema:**
```typescript
{
  id: string
  type: 'model' | 'package' | 'workflow' | 'cheatsheet' | 'registry'
}
```

**Relationship Storage:**
- Arrays in parent entities
- Example: `alternatives: [{ id: 'pandas', type: 'package' }]`
- No relationship metadata (strength, confidence)

**Relationship Validation:**
- Referential integrity checked in validation script
- STRICT_REFERENCE_MODE for strict checking
- Bidirectional requirement in config (enforced in validation script)

### Current Limitations

**Abstraction Limitations:**
- No knowledge graph (relationships are simple arrays)
- No relationship strength or confidence
- No transitive relationship traversal
- No relationship metadata (when added, why added)

**Metadata Limitations:**
- No author/contributor fields
- No popularity metrics
- No usage statistics

**Navigation Limitations:**
- No custom ordering (alphabetical only)
- No bookmarking/favorites
- No custom navigation groups
- No tag-based navigation

**Relationship Limitations:**
- No many-to-many relationships
- No relationship attributes
- No relationship history
- Bidirectional relationships must have matching reciprocal definitions (enforced)

---

## 12. Architecture Strengths

### 1. Clear Separation of Concerns
**Why Well-Designed:**
- Distinct directories for app, components, lib, types, scripts
- Business logic isolated in lib/
- UI components isolated in components/
- Data layer isolated in data/
- No circular dependencies

**Evidence:**
- lib/ contains no UI code
- components/ contain no data loading
- app/ contains no business logic
- Clean import graph

### 2. Schema-First Data Model
**Why Well-Designed:**
- Zod schemas defined before implementation
- TypeScript types inferred from schemas
- Runtime validation ensures data integrity
- Single source of truth for data structure

**Evidence:**
- lib/schemas/ directory with comprehensive schemas
- types/ directory with inferred types
- Validation script enforces schema compliance
- Prebuild validation hook

### 3. Performance-Optimized Data Loading
**Why Well-Designed:**
- React cache eliminates redundant file reads
- Lightweight navigation indexes avoid full file loads
- Static generation eliminates runtime data fetching
- Client-side search eliminates server queries

**Evidence:**
- All data loading functions wrapped in React cache
- _nav.json files contain only navigation fields
- generateStaticParams() for all routes
- Fuse.js client-side search

### 4. Comprehensive Validation Pipeline
**Why Well-Designed:**
- Multi-stage validation (parse, schema, format, quality)
- Referential integrity checking
- Placeholder detection
- Duplicate detection
- Prebuild enforcement

**Evidence:**
- scripts/validate-content.ts with 10 validation steps
- STRICT_REFERENCE_MODE for strict checking
- Quality checks (min pros/cons, min tasks)
- Prebuild hook prevents invalid builds

### 5. Type Safety Throughout
**Why Well-Designed:**
- Strict TypeScript mode
- Zod runtime validation
- Type inference from schemas
- No `any` types in core code

**Evidence:**
- tsconfig.json with strict mode
- Zod schemas for all content types
- types/ inferred from schemas
- Route parameter validation

### 6. Responsive and Accessible UI
**Why Well-Designed:**
- Mobile-first responsive design
- Keyboard navigation support
- ARIA labels and semantic HTML
- Dark mode as first-class feature

**Evidence:**
- Mobile sidebar with full-screen drawer
- SearchBox keyboard shortcuts
- Proper heading hierarchy
- Theme system with dark mode

### 7. Extensible Search Architecture
**Why Well-Designed:**
- Modular search components (tokenizer, engine, inverted index)
- Pluggable synonym expansion
- Custom scoring algorithm
- Support for multiple search engines

**Evidence:**
- lib/search/ directory with separate modules
- createSearchEngine() factory function
- Hybrid engine (Fuse.js + inverted index)
- Placeholder for synonym expansion

### 8. Zero-External-Dependency Data Layer
**Why Well-Designed:**
- No database required
- No API calls for data
- Version-controlled content
- Offline-capable
- Simple deployment

**Evidence:**
- data/ directory with JSON files
- File system data loading
- No database connection strings
- Git as content version control

### 9. Static Generation with Dynamic Feel
**Why Well-Designed:**
- Pre-generated routes for fast loads
- Client components for interactivity
- Best of both worlds (static + dynamic)
- SEO-friendly

**Evidence:**
- generateStaticParams() for all routes
- 'use client' for interactive components
- Server components for data loading
- Fast initial page loads

### 10. Comprehensive Error Handling
**Why Well-Designed:**
- Global error boundary
- Custom 404 page
- Graceful fallbacks (nav index missing)
- Try-catch in data loading

**Evidence:**
- app/error.tsx with error display
- app/not-found.tsx with navigation links
- Fallback to full file scan if _nav.json missing
- try-catch in getPackage(), getModel(), etc.

---

## 13. Current Limitations

### 1. Empty Search Expansion Data
**Limitation:** Synonym and concept group expansion is empty
**Impact:** Reduced search relevance for related terms
**Evidence:** lib/search/synonym-expander.ts has empty data structures
**Note:** TODO comment indicates Phase 2+ re-implementation

### 2. Unimplemented Content Types
**Limitation:** Pattern, debug-guide, decision-guide referenced in config but not implemented
**Impact:** Config promises features that don't exist
**Evidence:** aens.config.json lists these in content_types
**Status:** No schemas, no routes, no components

### 3. No Bidirectional Relationship Enforcement
**Limitation:** Config requires bidirectional relationships but validation doesn't enforce
**Impact:** Potential broken references, inconsistent data
**Evidence:** aens.config.json has require_bidirectional_relationships: true
**Status:** Validation script only checks target existence

### 4. Limited Relationship Metadata
**Limitation:** Relationships have no metadata (strength, confidence, when added)
**Impact:** Cannot prioritize or explain relationships
**Evidence:** ContentRef schema only has id and type
**Status:** No relationship attributes

### 5. No Knowledge Graph
**Limitation:** Relationships are simple arrays, not a graph
**Impact:** No transitive traversal, no relationship queries
**Evidence:** alternatives array in PackageSchema, ModelSchema
**Status:** No graph data structure or query capabilities

### 6. Minimal Metadata Fields
**Limitation:** No author, tags, difficulty, popularity metrics
**Impact:** Limited filtering and sorting options
**Evidence:** BaseMetaSchema only has dates, sources, github_repo
**Status:** No additional metadata fields

### 7. Alphabetical-Only Navigation
**Limitation:** No custom ordering, no popularity-based ordering
**Impact:** Cannot prioritize important content
**Evidence:** Sidebar uses alphabetical sorting
**Status:** No ordering configuration

### 8. No Bookmarking/Favorites
**Limitation:** No way to save frequently accessed content
**Impact:** Reduced user personalization
**Evidence:** No bookmark/favorite components or storage
**Status:** Not implemented

### 9. No Content Versioning
**Limitation:** Only updated_at date, no version history
**Impact:** Cannot track content changes over time
**Evidence:** BaseMetaSchema has created_at and updated_at only
**Status:** No version history or diff tracking

### 10. Limited Search Faceting
**Limitation:** Only type grouping, no advanced faceting
**Impact:** Cannot filter by multiple dimensions
**Evidence:** SearchBox groups by type only
**Status:** No faceted search UI

### 11. No Content Export
**Limitation:** No way to export content (PDF, Markdown)
**Impact:** Cannot share content offline
**Evidence:** No export components or functions
**Status:** Not implemented

### 12. No Collaboration Features
**Limitation:** No comments, contributions, or editing
**Impact:** Single-user only
**Evidence:** No collaboration components or backend
**Status:** Not implemented (by design)

### 13. Empty Directories
**Limitation:** lib/validation/ and lib/content/ are empty
**Impact:** Confusing project structure
**Evidence:** Directories exist but contain no files
**Status:** Should be removed or populated

---

## 14. Technical Debt

### Unused Files
1. **lib/validation/** - Empty directory
   - **Action:** Remove directory or populate with validation utilities

2. **lib/content/** - Empty directory
   - **Action:** Remove directory or populate with content utilities

### Duplicate Logic
1. **Fallback Data Loading**
   - **Location:** lib/data.ts - getPackageNavItems(), getModelNavItems(), etc.
   - **Issue:** Each function has identical fallback logic for missing _nav.json
   - **Action:** Extract to shared utility function

2. **Slug Validation**
   - **Location:** scripts/validate-content.ts (line 18)
   - **Issue:** SLUG_REGEX duplicated if used elsewhere
   - **Action:** Move to shared constants file

### Temporary Code
1. **Hardcoded Popular Packages**
   - **Location:** app/page.tsx (line 29)
   - **Issue:** popularPackageIds hardcoded
   - **Action:** Move to configuration or compute from usage data

2. **Registry Task Labels**
   - **Location:** components/layout/Sidebar.tsx (line 43)
   - **Issue:** REGISTRY_TASK_LABELS hardcoded
   - **Action:** Move to registry configuration

### Incomplete Implementations
1. **Synonym Expansion**
   - **Location:** lib/search/synonym-expander.ts
   - **Issue:** Empty data structures with TODO comment
   - **Action:** Populate with synonyms or remove if not needed

2. **Related Search**
   - **Location:** lib/search/related-search.ts
   - **Issue:** Functions implemented but not integrated into UI
   - **Action:** Integrate into SearchBox or remove if not needed

### Potential Cleanup Tasks
1. **Remove or Populate Empty Directories**
   - lib/validation/
   - lib/content/

2. **Extract Duplicate Fallback Logic**
   - Create shared utility for _nav.json fallback

3. **Consolidate Hardcoded Lists**
   - Move popularPackageIds to config
   - Move REGISTRY_TASK_LABELS to registry config

4. **Resolve Placeholder Features**
   - Decide on synonym expansion (implement or remove)
   - Decide on related search (integrate or remove)
   - Remove unimplemented content types from config

5. **Add Missing Error Handling**
   - Some data loading functions may need better error handling
   - Consider adding retry logic for file system operations

---

## 15. Future Extension Readiness

### Knowledge Extension
**Readiness:** High

**Adding New Content Types:**
1. Define schema in lib/schemas/
2. Infer types in types/
3. Add data loading functions in lib/data.ts
4. Add routes in app/
5. Add navigation functions in lib/data.ts
6. Update validation script
7. Update build-nav-index script

**Status:** Pattern, debug-guide, decision-guide, and principle content types already implemented (COMPLETED in refactor)

**Example:** Adding a new content type
- Create lib/schemas/new-type.ts
- Create types/new-type.ts
- Add getNewType(), getAllNewTypes() to lib/data.ts
- Add app/new-types/[id]/page.tsx
- Update scripts/validate-content.ts
- Update scripts/build-nav-index.ts

**Complexity:** Low (clear pattern to follow, 4 new types already implemented)

### Content Extension
**Readiness:** High

**Adding New Entities:**
1. Create JSON file in appropriate data/ directory
2. Follow schema structure
3. Run validation script
4. Rebuild navigation indexes
5. Rebuild application

**Example:** Adding new package
- Create data/packages/new-package.json
- Follow PackageSchema structure
- Run npm run validate
- Run npm run build:nav
- Run npm run build

**Complexity:** Low (file-based, no database)

### Search Extension
**Readiness:** Medium

**Adding Search Fields:**
1. Add field to SearchResult type in lib/search-types.ts
2. Update buildSearchIndex() to populate field
3. Update Fuse.js weights in createFuse()
4. Update tokenizer if needed

**Example:** Adding "tags" field
- Add tags to SearchResult type
- Populate in buildSearchIndex()
- Add to Fuse.js keys
- Update SearchBox display

**Complexity:** Medium (requires touching multiple files)

### Routing Extension
**Readiness:** High

**Adding New Routes:**
1. Create page component in app/
2. Implement generateStaticParams()
3. Add data loading functions
4. Update navigation

**Status:** Pattern, debug-guide, decision-guide, and principle routes already implemented (COMPLETED in refactor)

**Example:** Adding a new route
- Create app/new-types/[id]/page.tsx
- Implement generateStaticParams()
- Add getNewType() to lib/data.ts
- Update Sidebar

**Complexity:** Low (clear pattern to follow, 4 new routes already implemented)

### Components Extension
**Readiness:** High

**Adding New Components:**
1. Create component in components/shared/ or components/layout/
2. Follow existing patterns (props, styling)
3. Export and use in pages

**Example:** Adding new display component
- Create components/shared/NewDisplay.tsx
- Follow SectionCard pattern
- Import and use in page components

**Complexity:** Low (modular component structure)

### Schemas Extension
**Readiness:** High

**Adding New Schema Fields:**
1. Update schema in lib/schemas/
2. Types automatically inferred
3. Update validation script if needed
4. Update data files

**Example:** Adding "tags" field to PackageSchema
- Update lib/schemas/package.ts
- Add tags to package JSON files
- Run validation script

**Complexity:** Low (schema-driven)

### Validation Extension
**Readiness:** Medium

**Adding New Validation Rules:**
1. Add rule to scripts/validate-content.ts
2. Update error reporting
3. Test with sample data

**Example:** Adding max description length check
- Add check in validate-content.ts
- Report error if exceeded
- Test with long description

**Complexity:** Medium (validation script is complex)

---

## 16. Folder Dependency Diagram

```
ai-engineering-handbook/
├── app/                          # Next.js pages
│   ├── layout.tsx               # ──→ components/layout/
│   ├── page.tsx                 # ──→ components/shared/, lib/data.ts, lib/search.ts
│   ├── packages/[id]/page.tsx   # ──→ components/shared/, lib/data.ts
│   ├── models/[category]/       # ──→ components/shared/, lib/data.ts
│   ├── models/[category]/[id]/  # ──→ components/shared/, lib/data.ts
│   ├── registry/[task]/         # ──→ components/shared/, lib/data.ts
│   ├── workflows/[id]/          # ──→ components/shared/, lib/data.ts
│   ├── cheatsheets/[id]/        # ──→ components/shared/, lib/data.ts
│   ├── patterns/[id]/           # ──→ components/shared/, lib/data.ts (NEW)
│   ├── debug-guides/[id]/       # ──→ components/shared/, lib/data.ts (NEW)
│   ├── decision-guides/[id]/    # ──→ components/shared/, lib/data.ts (NEW)
│   ├── principles/[id]/         # ──→ components/shared/, lib/data.ts (NEW)
│   ├── error.tsx                # (no dependencies)
│   ├── not-found.tsx            # (no dependencies)
│   └── globals.css              # (no dependencies)
│
├── components/                   # UI components
│   ├── layout/                  # ──→ lib/data.ts (types), lib/utils.ts
│   ├── shared/                  # ──→ lib/data.ts (types), lib/search-types.ts
│   └── ui/                      # (no internal dependencies)
│
├── lib/                         # Business logic
│   ├── data.ts                  # ──→ types/, data/ (file system)
│   ├── search.ts                # ──→ lib/search/, lib/data.ts
│   ├── search-types.ts          # ──→ (standalone)
│   ├── config/
│   │   ├── loader.ts            # ──→ schema/config.schema.json
│   │   └── registry.ts          # (standalone)
│   ├── schemas/                 # ──→ zod (external)
│   ├── search/                  # ──→ lib/search-types.ts
│   ├── hooks/                  # (standalone)
│   ├── resources.ts            # (standalone)
│   ├── route-params.ts         # ──→ lib/schemas/
│   ├── session-tracking.ts     # (standalone)
│   └── utils.ts                # (standalone)
│
├── types/                       # TypeScript types
│   └── (all files)              # ──→ lib/schemas/
│
├── scripts/                     # Build scripts
│   ├── validate-content.ts     # ──→ lib/schemas/, lib/config/registry.ts
│   ├── build-nav-index.ts      # ──→ data/ (file system)
│   └── migrate-to-v2.ts        # ──→ data/ (file system) (NEW)
│
├── schema/                      # JSON schemas
│   └── config.schema.json       # (standalone)
│
├── data/                        # Content database
│   └── (all files)              # (standalone, read by lib/data.ts)
│
└── public/                      # Static assets
    └── (all files)              # (standalone)
```

**Dependency Rules:**
- app/ → components/, lib/, types/
- components/ → lib/, types/
- lib/ → types/, data/, schema/
- types/ → lib/schemas/
- scripts/ → lib/schemas/, lib/config/, data/
- data/ → (no dependencies)
- public/ → (no dependencies)

**Circular Dependencies:** None detected

---

## 17. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Request                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js Server                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   React Cache Layer                              │
│  (check cache → hit → return │ miss → load → cache → return)    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   lib/data.ts Functions                          │
│  • getPackage(id)                                              │
│  • getAllPackages()                                             │
│  • getModel(category, id)                                      │
│  • getAllModels(category)                                       │
│  • getWorkflow(id)                                              │
│  • getAllWorkflows()                                            │
│  • getCheatsheet(id)                                            │
│  • getRegistryByTask(task)                                     │
│  • getPattern(id) (NEW)                                        │
│  • getAllPatterns() (NEW)                                      │
│  • getDebugGuide(id) (NEW)                                     │
│  • getAllDebugGuides() (NEW)                                   │
│  • getDecisionGuide(id) (NEW)                                  │
│  • getAllDecisionGuides() (NEW)                                │
│  • getPrinciple(id) (NEW)                                      │
│  • getAllPrinciples() (NEW)                                    │
│  • getPackageNavItems()                                         │
│  • getModelNavItems(category)                                  │
│  • getWorkflowNavItems()                                        │
│  • getCheatsheetNavItems()                                      │
│  • getPatternNavItems() (NEW)                                  │
│  • getDebugGuideNavItems() (NEW)                                │
│  • getDecisionGuideNavItems() (NEW)                             │
│  • getPrincipleNavItems() (NEW)                                │
│  • getRecentContent(limit)                                     │
│  • getRelatedContent(type, id)                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   File System (data/)                            │
│  • packages/*.json                                             │
│  • packages/_nav.json                                          │
│  • models/{ml,dl,llm}/*.json                                   │
│  • models/{ml,dl,llm}/_nav.json                                │
│  • workflows/*.json                                            │
│  • workflows/_nav.json                                         │
│  • cheatsheets/*.json                                          │
│  • cheatsheets/_nav.json                                       │
│  • patterns/*.json (NEW)                                       │
│  • patterns/_nav.json (NEW)                                    │
│  • debug-guides/*.json (NEW)                                   │
│  • debug-guides/_nav.json (NEW)                                │
│  • decision-guides/*.json (NEW)                                │
│  • decision-guides/_nav.json (NEW)                             │
│  • principles/*.json (NEW)                                     │
│  • principles/_nav.json (NEW)                                  │
│  • registry/*.json                                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Parsed JSON Data                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Server Component (app/**/*.tsx)                │
│  • Receives data from lib/data.ts                              │
│  • Passes data to components as props                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Client Component (components/)                │
│  • Receives data as props                                       │
│  • Manages interactive state                                   │
│  • Renders UI                                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Browser                                       │
│  • Displays HTML                                                │
│  • Handles user interactions                                   │
│  • Manages client-side state (search, theme, sessions)         │
└─────────────────────────────────────────────────────────────────┘
```

**Search Data Flow:**
```
┌─────────────────────────────────────────────────────────────────┐
│                   lib/search.ts                                 │
│  • buildSearchIndex() → builds SearchResult[]                   │
│  • buildSearchEngine() → creates SearchEngine                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   lib/search-types.ts                            │
│  • createFuse() → creates Fuse.js instance                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   components/shared/SearchBox.tsx                │
│  • Receives search index as prop                                 │
│  • Manages query state                                          │
│  • Calls Fuse.js or custom engine                               │
│  • Displays results                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 18. Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      User Action                                 │
│  • Clicks link /packages/numpy                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Browser Request                               │
│  GET /packages/numpy                                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Next.js Router                                 │
│  • Matches route to app/packages/[id]/page.tsx                 │
│  • Calls generateStaticParams() (build time)                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Server Component Execution                      │
│  • app/packages/[id]/page.tsx                                  │
│  • Calls getPackage('numpy') from lib/data.ts                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   React Cache Check                              │
│  • Is getPackage('numpy') cached?                               │
│  • No → Load from file system                                   │
│  • Yes → Return cached result                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   File System Read                              │
│  • Read data/packages/numpy.json                                │
│  • Parse JSON                                                   │
│  • Validate against PackageSchema (implicit)                    │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Data Transformation                           │
│  • Resolve task cross-references (related_workflows, etc.)      │
│  • Build table of contents                                      │
│  • Get related content                                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Component Rendering                            │
│  • Render ContentPageLayout                                     │
│  • Render Breadcrumbs                                           │
│  • Render ReadingSessionTracker                                 │
│  • Render header with MetadataBadges                            │
│  • Render QuickSetupSection                                     │
│  • Render PackageTaskList                                       │
│  • Render RelatedContent                                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   HTML Generation                                │
│  • Generate HTML from React components                          │
│  • Inline CSS                                                   │
│  • Include scripts for client components                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   HTTP Response                                  │
│  • Return HTML to browser                                       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Browser Rendering                              │
│  • Display HTML                                                  │
│  • Hydrate client components                                    │
│  • Initialize interactive features (search, theme, etc.)        │
└─────────────────────────────────────────────────────────────────┘
```

**Error Flow:**
```
File Not Found → ENOENT → notFound() → app/not-found.tsx
Invalid Route → 404 → app/not-found.tsx
Runtime Error → Error Boundary → app/error.tsx
Validation Error → Build fails → Error message
```

---

## 19. Build Pipeline

### Migration Stage
**Script:** `scripts/migrate-to-v2.ts`
**Trigger:** `node scripts/migrate-to-v2.ts` (manual)
**Purpose:** Migrate existing JSON files to new BaseMetaSchema structure

**Steps:**
1. Scan data/ directory for JSON files
2. Check if file already has new BaseMetaSchema fields
3. Add missing BaseMetaSchema fields with appropriate defaults
4. Derive some fields from existing data (e.g., title from name)
5. Write updated JSON files
6. Report migration summary

**Fields Added:**
- title, slug, description, tags, aliases, keywords, search_tokens
- domain, category, difficulty, engineering_area
- estimated_reading_time, prerequisites, recommended_next, related_content
- last_verified, review_frequency, verified_against
- compatible_versions, breaking_changes
- canonical_status, lifecycle, stability, confidence, engineering_maturity

**Exit Conditions:**
- Success: Exit code 0, files migrated
- Failure: Exit code 1 on file system errors

### Validation Stage
**Script:** `scripts/validate-content.ts`
**Trigger:** `npm run validate` (manual) or `prebuild` hook (automatic)

**Steps:**
1. Scan data/ directory for JSON files
2. Parse each JSON file
3. Validate against appropriate Zod schema
4. Check slug format (regex)
5. Verify filename matches internal ID
6. Detect placeholder text
7. Check minimum content quality
8. Detect duplicate IDs and names
9. Collect cross-references for integrity check
10. Validate registry task matches
11. Check referential integrity
12. Check docs_url uniqueness
13. Report errors and warnings
14. Exit with code 1 if errors found

**Quality Checks:**
- Models: min 3 pros, min 3 cons, min 1 key_hyperparam
- Packages: min 1 task
- Workflows: min 3 steps
- Cheatsheets: min 1 entry

**Exit Conditions:**
- Success: Exit code 0, build proceeds
- Failure: Exit code 1, build blocked

### Navigation Index Generation
**Script:** `scripts/build-nav-index.ts`
**Trigger:** `npm run build:nav` (manual) or `prebuild` hook (automatic)

**Steps:**
1. Read all JSON files in each content directory
2. Extract navigation fields (id, name, version, updated_at, type, category)
3. Sort entries alphabetically
4. Write _nav.json to each directory
5. Log entry counts

**Output Files:**
- data/packages/_nav.json
- data/models/ml/_nav.json
- data/models/dl/_nav.json
- data/models/llm/_nav.json
- data/workflows/_nav.json
- data/cheatsheets/_nav.json
- data/patterns/_nav.json (NEW)
- data/debug-guides/_nav.json (NEW)
- data/decision-guides/_nav.json (NEW)
- data/principles/_nav.json (NEW)

**Fallback Behavior:**
- If _nav.json missing at runtime, falls back to full file scan
- Ensures first-run compatibility

### Static Generation
**Tool:** Next.js build
**Trigger:** `npm run build`

**Steps:**
1. Run prebuild hook (validate + build-nav)
2. Compile TypeScript
3. Generate static pages for all routes
4. Optimize assets
5. Generate .next/ directory
6. Output production build

**Route Generation:**
- `generateStaticParams()` for each dynamic route
- Pre-renders all content pages
- Generates HTML at build time

**Output:**
- .next/ directory with compiled code
- Static HTML for all routes
- Optimized JavaScript bundles
- Asset manifests

### Build Sequence
```bash
npm run build
  ↓ (prebuild hook)
npm run validate
  ↓ (if successful)
npm run build:nav
  ↓ (if successful)
next build
  ↓
Production build output
```

### Validation Rules
**Schema Validation:**
- All JSON files must match Zod schema
- Date fields must be YYYY-MM-DD format
- URLs must be valid URLs
- GitHub URLs must start with https://github.com

**Format Validation:**
- IDs must match `/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/`
- Filenames must match internal ID
- No uppercase, spaces, or underscores (except registry)

**Quality Validation:**
- No placeholder text (TODO, Placeholder, TBD, etc.)
- Minimum content requirements (see above)
- At least one source URL required
- New content types require appropriate fields (context for patterns, symptoms for debug guides, options for decision guides, examples for principles)

**Integrity Validation:**
- No duplicate IDs within type
- No duplicate names within type
- All cross-references must exist
- Registry task must match filename

---

## 20. Current Project Health

### Maintainability: **Excellent**
**Reasoning:**
- Clear separation of concerns (app, components, lib, types, scripts)
- Schema-driven development (Zod schemas → TypeScript types)
- Comprehensive validation pipeline
- Well-documented code with comments
- Consistent naming conventions
- No circular dependencies

**Evidence:**
- lib/ contains no UI code
- components/ contain no data loading
- types/ inferred from schemas
- Validation script with clear error messages
- Consistent file naming (kebab-case)

### Scalability: **Good**
**Reasoning:**
- Static generation scales to thousands of pages
- React cache prevents redundant file reads
- Lightweight navigation indexes
- Client-side search scales with content
- File-based data scales with Git

**Limitations:**
- Single-server deployment (no horizontal scaling)
- File system I/O may bottleneck at very large scale
- Search index size may grow large (monitored in dev)

**Evidence:**
- generateStaticParams() for all routes
- React cache wrapper on all data functions
- _nav.json files for lightweight navigation
- Client-side Fuse.js search
- Index size logging in development

### Readability: **Excellent**
**Reasoning:**
- TypeScript strict mode
- Clear function names
- Consistent code style
- Minimal complexity per function
- Well-organized directory structure
- Comprehensive comments

**Evidence:**
- tsconfig.json with strict mode
- Descriptive function names (getPackage, getAllPackages)
- Single responsibility per function
- Logical file organization
- Comments explaining complex logic (tokenizer, search engine)

### Consistency: **Excellent**
**Reasoning:**
- Consistent naming conventions (kebab-case files, camelCase code)
- Consistent component patterns (props, styling)
- Consistent data loading patterns (React cache)
- Consistent error handling (try-catch, notFound)
- Consistent validation (Zod schemas)

**Evidence:**
- All data loading functions follow same pattern
- All page components follow same structure
- All schemas follow same base pattern
- Consistent prop naming across components

### Documentation: **Good**
**Reasoning:**
- Comprehensive README with setup instructions
- Inline comments in complex code
- Schema documentation via Zod
- Validation script self-documenting
- Architecture documentation in docs/

**Limitations:**
- No API documentation (not applicable for static site)
- Limited component prop documentation
- No architecture diagrams in code

**Evidence:**
- README.md with setup and contribution rules
- Comments in tokenizer.ts explaining rules
- Comments in data.ts explaining caching strategy
- Validation script with clear step comments

### Architecture Maturity: **High**
**Reasoning:**
- Well-established patterns (Server Components, React cache)
- Clear separation of concerns
- Schema-driven development
- Comprehensive validation
- Performance optimizations

**Evidence:**
- Next.js App Router best practices
- React cache for performance
- Zod for runtime validation
- Static generation for performance
- Client-side search for interactivity

### Knowledge Architecture Maturity: **High**
**Reasoning:**
- Clear knowledge objects (9 content types: packages, models, workflows, cheatsheets, registry, patterns, debug-guides, decision-guides, principles)
- Schema-defined relationships with expanded BaseMetaSchema
- Cross-reference resolution for all 9 content types
- Related content computation with universal related_content field
- Learning path support with prerequisites and recommended_next
- AI-ready data structures with keywords, search_tokens, tags, aliases

**Limitations:**
- No knowledge graph (simple arrays)
- No relationship metadata (strength, confidence)
- No transitive relationship traversal

**Evidence:**
- ContentRef schema for all 9 content types
- getRelatedContent() for all content types
- Cross-reference resolution functions
- Relationship validation in build pipeline
- Expanded BaseMetaSchema with 20+ metadata fields
- Search indexing with enriched fields for all content types

### Overall Health: **Excellent**
**Summary:**
The project demonstrates excellent engineering practices with clear architecture, comprehensive validation, and performance optimizations. The codebase is maintainable, readable, and consistent. The AENS Knowledge Layer v1.0 refactor has been completed, adding 4 new content types (patterns, debug-guides, decision-guides, principles) with full infrastructure support including schemas, routes, navigation, search indexing, and cross-link capabilities. The main areas for improvement are in the knowledge architecture (relationship metadata, knowledge graph) and some placeholder features (synonym expansion, related search). The project is well-positioned for scaling and extension.

**Strengths:**
- Schema-driven development with expanded BaseMetaSchema (20+ metadata fields)
- Comprehensive validation for all 9 content types
- Performance optimizations with React cache and static generation
- Clear separation of concerns
- Type safety throughout
- Full AENS Knowledge Layer v1.0 specification compliance
- AI-ready data structures for future semantic search and recommendations
- Learning path support with prerequisites and recommended_next

**Areas for Improvement:**
- Complete placeholder features (synonym expansion, related search)
- Remove or populate empty directories
- Add relationship metadata (strength, confidence)
- Consider knowledge graph for advanced relationships
- Create actual content for new content types (infrastructure ready)

**Technical Debt:** Low
- Empty directories (lib/validation/, lib/content/)
- Duplicate fallback logic in data loading
- Hardcoded lists (popular packages, registry labels)
- Placeholder features (synonym expansion, related search)
- Temporary `as any` type assertions for name/title field migration (intentional)

**Recommendation:** The project is in excellent health and ready for production use. The AENS Knowledge Layer v1.0 refactor is complete with all 9 content types fully supported. The technical debt is minimal and can be addressed incrementally without impacting core functionality. The infrastructure is ready for content creation and AI feature development.

---

## Appendix

### Technology Stack Summary
- **Framework:** Next.js 16.2.9 (App Router)
- **Runtime:** React 19.2.4
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui, Radix UI
- **Icons:** Lucide React
- **Validation:** Zod 4.4.3, AJV 8.17.1
- **Search:** Fuse.js 7.4.2
- **Build:** tsx 4.22.4
- **Linting:** ESLint 9.39.4

### Key Dependencies
- **next:** 16.2.9
- **react:** 19.2.4
- **react-dom:** 19.2.4
- **zod:** 4.4.3
- **fuse.js:** 7.4.2
- **lucide-react:** 1.21.0
- **tailwindcss:** 4
- **typescript:** 5

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run validate` - Validate content
- `npm run build:nav` - Build navigation indexes

### Environment Variables
- `STRICT_REFERENCE_MODE` - Enable strict reference checking (true/false)
- `NODE_ENV` - Development/production mode (affects index size logging)

### File Count Summary
- **Total TypeScript/TSX files:** ~60
- **Total JSON schema files:** 1
- **Total JSON content files:** Variable (in data/)
- **Total CSS files:** 1
- **Total script files:** 2

### Lines of Code (Approximate)
- **app/:** ~400 lines
- **components/:** ~2,000 lines
- **lib/:** ~1,500 lines
- **scripts/:** ~400 lines
- **types/:** ~40 lines
- **Total:** ~4,340 lines (excluding data/ and docs/)

---

**End of Report**
