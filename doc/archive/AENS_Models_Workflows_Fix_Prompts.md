---

## AENS UX Audit — Models Library & Workflows Library

**Chief Architect Mode: UX Research**
**Constraint: Mobile-primary, 6-hour sessions, freeze after approved changes only**

---

## Executive Summary

Both pages are architecturally sound and structurally correct. The information hierarchy on the Model Detail page is the best in the application — decision guide first, pros/cons second, performance third, code last. That ordering is correct and must not change.

The Workflow Detail page is similarly well-structured. The numbered step layout with tool badges is clean.

However, both pages have three shared problems that become painful at the scale of daily 6-hour use, and the Models List page has one critical structural issue on mobile. These are the only changes worth making before freeze.

---

## Critical Issues

### Issue 1 — Model List: The mobile card shows `summary` but decision-support needs `use_when`

**Severity: Critical for the Models Library purpose**

The mobile card in `FilterBar.tsx` renders:

```
Model Name     [inference badge]
{m.summary}    ← two-line truncated prose
[problem_type badges]   Mem: low
```

The `summary` field describes what the model is. The `use_when` field answers "should I use this right now." These are fundamentally different questions, and the list page is a **selection** screen, not a learning screen.

When you are scanning 20 models asking "which one do I need for this problem," the summary is noise. `use_when` is the signal. A user reading "Gradient-boosted decision trees using histogram-based splitting" (summary) gains nothing for a selection decision. A user reading "Large tabular datasets where XGBoost is too slow" (use_when) can make an instant decision.

**HCI reasoning:** Recognition over Recall (Nielsen). The list page must support recognition — "yes, that's the one" — not recall — "let me remember what each model does." `use_when` triggers recognition. `summary` requires recall.

**Fix:** On the mobile card, replace `{m.summary}` with `{m.use_when}`. The summary is available on the detail page, which the user navigates to after recognizing the right model.

**On desktop:** The table already has a Summary column. Add `use_when` as a subtitle or tooltip is unnecessary — the desktop table is used for scanning, and the existing columns (inference speed, memory, problem types) are sufficient filter signals. Only the mobile card needs this fix.

**Expected benefit:** Eliminates the "open model → read use_when → back → open next model" loop that currently happens 3–5 times per selection decision.

---

### Issue 2 — Model Detail: `decision_notes` and `competitors` are invisible

**Severity: High**

The Model schema has two fields that are not rendered on the page:

```typescript
decision_notes: z.string().optional(),
competitors: z.array(ContentRefSchema).optional(),
```

`decision_notes` is exactly what a decision-support system should surface. It answers "why this and not that." `competitors` directly enables comparison without a dedicated comparison page.

Currently both fields are completely ignored in `app/models/[category]/[id]/page.tsx`. This is lost content — you wrote it, it exists in the JSON, it never appears on screen.

**Fix:** Add a "Decision Notes" subsection inside the existing `#decision-guide` section, below the Use/Avoid grid. Add a "Compared to" subsection using the existing `AlternativesList` component (which is already in `components/shared/` and exists precisely for this purpose but is not used on the model page).

**Expected benefit:** Reduces the need to open multiple model pages for comparison. The decision notes surface precisely the comparative reasoning that today lives only in your memory or notes.

---

### Issue 3 — Workflow Detail: Step `failure_points` are buried and never rendered

**Severity: High**

The `WorkflowStep` schema has a `failure_points` array per step:

```typescript
failure_points: z.array(z.string()),
```

The workflow page renders `common_failure_points` at the bottom as a rose callout. But it **never renders** the per-step `failure_points`. These are the most operationally useful data in the entire workflow schema — "at step 3, this specific thing goes wrong" is far more actionable than "at some point in this workflow, these things go wrong."

Currently a developer following a workflow reads step 3, executes it, hits a failure, then has to scroll to the bottom failure section and guess which item applies.

**Fix:** Inside each step's `<li>`, after the `decision` block, conditionally render `s.failure_points` as a compact amber callout — identical in style to the existing `common_bug` in cheatsheets. Show it only when `s.failure_points.length > 0`.

**Expected benefit:** The failure point is co-located with the step that produces it. No scrolling to correlate a failure to a step. This converts the workflow page from reference material into an operational checklist.

---

### Issue 4 — Workflow Detail: `evaluation_checks` and `next_links` are schema fields that never render

**Severity: Medium**

Same problem as Issue 2. The schema has:

```typescript
evaluation_checks: z.array(z.string()).optional(),
next_links: z.array(z.string()).optional(),
```

