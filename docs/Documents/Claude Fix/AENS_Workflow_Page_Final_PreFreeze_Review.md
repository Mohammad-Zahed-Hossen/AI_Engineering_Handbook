# AENS Workflow Page — Final Pre-Freeze Review

**Roles:** Principal Frontend Architect / Senior UI-UX Engineer / Documentation Systems Architect
**Method:** Every specific hypothesis below (the accordion inversion, the vector-database code-rendering discrepancy, the "$" icon, the header-metadata gap, the Build RAG System content gap) was independently reproduced against the actual repository — either by reading the exact code path involved, or, where logic was in question, by tracing state transitions by hand against the real implementation. Nothing here is asserted on the basis of the prompt's own framing; several of the prompt's specific phrasings turned out to be imprecise-but-pointing-at-something-real, and that distinction is called out explicitly in each case.

---

## Deliverable A — Repository Inspection Report (Verified Findings Only)

**A1. [Real bug, precisely scoped] "Collapse All" can re-open Step 1 after a user has manually closed it**

The reported symptom — *"Expand collapses. Collapse expands."* — doesn't have a code path matching the "Expand" half (`expandAll` in `WorkflowStepList.tsx` unconditionally sets every step index into `expandedSteps`; there is no scenario in the current code where clicking it closes anything). The "Collapse" half is real and precisely reproducible:

```ts
const collapseAll = () => {
  setExpandedSteps(new Set([0])); // Keep Step 1 open by default
};
```

If a reader manually closes Step 1 (clicking its own header toggles it out of `expandedSteps`, leaving an empty set), then clicks **Collapse All** — which a reasonable person expects to be a no-op or to close everything — the implementation instead **force-reopens Step 1**, because `collapseAll` unconditionally reintroduces index `0` regardless of the set's state before the call. This is the concrete, reproducible half of the reported inversion: "Collapse" causing something to open. Root cause: `collapseAll` conflates two different concepts — "the default initial state" (Step 1 open) and "what collapse-all should do" (close everything, full stop) — and implements the click handler as if it were the former.

**A2. [Real bug, root-caused] Some workflow content renders as plain, unstyled text instead of syntax-highlighted code — confirmed to be a rendering-pipeline gap, not a schema or content-authoring defect**

