# AENS Consistency Fix Plan

**Document Version:** 1.0  
**Date:** July 2026  
**Status:** Implementation-Ready

---

## Executive Summary

This is a **minimal, incremental** plan to fix visual inconsistencies in AENS. We will evolve existing shared components rather than creating new abstractions. Total estimated effort: **2-3 days**.

---

## Part 1: Critical Inconsistencies (Must Fix)

### 1.1 Code Block Inconsistencies (HIGHEST PRIORITY)

| Component | Issue | Fix |
|-----------|-------|-----|
| `CodeBlockInteractive` | `text-[11px]` font | Change to `text-xs` |
| `Prose` pre | `bg-zinc-950` only dark | Add light theme support |
| `ProseClient` pre | `bg-zinc-950` only dark | Add light theme support |
| `DebugGuidePage` pre | `bg-muted/50` | Use `CodeBlock` instead |
| `PackageTaskList` pre | `bg-muted/5` | Use `CodeBlock` instead |

**Target:** 100% of code blocks use the same `CodeBlock` component.

### 1.2 Typography Inconsistencies

| Location | Issue | Fix |
|----------|-------|-----|
| 7 index pages | `font-semibold` instead of `font-bold tracking-tight` | Change to `font-bold tracking-tight` |
| Section headers | Mixed sizes | Use `text-lg font-semibold` consistently |

### 1.3 Badge Inconsistencies

| Type | Current | Standard |
|------|---------|----------|
| Status | Inline `px-2 py-0.5 text-[10px]` | Use `Badge` with `status` variant |
| Difficulty | Inline `px-2 py-0.5 text-[10px]` | Use `Badge` with `difficulty` variant |
| Metadata | Inline `px-2 py-0.5 text-[10px]` | Use `Badge` with `outline` variant |

---

## Part 2: Component Evolution Plan

### 2.1 CodeBlock Evolution

**File:** `components/shared/CodeBlockInteractive.tsx`

**Changes:**
1. Change `text-[11px]` to `text-xs` (line 175)
2. Ensure `p-3` padding is used consistently
3. Add light theme background support

**File:** `components/shared/Prose.tsx`

**Changes:**
1. Replace inline `pre` styling with `CodeBlock` component
2. Add light theme support

**File:** `components/shared/ProseClient.tsx`

**Changes:**
1. Replace inline `pre` styling with `CodeBlock` component
2. Add light theme support

### 2.2 Badge Evolution

**File:** `components/ui/badge.tsx`

**Add variants:**
```tsx
// Add to badgeVariants:
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

### 2.3 SearchBox Evolution

**File:** `components/shared/SearchBox.tsx`

**Changes:**
1. Ensure consistent `py-2` height
2. Ensure consistent `focus:ring-2 focus:ring-primary` focus style

### 2.4 FilterBar Evolution

**File:** `components/shared/FilterBar.tsx`

**Changes:**
1. Ensure consistent `p-3` padding
2. Ensure consistent button styling

---

## Part 3: Page-by-Page Changes

### 3.1 Index Pages (Typography Fix)

**Files to change:**
- `app/packages/page.tsx` - Change h1 to `text-2xl font-bold tracking-tight`
- `app/workflows/page.tsx` - Change h1 to `text-2xl font-bold tracking-tight`
- `app/patterns/page.tsx` - Change h1 to `text-2xl font-bold tracking-tight`
- `app/cheatsheets/page.tsx` - Change h1 to `text-2xl font-bold tracking-tight`
- `app/decision-guides/page.tsx` - Change h1 to `text-2xl font-bold tracking-tight`
- `app/debug-guides/page.tsx` - Change h1 to `text-2xl font-bold tracking-tight`
- `app/principles/page.tsx` - Change h1 to `text-2xl font-bold tracking-tight`

### 3.2 Debug Guide Detail (Code Block Fix)

**File:** `app/debug-guides/[id]/page.tsx`

**Changes:**
1. Replace error message `pre` with `<CodeBlock variant="code" />`
2. Replace command `pre` with `<CodeBlock variant="terminal" />`

### 3.3 Package Task List (Code Block Fix)

**File:** `components/shared/PackageTaskList.tsx`

**Changes:**
1. Replace inline `div` wrappers with `CodeBlock`

---

## Part 4: Implementation Order

### Phase 1: Code Block Standardization (1 day)

1. Update `CodeBlockInteractive.tsx` font size
2. Update `Prose.tsx` to use `CodeBlock`
3. Update `ProseClient.tsx` to use `CodeBlock`
4. Update `DebugGuidePage` to use `CodeBlock`
5. Update `PackageTaskList` to use `CodeBlock`

### Phase 2: Typography & Badge Fixes (0.5 day)

1. Update all index page titles
2. Add badge variants to `badge.tsx`
3. Update pages to use badge variants

### Phase 3: Search & Filter Fixes (0.5 day)

1. Update `SearchBox` consistency
2. Update `FilterBar` consistency
3. Update `PatternFilterClient` to use consistent components

### Phase 4: Verification (0.5 day)

1. Visual regression testing
2. Mobile responsiveness check
3. Dark mode check

---

## Part 5: Files That MUST NOT Change

- `app/layout.tsx`
- `lib/data.ts`
- `lib/search.ts`
- `lib/relationships.ts`
- `types/*.ts`
- `data/**/*.json`
- `schema/*.json`
- `public/search-index.json`

---

## Part 6: Exact Changes

### 6.1 CodeBlockInteractive.tsx

**Line 175:**
```diff
- "text-[11px] leading-relaxed scrollbar-thin select-text",
+ "text-xs leading-relaxed scrollbar-thin select-text",
```

### 6.2 Prose.tsx

**Lines 83-87:**
```diff
- <div
-   className="rounded-md bg-zinc-950 border border-zinc-800 my-2 font-mono"
-   dangerouslySetInnerHTML={{ __html: highlighted }}
- />
+ <CodeBlock code={codeText} language={language} />
```

### 6.3 Index Page Titles

**Each file:**
```diff
- <h1 className="text-2xl font-semibold text-foreground">
+ <h1 className="text-2xl font-bold tracking-tight text-foreground">
```

---

## Part 7: Success Criteria

After changes:
- [ ] All code blocks look identical
- [ ] All page titles are consistent
- [ ] All badges use the `Badge` component
- [ ] No visual regressions
- [ ] Build time unchanged
- [ ] Bundle size <5% increase

---

**End of Document**