`evaluation_checks` is the "how do I know this step worked?" signal — critical for a workflow. `next_links` enables forward navigation to the next logical workflow.

Neither renders. The page ends with `<RelatedContent>` which shows generic related items, not the intentionally curated `next_links` authored specifically for workflow progression.

**Fix:** Add an `evaluation_checks` block after the workflow steps, before the failure callout — styled as a checklist (checkmark icon, list items). Add `next_links` as a "Next Workflow" section below RelatedContent, distinct from generic related content.

---

### Issue 5 — Model List: The `h2` in workflow cards is wrong size for a list page

**Severity: Low**

In `app/workflows/page.tsx`:

```tsx
<h2 className="text-lg font-medium text-foreground">{wf.name}</h2>
```

`text-lg` on a list card creates oversized headings relative to the rest of the application. Every other list card in the application uses `text-sm font-semibold`. This is a consistency violation and on mobile it makes the card taller than necessary, reducing the number of workflows visible without scrolling.

**Fix:** Change to `text-sm font-semibold`. The `overview` text below provides sufficient context without a large heading.

---

## Reject List

**Adding a dedicated model comparison page.** You would need to maintain it, the schema would need to know which models to compare, and it duplicates information already on individual model pages. The `decision_notes` and `competitors` fields (Issue 2) solve comparison without a new page.

**Adding sort controls to the model list.** The filter-by-problem-type already exists and is the correct primary filter for this use case. Sort by inference speed or memory is secondary — those signals are already visible on both the mobile card and desktop table. A sort control adds UI complexity for marginal navigation benefit.

**Adding step progress tracking to workflows.** You are not executing workflows inside the app. You are reading them. A progress tracker implies stateful task management, which is outside the scope of a knowledge reference system. Reject.

**Adding icons or illustrations to workflow steps.** The numbered circles already provide the visual anchoring. Icons per step type would require maintaining an icon vocabulary and adds visual noise. Reject.

**Adding a "recently viewed" section to the models list.** Requires localStorage state, adds a component, and the sidebar already shows the full model list for navigation. The search keyboard shortcut (from the previous UI phase) already handles "I want to get back to that model." Reject.

---

## High-Impact Improvements Summary

| Issue | What to Change | Where | Mobile Impact | Effort |
|---|---|---|---|---|
| 1 | Replace `summary` with `use_when` on mobile card | `FilterBar.tsx` | Critical | 5 min |
| 2 | Render `decision_notes` + `competitors` | `models/[category]/[id]/page.tsx` | High | 30 min |
| 3 | Render per-step `failure_points` | `workflows/[id]/page.tsx` | High | 20 min |
| 4 | Render `evaluation_checks` + `next_links` | `workflows/[id]/page.tsx` | Medium | 30 min |
| 5 | Fix `h2 text-lg` on workflow list cards | `workflows/page.tsx` | Low | 2 min |

Total estimated effort: under 90 minutes. All five are additive — no structural changes, no new components, no schema changes.

---

## Freeze Recommendation

**Yes, freeze both pages after applying Issues 1–4.**

Issue 5 is cosmetic enough to do in 2 minutes or skip entirely. Issues 1–4 surface content that already exists in the data but is invisible on screen. They cost less than two hours and make both pages substantially more useful for the specific daily workflow of "select the right model" and "follow this workflow without hitting invisible failure modes."

After these four changes, the Model Detail page is the strongest page in the application — decision-first, dense, directly actionable. The Workflow Detail page becomes genuinely operational rather than just descriptive.

The one thing I would insist on before freeze is Issue 3 — per-step failure points co-located with their step. After that, freeze and add content. These pages have correct structure, correct schema, and correct information hierarchy. The remaining gaps are missing renders of existing data, not missing design.

# AENS — Models & Workflows Fix Prompts
# Six targeted fixes. Run in order. Each is independent and safe.

---

## Fix MW-1 — Mobile Model Card: Replace summary with use_when

**File:** `components/shared/FilterBar.tsx`
**Risk:** Zero. One field swap on the mobile card only.

---

```
You are working on D:\Project\ai-engineering-handbook.
Touch only components/shared/FilterBar.tsx.

## Context

The mobile card for each model (inside ModelListFilter, in the
`md:hidden` block) currently renders m.summary as a two-line
truncated paragraph. This is wrong for a selection screen.

The list page is a decision screen — the user is choosing which model
to open. m.use_when answers that question directly. m.summary does not.

## What to change

In the mobile card section (the block with className "md:hidden space-y-3"),
find this line:

  <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
    {m.summary}
  </p>

Replace {m.summary} with {m.use_when}:

  <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
    {m.use_when}
  </p>

Do NOT touch the desktop table view (the hidden md:block section).
Do NOT change any other field.
Do NOT change any styling.

## Verification

1. The mobile model list card now shows use_when text, not summary.
2. The desktop table is unchanged.
3. npm run build passes.
```

