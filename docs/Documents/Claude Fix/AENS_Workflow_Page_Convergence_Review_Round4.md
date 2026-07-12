# AENS Workflow Detail Page — Convergence Review (Round 4)

**Roles:** Senior Documentation Architect / Principal UX Engineer / Design System Reviewer
**Method:** Every claim in the "Already Solved" list was independently re-verified against the live repository (`feature/repository-foundation-v2`, latest pull) before writing anything below — including running the actual `truncateHighlightedHtml` regex against realistic Shiki output in Node, and tracing brace-nesting depth in `WorkflowStepList.tsx` to confirm a structural claim, rather than reading the code casually. No claim below is asserted without having read the exact lines it's based on.

---

## 1. Executive Summary

**Overall Score: 7/10.** Real, substantial progress since the last round — six of the eight "already solved" items check out as genuinely, correctly implemented, which is unusually good execution fidelity for this many parallel fixes. But this round's inspection surfaced **two new Critical-severity bugs that were introduced by the fixes themselves**, one of which (a React anti-pattern causing full remount of every step on every toggle) is more disruptive than several of the issues it was implicitly fixing, and the other (a regex bug that corrupts the collapsed code view for any multi-token line) produces visibly broken output the moment a real, syntax-highlighted, long code block appears.

**Remaining Strengths:**
- `hidden="until-found"` + imperative `beforematch` listeners are correctly implemented in both `WorkflowStepList.tsx` and `CollapsibleRow.tsx` — genuine, working find-in-page support.
- `CodeBlockInteractive.tsx`'s three-state wrap logic (`null` = CSS default, `true`/`false` = manual override) correctly eliminates the previous hydration-order CLS bug — verified, no `useEffect`/`matchMedia` state flip remains.
- `TableOfContents.tsx` correctly uses `#main-scroll` as the `IntersectionObserver` root, and the `lg` breakpoint change is real.
- `parseLabeledClauses.ts` is a clean, correctly-guarded utility (returns `null` on any non-clean match, protecting older content) and is wired into every location it needs to be (per-step failure points, `common_failure_points` with a two-tier fallback for an optional 8th clause, and all five Production Profile fields).
- `WorkflowStepSchema.uses` and Starter Stack resolution (F9/F8 from the prior round) are both genuinely, correctly implemented.

**Critical Weaknesses:**
1. `WorkflowStepItem` (the per-step render component) is declared **inside** `WorkflowStepList`'s function body, not at module scope — meaning a brand-new component function is created on every render of the parent, forcing React to fully unmount and remount every single step's DOM subtree on every toggle, `Expand All`, or `Collapse All` click. This is the same class of bug already documented once before in this project's history (a "remount anti-pattern" was previously found and fixed on the Model detail page's `HyperparameterPriorityBar`) — it has recurred here, freshly, in a different component.
2. `truncateHighlightedHtml`'s line-span regex (`/<span class="line"[^>]*>[\s\S]*?<\/span>/g`) is non-greedy and stops at the **first** `</span>` it finds — which, for any line with more than one syntax-highlighted token (i.e., almost every real line of code), is a nested token's closing tag, not the line's own. I verified this empirically: run against realistic two-token Shiki output, the "line" matches it extracts are truncated mid-line, missing most of each line's content and leaving an unclosed span. The collapsed view of any sufficiently long, syntactically colorful code block will visibly show only the first colored word of each line.

**Top 3 Architectural Priorities:**
1. Move `WorkflowStepItem` to module scope (outside `WorkflowStepList`), or `useMemo`/hoist it correctly — this is a one-line-of-reasoning, moderate-effort structural fix with an outsized correctness/perf payoff.
2. Fix the line-span regex in `truncateHighlightedHtml` to match balanced, complete line spans rather than stopping at the first inner closing tag.
3. Apply the `Prose`/`ProseInline` markdown pipeline to `workflow.overview`, `step.what`, `step.decision`, and `example.implementation_notes` — still entirely unaddressed from the original inspection round, and now the most visible remaining gap given everything else has caught up.

---

## 2. Remaining Verified Findings

**F1 — [Critical] `WorkflowStepItem` component is defined inside its parent's function body, causing full remount on every state change**
- **Evidence & Location:** `WorkflowStepList.tsx`. I traced brace-nesting depth programmatically rather than eyeballing indentation: `WorkflowStepList` opens its function body at line 16 (depth → 1). `interface WorkflowStepItemProps` (line 93) and `function WorkflowStepItem({...` (line 102) both begin at depth 1 — i.e., strictly inside `WorkflowStepList`'s own body — and `WorkflowStepList`'s own `return (` statement (line 232) is also at depth 1, confirming the entire `WorkflowStepItem` function declaration sits between the hook/helper definitions and the final return of its parent, not beside it at module scope.
  ```tsx
  export default function WorkflowStepList({ steps, resolvedLinks, workedExamples }: WorkflowStepListProps) {
    const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));
    // ...toggleStep, expandAll, collapseAll, renderUses, renderAllUses...

  interface WorkflowStepItemProps { /* ... */ }

  function WorkflowStepItem({ s, idx, isOpen, toggleStep, renderAllUses, relatedExample }: WorkflowStepItemProps) {
    // ...full step rendering, including its own useEffect for beforematch...
  }

    return ( <> ... <WorkflowStepItem key={s.step} .../> ... </> );
  }
  ```
