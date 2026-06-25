Project: AI Engineering Handbook
Stack: Next.js 15, TypeScript strict, Tailwind CSS v4, shadcn/ui (badge, card, separator only)
Data: Local JSON files via fs.readFileSync in lib/data.ts — no database, no API routes
Types: All defined in /types — never add or remove fields from existing types
Routing: App Router, all data pages are Server Components, filters are Client Components

Hard rules:
1. Never create files outside the defined folder structure
2. Never modify types in /types directory
3. Never add npm packages without asking me first
4. Never use useEffect to fetch data — data loading happens server-side in page.tsx
5. Never use <a> tags — always Next.js <Link>
6. Never add animations, transitions, or decorative UI elements
7. Always use generateStaticParams on dynamic routes
8. CodeBlock component always has a copy-to-clipboard button
9. Client components are only for: copy button, filters, search
10. If a field doesn't exist in the TypeScript type, don't render it

Current task: [describe your task here]



PROJECT: AI Engineering Handbook



PURPOSE:

This is not a SaaS product and not a commercial application.



This is a personal AI Engineering knowledge system that helps me:



* Quickly recall Python package syntax

* Browse AI/ML/DL/LLM models

* Review Hugging Face ecosystem tools

* Study workflows such as RAG, Fine-Tuning, Evaluation, Inference

* Review cheatsheets while working on AI projects



The application must prioritize:



1. Content density

2. Fast navigation

3. Clean architecture

4. Long-term maintainability

5. Zero API cost

6. Zero database

7. Static generation

8. Personal knowledge management



Technology Stack:



* Next.js 15 App Router

* TypeScript Strict Mode

* Tailwind CSS v4

* shadcn/ui

* Local JSON files

* No backend

* No database

* No API routes



Hard Rules:



1. Never create files outside the approved folder structure.

2. Never modify existing TypeScript schemas without permission.

3. Never install additional npm packages without asking.

4. Never introduce a database.

5. Never introduce Supabase, Firebase, MongoDB, PostgreSQL, Prisma or ORM.

6. Never fetch content from external APIs.

7. All content must come from local JSON files.

8. Use Server Components whenever possible.

9. Use Client Components only when interaction is required.

10. Generate complete production-quality code.

11. Return full file contents when creating files.

12. Explain where each file should be placed.

13. If you detect architectural problems, explain them before generating code.



Folder Structure:



ai-engineering-handbook/

│

├── app/

│   ├── layout.tsx

│   ├── page.tsx                          ← Dashboard

│   ├── packages/

│   │   └── [id]/page.tsx

│   ├── models/

│   │   ├── [category]/page.tsx           ← Model list with filters

│   │   └── [category]/[id]/page.tsx      ← Model detail

│   ├── registry/

│   │   └── [task]/page.tsx

│   ├── workflows/

│   │   └── [id]/page.tsx

│   └── cheatsheets/

│       └── [id]/page.tsx

│

├── components/

│   ├── layout/

│   │   ├── Sidebar.tsx

│   │   └── TopBar.tsx

│   └── shared/

│       ├── CodeBlock.tsx                 ← copy button lives here

│       ├── SectionCard.tsx

│       ├── StatusBadge.tsx

│       └── FilterBar.tsx                 ← client component, reusable

│

├── data/

│   ├── meta.json                         ← dashboard counts, manually updated

│   ├── packages/

│   │   ├── _index.json                   ← ["numpy","pandas","pytorch",...]

│   │   ├── numpy.json

│   │   └── pandas.json

│   ├── models/

│   │   ├── ml/

│   │   │   ├── _index.json               ← ["random-forest","xgboost",...]

│   │   │   └── random-forest.json

│   │   ├── dl/

│   │   │   ├── _index.json

│   │   │   └── transformer.json

│   │   └── llm/

│   │       ├── _index.json

│   │       └── llama3.json

│   ├── registry/

│   │   ├── _index.json                   ← ["embedding","reranker","vision",...]

│   │   └── embeddings.json               ← array of RegistryModel

│   ├── workflows/

│   │   ├── _index.json

│   │   └── rag.json

│   └── cheatsheets/

│       ├── _index.json

│       └── pytorch.json

│

├── lib/

│   ├── data.ts                           ← all data loading (fs-based)

│   └── search.ts                         ← Fuse.js (Phase 4 only)

│

├── types/

│   ├── package.ts

│   ├── model.ts

│   ├── registry.ts

│   ├── workflow.ts

│   ├── cheatsheet.ts

