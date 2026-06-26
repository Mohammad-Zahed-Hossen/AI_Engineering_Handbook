# AENS UI/UX — Pareto Audit & Implementation Prompts

## What I read before writing this

Every page component, every shared component, globals.css, the sidebar,
the search box, the code block, the cheatsheet table, the package task cards,
the model page, the workflow page, the TOC, and the ContentPageLayout.

---

## The Pareto Finding

After reading the full codebase, 80% of the daily friction comes from exactly
four things:

1. **The cheatsheet table is unreadable.** Four columns of equal width crammed
   with prose, code, and bugs simultaneously. This is the worst page in the app.

2. **Package task cards have no visual separation between tasks.** At 8+ tasks
   per package, reading one task bleeds into the next. The `space-y-6` gap
   is not enough when every task card is the same card.

3. **The sidebar only auto-expands the current section, but never auto-scrolls
   the active item into view.** When you have 20+ packages, the active link
   is off-screen. You must scroll the sidebar manually every navigation.

4. **There is no keyboard shortcut to focus search.** In a reference tool used
   for hours daily, reaching for the mouse to click the search bar is constant
   friction. VS Code, DevDocs, Dash, Obsidian — all use `/` or `Cmd+K`.

Everything else — typography, spacing, colors, badges, the model page, the
workflow page, the TOC — is already well-designed and should not be changed.
The model page Use/Avoid layout is clean. The workflow step list is readable.
The TOC is correct. The code block is functional.

The four above are the 20% of changes that deliver 80% of the improvement.

---

## UI Phase 1 — Keyboard Search Shortcut

**Impact: High. Effort: 30 minutes.**

Every navigation in the app starts with search. Removing the mouse click
from that workflow compounds across thousands of sessions.

---

```
You are working on the AENS project at D:\Project\ai-engineering-handbook.

This is a small, targeted change. Touch only the files listed below.

## What to build

Add a global keyboard shortcut that focuses the search input when the user
presses `/` (forward slash) while NOT focused on any input or textarea.

This is the standard shortcut used by GitHub, Linear, DevDocs, and VS Code.

## File to change: `components/shared/SearchBox.tsx`

The input element already has `id={inputId}` and is of type `search`.

Add a `useEffect` inside the SearchBox component that:

1. Listens for `keydown` on `window`
2. If the pressed key is `'/'`
3. AND the active element is NOT an input, textarea, or [contenteditable]
4. Prevents the default browser behavior (which would type "/" into an input)
5. Focuses the search input using `document.getElementById(inputId)`

```typescript
useEffect(() => {
  function handleGlobalKeyDown(e: KeyboardEvent) {
    if (e.key !== '/') return;
    const tag = (document.activeElement as HTMLElement)?.tagName?.toLowerCase();
    const isEditable = (document.activeElement as HTMLElement)?.isContentEditable;
    if (tag === 'input' || tag === 'textarea' || isEditable) return;
    e.preventDefault();
    document.getElementById(inputId)?.focus();
  }
  window.addEventListener('keydown', handleGlobalKeyDown);
  return () => window.removeEventListener('keydown', handleGlobalKeyDown);
}, [inputId]);
```

Also add a small keyboard hint inside the search input wrapper so users
discover the shortcut exists. Place this OUTSIDE and BELOW the input element,
only when the input is NOT focused and the query is empty:

Add a `focused` state:
```typescript
const [focused, setFocused] = useState(false);
```

Add `onFocus={() => setFocused(true)}` and `onBlur={() => setFocused(false)}`
to the `<input>` element.

Then after the closing `</div>` of the dropdown (the `absolute z-20` div),
add this hint:

```tsx
{!focused && !query && (
  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
    <kbd className="text-[9px] font-mono text-muted-foreground/50 border border-border/50 rounded px-1 py-0.5">
      /
    </kbd>
  </div>
)}
```

Note: the input wrapper `div` needs `relative` positioning for this to work.
The outer wrapper already has `relative` — confirm the `<input>` is inside
the same relative container as the kbd hint.

## Constraints

- Do NOT change the search logic, results rendering, or keyboard navigation
  within the results list (arrow keys, enter, escape — leave those unchanged)
- Do NOT add any npm packages
- Do NOT change any other component

## Verification

1. On any page, press `/` — the search input gets focus
2. While typing in the search input, pressing `/` types normally (no hijack)
3. The `/` kbd hint is visible inside the search bar when unfocused
4. The hint disappears when the input is focused
5. Escape still clears the search and defocuses
```

