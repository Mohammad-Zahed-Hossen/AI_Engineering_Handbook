---
id: architecture-overview
title: System Architecture Overview
type: architecture
status: active
owner: system
canonical: true
version: 2.0
related:
  - architecture-repository
  - architecture-data-flow
  - architecture-design-principles
ai_priority: 2
---

# System Architecture Overview

**Date**: 2026-06-29
**Version**: 2.0

---

## Executive Summary

AENS is a static Next.js application that serves as a navigational layer to official documentation. It functions as a content-first knowledge base for AI engineering, built on Next.js 16 with static generation, local JSON file storage, Zod schema validation, and a custom search engine with tokenization, inverted indexing, and synonym expansion.

---

## High-Level Architecture

The architecture prioritizes:

- **Static Generation**: All routes are pre-rendered at build time using `generateStaticParams`
- **Local-First Data**: All content stored as JSON files in `data/` directory
- **Performance Optimization**: Lightweight `_nav.json` indexes for navigation
- **Custom Search**: Tokenization, inverted index, synonym expansion, and fuzzy matching
- **Schema Validation**: Zod schemas enforce data integrity at build time

---

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP Request
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Server (Static)                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Route Handler (app/[category]/[id]/page.tsx)            │  │
│  │  ├─ generateStaticParams()                               │  │
│  │  ├─ Data Loading (lib/data.ts - cached)                 │  │
│  │  ├─ Validation (route-params.ts)                        │  │
│  │  └─ Component Rendering                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Root Layout (app/layout.tsx)                            │  │
│  │  ├─ Sidebar Navigation (components/layout/Sidebar.tsx)   │  │
│  │  ├─ TopBar with Search (components/layout/TopBar.tsx)    │  │
│  │  ├─ Search Index (lib/search.ts - cached)               │  │
│  │  └─ Session Tracking (lib/session-tracking.ts)          │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  data/        │  │  lib/         │  │  components/  │
│  JSON Files   │  │  Data Layer   │  │  UI Layer     │
│  + _nav.json  │  │  + Schemas    │  │  + Layout     │
│               │  │  + Search     │  │  + Shared     │
└───────────────┘  └───────────────┘  └───────────────┘
```

---

## Content Pipeline

```
JSON Content (data/)
    ↓
Schema Validation (scripts/validate-content.ts)
    ↓
Type Safety (types/*.ts + lib/schemas/*.ts)
    ↓
Data Loading (lib/data.ts - React cache)
    ↓
Route Component (app/[category]/[id]/page.tsx)
    ↓
Shared Components (components/shared/)
    ↓
Rendered HTML (Static Generation)
```

---

## Rendering Pipeline

```
User Request
    ↓
Next.js Static Route
    ↓
generateStaticParams() [Build Time]
    ↓
lib/data.ts (cached data loader)
    ↓
Route Component (Server Component)
    ↓
ContentPageLayout (Shared Wrapper)
    ├─ Breadcrumbs
    ├─ MetadataBadges
    ├─ OfficialResources
    ├─ Main Content
    ├─ RelatedContent
    └─ StickyActionBar
    ↓
HTML Response
```

---

## Navigation Pipeline

```
_build:nav Script
    ↓
Reads JSON Files from data/
    ↓
Extracts id, name, version, updated_at
    ↓
Writes _nav.json to each directory
    ↓
lib/data.ts Reads _nav.json (cached)
    ↓
Sidebar Component Renders Navigation
    ├─ Grouped by First Letter (if >30 items)
    ├─ Item Limit (12 visible)
    ├─ Active Item Highlighting
    └─ "See all N →" Links
```

---

## Search Pipeline

```
lib/search.ts: buildSearchIndex()
    ↓
Load All Content (packages, models, workflows, cheatsheets, registry)
    ↓
Tokenize Fields (lib/search/tokenizer.ts)
    ├─ Dot-split (np.linalg.inv → np, linalg, inv)
    ├─ Prefix segments (np, np.linalg, np.linalg.inv)
    ├─ Package aliases (np → numpy)
    ├─ CamelCase split (CrossEntropyLoss → Cross, Entropy, Loss)
    ├─ Snake/kebab split (learning_rate → learning, rate)
    └─ Abbreviation expansion (svd → singular, value, decomposition)
    ↓
Build Inverted Index (lib/search/inverted-index.ts)
    ├─ tokenMap: token → Set<docId>
    └─ docMap: docId → SearchResult
    ↓
Search Query
    ↓
Synonym Expansion (lib/search/synonym-expander.ts)
    ├─ data/search/synonyms.json
    └─ data/search/concept-groups.json
    ↓
Query Inverted Index (exact + prefix matches)
    ↓
Fuse.js Fuzzy Matching (fallback)
    ↓
Score Aggregation
    ├─ Exact name match: 1.0
    ├─ Name prefix: 0.98
    ├─ Name contains: 0.90
    ├─ Summary match: 0.85
    ├─ Concept group: 0.96
    └─ Fuzzy match: 0-0.45
    ↓
Ranked Results
```

---

## Validation Pipeline

```
prebuild Script (package.json)
    ↓
npm run validate (scripts/validate-content.ts)
    ↓
Scan data/ Directory
    ↓
For Each JSON File:
    ├─ JSON Parse Validation
    ├─ Schema Validation (Zod)
    │   ├─ PackageSchema
    │   ├─ ModelSchema
    │   ├─ WorkflowSchema
    │   ├─ CheatsheetSchema
    │   └─ RegistryModelSchema
    ├─ Slug Format Validation (/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/)
    ├─ Filename === ID Validation
    ├─ Placeholder Detection (TODO, Placeholder, TBD, etc.)
    ├─ Minimum Content Quality
    │   ├─ Models: 3 pros, 3 cons, 1 hyperparam
    │   ├─ Packages: 1 task
    │   ├─ Workflows: 3 steps
    │   └─ Cheatsheets: 1 entry
    ├─ Duplicate Detection (ID and Name)
    └─ ContentRef Integrity
        ├─ Orphan Detection
        ├─ Type Compatibility
        └─ Legacy String Detection
    ↓
npm run build:nav (scripts/build-nav-index.ts)
    ↓
Next.js Build
```

---

## Related Documentation

- **Repository Structure**: See `architecture/repository.md`
- **Data Flow**: See `architecture/data-flow.md`
- **Design Principles**: See `architecture/design-principles.md`
- **Component Architecture**: See `architecture/components.md`
- **Search Architecture**: See `architecture/search.md`
- **Navigation Architecture**: See `architecture/navigation.md`
