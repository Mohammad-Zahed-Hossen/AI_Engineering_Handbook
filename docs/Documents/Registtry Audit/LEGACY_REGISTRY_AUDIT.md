# Legacy Registry Architecture Audit

**Date**: 2026-07-16  
**Purpose**: Document all legacy Registry dependencies for safe removal  
**Status**: Audit Complete

---

## Executive Summary

The codebase currently contains **two parallel Registry architectures**:

1. **Legacy Task-Based Architecture** (to be removed)
   - Monolithic JSON files per task (e.g., `llms.json`)
   - `RegistryModelSchema` with task/category fields
   - Routes: `/registry/[task]`
   - Components: `RegistryCard`, `RegistryClientView`

2. **Canonical Family→Variant Architecture** (to be kept)
   - Individual files per family/variant in `data/registry/families/`
   - `RegistryFamilySchema` and `RegistryVariantSchema`
   - Routes: `/registry/families/[family]` and `/registry/families/[family]/[variant]`
   - Components: `FamilyCard`, `VariantCard`, `VariantComparisonTable`

---

## Legacy Data Files

### Files to Remove
- `data/registry/llms.json` (33KB, 3 entries)
  - Contains: llama-3-3, llama-3-x-family, deepseek-r1-v3-family
  - Uses legacy `RegistryModelSchema`

### Files to Keep
- `data/registry/_families.json` (502 bytes) - Family index (part of new architecture)
- `data/registry/families/llama-3/_index.json` - Family metadata
- `data/registry/families/llama-3/3-3-70b.json` - Variant data
- `data/registry/families/deepseek/_index.json` - Family metadata
- `data/registry/families/deepseek/r1-70b.json` - Variant data

---

## Legacy Schema Definitions

### Schemas to Remove (lib/schemas/registry.ts)

1. **RegistryTaskSchema** (lines 3-11)
   ```typescript
   export const RegistryTaskSchema = z.enum([
     'embedding', 'reranker', 'vision', 'speech', 'llm', 'multimodal', 'ocr',
   ]);
   ```

2. **RegistryCategorySchema** (lines 14-22)
   ```typescript
   export const RegistryCategorySchema = z.enum([
     'models', 'datasets', 'benchmarks', 'services', 'leaderboards', 'mcp_servers', 'repos',
   ]);
   ```

3. **RegistryModelSchema** (lines 333-422)
   - Contains legacy fields: `link`, `hardware_requirements`, `download_location`, `license`
   - Contains task-based fields: `task`, `category`
   - 350+ lines with 20+ nested objects

### Schemas to Keep
- `RegistryFamilySchema` (lines 267-295)
- `RegistryVariantSchema` (lines 300-328)
- All supporting schemas (Identity, Architecture, Specifications, etc.)

---

## Legacy Data Loading Functions (lib/data.ts)

### Functions to Remove
- `getRegistryTasks()` (lines 175-185) - Gets task list from directory scan
- `getRegistryByTask()` (lines 193-199) - Loads models from task-based JSON files

### Functions to Keep
- `getAllRegistryFamilyIds()` (lines 208-218)
- `getRegistryFamily()` (lines 226-233)
- `getAllRegistryFamilies()` (lines 240-242)
- `getRegistryVariantIds()` (lines 250-258)
- `getRegistryVariant()` (lines 267-274)
- `getRegistryVariantsByFamily()` (lines 282-284)

### Functions to Update
- `contentExists()` (lines 676-708) - Contains legacy registry check logic (lines 701-707)
- `loadContentMeta()` (lines 713-767) - Contains legacy registry metadata logic (lines 753-759)
- `getContentPath()` (lines 781-801) - Contains legacy registry path logic (lines 794-799)

---

## Legacy Configuration

### Files to Remove
- `lib/config/registry.ts` (21 lines)
  - Contains: `REGISTRY_TASK_FILES`, `REGISTRY_FILE_TO_TASK`
  - Maps tasks to JSON filenames

---

## Legacy Routes

### Routes to Remove
- `app/registry/[task]/page.tsx` (61 lines)
  - Uses: `getRegistryTasks()`, `getRegistryByTask()`, `validateRegistryTask()`
  - Renders: `RegistryClientView`

### Routes to Update
- `app/registry/page.tsx` (158 lines)
  - Currently shows both old and new architectures
  - Lines 76-106: Legacy task links section (to remove)
  - Lines 111-156: Fallback to old task-based view (to remove)

### Routes to Keep
- `app/registry/families/[family]/page.tsx` - Family overview
- `app/registry/families/[family]/[variant]/page.tsx` - Variant detail

---

## Legacy Components

### Components to Remove
- `components/registry/RegistryCard.tsx` (402 lines)
  - Uses: `RegistryModel` type
  - Renders full model card with all legacy fields

- `components/registry/RegistryClientView.tsx` (143 lines)
  - Uses: `RegistryModel` type
  - Renders: `RegistryCard` grid with filters
  - Uses: `RegistryDashboardHeader`, `RegistryFilterChips`

- `components/registry/RegistryDashboardHeader.tsx` - Uses `RegistryModel`
- `components/registry/RegistryFilterChips.tsx` - Used by `RegistryClientView`

