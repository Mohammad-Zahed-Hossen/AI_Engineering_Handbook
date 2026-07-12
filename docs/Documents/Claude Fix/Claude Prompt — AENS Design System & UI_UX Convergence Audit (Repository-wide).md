I read the actual page implementations for Model, Package, Registry, Cheatsheet, plus Sidebar/TopBar/SearchBox/Breadcrumbs, and cross-referenced against the Workflow findings from earlier in this session. Here's what's real, with evidence, not assumptions.

**Scope honesty**: I did not read Patterns, Principles, Decision Guides, Debug Guides, the Home page, or `globals.css` line-by-line in this pass — I'll flag those as unverified where relevant rather than invent findings for them. Everything below is traced to actual source.

## 1. Executive Summary

The design system primitives (`Sidebar`, `TopBar`, `SearchBox`, `Breadcrumbs`, `MetadataBadges`, `BadgeRow`, `CodeBlock`/`CodeBlockInteractive`) are genuinely solid and consistently built — no defects found there. The inconsistency in this codebase is not in the shared components, it's in **which pages actually use them**. One content type (Registry) opted out of the shared layout system entirely. Two content types (Package, Cheatsheet) bypass the shared `Prose`/`SectionCard` patterns in specific spots. The Model page is measurably more polished than every other page because it's the one place someone clearly spent extra design effort building bespoke, well-considered sections — everything else is comparatively plain. This is a converging problem, not a diverging one: pull three pages up to the standard the other two already meet, don't invent a sixth new pattern.

## 2–8. Scores

| Metric | Score | Why |
|---|---|---|
| Repo-wide UI Consistency | 5.5/10 | Shared primitives are consistent; page-level composition is not (see Registry). |
| Repo-wide UX | 6.5/10 | Search, sidebar, nav are excellent. Content pages vary in polish. |
| Design System Consistency | 5/10 | No component library violations within `SectionCard`/`BadgeRow` themselves — the violation is non-adoption (Registry, parts of Cheatsheet/Package). |
| Documentation UX | 6/10 | Model page hits the Stripe/Vercel-docs bar. Workflow/Package/Cheatsheet don't, mainly from raw markup instead of shared containers. |
| Accessibility | Not independently scored | I found no missing `aria-label`s or keyboard traps in what I read (SearchBox has full roving-tabindex-style keyboard nav, `role="combobox"`, `aria-activedescendant` — genuinely well done). I did not test with a screen reader or measure contrast — don't take this as a clean bill of health, just "nothing broken found in static read." |
| Mobile UX | Not independently scored, same caveat | Registry page has an actual mobile-specific card view (`md:hidden` block) that other pages don't bother with — worth noting as inconsistent effort, not a defect. |
| Content Density | 6/10 | Cheatsheet page is the worst offender: 10+ near-identical hand-rolled `<table>` blocks in one file. |

## 9. Component Consistency Audit

| Component | Verdict |
|---|---|
| `Sidebar.tsx` | Clean. Alpha-grouping threshold, item-limit-with-active-item-pinning logic is duplicated per content type (`applyItemLimit` called ~9 times with near-identical surrounding JSX) — this is repetitive but not visibly inconsistent to the user. Low-priority refactor candidate, not a UX bug. |
| `TopBar.tsx` / `SearchBox.tsx` | Clean, no issues. Keyboard shortcut (`/` to focus), recent searches via localStorage, proper ARIA combobox pattern. |
| `Breadcrumbs.tsx` | Clean, single shared component. **But**: Registry's detail page doesn't render it at all — see below. |
| `MetadataBadges.tsx` | Confirmed shared and consistently invoked by Model, Package, Cheatsheet, Workflow with matching prop shapes. Not used by Registry (no metadata badges of any kind on that page). |
| `SectionCard.tsx` | Used correctly on Workflow's Steps section. Not used by: Workflow's Worked Examples/Failure Points/Evaluation (ad hoc divs, per prior audit), Cheatsheet's 10+ table sections (ad hoc divs), Model's Decision Board/Quick Start (custom bespoke markup, not ad hoc but also not `SectionCard`). Net effect: `SectionCard` is the least-adopted "shared" component in the system relative to how much section-wrapping happens across the app. |
| `Prose`/`ProseClient` | Used by Model, Workflow, Cheatsheet (entry descriptions) for narrative text. **Not used by Package** — `pkg.summary` renders via a raw `<p>{pkg.summary}</p>` inside `ExpandableText`, meaning markdown syntax in package summaries (bold, links, `[^N]` footnotes) renders as literal text, not formatted content. This is a real, confirmed inconsistency. |
| `CodeBlock`/`CodeBlockInteractive` | `CodeBlock` (static, server, no expand/collapse) used correctly by Model (quickstart), Package (task syntax/example), Cheatsheet (entry snippets). `CodeBlockInteractive` (collapsible, copy, wrap) only used by Workflow steps. This split is intentional and fine — quickstart/task snippets are short, workflow step code can be long — not a defect. |
| `RelatedContent.tsx` | Consistently used at the bottom of Model, Package, Cheatsheet, Workflow. Confirmed absent from Registry (no related-content section at all on that page type). |
| `OfficialResources.tsx` | Used by Model, Package, Cheatsheet, Workflow with matching prop shape (`sources`, `githubRepo`, optional `hasLearningResources`). Confirmed absent from Registry. |

