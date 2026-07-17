# AENS Design System Migration Plan (Depreciated)

**Document Version:** 2.0  
**Date:** July 2026  
**Status:** Design Document - Ready for Review

---

## Executive Summary

This document outlines a **component-first** approach to achieve visual consistency across the AI Engineering Navigation System (AENS). Instead of normalizing CSS classes across individual pages, we will create reusable design primitives that all pages consume.

**Core Principle:** One source of truth for each UI pattern.

---

## Part 1: UI Inventory & Pattern Analysis

### 1.1 Existing UI Patterns (Current State)

| Pattern | Current Implementation | Files Using |
|---------|----------------------|-----------|
| Page Headers | Inline `h1` + description | All index pages |
| Search Input | `SearchBox` + inline variants | Home, Patterns, Problem Index |
| Filter Bar | `FilterBar` + custom inline | Patterns, Problem Index |
| Index Cards | Inline `Link` with Tailwind | All index pages |
| Section Cards | `SectionCard` component | Model Detail, Decision Guides |
| Collapsible Sections | `CollapsibleSection`, `CollapsibleRow` | Package Detail, Workflow Detail |
| Code Blocks | `CodeBlockInteractive` + inline `pre` | All detail pages |
| Tables | Inline `table` + `Prose` | All pages with tables |
| Empty States | Inline `div` | Patterns, Registry, Problem Index |
| Loading States | Inline `div` with spinner | Problem Index |
| Badges | `Badge` + inline variants | Everywhere |

### 1.2 Pattern Usage Matrix

| Page | PageHeader | Search | Filter | IndexCard | SectionCard | Collapsible | CodeBlock | Table | EmptyState | LoadingState |
|------|------------|--------|--------|-----------|-----------|-------------|---------|-------|----------|------------|
| Home | Inline | SearchBox | - | Inline | - | - | - | - | - | - |
| Problem Index | Inline | Inline | Inline | - | - | - | - | - | Inline | Inline |
| Models | Inline | - | - | - | - | - | - | - | - | - |
| Packages | Inline | - | - | - | - | - | CodeBlock | - | - | - |
| Workflows | Inline | - | - | - | - | - | CodeBlock | - | - | - |
| Patterns | Inline | Inline | FilterBar | - | - | - | CodeBlock | - | Inline | - |
| Cheatsheets | Inline | - | - | - | - | - | CodeBlock | - | - | - |
| Decision Guides | Inline | - | - | - | Inline | - | - | Inline | - | - |
| Debug Guides | Inline | - | - | - | - | - | Inline | - | - | - |
| Principles | Inline | - | - | - | - | - | - | - | - | - |
| Registry | Inline | - | - | - | - | - | - | - | Inline | - |

---

## Part 2: Canonical Component Library

### 2.1 Design Tokens (CSS Variables)

```css
/* Add to globals.css */
:root {
  /* Spacing */
  --space-xs: 0.25rem;    /* 4px */
  --space-sm: 0.5rem;     /* 8px */
  --space-md: 0.75rem;    /* 12px */
  --space-lg: 1rem;       /* 16px */
  --space-xl: 1.5rem;     /* 24px */
  --space-2xl: 2rem;     /* 32px */
  
  /* Typography Scale */
  --text-page-title: 1.5rem;     /* 24px */
  --text-section-title: 1.125rem; /* 18px */
  --text-card-title: 0.875rem;   /* 14px */
  --text-body: 0.875rem;         /* 14px */
  --text-caption: 0.75rem;       /* 12px */
  --text-label: 0.6875rem;       /* 11px */
  --text-metadata: 0.6875rem;    /* 11px */
  
  /* Code Block */
  --code-font-size: 0.8125rem;    /* 13px */
  --code-line-height: 1.5;
  --code-padding: 0.75rem;
}
```

### 2.2 Component Specifications

#### 2.2.1 `<PageHeader />`

```tsx
// components/shared/PageHeader.tsx
interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  stats?: Array<{ label: string; value: string | number }>;
}

// Visual spec:
// - Title: text-2xl font-bold tracking-tight
// - Description: text-sm text-muted-foreground mt-1 max-w-2xl
// - Icon: w-5 h-5 text-primary (optional)
// - Stats: inline flex items with text-[10px] font-mono
```

