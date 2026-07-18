# Repository Cleanup Report

**Generated:** July 17, 2026  
**Repository:** ai-engineering-handbook  
**Purpose:** Pre-freeze repository hygiene audit

---

## 1. Documentation Audit

### Files to Keep (Active Documentation)

| Path | Reason |
|------|--------|
| `docs/AGENTS.md` | AI agent configuration and loading order (Priority 1) |
| `docs/CLAUDE.md` | Claude-specific configuration |
| `docs/architecture/*.md` | All 6 architecture modules (active, canonical) |
| `docs/engineering/*.md` | All 3 engineering documents (active, canonical) |
| `docs/guides/*.md` | All 8 guide documents (active, canonical) |
| `docs/reference/*.md` | All 6 reference documents (active, canonical) |
| `docs/adr/*.md` | All 4 ADRs (active, canonical) |
| `docs/DEPENDENCY_GRAPH.md` | Documentation dependency graph (active, canonical) |
| `docs/Documents/AENS Knowledge Layer Specification.md` | Core specification document |

### Files Archived (Completed)

| Path | Action |
|------|--------|
| `docs/ARCHITECTURE_REDESIGN_REPORT.md` | Moved to `docs/archive/historical/` |
| `docs/archive/historical/VISUAL_REGRESSION_AUDIT.md` | Moved |
| `docs/archive/historical/GLOBAL_UX_CONSISTENCY_PLAN.md` | Moved |
| `docs/archive/historical/DESIGN_SYSTEM_MIGRATION_PLAN.md` | Moved |
| `docs/archive/historical/AENS_CONSISTENCY_FIX_PLAN.md` | Moved |
| `docs/archive/historical/AENS_MINIMAL_CONSISTENCY_PLAN.md` | Moved |
| `docs/archive/historical/AENS_SURGICAL_FIX_PLAN.md` | Moved |
| `docs/archive/historical/AENS_GLOBAL_UX_CONSISTENCY_PLAN.md` | Moved |
| `docs/archive/historical/model-worth-knowing-card-report.md` | Moved |
| `docs/archive/historical/problem-index-implementation-summary.md` | Moved |
| `docs/archive/historical/problem-index-page-report.md` | Moved |
| `docs/archive/historical/ARCHITECTURE_FREEZE.md` | Moved |
| `docs/archive/historical/CURRENT_PROJECT_STATE_REPORT.md` | Moved |
| `docs/archive/historical/PHASE1_FREEZE_REPORT.md` | Moved |

### Files Moved to Reference

| Path | Action |
|------|--------|
| `docs/reference/CONTENT_QUALITY_STANDARD.md` | Moved |
| `docs/reference/RESOURCE_KNOWLEDGE_REQUIREMENTS_REPORT.md` | Moved |
| `docs/reference/Canonical Engineering Capability Taxonomy (CECT).md` | Moved |
| `docs/reference/REGISTRY_MODEL_BOUNDARY.md` | Moved |

### Files Deleted

| Path | Action |
|------|--------|
| `docs/Documents/Claude Fix/` | Deleted (20+ temporary files) |
| `docs/Documents/Content Architecture/` | Deleted |
| `docs/Documents/Registtry Audit/` | Deleted |

---

## 2. Script Audit

| Script | Status | Recommendation |
|--------|--------|----------------|
| `scripts/validate-content.ts` | Active, required for build | Keep |
| `scripts/build-nav-index.ts` | Active, required for build | Keep |
| `scripts/migrate-to-v2.ts` | One-time migration, already executed | Move to `scripts/archive/` |
| `scripts/sync-cross-refs.ts` | Reusable for content updates | Keep |
| `scripts/scan-double-escaped-newlines.ts` | One-time diagnostic | Delete |

---

## 3. Dead Folder Audit

| Path | Status | Recommendation |
|------|--------|----------------|
| `docs/Documents/Claude Fix/` | Temporary files | Delete |
| `docs/Documents/Content Architecture/` | Temporary files | Delete |
| `docs/Documents/Registtry Audit/` | Temporary files | Delete |
| `lib/validation/` | Empty directory | Remove |
| `lib/content/` | Empty directory | Remove |

---

## 4. Dependency Audit

All dependencies in `package.json` are in use. No unused dependencies identified.

| Dependency | Purpose |
|------------|---------|
| `ajv`, `ajv-formats` | Config validation |
| `class-variance-authority`, `clsx` | Styling utilities |
| `fuse.js` | Search |
| `katex` | Math rendering |
| `lucide-react` | Icons |
| `next` | Framework |
| `radix-ui` | UI primitives |
| `react`, `react-dom` | Core |
| `react-markdown` | Markdown rendering |
| `rehype-katex`, `remark-gfm`, `remark-math` | Markdown plugins |
| `shadcn` | Component library |
| `shiki` | Syntax highlighting |
| `tailwind-merge` | Styling |
| `tw-animate-css` | Animations |
| `zod` | Schema validation |

---

## 5. .gitignore Audit

Current entries are appropriate. Recommended additions:

| Entry | Reason |
|-------|--------|
| `data/validation-report.md` | Generated validation report |
| `*.log` | Log files |
| `Thumbs.db` | Windows thumbnail cache |

---

## 6. README Assessment

The current README is well-structured but could be improved:
- Missing: License section
- Missing: Contributing section
- Could be more concise for GitHub presentation
- Good: Project overview, features, tech stack, installation, structure

---

## 7. Repository Structure

The structure is clean and well-organized. No major reorganization needed.

---

## 8. Additional Audits

### Duplicate Assets
No duplicate assets found in `public/` directory.

### Duplicate Utility Functions
No obvious duplicate utility functions identified.

### Duplicate Components
No obvious duplicate components identified.

### Barrel Exports
All barrel exports (`index.ts` files) appear to be in use.

### package.json Scripts
All scripts in package.json are in use.

### tsconfig
No unused aliases identified.

### next.config
No dead configuration identified.

### globals.css
No dead CSS identified.