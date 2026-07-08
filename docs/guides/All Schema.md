---
id: guide-adding-cheatsheet
title: Adding a Cheatsheet
type: guide
status: active
owner: contributors
canonical: true
version: 2.0
related:
  - engineering-content-schema
  - engineering-validation
ai_priority: 4
---

# Adding a Cheatsheet

This guide outlines the step-by-step workflow and requirements for adding a syntax cheatsheet to the AI Engineering Handbook.

## Steps

1. **Create JSON File**
   Create a JSON file under `data/cheatsheets/` using a kebab-case ID as the filename:
   ```bash
   touch data/cheatsheets/{id}.json
   ```
   *Example:* `data/cheatsheets/pytorch.json`

2. **Write Content**
   - Populate the JSON content according to the schema defined in [`lib/schemas/cheatsheet.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/cheatsheet.ts) and [`lib/schemas/base.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/base.ts).
   - Ensure all required metadata and cheatsheet-specific fields are provided.
   - Set the `id` field inside the JSON file to match the filename exactly.

3. **Build Navigation Index**
   Rebuild the navigation index so the new cheatsheet is register-mapped and discoverable in the UI:
   ```bash
   npm run build:nav
   ```

4. **Validate**
   Run the content validation test suite locally to verify schema compliance and referential integrity:
   ```bash
   npm run validate
   ```

---

## Required Fields

Every cheatsheet JSON must include the following global metadata and cheatsheet-specific fields:

### Global Metadata Fields (BaseMeta)
- `id`: Unique kebab-case identifier (must match the filename exactly).
- `title`: Display title for the cheatsheet (e.g., `"PyTorch"`).
- `name`: Official cased name of the library (e.g., `"PyTorch"`).
- `slug`: URL-friendly slug (typically matches the `id`).
- `description`: 1-2 sentence overview of what syntax is covered.
- `created_at`: Strict `YYYY-MM-DD` date format.
- `updated_at`: Strict `YYYY-MM-DD` date format.
- `sources`: Array of URLs representing primary documentation sources (must contain at least one valid HTTP/HTTPS URL).

### Cheatsheet-Specific Fields
- `entries`: Array containing between 1 and 60 syntax entry objects.
- `package_reference`: (Optional) Singular string ID of the package this cheatsheet references (e.g., `"pytorch"`).

---

## Entry Structure

Each object inside the `entries` array must adhere to the following schema:

```typescript
interface CheatsheetEntry {
  problem: string;      // The problem being solved (e.g., "Create tensor from array")
  trigger: string;      // Mental trigger for when an engineer reaches for this (e.g., "Converting raw Python lists or arrays into GPU tensors")
  snippet: string;      // Raw, runnable code snippet
  minimal_notes: string; // The single most critical thing to remember
  common_bug: string;   // Actionable silent failure or gotcha to avoid
  docs_url: string;     // Direct URL to the official documentation page for the used API
}
```

---

## Field Guidance & Validation Rules

### `entries[].problem`
- **What belongs**: Concise, goal-oriented description of the task (e.g., `"Compute matrix multiplication"`).
- **What does NOT belong**: Function signatures or descriptions of how it works.

### `entries[].trigger`
- **What belongs**: Contextual scenarios or reasons why this approach is selected.
- **What does NOT belong**: Generic explanations repeating the problem statement.

### `entries[].snippet`
- **What belongs**: Raw, copy-pasteable code syntax.
- **What does NOT belong**: Markdown code block fences (`` ```python `` or `` ` ``) or import statements. Fencing is handled by the UI syntax highlighter.

### `entries[].docs_url`
- **What belongs**: A direct link to the specific class, function, or method documentation page.
- **What does NOT belong**: Generic library homepages or search URLs.

---

## Common Mistakes

- **Markdown Fences in Snippets**: Wrapping the code in backticks inside the JSON string (causes rendering issues).
- **Empty Sources Array**: Omitting source URLs in the metadata block.
- **Invalid Date Formatting**: Including timezone suffixes or timestamps in `created_at` or `updated_at`.
- **String References in Alternatives**: Using old string-only arrays instead of the `ContentRef` object array style when referencing other content.

## References

- See [`docs/engineering/content-schema.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/content-schema.md) for detailed field guidelines.
- See [`docs/engineering/validation.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/validation.md) for validation rules.


---
id: guide-adding-package
title: Adding a Package
type: guide
status: active
owner: contributors
canonical: true
version: 2.0
related:
  - engineering-content-schema
  - engineering-validation
ai_priority: 4
---

# Adding a Package