- **Root Cause & User Impact:** Every time `WorkflowStepList` re-renders — which happens on every single step toggle, since `expandedSteps` state lives in the parent — a syntactically new `WorkflowStepItem` function is created. React identifies component types by reference equality; a new function reference each render means React treats every `<WorkflowStepItem>` element as a different component type than last render, and fully unmounts and remounts the entire subtree (including tearing down and re-running the `beforematch` `useEffect` inside it) rather than reconciling and updating it. For the user, this likely manifests as: loss of any browser-native state inside a step (text selection, potentially scroll position within a step, focus), a brief flash/repaint on every toggle instead of a smooth transition, and completely defeats the `content-visibility: auto` optimization's purpose (which exists precisely to make repeated show/hide cheap — remounting is the opposite of cheap).
- **Engineering Impact:** This also means `Expand All` (Task/feature confirmed present and working functionally) is the worst-case trigger — it remounts every step in the list simultaneously.
- **Recommended Solution:** Move the `WorkflowStepItemProps` interface and `WorkflowStepItem` function declaration outside of and above `WorkflowStepList`, to module scope, exactly as `renderUses`/`renderAllUses` conceptually should be (those are currently closures defined inside `WorkflowStepList` too, which is fine for plain functions passed as props — the actual problem is unique to **component** functions, since only components carry React's type-identity-based reconciliation semantics). No behavior change is needed beyond relocating the declaration; the props already fully describe what `WorkflowStepItem` needs from its parent.
- **Risks & Trade-offs:** None of substance — this is a pure relocation, not a logic change. Verify after the move that `WorkflowStepItem` no longer implicitly relies on any closure variable from `WorkflowStepList`'s scope that isn't already passed as a prop (a quick compile-check will catch this immediately, since TypeScript will error on any now-out-of-scope reference).
- **Complexity & Priority:** Low complexity, Critical priority (this is the single highest-leverage fix available this round — it undoes real user-facing benefit from several of the fixes already shipped).

**F2 — [Critical] `truncateHighlightedHtml`'s line-span regex breaks on any multi-token line**
- **Evidence & Location:** `CodeBlock.tsx`, `truncateHighlightedHtml()`:
  ```ts
  const lineSpanRegex = /<span class="line"[^>]*>[\s\S]*?<\/span>/g;
  ```
  Verified empirically (not just by inspection) by running this exact regex in Node against realistic two-token-per-line Shiki HTML:
  ```
  Input line 1: <span class="line"><span style="color:#F97583">def</span> <span style="color:#B392F0">foo</span>():</span>
  Actual match: <span class="line"><span style="color:#F97583">def</span>
  ```
  The match stops at the *first* `</span>` — which closes the inner `def` token span, not the outer line span — discarding `" foo():` and the line's own closing tag entirely.
- **Root Cause & User Impact:** `[\s\S]*?` is non-greedy, so the regex engine takes the shortest possible match satisfying the pattern, which is "up to the nearest `</span>`" rather than "up to this line's own matching `</span>`." Since Shiki wraps every individually-colored token in its own nested `<span>` (which it does for any line with more than one syntax color present — true for virtually all real code), every extracted "line" is actually just its first token, with the rest of the line silently dropped and one span left unclosed. When these fragments are joined and inserted via `dangerouslySetInnerHTML`, the browser's HTML parser auto-recovers from the unclosed tags in an unpredictable way — the practical result is that the collapsed view of any code block over 20 lines will show only the first highlighted word of each line, with everything else in that line simply missing.
- **Engineering Impact:** This is worse than the bug it replaced (the original truncate-before-highlight ordering, fixed correctly elsewhere in this same function) — the original bug mis-colored the tail of a truncated line; this one deletes most of every line's visible content in the collapsed state.
- **Recommended Solution:** Match balanced spans rather than "up to the next closing tag." The reliable approach: don't regex the tag structure at all — instead, walk the string tracking a depth counter that increments on every `<span` open tag and decrements on every `</span>`, and only consider a "line" complete when depth returns to the level it was at when the line span opened. Alternatively, if a DOM parser is available in the build environment (this runs server-side in a Node context via the `CodeBlock` async server component, so `jsdom` or similar could be used, though that may be a heavier dependency than warranted for this), parse the HTML into a real DOM tree, select the first N `.line` elements by their actual element boundaries (not string search), and serialize just those back to HTML — this sidesteps the whole class of nested-tag regex bugs by construction.
- **Risks & Trade-offs:** A hand-written depth-counter walk is more code than a regex one-liner, but it's the only string-based approach that's actually correct here — regex cannot reliably match balanced/nested tag structures in general (a well-known limitation, not specific to this codebase). A DOM-based approach is more robust but is a small dependency/complexity trade-off worth weighing against how often collapsed-view code truly needs pixel-perfect correctness.
- **Complexity & Priority:** Medium complexity (needs a real depth-tracking implementation, not a regex tweak). Critical priority — verify against both newly-added workflows' worked examples immediately, since this is very likely already visibly broken in production for any code block exceeding 20 lines with typical multi-color syntax.

**F3 — [High] Markdown/footnote rendering pipeline still entirely unapplied to Workflow's own text fields**
- **Evidence & Location:** `Prose`/`ProseInline` are not imported anywhere in `app/workflows/[id]/page.tsx` or `components/shared/WorkflowStepList.tsx` (confirmed via direct grep — zero matches). `workflow.overview`, `step.what`, `step.decision`, and `example.implementation_notes` are all still rendered as plain interpolated strings inside `<p>` tags.
- **Root Cause & User Impact:** This was flagged in the very first inspection round and has not been touched while six other, later-flagged issues were fixed — likely deprioritized as "known but not urgent" each round in favor of newer findings, and never actually scheduled. Footnote markers like `[^1]` inside `overview` (a real citation convention used by the adopted Prompt v3.0 content template) render as literal bracketed text with no link to the `Sources` list; any bold/italic/list markdown a researcher includes in `step.decision` or `implementation_notes` renders as literal asterisks/underscores rather than formatted text.
- **Engineering Impact:** Low — the `Prose`/`ProseInline` components already exist and are used correctly elsewhere in the app; this is a wrap-the-existing-field-in-an-existing-component change, not new infrastructure.
- **Recommended Solution:** Wrap `workflow.overview` in `<Prose>` (block-level, since it's a genuine paragraph) and `step.what`/`step.decision`/`example.implementation_notes` in `<ProseInline>` (or `<Prose>` if any of them are expected to contain multi-paragraph or list content — check actual content samples in `data/workflows/*.json` to decide which is appropriate per field before implementing, don't assume). For footnotes specifically, confirm `Prose`'s underlying `remark`/`rehype` pipeline actually resolves `[^1]`-style footnote syntax to linked superscripts by default (this depends on which remark plugins are configured, per the earlier `Prose.tsx` inspection showing `remark-gfm`/`remark-math`/`rehype-katex` — footnotes are a GFM-adjacent but not core-GFM feature; verify `remark-gfm`'s footnote support is actually enabled, or a dedicated footnote plugin may be needed) and, separately, that the footnote target actually links to the corresponding entry in the workflow's own `sources` array (this is Workflow-specific data-wiring, not something `Prose` can do generically — likely needs a small custom remark/rehype transform mapping `[^N]` to `workflow.sources[N-1]`, which is new, workflow-specific work beyond just "wrap in Prose").
- **Risks & Trade-offs:** Wrapping in `Prose`/`ProseInline` for the plain-text case is low-risk. The footnote-to-`sources`-array linking is the one piece of this finding that's genuinely new implementation work, not just reuse — scope it as a distinct, smaller sub-task so it doesn't block the larger, safer win of just fixing markdown rendering generally.
- **Complexity & Priority:** Low-Medium for the `Prose`/`ProseInline` wrap; Medium for the footnote-to-sources linking specifically. High priority overall — this is now the most-aged open finding in the whole review history for this page.

