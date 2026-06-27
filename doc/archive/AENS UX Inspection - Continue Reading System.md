
---

# AENS UX Inspection — Continue Reading System

---

## Phase 1 — Inspection

### What the Current System Does

`session-tracking.ts` stores two keys in `localStorage`:

| Key | Purpose |
|---|---|
| `aens-continue-reading` | Single `RecentItem` (last visited page) |
| `aens-recent-knowledge` | Array of up to 8 `RecentItem`s (visit history) |

`PageVisitTracker` fires `recordPageVisit()` after a 100ms debounce on every pathname change. This means **any navigation at all** — including accidental swipes, bounce visits, or 2-second reads — overwrites Continue Reading.

`ContinueReadingSection` reads from `localStorage` via `useState` initializer on mount. Since `localStorage` is persistent across restarts by default, the data **does not disappear on browser restart**. It disappears only if:

1. The browser storage is explicitly cleared
2. The user is in a Private/Incognito window
3. iOS Safari in certain restrictive modes clears storage after 7 days of inactivity

### Root Cause Diagnosis

The perceived "disappearing after restart" is almost certainly the **PWA being launched in standalone mode with a different origin scope**, or an iOS Safari storage eviction issue, not a code bug. The architecture is using `localStorage` which is correct and persistent. However, the current code has a real design flaw that makes the feature meaningless even when it doesn't disappear:

**Critical Flaw:** Every page visit — regardless of dwell time, scroll, or interaction — immediately overwrites the Continue Reading bookmark. This makes it useless for sessions with 4–8 hours of deep reading because any navigation (even checking another page for 3 seconds) destroys the bookmark.

### Conceptual Correctness Assessment

| Design Decision | Assessment |
|---|---|
| `localStorage` for persistence | ✅ Correct. Survives restarts by design. |
| Single bookmark (not a list) | ✅ Correct for Continue Reading. |
| List for Recent Knowledge | ✅ Correct. Different responsibility. |
| Update on every navigation | ❌ Wrong. Creates noise, not signal. |
| No dwell time filter | ❌ Wrong. Cannot distinguish reading from browsing. |
| No scroll position stored | ❌ Missing. Page-level bookmark is too coarse. |
| No meaningful interaction filter | ❌ Missing. |
| No timestamp on CR for "freshness" | ⚠️ Exists on the item but never used in display. |

**Verdict:** The architecture is correct. The implementation logic is flawed. Two targeted fixes resolve everything.

---

## Phase 2 — UX Decisions

### Decision 1 — Persistence Scope

**Ruling: Continue Reading must persist across all restarts.**

Browser restart → survives (`localStorage` already handles this).
App restart (PWA) → survives (same `localStorage` origin).
Device reboot → survives.
iOS 7-day eviction → acceptable edge case; not worth engineering around.

No change needed to the storage layer. The perceived problem is likely a PWA scope or incognito issue.

**Action:** Add a diagnostic check in the implementation: if CR is null on mount, verify the PWA manifest `start_url` and `scope` match the origin exactly.

---

### Decision 2 — What to Store

Current `RecentItem` stores: `href`, `name`, `type`, `category`, `timestamp`.

**Ruling: Extend with scroll position and a dwell timer. Reject accordion state.**

| Field | Decision | Reason |
|---|---|---|
| `href` | ✅ Keep | Essential |
| `name` | ✅ Keep | Display |
| `type` + `category` | ✅ Keep | Badge display |
| `timestamp` | ✅ Keep | Freshness display |
| `scrollY` | ✅ Add | Restores reading position on return |
| `scrollPercent` | ✅ Add | Needed for the update heuristic |
| `dwellMs` | ✅ Add | Used to qualify a visit as real reading |
| Accordion expanded state | ❌ Reject | Overcomplicated; accordion state is per-section, not per-page; adds entropy without proportional value |
| Current "page" (paginated) | ❌ Reject | AENS pages are not paginated |

**New `ContinueReadingItem` shape (additive — does not break `RecentItem`):**

```typescript
export interface ContinueReadingItem extends RecentItem {
  scrollY: number;
  scrollPercent: number;
  dwellMs: number;
}
```

---

### Decision 3 — Update Rule (Most Critical)

**The current rule is wrong.** Updating on every navigation click destroys reading continuity during exploratory sessions.

**Ruling: A visit qualifies as a Continue Reading candidate only when ALL of the following are true:**

| Criterion | Threshold | Rationale |
|---|---|---|
| Dwell time | ≥ 45 seconds | Kindle's page-turn heuristic; filters accidental clicks |
| Scroll percentage | ≥ 15% | Confirms actual reading started, not just page landing |
| Page type | NOT home (`/`) | Already filtered; keep this |
| Page type | NOT list pages (`/packages`, `/models`, etc.) | Index pages are navigation, not reading |

