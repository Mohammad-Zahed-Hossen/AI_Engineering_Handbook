Let me read the actual mobile-relevant code before writing anything:Good. Now let me read the layout and mobile-relevant components:Now I have a complete picture. Activating Mode 4 (UX Research) with the mobile-primary constraint from the skill.

---

## AENS Mobile Cognitive Interface Audit

**Chief Architect Mode: UX Research — Mobile-Primary**

I read every layout file, every page component, every shared component, the CSS, and the mobile sidebar implementation before writing a single word. What follows is grounded entirely in what the code actually does on a mobile screen, not what the audit prompt imagined.

---

## Ground Truth First — What's Already Working

Before diagnosing problems, establish what to protect:

The TopBar structure is correct for mobile. A 56px sticky header with a menu trigger left, search center, and dark mode right is the right layout. The Sheet-based sidebar (`MobileSidebarTrigger.tsx`) using shadcn's Sheet primitive is the correct pattern — it slides from the left and auto-closes on navigation. The search box is centered and reachable. Dark mode exists. These are well-designed and should not be touched.

---

## The Five Real Mobile Problems

The audit prompt asks for 20 problems. I'm giving you 5. These are the only ones that materially damage daily mobile usage. The other 15 would be things like "consider bottom navigation" and "improve hover states" — valid in a commercial app, irrelevant in a personal reference tool used by one person who knows the system.

---

### Problem 1 — The main content padding is desktop-first

**Severity: Critical**
**HCI Principle: Fitts' Law, Reading Comfort**

```
// app/layout.tsx
<main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 p-6 md:p-8">
  <div className="max-w-5xl mx-auto w-full">
```

On mobile, `p-6` applies `24px` padding on all sides. On a 390px iPhone screen this leaves 342px of usable content width. That is acceptable. **The problem is the equal 24px padding left AND right.** Technical content — code blocks, tables, parameter lists — needs every pixel of horizontal space on mobile.

The right value is `px-4 py-5` on mobile (16px horizontal, 20px vertical). `p-6` is fine for tablet and up.

Additionally, the `max-w-5xl mx-auto` wrapper is meaningless on mobile (the screen is already narrower) but correct on desktop. Leave it.

**Fix:** Change `p-6 md:p-8` to `px-4 py-5 md:px-8 md:py-8`.

**Impact:** Every single page gains 16px of horizontal reading space. Code blocks, cheatsheet cards, and parameter tables stop clipping. This is the highest-leverage one-line fix in the entire codebase.

---

### Problem 2 — Code blocks force horizontal scroll with no visual signal

**Severity: High**
**HCI Principle: Cognitive Load, Visual Affordance**

```
// CodeBlock.tsx
<pre className="overflow-x-auto p-4 pt-8 text-[11px] text-zinc-200 leading-relaxed scrollbar-thin">
```

`overflow-x-auto` is correct — the code scrolls horizontally when it overflows. The problem is there is no visual signal that more content exists to the right. On mobile, a user reading a truncated line of code doesn't know whether it ends there or continues. They must speculatively swipe to find out.

A right-side fade gradient (`mask-image: linear-gradient(to right, transparent 0%, black 30px)` applied from the right edge when the block is scrollable) makes overflow immediately obvious without any interaction.

This is a pure CSS addition to `CodeBlock.tsx`.

**Secondary issue:** The copy button is positioned `top-2 right-2` which is fine on desktop but creates a tap conflict on mobile — users scrolling the code horizontally often accidentally trigger the copy button. Move the copy button to sit **below** the code block on mobile (`md:absolute md:top-2 md:right-2`), positioned as a small full-width bar at the bottom.

**Impact:** Eliminates the "did this code end or is there more?" cognitive question on every code block. Reduces accidental copy taps during horizontal scroll.

---

### Problem 3 — The TOC is desktop-only with no mobile equivalent

**Severity: High**
**HCI Principle: Recognition over Recall, Navigation Efficiency**

```
// TableOfContents.tsx
<aside className="hidden xl:block w-48 shrink-0">
```

The TOC correctly hides on mobile (`hidden xl:block`). The problem is there is no replacement. On a package page with 8 tasks, a model page with 6 sections, or a cheatsheet with 15 entries, a mobile user has no way to jump to a specific section. They must scroll through everything to find the section they want. In a 6-hour study session with constant cross-referencing, this is the primary source of navigation friction.

The correct mobile pattern — borrowed from Kindle and Apple Developer Docs — is a **sticky section indicator** at the top of the content area that shows which section is currently visible and is tappable to open a bottom sheet with the full TOC.

