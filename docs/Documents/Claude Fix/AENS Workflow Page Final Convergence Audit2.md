I checked the specific new claims against the actual code before writing recommendations — several of these "known issues" are content problems already covered in the prior audit, one is a genuinely new and real bug (broken footnote links), and several are subjective design calls where I'll give you a real recommendation rather than inventing measurements I can't take from a static read.

## 1. Footnotes — confirmed broken, not just "unnecessary"

This is worse than the brief assumes. I traced the full path:

`linkFootnotes.ts`:
```ts
export function linkFootnotes(text: string): string {
  return text.replace(/\[\^(\d+)\]/g, ' [[$1]](#footnote-$1)');
}
```
This converts `[^6]` into a markdown link pointing at `#footnote-6`. I searched the entire `components/` and `app/workflows/` tree for anything that renders an element with `id="footnote-N"` — **there is none**. No Footnotes section, no numbered source list, nothing. Every `[[6]]` marker on every workflow page is a link to an anchor that doesn't exist. Clicking it does nothing (or jerks the scroll position depending on browser behavior).

So this isn't "footnotes add cognitive load, consider removing them" — it's "footnotes are dead links on every workflow page today." That upgrades it from a UX-taste question to a correctness bug.

**Recommendation**: Remove `linkFootnotes()` calls and the `[^N]` stripping entirely. You already have Further Study (`OfficialResources`) surfacing the same `sources` array with real clickable links and categorization. The footnote markers reference that same list by position with no way for a reader to resolve which numbered source is which — Further Study already solves attribution better, with actual context (Documentation/Papers/Model Cards grouping) instead of a bare number. Content authors should stop emitting `[^N]` in source JSON going forward; existing content should have the markers stripped in a content pass (regex removal, not a component change).

**Alternative rejected**: Building a real footnotes section (numbered reference list with anchors) is more engineering for zero reader benefit given Further Study already exists — it'd be reproducing the same information twice with two different UX patterns. Don't build it.

## 2–4, 9–10. Step card weight / Uses density / step content density / Worked Examples / Failure Points visual noise

I want to be straight with you: these are subjective density/rhythm judgments, not code defects. I read `WorkflowStepList.tsx`, `BadgeRow.tsx`, and the page.tsx worked-examples/failure-points markup line by line in the prior audit — there's no spacing bug, no broken Tailwind class, no unintended margin stacking. The "heaviness" you're perceiving is real, but it's coming from **content volume**, not layout defects. Look at the `what` field for a single step in `vector-database-setup-indexing-strategy.json` — it's an "Input Interface Contract" + "Output Interface Contract" + "Required Metadata" + "Pipeline Contract" + "Primary Consumer" block, all inside one collapsed step, before you even get to the code, Uses, Key Decision, and Watch Out sections. That's five sub-sections of prose per step, times 8 steps. No amount of padding/spacing tuning fixes that — the content itself is doing an interface-contract-spec's job and a tutorial's job simultaneously.

**Recommendation, in priority order**:
- Don't touch component spacing. The components are not the source of density.
- If you want density reduction, it has to happen in content: collapse the 5-part "Interface Contract" boilerplate into a single compact table (Artifact / Type / Owner / Consumer as one row, not five headed subsections) — this is a content-schema change, out of scope for "UI polish only," so I'm flagging it rather than putting it in the Windsurf prompt below.
- The one real, low-risk win: `BadgeRow` already caps visible badges at a configurable `defaultVisible` (4 for step Uses, 8 for Starter Stack). If Uses still feels dense on mobile, drop `defaultVisible` to 3 for the step-level Uses row specifically — that's a one-line prop change, not a redesign.

## 5. Code blocks rendering as plain text — same defect I found in the prior audit, still unfixed

