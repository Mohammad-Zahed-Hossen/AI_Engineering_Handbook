# AI Engineering Handbook Content-Writing Guidelines

This document serves as the ground truth reference for populating content within the **AI Engineering Handbook**. All data is stored as local JSON files and validated at build-time. Adherence to these schemas and guidelines is critical to prevent build compilation and rendering failures.

---

## Global Metadata Fields (`BaseMetaSchema`)

All main data objects extend `BaseMetaSchema` at the Zod level. Even if these fields are not explicitly visible in basic TypeScript domain interfaces, they are **mandatory** in all JSON files (with the exception of `_index.json` indices and `meta.json`).

### 1. `created_at`
* **What belongs**: A date string representing the initial creation date of the entry in strict `YYYY-MM-DD` format (e.g., `"2026-06-24"`).
* **What does NOT belong**: Relative dates (e.g., `"today"`), fully qualified ISO timestamps (e.g., `"2026-06-24T02:19:44Z"`), or custom formats (e.g., `"06/24/2026"`).
* **Common AI Mistakes**: Generating full timestamps, empty values, or system dates containing timezone modifiers.
* **Manual Verification**: Verify format matches regex `^\d{4}-\d{2}-\d{2}$`.

### 2. `updated_at`
* **What belongs**: A date string representing the last revision date of the entry in strict `YYYY-MM-DD` format.
* **What does NOT belong**: Timestamps, relative text, or a date prior to `created_at`.
* **Common AI Mistakes**: Leaving it unmodified when revising an existing entry, or formatting as a date-time.
* **Manual Verification**: Must match regex `^\d{4}-\d{2}-\d{2}$` and must be greater than or equal to `created_at`.

### 3. `sources`
* **What belongs**: An array of string references used to compile the data (e.g., `["https://numpy.org"]`, `["Attention Is All You Need paper"]`, `["Internal developer notes"]`). Can be a URL, paper title, or personal note.
* **What does NOT belong**: Empty lists.
* **Common AI Mistakes**: Leaving the array empty.
* **Manual Verification**: Ensure at least one source reference is provided.

---

## 1. Packages (`types/package.ts`)

Defines the structure for libraries/packages (e.g., `numpy.json`, `pandas.json`).

```typescript
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
```

### `id`
* **What belongs**: A unique, lowercase, kebab-case string representing the library (e.g., `"numpy"`, `"scikit-learn"`).
* **What does NOT belong**: Upper/mixed-case strings, spaces, or extensions (e.g., `"NumPy"`, `"numpy.json"`).
* **Common AI Mistakes**: Mismatching the casing of the package (e.g., `"pandas"` written as `"Pandas"`).
* **Manual Verification**: Must exactly match the JSON filename (excluding `.json`) and contain only lowercase letters, digits, and hyphens.

### `name`
* **What belongs**: The official, properly cased name of the library (e.g., `"NumPy"`, `"PyTorch"`, `"pandas"`).
* **What does NOT belong**: Install commands, version numbers, or generic descriptions.
* **Common AI Mistakes**: Defaulting to the ID value or writing it all in lowercase when it should be capitalized.
* **Manual Verification**: Check against official branding.

### `version`
* **What belongs**: A target semantic version string documented by this entry (e.g., `"2.0.0"`).
* **What does NOT belong**: Prefix characters like `"v"` (e.g., `"v2.0.0"`), labels like `"latest"`, or wildcards (e.g., `"2.x"`).
* **Common AI Mistakes**: Prefixing with `"v"` or putting `"latest"`.
* **Manual Verification**: Must match standard semantic versioning rules (`X.Y.Z`).

### `install`
* **What belongs**: The exact CLI command used to install the package (e.g., `"pip install numpy"`).
* **What does NOT belong**: Multi-line setups, code blocks, or instructions.
* **Common AI Mistakes**: Wrapping the command in markdown backticks (e.g., `` `pip install numpy` ``) inside the JSON value.
* **Manual Verification**: Confirm the value is raw text and contains no markdown formatting.

### `import_as`
* **What belongs**: The canonical python import statement (e.g., `"import numpy as np"`).
* **What does NOT belong**: Multiple import statements, sub-module imports, or wrapping in markdown formatting.
* **Common AI Mistakes**: Including comments or wrapping in backticks.
* **Manual Verification**: Must be executable Python code.