---

## Fix MW-2 — Model Detail: Decision guide visual distinction

**File:** `app/models/[category]/[id]/page.tsx`
**Risk:** Zero. Class string changes only on two divs.

---

```
You are working on D:\Project\ai-engineering-handbook.
Touch only app/models/[category]/[id]/page.tsx.

## Context

The decision-guide section renders Use When and Avoid When as two
visually identical cards side by side. They share the same border,
background, and padding. The only distinction is the h2 text color
(emerald vs rose).

The improvement: give each card a subtle left border accent so the
eye finds the decision section instantly without reading.
Keep everything else identical — no background color changes,
no heavy colors, no new components.

## What to change

Find the #decision-guide section:

  <section id="decision-guide" className="grid grid-cols-1 md:grid-cols-2 gap-4 scroll-mt-24">
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-emerald-700 dark:text-emerald-400">Use When</h2>
      ...
    </div>
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="text-rose-700 dark:text-rose-400">Avoid When</h2>
      ...
    </div>
  </section>

Replace the two inner divs' className as follows.

Use When card — change from:
  className="rounded-lg border border-border bg-card p-4"
to:
  className="rounded-lg border border-border bg-card p-4 border-l-2 border-l-emerald-500"

Avoid When card — change from:
  className="rounded-lg border border-border bg-card p-4"
to:
  className="rounded-lg border border-border bg-card p-4 border-l-2 border-l-amber-500"

Note: Use amber (not rose) for Avoid When. Rose is already used for
failure points and destructive states throughout the app. Amber signals
caution, not error — which is the correct signal for "avoid when."

Do NOT change h2 text colors.
Do NOT change padding, layout, or any other section.

## Verification

1. Use When card has a green left border accent.
2. Avoid When card has an amber left border accent.
3. All other model page sections are visually unchanged.
4. npm run build passes.
```

---

## Fix MW-3 — Model Detail: Render decision_notes and competitors

**File:** `app/models/[category]/[id]/page.tsx`
**Risk:** Low. Additive only — both fields are optional in the schema.

---

```
You are working on D:\Project\ai-engineering-handbook.
Touch only app/models/[category]/[id]/page.tsx.

## Context

The Model schema has two fields that are never rendered:

  decision_notes: z.string().optional()
  competitors: z.array(ContentRefSchema).optional()

AlternativesList component already exists at
components/shared/AlternativesList.tsx and is designed exactly for
ContentRef arrays. It is already imported in other pages. Import and
use it here.

## What to add

### Step 1 — Import AlternativesList

Add this import at the top of the file with the other component imports:

  import AlternativesList from '@/components/shared/AlternativesList';

### Step 2 — Add decision_notes inside the decision-guide section

The current decision-guide section is:

  <section id="decision-guide" className="grid grid-cols-1 md:grid-cols-2 gap-4 scroll-mt-24">
    <div ...>Use When</div>
    <div ...>Avoid When</div>
  </section>

After the closing </section> tag of #decision-guide, add:

  {model.decision_notes && (
    <div className="rounded-lg border border-border bg-card p-4 space-y-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
        Decision Notes
      </span>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {model.decision_notes}
      </p>
    </div>
  )}

This renders directly below the Use/Avoid grid. No section wrapper needed —
it is part of the decision-guide conceptual group even though it is outside
the grid.

### Step 3 — Add competitors using AlternativesList

The page currently ends with:

  <RelatedContent items={relatedContent} />

Before that, add:

  {model.competitors && model.competitors.length > 0 && (
    <AlternativesList
      alternatives={model.competitors}
      title="Compared To"
    />
  )}

AlternativesList already handles the empty case (returns null) and
already renders links with ContentTypeBadge. The title prop overrides
the default "Alternatives" label — use "Compared To" to distinguish
this from the existing alternatives section.

### Step 4 — Update the TOC

The current toc array is:

  const toc = [
    { id: 'summary', label: 'Summary' },
    { id: 'decision-guide', label: 'Decision Guide' },
    { id: 'pros-cons', label: 'Pros & Cons' },
    { id: 'performance', label: 'Performance' },
    { id: 'hyperparams', label: 'Hyperparameters' },
    { id: 'quick-start', label: 'Quick Start' },
  ];

No TOC change is needed. decision_notes sits visually between
decision-guide and pros-cons and is short enough that it does not
need its own TOC entry. competitors renders at the bottom with
RelatedContent and does not need a TOC entry.

## Constraints

- Both fields are optional — wrap every render in a conditional check
- Do NOT add a new id or scroll-mt-24 to the decision_notes block
  (it is close enough to #decision-guide that no separate anchor is needed)
- Do NOT modify AlternativesList.tsx
- npm run build must pass

## Verification

1. Open XGBoost model page (data/models/ml/xgboost.json has both fields populated)
2. Decision Notes block appears below the Use/Avoid grid showing:
   "Choose XGBoost for strong regularization..."
3. Compared To section appears near the bottom with links to
   LightGBM, Random Forest, and Gradient Boosting Classifier
4. A model without decision_notes renders identically to before
5. npm run build passes
```

