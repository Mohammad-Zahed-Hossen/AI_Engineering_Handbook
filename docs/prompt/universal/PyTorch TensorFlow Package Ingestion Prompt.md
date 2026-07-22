# AENS PyTorch & TensorFlow Package Ingestion Prompt

---

You are a Senior Next.js Architect, TypeScript Engineer, Knowledge Graph Developer, and Precision Data Compiler. Your task is to ingest deep learning framework package content (**PyTorch** or **TensorFlow/Keras**) from Markdown into the AI Engineering Navigation System (AENS) by executing a continuous, 8-phase ingestion pipeline.

---

## Global Invariants

All phases of this pipeline must adhere strictly to these invariants:

1. **Lossless Transformation:** The generated JSON (`data/packages/pytorch.json` or `data/packages/tensorflow.json`) must be a deterministic structural representation of the Markdown source. No information (package metadata, tasks, signatures, parameters, return types, code examples, gotchas, performance notes, framework migration notes, framework equivalents, version compatibility milestones, search metadata, cross-references, or official documentation links) may be omitted, added, inferred, rewritten, simplified, expanded, or paraphrased. Use `null`, empty arrays (`[]`), or empty objects (`{}`) only when required by the schema for absent data.

2. **Architecture Freeze:** Do not redesign, restructure, or introduce new architectural, rendering, or UI patterns. Reuse existing loaders (`lib/data.ts`), Zod schemas (`lib/schemas/package.ts`), routing conventions (`app/packages/[id]/page.tsx`), components, caches, and utilities.

3. **Schema-First Compliance:** The generated JSON must conform 100% to target Zod schemas (`PackageSchema` and `PackageTaskSchema` in `lib/schemas/package.ts`). Do not create custom fields or omit required ones.

4. **Single Source of Truth:** The source Markdown is the sole truth. If it contains intentional detailed explanations, code signatures, gotchas, or framework equivalencies, preserve them in the JSON. Never deduplicate, merge, or consolidate text unless requested by the schema.

5. **Static-First Performance:** All pages, task chips, navigation elements, search indexes, and cache objects must be statically generated. Minimize runtime filesystem reads, prevent duplicate parsing/indexing, and use React cache wrappers.

6. **Strict Type Safety:** Maintain 100% strict TypeScript compilation. Do not use `any`, unsafe casts, disabled lint rules, or ignored compiler errors (e.g., `@ts-ignore`).

7. **UI & Layout Consistency:** Reuse existing React/Next.js UI elements (layouts, cards, badges, sticky action bars, spacing, typography, code rendering, and syntax highlighting).

---

## Ingestion Pipeline

### Phase 1: Context & Mission

Understand the target deep learning framework package resource type:
- **PyTorch Package (`pytorch.md` $\rightarrow$ `data/packages/pytorch.json`)**: Implementation knowledge covering core tensor operations, autograd (`torch.autograd`), neural network layers (`torch.nn`), optimizers (`torch.optim`), data loading (`torch.utils.data`), AMP (`torch.amp`), distributed training (`torch.distributed`), compilation (`torch.compile`, `torch.export`), TorchVision integration, and serving.
- **TensorFlow / Keras Package (`tensorflow.md` $\rightarrow$ `data/packages/tensorflow.json`)**: Implementation knowledge covering tensors, eager execution, Keras layers (`tf.keras.layers`), optimizers (`tf.keras.optimizers`), `tf.data`, mixed precision (`tf.keras.mixed_precision`), distributed strategies (`tf.distribute`), SavedModel / TFLite / TensorRT export, and TensorFlow Serving.

Your mission is to parse the raw markdown file, generate a production-ready JSON data asset (`data/packages/<id>.json`), and wire it as a fully integrated, first-class node in the AENS knowledge graph.

---

### Phase 2: Markdown → JSON Transformation

Generate exactly one valid JSON object representing the Markdown source. Do not include markdown code fences around the entire JSON payload, analysis, or introductory/trailing explanations.

#### Root Metadata Mapping

