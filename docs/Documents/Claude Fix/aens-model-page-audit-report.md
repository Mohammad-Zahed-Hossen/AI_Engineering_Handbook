# AENS Model Detail Page — UI/UX Audit & Windsurf Prompt Package

**Scope:** `app/models/[category]/[id]/page.tsx` and its rendering dependencies
**Branch inspected:** `feature/repository-foundation-v2` @ `c911bb3`
**Method:** Direct codebase inspection (cloned repo, read source + `data/models/**` content), not assumption-based.

---

## 1. Executive Summary

The Model Detail Page's architecture (decision strip, 2×2 decision board, collapsible sections, specs sheet) is sound and does not need to change. The problems reported are **not scattered cosmetic bugs** — they trace back to **one structural gap**: the project has **no markdown or math-rendering pipeline at all**. There is no `remark`, `rehype`, `katex`, or any markdown library anywhere in `package.json` or the codebase. Every long-form content field (`description`, `coreunderstanding.mathematicalintuition`, `coreunderstanding.complexity`, `coreunderstanding.learningmechanism`, hyperparameter prose, engineering-consideration prose, comparison text) is written into the JSON with **markdown/LaTeX syntax already embedded** (`` `code` ``, `$x$`, `$$...$$`, `\frac`, `\top`), but is rendered with plain `{value}` JSX interpolation. The browser has no choice but to print the literal characters.

This single gap explains issues #1 (math), #2 (interpretability/markdown), #3 (time complexity), and #8 (inline code) simultaneously — they are one root cause wearing four names. A second, independent gap — the total absence of a syntax highlighter — explains the Quick Start code block's flat, unstyled appearance. A third, independent gap — no relative-time formatting — explains the raw ISO timestamp in the "Updated" badge.

None of this requires an architecture change. It requires adding a rendering layer underneath content that already assumes one exists.

---

## 2. Current Architecture Overview (confirmed by inspection)

- **Framework:** Next.js 16.2.9, static export, React 19.2.4, Tailwind v4 (CSS-first `@theme`, no `tailwind.config.js`).
- **Data flow:** `lib/data.ts` → `getModel()` reads frozen JSON under `data/models/{category}/{id}.json`, validated against `lib/schemas/model.ts` (Zod). Page is a Server Component; all interactivity (`CodeBlock`, `ModelCollapsibleSections`, `TableOfContents`, `StickyActionBar`) is pushed into `'use client'` leaf components. This is a good separation and should be preserved.
- **Page structure (`app/models/[category]/[id]/page.tsx`, 256 lines):**
  1. Header: name, `MetadataBadges`, `ModelDecisionStrip`, architecture-overview box, decision summary.
  2. Decision Board (2×2 grid: best-use, avoid-when, strengths, limitations) — inline in `page.tsx`.
  3. Quick Start (conditional) — inline in `page.tsx`, uses `CodeBlock`.
  4. `ModelCollapsibleSections` — Core Understanding, Engineering Considerations, Hyperparameters, Comparisons, Related Knowledge.
  5. `RelatedContent`, `LearningResources`, `OfficialResources`.
