# AENS Workflow Page — Playbook Transformation Review
`app/workflows/[id]/page.tsx` and dependencies

## Verification of "completed" items

I re-read the actual files rather than trusting the completed list. All six check out — this is unusual and worth noting plainly: it's correct, not fabricated.

| Claimed complete | Verified in | Status |
|---|---|---|
| Related content resolution moved into `lib/data.ts` | `resolveWorkflowStepLinks()` in `lib/data.ts` | ✅ Done |
| Workflow ARIA parity | `WorkflowStepList.tsx` — `aria-controls={step-panel-${s.step}}` paired with panel `id` | ✅ Done |
| Production Profile deep-link restructuring | Page has `id="production-deployment"`, `"-scaling"`, `"-cost"`, `"-latency"`, `"-observability"` | ✅ Done |
| Hash deep-link prefix matching | `CollapsibleRow.tsx` — `hash === id \|\| hash.startsWith(id + '-')` | ✅ Done |
| Related content typed references merged | `getRelatedContent()` for `type === 'workflow'` spreads `related_patterns/models/packages/debug_guides` ahead of graph-derived refs | ✅ Done |
| TOC breakpoint verified | Tailwind v4 default, no override in `globals.css` — `xl` = 1280px. Most laptop viewports (1280px+) clear this. Legitimately a non-issue; correctly resolved by verification, not by a code change. | ✅ Verified, no action needed |

None of these get re-litigated below.

---

# Section 1 — Inspection Report

## Critical
None. No broken functionality, no data-loss risk, nothing that blocks a release.

## High

**H1 — Code block truncation happens *before* syntax highlighting, not after**
- **Problem:** In `CodeBlock.tsx`, when `shouldCollapse` is true, the component slices the raw source to the first 20 lines (`lines.slice(0, MAX_COLLAPSED_LINES).join('\n')`) and runs Shiki (`codeToHtml`) on that truncated string as a *separate, independent* highlight pass from the full version.
- **Root cause:** Shiki tokenizes each call in isolation. If line 20 falls inside an unclosed multi-line construct (triple-quoted docstring, multi-line dict/list literal, a function signature spanning several lines), the truncated snippet is syntactically incomplete. Shiki's tokenizer then guesses at scope for the remaining lines of that snippet with no closing context — strings can bleed color into subsequent lines, brackets can mis-color, keywords inside the truncated tail can highlight as plain text. This is exactly your logged "syntax highlighting breaks" symptom, and it's a snippet-boundary problem, not a Shiki/theme bug.
- **Impact:** Any workflow whose worked-example code exceeds 20 lines and has a multi-line construct crossing line 20 will show visibly wrong highlighting in collapsed state (looks fine once expanded, since the full version highlights the complete, valid source).
- **Recommendation:** Highlight the *full* source once, then truncate the **rendered HTML output** to the first N `.line` elements (Shiki wraps each source line in a span with class `line`), not the raw source before highlighting. This guarantees the collapsed view is always a valid prefix of a correctly-tokenized full highlight. Requires a small DOM/string slice on the already-generated HTML rather than a second `codeToHtml` call — also removes the second Shiki invocation entirely, a minor build-time perf win.
- **Priority:** High. **Complexity:** Low-Medium (isolated to `CodeBlock.tsx`, no schema or prop changes).

