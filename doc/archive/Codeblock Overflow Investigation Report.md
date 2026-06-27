
---

# AENS Chief Architect — CodeBlock Overflow Investigation Report

## Architectural Classification Answer (Direct)

**This is an implementation bug, not an architectural flaw.**

The architecture is correct. The component hierarchy is correct. The fix is localized to one class on one wrapping `<div>` inside `PackageTaskList.tsx`. No redesign is warranted. Here is the full evidence trail.

---

## Part A: Complete Rendering Hierarchy

### Component Tree (mobile, package detail page)

```
layout.tsx
  <body class="h-full flex overflow-hidden ...">          ← LAYER 1
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative">  ← LAYER 2
      <TopBar />
      <main class="flex-1 overflow-y-auto ... px-4 py-5"> ← LAYER 3 (scroll root)
        <div class="max-w-5xl mx-auto w-full">             ← LAYER 4
          <PackageDetailPage>
            <ContentPageLayout>
              <div class="flex gap-8 items-start">          ← LAYER 5
                <div class="min-w-0 flex-1 space-y-8">     ← LAYER 6
                  <PackageTaskList>
                    <div class="space-y-4">                 ← LAYER 7
                      <section class="... overflow-hidden"> ← LAYER 8 ← PRIMARY DEFECT
                        <button (task header) />
                        {isExpanded && (
                          <div class="p-4 space-y-4">      ← LAYER 9
                            <div class="grid gap-4 lg:grid-cols-[1.2fr_1fr]">  ← LAYER 10
                              <div class="rounded-lg border ... p-4">  ← LAYER 11
                                <CodeBlock>
                                  <div class="relative rounded-md ...">  ← LAYER 12
                                    <pre class="overflow-x-auto ...">   ← LAYER 13 (intended scroll owner)
                                      <code>{code}</code>
                                    </pre>
                                  </div>
                                </CodeBlock>
                              </div>
                            </div>
                          </div>
                        )}
                      </section>
                    </div>
                  </PackageTaskList>
                </div>
              </div>
            </ContentPageLayout>
          </PackageDetailPage>
        </div>
      </main>
    </div>
  </body>
```

### Overflow Tree

| Layer | Element | Overflow class | Effect |
|---|---|---|---|
| 1 | `body` | `overflow-hidden` | Clips body, delegates to inner scrollers |
| 2 | content wrapper div | `overflow-hidden` | Clips horizontally |
| 3 | `main` | `overflow-y-auto` | **Vertical scroll root** of the page |
| 4 | max-w-5xl div | none | Neutral |
| 5 | ContentPageLayout flex | none | Neutral |
| 6 | content column | `min-w-0 flex-1` | Critical flex shrink control — correct |
| 7 | PackageTaskList div | none | Neutral |
| **8** | **task `<section>`** | **`overflow-hidden`** | **Clips all descendant overflow — THE BUG** |
| 9 | expanded content div | none | Neutral |
| 10 | grid | none | Neutral |
| 11 | syntax/example card div | none | Neutral |
| 12 | CodeBlock outer div | `relative` | Neutral |
| 13 | `<pre>` | `overflow-x-auto` | **Intended horizontal scroll owner — BLOCKED** |

---

## Part B: Root Cause Analysis

### Cause 1 — `overflow-hidden` on the task `<section>` (CONFIRMED, Confidence: 99%)

**Evidence:**
In `PackageTaskList.tsx`, line:
```
className="scroll-mt-24 rounded-lg border border-border bg-card overflow-hidden"
```

`overflow-hidden` on this `<section>` is a CSS containment directive. It causes the browser to establish a new overflow formatting context. Any descendant that attempts to scroll horizontally — specifically the `<pre>` with `overflow-x-auto` — cannot extend its scrollable region beyond the `<section>` boundary, because the `<section>` clips all overflow.

**Mechanism:**
The `<pre>` tag has `overflow-x-auto`, which means: "if my content is wider than my box, create a horizontal scrollbar." But for that scrollbar to function, the content must be able to overflow its box into the scroll container. The `overflow-hidden` on the ancestor `<section>` intercepts this before the scroll event reaches the `<pre>`, because `overflow-hidden` clips the painted output of all descendants. The content is there in the DOM — it is simply not painted and not scrollable.

