Let me read every affected file before forming any opinion:Now I have read everything. Six problems, complete layout context, exact code. Here is the full diagnosis:

---

## Part A — Architecture Report

### Problem 1 — Package page: Official docs overflow + code blocks cut off

**Root cause: two separate issues sharing one symptom.**

**1a — OfficialResources link overflow**

`OfficialResources.tsx` renders a `<section>` with `rounded-lg border bg-card p-4`. Inside it, a `grid gap-3 sm:grid-cols-2`. Each cell contains an `<a>` with `inline-flex`. The link text is the raw hostname (`new URL(url).hostname`) — for example `numpy.org/doc/stable` is fine, but the actual sources in real data like `https://xgboost.readthedocs.io/en/stable/` produces just `xgboost.readthedocs.io` which is fine. **However**, the `<a>` has no `max-width`, no `overflow-hidden`, no `truncate`, and no `word-break`. Long hostnames like `scikit-learn.org` are short, but future sources pointing to things like `huggingface.co/docs/transformers/main/en/model_doc/bert` produce full-URL fallbacks when `new URL(url).hostname` fails on malformed URLs or when the URL includes a display path. The `inline-flex items-center gap-1` anchor will push past its grid cell boundary.

The deeper issue: `PackageTaskList.tsx` task body contains a plain `<a>` for `task.official_docs`:
```tsx
<a href={task.official_docs} target="_blank" ...>
  {task.official_docs}
</a>
```
This renders the **full raw URL** — `https://numpy.org/doc/stable/reference/generated/numpy.linalg.solve.html` — with no truncation, no `break-all`, no `overflow-hidden`. On a 294px content area (390px screen minus padding accumulation), this URL is 400+ characters that forces horizontal overflow of its parent container, which then stretches adjacent elements.

**1b — Code block cut off (confirmed from previous investigation)**

The `CodeBlock` outer div has `overflow-hidden` which clips the `<pre overflow-x-auto>` inside it. This was diagnosed in the previous session. The fix (remove `overflow-hidden`, add `z-10` to fade) is already defined. This confirms the previous diagnosis was correct — the two code issues are the same root cause.

**Fix for 1a:** In `PackageTaskList.tsx`, replace the raw URL `<a>` with hostname-only display text + `truncate`. In `OfficialResources.tsx`, add `truncate max-w-full` to each `<a>` tag.

---

### Problem 2 — Related Content broken navigation

**Root cause: `getContentPath()` in `lib/data.ts` returns `null` for content that doesn't exist yet, and `RelatedContent.tsx` correctly renders a non-linked `<span>` instead of `<Link>` in that case. This is correct behavior, not a bug.**

Reading `getContentPath()` and `uniqueExistingRefs()`:

```typescript
function uniqueExistingRefs(refs: ContentRef[], current?: ContentRef): ContentRef[] {
  return refs.filter(ref => {
    // ...
    if (isCurrent || seen.has(key) || !contentExists(ref.type, ref.id)) {
      return false;  // ← filters out non-existent content
    }
    // ...
  });
}
```

So references to non-existent content are already filtered out before reaching `RelatedContent`. The component then receives only valid refs and `getContentPath()` returns a real path for each.

**The actual navigation problem** is specifically the workflow `next_links` field. In `WorkflowDetailPage`, `next_links` bypasses `getRelatedContent()` entirely and renders directly:

```tsx
{workflow.next_links.map(wfId => {
  let name = wfId;
  try { name = getWorkflow(wfId).name; } catch { }
  return <Link key={wfId} href={`/workflows/${wfId}`} ...>
```

No existence check. If `fine-tuning-lora` doesn't exist yet as a file, `href="/workflows/fine-tuning-lora"` navigates to a 404. On a Next.js static export PWA, a 404 on a non-existent static page reloads the PWA shell from scratch — this explains the "restarts the PWA" behavior for related links.

**The same issue applies to `related_workflows` and `related_cheatsheets` inside `PackageTaskList.tsx`** which renders them as plain text strings, not checked links. These are raw IDs displayed as `task.related_workflows.join(', ')` — dead text, not navigation.