Confirmed again, same root cause as before: `vector-database-setup-indexing-strategy.json` and `build-rag-system.json` steps have no `code`/`language` field — the code lives embedded in a fenced block inside `what`, which routes through `ProseClient`'s unhighlighted fallback `<pre>`, not `CodeBlockInteractive`. This is a content-authoring gap, not a Prose/CodeBlock/pipeline bug — the components behave correctly given what they're handed. Fix is a content migration (move the fenced block into `code`+`language` sibling fields), included in the Windsurf prompt below.

## 6. Code block UX

Read `CodeBlockInteractive.tsx` again — copy button (desktop header + mobile footer), wrap toggle with `aria-pressed`, collapse/expand with scroll-position compensation via `useLayoutEffect`, syntax highlighting via Shiki, horizontal-scroll fade indicator on mobile. This is already at the standard of the docs sites you're comparing against. No changes needed here — the only reason it *looks* inconsistent across workflows is Issue 5 above (two workflows never reach this component at all).

## 7. Key Decision — table vs. other layout

Real finding, already surfaced in the prior audit: the two reference workflows use a 6-column markdown table for `decision`, the other three use a single prose paragraph. Both render through the same fixed `p-3` box via `ProseClient`. A 6-column table in a ~300px-wide sidebar-adjacent box is not the right call for mobile — Stripe/Vercel docs don't put 6-column tables in a narrow card; they use a definition-list or 2-column key/value stack. I'm revising my prior recommendation: **don't standardize on the table format** — standardize on a compact label/value stack instead (Default / Alternative / Trade-off / Scale Trigger / Failure Prevented as stacked rows, not table columns). That's better for scanability at the width this box actually renders at, and it's the same content, just a different rendering approach — still a content-format decision, not a component rewrite, since `ProseClient` already handles arbitrary markdown.

## 8. Watch Out — amber styling

Confirmed consistent between per-step Watch Out and page-level Common Failure Points (`border-amber-500`, `bg-amber-500/5`, `text-amber-700 dark:text-amber-400` in both). It's not inconsistent — it's just used at two severities that both look identical. Amber usually signals "caution," and these are genuine production failure modes (OOM, data corruption, cross-tenant leakage) — amber is the right semantic choice, not overuse. I'd leave this alone. If you want a lower-attention treatment, the honest tradeoff is: quieter styling makes genuinely important failure information less likely to be read, which works against the handbook's own goal of being a reliable reference under pressure. I don't recommend this change.

## 11. Content density — page-level

Already addressed via items 2–4: the real lever is content restructuring (the 5-part Interface Contract format), not component spacing. No further component-level recommendation beyond what's above.

## 12. Further Study — already good

I read `OfficialResources.tsx` in full in the prior audit: per-source custom title override, host-based categorization (Documentation/Papers/Model Cards/Further Reading), `parseResourceUrl` with dedicated parsers for numpy/pandas/pytorch/sklearn/huggingface/github/arxiv/etc. producing human-readable titles instead of raw URLs, `hasLearningResources` suppression to avoid duplicate buckets. This is already at parity with what you're describing wanting. No changes needed.

## 13. TOC "$" symbol — not reproducible, confirmed in prior audit

Traced again: `TableOfContents.tsx` labels are hardcoded strings from `page.tsx` (`'Overview'`, `'Steps'`, etc.) — no dynamic content, no possible `$` injection point. This issue does not exist in the current code. Stop chasing it.

## 14. Top metadata vs. Model page

`MetadataBadges.tsx` takes `type: 'model' | 'package' | 'workflow' | ...` as a prop — it's the same shared component used by both pages, called with matching prop shapes (`type`, `updatedAt`, `category`, `difficulty`, `domain`, `engineeringArea`). This is already consistent by construction. No action needed.

## 15. Build RAG System content quality

Read the full file. It's not stylistically "older" in a way that breaks anything — it uses a different but valid contract format (`* Input Artifact:` bullets vs. the reference workflows' `**Input Interface Contract**` headed blocks), a prose-format `decision` field (Issue 7), and no dedicated `code` field (Issue 5). Functionally it's the same three content-schema gaps already identified, not a unique fourth problem. No separate fix needed beyond the ones above.