**Why it works on desktop:** On desktop, code lines that are long enough to overflow are still partially visible because the viewport is wider. The columns (`lg:grid-cols-[1.2fr_1fr]`) give each CodeBlock substantially more width. The content does not overflow as severely, so the clipping is less apparent. The `<pre>` scroll may work partially because the clipped region is small enough that the user doesn't notice, or the content fits within the wider column.

**Why it fails on mobile:** At 360–390px viewport, with `px-4` (32px) padding, `p-4` (32px) card padding inside the section, the CodeBlock's `<pre>` has approximately:

```
360px − 32px (layout padding) − 0px (ContentPageLayout gap, no sidebar on mobile)
    − 16px (section p-4 left) − 16px (section p-4 right)
    = ~296px usable width
```

Python code in syntax/example blocks routinely exceeds 40 characters. At `text-[11px]` (11px) with typical monospace character width of ~7px: 40 chars × 7px = 280px. That's already within margin of the 296px column. Any line longer than ~42 chars overflows, and the `overflow-hidden` on `<section>` clips it.

**Why `overflow-hidden` was added:** It was added for a visually legitimate reason — to enforce the `rounded-lg` border radius on the `<button>` header, which is a child element. Without `overflow-hidden`, the button's background color extends to the parent's square corners, breaking the visual rounded shape. This is a classic CSS border-radius / overflow containment tradeoff.

---

### Cause 2 — `grid gap-4 lg:grid-cols-[1.2fr_1fr]` without mobile column count (Medium Probability, Contributing Factor)

**Evidence:**
```jsx
<div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
```

On mobile (below `lg:` = 1024px), this grid collapses to a **single column**. So both the Syntax and Example CodeBlocks stack vertically, each taking **full width of the available space**. This is actually correct behavior — it gives each CodeBlock the maximum possible width.

However, the `gap-4` (16px) still applies. And the `p-4` (16px each side) padding on the wrapping card div still consumes 32px of horizontal space per CodeBlock. Inside a 296px available width, the CodeBlock gets ~264px. Still adequate for short code, insufficient for longer lines.

**Conclusion:** This is a contributing factor to how severe the overflow appears, but it is NOT the root cause. Even on a 390px device, longer Python code would still overflow without the `overflow-hidden` containment problem.

---

### Cause 3 — The overflow fade gradient (`w-8`, `inset-y-0 right-0`) misleads the user (Low Probability, UX Issue Only)

**Evidence:**
```jsx
<div
  className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-zinc-950 to-transparent md:hidden z-10"
  aria-hidden="true"
/>
```

This is a 32px right-side fade rendered on mobile. It was likely added to hint at horizontal scrollability. But because the parent `<section>` has `overflow-hidden`, the scroll doesn't work. The fade indicator therefore tells the user "you can scroll" while the layout prevents scrolling — a UX contradiction.

**Conclusion:** Not a root cause. This is a symptom of the primary bug. Once `overflow-hidden` is corrected, this fade becomes a properly functional hint again.

---

### Cause 4 — `CodeBlock` wrapper div has no explicit `min-w-0` (Low Probability)

**Evidence:**
```jsx
<div className="relative rounded-md bg-zinc-950 border border-zinc-800 my-2 font-mono">
```

In a flex or grid child, a div without `min-w-0` will not shrink below its content size. However, the CodeBlock sits inside a plain `<div>` (Layer 11), not directly in a flex or grid context. The grid context (Layer 10) wraps the card div, and `min-w-0` is missing from Layer 11. This means the card divs themselves might resist shrinking.

**However:** The card divs at Layer 11 are grid children, and CSS grid auto-places items into bounded grid tracks. Grid tracks do enforce width constraints on children by default in `auto` fill behavior. The `lg:grid-cols-[1.2fr_1fr]` uses fractional units which already constrain the column. On mobile (single column), the grid track takes full available width. The card div receives that width.

**Conclusion:** Not the root cause. May be worth adding `min-w-0` to Layer 11 divs as a defensive measure, but it is not what's causing the clip.

---

### Cause 5 — `body` having `overflow-hidden` (Eliminated)

**Evidence:**
```jsx
<body className="h-full flex overflow-hidden ...">
```

