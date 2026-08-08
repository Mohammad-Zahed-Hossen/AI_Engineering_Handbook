# CodeBlock System Audit Report

## Executive Summary

The CodeBlock system in AENS is a well-architected, production-ready component that provides syntax highlighting, copy functionality, theme switching, and responsive code display. It uses a three-component architecture (Server, Client, Interactive) to support both server-side and client-side rendering patterns while maintaining consistent UI/UX across the application.

---

## Overall Purpose

The CodeBlock component serves as the primary code display mechanism throughout AENS, providing:
- Syntax-highlighted code snippets using Shiki
- Dual-theme support (dark/light)
- Copy-to-clipboard functionality
- Collapsible long code blocks
- Language-specific iconography
- Responsive mobile-first design

---

## Usage Across AENS

The CodeBlock system is used extensively across 7+ content types:

1. **Package pages** (`app/packages/[id]/page.tsx`) - Displays syntax and example code for package tasks
2. **Cheatsheet entries** (`app/cheatsheets/[id]/CheatsheetEntryList.tsx`) - Uses `CodeBlockClient` for client-side rendering of code snippets
3. **QuickSetupSection** - Shows installation and import commands (bash/python)
4. **Model pages** (`app/models/[category]/[id]/page.tsx`) - Displays quickstart code examples
5. **Pattern pages** (`app/patterns/[id]/page.tsx`) - Shows pattern examples with line numbers enabled
6. **Workflow pages** (`app/workflows/[id]/page.tsx`) - Displays workflow code examples with filenames
7. **WorkflowStepList** - Uses `CodeBlockInteractive` directly for highlighted code in collapsible sections

---

## UI/UX Design and Interaction Patterns

### Core Features

**Copy Button**
- Located in header bar, right-aligned
- Shows Copy icon → changes to Check icon on success
- Green feedback state (`text-emerald-400 bg-emerald-500/10`)
- 2-second timeout for feedback reset
- Uses `navigator.clipboard.writeText()` API

**Theme Toggle**
- Sun/Moon icon toggle for dark/light themes
- Hidden on mobile (`hidden sm:flex`) for cleaner UI
- Persists per-component state (not global)
- Instant theme switching with smooth transitions

**Syntax Highlighting**
- Uses Shiki library with GitHub themes (`github-dark`, `github-light`)
- Language normalization (py→python, sh/bash→bash, etc.)
- Fallback to escaped HTML if highlighting fails
- Generates both themes server-side for performance

**Code Collapsing**
- Auto-collapses code >7 lines (configurable via `MAX_COLLAPSED_LINES`)
- Gradient fade overlay at bottom of collapsed state
- "Show More/Show Less" toggle button with chevron animation
- Scroll position compensation to prevent jump on collapse
- Plain text (`language='text'`) bypasses collapsing

**Line Numbers**
- Optional prop (`showLineNumbers`)
- Adjusts padding when enabled
- Currently used in Pattern pages

### Responsive Design

- Mobile-first approach with conditional classes
- Header: `px-2.5 py-1.5 sm:px-3 sm:py-2`
- Code font: `text-[12px] sm:text-[13px]`
- Line count badge: `hidden sm:inline-flex`
- Theme toggle: `hidden sm:flex`
- Copy button: `w-8 h-8 sm:w-9 sm:h-9`
- Custom scrollbar styling with thin dimensions

### Visual Hierarchy

**Header Bar**
- Language icon + label (left)
- Line count badge (center, hidden on mobile)
- Action buttons (right: theme toggle, copy)
- Background: `bg-zinc-900/40` (dark) / `bg-zinc-50/80` (light)
- Border: `border-zinc-800/60` (dark) / `border-zinc-200` (light)

**Code Container**
- Monospace font (`font-mono`)
- Leading: `leading-relaxed`
- Padding: `px-2.5 py-2 sm:px-4 sm:py-3`
- Horizontal scroll for overflow
- Custom scrollbar styling

**Expand Button**
- Full-width, bottom-aligned
- Uppercase tracking-wide text
- Chevron icon with rotation animation
- Hover states with background color change