**Update timing:** Save on `visibilitychange` (tab hidden/backgrounded) and on `beforeunload`, not on navigation. This is the correct mobile pattern — it mirrors how Kindle saves position when you put the device down.

**Do not update Continue Reading from `PageVisitTracker`.** PageVisitTracker should only update `aens-recent-knowledge` (which is a history log, where every visit is valid).

This cleanly separates responsibilities:

- `PageVisitTracker` → logs all visits to Recent Knowledge
- A new `useReadingSession` hook → qualifies and saves the Continue Reading bookmark

---

### Decision 4 — Continue Reading vs Recent Knowledge

**Ruling: Both must coexist. They have different and non-overlapping responsibilities.**

| Feature | Continue Reading | Recent Knowledge |
|---|---|---|
| Responsibility | Restore deep reading session | Show browsing history |
| Mental model | Kindle bookmark | Browser history |
| Count | 1 item (the best candidate) | Up to 8 items |
| Update trigger | Qualified reading (dwell + scroll) | Every visit |
| Scroll restoration | Yes | No |
| Value on cold start | Very high | Medium |
| Value after exploration session | High | Low (cluttered) |

They must **not** be merged. Merging would force Recent Knowledge to carry scroll state (wrong) or Continue Reading to show multiple items (wrong — it dilutes the single-bookmark mental model).

---

### Decision 5 — Inspiration Audit

| App | Feature | Adopt? | Reason |
|---|---|---|---|
| Kindle | Single persistent bookmark | ✅ Yes | Already the model |
| Kindle | "Return to reading" on cover | ✅ Yes | CR card on Home is already this |
| Kindle | Scroll position restore on tap | ✅ Yes | Add `scrollY` restore |
| Kindle | Last read time display | ✅ Yes | Timestamp already stored; show it |
| Obsidian | "Last opened" in file explorer | ❌ Reject | AENS is not file-based navigation |
| Obsidian | Graph of visited nodes | ❌ Reject | Overengineering for single user |
| Readwise Reader | Reading position as % | ⚠️ Partial | Show scroll% only in CR card, not as a progress bar overlay |
| Readwise Reader | Highlighting | ❌ Reject | AENS is static content; highlighting has no destination |
| Apple Books | "X% through" display | ✅ Yes | Show `scrollPercent` in CR card subtitle |

**Approved inspirations to implement:** Single bookmark + scroll restore + timestamp display + scroll% display in card.

---

### Decision 6 — Long-Term Value

For 5-year usage, the two features that compound in value are:

1. **Reliable scroll restoration** — eliminates the cost of re-finding your place after any interruption. Saves ~10–30 seconds per session restart. At daily usage, this is hundreds of minutes per year.

2. **Stable update heuristic** — prevents the bookmark from being overwritten during exploratory sessions, so the feature remains trustworthy. A feature you can't trust gets mentally ignored.

Everything else (syncing across devices, reading streaks, reading time analytics, smart suggestions) is complexity that adds no proportional value for a single-user local system.

---

## Phase 3 — Exact Implementation Prompt (for Windsurf/Codex)

