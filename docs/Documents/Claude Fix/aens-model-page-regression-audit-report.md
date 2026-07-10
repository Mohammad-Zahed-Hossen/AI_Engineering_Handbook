# AENS Model Detail Page — Regression Audit & Windsurf Prompt Package (Post-Implementation)

**Scope:** `app/models/[category]/[id]/page.tsx` and dependencies, post-implementation of the prior 4-prompt audit fix
**Commit inspected:** `770f00e` ("resolve model page audit findings with markdown, math, date formatting, and syntax highlighting"), diffed against its parent `7560913` to isolate exactly what this implementation changed
**Method:** Direct diff of the implementing commit, `npm install` + attempted `npm run build`, direct inspection of `node_modules/katex` and `node_modules/shiki` output, byte-level inspection of `data/models/**` JSON content.

---

## 1. Executive Summary

Every regression reported traces to a specific, identifiable line in the `770f00e` diff — none of them are vague or unreproducible. Two different failure patterns are at work:

**Pattern A — my own Prompt #1/#2/#4 were implemented too literally in a way I should have constrained more tightly.** I recommended Shiki but explicitly flagged it should run at build time; it was wired up as client-side runtime highlighting instead, which is the direct cause of the performance regression and part of the code-block UX regression. I recommended a `content-prose` wrapper and a teaser for Core Understanding but didn't anticipate that a field-content teaser (as opposed to a computed-count teaser like every other section uses) would surface raw LaTeX and duplicate the specs grid — that's on the prompt's under-specification, not the implementation.

**Pattern B — a genuine, previously-undiscovered data bug.** The "LaTeX still broken" and "Mathematical Intuition still broken" regressions are **not** a rendering-pipeline problem at all. Byte-level inspection of `data/models/ml/logistic-regression.json` and `data/models/ml/svm.json` shows the `mathematicalintuition` field contains **literal two-character `\n` sequences** (an actual backslash character followed by the letter "n") instead of real newline characters, alongside correctly-escaped LaTeX commands (`\top`, `\sigma`, `\frac`). This is a double-escaping artifact in the frozen data files themselves — the rendering pipeline built in the previous round (`react-markdown` + `remark-math` + `rehype-katex`) is working exactly as designed; it's being fed malformed input.

