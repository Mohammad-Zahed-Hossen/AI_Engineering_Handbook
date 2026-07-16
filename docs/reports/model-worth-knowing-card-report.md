# Model Page "Also Worth Knowing" Card Report

## Overview

The "Also Worth Knowing" card is a collapsible section on the Model detail page that provides cross-referenced knowledge connections to help users discover related content within the AI Engineering Handbook ecosystem.

## Location

- **File**: `components/shared/ModelCollapsibleSections.tsx`
- **Section ID**: `related-knowledge`
- **Route**: `/models/{category}/{model-id}`

## Component Structure

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

### Knowledge Sections Displayed

| Section | Link Type | Description |
|---------|-----------|-------------|
| Related Models | Internal link | Models with similar architecture or purpose |
| Alternative Models | Internal link | Different approaches to the same problem |
| Related Principles | Plain text | Foundational concepts (e.g., Bias-Variance Trade-off) |
| Related Workflows | Plain text | Process patterns (e.g., Classification Pipeline) |
| Related Patterns | Plain text | Design patterns (e.g., Cross Validation) |
| Related Packages | Plain text | Implementation libraries (e.g., scikit-learn) |
| Related Guides | Plain text | Debug guides and decision guides |
| Related Registry | Plain text | Registry entries |

### Link Resolution
- **Model sections** (`Related Models`, `Alternative Models`) use `resolveModelByName()` to generate internal links
- Links follow the pattern: `/models/{category}/{resolved-slug}`
- Non-model items display as plain text tags without navigation

## Example: Decision Tree Model

The Decision Tree model shows:
- **Related Models**: DecisionTreeClassifier, DecisionTreeRegressor, Random Forest, Extra Trees, Gradient Boosting Trees
- **Alternative Models**: Logistic Regression, Support Vector Machine, Random Forest, Gradient Boosting, XGBoost, LightGBM
- **Related Principles**: Bias-Variance Trade-off, Divide-and-Conquer, Information Theory, Entropy, Greedy Optimization
- **Related Workflows**: Classification Pipeline, Regression Pipeline, Feature Engineering, Model Evaluation, Hyperparameter Optimization
- **Related Patterns**: Cross Validation, Feature Selection, Pipeline Pattern
- **Related Packages**: scikit-learn, XGBoost, LightGBM, CatBoost
- **Related Guides**: Overfitting Debug Guide, Class Imbalance Guide

## User Experience

1. **Default State**: Collapsed with no teaser text
2. **Interaction**: Click header to expand/collapse
3. **Navigation**: Click on model names to navigate to related model pages
4. **Visual Feedback**: Hover states on tags, color-coded borders

## Integration Points

- Uses `CollapsibleRow` component for consistent expand/collapse behavior
- Integrates with `ProseClient` and `ProseInline` for text rendering
- Works with `resolveModelByName()` from `lib/data.ts` for slug resolution
- Part of the `ModelCollapsibleSections` component alongside:
  - Core Understanding
  - Engineering Considerations
  - Hyperparameters
  - Model Comparisons

## Purpose

This card serves as a knowledge discovery tool, helping users:
- Find alternative models for comparison
- Understand foundational principles behind the model
- Discover relevant workflows and patterns
- Identify useful packages and guides
- Navigate the interconnected knowledge graph of the handbook