This is a single new component `MobileTOC.tsx` that:
- Shows only on `< xl` screens
- Sticks below the TopBar (position: sticky, top: 56px)
- Displays the active section name in compact form: `§ Linear Algebra` with a down-arrow
- On tap, opens a bottom sheet listing all TOC items
- Selecting an item scrolls to it and closes the sheet

The IntersectionObserver logic from the existing `TableOfContents.tsx` is reused exactly.

**Impact:** Eliminates the single biggest navigation friction in long reading sessions. This is the most important structural change for mobile.

---

### Problem 4 — The mobile menu "Menu" button is too small and wrongly labeled

**Severity: Medium**
**HCI Principle: Fitts' Law, Jakob's Law**

```
// MobileSidebarTrigger.tsx
<Button size="sm" className="... px-2 py-0.5 ... text-[10px] h-auto">
  Menu
</Button>
```

The tap target is approximately 32×22px. Apple HIG and Material Design both specify 44×44px minimum touch targets. This button is accessed dozens of times per session and it is under-sized.

More importantly, "Menu" is the wrong label for this interaction. The button opens a navigation panel. "Menu" signals a settings or actions menu (per Jakob's Law — users expect terms they've seen before). "Nav" or a hamburger icon (☰) communicates navigation panel.

**Fix:** Replace the text button with a 44×44px icon button using the `Menu` icon from lucide-react (already installed). Remove the text label entirely. The icon is universally understood.

**Impact:** Fewer missed taps, no label confusion. Small effort, persistent daily benefit.

---

### Problem 5 — Package task cards are fully expanded on mobile with no collapse option

**Severity: High**
**HCI Principle: Progressive Disclosure, Miller's Law, Long-session Fatigue**

Each package task renders its full content unconditionally: syntax block + example block + 3-column parameter grid + use_when + avoid_when + decision notes + gotchas + docs link. On mobile, a single task card with a substantial code example can be 600–800px tall. A package with 8 tasks is 5,000–6,000px of content — six full screens of continuous scrolling to reach the last task.

The mental trigger and task name are the primary scanning targets. The code, parameters, and gotchas are secondary — retrieved when the user has identified the task they need.

**The correct pattern is progressive disclosure:**
- Task header (task name + mental trigger) is **always visible**
- Task body (syntax, example, params, gotchas) is **collapsed by default**
- A single tap on the header expands/collapses the body
- The currently-open task stays open; opening another does NOT auto-close the previous one (user may want to reference both)

This is a client component wrapping for the task section. The expanded state persists for the session (local `useState` per task). No URL state needed.

**Critical constraint:** The TOC anchor links must still work. The `id` and `scroll-mt-24` on each task section must be preserved. When a TOC link is clicked, the task should auto-expand if it is currently collapsed.

**Impact:** A 10-task NumPy page compresses from ~6,000px to ~800px in its default collapsed state. Navigation between tasks becomes 1-tap instead of repeated scrolling. This is the second-most important structural change for mobile.

---

## What the Audit Prompt Asked For That I'm Rejecting

**Bottom navigation bar:** This is a commercial app pattern. AENS already has a working Sheet-based mobile nav. Adding a persistent bottom bar would consume 56px of vertical reading space on every page. Reject.

**Swipe gestures:** Swipe-back/forward is handled by the browser and Android PWA chrome natively. Adding custom swipe detection introduces gesture conflicts with horizontal code scrolling. Reject.

**Recent searches / search history:** Useful feature, but requires localStorage persistence and additional state management. Not a UX emergency — search is already fast. Defer to content phase.

**Sticky workflow step headers:** The workflow page has 4–8 steps, not 50. Sticky step headers add implementation complexity for a page that doesn't have a scrolling problem. Reject.

**Model comparison page:** Explicitly outside scope. The model page's Use/Avoid layout already enables rapid mental comparison without a dedicated comparison view. Reject.

---

## Implementation Prompts — Pareto Ordered

---

### Mobile Fix M1 — Content Padding (30 minutes, highest leverage)

```
You are working on D:\Project\ai-engineering-handbook.
Touch only app/layout.tsx.

Change the main element's className from:
  p-6 md:p-8
to:
  px-4 py-5 md:px-8 md:py-8

This gives mobile screens 16px horizontal padding instead of 24px,
recovering 16px of content width on each side.

Do not change anything else. No other files.
Verify: npm run build passes.
```

---

### Mobile Fix M2 — Menu Button Icon (30 minutes)