**Fix for Problem 2:** Add `contentExists('workflow', wfId)` guard to `next_links` rendering. Fix `related_workflows` and `related_cheatsheets` in task bodies to use `getContentPath` and render proper links or nothing.

---

### Problem 3 — Hyperparameters table: weak visual hierarchy

**Root cause: the 3-column table puts the most important information last.**

The current table: `Name | Default | Description`. On mobile the Description column is `text-muted-foreground` prose that wraps to multiple lines. The Name column is `text-primary font-mono` — good. But Default is `font-mono` plain text — weak.

**The scanning pattern for hyperparameters is not left-to-right.** The user scans vertically on `Name`, then decides if they need to tune it, then jumps to Default. Description is consulted last. The table forces linear reading.

**The correct replacement for mobile:** A card-per-hyperparam layout. Each card: name (primary, large, monospace) + default value (secondary, inline) + note (tertiary, smaller, muted). This is the same pattern as cheatsheet entries — problem → note → details.

On desktop, the table is fine — horizontal scanning across 3 columns on a wide screen is efficient. So the fix is: cards on mobile only (`md:hidden`), table on desktop (`hidden md:block`).

---

### Problem 4 — Model Detail: Quick Start needs higher priority

**Root cause: architectural position conflict between "teach" ordering and "use" ordering.**

The current page order is:
1. Header / Summary
2. Decision Guide (Use When / Avoid When)
3. Decision Notes
4. Pros & Cons
5. Performance Overview ← collapsible
6. Hyperparameters ← collapsible
7. Quick Start ← collapsible, at the bottom

The decision-guide-first ordering is correct for first-time study. But for return visits — which dominate after week 1 — the user already understands the model and needs Quick Start immediately.

**HCI principle: Recognition over Recall.** The user returns to a model page recognizing what it is. They need the code. They must scroll past sections they already know.

**The fix is not to move Quick Start in the DOM** — that would break first-visit experience. The correct fix is to make Quick Start open by default on mobile (change `const [codeOpen, setCodeOpen] = useState(false)` to `useState(true)` in `ModelCollapsibleSections.tsx`). This means on mobile, the user can scroll down and Quick Start is already open without interaction. Performance and Hyperparameters remain collapsed by default, reducing page height.

Additionally, Quick Start should appear in the `StickyActionBar` as a named section so the user can jump to it in one tap from anywhere on the page — which it already does via the TOC (`{ id: 'quick-start', label: 'Quick Start' }`). The issue is purely that it's collapsed by default, requiring a second tap after navigating to it.

---

### Problem 5 — Registry Links restart the PWA

**Root cause: confirmed. `target="_blank"` on external links from a PWA.**

In `registry/[task]/page.tsx`, every external link uses:
```tsx
<a href={m.link} target="_blank" rel="noopener noreferrer" ...>
```

On Chrome Android PWA, `target="_blank"` from within a PWA context opens the URL in a new Chrome tab. When this happens, Chrome sometimes collapses the PWA's background process to reclaim memory, especially during a long session. When the user returns to the PWA, Chrome restarts it from scratch. This is not a bug — it is correct PWA behavior — but it is perceived as "restarting."

The solution depends on intent. For registry links (HuggingFace model cards, GitHub repos), the user definitely wants to open the external URL and return to AENS. The least-friction pattern is `target="_blank"` but with explicit visual signaling so the user expects a tab switch, not a navigation.

The more robust fix: remove `target="_blank"` and let the link navigate within the PWA's web view. Chrome PWA will open external URLs in a custom tab (CCT — Chrome Custom Tab) which preserves the PWA instance. The user taps back and the PWA is still alive.

**Fix:** Remove `target="_blank" rel="noopener noreferrer"` from registry links. Plain `<a href={m.link}>` navigates via CCT on Android PWA, preserving the PWA session.

---

### Problem 6 — Workflow steps: too long on mobile

