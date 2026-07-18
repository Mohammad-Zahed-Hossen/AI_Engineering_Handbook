---
id: architecture-data-flow
title: Data Flow and Pipelines
type: architecture
status: active
owner: system
canonical: true
version: 2.0
related:
  - architecture-overview
  - architecture-components
  - engineering-validation
ai_priority: 3
---

# Data Flow and Pipelines

**Date**: 2026-06-29
**Version**: 2.0

---

## Complete Data Lifecycle

### 1. Content Creation

```
JSON File (data/packages/numpy.json)
├─ id: "numpy"
├─ name: "NumPy"
├─ tasks: [...]
└─ alternatives: [{ id: "cupy", type: "package" }]
```

### 2. Schema Validation (Build Time)

```
scripts/validate-content.ts
├─ JSON Parse ✓
├─ PackageSchema.safeParse() ✓
├─ Slug format check ✓
├─ Filename === ID check ✓
├─ Placeholder detection ✓
├─ Minimum content quality ✓
├─ Duplicate detection ✓
└─ ContentRef integrity ✓
```

### 3. Navigation Index Generation (Build Time)

```
scripts/build-nav-index.ts
├─ Read data/packages/numpy.json
├─ Extract { id, name, version, updated_at }
└─ Write data/packages/_nav.json
```

### 4. Type Safety (Build Time)

```
types/package.ts + lib/schemas/package.ts
├─ TypeScript types for IDE support
└─ Zod schemas for runtime validation
```

### 5. Data Loading (Runtime)

```
lib/data.ts (React cache)
├─ readJSON() reads file
├─ Zod validation (runtime)
└─ React.cache() memoizes result
```

### 6. Route Rendering (Runtime)

```
app/packages/[id]/page.tsx
├─ getPackage(id) from lib/data.ts
├─ Render ContentPageLayout
└─ Render shared components
```

---

## Search Indexing Flow

```
lib/search.ts: buildSearchIndex()
    ↓
Load All Content
├─ packages (getAllPackages)
├─ models (getAllModels)
├─ workflows (getAllWorkflows)
├─ cheatsheets (getAllCheatsheets)
├─ debug-guides (getAllDebugGuides)
├─ decision-guides (getAllDecisionGuides)
├─ patterns (getAllPatterns)
├─ principles (getAllPrinciples)
└─ registry (getRegistryTasks)
    ↓
Tokenize Fields
├─ name
├─ summary
├─ tasks[].syntax (packages)
├─ entries[].snippet (cheatsheets)
├─ problem_types (models)
├─ symptoms[].symptom (debug-guides)
├─ problem (decision-guides)
├─ concept (patterns)
└─ statement (principles)
    ↓
Build Inverted Index
├─ tokenMap: token → Set<docId>
└─ docMap: docId → SearchResult
    ↓
Cache Result (React.cache)
```

---

## Navigation Data Flow

```
_build:nav Script
    ↓
Scan data/ Directory
├─ data/packages/*.json
├─ data/models/{ml,dl,llm}/*.json
├─ data/workflows/*.json
└─ data/cheatsheets/*.json
    ↓
Extract Metadata
├─ id
├─ name
├─ version (if applicable)
└─ updated_at
    ↓
Write _nav.json
├─ data/packages/_nav.json
├─ data/models/ml/_nav.json
├─ data/models/dl/_nav.json
├─ data/models/llm/_nav.json
├─ data/workflows/_nav.json
└─ data/cheatsheets/_nav.json
    ↓
Runtime Loading
├─ lib/data.ts: getPackageNavItems()
├─ lib/data.ts: getModelNavItems(category)
├─ lib/data.ts: getWorkflowNavItems()
└─ lib/data.ts: getCheatsheetNavItems()
    ↓
Sidebar Rendering
├─ Group by first letter (if >30 items)
├─ Limit to 12 visible items
└─ Render "See all N →" links
```

---

## ContentRef Resolution Flow

```
ContentRef in JSON
├─ { id: "numpy", type: "package" }
└─ { id: "rag", type: "workflow" }
    ↓
lib/data.ts: getRelatedContent()
    ↓
For each ContentRef:
├─ Resolve type to directory
│   ├─ package → data/packages/
│   ├─ model → data/models/{ml|dl|llm}/
│   ├─ workflow → data/workflows/
│   └─ cheatsheet → data/cheatsheets/
├─ Check file existence
├─ Read JSON file
└─ Return { id, name, type, url }
    ↓
RelatedContent Component
├─ Render links
└─ Handle missing targets (graceful degradation)
```

---

## Session Tracking Flow

```
User Visits Page
    ↓
PageVisitTracker Component
├─ recordPageVisit(id, name, type)
└─ lib/session-tracking.ts
    ↓
localStorage Operations
├─ recentKnowledge: Array<{id, name, type, timestamp}>
└─ continueReading: Map<id, {progress, scrollPosition, timestamp}>
    ↓
RecentKnowledgeSection
├─ getRecentKnowledge()
└─ Render recent items
    ↓
ContinueReadingSection
├─ getContinueReading()
└─ Render items with progress bars
```

---

## Key Communication Patterns

1. **Data → Components**: `lib/data.ts` (cached loaders) → Route Components → Shared Components
2. **Search → TopBar**: `lib/search.ts` (buildSearchIndex) → TopBar → SearchBox
3. **Navigation → Sidebar**: `lib/data.ts` (nav loaders) → Root Layout → Sidebar
4. **Validation → Build**: `scripts/validate-content.ts` → prebuild → Next.js build
5. **Session Tracking → Components**: `lib/session-tracking.ts` → PageVisitTracker → ContinueReadingSection

---

## Performance Optimizations

### React Cache
All data loaders in `lib/data.ts` use `React.cache()`:
- Data loaded once per request
- Shared across components
- Prevents redundant file reads

### _nav.json Files
- **Problem**: At 500 packages, parsing 500 full JSON files is slow
- **Solution**: _nav.json contains only id, name, version, updated_at
- **Benefit**: One file read instead of N file reads
- **Fallback**: If _nav.json missing, fall back to full file scan

### Static Generation
- All routes pre-rendered at build time
- No server-side rendering overhead
- Fast initial page loads

---

## Related Documentation

- **System Overview**: See `architecture/overview.md`
- **Component Architecture**: See `architecture/components.md`
- **Search Architecture**: See `architecture/search.md`
- **Navigation Architecture**: See `architecture/navigation.md`
- **Validation Rules**: See `engineering/validation.md`