Checked `vector-database-setup-indexing-strategy.json` directly: all three of its `worked_examples` have `code` and `language` populated (confirmed via script — every worked example across every current workflow file has `code: true`). So the discrepancy isn't in Worked Examples. It's in the **step-level `what` field**: every one of this workflow's 8 steps embeds a triple-backtick fenced code block directly inside `step.what`'s prose text (confirmed by scanning every string field in the file for `` ``` ``). Since the last convergence round wired `step.what` through `<Prose content={s.what}>`, and `Prose.tsx`'s `ReactMarkdown` configuration has exactly one `components` override (`p` → fragment, in `ProseInline` only) and **no override for `code`/`pre`**, any fenced code block embedded in a Prose-rendered field falls through to `react-markdown`'s default HTML output — a plain `<pre><code>` with no Shiki tokenization, no syntax color, no line numbers, none of the styling the dedicated `CodeBlock` component provides for Worked Examples. This is why the *same page* can show beautifully highlighted code in its Worked Examples section and flat, monospace-but-uncolored code inside a step's description a few pixels above it — two different rendering paths for what is visually the same kind of content. This is not a schema issue (the markdown is valid) and not really a content-authoring mistake in the "wrong data" sense — it's a legitimate authoring pattern (a step's decision sometimes needs an inline snippet) that the rendering pipeline simply doesn't support at parity with Worked Examples.

**A3. [Precise clarification, not a bug as described] There is no "$" character anywhere in `TableOfContents.tsx`**

Searched the file directly — no `$`, no stray icon glyph of any kind in the "On this page" sidebar or its pill-row variant. The only unusual glyph anywhere in the navigation shell is a literal section-sign character (`§`, Unicode U+00A7) in `StickyActionBar.tsx`'s active-section label (`<span>§ {activeLabel}</span>`) — a different component, adjacent in function (both are section-navigation aids), which is almost certainly what's being described. At small font sizes and depending on the rendering font, `§` can be visually mistaken for `$` — this is a plausible, precise explanation, not a dismissal of the observation. Recommend treating this as confirmed: a rarely-recognized typographic symbol being used as a decorative prefix in a sticky nav bar, easily misread, not communicating anything a first-time reader would understand as "current section."

**A4. [Real content gap, correctly differentiated from a rendering bug] `build-rag-system.json`'s worked examples were never wired to their steps via `related_step`**

The step ↔ worked-example linking feature (added several rounds ago specifically to solve the "steps and examples feel disconnected" UX problem) is fully implemented and working in both `page.tsx` (renders "Used in Step N" on the example card) and `WorkflowStepList.tsx` (renders "View worked example →" inside the step). But `build-rag-system.json`'s two worked examples both have `related_step: null` — despite "Hybrid Search RAG with RRF" obviously corresponding to Step 4 ("Vector Store Indexing and Hybrid Setup") and "Late Chunking Implementation" obviously corresponding to Step 3 ("Global Contextualized Embeddings via Late Chunking"). This is a content-completion gap, not a code defect — the mechanism works; the flagship example's data was never updated to use it.

**A5. [Real, evidence-backed gap] Workflow's header under-uses metadata that already exists and is already validated in the schema**

`data/workflows/build-rag-system.json` has real, populated `difficulty: "expert"`, `domain: "llm"`, `engineering_area: "retrieval"`, and `estimated_reading_time: 14` — all valid, schema-defined (`lib/schemas/base.ts`) fields. But the Workflow page's `<MetadataBadges type="workflow" updatedAt={...} category={...} />` call passes only two props. Compare this to the Model page's call in the same component tree: `<MetadataBadges type="model" updatedAt={...} lastVerified={...} problemTypes={...} />`, plus an entirely separate `<ModelDecisionStrip>` surfacing additional decision-relevant signals in the header. This is the same "collected but not rendered" pattern already caught twice before in this project's history (once for `production_notes`/`worked_examples` at the data layer, once for `steps[].uses` at the render layer) — recurring a third time, here, for header metadata specifically.

**A6. [Verified as-designed, engaging with the explicit design question rather than treating it as a bug] The Citations block duplicates `OfficialResources`, and — now that both exist side by side — the honest answer is that the Citations block should be removed**

`OfficialResources.tsx` already does everything a citation list needs: it categorizes sources (Documentation / Model Cards / Research Papers / Further Reading), resolves each URL to a human-readable title and subtitle via `parseResourceUrl` (confirmed — the GitHub entry alone shows `info.title`/`info.subtitle`, not a bare href), and already has a deliberate, precedented deduplication mechanism (`hasLearningResources`) for exactly this kind of "same links, shown twice" problem. The Citations block added specifically to fix footnote visibility, by contrast, is a bare numbered list showing the **raw URL as its own link text** (`<a href={url}>{url}</a>`) — no title, no category, no icon. Given `OfficialResources` already renders directly below it and does the same job strictly better, the honest, minimal-cognitive-load answer to *"should footnote references be removed entirely"* is **yes** — not because footnotes are inherently wrong, but because a second, worse-styled citation surface next to a better one that already exists is pure redundancy. This directly serves the stated project goal (clean, minimal, engineering-focused, not academic-paper-like).

**A7. [Confirmed non-issue] `Watch Out` and `Common Failure Points` are already visually unified (both amber), not two different colors**

This was a real inconsistency several rounds ago and was fixed then; both are confirmed still using the same amber treatment today. The remaining question — *does amber itself increase cognitive load, and would a calmer treatment serve better* — is a genuine design judgment, addressed directly in Deliverable B rather than treated as a bug, since there's no code defect here to "verify."

**A8. Confirmed non-existent file: `BadgeRow.tsx`**

No such file exists anywhere in `components/shared/`. The step-level `Uses:` badges are rendered inline inside `WorkflowStepList.tsx` via `renderUses`/`renderAllUses`, using `ContentTypeBadge` directly in a `flex flex-wrap` container — there is no separate `BadgeRow` abstraction to inspect or change.

---

## Deliverable B — UI/UX Architecture Review

**What should stay, unchanged, exactly as-is:**
- The overall 9-block page architecture (Overview → Steps → Worked Examples → Failures → Production Profile → Evaluation → Related), frozen since the original Workflow Layer Design Report — still correct, still matches how this content type is actually used.
- `hidden="until-found"` + `onBeforeMatch` for find-in-page — correct, load-bearing, do not touch.
- The balanced-depth-walk code truncation in `CodeBlock.tsx` — correct, verified twice now under stress tests.
- Module-scope `WorkflowStepItem` — correct, do not reintroduce nesting.
- `parseLabeledClauses` and its wiring across failure points and Production Profile — correct, scannable, exactly the "engineering spec, not wall of text" quality the project goal asks for.
- `ContentTypeBadge`/`SectionCard`/the eyebrow-label convention — consistent, load-bearing design-system primitives; reuse them for any new UI rather than inventing new patterns.

**What should change:**
- **`collapseAll`'s semantics (A1).** "Collapse All" should mean exactly that — collapse everything, full stop, `new Set()`. If there's a genuine product reason to keep something open by default, that belongs in the component's *initial* `useState` value only, never re-asserted by a button whose label promises the opposite.
- **Code-fence rendering inside `Prose` (A2).** `Prose`/`ProseInline` need a `code`/`pre` component override that routes fenced code blocks through the same Shiki pipeline `CodeBlock` already uses, so a code sample embedded in `step.what`/`step.decision`/`production_notes` gets the same visual treatment as one in Worked Examples. This is the single highest-value fix in this round — it's a visible, jarring quality gap on exactly the kind of content (dense, technical, code-adjacent) this page exists to serve well.
- **The Citations block (A6).** Remove it. Keep the `[^1]`-to-something conversion only if it's made to link directly into `OfficialResources` (which would need stable per-source anchor ids added there — a small, scoped addition), or else strip the footnote-reference conversion from `overview` entirely and let the prose read as plain text, relying on `OfficialResources` alone as the citation surface. Either is clean; keeping a second, worse-styled block next to a better one is not.
- **`StickyActionBar`'s "§" glyph (A3).** Replace with either no decorative glyph at all (just the label text) or a small, universally-understood icon (e.g. a list/hamburger-adjacent glyph already used elsewhere in the nav shell) — a section-sign is a legal/document typographic convention most engineers won't recognize as "current section," and it's disposable, not load-bearing.
- **Header metadata parity with Model (A5).** Pass `difficulty`, `domain`, and `engineering_area` (all already populated, already schema-valid) into `MetadataBadges` for the Workflow page, matching the Model page's header richness rather than under-using data that's already there.

**What should never change (explicit, for the freeze record):**
- The 8-step schema ceiling and the closed 12-category taxonomy — both were deliberately frozen in the original Design Report for scalability reasons unrelated to this round's UI polish; don't reopen either as a side effect of a UX fix.
- The amber "Watch Out"/"Common Failure Points" color choice, unless a specific, tested calmer alternative is proposed and compared side-by-side — "yellow feels alarming" is a legitimate hypothesis but not, on its own, sufficient justification to change a convention used consistently across the whole page; if changed, change it project-wide (it likely appears on other content types too) rather than only here.

---

## Deliverable C — Prioritized Implementation Roadmap

**Highest impact, lowest risk first:**

1. **A1 — Fix `collapseAll`.** One-line change (`new Set([0])` → `new Set()`), zero regression surface, immediately removes a genuinely confusing interaction.
2. **A6 — Remove or properly integrate the Citations block.** Low risk (deleting a block, or a small addition to `OfficialResources` for anchor ids), removes visible redundancy.
3. **A3 — Replace the "§" glyph in `StickyActionBar`.** Trivial, cosmetic, zero risk.
4. **A5 — Pass existing metadata into `MetadataBadges` for Workflow.** Low risk (props already exist on the component if it supports them for Model; verify `MetadataBadges`'s own prop types accept `difficulty`/`domain`/`engineering_area` for the `workflow` type before wiring — if it doesn't yet, this becomes a small, additive prop-type extension, still low risk).
5. **A2 — Add Shiki-backed code-fence rendering to `Prose`.** Medium complexity (reusing `CodeBlock`'s highlighting logic inside a `react-markdown` component override, likely requiring the highlight step to move client-side or be pre-processed, since `Prose` may render in contexts without direct access to the same server-side Shiki call `CodeBlock` uses — needs a design decision on where the highlighting happens before implementing). Highest visual-impact item, but sequenced last because it's the most architecturally involved.
6. **A4 — Populate `related_step` on `build-rag-system.json`'s two worked examples.** Content task, not a code task — can happen independently of any of the above, any time.

---

## Deliverable D — Windsurf Implementation Prompt

```markdown
# AENS Workflow Page — Pre-Freeze Final Polish Pass

## Context
This is the final UI/UX polish pass before the Workflow page architecture is
permanently frozen. Every task below was verified against the actual current
repository state — none are speculative. Preserve the current architecture
(static generation, Zod schema, 8-step ceiling, 12-category taxonomy) exactly
as-is; this pass is UI/UX polish only, not a redesign.

**Hard constraints:**
- No schema changes except the one explicitly scoped in Task 4 (verify it's
  actually needed before touching anything).
- No new third-party UI dependencies.
- Do not touch: `WorkflowStepList.tsx`'s module-scope `WorkflowStepItem`
  placement, `CodeBlock.tsx`'s `truncateHighlightedHtml` balanced-depth
  walker, `CollapsibleRow.tsx`'s `hidden="until-found"` implementation,
  `parseLabeledClauses.ts`, the 8-step schema ceiling, or the 12-category
  taxonomy. All of these are correct and frozen.

## Target Files
- `components/shared/WorkflowStepList.tsx` (Task 1)
- `app/workflows/[id]/page.tsx` (Task 2)
- `components/shared/StickyActionBar.tsx` (Task 3)
- `components/shared/MetadataBadges.tsx`, `app/workflows/[id]/page.tsx` (Task 4)
- `components/shared/Prose.tsx`, `components/shared/CodeBlock.tsx` (Task 5)
- `data/workflows/build-rag-system.json` (Task 6 — content, not code)

## Files to Avoid
- `components/shared/CollapsibleRow.tsx`
- `lib/text/parseLabeledClauses.ts`
- `lib/schemas/workflow.ts` (no changes needed anywhere in this pass)
- `components/shared/ContentPageLayout.tsx`, `components/shared/TableOfContents.tsx`
  (both correct and frozen from the previous round)

---

## Task 1 (Critical, trivial): Fix `collapseAll`

**File:** `components/shared/WorkflowStepList.tsx`

Change:
```ts
const collapseAll = () => {
  setExpandedSteps(new Set([0])); // Keep Step 1 open by default
};
```
to:
```ts
const collapseAll = () => {
  setExpandedSteps(new Set());
};
```
Leave the initial `useState(new Set([0]))` untouched — Step 1 still starts
open on first page load; only the "Collapse All" button's behavior changes to
mean what it says.

**Acceptance Criteria:**
- Manually close Step 1, then click "Collapse All" — Step 1 must remain
  closed (not reopen).
- Click "Collapse All" from any other state — every step closes, no exceptions.
- First page load (before any interaction) is unaffected — Step 1 still
  starts open.

---

## Task 2 (High): Remove the redundant Citations block; keep `OfficialResources` as the single source list

**File:** `app/workflows/[id]/page.tsx`

1. Remove the `[^1]` → `[[1]](#footnote-1)` replacement logic and the entire
   "Citations" `<div>` block (the bare numbered URL list) from the overview
   section.
2. Restore `workflow.overview` to render as plain content (no footnote-marker
   preprocessing) inside `Prose`, still wrapped in the existing `ExpandableText`.
3. Verify `OfficialResources` (already rendered further down the page,
   unchanged) still receives `workflow.sources` and continues to display
   every source with a proper title/category — no source should become
   unreachable as a result of removing the Citations block.
4. If the content actually relies on `[^1]`-style markers inside `overview`
   text for meaning (check a few real `overview` values before assuming they
   don't), and simply stripping them would leave a dangling `[^1]` visible in
   the rendered text, strip the bracket markers themselves (not just skip
   converting them to links) so no raw `[^1]` artifact survives in the final render.

**Acceptance Criteria:**
- No duplicate listing of the same source URLs anywhere on the page.
- `OfficialResources` renders exactly as before, unaffected.
- No `[^1]`-style raw text visible anywhere in the rendered overview.
- "See More" on the Overview now only appears when the overview text itself
  (not a footnote list) genuinely exceeds 4 lines — re-verify this specific
  behavior, since it was the original reason a Citations block existed at all.

---

## Task 3 (Low, trivial): Replace the "§" glyph in the sticky action bar

**File:** `components/shared/StickyActionBar.tsx`

Remove the literal `§` character from the active-section label
(`<span className="truncate">§ {activeLabel}</span>` → `<span className="truncate">{activeLabel}</span>`),
or replace it with a small icon already used elsewhere in the nav shell if a
visual separator is still wanted (check `lucide-react` imports already used
in this file for a consistent choice — do not add a new icon dependency).

**Acceptance Criteria:** No unexplained typographic symbol remains in the
sticky bar's section label.

---

## Task 4 (Medium): Bring Workflow's header metadata to parity with Model's

**Files:** `components/shared/MetadataBadges.tsx`, `app/workflows/[id]/page.tsx`

1. Check `MetadataBadges.tsx`'s prop types for the `workflow` variant — confirm
   whether `difficulty`/`domain`/`engineering_area` are already accepted props
   (they may already be typed generically) or need adding.
2. In `page.tsx`, pass `difficulty={workflow.difficulty}`,
   `domain={workflow.domain}`, and `engineeringArea={workflow.engineering_area}`
   (match whatever exact prop names `MetadataBadges` already uses for the
   Model variant, for consistency) to the existing `<MetadataBadges>` call.
3. Do not add `estimated_reading_time` to this badge row unless there's
   already a precedent for showing it elsewhere (check the Model page again;
   if it's not shown there either, treat it as a separate, later decision
   rather than bundling it into this parity fix).

**Acceptance Criteria:**
- Workflow's header now shows difficulty/domain/engineering area badges when
  populated, matching the Model page's header density.
- A workflow JSON with any of these fields missing (optional, per schema)
  simply omits that badge — no empty/broken badge renders.
- No visual regression to the existing `category`/`updatedAt` badges.

---

## Task 5 (Medium-High): Route fenced code blocks inside `Prose` through Shiki

**Files:** `components/shared/Prose.tsx`, possibly a new shared utility
extracted from `components/shared/CodeBlock.tsx`

1. Before implementing, determine whether `CodeBlock`'s Shiki highlighting can
   run in the context `Prose` renders in (check whether `Prose` is used only
   in Server Components today, or also in Client Components — Shiki's
   `codeToHtml` is typically an async server-side call, which constrains this).
2. Add a `code`/`pre` override to `Prose`'s `ReactMarkdown` `components` prop
   that, for a fenced code block, renders through the same highlighting
   approach `CodeBlock` uses (ideally by extracting `CodeBlock`'s core
   highlight-and-render logic into a small shared function both components
   call, rather than duplicating the Shiki setup) — the render should look
   visually consistent with a Worked Example's code block (same theme,
   similar padding), though it does not need the copy/wrap/collapse
   interactive affordances (that's `CodeBlockInteractive`'s job, not
   necessarily needed for an inline step-description code sample — decide
   based on how long these embedded snippets typically are; if they're short,
   a simpler static highlighted block without interactive controls is fine).
3. Verify against `vector-database-setup-indexing-strategy.json` specifically
   — every one of its 8 steps has an embedded fenced code block; this is the
   real-world test case.

**Acceptance Criteria:**
- A fenced code block inside `step.what` now renders with the same Shiki
  syntax coloring as a Worked Example's code block, not plain monospace text.
- No regression to `ProseInline`'s existing paragraph-flattening behavior for
  non-code inline content.
- Build time is not meaningfully affected (spot-check `npm run build` timing
  before/after on a workflow-heavy build).

---

## Task 6 (Low, content-only, no code change): Populate `related_step` on `build-rag-system.json`

**File:** `data/workflows/build-rag-system.json`

Set `"related_step": 4` on the "Hybrid Search RAG with RRF" worked example,
and `"related_step": 3` on "Late Chunking Implementation" — matching the
steps they actually illustrate. This is a content edit, not a code change;
verify against `npm run validate` after editing.

**Acceptance Criteria:**
- Both worked examples now show a "Used in Step N" tag.
- Both corresponding steps now show a "View worked example →" link.
- `npm run validate` passes with zero new errors.

---

## Validation Checklist
- [ ] `npm run build` completes with zero errors.
- [ ] `npm run validate` passes with zero new schema errors.
- [ ] Manual test of Task 1's exact repro steps (close Step 1 manually, then
      click Collapse All).