## 16. Global consistency

Every inconsistency I can verify from code traces back to one of: Issue 5 (code field), Issue 7 (decision format), or the failure_points structured-vs-flat mismatch from the prior audit. I'm not going to list "spacing/badge sizing/button styling" as separate findings because I checked and they're consistent — `BadgeRow`, `ContentTypeBadge`, `SectionCard` are single shared components used identically everywhere. The inconsistency is 100% in the JSON content layer, not the component layer.

---

## Final Windsurf Implementation Prompt

```
CONTEXT
AENS Workflow page architecture is frozen. Do not modify component APIs,
file structure, routing, or the schema's field names. All fixes below
are either (a) content data edits or (b) removal of dead functionality —
no component redesign.

FILES IN SCOPE
- data/workflows/vector-database-setup-indexing-strategy.json
- data/workflows/build-rag-system.json
- data/workflows/rag-evaluation-harness.json (audit for same defects first)
- data/workflows/llm-application-serving.json
- data/workflows/production-llm-cost-latency-optimization.json
- lib/text/linkFootnotes.ts
- components/shared/WorkflowStepList.tsx (one-line prop change only)
- components/shared/Prose.tsx (table wrapper only, if Task 2 keeps tables)

═══════════════════════════════════════════════
PRIORITY 1 — BLOCKING (confirmed bugs, not style opinions)
═══════════════════════════════════════════════

TASK 1: Remove dead footnote links
FILES: All 5 workflow JSON files, lib/text/linkFootnotes.ts

Every [^N] marker in workflow content (overview, step `what`, decision,
failure_points, production_notes, scaling_notes, cost_notes,
latency_notes, observability_notes, worked_example descriptions and
implementation_notes) currently renders as a clickable [[N]] link to
#footnote-N, an anchor that does not exist anywhere on the page. This
is a broken-link defect, not a style preference.

1. Strip all [^N] markers from all workflow JSON content fields via
   regex: /\[\^\d+\]/g -> '' (remove entirely, no replacement text).
2. Delete the linkFootnotes() function and remove all its call sites
   in app/workflows/[id]/page.tsx and components/shared/WorkflowStepList.tsx.
   Replace `linkFootnotes(s.what)` etc. with the raw field directly.
3. Do NOT touch the `sources` array — Further Study/OfficialResources
   already handles citation display correctly and is out of scope.

VALIDATION: grep all workflow JSON for \[\^ — zero matches. Confirm no
remaining imports of linkFootnotes anywhere in components/ or app/.
Load all 5 workflow pages, confirm no numbered brackets appear in
rendered prose.

---

TASK 2: Move embedded code out of `what` into dedicated code fields
FILES: data/workflows/vector-database-setup-indexing-strategy.json,
       data/workflows/build-rag-system.json

For every step: extract the fenced ```python ... ``` block (and its
"### Minimal Integration Example" or similar header) out of the `what`
string. Add "code": "<extracted code>" and "language": "python" as
sibling fields to `what`, matching the exact shape already used in
data/workflows/llm-application-serving.json (use it as the template).

VALIDATION: npm run validate passes. Load both workflow pages, confirm
every step's code now renders as a proper CodeBlockInteractive block
(dark background, syntax highlighted, copy button, wrap toggle) instead
of a plain unstyled <pre>.

═══════════════════════════════════════════════
PRIORITY 2 — CONTENT FORMAT STANDARDIZATION
═══════════════════════════════════════════════

TASK 3: Standardize `decision` field to compact label/value format
FILES: data/workflows/build-rag-system.json,
       data/workflows/vector-database-setup-indexing-strategy.json,
       data/workflows/rag-evaluation-harness.json (verify first),
       data/workflows/llm-application-serving.json,
       data/workflows/production-llm-cost-latency-optimization.json

Do NOT keep the 6-column markdown table format from the two reference
workflows — it doesn't fit the "Key Decision" box width, especially on
mobile. Instead, rewrite ALL five workflows' `decision` fields (both
the prose-format ones and the table-format ones) into a single
consistent format using labeled clauses compatible with the existing
parseLabeledClauses() fallback pattern already used elsewhere on this
page (see failure_points rendering in WorkflowStepList.tsx for the
established pattern):

"Default: <text>. Alternative: <text>. Trade-off: <text>. Scale Trigger: <text>. Failure Prevented: <text>."

This is the format vector-database-setup-indexing-strategy.json and
build-rag-system.json already mostly use — extend it to the two
reference workflows instead of the reverse. Preserve all existing
semantic content; this is a reformat only.

VALIDATION: npm run validate passes. Load one step per workflow,
confirm Key Decision box shows consistent stacked label/value rows
across all 5 workflows, no table overflow on 375px width.

---

TASK 4: Standardize `failure_points` to structured clause format
FILES: data/workflows/llm-application-serving.json,
       data/workflows/production-llm-cost-latency-optimization.json

These two files currently use flat single-sentence failure_points
strings. Rewrite to the structured format already used in the other
three workflows:
"Failure: ... Trigger: ... Downstream Effect: ... Detection: ..."
Use build-rag-system.json step 1 as the template. Do not invent new
content — only reformat what already exists in the sentence.

VALIDATION: npm run validate passes. Confirm Watch Out boxes render
labeled clauses (not flat bullets) on all 5 workflows.

═══════════════════════════════════════════════
PRIORITY 3 — LOW-RISK POLISH
═══════════════════════════════════════════════

TASK 5: Tighten step-level Uses badge density on mobile
FILE: components/shared/WorkflowStepList.tsx

In renderAllUses(), change:
  <BadgeRow defaultVisible={4}>{allBadges}</BadgeRow>
to:
  <BadgeRow defaultVisible={3}>{allBadges}</BadgeRow>

This is the only mobile-density change in scope. Do not touch BadgeRow
itself, do not touch Starter Stack's defaultVisible={8} (that one is
fine at the header level, more horizontal room there).

VALIDATION: Load a step with 5+ Uses badges on a 375px viewport,
confirm "+N more" trigger appears after 3 badges instead of 4.

═══════════════════════════════════════════════
DO NOT DO (explicitly out of scope for this pass)
═══════════════════════════════════════════════
- Do not change Watch Out amber color/styling — it is intentional and
  already consistent across per-step and page-level instances.
- Do not touch Further Study / OfficialResources.tsx — already correct.
- Do not touch MetadataBadges.tsx — already shared and consistent
  between Model and Workflow pages.
- Do not touch TableOfContents.tsx — the reported "$" symbol issue is
  not reproducible in the current codebase; do not spend time on it.
- Do not restructure the 5-part Interface Contract prose format inside
  `what` — that is a content-depth decision requiring product judgment
  beyond a UI polish pass, not a UI defect.
- Do not add a Footnotes/References section as a fix for Task 1 —
  removal is correct; rebuilding a citation system duplicates Further
  Study for no reader benefit.

═══════════════════════════════════════════════
REGRESSION CHECKLIST
═══════════════════════════════════════════════
- npm run validate → 0 errors
- npm run build → compiles, same page count as before
- grep -r "\[\^" data/workflows/ → zero matches
- grep -r "linkFootnotes" components/ app/ → zero matches
- All 5 workflow pages load without console errors
- Every step's code renders via CodeBlockInteractive, not plain <pre>
- Key Decision boxes render consistent label/value format on all 5
- Watch Out boxes render structured clauses on all 5
- Find-in-page, TOC active-section, and StickyActionBar still function
  (unchanged, but confirm no accidental regression from field removal)
```