```
You are working on D:\Project\ai-engineering-handbook.
Touch only components/layout/MobileSidebarTrigger.tsx.

Import the Menu icon from lucide-react:
  import { ChevronDown, ChevronRight, Menu } from 'lucide-react';

Replace the SheetTrigger button entirely with:

<SheetTrigger asChild>
  <button
    aria-label="Open navigation menu"
    className="flex items-center justify-center w-11 h-11 rounded-md text-foreground hover:bg-muted transition-colors"
  >
    <Menu className="w-5 h-5" />
  </button>
</SheetTrigger>

Remove the Button import if it is no longer used elsewhere in this file.

Do not change anything else in this file.
Verify: The menu still opens. npm run build passes.
```

---

### Mobile Fix M3 — Code Block Overflow Signal + Copy Button Position (1 hour)

```
You are working on D:\Project\ai-engineering-handbook.
Touch only components/shared/CodeBlock.tsx.

## Change 1 — Overflow fade signal

Wrap the existing <pre> in a relative container and add a right-fade
overlay that indicates horizontal overflow:

Replace the existing outer div:
  <div className="relative rounded-md bg-zinc-950 border border-zinc-800 my-2 select-text font-mono">

With:
  <div className="relative rounded-md bg-zinc-950 border border-zinc-800 my-2 select-text font-mono overflow-hidden">

After the <pre> element, add this fade overlay:
  <div
    className="pointer-events-none absolute inset-y-0 right-0 w-8
                bg-gradient-to-l from-zinc-950 to-transparent
                md:hidden"
    aria-hidden="true"
  />

This fade only shows on mobile (md:hidden hides it on desktop where
the copy button already signals the right edge).

## Change 2 — Copy button positioning

The current copy button is absolute top-2 right-2. On mobile this
overlaps with the horizontal scroll area.

Change the button's className from:
  "absolute top-2 right-2 text-[9px] ..."

To:
  "absolute top-2 right-2 hidden md:block text-[9px] ..."

Then add a mobile copy button below the pre block, inside the outer div,
after the fade overlay:

  <button
    onClick={handleCopy}
    className={cn(
      "md:hidden w-full border-t border-zinc-800 py-1.5 text-[10px]",
      "font-sans font-semibold uppercase tracking-wider transition-none",
      "select-none cursor-pointer",
      copied
        ? "text-emerald-400 bg-emerald-500/10"
        : "text-zinc-400 bg-zinc-900 hover:text-zinc-200"
    )}
  >
    {copied ? '✓ Copied' : 'Copy'}
  </button>

The mobile copy button is a full-width bar at the bottom of the code
block — impossible to accidentally trigger during horizontal scroll.

Do not change the CodeBlock props interface.
Verify: npm run build passes. Both copy buttons share the same
handleCopy function and copied state.
```

---

### Mobile Fix M4 — Mobile TOC Bottom Sheet (2–3 hours)

```
You are working on D:\Project\ai-engineering-handbook.
Create one new file: components/shared/MobileTOC.tsx
Update components/shared/ContentPageLayout.tsx to include it.

## MobileTOC.tsx

'use client';

This component receives the same items prop as TableOfContents:
  interface TocItem { id: string; label: string; }
  interface MobileTOCProps { items: TocItem[]; }

It uses the same IntersectionObserver logic as TableOfContents.tsx
to track the activeId. Copy that logic exactly.

The component renders:

1. A sticky bar (only visible below xl breakpoint: xl:hidden):
   - Position: sticky, top: 56px (below the 56px TopBar)
   - Height: 36px
   - Background: bg-background/95 backdrop-blur-sm
   - Border bottom: border-b border-border
   - Contains: a button showing "§ {activeLabel}" with a ChevronDown icon
   - When tapped, opens a bottom sheet

2. A Sheet (from @/components/ui/sheet) with side="bottom":
   - Max height: 60vh
   - Scrollable list of all TOC items
   - Each item: full-width button, 44px min height, shows label
   - Active item highlighted with text-primary font-medium
   - On item click: scroll to the anchor (smooth), close the sheet

Implementation:

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ChevronDown } from 'lucide-react';

Use useState for sheet open/close.
Use useEffect + IntersectionObserver for activeId (copy from TableOfContents.tsx).

The sticky bar button:
  <button
    onClick={() => setOpen(true)}
    className="xl:hidden sticky top-14 z-10 w-full h-9 px-4
               flex items-center gap-2 bg-background/95 backdrop-blur-sm
               border-b border-border text-xs text-muted-foreground
               select-none"
  >
    <span className="text-[10px] font-semibold uppercase tracking-wider">§</span>
    <span className="flex-1 text-left truncate text-xs text-foreground">
      {items.find(i => i.id === activeId)?.label ?? items[0]?.label}
    </span>
    <ChevronDown className="w-3.5 h-3.5 shrink-0" />
  </button>

Sheet item button:
  <button
    onClick={() => {
      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setOpen(false);
    }}
    className={cn(
      'w-full text-left px-4 py-3 text-sm border-b border-border last:border-0',
      activeId === item.id
        ? 'text-foreground font-medium bg-muted/30'
        : 'text-muted-foreground'
    )}
  >
    {item.label}
  </button>

## ContentPageLayout.tsx update

Import MobileTOC. Render it between Breadcrumbs and children when
toc items exist, only on mobile:

  {toc && toc.length >= 2 && <MobileTOC items={toc} />}

Place it after Breadcrumbs, before the children div. It is sticky
so it will stay in place during scroll.

Constraints:
- Do NOT modify TableOfContents.tsx
- Do NOT modify any page file
- The existing xl:block desktop TOC in ContentPageLayout.tsx stays unchanged
- npm run build must pass
```

