# AENS Registry Architecture Audit Report

**Date**: 2026-07-15  
**Version**: 1.0  
**Status**: Draft - Audit Complete  
**Auditor**: System Architecture Review  

---

## 1. Executive Summary

The AENS Registry system exhibits significant architectural challenges that will impede long-term scalability and maintainability. The current design conflates **model families** with **individual model variants**, stores all registry data in a single monolithic JSON file, and lacks proper data normalization. These issues create a cascade of problems including:

- **Data duplication** between registry entries and model documentation
- **Inability to scale** beyond a few dozen models
- **Poor searchability** due to flattened data structure
- **Maintenance overhead** from mixed concerns in single files
- **UI/UX confusion** from inconsistent information hierarchy

**Critical Finding**: The registry currently stores 3 entries in `llms.json`, but 2 of these (`llama-3-x-family` and `deepseek-r1-v3-family`) represent entire model families rather than individual models, creating a fundamental data modeling problem.

---

## 2. Current Architecture Analysis

### 2.1 Data Storage Architecture

```
data/
├── registry/
│   └── llms.json          # Single file for ALL LLM registry entries
├── models/
│   └── llm/
│       ├── llama.json     # Model documentation (different structure)
│       ├── deepseek.json
│       └── ...            # Individual model files
```

**Key Characteristics:**
- Registry data is stored in task-based JSON files (`llms.json`, `embeddings.json`, etc.)
- Each task file contains an **array of registry entries**
- No individual file per model - all models in a task share one file
- Model families are stored as single entries with variant information in `identity.checkpoint`

### 2.2 JSON Schema Design

The `RegistryModelSchema` (in `lib/schemas/registry.ts`) defines a comprehensive structure:

**Strengths:**
- Well-organized nested objects (identity, architecture, specifications, etc.)
- Support for multiple download sources
- Rich ecosystem compatibility tracking
- Engineering notes and snapshots for decision support
- Timeline and related models for relationship mapping

**Weaknesses:**
- 350+ line schema with 20+ nested objects
- No explicit family/variant hierarchy
- Legacy fields (`link`, `hardware_requirements`, `license`) preserved alongside structured fields
- `size_mb` is required but often `0` for family entries

### 2.3 UI/UX Information Hierarchy

**Current Page Structure:**
```
/registry/
├── page.tsx              # Lists all task categories
└── [task]/
    └── page.tsx          # Shows all models for a task
```

**RegistryCard Component Structure:**
- Header: Name, provider, status badges
- Hardware summary (min/recommended GPU)
- Architecture type badge
- Capability badges (instruction, reasoning, vision, etc.)
- Technical specs grid (size, license, params, runtime)
- Engineering snapshot (best for, avoid for)
- Technical specifications (context, tokenizer, attention)
- Deployment info (runtime, quantizations)
- Hardware requirements
- Ecosystem support
- References
- Related models
- Download buttons

**Issues:**
- All information displayed in a single card view
- No drill-down to individual model variants
- Family-level entries show generic information that may not apply to all variants

### 2.4 Search and Filtering

**Current Implementation:**
- Search index includes registry entries (lines 145-157 in `lib/search.ts`)
- Only basic fields indexed: `id`, `name`, `summary`, `category`
- No indexing of structured fields (architecture, capabilities, hardware)
- Filtering in `RegistryClientView.tsx` is client-side only
- Filters: Instruction, Reasoning, Vision, Multilingual, Tool Calling, Commercial, Open Weight, Production, Local, Cloud, Embedding

---

## 3. Problems Identified (Prioritized by Severity)

### 🔴 CRITICAL: Data Modeling Issues

| # | Problem | Severity | Impact |
|---|---------|----------|--------|
| 1 | **Model families stored as single entries** - `llama-3-x-family` contains 1B, 3B, 8B, 70B, 405B, 11B Vision, 90B Vision variants in one entry | Critical | Users cannot find specific variants; hardware requirements are meaningless; search returns family instead of specific model |
| 2 | **No canonical source of truth** - Registry entries duplicate information from `data/models/llm/*.json` files | Critical | Data inconsistency; maintenance burden; conflicting information |
| 3 | **Mixed granularity in same file** - `llms.json` contains both specific models (Llama 3.3) and families (Llama 3.x Family) | Critical | Inconsistent user experience; unclear data model semantics |

