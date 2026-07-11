# AENS Workflow Detail Page — Inspection Report
`app/workflows/[id]/page.tsx`

## Correction to task premise

The brief assumes the workflow schema now includes interface contracts, pipeline invariants, architectural decisions, and failure propagation chains. I read `lib/schemas/workflow.ts` directly — none of that exists. Actual `WorkflowSchema`:

- `steps[]`: step/name/what/tools/decision/uses/failure_points
- `worked_examples[]`: name/description/code/language/implementation_notes
- `common_failure_points[]` (flat strings)
- `evaluation_checks[]` (flat strings, optional)
- `production_notes / scaling_notes / cost_notes / latency_notes / observability_notes` (flat strings, optional)
- `related_patterns / related_models / related_packages / related_debug_guides`: typed `ContentRef[]`, default `[]`

The real gap is narrower than the brief describes: **typed relation fields exist in the schema but are never read by the page** (it calls `getRelatedContent('workflow', id)` instead — a separate, untyped lookup), and five parallel "notes" strings are rendered as undifferentiated paragraphs inside one collapsible instead of using any structure. Everything below is graded against what's actually in the repo.

---

## Executive Summary

**Overall quality: 6/10.** Functional, reasonably componentized, but showing schema/rendering drift and one clear scaling risk in cross-linking.

**Strengths**
- Step list is genuinely well done: collapsible, badges resolved link uses inline, decision/failure-point framing per step is good IA.
- TOC + `IntersectionObserver` scrollspy + hash deep-linking on `CollapsibleRow` is a solid, low-dependency navigation pattern.
- Layout separation (`ContentPageLayout` / `SectionCard` / `CollapsibleRow`) is consistent and reusable.

**Major weaknesses**
1. `related_patterns/models/packages/debug_guides` typed fields defined in schema, unused in the page — dead schema surface, and `RelatedContent` instead depends on `getRelatedContent`, which your own past audits flagged as O(n²).
2. Five distinct "Production Profile" notes (production/scaling/cost/latency/observability) are stuffed into one `CollapsibleRow` as plain `<p>` tags with no sub-navigation — undifferentiated wall of text once any note is long.
3. `resolvedLinks` construction in the page component does string-based type-map inference and array building on every render for every step — this is page-level business logic that belongs in `lib/data`.
4. No virtualization/lazy-loading anywhere; fine at current content sizes, a real problem at your stated 30+ section / 50+ code block scaling target.
5. TOC is `hidden xl:block` — anyone below a very large desktop breakpoint has zero persistent section index; they rely entirely on `StickyActionBar`'s bottom pill, which only shows top-level TOC entries (not steps).

**Highest priority**
1. Route `related_*` fields through `RelatedContent` and retire (or explicitly deprecate) the untyped `getRelatedContent` path per content type where typed lists now exist.
2. Give the "Production Profile" block real sub-structure (own headings + own scrollspy anchors, or split into a small tab set) instead of one undifferentiated collapsible.
3. Move `resolvedLinks` construction into `lib/data.ts` as `resolveWorkflowStepLinks(workflow)`, memoized/cached at build time (this is a static-generation site — do it once, not per-request logic in a Server Component that still re-runs the loop).

---

## Findings

### F1 — Typed relation fields unused
- **Severity:** High
- **Location:** `types/workflow.ts` → `related_patterns/models/packages/debug_guides`; `app/workflows/[id]/page.tsx` line using `getRelatedContent('workflow', workflow.id)`
- **Problem:** Schema declares four typed cross-link arrays with defaults; the page ignores them entirely and calls a generic content-graph lookup instead.
- **Root cause:** Schema evolved (typed refs added) without updating the render path — classic schema/UI drift, same pattern your earlier audits found in `aens.config.json` vs constitution.
- **Impact:** Any workflow author populating `related_patterns` etc. sees no effect. Two sources of truth for "related content" with no reconciliation.
- **Recommendation:** Either (a) merge `workflow.related_*` into the `relatedContent` array before passing to `RelatedContent`, dedup by `type+id`, or (b) drop the fields from the schema if `getRelatedContent` is meant to be canonical. Don't leave both.
- **Priority:** High. **Complexity:** Low (a few lines in `lib/data.ts`).