```
AENS — Continue Reading System: Targeted Fix
Target: D:\Project\ai-engineering-handbook

You are implementing a focused UX fix to the Continue Reading system.
Do NOT touch any other components or data files.
Do NOT change the schema of RecentItem.
Do NOT refactor session-tracking.ts beyond what is specified.
Architecture is frozen; make only additive changes.

─────────────────────────────────────────────
STEP 1 — Extend the ContinueReadingItem type
─────────────────────────────────────────────
In lib/session-tracking.ts, add a new interface that extends RecentItem:

  export interface ContinueReadingItem extends RecentItem {
    scrollY: number;
    scrollPercent: number;
    dwellMs: number;
  }

Update getContinueReading() to return ContinueReadingItem | null (backwards compatible:
if scrollY is missing in stored JSON, default to 0).

Update clearContinueReading() — no change needed.

Add a new export:
  export function saveContinueReading(item: ContinueReadingItem): void

This function saves to localStorage under CONTINUE_READING_KEY. It should only
be called from the reading session hook (Step 2), NOT from PageVisitTracker.

─────────────────────────────────────────────
STEP 2 — Create lib/hooks/useReadingSession.ts
─────────────────────────────────────────────
This hook qualifies the current page visit and saves it to Continue Reading.
It must ONLY fire on content pages (not home, not list pages).

Logic:

  const QUALIFY_DWELL_MS = 45_000;   // 45 seconds
  const QUALIFY_SCROLL_PCT = 15;      // 15% scroll

On mount:
  - Record startTime = Date.now()
  - Record href, name, type, category from props

On scroll (passive listener, throttled to 1s):
  - Compute scrollPercent = (scrollY / (scrollHeight - clientHeight)) * 100
  - Track maxScrollPercent (never decrease)

On visibilitychange (document hidden) AND window beforeunload:
  - Compute dwellMs = Date.now() - startTime
  - If dwellMs >= QUALIFY_DWELL_MS AND maxScrollPercent >= QUALIFY_SCROLL_PCT:
      Call saveContinueReading({ href, name, type, category, timestamp: Date.now(),
                                  scrollY: window.scrollY, scrollPercent: maxScrollPercent,
                                  dwellMs })

The hook takes these props: { href, name, type, category }
Return type: void (no return value needed)

─────────────────────────────────────────────
STEP 3 — Integrate useReadingSession into content pages
─────────────────────────────────────────────
Content page layouts exist in components/shared/ContentPageLayout.tsx (if it is a 
shared wrapper) or in individual page files. Inspect first.

Call useReadingSession at the top of every content page layout that renders
individual items (packages/[id], models/[category]/[id], workflows/[id],
cheatsheets/[id], registry/[category]).

Do NOT call it on:
  - app/page.tsx (Home)
  - /packages (list)
  - /models (list)
  - /workflows (list)
  - /cheatsheets (list)
  - /registry (list)

─────────────────────────────────────────────
STEP 4 — Remove Continue Reading update from PageVisitTracker
─────────────────────────────────────────────
In components/shared/PageVisitTracker.tsx, the recordPageVisit() function
currently writes to both RECENT_KNOWLEDGE_KEY and CONTINUE_READING_KEY.

Remove the line that updates CONTINUE_READING_KEY from recordPageVisit().
Recent Knowledge must still be updated for every visit as before.

In lib/session-tracking.ts, update recordPageVisit() to only write to
RECENT_KNOWLEDGE_KEY.

─────────────────────────────────────────────
STEP 5 — Scroll restoration in ContinueReadingSection
─────────────────────────────────────────────
In components/shared/ContinueReadingSection.tsx:

1. Read item as ContinueReadingItem | null (cast or re-import).

2. Pass scrollY as a query param on the Link href:
     href={`${item.href}?scrollTo=${item.scrollY}`}

3. Update the subtitle line from "Continue where you left off" to show
   progress and time:
     "{item.scrollPercent.toFixed(0)}% through · {formatTimeAgo(item.timestamp)}"

4. Create a new client hook lib/hooks/useScrollRestore.ts:
   - On mount, read ?scrollTo param from the URL (use useSearchParams)
   - If present and > 0, call window.scrollTo({ top: scrollTo, behavior: 'instant' })
     after a 150ms delay (to allow content to render)
   - Then remove the ?scrollTo param from the URL using
     router.replace(pathname, { scroll: false }) to keep the URL clean

5. Call useScrollRestore() inside ContentPageLayout (or each content page).

─────────────────────────────────────────────
VALIDATION CHECKLIST
─────────────────────────────────────────────
□ Open any content page, read for < 45s, navigate home → CR card must NOT update
□ Open any content page, scroll >15%, stay for 45s, close tab → Reopen → CR card appears
□ CR card shows correct scroll% and time ago
□ Tapping CR card navigates AND restores scroll position
□ URL is cleaned after scroll restore (no ?scrollTo= visible)
□ Recent Knowledge still updates on every visit regardless of dwell time
□ Home page visit does NOT appear in CR card
□ List pages (/packages etc.) do NOT appear in CR card
□ Dismiss button still works; after dismiss, CR does not reappear until next qualified visit
□ TypeScript compiles with no errors (run: npx tsc --noEmit)

─────────────────────────────────────────────
REGRESSION CHECKLIST
─────────────────────────────────────────────
□ Recent Knowledge section unaffected
□ PageVisitTracker still fires on all routes
□ ReadingProgress bar unaffected
□ Search unaffected
□ No new dependencies introduced
□ No changes to data files or schemas
```

---

## Phase 4 — Reject List

| Idea | Rejection Reason |
|---|---|
| Sync across devices | Single user, no backend, adds architectural complexity with zero benefit |
| Reading streaks / analytics | Gamification; AENS is a reference tool, not a learning app with goals |
| Multiple bookmarks (bookmark list) | Dilutes the single-bookmark Kindle mental model; Recent Knowledge already covers browsing history |
| Accordion expanded state persistence | High complexity, low value; accordion state is volatile and contextual |
| Readwise-style highlights | Static content, no write layer; highlights have nowhere to go |
| Obsidian-style graph view of visited pages | Overkill for single user; navigation is already low-friction |
| Reading time estimates | Noise; content length varies too much across AENS entry types |
| Auto-dismissal of CR card after N days | Adds logic complexity; manual dismiss already exists |
| Separate "bookmark" button on content pages | Redundant with the dwell-based auto-bookmark; adds UI chrome |
| IndexedDB instead of localStorage | localStorage is sufficient for this data volume; no migration justified |
| Service Worker caching of CR state | AENS is static-first; offline use is not a stated requirement |
| Confetti / visual reward on returning to CR | Reduces cognitive seriousness; AENS is a study tool |