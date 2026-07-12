This pass paid off — I found the real systemic issues hiding behind the earlier per-page audits. Patterns, Principles, Debug Guides, and Decision Guides all share one identical hand-built template, and it has three confirmed defects that repeat across all four pages simultaneously, plus one concrete mislabeling bug.

# 1. Executive Summary

Overall consistency: 5/10. Overall UX: 6/10. Architecture maturity: high (routing, schema, `ContentPageLayout` adoption are sound across 8 of 9 content types). Freeze readiness: not yet — one confirmed data-binding bug and one systemic Prose-bypass pattern need fixing first; both are small, mechanical fixes, not redesigns.

The pattern here is different from the earlier audits: Model/Workflow/Package/Cheatsheet are four distinct hand-built pages that drifted apart from each other. Patterns/Principles/Debug Guides/Decision Guides are **one single template copy-pasted four times** — which means they're perfectly consistent *with each other*, but that template itself has defects, and every defect exists in all four places at once.

# 2. Remaining Real Issues

**Critical — MetadataBadges type mismatch on Debug Guide pages**
`app/debug-guides/[id]/page.tsx`:
```tsx
<MetadataBadges
  type="workflow"
  updatedAt={debugGuide.updated_at}
  ...
/>
```
`MetadataBadges`'s `type` prop drives `ContentTypeBadge`, whose whole job is to show which content type this page is. Every Debug Guide page currently displays a "Workflow" badge instead of "Debug Guide." `MetadataBadgesProps.type` already includes `'debug_guide'` as a valid value — this is a copy-paste leftover, not a missing feature. One-line fix.

**High — Prose bypass is systemic, not isolated to Package**
Confirmed raw `<p>{field}</p>` (no markdown rendering) in:
- `app/patterns/[id]/page.tsx`: description, concept, applicability, implementation_notes
- `app/principles/[id]/page.tsx`: description, statement, intuition
- `app/debug-guides/[id]/page.tsx`: description, symptom text, cause text, diagnosis fields, prevention text
- `app/decision-guides/[id]/page.tsx`: description, problem, recommendations
- `app/packages/[id]/page.tsx`: summary (found in prior audit)

That's 5 of 9 content types where narrative text can't render bold/links/lists/inline code — any content author who writes `**Note:**` or a markdown link in these fields gets literal asterisks on screen. Model, Workflow, and Cheatsheet are the only three that consistently use `Prose`.

**High — Code/math content bypasses CodeBlock in Patterns and Principles**
`app/patterns/[id]/page.tsx` examples:
```tsx
<pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">{example}</pre>
```
`app/principles/[id]/page.tsx` mathematical_formulation: same raw `<pre>` treatment.

Neither gets syntax highlighting, copy button, or (for principles specifically) LaTeX/KaTeX rendering — `Prose`/`ProseClient` are the only two places in the codebase with `rehypeKatex` wired up, and Principle pages are exactly where mathematical notation would need it. A principle with `mathematical_formulation: "$$P(w_t|w_{t-1}) = \frac{count(w_{t-1},w_t)}{count(w_{t-1})}$$"` renders as raw LaTeX source text today, unrendered.

**Medium — Typography system fork**
Model/Package/Cheatsheet/Workflow use bare `<h1>`/`<h2>` with no inline size classes (relying on whatever global heading styles `globals.css`/typography plugin applies). Patterns/Principles/Debug Guides/Decision Guides all hardcode `className="text-2xl font-semibold tracking-tight"` on `<h1>` and `className="text-lg font-semibold text-foreground flex items-center gap-2"` on every `<h2>`, plus a colored Lucide icon per section header. Two different pages sitting side-by-side in the sidebar nav (e.g., a Pattern and a Workflow) render their headings at different explicit sizes because one group inherited global type scale and the other overrode it locally.

**Low — Section card styling is a third, simpler pattern in these four pages**
Debug Guides/Decision Guides/Patterns/Principles wrap list items in `rounded-lg border border-border bg-card p-4` (or `p-3`) divs — not `SectionCard`, not the ad hoc pattern Workflow uses either. It's a third bespoke convention. Functionally fine, just one more variant in an app that already has too many "what wraps a section" conventions (see prior audit's `SectionCard` under-adoption finding).

# 3. Design System Violations

1. `MetadataBadges type="workflow"` hardcoded in Debug Guide page — wrong prop value, not a design violation exactly, but a content-type identity bug that undermines the whole point of having typed badges.
2. Prose bypass in 5 of 9 content types (Package, Pattern, Principle, Debug Guide, Decision Guide) vs. 3 that do it correctly (Model, Workflow, Cheatsheet). Registry has no narrative text fields, N/A.
3. Two parallel heading-size systems: implicit/global (Model, Workflow, Package, Cheatsheet) vs. explicit inline override (Pattern, Principle, Debug Guide, Decision Guide).
4. Code/math content rendered via raw `<pre>` in Pattern (examples) and Principle (mathematical_formulation), same class of defect as the Workflow code-field issue found earlier, confirmed to also exist here.

# 4. Repeated Components