### 🟠 HIGH: Scalability Issues

| # | Problem | Severity | Impact |
|---|---------|----------|--------|
| 4 | **Monolithic JSON files** - All LLM registry entries in single `llms.json` file | High | File becomes unwieldy; no parallel editing; merge conflicts; O(n) load time for all models |
| 5 | **No family/variant hierarchy** - Schema doesn't distinguish between family and variant | High | Cannot represent model lineage; no way to group related variants |
| 6 | **Missing individual model pages** - No `/registry/llm/llama-3-70b` route exists | High | Users cannot bookmark or share specific model pages |
| 7 | **No pagination or virtualization** - All models loaded at once | High | Performance degradation with 100+ models |

### 🟡 MEDIUM: Searchability and Filtering

| # | Problem | Severity | Impact |
|---|---------|----------|--------|
| 8 | **Shallow search indexing** - Only basic fields indexed, not structured data | Medium | Users cannot search by parameter count, context window, or specific capabilities |
| 9 | **No faceted search** - Cannot filter by multiple dimensions simultaneously | Medium | Complex queries (e.g., "70B models with vision support") not possible |
| 10 | **No sorting options** - Cannot sort by parameter count, date, or other criteria | Medium | Users cannot find largest/smallest models or newest releases |

### 🟡 MEDIUM: UI/UX Issues

| # | Problem | Severity | Impact |
|---|---------|----------|--------|
| 11 | **Overloaded card design** - Single card shows too much information | Medium | Cognitive overload; difficult to scan; mobile unfriendly |
| 12 | **No family grouping UI** - Related variants appear as separate cards | Medium | Users cannot understand model relationships; visual clutter |
| 13 | **Inconsistent data display** - Family entries show generic/empty values | Medium | Confusing user experience; misleading information |

### 🟢 LOW: Future Maintainability

| # | Problem | Severity | Impact |
|---|---------|----------|--------|
| 14 | **Legacy field duplication** - Both `link` and `downloads` arrays exist | Low | Code complexity; potential for inconsistent data |
| 15 | **No validation for family entries** - `size_mb: 0` is valid but meaningless | Low | Data quality issues; unclear semantics |
| 16 | **Hardcoded task labels** - In both `page.tsx` and `[task]/page.tsx` | Low | Maintenance burden; potential for inconsistency |

---

## 4. Root Cause Analysis

### 4.1 Why Model Families Are Stored as Single Entries

**Root Cause:** The registry was designed as a **deployment metadata catalog** rather than a **model registry**. The original intent was to provide quick access to download locations and hardware requirements, but:

1. **Conceptual confusion** between "model family" and "individual model variant"
2. **Lack of clear data modeling guidelines** during initial implementation
3. **No distinction between family-level and variant-level metadata**

**Evidence:**
- `llama-3-x-family` has `size_mb: 0` (line 290)
- `identity.checkpoint` contains comma-separated list: "1B, 3B, 8B, 70B, 405B, 11B Vision, 90B Vision" (line 298)
- Hardware requirements are generic: "Minimum GPU memory, minimum RAM, and disk space are not officially documented" (line 292)

### 4.2 Why All Models Are in One File

**Root Cause:** The registry follows the **task-based categorization** pattern used elsewhere in the system, but:

1. **Task-based organization** works for small datasets but doesn't scale
2. **No consideration for concurrent editing** by multiple contributors
3. **Missing the "one file per entity" pattern** used in `data/models/llm/`

**Evidence:**
- `data/models/llm/` has 10 individual JSON files (one per model family)
- `data/registry/llms.json` has 3 entries in a single array
- Other content types (packages, workflows, patterns) use individual files

### 4.3 Why Search Is Shallow

**Root Cause:** The search system was designed for **content discovery** rather than **registry filtering**, and:

1. **Registry entries are secondary** to main content types
2. **No dedicated search fields** for registry-specific queries
3. **Search index built once** without considering registry's unique needs

**Evidence:**
- Registry search only indexes: `id`, `name`, `summary`, `category` (lines 145-157)
- Model search indexes: `name`, `summary`, `problem_types`, `keywords` (lines 100-122)
- No indexing of `specifications.parameter_count`, `hardware.minimum_gpu_memory`, etc.

---

## 5. Recommended Production Architecture