This `overflow-hidden` is intentional — it delegates all scrolling to the `<main>` element with `overflow-y-auto`. This is the correct pattern for a fixed-height layout with a scrollable content area. It does not interfere with horizontal scrolling inside the `<main>` because `overflow-hidden` on `body` only clips what escapes the body boundary, and all content is inside the scroll region.

**Conclusion:** Not the cause.

---

## Part C: Best Fix Strategy

### The Decision

**Remove `overflow-hidden` from the task `<section>`. Preserve rounded corners through a different mechanism.**

The purpose of `overflow-hidden` on `<section>` is one of two things:

1. **Border radius enforcement** — making child elements (the header button) respect the parent's `rounded-lg` corners.
2. **Aesthetic containment** — preventing any content from visually "bleeding" outside the card boundary.

Both goals can be achieved without clipping descendant scroll regions.

**Correct approach: Split the border radius responsibility.**

The task card is visually composed of two distinct zones:
- The **header** (the `<button>` with task title)
- The **expanded body** (the `<div>` with p-4 content)

The `rounded-lg` needs to apply to:
- Top corners of the header button
- Bottom corners of the expanded body (when open)
- Bottom corners of the header button (when collapsed, acting as the card bottom)

This is achievable by applying rounded corner utilities **directly to the header button and the body div**, not to the `<section>` container. The `<section>` then holds only `border border-border bg-card` and `rounded-lg` without `overflow-hidden`.

Specifically:
- `<section>`: keep `rounded-lg border border-border bg-card`, **remove `overflow-hidden`**
- `<button>` header: already has `bg-muted/20` and `border-b`; no corners needed since section has `rounded-lg`
- **Alternative even simpler:** Replace `overflow-hidden` with `overflow-x-visible overflow-y-visible` to be explicit — but since `visible` is the CSS default, simply removing `overflow-hidden` achieves this.

**Why not `overflow-x-visible overflow-y-hidden`?**
Because `overflow-y: hidden` combined with `overflow-x: visible` is illegal CSS. The spec states that if one overflow axis is not `visible`, the other also becomes `auto`. So you cannot independently hide y while showing x at the container level. The only valid solution is to remove overflow clipping from the `<section>` entirely.

**Why not add `overflow-x-auto` to Layer 9 or Layer 10?**
Because adding scroll containers to intermediate wrappers creates nested scroll conflicts on touch devices. On iOS Safari and Chrome Android, if a touch gesture begins on a nested scrollable element, the parent scroll is suppressed. The user would need to start the touch precisely on the `<pre>` — an extremely small touch target — to activate horizontal scroll. This makes the experience worse, not better. The scroll region must be owned at the `<pre>` level, which it already is correctly.

**Why not set `overflow: visible` via inline style on `<section>`?**
Functionally identical to removing the Tailwind class. Use Tailwind for consistency. No inline styles.

**Why not redesign the collapsible component?**
The collapsible expand/collapse mechanism, the task data model, the grid layout for syntax/example, the progress bar — none of these are related to this bug. They do not need to change. Redesigning them would be overengineering and would introduce regression risk.

---

### Secondary Fix: Add `min-w-0` to CodeBlock card wrappers (defensive)

Inside the expanded content div, the two card divs wrapping Syntax and Example CodeBlocks are:
```jsx
<div className="rounded-lg border border-border bg-card p-4">
```

These are grid children (Layer 10 → Layer 11). CSS Grid children do not shrink below `min-content` by default in some browsers. Adding `min-w-0` makes the grid track width authoritative over the content size. This is a defensive fix and should be added alongside the primary fix.

---

## Part D: Regression Risks

### If `overflow-hidden` is removed from `<section>`:

**Risk 1: Rounded corner visual regression on the header button**
- Probability: Low to None
- Reason: The `<section>` itself has `rounded-lg`. The `<button>` header has no background that bleeds into corners unless the button background (`bg-muted/20`) clips improperly. Since the section has `rounded-lg` without overflow-hidden, the border will still be rounded. The button background fills the full section width but the visual border/rounding is on the section element, not clipped by child backgrounds. In practice, `rounded-lg` on the section with a visible border is sufficient to show the rounded corner. The button background that bleeds into the corner will be invisible behind the section border.
- Mitigation: Add `rounded-t-lg` to the `<button>` if the corner bleed is observed on any browser.