**Files to migrate:** All index pages, all detail pages

#### 2.2.2 `<IndexCard />`

```tsx
// components/shared/IndexCard.tsx
interface IndexCardProps {
  href: string;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  metadata?: string;
  icon?: React.ReactNode;
}

// Visual spec:
// - Container: block rounded-lg border border-border bg-card p-4
// - Hover: hover:border-foreground/20 hover:bg-muted/30
// - Title: text-sm font-medium
// - Description: text-xs text-muted-foreground mt-1 line-clamp-2
// - Metadata: text-[10px] font-mono text-muted-foreground shrink-0
```

**Files to migrate:** All index pages

#### 2.2.3 `<SearchBox />` (Enhance Existing)

```tsx
// components/shared/SearchBox.tsx
// Keep existing, add:
// - Consistent height: h-9 (py-2)
// - Consistent focus: focus:ring-2 focus:ring-primary
// - Export as reusable with variants
```

**Files to migrate:** PatternFilterClient, ProblemIndexDashboard

#### 2.2.4 `<FilterBar />` (Enhance Existing)

```tsx
// components/shared/FilterBar.tsx
// Add variants:
// - FilterChip for single-select
// - FilterGroup for multi-select dropdowns
// - FilterButton for action buttons
```

**Files to migrate:** ProblemIndexDashboard

#### 2.2.5 `<CodeBlock />` (CRITICAL - Unify All)

```tsx
// components/shared/CodeBlock.tsx
interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  collapsible?: boolean;
  maxLines?: number;
  variant?: 'code' | 'terminal' | 'diff';
}

// Visual spec:
// Container:
//   - Border radius: rounded-md
//   - Border: border border-border
//   - Background: bg-card (light), bg-zinc-950 (dark)
//   - Margin: my-2
//   - Font: font-mono
//
// Header:
//   - Height: h-8
//   - Padding: px-3 py-1.5
//   - Border: border-b border-border
//   - Background: bg-muted/30 (light), bg-zinc-900/50 (dark)
//   - Text: text-[10px] font-sans font-medium uppercase tracking-wider
//
// Body:
//   - Font size: text-xs
//   - Line height: leading-relaxed
//   - Padding: p-3 (no line numbers), pl-2 pr-4 py-3 (with line numbers)
//   - Overflow: max-md:whitespace-pre-wrap max-md:break-words md:overflow-x-auto
//
// Language Badge:
//   - Icon: w-3.5 h-3.5
//   - Text: text-[10px] font-sans font-medium uppercase tracking-wider
//
// Copy Button:
//   - Position: right side of header
//   - Icon: w-3.5 h-3.5
//   - Animation: 200ms ease-in-out
//
// Terminal Variant:
//   - Green accent color for prompt
//   - No line numbers by default
//
// Diff Variant:
//   - Green for additions
//   - Red for deletions
//   - No line numbers
```

**Files to migrate:** 
- `CodeBlockInteractive.tsx` (merge into CodeBlock)
- `Prose.tsx` (use CodeBlock for pre elements)
- `ProseClient.tsx` (use CodeBlock for pre elements)
- `app/debug-guides/[id]/page.tsx` (replace inline pre)
- `components/shared/PackageTaskList.tsx` (replace inline pre)
- `components/shared/WorkflowStepList.tsx` (already using CodeBlockInteractive)

#### 2.2.6 `<EmptyState />`

```tsx
// components/shared/EmptyState.tsx
interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

// Visual spec:
// - Container: p-8 text-center border border-border rounded-lg bg-card
// - Title: text-sm text-muted-foreground
// - Description: text-xs text-muted-foreground/60 mt-1
```

**Files to migrate:** PatternFilterClient, ProblemIndexDashboard, RegistryPage

#### 2.2.7 `<LoadingState />`

```tsx
// components/shared/LoadingState.tsx
interface LoadingStateProps {
  message?: string;
}

// Visual spec:
// - Container: p-8 text-center
// - Spinner: h-8 w-8 border-b-2 border-primary
// - Text: text-xs text-muted-foreground mt-2
```

