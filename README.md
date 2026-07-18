# AI Engineering Navigation System (AENS)

A localized, zero-latency, content-dense knowledge system for AI/ML engineers.

- **Local-first**: the site reads structured **JSON files** from `data/`
- **Static-first**: routes are generated at build time (no database required)
- **Quality-gated**: all content is validated via Zod during `npm run build`

## Quick Start

### Prerequisites
- Node.js **v18+**
- npm

### Install
```bash
npm install
```

### Run (development)
```bash
npm run dev
```
Open: http://localhost:3000

### Validate content (recommended before committing JSON changes)
```bash
npm run validate
```

### Build for production
```bash
npm run build
```

Note: `prebuild` automatically runs:
- `npm run validate`
- `npm run build:nav`

## What AENS is for

AENS is a **personal AI Engineering knowledge system** designed to help you:
- recall Python package syntax
- browse AI/ML/DL/LLM models
- review the Hugging Face ecosystem
- study end-to-end workflows (RAG, fine-tuning, evaluation, inference)
- use cheatsheets while building real AI systems

## Non-goals / Hard constraints

This is **not** a SaaS product.

The system intentionally avoids:
- database usage
- external API fetching for content
- adding new runtime dependencies without approval

See: `docs/engineering/project-rules.md`

## How the project works

### Content pipeline
1. Content lives in `data/` as JSON
2. `npm run validate` runs `scripts/validate-content.ts` (Zod schema validation + integrity checks)
3. `npm run build` renders the Next.js App Router pages using the local JSON

Key references:
- Validation: `docs/engineering/validation.md`
- Architecture: `docs/architecture/overview.md`

### Navigation indexes
To keep navigation fast, the app generates lightweight `_nav.json` files.

- Run when you add/update content:
  ```bash
  npm run build:nav
  ```
- Triggered automatically by `prebuild`

## Repository layout (high level)

```
ai-engineering-handbook/
├─ app/                # Next.js App Router
├─ components/        # UI components (sidebar, shared renderers, etc.)
├─ data/              # All content JSON + _nav.json indexes
├─ lib/               # Data loading, schemas, search/indexing
├─ scripts/           # build-time validation + nav index generation
├─ docs/              # Contributor rules + schema docs + guides
└─ types/             # Domain interfaces (kept in sync with Zod)
```

## Adding or updating content (contribution workflow)

General workflow for new/modified JSON content:

1. Put the file under the correct `data/<type>/...` directory
2. Follow the Zod schema in `lib/schemas/*`
3. Ensure the internal `id` matches the filename (kebab-case)
4. Run:
   ```bash
   npm run validate
   ```
5. Rebuild nav indexes:
   ```bash
   npm run build:nav
   ```
6. Confirm build:
   ```bash
   npm run build
   ```

### Contribution guides
- Adding a model: `docs/guides/adding-model.md`
- Adding a workflow: `docs/guides/adding-workflow.md`

## Content quality checklist (most common failure points)

- **No markdown fencing inside snippet fields** (e.g. `quick_start`, `install`, `example` must be raw code strings)
- **Dates** follow strict `YYYY-MM-DD` format (`created_at`, `updated_at`)
- **`sources[]` is required** and must not be empty
- **Enum fields** must match the exact allowed lowercase values
- **Cross-links are integrity-checked** (orphan detection + type compatibility)

Schema guidance: `docs/engineering/content-schema.md`
Validation rules: `docs/engineering/validation.md`

## Scripts (developer commands)

- `npm run dev` — Next.js development server
- `npm run build` — production build (runs validation + nav indexing via `prebuild`)
- `npm run validate` — validate all JSON content
- `npm run build:nav` — regenerate `_nav.json` indexes
- `npm run lint` — ESLint

## Technology Stack

- **Next.js:** 16.2.9 (App Router)
- **React:** 19.2.4
- **TypeScript:** 5 (strict mode)
- **Tailwind CSS:** v4
- **UI:** shadcn/ui + Radix UI
- **Search:** Fuse.js
- **Validation:** Zod

## License

License to be determined.