- The ExpandableText-wrapping-raw-`<p>` block is copy-pasted verbatim across Pattern, Principle, Debug Guide, Decision Guide, and Package — five near-identical instances of the exact same three-line pattern (`<ExpandableText cacheKey=... fadeClass="from-background to-transparent"><p className="...">{field}</p></ExpandableText>`).
- The `<h2>` + colored-Lucide-icon section header pattern is copy-pasted at least 15 times across these four files with only the icon and color changing.
- The `rounded-lg border border-border bg-card p-4` card-per-list-item pattern repeats across Debug Guide (symptoms, root causes, diagnosis, prevention) and Decision Guide (evaluation criteria) — roughly 5 near-identical instances.

# 5. Missing Shared Components

Two are justified by actual repetition counts, not speculative:

- **`ProseText`** (or just: consistently use existing `Prose`) — wrap the `ExpandableText` + raw `<p>` pattern into a single call, e.g. `<ExpandableText><Prose content={field} /></ExpandableText>`. This isn't a new component, it's applying the one that already exists, in the 5 places that currently skip it.
- **`SectionHeading`** taking `{icon: LucideIcon, color: string, children}` — collapses the 15+ repeated `<h2 className="text-lg font-semibold text-foreground flex items-center gap-2"><Icon className="w-5 h-5 text-{color}-500" />{title}</h2>` blocks into one component. Justified purely by repetition count (15+ instances, byte-identical structure).

I'm not recommending a shared "InfoCard" for the `rounded-lg border border-border bg-card p-4` pattern — 5 instances with varying internal structure (some have probability badges, some have nested labeled fields) isn't clean enough to force into one prop shape without it becoming more complex than the duplication it replaces.

# 6. Remaining UX Problems

- **MetadataBadges mislabeling** actively misinforms the reader about what content type they're looking at — this directly violates "recognition over recall," the reader can't trust the badge to tell them where they are.
- **Prose bypass** silently breaks any content author's intent to use bold/links/lists in 5 content types — increases cognitive load because plain-text walls of prose with no emphasis are harder to scan than formatted text (violates scanning efficiency / visual hierarchy).
- **Raw `<pre>` for math** means Principle pages — the content type most likely to contain actual equations — can't display them properly. This is the opposite of progressive disclosure: the reader gets raw LaTeX source instead of typeset notation, actively increasing the effort needed to parse what should be the clearest part of the page.
- **Dual heading-size systems** cost nothing functionally but mean a reader moving between a Workflow and a Pattern page (both reachable from the same sidebar, same nesting level) sees different heading weights for structurally equivalent information — a small but real "is this the same app?" signal.

# 7. Final Recommendations

Only the high-ROI items, in order:
1. Fix `MetadataBadges type="workflow"` → `type="debug_guide"` in Debug Guide page. One line, zero risk, immediately corrects a visible mislabel.
2. Route the 5 bypassing content types' narrative fields through `Prose`. Mechanical swap, no visual redesign — `Prose` already renders plain text identically to a `<p>` when there's no markdown in it, so this is strictly additive.
3. Route Pattern `examples` and Principle `mathematical_formulation` through `CodeBlock` (examples, as code) and `Prose` (math formulation, to get KaTeX) respectively.
4. Do NOT unify the two heading-size systems in this pass — that's a genuine visual-language decision (which one becomes canonical) better suited for a deliberate follow-up, not bundled into a bug-fix pass this close to freeze.

# 8. Final Windsurf Prompt