│   └── index.ts

│

└── public/ 



Type Definitions:



Part 0: Corrected Type Definitions

These replace your V1 types. Do not deviate.



types/package.ts

typescriptexport interface PackageFunction {

  fn: string;

  purpose: string;

  example: string;        // removed 'syntax' — redundant

  category: string;

}



export interface PackageSection {

  name: string;

  functions: PackageFunction[];

  gotchas: string[];

}



export interface Package {

  id: string;

  name: string;

  version: string;

  install: string;

  import_as: string;

  summary: string;

  sections: PackageSection[];

  alternatives: string[];

}



types/model.ts

typescriptexport type ModelCategory = 'ml' | 'dl' | 'llm';



export type ProblemType =

  | 'classification'

  | 'regression'

  | 'clustering'

  | 'generation'

  | 'embedding'

  | 'detection'

  | 'segmentation';



export type SpeedRating = 'fast' | 'medium' | 'slow';

export type SizeRating  = 'low'  | 'medium' | 'high';

export type InterpretabilityRating = 'high' | 'medium' | 'low';



export interface HyperParameter {

  name: string;

  default: string | number | null;

  note: string;

}



export interface Model {

  id: string;

  name: string;

  category: ModelCategory;

  problem_types: ProblemType[];          // ADDED — required for filtering

  summary: string;

  use_when: string;

  avoid_when: string;

  pros: string[];

  cons: string[];

  key_hyperparams: HyperParameter[];

  training_speed: SpeedRating;           // enum, not free string

  inference_speed: SpeedRating;

  memory_usage: SizeRating;

  interpretability: InterpretabilityRating;

  quick_start: string;

  alternatives: string[];

}



types/registry.ts

typescriptexport type RegistryTask =

  | 'embedding'

  | 'reranker'

  | 'vision'

  | 'speech'

  | 'llm'

  | 'multimodal'

  | 'ocr';



export type ModelStatus = 'active' | 'experimental' | 'deprecated';



export interface RegistryModel {

  id: string;

  model_id: string;

  task: RegistryTask;

  language: string;

  dimension?: number;

  use_case: string;

  size_mb: number;

  status: ModelStatus;

  notes: string;

  quick_start: string;

  alternatives: string[];

  last_verified: string;

}



types/workflow.ts — Merged with Recipes

typescriptexport type WorkflowType = 'pipeline' | 'snippet';



export interface WorkflowStep {

  step: number;

  name: string;

  what: string;

  tools: string[];

  decision: string;

}



export interface Workflow {

  id: string;

  name: string;

  type: WorkflowType;        // 'pipeline' = multi-step | 'snippet' = quick recipe

  category: string;

  overview: string;

  starter_stack: string[];

  steps: WorkflowStep[];

  common_failure_points: string[];

}



types/cheatsheet.ts

typescriptexport interface CheatsheetItem {

  fn: string;

  purpose: string;

}



export interface CheatsheetGroup {

  group: string;

  items: CheatsheetItem[];

}



export interface Cheatsheet {

  id: string;

  name: string;

  groups: CheatsheetGroup[];

}



types/index.ts — Re-export everything from one place

typescriptexport * from './package';

export * from './model';

export * from './registry';

export * from './workflow';

export * from './cheatsheet'; 

When I say "continue", continue from the previous phase without redesigning the architecture.





Why Each Folder Exists
app/: Serves as the core routing framework using Next.js App Router conventions.
packages/[id]: Page route dynamic segment to show package-specific details.
models/[category]: Displays model lists filtered by category (ml, dl, llm).
models/[category]/[id]: Page route dynamic segment to view specific model architecture details.
registry/[task]: Shows registry tables grouped by model tasks (embedding, ocr, etc.).
workflows/[id]: Displays step-by-step engineering workflows.
cheatsheets/[id]: Page route dynamic segment for syntax cheatsheets.
components/: Modular presentation layer components.
layout/: Global structure widgets such as Sidebar and TopBar.
shared/: Generic reusable leaf components like CodeBlock, SectionCard, StatusBadge, and FilterBar.
data/: The local filesystem knowledge storage. Replaces remote databases/APIs.
packages/, models/, registry/, workflows/, cheatsheets/: Individual JSON entries validated at build time against Zod schemas.
lib/: Business utility functions and validator schemas.
schemas/: Zod object validators corresponding directly to the database types.
data.ts: Server-only file system operations using node fs.
types/: Strict TypeScript interface models that ensure compile-time check constraints are fulfilled.