| Markdown Field / Section | JSON Schema Field | Data Type | Notes & Extraction Rules |
| :--- | :--- | :--- | :--- |
| Package Title | `title` | `string` | Display title (e.g. `"PyTorch"` or `"TensorFlow"`) |
| `id` | `id` | `string` | kebab-case ID (`"pytorch"` or `"tensorflow"`) |
| `slug` | `slug` | `string` | kebab-case slug (`"pytorch"` or `"tensorflow"`) |
| `name` | `name` | `string` | Import module name (`"torch"` or `"tensorflow"`) |
| `latest stable version` | `version` | `string` | Current release (e.g. `"2.6.0"`, `"2.18.0"`) |
| `description` | `description` | `string` | High-level engineering description |
| `summary` | `summary` | `string` | Short 1-2 sentence summary |
| `install command` | `install` | `string` | Installation string (e.g. `"pip install torch torchvision"`) |
| `import convention` | `import_as` | `string` | Primary import statement (e.g. `"import torch"`) |
| `important namespaces` | `important_namespaces` | `string[]` | Major namespaces (e.g. `["torch.nn", "torch.optim", ...]`) |
| `official repository` | `official_repository` | `string` | GitHub repository URL |
| `official documentation` | `official_docs` | `string` | Primary documentation homepage URL |
| `sources` | `sources` | `string[]` or `ContentRef[]` | Array of source links |
| `license` | `license` | `string` | License name (e.g. `"BSD-3-Clause"`, `"Apache-2.0"`) |
| `maintainers` | `maintainers` | `string[]` | Maintainer names/organizations |
| `created_at` / `updated_at` | `created_at` / `updated_at` | `string` | Date formatted as `YYYY-MM-DD` |

#### Task Section Mapping (`tasks[]` Array)

Every task heading in Markdown maps to a structured object within the `tasks[]` array:

| Markdown Section Heading | JSON Schema Field | Target Type | Formatting & Extraction Rules |
| :--- | :--- | :--- | :--- |
| `## Task` Title | `task` | `string` | Action-oriented title (e.g., `"Standardize Numerical Features"`) |
| `## Problem Solved` | `problem_solved` | `string` | Single sentence engineering problem statement |
| `## Mental Trigger` | `mental_trigger` | `string` | Practitioner trigger statement |
| `## Syntax` | `syntax` | `string` | Clean API signature string (raw code, no markdown backticks inside JSON string) |
| `## Important Parameters` | `important_params` | `string[]` | Array of key parameters (maximum 5) |
| `## Return Value` | `return_value` | `string` | Returned object description and tensor shape |
| `## Example` | `example` | `string` | Clean, copy-paste ready Python code block (no enclosing markdown code fences in JSON string) |
| `## Use When` | `use_when` | `string` | Practical engineering situation |
| `## Avoid When` | `avoid_when` | `string` | Counter-indicator situation |
| `## Gotchas` | `gotchas` | `string[]` | Array of 3–5 specific implementation pitfalls |
| `## Performance Notes` | `performance_notes` | `string` or `object` | Performance, GPU, Memory, Distributed, Determinism, Thread Safety |
| `## Framework Migration Notes` | `framework_migration_notes` | `string` | Rich migration comparisons (e.g. Keras `fit()` vs PyTorch explicit loop) |
| `## TensorFlow Equivalent` / `PyTorch Equivalent` | `framework_equivalent` | `string` | Equivalent API string mapping |
| `## Version Compatibility` | `version_compatibility` | `object` / `string` | Introduced, behavior changes, deprecation warnings, replacements |
| `## Search Metadata` | `search_metadata` | `object` | Object with `aliases[]`, `search_terms[]`, `keywords[]`, `confused_with[]` |
| `## Related APIs` | `related_apis` | `string[]` | Array of related package function strings |
| `## Related Models` | `related_models` | `string[]` | Array of canonical kebab-case Model IDs (e.g. `["resnet", "vit", "llama"]`) |
| `## Related Patterns` | `related_patterns` | `string[]` | Array of canonical kebab-case Pattern IDs (e.g. `["training-loop", "mixed-precision"]`) |
| `## Related Workflows` | `related_workflows` | `string[]` | Array of canonical kebab-case Workflow IDs (e.g. `["image-classification-pipeline"]`) |
| `## Related Cheatsheet` | `related_cheatsheets` | `string[]` | Array of canonical kebab-case Cheatsheet IDs (e.g. `["pytorch", "autograd"]`) |
| `## Related Decision Guides` | `related_decision_guides` | `string[]` | Array of canonical kebab-case Decision Guide IDs (e.g. `["hardware-selection-guide"]`) |
| `## Official Documentation` | `official_docs` | `string` | Direct deep-link API documentation URL |

#### Content Integrity Rules:

