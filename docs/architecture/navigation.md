---
id: architecture-navigation
title: Navigation Architecture
type: architecture
status: active
owner: system
canonical: true
version: 2.0
related:
  - architecture-overview
  - architecture-data-flow
  - architecture-repository
ai_priority: 3
---

# Navigation Architecture

**Date**: 2026-06-29
**Version**: 2.0

---

## _nav Generation

**Location**: `scripts/build-nav-index.ts`

### Process

1. Scan each content directory (packages, models/{ml,dl,llm}, workflows, cheatsheets)
2. For each JSON file, extract:
   - id
   - name
   - version (packages only)
   - updated_at
   - type
   - category (models only)
3. Write _nav.json to each directory

### Output Format

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

### Additional Fields

- `type`: Content type ('package' | 'model' | 'workflow' | 'cheatsheet')
- `category`: For models only, the category ('ml' | 'dl' | 'llm')
- These fields are used for filtering and routing in the application

---

## Navigation Hierarchy

```
Root Layout
    ↓
Sidebar
    ├─ Dashboard (home link)
    ├─ Packages (expandable)
    │   ├─ Grouped by first letter (if >30)
    │   ├─ Limited to 12 visible
    │   └─ "See all N →" link
    ├─ Models Library (expandable)
    │   ├─ Machine Learning (expandable)
    │   │   ├─ Grouped by first letter (if >30)
    │   │   └─ Limited to 12 visible
    │   ├─ Deep Learning (expandable)
    │   └─ Large Language Models (expandable)
    ├─ Registries (expandable)
    │   ├─ Task list (limited to 12 visible)
    │   └─ Families (expandable)
    ├─ Workflows (expandable)
    │   ├─ Grouped by first letter (if >30)
    │   └─ Limited to 12 visible
    ├─ Cheatsheets (expandable)
    │   ├─ Grouped by first letter (if >30)
    │   └─ Limited to 12 visible
    ├─ Debug Guides (expandable)
    ├─ Decision Guides (expandable)
    ├─ Patterns (expandable)
    └─ Principles (expandable)
```

---

## Dynamic Routing

### Model Routes

- `/models` → `app/models/page.tsx` (unified page showing all categories)
- `/models/ml` → `app/models/[category]/page.tsx` with category="ml"
- `/models/ml/random-forest` → `app/models/[category]/[id]/page.tsx` with category="ml", id="random-forest"
- `generateStaticParams()` generates paths for all model categories
- The unified `/models` page provides an alternative navigation path, listing all three categories (ML, DL, LLM) in sections with links to each category page

### Registry Routes

- `/registry/embedding` → `app/registry/[task]/page.tsx` with task="embedding"
- `generateStaticParams()` generates paths for all registry tasks

### Content Routes

- `/packages/numpy` → `app/packages/[id]/page.tsx` with id="numpy"
- `/workflows/rag` → `app/workflows/[id]/page.tsx` with id="rag"
- `/cheatsheets/pytorch` → `app/cheatsheets/[id]/page.tsx` with id="pytorch"

---

## Content Discovery

### Sidebar Navigation

- Browse by type (packages, models, workflows, cheatsheets)
- Browse by category (models only: ml, dl, llm)
- Browse by task (registry only: embedding, vision, etc.)
- Alphabetical grouping for large lists
- Item limits with "See all" links

### Search

- Global search across all content types
- Search by name, summary, problem type
- Search by code syntax (package tasks, cheatsheet entries)
- Keyboard navigation and recent searches

### Home Page

- Dashboard with category counts
- Quick access to popular items
- Recently updated content
- Continue reading (session resumption)
- Recent knowledge (browsing history)

---

## Performance Rationale

### _nav.json Files

**Problem**: At 500 packages, parsing 500 full JSON files for sidebar navigation is slow

**Solution**: _nav.json contains only id, name, version, updated_at

**Benefit**: One file read instead of N file reads

**Fallback**: If _nav.json missing, fall back to full file scan

### React Cache

- All data loaders in `lib/data.ts` use `React.cache()`
- Data loaded once per request, shared across components
- Prevents redundant file reads

### Static Generation

- All routes pre-rendered at build time
- No server-side rendering overhead
- Fast initial page loads

---

## Fallback Behavior

### _nav.json Missing

```typescript
export const getPackageNavItems = cache(function getPackageNavItems(): NavItem[] {
  const navPath = path.join(dataDir, 'packages', '_nav.json');
  if (!fs.existsSync(navPath)) {
    // Fallback: rebuild from full files
    return getAllPackageIds().map(id => {
      const data = readJSON<{ id: string; name: string }>(
        path.join(dataDir, 'packages', `${id}.json`)
      );
      return { id: data.id, name: data.name };
    });
  }
  return readJSON<NavItem[]>(navPath);
});
```

### getRecentContent Fallback

The `getRecentContent()` function also has a fallback mechanism. If any _nav.json files are missing (e.g., first run before `build:nav` is executed), it falls back to `getRecentContentFallback()` which performs a full file scan. This ensures the home page's "Recently Updated" section works even before navigation indexes are built.

### ContentRef Resolution

- If target doesn't exist, render as non-clickable badge
- No broken links in UI

---

## Related Documentation

- **System Overview**: See `architecture/overview.md`
- **Data Flow**: See `architecture/data-flow.md`
- **Repository Structure**: See `architecture/repository.md`
- **Search Architecture**: See `architecture/search.md`