---

## Fix MW-4 — Model Detail: Collapsible secondary sections on mobile

**File:** `app/models/[category]/[id]/page.tsx`
**Risk:** Medium. Requires converting the page or extracting a client component.

---

```
You are working on D:\Project\ai-engineering-handbook.
The page at app/models/[category]/[id]/page.tsx is currently a server component.

## Goal

Make Performance, Hyperparameters, and Quick Start sections collapsible
on mobile. Always keep these sections fully expanded:
  - Summary (#summary)
  - Decision Guide (#decision-guide)
  - Decision Notes (the block added in MW-3)
  - Pros & Cons (#pros-cons)

The three collapsible sections are:
  - Performance (#performance)
  - Hyperparameters (#hyperparams)
  - Quick Start (#quick-start)

Default state: all three collapsed on mobile, expanded on desktop.

## Implementation approach

Do NOT make the page file a client component (generateStaticParams
must remain a server function).

Instead, extract only the collapsible sections into a new client
component: components/shared/ModelCollapsibleSections.tsx

### File to create: components/shared/ModelCollapsibleSections.tsx

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Model } from '@/types/model';
import { CodeBlock } from '@/components/shared/CodeBlock';
import { cn } from '@/lib/utils';

interface ModelCollapsibleSectionsProps {
  model: Model;
}

export default function ModelCollapsibleSections({ model }: ModelCollapsibleSectionsProps) {

  // On md+ screens always show expanded. On mobile, collapsed by default.
  // We achieve this with CSS: the toggle button is only visible on mobile (md:hidden).
  // On desktop the content is always shown via CSS regardless of state.
  // On mobile the content is shown/hidden based on the expanded state.

  const [perfOpen, setPerfOpen] = useState(false);
  const [hyperOpen, setHyperOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);

  // Collapsible section wrapper component (defined inline)
  function CollapsibleSection({
    id,
    label,
    open,
    onToggle,
    children,
  }: {
    id: string;
    label: string;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) {
    return (
      <section id={id} className="scroll-mt-24 space-y-2">
        {/* Header — clickable on mobile, static on desktop */}
        <div className="flex items-center justify-between">
          <h2>{label}</h2>
          {/* Toggle button — only visible on mobile */}
          <button
            onClick={onToggle}
            className="md:hidden flex items-center gap-1 text-[10px] text-muted-foreground 
                       hover:text-foreground transition-colors select-none"
            aria-expanded={open}
          >
            {open
              ? <><ChevronDown className="w-3.5 h-3.5" />Hide</>
              : <><ChevronRight className="w-3.5 h-3.5" />Show</>
            }
          </button>
        </div>
        {/* Content — always shown on md+, conditionally on mobile */}
        <div className={cn('md:block', open ? 'block' : 'hidden')}>
          {children}
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Performance section */}
      <CollapsibleSection
        id="performance"
        label="Performance Overview"
        open={perfOpen}
        onToggle={() => setPerfOpen(v => !v)}
      >
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              ['Training', model.training_speed],
              ['Inference', model.inference_speed],
              ['Memory', model.memory_usage],
              ['Interpretability', model.interpretability],
            ].map(([label, value]) => (
              <div key={label} className="rounded border border-border bg-muted/30 p-2">
                <span className="text-[10px] uppercase text-muted-foreground block mb-1">
                  {label}
                </span>
                <span className="text-sm font-mono font-medium capitalize">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Hyperparameters section */}
      {model.key_hyperparams.length > 0 && (
        <CollapsibleSection
          id="hyperparams"
          label="Key Hyperparameters"
          open={hyperOpen}
          onToggle={() => setHyperOpen(v => !v)}
        >
          <div className="rounded-lg border border-border overflow-x-auto bg-card">
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
        </CollapsibleSection>
      )}

      {/* Quick Start section */}
      <CollapsibleSection
        id="quick-start"
        label="Quick Start"
        open={codeOpen}
        onToggle={() => setCodeOpen(v => !v)}
      >
        <CodeBlock code={model.quick_start} language="python" />
      </CollapsibleSection>
    </>
  );
}

### Update app/models/[category]/[id]/page.tsx

Import the new component:
  import ModelCollapsibleSections from '@/components/shared/ModelCollapsibleSections';

Remove these three sections from the JSX (they move into the client component):
  - <section id="performance" ...>
  - <section id="hyperparams" ...> (with its conditional wrapper)
  - <section id="quick-start" ...>

Also remove the CodeBlock import from page.tsx if it is no longer used
directly in page.tsx (it is now only used inside ModelCollapsibleSections).

Replace those three sections with:
  <ModelCollapsibleSections model={model} />

The TOC stays unchanged. The IDs (performance, hyperparams, quick-start)
are preserved inside the client component on the CollapsibleSection sections.

## Constraints

- generateStaticParams() in page.tsx must remain server-side (not 'use client')
- The sections that are NOT collapsible (#summary, #decision-guide,
  decision_notes block, #pros-cons) remain in page.tsx as server-rendered JSX
- On desktop (md and above), all three sections must always be visible
  regardless of toggle state
- On mobile, the default state is collapsed (open=false)
- The toggle button is only visible on mobile
- npm run build must pass

## Verification

1. On mobile: Performance, Hyperparameters, Quick Start all start collapsed
2. On mobile: Tapping "Show" on each section expands it
3. On desktop: All three sections are fully visible with no toggle buttons shown
4. Summary, Decision Guide, Decision Notes, and Pros/Cons are never collapsed
5. TOC links (#performance, #hyperparams, #quick-start) still scroll to the
   correct section (the section id is on the wrapper, always in the DOM)
6. XGBoost page renders correctly with all content
7. npm run build passes
```

