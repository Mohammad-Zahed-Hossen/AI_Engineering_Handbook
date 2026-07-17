# AENS Surgical Consistency Fix Plan

**Document Version:** 1.0  
**Date:** July 2026  
**Status:** Implementation-Ready

---

## Executive Summary

**Surgical, minimal changes only.** This plan fixes the most critical inconsistencies with the smallest possible changes. Total estimated effort: **4-6 hours**.

---

## Part 1: Critical Issues (Must Fix)

### 1.1 Code Block Font Size (HIGHEST PRIORITY)

**File:** `components/shared/CodeBlockInteractive.tsx`

**Line 175:**
```diff
- "text-[11px] leading-relaxed scrollbar-thin select-text",
+ "text-xs leading-relaxed scrollbar-thin select-text",
```

**Why:** `text-xs` (12px) is the standard. `text-[11px]` is inconsistent.

### 1.2 Code Block Background (HIGHEST PRIORITY)

**File:** `components/shared/Prose.tsx`

**Lines 83-87:**
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

**File:** `components/shared/ProseClient.tsx`

**Lines 148-153:**
```diff
- <div className="rounded overflow-hidden text-xs">
-   <pre className="text-xs font-mono bg-muted/50 ...">
+ <div className="rounded-md border border-border my-2 font-mono bg-card dark:bg-zinc-950 overflow-hidden">
+   <pre className="text-xs ...">
```

**Why:** Light theme support is missing.

### 1.3 Page Title Typography

**Files:** 7 index pages

**Change in each:**
```diff
- <h1 className="text-2xl font-semibold text-foreground">
+ <h1 className="text-2xl font-bold tracking-tight text-foreground">
```

**Files:**
- `app/packages/page.tsx`
- `app/workflows/page.tsx`
- `app/patterns/page.tsx`
- `app/cheatsheets/page.tsx`
- `app/decision-guides/page.tsx`
- `app/debug-guides/page.tsx`
- `app/principles/page.tsx`

---

## Part 2: Implementation Steps

### Step 1: Code Block Font (10 min)

Change `text-[11px]` to `text-xs` in `CodeBlockInteractive.tsx`

### Step 2: Code Block Background (30 min)

Add `bg-card dark:bg-zinc-950` to `Prose.tsx` and `ProseClient.tsx`

### Step 3: Page Titles (20 min)

Change 7 page titles to use `font-bold tracking-tight`

### Step 4: Verify (30 min)

- Check all pages
- Check mobile
- Check dark mode

---

## Part 3: Files That MUST NOT Change

- `app/layout.tsx`
- `lib/data.ts`
- `lib/search.ts`
- `lib/relationships.ts`
- `types/*.ts`
- `data/**/*.json`
- `schema/*.json`
- `public/search-index.json`

---

## Part 4: Success Criteria

- [ ] All code blocks use `text-xs` font
- [ ] All code blocks have light theme background
- [ ] All page titles are consistent
- [ ] No visual regressions

---

**End of Document**