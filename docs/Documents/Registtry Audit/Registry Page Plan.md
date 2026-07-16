# AENS Registry Refactor - Implementation Plan

Based on my analysis of the current codebase, I've identified the key issues and created a detailed implementation plan following the 7-phase approach from the audit document.

## Current State Analysis

### Key Problems Found:

1. **Data Modeling**: `llms.json` contains 3 entries - 2 are family-level entries (`llama-3-x-family`, `deepseek-r1-v3-family`) with `size_mb: 0` and comma-separated variants in `identity.checkpoint`
2. **Monolithic Storage**: All LLM registry data in a single `llms.json` file
3. **No Family/Variant Hierarchy**: Schema doesn't distinguish between family and variant
4. **Shallow Search**: Only indexes `id`, `name`, `summary`, `category` - no structured fields
5. **Limited Navigation**: Only 2 route levels (`/registry`, `/registry/[task]`)

---

## Phase 1: Data Model Refactoring (Critical)

### Why:

The current data model conflates model families with individual variants, making it impossible for users to find specific model sizes and creating meaningless data (e.g., `size_mb: 0` for families).

### Changes:

1. **Create new directory structure** under `data/registry/families/`
2. **Split family entries** into individual variant files
3. **Create family index files** with shared metadata
4. **Update schema** to add `family_id` and `is_family` fields
5. **Migrate existing data** from `llms.json`

### New Structure:

```
data/registry/
├── families/
│   ├── llama-3/
│   │   ├── _index.json          # Family metadata
│   │   ├── 3-1-8b.json          # Individual variant
│   │   ├── 3-1-70b.json
│   │   ├── 3-2-1b.json
│   │   ├── 3-2-3b.json
│   │   ├── 3-2-11b-vision.json
│   │   ├── 3-3-70b.json
│   │   └── index.ts             # TypeScript exports
│   └── deepseek/
│       ├── _index.json
│       ├── v3-12b.json
│       ├── v3-24b.json
│       ├── r1-70b.json
│       └── r1-distill-1.5b.json
└── _families.json               # List of all families
```

---

## Phase 2: Data Organization (High Priority)

### Why:

Monolithic JSON files don't scale. Individual files enable parallel editing, reduce merge conflicts, and follow the pattern used in `data/models/llm/`.

### Changes:

1. **Create `getRegistryFamilies()`** function in `lib/data.ts`
2. **Create `getRegistryFamily(familyId)`** function
3. **Create `getRegistryVariant(familyId, variantId)`** function
4. **Update `getRegistryByTask()`** to use new structure
5. **Add validation** for family/variant data

---

## Phase 3: Navigation & Routing (High Priority)

### Why:

Users need to navigate from Family → Variant → Related Models with proper breadcrumbs.

### New Route Structure:

```
/registry/
├── page.tsx                    # Registry home (list families)
├── families/
│   └── [family]/
│       ├── page.tsx            # Family overview (list variants)
│       └── [variant]/
│           └── page.tsx        # Individual variant page
```

### Changes:

1. **Create `app/registry/families/[family]/page.tsx`**
2. **Create `app/registry/families/[family]/[variant]/page.tsx`**
3. **Add redirects** from old `/registry/llm` routes
4. **Update breadcrumbs** in all registry pages

---

## Phase 4: UI Components (Medium Priority)

### Why:

Current card design shows too much information, causing cognitive overload.

### Changes:

1. **Create `FamilyCard` component** for registry home
2. **Create `VariantCard` component** for family pages
3. **Create `VariantDetail` component** for individual pages
4. **Implement comparison table** for variants
5. **Add quick links** to documentation

---

## Phase 5: Search Enhancement (Medium Priority)

### Why:

Current search only indexes basic fields, preventing complex queries like "70B models with vision support".

### Changes:

1. **Extend search index** with structured fields:
    - `parameter_count`
    - `context_window`
    - `min_gpu_memory`
    - `capabilities`
    - `quantizations`
    - `production_ready`
    - `commercial_use`
2. **Create `/api/registry/search`** endpoint
3. **Add faceted search UI** with filter controls
4. **Implement sorting** by parameter count, size, date

---

## Phase 6: Maintainability (Low Priority)

### Why:

Remove technical debt and ensure clean, consistent code.

### Changes:

1. **Remove legacy fields** (`link`, `hardware_requirements`, `download_location`, `license`)
2. **Consolidate reusable code**
3. **Add validation** for family entries
4. **Clean up inconsistent naming**

---

## Phase 7: Future-Proofing (Low Priority)

### Why:

Ensure architecture can scale to hundreds of families and thousands of variants.

### Changes:

1. **Add pagination support**
2. **Implement virtualization** for large lists
3. **Add variant relationship graph**
4. **Create registry admin interface** (optional)

---

## Implementation Order

| Phase | Priority | Duration | Key Deliverables |
| --- | --- | --- | --- |
| 1 | 🔴 Critical | 2-3 days | New data structure, migrated data, updated schema |
| 2 | 🟠 High | 1-2 days | New data loading functions |
| 3 | 🟠 High | 2-3 days | New routes, redirects, breadcrumbs |
| 4 | 🟡 Medium | 2-3 days | New UI components, comparison table |
| 5 | 🟡 Medium | 1-2 days | Enhanced search, API endpoint |
| 6 | 🟢 Low | 1 day | Remove legacy code, cleanup |
| 7 | 🟢 Low | 1-2 days | Pagination, future extensibility |

---

## Backward Compatibility

- Old URLs (`/registry/llm`) will redirect to new structure
- Existing `getRegistryByTask()` will be preserved but use new data source
- Search index will be rebuilt to include new fields
- No breaking changes to existing model documentation

---

## Questions Before Implementation

1. **For the Llama 3.x family**, should I create variants for all mentioned sizes (1B, 3B, 8B, 70B, 405B, 11B Vision, 90B Vision) or focus on the most commonly used ones?
2. **For the DeepSeek R1/V3 family**, should I create individual variant files for each distill size (1.5B, 7B, 8B, 14B, 32B, 70B)?
3. **Should I preserve the existing `llama-3-3` entry** as a standalone variant, or integrate it into the new family structure?
4. **Do you have specific variant data** (size, parameters, hardware requirements) for the missing variants, or should I use placeholder values that can be filled in later?

Please let me know if you'd like to adjust any part of this plan, or if you can provide the missing variant data for the family entries.