### `summary`
* **What belongs**: A concise, 1-2 sentence description of the library's primary purpose.
* **What does NOT belong**: Bullet points, markdown headings, or exhaustive feature lists.
* **Common AI Mistakes**: Writing paragraphs that repeat details found in sections.
* **Manual Verification**: Keep it under 150 characters if possible.

### `sections` (array of `PackageSection`)
Contains groupings of function references.

* **`sections[].name`**:
  * **What belongs**: The logical category name (e.g., `"Creation"`, `"Manipulation"`, `"Inference"`).
  * **What does NOT belong**: Long descriptions or sentences.
  * **Common AI Mistakes**: Duplicate names within the same package.
  * **Manual Verification**: Ensure names are concise and distinct.
* **`sections[].gotchas`**:
  * **What belongs**: An array of string warnings outlining silent bugs, performance issues, or edge cases (e.g., `"Arrays have fixed types; implicit casting can happen silently."`).
  * **What does NOT belong**: Basic tutorials or explanations of syntax.
  * **Common AI Mistakes**: Leaving it empty or duplicating default behaviors.
  * **Manual Verification**: Gotchas must contain real, actionable caveats.

### `sections[].functions` (array of `PackageFunction`)
* **`fn`**:
  * **What belongs**: The callable signature of the function with symbolic parameters (e.g., `"np.array(object)"`, `"pd.read_csv(filepath_or_buffer)"`).
  * **What does NOT belong**: Actual argument values (e.g., `"np.array([1, 2, 3])"`), or code fragments (e.g., `"y = np.array"`).
  * **Common AI Mistakes**: Placing concrete examples here instead of in `example`, or omitting the parameters.
  * **Manual Verification**: Must strictly represent the function signature, not a usage instance.
* **`purpose`**:
  * **What belongs**: A short explanation of what the function does (e.g., `"Create an array from a list or tuple"`).
  * **What does NOT belong**: Elaborate technical explanations.
  * **Common AI Mistakes**: Duplicating the function name.
