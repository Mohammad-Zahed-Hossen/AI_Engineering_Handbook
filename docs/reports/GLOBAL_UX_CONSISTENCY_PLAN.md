# AENS Global UX Consistency Plan (Minimal)

**Document Version:** 1.0  
**Date:** July 2026  
**Status:** Design Document - Ready for Review

---

## Part 1: Critical Inconsistencies

### 1.1 Code Block Font Size
| File | Line | Current | Fix |
|------|------|---------|-----|
| `components/shared/CodeBlockInteractive.tsx` | 175 | `text-[11px]` | `text-xs` |

### 1.2 Code Block Background (Light Theme)
| File | Line | Current | Fix |
|------|------|---------|-----|
| `components/shared/Prose.tsx` | 84 | `bg-zinc-950` only | `bg-card dark:bg-zinc-950` |
| `components/shared/ProseClient.tsx` | 149 | `bg-muted/50` | `bg-card` |

### 1.3 Page Title Typography
| File | Line | Current | Fix |
|------|------|---------|-----|
| `app/packages/page.tsx` | 9 | `font-semibold` | `font-bold tracking-tight` |
| `app/workflows/page.tsx` | 9 | `font-semibold` | `font-bold tracking-tight` |
| `app/patterns/PatternFilterClient.tsx` | 107 | `font-semibold` | `font-bold tracking-tight` |
| `app/cheatsheets/page.tsx` | 9 | `font-semibold` | `font-bold tracking-tight` |
| `app/decision-guides/page.tsx` | 9 | `font-semibold` | `font-bold tracking-tight` |
| `app/debug-guides/page.tsx` | 9 | `font-semibold` | `font-bold tracking-tight` |
| `app/principles/page.tsx` | 9 | `font-semibold` | `font-bold tracking-tight` |

### 1.4 Search Input Height
| File | Line | Current | Fix |
|------|------|---------|-----|
| `app/patterns/PatternFilterClient.tsx` | 126 | `py-2.5` (44px) | `py-2` (40px) |
| `app/problem-index/ProblemIndexDashboard.tsx` | 579 | `py-2.5` (44px) | `py-2` (40px) |

---

## Part 2: Implementation Instructions

### 2.1 CodeBlockInteractive.tsx (Line 175)
```diff
- "text-[11px] leading-relaxed scrollbar-thin select-text",
+ "text-xs leading-relaxed scrollbar-thin select-text",
```

### 2.2 Prose.tsx (Line 84)
```diff
- className="rounded-md bg-zinc-950 border border-zinc-800 my-2 font-mono"
+ className="rounded-md border border-border my-2 font-mono bg-card dark:bg-zinc-950"
```

### 2.3 ProseClient.tsx (Lines 149-150)
```diff
- <div className="rounded-md bg-zinc-950 border border-zinc-800 my-2 font-mono p-3 overflow-x-auto">
-   <pre className="text-xs text-zinc-300">
+ <div className="rounded-md border border-border my-2 font-mono bg-card dark:bg-zinc-950 overflow-hidden">
+   <pre className="text-xs font-mono p-3 m-0">
```

### 2.4 Index Page Titles (7 files)
```diff
- <h1 className="text-2xl font-semibold text-foreground">
+ <h1 className="text-2xl font-bold tracking-tight text-foreground">
```

### 2.5 Search Input Height (2 files)
```diff
- className="w-full pl-10 pr-4 py-2.5 text-sm ...
+ className="w-full pl-10 pr-4 py-2 text-sm ...
```

---

## Part 3: Files That MUST NOT Change

- `app/layout.tsx`
- `lib/data.ts`
- `lib/search.ts`
- `types/*.ts`
- `data/**/*.json`
- `schema/*.json`

---

## Part 4: Success Criteria

- [ ] All code blocks use `text-xs` font
- [ ] All code blocks have light theme background
- [ ] All page titles are consistent
- [ ] All search inputs have consistent height (40px)
- [ ] No visual regressions

---

**End of Document**