### F2 — Production Profile is an undifferentiated text dump
- **Severity:** Medium-High
- **Location:** `CollapsibleRow id="production"` block, ~5 `<div>` groups with a label + `<p>`
- **Problem:** production_notes/scaling_notes/cost_notes/latency_notes/observability_notes render as five stacked paragraphs inside one collapsible with a single scroll anchor (`#production`). No independent navigation, no visual separation beyond a label.
- **Root cause:** Fields were added to the schema individually over time (comment in schema literally reads "// Production notes" then "// Cost and Latency" then "// Observability" — three separate additions) without a matching structural upgrade in the render.
- **Impact:** For content-dense workflows (your stated goal — hours of reading), this becomes a 5-topic essay a reader can't jump within. Deep-linking to `#production` doesn't get you to "cost" specifically.
- **Recommendation:** Give each note its own `id` (`production-notes`, `production-cost`, etc.) inside the collapsible, or split into a small in-page tab/segmented control (Deployment / Scaling / Cost / Latency / Observability) so TOC could optionally list them as nested entries.
- **Priority:** High. **Complexity:** Medium (touches TOC array, CollapsibleRow content, no new deps).

### F3 — `resolvedLinks` built at request-time in the page component
- **Severity:** Medium
- **Location:** `app/workflows/[id]/page.tsx`, the `workflow.steps.forEach(...)` block building `resolvedLinks`
- **Problem:** Type-map inference (`typeMap[key] || key.endsWith('s') ...`), per-step iteration, and per-id existence/name/path lookups (`contentExists`, `getContentName`, `getContentPath`) all run inline in the page component.
- **Root cause:** Convenience — logic grew directly where it was first needed.
- **Impact:** This is a static-export (or ISR) site (`generateStaticParams`), so it's not a per-request cost in production, but it's a maintainability problem: business logic (resolving cross-links) is coupled to a specific page's JSX instead of being a testable, reusable data function. It also means `WorkflowStepList` receives a bag of pre-resolved links instead of owning its own resolution — makes the component less portable to other contexts (e.g., a workflow preview card).
- **Recommendation:** Move to `lib/data.ts` as `resolveWorkflowStepLinks(workflow): Record<string, Record<string, {name, href}>>`. Page becomes a two-line call. Unit-testable without rendering React.
- **Priority:** Medium. **Complexity:** Low.

### F4 — No virtualization or chunked loading for step lists / worked examples
- **Severity:** Medium (High at scale)
- **Location:** `WorkflowStepList`, worked-examples `.map()` in page
- **Problem:** All steps and all worked examples (including full `CodeBlock` renders) mount on initial load; only the step *body* is conditionally rendered (`isOpen &&`), but the header + surrounding DOM for every step exists regardless of the 30+ section scaling target you specified.
- **Root cause:** Not yet needed at current content volume.
- **Impact:** At 15-20+ steps with heavy worked examples, initial hydration cost grows linearly with content, not with what's visible.
- **Recommendation:** Not urgent today. When workflows commonly exceed ~15 steps, consider `content-visibility: auto` on closed step bodies (cheap, no new dependency) before reaching for a virtualization library — full virtualization is overkill for a document-reading page and breaks native find-in-page/anchor scrolling.
- **Priority:** Low now, Medium at scale. **Complexity:** Low (CSS only) if you choose `content-visibility`.