* **`example`**:
  * **What belongs**: A clean, single or double-line snippet showing practical usage (e.g., `"a = np.array([1, 2, 3])"`).
  * **What does NOT belong**: The `import` statement or markdown code fences (e.g., `` ```python ``).
  * **Common AI Mistakes**: Prefixing with import statements (unnecessary due to `import_as` at the top level), or enclosing in markdown backticks.
  * **Manual Verification**: Verify that the code is raw text and does not include `import`.
* **`category`**:
  * **What belongs**: A lowercase sub-classification tag (e.g., `"creation"`, `"indexing"`).
  * **What does NOT belong**: Capitalized or spaced values.
  * **Common AI Mistakes**: Random capitalization.
  * **Manual Verification**: Maintain consistent lowercase tag formatting.

### `alternatives`
* **What belongs**: An array of string names referencing alternative packages (e.g., `["cupy", "jax.numpy"]`).
* **What does NOT belong**: Pros/cons or explanations.
* **Common AI Mistakes**: Including descriptive text.
* **Manual Verification**: Ensure elements are simple string package IDs.

---

## 2. Models (`types/model.ts`)

Defines ML/DL/LLM models (e.g., `random-forest.json`, `transformer.json`, `llama3.json`).

```typescript
export type ModelCategory = 'ml' | 'dl' | 'llm';

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

export interface Model {
  id: string;
  name: string;
  category: ModelCategory;
  problem_types: ProblemType[];
  summary: string;
  use_when: string;
  avoid_when: string;
  pros: string[];
  cons: string[];
  key_hyperparams: HyperParameter[];
  training_speed: SpeedRating;
  inference_speed: SpeedRating;
  memory_usage: SizeRating;
  interpretability: InterpretabilityRating;
  quick_start: string;
  alternatives: string[];
}
```

### `id`
* **What belongs**: A unique kebab-case ID matching the filename (e.g., `"random-forest"`).
* **Common AI Mistakes**: Capitalization or using underscores.

### `name`
* **What belongs**: Display title (e.g., `"Random Forest"`).

### `category`
* **What belongs**: Strict enum string: `"ml"`, `"dl"`, or `"llm"`.
* **What does NOT belong**: Custom category strings (e.g., `"vision"`, `"nlp"`, `"deep-learning"`).
* **Common AI Mistakes**: Using uppercase values like `"LLM"` or invalid strings.
* **Manual Verification**: Must match the sub-folder path in the directory hierarchy (`data/models/[category]`).

### `problem_types`
* **What belongs**: An array of problem types matching the `ProblemType` union: `"classification"`, `"regression"`, `"clustering"`, `"generation"`, `"embedding"`, `"detection"`, or `"segmentation"`.
* **What does NOT belong**: Off-spec tags (e.g., `"ranking"`, `"translation"`, `"ner"`).
* **Common AI Mistakes**: Generating non-supported tags that break Zod validation.
* **Manual Verification**: Every element must map to the strict list of 7 problem types.

### `summary`
* **What belongs**: Brief conceptual explanation of the model's core mechanic (1-2 sentences).

### `use_when` / `avoid_when`
* **What belongs**: Concise engineering rules of thumb on when to select or bypass this model (e.g., `"Tabular datasets with low dimensionality."`).
* **What does NOT belong**: Code snippets.
* **Common AI Mistakes**: Writing generic advice without technical parameters.

### `pros` / `cons`
* **What belongs**: Arrays of specific technical advantages and disadvantages.
* **What does NOT belong**: Generic statements like `"Very popular"`.

### `key_hyperparams` (array of `HyperParameter`)
* **`name`**: The framework-specific parameter name (e.g., `"n_estimators"`, `"temperature"`).
* **`default`**: The default value, typed strictly as `string`, `number`, or `null` (e.g., `100` or `"sqrt"` or `null`).
  * **What does NOT belong**: Descriptions, explanations, or boolean types.
  * **Common AI Mistakes**: Putting notes or code snippets in the `default` field.
  * **Manual Verification**: Must be a JSON primitive (string/number/null).
* **`note`**: Adjusting advice and context (e.g., `"Increase to reduce variance, but adds linear compute cost."`).

### `training_speed` / `inference_speed`
* **What belongs**: Strict enum string: `"fast"`, `"medium"`, or `"slow"`.
* **Common AI Mistakes**: Providing strings like `"very fast"`, `"low"`, or `"high"`.
* **Manual Verification**: Verify they are strictly `"fast" | "medium" | "slow"`.

### `memory_usage`
* **What belongs**: Strict enum string: `"low"`, `"medium"`, or `"high"`.
* **Common AI Mistakes**: Mixing with speed rating terms (e.g., `"slow"`).
* **Manual Verification**: Verify it is strictly `"low" | "medium" | "high"`.

### `interpretability`
* **What belongs**: Strict enum string: `"high"`, `"medium"`, or `"low"`.
* **Manual Verification**: Verify it is strictly `"high" | "medium" | "low"`.

### `quick_start`
* **What belongs**: A multi-line Python code snippet demonstrating model initialization and fit/inference execution.
* **What does NOT belong**: Markdown code block fences (e.g., `` ```python ``).
* **Common AI Mistakes**: Surrounding the code block with backticks or fences.
* **Manual Verification**: Ensure the raw string is written directly. The component will render it with its own Syntax Highlighter.

### `alternatives`
* **What belongs**: An array of `ModelRef` objects referencing alternative model architectures.
* **Format**:
  ```json
  "alternatives": [
    { "name": "XGBoost", "id": "xgboost", "category": "ml" },
    { "name": "LightGBM", "id": "lightgbm", "category": "ml" }
  ]
  ```
  - `name` (string, required): The display name of the alternative model.
  - `id` (string, optional): The unique kebab-case ID matching the filename of the alternative model.
  - `category` (string, optional): The category of the model (`"ml"`, `"dl"`, or `"llm"`).
  - Note: While `id` and `category` are optional for validation compatibility, they are both required for the details page to render a clickable link. If either is missing, the alternative will render as a plain text badge.

---

## 3. Registries (`types/registry.ts`)

Defines entries in task-specific registry tables (e.g., `embeddings.json` containing an array of `RegistryModel`).

```typescript
export type RegistryTask =
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
  alternatives: ContentRef[];
  last_verified: string;
}
```

### `id`
* **What belongs**: kebab-case identifier (e.g., `"bge-large-en-v1.5"`).

### `model_id`
* **What belongs**: Canonical coordinate of the model, such as the Hugging Face repo ID or API endpoint identifier (e.g., `"BAAI/bge-large-en-v1.5"`, `"text-embedding-3-large"`).
* **What does NOT belong**: Loose descriptive names.
* **Common AI Mistakes**: Confusing it with the `id` field.
* **Manual Verification**: Verify it matches the Hugging Face Hub format (`Author/ModelName`) or vendor naming conventions.

