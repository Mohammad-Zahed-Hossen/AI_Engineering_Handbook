# Content Quality Standard

**Version:** 1.2  
**Status:** ACTIVE  
**Purpose:** Defines the quality bar for all AENS resources

---

# Purpose

This document defines what makes a resource "gold standard" in AENS. Every resource must satisfy this standard before publication. This is the contract that ensures consistency, quality, and maintainability across the knowledge base.

---

# General Principles

1. **Canonical, not comprehensive:** AENS contains flagship resources, not exhaustive documentation. Each resource should represent the best-in-class implementation.
2. **Engineer-first:** Write for practitioners who need to implement, not for learners who need theory.
3. **Actionable:** Every resource should enable the reader to complete a specific task.
4. **Accurate:** All code examples must be tested and working.
5. **Current:** All version references must be current and verified.
6. **Cross-linked:** Every resource must link to related resources where appropriate.

---

# Mandatory Sections by Content Type

## Package

**Required Sections:**
- `name` - Package name
- `version` - Current stable version
- `summary` - 1-2 sentence description of what the package does
- `install` - Installation command
- `import_as` - How to import in code
- `tasks` - Array of common tasks (minimum 1, maximum 15 per config)

**Each Task Must Include:**
- `task` - Task name (e.g., "Create tensor from array")
- `syntax` - Working code example
- `example` - Complete usage example
- `mental_trigger` - When to use this (optional but recommended)
- `use_when` - Use case description (optional but recommended)
- `avoid_when` - Anti-pattern description (optional but recommended)
- `important_params` - Key parameters (max 5)
- `gotchas` - Common pitfalls (array)
- `official_docs` - Link to official documentation (optional)

**Quality Standard:**
- All code examples must run without modification
- Document all high-value public APIs required to cover approximately 90–95% of production usage. The exact count depends on the package (e.g., NumPy may legitimately need 80–100 APIs, while Seaborn may only need 35–45 high-value APIs). Designing the standard around coverage rather than a fixed number will produce higher-quality package references.
- Installation command must be current
- Version must be the latest stable release

---

## Model

**Required Sections:**
- `id`, `title`, `name`, `slug`, `description`
- `decisionsummary` (containing `summary`, `bestusecases`, `avoidwhen`, `strengths` (minimum 3), `limitations` (minimum 3), `interpretability`, `trainingcharacteristics`, `inferencecharacteristics`, `computationalcharacteristics`)
- `coreunderstanding` (containing `intuition`, `learningmechanism`, `assumptions`, `mathematicalintuition`, `complexity`, `memorycomplexity`, `robustness`, `scalability`, `overfittingtendency`, `biasvariance`)
- `hyperparameters` (containing a list of hyperparameter objects, minimum 1 unless detection-only model, each with `name`, `purpose`, `increaseeffect`, `decreaseeffect`, `tradeoffs`, `tuningpriority`, `interactions`, `commonmistakes`)
- `engineeringconsiderations`
- `comparisons`
- `relatedknowledge`

**Optional Sections:**
- `quickstart` (copy-paste block containing `language`, `implementation_package`, `code`, `explanation`, `inputs`, `outputs`, `notes`)
- `learning_resources` (curated educational links with `title`, `url`, `type`, `why_to_read`, `expected_outcome`, `reading_time`)

**Quality Standard:**
- `strengths` and `limitations` must be specific, actionable, and have at least 3 items each.
- `bestusecases` and `avoidwhen` must be concrete, not generic.
- `quickstart` code snippets must be production-ready, runnable with minimal modification, and use scikit-learn (or canonical library) best practices.
- Curated `learning_resources` must have a clear educational purpose, constrained types, and no duplicates across `sources`.
- Hyperparameters must be the most influential ones for the model.
- **Visual Presentation & UX Standards:**
  - **Decision Strip**: Must render Difficulty, Stability, Confidence, and Maturity as semantic, icon-enriched badges (using Lucide icons `Gauge`, `Activity`, `CheckCircle2`, `Shield`). The detailed `interpretability` profile must be decoupled from the inline badge strip and rendered in a dedicated callout box with an `Eye` icon below it.
  - **Decision Board & Tradeoffs**: Must present Use When, Avoid When, Strengths, and Limitations as a unified 2x2 grid with clear indicators. Original IDs (`decision-guide` and `pros-cons`) must be kept on the container/parent nodes to support anchor navigation from the Table of Contents.
  - **Core Understanding Specs Sheet**: Must display metrics as a 3-column specs-sheet grid using custom icons (`Clock`, `Database`, `TrendingUp`, etc.) and a mathematical monospace callout.
  - **Hyperparameter Details**: Must provide global Expand/Collapse All triggers, side-by-side comparative increase/decrease columns (emerald/rose-tinted), and exact library API parameter key mappings as mono tags.
  - **Engineering Considerations**: Must be structured into distinct categorized panels (*Data & Preprocessing*, *Runtime & Scalability*, and *Pipeline Fit & Robustness*).
  - **Model Comparisons**: Must be styled as direct comparison cards with VS headers and clear prefer/choose guidelines.
  - **Recommended Next Section**: Must display curriculum progression recommendations from the `recommendednext` field, using the shared `CollapsibleRow` component for consistent expand/collapse behavior. Only renders when at least one recommendation resolves to a valid slug in the category.