## 10. Page-by-Page Audit

**Model** (`app/models/[category]/[id]/page.tsx`) — Most polished page in the app. Custom Decision Board with real semantic color coding (emerald=use-when, amber=avoid-when, teal=strengths, rose=limitations), icon-led section headers, a genuinely well-composed Quick Start block with language/package badges and implementation notes callout. This is your "Stripe docs" bar. Nothing else in the app meets it.

**Workflow** — Covered exhaustively in prior audit turns in this session. Confirmed defects: code sometimes bypasses `CodeBlockInteractive` (content-authoring gap), `decision` field format inconsistent across the 5 workflow JSONs, dead footnote links via `linkFootnotes`, Worked Examples/Failure Points use ad hoc divs instead of `SectionCard`.

**Package** — Simplest page in the app. Confirmed defect: package summary bypasses `Prose` entirely (raw `<p>`), so it's the one narrative text field in the whole app that can't render markdown. Otherwise clean — `QuickSetupSection`, `PackageTaskList`, `OfficialResources`, `RelatedContent` all reused correctly.

**Registry** — Confirmed the largest structural outlier in the app. It does not use `ContentPageLayout`, has no breadcrumbs, no `MetadataBadges`, no TOC, no `OfficialResources`, no `RelatedContent`. It's a completely bespoke page with its own header card and its own from-scratch responsive table/card-list pattern, both styled with a third, unique set of Tailwind classes not shared with Cheatsheet's tables. This is the single clearest "doesn't feel like the same app" finding in the whole audit — a user navigating Model → Workflow → Registry hits a page that has no visual throughline to the previous two at all (no breadcrumb trail back, different card chrome, different table styling).

**Cheatsheet** — Functionally solid, but the file is ~330 lines of near-duplicated table markup — 10 separate sections each hand-writing `overflow-x-auto rounded-lg border border-border` + `table w-full text-left border-collapse text-xs` + `thead className="bg-muted/40..."`. Every one of these should be one shared `<DataTable>` component taking `headers`/`rows` — right now a single styling change (e.g., adjusting header background) requires editing 10 call sites in one file, and this file is the one most likely to have that need given it has the most tables in the app.

**Patterns, Principles, Decision Guides, Debug Guides, Home** — Not inspected in this pass. Given the pattern found above (some content types silently diverge from the shared layout), I'd flag these as needing the same check before freeze, not assume they're fine by default.

## 11. Design System Violations

1. Registry page opts out of `ContentPageLayout`, `Breadcrumbs`, `MetadataBadges`, `OfficialResources`, `RelatedContent` — the biggest single violation in the repo.
2. Package summary bypasses `Prose`/`ProseClient` — only narrative field in the app that doesn't get markdown rendering.
3. Cheatsheet's 10+ hand-rolled tables — no shared `DataTable` primitive exists despite the repeated need.
4. `SectionCard` under-adopted — Workflow's Worked Examples/Failure Points, Model's Decision Board/Quick Start, and all of Cheatsheet's table sections use bespoke wrapper divs instead.

## 12. Remaining UX Problems, by severity