**Root cause: all step content is always fully expanded with no progressive disclosure.**

A 6-step RAG workflow with per-step `what`, `decision`, and 2 `failure_points` renders ~2,400px of content on mobile before reaching Common Failure Points. Each step is a full `<li>` with no collapse.

**The correct pattern for workflow steps is an accordion-per-step:** step number + name always visible, body collapses. But unlike package tasks, the user needs to see **all step names simultaneously** to understand the workflow shape. Collapsing collapses the body, not the step header.

The critical difference from package tasks: workflow steps are **sequential** — the user reads them in order, not randomly. This means the appropriate default state is: Step 1 expanded, Steps 2–N collapsed. As the user completes reading step 1, they tap to expand step 2.

This is progressive disclosure aligned with reading direction, not arbitrary collapse. It also means the user can see all 6 step headers simultaneously in ~300px of vertical space, giving them the full workflow map before diving into any step.

---

## Part B — Implementation Prompts

---

### Phase 1 — Critical Mobile Bugs (do first, zero risk)

```
You are working on D:\Project\ai-engineering-handbook.

## Problem A — Official docs URL overflows on mobile

FILE TO MODIFY: components/shared/PackageTaskList.tsx

In the task body, find the Official Docs section:

  
    href={task.official_docs}
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm text-primary hover:underline"
  >
    {task.official_docs}
  </a>

Replace with:

  
    href={task.official_docs}
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm text-primary hover:underline break-all"
  >
    {(() => {
      try {
        const url = new URL(task.official_docs);
        return url.hostname + url.pathname.replace(/\/$/, '');
      } catch {
        return task.official_docs;
      }
    })()}
  </a>

This renders hostname+path instead of the full URL, with break-all as
a safety net for any URL that is still too long.

## Problem B — OfficialResources link truncation

FILE TO MODIFY: components/shared/OfficialResources.tsx

Find the linkClass definition:

  const linkClass =
    'inline-flex items-center gap-1 text-xs font-medium text-foreground underline-offset-4 hover:underline';

Change to:

  const linkClass =
    'inline-flex items-center gap-1 text-xs font-medium text-foreground underline-offset-4 hover:underline truncate max-w-full';

## Problem C — Registry links restart PWA

FILE TO MODIFY: app/registry/[task]/page.tsx

This file has two places where external registry links are rendered:
one in the mobile card view and one in the desktop table view.

In BOTH places, find:
  
    href={m.link}
    target="_blank"
    rel="noopener noreferrer"
    className="..."
  >

Remove target="_blank" and rel="noopener noreferrer" from BOTH link
elements (mobile card and desktop table).

The result:
  <a href={m.link} className="...">

On Chrome Android PWA, links without target="_blank" open via Chrome
Custom Tab (CCT), which preserves the PWA session on return.
On desktop browser, the link navigates in the same tab — acceptable
for an external reference tool.

DO NOT TOUCH:
- OfficialResources.tsx target="_blank" links (docs/papers/github — keep
  these as _blank since they are reference material, not registry lookups)
- Any other page file
- Any schema or data file

## Acceptance criteria

1. On mobile, task official_docs URLs show hostname+path, not full URL
2. No OfficialResources link overflows its grid cell
3. Registry links open without restarting the PWA on Android Chrome
4. npm run build passes

## Regression checklist

- [ ] Official docs link still navigates to the correct URL
- [ ] OfficialResources section renders correctly for all source types
- [ ] Registry "View →" link opens the correct external URL
- [ ] Desktop registry table links still work
- [ ] Mobile registry cards still work
```

---

### Phase 2 — Related Content Wiring