**F4 — [Medium] Compact pill-row Table of Contents is structurally placed as a flex-row sibling, not a stacked full-width element**
- **Evidence & Location:** `ContentPageLayout.tsx`:
  ```tsx
  <div className="flex gap-8 items-start">
    <div className="min-w-0 flex-1 space-y-8">{/* main content */}</div>
    {toc && <TableOfContents items={toc} />}
    <StickyActionBar tocItems={toc} />
  </div>
  ```
  `TableOfContents` renders both its sidebar `<aside>` (`hidden lg:block`) and its pill-row `<div className="hidden md:block lg:hidden w-full shrink-0">` as direct children of this call site — meaning both are siblings of the main content div inside a single `flex` **row** container, not stacked vertically above it.
- **Root Cause & User Impact:** At `md`-to-`lg` widths, the pill-row variant (intended to be a full-width horizontal bar) is a flex item in the same horizontal row as the `flex-1` main content column. A `w-full` flex item in a `flex-nowrap` row alongside a `flex-1` sibling is a structurally contradictory sizing instruction — the two are competing for the same row's width using incompatible sizing models (percentage-of-container vs. flex-grow). Depending on exact container width and content, this is likely to either force horizontal overflow on the whole layout row or squeeze the pill row into a sliver of space far narrower than intended, rather than the full-width horizontal bar it's meant to be. I want to be precise about confidence here: I verified the JSX structure directly and consider a layout defect at `md`-`lg` widths highly likely by construction, but did not render this in an actual browser to observe the exact visual failure mode — a quick visual check at 800px and 1000px width is the fast way to confirm before investing in the fix below.
- **Recommended Solution:** The pill-row variant needs to render in a separate, full-width row of the page layout — either move it out of `TableOfContents` entirely and render it as a sibling *above* the `flex gap-8` row in `ContentPageLayout` (conditionally, only at `md`-`lg`), or restructure `ContentPageLayout` to wrap everything in a `flex-col` at those widths with the pill row as its own full-width row and the content+sidebar flex-row nested beneath it.
- **Risks & Trade-offs:** Restructuring `ContentPageLayout` affects every content type that uses it (Models, Packages, Cheatsheets, etc. — confirmed a shared component), not just Workflow, so verify the fix doesn't regress the same responsive range on those other pages.
- **Complexity & Priority:** Low-Medium complexity, but touches a shared layout component — test broadly. Medium priority (real risk, but confirm visually before treating as certain).