This guide outlines the step-by-step workflow and requirements for adding an engineering library/package profile to the AI Engineering Handbook.

## Steps

1. **Create JSON File**
   Create a JSON file under `data/packages/` using the lowercase package ID as the filename:
   ```bash
   touch data/packages/{id}.json
   ```
   *Example:* `data/packages/numpy.json`

2. **Write Content**
   - Populate the JSON content according to the schema defined in [`lib/schemas/package.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/package.ts) and [`lib/schemas/base.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/base.ts).
   - Ensure the internal `id` matches the filename exactly.
   - Keep case alignment consistent (e.g., if the file is `pandas.json`, the `id` must be `pandas` and the `name` should be properly cased as `pandas` or `Pandas` depending on official branding).

3. **Build Navigation Index**
   Rebuild the navigation index so the new package is registered and discoverable in the UI:
   ```bash
   npm run build:nav
   ```

4. **Validate**
   Run the content validation test suite locally to verify schema compliance, first-person triggers, and referential integrity:
   ```bash
   npm run validate
   ```

---

## Required Fields

Every package JSON must include the following global metadata and package-specific fields:

### Global Metadata Fields (BaseMeta)
- `id`: Unique kebab-case identifier (must match the filename exactly).
- `title`: Display title for the package (e.g., `"NumPy"`).
- `name`: Official cased name of the library (e.g., `"NumPy"`).
- `slug`: URL-friendly slug (typically matches the `id`).
- `description`: 1-2 sentence overview of the library's primary domain.
- `created_at`: Strict `YYYY-MM-DD` date format.
- `updated_at`: Strict `YYYY-MM-DD` date format.
- `sources`: Array of URLs representing primary documentation sources (must contain at least one valid URL).

### Package-Specific Fields
- `name`: Duplicate of official name string (for schema indexing).
- `version`: Target semantic version string documented by this entry (e.g., `"2.0.0"`).
- `summary`: Concise, 1-2 sentence description of the library's primary purpose.
- `tasks`: Array containing task-based function references (minimum of 1).

---

## Tasks Array Structure

Each object inside the `tasks` array must adhere to the following schema:

```typescript
interface PackageTask {
  task: string;                  // What the function accomplishes (e.g., "Load CSV File")
  mental_trigger: string;        // First-person engineering thought triggering this (e.g., "I need to load tabular data from a CSV file")
  syntax: string;                // Callable signature with symbolic parameters (e.g., "pd.read_csv(filepath_or_buffer)")
  important_params?: string[];   // Array of the 3-5 most commonly used parameters (max 5)
  example: string;               // Clean, 1-2 line snippet showing usage (no import statements, no markdown code block fences)
  use_when: string;              // Rule of thumb for when to use this function
  avoid_when: string;            // Rule of thumb for when to avoid this function
  decision_notes?: string;       // Decision guidance on parameter choices
  gotchas?: string[];            // Warnings outlining silent bugs, performance issues, or edge cases
  official_docs?: string;        // Direct URL to the documentation for this specific function
  related_workflows?: string[];  // Plain string array of related workflow IDs
  related_cheatsheets?: string[]; // Plain string array of related cheatsheet IDs
}
```

---

## Field Guidance & Validation Rules

### `version`
- **What belongs**: Standard semantic version strings (`X.Y.Z`).
- **What does NOT belong**: Prefix characters like `"v"` (e.g., `"v2.0.0"`) or generic terms like `"latest"`.

### `tasks[].mental_trigger`
- **First-Person Rule**: Must be written as a first-person engineering intent. It must start with or include `"I need to..."` (e.g., `"I need to create an identity matrix"`).

### `tasks[].example`
- **What belongs**: Raw, copy-pasteable example usage.
- **What does NOT belong**: Markdown code block fences (`` ```python `` or `` ` ``) or helper `import` statements. Fencing is handled by the UI.

### `tasks[].important_params`
- **Size Limit**: Maximum of 5 entries. Only list parameters that are key to the task.

### `alternatives` Array
- **What belongs**: Array of alternative package dependencies using `ContentRef` objects.
- **What does NOT belong**: Plain strings.
  *Example:* `[ { "id": "polars", "type": "package" } ]`

---

## Common Mistakes

- **Incorrect Version Prefix**: Using `"v2.1"` instead of `"2.1.0"`.
- **Markdown Fences in code**: Surrounding the `install` command, `import_as` statement, or task `example` with markdown code fences inside the JSON string.
- **No First-Person Trigger**: Writing triggers like `"Loads files"` instead of `"I need to load a CSV file"`.
- **Plain Strings in Alternatives**: Using `"cupy"` instead of `{"id": "cupy", "type": "package"}`.

