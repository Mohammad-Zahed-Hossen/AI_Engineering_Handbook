# AENS Global UX Consistency Plan

**Document Version:** 1.0  
**Date:** July 2026  
**Status:** Design Document - Ready for Review

---

## Part 1: Global UX Audit

### 1.1 Typography Inconsistencies

| Location | Issue | Current |
|----------|-------|---------|
| `app/packages/page.tsx` | Page title | `text-2xl font-semibold` (missing `tracking-tight`) |
| `app/workflows/page.tsx` | Page title | `text-2xl font-semibold` (missing `tracking-tight`) |
| `app/patterns/page.tsx` | Page title | `text-2xl font-semibold` (missing `tracking-tight`) |
| `app/cheatsheets/page.tsx` | Page title | `text-2xl font-semibold` (missing `tracking-tight`) |
| `app/decision-guides/page.tsx` | Page title | `text-2xl font-semibold` (missing `tracking-tight`) |
| `app/debug-guides/page.tsx` | Page title | `text-2xl font-semibold` (missing `tracking-tight`) |
| `app/principles/page.tsx` | Page title | `text-2xl font-semibold` (missing `tracking-tight`) |

### 1.2 Code Block Inconsistencies (CRITICAL)

| Component | File | Issue |
|-----------|------|-------|
| `CodeBlockInteractive` | `components/shared/CodeBlockInteractive.tsx` | `text-[11px]` instead of `text-xs` |
| `Prose` pre | `components/shared/Prose.tsx` | `bg-zinc-950` only (no light theme) |
| `ProseClient` pre | `components/shared/ProseClient.tsx` | `bg-muted/50` instead of `bg-card` |
| `DebugGuidePage` | `app/debug-guides/[id]/page.tsx` | Inline `pre` with `bg-muted/50` |
| `PackageTaskList` | `components/shared/PackageTaskList.tsx` | Inline `div` with `bg-muted/5` |

### 1.3 Search Inconsistencies

| Component | File | Issue |
|-----------|------|-------|
| `PatternFilterClient` | `app/patterns/PatternFilterClient.tsx` | `py-2.5` height (44px) |
| `ProblemIndexDashboard` | `app/problem-index/ProblemIndexDashboard.tsx` | `py-2.5` height (44px) |
| `SearchBox` | `components/shared/SearchBox.tsx` | `py-2` height (40px) |

### 1.4 Filter Inconsistencies

| Component | File | Issue |
|-----------|------|-------|
| `PatternFilterClient` | `app/patterns/PatternFilterClient.tsx` | Custom inline filter container |
| `ProblemIndexDashboard` | `app/problem-index/ProblemIndexDashboard.tsx` | Custom inline filter buttons |

### 1.5 Badge Inconsistencies

| Type | Current | Issue |
|------|---------|-------|
| Status | Inline `px-2 py-0.5 text-[10px]` | Not using `Badge` component |
| Difficulty | Inline `px-2 py-0.5 text-[10px]` | Not using `Badge` component |
| Metadata | Inline `px-2 py-0.5 text-[10px]` | Not using `Badge` component |

---

## Part 2: Canonical Design Standards

### 2.1 Typography Standard

```
Page Title:    text-2xl font-bold tracking-tight
Section Title: text-lg font-semibold
Card Title:    text-sm font-medium
Body Text:     text-sm
Caption:       text-xs
Label:         text-[10px] font-semibold uppercase tracking-wider
Metadata:      text-[10px] font-mono
```

### 2.2 Code Block Standard

```
Container:
  - Border radius: rounded-md
  - Border: border border-border
  - Background: bg-card (light), bg-zinc-950 (dark)
  - Margin: my-2
  - Font: font-mono

Header:
  - Padding: px-3 py-1.5
  - Border: border-b border-border
  - Background: bg-muted/30 (light), bg-zinc-900/50 (dark)
  - Text: text-[10px] font-sans font-medium uppercase tracking-wider

Body:
  - Font size: text-xs
  - Line height: leading-relaxed
  - Padding: p-3
  - Overflow: max-md:whitespace-pre-wrap max-md:break-words md:overflow-x-auto
```