**F5 — [Low] Two specifically-alleged bugs did not reproduce in the current code — stated for the record, not assumed fixed elsewhere**
- The brief's "See More button collision with Starter Stack" (from `ExpandableText.tsx`): the "See More" trigger is absolutely positioned *inside* the same `overflow-hidden`, height-constrained container that clamps the text — it cannot overlay a sibling element like Starter Stack below it, since it doesn't escape its own parent's bounds. A milder, likely-intentional overlap of the button with the last visible line of clamped text (a common "fade + action" affordance, same pattern used by GitHub/Medium) does exist by design, but this is not the cross-element collision described.
- The brief's "Sticky Action Bar labels displaying as `Previous section§Overview`": the label markup is `<span className="truncate">§ {activeLabel}</span>` — a literal space is present between "§" and the expression in the same JSX text line, which JSX preserves (it only collapses whitespace across line breaks, not within one). This renders as "§ Overview", correctly spaced. Separately, "Previous section" only exists as an `aria-label` on an icon-only button (not visible text), so it could not visually concatenate with anything on-screen regardless.
- **Recommendation:** No action needed for either. If either was observed visually rather than inferred, it may be worth a fresh screenshot to compare against a specific commit, since the current source does not support either description.

**F6 — [Low] Unresolved Starter Stack tools default to a "package" badge label even when the tool isn't necessarily a package**
- **Evidence & Location:** `page.tsx`, Starter Stack resolution block: `type = null` initially, only set to `'package'`/`'model'` on a successful `contentExists` match; the badge render falls back to `<ContentTypeBadge type={type || 'package'} .../>` regardless of whether resolution actually succeeded.
- **Impact:** A tool name that matches neither an existing package nor model (e.g. a cloud service, a CLI tool, or a library not yet documented in AENS) still displays a "PACKAGE" badge, which is a minor mislabeling — cosmetic, not functional (the badge correctly has no link in this case).
- **Recommendation:** Use a neutral/generic badge type (or a dedicated `'tool'` type if `ContentTypeBadge` supports an unstyled fallback) when resolution fails, rather than defaulting to `'package'`.
- **Priority:** Low. **Complexity:** Trivial.