**H2 — No line-wrap option; long lines only get horizontal scroll**
- **Problem:** `CodeBlockInteractive.tsx` code body is `overflow-x-auto` with no wrap toggle. Long lines (common in Python — long import lists, chained pandas calls, long string literals) force horizontal scrolling.
- **Root cause:** Wrap was never implemented; only a scroll-fade gradient was added as a visual affordance that scrolling is possible (`bg-gradient-to-l ... md:hidden`), which is a hint, not a fix.
- **Impact:** On mobile specifically (where the fade gradient is shown, confirming the team already knows this is a mobile pain point), horizontal scrolling inside a scrollable page is a bad interaction — users have to scroll the code block sideways *and* the page vertically, easy to fumble on a touchscreen.
- **Recommendation:** Add a small wrap toggle (icon button, next to Copy) that switches `overflow-x-auto whitespace-pre` to `whitespace-pre-wrap break-words`. Default to wrap **on** for mobile viewports, scroll for desktop (matches how VS Code, GitHub, and most doc sites behave — desktop users expect horizontal scroll for code, mobile users don't have the luxury).
- **Priority:** High (directly named in your known issues as "code sections dominate the page" — wrapping reduces the perceived bulk of wide code on narrow screens). **Complexity:** Low.

**H3 — Inconsistent color semantics for "failure" content between the two places it appears**
- **Problem:** `common_failure_points` (workflow-level) renders in a **rose/red** left-border block (`border-rose-500 bg-rose-500/5`). Per-step `failure_points` render in an **amber** left-border block (`border-amber-500 bg-amber-500/5`, labeled "Watch Out"). Both represent the same underlying schema concept (a failure mode to avoid), styled with two different severities of alarm color on the same page.
- **Root cause:** These were implemented at different times / by different reasoning — workflow-level failures read as "critical," step-level as "caution" — but the schema doesn't actually distinguish severity (`failure_points: z.array(z.string())` — flat strings, no severity field on either).
- **Impact:** Named directly in your inspection scope ("Determine whether engineers can instantly distinguish... Failure"). Right now they can't reliably — the same concept has two different visual weights with no schema-backed reason for the difference, which trains users to *mis-read* severity rather than read it accurately.
- **Recommendation:** Pick one color for "this is a failure mode," used consistently in both places. If you want visual differentiation between workflow-level and step-level, differentiate by **label and icon**, not by alarm color — color should map to actual severity/urgency once (if ever) that becomes a real schema field, not to which section of the page the content happens to render in.
- **Priority:** High (cheap fix, meaningfully improves scanability which is your stated primary goal). **Complexity:** Trivial (one class swap).

## Medium

**M1 — `CollapsibleRow` uses `class="hidden"` toggling, not the native `hidden` attribute**
- Already flagged in the prior review as low-severity; re-confirmed still present. Restating at medium here because it directly affects **performance** (a new inspection axis this round): every closed `CollapsibleRow` (including Production Profile) keeps its full DOM subtree mounted and hidden via CSS rather than removed from the accessibility tree/paint via the native `hidden` attribute or `content-visibility: auto`. At today's content size this is negligible; it compounds with H1/H2 as workflows grow more code-heavy per your scaling target.
- **Recommendation:** Swap `isOpen ? "block" : "hidden"` (Tailwind class) for the native `hidden` attribute on the div, which is the same visual result but gets proper AT and layout/paint skipping for free, no JS or dependency change.
- **Priority:** Medium. **Complexity:** Trivial.

**M2 — No persistent sense of "where am I in the pipeline" while scrolling through steps**
- **Problem:** `WorkflowStepList` renders steps as independent accordion items with no shared progress indicator (e.g., "Step 3 of 7"). A user who expands step 4 and starts reading has no ambient cue of how much pipeline remains.
- **Impact:** Directly relevant to your stated goal (operations playbook, not passive reading) — an operator running a pipeline wants to know their position in it at a glance.
- **Recommendation:** Add a lightweight step counter/progress bar to the `SectionCard` header wrapping `WorkflowStepList` ("Workflow Steps — 7 total, 2 expanded" or a slim segmented progress bar). This needs no schema change — step count is already derivable from `steps.length`.
- **Priority:** Medium. **Complexity:** Low.

**M3 — Worked Examples code blocks are not collapsed by default even when long**
- **Problem:** `CodeBlock` already implements a 20-line collapse threshold, and it *is* wired up for worked examples (`<CodeBlock code={example.code} .../>` — no `showLineNumbers` prop passed, defaults apply). So collapse behavior is present. The gap: there's no visual distinction between a "quick reference" worked example and a "full implementation" one before expanding — both look like a plain card with a title until you scroll into the code.
- **Recommendation:** Minor — add a line-count badge to the Worked Example card header (e.g., "142 lines") so users can gauge investment before opening, consistent with your "estimated implementation time" product idea in Section 3.
- **Priority:** Medium. **Complexity:** Low.

## Low

**L1 — `StickyActionBar`'s section pill doesn't reflect individual steps or production sub-notes**
- Confirmed still true from the previous review. Not urgent — the main `TableOfContents` is available at ≥1280px, and this only affects the narrower/mobile experience where users are typically reading one section at a time anyway. Worth a follow-up only if user feedback specifically flags it.
- **Priority:** Low.

**L2 — `Terminal` icon used generically for every code block regardless of language**
- Minor visual-hierarchy nit: the same terminal icon appears whether the block is Python, YAML config, or an actual shell command, slightly undercutting "instantly distinguish... implementation vs. code vs. metadata" as a scanning aid. Cosmetic only.
- **Priority:** Low.

---

# Section 2 — UI/UX Improvement Roadmap

**Phase 1 — Critical usability (do first, all independently shippable)**
1. H3 — Unify failure-point color semantics (workflow-level vs. step-level).
2. H1 — Fix code-block truncation-before-highlight bug.
3. H2 — Add line-wrap toggle, default wrap-on for mobile.

**Phase 2 — Information architecture**
4. M2 — Step progress indicator on Workflow Steps section header.
5. M3 — Line-count badge on Worked Example cards.

**Phase 3 — Performance**
6. M1 — Swap CollapsibleRow's CSS-class hide for native `hidden` attribute.
7. (Only if/when workflows commonly exceed ~15 steps) `content-visibility: auto` on closed step bodies — hold until content volume actually warrants it; premature now.

**Phase 4 — Polish**
8. L1 — Extend StickyActionBar's jump sheet to include step-level entries (only if user feedback requests it).
9. L2 — Language-specific icons for code block headers.

Each numbered item above touches at most 1-2 files and can ship independently — none depend on another being done first, except Phase 3 item 7 which is explicitly gated on content growth, not time.

---

# Section 3 — Product Recommendations (not requested, worth doing)

**1. A "pipeline overview" strip above the step list, generated from existing data — no new schema fields.**
You already have everything needed to render a compact horizontal strip of step names (from `steps[].name`) above the full accordion — think of it as a mini table-of-contents specific to the steps section, letting a user click step 5 directly instead of scanning through 1-4 first. This is pure UI — zero schema change, computed entirely from `workflow.steps`. Matters because "jump directly to the step I need" is the single most common thing an engineer re-visiting a pipeline they've read before wants to do, and today that requires either scrolling or using the generic page-level TOC (which only has one "Steps" entry, not one per step).

**2. Treat `common_failure_points` vs step-level `failure_points` as one designed concept, not two accretions.**
This is the schema-level sibling of H3. Right now the schema has two unrelated string arrays. If failure content is genuinely important enough to warrant special color treatment (which the current implementation implies), it's worth an explicit, additive schema decision at some point: should step-level failures actually be a *subset relationship* to workflow-level ones (i.e., is a step failure sometimes literally referencing one of the workflow's common failure points)? Not urgent, but worth deciding intentionally rather than continuing to add fields ad hoc — matches the same schema/rendering drift pattern flagged in the first review (typed relation fields going unused until someone checks).