- **Critical**: Registry page's non-participation in `ContentPageLayout` — no way back via breadcrumb, no related content, no TOC. A dead end in the navigation model relative to every other content type.
- **High**: Package summary not rendering markdown (silent content bug — any package summary authored with bold/links/footnotes displays broken literal syntax).
- **High**: Workflow code/decision/footnote issues (carried over from prior audit, not yet fixed).
- **Medium**: Cheatsheet table duplication — maintainability risk, not a visible bug today, but one styling request away from becoming an inconsistency across 10 sections.
- **Low**: `Sidebar`'s `applyItemLimit` JSX duplicated ~9 times — works fine, just verbose.

## 13. Recommended Improvements, with rationale

- Wrap Registry's detail page in `ContentPageLayout` with real breadcrumbs (`Home / Registry / {task}`) and add `RelatedContent`. Rationale: it's the only page in the app a user can land on with zero path back to related material — every other content type treats "related content" as core to the documentation-UX goal you stated (recognition over recall, information scent).
- Route `pkg.summary` through `Prose` instead of raw `<p>`. Rationale: one-line fix, closes a silent content-rendering gap, makes Package consistent with every other content type's narrative text handling.
- Extract a shared `DataTable` component (`headers: string[]`, `rows: (string|ReactNode)[][]`) and replace Cheatsheet's 10 hand-rolled tables with it. Rationale: this is the highest-density, highest-repetition content type in the app — it's the one most likely to need a styling tweak later, and the one where hand-editing 10 call sites is most error-prone.
- Do not rebuild Model's Decision Board as a shared component and retrofit it everywhere — that page's bespoke polish is appropriate to a model's decision-heavy content and doesn't need to be forced onto Workflow/Package, which have different information shapes. Consistency doesn't mean identical layout everywhere; it means every page reaches the same floor of "looks like it belongs to one system," which today mainly means: has a breadcrumb, has a TOC, has Related Content, and renders its narrative text through `Prose`.

## 14. Prioritized Roadmap

- **Critical**: Registry → `ContentPageLayout` migration (breadcrumbs, RelatedContent, TOC if applicable).
- **High**: Package summary → `Prose`. Workflow fixes (code field migration, decision field format, footnote removal) carried from prior audit.
- **Medium**: Cheatsheet → shared `DataTable` component.
- **Low**: Sidebar `applyItemLimit` DRY-up (cosmetic code quality, zero visible UX impact — optional).

## 15. Final Windsurf Implementation Prompt

