# Global UX Consistency Plan for AENS

**Document Version:** 1.0  
**Date:** July 2026  
**Status:** Design Document - Ready for Review

---

## Executive Summary

This document outlines a comprehensive plan to achieve visual consistency across the AI Engineering Navigation System (AENS) - a professional engineering knowledge platform. The goal is to ensure every page feels like it belongs to the same cohesive application without any architectural changes.

---

## Part 1: Global UX Audit

### 1.1 Typography Inconsistencies

| Location | Issue | Current State |
|----------|-------|---------------|
| `app/page.tsx` (Home) | Page title | `text-2xl font-bold tracking-tight` |
| `app/problem-index/page.tsx` | Page title | `text-2xl font-bold tracking-tight` |
| `app/models/page.tsx` | Page title | `text-2xl font-bold tracking-tight` |
| `app/packages/page.tsx` | Page title | `text-2xl font-semibold` (missing `tracking-tight`) |
| `app/workflows/page.tsx` | Page title | `text-2xl font-semibold` (missing `tracking-tight`) |
| `app/patterns/page.tsx` | Page title | `text-2xl font-semibold` (missing `tracking-tight`) |
| `app/cheatsheets/page.tsx` | Page title | `text-2xl font-semibold` (missing `tracking-tight`) |
| `app/decision-guides/page.tsx` | Page title | `text-2xl font-semibold` (missing `tracking-tight`) |
| `app/debug-guides/page.tsx` | Page title | `text-2xl font-semibold` (missing `tracking-tight`) |
| `app/principles/page.tsx` | Page title | `text-2xl font-semibold` (missing `tracking-tight`) |
| `app/registry/page.tsx` | Page title | `text-2xl font-bold tracking-tight` |

**Section title inconsistencies:**
- Some pages use `text-lg font-semibold` for section headers
- Some pages use `text-base font-bold` for section headers
- Some pages use `text-sm font-semibold` for section headers
- Inconsistent use of `uppercase` vs `capitalize` for labels

### 1.2 Spacing Inconsistencies

| Component | Issue | Current State |
|-----------|-------|---------------|
| Page containers | Container max-width | `max-w-5xl` in layout.tsx, but some pages use different widths |
| Section spacing | Vertical rhythm | Mix of `space-y-4`, `space-y-6`, `space-y-8` |
| Card padding | Internal spacing | `p-3`, `p-4`, `p-5` used inconsistently |
| Header spacing | Bottom padding | Some use `pb-4`, others `pb-3` |

### 1.3 Card Inconsistencies

| Component | Issue | Current State |
|-----------|-------|---------------|
| Index list cards | Border radius | `rounded-lg` in most places, `rounded-xl` in some |
| Index list cards | Shadow | Some have `hover:shadow-sm`, others don't |
| Index list cards | Padding | Mix of `p-3`, `p-4` |
| SectionCard | Border radius | `rounded-lg` |
| CollapsibleSection | Border radius | `rounded-lg` |
| CollapsibleRow | Border radius | `rounded-lg` |

### 1.4 Code Block Inconsistencies (CRITICAL)

| Component | Issue | Current State |
|-----------|-------|---------------|
| `CodeBlockInteractive` | Background | `bg-zinc-950` (dark only) |
| `Prose` (pre element) | Background | `bg-zinc-950` (dark only, no light theme) |
| `ProseClient` (pre element) | Background | `bg-zinc-950` (dark only, no light theme) |
| `DebugGuidePage` (error messages) | Background | `bg-muted/50` (inconsistent with other code blocks) |
| `DebugGuidePage` (commands) | Background | `bg-muted/50` (inconsistent) |
| `PackageTaskList` (syntax/example) | Background | `bg-muted/5` (inconsistent) |
| `WorkflowStepList` (code) | Background | Uses `CodeBlockInteractive` (consistent) |
| Inline code | Styling | Uses CSS rule in `globals.css` (consistent) |

**Font size inconsistencies:**
- `CodeBlockInteractive`: `text-[11px]`
- `Prose` pre: `text-xs`
- `ProseClient` pre: `text-xs`
- `DebugGuidePage` pre: `text-xs`

**Padding inconsistencies:**
- `CodeBlockInteractive`: `p-4` (no line numbers), `pl-2 pr-4 py-3` (with line numbers)
- `Prose` pre: `p-3`
- `ProseClient` pre: `p-3`
- `DebugGuidePage` pre: `p-2`

