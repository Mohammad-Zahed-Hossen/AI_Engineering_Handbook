---
id: engineering-project-rules
title: Project Rules
type: engineering
status: active
owner: contributors
canonical: true
version: 2.0
related:
  - engineering-content-schema
  - engineering-validation
ai_priority: 1
---

# AI Engineering Handbook - Project Rules

## SECTION 1 — Project Identity

This is a **personal AI Engineering knowledge system**, not a SaaS product or commercial application.

It helps me:
- Quickly recall Python package syntax
- Browse AI/ML/DL/LLM models
- Review Hugging Face ecosystem tools
- Study workflows (RAG, Fine-Tuning, Evaluation, Inference)
- Reference cheatsheets while working on AI projects

**Priorities:**
1. Content density
2. Fast navigation
3. Clean architecture
4. Long-term maintainability
5. Zero API cost
6. Zero database
7. Static generation
8. Personal knowledge management

**What it is NOT:**
- Not a SaaS product
- Not a commercial application
- Not a multi-user system
- Not a backend service

---

## SECTION 2 — Current Tech Stack

- **Next.js**: 16.2.9 (App Router)
- **React**: 19.2.4
- **TypeScript**: 5 (strict mode)
- **Tailwind CSS**: v4
- **shadcn/ui**: 4.11.0 (badge, button, card, separator, sheet components)
- **Fuse.js**: 7.4.2 (fuzzy search)
- **Zod**: 4.4.3 (schema validation)
- **Lucide React**: 1.21.0 (icons)

**No database, no backend, no API routes.** All content is local JSON files.

---

## SECTION 3 — Hard Rules