```
CONTEXT
AENS UI architecture is frozen. This is the final pre-1.0 UI/UX pass.
Do NOT redesign any page. Do NOT unify the two heading-size systems
(Model/Workflow/Package/Cheatsheet vs Pattern/Principle/DebugGuide/
DecisionGuide) — that is an explicit deliberate decision out of scope
for this pass. Every change below is either a one-line prop fix or a
mechanical swap to an already-existing shared component (Prose,
CodeBlock) with no visual redesign intended.

FILES IN SCOPE
- app/debug-guides/[id]/page.tsx
- app/patterns/[id]/page.tsx
- app/principles/[id]/page.tsx
- app/decision-guides/[id]/page.tsx
- app/packages/[id]/page.tsx

═══════════════════════════════════════════════
STEP 1 — CRITICAL: Fix MetadataBadges type mismatch
FILE: app/debug-guides/[id]/page.tsx
═══════════════════════════════════════════════

Find:
  <MetadataBadges
    type="workflow"
    updatedAt={debugGuide.updated_at}
    lastVerified={debugGuide.last_verified}
    category={debugGuide.category}
  />

Change type="workflow" to type="debug_guide".

ACCEPTANCE CRITERIA: Every debug guide page displays a "Debug Guide"
content-type badge, not "Workflow".

═══════════════════════════════════════════════
STEP 2 — HIGH: Route narrative text through Prose
FILES: app/packages/[id]/page.tsx, app/patterns/[id]/page.tsx,
       app/principles/[id]/page.tsx, app/debug-guides/[id]/page.tsx,
       app/decision-guides/[id]/page.tsx
═══════════════════════════════════════════════

Import in each file (if not already imported):
  import { Prose } from '@/components/shared/Prose';

Replace every instance of the pattern:
  <ExpandableText cacheKey={...} fadeClass="from-background to-transparent">
    <p className="{existing classes}">{field}</p>
  </ExpandableText>
with:
  <ExpandableText cacheKey={...} fadeClass="from-background to-transparent">
    <Prose content={field} className="{existing classes}" />
  </ExpandableText>

Apply to these exact fields:
- packages/[id]/page.tsx: pkg.summary
- patterns/[id]/page.tsx: pattern.description, pattern.concept,
  pattern.applicability, pattern.implementation_notes
- principles/[id]/page.tsx: principle.description, principle.statement,
  principle.intuition
- debug-guides/[id]/page.tsx: debugGuide.description, and the raw
  <p>{symptom.description}</p> / <p>{cause.explanation}</p> /
  <p>{diag.expected_result}</p> / <p>{diag.how_to_perform}</p> /
  <p>{prev.prevention}</p> text (wrap each individually in Prose;
  these are NOT inside ExpandableText, just swap <p> for <Prose
  content=... /> directly)
- decision-guides/[id]/page.tsx: decisionGuide.description,
  decisionGuide.problem, decisionGuide.recommendations

Do NOT change ExpandableText's props, measurement logic, or the
surrounding section markup. Do NOT change any Tailwind classes beyond
moving them from <p className=...> to <Prose className=...>.

ACCEPTANCE CRITERIA: Any of the above fields containing markdown
(bold, links, lists) renders formatted. Fields with no markdown render
visually identically to before (Prose falls back to plain text
rendering when there's nothing to parse).

VALIDATION: For each file, load one entry with plain-text content and
confirm no visual change from before. If any test fixture content
contains markdown syntax, confirm it now renders formatted.

═══════════════════════════════════════════════
STEP 3 — HIGH: Route code/math through existing highlighted components
FILES: app/patterns/[id]/page.tsx, app/principles/[id]/page.tsx
═══════════════════════════════════════════════

patterns/[id]/page.tsx — Examples section:
Replace:
  <div key={idx} className="rounded-lg border border-border bg-card p-4">
    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
      {example}
    </pre>
  </div>
with:
  <div key={idx} className="rounded-lg border border-border bg-card p-4">
    <CodeBlock code={example} language="python" />
  </div>
Import: import { CodeBlock } from '@/components/shared/CodeBlock';
(Use language="python" as default since pattern examples in this
codebase are Python-oriented; if the Pattern schema has a language
field, use that instead — check types/pattern.ts first.)

principles/[id]/page.tsx — Mathematical Formulation section:
Replace:
  <div className="rounded-lg border border-border bg-card p-4">
    <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
      {principle.mathematical_formulation}
    </pre>
  </div>
with:
  <div className="rounded-lg border border-border bg-card p-4">
    <Prose content={principle.mathematical_formulation} className="text-sm text-muted-foreground" />
  </div>
(Prose already wires remarkMath + rehypeKatex — this gets LaTeX
typeset instead of raw source, no new dependency needed.)

ACCEPTANCE CRITERIA: Pattern examples render with syntax highlighting
and a copy button (via CodeBlock). Principle mathematical_formulation
containing $...$ or $$...$$ delimiters renders as typeset math, not
raw LaTeX text.

VALIDATION: npm run validate passes. npm run build passes, same page
count as before. Load one Pattern with an example and one Principle
with mathematical_formulation, visually confirm rendering.

═══════════════════════════════════════════════
DO NOT DO
═══════════════════════════════════════════════
- Do not unify heading sizes between the two page-template families —
  explicitly out of scope, needs a separate deliberate decision.
- Do not touch Model, Workflow, Cheatsheet, or Registry pages — not in
  scope for this pass, already audited separately.
- Do not build the SectionHeading or ProseText shared components
  suggested in this audit's findings — only apply Prose/CodeBlock
  directly to the fields listed above. Component extraction is a
  separate refactor decision, not bundled into this bug-fix pass.
- Do not change ExpandableText, CodeBlock, or Prose component
  internals — only change what call sites pass to them.

═══════════════════════════════════════════════
REGRESSION CHECKLIST
═══════════════════════════════════════════════
- npm run validate → 0 errors
- npm run build → compiles, same static page count as before this
  change
- TypeScript: npx tsc --noEmit → 0 errors
- Every Debug Guide page shows "Debug Guide" badge, not "Workflow"
- Every Pattern/Principle/DebugGuide/DecisionGuide/Package narrative
  field renders identically to before when content has no markdown,
  and renders formatted when it does
- Pattern examples show syntax highlighting + copy button
- Principle math formulations with $ or $$ delimiters render as
  typeset equations
- ExpandableText's expand/collapse and fade-gradient behavior is
  unchanged in all modified files
- Mobile: load one page per modified file at 375px, confirm no layout
  regression from the Prose/CodeBlock swap (Prose renders a wrapping
  element that <p> did not — verify no unexpected margin/padding shift)
- Accessibility: confirm no heading levels were altered (h1/h2
  hierarchy unchanged), confirm CodeBlock's existing copy-button aria
  labeling carries over unchanged into Pattern examples
```