### 5.1 Data Architecture Redesign

#### Option A: Individual File Per Model Variant (Recommended)

```
data/
├── registry/
│   ├── families/
│   │   ├── llama-3/
│   │   │   ├── _index.json          # Family metadata
│   │   │   ├── 3-1-8b.json          # Individual variant
│   │   │   ├── 3-1-70b.json
│   │   │   ├── 3-2-1b.json
│   │   │   ├── 3-2-3b.json
│   │   │   ├── 3-2-11b-vision.json
│   │   │   ├── 3-3-70b.json
│   │   │   └── index.ts             # TypeScript exports
│   │   └── deepseek/
│   │       ├── _index.json
│   │       ├── v3-12b.json
│   │       ├── v3-24b.json
│   │       ├── r1-70b.json
│   │       └── r1-distill-1.5b.json
│   └── _families.json               # List of all families
```

#### Option B: Hybrid Family/Variant Structure

```
data/
├── registry/
│   ├── families/
│   │   ├── llama-3.json             # Family-level metadata
│   │   └── deepseek.json
│   └── variants/
│       ├── llama-3-1-8b.json
│       ├── llama-3-1-70b.json
│       └── ...
```

### 5.2 Schema Design Improvements

#### New Schema Structure

```typescript
// Family-level schema
const RegistryFamilySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  provider: z.string(),
  variants: z.array(z.string()), // List of variant IDs
  // Family-level metadata (shared across variants)
  architecture: ArchitectureSchema.optional(),
  capabilities: CapabilitiesSchema.optional(),
  ecosystem: EcosystemSchema.optional(),
  references: z.array(ReferenceSchema).default([]),
  timeline: z.array(TimelineEntrySchema).default([]),
});

// Variant-level schema
const RegistryVariantSchema = z.object({
  id: z.string(),
  family_id: z.string(),
  name: z.string(),
  description: z.string(),
  // Variant-specific metadata
  size_mb: z.number(),
  specifications: SpecificationsSchema.optional(),
  hardware: HardwareSchema.optional(),
  deployment: DeploymentSchema.optional(),
  downloads: z.array(DownloadSchema).default([]),
  // Inherit from family
  architecture: ArchitectureSchema.optional(),
  capabilities: CapabilitiesSchema.optional(),
  license_info: LicenseSchema.optional(),
  status: StatusSchema.optional(),
  engineering_snapshot: EngineeringSnapshotSchema.optional(),
});
```

### 5.3 Routing and Navigation

#### New Route Structure

```
/registry/
├── page.tsx                    # Registry home (list families)
├── families/
│   └── [family]/
│       ├── page.tsx            # Family overview (list variants)
│       └── [variant]/
│           └── page.tsx        # Individual variant page
└── search/
    └── page.tsx                # Advanced search page
```

#### URL Examples

- `/registry` - Registry home
- `/registry/families/llama-3` - Llama 3 family page
- `/registry/families/llama-3/3-3-70b` - Specific variant page
- `/registry/search?q=70b&capability=vision` - Search with filters

### 5.4 Search and Filtering Architecture

#### Enhanced Search Index

```typescript
// Extended search result type for registry
const RegistrySearchResult = z.object({
  type: z.literal('registry_variant'),
  id: z.string(),
  name: z.string(),
  family: z.string(),
  summary: z.string(),
  href: z.string(),
  // Structured fields for faceted search
  parameter_count: z.number().optional(),
  context_window: z.number().optional(),
  min_gpu_memory: z.number().optional(),
  capabilities: z.array(z.string()).optional(),
  quantizations: z.array(z.string()).optional(),
  production_ready: z.boolean().optional(),
  commercial_use: z.boolean().optional(),
  // For family-level results
  is_family: z.boolean().default(false),
  variant_count: z.number().optional(),
});
```

#### Faceted Search API

```
GET /api/registry/search
  ?q=llama
  &min_params=70000
  &max_params=100000
  &capability=reasoning
  &capability=tool_calling
  &commercial=true
  &sort=parameter_count
  &order=desc
```

### 5.5 UI/UX Improvements

#### Family Overview Page

- **Family header**: Name, provider, description
- **Variant comparison table**: Parameter count, context, vision support, size
- **Shared attributes**: Architecture, ecosystem support, references
- **Quick links**: Download all variants, view documentation