1. **Never create files outside the approved folder structure**
2. **Never modify TypeScript types in /types without updating the corresponding Zod schema in /lib/schemas** — they must stay in sync
3. **Never install npm packages without explicit approval**
4. **Never introduce a database, Supabase, Firebase, MongoDB, PostgreSQL, Prisma, or ORM**
5. **Never fetch content from external APIs** — all content is local JSON
6. **Use Server Components by default** — Client Components only when interaction is required (copy button, filters, search, sidebar toggle)
7. **All dynamic routes must implement generateStaticParams** for static generation
8. **CodeBlock component always includes a copy-to-clipboard button**
9. **All content JSON files must pass npm run validate before committing**
10. **When modifying a type, also update its Zod schema in lib/schemas/** — they must stay in sync

---

## SECTION 4 — Actual Folder Structure

```
ai-engineering-handbook/
├── app/
│   ├── layout.tsx                          ← Root layout with Sidebar, TopBar
│   ├── page.tsx                            ← Dashboard with recent content
│   ├── globals.css                         ← Tailwind v4 + shadcn styles
│   ├── not-found.tsx                       ← 404 page (Server Component)
│   ├── error.tsx                           ← Error boundary (Client Component)
│   ├── favicon.ico
│   ├── api/
│   │   └── registry/
│   │       └── search/
│   │           └── route.ts                ← Search API endpoint
│   ├── packages/
│   │   ├── [id]/
│   │   │   └── page.tsx                    ← Package detail page
│   │   ├── page.tsx
│   │   └── PackageListClient.tsx
│   ├── models/
│   │   ├── [category]/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx                ← Model detail page
│   │   │   └── page.tsx                    ← Model list with filters
│   │   └── page.tsx                        ← Unified models page
│   ├── registry/
│   │   ├── [task]/
│   │   │   └── page.tsx                    ← Registry task page
│   │   ├── families/
│   │   │   ├── [family]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [variant]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── workflows/
│   │   ├── [id]/
│   │   │   └── page.tsx                    ← Workflow detail page
│   │   └── page.tsx
│   ├── cheatsheets/
│   │   ├── [id]/
│   │   │   └── page.tsx                    ← Cheatsheet detail page
│   │   └── page.tsx
│   ├── debug-guides/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── decision-guides/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── patterns/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── principles/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   └── problem-index/
│       ├── page.tsx
│       └── ProblemIndexDashboard.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx                     ← Desktop sidebar (collapsible sections)
│   │   ├── TopBar.tsx                      ← Header with search
│   │   └── MobileSidebarTrigger.tsx        ← Mobile menu (Sheet component)
│   ├── principles/
│   │   ├── AppearsInGroup.tsx
│   │   ├── DecisionChecklist.tsx
│   │   ├── EngineeringConsequenceCard.tsx
│   │   ├── MentalModelDisplay.tsx
│   │   ├── MisconceptionRow.tsx
│   │   └── TradeoffComparison.tsx
│   ├── registry/
│   │   ├── DeploymentProfiles.tsx
│   │   ├── DeploymentSummaryCard.tsx
│   │   ├── EngineeringContinuation.tsx
│   │   ├── EngineeringDecisionCards.tsx
│   │   ├── FamilyCard.tsx
│   │   ├── PaginationControls.tsx
│   │   ├── PerformanceDimensions.tsx
│   │   ├── QuickLinksCard.tsx
│   │   ├── RegistryBadge.tsx
│   │   ├── RegistryFamilyView.tsx
│   │   ├── RegistryFilter.tsx
│   │   ├── RelatedResources.tsx
│   │   ├── RuntimeDecisionCard.tsx
│   │   ├── RuntimeMatrix.tsx
│   │   ├── VariantCard.tsx
│   │   └── VariantComparisonTable.tsx
│   ├── shared/
│   │   ├── AlternativesList.tsx
│   │   ├── AntiPatternCard.tsx
│   │   ├── BackToTop.tsx
│   │   ├── BadgeRow.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── CheatsheetEntry.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── CodeBlockInteractive.tsx
│   │   ├── CollapsibleRow.tsx
│   │   ├── CollapsibleSection.tsx
│   │   ├── ConstraintRecommendations.tsx
│   │   ├── ContentPageLayout.tsx
│   │   ├── ContentTypeBadge.tsx
│   │   ├── DataTable.tsx
│   │   ├── DebugChecklist.tsx
│   │   ├── DebugDecisionTree.tsx
│   │   ├── DebugOverviewCard.tsx
│   │   ├── DebugSolutionList.tsx
│   │   ├── DecisionFlow.tsx
│   │   ├── DecisionGuideSummary.tsx
│   │   ├── DecisionMatrix.tsx
│   │   ├── DecisionOptionGrid.tsx
│   │   ├── DecisionSummary.tsx
│   │   ├── DecisionTree.tsx
│   │   ├── DiagnosticCommandList.tsx
│   │   ├── ExpandableText.tsx
│   │   ├── FilterBar.tsx
│   │   ├── HiddenCosts.tsx
│   │   ├── HybridStrategy.tsx
│   │   ├── LearningResources.tsx
│   │   ├── MetadataBadges.tsx
│   │   ├── MigrationPath.tsx
│   │   ├── ModelCategoryComparison.tsx
│   │   ├── ModelCollapsibleSections.tsx
│   │   ├── ModelDecisionStrip.tsx
│   │   ├── ModelHubExplorer.tsx
│   │   ├── ModelListFilter.tsx
│   │   ├── OfficialResources.tsx
│   │   ├── PackageTaskList.tsx
│   │   ├── PageVisitTracker.tsx
│   │   ├── PatternSnapshot.tsx
│   │   ├── ProductionExamples.tsx
│   │   ├── Prose.tsx
│   │   ├── QuickIdentificationChecklist.tsx
│   │   ├── QuickSetupSection.tsx
│   │   ├── ReadingProgress.tsx
│   │   ├── ReadingSessionTracker.tsx
│   │   ├── RecentActivity.tsx
│   │   ├── RecommendedNextSection.tsx
│   │   ├── RelatedContent.tsx
│   │   ├── RelatedPatternGraph.tsx
│   │   ├── RelationshipSection.tsx
│   │   ├── ScrollRestore.tsx
│   │   ├── SearchBox.tsx
│   │   ├── SectionCard.tsx
│   │   ├── SectionSummary.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── StickyActionBar.tsx
│   │   ├── TableOfContents.tsx
│   │   ├── TradeoffHeatmap.tsx
│   │   ├── TradeoffTable.tsx
│   │   ├── VariationCard.tsx
│   │   ├── VerificationChecklist.tsx
│   │   ├── VisualizationEquivalents.tsx
│   │   ├── VisualTrainingLoop.tsx
│   │   └── WorkflowStepList.tsx
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── separator.tsx
│       └── sheet.tsx
├── data/
│   ├── packages/
│   │   ├── _nav.json
│   │   ├── numpy.json
│   │   └── ...
│   ├── models/
│   │   ├── ml/
│   │   │   ├── _nav.json
│   │   │   ├── random-forest.json
│   │   │   └── ...
│   │   ├── dl/
│   │   │   ├── _nav.json
│   │   │   └── ...
│   │   └── llm/
│   │       ├── _nav.json
│   │       └── ...
│   ├── registry/
│   │   └── families/
│   │       ├── deepseek/
│   │       ├── llama-3/
│   │       └── qwen-3/
│   ├── workflows/
│   │   ├── _nav.json
│   │   ├── rag.json
│   │   └── ...
│   ├── cheatsheets/
│   │   ├── _nav.json
│   │   ├── pytorch.json
│   │   └── ...
│   ├── debug-guides/
│   │   ├── _nav.json
│   │   └── ...
│   ├── decision-guides/
│   │   ├── _nav.json
│   │   └── ...
│   ├── patterns/
│   │   ├── _nav.json
│   │   └── ...
│   ├── principles/
│   │   ├── _nav.json
│   │   └── ...
│   └── problem-index/
│       └── taxonomy.json
├── lib/
│   ├── data.ts
│   ├── format-date.ts
│   ├── format-registry.ts
│   ├── format-time.ts
│   ├── pagination.ts
│   ├── relationships.ts
│   ├── resources.ts
│   ├── route-params.ts
│   ├── search-types.ts
│   ├── search.ts
│   ├── session-tracking.ts
│   ├── theme.ts
│   ├── utils.ts
│   ├── config/
│   │   ├── loader.ts
│   │   └── workflows.ts
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   └── useReadingSession.ts
│   ├── search/
│   │   ├── engine.ts
│   │   ├── intent-detection.ts
│   │   ├── inverted-index.ts
│   │   ├── query-assistance.ts
│   │   ├── ranking.ts
│   │   ├── related-search.ts
│   │   ├── snippets.ts
│   │   ├── synonym-expander.ts
│   │   ├── tokenizer.ts
│   │   └── typo-tolerance.ts
│   ├── schemas/
│   │   ├── base.ts
│   │   ├── cheatsheet.ts
│   │   ├── debug-guide.ts
│   │   ├── decision-guide.ts
│   │   ├── index.ts
│   │   ├── model.ts
│   │   ├── package.ts
│   │   ├── pattern.ts
│   │   ├── principle.ts
│   │   ├── registry.ts
│   │   └── workflow.ts
│   ├── text/
│   │   └── parseLabeledClauses.ts
│   └── validator/
│       ├── context.ts
│       ├── engine.ts
│       ├── report.ts
│       └── rules/
│           ├── base.ts
│           ├── cross-ref.ts
│           ├── empty.ts
│           ├── orphans.ts
│           ├── registry.ts
│           ├── related.ts
│           └── schema.ts
├── types/
│   ├── cheatsheet.ts
│   ├── config.ts
│   ├── debug-guide.ts
│   ├── decision-guide.ts
│   ├── index.ts
│   ├── meta.ts
│   ├── model.ts
│   ├── package.ts
│   ├── pattern.ts
│   ├── principle.ts
│   ├── problem.ts
│   ├── registry.ts
│   └── workflow.ts
├── scripts/
│   ├── build-nav-index.ts
│   ├── search-audit.ts
│   ├── sync-cross-refs.ts
│   └── validate-content.ts
├── tests/
│   ├── relationships.test.ts
│   ├── search-enhancements.test.ts
│   ├── tokenizer.test.ts
│   └── validator/
│       ├── engine.test.ts
│       └── rules.test.ts
├── public/
├── schema/
│   ├── config.schema.json
│   └── v2/
│       └── .gitkeep
├── docs/
│   ├── architecture/
│   ├── engineering/
│   ├── guides/
│   ├── knowledge/
│   ├── prompt/
│   ├── reference/
│   └── report/
└── package.json
```

**Key changes from old structure:**
- **New content types**: debug-guides, decision-guides, patterns, principles, problem-index
- **lib/search/** expanded with intent-detection, query-assistance, ranking, snippets, typo-tolerance
- **lib/validator/** added for content validation
- **lib/text/** added for text parsing utilities
- **components/principles/** and **components/registry/** added
- **data/registry/families/** added for model family data
- **scripts/search-audit.ts** and **scripts/sync-cross-refs.ts** added
- **tests/** directory added with test files

---

## SECTION 5 — Content Schema Rules

**All content extends BaseMeta:**
```typescript
interface BaseMeta {
  created_at: string;      // ISO date string
  updated_at: string;      // ISO date string
  sources: string[];      // ALL external links (docs, papers, model cards)
  github_repo?: string;    // Optional GitHub repo URL
}
```

**Sources array:**
- Contains ALL external links in one place
- No separate fields for docs_url, paper_url, model_card_url
- Rendered via OfficialResources component

**Alternatives:**
- Use `ContentRef` type: `{ id: string; type: 'model' | 'package' | 'workflow' | 'cheatsheet' | 'registry' }`
- Enables cross-referencing between content types
- Rendered via AlternativesList component

**ID format:**
- Must be kebab-case: `^[a-z0-9][a-z0-9-]*[a-z0-9]$`
- No underscores, no uppercase letters
- Examples: `random-forest`, `pytorch`, `rag`, `embedding`

---

## SECTION 6 — Data Flow

```
JSON files (data/)
    ↓
lib/data.ts (fs.readFileSync + React.cache)
    ↓
Server Components (app/**/page.tsx)
    ↓
