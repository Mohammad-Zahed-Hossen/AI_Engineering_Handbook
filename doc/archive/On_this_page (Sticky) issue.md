Let me inspect the actual layout hierarchy before forming any opinion:Now I have the complete picture. I know exactly what is happening in both problems and why. Here is the real diagnosis.

---

## Part A — UX Architecture Report

### Problem 1: The "On this page" sticky bar

**What is actually happening**

Reading the code reveals there are **three separate TOC mechanisms** currently active simultaneously on mobile:

1. `MobileTOC.tsx` — a sticky bar (`sticky top-14 z-10`) that shows `§ Section Name` with a ChevronDown. Always visible on mobile. Opens a bottom sheet on tap.

2. `StickyActionBar.tsx` — a floating pill (`fixed bottom-16`) with ‹ § Section › navigation arrows. Appears when scrolling up or when at page bottom.

3. `TableOfContents.tsx` — the desktop sidebar TOC (`hidden xl:block`). Invisible on mobile.

The problem is not one sticky TOC — it is two mobile navigation elements that coexist without coordination. `MobileTOC` occupies 36px permanently at the top of the content area. `StickyActionBar` floats at the bottom. On a 390px phone screen during reading, you simultaneously have:
- 56px TopBar (fixed)
- 36px MobileTOC sticky bar (permanent, top of content)
- ~48px StickyActionBar pill (appears during upward scroll)

That is 140px of navigation chrome competing with reading. On a 844px iPhone 13, the actual reading window becomes ~704px. On a smaller Android, less.

**Root cause:** Two navigation components solving the same problem (section awareness and jumping) were added independently without replacing each other.

**HCI analysis**

The question the prompt asks — should the sticky bar be removed, collapsible, auto-hiding, scroll-direction-aware, or desktop-only — has a clear answer once you see the full picture.

`StickyActionBar` is the better of the two mobile components. It only appears when useful (after 200px scroll, on upward scroll or at bottom), it floats without consuming layout space, it shows the current section, and it enables ‹ prev / next › navigation between sections — which is the most ergonomically efficient pattern for one-handed mobile navigation (bottom of screen, thumb-reachable). Appearing only on upward scroll is the correct scroll-direction heuristic: the user wants to navigate away from where they are, which is signaled by scrolling back up.

`MobileTOC` is the weaker solution. `sticky top-14` means it permanently consumes 36px directly below the TopBar, always visible during reading. It serves only two functions: show current section name, and open a bottom sheet. Both of these are already served by `StickyActionBar`.

**Decision: Remove `MobileTOC` entirely. Keep `StickyActionBar` as the sole mobile TOC mechanism.**

The bottom sheet access can be added to `StickyActionBar`'s center label button — tapping `§ Section Name` opens the full section list sheet, replacing `MobileTOC`'s sheet. This consolidates both behaviors into one component that only appears when needed.

**Why alternatives are worse:**
- Collapsible MobileTOC: still occupies space when collapsed, adds a toggle interaction
- Auto-hide on scroll down: creates jarring jump when sticky position snaps in/out during layout reflow
- Keep both: current situation — redundant navigation chrome
- Desktop-only TOC: `TableOfContents.tsx` already handles this correctly with `hidden xl:block`

---

### Problem 2: Code blocks cut off on package pages

**What is actually happening — exact layout trace**

```
app/layout.tsx → <main className="... px-4 py-5 md:px-8 md:py-8">
  → <div className="max-w-5xl mx-auto w-full">
    → ContentPageLayout → <div className="flex gap-8 items-start">
      → <div className="min-w-0 flex-1 space-y-8">   ← content column
        → PackageTaskList → task card
          → <div className="p-4 space-y-4">           ← task body padding
            → <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
              → <div className="rounded-lg border border-border bg-card p-4">  ← syntax card
                → CodeBlock → <div className="... overflow-hidden">
                  → <pre className="overflow-x-auto ...">
```