---

## UI Phase 2 — Sidebar Active Item Auto-Scroll

**Impact: High. Effort: 45 minutes.**

When the sidebar has 20+ packages and you navigate to NumPy, the active
item is off-screen. You must manually scroll the sidebar every time.
This is friction that repeats on every navigation.

---

```
You are working on the AENS project at D:\Project\ai-engineering-handbook.

Touch only `components/layout/Sidebar.tsx`.

## The problem

When navigating to a package, model, workflow, or cheatsheet, the sidebar
auto-expands the correct section (this already works). However, the active
link is often outside the visible scroll area of the sidebar. The user must
manually scroll the sidebar to see which item is highlighted.

## What to build

Add a `useEffect` that runs whenever `pathname` changes and scrolls the
active sidebar link into view.

The active link is any `<a>` or `<Link>` element inside the sidebar `<aside>`
that has the `bg-primary` class (which your existing `linkClass()` applies
when `pathname === href`).

```typescript
const sidebarRef = useRef<HTMLElement>(null);

useEffect(() => {
  if (!sidebarRef.current) return;
  // Small delay to allow the expand animation to render the active item
  const timer = setTimeout(() => {
    const active = sidebarRef.current?.querySelector('[class*="bg-primary"]');
    active?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, 50);
  return () => clearTimeout(timer);
}, [pathname]);
```

Attach `ref={sidebarRef}` to the `<aside>` element.

Import `useRef` from React (it is already imported alongside `useState`).

## Constraints

- Do NOT change any visual styling
- Do NOT change the expand/collapse logic
- Do NOT change the link rendering
- The scroll must be `behavior: 'instant'` — not smooth, which causes
  a jarring slide every navigation

## Verification

1. Navigate to a package near the bottom of the list (e.g. Polars)
2. The sidebar automatically scrolls so the active item is visible
3. The behavior is instant, not animated
4. Collapsing and expanding sections still works identically
```

---

## UI Phase 3 — Cheatsheet Entry Cards (Replacing the Table)

**Impact: Very high. Effort: 2–3 hours.**

This is the highest-priority change in the entire UI. The current cheatsheet
is a dense 4-column table where all content — problem, trigger, code, notes,
bug — is rendered at the same visual weight. After reading 3 rows your eyes
lose track of which row you are in. After 10 rows it becomes painful.

The fix: replace the table with a card-per-entry layout. Each entry becomes
a self-contained unit with clear internal hierarchy: Problem (large) → Trigger
→ Code snippet → Notes → Bug.

---

```
You are working on the AENS project at D:\Project\ai-engineering-handbook.

Touch only `app/cheatsheets/[id]/page.tsx`.

## What to build

Replace the current table layout for cheatsheet entries with a card-per-entry
layout. Do NOT create a new component file — implement it inline in this page.

## Current structure (remove this)

The current code renders a single `<table>` with 4 columns:
Problem | Trigger | Snippet | Notes

This is being replaced entirely.

## New structure

Replace the entire `<section id="cheatsheet">` content (the rounded-lg border
div containing the table) with this card grid:

```tsx
<div className="space-y-3">
  {cheatsheet.entries.map((entry, idx) => (
    <div
      key={idx}
      className="rounded-lg border border-border bg-card overflow-hidden"
    >
      {/* Entry header — Problem statement */}
      <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex items-start justify-between gap-4">
        <p className="text-sm font-semibold text-foreground leading-snug">
          {entry.problem}
        </p>
        <span className="shrink-0 text-[9px] font-mono text-muted-foreground/60 pt-0.5">
          #{idx + 1}
        </span>
      </div>

      {/* Entry body */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] divide-y lg:divide-y-0 lg:divide-x divide-border">
        
        {/* Left: Trigger + Notes + Bug */}
        <div className="p-4 space-y-3">
          {entry.trigger && (
            <div>
              <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                When to use
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {entry.trigger}
              </p>
            </div>
          )}
          {entry.minimal_notes && (
            <div>
              <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Note
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {entry.minimal_notes}
              </p>
            </div>
          )}
          {entry.common_bug && (
            <div className="rounded border-l-2 border-amber-500 bg-amber-500/5 px-3 py-2">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                Common bug
              </span>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                {entry.common_bug}
              </p>
            </div>
          )}
          {entry.docs_url && (
            <a
              href={entry.docs_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-primary hover:underline block"
            >
              Docs ↗
            </a>
          )}
        </div>

        {/* Right: Code snippet */}
        <div className="p-4">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
            Snippet
          </span>
          <div className="relative rounded-md bg-zinc-950 border border-zinc-800 font-mono">
            <pre className="overflow-x-auto p-3 text-[11px] text-zinc-200 leading-relaxed">
              <code>{entry.snippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
```

Also update the TOC for the cheatsheet page. Currently it has only one item
`{ id: 'cheatsheet', label: 'Cheatsheet' }`. If the cheatsheet has more than
6 entries, the single TOC item is useless. Replace it with entry-level TOC
items based on the first 4 words of each entry's `problem` field:

```typescript
const toc = cheatsheet.entries.length <= 1
  ? [{ id: 'cheatsheet', label: 'Cheatsheet' }]
  : [
      { id: 'cheatsheet-header', label: cheatsheet.name },
      ...cheatsheet.entries.slice(0, 12).map((entry, idx) => ({
        id: `entry-${idx}`,
        label: entry.problem.split(' ').slice(0, 4).join(' '),
      })),
    ];
```

Add `id={`entry-${idx}`}` and `className="scroll-mt-24"` to each entry's
outer `<div>` (the `rounded-lg border border-border bg-card overflow-hidden` div).

Add `id="cheatsheet-header"` and `className="scroll-mt-24"` to the
`<section id="cheatsheet">` element — change its id to `"cheatsheet-header"`.

## Constraints

- Do NOT create a new component file — all changes stay in this page file
- Do NOT change the Cheatsheet data type or schema
- Do NOT add any npm packages
- The existing `CodeBlock` component is NOT used here — use an inline `<pre>`
  to avoid the copy button overhead per entry. Users can select-copy.
  (If you want to add a copy button later, that is a separate phase.)
- `npm run build` must pass

## Verification

1. Each cheatsheet entry renders as a self-contained card
2. The problem statement is visually prominent (larger, bold, in the header)
3. The common_bug callout uses amber styling (matching the existing gotchas style)
4. The code snippet is in a dark block on the right column on large screens,
   and stacks below on small screens
5. The TOC shows entry-level items when there are more than 1 entry
6. Clicking a TOC item scrolls to the correct entry card
```

---

## UI Phase 4 — Package Task Anchored Section Headers

**Impact: High. Effort: 1–2 hours.**

The package page renders tasks as `SectionCard` components with `space-y-6`
between them. When a package has 8–10 tasks, they blur together during
reading. The active task is not visually distinct from the others. After
scrolling for 30 seconds you lose your place.

The fix is minimal: add a numbered step indicator and a subtle top border
accent to each task, and make the mental trigger visually distinct from the
task title. No new layout — just clearer visual separation within the
existing card structure.

---

```
You are working on the AENS project at D:\Project\ai-engineering-handbook.

Touch only `app/packages/[id]/page.tsx`.

## The problem

Package tasks render as identical cards stacked vertically. With 8+ tasks,
the user loses visual context of "which task am I reading" during scroll.

## What to change

### Change 1 — Task section header

The current SectionCard receives:
```
title={task.task}
subtitle={`Mental trigger: ${task.mental_trigger}`}
```

The subtitle is rendering the mental trigger in the same tiny `text-[10px]`
muted style as version numbers. It looks like metadata, not guidance.

Replace the SectionCard usage for each task with a direct `<section>` element
that has richer header structure:

Replace:
```tsx
<SectionCard
  key={task.task}
  title={task.task}
  subtitle={`Mental trigger: ${task.mental_trigger}`}
>
  <div id={taskAnchor} className="space-y-4 scroll-mt-24">
    {/* ...content */}
  </div>
</SectionCard>
```

With:
```tsx
<section
  key={task.task}
  id={taskAnchor}
  className="scroll-mt-24 rounded-lg border border-border bg-card overflow-hidden"
>
  {/* Task header */}
  <div className="px-4 py-3 border-b border-border bg-muted/20 flex items-start gap-3">
    <span className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded border border-border bg-background text-[9px] font-mono font-semibold text-muted-foreground select-none">
      {pkg.tasks.indexOf(task) + 1}
    </span>
    <div className="min-w-0">
      <h2 className="text-sm font-semibold text-foreground leading-snug">
        {task.task}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
        <span className="font-medium text-foreground/70">When: </span>
        {task.mental_trigger}
      </p>
    </div>
  </div>

  {/* Task body */}
  <div className="p-4 space-y-4">
    {/* All existing task content goes here unchanged */}
    {/* The grid with Syntax + Example */}
    {/* The grid with params, use_when, avoid_when */}
    {/* Decision notes */}
    {/* Gotchas */}
    {/* Official docs + related content */}
  </div>
</section>
```

### Change 2 — Increase visual gap between tasks

Change the outer wrapper from `space-y-6` to `space-y-4` but add a more
visible separator. The cards already have borders, so `space-y-4` with the
full border on each card is sufficient. The current `space-y-6` is creating
a large blank gap that is not helping — the separation comes from the card
border, not the space.

Change:
```tsx
<div className="space-y-6">
  {pkg.tasks.map(task => { ... })}
</div>
```

To:
```tsx
<div className="space-y-4">
  {pkg.tasks.map(task => { ... })}
</div>
```

### Change 3 — Mental trigger label in task header

The existing SectionCard subtitle says `"Mental trigger: ..."`.
In the new header, replace "Mental trigger" label with "When:" for brevity.
This matches the pattern used in the model page (Use When / Avoid When).

## Constraints

- Do NOT create any new component files
- Do NOT change the content or ordering of fields within the task body
- Do NOT change SectionCard.tsx — this page stops using SectionCard for tasks
  (SectionCard is still used on other pages, leave it)
- The `id` and `scroll-mt-24` behavior must be preserved for TOC links to work
- `npm run build` must pass

## Verification

1. Each task has a numbered indicator (1, 2, 3...) in its header
2. The mental trigger is visible in the header with "When:" prefix
3. TOC links still scroll to the correct task
4. The task body content (syntax, example, params, gotchas) is unchanged
5. No SectionCard is used for tasks — but the page still imports SectionCard
   if it is used elsewhere on the page (for the Workflow Steps section if
   applicable — check and keep any other usage)
```

---

## Summary

| Phase | What it fixes | Time | Impact |
|---|---|---|---|
| UI-1 | No keyboard shortcut to reach search | 30 min | High |
| UI-2 | Sidebar doesn't scroll active item into view | 45 min | High |
| UI-3 | Cheatsheet table is unreadable | 2–3 hrs | Very High |
| UI-4 | Package tasks blur together during long reads | 1–2 hrs | High |

## What is NOT being changed (and why)

| Element | Verdict |
|---|---|
| Model page layout | Already excellent. Use/Avoid split, Pros/Cons split, perf grid are all well-designed. |
| Workflow page | Steps with numbered circles and tool badges is correct. Failure points callout is correct. |
| TOC component | Works correctly. IntersectionObserver logic is solid. |
| CodeBlock | Functional. The dark bg on zinc-950 is readable. Copy button works. |
| Typography / spacing | Already at the right density. The `text-sm` / `text-xs` / `text-[10px]` hierarchy is consistent. |
| Color system | The oklch-based design tokens are clean. Dark mode is correct. |
| Breadcrumbs | Functional and unobtrusive. |
| Search dropdown | The highlight, badge, and summary layout is already clean. |
| Home page | Already compact and scannable. The grid cards are correct. |
| MetadataBadges | Correct. Low visual weight. |
| RelatedContent | Correct. Unobtrusive. |

After these four phases the interface is ready to freeze.