```
You are working on D:\Project\ai-engineering-handbook.

## Problem

Workflow next_links render without existence checking. If a referenced
workflow doesn't exist as a JSON file, the Link navigates to a 404,
which on a PWA can trigger a full reload.

PackageTaskList renders related_workflows and related_cheatsheets as
plain text (ID strings joined by comma), not as navigation links.

## FILE TO MODIFY: app/workflows/[id]/page.tsx

Import contentExists and getContentPath at the top (they are exported
from @/lib/data — check existing imports and add if not already there):

  import { getAllWorkflowIds, getWorkflow, getRelatedContent, contentExists, getContentPath } from '@/lib/data';

Find the next_links render block:

  {workflow.next_links && workflow.next_links.length > 0 && (
    <div className="space-y-2">
      <span ...>Next Workflow</span>
      <div className="flex flex-wrap gap-2">
        {workflow.next_links.map(wfId => {
          let name = wfId;
          try {
            name = getWorkflow(wfId).name;
          } catch { }
          return (
            <Link key={wfId} href={`/workflows/${wfId}`} ...>
              {name} →
            </Link>
          );
        })}
      </div>
    </div>
  )}

Replace with:

  {workflow.next_links && workflow.next_links.length > 0 && (() => {
    const validLinks = workflow.next_links
      .filter(wfId => contentExists('workflow', wfId))
      .map(wfId => {
        let name = wfId;
        try { name = getWorkflow(wfId).name; } catch { }
        return { id: wfId, name };
      });
    if (!validLinks.length) return null;
    return (
      <div className="space-y-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
          Next Workflow
        </span>
        <div className="flex flex-wrap gap-2">
          {validLinks.map(({ id: wfId, name }) => (
            <Link
              key={wfId}
              href={`/workflows/${wfId}`}
              className="inline-flex items-center gap-1.5 rounded border border-border bg-muted/40 
                         px-3 py-1.5 text-xs font-medium text-foreground 
                         hover:bg-muted hover:border-foreground/20 transition-colors"
            >
              {name} →
            </Link>
          ))}
        </div>
      </div>
    );
  })()}

## FILE TO MODIFY: components/shared/PackageTaskList.tsx

Import getContentPath and contentExists:

  import { getContentPath, contentExists } from '@/lib/data';

Wait — PackageTaskList is a CLIENT component ('use client'). 
getContentPath and contentExists call fs.existsSync which is Node-only.
They CANNOT be called from a client component.

The correct fix: resolve the related_workflows and related_cheatsheets
references in the SERVER component (app/packages/[id]/page.tsx) and
pass resolved links as props to PackageTaskList.

In app/packages/[id]/page.tsx, compute resolved task links server-side:

  import { getContentPath } from '@/lib/data';

  // Resolve task cross-references
  const resolvedTasks = pkg.tasks.map(task => ({
    ...task,
    related_workflow_links: task.related_workflows
      .map(id => ({ id, href: getContentPath('workflow', id) }))
      .filter(r => r.href !== null) as { id: string; href: string }[],
    related_cheatsheet_links: task.related_cheatsheets
      .map(id => ({ id, href: getContentPath('cheatsheet', id) }))
      .filter(r => r.href !== null) as { id: string; href: string }[],
  }));

Update PackageTaskList props interface to accept these resolved links:

  interface ResolvedRef { id: string; href: string }
  interface ResolvedTask extends Package['tasks'][number] {
    related_workflow_links: ResolvedRef[];
    related_cheatsheet_links: ResolvedRef[];
  }
  interface PackageTaskListProps {
    tasks: ResolvedTask[];
    packageName: string;
  }

In PackageTaskList, replace the existing related content render:

  {(task.related_workflows.length > 0 || task.related_cheatsheets.length > 0) && (
    <div>
      <h4 className="text-[11px] font-semibold uppercase text-muted-foreground mb-1">Related content</h4>
      <div className="space-y-1 text-sm text-muted-foreground">
        {task.related_workflows.length > 0 && (
          <p>Workflows: {task.related_workflows.join(', ')}</p>
        )}
        {task.related_cheatsheets.length > 0 && (
          <p>Cheatsheets: {task.related_cheatsheets.join(', ')}</p>
        )}
      </div>
    </div>
  )}

With:

  {(task.related_workflow_links.length > 0 || task.related_cheatsheet_links.length > 0) && (
    <div>
      <h4 className="text-[11px] font-semibold uppercase text-muted-foreground mb-1">
        Related content
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {task.related_workflow_links.map(ref => (
          
            key={ref.id}
            href={ref.href}
            className="inline-flex items-center rounded border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-foreground hover:bg-muted transition-colors"
          >
            workflow: {ref.id}
          </a>
        ))}
        {task.related_cheatsheet_links.map(ref => (
          
            key={ref.id}
            href={ref.href}
            className="inline-flex items-center rounded border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-foreground hover:bg-muted transition-colors"
          >
            cheatsheet: {ref.id}
          </a>
        ))}
      </div>
    </div>
  )}

Note: use <a> not <Link> here since these are internal hrefs resolved
server-side. Next.js client-side navigation works with plain <a> for
statically generated pages.

## DO NOT TOUCH

- RelatedContent.tsx (already correct)
- AlternativesList.tsx (already correct)
- getRelatedContent in lib/data.ts (already correct)
- Any schema or data file

## Acceptance criteria

1. Workflow next_links only render if the target workflow file exists
2. Clicking a next_links link navigates to a real page, never 404
3. Package task related content renders as clickable links, not plain text
4. Links to non-existent content are silently omitted
5. npm run build passes

## Regression checklist

- [ ] RAG workflow page shows Next Workflow links (fine-tuning-lora, text-classification) if those files exist, otherwise shows nothing
- [ ] Package tasks with no related content render identically to before
- [ ] Package tasks with related content show link chips instead of plain text
- [ ] No TypeScript errors from the new ResolvedTask type
- [ ] generateStaticParams in package page is unchanged
```