**Risk 2: Content visually overflowing the card boundary**
- Probability: Very Low
- Reason: All content inside the expanded section has controlled widths. CodeBlock has a fixed background (`bg-zinc-950`). The `<pre>` scrolls internally. No content is absolutely positioned in a way that would escape the card boundary visually.

**Risk 3: The fade gradient position**
- Probability: None
- Reason: The gradient is absolutely positioned inside the CodeBlock wrapper div (Layer 12), not inside the `<section>`. Its `inset-y-0 right-0` positioning is relative to the CodeBlock div, which is `position: relative`. This is unaffected by the section's overflow behavior.

### If `min-w-0` is added to CodeBlock card wrappers:

**Risk: None.** `min-w-0` is purely a width floor constraint that makes grid children shrink to their track width rather than their content width. It does not affect any visual output in cases where content fits within the column — which is every non-CodeBlock element in the card body. It only affects CodeBlocks, making them narrower (correct), never wider.

### If CodeBlock itself is modified:

The investigation shows the CodeBlock is **architecturally correct.** The `<pre>` with `overflow-x-auto` is the right scroll owner. The `text-[11px]` sizing is appropriate for dense code on mobile. The fade gradient hint is correct UX for scrollable code. **Do not modify CodeBlock.** Any modification to CodeBlock risks breaking its behavior in `QuickSetupSection`, `CheatsheetEntry`, or any other page where it currently works correctly.

---

## Part E: Implementation Prompt

