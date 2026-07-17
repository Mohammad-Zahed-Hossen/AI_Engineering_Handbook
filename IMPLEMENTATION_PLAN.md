# Implementation Plan

**Generated:** July 17, 2026  
**Repository:** ai-engineering-handbook  
**Purpose:** File-by-file cleanup plan for pre-freeze preparation

---

## 1. Documentation Reorganization (COMPLETED)

### Archived to `docs/archive/historical/`

| File | Status |
|------|--------|
| `docs/ARCHITECTURE_REDESIGN_REPORT.md` | ✅ Moved |
| `docs/archive/historical/VISUAL_REGRESSION_AUDIT.md` | ✅ Moved |
| `docs/archive/historical/GLOBAL_UX_CONSISTENCY_PLAN.md` | ✅ Moved |
| `docs/archive/historical/DESIGN_SYSTEM_MIGRATION_PLAN.md` | ✅ Moved |
| `docs/archive/historical/AENS_CONSISTENCY_FIX_PLAN.md` | ✅ Moved |
| `docs/archive/historical/AENS_MINIMAL_CONSISTENCY_PLAN.md` | ✅ Moved |
| `docs/archive/historical/AENS_SURGICAL_FIX_PLAN.md` | ✅ Moved |
| `docs/archive/historical/AENS_GLOBAL_UX_CONSISTENCY_PLAN.md` | ✅ Moved |
| `docs/archive/historical/model-worth-knowing-card-report.md` | ✅ Moved |
| `docs/archive/historical/problem-index-implementation-summary.md` | ✅ Moved |
| `docs/archive/historical/problem-index-page-report.md` | ✅ Moved |
| `docs/archive/historical/ARCHITECTURE_FREEZE.md` | ✅ Moved |
| `docs/archive/historical/CURRENT_PROJECT_STATE_REPORT.md` | ✅ Moved |
| `docs/archive/historical/PHASE1_FREEZE_REPORT.md` | ✅ Moved |

### Moved to `docs/reference/`

| File | Status |
|------|--------|
| `docs/reference/CONTENT_QUALITY_STANDARD.md` | ✅ Moved |
| `docs/reference/RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md` | ✅ Moved |
| `docs/reference/Canonical Engineering Capability Taxonomy (CECT).md` | ✅ Moved |
| `docs/reference/REGISTRY_MODEL_BOUNDARY.md` | ✅ Moved |

### Kept in Place

| File | Reason |
|------|--------|
| `docs/Documents/AENS Knowledge Layer Specification.md` | Core specification document |

### Deleted

| Path | Status |
|------|--------|
| `docs/Documents/Claude Fix/` | ✅ Deleted (20+ temporary files) |
| `docs/Documents/Content Architecture/` | ✅ Deleted |
| `docs/Documents/Registtry Audit/` | ✅ Deleted |

---

## 2. Script Reorganization (COMPLETED)

### Kept

| Script | Reason |
|--------|--------|
| `scripts/validate-content.ts` | Required for build |
| `scripts/build-nav-index.ts` | Required for build |
| `scripts/sync-cross-refs.ts` | Reusable for content updates |

### Archived

| Script | Status |
|--------|--------|
| `scripts/archive/migrate-to-v2.ts` | ✅ Moved |

### Deleted

| Script | Status |
|--------|--------|
| `scripts/scan-double-escaped-newlines.ts` | ✅ Deleted |

---

## 3. Directory Cleanup (COMPLETED)

| Directory | Status |
|-----------|--------|
| `lib/validation/` | ✅ Did not exist (already clean) |
| `lib/content/` | ✅ Did not exist (already clean) |

---

## 4. .gitignore Updates (COMPLETED)

Added entries:
```gitignore
# Generated validation report
data/validation-report.md

# Log files
*.log

# Windows thumbnail cache
Thumbs.db
```

---

## 5. README Rewrite (COMPLETED)

The README has been rewritten with:
- Project Overview
- Features
- Architecture Overview
- Installation
- Repository Structure
- Development Workflow
- Content Standards
- Contributing
- License

---

## 6. Git Tag Created

Created tag `pre-freeze-cleanup` for rollback point.

---

## 7. Non-Breaking Changes

All changes in this plan are **non-breaking**:
- No code changes
- No schema changes
- No routing changes
- No data changes
- Only file reorganization and cleanup