---

## Workflow

**Required Sections:**
- `title` - Workflow name
- `category` - Engineering category (e.g., "LLM", "MLOps")
- `overview` - High-level description of what this workflow builds
- `starter_stack` - Minimum required tools/libraries
- `steps` - Array of steps (minimum 3, maximum 8 per config)

**Each Step Must Include:**
- `name` - Step name
- `description` - What this step accomplishes
- `tools` - Tools/libraries used
- `decisions` - Key decisions made
- `failure_points` - Common failure modes

**Quality Standard:**
- Steps must be in logical order
- Each step must be actionable
- Starter stack must be minimal (no unnecessary dependencies)
- Overview must clearly state what gets built

---

## Cheatsheet

**Required Sections:**
- `title` - Cheatsheet name
- `entries` - Array of entries (minimum 1, maximum 60)

**Each Entry Must Include:**
- `problem` - What problem this solves
- `trigger` - When you need this
- `snippet` - Working code example
- `minimal_notes` - 1-2 sentence explanation
- `common_bug` - Common mistake to avoid
- `docs_url` - Link to official documentation

**Quality Standard:**
- Snippets must be copy-paste ready
- Notes must be minimal (this is a cheatsheet, not a tutorial)
- Problems must be common use cases
- Links must point to the specific API documentation

---

## Pattern

**Required Sections:**
- `title` - Pattern name
- `concept` - What this pattern is
- `applicability` - When to apply this pattern

**Quality Standard:**
- Concept must be clear and concise
- Applicability must be concrete
- Anti-patterns must be real mistakes engineers make
- Implementation notes must be practical, not theoretical

---

## Debug Guide

**Required Sections:**
- `title` - Debug guide name
- `symptoms` - Array of symptoms (minimum 1)
- `root_causes` - Array of root causes (minimum 1)
- `solutions` - Array of solutions (minimum 1)

**Quality Standard:**
- Symptoms must be observable error messages or behaviors
- Root causes must be technically accurate
- Solutions must be tested and working
- Each solution must map to a specific root cause

---

## Decision Guide

**Required Sections:**
- `title` - Decision guide name
- `options` - Array of options (minimum 2)
- `evaluation_criteria` - Array of criteria (minimum 1)

**Quality Standard:**
- Options must be real alternatives engineers consider
- Criteria must be relevant decision factors
- Comparison must be fair and balanced
- Recommendation must be clear

---

## Principle

**Required Sections:**
- `title` - Principle name
- `statement` - The principle statement

**Quality Standard:**
- Statement must be concise and memorable
- Implications must be actionable
- Principle must be universally applicable in engineering

---

# Writing Style

## Tone

- **Direct:** Say what you mean, avoid hedging
- **Technical:** Use precise terminology
- **Practical:** Focus on implementation, not theory
- **Concise:** Respect the reader's time

## Format

- **Short paragraphs:** 2-3 sentences max
- **Bullet points:** Use for lists, not prose
- **Code blocks:** Always specify language
- **Bold for emphasis:** Use sparingly
- **No markdown headers within content:** Use the JSON structure

## Examples

**Good:**
```
problem: "Create a tensor from a NumPy array"
snippet: "x = torch.tensor(data, dtype=torch.float32, device='cuda')"
minimal_notes: "Instantiate tensors directly on target device to avoid PCIe bottleneck."
```

**Bad:**
```
problem: "Creating tensors"
snippet: "You can create tensors from arrays using torch.tensor()"
minimal_notes: "It's generally a good idea to think about where you want your tensors to live, because moving them later can be slow and inefficient due to the PCIe bandwidth limitations between CPU and GPU memory."
```

---

# Technical Accuracy Requirements

## Code Examples

- **Must be tested:** Every code snippet must run without modification
- **Must be current:** Use the latest stable API
- **Must be complete:** Include necessary imports
- **Must be copy-paste ready:** No "..." or "fill in the blanks"

## Version References

- **Packages:** Specify exact version (e.g., "2.12.0")
- **Models:** Specify version or date (e.g., "Llama 3 (2024)")
- **APIs:** Reference specific API version if applicable
- **Verification:** Update `verified_against` field when reviewing

## External Links

- **Official docs preferred:** Link to official documentation first
- **Specific pages:** Link to the specific API page, not the homepage
- **Stable URLs:** Use permalink URLs when available
- **Verify links:** Check that links are not broken