### 1.5 Search Bar Inconsistencies

| Component | Issue | Current State |
|-----------|-------|---------------|
| `SearchBox` (global) | Height | `py-2` (40px) |
| `PatternFilterClient` | Height | `py-2.5` (44px) |
| `ProblemIndexDashboard` | Height | `py-2.5` (44px) |
| Focus ring | Style | `focus:ring-2 focus:ring-ring/40` vs `focus:ring-2 focus:ring-primary` |

### 1.6 Filter Bar Inconsistencies

| Component | Issue | Current State |
|-----------|-------|---------------|
| `FilterBar` | Container style | `bg-card text-card-foreground border border-border rounded-lg p-3` |
| `PatternFilterClient` (filter container) | Style | `border border-border rounded-lg bg-card p-4` |
| `ProblemIndexDashboard` (filter buttons) | Style | Custom inline styles, different from `FilterBar` |

### 1.7 Badge Inconsistencies

| Component | Issue | Current State |
|-----------|-------|---------------|
| `Badge` (UI component) | Height | `h-5` (20px) |
| `MetadataBadges` | Height | `h-3.5` (14px) for ContentTypeBadge, `px-2 py-0.5` (16px) for others |
| `FilterBar` badges | Height | `px-2 py-0.5` (16px) |
| Inline metadata badges | Height | `px-1.5 py-0.5 text-[10px]` (14px) |
| Problem index badges | Height | `px-1.5 py-0.5 text-[9px]` (12px) |

### 1.8 Table Inconsistencies

| Component | Issue | Current State |
|-----------|-------|---------------|
| `Prose` tables | Padding | `p-3` |
| `DecisionGuidePage` comparison table | Padding | `px-4 py-3` |
| `globals.css` tables | Padding | `0.75rem 1rem` (12px) |

### 1.9 Empty State Inconsistencies

| Component | Issue | Current State |
|-----------|-------|---------------|
| `PatternFilterClient` | Style | `p-8 text-center text-sm text-muted-foreground bg-card border border-border rounded-lg` |
| `ProblemIndexDashboard` | Style | `p-8 text-center` with spinner |
| `RegistryPage` | Style | `p-4 text-center` (different padding) |

### 1.10 Loading State Inconsistencies

| Component | Issue | Current State |
|-----------|-------|---------------|
| `ProblemIndexPage` | Style | `p-8 text-center` with spinner |
| `PatternFilterClient` | No loading state | Uses inline empty message |

---

## Part 2: Canonical Design Standards

### 2.1 Typography Scale

```
Page Title:    text-2xl font-bold tracking-tight
Section Title: text-lg font-semibold
Card Title:    text-sm font-semibold
Body Text:     text-sm (or text-xs for dense content)
Caption:       text-xs
Label:         text-[10px] font-semibold uppercase tracking-wider
Metadata:      text-[10px] font-mono
Inline Code:   text-[0.85em] (via CSS)
```

### 2.2 Spacing Scale

```
Page Container:  max-w-5xl mx-auto
Section Spacing: space-y-6 (between major sections)
Card Padding:    p-4 (standard), p-3 (compact)
Header Spacing:  pb-4 (after header)
Grid Gap:        gap-3 (cards), gap-4 (sections)
```

### 2.3 Card Standard

```
Border Radius: rounded-lg
Border:        border border-border
Background:    bg-card
Shadow:        hover:shadow-sm (on hover)
Padding:       p-4 (standard), p-3 (compact)
Header:        px-4 py-3 border-b border-border bg-muted/20
```

### 2.4 Code Block Standard (CRITICAL)

```
Container:
  - Border radius: rounded-md
  - Border: border border-border
  - Background: bg-card (light), bg-zinc-950 (dark)
  - Margin: my-2
  - Font: font-mono

Header:
  - Height: h-8
  - Padding: px-3 py-1.5
  - Border: border-b border-border
  - Background: bg-muted/30 (light), bg-zinc-900/50 (dark)
  - Text: text-[10px] font-sans font-medium uppercase tracking-wider

Code Body:
  - Font size: text-xs
  - Line height: leading-relaxed
  - Padding: p-3 (no line numbers), pl-2 pr-4 py-3 (with line numbers)
  - Overflow: max-md:whitespace-pre-wrap max-md:break-words md:overflow-x-auto

Language Label:
  - Icon: w-3.5 h-3.5
  - Text: text-[10px] font-sans font-medium uppercase tracking-wider
```