### 2.3 Search Standard

```
Input:
  - Height: h-9 (py-2)
  - Padding: px-3
  - Border radius: rounded-lg
  - Border: border border-border
  - Background: bg-background
  - Focus: focus:ring-2 focus:ring-primary
```

### 2.4 Filter Standard

```
Container:
  - Border radius: rounded-lg
  - Border: border border-border
  - Background: bg-card
  - Padding: p-3

Button:
  - Padding: px-2 py-0.5
  - Font: text-[10px] font-medium
  - Active: bg-primary text-primary-foreground
  - Inactive: bg-secondary text-secondary-foreground
```

### 2.5 Badge Standard

```
Status Badge:
  - Production: bg-emerald-500/10 text-emerald-700 dark:text-emerald-400
  - Experimental: bg-amber-500/10 text-amber-700 dark:text-amber-400
  - Deprecated: bg-red-500/10 text-red-700 dark:text-red-400

Metadata Badge:
  - Padding: px-2 py-0.5
  - Font: text-[10px] font-mono
  - Border: border border-border
  - Background: bg-muted
```

---

## Part 3: Page-by-Page Gap Analysis

### 3.1 Index Pages

| Page | Typography Gap | Code Block Gap | Search Gap | Filter Gap | Badge Gap |
|------|--------------|--------------|------------|------------|-----------|
| Packages | Title missing `tracking-tight` | - | - | - | - |
| Workflows | Title missing `tracking-tight` | - | - | - | - |
| Patterns | Title missing `tracking-tight` | - | Height mismatch | Custom filters | - |
| Cheatsheets | Title missing `tracking-tight` | - | - | - | - |
| Decision Guides | Title missing `tracking-tight` | - | - | - | - |
| Debug Guides | Title missing `tracking-tight` | Inline pre | - | - | - |
| Principles | Title missing `tracking-tight` | - | - | - | - |

### 3.2 Detail Pages

| Page | Code Block Gap | Badge Gap |
|------|--------------|-----------|
| Package Detail | Uses `CodeBlock` (correct) | - |
| Model Detail | Uses `CodeBlock` (correct) | - |
| Workflow Detail | Uses `CodeBlock` (correct) | - |
| Pattern Detail | Uses `CodeBlock` (correct) | - |
| Decision Guide Detail | Inline sections | Inline badges |
| Debug Guide Detail | Inline pre | Inline badges |
| Cheatsheet Detail | Uses `CodeBlock` (correct) | - |
| Principle Detail | - | Inline badges |

---

## Part 4: Implementation Roadmap

### Phase 1: Code Block Standardization (1-2 hours)

**Files affected:**
- `components/shared/CodeBlockInteractive.tsx`
- `components/shared/Prose.tsx`
- `components/shared/ProseClient.tsx`

**Changes:**
1. Change `text-[11px]` to `text-xs` in `CodeBlockInteractive.tsx`
2. Add `bg-card dark:bg-zinc-950` to `Prose.tsx` pre element
3. Add `border border-border` and `bg-card` to `ProseClient.tsx` pre element

**Regression risk:** Low

**Verification:**
- [ ] Code blocks render with `text-xs` font
- [ ] Code blocks have light theme background
- [ ] No visual regressions

### Phase 2: Typography Fixes (30 min)

**Files affected:**
- `app/packages/page.tsx`
- `app/workflows/page.tsx`
- `app/patterns/page.tsx`
- `app/cheatsheets/page.tsx`
- `app/decision-guides/page.tsx`
- `app/debug-guides/page.tsx`
- `app/principles/page.tsx`

**Changes:**
1. Change `font-semibold` to `font-bold tracking-tight` in all page titles

**Regression risk:** Low

**Verification:**
- [ ] All page titles are consistent
- [ ] No visual regressions

### Phase 3: Search & Filter Consistency (1 hour)

**Files affected:**
- `app/patterns/PatternFilterClient.tsx`
- `app/problem-index/ProblemIndexDashboard.tsx`

**Changes:**
1. Change search input height to `py-2`
2. Replace custom filter with `FilterBar` component

**Regression risk:** Low

