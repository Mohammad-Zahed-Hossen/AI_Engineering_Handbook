I did a direct repo inspection rather than trusting the "all complete" status report — that report only checked its own fix list against the code, not the actual content data files, which is where the real remaining problems live. Here's what's actually still broken.

## Deliverable A — Scores

| Metric | Score | Basis |
|---|---|---|
| Architecture Score | 8.5/10 | Component boundaries are clean and correctly split (Prose/ProseClient, CodeBlock/CodeBlockInteractive). No structural defects found. |
| Consistency Score | 5/10 | Components are consistent; **content is not**. Three of five workflows don't conform to the schema conventions the reference workflows established. |
| Documentation Score | 6/10 | Further Study is well-built. On-page docs (Production Profile, Failure Points) depend on `parseLabeledClauses` succeeding, which is content-format-dependent, not guaranteed. |
| Freeze Readiness Score | **Not ready** | One confirmed rendering defect reachable in production content, plus unverified mobile/a11y claims (see caveat below). |

**Caveat on scope**: I verified everything below by reading the actual component code and the actual JSON content files. I did **not** run the app in a browser, so items 10 (Mobile UX) and 11 (Accessibility) below are static-analysis findings only — treat pixel-level and screen-reader claims as "needs visual QA," not verified fact. I'm not going to hand you invented contrast ratios or breakpoint screenshots I didn't take.

---

## Deliverable B — Verified Remaining Issues

### Issue 1 — Step-level code silently bypasses CodeBlockInteractive (Critical)

**Severity**: Critical
**Evidence**: `data/workflows/vector-database-setup-indexing-strategy.json` and `data/workflows/build-rag-system.json` — every step object has no `code` / `language` field. Instead, code is embedded as a fenced block inside the `what` markdown string (e.g. step 1 of vector-database: `"### Minimal Integration Example\n\`\`\`python\n..."`).

`WorkflowStepList.tsx` only renders `CodeBlockInteractive` when `s.code && s.highlightedCodeData` is truthy:
```tsx
{s.code && s.highlightedCodeData && (
  <CodeBlockInteractive ... />
)}
```
Since `s.code` is `undefined` for these two workflows, that branch never fires. The embedded fence inside `what` instead goes through `ProseClient` (WorkflowStepList runs client-side, so it must use the non-Shiki path):
```tsx
// ProseClient's `pre` renderer — no Shiki, no CodeBlockInteractive
<pre className="text-xs text-zinc-300">
  <code className={`language-${language || 'text'}`}>{codeText}</code>
</pre>
```
**Root Cause**: Not a component bug. It's a content-authoring defect — two of five workflows never populate the step's `code`/`language` fields, so the content itself never reaches the properly-built rendering path. The two reference workflows (`llm-application-serving`, `production-llm-cost-latency-optimization`) do this correctly: every step has `"code": "...", "language": "python"` as sibling fields to `what`, and `what` contains no fenced code at all.

This is the same defect the audit brief flagged for vector-database-setup — it hasn't been fixed, it's been *relocated*. Previously it rendered as raw unstyled markdown; now it renders as an unhighlighted `<pre>` block with no syntax highlighting, no copy button, no wrap toggle, and no truncation on long snippets. Still visibly and functionally inconsistent with every other step's code block on every other workflow page.

**Recommendation**: Move the embedded `### Minimal Integration Example` fenced code out of `what` and into the step's `code`/`language` fields for both files. This is a content migration, zero component changes, fully additive, preserves the frozen architecture.

**Alternative rejected**: Making `ProseClient` Shiki-capable would require async highlighting inside a Client Component, which is exactly the constraint that motivated building `ProseClient` in the first place. Don't reopen that.

**Complexity**: Low (content edit, no code changes). 15 steps across 2 files (8 in vector-database, 7 in build-rag-system).

---

### Issue 2 — `decision` field has two incompatible schemas across workflows (High)

**Severity**: High
**Evidence**:
- Reference workflows (`llm-application-serving`, `production-llm-cost-latency-optimization`) encode `decision` as a **markdown pipe table**: `"| Field | Default | Alternative | Trade-off | Scale Trigger | Failure Prevented |\n| :-- | ... |\n..."`.
- The other three workflows (`build-rag-system`, `vector-database-setup-indexing-strategy`, and presumably `rag-evaluation-harness`) encode `decision` as a **single prose sentence run**: `"Default: X. Alternative: Y. Trade-off: Z. Scale Trigger: ... Failure Prevented: ..."`.