---

# Cross-Link Requirements

## Required Cross-Links

Every resource must link to related resources where appropriate:

- **Packages:** Link to related packages (alternatives), patterns used, debug guides for common errors
- **Models:** Link to packages that implement them, workflows that use them
- **Workflows:** Link to packages used, patterns applied, models employed
- **Cheatsheets:** Link to the package (via package_reference field)
- **Patterns:** Link to packages that implement them, workflows that use them
- **Debug Guides:** Link to packages/models where the error occurs
- **Decision Guides:** Link to the options being compared

## Bidirectional Relationships

If `A → uses → B`, then `B → used_by → A` must exist. This is enforced by validation.

## Relationship Types

Use appropriate relationship types:
- `uses` / `used_by` - Dependency
- `implements` / `implemented_by` - Implementation
- `alternative_to` - Alternatives
- `debugged_by` - Debugging relationship
- `references` - General reference
- `related_to` - Generic relationship

---

# Metadata Requirements

## Required Metadata (BaseMetaSchema)

All resources must include:
- `id` - Unique identifier (matches filename)
- `title` - Display title
- `name` - Short name
- `slug` - URL-friendly identifier
- `description` - 1-2 sentence description
- `tags` - Relevant tags (array)
- `aliases` - Alternative names (array)
- `keywords` - Search keywords (array)
- `search_tokens` - Additional search terms (array)
- `created_at` - Creation date (ISO 8601)
- `updated_at` - Last update date (ISO 8601)
- `last_verified` - Verification date (ISO 8601)
- `review_frequency` - Review cadence (quarterly/monthly/annual)
- `verified_against` - Version/date verified against
- `lifecycle` - draft/verified/stable/deprecated/archived
- `stability` - stable/semi_stable/volatile
- `confidence` - verified/production_proven/community_accepted/experimental/research
- `engineering_maturity` - research/experimental/emerging/production_ready/legacy

## Optional Metadata

- `domain` - Engineering domain (e.g., "ml", "data_engineering")
- `category` - Category within domain
- `difficulty` - beginner/intermediate/advanced/expert
- `engineering_area` - Specific area (e.g., "mlops", "computer_vision")
- `estimated_reading_time` - Minutes
- `prerequisites` - Required knowledge (array)
- `recommended_next` - What to read next (array)
- `related_content` - Related resources (array of ContentRef)
- `compatible_versions` - Compatible versions (array)
- `breaking_changes` - Known breaking changes (array)
- `canonical_status` - canonical/reference/generated
- `owner` - Team or individual owner
- `sources` - Source references (array)
- `github_repo` - GitHub repository URL

---

# Validation Checklist

Before committing any resource, run:

```bash
npm run validate
```

**Must Pass:**
- ✅ Schema validation (0 errors)
- ✅ Slug format validation
- ✅ Filename/ID consistency
- ✅ No placeholder text
- ✅ Minimum content quality
- ✅ No duplicate IDs or names
- ✅ Reference integrity (no broken links)
- ✅ **Bidirectional relationship integrity (no unidirectional relationships)**

**Warnings:**
- ⚠️ Duplicate docs_url (review but may be acceptable)
- ⚠️ Unregistered tags (add to tag registry if legitimate)

---

# Publication Checklist

Before marking a resource as ready for publication:

## Content Quality
- [ ] All code examples tested and working
- [ ] All external links verified
- [ ] All version references current
- [ ] Writing style follows guidelines
- [ ] No placeholder text
- [ ] No TODO or TBD comments

## Metadata Completeness
- [ ] All required metadata fields populated
- [ ] Tags are relevant and consistent
- [ ] Aliases cover common alternative names
- [ ] Keywords include search terms
- [ ] Search tokens include additional search terms
- [ ] Lifecycle set to "stable" (unless draft)
- [ ] Last verified date is current

## Cross-Links
- [ ] All related_content references exist
- [ ] Bidirectional relationships established
- [ ] Relationship types are appropriate
- [ ] No broken references

## Ownership
- [ ] Knowledge ownership is correct (per specification)
- [ ] No violation of ownership rules
- [ ] Content is in correct content type

## Review
- [ ] Technical accuracy verified
- [ ] Peer review completed (if applicable)
- [ ] Validation passes with 0 errors
- [ ] Ready for publication

---

# Review Checklist

For peer reviewers:

## Technical Accuracy
- [ ] Code examples are correct and current
- [ ] Technical claims are accurate
- [ ] Version references are correct
- [ ] External links are valid

## Content Quality
- [ ] Meets quality standard for content type
- [ ] Writing style is appropriate
- [ ] Examples are clear and actionable
- [ ] No unnecessary fluff