The `CodeBlock` outer div has `overflow-hidden`. The `<pre>` inside has `overflow-x-auto`. **These two fight each other.** `overflow-hidden` on the parent clips the child's scrollable overflow. The `<pre>` tries to create a horizontal scroll container, but the parent has already clipped anything that extends beyond its boundary.

The secondary cause is padding accumulation. On mobile with `px-4` on `<main>`:
- `main`: 16px left + 16px right = 32px consumed
- Task body `p-4`: 16px left + 16px right = 32px consumed
- Syntax card `p-4`: 16px left + 16px right = 32px consumed
- Total padding: 96px consumed from a 390px screen

The syntax card's inner content area is 390 − 96 = 294px. A typical Python code block with `np.linalg.solve(A, b, assume_a='pos')` is wider than 294px at `text-[11px]` monospace. The `overflow-x-auto` on `<pre>` would normally handle this — but `overflow-hidden` on the CodeBlock wrapper clips it before scroll can activate.

**Root cause: `overflow-hidden` on CodeBlock's outer div clips the horizontal scroll of the `<pre>` inside it.**

The `overflow-hidden` was added to contain the mobile fade gradient overlay and the rounded corners. But `overflow-hidden` on a container also clips any descendant's scroll overflow, even when that descendant explicitly requests `overflow-x: auto`.

**The fix:** Remove `overflow-hidden` from the CodeBlock outer div. Contain the fade gradient and rounded corners differently — the `rounded-md` on the outer div does not require `overflow-hidden` (border-radius clips its own background without it). The mobile fade gradient `<div>` is `absolute inset-y-0 right-0` and is already `pointer-events-none` — it does not need overflow clipping, it needs to be visually inside the code block. This is achievable by giving the gradient `z-10` and keeping it positioned relative to the CodeBlock container without `overflow-hidden`.

**Why other potential fixes are wrong:**
- Reducing font size: masks the symptom, damages readability
- Removing task card padding: reduces readability of non-code content
- Reducing main padding: already at mobile minimum (px-4)
- Adding `overflow-x-auto` to the outer CodeBlock div: creates a second scroll container that conflicts with the inner `<pre>` scroll

---

## Part B — Implementation Prompts

---

### Prompt 1 — Remove MobileTOC, consolidate into StickyActionBar

