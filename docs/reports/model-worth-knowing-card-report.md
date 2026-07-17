# Model Page "Also Worth Knowing" Card Report

## Overview

The "Also Worth Knowing" card is a collapsible section on the Model detail page that provides cross-referenced knowledge connections to help users discover related content within the AI Engineering Handbook ecosystem.

## Location

- **File**: `components/shared/ModelCollapsibleSections.tsx` (lines 521-572)
- **Section ID**: `related-knowledge`
- **Route**: `/models/{category}/{model-id}`

## Component Structure

### Props Interface
```typescript
interface ModelCollapsibleSectionsProps {
  model: Model;
  relatedKnowledgeLinks?: {
    relatedmodels: Array<{ name: string; slug: string | null }>;
    alternative_models: Array<{ name: string; slug: string | null }>;
  };
  category?: ModelCategory;
  resolvedKnowledgeLinks?: Record<string, string>;  // Server-resolved links
}
```

### Reusable `RelatedItem` Component (lines 37-59)
A de-duplicated sub-component that handles both linked and plain text items:
- **With href**: Renders as a Next.js `Link` with pointer cursor and focus ring
- **Without href**: Renders as a plain `span` with muted styling

### Data Source
The card pulls data from the `relatedknowledge` field in the model JSON schema:

```typescript
relatedknowledge: {
  relatedmodels: string[]
  alternative_models: string[]
  related_principles: string[]
  related_workflows: string[]
  related_patterns: string[]
  related_packages: string[]
  related_guides: string[]
  related_registry: string[]
}
```

### Visual Design
- **Icon**: `Link` (from lucide-react)
- **Layout**: Grid with 2 columns on medium screens, 1 column on mobile
- **Styling**: Small text (10px), monospace font, border tags with hover states
- **Accessibility**: `focus-visible:ring-1 focus-visible:ring-ring` for keyboard navigation

### Knowledge Sections Displayed

| Section | Link Type | Route Pattern |
|---------|-----------|---------------|
| Related Models | Internal link | `/models/{category}/{slug}` |
| Alternative Models | Internal link | `/models/{category}/{slug}` |
| Related Principles | Internal link | `/principles/{id}` |
| Related Workflows | Internal link | `/workflows/{id}` |
| Related Patterns | Internal link | `/patterns/{id}` |
| Related Packages | Internal link | `/packages/{id}` |
| Related Guides | Internal link | `/debug-guides/{id}` or `/decision-guides/{id}` |
| Related Registry | Internal link | `/registry/families/{family}/{variant}` |

## Server-Side Resolution

### `getRelatedKnowledgeResolver()` in `lib/data.ts`
- Creates a unified resolver for all knowledge types
- Performs case-insensitive, punctuation/spacing-tolerant matching
- Returns `null` for unresolved items (graceful fallback)

### Resolution Flow in `page.tsx` (lines 82-102)
```typescript
const resolver = getRelatedKnowledgeResolver();
const resolvedKnowledgeLinks: Record<string, string> = {};
const resolveAndAdd = (type, names) => {
  names.forEach(name => {
    const href = resolver.resolve(type, name);
    if (href) resolvedKnowledgeLinks[name] = href;
  });
};
```

## User Experience

1. **Default State**: Collapsed with no teaser text
2. **Interaction**: Click header to expand/collapse
3. **Navigation**: Click on any resolved item to navigate to its page
4. **Visual Feedback**: Hover states on tags, focus rings for keyboard users
5. **Empty State**: Shows "No related resources available." when all sections are empty
6. **Empty Sections**: Hidden from view when individual sections have no items

## Integration Points

- Uses `CollapsibleRow` component for consistent expand/collapse behavior
- Integrates with `ProseClient` and `ProseInline` for text rendering
- Works with `getRelatedKnowledgeResolver()` from `lib/data.ts` for slug resolution
- Part of the `ModelCollapsibleSections` component alongside:
  - Core Understanding
  - Engineering Considerations
  - Hyperparameters
  - Model Comparisons

## Improvements Made

1. **Extended Clickable Relationships**: All knowledge types now support internal navigation (previously only models)
2. **De-duplicated UI Code**: Single `RelatedItem` component replaces resource-specific rendering
3. **Accessibility**: Added focus-visible styles for keyboard navigation
4. **Empty State Handling**: Graceful messaging when no related resources exist
5. **Backward Compatibility**: Preserved `relatedKnowledgeLinks` fallback for safety

## Purpose

This card serves as a knowledge discovery tool, helping users:
- Find alternative models for comparisoncccccccccccccccccccccccccc
- Understand foundational principles behind the model
- Discover relevant workflows and patterns
- Identify useful packages and guides
- Navigate the interconnected knowledge graph of the handbook