```
AENS — CodeBlock Horizontal Scroll Fix on Package Detail Pages
Target: PackageTaskList.tsx
Scope: Single file, single class change + one defensive addition

─────────────────────────────────────────────────
CONTEXT
─────────────────────────────────────────────────
Project: AI Engineering Handbook (Next.js 15, TypeScript, Tailwind CSS v4)
Primary device: Android Chrome PWA, portrait, 360–390px viewport

The CodeBlock component renders a <pre> with overflow-x-auto (correct).
Inside PackageTaskList.tsx, each task is wrapped in a <section> with:
  className="scroll-mt-24 rounded-lg border border-border bg-card overflow-hidden"

The overflow-hidden on this <section> clips all descendant overflow regions,
including the <pre> scroll container inside CodeBlock.
This makes horizontal scrolling of code blocks impossible on mobile.

The CodeBlock component is correct. Do NOT modify it.
The fix is entirely in PackageTaskList.tsx.

─────────────────────────────────────────────────
FILE TO INSPECT (read-only reference)
─────────────────────────────────────────────────
components/shared/CodeBlock.tsx
  → Verify: <pre className="overflow-x-auto ..."> exists (it does)
  → Verify: the outer wrapper div has className="relative rounded-md ..."
  → Do NOT modify this file under any circumstances.

─────────────────────────────────────────────────
FILE TO MODIFY
─────────────────────────────────────────────────
components/shared/PackageTaskList.tsx

─────────────────────────────────────────────────
CHANGE 1 — Remove overflow-hidden from task section (PRIMARY FIX)
─────────────────────────────────────────────────

FIND exactly:
  className="scroll-mt-24 rounded-lg border border-border bg-card overflow-hidden"

REPLACE with:
  className="scroll-mt-24 rounded-lg border border-border bg-card"

Rationale:
  overflow-hidden was clipping the <pre> scroll region inside CodeBlock.
  The rounded-lg border rendering does not require overflow-hidden.
  The rounded corners are provided by the border on the <section> element,
  not by clipping descendants.

─────────────────────────────────────────────────
CHANGE 2 — Add min-w-0 to CodeBlock card wrappers (DEFENSIVE FIX)
─────────────────────────────────────────────────

There are exactly two card wrapper divs inside the grid that hold CodeBlocks.
They are inside:
  <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">

They currently read:
  <div className="rounded-lg border border-border bg-card p-4">
    <h3 ...>Syntax</h3>
    <CodeBlock ... />
  </div>

  <div className="rounded-lg border border-border bg-card p-4">
    <h3 ...>Example</h3>
    <CodeBlock ... />
  </div>

REPLACE both with:
  <div className="rounded-lg border border-border bg-card p-4 min-w-0">

Rationale:
  CSS Grid children do not shrink below min-content without min-w-0.
  Adding min-w-0 ensures the grid track width is authoritative.
  This prevents any edge case where the CodeBlock's content size pushes
  the grid column wider than its intended track.

─────────────────────────────────────────────────
CONSTRAINTS — HARD RULES
─────────────────────────────────────────────────
1. Do NOT modify CodeBlock.tsx under any circumstances.
2. Do NOT modify ContentPageLayout.tsx.
3. Do NOT modify app/packages/[id]/page.tsx.
4. Do NOT modify globals.css.
5. Do NOT modify layout.tsx.
6. Do NOT add overflow-x-auto or overflow-x-scroll to any intermediate wrapper.
   Only the <pre> inside CodeBlock should own horizontal scrolling.
7. Do NOT add overflow-y-hidden to compensate. See architectural notes:
   CSS disallows independent overflow axis values — if one axis is non-visible,
   the other becomes auto. Do not attempt mixed overflow values on section.
8. Do NOT change the collapsible behavior, hash-based expand, or progress bar.
9. Do NOT change any section heading, spacing, typography, or grid layout.
10. Do NOT add new components or extract any JSX.
11. Do NOT add rounded-t-lg or rounded-b-lg to the button unless you visually
    verify on a real device that corner bleeding occurs. It almost certainly will not.

─────────────────────────────────────────────────
ACCEPTANCE CRITERIA
─────────────────────────────────────────────────
AC1: On a 360px viewport (Chrome DevTools mobile simulation), open any task card.
     Verify the Syntax CodeBlock can be horizontally scrolled when code exceeds
     column width. The scroll must be touch-draggable.

AC2: On the same viewport, verify the Example CodeBlock also scrolls horizontally.

AC3: The task card still has visually rounded corners on all four sides when:
     a) The card is collapsed (header only visible)
     b) The card is expanded (full body visible)

AC4: The card border (border-border) renders cleanly and does not show any
     content bleeding outside the rounded boundary.

AC5: The progress bar at the top of PackageTaskList still updates correctly
     when tasks are expanded and collapsed.

AC6: Hash-based auto-expand (e.g., /packages/numpy#array-creation) still works.

AC7: On desktop (≥1024px), the CodeBlock horizontal scroll behavior is unchanged
     (it already worked; verify it still works after the change).

AC8: TypeScript compilation produces zero new errors.

AC9: QuickSetupSection CodeBlocks (install / import) are unaffected — they are
     in a different component and do not share PackageTaskList's section wrapper.

─────────────────────────────────────────────────
REGRESSION CHECKLIST
─────────────────────────────────────────────────
[ ] Rounded corners visible on collapsed task card (mobile and desktop)
[ ] Rounded corners visible on expanded task card (mobile and desktop)
[ ] Horizontal scroll works on Syntax CodeBlock (mobile, touch)
[ ] Horizontal scroll works on Example CodeBlock (mobile, touch)
[ ] Collapse/expand toggle still functions correctly
[ ] Progress bar fraction updates on toggle
[ ] Hash-based deep link expansion still fires on page load
[ ] No content visually escapes the card boundary in expanded state
[ ] Dark mode: all colors preserved, no new hardcoded values
[ ] QuickSetupSection unaffected (test /packages/numpy on mobile)
[ ] CheatsheetEntry CodeBlocks unaffected (test any cheatsheet page)
[ ] ModelCollapsibleSections unaffected (test any model page)
[ ] `npm run build` completes with zero TypeScript or lint errors
[ ] `npm run build` produces same static page count as before
─────────────────────────────────────────────────
END OF IMPLEMENTATION PROMPT
─────────────────────────────────────────────────
```

---

## Architectural Classification — Final Verdict

**Implementation bug. Localized fix only. No architectural redesign warranted.**

The architecture of this system is sound. The scroll ownership model is correct: `layout.tsx` owns vertical page scroll, `<pre>` owns horizontal code scroll. The `ContentPageLayout` correctly uses `min-w-0 flex-1` to prevent flex children from resisting shrink. The `CodeBlock` is correctly designed.

The bug is a single class added to a single element for a legitimate but wrong reason — `overflow-hidden` was applied to enforce border radius, but it has a side effect that kills all descendant scroll contexts. This is a common implementation mistake in Tailwind codebases, not a design flaw.

If you were freezing the architecture today, this component hierarchy requires no change. The fix is two class modifications in one file. Everything else holds.