```
You are working on D:\Project\ai-engineering-handbook.

## Background

There are currently two mobile TOC navigation components active simultaneously:
1. MobileTOC.tsx — a sticky bar permanently visible below the TopBar
2. StickyActionBar.tsx — a floating pill that appears on upward scroll

They are redundant. MobileTOC permanently consumes 36px of reading space.
StickyActionBar is the better pattern: it only appears when useful, sits at
the thumb-reachable bottom, and already shows the current section name.

The fix: remove MobileTOC from the layout, and add full section list access
(the bottom sheet) to StickyActionBar's center label button.

## Files to modify

PRIMARY:
- components/shared/StickyActionBar.tsx
- components/shared/ContentPageLayout.tsx

DELETE (after removing all references):
- components/shared/MobileTOC.tsx

DO NOT TOUCH:
- components/shared/TableOfContents.tsx (desktop TOC, correct as-is)
- app/layout.tsx
- Any page file (packages, models, workflows, cheatsheets)
- Any schema or data file

## Step 1 — Update StickyActionBar.tsx

Import Sheet components at the top:
  import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

Add state for the section sheet:
  const [sheetOpen, setSheetOpen] = useState(false);

The component already receives tocItems prop. Use it for the sheet list.

Change the center label button from scroll-to-top to open-sheet:

  Before:
    <button
      onClick={scrollToTop}
      className="flex h-8 items-center px-2 text-[10px] font-medium text-foreground
                 hover:bg-muted rounded-full transition-colors max-w-[140px] truncate"
      title="Back to top"
    >
      <span className="truncate">§ {activeLabel}</span>
    </button>

  After:
    <button
      onClick={() => setSheetOpen(true)}
      className="flex h-8 items-center px-2 text-[10px] font-medium text-foreground
                 hover:bg-muted rounded-full transition-colors max-w-[140px] truncate"
      title="Jump to section"
      aria-label="Open section navigation"
    >
      <span className="truncate">§ {activeLabel}</span>
    </button>

After the floating pill div, add the Sheet:

  <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
    <SheetContent side="bottom" className="max-h-[60vh] overflow-y-auto p-0">
      <SheetHeader className="px-4 py-3 border-b border-border">
        <SheetTitle className="text-sm">On this page</SheetTitle>
      </SheetHeader>
      <nav aria-label="Section navigation">
        {tocItems?.map(item => (
          <button
            key={item.id}
            onClick={() => {
              document.getElementById(item.id)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
              setSheetOpen(false);
            }}
            className={cn(
              'w-full text-left px-4 py-3 text-sm border-b border-border last:border-0',
              activeLabel === item.label
                ? 'text-foreground font-medium bg-muted/30'
                : 'text-muted-foreground'
            )}
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setSheetOpen(false);
          }}
          className="w-full text-left px-4 py-3 text-xs text-muted-foreground border-t border-border mt-1"
        >
          ↑ Back to top
        </button>
      </nav>
    </SheetContent>
  </Sheet>

The sheet uses activeLabel (string) to determine the active item, matching
the same state already tracked by the component.

## Step 2 — Update ContentPageLayout.tsx

Remove the MobileTOC import and its render:

  Remove this import:
    import MobileTOC from './MobileTOC';

  Remove this JSX line:
    {toc && toc.length >= 2 && <MobileTOC items={toc} />}

The updated ContentPageLayout.tsx should be:

  import { ReactNode } from 'react';
  import Breadcrumbs from './Breadcrumbs';
  import TableOfContents from './TableOfContents';
  import StickyActionBar from './StickyActionBar';

  interface ContentPageLayoutProps {
    breadcrumbs: Array<{ label: string; href?: string }>;
    toc?: Array<{ id: string; label: string }>;
    children: ReactNode;
  }

  export default function ContentPageLayout({
    breadcrumbs,
    toc,
    children,
  }: ContentPageLayoutProps) {
    return (
      <div className="flex gap-8 items-start">
        <div className="min-w-0 flex-1 space-y-8">
          <Breadcrumbs items={breadcrumbs} />
          <div className="space-y-8">
            {children}
          </div>
        </div>
        {toc && <TableOfContents items={toc} />}
        <StickyActionBar tocItems={toc} />
      </div>
    );
  }

## Step 3 — Delete MobileTOC.tsx

After completing Steps 1 and 2 and confirming npm run build passes,
delete the file:
  components/shared/MobileTOC.tsx

Confirm no other file imports MobileTOC before deleting.
Search the entire codebase for 'MobileTOC' — it should appear only
in ContentPageLayout.tsx (now removed) and its own file.

## Acceptance criteria

1. On mobile, there is NO sticky bar permanently visible below the TopBar
   during content reading.
2. After scrolling down 200px on any content page, then scrolling up,
   the floating pill appears at the bottom with § Section Name.
3. Tapping the § Section Name label opens a bottom sheet listing all
   sections for the current page.
4. Tapping a section in the sheet scrolls to it and closes the sheet.
5. The ‹ and › buttons in the pill navigate to the previous/next section.
6. On desktop (xl+), the desktop TableOfContents sidebar is unchanged.
7. The floating pill does NOT appear on pages with fewer than 2 TOC items
   (this is already guarded: `if (!tocItems || tocItems.length < 2) return null`).
8. npm run build passes with zero TypeScript errors.

## Regression checklist

- [ ] Package detail page: pill appears on scroll-up, section sheet opens
- [ ] Model detail page: pill appears on scroll-up, section sheet opens
- [ ] Workflow detail page: pill appears on scroll-up, section sheet opens
- [ ] Cheatsheet detail page: pill appears on scroll-up, section sheet opens
- [ ] Desktop: TableOfContents sidebar still visible on xl+ screens
- [ ] No 'MobileTOC' import errors anywhere in the build
- [ ] Back to top button in sheet scrolls to top and closes sheet
```