### Components to Keep
- `components/registry/FamilyCard.tsx` - New family component
- `components/registry/VariantCard.tsx` - New variant component
- `components/registry/VariantComparisonTable.tsx` - New comparison table
- `components/registry/RegistryFamilyView.tsx` - New family view
- `components/registry/RegistryBadge.tsx` - Shared badges (used by both)
- `components/registry/PaginationControls.tsx` - Shared pagination
- `components/registry/RegistryFilter.tsx` - May be reusable

---

## Legacy Route Validation

### Functions to Remove
- `lib/route-params.ts` - `validateRegistryTask()` (lines 28-31)
  - Validates task parameter against `RegistryTaskSchema`

---

## Legacy Search Indexing

### Code to Remove (lib/search.ts)
- Lines 202-215: Legacy registry task indexing
  ```typescript
  // Legacy registry task indexing (for backward compatibility)
  getRegistryTasks().forEach(task => {
    getRegistryByTask(task).forEach(entry => {
      results.push({
        type: 'registry',
        id: entry.id,
        name: entry.id,
        summary: `${task} model`,
        href: `/registry/${task}`,
        updated_at: '',
        category: task,
      });
    });
  });
  ```

### Code to Keep
- Lines 148-200: New family/variant indexing with enriched fields

---

## Legacy Validation

### Code to Update (scripts/validate-content.ts)
- Line 163: Legacy registry validation logic
  ```typescript
  else if (normalizedPath.startsWith('data/registry/')) schema = z.array(RegistryModelSchema);
  ```
  Should be updated to validate family/variant schemas instead.

---

## Legacy Type Exports

### Types to Remove (types/registry.ts)
- `RegistryTask` (line 30)
- `RegistryModel` (line 32)

### Types to Keep
- `RegistryFamily` (line 53)
- `RegistryVariant` (line 54)
- All supporting types (Identity, Architecture, Specifications, etc.)

---

## Legacy Navigation References

### Files to Update
- `app/page.tsx` - May reference registry tasks
- `components/layout/Sidebar.tsx` - May reference registry tasks
- `components/layout/MobileSidebarTrigger.tsx` - May reference registry tasks

---

## Documentation References

### Documents to Update
- `docs/engineering/validation.md` - References `RegistryModelSchema`
- `docs/guides/validation-workflow.md` - References `RegistryModelSchema`
- `docs/Documents/PHASE1_FREEZE_REPORT.md` - References `RegistryModelSchema`
- `docs/architecture/repository.md` - May reference legacy structure
- `docs/guides/adding-registry.md` - May reference legacy structure
- All prompt files in `docs/prompt/registry/` - Reference `RegistryModelSchema`

---

## Migration Checklist

### Phase 1: Data Migration ✅ (Already Complete)
- [x] Create `data/registry/families/` directory structure
- [x] Migrate llama-3 family to new structure
- [x] Migrate deepseek family to new structure

### Phase 2: Component Migration (Pending)
- [ ] Update `app/registry/page.tsx` to remove legacy sections
- [ ] Remove `app/registry/[task]/page.tsx`
- [ ] Remove legacy components (RegistryCard, RegistryClientView, etc.)
- [ ] Update navigation references

### Phase 3: Function Migration (Pending)
- [ ] Remove `getRegistryTasks()` and `getRegistryByTask()`
- [ ] Remove `lib/config/registry.ts`
- [ ] Update `contentExists()` to use family/variant logic
- [ ] Update `loadContentMeta()` to use family/variant logic
- [ ] Update `getContentPath()` to use family/variant logic
- [ ] Remove `validateRegistryTask()`

### Phase 4: Schema Migration (Pending)
- [ ] Remove `RegistryTaskSchema`
- [ ] Remove `RegistryCategorySchema`
- [ ] Remove `RegistryModelSchema`
- [ ] Remove `RegistryTask` and `RegistryModel` types

### Phase 5: Search Migration (Pending)
- [ ] Remove legacy registry indexing from `lib/search.ts`
- [ ] Verify new family/variant indexing works correctly

### Phase 6: Validation Migration (Pending)
- [ ] Update `scripts/validate-content.ts` to validate family/variant schemas
- [ ] Remove legacy registry validation logic

### Phase 7: Documentation Migration (Pending)
- [ ] Update all documentation to reference new architecture
- [ ] Remove references to legacy schemas
- [ ] Update validation guides

### Phase 8: Verification (Pending)
- [ ] Build project successfully
- [ ] Verify no broken imports
- [ ] Verify search works
- [ ] Verify navigation works
- [ ] Verify registry pages work
- [ ] Verify validation works

---

## Risk Assessment

### High Risk Items
1. **Search indexing** - Legacy entries may still be indexed
2. **Navigation** - Old routes may be bookmarked
3. **Validation** - Scripts may fail if legacy files still exist

### Medium Risk Items
1. **Type exports** - May be used in unexpected places
2. **Documentation** - May reference legacy structure
3. **Component removal** - May have hidden dependencies

### Low Risk Items
1. **Data files** - Already migrated to new structure
2. **Configuration** - Only used by legacy functions
3. **Route validation** - Only used by legacy route

---

## Rollback Plan

If migration fails:
1. Restore `data/registry/llms.json` from git
2. Restore removed functions from git
3. Restore removed components from git
4. Revert schema changes
5. Revert route changes

---

## Next Steps

1. Review this audit with stakeholders
2. Begin Phase 2: Component Migration
3. Proceed through phases sequentially
4. Verify after each phase
5. Generate final report
