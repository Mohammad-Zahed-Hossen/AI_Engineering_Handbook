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

**Primary Knowledge Abstractions (9 Total):**
1. **Package** - Python library/package documentation
   - Abstraction level: High (package-level)
   - Granularity: Package → Tasks
   - Metadata: Version, language, installation, import alias

2. **Model** - Machine Learning, Deep Learning, or LLM specifications
   - Abstraction level: High (model architecture)
   - Granularity: Model → Hyperparameters
   - Metadata: Category, problem types, difficulty, engineering maturity

3. **Workflow** - Production deployment workflows
   - Abstraction level: High (end-to-end pipeline)
   - Granularity: Workflow → Steps
   - Metadata: Type, category, starter stack

4. **Cheatsheet** - Rapid syntax reference sheets
   - Abstraction level: Medium (language/library)
   - Granularity: Cheatsheet → Entries
   - Metadata: None beyond base

5. **Pattern** - Reusable design patterns
   - Abstraction level: Medium (concept)
   - Granularity: Pattern → Examples
   - Metadata: Context, examples, anti_patterns

6. **Debug Guide** - Troubleshooting guides
   - Abstraction level: Medium (symptom)
   - Granularity: Debug Guide → Solutions
   - Metadata: Symptoms, root_causes, solutions

7. **Decision Guide** - Tech trade-off comparisons
   - Abstraction level: Medium (decision)
   - Granularity: Decision Guide → Options
   - Metadata: Problem, options, trade_offs, recommendations

8. **Principle** - Fundamental engineering principles
   - Abstraction level: High (theoretical)
   - Granularity: Principle → Implications
   - Metadata: Statement, intuition, examples, applications

9. **Registry** - Model registry entries
   - Abstraction level: Low (individual model)
   - Granularity: Single entry
   - Metadata: Task, size_mb, link

### Current Relationships

**Cross-Reference Schema (ContentRef):**
```typescript
{
  id: string;
  type: 'model' | 'package' | 'workflow' | 'cheatsheet' | 'registry' | 'pattern' | 'debug_guide' | 'decision_guide' | 'principle';
}
```

**Relationship Types:**
- **alternatives** - Direct substitutes (packages, models)
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
Problem Index
Packages (expandable)
Models Library
  ├── Machine Learning (expandable)
  ├── Deep Learning (expandable)
  └── Large Language Models (expandable)
Registries (expandable)
Workflows (expandable)
Cheatsheets (expandable)
Patterns (expandable) (NEW)
Debug Guides (expandable) (NEW)
Decision Guides (expandable) (NEW)
Principles (expandable) (NEW)
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

**Index Size Check:**
- Development-only logging of index size
- Monitors for index bloat
- Logs entry count and KB size

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

---

## 6. Current Limitations

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

## 7. Technical Debt

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

## 8. Future Extension Readiness

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

## 9. Folder Dependency Diagram

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

## 10. Data Flow Diagram

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

## 11. Request Flow Diagram

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
│                   Data Transformation                             │
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

## 12. Build Pipeline

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

## 13. Current Project Health

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

## 14. Implementation Status

## Model Detail Page UX Refactor (v1.2)

**Status:** ✅ Complete

All implementation items from the AENS Model Page Audit Report have been successfully completed:

### Original Audit Report (4 Prompts) - All Implemented

1. **Prompt #1 - Shared Prose/Math Rendering Primitive** ✅
   - Created `components/shared/Prose.tsx` with `Prose` and `ProseInline` components
   - Added dependencies: `react-markdown`, `remark-gfm`, `remark-math`, `rehype-katex`, `katex`
   - Imported KaTeX CSS in `app/layout.tsx`
   - All content fields now render through Prose components

2. **Prompt #2 - Quick Start: Syntax Highlighting + Progressive Disclosure** ✅
   - `CodeBlock.tsx` uses Shiki's `codeToHtml` for server-side syntax highlighting
   - `CodeBlockInteractive.tsx` handles collapse/expand with scroll compensation
   - Line numbers via CSS counters in `globals.css`

3. **Prompt #3 - "Updated" Badge → Relative Time** ✅
   - Created `lib/format-date.ts` with `formatRelativeTime` function
   - `MetadataBadges.tsx` shows relative time with ISO tooltip
   - Added "Verified" badge for `lastverified` field

4. **Prompt #4 - Section Defaults, Width, Inline-Code Styling** ✅
   - Core Understanding collapsed by default (`useState(false)`)
   - Teaser added: "6 specifications · N assumptions noted"
   - `.content-prose` max-width applied consistently
   - Inline `code` styling in `globals.css`

### Regression Audit Report (3 Prompts) - All Implemented

1. **Prompt #1 - Shiki to Build/Server Time** ✅
   - `CodeBlock.tsx` is now an async Server Component
   - `CodeBlockInteractive.tsx` handles client interactivity
   - Double-collapse conflict resolved

2. **Prompt #2 - Double-Escaped Newlines** ✅
   - `normalizeContent` function in `Prose.tsx` with defensive regex
   - Validation script updated to check for double-escaped newlines
   - Data correction applied to affected model files

3. **Prompt #3 - KaTeX Scoping + Teaser Fix** ✅
   - `body .katex { font-size: 1em !important; }` in `globals.css`
   - Teaser changed to computed summary instead of raw field concatenation

### Final Polish Audit Report (4 Prompts) - All Implemented

1. **Issue #1 - Interpretability field uses ProseInline** ✅
   - `ModelDecisionStrip.tsx` updated to use `ProseInline` for LaTeX rendering

2. **Issue #2 - Double background CSS override** ✅
   - Scoped CSS rule for Shiki's inline background

3. **Issue #3 - Scroll compensation in CodeBlockInteractive** ✅
   - `useLayoutEffect` with `getBoundingClientRect` tracking
   - `aria-expanded` added to expand/collapse button

4. **Issue #4 - Cross-linking in ModelCollapsibleSections** ✅
   - "Also Worth Knowing" chips link to real pages where available
   - `aria-controls` added to `CollapsibleSection`

### Build Verification

- `npm run build` passes successfully
- All 40 static pages generated
- 0 errors, 23 warnings (only missing content references)

### Git Status

- Pushed to `feature/repository-foundation-v2` branch
- Commit `7af1f7a` with all changes

---

# Contact

**Architecture Lead:** [To be filled]  
**Review Date:** [To be scheduled]

---

# Change Log

| Date | Version | Change | Author |
|------|---------|--------|--------|
| July 4, 2026 | 1.0 | Initial architecture freeze | Architecture Lead |
| July 9, 2026 | 1.1 | Model Schema Evolution (Quick Start & Curated Resources) | AI Assistant |
| July 9, 2026 | 1.2 | Model detail page visual refactor & UX specs update | AI Assistant |

---

**End of Report**