### 2.5 Search Standard

```
Container:
  - Width: w-full
  - Border radius: rounded-lg
  - Border: border border-border
  - Background: bg-background
  - Focus: focus:outline-none focus:ring-2 focus:ring-primary

Input:
  - Height: h-9 (py-2)
  - Padding: px-3
  - Text: text-sm
  - Placeholder: placeholder:text-muted-foreground

Icon:
  - Position: absolute left-3 top-1/2 -translate-y-1/2
  - Size: w-4 h-4
  - Color: text-muted-foreground

Keyboard Hint:
  - Position: absolute right-2.5 top-1/2 -translate-y-1/2
  - Style: text-[9px] font-mono text-muted-foreground/50 border border-border/50 rounded px-1 py-0.5
```

### 2.6 Filter Standard

```
Container:
  - Border radius: rounded-lg
  - Border: border border-border
  - Background: bg-card
  - Padding: p-3

Label:
  - Style: text-xs font-semibold text-muted-foreground

Button:
  - Padding: px-2 py-0.5
  - Font: text-[10px] font-medium
  - Border radius: rounded
  - Active: bg-primary text-primary-foreground border-primary
  - Inactive: bg-secondary text-secondary-foreground border-border
```

### 2.7 Badge Standard

```
Default Badge:
  - Height: h-5
  - Padding: px-2 py-0.5
  - Font: text-xs font-medium
  - Border radius: rounded-4xl (pill shape)

Metadata Badge:
  - Padding: px-2 py-0.5
  - Font: text-[10px] font-mono
  - Border radius: rounded
  - Background: bg-muted
  - Border: border border-border

Status Badge (Production/Experimental):
  - Production: bg-emerald-500/10 text-emerald-700 dark:text-emerald-400
  - Experimental: bg-amber-500/10 text-amber-700 dark:text-amber-400
  - Deprecated: bg-red-500/10 text-red-700 dark:text-red-400
```

### 2.8 Table Standard

```
Container:
  - Border radius: rounded-lg
  - Border: border border-border
  - Overflow: overflow-x-auto

Header:
  - Background: bg-muted/40
  - Font: font-semibold text-foreground
  - Text transform: uppercase
  - Font size: 0.6875rem (11px)
  - Padding: 0.75rem 1rem

Cell:
  - Padding: 0.75rem 1rem
  - Font size: 0.8125rem (13px)
  - Color: text-muted-foreground
```

### 2.9 Empty State Standard

```
Container:
  - Padding: p-8
  - Text align: text-center
  - Border: border border-border
  - Border radius: rounded-lg
  - Background: bg-card

Text:
  - Primary: text-sm text-muted-foreground
  - Secondary: text-xs text-muted-foreground/60
```

### 2.10 Loading State Standard

```
Container:
  - Padding: p-8
  - Text align: text-center

Spinner:
  - Size: h-8 w-8
  - Border: border-b-2 border-primary

Text:
  - Style: text-xs text-muted-foreground
```

---

## Part 3: Page-by-Page Gap Analysis

### 3.1 Home Page (`app/page.tsx`)

**Differences from standard:**
- Section titles use `text-sm font-bold` instead of `text-lg font-semibold`
- Card border radius uses `rounded-xl` instead of `rounded-lg`
- Some inline code uses `text-[9px]` instead of `text-[10px]`
- Statistics cards use `p-3` with `rounded-lg` (inconsistent with other cards)

### 3.2 Problem Index (`app/problem-index/page.tsx`)

**Differences from standard:**
- Page title uses `font-sans` explicitly (should inherit)
- Description uses `text-sm` instead of `text-xs`
- Statistics use `text-xs` instead of `text-[10px]`

### 3.3 Models (`app/models/page.tsx`)

**Differences from standard:**
- Page title missing `tracking-tight`
- Description uses `text-xs` (correct)

### 3.4 Packages (`app/packages/page.tsx`)

**Differences from standard:**
- Page title missing `tracking-tight`
- No description under title

### 3.5 Workflows (`app/workflows/page.tsx`)

**Differences from standard:**
- Page title missing `tracking-tight`
- List items use `p-3` instead of `p-4`
- Category badge uses `text-[10px]` instead of `text-xs`

### 3.6 Patterns (`app/patterns/page.tsx`)

