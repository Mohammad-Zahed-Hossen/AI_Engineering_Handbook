---
id: architecture-design-principles
title: Design Principles
type: architecture
status: active
owner: system
canonical: true
version: 2.0
related:
  - architecture-overview
  - architecture-components
ai_priority: 4
---

# Design Principles

**Date**: 2026-06-29
**Version**: 2.0

---

## Core Principles

### 1. Static-First Architecture

**Principle**: All content is statically generated at build time.

**Rationale**:
- Zero server-side rendering overhead
- Fast initial page loads
- No database or backend required
- Simple deployment (static hosting)

**Implementation**:
- All routes use `generateStaticParams()`
- Content stored as JSON files
- Navigation indexes pre-built
- Search index built at build time

---

### 2. Local-First Data

**Principle**: All content is stored as local JSON files, no external APIs.

**Rationale**:
- Zero API costs
- No network latency
- Version-controlled content
- Offline capability
- Privacy (no data leaves local machine)

**Implementation**:
- Content in `data/` directory
- JSON files for all content types
- Zod schemas for validation
- Git for version control

---

### 3. Content-First Design

**Principle**: The application is a navigational layer to official documentation.

**Rationale**:
- Don't duplicate documentation
- Link to authoritative sources
- Focus on navigation and discovery
- Reduce maintenance burden

**Implementation**:
- `official_docs` fields link to official documentation
- `sources` fields cite references
- Cross-linking via ContentRef
- External resource categorization

---

### 4. Performance Optimization

**Principle**: Optimize for fast navigation and search.

**Rationale**:
- Large content catalogs (500+ packages)
- Need instant navigation
- Search must be responsive
- Mobile performance matters

**Implementation**:
- `_nav.json` lightweight indexes
- React.cache() for data loading
- Inverted index for search
- Item limits in navigation (12 visible)
- Alphabetical grouping for large lists

---

### 5. Type Safety

**Principle**: Strong typing at both compile time and runtime.

**Rationale**:
- Catch errors early
- IDE autocomplete support
- Runtime validation
- Maintainable codebase

**Implementation**:
- TypeScript types in `types/`
- Zod schemas in `lib/schemas/`
- Type-sync enforced (types ↔ schemas)
- ContentRef type for cross-links

---

### 6. Modularity

**Principle**: Components and functions have single responsibilities.

**Rationale**:
- Easy to understand
- Easy to test
- Easy to maintain
- Reusable across contexts

**Implementation**:
- Layout components (Sidebar, TopBar)
- Shared components (SearchBox, CodeBlock)
- UI components (shadcn/ui)
- Utility functions (lib/utils.ts)

---

### 7. Progressive Disclosure

**Principle**: Show only what's needed, reveal more on demand.

**Rationale**:
- Reduce cognitive load
- Improve mobile experience
- Faster initial renders
- Cleaner UI

**Implementation**:
- Collapsible sections (Sidebar, ModelCollapsibleSections)
- Item limits with "See all" links
- Expandable cheatsheet entries
- Sticky action bar for mobile

---

### 8. Accessibility

**Principle**: Keyboard-first, screen-reader friendly.

**Rationale**:
- Inclusive design
- Power user efficiency
- Legal compliance
- Better UX for all

**Implementation**:
- Keyboard navigation in search
- Semantic HTML
- ARIA labels where needed
- Focus management

---

### 9. Mobile-First

**Principle**: Design for mobile first, enhance for desktop.

**Rationale**:
- Mobile usage is significant
- Touch interactions differ
- Screen real estate limited
- Performance critical

**Implementation**:
- Mobile sidebar trigger (Sheet component)
- Mobile card views for tables
- Sticky action bar
- Responsive layouts
- Touch-friendly targets

---

### 10. Validation-First

**Principle**: Validate content before it enters the system.

**Rationale**:
- Prevent bad data
- Catch errors early
- Maintain data quality
- Reduce debugging time

**Implementation**:
- Prebuild validation script
- Zod schema validation
- Naming convention checks
- Placeholder detection
- Minimum content quality rules
- ContentRef integrity checks

---

## Anti-Patterns

### What We Avoid

1. **External APIs**: No fetch calls to external services
2. **Databases**: No SQL, NoSQL, or ORM
3. **Server-Side Rendering**: All routes are static
4. **Client-Side Only**: No SPA routing, use Next.js App Router
5. **Hardcoded Data**: All content in version-controlled JSON
6. **Duplicate Documentation**: Link to official sources instead
7. **Monolithic Components**: Break down into smaller, focused components
8. **Unvalidated Content**: All content must pass validation
9. **Broken Links**: ContentRef integrity enforced
10. **Magic Numbers**: Use constants and configuration

---

## Component Design Patterns

### Composition Pattern

Use composition over inheritance:

```typescript
// Good
<ContentPageLayout>
  <Breadcrumbs />
  <TableOfContents />
  <StickyActionBar />
  {children}
</ContentPageLayout>

// Bad
<PageWithBreadcrumbsAndTOCAndActionBar />
```

### Cache Pattern

Use React.cache() for expensive operations:

```typescript
export const getPackage = cache(function getPackage(id: string) {
  return readJSON<Package>(path.join(dataDir, 'packages', `${id}.json`));
});
```

### Fallback Pattern

Always provide fallbacks for missing data:

```typescript
if (!fs.existsSync(navPath)) {
  return getAllPackageIds().map(id => ({ id, name: id }));
}
```

### Type-Safe Cross-Links

Use ContentRef instead of strings:

```typescript
// Good
{ id: "numpy", type: "package" }

// Bad
"numpy"
```

---

## Related Documentation

- **System Overview**: See `architecture/overview.md`
- **Component Architecture**: See `architecture/components.md`
- **Data Flow**: See `architecture/data-flow.md`