#### Variant Detail Page

- **Variant header**: Name, size, parameter count
- **Hardware requirements**: Clear min/recommended specs
- **Deployment options**: Runtimes, quantizations, download links
- **Engineering notes**: Variant-specific guidance
- **Related variants**: Other models in same family

#### Registry Home Page

- **Family grid**: Cards showing family name, variant count, provider
- **Statistics**: Total families, total variants, production-ready count
- **Quick filters**: By provider, capability, commercial status

---

## 6. Migration Strategy

### 6.1 Phase 1: Data Model Refactoring (Must)

**Duration**: 2-3 days

1. **Create new directory structure** under `data/registry/families/`
2. **Split family entries** into individual variant files
3. **Create family index files** with shared metadata
4. **Update schema** to support family/variant distinction
5. **Migrate existing data** from `llms.json`

**Example Migration:**

```
// FROM: llms.json (single entry)
{
  "id": "llama-3-x-family",
  "identity": {
    "family": "Llama",
    "variant": "3.x",
    "checkpoint": "1B, 3B, 8B, 70B, 405B, 11B Vision, 90B Vision"
  }
}

// TO: families/llama-3/_index.json
{
  "id": "llama-3",
  "name": "Llama 3",
  "provider": "Meta",
  "variants": ["3-1-8b", "3-1-70b", "3-2-1b", "3-2-3b", "3-2-11b-vision", "3-3-70b"]
}

// TO: families/llama-3/3-3-70b.json
{
  "id": "3-3-70b",
  "family_id": "llama-3",
  "name": "Llama 3.3 70B",
  "size_mb": 140000,
  "specifications": {
    "parameter_count": 70000,
    "context_window": 128000
  }
}
```

### 6.2 Phase 2: Routing and API (Must)

**Duration**: 2-3 days

1. **Create new route structure** for families and variants
2. **Implement `generateStaticParams`** for all variants
3. **Create API endpoints** for search and filtering
4. **Update navigation** to include registry families

### 6.3 Phase 3: UI Components (Should)

**Duration**: 2-3 days

1. **Create FamilyCard component** for registry home
2. **Create VariantCard component** for family pages
3. **Create VariantDetail component** for individual pages
4. **Implement faceted search UI**
5. **Add comparison table component**

### 6.4 Phase 4: Search Enhancement (Should)

**Duration**: 1-2 days

1. **Extend search index** with structured fields
2. **Add faceted search support**
3. **Implement search API endpoint**
4. **Update search UI** to use new fields

### 6.5 Phase 5: Data Synchronization (Nice-to-have)

**Duration**: 1-2 days

1. **Create sync script** to ensure registry and model data consistency
2. **Add validation** to prevent drift
3. **Document canonical sources** for each field

---

## 7. Risks and Trade-offs

### 7.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Data loss during migration** | Low | High | Backup all files; use Git for version control; validate after migration |
| **Broken links** | Medium | Medium | Update all references; add redirects for old URLs |
| **Performance regression** | Low | Medium | Implement pagination; use React cache; lazy load data |
| **Search index bloat** | Low | Low | Monitor index size; implement field limits |

### 7.2 Trade-offs

| Trade-off | Pro | Con | Recommendation |
|-----------|-----|-----|----------------|
| **Individual files vs. single file** | Better scalability, parallel editing, clear ownership | More files to manage, potential for inconsistency | Choose individual files - scalability is critical |
| **Family pages vs. flat list** | Better organization, easier to understand relationships | Additional click to reach variant | Implement family pages - improves UX significantly |
| **Server-side search vs. client-side** | Better performance, more features | More complex, requires API | Implement server-side search - necessary for scale |
| **New schema vs. extend existing** | Clean design, no legacy baggage | Migration effort, breaking changes | Create new schema - cleaner long-term |

### 7.3 Compatibility Considerations

- **Old URLs** (`/registry/llm`) should redirect to new structure
- **Existing code** using `getRegistryByTask` needs updates
- **Search index** will need to be rebuilt
- **External references** to registry entries may break

---

## 8. Prioritized Action Plan

### Must (Critical for Production)

- [ ] **Split `llms.json` into individual variant files**
  - Create `data/registry/families/` directory structure
  - Extract each variant as separate JSON file
  - Create family index files with shared metadata