### `task`
* **What belongs**: Strict enum string: `"embedding"`, `"reranker"`, `"vision"`, `"speech"`, `"llm"`, `"multimodal"`, or `"ocr"`.
* **Common AI Mistakes**: Pluralizing the value (e.g., `"embeddings"`, `"rerankers"`).
* **Manual Verification**: Verify task maps to the exact file base name (e.g., task `"embedding"` belongs in `embeddings.json`).

### `language`
* **What belongs**: Casing or ISO code for languages supported (e.g., `"en"`, `"zh"`, `"multilingual"`).

### `dimension` (optional)
* **What belongs**: Vector or embedding dimension count as a **number** (e.g., `1024`, `1536`).
* **What does NOT belong**: Text strings or units (e.g., `"1024d"`, `"768 dimensions"`).
* **Common AI Mistakes**: Passing dimensions as strings.
* **Manual Verification**: Ensure the value is a number or omitted.

### `use_case`
* **What belongs**: A brief statement of what this specific model is best suited for.

### `size_mb`
* **What belongs**: Total size in Megabytes as a **number** (e.g., `1340`).
* **What does NOT belong**: Strings, units, or suffixes (e.g., `"1.3GB"`, `"1340MB"`, `"1.3"`).
* **Common AI Mistakes**: Writing numbers as strings or appending unit characters.
* **Manual Verification**: Must be a raw integer or float.

### `status`
* **What belongs**: Strict enum string: `"active"`, `"experimental"`, or `"deprecated"`.
* **Manual Verification**: Match enum case exactly.

### `notes`
* **What belongs**: Editorial context, evaluations, or warnings.

### `quick_start`
* **What belongs**: Python code snippet showing import and usage (e.g., loading via sentence-transformers).
* **What does NOT belong**: Markdown code block fences.
* **Common AI Mistakes**: Enclosing the code string in markdown ticks.

### `alternatives`
* **What belongs**: An array of `ContentRef` objects referencing alternative registry items or resources.
* **Format**:
  ```json
  "alternatives": [{ "id": "gte-large", "type": "model" }]
  ```

### `last_verified`
* **What belongs**: Date string in `YYYY-MM-DD` format marking the last verification check.
* **Manual Verification**: Verify format matches regex `^\d{4}-\d{2}-\d{2}$`.

---

## 4. Workflows (`types/workflow.ts`)

Defines step-by-step pipeline architectures and engineering workflows (e.g., `rag.json`).

```typescript
export type WorkflowType = 'pipeline' | 'snippet';

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
  type: WorkflowType;
  category: string;
  overview: string;
  starter_stack: string[];
  steps: WorkflowStep[];
  common_failure_points: string[];
}
```

### `id`
* **What belongs**: Unique lowercase kebab-case ID (e.g., `"rag"`, `"fine-tuning"`).

### `name`
* **What belongs**: Descriptive title (e.g., `"Retrieval-Augmented Generation"`).

### `type`
* **What belongs**: Strict enum string: `"pipeline"` (multi-step workflow) or `"snippet"` (quick coding recipe).
* **Common AI Mistakes**: Typing arbitrary types.
* **Manual Verification**: Must be exactly `"pipeline"` or `"snippet"`.

### `category`
* **What belongs**: Engineering category name (e.g., `"Inference"`, `"Fine-Tuning"`, `"Evaluation"`).
* **Manual Verification**: Capitalized string.

### `overview`
* **What belongs**: A high-level description of what the workflow achieves.

### `starter_stack`
* **What belongs**: Array of recommended libraries/technologies (e.g., `["LlamaIndex", "ChromaDB", "SentenceTransformers"]`).

### `steps` (array of `WorkflowStep`)
Sequential description of the pipeline.

* **`step`**:
  * **What belongs**: A 1-indexed sequential integer (`1`, `2`, `3`, etc.).
  * **What does NOT belong**: Strings, 0-indexing, or floating numbers.
  * **Common AI Mistakes**: Starting from `0` or using strings (`"1"`).
  * **Manual Verification**: Ensure steps start at 1 and increment continuously.