**Differences from standard:**
- Page title missing `tracking-tight`
- Filter container uses `p-4` instead of `p-3`
- Search input uses `py-2.5` instead of `py-2`

### 3.7 Cheatsheets (`app/cheatsheets/page.tsx`)

**Differences from standard:**
- Page title missing `tracking-tight`
- Entry count uses `text-[10px] font-mono` (correct)

### 3.8 Decision Guides (`app/decision-guides/page.tsx`)

**Differences from standard:**
- Page title missing `tracking-tight`
- Category badge uses `text-[10px] font-mono` (correct)

### 3.9 Debug Guides (`app/debug-guides/page.tsx`)

**Differences from standard:**
- Page title missing `tracking-tight`
- Category badge uses `text-[10px] font-mono` (correct)

### 3.10 Principles (`app/principles/page.tsx`)

**Differences from standard:**
- Page title missing `tracking-tight`
- Category badge uses `text-[10px] font-mono` (correct)

### 3.11 Registry (`app/registry/page.tsx`)

**Differences from standard:**
- Page title uses `font-bold tracking-tight` (correct)
- Description uses `text-xs` (correct)
- Statistics cards use `p-3` (correct)

### 3.12 Package Detail (`app/packages/[id]/page.tsx`)

**Differences from standard:**
- Uses `CodeBlock` component (correct)
- QuickSetupSection uses inline `h3` styling (inconsistent)

### 3.13 Model Detail (`app/models/[category]/[id]/page.tsx`)

**Differences from standard:**
- Uses `CodeBlock` component (correct)
- SectionCard uses `p-4` and `text-xs` (correct)
- Some inline code uses `text-xs` in pre elements (inconsistent)

### 3.14 Workflow Detail (`app/workflows/[id]/page.tsx`)

**Differences from standard:**
- Uses `CodeBlock` component (correct)
- Worked examples use inline `rounded overflow-hidden` (inconsistent)
- Production section uses inline `p-4` (inconsistent)

### 3.15 Pattern Detail (`app/patterns/[id]/page.tsx`)

**Differences from standard:**
- Uses `CodeBlock` component (correct)
- Examples section uses inline `rounded-lg border` (inconsistent)
- Navigation uses `p-2` instead of `p-3`

### 3.16 Decision Guide Detail (`app/decision-guides/[id]/page.tsx`)

**Differences from standard:**
- Uses inline `rounded-lg border` for sections (inconsistent)
- Some sections use `p-4` (correct)
- Some sections use `p-3` (correct)

### 3.17 Debug Guide Detail (`app/debug-guides/[id]/page.tsx`)

**Differences from standard:**
- Error messages use `bg-muted/50` instead of `bg-card` (inconsistent)
- Commands use `bg-muted/50` instead of `bg-card` (inconsistent)
- All sections use inline `rounded-lg border` (inconsistent)

### 3.18 Cheatsheet Detail (`app/cheatsheets/[id]/page.tsx`)

**Differences from standard:**
- Uses `CodeBlock` component (correct)
- Section uses inline `p-4` (inconsistent)

---

## Part 4: Implementation Roadmap

### Phase 1: Typography Consistency

**Files affected:**
- `app/packages/page.tsx`
- `app/workflows/page.tsx`
- `app/patterns/page.tsx`
- `app/cheatsheets/page.tsx`
- `app/decision-guides/page.tsx`
- `app/debug-guides/page.tsx`
- `app/principles/page.tsx`

**Estimated effort:** 1-2 hours

**Regression risk:** Low

**Verification checklist:**
- [ ] All page titles use `text-2xl font-bold tracking-tight`
- [ ] All section titles use `text-lg font-semibold`
- [ ] All labels use `text-[10px] font-semibold uppercase tracking-wider`

### Phase 2: Code Block Consistency (HIGHEST PRIORITY)

**Files affected:**
- `components/shared/CodeBlockInteractive.tsx`
- `components/shared/Prose.tsx`
- `app/debug-guides/[id]/page.tsx`
- `components/shared/PackageTaskList.tsx`

**Estimated effort:** 4-6 hours

**Regression risk:** Medium

**Verification checklist:**
- [ ] All code blocks use consistent `text-xs` font size
- [ ] All code blocks use consistent `p-3` padding
- [ ] All code blocks have consistent border radius `rounded-md`
- [ ] All code blocks have consistent border `border border-border`
- [ ] Light theme code blocks have proper background
- [ ] Language labels are consistent across all code blocks