**Verification:**
- [ ] All search inputs have consistent height
- [ ] All filters use `FilterBar`

### Phase 4: Badge Consistency (30 min)

**Files affected:**
- `components/ui/badge.tsx`
- `components/shared/MetadataBadges.tsx`

**Changes:**
1. Add `status` variant to `Badge` component
2. Add `difficulty` variant to `Badge` component
3. Update `MetadataBadges` to use `Badge` variants

**Regression risk:** Low

**Verification:**
- [ ] All status badges use `Badge` component
- [ ] All difficulty badges use `Badge` component

---

## Part 5: Regression Rules

### 5.1 Files That MUST NOT Change

- `app/layout.tsx`
- `lib/data.ts`
- `lib/search.ts`
- `lib/relationships.ts`
- `types/*.ts`
- `data/**/*.json`
- `schema/*.json`
- `public/search-index.json`

### 5.2 Architectures That MUST NOT Change

- Next.js App Router file structure
- Component file organization
- Data loading patterns
- Search index structure
- Relationship linking system

### 5.3 Content That MUST NOT Change

- All content type boundaries
- All relationship mappings
- All cross-reference systems
- All markdown content rendering

---

## Part 6: Implementation Instructions

### 6.1 CodeBlockInteractive.tsx

**Target:** Line 175

**Change:**
```diff
- "text-[11px] leading-relaxed scrollbar-thin select-text",
+ "text-xs leading-relaxed scrollbar-thin select-text",
```

**Result:** Code blocks use consistent `text-xs` font.

### 6.2 Prose.tsx

**Target:** Lines 83-87

**Change:**
```diff
- <div
-   className="rounded-md bg-zinc-950 border border-zinc-800 my-2 font-mono"
-   dangerouslySetInnerHTML={{ __html: highlighted }}
- />
+ <div
+   className="rounded-md border border-border my-2 font-mono bg-card dark:bg-zinc-950"
+   dangerouslySetInnerHTML={{ __html: highlighted }}
+ />
```

**Result:** Code blocks have light theme support.

### 6.3 ProseClient.tsx

**Target:** Lines 148-153

**Change:**
```diff
- <div className="rounded overflow-hidden text-xs">
-   <pre className="text-xs font-mono bg-muted/50 border border-border rounded p-2 mt-1 overflow-x-auto">
+ <div className="rounded-md border border-border my-2 font-mono bg-card dark:bg-zinc-950 overflow-hidden">
+   <pre className="text-xs font-mono p-3 m-0">
```

**Result:** Code blocks have consistent styling.

### 6.4 Index Page Titles

**Target:** All 7 index page files

**Change:**
```diff
- <h1 className="text-2xl font-semibold text-foreground">
+ <h1 className="text-2xl font-bold tracking-tight text-foreground">
```

**Result:** All page titles are consistent.

### 6.5 Search Input Height

**Target:** `app/patterns/PatternFilterClient.tsx` line 121

**Change:**
```diff
- className="w-full pl-10 pr-4 py-2.5 text-sm ...
+ className="w-full pl-10 pr-4 py-2 text-sm ...
```

**Target:** `app/problem-index/ProblemIndexDashboard.tsx` line 579

**Change:**
```diff
- className="w-full pl-10 pr-10 py-2.5 rounded-lg ...
+ className="w-full pl-10 pr-10 py-2 rounded-lg ...
```

**Result:** All search inputs have consistent height.

### 6.6 Badge Variants

**Target:** `components/ui/badge.tsx`

**Add after line 27:**
```tsx
status: {
  production: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  experimental: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  deprecated: "bg-red-500/10 text-red-700 dark:text-red-400",
},
difficulty: {
  beginner: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  intermediate: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  advanced: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  expert: "bg-red-500/10 text-red-700 dark:text-red-400",
},
```

**Result:** All badges use consistent `Badge` component.

---

## Part 7: Success Criteria

After all changes:
- [ ] All code blocks use `text-xs` font
- [ ] All code blocks have light theme background
- [ ] All page titles are consistent
- [ ] All search inputs have consistent height
- [ ] All badges use `Badge` component
- [ ] No visual regressions
- [ ] Build time unchanged

---

**End of Document**