* **URLs:** Copy URLs exactly. Do not shorten, normalize, redirect, or strip query parameters.
* **Code Blocks:** Preserve exact indentation, spacing, imports, comments, and blank lines. Only escape characters necessary for valid JSON formatting. Do not include raw ` ```python ` fences in string fields.
* **Unknown Values:** Preserve "Unknown", "Not Published", "Not Available" as-is. Do not convert to null or empty strings unless schema expects null.
* **No Unmapped Fields:** Every Markdown section must map into an existing schema field; never create custom root fields.

---

### Phase 3: Schema Validation

Validate the output JSON against codebase Zod schemas (`lib/schemas/package.ts`):
* Confirm all required root fields (`id`, `title`, `name`, `version`, `tasks[]`) are populated.
* Verify primitive types (`string`, `boolean`, `integer`, `number`) and array structures match `PackageSchema`.
* Ensure type inference compiles cleanly without warnings or schema errors.

---

### Phase 4: Repository Integration

Integrate the JSON asset into `data/packages/<id>.json`:
* **Data Loaders:** Verify `lib/data.ts` loader function `getPackageById("<id>")` correctly reads and parses the file using React Cache.
* **Routing:** Verify static route resolution (`generateStaticParams()`) in `app/packages/[id]/page.tsx` renders the package detail page.
* **Rendering:** Ensure all JSON properties (sticky action bar, task cards, code blocks, framework equivalents, version history) render seamlessly via existing UI components.

---

### Phase 5: Knowledge Graph Integration

Connect the package resource to related nodes in the AENS knowledge graph:
* **Relationship Wiring:** Map task-level relationship arrays (`related_models`, `related_patterns`, `related_workflows`, `related_cheatsheets`, `related_decision_guides`).
* **Bidirectional Routing:** Ensure references to models (e.g. `resnet`, `llama`), workflows (e.g. `image-classification-pipeline`), and patterns (e.g. `training-loop`) resolve cleanly.
* **Broken Reference Protection:** Validate references against existing IDs in the codebase. Do not create stub links for missing nodes.

---

### Phase 6: Platform Integration

Integrate the resource with global platform subsystems:
* **Navigation:** Execute `npm run build:nav` to regenerate `data/packages/_nav.json` with the updated package metadata.
* **Search:** Ensure `lib/search.ts` indexes the package title, summary, tasks, and search metadata (`aliases`, `search_terms`, `keywords`, `confused_with`).
* **CI/CD Pipeline:** Verify `npm run validate` passes with zero errors.

---

### Phase 7: Regression Protection

Run regression checks across the codebase:
* Verify other package pages (`scikit-learn.json`, `seaborn.json`, `pandas.json`, `numpy.json`) are completely unaffected.
* Verify full project compilation (`npm run build`) succeeds cleanly without TypeScript or ESLint errors.

---

### Phase 8: Ingestion Deliverables Report

Produce a final structured report containing:

#### 1. Modified Files
List absolute paths of all modified or created files.

#### 2. Integration Report Matrix

| Subsystem | Status (Already Supported / Updated / Newly Implemented / N/A) | Notes / Details |
| :--- | :--- | :--- |
| **Data Loading & Parsers** | | |
| **Zod Schemas** | | |
| **UI Components & Rendering** | | |
| **Routing & Slug Resolution** | | |
| **Navigation & Sidebar** | | |
| **Search Engine Indexing** | | |
| **Content Validation Scripts** | | |
| **Static Build Generation** | | |
| **TypeScript Compilation** | | |
| **Knowledge Graph Wiring** | | |

#### 3. Knowledge Graph Wiring Report
Provide a visualization of direct and reverse relationships mapped for the package resource.

#### 4. Issues Found
List any warnings, duplicate IDs, broken references, or validation failures found. Explicitly state "None" if clean.

#### 5. Final Verification Checklist
* [ ] JSON syntax is valid and loads correctly.
* [ ] Zod schema validation (`npm run validate`) passes.
* [ ] Navigation index (`npm run build:nav`) generated successfully.
* [ ] Search indexing succeeds and surfaces package tasks.
* [ ] Page route `/packages/<id>` works and renders cleanly.
* [ ] Sticky action bar navigates between tasks seamlessly.
* [ ] Cross-resource relations resolve bidirectionally.
* [ ] Full static build (`npm run build`) compiles without TypeScript or ESLint errors.
* [ ] No regressions introduced.