### Phase 3: Card & Section Consistency

**Files affected:**
- `app/page.tsx`
- `components/shared/SectionCard.tsx`
- `components/shared/CollapsibleSection.tsx`
- `components/shared/CollapsibleRow.tsx`
- `app/patterns/[id]/page.tsx`
- `app/decision-guides/[id]/page.tsx`
- `app/debug-guides/[id]/page.tsx`

**Estimated effort:** 3-4 hours

**Regression risk:** Low

**Verification checklist:**
- [ ] All cards use `rounded-lg` border radius
- [ ] All cards use `border border-border`
- [ ] All cards use `bg-card` background
- [ ] All card headers use `px-4 py-3 border-b border-border bg-muted/20`

### Phase 4: Search & Filter Consistency

**Files affected:**
- `components/shared/SearchBox.tsx`
- `components/shared/FilterBar.tsx`
- `app/patterns/PatternFilterClient.tsx`
- `app/problem-index/ProblemIndexDashboard.tsx`

**Estimated effort:** 2-3 hours

**Regression risk:** Low

**Verification checklist:**
- [ ] All search inputs have consistent height
- [ ] All search inputs have consistent focus style
- [ ] All filter containers use `FilterBar` component
- [ ] All filter buttons have consistent styling

### Phase 5: Loading & Empty State Consistency

**Files affected:**
- `app/problem-index/page.tsx`
- `app/patterns/PatternFilterClient.tsx`
- `app/registry/page.tsx`

**Estimated effort:** 1-2 hours

**Regression risk:** Low

**Verification checklist:**
- [ ] All loading states use consistent spinner size
- [ ] All empty states use consistent styling
- [ ] All empty states have consistent text hierarchy

### Phase 6: Table Consistency

**Files affected:**
- `components/shared/Prose.tsx`
- `app/decision-guides/[id]/page.tsx`

**Estimated effort:** 1-2 hours

**Regression risk:** Low

**Verification checklist:**
- [ ] All tables use consistent padding
- [ ] All tables use consistent header styling
- [ ] All tables have consistent border styling

---

## Part 5: Regression Rules

### 5.1 Files That MUST NOT Change

- `app/layout.tsx` - Root layout structure
- `app/globals.css` - Core CSS variables and base styles
- `lib/data.ts` - Data loading functions
- `lib/search.ts` - Search functionality
- `lib/relationships.ts` - Relationship resolution
- `types/*.ts` - Type definitions
- `data/**/*.json` - Content data files
- `schema/*.json` - Schema definitions

### 5.2 Architectures That MUST NOT Change

- Next.js App Router file structure
- Component file organization
- Data loading patterns
- Search index structure
- Relationship linking system

### 5.3 Data Files That MUST NOT Change

- All files in `data/` directory
- All JSON content files
- `public/search-index.json`

### 5.4 Schemas That MUST NOT Change

- `schema/config.schema.json`
- All type definitions in `types/`

### 5.5 Routing That MUST NOT Change

- All existing routes and URL structures
- Dynamic route parameters
- Breadcrumb structures

### 5.6 Content Ownership That MUST NOT Change

- All content type boundaries
- All relationship mappings
- All cross-reference systems

---

## Part 6: Implementation Instructions

### 6.1 Typography Fixes

**Target files:** All page index files

**Expected changes:**
1. Change all page titles from `text-2xl font-semibold` to `text-2xl font-bold tracking-tight`
2. Ensure all section titles use `text-lg font-semibold`
3. Ensure all labels use `text-[10px] font-semibold uppercase tracking-wider`

**Expected visual result:**
- Consistent page title appearance across all index pages
- Consistent section header hierarchy
- Consistent label styling

### 6.2 Code Block Fixes (CRITICAL)

**Target file:** `components/shared/CodeBlockInteractive.tsx`

**Expected changes:**
1. Change font size from `text-[11px]` to `text-xs`
2. Ensure padding is `p-3` (or `pl-2 pr-4 py-3` for line numbers)
3. Ensure border radius is `rounded-md`
4. Ensure border is `border border-border`
5. Add light theme background support

**Target file:** `components/shared/Prose.tsx`

**Expected changes:**
1. Change pre element styling to match `CodeBlockInteractive`
2. Add light theme background for code blocks
3. Ensure consistent padding and font size

**Target file:** `app/debug-guides/[id]/page.tsx`