## References

- See [`docs/engineering/content-schema.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/content-schema.md) for detailed field guidelines.
- See [`docs/engineering/validation.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/validation.md) for validation rules.

---
id: guide-adding-model
title: Adding a Model
type: guide
status: active
owner: contributors
canonical: true
version: 2.0
related:
  - engineering-content-schema
  - engineering-validation
ai_priority: 4
---

# Adding a Model

This guide outlines the step-by-step workflow and requirements for adding a Machine Learning, Deep Learning, or Large Language Model profile to the AI Engineering Handbook.

## Steps

1. **Create JSON File**
   Create a JSON file under the appropriate category subdirectory in `data/models/`:
   - Classic ML: `data/models/ml/{id}.json`
   - Deep Learning: `data/models/dl/{id}.json`
   - Large Language Models: `data/models/llm/{id}.json`
   
   *Example:* `data/models/llm/llama-3-8b.json`

2. **Write Content**
   - Populate the JSON content according to the schema defined in [`lib/schemas/model.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/model.ts) and [`lib/schemas/base.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/base.ts).
   - Ensure the internal `id` matching the filename exactly.
   - Match the internal `category` field with the folder name (`"ml"`, `"dl"`, or `"llm"`).

3. **Build Navigation Index**
   Rebuild the navigation index so the new model is registered and discoverable in the UI:
   ```bash
   npm run build:nav
   ```

4. **Validate**
   Run the content validation test suite locally to verify schema compliance, rating enums, and referential integrity:
   ```bash
   npm run validate
   ```

---

## Required Fields

Every model JSON must include the following global metadata and model-specific fields:

### Global Metadata Fields (BaseMeta)
- `id`: Unique kebab-case identifier (must match the filename exactly).
- `title`: Display title for the model (e.g., `"Random Forest"` or `"Llama 3 8B"`).
- `name`: Official name of the model (e.g., `"Random Forest Classifier"`).
- `slug`: URL-friendly slug (typically matches the `id`).
- `description`: 1-2 sentence overview of the model's architecture or purpose.
- `created_at`: Strict `YYYY-MM-DD` date format.
- `updated_at`: Strict `YYYY-MM-DD` date format.
- `sources`: Array of URLs representing documentation, paper, or model cards (must contain at least one valid URL).

### Model-Specific Fields
- `category`: Strict enum: `"ml"` | `"dl"` | `"llm"`.
- `problem_types`: Array of supported task types: `"classification"` | `"regression"` | `"clustering"` | `"generation"` | `"embedding"` | `"detection"` | `"segmentation"`.
- `summary`: Brief conceptual explanation of how the model works under the hood.
- `use_when`: Concise rule of thumb outlining when to select this model.
- `avoid_when`: Concise rule of thumb outlining when to bypass this model.
- `pros`: Array of technical advantages (minimum of 3).
- `cons`: Array of technical disadvantages/limitations (minimum of 3).
- `key_hyperparams`: Array of key hyperparameter settings (minimum of 1, unless the model is strictly `detection`-only).
- `training_speed`: Strict enum: `"fast"` | `"medium"` | `"slow"`.
- `inference_speed`: Strict enum: `"fast"` | `"medium"` | `"slow"`.
- `memory_usage`: Strict enum: `"low"` | `"medium"` | `"high"`.
- `interpretability`: Strict enum: `"high"` | `"medium"` | `"low"`.
- `quick_start`: Multi-line Python snippet demonstrating instantiation, fitting, or inference.
- `alternatives`: Array of `ContentRef` objects pointing to alternative models.
- `related_workflows`: Array of plain string IDs representing engineering workflows utilizing the model.

---

## Field Guidance & Structure

### `key_hyperparams` Array Structure
Each object inside the `key_hyperparams` array must follow this shape:
```typescript
interface HyperParameter {
  name: string;                   // Framework-specific parameter name (e.g., "n_estimators", "temperature")
  default: string | number | null; // The default value. MUST be a JSON primitive. Boolean or objects are not allowed.
  note: string;                   // Tuning advice or performance impact
}
```

### `alternatives` Array Structure
Must use typed `ContentRef` objects instead of plain strings:
```json
"alternatives": [
  { "id": "lightgbm", "type": "model" }
]
```