---

## Fix MW-5 — Workflow Detail: Per-step failure points

**File:** `app/workflows/[id]/page.tsx`
**Risk:** Zero. Additive only inside existing step rendering.

---

```
You are working on D:\Project\ai-engineering-handbook.
Touch only app/workflows/[id]/page.tsx.

## Context

Each workflow step has a failure_points array in the schema:
  failure_points: z.array(z.string())

The RAG workflow has 2 failure points per step (verified in the data).
Currently, per-step failure_points are never rendered. Only the
workflow-level common_failure_points at the bottom are shown.

This means: a user reading step 3 has no idea what can go wrong at
step 3 specifically. They must scroll to the bottom and guess.

## What to add

Inside the step rendering, find the decision block:

  <div className="rounded border border-border bg-muted/30 p-3 text-sm">
    <span className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">
      Key Decision
    </span>
    {s.decision}
  </div>

After the closing </div> of the decision block, add:

  {s.failure_points.length > 0 && (
    <div className="rounded border-l-2 border-amber-500 bg-amber-500/5 px-3 py-2">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1.5">
        Watch Out
      </span>
      <ul className="space-y-1">
        {s.failure_points.map((fp, idx) => (
          <li key={idx} className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            {fp}
          </li>
        ))}
      </ul>
    </div>
  )}

Use amber (not rose) to distinguish per-step warnings from the
workflow-level common_failure_points section which uses rose.
The visual language: amber = watch out at this step,
rose = known causes of total workflow failure.

Do NOT touch the common_failure_points section at the bottom.
Do NOT touch any other part of the workflow page.

## Verification

1. Open the RAG workflow page
2. Each step now shows a "Watch Out" amber callout with its specific
   failure points after the Key Decision block
3. The common_failure_points rose section at the bottom is unchanged
4. A step with no failure_points renders no callout (the condition
   s.failure_points.length > 0 guards it)
5. npm run build passes
```

---

## Fix MW-6 — Workflow Detail: Render evaluation_checks and next_links

**File:** `app/workflows/[id]/page.tsx`
**Risk:** Zero. Additive only. Both fields are optional in the schema.

---