---

### Prompt 2 — Fix CodeBlock horizontal scroll clipping

```
You are working on D:\Project\ai-engineering-handbook.

## Background

Code blocks on package pages are visually clipped on the right side on
mobile. Users cannot see or scroll the full code content.

Root cause (verified by layout trace):
The outer div of CodeBlock has className containing 'overflow-hidden'.
Inside it, the <pre> has 'overflow-x-auto'. overflow-hidden on a parent
clips the scroll container created by the child, preventing horizontal
scroll from activating even though overflow-x-auto is set.

overflow-hidden was placed on the outer div to:
(a) enforce rounded corners clipping the header bar's background
(b) contain the absolute-positioned mobile fade gradient overlay

Both goals can be achieved without overflow-hidden.

## File to modify

PRIMARY:
  components/shared/CodeBlock.tsx

DO NOT TOUCH:
  Any page file
  Any layout file
  Any other component
  globals.css
  Any data or schema file

## The fix

In CodeBlock.tsx, find the outer div:

  <div className="relative rounded-md bg-zinc-950 border border-zinc-800
                  my-2 font-mono overflow-hidden">

Remove 'overflow-hidden' from this className:

  <div className="relative rounded-md bg-zinc-950 border border-zinc-800
                  my-2 font-mono">

Then find the mobile fade gradient overlay div:

  <div
    className="pointer-events-none absolute inset-y-0 right-0 w-8
               bg-gradient-to-l from-zinc-950 to-transparent md:hidden"
    aria-hidden="true"
  />

Add 'z-10' to ensure it renders above the scrolling content:

  <div
    className="pointer-events-none absolute inset-y-0 right-0 w-8
               bg-gradient-to-l from-zinc-950 to-transparent md:hidden z-10"
    aria-hidden="true"
  />

The rounded corners of the outer div are enforced by border-radius on the
div's own background and border — they do not require overflow-hidden.
The header bar's bg-zinc-900/50 background is contained within the div
without needing overflow-hidden because it has no content that protrudes.

## Do NOT change

- The <pre> className (keep overflow-x-auto exactly as is)
- The copy button positioning or behavior
- The header bar structure
- The showLineNumbers table layout
- The mobile copy button at the bottom
- The font size (text-[11px])
- Any prop interface

## Acceptance criteria

1. On mobile (390px viewport), a code block with a long line (>40 chars)
   is horizontally scrollable — the user can swipe left to see the rest.
2. The right-side fade gradient is still visible on mobile, indicating
   that more content exists to the right.
3. The rounded corners of the code block are visually intact (no square
   corners on the block).
4. The header bar (filename/language label + desktop copy button) clips
   correctly within the rounded top corners.
5. The desktop copy button in the header bar is unaffected.
6. The mobile copy button bar at the bottom is unaffected.
7. The line numbers table layout (showLineNumbers=true) scrolls correctly.
8. npm run build passes with zero TypeScript errors.

## Regression checklist

- [ ] Package page: long syntax block is horizontally scrollable on mobile
- [ ] Package page: fade gradient visible on right edge of code blocks
- [ ] Cheatsheet page: snippet blocks are horizontally scrollable
- [ ] Model page: quick_start code block is horizontally scrollable
- [ ] Desktop: code blocks appear visually identical to before
- [ ] Copy button works on both mobile and desktop
- [ ] Rounded corners intact on all code blocks
- [ ] showLineNumbers variant: line numbers visible, code scrollable
```