## Completeness
- [ ] All required sections present
- [ ] Minimum content quality met
- [ ] Cross-links are appropriate
- [ ] Metadata is complete

## Consistency
- [ ] Follows existing patterns
- [ ] Terminology is consistent
- [ ] Formatting is consistent
- [ ] Style matches other resources

---

# Quality Bar Definition

**Gold Standard Resource:**
- Passes all validation checks (0 errors)
- Meets all mandatory section requirements
- Has tested, working code examples
- Has appropriate cross-links
- Has complete metadata
- Has been peer-reviewed
- Follows writing style guidelines
- Is actionable and practical

**Not Ready for Publication:**
- Fails any validation check
- Missing required sections
- Has untested code examples
- Has broken cross-links
- Has incomplete metadata
- Has placeholder text
- Violates ownership rules

---

# Continuous Improvement

This standard is a living document. As we create more resources, we may refine this standard based on lessons learned.

**Update Process:**
1. Identify gap or improvement
2. Propose change with rationale
3. Review with team
4. Update document
5. Communicate change to content creators

---

# Contact

**Content Quality Lead:** [To be filled]  
**Review Date:** [To be scheduled]

---

# Change Log

| Date | Version | Change | Author |
|------|---------|--------|--------|
| July 4, 2026 | 1.0 | Initial content quality standard | Architecture Lead |
| July 9, 2026 | 1.2 | Model page UX presentation quality standards update | AI Assistant |
| July 10, 2026 | 1.2.1 | Cross-application UX polish - Dashboard consolidation, metadata badges, shared collapsible row | AI Assistant |

---

# Implementation Status

## AENS Cross-Application UX Polish (v1.2)

**Status:** ✅ Complete

All implementation items from the AENS Cross-Application UX Audit Report have been successfully completed:

### Dashboard Recent Activity Consolidation

- **Component File:** `components/shared/RecentActivity.tsx`
- **Dashboard Integration:** `app/page.tsx`
- **Deleted Files:** `ContinueReadingSection.tsx` and `RecentKnowledgeSection.tsx`
- **UX Polish:**
  - The section now uses a single client hydration mount-effect (one read from `localStorage`).
  - Added subheadings explaining what qualifies for each history list.
  - If the user has empty history lists, the entire parent container "Continue Learning" is hidden automatically to avoid a cluttered empty-state UI.
  - Diminishing and clearing logic remains fully supported.

### Unification of Time Formatting

- **Component File:** `components/shared/RecentActivity.tsx`
- Unified the display helper `formatTimeAgo` using the canonical utility in `lib/format-time.ts` instead of duplicated local functions.

### Recommended Next Curriculum Progression

- **Component File:** `components/shared/RecommendedNextSection.tsx`
- **Model Integration:** `app/models/[category]/[id]/page.tsx`
- **Behavior:**
  - Renders a lightweight card callout near the bottom of individual Model pages.
  - Resolves `recommendednext` item names using the canonical name-resolver helper.
  - Only displays the block if at least one recommendation resolves to a valid slug in the category, avoiding broken links.

### Problem Index Keyboard Accessibility

- **Component File:** `app/problem-index/ProblemIndexDashboard.tsx`
- **Accessibility Fix:** Added `tabIndex={isFilterCollapsed ? -1 : undefined}` to all category selector chips and bulk toggles in the action toolbar. When the toolbar collapses on scroll, these hidden elements are excluded from keyboard focus navigation, resolving potential focus trap issues.

### Metadata Badges Redesign

- **Component File:** `components/shared/MetadataBadges.tsx`
- **UX & Accessibility Polish:**
  - Regrouped badges into semantic rows separated by clean vertical lines: **Identity** (Type, Category, Version), **Freshness** (Updated [with Clock icon], Verified), and **Applicability** (Problem Types).
  - Replaced the hover-only `title` tooltip for truncated problem types with an interactive `<button>` that expands hidden types inline on click. The button supports standard `aria-expanded` and `aria-label` properties.

### Shared Collapsible Row Primitive

- **Shared Primitive:** `components/shared/CollapsibleRow.tsx`
- **Model Refactor:** `components/shared/ModelCollapsibleSections.tsx`
- **Cheatsheet Refactor:** `components/shared/CheatsheetEntry.tsx`
- **Package Task List Refactor:** `components/shared/PackageTaskList.tsx`
- **Refactoring Polish:**
  - Standardized toggle markup, chevrons, and states.
  - Strictly wired `aria-controls` to the content regions' `id`.
  - Added support for hash-based deep linking (`enableHashDeepLink={true}`) which triggers automatic expansion and smooth scrolling if a hash fragment matches the row's `id`.

### Validation Summary

- `npx tsc --noEmit` successfully resolved with no compilation errors.
- `npm run lint` completed with no warning or error reports.
- `npm run validate` succeeded with zero content validation errors.

---

**End of Document**