- **Styling:** No `@tailwindcss/typography` plugin. No `.prose` class. A custom `.content-prose { max-width: 72ch }` utility exists in `app/globals.css` but is applied to only **one** paragraph on the entire page (the decision-summary line, `page.tsx:90`). Every other prose paragraph across `ModelCollapsibleSections.tsx` has no width constraint.
- **Fonts:** `next/font/google` already loads `Inter` (`--font-sans`) and `Geist_Mono` (`--font-geist-mono`, mapped to Tailwind's `font-mono`). `Geist` (sans) is also loaded but unused. The font-pairing question in Phase 3 is largely already answered by existing setup — the fix here is cleanup, not a new font decision.
- **TOC / scroll-spy:** `TableOfContents.tsx` uses a correctly-configured `IntersectionObserver` (`rootMargin: '-88px 0px -65% 0px'`). This works. It only renders `xl:` and above (≥1280px), which is a coverage gap, not a bug.

---

## 3. Rendering Pipeline Analysis

There is no rendering pipeline. Content fields are treated as opaque display strings:

| Field | Contains | Rendered as | File / line |
|---|---|---|---|
| `coreunderstanding.mathematicalintuition` (svm, logistic-regression) | Raw LaTeX: `$$\min_{w,b,\xi}...$$`, `\lVert w\rVert^2`, `w^\top x_i` | `<p className="font-mono ... whitespace-pre-line">{value}</p>` | `ModelCollapsibleSections.tsx:201-203` |
| `coreunderstanding.complexity` (svm, logistic-regression) | Inline LaTeX: `$n$`, `$O(Tnp)$` | `<span>{value}</span>` in specs grid | `ModelCollapsibleSections.tsx:170` |
| Hyperparameter `purpose`/`tradeoffs`/etc. (logistic-regression) | Markdown inline code: `` `lbfgs` ``, `` `C` ``, `` `max_iter` `` | `<p>{value}</p>` — literal backticks printed | `ModelCollapsibleSections.tsx:394,402,411,419` |
| `description`, `decisionsummary.summary` | Plain prose (some models may embed inline code/math per schema) | `<p>{value}</p>` | `page.tsx:88,91` |
| `quickstart.code` | Real source code | `<pre><code>{code}</code></pre>`, no tokenizer | `CodeBlock.tsx:72-91` |

This is confirmed against actual content: `random-forest.json` happens to use plain-ASCII notation (`O(T · S · d · log n)`) so it displays acceptably, while `svm.json` and `logistic-regression.json` use real LaTeX and display broken (`$$`, `\frac`, `\top` visible as literal text). This inconsistency across model files is itself evidence that content authors were writing for a renderer that doesn't exist yet — the schema and content are ahead of the implementation, not the other way around.

**Why this matters for the fix:** because the gap is a missing layer, not a design flaw, all of the sections named in Phase 3 (#1, #2, #3, #8) resolve with a *single* shared rendering primitive — a small `Prose` component wrapping `react-markdown` + `remark-math` + `rehype-katex` (or an equivalent lightweight KaTeX-only inline parser, see Prompt 1) — applied everywhere a content-authored string is currently interpolated raw.

---

## 4. Root Cause Analysis — Known Issues

**1. Mathematical Intuition renders as plain `$$...$$`**
Root cause: no math renderer exists. Content already contains real LaTeX. Confirmed in `svm.json` / `logistic-regression.json`. Not a KaTeX *misconfiguration* — KaTeX (or any math lib) is simply not installed.

**2. Interpretability & Explainability "broken formatting/markdown/math"**
There is currently no dedicated long-form "Interpretability & Explainability" prose section on the page — `interpretability` today is only a short enum value (`High`/`Medium`/`Low`) shown as a chip in `ModelDecisionStrip`. The formatting complaint maps onto the same underlying gap as #1/#3: any prose field that *does* carry markdown/math (engineering considerations, hyperparameter prose) breaks identically. Recommendation: fix the shared rendering primitive (Prompt 1/2) and it resolves this class of issue wherever such content appears now or is added later, rather than special-casing one field name.

**3. Time Complexity inline math renders incorrectly**
Root cause identical to #1: `coreunderstanding.complexity` contains `$O(Tnp)$`-style LaTeX in 2 of 4 sampled model files, displayed via raw `<span>{value}</span>`. Confirmed in `logistic-regression.json` and `svm.json`.

**4. Quick Start code block too large / needs progressive disclosure**
Root cause: `CodeBlock.tsx` has no height cap, no collapse state, and no syntax highlighting — it's a static `<pre>` that renders every line at full size (`CodeBlock.tsx:68-92`). For short snippets this is fine; for longer ones (multi-step training + eval scripts) it front-loads scroll length exactly as Zahed suspected. There's also no syntax highlighting at all (no Prism/Shiki/highlight.js in `package.json`), so even before addressing length, the block is visually flat compared to Stripe/Vercel-grade docs.

**5. Core Understanding expanded by default**
Confirmed: `ModelCollapsibleSections.tsx:109`, `coreOpen` initializes to `true` while every other section initializes `false`. This is a deliberate-looking choice (it's arguably the single most decision-relevant section), but it does front-load the page: Core Understanding is also the *longest* section (specs grid + intuition + mechanism + assumptions + math block), so opening it by default maximizes rather than minimizes initial page length — working against the "collapsible-section defaults to reduce front-loaded length" goal already agreed for this page.

**6. "Updated" badge shows raw ISO timestamp**
Confirmed: `MetadataBadges.tsx:41-45` renders `Updated {updatedAt}` verbatim. Actual data: `"2026-07-10T01:46:00+06:00"` → badge literally reads `Updated 2026-07-10T01:46:00+06:00`. No relative-time formatting, no distinction between "last edited" and "last verified" (the schema separately has `lastverified` / `reviewfrequency` / `verifiedagainst` fields per `svm.json` keys — richer metadata already exists in data but isn't surfaced at all).

**7. Description typography**
Confirmed: `page.tsx:88` description text has no width constraint and sits inside a `bg-muted/30` box at `text-xs` (12px) — smaller than the decision-summary line below it (`text-base md:text-lg`) despite being the primary framing sentence for the whole page. Only one paragraph on the page (`decisionsummary.summary`) carries `.content-prose` (72ch cap); every other paragraph in `ModelCollapsibleSections.tsx` (the majority of the page's prose) has no max-width, so line length scales with viewport and can exceed 100+ characters on wide desktop monitors.

**8. Inline code styling**
Root cause confirmed identical to #1/#3: content strings like `` `lbfgs` `` are markdown source, not HTML — with no markdown parser, the backticks print as literal characters, they never become a `<code>` element at all. Separately, `globals.css:143` styles bare `code` elements with only `font-mono text-[0.9em]` — no background, padding, or border-radius — so even markdown-parsed inline code would still look under-designed today.

**9. Editor/OS fonts (Consolas / Segoe UI) vs. web app fonts**
Already substantially resolved: `app/layout.tsx` loads `Inter` as `--font-sans` and `Geist_Mono` as the mono stack (mapped in `globals.css:9` `--font-mono: var(--font-geist-mono)`). This is a solid, modern pairing already in line with Vercel/Linear-style products. The only real issue is that `Geist` (proportional) is imported but never wired into `--theme` (dead import), and Quick Start's code (`CodeBlock.tsx`) doesn't explicitly opt into `font-mono`, relying on the parent's `font-mono` class from a container div rather than being self-contained — low-risk cleanup, not a redesign.

---

## 5. Additional Issues Found (not in the original list)

- **No syntax highlighting anywhere** — `CodeBlock.tsx` has zero tokenization. Any "premium docs" bar (Stripe/Vercel/Raycast) implies at least basic language-aware coloring.
- **TOC breakpoint gap** — `TableOfContents.tsx:48` (`hidden xl:block`) means the on-page TOC disappears below 1280px, a common laptop width. `StickyActionBar` presumably covers mobile, but the 1024–1279px range has neither.
- **No max-width on the main content column** — `ContentPageLayout.tsx` gives the content `flex-1 min-w-0` with no cap; on ultra-wide monitors, cards/grids inside the page (decision board, specs grid) can stretch uncomfortably wide even though individual paragraphs are capped where `.content-prose` is applied.
- **`transition-none` on Copy buttons** (`CodeBlock.tsx:47,105`) — the copy-state color change (gray → green) snaps instantly instead of transitioning, which reads as a rendering glitch rather than a deliberate state change.
- **Dead font import** — `Geist` sans is loaded in `layout.tsx` but never referenced in `globals.css`'s `@theme` block; only `Geist_Mono` and `Inter` are actually wired up. Unused font weight = wasted bytes on every page load.
- **`lastverified` / `verifiedagainst` / `reviewfrequency` schema fields are collected but never rendered anywhere** on the page — directly relevant to fixing the "Updated" badge (#6) with real substance instead of guesswork.
- **Hyperparameter section has no anchor-per-parameter** — individual hyperparameters (e.g. `C`, `max_iter`) aren't independently linkable, so TOC/deep-linking can only get you to the section, not the specific parameter someone was told to look up.

---

## 6. UI/UX Recommendations (summary — detail in Windsurf prompts below)

1. Introduce one shared `Prose`/`RichText` rendering primitive (markdown + inline/display math) and route every long-form content field through it. Single change, resolves 4 of 9 reported issues.
2. Add lightweight syntax highlighting to `CodeBlock` and make it collapse past a line-count threshold with a sticky expand affordance.
3. Default Core Understanding to **collapsed**, matching every other section, with a teaser (matching the pattern already used for Engineering/Hyperparameters/Comparisons).
4. Replace the raw-ISO "Updated" badge with a relative-time chip, and surface `lastverified` as a second, distinct badge — this uses data that already exists but is currently dropped on the floor.
5. Apply `.content-prose` (or the shared `Prose` component's own max-width) consistently to every paragraph, not just one.
6. Style bare inline `<code>` (padding, background, radius) as a fallback even where markdown isn't in play yet.
7. Remove the dead `Geist` sans import; keep Inter + Geist Mono as the pairing (no change needed there beyond cleanup).

---

## 7. Priority Matrix

| # | Issue | Impact | Effort | Risk | Priority |
|---|---|---|---|---|---|
| 1 | Math/markdown rendering pipeline missing | Critical — content is unreadable as authored | Medium (1 new dependency + wrapper component) | Low (additive, read-only rendering) | **Critical** |
| 2 | Inline code (`` `x` ``) prints literally | High (same root cause as #1) | Included in #1 | Low | **Critical** |
| 3 | Quick Start: no syntax highlighting + no collapse | High-impact, low-cost | Low–Medium | Low | **High** |
| 4 | "Updated" badge shows raw ISO string | High-impact, trivial cost | Low | Low | **High** |
| 5 | Paragraph width inconsistent (only 1 of many paragraphs capped) | Medium-high (readability) | Low | Low | **High** |
| 6 | Core Understanding expanded by default | Medium (front-loads longest section) | Low (one line change) | Low | **Medium** |
| 7 | Bare `<code>` element has no visual styling | Medium | Low | Low | **Medium** |
| 8 | Dead `Geist` font import | Low (bytes only) | Low | None | **Medium** |
| 9 | TOC hidden below 1280px | Low-medium | Low | Low | **Future** |
| 10 | No per-hyperparameter anchors | Low | Medium | Low | **Future** |
| 11 | Copy-button `transition-none` snap | Low | Trivial | None | **Future** |

---

## 8. Risk Assessment

- **Schema/data risk: none.** All fixes are presentation-layer only. No file under `data/models/**`, `lib/schemas/model.ts`, or `types/model.ts` needs to change (Freeze Guardian constraints fully respected).
- **New dependency risk: low.** Adding a markdown+math renderer is the only new dependency surface. Recommend `react-markdown` + `remark-math` + `rehype-katex` + `katex` (all widely used, static-export compatible, no server runtime requirement) OR a narrower hand-rolled inline-KaTeX-only parser if minimizing bundle size matters more than full markdown support — this decision is scoped explicitly in Prompt 1 so Windsurf doesn't have to guess.
- **Static export risk: low but must be checked.** KaTeX needs its CSS bundled at build time (import `katex/dist/katex.min.css` in `layout.tsx` or the new `Prose` component) — this works fine with Next static export but must be verified with `npm run build` since it's an SSG output, not SSR.
- **Regression risk on collapse-default change (#5 in Root Cause list):** flipping Core Understanding to closed-by-default changes the page's default scroll position and could affect any existing scroll-restoration or deep-link-to-`#core-understanding` behavior — `ScrollRestore.tsx` should be checked, not assumed safe.

---

## 9. Windsurf Prompt #1 — Shared Prose/Math Rendering Primitive

**Objective:** Create one shared rendering component that turns markdown + inline/display LaTeX content strings into properly rendered HTML, and route every long-form content field on the Model Detail Page through it, without touching schema, data, or routing.

**Root cause being fixed:** No markdown/math rendering library exists anywhere in the codebase (`package.json` has zero remark/rehype/katex/markdown packages). Content fields (`coreunderstanding.mathematicalintuition`, `coreunderstanding.complexity`, `coreunderstanding.learningmechanism`, hyperparameter `purpose`/`tradeoffs`/`increaseeffect`/`decreaseeffect`/`interactions`/`commonmistakes`, `engineeringconsiderations.*`, `comparisons.*`, `description`, `decisionsummary.summary`) already contain markdown syntax (`` `code` ``) and, in at least `data/models/ml/svm.json` and `data/models/ml/logistic-regression.json`, real LaTeX (`$$...$$`, `\frac`, `\top`, `\lVert`, inline `$x$`). These are printed as raw JSX text today.

**Exact files to inspect before writing code:**
- `package.json` (confirm no existing markdown/katex deps to avoid duplicate installs)
- `components/shared/ModelCollapsibleSections.tsx` (lines ~176–204, 226–326, 390–450 — every `<p>{...}</p>` wrapping a model content field)
- `app/models/[category]/[id]/page.tsx` (lines 88, 91, 212–213, 220–226, 234)
- `components/shared/ModelDecisionStrip.tsx` and `components/shared/OfficialResources.tsx` / `LearningResources.tsx` (check if any of their string props also carry markdown — inspect, don't assume)
- `app/globals.css` (existing `.content-prose` utility, `code` element base styles)
- `app/layout.tsx` (where to import KaTeX CSS once, globally)

**Implementation plan:**
1. Add dependencies: `react-markdown`, `remark-gfm`, `remark-math`, `rehype-katex`, `katex`. Confirm all are pure client/build-time libraries with no Node-native bindings that would break `next build` static export — verify via `npm run build` after install, not just `npm install`.
2. Create `components/shared/Prose.tsx`: a client or server component (prefer server component if `react-markdown` v9+ supports RSC; otherwise mark `'use client'`) accepting `{ content: string; className?: string }`. Internally: `<ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{content}</ReactMarkdown>`. Wrap output in a `div` with `.content-prose` applied (max-width 72ch) plus base typographic classes (`text-xs`/`text-sm` matching each call-site's current size — do not change font sizes as part of this prompt, only replace the rendering method).
3. Import `katex/dist/katex.min.css` once in `app/layout.tsx` (top-level, alongside existing `./globals.css` import).
4. Replace every raw `{model.something}` string interpolation identified in the file list above with `<Prose content={model.something} className="..." />`, preserving each call site's existing wrapper element's classes as the `className` passed through (do not restructure surrounding layout/grid markup — only swap the inner text node).
5. For array fields rendered as `<li>{item}</li>` (assumptions, common limitations, comparisons, hyperparameter interactions/mistakes), wrap each `item` individually in `<Prose content={item} className="inline" />` or an inline-safe variant so markdown-formatted list items (e.g., containing inline code) still render correctly without introducing block-level wrapping inside `<li>`.
6. Add a Tailwind/CSS rule for the KaTeX display-math container so it doesn't overflow the 72ch column on mobile (`overflow-x-auto` on `.katex-display`).

**Constraints:**
- Do NOT modify `data/models/**`, `lib/schemas/model.ts`, or `types/model.ts` — content strings stay exactly as authored.
- Do NOT change any section's layout, grid structure, spacing, or ordering — this prompt only changes how text nodes are rendered, not where they sit.
- Do NOT introduce a markdown renderer that strips or escapes characters differently from what's already displaying correctly today for plain-ASCII content (e.g., `random-forest.json`'s non-LaTeX complexity string must render identically before/after).
- Keep bundle impact in mind: `katex` fonts/CSS should be imported once globally, not per-component.

**Edge cases:**
- Content fields that are plain prose with no markdown/math syntax at all (majority of fields, e.g. most `intuition`/`learningmechanism` strings) must render unchanged — verify no unwanted markdown auto-formatting kicks in (e.g., a stray `_` in prose shouldn't become italics if it wasn't intended as emphasis — spot-check against real data, particularly any field containing underscores like `min_samples_leaf` inside prose, not just inside backticks).
- Fields containing literal `$` (currency) with no LaTeX intent could be mis-parsed as math delimiters by `remark-math` — grep all `data/models/**` content fields for standalone `$` before shipping to confirm none exist; if any do, they need proper escaping (`\$`) in the data (flag to Zahed rather than silently reinterpreting, since data files are frozen).
- Multi-line prose using literal `\n\n` (as seen in `svm.json`'s `mathematicalintuition`) must produce proper paragraph breaks — confirm `remark` treats the escaped `\n\n` in the JSON string as actual newlines once JSON-parsed (it will, since JSON `\n` deserializes to a real newline character).

**Acceptance criteria:**
- `svm.json`'s Mathematical Intuition section renders the primal objective, constraint, and hinge-loss as properly typeset display equations (fractions, norms, subscripts, superscripts all visually correct), not literal `$$` text.
- `logistic-regression.json` and `svm.json`'s Time Complexity values render inline math (`$O(Tnp)$` → styled `O(Tnp)` with math typography) instead of visible dollar signs.
- Hyperparameter prose containing `` `lbfgs` ``, `` `C` ``, `` `max_iter` `` etc. renders as styled inline `<code>` elements, not literal backticks.
- `random-forest.json` (a model with plain-ASCII content, no LaTeX) renders identically to its pre-change appearance — this is the regression check that proves the change is additive.
- `npm run build` completes with zero errors on static export.

**Regression checklist:**
- [ ] `npm run validate`, `tsc --noEmit`, `npm run lint`, `npm run build` all pass.
- [ ] Visually diff all 4 currently-existing ml models (`linear-regression`, `logistic-regression`, `svm`, `random-forest`) before/after — confirm no field silently drops content or double-escapes characters.
- [ ] Confirm dark mode: KaTeX's default output is colorless (inherits `currentColor`) — verify math renders legibly in both light and dark themes, not just light.
- [ ] Confirm mobile viewport (375px): display-math blocks don't cause horizontal page overflow.
- [ ] Confirm TOC/scroll-spy still works — `Prose`'s wrapper divs must not introduce new heading elements that confuse `TableOfContents.tsx`'s `IntersectionObserver`, and must not change the position/`id` of existing `<section id="...">` anchors.

---

## 10. Windsurf Prompt #2 — Quick Start: Syntax Highlighting + Progressive Disclosure

**Objective:** Improve the Quick Start code block's readability (real syntax highlighting) and reduce front-loaded scroll length on long snippets (collapse/expand), without changing `CodeBlock`'s public API in a way that breaks its one existing call site.

**Root cause:** `components/shared/CodeBlock.tsx` renders `<pre><code>{code}</code></pre>` with zero tokenization (no Prism/Shiki/highlight.js in `package.json`) and no height/line cap — every line renders at full size regardless of snippet length (lines 68–92).

**Exact files to inspect:**
- `components/shared/CodeBlock.tsx` (full file, 127 lines)
- `app/models/[category]/[id]/page.tsx` lines 195–239 (the only current call site, confirm prop usage: `code`, `language` only — `filename`/`showLineNumbers` are unused today)
- `package.json` (confirm no highlighter installed; check for `shiki` vs `prismjs` — prefer `shiki` for accuracy but check bundle-size implications for static export, since `shiki` can be heavier; a lighter option is `react-syntax-highlighter` with `prism` — decide based on the language set actually used in `data/models/**` `quickstart.language`, currently Python-only across sampled files)

**Implementation plan:**
1. Add a syntax highlighter (recommend `shiki` if static-export bundle size is acceptable and languages are known ahead of time — since AENS content is statically generated, `shiki`'s highlighting can even run at build time rather than shipping the highlighter to the client, which is the best option for a static-export Next.js app; use `shiki`'s `codeToHtml` inside the Server Component that renders `CodeBlock`'s parent, or wrap `CodeBlock` itself as an async Server Component that pre-renders highlighted HTML and passes it down).
2. Preserve the existing header (filename/language badge + copy button) and footer (mobile copy button) exactly as-is — only replace the code body's rendering.
3. Add a `maxCollapsedLines` behavior: if `lines.length > 20` (confirm threshold with Zahed if a different number is preferred — 20 is a reasonable default matching common docs-site conventions), render only the first 20 lines with a fade-out gradient and a centered "Show N more lines" button below the block; clicking expands to full height with smooth `max-height` transition (avoid instant snap, matching the existing `transition-none` issue noted in the audit — use a real transition here, unlike the copy button today).
4. Keep `showLineNumbers` prop functional as it exists today (table-based line numbers) — this feature is currently unused but implemented; don't remove it, just make sure it interacts correctly with the new collapse behavior (line numbers should collapse/expand in sync with code).

**Constraints:**
- Do not change `quickstart` schema or the `CodeBlock` component's prop names (`code`, `language`, `filename`, `showLineNumbers`) — only its internal rendering and the new optional collapse behavior (make collapse a sensible internal default, not a new required prop, so the existing call site in `page.tsx` doesn't need to change).
- Do not remove the copy-to-clipboard functionality or its mobile/desktop variants.

**Edge cases:**
- Snippets under the line threshold (most current data — verify actual `quickstart.code` line counts across `data/models/ml/*.json` before assuming this is even needed for existing content; if all 4 current models are short, this becomes a forward-looking fix for future longer snippets rather than a current visual regression fix) must render fully expanded by default with no "show more" button at all.
- Ensure collapsed-state fade gradient works correctly in both light and dark mode (the block itself is always dark — `bg-zinc-950` — so this is simpler than most fade-overlay cases, but confirm against the page's light-mode surrounding background).

**Acceptance criteria:**
- Python code in Quick Start displays with real syntax coloring (keywords, strings, comments visually distinct).
- Any snippet exceeding the line threshold collapses by default with a working, animated expand control; shorter snippets are unaffected.
- Copy button (desktop + mobile) continues to work identically to today.

**Regression checklist:**
- [ ] `npm run build` succeeds; confirm highlighting works in the static-exported output, not just `next dev`.
- [ ] Confirm no `quickstart.code` content from any of the 4 existing model JSON files renders incorrectly (missing lines, mangled indentation) after adding a highlighter — copy/paste each into a test render pass.
- [ ] Confirm `tsc --noEmit` and `npm run lint` pass.

---

## 11. Windsurf Prompt #3 — "Updated" Badge → Relative Time + Verification Metadata

**Objective:** Replace the raw ISO-timestamp badge with a human-readable relative-time badge, and surface the already-collected-but-unused `lastverified` field as a second, distinct badge.

**Root cause:** `components/shared/MetadataBadges.tsx:41-45` renders `Updated {updatedAt}` with the raw ISO string (e.g. `Updated 2026-07-10T01:46:00+06:00`) with zero formatting. Separately, `lib/schemas/model.ts` / the model JSON files already carry `lastverified`, `reviewfrequency`, and `verifiedagainst` fields (confirmed present in `svm.json`'s key list) that are never rendered anywhere on the page.

**Exact files to inspect:**
- `components/shared/MetadataBadges.tsx` (full file, 65 lines)
- `lib/schemas/model.ts` (confirm exact field names/types for `lastverified`, `reviewfrequency`, `verifiedagainst` — do not guess field casing, the codebase is inconsistent between `snake_case` in some JSON keys — e.g. `updated_at` in the page-level prop — and `camelCase`/lowercase-concatenated in others — e.g. `updatedat` inside the model object; verify exact casing before writing code)
- `app/models/[category]/[id]/page.tsx` line 76 (`updatedAt={model.updated_at}` — confirm this prop mapping)
- `types/model.ts` (confirm `Model` type's exact field names, read-only reference, do not modify)

**Implementation plan:**
1. Add a small, dependency-free relative-time formatter (a `formatRelativeTime(date: string): string` helper in `lib/utils.ts` or a new `lib/format-date.ts`) that returns strings like "Updated 2 days ago", "Updated today", "Updated 3 months ago" — no new dependency needed for this (native `Intl.RelativeTimeFormat` handles it).
2. Update `MetadataBadges.tsx` to pass `updatedAt` through this formatter for display, while keeping the exact ISO string available via a `title` attribute (tooltip) for anyone who wants the precise timestamp on hover.
3. Add an optional `lastVerified` prop to `MetadataBadges`, rendered as a second badge only when present, styled distinctly (e.g., a small checkmark icon + "Verified {relative date}") so it reads as a different kind of claim than "Updated" (edited) — these are semantically different (content can be edited without being re-verified against source, or verified without being edited).
4. Wire the new prop from `page.tsx` using the correct field name confirmed in step "exact files to inspect" above.

**Constraints:**
- Do not modify `data/models/**` or `lib/schemas/model.ts` — only add a new optional rendering path for fields that already exist in the frozen schema.
- Do not remove the raw-timestamp information entirely — preserve it as a hover tooltip for power users/debugging.

**Edge cases:**
- Models missing `lastverified` (if any exist, or if the field is optional in the schema) must not render a broken/empty "Verified" badge — the badge should simply not appear, matching the existing conditional pattern already used for `version`/`category` in the same component.
- Timestamps in the future (data authoring artifacts, e.g. content dated after "today" during development) should not produce a nonsensical "Updated in 3 hours" — clamp or handle gracefully (e.g., fall back to the exact date if the relative delta is negative beyond a small tolerance).

**Acceptance criteria:**
- Badge reads "Updated 5 hours ago" (or equivalent, matching real elapsed time) instead of a raw ISO string, for all 4 existing models.
- Hovering the badge shows the exact timestamp.
- If `lastverified` is present in a model's data, a second badge appears showing verification recency.

**Regression checklist:**
- [ ] `tsc --noEmit` passes (new prop is properly optional/typed).
- [ ] `npm run build` succeeds — confirm relative-time calculation is either computed at build time consistently (static export means "now" is frozen at build time, not per-visitor — decide and document whether this is acceptable, since a statically-exported "Updated 2 hours ago" will become stale/wrong for site visitors long after build; this may need to be flagged back to Zahed as a static-export-specific tradeoff rather than silently shipped).
- [ ] `npm run lint` passes.

---

## 12. Windsurf Prompt #4 — Section Defaults, Paragraph Width, and Inline-Code Base Styling

**Objective:** Three small, independent, low-risk polish fixes bundled together since they touch the same files: (a) Core Understanding defaults to collapsed like every other section, (b) `.content-prose` width constraint applied consistently to all body paragraphs, (c) bare `<code>` elements get real visual styling as a baseline (independent of, and complementary to, Prompt #1's markdown-aware code rendering).

**Root causes:**
- (a) `ModelCollapsibleSections.tsx:109` — `useState(true)` for `coreOpen`, inconsistent with every other section's `useState(false)`.
- (b) `.content-prose` (`app/globals.css:154-156`, 72ch max-width) is applied at exactly one call site (`page.tsx:90`) despite dozens of other `<p>` elements in `ModelCollapsibleSections.tsx` carrying body prose.
- (c) `app/globals.css:143-145` styles bare `code` elements with only `font-mono text-[0.9em]` — no background, padding, or border-radius, so any inline code (including content not yet routed through Prompt #1's `Prose` component) looks like plain text.

**Exact files to inspect:**
- `components/shared/ModelCollapsibleSections.tsx` (line 109, and every `<p>`/`<div>` wrapping body text throughout the file)
- `app/globals.css` (lines 108-146 `@layer base`, lines 153-161 `@layer utilities`)
- `app/models/[category]/[id]/page.tsx` line 88 (description box paragraph, also uncapped in width despite being the page's lead sentence)

**Implementation plan:**
1. Change `const [coreOpen, setCoreOpen] = useState(true)` to `useState(false)` (line 109) to match Engineering/Hyperparameters/Comparisons/Knowledge Map. Add a `teaser` prop to the Core Understanding `<CollapsibleSection>` call (currently the only main section without one — every other section has a computed teaser string) summarizing e.g. complexity/robustness at a glance so collapsing it doesn't hide the "at a glance" value the specs grid currently provides when open.
2. Apply a max-width utility (either reuse `.content-prose` or scope a slightly narrower `.section-prose` if 72ch feels too wide inside the already-narrower collapsible cards — check actual rendered card width before deciding) to the following currently-uncapped elements: `page.tsx:88` description paragraph, and every `<p>` in `ModelCollapsibleSections.tsx` carrying `intuition`, `learningmechanism`, `tradeoffs`, `purpose`, `increaseeffect`, `decreaseeffect`, and the engineering-considerations column paragraphs.
3. Add inline `code` styling to `app/globals.css`'s `@layer base` `code` rule: background (`bg-muted` equivalent in raw CSS or a Tailwind `@apply`), horizontal padding (~0.3em), border-radius (~4px), and a slightly muted foreground color distinct from surrounding prose — this should visually match what Prompt #1's `Prose`-rendered inline code will look like, so there's no visual seam between markdown-rendered code and any code element that appears outside the `Prose` component (e.g., in `CodeBlock`'s own header language badge, which is a separate `<span>`, not affected by this rule — verify it isn't accidentally targeted).

**Constraints:**
- Do not modify `data/models/**` or schema files.
- Do not change any section's icon, teaser-computation logic, or ordering beyond the single `coreOpen` default value and its added teaser string.
- The inline-`code` styling change must not visually break `CodeBlock.tsx`'s own internal `<code className="language-...">` usage (that component already sits on a dark background — confirm the new global `code` rule's colors don't clash; scope the new rule to exclude elements inside `CodeBlock`'s `<pre>` if needed, e.g. via a `:not(pre code)` selector).

**Edge cases:**
- Confirm `ScrollRestore.tsx` and any deep-link-to-`#core-understanding` behavior still functions correctly when the section starts collapsed — a user following a link directly to that anchor should land on the (still-visible) section header, not inside now-hidden content; decide whether such direct navigation should auto-expand the section (recommended) and implement if `ScrollRestore.tsx`'s existing pattern supports it, otherwise flag as a follow-up rather than silently leaving a broken deep-link experience.
- Verify the `:not(pre code)` (or equivalent) exclusion doesn't also accidentally exclude legitimate inline code that appears in future `Prose`-rendered content inside cards that happen to use `<pre>` elsewhere for non-code purposes (unlikely today, but check).

**Acceptance criteria:**
- Core Understanding section is collapsed by default on page load, with a visible teaser matching the pattern of other sections.
- All body paragraphs across the page share a consistent, readable max character width — no paragraph stretches uncapped on wide viewports.
- Any inline code that appears outside `Prose` (or before Prompt #1 ships) has visible background/padding/radius instead of blending into surrounding text.

**Regression checklist:**
- [ ] `tsc --noEmit`, `npm run lint`, `npm run build` pass.
- [ ] Manually verify deep link to `#core-understanding` (e.g. from search results or another page's "Related Content" link) still lands correctly.
- [ ] Visual check in both light and dark mode for the new `code` background/padding.
- [ ] Confirm `CodeBlock.tsx`'s dark-themed code display is unaffected by the new global inline-code rule.

---

## 13. Final Recommended Implementation Order

1. **Prompt #1 (Prose/Math rendering)** — do this first; it is the single highest-impact fix and several other prompts (notably #4's inline-code styling) are designed to visually match its output, so sequencing it first avoids redoing styling twice.
2. **Prompt #4 (defaults, width, base code styling)** — small, low-risk, and establishes the typographic baseline the rest of the page should read against.
3. **Prompt #3 (Updated badge)** — fully independent, safe to do in parallel with #2 if using separate sessions, but sequenced third here since it's the smallest, lowest-risk change and a good "quick win" to validate the gate-and-check workflow before tackling #2's highlighter integration.
4. **Prompt #2 (Quick Start highlighting + collapse)** — done last because it's the only prompt introducing a potentially heavier new dependency (syntax highlighter) and benefits from the page's other text rendering already being finalized, so any bundle-size/performance review at the end accounts for the full set of changes together.

After each step: run `npm run validate`, `tsc --noEmit`, `npm run lint`, and `npm run build` locally before proceeding to the next step, per the existing gated workflow. Only after all four prompts pass their individual regression checklists should the Model Detail Page be considered re-frozen.
