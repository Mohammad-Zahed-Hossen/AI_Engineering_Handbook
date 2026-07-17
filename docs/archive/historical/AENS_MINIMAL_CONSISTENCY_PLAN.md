# AENS Minimal Consistency Fix Plan

**Document Version:** 1.0  
**Date:** July 2026  
**Status:** Implementation-Ready

---

## Executive Summary

This is a **minimal, surgical** plan to fix visual inconsistencies in AENS. We will make exact changes to existing components and pages. Total estimated effort: **1-2 days**.

---

## Part 1: Critical Inconsistencies

### 1.1 Code Block Inconsistencies (HIGHEST PRIORITY)

| Component | File | Issue | Fix |
|-----------|------|-------|-----|
| `CodeBlockInteractive` | `components/shared/CodeBlockInteractive.tsx` | `text-[11px]` font | Change to `text-xs` |
| `Prose` pre | `components/shared/Prose.tsx` | Inline `pre` styling | Use `CodeBlock` |
| `ProseClient` pre | `components/shared/ProseClient.tsx` | Inline `pre` styling | Use `CodeBlock` |
| `DebugGuidePage` pre | `app/debug-guides/[id]/page.tsx` | `bg-muted/50` | Use `CodeBlock` |
| `PackageTaskList` pre | `components/shared/PackageTaskList.tsx` | `bg-muted/5` | Use `CodeBlock` |

### 1.2 Typography Inconsistencies

| File | Issue | Fix |
|------|-------|-----|
| `app/packages/page.tsx` | `font-semibold` | `font-bold tracking-tight` |
| `app/workflows/page.tsx` | `font-semibold` | `font-bold tracking-tight` |
| `app/patterns/page.tsx` | `font-semibold` | `font-bold tracking-tight` |
| `app/cheatsheets/page.tsx` | `font-semibold` | `font-bold tracking-tight` |
| `app/decision-guides/page.tsx` | `font-semibold` | `font-bold tracking-tight` |
| `app/debug-guides/page.tsx` | `font-semibold` | `font-bold tracking-tight` |
| `app/principles/page.tsx` | `font-semibold` | `font-bold tracking-tight` |

---

## Part 2: Exact Changes

### 2.1 CodeBlockInteractive.tsx

**Line 175:**
```diff
- "text-[11px] leading-relaxed scrollbar-thin select-text",
+ "text-xs leading-relaxed scrollbar-thin select-text",
```

### 2.2 Prose.tsx

**Lines 83-87:**
```diff
- <div
-   className="rounded-md bg-zinc-950 border border-zinc-800 my-2 font-mono"
-   dangerouslySetInnerHTML={{ __html: highlighted }}
- />
+ <CodeBlock code={codeText} language={language} />
```

### 2.3 ProseClient.tsx

**Lines 148-153:**
```diff
- <div className="rounded overflow-hidden text-xs">
-   <pre className="text-xs font-mono bg-muted/50 ...">
-     <code className={`language-${language || 'text'}`}>{codeText}</code>
-   </pre>
- </div>
+ <CodeBlock code={codeText} language={language} />
```

### 2.4 DebugGuidePage

**Lines 133-135 (error messages):**
```diff
- <pre className="text-xs font-mono bg-muted/50 ...">
-   <code className="text-foreground">{symptom.error_message}</code>
- </pre>
+ <CodeBlock code={symptom.error_message} language="text" />
```

**Lines 247-249 (commands):**
```diff
- <pre className="text-xs font-mono bg-muted/50 ...">
-   <code className="text-foreground">{test.command}</code>
- </pre>
+ <CodeBlock code={test.command} language="bash" />
```

### 2.5 PackageTaskList

**Lines 229-238 (syntax block):**
```diff
- <div className="rounded-lg border border-border bg-muted/5 ...">
-   <h4 ...>Syntax Definition</h4>
-   <div className="text-xs">{task.syntaxBlock}</div>
- </div>
+ <CodeBlock code={task.syntax} language={pkg.language} />
```

### 2.6 Index Page Titles

**Each file (packages, workflows, patterns, cheatsheets, decision-guides, debug-guides, principles):**
```diff
- <h1 className="text-2xl font-semibold text-foreground">
+ <h1 className="text-2xl font-bold tracking-tight text-foreground">
```

---

## Part 3: Implementation Order

### Phase 1: Code Block Font Size (30 min)

1. Change `text-[11px]` to `text-xs` in `CodeBlockInteractive.tsx`

### Phase 2: Code Block Unification (2-3 hours)

1. Update `Prose.tsx` to use `CodeBlock`
2. Update `ProseClient.tsx` to use `CodeBlock`
3. Update `DebugGuidePage` to use `CodeBlock`
4. Update `PackageTaskList` to use `CodeBlock`

### Phase 3: Typography Fixes (30 min)

1. Update all 7 index page titles

### Phase 4: Verification (1 hour)

1. Visual check on all pages
2. Mobile check
3. Dark mode check

---

## Part 4: Files That MUST NOT Change

- `app/layout.tsx`
- `lib/data.ts`
- `lib/search.ts`
- `lib/relationships.ts`
- `types/*.ts`
- `data/**/*.json`
- `schema/*.json`
- `public/search-index.json`

---

## Part 5: Success Criteria

After changes:
- [ ] All code blocks use `text-xs` font
- [ ] All code blocks use `CodeBlock` component
- [ ] All page titles are consistent
- [ ] No visual regressions
- [ ] Build time unchanged

---

**End of Document**