---

### Phase 3 — Hyperparameters: Mobile Card Layout

```
You are working on D:\Project\ai-engineering-handbook.

## Problem

The Key Hyperparameters table has 3 columns: Name | Default | Description.
On mobile, the Description column wraps to multiple lines per row,
creating a visually dense table that is hard to scan vertically.

The correct mobile layout: one card per hyperparameter.
Desktop keeps the existing table.

## FILE TO MODIFY: components/shared/ModelCollapsibleSections.tsx

In the CollapsibleSection for "Key Hyperparameters", replace the
single div containing the table with a responsive layout:

BEFORE (inside the hyperparams CollapsibleSection):

  <div className="rounded-lg border border-border overflow-x-auto bg-card">
    <table className="min-w-full divide-y divide-border text-left text-sm">
      <thead ...>
        <tr>
          <th>Name</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {model.key_hyperparams.map(hp => (
          <tr key={hp.name} className="hover:bg-muted/10">
            <td className="px-4 py-2 font-mono text-primary">{hp.name}</td>
            <td className="px-4 py-2 font-mono">{hp.default === null ? 'null' : String(hp.default)}</td>
            <td className="px-4 py-2 text-muted-foreground">{hp.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

AFTER:

  <>
    {/* Mobile: card per hyperparam */}
    <div className="md:hidden space-y-2">
      {model.key_hyperparams.map(hp => (
        <div
          key={hp.name}
          className="rounded-lg border border-border bg-card p-3 space-y-1.5"
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-mono text-sm font-semibold text-primary">
              {hp.name}
            </span>
            <span className="font-mono text-xs text-muted-foreground shrink-0">
              default: {hp.default === null ? 'null' : String(hp.default)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {hp.note}
          </p>
        </div>
      ))}
    </div>

    {/* Desktop: original table */}
    <div className="hidden md:block rounded-lg border border-border overflow-x-auto bg-card">
      <table className="min-w-full divide-y divide-border text-left text-sm">
        <thead className="bg-muted/40 text-[10px] font-semibold text-muted-foreground uppercase">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Default</th>
            <th className="px-4 py-2">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {model.key_hyperparams.map(hp => (
            <tr key={hp.name} className="hover:bg-muted/10">
              <td className="px-4 py-2 font-mono text-primary">{hp.name}</td>
              <td className="px-4 py-2 font-mono">
                {hp.default === null ? 'null' : String(hp.default)}
              </td>
              <td className="px-4 py-2 text-muted-foreground">{hp.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>

## DO NOT TOUCH

- The CollapsibleSection wrapper or its id/label/toggle
- The Performance or Quick Start sections
- Any page file
- Any schema file

## Acceptance criteria

1. On mobile (< md breakpoint): hyperparameters render as stacked cards,
   one per parameter, with name + default on same line, note below
2. On desktop (md+): hyperparameters render as the existing 3-column table
3. Both render correctly for models with null default values
4. npm run build passes with no TypeScript errors

## Regression checklist

- [ ] XGBoost model page: 6 hyperparameter cards on mobile
- [ ] XGBoost model page: 3-column table on desktop
- [ ] null default values render as "null" string, not empty
- [ ] The "Show/Hide" toggle still works on mobile
- [ ] Desktop table is visually unchanged
```