**3. Difficulty/complexity/runtime-requirement badges are good ideas but are schema-blocked — don't build UI for fields that don't exist.**
Several of the "missing features" listed in the brief (complexity indicators, difficulty per step, GPU/CPU indicators, estimated implementation time) all require new optional schema fields before any UI can render them meaningfully. Building the UI first and hardcoding placeholder values would be worse than not building it — it'd imply data that isn't there. Recommend: if these are genuinely wanted, that's a schema-freeze-compatible *additive* change (new optional fields on `WorkflowStepSchema`, all backward compatible since optional), but it's a data/content decision (who fills these in, for which of your ~N existing workflow JSON files) before it's a UI decision. Don't let the UI backlog get ahead of the content backlog.

**4. Reading-progress and step-completion tracking would duplicate `ReadingSessionTracker`'s job, not extend it.**
The brief lists "reading progress" and "step completion" as missing features. There's already a `ReadingSessionTracker` component wired into this page — worth checking what it currently tracks before adding a second, possibly overlapping progress mechanism. (I did not trace its internals in this pass — flagging as a check-before-building item, not a confirmed duplication.)

---

# Section 4 — Windsurf Implementation Prompt

```
ROLE: Senior Next.js/React engineer on a Zod-governed, architecture-frozen content system (AENS). Preserve all existing functionality. No new npm dependencies. No schema changes in this pass — every task below is renderer-only.

CONTEXT — Already completed, do not touch or re-implement:
- lib/data.ts: resolveWorkflowStepLinks(), getRelatedContent() typed-ref merge for workflows
- components/shared/WorkflowStepList.tsx: aria-controls/id pairing on step toggle
- components/shared/CollapsibleRow.tsx: hash prefix matching (id or id-*)
- app/workflows/[id]/page.tsx: production-* sub-ids on Production Profile notes
Do not re-touch these unless a task below explicitly says to.

FILES LIKELY TO CHANGE THIS PASS:
- components/shared/CodeBlock.tsx (H1)
- components/shared/CodeBlockInteractive.tsx (H1, H2)
- app/workflows/[id]/page.tsx (H3 — failure point color only)
- components/shared/WorkflowStepList.tsx (H3 — failure point color only, M2 — optional if bundled here vs SectionCard wrapper)
- components/shared/SectionCard.tsx or app/workflows/[id]/page.tsx (M2 — step count badge)
- components/shared/CollapsibleRow.tsx (M1)

TASK 1 (H1) — Fix code block truncation-before-highlight
- In components/shared/CodeBlock.tsx: remove the second codeToHtml() call on the sliced/truncated code. Instead, run codeToHtml() ONCE on the full `code` string to produce `fullHighlighted`.
- To produce the collapsed view, parse the resulting HTML string and extract only the first `maxCollapsedLines` elements with class="line" (Shiki wraps each source line in <span class="line">...</span> inside the <pre><code>). Preserve the outer <pre>/<code> wrapper structure and any header styling classes Shiki emits — only truncate the inner line spans.
- If using a simple string-based extraction (not a full HTML parser) is fragile, a safe approach: use a lightweight regex or split on the closing `</span>\n` pattern Shiki emits per line, matching how many "line" class spans have opened, and truncate after the Nth one, re-closing any open tags. Test carefully against nested spans (Shiki emits nested <span> for tokens within each line span) — truncation must happen at a line-span boundary only, never mid-token-span.
- Remove `collapsedHighlighted` as a separately-generated prop from CodeBlock's Shiki call; it can still be passed to CodeBlockInteractive as a derived slice of fullHighlighted computed in CodeBlock.tsx.
- Verify against a workflow worked-example whose code has a docstring or multi-line string spanning across line 20 (search /data/workflows/*.json for a worked_examples[].code field over 20 lines with a triple-quoted string crossing that boundary — if none exists in current content, construct a temporary test file to verify the fix, then remove it).

TASK 2 (H2) — Add wrap toggle to code blocks
- In components/shared/CodeBlockInteractive.tsx: add local state `const [wrapped, setWrapped] = useState(false)` — but default this based on viewport: use a simple `useEffect` checking `window.matchMedia('(max-width: 767px)').matches` on mount to set initial wrapped=true on mobile, false on desktop (matches existing md: breakpoint convention already used elsewhere in this file).
- Add a small icon-only toggle button (use an existing lucide-react icon already imported elsewhere in the codebase if one fits wrap/unwrap semantics — check current lucide-react imports across components/shared before adding a new icon import) placed next to the existing desktop Copy button in the header bar.
- When wrapped=true, apply `whitespace-pre-wrap break-words` and remove `overflow-x-auto` from the code body div's className. When wrapped=false, keep current `overflow-x-auto` behavior unchanged.
- The horizontal-scroll-fade div (`bg-gradient-to-l ... md:hidden`) should only render when NOT wrapped — conditionally include it.

TASK 3 (H3) — Unify failure-point color semantics
- In app/workflows/[id]/page.tsx: change the common_failure_points block's classes from `border-rose-500 bg-rose-500/5` and `text-rose-700 dark:text-rose-400` to match the amber treatment already used in components/shared/WorkflowStepList.tsx for per-step failure_points (`border-amber-500 bg-amber-500/5`, `text-amber-700 dark:text-amber-400`).
- Keep the heading text different ("Common Failure Points" vs "Watch Out") so the two remain distinguishable by label, not by color severity.
- Do NOT change WorkflowStepList.tsx's existing amber styling — it becomes the canonical failure color; only the page-level block needs to change to match it.

TASK 4 (M1) — Native hidden attribute in CollapsibleRow
- In components/shared/CollapsibleRow.tsx: change the content div's conditional class `isOpen ? "block" : "hidden"` to instead conditionally spread a `hidden` HTML attribute: `{...(!isOpen && { hidden: true })}` alongside removing the Tailwind hidden/block class toggle (keep other classes like p-5, bg-card, border-t as-is).
- Verify this doesn't conflict with the existing `contentClassName` prop merging logic (cn() call) — the native hidden attribute is independent of className and should coexist fine, but confirm no other code relies on checking for the "hidden" Tailwind class specifically via querySelector or similar (grep for ".hidden" selector usage referencing CollapsibleRow content before changing).

TASK 5 (M2) — Step progress indicator
- In app/workflows/[id]/page.tsx where SectionCard title="Workflow Steps" is rendered: add a badge prop to SectionCard showing `${workflow.steps.length} steps` (SectionCard already accepts an optional `badge` ReactNode prop — use it, no SectionCard code change needed).
- This is read-only, derived from existing workflow.steps.length — no schema or data-layer change required.

IMPLEMENTATION ORDER: Task 3 (isolated, zero risk) → Task 4 (isolated, zero risk) → Task 5 (isolated, additive prop usage) → Task 1 (most involved, needs careful line-boundary testing) → Task 2 (depends on nothing above but touches the same file as Task 1, do after Task 1 is verified working to avoid compounding untested changes in one file).

SAFETY CONSTRAINTS:
- No schema changes (Zod files untouched).
- No new npm dependencies — Task 2's icon must come from lucide-react, already a dependency.
- Task 1 must not change the visual output of the FULLY EXPANDED code view at all — only the collapsed-state truncation logic changes. Diff the full-view HTML output before/after for a sample workflow to confirm zero change there.

REGRESSION PREVENTION CHECKLIST:
[ ] Every existing workflow's Worked Examples still render with correct copy-button behavior, expand/collapse behavior, and (post-Task 1) visually correct syntax highlighting in BOTH collapsed and expanded states
[ ] CollapsibleRow's other current callers (grep for CollapsibleRow usage outside workflows) still expand/collapse and deep-link correctly after Task 4
[ ] common_failure_points block (Task 3) still reads clearly as "important warning content" after the color change — not so muted it loses visual weight relative to surrounding content
[ ] SectionCard badge (Task 5) doesn't overflow or wrap awkwardly at mobile widths (375px) with long step counts (test with a workflow that has 15+ steps if one exists, or temporarily stub one)

TESTING CHECKLIST:
[ ] Manual test on a workflow with a worked example >20 lines containing a multi-line string/docstring crossing the line-20 boundary — confirm collapsed view now highlights correctly
[ ] Manual test wrap toggle on both a short-line and long-line code example, desktop and mobile viewport
[ ] Run existing test suite in /tests (locate and run before and after changes)

MOBILE VERIFICATION:
[ ] Wrap toggle defaults to ON at ≤767px viewport, confirm no horizontal scroll needed for long lines when wrapped
[ ] Copy button (mobile variant, already existing) still functions after CodeBlockInteractive changes
[ ] Touch target size for new wrap toggle button is at least 32x32px

ACCESSIBILITY VERIFICATION:
[ ] Native hidden attribute (Task 4) correctly removes collapsed content from the accessibility tree — verify with a screen reader (NVDA/VoiceOver) that closed Production Profile sub-notes are not announced/focusable when collapsed
[ ] New wrap toggle button has an aria-label (e.g., "Toggle line wrap") since it will likely be icon-only

PERFORMANCE VERIFICATION:
[ ] Confirm Task 1 removes the second Shiki codeToHtml() invocation per collapsed code block (should reduce build-time cost for workflows with many long worked examples, not increase runtime cost)
[ ] No new client-side JS bundle growth (lucide-react icon already in dependency tree)

ACCEPTANCE CRITERIA:
- Collapsed code blocks always show correctly-highlighted syntax, regardless of where the 20-line truncation boundary falls relative to multi-line constructs.
- Users can toggle line wrapping on any code block; mobile defaults to wrapped, desktop defaults to scroll.
- Failure-point content (workflow-level and step-level) uses one consistent color language across the page.
- Workflow Steps section shows a step-count badge.
- Collapsed CollapsibleRow content is properly hidden from assistive technology, not just visually hidden.
```
