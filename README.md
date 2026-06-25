# AI Engineering Knowledge System & Handbook

A localized, zero-latency, and content-dense repository designed for AI/ML engineers. It acts as an offline reference tool for Python package APIs, model architectures, model task registries, production deployment workflows, and quick-access syntax cheatsheets.

This project is built as a static-first, Next.js server-rendered application that parses structured local JSON files, eliminating the need for complex databases or external API calls.

---

## 🚀 Key Features

* **Content Density & Zero Latency**: Fast, readable pages containing code blocks, hyperparameter tables, pros/cons, and gotchas.
* **Local-First Database**: Completely powered by version-controlled JSON files under the `data/` directory. No database connection strings, no SQL migrations, and zero external network dependencies.
* **Fuse.js Search**: Client-side fuzzy searching across the entire catalog for instant access to packages, models, and workflows.
* **Automated Data Quality & Validation**: A custom TypeScript validation suite runs during `prebuild` to enforce strict Zod schema checking, naming conventions, and referential link integrity.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) (React 19)
* **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS
* **Components**: Custom layouts, utility grids, and [shadcn/ui](https://ui.shadcn.com/) primitives
* **Fuzzy Search**: [Fuse.js](https://fusejs.io/)
* **Schema Validation**: [Zod](https://zod.dev/)
* **Runtime / Builder**: [tsx](https://github.com/privatenumber/tsx) (TypeScript Execution)

---

## 📂 Codebase Structure

```text
ai-engineering-handbook/
├── app/                      # Next.js App Router Pages (Server Components)
│   ├── layout.tsx            # Global layout (Sidebar + Main Content wrapper)
│   ├── page.tsx              # Main dashboard summarizing catalogs & recent activity
│   ├── packages/[id]/        # Package detail sheets (e.g. NumPy, PyTorch)
│   ├── models/[category]/    # Model lists with interactive filters (ml, dl, llm)
│   ├── models/[category]/[id]# Model detail cards (e.g. XGBoost, Transformer, Llama 3)
│   ├── registry/[task]/      # Model tables grouped by task (embeddings, vision, speech)
│   ├── workflows/[id]/       # Step-by-step production pipelines (e.g. RAG, Fine-Tuning)
│   └── cheatsheets/[id]/     # Syntax reference sheets
├── components/               # UI Component Tree
│   ├── layout/               # Sidebar and TopBar global layouts
│   └── shared/               # Reusable blocks (CodeBlock, SectionCard, FilterBar)
├── data/                     # Content Database (Version-controlled JSON files)
│   ├── packages/             # Package details & index
│   ├── models/               # Model details & category subfolders
│   ├── registry/             # Task-specific model registry sheets
│   ├── workflows/            # Production walkthroughs
│   └── cheatsheets/          # Command recall references
├── doc/                      # Developer guides & architectural guidelines
├── lib/                      # Business Logic & Schemas
│   ├── data.ts               # File system data-loading utils (Next.js server-cached)
│   ├── search.ts             # Fuse.js search query resolvers
│   └── schemas/              # Zod schemas mapped to data types
├── scripts/                  # Command line scripts and validation pipelines
│   └── validate-content.ts   # The data integrity checker
└── types/                    # Strict TypeScript interfaces defining catalog models
```

---

## 🛡️ Content Validation & Integrity

To guarantee that markdown links do not break and that data files conform to the codebase schemas, the application runs a static checker during the `prebuild` phase.

### Rules Enforced by the Validator:
1. **Schema Validation**: Every JSON file under `data/` is validated against its respective Zod schema in `lib/schemas/`.
2. **Kebab-Case Naming**: All filenames and internal `"id"` attributes must consist only of lowercase letters, digits, hyphens, and periods (`/^[a-z0-9.-]+$/`).
3. **Internal ID Sync**: For all standalone items, the filename must match the declared internal `"id"` property.
4. **Namespace Collision Prevention**:
   * Core entities (`package`, `model`, `workflow`) share a global namespace. No two core files can share an ID.
   * Cheatsheets are allowed to share their ID with a package or model (e.g., cheatsheet `numpy` and package `numpy`).
   * Registry items are allowed to share their ID with detailed models (e.g., registry model `mistral-7b` and detailed model profile `mistral-7b`).
5. **Referential Integrity**: All cross-references (such as `alternatives` or `links`) are verified. The target must exist in the database and have the correct entity type.

---

## 💻 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm/yarn installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the interactive system.

### 3. Run Content Validation
To manually check the integrity of your JSON databases:
```bash
npm run validate
```

### 4. Build for Production
The application compiles into a zero-runtime static page distribution using:
```bash
npm run build
```

---

## ✍️ Contribution & Project Rules

* **Data Storage**: Do not introduce databases (SQL/NoSQL) or API endpoints. All content belongs in the local JSON files.
* **Component Model**: Keep interactive features contained within Client Components, keeping standard presentation rendering in Server Components.
* **No External API Calls**: Fetching data from online endpoints is prohibited; all data processing must occur locally.
* **Strict Type Safety**: Modifying core interfaces in `types/` without reviewing system validators is prohibited.