```
CONTEXT
AENS is approaching UI architecture freeze. Do not redesign any page.
Do not introduce new visual languages. All fixes below either (a) bring
an existing page up to the pattern every other content-type page
already uses, or (b) extract genuinely duplicated markup into one
shared component with IDENTICAL visual output to what exists today.

FILES IN SCOPE
- app/registry/[task]/page.tsx
- app/packages/[id]/page.tsx
- app/cheatsheets/[id]/page.tsx
- components/shared/ (new: DataTable.tsx)

═══════════════════════════════════════════════
PRIORITY 1 — CRITICAL
═══════════════════════════════════════════════

TASK 1: Migrate Registry detail page to ContentPageLayout
FILE: app/registry/[task]/page.tsx

Currently this page renders a fully custom header/table/card layout
with no ContentPageLayout, no Breadcrumbs, no MetadataBadges, no
RelatedContent, no OfficialResources. Every other content-type detail
page (Model, Package, Workflow, Cheatsheet) uses ContentPageLayout.

1. Wrap the existing content in <ContentPageLayout> with:
   breadcrumbs={[
     { label: 'Home', href: '/' },
     { label: 'Registry', href: '/registry' },
     { label: titles[validTask] || validTask },
   ]}
2. Keep the existing header card, mobile card view, and desktop table
   view EXACTLY as they are — this is a layout wrapper change, not a
   visual redesign of the table/card content itself.
3. Do NOT add MetadataBadges, OfficialResources, or RelatedContent
   unless a natural data source exists for them (registry entries are
   just model_id/task/size_mb/link — there may be nothing meaningful
   to relate). If getRelatedContent('registry', validTask) has no
   caller precedent, skip RelatedContent rather than fabricate content.
4. Confirm toc prop is either omitted (if ContentPageLayout supports
   no-TOC pages — check existing usage) or set to a minimal single-item
   TOC pointing at the table.

VALIDATION: npm run build passes. Load /registry/embedding (or any
valid task), confirm breadcrumb trail renders and matches the visual
weight of breadcrumbs on /workflows/[id] or /models/[category]/[id].

═══════════════════════════════════════════════
PRIORITY 2 — HIGH
═══════════════════════════════════════════════

TASK 2: Render package summary through Prose
FILE: app/packages/[id]/page.tsx

Current:
  <ExpandableText cacheKey={`pkg-summary-${pkg.id}`} fadeClass="from-background to-transparent">
    <p className="content-prose text-sm text-muted-foreground">{pkg.summary}</p>
  </ExpandableText>

Change the inner <p> to use the shared Prose component (already
imported elsewhere in the codebase as
`import { Prose } from '@/components/shared/Prose'`):
  <ExpandableText cacheKey={`pkg-summary-${pkg.id}`} fadeClass="from-background to-transparent">
    <Prose content={pkg.summary} className="content-prose text-sm text-muted-foreground" />
  </ExpandableText>

VALIDATION: npm run build passes. Confirm any package summary
containing markdown (bold, links) renders formatted, not as literal
asterisks/brackets. Confirm ExpandableText's height-measurement/collapse
behavior still works correctly with Prose's rendered output (Prose may
render a wrapping <div> instead of bare text — verify ExpandableText's
ResizeObserver still measures correctly).

═══════════════════════════════════════════════
PRIORITY 3 — MEDIUM
═══════════════════════════════════════════════

TASK 3: Extract shared DataTable component for Cheatsheet
FILES: components/shared/DataTable.tsx (new),
       app/cheatsheets/[id]/page.tsx

Create a new component:

  interface DataTableProps {
    headers: string[];
    rows: React.ReactNode[][];
    monoColumns?: number[]; // column indices that should render font-mono font-semibold text-foreground
  }

  export default function DataTable({ headers, rows, monoColumns = [] }: DataTableProps) {
    return (
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-muted/40 font-semibold text-foreground border-b border-border">
            <tr>{headers.map((h, i) => <th key={i} className="p-3">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row, ri) => (
              <tr key={ri} className="hover:bg-muted/10">
                {row.map((cell, ci) => (
                  <td key={ci} className={cn('p-3', monoColumns.includes(ci) ? 'font-mono font-semibold text-foreground' : 'text-muted-foreground')}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

Replace ALL 10 hand-rolled table blocks in app/cheatsheets/[id]/page.tsx
(pyplot_vs_object_oriented_api, common_plot_types, figure_layout_options,
savefig_parameters, rcparams_quick_reference, marker_reference,
line_styles, named_colors, recommended_colormaps, quick_references,
performance_checklist) with <DataTable> calls. Output HTML/classes
must be byte-for-byte visually identical to what exists today — this
is a refactor for maintainability, not a restyle.

VALIDATION: npm run build passes. Diff-check rendered output of one
cheatsheet page before/after — visually identical. Confirm no table
lost its mono-column styling (marker/style/color/setting/parameter/
attribute columns were bold+mono before, must remain so).

═══════════════════════════════════════════════
DO NOT DO
═══════════════════════════════════════════════
- Do not touch Model page — it is the reference-quality bar, not a
  problem.
- Do not touch Sidebar.tsx, TopBar.tsx, SearchBox.tsx, Breadcrumbs.tsx —
  confirmed clean, no defects found.
- Do not build a new shared component to replace Model's Decision
  Board or Quick Start sections — their bespoke styling is appropriate
  to that content type, not a violation to "fix."
- Do not touch Patterns, Principles, Decision Guides, or Debug Guides
  pages in this pass — they were not audited; a follow-up pass should
  check them against the same ContentPageLayout/Prose/RelatedContent
  checklist before assuming they're compliant.
- Do not attempt the Sidebar applyItemLimit DRY-up in this pass — it's
  cosmetic code-quality only, zero visible UX impact, and touches the
  most complex file in the app; not worth the regression risk this
  close to freeze.

═══════════════════════════════════════════════
REGRESSION CHECKLIST
═══════════════════════════════════════════════
- npm run validate → 0 errors
- npm run build → compiles, same page count as before
- /registry/[task] now shows a breadcrumb trail matching other pages
- Package pages with markdown in summary render it correctly
- All 10 Cheatsheet tables render identically to before (visual diff)
- No new TypeScript or lint errors
```