### F5 — Persistent TOC hidden below `xl` breakpoint
- **Severity:** Medium
- **Location:** `TableOfContents.tsx` — `className="hidden xl:block w-48 shrink-0"`
- **Problem:** Between mobile and `xl` (typically 1280px+), there is no persistent section index. `StickyActionBar` provides a bottom pill with prev/next/jump-sheet, but it only lists the same top-level `toc` array passed from the page (Overview/Steps/Worked Examples/Failure Points/Production/Evaluation) — it has no visibility into individual steps or individual production sub-notes.
- **Root cause:** Reasonable default (avoid TOC crowding on laptop-width screens) but no fallback affordance was added for the gap.
- **Impact:** A very common laptop viewport (13"-14", ~1440-1512 CSS px, often below `xl`'s 1280 breakpoint... actually 1440 > 1280 so it may be fine — check Tailwind's `xl` value in `tailwind.config`) — verify the actual breakpoint value before treating this as urgent; if `xl` is 1280px, most laptops clear it and this finding downgrades to Low.
- **Recommendation:** Confirm the exact `xl` breakpoint in your Tailwind config; if it's 1280px this is a non-issue. If it's higher (e.g., custom `1536px`), lower it or add a collapsed/icon-only TOC rail for the `lg`-`xl` range.
- **Priority:** Verify-then-decide. **Complexity:** Trivial once confirmed.

### F6 — Accessibility: collapsible content uses CSS `hidden`/`block`, not `role`/ARIA state beyond `aria-expanded`
- **Severity:** Low-Medium
- **Location:** `CollapsibleRow.tsx`
- **Problem:** `aria-expanded` and `aria-controls` are present (good), but the collapsed content div has no `hidden` attribute (native), it uses Tailwind's `hidden` class — functionally equivalent visually but screen readers/AT generally handle the native `hidden` attribute more predictably than a CSS class toggling `display:none` when combined with `aria-controls` pointing at content that's still technically in the DOM tree with focusable children. Also: `WorkflowStepList`'s step body has no equivalent `aria-controls` linking button→panel; only `aria-expanded` is present on the button.
- **Recommendation:** Add `aria-controls` to the step toggle button in `WorkflowStepList`, matching a stable `id` on the body panel div. Minor parity fix, cheap.
- **Priority:** Low. **Complexity:** Trivial.

### F7 — Design consistency: three different "section" visual patterns for structurally similar content
- **Severity:** Low
- **Location:** Page compares `SectionCard` (Steps), plain `<section>` div (Worked Examples), `<div id="failures">` custom rose-styled block, `CollapsibleRow` (Production), plain `<div id="evaluation">` card — five different container patterns for what are all "named content blocks with a heading."
- **Problem:** No single wrapper component for "titled content section with optional collapse/optional icon/optional accent color." Failure Points uses a hardcoded rose accent + no card border; Evaluation uses a full bordered card; Worked Examples uses its own bespoke card-in-card pattern.
- **Impact:** Maintainability — a future "make all section headers uppercase 11px" type change requires touching 5 different code shapes instead of 1 shared component's props.
- **Recommendation:** Not urgent to unify visually (some of this variation, like the rose accent on failure points, is intentional semantic signaling and should stay). But consolidate the *structural* pattern (container + optional collapse + heading + content) into one component with a `variant` prop, so accent color/border/collapsibility are props, not five hand-rolled JSX shapes.
- **Priority:** Low. **Complexity:** Medium (refactor touches every section, but no behavior change — pure consolidation).

---

## Refactoring Roadmap

**Critical:** none identified — no correctness bugs or broken user flows found in this page.

**High**
- F1: Reconcile typed `related_*` fields with `getRelatedContent`.
- F2: Structurally split Production Profile into navigable sub-sections.

**Medium**
- F3: Move `resolvedLinks` construction into `lib/data.ts`.
- F5: Verify/fix TOC breakpoint gap.

**Low**
- F4: `content-visibility: auto` on closed step bodies (pre-emptive, do when step counts grow).
- F6: ARIA parity fix on step toggle buttons.
- F7: Consolidate section-container patterns (do opportunistically, not as a dedicated sprint).

---

## Architectural Recommendations (no code)