---

### Phase 4 — Model Quick Start: Open by Default on Mobile

```
You are working on D:\Project\ai-engineering-handbook.

## Problem

Quick Start is the most frequently accessed section on model pages
during return visits. It is currently collapsed by default on mobile,
requiring a tap to reveal it even when navigating directly to a model
page to copy the quick start code.

## FILE TO MODIFY: components/shared/ModelCollapsibleSections.tsx

Find these three useState declarations:

  const [perfOpen, setPerfOpen] = useState(false);
  const [hyperOpen, setHyperOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);

Change only codeOpen to default true:

  const [perfOpen, setPerfOpen] = useState(false);
  const [hyperOpen, setHyperOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(true);

This means on mobile:
- Performance: collapsed by default (tap to show)
- Hyperparameters: collapsed by default (tap to show)
- Quick Start: expanded by default (tap to hide)

On desktop, all three are always visible (md:block CSS override) so
this change has zero effect on desktop rendering.

## DO NOT TOUCH

- Any other component or page file
- The CollapsibleSection component
- The CSS logic (md:block override)
- Desktop behavior

## Acceptance criteria

1. On mobile, Quick Start code block is visible immediately on model
   page load without any tap
2. Performance and Hyperparameters remain collapsed on mobile
3. The "Hide" toggle for Quick Start works (tapping collapses it)
4. On desktop, all three sections remain fully visible as before
5. npm run build passes

## Regression checklist

- [ ] XGBoost mobile: quick_start code block visible on load
- [ ] XGBoost mobile: performance grid collapsed on load
- [ ] XGBoost mobile: hyperparams cards collapsed on load
- [ ] XGBoost desktop: all three sections visible, no toggle buttons shown
- [ ] Toggle buttons appear and function correctly on mobile
```

---

### Phase 5 — Workflow Steps: Accordion with First Step Open