* **`name`**: Title of the step.
* **`what`**: Technical description of the operation performed.
* **`tools`**: Specific software tools or API classes utilized in this step (e.g., `["PyMuPDF", "RecursiveCharacterTextSplitter"]`).
* **`decision`**: Clarification of structural or parameter decisions (e.g., `"Use chunk size 512 with 10% overlap as baseline."`).
  * **Common AI Mistakes**: Writing general notes rather than design decision guidelines.

### `common_failure_points`
* **What belongs**: Array of strings outlining common technical bugs, performance bottlenecks, or edge cases.

---

## 5. Cheatsheets (`types/cheatsheet.ts`)

Defines syntax references for AI packages (e.g., `pytorch.json`).

```typescript
export interface CheatsheetItem {
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
```

### `id`
* **What belongs**: Unique lowercase kebab-case ID matching the filename (e.g., `"pytorch"`).

### `name`
* **What belongs**: Title of the cheatsheet (e.g., `"PyTorch"`).

### `groups` (array of `CheatsheetGroup`)
Groupings of quick syntax snippets.

* **`groups[].group`**: The title of the syntax group (e.g., `"Tensor Creation"`, `"Gradient Control"`).
* **`groups[].items`** (array of `CheatsheetItem`):
  * **`fn`**: The raw method or code snippet (e.g., `"torch.zeros(*size)"`).
    * **What does NOT belong**: Explanatory notes or markdown formatting tags.
    * **Common AI Mistakes**: Surrounding the syntax snippet with backticks.
    * **Manual Verification**: Keep it to raw Python code or CLI commands.
  * **`purpose`**: Brief explanation of the return value or behavior (e.g., `"Creates a tensor filled with zeros."`).

---

## Core Content Validation Checklist

Before saving any new content JSON file, manually verify the following:

1. **Schema Fields**: Ensure no fields are added or omitted. If it is not in the type definition/Zod schema, it will break the validation.
2. **Metadata Presence**: Confirm `created_at`, `updated_at`, and `sources` are present at the root of every major JSON document (except indices).
3. **No Markdown Fencing in Snippets**: Review `quick_start`, `example`, `install`, `import_as`, and `fn` fields. They must be raw code strings without any markdown code blocks (e.g., `` ```python `` or backticks).
4. **Enum Matching**: Double-check that categorical enums (`ModelCategory`, `ProblemType`, `SpeedRating`, `SizeRating`, `InterpretabilityRating`, `RegistryTask`, `ModelStatus`, `WorkflowType`) are strictly lowercase, exact matches.
5. **Types and Dimensions**: Ensure numeric fields like `dimension`, `size_mb`, and `step` are written as raw numbers, not strings.

---

## Optional Metadata Fields

In addition to the mandatory global fields, the following optional fields can be included in `BaseMetaSchema` objects:

### `sources` as Single Source of Truth

All external links — documentation, papers, model cards, and GitHub — must go into the `sources[]` array. The `OfficialResources` component automatically categorizes them using `categorizeSources()` in `lib/resources.ts`. Do **not** create separate fields for documentation or paper URLs.

* **Papers**: Include arXiv, DOI, OpenReview, or other paper URLs directly in `sources[]`:
  ```json
  "sources": [
    "https://arxiv.org/abs/1706.03762",
    "https://doi.org/10.1234/example",
    "https://openreview.net/forum?id=some-id"
  ]
  ```

* **Documentation**: Include official documentation URLs directly in `sources[]`:
  ```json
  "sources": [
    "https://scikit-learn.org/stable/",
    "https://pytorch.org/docs/stable/",
    "https://numpy.org/doc/stable/"
  ]
  ```

* **Model Cards**: Include model card URLs directly in `sources[]`:
  ```json
  "sources": [
    "https://huggingface.co/meta-llama/Meta-Llama-3-8B",
    "https://modelscope.cn/models/some-model"
  ]
  ```

* **External References**: Any other relevant URLs (blogs, tutorials, benchmarks) can also be included in `sources[]` and will be categorized as external references.

### `github_repo` (optional)

* **What belongs**: A URL pointing to the official GitHub repository (e.g., `"https://github.com/numpy/numpy"`, `"https://github.com/huggingface/transformers"`).
* **What does NOT belong**: Non-GitHub URLs or generic search engine queries.
* **Manual Verification**: Must be a valid absolute HTTPS URL starting with `https://github.com`.