- [ ] **Update RegistryModelSchema**
  - Add `family_id` field to variants
  - Add `is_family` flag to distinguish entry types
  - Remove or deprecate legacy fields

- [ ] **Implement new routing structure**
  - Create `/registry/families/[family]/page.tsx`
  - Create `/registry/families/[family]/[variant]/page.tsx`
  - Add redirects from old `/registry/llm` routes

- [ ] **Update data loading functions**
  - Create `getRegistryFamilies()` function
  - Create `getRegistryFamily(familyId)` function
  - Create `getRegistryVariant(familyId, variantId)` function

### Should (Important for Scale)

- [ ] **Implement faceted search**
  - Extend search index with structured fields
  - Create `/api/registry/search` endpoint
  - Add search UI with filter controls

- [ ] **Create family/variant UI components**
  - FamilyCard for registry home
  - VariantCard for family pages
  - VariantDetail for individual pages

- [ ] **Add comparison functionality**
  - Variant comparison table
  - Side-by-side view
  - Export comparison feature

- [ ] **Implement sorting and pagination**
  - Sort by parameter count, size, date
  - Paginate large result sets
  - Add "load more" for infinite scroll

### Nice-to-have (Future Enhancements)

- [ ] **Add variant relationship graph**
  - Visual family tree
  - Variant lineage tracking
  - Dependency visualization

- [ ] **Implement registry analytics**
  - Track popular models
  - Monitor search patterns
  - A/B test UI variations

- [ ] **Add registry API**
  - Public API for external tools
  - JSON export functionality
  - Integration with model serving platforms

- [ ] **Create registry admin interface**
  - Web UI for adding variants
  - Bulk import/export
  - Validation and preview

---

## 9. Conclusion

The AENS Registry system requires significant architectural changes to support production-scale usage. The current design, while functional for a small number of models, will become unwieldy and confusing as the catalog grows to 100+ model families.

**Key Recommendations:**

1. **Immediate action required**: Split monolithic `llms.json` into individual variant files
2. **Data model clarity**: Distinguish between family-level and variant-level entries
3. **Search enhancement**: Implement faceted search with structured field indexing
4. **UI improvement**: Create dedicated family and variant pages with clear navigation

The proposed changes will:
- Enable scaling to 100+ model families
- Provide clear data ownership and canonical sources
- Improve searchability and discoverability
- Reduce maintenance burden through better organization
- Enhance user experience with appropriate information hierarchy

**Next Steps:**
1. Review this audit with stakeholders
2. Prioritize Must items for immediate implementation
3. Create detailed technical specifications for each phase
4. Begin Phase 1 implementation with data model refactoring

---

## Appendix A: Current State Metrics

| Metric | Value |
|--------|-------|
| Registry files | 1 (`llms.json`) |
| Total registry entries | 3 |
| Family-level entries | 2 |
| Variant-level entries | 1 |
| Schema fields | 20+ nested objects |
| Search indexed fields | 4 (id, name, summary, category) |
| Route levels | 2 (`/registry`, `/registry/[task]`) |

## Appendix B: Proposed State Metrics

| Metric | Value |
|--------|-------|
| Registry files | 10+ (per family/variant) |
| Total registry entries | 10+ (scalable) |
| Family-level entries | 1 per family |
| Variant-level entries | 1 per variant |
| Schema fields | 2 schemas (family + variant) |
| Search indexed fields | 15+ (including structured) |
| Route levels | 3 (`/registry`, `/registry/families/[family]`, `/registry/families/[family]/[variant]`) |

## Appendix C: File References

| File | Purpose | Lines |
|------|---------|-------|
| `lib/schemas/registry.ts` | Registry schema definition | 356 |
| `data/registry/llms.json` | LLM registry data | 952 |
| `types/registry.ts` | Registry type exports | 50 |
| `lib/data.ts` | Data loading functions | 1035 |
| `lib/config/registry.ts` | Task-to-file mapping | 20 |
| `app/registry/page.tsx` | Registry home page | 72 |
| `app/registry/[task]/page.tsx` | Task listing page | 61 |
| `components/registry/RegistryCard.tsx` | Registry card component | 398 |
| `components/registry/RegistryClientView.tsx` | Client view with filters | 143 |
| `lib/search.ts` | Search index builder | 312 |
| `lib/search-types.ts` | Search result types | 58 |