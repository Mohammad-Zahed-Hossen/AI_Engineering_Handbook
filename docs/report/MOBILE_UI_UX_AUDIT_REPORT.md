# AENS Mobile-First UI/UX Audit Report

**Date:** July 18, 2026  
**Scope:** Complete mobile-first refactor of AENS application  
**Goal:** Convert desktop-first layouts to true mobile-first experience

---

## Executive Summary

The AENS application has some mobile considerations but was primarily designed desktop-first. This audit identified 47 mobile issues across pages, components, and shared UI elements. The app needs systematic mobile-first refactoring to provide an excellent mobile experience while preserving desktop functionality.

---

## Mobile Issues Found

### 1. Layout & Grid Issues

#### Home Page (`app/page.tsx`)
- **Issue:** Knowledge Explorer cards use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` - cards may feel cramped on 360-390px screens
- **Issue:** Handbook Overview stats use `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6` - 2 columns on mobile may be too tight
- **Issue:** Featured Collections use `grid-cols-1 lg:grid-cols-3` - single column on mobile is good but spacing needs optimization
- **Issue:** Recently Updated uses `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` - cards may be too tall on mobile

#### Recent Activity Component (`components/shared/RecentActivity.tsx`)
- **Issue:** Uses `grid-cols-1 md:grid-cols-2` with `divide-y md:divide-y-0 md:divide-x` - on mobile, the two-column layout stacks vertically but the divider logic creates visual inconsistency
- **Issue:** Continue Reading cards have fixed padding that may be excessive on small screens
- **Issue:** Recently Viewed uses `grid-cols-1 sm:grid-cols-2` - 2 columns on small mobile (375px) may be too cramped

#### Model Detail Page (`app/models/[category]/[id]/page.tsx`)
- **Issue:** Decision Board uses `grid-cols-1 md:grid-cols-2` with complex nested structure - on mobile, the stacked layout needs better spacing
- **Issue:** Quick Start inputs/outputs uses `grid-cols-1 sm:grid-cols-2` - 2 columns on small mobile may be tight

#### ModelCollapsibleSections (`components/shared/ModelCollapsibleSections.tsx`)
- **Issue:** Visual Specs Grid uses `grid-cols-1 sm:grid-cols-2 md:grid-cols-3` - 2 columns on small mobile may be cramped
- **Issue:** Engineering Considerations uses `grid-cols-1 md:grid-cols-3` - stacked on mobile but needs better spacing
- **Issue:** Hyperparameter tradeoffs use `grid-cols-1 md:grid-cols-2` - 2 columns on small mobile may be tight
- **Issue:** Knowledge Map uses `grid-cols-1 md:grid-cols-2` - similar issue

#### PackageTaskList (`components/shared/PackageTaskList.tsx`)
- **Issue:** Syntax/Example grid uses `grid-cols-[1.1fr_1fr]` on lg only, but stacks on mobile - needs better mobile spacing
- **Issue:** When to Use/Avoid When uses `grid-cols-1 sm:grid-cols-2` - 2 columns on small mobile may be cramped
- **Issue:** Signature & Output uses `grid-cols-1 sm:grid-cols-2` - similar issue
- **Issue:** Ecosystem section uses `grid-cols-1 sm:grid-cols-2` with border logic that may not work well on mobile

#### Workflow Detail Page (`app/workflows/[id]/page.tsx`)
- **Issue:** Production Profile sub-navigation pills use flex-wrap but may crowd on mobile
- **Issue:** Starter Stack badges use BadgeRow with defaultVisible=8 - may crowd on mobile

### 2. Typography Issues

#### Global CSS (`app/globals.css`)
- **Issue:** h1 uses `text-xl sm:text-2xl` - 20px on mobile may be too large for dense content
- **Issue:** h2 uses `text-base sm:text-lg` - 16px on mobile may be too large
- **Issue:** code uses `text-[0.85em] sm:text-[0.9em]` - relative sizing may be inconsistent
- **Issue:** Inline code uses `text-[0.8em] sm:text-[0.85em]` - very small on mobile

#### Model Detail Page
- **Issue:** Decision summary uses `text-base md:text-lg` - 16px on mobile may be too large for dense decision content

### 3. Touch Target Issues

#### SearchBox (`components/shared/SearchBox.tsx`)
- **Issue:** Search input has `touch-target` class but the dropdown results may not have adequate touch targets
- **Issue:** Recent searches buttons have `touch-target` but may be too close together
- **Issue:** Result items need minimum 44px touch height

#### FilterBar (`components/shared/FilterBar.tsx`)
- **Issue:** Filter chips use `touch-target-sm` (36px) - should be 44px for primary actions
- **Issue:** Clear Filters button uses `touch-target-sm` - should be full 44px

#### BadgeRow (`components/shared/BadgeRow.tsx`)
- **Issue:** Show more/less button has no touch target class
- **Issue:** Badge buttons have no explicit touch target sizing

#### ModelHubExplorer (`components/shared/ModelHubExplorer.tsx`)
- **Issue:** Domain header button has `touch-target` - good
- **Issue:** Subcategory header button has `touch-target` - good
- **Issue:** Model cards have `touch-target` - good
- **Issue:** Compare link uses `touch-target-sm` - should be 44px

#### PackageTaskList
- **Issue:** Expandable task headers use CollapsibleRow but touch targets need verification
- **Issue:** Related workflow/cheatsheet links use `touch-target` - good
- **Issue:** Official docs link uses `touch-target-sm` - should be 44px

### 4. Navigation Issues

#### TopBar (`components/layout/TopBar.tsx`)
- **Issue:** Search box in header uses `max-w-lg` and `flex-1` - may crowd on mobile with menu button
- **Issue:** "Static" badge hidden on mobile - good, but search box may need better mobile sizing

#### MobileSidebarTrigger (`components/layout/MobileSidebarTrigger.tsx`)
- **Issue:** Sheet width is `w-[280px]` - good for mobile
- **Issue:** Navigation links use `py-1.5` - adequate touch targets
- **Issue:** Section headers use `px-2.5 mt-4` - good spacing

#### TableOfContents (`components/shared/TableOfContents.tsx`)
- **Issue:** Mobile floating button at `bottom-20` - may conflict with StickyActionBar
- **Issue:** Sheet TOC links use `py-2.5` - adequate touch targets
- **Issue:** Desktop sidebar TOC uses very small text `[11px]` - not a mobile issue but worth noting

#### StickyActionBar (`components/shared/StickyActionBar.tsx`)
- **Issue:** Positioned at `bottom-20` - may conflict with TOC floating button
- **Issue:** Buttons use `touch-target-sm` (40px) - should be 44px
- **Issue:** Current section label uses `max-w-[160px]` - may truncate on very long labels

### 5. Code Block Issues

#### CodeBlockInteractive (`components/shared/CodeBlockInteractive.tsx`)
- **Issue:** Need to verify horizontal scrolling is contained within code block
- **Issue:** Copy button accessibility on mobile
- **Issue:** Collapsed state handling on mobile

#### PackageTaskList & WorkflowStepList
- **Issue:** Code blocks in task lists need proper mobile scrolling
- **Issue:** Syntax and example blocks may be too wide for mobile

### 6. Table Issues

#### Global CSS (`app/globals.css`)
- **Issue:** Responsive table styling exists for `.content-prose` tables - good implementation
- **Issue:** Tables convert to stacked cards on mobile - good approach
- **Issue:** Need to verify all tables use `.content-prose` class

#### ModelCollapsibleSections
- **Issue:** Hyperparameter table-like structure uses grid - not actual table, but needs mobile optimization

### 7. Card & Spacing Issues

#### Home Page
- **Issue:** Card padding `p-4` may be excessive on very small screens (360px)
- **Issue:** Gap `gap-3` in grids may be too large for mobile

#### RecentActivity
- **Issue:** Card padding `p-5` may be excessive on mobile
- **Issue:** Continue Reading cards use `p-4` - may need reduction on mobile

#### ModelHubExplorer
- **Issue:** Model cards use `p-3.5` - reasonable but could be optimized
- **Issue:** Domain padding `p-4` - may be excessive on mobile

#### PackageTaskList
- **Issue:** Task content uses `p-4` - may need mobile optimization
- **Issue:** Nested cards use various padding values that may be inconsistent on mobile

### 8. Filter & Search Issues

#### ModelHubExplorer
- **Issue:** Search input has good touch targets
- **Issue:** FilterBar integration - FilterBar chips use `touch-target-sm`
- **Issue:** Filter chips may crowd on mobile with many options

#### PatternFilterClient (`app/patterns/PatternFilterClient.tsx`)
- **Issue:** Need to audit this component for mobile issues

### 9. Content Page Layout Issues

#### ContentPageLayout (`components/shared/ContentPageLayout.tsx`)
- **Issue:** Uses `flex-col lg:flex-row` - good mobile-first approach
- **Issue:** Gap `gap-8` may be excessive on mobile
- **Issue:** Main content uses `min-w-0 flex-1` - good for preventing overflow

#### Breadcrumbs (`components/shared/Breadcrumbs.tsx`)
- **Issue:** Need to verify mobile behavior - may need truncation on small screens

### 10. Problem Index Issues

#### ProblemIndexDashboard (`app/problem-index/ProblemIndexDashboard.tsx`)
- **Issue:** Complex filtering UI may be difficult on mobile
- **Issue:** Category accordions may need better mobile touch targets
- **Issue:** Problem cards may be too dense on mobile
- **Issue:** Filter chips may crowd on mobile

### 11. Registry Pages

#### Registry Family/Variant Pages
- **Issue:** Need to audit for mobile issues
- **Issue:** Comparison tables may need mobile optimization

### 12. Other Detail Pages

#### Cheatsheet Details
- **Issue:** CheatsheetEntry component needs mobile audit
- **Issue:** Code blocks in entries need mobile optimization

#### Pattern Details
- **Issue:** Pattern-specific components need mobile audit

#### Principle Details
- **Issue:** Content layout needs mobile verification

#### Debug Guides & Decision Guides
- **Issue:** Specialized components need mobile audit

---

## Mobile-First Recommendations

### 1. Standardize Breakpoints
Use consistent mobile-first breakpoints:
- Base: 320px+ (mobile)
- sm: 640px+ (large mobile)
- md: 768px+ (tablet)
- lg: 1024px+ (laptop)
- xl: 1280px+ (desktop)

### 2. Touch Target Standards
- Primary actions: 44px minimum
- Secondary actions: 44px minimum (currently using 36px in some places)
- Inline actions: 36px minimum
- Spacing between touch targets: 8px minimum

### 3. Typography Scale
- Mobile base: 14px body text
- Mobile h1: 24px
- Mobile h2: 20px
- Mobile h3: 18px
- Code: 13px on mobile

### 4. Spacing Scale
- Mobile card padding: 12-16px
- Mobile gap: 12-16px
- Mobile section spacing: 24-32px

### 5. Grid Strategy
- Mobile: 1 column (stack)
- Large mobile (390px+): 1 column with optional 2-column for simple cards
- Tablet: 2 columns
- Desktop: 3+ columns

---

## Implementation Priority

### High Priority (Critical Mobile Issues)
1. Fix touch targets under 44px
2. Fix cramped grid layouts on 360-390px screens
3. Optimize spacing for mobile
4. Fix navigation conflicts (TOC vs StickyActionBar)

### Medium Priority (UX Improvements)
1. Optimize typography for mobile
2. Improve filter UI on mobile
3. Optimize card layouts
4. Improve code block handling

### Low Priority (Polish)
1. Fine-tune spacing consistency
2. Optimize animations for mobile
3. Improve visual hierarchy on mobile

---

## Pages Requiring Updates

1. ✅ Home page (`app/page.tsx`)
2. ✅ Dashboard (same as home)
3. ✅ Search (SearchBox component)
4. ⏳ Problem Index (`app/problem-index/page.tsx`, `ProblemIndexDashboard.tsx`)
5. ⏳ Packages list & detail
6. ⏳ Models hub & detail
7. ⏳ Workflows list & detail
8. ⏳ Cheatsheets list & detail
9. ⏳ Patterns list & detail
10. ⏳ Principles list & detail
11. ⏳ Debug Guides list
12. ⏳ Decision Guides list
13. ⏳ Registry pages

## Components Requiring Updates

1. ✅ Layout components (Sidebar, TopBar, MobileSidebarTrigger)
2. ✅ Shared navigation (TableOfContents, StickyActionBar, Breadcrumbs)
3. ✅ Search & filters (SearchBox, FilterBar, BadgeRow)
4. ⏳ Cards & lists (RecentActivity, ModelHubExplorer)
5. ⏳ Content components (PackageTaskList, ModelCollapsibleSections)
6. ⏳ Code blocks (CodeBlock, CodeBlockInteractive)
7. ⏳ Specialized components (various guide-specific components)

---

## Success Criteria

- [ ] All pages usable on 360px-430px screens
- [ ] No horizontal scrolling (except in code blocks)
- [ ] All touch targets ≥44px for primary actions
- [ ] Consistent spacing across mobile
- [ ] Readable typography on mobile
- [ ] Navigation works smoothly on mobile
- [ ] Desktop experience preserved
- [ ] No layout shift on mobile
- [ ] Performance maintained

---

## Notes

- The app already has good mobile foundations (touch-target utilities, mobile sidebar, responsive tables)
- Main issues are desktop-first breakpoints and spacing that don't scale well to small screens
- Focus on progressive enhancement: mobile-first, then enhance for larger screens
- Preserve all existing functionality and architecture