- [ ] Visual check: no duplicate source listings anywhere on the page after Task 2.
- [ ] Visual check: Workflow header metadata density after Task 4, compared
      side-by-side with a Model page.
- [ ] Visual check: `vector-database-setup-indexing-strategy.json`'s step
      descriptions show properly highlighted code after Task 5.

## Regression Checklist
- [ ] Find-in-page still works on all step bodies and the Production Profile
      (untouched by this pass, but Task 1 and Task 5 both touch
      `WorkflowStepList.tsx`/`Prose.tsx` — re-verify).
- [ ] Code block copy/wrap/collapse in Worked Examples unaffected by Task 5's
      changes to `Prose`/shared highlighting logic.
- [ ] Existing `rag-evaluation-harness.json` and
      `vector-database-setup-indexing-strategy.json` render correctly after
      Task 2 and Task 4 (both have real `sources` and metadata fields that
      exercise the same code paths as `build-rag-system.json`).
- [ ] Dark mode spot-check on all changed components.
- [ ] Keyboard/ARIA pass on the sticky bar after Task 3 (confirm removing the
      glyph doesn't affect any `aria-label` that might reference it).

## Accessibility Validation
- [ ] Confirm `aria-expanded` correctly reflects state after Task 1's fix
      (closing Step 1 then clicking Collapse All should leave
      `aria-expanded="false"` on Step 1's toggle, not silently revert to true).
- [ ] Confirm any newly-rendered code blocks from Task 5 are keyboard-focusable
      and readable by screen readers (check whether `CodeBlock`'s existing
      accessibility treatment, if any, needs to be replicated in the new
      `Prose`-embedded variant).

## Responsive Validation
- [ ] Re-check Task 4's new header badges at narrow (375px) width — confirm
      they wrap gracefully alongside the existing `category`/`updatedAt` badges
      rather than overflowing.
- [ ] Re-check Task 5's inline code blocks at narrow width — confirm they
      scroll horizontally rather than breaking layout, consistent with how
      `CodeBlock` already handles this in Worked Examples.
```
