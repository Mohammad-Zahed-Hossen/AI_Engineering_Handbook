# AENS - AI Context Quick Reference

**Purpose:** Condensed reference for AI assistants to understand AENS before making changes.

---

## What is AENS?

AENS (AI Engineering Navigation System) is a **static-first, local JSON knowledge base** for AI/ML engineers. It provides:
- Package API references (NumPy, Pandas, PyTorch, etc.)
- Model catalogs (ML, DL, LLM)
- Workflow blueprints (RAG, fine-tuning, etc.)
- Cheatsheets for quick syntax lookup
- Debug guides for troubleshooting
- Decision guides for technology selection

## Core Architecture

```
User → Next.js Static → app/layout.tsx
                    ├─ Sidebar (from data/_nav.json)
                    ├─ TopBar + Search
                    └─ Content Pages (from data/*.json)
```

**Key Files:**
- `lib/data.ts` - All data loading (React.cache)
- `lib/search.ts` - Search index builder
- `lib/schemas/*.ts` - Zod validation schemas
- `scripts/validate-content.ts` - Content validation
- `scripts/build-nav-index.ts` - Navigation index generation

## Content Types

| Type | Location | Key Fields |
|------|----------|------------|
| package | `data/packages/` | `name`, `version`, `tasks[]` |
| model | `data/models/{ml,dl,llm}/` | `name`, `problem_types[]`, `decisionsummary` |
| workflow | `data/workflows/` | `name`, `steps[]`, `starter_stack[]` |
| cheatsheet | `data/cheatsheets/` | `name`, `entries[]` |
| pattern | `data/patterns/` | `concept`, `applicability` |
| principle | `data/principles/` | `statement`, `intuition` |
| debug_guide | `data/debug-guides/` | `symptoms[]`, `solutions[]` |
| decision_guide | `data/decision-guides/` | `problem`, `options[]` |
| registry | `data/registry/families/` | `provider`, `modality`, `hardware` |

## ID Format

- **kebab-case only:** `/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/`
- **No underscores, no uppercase**
- **Examples:** `random-forest`, `pytorch`, `rag`

## Cross-Links (ContentRef)

```typescript
// Good - typed reference
{ "id": "numpy", "type": "package" }

// Bad - string reference
"numpy"
```

**Relationship fields vary by type:**
- Package: `related_workflows`, `related_cheatsheets` (string[])
- Model: `relatedcontent` (ContentRef[])
- Pattern: `related_workflows`, `related_models` (string[])
- Workflow: `related_patterns`, `related_models` (string[])

## Validation Rules

1. **Schema validation** - All JSON must pass Zod schema
2. **ID format** - kebab-case required
3. **Filename = ID** - JSON filename must match internal `id`
4. **No placeholders** - No TODO, TBD, Placeholder
5. **Sources required** - `sources[]` must have at least one URL
6. **Date format** - `YYYY-MM-DD` only

## Build Commands

```bash
npm run validate    # Validate all content
npm run build:nav # Generate _nav.json files
npm run build     # Full build (runs validate + build:nav)
npm run dev       # Development server
```

## Hard Rules (DO NOT VIOLATE)

1. No files outside approved folder structure
2. No npm packages without approval
3. No database, Supabase, Firebase, MongoDB, PostgreSQL, Prisma
4. No external API fetching for content
5. Use Server Components by default
6. All dynamic routes must implement `generateStaticParams()`
7. All code fields must be raw strings (no markdown backticks)

## Search Architecture

- **Tokenizer:** Dot-split, CamelCase, snake-kebab, abbreviation expansion
- **Inverted Index:** Token → Set<docId> mapping
- **Synonym Expansion:** Query expansion with related terms
- **Ranking:** Exact match (1.0) → Fuzzy match (0-0.45)

## Navigation Performance

- `_nav.json` files contain only `id`, `name`, `version`, `updated_at`
- `MAX_VISIBLE_ITEMS = 12`
- `ALPHA_GROUP_THRESHOLD = 30`
- Fallback to full scan if `_nav.json` missing

## File Structure Quick Reference

```
app/           # Next.js pages
components/    # UI components
data/          # Content JSON + _nav.json
lib/           # Data layer, schemas, search
scripts/       # Build scripts
types/         # TypeScript types
public/        # Generated search-index.json
aens.config.json # Configuration
```

## Common Mistakes to Avoid

1. Adding markdown to `syntax`, `example`, `snippet` fields
2. Using `YYYY-MM-DDT...` for dates (must be `YYYY-MM-DD`)
3. Leaving `sources[]` empty
4. Using string alternatives instead of `ContentRef` objects
5. Forgetting bidirectional relationships

## Loading Order for AI

1. `docs/AGENTS.md` - Loading order
2. `docs/engineering/project-rules.md` - Hard rules
3. `docs/architecture/overview.md` - System architecture
4. `docs/architecture/data-flow.md` - Data flows
5. `lib/schemas/*.ts` - Content schemas
6. `lib/data.ts` - Data loading patterns

---

**For full specification, see:** `docs/AENS_CANONICAL_SPECIFICATION.md`