**F7 — [Low, observational] `parseLabeledClauses`'s exact-match requirement is correctly conservative but will silently degrade to plain text if real content drifts from the expected label set**
- **Evidence:** Confirmed the utility requires every label in the provided list to be present, with no partial-match tolerance; `common_failure_points` already needs a two-tier fallback call (with/without an optional 8th "Recovery strategy" clause) to handle the real content's actual variability.
- **Impact:** This is a safe design (never mis-renders, only ever falls back to today's plain-text behavior), but it means any future drift in the content generation prompt's exact label wording (e.g. "Recommended Detection:" vs. "Detection Method:") will silently stop parsing for that entry with no warning, rather than a visible error — worth knowing about, not urgent to change.
- **Recommendation:** No code change needed now. If label-wording drift becomes a recurring issue, consider a build-time or lint-time check that warns when a `failure_points`/`*_notes` string doesn't match any known label set, rather than silently falling back at render time with no visibility into how often that's happening.
- **Priority:** Low (process/observability note, not a bug).

---

## 3. Rendering Pipeline Audit

The pipeline has two layers: (1) markdown/prose formatting (still entirely unapplied to Workflow fields — F3), and (2) structured-clause parsing (`parseLabeledClauses`, correctly implemented and wired everywhere it's needed — no further work required there). These are complementary, not competing — a labeled clause's *text* portion (after the label is stripped) could itself contain markdown in the future and would still need `Prose`/`ProseInline` wrapping around each clause's rendered text once F3 is addressed; worth designing F3's fix with that composition in mind rather than treating clause-parsing and markdown-rendering as two separate, never-intersecting concerns.

The code-block rendering pipeline (`CodeBlock.tsx` → `CodeBlockInteractive.tsx`) is architecturally sound (single highlight pass, HTML-level truncation intent, three-state wrap logic) but contains the one severe regex defect in F2 — worth stressing that the *architecture* chosen here (highlight once, truncate the HTML) is correct and was the right fix for the original bug; the *implementation* of that truncation has its own separate defect. Don't revert the architecture — fix the regex/matching logic within it.

No text-escaping or literal-`\n` issues were found in Workflow's own rendering path in this pass (the `Prose.tsx` component itself has an escaped-newline normalization regex for LaTeX commands, confirmed present, but that's inside `Prose` itself and irrelevant until F3 wires Workflow's fields through it).

---

## 4. Documentation UX Audit

Scanning speed for the step list is now meaningfully better than the first round: tool badges in the collapsed header, a step-count badge on the section card, and now `Expand All`/`Collapse All` controls (confirmed present and functional, reading `expandedSteps` state correctly) all support fast overview scanning before committing to reading any one step in depth. The `content-prose` (72ch) line-length constraint is now applied to `step.what`, `step.decision`, and `common_failure_points` clause text (confirmed via direct grep for the `content-prose` className in the current files) — this was an open finding in the prior round and appears to be resolved, a genuine, unclaimed improvement worth crediting even though it wasn't on the "already solved" list.

Progressive disclosure is well-structured: collapsed steps show enough (name + tools) to decide whether to expand; the Production Profile's sub-anchors (confirmed still present: `production-deployment`, `-scaling`, `-cost`, `-latency`, `-observability`) provide real deep-linking value, though (per the prior round's F6, not re-verified as fixed or broken this round since it wasn't a target of this pass) still likely lacks a visible in-page sub-nav pill row to make those anchors discoverable without already knowing the URL fragment — worth a quick check in a future pass if not already addressed.

Code example interaction (copy, wrap, collapse) is feature-complete and, apart from F2's regex defect, well-engineered. The `Show N More Lines` button's line-count disclosure is a nice, honest affordance that tells the reader what they're committing to before expanding.

---

## 5. Design System Audit

The implicit eyebrow-label convention (`text-[10px] font-semibold uppercase tracking-wider`) remains consistently applied across every section on the page. `ContentTypeBadge` is now used consistently for both step-level `uses` badges and Starter Stack badges (F8 from the prior round, confirmed fixed) — this closes the one clear design-system deviation found previously. No new design-system inconsistency was found in this pass beyond F6's minor mislabeling default.

---

## 6. UX Scorecard

| Category | Score | Justification |
|---|---|---|
| Rendering Correctness | 5/10 | F2 is a severe, currently-live correctness bug that actively corrupts visible content — this alone caps the category regardless of everything else being correct. |
| Information Architecture | 8/10 | Section structure, progressive disclosure, and scanning aids are all strong; no new IA issues found. |
| Navigation & Deep Linking | 7/10 | ToC and sub-anchor infrastructure are strong; F4's layout-composition risk at `md`-`lg` widths is the main open question. |
| Code Block Usability | 6/10 | Excellent feature set (copy, wrap, collapse, line-count disclosure) undercut entirely by F2's correctness defect in exactly the collapse feature meant to showcase this work. |
| Accessibility | 7/10 | `aria-expanded`/`aria-controls` correctly paired; `hidden="until-found"` genuinely improves the accessibility tree over unconditional unmounting. Not scored higher pending a live screen-reader pass, which wasn't performed in this static-review round. |
| Design Consistency | 8/10 | No new deviations found; F6 is a minor labeling nit, not a systemic issue. |
| Maintainability | 6/10 | F1 (component-in-component) is exactly the kind of subtle structural bug that's easy to introduce during a refactor and easy to miss in review — worth a lightweight team convention ("component functions must be declared at module scope, never inside another component's body") to prevent recurrence, since this is the second time this specific anti-pattern has appeared in this project's history. |

---

## 7. Prioritized Roadmap

### Phase 1: Critical
1. **F1** — Relocate `WorkflowStepItem` (and its props interface) to module scope in `WorkflowStepList.tsx`.
2. **F2** — Replace the line-span regex in `truncateHighlightedHtml` with a balanced-tag-aware truncation (depth-counter walk or DOM-based extraction).

### Phase 2: High
3. **F3** — Wrap `workflow.overview`, `step.what`, `step.decision`, `example.implementation_notes` in `Prose`/`ProseInline`; scope the footnote-to-`sources` linking as a distinct sub-task.

### Phase 3: Medium
4. **F4** — Verify the `md`-`lg` pill-row ToC layout visually; restructure `ContentPageLayout` if the defect is confirmed, testing against all content types that share this layout.
5. **F6** — Default unresolved Starter Stack badges to a neutral type instead of `'package'`.

Not scheduled: F5 (no action — claims did not reproduce), F7 (observational only, no current action needed).

---

## 8. Architectural Recommendations

1. **Add a lightweight internal convention (a one-line comment or lint rule if one is easy to configure) against declaring component functions inside another component's body.** This is the second occurrence of this exact anti-pattern in this project (previously on the Model page's `HyperparameterPriorityBar`, now on `WorkflowStepList`'s `WorkflowStepItem`) — a recurring pattern is worth a standing guard, not just a one-off fix each time it's found.
2. **When fixing string/HTML manipulation bugs like F2, prefer a real parser (DOM-based) over a tighter regex where the underlying data (HTML with nested tags) is not a regular language.** The original truncate-before-highlight bug was correctly fixed by moving to HTML-level truncation; the specific regex chosen for that truncation reintroduced a different bug in the same function, because regex is fundamentally unsuited to matching balanced/nested structures. This is a good moment to invest in the more robust (if slightly heavier) DOM-based approach rather than patching the regex further, since a second regex-based patch is at high risk of introducing a third subtle bug in the same spot.
3. **F3 has now been open across three review rounds.** It isn't hard, it's just never been anyone's Task 1 — worth explicitly scheduling as its own small pass rather than letting it keep losing priority to newer findings, since it's the most visible remaining gap now that everything found in later rounds has been addressed first.
4. **`ContentPageLayout` is shared infrastructure — F4's fix (if confirmed) should be validated against every content type using it, not just Workflow**, since the same `flex` composition applies wherever `TableOfContents`' pill-row variant renders.

---

## 9. Windsurf Implementation Prompt

```markdown
# AENS Workflow Page — Convergence Fix Pass (Round 4)

## Context
This is a targeted fix pass for two Critical, empirically-verified bugs, one
High-priority long-standing gap, and two smaller items. Every item was
confirmed against the actual current repository state — Task 1 and Task 2 in
particular were verified with direct tooling (brace-depth tracing and a live
regex test in Node), not just code reading. Do not treat any of these as
speculative; they are confirmed defects.

**Hard constraints:**
- No new heavy dependencies. A DOM-parsing library for Task 2 is acceptable
  only if it's either already a project dependency or genuinely minimal
  (check `package.json` first) — prefer a hand-written depth-counter approach
  if no suitable lightweight parser is already available.
- Do not change the overall architecture of any fixed component beyond what's
  specified — e.g., Task 2 must preserve the "highlight once, truncate the
  HTML" approach; do not revert to truncating raw source before highlighting.
- Every change must build cleanly with `npm run build` and pass `npm run validate`.

## Target Files
- `components/shared/WorkflowStepList.tsx` (Task 1)
- `components/shared/CodeBlock.tsx` (Task 2)
- `app/workflows/[id]/page.tsx` (Task 3, Task 5)
- `components/shared/WorkflowStepList.tsx` again (Task 3, step.what/step.decision)
- `components/shared/ContentPageLayout.tsx`, `components/shared/TableOfContents.tsx` (Task 4)

## Files to Avoid
- `components/shared/CollapsibleRow.tsx` — `hidden="until-found"` implementation
  here is correct and complete; do not modify.
- `components/shared/CodeBlockInteractive.tsx` — three-state wrap logic is
  correct and complete; do not modify.
- `lib/text/parseLabeledClauses.ts` — correct and complete; do not modify.
- `lib/schemas/workflow.ts` — no schema changes needed for any task below.
- `data/workflows/*.json` — content, not code.

## Task 1 (Critical): Fix the component-in-component remount bug

**File:** `components/shared/WorkflowStepList.tsx`

1. Cut the `WorkflowStepItemProps` interface and the entire `WorkflowStepItem`
   function declaration out of `WorkflowStepList`'s body.
2. Paste both at module scope, above the `WorkflowStepList` function
   declaration (or below it — either is fine, as long as it's a sibling
   top-level declaration, not nested inside another function).
3. Compile and fix any TypeScript errors that surface from variables
   `WorkflowStepItem` previously accessed via closure but that aren't in its
   props — there shouldn't be any, since its props interface already lists
   `s`, `idx`, `isOpen`, `toggleStep`, `renderAllUses`, `relatedExample`, but
   verify this explicitly rather than assuming.
4. Leave `renderUses`/`renderAllUses` as closures inside `WorkflowStepList` —
   they are plain functions, not components, so being redefined each render
   doesn't cause the same remount issue (they're passed as a prop value each
   render, which is fine for a function reference passed straight through as
   an argument, not used as a JSX element type).

**Acceptance Criteria:**
- Toggling any single step no longer causes any *other* step's DOM subtree to
  unmount/remount — verify via React DevTools' "Highlight updates" feature,
  or by adding a temporary `console.log` in a `useEffect` with an empty
  dependency array inside `WorkflowStepItem` and confirming it does NOT fire
  again for unrelated steps when toggling a different step.
- `Expand All` no longer causes every step to visibly flash/remount
  simultaneously — same DevTools verification.
- Find-in-page (the `beforematch` mechanism from the prior round) still works
  correctly after this change — this is the regression risk to watch most
  closely, since the `beforematch` listener's effect lifecycle depends on
  stable component identity, which this fix directly changes.

---

## Task 2 (Critical): Fix the line-span truncation regex

**File:** `components/shared/CodeBlock.tsx`, function `truncateHighlightedHtml`

Replace the current regex-based line extraction:
```ts
const lineSpanRegex = /<span class="line"[^>]*>[\s\S]*?<\/span>/g;
const lineSpans = innerContent.match(lineSpanRegex);
```
with a balanced-depth walk. Implementation approach:
1. Scan `innerContent` character by character (or use a simple tag-tokenizing
   regex like `/<\/?span[^>]*>/g` to find tag boundaries, then walk the list
   of tag matches rather than the raw string).
2. Track a depth counter. When you encounter an opening `<span class="line"...>`
   at depth 0 (i.e., not nested inside another line span — line spans should
   never nest inside each other, only inside token spans... actually line
   spans are the outermost wrapper per Shiki's output structure, so track
   depth *starting* from each line-span's own open tag: increment on every
   `<span`, decrement on every `</span>`, and consider the line span's content
   complete only when depth returns to 0 relative to where it started).
3. Collect complete, balanced line-span strings (open tag through its own
   matching close tag, with all nested token spans intact) until you have
   `maxLines` of them or run out of content.
4. If a DOM-parsing utility is already a project dependency (check
   `package.json` — `jsdom`, `node-html-parser`, `cheerio`, or similar), prefer
   using it to select the first N elements with class `line` and serialize
   them back to HTML, since this sidesteps manual tag-matching entirely and is
   more robust against any future Shiki output format changes. Only implement
   the manual depth-counter approach if no such dependency is already present
   and adding one is deemed not worth it for this single use case.
5. Preserve the existing fallback behavior: if parsing fails or produces fewer
   line spans than expected, return the full `html` unchanged (same safety
   net as the current implementation).

**Acceptance Criteria:**
- Construct a test code sample where line 1 has at least two differently-colored
  tokens (e.g., a keyword and a variable name on the same line — trivial to
  produce with any real Python/JS snippet). Confirm the collapsed view shows
  the complete line, fully colored, not just the first token.
- Test against the actual worked examples in `rag-evaluation-harness.json`
  and `vector-database-setup-indexing-strategy.json` specifically — these are
  the two most likely to already exceed 20 lines with real multi-token syntax.
- Confirm the resulting HTML has no unclosed tags (a simple sanity check:
  count opening vs. closing `<span` tags in the truncated output — they
  should match).
- No second `codeToHtml()` invocation is reintroduced — this fix operates
  purely on the already-generated `fullHighlighted` string.

---

## Task 3 (High): Apply markdown rendering to Workflow's text fields

**Files:** `app/workflows/[id]/page.tsx`, `components/shared/WorkflowStepList.tsx`

1. Import `Prose` and/or `ProseInline` from `components/shared/Prose.tsx` into
   both files.
2. Wrap `workflow.overview` in `<Prose>` in `page.tsx` (it's a genuine
   paragraph-level field, likely block-level markdown is appropriate — verify
   by checking a few real `overview` values in `data/workflows/*.json` for
   multi-paragraph or list content before deciding between `Prose`/`ProseInline`).
3. Wrap `step.what` and `step.decision` in `WorkflowStepList.tsx`, and
   `example.implementation_notes` in `page.tsx`, similarly — check real content
   samples first to decide `Prose` vs `ProseInline` per field rather than
   assuming one choice fits all three.
4. Separately (treat as its own sub-task, not blocking the above): verify
   whether `Prose`'s configured remark/rehype plugin set actually resolves
   `[^1]`-style footnote syntax to linked elements by default. If it does but
   the links currently point nowhere useful (no matching anchor), add the
   missing piece: a way to map a footnote number to the corresponding entry in
   `workflow.sources` and render/link to it (e.g., render each `sources` entry
   with a matching anchor id like `id="footnote-1"` wherever sources are
   currently listed on the page, so `Prose`'s generated footnote links have a
   real target). If footnote syntax isn't resolved by the current plugin set
   at all, treat that as a larger, separately-scoped follow-up rather than
   attempting to add a new remark plugin as part of this task.

**Acceptance Criteria:**
- Markdown formatting (bold, italics, inline code, lists) inside any of the
  four fields renders as actual formatted HTML, not literal markdown syntax.
- No visual regression for content that has no markdown syntax at all (plain
  text should render identically to before).
- Footnote behavior is explicitly verified and reported on (working, partially
  working, or needs follow-up) rather than assumed — do not claim this task
  complete without checking the actual rendered output for a workflow whose
  `overview` contains `[^1]`-style markers.

---

## Task 4 (Medium): Verify and fix the md-to-lg ToC layout

**Files:** `components/shared/ContentPageLayout.tsx`, `components/shared/TableOfContents.tsx`

1. First, visually verify the suspected defect: render any workflow page at
   800px and 1000px viewport width and observe whether the pill-row ToC
   displays as a full-width horizontal bar (correct) or is squeezed/overflows
   (the suspected bug).
2. If confirmed, restructure so the pill-row variant renders as its own
   full-width row, separate from the `flex gap-8` row containing the main
   content and sidebar ToC — either by moving the pill-row's conditional
   render out of `TableOfContents` and into `ContentPageLayout` directly
   (above the existing flex row, wrapped in its own `md:block lg:hidden` div),
   or by wrapping the whole layout in a responsive flex-direction change at
   that breakpoint range.
3. Since `ContentPageLayout` is shared, re-check at least one other content
   type's page (e.g. a Model or Package detail page) at the same viewport
   widths after the fix to confirm no regression there.

**Acceptance Criteria:**
- At 768–1023px width, the pill-row ToC displays as a full-width horizontal
  bar with no page-level horizontal overflow.
- No visual change at widths below 768px or at/above 1024px.
- At least one non-Workflow content type checked at the same widths post-fix.

---

## Task 5 (Low): Neutral badge for unresolved Starter Stack tools

**File:** `app/workflows/[id]/page.tsx`

Change `<ContentTypeBadge type={type || 'package'} .../>` so that when `type`
is `null` (resolution failed), a neutral/generic badge renders instead of
defaulting to `'package'` — check whether `ContentTypeBadge` already supports
an unstyled/neutral variant; if not, a plain unstyled `<span>` with the same
visual container styling (no `ContentTypeBadge` icon/label) is an acceptable
minimal fix.

**Acceptance Criteria:** An unresolvable Starter Stack tool no longer displays
a "PACKAGE" label; resolvable tools are unaffected.

---

## Validation Checklist
- [ ] `npm run build` completes with zero errors.
- [ ] `npm run validate` passes with zero new schema errors.
- [ ] React DevTools "Highlight updates" check for Task 1 (no unrelated
      remounts on single-step toggle).
- [ ] Manual regex/output check for Task 2 against both newly-added workflows'
      worked examples, not just `build-rag-system`.
- [ ] Manual content spot-check for Task 3's footnote behavior — report
      status explicitly rather than assuming success.
- [ ] Visual check at 800px/1000px for Task 4, plus one non-Workflow page at
      the same widths.

## Regression Checklist
- [ ] Find-in-page (`hidden="until-found"` + `beforematch`) still works after
      Task 1's relocation of `WorkflowStepItem` — test explicitly, this is the
      most likely thing Task 1 could inadvertently break.
- [ ] Code block copy/wrap/collapse behavior unaffected by Task 2 for code
      blocks under 20 lines (no truncation path involved) and over 20 lines
      (truncation path now fixed).
- [ ] Dark mode spot-check for any visual changes in Tasks 3–5.
- [ ] `build-rag-system.json`'s existing content renders identically wherever
      no field newly passes through `Prose`/`ProseInline` in a way that
      changes its appearance (plain text with no markdown should look the same
      as before Task 3).

## Implementation Order
1. Task 1 (isolated to one file, no dependency on anything else, highest leverage).
2. Task 2 (isolated to one file, independent of Task 1).
3. Task 4's verification step (quick, informs whether Task 4's fix is even needed).
4. Task 3 (largest scope, do after the two Critical fixes are settled).
5. Task 4's fix (if confirmed necessary) and Task 5 — both low-risk, do last.
```