---

## Component Architecture

### Three-Component Pattern

**1. CodeBlock.tsx (Server Component)**
- Entry point for server-side usage
- Calls `highlightCodeSnippet()` to generate HTML
- Passes pre-rendered HTML to `CodeBlockInteractive`
- No client-side JavaScript

**2. CodeBlockClient.tsx (Client Component)**
- Wrapper for client-side rendering
- Uses `useEffect` to trigger highlighting
- Shows loading state during async operation
- Delegates to `CodeBlockInteractive` after data loads

**3. CodeBlockInteractive.tsx (Client Component)**
- Handles all interactive features (copy, theme, expand)
- Manages component state (copied, expanded, theme)
- Receives pre-rendered HTML as props
- Purely presentational with interaction logic

### Key Design Decisions

- **Separation of concerns**: Highlighting (server) vs. interaction (client)
- **Performance**: Syntax highlighting happens once, cached as HTML
- **Flexibility**: Supports both server and client rendering patterns
- **Reusability**: `CodeBlockInteractive` can be used directly with pre-highlighted data

### Props Interface

```typescript
interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}
```

---

## Strengths

1. **Performance**: Server-side syntax highlighting reduces client-side processing
2. **Flexibility**: Three-component pattern supports both SSR and CSR use cases
3. **UX Polish**: Copy feedback, smooth animations, scroll compensation
4. **Accessibility**: ARIA labels, keyboard-accessible buttons
5. **Mobile-First**: Responsive design with appropriate mobile optimizations
6. **Error Handling**: Graceful fallback if Shiki highlighting fails
7. **Developer Experience**: Simple API, sensible defaults
8. **Visual Polish**: Consistent with AENS design system (zinc color palette)

---

## Weaknesses

1. **Theme State**: Theme is per-component, not global (user must toggle per block)
2. **No Line Numbers in Default**: Line numbers are optional but not consistently used
3. **Fixed Collapse Threshold**: 7-line threshold is hardcoded, not configurable
4. **No Code Search**: No ability to search within code blocks
5. **Limited Language Icons**: Only 5 languages have specific icons (others use generic)
6. **No Syntax Error Detection**: Doesn't validate or highlight syntax errors
7. **Loading State**: Client version shows generic loading, no skeleton UI
8. **No Fullscreen Mode**: Cannot expand code blocks to fullscreen for better readability

---

## Opportunities for Improvement

1. **Global Theme Persistence**: Store theme preference in localStorage/context
2. **Configurable Collapse Threshold**: Expose `maxCollapsedLines` as prop
3. **Enhanced Language Support**: Add icons for TensorFlow, PyTorch, Keras
4. **Code Search**: Add search/filter within code blocks
5. **Fullscreen Mode**: Add expand-to-fullscreen option for large code blocks
6. **Syntax Validation**: Integrate linters for real-time error highlighting
7. **Skeleton Loading**: Replace generic loading with skeleton UI
8. **Copy Feedback Toast**: Show toast notification instead of icon-only feedback
9. **Keyboard Shortcuts**: Add shortcuts (Ctrl+C, Ctrl+D for duplicate)
10. **Code Diff Mode**: Support before/after code comparison

---

## Recommendations for Neural Network Architecture Explorer

### 1. Adapt to Glassmorphism UI

**Current AENS**: Dark zinc palette with solid backgrounds
**Target**: Light glassmorphism with transparency

**Required Changes**:
- Replace `bg-zinc-950/95` with `bg-white/70 backdrop-blur-md`
- Replace `bg-zinc-900/40` with `bg-white/50 backdrop-blur-sm`
- Update border colors to subtle glass borders (`border-white/20`)
- Adjust text colors for light theme (darker zinc for contrast)
- Remove dark theme toggle (single light theme)

**Example Theme Classes**:
```typescript
const glassmorphismClasses = "bg-white/70 backdrop-blur-md border-white/20 shadow-lg";
const headerGlassClasses = "bg-white/50 backdrop-blur-sm border-white/10";
```