```
You are working on D:\Project\ai-engineering-handbook.
Touch only app/workflows/[id]/page.tsx.

## Context

The Workflow schema has two fields that are never rendered:

  evaluation_checks: z.array(z.string()).optional()
  next_links: z.array(z.string()).optional()

From rag.json (verified):
  evaluation_checks: [
    "Retrieval precision@5 >= 0.70...",
    "Answer groundedness: no claims...",
    "End-to-end latency <= 2s..."
  ]
  next_links: ["fine-tuning-lora", "text-classification"]

next_links contains workflow IDs (strings), not ContentRef objects.
To resolve names, use getWorkflow(id).name from lib/data.

## What to add

### Step 1 — Add evaluation_checks

After the common_failure_points section:

  {workflow.common_failure_points.length > 0 && (
    <div id="failures" ...>...</div>
  )}

Add:

  {workflow.evaluation_checks && workflow.evaluation_checks.length > 0 && (
    <div className="rounded-lg border border-border bg-card p-4 space-y-2">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
        Evaluation Checklist
      </span>
      <ul className="space-y-1.5">
        {workflow.evaluation_checks.map((check, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="mt-0.5 text-emerald-500 shrink-0 text-xs">✓</span>
            <span className="leading-relaxed">{check}</span>
          </li>
        ))}
      </ul>
    </div>
  )}

### Step 2 — Add next_links

Import Link from next/link (it may already be imported — check first).
Import getWorkflow from @/lib/data (it is already imported — check first).

After the evaluation_checks block, before <RelatedContent>:

  {workflow.next_links && workflow.next_links.length > 0 && (
    <div className="space-y-2">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
        Next Workflow
      </span>
      <div className="flex flex-wrap gap-2">
        {workflow.next_links.map(wfId => {
          let name = wfId;
          try {
            name = getWorkflow(wfId).name;
          } catch {
            // If workflow not found, fall back to ID
          }
          return (
            <Link
              key={wfId}
              href={`/workflows/${wfId}`}
              className="inline-flex items-center gap-1.5 rounded border border-border bg-muted/40 
                         px-3 py-1.5 text-xs font-medium text-foreground 
                         hover:bg-muted hover:border-foreground/20 transition-colors"
            >
              {name} →
            </Link>
          );
        })}
      </div>
    </div>
  )}

### Step 3 — Update the TOC

The current toc array:
  { id: 'overview', label: 'Overview' },
  { id: 'steps', label: 'Steps' },
  { id: 'failures', label: 'Failure Points' },

Update to add an id to the evaluation_checks block. Add id="evaluation"
and className="scroll-mt-24" to its outer div, then add to toc:

  ...(workflow.evaluation_checks?.length
    ? [{ id: 'evaluation', label: 'Evaluation' }]
    : []),

The full toc array becomes:

  const toc = [
    { id: 'overview', label: 'Overview' },
    { id: 'steps', label: 'Steps' },
    { id: 'failures', label: 'Failure Points' },
    ...(workflow.evaluation_checks?.length
      ? [{ id: 'evaluation', label: 'Evaluation' }]
      : []),
  ];

next_links does not need a TOC entry — it is a navigation element,
not a content section.

## Constraints

- Both fields are optional — all render blocks must be conditional
- The try/catch on getWorkflow is necessary: next_links may reference
  workflows not yet added to the data directory
- Do NOT modify RelatedContent.tsx or AlternativesList.tsx
- npm run build must pass

## Verification

1. Open the RAG workflow page
2. Evaluation Checklist appears after the common failure points section
   with three check items and emerald ✓ icons
3. Next Workflow section shows links to "Fine-Tuning with LoRA" and
   "Text Classification" (resolved from IDs)
4. TOC shows "Evaluation" as a fourth item only for workflows that
   have evaluation_checks
5. Clicking "Next Workflow" links navigates to the correct workflow page
6. A workflow without evaluation_checks and next_links renders
   identically to before these changes
7. npm run build passes
```

---

## Summary

| Fix | File(s) | Risk | Time |
|---|---|---|---|
| MW-1 | FilterBar.tsx | Zero | 5 min |
| MW-2 | models/[category]/[id]/page.tsx | Zero | 5 min |
| MW-3 | models/[category]/[id]/page.tsx | Low | 20 min |
| MW-4 | ModelCollapsibleSections.tsx (new) + page.tsx | Medium | 60 min |
| MW-5 | workflows/[id]/page.tsx | Zero | 10 min |
| MW-6 | workflows/[id]/page.tsx | Low | 20 min |

Run MW-1 through MW-6 in order. After all six pass `npm run build`,
the Models Library and Workflows Library are ready to freeze.