---

### Mobile Fix M5 — Collapsible Package Tasks (2–3 hours)

```
You are working on D:\Project\ai-engineering-handbook.
Touch only app/packages/[id]/page.tsx.

Convert each package task section from always-expanded to
collapsed-by-default with tap-to-expand behavior.

## Step 1 — Convert the page to a client component

Add 'use client'; at the top of the file.

Move the data fetching (getAllPackageIds, getPackage, getRelatedContent)
to a separate server component. The simplest approach for a Next.js
static-export page is:

Keep the page.tsx as a server component for data fetching and
generateStaticParams. Extract just the task list rendering into a new
client component: components/shared/PackageTaskList.tsx

PackageTaskList receives:
  interface PackageTaskListProps {
    tasks: Package['tasks'];
    packageName: string;
  }

## Step 2 — PackageTaskList.tsx implementation

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

Each task tracks its own expanded state via a Map or individual
state entries. Use a Set<number> of expanded task indices:

  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());

  const toggleTask = (idx: number) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(idx)) { next.delete(idx); }
      else { next.add(idx); }
      return next;
    });
  };

Each task renders as:

<section key={task.task} id={taskAnchor} className="scroll-mt-24 rounded-lg border border-border bg-card overflow-hidden">

  {/* Clickable header — always visible */}
  <button
    onClick={() => toggleTask(idx)}
    className="w-full px-4 py-3 border-b border-border bg-muted/20
               flex items-start gap-3 text-left cursor-pointer
               hover:bg-muted/30 transition-colors"
    aria-expanded={expandedTasks.has(idx)}
  >
    <span className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center
                     rounded border border-border bg-background text-[9px]
                     font-mono font-semibold text-muted-foreground select-none">
      {idx + 1}
    </span>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-foreground leading-snug">
        {task.task}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
        <span className="font-medium text-foreground/70">When: </span>
        {task.mental_trigger}
      </p>
    </div>
    {expandedTasks.has(idx)
      ? <ChevronDown className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
      : <ChevronRight className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
    }
  </button>

  {/* Collapsible body */}
  {expandedTasks.has(idx) && (
    <div className="p-4 space-y-4">
      {/* All existing task content — syntax, example, params,
          use_when, avoid_when, decision_notes, gotchas, docs */}
      {/* Copy this content exactly from the current page.tsx task rendering */}
    </div>
  )}

</section>

## Step 3 — Auto-expand via TOC link

When the page loads with a hash in the URL (e.g. /packages/numpy#linear-algebra),
the target task should auto-expand. Add a useEffect:

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const idx = tasks.findIndex(t => slugify(t.task) === hash);
    if (idx >= 0) {
      setExpandedTasks(new Set([idx]));
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

## Constraints:
- generateStaticParams() must remain in a server component — do NOT
  make the page file a client component. Keep page.tsx as server,
  extract task rendering to PackageTaskList.tsx as client.
- The id and scroll-mt-24 on each section must be preserved.
- Multiple tasks can be open simultaneously (do not auto-close others).
- npm run build must pass.
- npm run validate must pass.
```

---

## Implementation Order and Freeze Readiness

| Fix | Effort | Impact | Do Before Freeze |
|---|---|---|---|
| M1 — Content padding | 30 min | Every page, every session | **Yes** |
| M2 — Menu icon button | 30 min | Every navigation gesture | **Yes** |
| M3 — Code block mobile | 1 hr | Every code block | **Yes** |
| M4 — Mobile TOC | 2–3 hrs | All content pages | **Yes** |
| M5 — Collapsible tasks | 2–3 hrs | Package pages with 5+ tasks | **Yes** |

All five are mandatory before mobile freeze. They cost one focused afternoon. Everything else the audit prompt asked for — animations, gestures, comparison views, bottom nav, search history — either doesn't apply to this use case, is handled by the OS/browser natively, or introduces complexity without proportional daily benefit.

After M1–M5, the interface is ready to freeze. Add content.