**Files to migrate:** ProblemIndexPage

#### 2.2.8 `<DataTable />` (Enhance Existing)

```tsx
// components/shared/DataTable.tsx
// Keep existing, ensure:
// - Consistent padding: p-3
// - Consistent header: bg-muted/40 uppercase
```

**Files to migrate:** DecisionGuidePage, CheatsheetPage

#### 2.2.9 `<SectionCard />` (Enhance Existing)

```tsx
// components/shared/SectionCard.tsx
// Add variants:
// - Compact (p-3)
// - Standard (p-4)
// - With footer
```

**Files to migrate:** All pages using inline section styling

#### 2.2.10 `<Badge />` Variants

```tsx
// components/ui/badge.tsx
// Add semantic variants:
// - status: Production/Experimental/Deprecated
// - difficulty: Beginner/Intermediate/Advanced
// - metadata: General purpose
// - content-type: Workflow/Pattern/Guide
// - metric: Numeric values
```

**Files to migrate:** All pages using inline badge styling

---

## Part 3: Code Block System Specification (CRITICAL)

### 3.1 Code Block Types

| Type | Use Case | Visual Distinction |
|------|----------|------------------|
| `code` | Python, TypeScript, JSON, etc. | Standard dark background |
| `terminal` | Bash, shell commands | Green accent (#22c55e) |
| `diff` | Git diffs, changes | Green/red for +/- |

### 3.2 Code Block Features

| Feature | Specification |
|---------|---------------|
| **Copy Button** | Always visible on desktop, always visible on mobile |
| **Copy Animation** | 200ms ease-in-out, checkmark on success |
| **Line Count Badge** | `text-[9px] font-mono` in header |
| **Language Label** | Icon + text, `text-[10px] uppercase` |
| **Filename** | Optional, replaces language label |
| **Line Numbers** | Right-aligned, muted color, 2.5ch min-width |
| **Mobile Wrapping** | Wrap on mobile, scroll on desktop |
| **Collapse** | Auto-collapse >30 lines, "Show More" button |
| **Theme Toggle** | Sun/Moon icon in header (optional) |
| **Syntax Theme** | github-dark (dark), github-light (light) |

### 3.3 Code Block CSS Classes

```css
.code-block-container {
  @apply rounded-md border border-border my-2 font-mono;
}

.code-block-header {
  @apply flex items-center justify-between px-3 py-1.5 border-b border-border;
  @apply bg-muted/30 dark:bg-zinc-900/50;
  @apply text-[10px] font-sans font-medium uppercase tracking-wider;
}

.code-block-body {
  @apply text-xs leading-relaxed;
  @apply p-3 max-md:whitespace-pre-wrap max-md:break-words md:overflow-x-auto;
}

.code-block-body-with-lines {
  @apply pl-2 pr-4 py-3;
}
```

---

## Part 4: Migration Roadmap

### Phase 1: Design Foundation (1-2 days)

**Goal:** Create design tokens and enhance existing components

**Tasks:**
1. Add CSS variables to `globals.css`
2. Enhance `CodeBlock` to support all variants
3. Enhance `SearchBox` with consistent API
4. Enhance `FilterBar` with sub-components
5. Create `EmptyState` component
6. Create `LoadingState` component

**Files to create/modify:**
- `app/globals.css`
- `components/shared/CodeBlock.tsx`
- `components/shared/CodeBlockInteractive.tsx`
- `components/shared/Prose.tsx`
- `components/shared/SearchBox.tsx`
- `components/shared/FilterBar.tsx`
- `components/shared/EmptyState.tsx` (new)
- `components/shared/LoadingState.tsx` (new)

**Regression rules:**
- No changes to data files
- No changes to routing
- No changes to type definitions

### Phase 2: Shared Component Library (2-3 days)

**Goal:** Create reusable components for all patterns

**Tasks:**
1. Create `PageHeader` component
2. Create `IndexCard` component
3. Create `SectionCard` variants
4. Create `Badge` semantic variants
5. Create `DataTable` standard
6. Create `CodeBlock` variants (terminal, diff)

**Files to create:**
- `components/shared/PageHeader.tsx`
- `components/shared/IndexCard.tsx`
- `components/shared/SectionCardCompact.tsx` (or add variant)
- `components/ui/BadgeStatus.tsx`
- `components/ui/BadgeDifficulty.tsx`
- `components/ui/BadgeMetadata.tsx`

**Regression rules:**
- No changes to existing component APIs
- Add variants, don't break existing usage

### Phase 3: Page Migration (3-4 days)

**Goal:** Replace inline patterns with shared components

**Order (lowest risk first):**

1. **Index Pages** (use `IndexCard`, `PageHeader`)
   - `app/packages/page.tsx`
   - `app/workflows/page.tsx`
   - `app/patterns/page.tsx`
   - `app/cheatsheets/page.tsx`
   - `app/decision-guides/page.tsx`
   - `app/debug-guides/page.tsx`
   - `app/principles/page.tsx`

2. **Detail Pages** (use `CodeBlock`, `SectionCard`)
   - `app/packages/[id]/page.tsx`
   - `app/models/[category]/[id]/page.tsx`
   - `app/workflows/[id]/page.tsx`
   - `app/patterns/[id]/page.tsx`
   - `app/decision-guides/[id]/page.tsx`
   - `app/debug-guides/[id]/page.tsx`
   - `app/cheatsheets/[id]/page.tsx`
   - `app/principles/[id]/page.tsx`

3. **Special Pages** (use `EmptyState`, `LoadingState`)
   - `app/problem-index/page.tsx`
   - `app/registry/page.tsx`

**Regression rules:**
- Only replace inline patterns
- Do not change content or data
- Do not change routing

### Phase 4: Micro UX Polish (1-2 days)

**Goal:** Ensure consistent interactions

**Tasks:**
1. Hover states for all interactive elements
2. Focus states for keyboard navigation
3. Animation timing (200ms ease-in-out)
4. Mobile responsiveness verification
5. Dark mode verification

**Files to verify:**
- All migrated pages
- All shared components

---

## Part 5: Component-to-Page Mapping

### 5.1 Current vs Target

| Page | Current Patterns | Target Components |
|------|-----------------|-------------------|
| Home | Inline cards, inline search | `IndexCard`, `PageHeader`, `SearchBox` |
| Problem Index | Inline search, inline filters, inline cards | `PageHeader`, `SearchBox`, `FilterBar`, `EmptyState`, `LoadingState` |
| Models | Inline header | `PageHeader` |
| Packages | Inline header, inline cards | `PageHeader`, `IndexCard` |
| Workflows | Inline header, inline cards | `PageHeader`, `IndexCard` |
| Patterns | Inline header, inline search, `FilterBar` | `PageHeader`, `SearchBox`, `FilterBar`, `IndexCard` |
| Cheatsheets | Inline header, inline cards | `PageHeader`, `IndexCard` |
| Decision Guides | Inline header, inline cards | `PageHeader`, `IndexCard` |
| Debug Guides | Inline header, inline cards | `PageHeader`, `IndexCard` |
| Principles | Inline header, inline cards | `PageHeader`, `IndexCard` |
| Registry | Inline header, inline cards | `PageHeader`, `IndexCard` |

### 5.2 Detail Pages

| Page | Current Patterns | Target Components |
|------|-----------------|-------------------|
| Package Detail | `CodeBlock`, inline sections | `PageHeader`, `CodeBlock`, `SectionCard` |
| Model Detail | `CodeBlock`, `SectionCard` | `PageHeader`, `CodeBlock`, `SectionCard` |
| Workflow Detail | `CodeBlock`, inline sections | `PageHeader`, `CodeBlock`, `SectionCard` |
| Pattern Detail | `CodeBlock`, inline sections | `PageHeader`, `CodeBlock`, `SectionCard` |
| Decision Guide Detail | Inline sections, inline tables | `PageHeader`, `CodeBlock`, `SectionCard`, `DataTable` |
| Debug Guide Detail | Inline pre, inline sections | `PageHeader`, `CodeBlock`, `SectionCard` |
| Cheatsheet Detail | `CodeBlock`, inline sections | `PageHeader`, `CodeBlock`, `SectionCard` |
| Principle Detail | Inline sections | `PageHeader`, `CodeBlock`, `SectionCard` |

---

## Part 6: Regression Rules

### 6.1 Files That MUST NOT Change

- `app/layout.tsx` - Root layout structure
- `lib/data.ts` - Data loading functions
- `lib/search.ts` - Search functionality
- `lib/relationships.ts` - Relationship resolution
- `types/*.ts` - Type definitions
- `data/**/*.json` - Content data files
- `schema/*.json` - Schema definitions
- `public/search-index.json` - Search index

### 6.2 Architectures That MUST NOT Change

- Next.js App Router file structure
- Component file organization
- Data loading patterns
- Search index structure
- Relationship linking system

### 6.3 Content That MUST NOT Change

- All content type boundaries
- All relationship mappings
- All cross-reference systems
- All markdown content rendering

---

## Part 7: Implementation Instructions

### 7.1 Code Block Unification (CRITICAL)

**Step 1: Enhance CodeBlock component**

```tsx
// components/shared/CodeBlock.tsx
// Add variant support:
export async function CodeBlock({
  code,
  language = 'python',
  filename,
  showLineNumbers = false,
  variant = 'code',
  collapsible = true,
}: CodeBlockProps & { variant?: 'code' | 'terminal' | 'diff' }) {
  // ... existing logic
  // Add variant-specific styling
}
```

**Step 2: Update Prose to use CodeBlock**

```tsx
// components/shared/Prose.tsx
// In pre component:
<div className="rounded-md border border-border my-2 font-mono">
  <CodeBlock code={codeText} language={language} />
</div>
```

**Step 3: Replace inline pre elements**

```tsx
// app/debug-guides/[id]/page.tsx
// Replace:
<pre className="text-xs font-mono bg-muted/50 ...">
// With:
<CodeBlock code={test.command} language="bash" variant="terminal" />
```

### 7.2 PageHeader Creation

```tsx
// components/shared/PageHeader.tsx
export default function PageHeader({ 
  title, 
  description, 
  icon,
  actions,
  stats 
}: PageHeaderProps) {
  return (
    <header className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {icon && <span className="mr-2">{icon}</span>}
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {actions}
      </div>
      {stats && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {stats.map(stat => (
            <span key={stat.label}>
              {stat.value} {stat.label}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
```

### 7.3 IndexCard Creation

```tsx
// components/shared/IndexCard.tsx
export default function IndexCard({
  href,
  title,
  description,
  badge,
  metadata,
  icon
}: IndexCardProps) {
  return (
    <Link href={href} className="block rounded-lg border border-border bg-card p-4 hover:border-foreground/20 hover:bg-muted/30 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-medium text-foreground">{title}</h2>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>
        {metadata && (
          <span className="shrink-0 text-[10px] font-mono text-muted-foreground">
            {metadata}
          </span>
        )}
      </div>
      {badge && <div className="mt-2">{badge}</div>}
    </Link>
  );
}
```

---

## Part 8: Testing Matrix

| Test Case | Expected Result | Components to Verify |
|-----------|-----------------|-------------------|
| All index pages | Use `PageHeader` and `IndexCard` | All index pages |
| All detail pages | Use `CodeBlock` for all code | All detail pages |
| All code blocks | Consistent styling across types | CodeBlock component |
| All search inputs | Use `SearchBox` component | All pages with search |
| All filters | Use `FilterBar` components | All pages with filters |
| All empty states | Use `EmptyState` component | All pages with empty state |
| All loading states | Use `LoadingState` component | All pages with loading |
| All tables | Use `DataTable` component | All pages with tables |
| All badges | Use semantic badge variants | All pages with badges |

---

## Part 9: Success Metrics

After migration:

1. **Component Reuse:** 90%+ of UI patterns use shared components
2. **CSS Class Duplication:** <10% of pages have inline Tailwind for patterns
3. **Code Block Consistency:** 100% of code blocks use `CodeBlock` component
4. **Visual Regression:** Zero unintended visual changes
5. **Build Time:** No significant change
6. **Bundle Size:** <10% increase

---

**End of Document**