**Expected changes:**
1. Replace `bg-muted/50` with `bg-card` for error message pre elements
2. Replace `bg-muted/50` with `bg-card` for command pre elements
3. Ensure consistent code block styling

**Expected visual result:**
- All code blocks look identical regardless of source
- Consistent font size and padding
- Proper dark/light theme support

### 6.3 Card Consistency Fixes

**Target file:** `app/page.tsx`

**Expected changes:**
1. Change card border radius from `rounded-xl` to `rounded-lg`
2. Ensure all cards use `border border-border`
3. Ensure all cards use `bg-card` background

**Target file:** `components/shared/SectionCard.tsx`

**Expected changes:**
1. Verify header uses `px-4 py-3 border-b border-border bg-muted/20`
2. Verify content uses `p-4`

**Target file:** `components/shared/CollapsibleSection.tsx`

**Expected changes:**
1. Verify uses `rounded-lg`
2. Verify uses `border border-border`
3. Verify uses `bg-card`

**Target file:** `components/shared/CollapsibleRow.tsx`

**Expected changes:**
1. Verify uses `rounded-lg`
2. Verify uses `border border-border`
3. Verify uses `bg-card`

**Expected visual result:**
- All cards have identical border radius
- All cards have consistent header styling
- All cards have consistent internal padding

### 6.4 Search & Filter Fixes

**Target file:** `components/shared/SearchBox.tsx`

**Expected changes:**
1. Ensure focus ring uses `focus:ring-2 focus:ring-primary`
2. Ensure consistent height with `py-2`

**Target file:** `app/patterns/PatternFilterClient.tsx`

**Expected changes:**
1. Replace inline filter container with `FilterBar` component
2. Ensure search input matches `SearchBox` styling

**Target file:** `app/problem-index/ProblemIndexDashboard.tsx`

**Expected changes:**
1. Replace custom filter buttons with `FilterBar` component
2. Ensure search input matches `SearchBox` styling

**Expected visual result:**
- All search inputs look identical
- All filter controls use consistent styling
- All focus states are consistent

### 6.5 Loading & Empty State Fixes

**Target file:** `app/problem-index/page.tsx`

**Expected changes:**
1. Update loading state to use standard styling
2. Ensure empty state uses standard styling

**Target file:** `app/patterns/PatternFilterClient.tsx`

**Expected changes:**
1. Update empty state to use standard styling

**Target file:** `app/registry/page.tsx`

**Expected changes:**
1. Update empty state to use standard styling

**Expected visual result:**
- All loading states have consistent spinner and text
- All empty states have consistent styling

### 6.6 Table Fixes

**Target file:** `components/shared/Prose.tsx`

**Expected changes:**
1. Ensure table uses `p-3` for cells
2. Ensure table header uses `bg-muted/40`

**Target file:** `app/decision-guides/[id]/page.tsx`

**Expected changes:**
1. Update comparison table to use standard table styling

**Expected visual result:**
- All tables have consistent cell padding
- All tables have consistent header styling

---

## Appendix A: Reference Implementations

### A.1 Standard Code Block CSS

```css
/* Add to globals.css or use in components */
.code-block-standard {
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background-color: var(--card);
  margin: 0.5rem 0;
  font-family: var(--font-mono);
}

.code-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.375rem 0.75rem;
  border-bottom: 1px solid var(--border);
  background-color: color-mix(in oklch, var(--muted), transparent 80%);
  font-size: 0.875rem;
}

.code-block-body {
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 0.75rem;
  overflow-x: auto;
}
```

### A.2 Standard Card CSS

```css
.card-standard {
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background-color: var(--card);
}

.card-header-standard {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
  background-color: color-mix(in oklch, var(--muted), transparent 80%);
}

.card-content-standard {
  padding: 1rem;
}
```

---

## Appendix B: Testing Matrix

| Test Case | Expected Result | Files to Verify |
|-----------|-----------------|-----------------|
| Navigate to all index pages | Page titles are consistent | All index pages |
| View code blocks in all content types | Code blocks are identical | All detail pages |
| Use search on all pages | Search inputs are consistent | All pages with search |
| Apply filters on patterns page | Filter styling is consistent | Patterns, Problem Index |
| View empty states | Empty states are consistent | Patterns, Registry, Problem Index |
| View loading states | Loading states are consistent | Problem Index |
| View tables in all contexts | Table styling is consistent | All pages with tables |

---

**End of Document**