### 2. TensorFlow/Keras Language Support

**Add Language Icons**:
- TensorFlow: Custom icon or generic tensor icon
- Keras: Custom icon or generic neural network icon
- PyTorch: Custom icon or flame icon

**Language Normalization**:
```typescript
const normalizeLang = (lang: string) => {
  const l = lang.toLowerCase();
  if (l === 'tf' || l === 'tensorflow') return 'python';
  if (l === 'keras') return 'python';
  if (l === 'pytorch') return 'python';
  // ... existing mappings
};
```

### 3. Production-Oriented Features

**Add File Context**:
- Always show filename prop for transfer learning scripts
- Display model architecture name in header
- Show dataset name if applicable

**Enhanced Copy Feedback**:
- Add toast notification: "Copied ResNet50 transfer learning script"
- Include model name in feedback for context

**Code Metadata**:
- Show execution time estimate (if available)
- Display required GPU memory (if available)
- Link to model documentation

### 4. Educational Enhancements

**Inline Comments**:
- Highlight comments differently (lighter color)
- Support collapsible comment sections
- Add "Explain this code" tooltip for key sections

**Code Annotations**:
- Add ability to highlight specific lines
- Show tooltips on hover for complex operations
- Link to documentation for key functions

**Progressive Disclosure**:
- Start with minimal transfer learning example
- "Show advanced options" expand button
- Collapse data preprocessing sections by default

### 5. Usability Improvements

**Increase Collapse Threshold**:
- Transfer learning scripts are typically 20-50 lines
- Set `MAX_COLLAPSED_LINES` to 15-20
- Or make it configurable per content type

**Always Show Line Numbers**:
- Essential for debugging transfer learning scripts
- Enable by default for all code blocks

**Add Copy Options**:
- Copy full script
- Copy model architecture only
- Copy training loop only

**Responsive Code Font**:
- Use slightly larger font for readability: `text-[13px] sm:text-[14px]`
- Increase line height for complex code: `leading-loose`

### 6. Implementation Recommendations

**Simplified Architecture**:
- Use only `CodeBlock` (server component) for better performance
- Pre-highlight all code at build time if possible
- Remove `CodeBlockClient` unless client-side rendering is needed

**Glassmorphism-Specific Styling**:
```typescript
const glassTheme = {
  container: "bg-white/70 backdrop-blur-xl border-white/20 shadow-xl rounded-xl",
  header: "bg-white/50 backdrop-blur-md border-white/10",
  button: "text-zinc-600 hover:text-zinc-900 hover:bg-white/60",
  code: "text-zinc-800",
};
```

**Remove Dark Theme**:
- Delete theme toggle button
- Remove `isDarkTheme` state
- Use only light theme classes
- Simplify component logic

**Add Model-Specific Props**:
```typescript
interface NeuralCodeBlockProps {
  code: string;
  language: 'python' | 'pytorch';
  modelName: string;
  dataset?: string;
  executionTime?: string;
  gpuMemory?: string;
}
```

---

## Conclusion

The AENS CodeBlock system is a solid foundation with excellent architecture and UX polish. For the Neural Network Architecture Explorer, the key adaptations are:

1. **Visual**: Replace dark theme with glassmorphism styling
2. **Content**: Add TensorFlow/Keras language support and model-specific metadata
3. **UX**: Increase collapse threshold, always show line numbers, enhance copy feedback
4. **Simplification**: Remove dark theme toggle, use server component only

The three-component architecture should be retained for flexibility, but the implementation should be simplified to focus on the single light theme with glassmorphism styling.

---

## Implementation Priority

**High Priority**:
1. Glassmorphism styling adaptation
2. Remove dark theme toggle
3. Add TensorFlow/Keras language icons
4. Increase collapse threshold to 15-20 lines
5. Always enable line numbers

**Medium Priority**:
6. Add model-specific metadata display
7. Enhance copy feedback with context
8. Add progressive disclosure for advanced options

**Low Priority**:
9. Code search functionality
10. Fullscreen mode
11. Syntax validation integration
