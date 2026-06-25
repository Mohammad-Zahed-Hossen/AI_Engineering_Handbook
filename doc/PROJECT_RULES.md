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
│   ├── packages/
│   │   └── [id]/
│   │       └── page.tsx                    ← Package detail page
│   ├── models/
│   │   ├── [category]/
│   │   │   ├── page.tsx                    ← Model list with filters
│   │   │   └── [id]/
│   │   │       └── page.tsx                ← Model detail page
│   ├── registry/
│   │   └── [task]/
│   │       └── page.tsx                    ← Registry task page
│   ├── workflows/
│   │   └── [id]/
│   │       └── page.tsx                    ← Workflow detail page
│   └── cheatsheets/
│       └── [id]/
│           └── page.tsx                    ← Cheatsheet detail page
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx                     ← Desktop sidebar (collapsible sections)
│   │   ├── TopBar.tsx                      ← Header with search
│   │   └── MobileSidebarTrigger.tsx        ← Mobile menu (Sheet component)
│   ├── shared/
│   │   ├── AlternativesList.tsx            ← ContentRef-based alternatives
│   │   ├── Breadcrumbs.tsx                 ← Navigation breadcrumbs
│   │   ├── CodeBlock.tsx                   ← Code with copy button
│   │   ├── ContentPageLayout.tsx           ← Page layout wrapper
│   │   ├── ContentTypeBadge.tsx            ← Type badge (package/model/etc)
│   │   ├── FilterBar.tsx                   ← Client-side filter component
│   │   ├── MetadataBadges.tsx              ← Updated at, sources badges
│   │   ├── OfficialResources.tsx           ← Sources[] rendering
│   │   ├── SearchBox.tsx                   ← Fuse.js search input
│   │   ├── SectionCard.tsx                 ← Section container
│   │   ├── StatusBadge.tsx                 ← Status indicator
│   │   └── TableOfContents.tsx             ← Page TOC
│   └── ui/
│       ├── badge.tsx                       ← shadcn badge
│       ├── button.tsx                      ← shadcn button
│       ├── card.tsx                        ← shadcn card
│       ├── separator.tsx                   ← shadcn separator
│       └── sheet.tsx                       ← shadcn sheet
│
├── data/
│   ├── packages/                           ← Auto-discovered, no _index.json
│   │   ├── numpy.json
│   │   ├── pandas.json
│   │   └── ...
│   ├── models/
│   │   ├── ml/
│   │   │   ├── random-forest.json
│   │   │   └── ...
│   │   ├── dl/
│   │   │   └── ...
│   │   └── llm/
│   │       └── ...
│   ├── registry/
│   │   ├── embeddings.json
│   │   ├── rerankers.json
│   │   ├── vision.json
│   │   ├── speech.json
│   │   ├── llms.json
│   │   ├── multimodal.json
│   │   └── ocr.json
│   ├── workflows/
│   │   ├── rag.json
│   │   └── ...
│   └── cheatsheets/
│       ├── pytorch.json
│       └── ...
│
├── lib/
│   ├── data.ts                             ← All data loading (fs.readFileSync + React.cache)
│   ├── search.ts                           ← Fuse.js search index builder
│   ├── search-types.ts                     ← SearchResult type, createFuse config
│   ├── resources.ts                        ← Resource URL resolver
│   ├── route-params.ts                     ← generateStaticParams helpers
│   ├── utils.ts                            ← cn() utility
│   └── schemas/
│       ├── package.ts                      ← Zod schema for Package
│       ├── model.ts                        ← Zod schema for Model
│       ├── registry.ts                     ← Zod schema for RegistryModel
│       ├── workflow.ts                     ← Zod schema for Workflow
│       ├── cheatsheet.ts                   ← Zod schema for Cheatsheet
│       ├── meta.ts                         ← Zod schema for BaseMeta
│       └── index.ts                        ← Re-export all schemas
│
├── types/
│   ├── package.ts                          ← TypeScript interface for Package
│   ├── model.ts                            ← TypeScript interface for Model
│   ├── registry.ts                         ← TypeScript interface for RegistryModel
│   ├── workflow.ts                         ← TypeScript interface for Workflow
│   ├── cheatsheet.ts                       ← TypeScript interface for Cheatsheet
│   ├── meta.ts                             ← TypeScript interface for BaseMeta
│   └── index.ts                            ← Re-export all types
│
├── scripts/
│   └── validate-content.ts                 ← Zod validation for all JSON files
│
├── doc/
│   ├── PROJECT_RULES.md                    ← This file
│   ├── ARCHITECTURAL_REVIEW.md
│   ├── content_guidelines.md
│   └── validate_content.md
│
├── public/                                 ← Static assets
├── next.config.ts                          ← Next.js config (TS strict)
├── eslint.config.mjs                       ← ESLint flat config
├── tsconfig.json                           ← TypeScript config
├── tailwind.config.ts                      ← Tailwind v4 config
└── package.json
```

**Key changes from old structure:**
- **No _index.json files** — auto-discovery via `scanDirectoryForIds()` in lib/data.ts
- **No meta.json** — dashboard counts computed dynamically via `getDashboardCounts()`
- **lib/schemas/** added — Zod schemas mirror TypeScript types
- **lib/search.ts, lib/search-types.ts** added — Fuse.js search integration
- **lib/resources.ts, lib/route-params.ts** added — utility functions
- **components/shared/** expanded — many new reusable components
- **components/ui/** added — shadcn/ui components
- **scripts/validate-content.ts** added — build-time JSON validation

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

**Step 2: No index file to update**
- Auto-discovery via `scanDirectoryForIds()` means no _index.json files
- The file is automatically picked up on next build

**Step 3: Validate**
- Run `npm run validate` to catch schema errors
- This runs `scripts/validate-content.ts` which checks all JSON files against Zod schemas

**Step 4: Build**
- Run `npm run build` to confirm static generation works
- This also runs `npm run validate` automatically via prebuild script

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