Static Pages (next build)
```

**Key functions in lib/data.ts:**
- `scanDirectoryForIds()` — Auto-discovers JSON files by directory scanning
- `getPackage()`, `getModel()`, `getWorkflow()`, `getCheatsheet()` — Read individual files
- `getRegistryByTask()` — Read registry task arrays
- `getPackageNavItems()`, `getModelNavItems()`, etc. — Lightweight navigation data
- `getDashboardCounts()` — Computed dashboard counts
- `getRecentContent()` — Recently updated content across all types
- `buildSearchIndex()` — Aggregates all content for Fuse.js search (in lib/search.ts)

All data loading uses `React.cache()` for memoization and `fs.readFileSync()` for synchronous file reading.

---

## SECTION 7 — Adding New Content

**Step 1: Create the JSON file**
- Place in the correct `data/` subdirectory (packages/, models/ml/, models/dl/, models/llm/, registry/, workflows/, cheatsheets/)
- Follow the schema in the corresponding `lib/schemas/*.ts` file
- Use kebab-case for the ID (filename without .json)

**Step 2: Build navigation index**
- Run `npm run build:nav` to generate _nav.json files
- These lightweight indexes improve navigation performance
- The file is automatically picked up on next build

**Step 3: Validate**
- Run `npm run validate` to catch schema errors
- This runs `scripts/validate-content.ts` which checks all JSON files against Zod schemas

**Step 4: Build**
- Run `npm run build` to confirm static generation works
- This automatically runs `npm run validate` and `npm run build:nav` via prebuild script

**Step 5: If adding a new section type**
- Update `types/*.ts` with the new TypeScript interface
- Update `lib/schemas/*.ts` with the corresponding Zod schema
- Update `lib/data.ts` with data loading functions
- Update `scripts/validate-content.ts` to include the new type
- Update `lib/search.ts` to index the new content type (if searchable)

---

**Source of truth for type definitions:**
- The actual files in `types/` and `lib/schemas/` are the source of truth
- This document provides an overview, not exhaustive type definitions
- Always refer to the actual files when implementing changes