Both get piped through `ProseClient` inside a fixed-height "Key Decision" box:
```tsx
<div className="rounded border border-border bg-muted/30 p-3 text-sm">
  <ProseClient content={linkFootnotes(s.decision)} className="text-muted-foreground" />
</div>
```
A 6-column markdown table rendered via `ReactMarkdown` inside a `p-3` box with no responsive table wrapper will overflow on mobile widths (there's no `overflow-x-auto` wrapper around table output anywhere in `Prose.tsx`/`ProseClient`). The prose-sentence version renders fine but looks structurally different — no table, just a dense paragraph — so the same "Key Decision" box has two entirely different visual shapes depending on which workflow you're on. This is precisely the "visual consistency across workflows" defect the audit brief asked about, and it's a content problem, not a `SectionCard`/`WorkflowStepList` problem.

**Root Cause**: The reference workflows moved to a table format at some point; the other three were never migrated.

**Recommendation**: Standardize all `decision` fields on the table format (it's more scannable and matches the two "intended future standard" files). This also means `ProseClient`'s markdown-table output needs a horizontal-scroll wrapper (`overflow-x-auto` around the `<table>`) to survive mobile — that's the one genuine, small component fix here, and it's additive (doesn't touch layout/architecture).

**Complexity**: Medium — content rewrite for ~22 steps (build-rag-system: 7, vector-database: 8, rag-evaluation-harness: unverified, presumed similar) + one CSS wrapper addition to `ProseClient`/`Prose`.

---

### Issue 3 — `failure_points` clause format is inconsistent between reference and non-reference workflows (Medium)

**Severity**: Medium
**Evidence**: `llm-application-serving.json` step failure_points are plain single-sentence strings: `"Oversized payloads causing memory pressure."` — rendered as a flat bullet list with no clause parsing.
`vector-database-setup-indexing-strategy.json` and `build-rag-system.json` use the structured `"Failure: ... Trigger: ... Downstream Effect: ... Detection: ..."` format, which `parseLabeledClauses` successfully splits into labeled sub-rows in the amber "Watch Out" box.

So the same "Watch Out" component renders as a flat one-line bullet on the reference workflows and as a multi-row labeled breakdown on the others. Functionally both work (no crash, no broken markup — `parseLabeledClauses` has a documented plain-text fallback), but it's a visible density/format mismatch between "the two workflows meant to be the standard" and everything else. Worth noting: this cuts the opposite direction from Issue 1 and 2 — here the *reference* workflows are the less-detailed ones.

**Recommendation**: Decide one direction and hold it. Given "Common Failure Points" section of the same page already uses the structured multi-clause format successfully, I'd standardize step-level `failure_points` on the structured format too, and backfill the two reference workflows — they're currently the outlier, not the standard, on this specific field.

**Complexity**: Medium (16 steps in the two reference files need failure_points rewritten from single sentences to structured clauses).

---

### Issue 4 — Reportedly-strange "$" symbol in TOC (Not reproducible — likely already resolved)

**Severity**: N/A
**Evidence**: `TableOfContents.tsx` renders labels straight from a hardcoded array in `page.tsx` (`'Overview'`, `'Steps'`, `'Worked Examples'`, `'Failure Points'`, `'Production Profile'`, `'Evaluation'`) — no dynamic content, no possible `$` injection point in that component today.

**Verdict**: This specific issue does not exist in the current TOC implementation. Don't reopen it.

**Adjacent latent risk worth flagging (Low)**: `Prose.tsx` and `ProseClient` both wire up `remarkMath` + `rehypeKatex`. Any workflow content field containing two literal `$` characters in the same block (e.g. a future author writing `"costs $0.002 per call and $0.01 at peak"`) will get parsed as inline math delimiters by `remark-math`, potentially mangling the rendered text or throwing a KaTeX parse error swallowed silently. None of the five current workflows trigger this (checked `cost_notes` in all three files read — none contain a literal `$` figure), so it's not an active bug, just a landmine for future content authors. Not worth an architecture change; worth a note in the content-authoring guide instead.

**Complexity**: N/A (no fix needed now; documentation-only recommendation).

---

## Deliverable C — Component-by-Component Audit

| Component | Status | Notes |
|---|---|---|
| WorkflowStepList | **Ready for Freeze** | Logic is correct. Its rendering inconsistencies (Issues 1–3) are 100% content-driven, not component bugs. |
| SectionCard | **Ready for Freeze** | Used correctly for the Steps section. Not used for Worked Examples, Failure Points, or Evaluation Checklist on the same page — those use ad hoc `<div>`/`<section>` markup instead (see Deliverable E, low-risk polish item). |
| BadgeRow | **Ready for Freeze** | No defects found. |
| CodeBlockInteractive | **Ready for Freeze** | Solid: scroll-position compensation on expand/collapse, aria-pressed on wrap toggle, mobile fallback copy button. No issues. |
| WorkedExample (inline in page.tsx, not a component) | **Needs decision** | It's not actually a component — it's hand-rolled markup in `page.tsx` for the Worked Examples section, structurally similar to but not reusing `SectionCard`. Low-risk to wrap in `SectionCard` for consistency; not required for freeze. |
| CommonFailurePoints (inline in page.tsx) | **Needs decision** | Same situation — ad hoc div, not `SectionCard`. Amber styling is consistent with the per-step "Watch Out" amber styling (confirmed both use `border-amber-500`/`amber-500/5`/`amber-700 dark:amber-400` — this part is *already* consistent, contrary to what an audit assuming drift might guess). |
| FurtherStudy (OfficialResources.tsx) | **Ready for Freeze** | Genuinely well-built: categorizes by host, custom-title override support, per-category "show more," graceful hasLearningResources suppression logic. Best-built component in the set. |
| TableOfContents | **Ready for Freeze** | `$` issue not reproducible (see Issue 4). `useActiveSection` correctly shared via export, used identically by both `ContentPageLayout` and self-managed variant. |
| StickyActionBar | **Ready for Freeze** | No defects found. Good disconnect-safe scroll listener with passive flag. |
| ProductionProfile (inline in page.tsx via CollapsibleRow) | **Ready for Freeze**, contingent on Issue 2 | The pill navigation + hash deep-linking is solid. The only defect here is inherited from the `decision`/prose-clause content format problem (Issue 2/3), not the CollapsibleRow component itself. |
| RelatedContent | **Ready for Freeze** | Simple, correct, no issues. |
| OfficialResources | Same as FurtherStudy above | — |

---

## Deliverable D — Freeze Checklist

- [ ] **BLOCKING**: Fix Issue 1 (move embedded code out of `what` into `code`/`language` fields — vector-database-setup, build-rag-system)
- [ ] **BLOCKING**: Fix Issue 2 (standardize `decision` field format + add `overflow-x-auto` wrapper for markdown tables in `Prose`/`ProseClient`)
- [ ] Recommended before freeze, not blocking: Fix Issue 3 (standardize `failure_points` format)
- [x] Async Prose/ProseClient split — **Ready for Freeze**, confirmed correctly implemented, not reopened.
- [x] Find-in-page (`hidden="until-found"` + `beforematch`) — **Ready for Freeze**, confirmed present in both `WorkflowStepList.tsx` and `CollapsibleRow.tsx`.
- [x] BadgeRow, wrap toggle aria-pressed, Collapse-All labeling — **Ready for Freeze**, all confirmed present.
- [ ] **Needs visual QA (not verified by static read)**: mobile breakpoints (320/375/768/1024), actual contrast ratios, screen-reader flow, focus order. I did not run this in a browser — don't mark these "Ready for Freeze" off my say-so alone.

---

## Deliverable E — Low-risk UI Polish

1. Wrap Worked Examples and Common Failure Points sections in `SectionCard` (or a shared header pattern) instead of hand-rolled div markup, so all six major page sections share one visual container language. Zero architecture risk — purely a markup swap using an existing component.
2. Add `overflow-x-auto` around table output in `Prose.tsx`/`ProseClient` (needed regardless of Issue 2, since any future markdown table anywhere on the site has the same mobile-overflow risk).

---

## Deliverable F — Regression Check

| Item | Status |
|---|---|
| ProseClient / async split | ✅ Confirmed present, correctly separated, not reopened |
| TOC observer (`useActiveSection`) | ✅ Confirmed shared correctly, single instance passed to both variants |
| BadgeRow | ✅ Confirmed working, no regression |
| Step code (dedicated `code` field path) | ✅ Confirmed correct for the two reference workflows *only* — see Issue 1 for the two workflows where this path is never reached because content never populates it |
| ExpandableText | ✅ Confirmed: ResizeObserver-based measurement, cache-key persistence, no regression found |
| CodeBlock (server, Shiki) | ✅ Confirmed correct, balanced-depth truncation walker present (not regex) |
| find-in-page / hidden-until-found | ✅ Confirmed present in both list and collapsible-row variants |
| Worked Example backlinks | ✅ Confirmed: `related_step` correctly links `#step-N` ↔ `#example-N` in both directions |
| Further Study | ✅ Confirmed, no regression, `hasLearningResources` suppression logic intact |

No regressions found. The "all complete" implementation report was accurate for everything it checked — it just never checked the content JSON files against the schema the reference workflows established, which is where Issues 1–3 live.

---

## Deliverable G — Windsurf Implementation Prompt

```
CONTEXT
AENS Workflow page architecture is frozen. Components (WorkflowStepList,
SectionCard, CodeBlockInteractive, Prose/ProseClient, CollapsibleRow,
OfficialResources, TableOfContents, StickyActionBar) are NOT to be
redesigned. All issues below are CONTENT and one small CSS fix — no
component API changes, no new components, no architecture changes.

DO NOT:
- Modify component props, file structure, or the frozen architecture
- Touch anything not listed below
- Re-fix anything already marked complete in docs/Documents/Claude Fix

FILES IN SCOPE
- data/workflows/vector-database-setup-indexing-strategy.json
- data/workflows/build-rag-system.json
- data/workflows/rag-evaluation-harness.json (verify same defects apply before editing — not independently confirmed in this audit)
- components/shared/Prose.tsx
- components/shared/Prose.tsx (ProseClient export, same file)

═══════════════════════════════════════════════════
PRIORITY 1 — BLOCKING FOR FREEZE
═══════════════════════════════════════════════════

TASK 1: Extract embedded code from `what` into dedicated code fields
FILES: data/workflows/vector-database-setup-indexing-strategy.json,
       data/workflows/build-rag-system.json

For every step object in both files:
1. Find the "### Minimal Integration Example\n```python\n...\n```"
   block embedded inside the `what` string.
2. Remove that block (and the "### Minimal Integration Example" header)
   from `what`.
3. Add two new sibling fields to the step object at the same level as
   `what`: "code": "<the extracted code, unescaped>" and
   "language": "python".
4. Match the exact field shape used in
   data/workflows/llm-application-serving.json (steps already do this
   correctly — use as the ground-truth template).

VALIDATION: Run `npm run validate`. Confirm zero schema errors. Manually
diff before/after `what` text to confirm nothing besides the code fence
was removed.

---

TASK 2: Standardize `decision` field to markdown table format
FILES: data/workflows/build-rag-system.json,
       data/workflows/vector-database-setup-indexing-strategy.json,
       data/workflows/rag-evaluation-harness.json (verify first)

Rewrite every step's `decision` string from the prose format
("Default: X. Alternative: Y. Trade-off: Z. Scale Trigger: ...
Failure Prevented: ...") into the 6-column markdown pipe-table format
used in data/workflows/llm-application-serving.json:
"| Field | Default | Alternative | Trade-off | Scale Trigger | Failure Prevented |\n| :-- | :-- | :-- | :-- | :-- | :-- |\n| ... |"

Preserve all existing semantic content — this is a reformat, not a
rewrite of the underlying decision logic. One table row per field
covered by the original prose (most steps will produce 1 row unless
multiple independent decisions were bundled in the original text).

VALIDATION: Run `npm run validate`. Spot-check 3 steps per file by
rendering the workflow page locally and confirming the table renders
inside the "Key Decision" box without layout breakage.

---

TASK 3: Add horizontal scroll wrapper for markdown tables
FILE: components/shared/Prose.tsx

In both the `Prose` component and the `ProseClient` component, add a
`table` component override to the `ReactMarkdown` `components` prop
that wraps rendered tables in a scrollable container:

  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table>{children}</table>
    </div>
  ),

Add this to both Prose (server) and ProseClient (client) — do this
identically in both, since Task 2's tables render through ProseClient
inside WorkflowStepList's "Key Decision" box specifically.

VALIDATION: Resize browser to 375px width, load a workflow step with a
6-column decision table, confirm the table scrolls horizontally inside
its box instead of breaking page layout or overflowing the container.

═══════════════════════════════════════════════════
PRIORITY 2 — RECOMMENDED, NOT BLOCKING
═══════════════════════════════════════════════════

TASK 4: Standardize `failure_points` to structured clause format
FILES: data/workflows/llm-application-serving.json,
       data/workflows/production-llm-cost-latency-optimization.json

Rewrite each step's failure_points array from single-sentence strings
into the structured clause format already used in build-rag-system.json
and vector-database-setup-indexing-strategy.json:
"Failure: ... Trigger: ... Downstream Effect: ... Detection: ..."

Use build-rag-system.json step 1 failure_points as the template. Do
NOT add "Recovery Strategy" or "Production Metrics" sub-clauses unless
the source workflow already had that data elsewhere — don't invent
content, only reformat what already exists in the sentence.

VALIDATION: Run `npm run validate`. Load each reference workflow page,
confirm "Watch Out" boxes now render structured labeled clauses instead
of flat single-sentence bullets.

═══════════════════════════════════════════════════
REGRESSION CHECKLIST (run after all tasks)
═══════════════════════════════════════════════════
- npm run validate → 0 errors
- npm run build → compiles, same page count as before
- Manually load all 5 workflow pages, confirm:
  - Every step's code renders via CodeBlockInteractive (dark zinc box,
    syntax highlighted, copy button, wrap toggle) — NOT via a plain
    unstyled <pre> block
  - Every "Key Decision" box renders a table, not a paragraph
  - Every "Watch Out" box renders labeled clauses, not flat bullets
  - Find-in-page (Ctrl+F) still expands collapsed steps correctly
  - TOC active-section highlighting still works
  - No new TypeScript or lint errors introduced

EXPECTED OUTCOME
All 5 workflow pages render code, decisions, and failure points with
identical visual structure. No component was modified except the two
Prose table-wrapper additions in Task 3. Architecture remains frozen.
```