```
You are working on D:\Project\ai-engineering-handbook.

## Problem

Workflow step lists are fully expanded on mobile, creating 2,000–3,000px
of continuous content for a 6-step workflow. The user cannot see the
full workflow map (all step names) without extensive scrolling.

## Solution

Convert the step list to an accordion where:
- All step headers (number + name + tool badges) are always visible
- Step bodies collapse/expand on tap
- Step 1 is open by default (users read sequentially)
- All other steps are collapsed by default
- Multiple steps can be open simultaneously

## FILE TO MODIFY: app/workflows/[id]/page.tsx

This is a server component. The accordion needs client-side state.
Extract the steps list into a new client component.

## FILE TO CREATE: components/shared/WorkflowStepList.tsx

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { WorkflowStep } from '@/types/workflow';
import { cn } from '@/lib/utils';

interface WorkflowStepListProps {
  steps: WorkflowStep[];
}

export default function WorkflowStepList({ steps }: WorkflowStepListProps) {
  // Step 1 (index 0) is open by default
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));

  const toggleStep = (idx: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <ol id="steps" className="space-y-2 scroll-mt-24">
      {steps.map((s, idx) => {
        const isOpen = expandedSteps.has(idx);
        return (
          <li
            key={s.step}
            className="rounded-lg border border-border bg-card overflow-hidden"
          >
            {/* Step header — always visible, clickable */}
            <button
              onClick={() => toggleStep(idx)}
              className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/20 transition-colors"
              aria-expanded={isOpen}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-mono font-semibold mt-0.5">
                {s.step}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {s.name}
                </p>
                {/* Tool badges always visible in header */}
                {s.tools.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {s.tools.map(t => (
                      <span
                        key={t}
                        className="rounded border border-border bg-muted px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {isOpen
                ? <ChevronDown className="w-4 h-4 shrink-0 mt-1 text-muted-foreground" />
                : <ChevronRight className="w-4 h-4 shrink-0 mt-1 text-muted-foreground" />
              }
            </button>

            {/* Step body — collapsible */}
            {isOpen && (
              <div className="px-4 pb-4 pt-1 space-y-3 border-t border-border">
                <p className="text-sm text-muted-foreground">{s.what}</p>

                <div className="rounded border border-border bg-muted/30 p-3 text-sm">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">
                    Key Decision
                  </span>
                  {s.decision}
                </div>

                {s.failure_points.length > 0 && (
                  <div className="rounded border-l-2 border-amber-500 bg-amber-500/5 px-3 py-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1.5">
                      Watch Out
                    </span>
                    <ul className="space-y-1">
                      {s.failure_points.map((fp, fpIdx) => (
                        <li key={fpIdx} className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                          {fp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

## UPDATE app/workflows/[id]/page.tsx

Import the new component:
  import WorkflowStepList from '@/components/shared/WorkflowStepList';

Find the SectionCard containing the steps ol:

  <SectionCard title="Workflow Steps" subtitle="Sequential pipeline">
    <ol id="steps" className="space-y-6 scroll-mt-24">
      {workflow.steps.map(s => (
        <li key={s.step} className="flex gap-4 border-b border-border/50 pb-6 last:border-b-0 last:pb-0">
          ...full step content...
        </li>
      ))}
    </ol>
  </SectionCard>

Replace entirely with:

  <SectionCard title="Workflow Steps" subtitle="Sequential pipeline">
    <WorkflowStepList steps={workflow.steps} />
  </SectionCard>

## DO NOT TOUCH

- The header/overview section of the workflow page
- The failure_points rose section (#failures)
- The evaluation_checks section (#evaluation)
- The next_links section
- RelatedContent
- SectionCard component
- Any schema or data file

## Acceptance criteria

1. All step headers are always visible — step number, name, tool badges
2. Step 1 body is expanded on load
3. Steps 2–N bodies are collapsed on load
4. Tapping any step header toggles its body
5. Multiple steps can be expanded simultaneously
6. The amber "Watch Out" callout appears inside each expanded step body
7. The TOC link to #steps scrolls to the top of the step list
8. Desktop renders correctly — same layout, no visual regression
9. npm run build passes

## Regression checklist

- [ ] RAG workflow: 6 step headers all visible on load
- [ ] RAG workflow: Step 1 (Ingestion) expanded, steps 2–6 collapsed
- [ ] Tapping step 2 header expands it without collapsing step 1
- [ ] Failure points render inside expanded step bodies
- [ ] Tool badges visible in all step headers (collapsed and expanded)
- [ ] SectionCard title "Workflow Steps" still renders correctly
- [ ] #steps TOC anchor scrolls to the list
- [ ] Desktop: identical to current layout visually
```

---

### Phase Summary

| Phase | Problem | Risk | Effort |
|---|---|---|---|
| 1 | URL overflow + PWA link restart | Zero | 20 min |
| 2 | Related content dead links | Low | 45 min |
| 3 | Hyperparams mobile card layout | Zero | 20 min |
| 4 | Quick Start open by default | Zero | 2 min |
| 5 | Workflow accordion | Medium | 60 min |

Run in order. After Phase 5, all six problems are resolved. Architecture freeze is ready.