### `quick_start` Snippet Rules
- **No Markdown Code Fences**: Write the snippet as raw text inside the JSON string (do not wrap in `` ```python ``). Fencing is applied automatically by the UI renderer.
- **Runnable**: Ensure it is clean, executable code demonstrating imports, initialization, and inference.

---

## Common Mistakes

- **Incorrect Ratings**: Using ratings like `"very fast"` or `"high"` for speed fields, which only accept `"fast" | "medium" | "slow"`.
- **Too Few Pros or Cons**: Providing less than 3 advantages or 3 limitations.
- **Markdown Fences in code**: Surrounding the `quick_start` snippet with markdown backticks inside the JSON value.
- **Non-Primitive Defaults**: Using booleans (e.g., `true`) or nested objects in the `default` field of `key_hyperparams`.

## References

- See [`docs/engineering/content-schema.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/content-schema.md) for detailed field guidelines.
- See [`docs/engineering/validation.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/validation.md) for validation rules.

---
id: guide-adding-pattern
title: Adding a Pattern
type: guide
status: active
owner: contributors
canonical: true
version: 1.0
related:
  - engineering-content-schema
  - engineering-validation
ai_priority: 4
---

# Adding a Pattern

This guide outlines the step-by-step workflow and requirements for adding a tool-agnostic, concept-focused engineering pattern to the AI Engineering Handbook.

## Steps

1. **Create JSON File**
   Create a JSON file under `data/patterns/` using a lowercase, kebab-case ID as the filename:
   ```bash
   touch data/patterns/{id}.json
   ```
   *Example:* `data/patterns/early-stopping.json`

2. **Write Content**
   - Populate the JSON content according to the schema defined in [`lib/schemas/pattern.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/pattern.ts) and [`lib/schemas/base.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/base.ts).
   - Ensure the internal `id` matches the filename exactly.

3. **Build Navigation Index**
   Rebuild the navigation index so the new pattern is registered and discoverable in the UI:
   ```bash
   npm run build:nav
   ```

4. **Validate**
   Run the content validation test suite locally to verify schema compliance and referential integrity:
   ```bash
   npm run validate
   ```

---

## Required Fields

Every pattern JSON must include the following global metadata and pattern-specific fields:

### Global Metadata Fields (BaseMeta)
- `id`: Unique kebab-case identifier (must match the filename exactly).
- `title`: Display title for the pattern (e.g., `"Early Stopping"`).
- `name`: Official title of the pattern (e.g., `"Early Stopping"`).
- `slug`: URL-friendly slug (typically matches the `id`).
- `description`: 1-2 sentence overview of the pattern's intent.
- `created_at`: Strict `YYYY-MM-DD` date format.
- `updated_at`: Strict `YYYY-MM-DD` date format.
- `sources`: Array of URLs representing documentation, paper, or research references (must contain at least one valid URL).

### Pattern-Specific Fields
- `concept`: A detailed explanation of the core engineering concept (how the pattern operates).
- `applicability`: Guidance outlining when this pattern should be applied.

---

## Optional & Relationship Fields

### Optional Guidance
- `anti_patterns`: (Optional, default `[]`) Array of common misapplications or incorrect implementations to avoid.
- `implementation_notes`: (Optional) Detailed guide on how to implement the pattern without referencing specific library packages.
- `examples`: (Optional, default `[]`) Language-agnostic or pseudo-code examples showing structural patterns.

### Cross-References (Relationship Fields)
Since patterns are concept-focused, relationship fields use simple string arrays of core entity IDs:
- `related_workflows`: Array of workflow IDs that implement this pattern.
- `related_models`: Array of model IDs that utilize this pattern.
- `related_packages`: Array of package IDs that support or implement this pattern.
- `related_principles`: Array of principle IDs that provide the theoretical foundation for this pattern.

---

## Common Mistakes

- **Library-Specific Snippets in Concept/Implementation**: Including imports or syntax for a specific library (e.g., PyTorch). Package-specific details belong in `Package` or `Cheatsheet` pages, while patterns must remain tool-agnostic.
- **Plain Strings in Alternatives**: Patterns don't have an `alternatives` field, but all cross-references in the metadata's `related_content` array must use the `ContentRef` object structure.
- **Vague Applicability Guidelines**: Writing generic recommendations instead of concrete engineering indicators (e.g., `"Use when training deep learning models that show signs of validation loss divergence"`).

## References

- See [`docs/engineering/content-schema.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/content-schema.md) for detailed field guidelines.
- See [`docs/engineering/validation.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/validation.md) for validation rules.

---
id: guide-adding-workflow
title: Adding a Workflow
type: guide
status: active
owner: contributors
canonical: true
version: 2.0
related:
  - engineering-content-schema
  - engineering-validation
ai_priority: 4
---

# Adding a Workflow

This guide outlines the step-by-step workflow and requirements for adding a detailed engineering pipeline or code walkthrough (workflow) to the AI Engineering Handbook.

## Steps

1. **Create JSON File**
   Create a JSON file under `data/workflows/` using the lowercase, kebab-case ID as the filename:
   ```bash
   touch data/workflows/{id}.json
   ```
   *Example:* `data/workflows/rag.json`

2. **Write Content**
   - Populate the JSON content according to the schema defined in [`lib/schemas/workflow.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/workflow.ts) and [`lib/schemas/base.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/base.ts).
   - Ensure the internal `id` matches the filename exactly.

3. **Build Navigation Index**
   Rebuild the navigation index so the new workflow is registered and discoverable in the UI:
   ```bash
   npm run build:nav
   ```

4. **Validate**
   Run the content validation test suite locally to verify schema compliance, step indexing, and referential integrity:
   ```bash
   npm run validate
   ```

---

## Required Fields

Every workflow JSON must include the following global metadata and workflow-specific fields:

### Global Metadata Fields (BaseMeta)
- `id`: Unique kebab-case identifier (must match the filename exactly).
- `title`: Display title for the workflow (e.g., `"Retrieval-Augmented Generation"`).
- `name`: Official title of the workflow (e.g., `"Retrieval-Augmented Generation"`).
- `slug`: URL-friendly slug (typically matches the `id`).
- `description`: 1-2 sentence overview of the pipeline's goal.
- `created_at`: Strict `YYYY-MM-DD` date format.
- `updated_at`: Strict `YYYY-MM-DD` date format.
- `sources`: Array of URLs representing primary documentation sources (must contain at least one valid URL).

### Workflow-Specific Fields
- `type`: Strict enum: `"pipeline"` (multi-step workflow) | `"snippet"` (quick coding walkthrough).
- `category`: Engineering category name (e.g., `"Inference"`, `"Fine-Tuning"`, `"Evaluation"`).
- `overview`: A high-level description of what the workflow achieves.
- `starter_stack`: Array of recommended libraries/technologies (e.g., `["LlamaIndex", "ChromaDB", "SentenceTransformers"]`).
- `steps`: Array of workflow steps (minimum of 3 steps).
- `common_failure_points`: Array of overall pipeline failure warnings.

---

## Steps Structure

Each object inside the `steps` array must adhere to the following schema:

```typescript
interface WorkflowStep {
  step: number;                 // Sequential 1-indexed step number (1, 2, 3, etc.)
  name: string;                 // Title of the step
  what: string;                 // Technical description of the operation performed
  tools: string[];              // Specific software tools or class references utilized (e.g., ["PyMuPDF", "FAISS"])
  decision: string;             // Structural parameter guidelines or architectural decision notes
  uses: {                       // References to cataloged packages, models, and cheatsheets used in this step
    packages: string[];         // Array of package IDs
    models: string[];           // Array of model IDs
    cheatsheets: string[];      // Array of cheatsheet IDs
  };
  failure_points: string[];     // Specific failure scenarios for this step with root causes
}
```

---

## Relationship & Optional Fields

### Cross-Reference Fields (ContentRef Arrays)
Relationships linking the workflow to other content types must use arrays of `ContentRef` objects:
- `related_patterns`
- `related_models`
- `related_packages`
- `related_debug_guides`

*Example:*
```json
"related_debug_guides": [
  { "id": "cuda-oom", "type": "debug_guide" }
]
```

### Optional Metadata & Tuning
- `evaluation_checks`: (Optional) Measurable success criteria or validation metrics.
- `next_links`: (Optional) Plain string IDs of workflows to explore next.
- `worked_examples`: (Optional) Array of objects: `{ "name": string, "description": string, "implementation_notes"?: string }`.
- `production_notes`: (Optional) Production deployment notes.
- `scaling_notes`: (Optional) Scaling considerations.

---

## Common Mistakes

- **Incorrect Step Indexing**: Starting step numbers at `0` instead of `1`, or using strings (`"1"`) instead of integers.
- **Too Few Steps**: Providing less than 3 steps.
- **Incorrect `uses` Object Format**: Forgetting to define `packages`, `models`, or `cheatsheets` as arrays inside `uses`, or leaving the parent `uses` object out entirely.
- **Plain Strings in Relationships**: Using string arrays for `related_packages` or `related_models` instead of the required `ContentRef` format.

## References

- See [`docs/engineering/content-schema.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/content-schema.md) for detailed field guidelines.
- See [`docs/engineering/validation.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/validation.md) for validation rules.


---
id: guide-adding-registry
title: Adding a Registry Entry
type: guide
status: active
owner: contributors
canonical: true
version: 1.0
related:
  - engineering-content-schema
  - engineering-validation
ai_priority: 4
---

# Adding a Registry Entry

This guide outlines the step-by-step workflow and requirements for adding deployment, hosting, or download metadata to the task registries in the AI Engineering Handbook.

## Steps

1. **Locate or Create the Registry File**
   Registry entries are stored inside task-specific JSON array tables located under `data/registry/`:
   - `embeddings.json` (Embedding models)
   - `rerankers.json` (Reranking models)
   - `llms.json` (Large Language Models)
   - `vision.json` (Computer Vision models)
   - `speech.json` (Audio/Speech models)
   - `ocr.json` (Optical Character Recognition models)
   - `multimodal.json` (Multimodal models)

2. **Add Registry Object**
   - Open the target JSON file and add a new object to the top-level array.
   - Populate the object fields according to the schema defined in [`lib/schemas/registry.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/registry.ts) and [`lib/schemas/base.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/base.ts).
   - Ensure the internal `task` field matches the task-type of the target registry file (e.g., in `embeddings.json`, `task` must be `"embedding"`).

3. **Build Navigation Index**
   Rebuild the navigation index so the new asset is registered in the UI index:
   ```bash
   npm run build:nav
   ```

4. **Validate**
   Run the content validation test suite locally to verify schema compliance and task alignment:
   ```bash
   npm run validate
   ```

---

## Required Fields

Every registry entry object inside the JSON array must include the following global metadata and registry-specific fields:

### Global Metadata Fields (BaseMeta)
- `id`: Unique kebab-case identifier (e.g., `"bge-large-en-v1.5"`).
- `title`: Display title for the registry entry (e.g., `"BGE Large EN v1.5"`).
- `name`: Official name of the model/dataset (e.g., `"bge-large-en-v1.5"`).
- `slug`: URL-friendly slug (typically matches the `id`).
- `description`: 1-2 sentence overview of the asset's capability.
- `created_at`: Strict `YYYY-MM-DD` date format.
- `updated_at`: Strict `YYYY-MM-DD` date format.
- `sources`: Array of URLs representing model cards or repos (must contain at least one valid URL).

### Registry-Specific Fields
- `task`: Strict task enum: `"embedding"` | `"reranker"` | `"vision"` | `"speech"` | `"llm"` | `"multimodal"` | `"ocr"`.
- `category`: Strict asset type enum: `"models"` | `"datasets"` | `"benchmarks"` | `"services"` | `"leaderboards"` | `"mcp_servers"` | `"repos"`.
- `size_mb`: File or memory footprint size in Megabytes (number).
- `link`: A direct string URL to download/access the asset, OR a structured reference for missing model definitions (`{ "type": "missing", "id": string, "reason"?: string }`).

---

## Optional Fields

Registry entries act purely as deployment catalog nodes, so they support the following optional deployment parameters:
- `hardware_requirements`: (Optional) Description of VRAM/CPU needs (e.g., `"Minimum 24GB VRAM for FP16 inference"`).
- `download_location`: (Optional) Valid HTTPS URL directly pointing to the download destination (e.g., Hugging Face model file path).
- `license`: (Optional) License type (e.g., `"apache-2.0"`, `"llama-3"`).
- `supported_tasks`: (Optional, default `[]`) Sub-tasks supported by the asset.
- `version_compatibility`: (Optional, default `[]`) Specific versions of packages this is verified against.
- `official_resources`: (Optional, default `[]`) Array of valid resource URLs.

---

## Common Mistakes

- **Adding Tutorials or Code Snippets**: Registry nodes are strictly deployment metadata containers. Detailed tutorials, explanations, or code examples belong in `Workflow`, `Model`, or `Package` pages instead.
- **Task-to-File Mismatches**: Adding a model with `task: "embedding"` to `llms.json` instead of `embeddings.json` (causes validator failure).
- **Wrapping link fields**: Using relative file paths instead of valid absolute URLs or structured missing references.

## References

- See [`docs/engineering/content-schema.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/content-schema.md) for detailed field guidelines.
- See [`docs/engineering/validation.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/validation.md) for validation rules.


---
id: guide-adding-debug-guide
title: Adding a Debug Guide
type: guide
status: active
owner: contributors
canonical: true
version: 1.0
related:
  - engineering-content-schema
  - engineering-validation
ai_priority: 4
---

# Adding a Debug Guide

This guide outlines the step-by-step workflow and requirements for adding a symptom-first troubleshooting guide to the AI Engineering Handbook.

## Steps

1. **Create JSON File**
   Create a JSON file under `data/debug-guides/` using a lowercase, kebab-case ID as the filename:
   ```bash
   touch data/debug-guides/{id}.json
   ```
   *Example:* `data/debug-guides/cuda-oom.json`

2. **Write Content**
   - Populate the JSON content according to the schema defined in [`lib/schemas/debug-guide.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/debug-guide.ts) and [`lib/schemas/base.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/base.ts).
   - Ensure the internal `id` matches the filename exactly.

3. **Build Navigation Index**
   Rebuild the navigation index so the new debug guide is registered and discoverable in the UI:
   ```bash
   npm run build:nav
   ```

4. **Validate**
   Run the content validation test suite locally to verify schema compliance and referential integrity:
   ```bash
   npm run validate
   ```

---

## Required Fields

Every debug guide JSON must include the following global metadata and debug-specific fields:

### Global Metadata Fields (BaseMeta)
- `id`: Unique kebab-case identifier (must match the filename exactly).
- `title`: Display title for the debug guide (e.g., `"CUDA Out of Memory"`).
- `name`: Official title of the guide (e.g., `"CUDA Out of Memory Troubleshooting Guide"`).
- `slug`: URL-friendly slug (typically matches the `id`).
- `description`: 1-2 sentence overview of the troubleshooting topic.
- `created_at`: Strict `YYYY-MM-DD` date format.
- `updated_at`: Strict `YYYY-MM-DD` date format.
- `sources`: Array of URLs representing documentation, forums, or issue threads (must contain at least one valid URL).

### Debug-Specific Fields
- `category`: Strict enum: `"training"` | `"gpu"` | `"data"` | `"llm"` | `"python"` | `"deployment"` | `"performance"` | `"memory"`.
- `symptoms`: Array containing observable failure states (minimum of 1 symptom).
- `root_causes`: Array containing potential root causes, ordered by probability (minimum of 1 cause).
- `diagnosis`: Array of steps showing how to isolate and identify the cause (minimum of 1 diagnosis check).
- `solutions`: Array of step-by-step procedures to resolve the error (minimum of 1 solution).
- `prevention`: Array detailing how to avoid encountering the problem again (minimum of 1 prevention plan).

---

## Nested Structures & Subschemas

### Symptoms Array
```typescript
interface DebugSymptom {
  symptom: string;           // Title or short description of failure (e.g., "RuntimeError: CUDA out of memory.")
  description?: string;      // (Optional) Verbose log output snippet or diagnostic description
}
```

### Root Causes Array
```typescript
interface DebugRootCause {
  cause: string;                             // Short description of the cause (e.g., "Batch size is too large for GPU VRAM")
  probability?: "high" | "medium" | "low";  // Likelihood (defaults to "medium")
  explanation?: string;                      // (Optional) Theoretical reason for why this cause triggers the failure
}
```

### Diagnosis Checks Array
```typescript
interface DebugDiagnosis {
  test: string;             // Diagnostic command or code snippet to run
  expected_result: string;  // Expected output if this is indeed the root cause
  how_to_perform: string;   // Steps detailing how to execute the test
}
```

### Solutions Array
```typescript
interface DebugSolution {
  solution: string;          // Overview of the fix (e.g., "Enable Gradient Accumulation")
  steps: string[];           // Bullet points detailing the implementation steps
  verification?: string;     // (Optional) How to verify the fix works (e.g., check that training resumes)
}
```

### Prevention Array
```typescript
interface DebugPrevention {
  prevention: string;        // Overview of the preventative practice
  practices: string[];       // Specific code patterns or configurations to adopt
}
```

### Relationship Fields
Unlike core entities, debug guide relationship fields must use arrays of `ContentRef` objects:
- `related_packages`
- `related_workflows`
- `related_patterns`
- `related_models`
- `related_registry`

*Example:*
```json
"related_packages": [
  { "id": "pytorch", "type": "package" }
]
```

---

## Common Mistakes

- **Technology-First Instead of Symptom-First**: Naming guides after the library (e.g., `pytorch-errors.json`) rather than the error itself (e.g., `nan-loss.json`).
- **Unactionable Solutions**: Providing generic suggestions like `"Rewrite your code"` without actionable, step-by-step commands or code patches.
- **Using Plain Strings in Cross-References**: Defining `related_packages` as `["pytorch"]` instead of `[{"id": "pytorch", "type": "package"}]`.

## References

- See [`docs/engineering/content-schema.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/content-schema.md) for detailed field guidelines.
- See [`docs/engineering/validation.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/validation.md) for validation rules.


---
id: guide-adding-decision-guide
title: Adding a Decision Guide
type: guide
status: active
owner: contributors
canonical: true
version: 1.0
related:
  - engineering-content-schema
  - engineering-validation
ai_priority: 4
---

# Adding a Decision Guide

This guide outlines the step-by-step workflow and requirements for adding an engineering trade-off comparison (Decision Guide) to the AI Engineering Handbook.

## Steps

1. **Create JSON File**
   Create a JSON file under `data/decision-guides/` using a lowercase, kebab-case ID as the filename:
   ```bash
   touch data/decision-guides/{id}.json
   ```
   *Example:* `data/decision-guides/pytorch-vs-tensorflow.json`

2. **Write Content**
   - Populate the JSON content according to the schema defined in [`lib/schemas/decision-guide.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/decision-guide.ts) and [`lib/schemas/base.ts`](file:///d:/Project/ai-engineering-handbook/lib/schemas/base.ts).
   - Ensure the internal `id` matches the filename exactly.

3. **Build Navigation Index**
   Rebuild the navigation index so the new decision guide is registered and discoverable in the UI:
   ```bash
   npm run build:nav
   ```

4. **Validate**
   Run the content validation test suite locally to verify schema compliance, minimum choices, and referential integrity:
   ```bash
   npm run validate
   ```

---

## Required Fields

Every decision guide JSON must include the following global metadata and decision-specific fields:

### Global Metadata Fields (BaseMeta)
- `id`: Unique kebab-case identifier (must match the filename exactly).
- `title`: Display title for the decision guide (e.g., `"PyTorch vs TensorFlow"`).
- `name`: Official title of the comparison (e.g., `"PyTorch vs TensorFlow Comparison"`).
- `slug`: URL-friendly slug (typically matches the `id`).
- `description`: 1-2 sentence overview of the trade-off topic.
- `created_at`: Strict `YYYY-MM-DD` date format.
- `updated_at`: Strict `YYYY-MM-DD` date format.
- `sources`: Array of URLs representing documentation, benchmark papers, or articles (must contain at least one valid URL).

### Decision-Specific Fields
- `category`: Strict enum: `"models"` | `"frameworks"` | `"llm"` | `"infrastructure"` | `"data_processing"` | `"deployment"`.
- `problem`: Description of the core engineering decision problem (e.g., `"Choosing the deep learning framework for production model training and serving"`).
- `evaluation_criteria`: Array of criteria to compare the options against (minimum of 1 criteria).
- `options`: Array of options compared in the guide (minimum of 2 option objects).
- `recommendations`: Detailed guidance mapping scenario parameters to recommended options.

---

## Subschemas & Field Shapes

### Evaluation Criteria Schema
```typescript
interface DecisionCriteria {
  criterion: string;       // Name of the criteria (e.g., "Developer Velocity", "Inference Speed")
  weight?: number;         // (Optional) Weight from 0 to 1 for decision matrices (defaults to 1)
  description?: string;    // (Optional) Explanation of what this criteria checks
}
```

### Options Schema
```typescript
interface DecisionOption {
  name: string;             // Display name (e.g., "PyTorch")
  id: string;               // Reference ID to corresponding catalog content (e.g., "pytorch")
  strengths: string[];      // Array of advantages/strengths
  weaknesses: string[];     // Array of disadvantages/weaknesses
  best_for: string;         // Summary of when this option is the optimal choice
  avoid_when: string;       // Summary of when this option should be bypassed
}
```

### Comparison Table (Optional)
A record containing structured comparative parameter mappings:
```json
"comparison_table": {
  "Autograd System": "Dynamic (Define-by-Run) for PyTorch vs Static/Dynamic for TensorFlow",
  "Distributed Training": "Excellent native support via torch.distributed"
}
```

### Relationship Fields
Decision guides reference related catalog nodes using standard `ContentRef` object arrays:
- `related_workflows`
- `related_packages`
- `related_models`

---

## Common Mistakes

- **Comparing Less Than 2 Options**: Compiling a decision guide that only contains one option (causes validation script failure).
- **Vague Recommendations**: Recommending options based on subjective preference rather than concrete criteria and parameters.
- **Malformed Cross-References**: Using plain string arrays for `related_packages` or `related_models` instead of `ContentRef` arrays.

## References

- See [`docs/engineering/content-schema.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/content-schema.md) for detailed field guidelines.
- See [`docs/engineering/validation.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/validation.md) for validation rules.