1. **Single source of truth for cross-links.** Decide whether `related_*` typed fields or `getRelatedContent` graph traversal is canonical for workflows, and apply the same decision consistently across all 9 content types — this is a config/schema-freeze-level decision, not a per-page fix, per your `aens-chief-architech` constraints (additive, backward-compatible).
2. **Extract a `ContentSection` primitive.** One component parameterized by `{ title, icon?, accentColor?, collapsible?, id }` replacing the five ad hoc container patterns on this page. Purely additive — existing `SectionCard` and `CollapsibleRow` can become variants/wrappers of it rather than being replaced outright.
3. **Push per-page data-shaping into `lib/data.ts`.** `resolvedLinks` is the second instance (after your prior findings on `getRelatedContent`) of graph-resolution logic living in a page file. Establish a convention: pages call named `lib/data` functions, never build lookup maps inline.

---

## Windsurf Implementation Prompt

```
ROLE: Senior Next.js/React engineer working on a Zod-governed content architecture system (AENS). Architecture is frozen — prefer additive, backward-compatible changes. Do not introduce new npm dependencies. Do not change the WorkflowSchema shape (only how existing fields are consumed).

FILES TO INSPECT BEFORE CHANGING ANYTHING:
- app/workflows/[id]/page.tsx
- lib/data.ts (getRelatedContent, getWorkflow, contentExists, getContentName, getContentPath)
- lib/schemas/workflow.ts
- types/workflow.ts
- components/shared/RelatedContent.tsx
- components/shared/CollapsibleRow.tsx
- components/shared/WorkflowStepList.tsx
- components/shared/TableOfContents.tsx (confirm Tailwind `xl` breakpoint value in tailwind.config.ts / globals.css before touching)

TASK 1 — Reconcile typed relation fields with getRelatedContent
- In lib/data.ts, locate getRelatedContent('workflow', id).
- Modify it (or add a wrapper resolveWorkflowRelatedContent(workflow)) so that workflow.related_patterns, related_models, related_packages, related_debug_guides are merged into the returned ContentRef[] array, deduplicated by (type, id), with items from the typed fields taking precedence if there's a conflict.
- Do NOT change the return type — output must remain ContentRef[] compatible with the existing RelatedContent component prop.
- Verify contentExists is called for every merged item before inclusion (same integrity rule already applied to steps.uses).

TASK 2 — Restructure Production Profile into navigable sub-sections
- In app/workflows/[id]/page.tsx, inside the CollapsibleRow id="production" block:
  - Give each note div its own id: production-deployment, production-scaling, production-cost, production-latency, production-observability (only render the id if that specific note field is present).
  - Add scroll-mt-24 to each.
  - Do NOT add these as separate top-level TOC entries (would clutter the main TOC) — instead, keep the single "Production Profile" TOC entry, but ensure hash deep-links like #production-cost still expand the collapsible AND scroll to the specific sub-note. This requires updating CollapsibleRow's enableHashDeepLink effect to match on hash prefix (id or id-*) rather than exact match only — confirm this doesn't break its other callers (search for other enableHashDeepLink usages first).

TASK 3 — Extract resolvedLinks construction to lib/data.ts
- Add a new exported function in lib/data.ts: resolveWorkflowStepLinks(workflow: Workflow): Record<string, Record<string, { name: string; href: string | null }>>
- Move the exact logic currently inline in page.tsx (typeMap, forEach over steps, contentExists/getContentName/getContentPath calls) into this function unchanged in behavior.
- Update app/workflows/[id]/page.tsx to call const resolvedLinks = resolveWorkflowStepLinks(workflow); — this must produce byte-identical output to the current implementation on every existing workflow (regression check: diff rendered HTML for 3-5 sample workflow IDs before/after).

TASK 4 — ARIA parity on WorkflowStepList
- In components/shared/WorkflowStepList.tsx, add id={`step-panel-${s.step}`} to the collapsible body div, and aria-controls={`step-panel-${s.step}`} on the toggle button (alongside existing aria-expanded).

TASK 5 — Confirm and fix TOC breakpoint gap (only if verification shows a real gap)
- Read tailwind config / globals.css to find the xl breakpoint value.
- If xl >= 1400px: this is a real gap for common 13-14" laptop viewports. Change TableOfContents.tsx's wrapping className from "hidden xl:block" to "hidden lg:block" (verify this doesn't cause layout overflow with the main content column + StickyActionBar at lg widths — test at 1024px, 1280px, 1366px).
- If xl <= 1280px: no code change needed, note finding as resolved-by-verification in your summary.

IMPLEMENTATION ORDER: Task 3 first (pure extraction, easiest to verify with no visual diff) → Task 4 (trivial, isolated) → Task 1 (data layer change, testable independent of UI) → Task 5 (verify then maybe one-line change) → Task 2 (most invasive, touches shared CollapsibleRow behavior — do last, after everything else is stable).

SAFETY CONSTRAINTS:
- No changes to WorkflowSchema or any Zod schema file.
- No new npm packages.
- Task 2's CollapsibleRow hash-matching change must be verified against every other current usage of enableHashDeepLink in the codebase (grep first) to ensure no regression in exact-match deep links elsewhere.
- Preserve all existing prop signatures on shared components unless explicitly extending with new optional props.

REGRESSION PREVENTION CHECKLIST:
[ ] All existing workflow pages render with no missing sections after Task 3 refactor (spot-check 5 workflow IDs, compare rendered step "uses" badges before/after)
[ ] RelatedContent output after Task 1 shows no duplicate badges for any workflow that has both typed related_* fields AND graph-derived related content
[ ] CollapsibleRow's other current callers (grep for enableHashDeepLink) still deep-link correctly to their own ids after Task 2's matching logic change
[ ] No new hydration warnings in dev console on any workflow detail page
[ ] Existing hash links (e.g. #production, #evaluation, #failures) from any place in the app that references them still resolve correctly

PERFORMANCE CONSTRAINTS:
- Task 3 must not add runtime cost beyond what currently exists (it's a pure code-location move, should be net-neutral or better since it becomes independently memoizable later).
- No new client-side JS bundle growth (no new dependencies).

ACCESSIBILITY REQUIREMENTS:
- Task 4's aria-controls/id pairing must be unique per step across the page (use s.step, verified unique in schema — steps are numbered).
- Verify keyboard Tab order still reaches all interactive elements (step toggles, collapsible header, links) in logical order after any DOM restructuring in Task 2.

RESPONSIVE REQUIREMENTS:
- Test Task 2's restructured Production Profile at mobile (375px), tablet (768px), laptop (1280px), and desktop (1920px) widths — sub-note headings must not overflow or wrap awkwardly at narrow widths.
- Test Task 5's breakpoint change (if applied) at 1024px, 1280px, 1366px, 1440px specifically — these are the widths where TOC visibility changes.

ACCEPTANCE CRITERIA:
- Related Content section shows a deduplicated, complete list combining typed schema fields and graph-derived relations, with no visual regressions.
- Production Profile sub-notes are individually addressable via hash (if a specific note like production-cost exists) while remaining a single collapsible UI element.
- resolvedLinks logic lives in lib/data.ts, is exported, and page.tsx calls it in one line.
- Step toggle buttons have correct aria-controls pointing to their panel ids.
- No visual, behavioral, or performance regressions on any existing workflow detail page.

TESTING CHECKLIST:
[ ] Manual pass through at least 3 real workflow content files with different field combinations (one with all production notes, one with none, one with only some)
[ ] Verify existing automated tests in /tests directory still pass (locate and run relevant test files first — check tests/ directory structure before starting)
[ ] Lighthouse accessibility score comparison before/after (should not decrease)
[ ] Manual screen reader spot-check (NVDA or VoiceOver) on step expand/collapse and production profile expand/collapse
```
