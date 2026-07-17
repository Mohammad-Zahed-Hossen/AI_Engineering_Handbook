# AI Engineering Navigation System (AENS)

A localized, zero-latency, content-dense knowledge system for AI/ML engineers. Built as a static-first Next.js application that parses structured local JSON files, eliminating the need for complex databases or external API calls.

## Project Overview

AENS is a **personal AI Engineering knowledge system** designed to:
- Quickly recall Python package syntax
- Browse AI/ML/DL/LLM models
- Review Hugging Face ecosystem tools
- Study workflows (RAG, Fine-Tuning, Evaluation, Inference)
- Reference cheatsheets while working on AI projects

**Target Audience:** AI engineers seeking canonical implementation knowledge for production systems.

## Features

- **Knowledge Graph** - Bidirectional relationships between all content types
- **Problem Index** - Problem-first discovery layer
- **Workflows** - End-to-end production pipelines
- **Patterns** - Tool-independent engineering concepts
- **Models** - Algorithm selection and understanding
- **Packages** - Library implementation details
- **Cheatsheets** - Quick syntax reference
- **Decision Guides** - X vs Y comparison frameworks
- **Debug Guides** - Troubleshooting knowledge
- **Principles** - Fundamental engineering axioms
- **Registry** - Model deployment metadata
- **Search** - Client-side fuzzy search with Fuse.js
- **Cross-linking** - Related content navigation

## Architecture Overview

AENS follows a **static generation** architecture:
- All content stored as JSON files in `data/` directory
- Zod schemas enforce data integrity at build time
- React cache for efficient data loading
- Lightweight `_nav.json` indexes for navigation performance
- No database, no backend, no API routes

## Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build
```bash
npm run build
```

### Validate
```bash
npm run validate
```

## Repository Structure

```
ai-engineering-handbook/
├── app/                      # Next.js App Router pages
├── components/               # UI components
│   ├── layout/               # Sidebar, TopBar, navigation
│   ├── shared/               # Reusable components
│   └── ui/                   # shadcn/ui primitives
├── data/                     # Content database (JSON files)
│   ├── packages/               # Library documentation
│   ├── models/                 # ML/DL/LLM models
│   ├── workflows/              # Production pipelines
│   ├── cheatsheets/            # Syntax references
│   ├── patterns/               # Engineering patterns
│   ├── debug-guides/           # Troubleshooting guides
│   ├── decision-guides/          # Decision frameworks
│   ├── principles/             # Engineering principles
│   └── registry/               # Model deployment metadata
├── docs/                     # Documentation
│   ├── architecture/           # System design documentation
│   ├── engineering/            # Contributor rules
│   ├── guides/                 # How-to procedures
│   ├── reference/              # Quick references
│   └── adr/                    # Architecture decisions
├── lib/                      # Business logic
│   ├── schemas/                # Zod validation schemas
│   ├── search/                 # Search engine
│   └── hooks/                  # React hooks
├── scripts/                  # Build scripts
│   ├── validate-content.ts     # Content validation
│   └── build-nav-index.ts      # Navigation index generation
└── types/                    # TypeScript interfaces
```

## Development Workflow

### Adding New Content

1. Create JSON file in the appropriate `data/` subdirectory
2. Follow the schema in `lib/schemas/*.ts`
3. Use kebab-case for the ID (filename without .json)
4. Run `npm run validate` to check integrity
5. Run `npm run build:nav` to update navigation indexes
6. Run `npm run build` to verify static generation

See `docs/guides/adding-*.md` for detailed guides.

## Content Standards

All content must follow the quality standards defined in:
- `docs/engineering/content-schema.md` - Schema and field guidelines
- `docs/engineering/validation.md` - Validation rules
- `docs/reference/schemas.md` - Schema reference

## Contributing

This is a **curated knowledge base**, not a documentation platform. Contributions should:
- Follow existing patterns and conventions
- Pass all validation checks
- Include appropriate cross-links
- Have complete metadata
- Be actionable and practical

See `docs/engineering/project-rules.md` for detailed contribution guidelines.

## License

[License to be determined]

## Technology Stack

- **Framework:** Next.js 16.2.9 (App Router)
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui + Radix UI
- **Search:** Fuse.js
- **Validation:** Zod