None of the six regressions require touching the architecture, schema, or routing. Three are pure implementation-detail fixes to components already introduced last round (`CodeBlock.tsx`, `ModelCollapsibleSections.tsx`'s teaser); one requires either a data correction or a defensive normalization step in `Prose`.

---

## 2. Root Cause Analysis

### 2.1 Model Page Performance Regression

**Confirmed cause:** `components/shared/CodeBlock.tsx` imports `shiki` directly inside a `'use client'` component and calls `codeToHtml()` inside a `useEffect`, i.e. **entirely at runtime, in the browser, after hydration** (diff: `import { codeToHtml } from 'shiki';` + `useEffect(() => { codeToHtml(displayCode, {...}).then(...) }, [displayCode, language])`).

This directly contradicts what Prompt #2 called for: *"since AENS content is statically generated, Shiki's highlighting can even run at build time... wrap CodeBlock itself as an async Server Component."* The implementation kept `CodeBlock` a client component and shipped Shiki's runtime to the browser instead.

Measured cost of this choice: `node_modules/shiki` + `node_modules/@shikijs` together total **~17 MB on disk**, including a **456 KB WebAssembly binary** (`onig.wasm`, the Oniguruma regex engine used for TextMate-grammar tokenization). Some of this is tree-shaken by bundlers, but calling `codeToHtml` from client code means the highlighter engine, the grammar for whatever `language` is requested, and the theme (`github-dark`) all have to be resolved and executed in the browser, per code block, on every page that has a Quick Start section — work that produces byte-for-byte identical output every time for content that is static at build time (`data/models/**` is frozen JSON, not user input).

This is the single largest lever on the reported performance regression. It is also unnecessary: nothing about `code` being highlighted depends on the visitor, the request, or runtime state.

### 2.2 Code Block UX Regression

Four separate, confirmed defects in the same diff:

1. **Double, conflicting collapse logic.** The new code applies both a line-count slice (`shouldCollapse = lines.length > 20`, then `displayLines = lines.slice(0, 20)`) *and* a CSS height cap (`shouldCollapse && !isExpanded && "max-h-[300px] overflow-hidden"`) on the same block simultaneously. At `text-[11px] leading-relaxed`, 20 lines of code plausibly exceeds 300px on its own — meaning the CSS clip can cut into the already-sliced 20-line preview, double-clipping content in a way neither mechanism intended alone. This reads as "worse" specifically because it's inconsistent: sometimes a full syntactic line is visible at the cut point, sometimes half a line is clipped by the height cap, depending on the language/indentation.
2. **`showLineNumbers` support was silently removed.** The previous version's `{showLineNumbers ? <table>… line numbers …</table> : code}` branch was deleted entirely and replaced with a single `dangerouslySetInnerHTML={{ __html: highlightedCode }}` — Shiki's own HTML output, which has no awareness of the `showLineNumbers` prop. The prop is still declared in `CodeBlockProps` and still accepted, but it now does nothing. This is a quiet feature regression: any future call site that passes `showLineNumbers` will get no line numbers with no error or warning.
3. **The mobile horizontal-scroll fade was removed.** The previous version had a `pointer-events-none ... bg-gradient-to-l ... md:hidden` overlay signaling "this code scrolls horizontally" on small screens. It is gone from the new implementation; only a new *vertical* bottom-fade (for the line-count collapse) was added in its place. Long lines on mobile now have no visual affordance indicating horizontal scroll is available.
4. **Flash of un-highlighted code on every load.** `highlightedCode` initializes to `null` and is only populated after the `useEffect` resolves — which happens after hydration, on the client, after the user has already seen a first paint. Every visitor sees plain unhighlighted text snap into syntax-colored text a moment later. This is a visible layout/content flash on every page view, not just a cold-cache edge case.

### 2.3 LaTeX Rendering Still Broken — confirmed data-level double escaping, not a pipeline bug

Direct byte inspection of `data/models/ml/logistic-regression.json`:

```
"mathematicalintuition": "For binary classification, the model is\\n\\n$$\\np(y=1\\mid x)=\\sigma(w^\\top x+b)=\\frac{1}{1+e^{-(w^\\top x+b)}}\\n$$\\n\\n..."
```

Reading this raw JSON source character-by-character: every `\top`, `\sigma`, `\mid`, `\frac` is correctly double-backslash-escaped (`\\top` in JSON source → single backslash + "top" after JSON parsing → valid LaTeX `\top`). **But every intended line break is *also* written as `\\n`** — which JSON-decodes to a literal two-character string (backslash, then the letter "n"), not an actual newline (0x0A). The same double-escaping error exists in `data/models/ml/svm.json`.

This explains the exact symptom in the regression report — visible fragments like `⊤`, `σ`, `1−p` (KaTeX successfully rendering the parts of the string it can isolate) interleaved with garbled or missing text (`p∣x)` missing its `y=1` and opening parenthesis). `remark-math`'s block-math (`$$...$$`) detection expects `$$` to sit on its own line, delimited by real blank lines; with literal backslash-n *text* sitting where a real newline should be, the math delimiters and surrounding prose run together as one unbroken string, and both `remark`'s paragraph/block splitting and KaTeX's own delimiter matching behave unpredictably against it — rendering only fragments correctly.

**This is not a defect in the rendering pipeline built last round.** `react-markdown` + `remark-math` + `rehype-katex` are configured correctly and will render this content correctly *once it contains real newlines*. The defect is in the authored JSON content itself, in exactly two files sampled (there may be more — see regression checklist in Prompt #2 below).

**Constraint conflict to flag explicitly:** `data/models/**` is frozen per the Freeze Guardian policy, and per Zahed's working pattern this class of change (editing frozen data) should not happen silently. Prompt #2 below offers a data-correction path *and* a defensive pipeline-side normalization fallback, and recommends surfacing this choice back to Zahed rather than Windsurf silently picking one.

### 2.4 Mathematical Intuition & Formulation — same root cause as 2.3

No separate defect exists here; `coreunderstanding.mathematicalintuition` is the exact field inspected above. Fixing 2.3 fixes this symptom identically, for both currently-affected models.

### 2.5 Model Description Typography Regression — confirmed cause: unscoped KaTeX default type scale

The `.content-prose`/Tailwind classes on `model.description` and `decisionsummary.summary` are **byte-for-byte unchanged** by the `770f00e` commit (confirmed via diff — only the wrapping element changed from `<p>` to `<Prose>`, not any size/weight class). The "became larger" perception has a different, very concrete cause: `node_modules/katex/dist/katex.min.css`, imported globally in `app/layout.tsx`, ships this un-scoped rule:

```css
.katex { font: normal 1.21em KaTeX_Main, Times New Roman, serif; line-height: 1.2; ... }
```

Every `.katex` element — i.e. every rendered math span, anywhere `Prose`/`ProseInline` encounters `$...$` or `$$...$$` — is **21% larger than its surrounding text** and rendered in a **serif font** (`KaTeX_Main`/Times New Roman) regardless of the Tailwind `text-xs`/`font-sans` classes on its container. Nothing in `globals.css` scopes or overrides this. Wherever content mixes plain prose with inline math (the `coreunderstanding.complexity` field for `svm`/`logistic-regression`, rendered via `ProseInline` in the specs grid), the math fragments visibly jump in size and switch typeface mid-sentence relative to the surrounding sans-serif text — which reads exactly like "the font became larger," because for those specific spans, it did.

### 2.6 Core Understanding Card Regression — confirmed self-inflicted duplication from the Prompt #4 teaser recommendation

Confirmed in diff:
```js
const coreTeaser = `${model.coreunderstanding.complexity} · ${model.coreunderstanding.robustness}`;
```
passed as `teaser={coreTeaser}` to Core Understanding's `<CollapsibleSection>`, rendered as plain, un-parsed text in the section header (`{teaser && <span ...>{teaser}</span>}` in `CollapsibleSection`, never routed through `Prose`).

Two confirmed problems:
- **Inconsistent teaser semantics.** Every other section's teaser is a *computed summary statistic* — `"3 limitations noted"`, `"6 parameters · 2 high priority"`, `"2 alternatives compared"`. Core Understanding's new teaser instead concatenates two **raw content field values** verbatim. This breaks the established pattern (count/summary, not raw content) and is the direct cause of "the description is visible" / "looks incorrect" — it's not `model.description` reappearing, it's `coreunderstanding.complexity` + `coreunderstanding.robustness` being surfaced a second time (they're both already shown, unabbreviated, in the specs grid the instant the section is expanded).
- **Unrendered LaTeX in a header.** For `svm`/`logistic-regression`, `coreunderstanding.complexity` contains raw `$O(Tnp)$`-style LaTeX (see 2.3/2.5). Since the teaser bypasses `Prose`/`ProseInline` entirely, the section header — visible even while the section is *collapsed* — shows literal dollar signs and backslashes for those two models, which is a second, distinct exposure of the same authoring-format problem in a much more visible location (a persistently-visible header) than the collapsed content it summarizes.

**This regression is attributable to how Prompt #4 specified the teaser, not to Windsurf misreading it** — the original prompt said "Add a `teaser` prop... summarizing e.g. complexity/robustness at a glance" without specifying that it must be a computed/derived summary rather than raw field concatenation, and without flagging that the same field is one of the two known LaTeX-bearing fields. That gap in the original prompt is being corrected explicitly in Prompt #3 below.

---

## 3. Performance Analysis

| Source | Type | Confirmed impact |
|---|---|---|
| Shiki client-side (`CodeBlock.tsx`) | Client JS + WASM, runtime execution | ~17 MB of dependency surface (`shiki` + `@shikijs`), including a 456 KB WASM binary, invoked per code block, per page load, in the browser — for output that is 100% static and identical across all visitors |
| `react-markdown` + `remark-*`/`rehype-katex` (`Prose.tsx`) | No `'use client'` directive present — eligible to run as a Server Component | Currently likely *already* rendering server-side/at-build (no client directive was added), which is good — but this needs to be explicitly confirmed with `next build`'s output trace, not assumed, since a parent client boundary could still force it client-side (see Prompt #1's acceptance criteria) |
| KaTeX CSS (`katex/dist/katex.min.css`) | Global stylesheet, imported once in `layout.tsx` | Reasonable, one-time cost; not a performance regression by itself — its problem (2.5) is visual, not weight |
| Double collapse logic (`CodeBlock.tsx`) | Client-side re-render on `isExpanded` toggle | Minor; not a meaningful performance cost, but is a UX cost (2.2) |

**Bottom line:** the performance regression has one dominant, clearly-attributable cause (Shiki running client-side) rather than being distributed across many small inefficiencies. Fixing 2.1 by moving highlighting to build/server time should resolve the large majority of the reported slowdown without needing to touch anything else.

---

## 4. Regression Analysis (traceability table)

| Regression reported | Introduced by | Exact location | Confirmed via |
|---|---|---|---|
| Page performance | `770f00e` | `CodeBlock.tsx` — client-side `shiki.codeToHtml()` in `useEffect` | Diff + `node_modules/shiki` size |
| Code block UX | `770f00e` | `CodeBlock.tsx` — collapse logic, removed line-numbers, removed mobile fade | Diff (line-by-line) |
| LaTeX broken | Pre-existing, exposed by `770f00e`'s rendering pipeline | `data/models/ml/{svm,logistic-regression}.json` — `\\n` instead of `\n` | Raw byte inspection of JSON source |
| Math Intuition broken | Same as above | Same fields | Same |
| Description typography "larger" | `770f00e` (indirect) | `node_modules/katex/dist/katex.min.css`'s unscoped `.katex{font:1.21em...}`, imported in `layout.tsx` | Direct inspection of installed KaTeX CSS |
| Core Understanding duplication | `770f00e` | `ModelCollapsibleSections.tsx` — `coreTeaser` concatenates raw fields, bypasses `Prose` | Diff |

---

## 5. Additional Issues Found

- **`escapeHtml` fallback path is unreachable in practice but silently wrong if it ever fires:** `CodeBlock.tsx`'s `catch` branch on `codeToHtml` failure builds `<pre><code>${escapeHtml(displayCode)}</code></pre>` as a raw HTML string via `dangerouslySetInnerHTML` — functionally fine, but it means a Shiki failure (e.g., an unsupported `language` value from `quickstart.language`) silently degrades to unstyled code with no visible indication to the user or in the UI that highlighting failed, only a `console.error`.
- **`useEffect` re-runs `codeToHtml` on every `displayCode` change**, which includes every expand/collapse toggle (since `displayCode` is derived from `isExpanded`) — meaning expanding a collapsed code block re-invokes Shiki a second time client-side for the full code, compounding the cost identified in 2.1 rather than reusing a single highlight pass.
- **No `loading`/skeleton state during the async highlight**, so the "flash" in 2.2.4 has no visual smoothing (e.g., a fade-in) — it's an abrupt content swap.
- **KaTeX's global CSS also sets a body-level rule** (`body{counter-reset:katexEqnNo mmlEqnNo}`) as a side effect of the stylesheet import — harmless today, but worth knowing it exists if `body`-level counters are ever used elsewhere.

---

## 6. Recommended Fix Strategy

1. **Move Shiki to build/render time, not client runtime.** Since all `quickstart.code` content is static (frozen JSON, known at build time), highlighting should happen once, ahead of time — either by making `CodeBlock` an `async` Server Component that calls `codeToHtml` directly (no `useEffect`, no client bundle cost for Shiki at all), or, if the collapse/copy interactivity requires a client boundary, by pre-computing the highlighted HTML in the parent Server Component (`page.tsx`) and passing it down as a prop, keeping only the copy-button/expand-button interactivity client-side.
2. **Fix the double-collapse conflict** by picking one clipping mechanism (line-count slice) and removing the redundant CSS `max-h` cap, or vice versa — not both.
3. **Restore the two silently-removed features** (line-number table rendering, mobile horizontal-scroll fade) so this isn't a net feature loss relative to before.
4. **Do not silently rewrite frozen data files.** Flag the double-escaped `\\n` finding back to Zahed as a data-authoring bug with the exact fix (`\\n` → `\n` in the two affected JSON files), and separately add a defensive normalization step in `Prose` that collapses any literal backslash-n sequences it receives, so the page degrades gracefully even before/if the data is corrected — implemented as a fallback, not a replacement for fixing the data.
5. **Scope KaTeX's type scale to the surrounding Tailwind type system** — override `.katex`'s `font-size`/`font-family` to inherit from context rather than hardcoding `1.21em`/serif, so math doesn't visually jump relative to body text.
6. **Replace the Core Understanding teaser with a computed summary consistent with every other section's pattern**, and route anything shown in a teaser — collapsed or not — through `Prose`/`ProseInline`, since teaser content can carry the same LaTeX/markdown risk as body content.

---

## 7. Priority Matrix

| # | Issue | Impact | Effort | Risk | Priority |
|---|---|---|---|---|---|
| 1 | Shiki running client-side (performance) | Critical | Medium (move to Server Component / pre-render) | Low | **Critical** |
| 2 | Code block double-collapse + removed features | High | Low–Medium | Low | **Critical** |
| 3 | Double-escaped `\\n` in data (LaTeX/Math Intuition) | High | Low (data fix) + Low (defensive fallback) | Medium (touches frozen data — needs sign-off) | **Critical** |
| 4 | KaTeX unscoped 1.21em/serif (typography "larger") | High | Low (CSS override) | Low | **High** |
| 5 | Core Understanding teaser duplication/unrendered LaTeX | Medium-High | Low | Low | **High** |

---

## 8. Windsurf Prompt #1 — Move Syntax Highlighting to Build/Server Time and Fix Collapse Logic

**Objective:** Eliminate the client-side Shiki runtime cost that is the primary driver of the performance regression, and fix the Quick Start code block's conflicting collapse logic and two silently-removed features (line numbers, mobile horizontal-scroll fade), without changing `CodeBlock`'s external props.

**Root cause:** `components/shared/CodeBlock.tsx` is a `'use client'` component that calls `shiki`'s `codeToHtml()` inside a `useEffect`, shipping the entire Shiki runtime (WASM regex engine + grammars + theme, ~17 MB in `node_modules`) to the browser and re-computing highlighting on every mount and every expand/collapse toggle, for content that is 100% static at build time.

**Files to inspect:**
- `components/shared/CodeBlock.tsx` (full file — current version post-`770f00e`)
- `app/models/[category]/[id]/page.tsx` (the only call site, confirm exact props passed: `code`, `language` only today)
- Confirm Next.js 16 support for `async` Server Components returning JSX with `dangerouslySetInnerHTML` from a pre-computed string (should work; verify no `'use client'` boundary issue if `CodeBlock` is imported into a Server Component tree, which `page.tsx` already is)

**Implementation strategy:**
1. Split `CodeBlock` into two pieces: an `async` Server Component (`CodeBlock`) that calls `codeToHtml(code, { lang: language, theme: 'github-dark' })` directly at render time (no `useEffect`, no client-side Shiki import at all) and passes the resulting HTML string down, and a small `'use client'` child (e.g. `CodeBlockInteractive`) that owns only `copied`/`isExpanded` state, the copy button, and the expand/collapse button — receiving the pre-highlighted HTML (and, separately, the pre-highlighted "first 20 lines" HTML for the collapsed state) as props.
2. Pre-compute **both** the collapsed-preview HTML (first `MAX_COLLAPSED_LINES` lines highlighted) and the full HTML at build/render time in the Server Component half, so toggling `isExpanded` on the client only swaps between two already-computed strings — no client-side Shiki call ever happens, including on expand.
3. Resolve the double-collapse conflict: keep the line-count slice (`MAX_COLLAPSED_LINES = 20`) as the single source of truth for what's hidden, and remove the `max-h-[300px] overflow-hidden` CSS cap entirely — the line slice already controls how much is shown, so a second independent height cap is redundant and is what causes inconsistent mid-line clipping.
4. Restore `showLineNumbers`: since Shiki's HTML output replaces the old `<table>`-based line numbers, use Shiki's built-in line-numbering support (a transformer, e.g. `@shikijs/transformers`' `transformerNotationLineNumbers` or an equivalent line-decorator) so the feature works again with the new highlighter rather than being silently dropped. If Shiki's own line-number output doesn't visually match the old table layout closely enough, wrap Shiki's per-line `<span>` output in the same right-aligned line-number column markup as before.
5. Restore the mobile horizontal-scroll-fade gradient (`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-zinc-950 to-transparent md:hidden`) alongside (not instead of) the new bottom vertical-collapse fade — they serve different purposes (horizontal overflow vs. vertical line-count truncation) and both can coexist.
6. Remove the `useEffect`-based `highlightedCode` state and its `null`-initial "flash" entirely, since highlighting now happens before the component ever reaches the client.

**Performance constraints:**
- Zero client-side Shiki execution — `shiki`/`@shikijs` must not appear in any client bundle; verify via `next build`'s output (look for the packages in the client chunk analysis, not just "it compiles").
- No new client-side dependencies beyond what's needed for the (already-existing) copy-button and expand/collapse interactivity.
- Do not increase the number of `'use client'` boundaries beyond the one small interactive child described above.

**Acceptance criteria:**
- Quick Start code is syntax-highlighted with zero client-side highlighting computation — confirm by checking the rendered static HTML output already contains Shiki's highlighted spans before any JS executes (view-source on the exported static page, or inspect with JS disabled).
- No flash of unhighlighted code on any page load.
- A code block exceeding 20 lines collapses to exactly 20 lines with a single, consistent clipping boundary (no CSS height cap fighting the line slice).
- `showLineNumbers` produces visible line numbers again when passed `true` (spot-check by temporarily passing `showLineNumbers` at the one call site, or add a regression test file).
- Mobile viewport (375px) shows both the horizontal-scroll fade (for long lines) and, when applicable, the vertical bottom fade (for collapsed long blocks) — not just one.

**Regression checklist:**
- [ ] `npm run validate`, `tsc --noEmit`, `npm run lint`, `npm run build` all pass.
- [ ] Confirm expand/collapse toggling does not trigger any new network request or client-side Shiki call (check browser dev tools / Next.js client bundle analysis).
- [ ] Confirm copy-to-clipboard (desktop + mobile buttons) still works identically.
- [ ] Confirm all 4 existing models' `quickstart.code` renders correctly highlighted, across their respective `language` values.
- [ ] Confirm dark mode is unaffected (code block was already dark-themed independent of site theme; verify this remains true).

---

## 9. Windsurf Prompt #2 — Fix Double-Escaped Newlines Breaking Math/Markdown Rendering

**Objective:** Resolve the "LaTeX still broken" / "Mathematical Intuition still broken" regressions, whose confirmed root cause is literal `\n` (backslash + letter "n") text sitting in two frozen data files where real newline characters were intended — not a defect in the `react-markdown`/`remark-math`/`rehype-katex` pipeline itself.

**Root cause:** `data/models/ml/logistic-regression.json` and `data/models/ml/svm.json`'s `coreunderstanding.mathematicalintuition` fields (and potentially other fields — must be checked, see below) contain the literal two-character sequence `\n` in place of real line breaks, alongside correctly-escaped LaTeX backslash commands (`\top`, `\sigma`, `\frac`, `\mid`). This breaks `remark-math`'s block-math (`$$...$$`) detection, which relies on real blank lines to delimit display-math blocks from surrounding prose.

**Files to inspect:**
- `data/models/ml/logistic-regression.json`, `data/models/ml/svm.json` — the two confirmed-affected files
- **All other files under `data/models/**`** — grep for the literal two-character sequence `\n` (not JSON's `\n` escape, the actual double-backslash-n-as-text pattern) across every string field, not just `mathematicalintuition`, since the same authoring/generation process may have produced the same artifact elsewhere (e.g. `learningmechanism`, `tradeoffs`, `hyperparameters[].purpose`)
- `components/shared/Prose.tsx` (where a defensive normalization fallback would live)
- `lib/schemas/model.ts` (read-only — confirm field types are `string`, not `string[]`, to understand exactly what "a newline inside a single string" means for this schema)

**Implementation strategy — two independent, complementary parts:**

*Part A — data correction (requires Zahed's sign-off, since `data/models/**` is frozen):*
1. Write a one-off Node/TS script (not part of the app runtime — a throwaway script under `scripts/`, following the existing pattern of `scripts/validate-content.ts`) that scans every string value in every `data/models/**/*.json` file for the literal pattern `\n` used as a line-break substitute (distinguish this from legitimate content that might contain a literal backslash-n for some other reason, if any — inspect matches manually before batch-replacing).
2. For each confirmed case, replace the literal `\n` text with an actual newline character in the JSON string value (i.e., fix the JSON source so it uses a single `\n` escape, which decodes to a real newline, instead of `\\n`, which decodes to the two-character text).
3. Do NOT touch any correctly-escaped LaTeX commands (`\\top`, `\\sigma`, `\\frac`, `\\mid`, etc.) — these are already correct and must be left exactly as-is; only the specific `\\n`-used-as-linebreak pattern is wrong.
4. Present the diff to Zahed for explicit approval before committing, per the Freeze Guardian policy — this prompt should stop short of auto-committing a change to frozen data without that confirmation step.

*Part B — defensive normalization in the rendering pipeline (ships regardless of Part A, as a safety net for any future content authored the same way):*
1. In `Prose.tsx` and `ProseInline`, before passing `content` to `ReactMarkdown`, run a normalization pass that converts any literal backslash-n text sequence that is *not* part of a recognized LaTeX command (i.e., not preceded by another backslash forming a valid command, and not inside a word) into a real newline. Implement narrowly — e.g., specifically collapse `\\n\\n` (literal) sequences into paragraph breaks and lone literal `\n` into single line breaks — rather than a broad regex that risks mangling legitimate LaTeX.
2. Add a unit test (or a small validation script addition to `scripts/validate-content.ts`) that fails CI/validate if any `data/models/**` content field is found to contain the literal double-escaped pattern going forward, catching this class of authoring bug before it reaches the rendering layer again.

**Performance constraints:**
- The normalization pass in `Prose.tsx` must be a simple string transform (regex or split/join), not a new parsing dependency — this should add negligible overhead.

**Acceptance criteria:**
- `logistic-regression.json`'s Mathematical Intuition section renders both display-math blocks (`p(y=1|x)=\sigma(w^\top x+b)=...` and the logit transform) as properly typeset, complete equations — no visible literal `$$`, `\n`, or fragment truncation.
- `svm.json`'s equivalent section renders correctly, same standard.
- Re-running the grep-for-double-escaping check across all of `data/models/**` after Part A returns zero matches.
- The defensive normalization in `Prose` does not alter the rendering of any field that does NOT contain the bug (e.g. `random-forest.json`'s plain-ASCII complexity field must render identically before/after).

**Regression checklist:**
- [ ] `npm run validate` passes (extend it per Part B, step 2, if adopted).
- [ ] `tsc --noEmit`, `npm run lint`, `npm run build` pass.
- [ ] Manually diff all 4 existing models' Mathematical Intuition / Time Complexity output before and after — confirm no unintended change to models that weren't affected by the bug.
- [ ] Confirm the fix doesn't break legitimate multi-paragraph plain-text content that has nothing to do with math (e.g. `intuition`, `learningmechanism` fields with normal prose paragraphs).

---

## 10. Windsurf Prompt #3 — Scope KaTeX Typography and Fix the Core Understanding Teaser

**Objective:** Stop KaTeX's default 1.21em/serif styling from making math visually "larger" than surrounding prose, and replace the Core Understanding section's teaser with a computed summary consistent with every other section, routed through safe rendering.

**Root cause:**
- `node_modules/katex/dist/katex.min.css` ships an unscoped `.katex { font: normal 1.21em KaTeX_Main, Times New Roman, serif; }` rule, imported globally in `app/layout.tsx` with no override — every rendered math span is 21% larger and serif-styled relative to its Tailwind-styled container, regardless of context.
- `components/shared/ModelCollapsibleSections.tsx`'s `coreTeaser = \`${model.coreunderstanding.complexity} · ${model.coreunderstanding.robustness}\`` surfaces two raw content fields verbatim (inconsistent with every other section's computed-count teaser pattern) and bypasses `Prose`/`ProseInline` entirely, so any LaTeX in `complexity` (present for `svm`/`logistic-regression`) renders as literal unrendered text in a header that's visible even while the section is collapsed.

**Files to inspect:**
- `app/globals.css` (where to add a scoped KaTeX override)
- `app/layout.tsx` (confirm KaTeX CSS import location/order)
- `components/shared/ModelCollapsibleSections.tsx` (the `coreTeaser` line and its render, plus every other section's teaser for the pattern to match)
- `components/shared/CollapsibleSection`'s inline definition inside `ModelCollapsibleSections.tsx` (the `teaser` rendering — confirm it's a plain `<span>{teaser}</span>` with no markdown handling)

**Implementation strategy:**
1. Add a scoped override in `app/globals.css` (after the `katex/dist/katex.min.css` import takes effect, so it wins the cascade) that resets `.katex` to inherit size and family from context rather than hardcoding KaTeX's own defaults, e.g. targeting `.katex { font-size: 1em; }` at minimum, and reconsider whether the serif `KaTeX_Main` family should be kept only for the math glyphs that require it (the special math symbols/operators do need KaTeX's own fonts to render correctly — do not disable `font-family` for glyph-bearing elements, only normalize the outer `.katex` wrapper's relative sizing) — test rendering carefully since KaTeX's internal sizing math (superscripts, fractions, radicals) is relative to this base and can break visually if overridden carelessly; verify against both `svm.json`'s display equations and `logistic-regression.json`'s inline math after the change.
2. Replace `coreTeaser`'s definition with a computed summary matching the other sections' pattern — e.g. a short derived label like counting how many "at a glance" specs are notable, or reusing one non-LaTeX-bearing field (`overfittingtendency` or `biasvariance`, whichever reads better as a short phrase) rather than concatenating `complexity` (a known LaTeX-bearing field) with `robustness`. Confirm the chosen field(s) don't carry LaTeX for any current model before finalizing the choice, or route the teaser through `ProseInline` if any candidate field might.
3. Regardless of which field(s) are chosen, wrap the teaser's render inside `CollapsibleSection` with `ProseInline` instead of a raw `<span>{teaser}</span>`, so this class of bug (raw LaTeX/markdown surfacing in a header) cannot recur even if a future teaser choice includes math-bearing content.

**Performance constraints:** None beyond the existing CSS/markdown rendering already in place — this is a styling and content-selection fix, not a new dependency.

**Acceptance criteria:**
- Inline math within any `ProseInline`-rendered text (e.g. the Time Complexity spec-grid value for `svm`/`logistic-regression`) visually matches the surrounding text's size and does not switch to a serif face mid-sentence, while still rendering all math glyphs/operators correctly (fractions, superscripts, etc. must still look like proper math, not a lost-formatting regression in the other direction).
- Core Understanding's collapsed-state teaser reads as a short, count/summary-style phrase consistent with Engineering Considerations/Hyperparameters/Comparisons' existing teasers, contains no raw `$`/`\` characters for any of the 4 existing models, and does not duplicate content verbatim from the expanded specs grid.
- The teaser is rendered through `ProseInline` (or confirmed markdown-free by construction) so it cannot regress into showing raw LaTeX again if the underlying field changes in the future.

**Regression checklist:**
- [ ] `tsc --noEmit`, `npm run lint`, `npm run build` pass.
- [ ] Visual check of all math-bearing sections (Mathematical Intuition, Time Complexity) in both light and dark mode, confirming consistent sizing/family relative to body text.
- [ ] Confirm KaTeX's own internal relative-sizing (superscripts, fraction bars, radicals) still renders correctly after any `font-size` override — this is the highest-risk step in this prompt and needs an explicit visual pass, not just a compile check.
- [ ] Confirm Core Understanding's teaser displays correctly, collapsed, for all 4 existing models with no literal LaTeX visible.

---

## 11. Final Implementation Order

1. **Prompt #2 (double-escaped newlines)** — do this first. It's the most consequential content-correctness bug (math genuinely doesn't render as authored), it's independent of the other two prompts, and Part A requires a round-trip with Zahed for sign-off on touching frozen data — starting that conversation early avoids it becoming the blocker for everything else.
2. **Prompt #1 (Shiki to build-time + collapse fix)** — do this second; it's the highest-impact fix for the reported performance regression and is fully self-contained within `CodeBlock.tsx`, with no dependency on Prompt #2 or #3's outcomes.
3. **Prompt #3 (KaTeX scoping + teaser fix)** — do this last; it benefits from Prompt #2 already being resolved (so the visual check of math sizing is being done against correctly-rendered equations, not still-broken ones), and the teaser fix is the smallest, most isolated change of the three.

After each step: run `npm run validate`, `tsc --noEmit`, `npm run lint`, and `npm run build`, per the existing gated workflow — and for Prompt #2 specifically, do not proceed to commit Part A's data changes without Zahed's explicit confirmation, since it touches files outside this page's normal change surface.
