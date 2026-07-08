---
id: guide-validation-workflow
title: Validation Workflow
type: guide
status: active
owner: contributors
canonical: true
version: 2.0
related:
  - engineering-validation
ai_priority: 3
---

# Validation Workflow

The content validation system ensures that all knowledge data files located in the `data/` directory conform to the handbook's standards before compiling. This guide documents what the validator checks, how it runs, and how to resolve failure states.

## Running Validation

Validation runs automatically in the `prebuild` phase of the build pipeline, but you should run it locally before pushing any content updates:

```bash
npm run validate
```

If validation fails, the script exits with code `1` and details the files, paths, and rule violations that caused the failure.

---

## Checked Dimensions

The script ([`scripts/validate-content.ts`](file:///d:/Project/ai-engineering-handbook/scripts/validate-content.ts)) enforces constraints across five main categories:

### 1. Schema Validation (Zod)
All files within the catalog directories must parse cleanly against their corresponding Zod schemas located in [`lib/schemas/`](file:///d:/Project/ai-engineering-handbook/lib/schemas/):
- **Packages** (`data/packages/*.json`) → `PackageSchema`
- **Models** (`data/models/{ml,dl,llm}/*.json`) → `ModelSchema`
- **Workflows** (`data/workflows/*.json`) → `WorkflowSchema`
- **Cheatsheets** (`data/cheatsheets/*.json`) → `CheatsheetSchema`
- **Registries** (`data/registry/*.json`) → Array of `RegistryModelSchema`
- **Patterns** (`data/patterns/*.json`) → `PatternSchema`
- **Debug Guides** (`data/debug-guides/*.json`) → `DebugGuideSchema`
- **Decision Guides** (`data/decision-guides/*.json`) → `DecisionGuideSchema`
- **Principles** (`data/principles/*.json`) → `PrincipleSchema`

### 2. Naming Conventions (kebab-case)
All file base names and declared internal `"id"` properties must consist of lowercase letters (`a-z`), numbers (`0-9`), and hyphens (`-`).
- **Valid Example**: `pytorch`, `llama-3-8b`, `random-forest`
- **Invalid Example**: `PyTorch`, `scikit_learn`, `numpy.json` (no dots or underscores)
- Regex pattern enforced: `/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/`

### 3. File Base Name vs. Internal ID
The name of the `.json` file must exactly match the internal `"id"` property declared inside the file.
*Example:* `data/packages/numpy.json` must contain `"id": "numpy"`.

### 4. Namespace Isolation & Collision Checks
To prevent routing conflicts and duplicate listings:
- **Core Namespace Sharing**: The core entities (`package`, `model`, `workflow`) share a global namespace. No two core entities of different types can share an ID (e.g. you cannot have a package named `rag` and a workflow named `rag`).
- **Cheatsheet Mapping**: A cheatsheet is permitted to share its ID with a package or model (e.g., cheatsheet `pytorch` mapping to package `pytorch`).
- **Registry Mapping**: A task-specific registry entry is permitted to share its ID with a detailed model file.
- **Duplicate Prevention**: No two files of the same type can share an ID or case-insensitive name.

### 5. Referential Integrity (Graph Verification)
All alternative lists (`alternatives` arrays) are checked to ensure:
- **Orphan Prevention**: The referenced content ID must exist somewhere in the data catalog.
- **Type Safety**: The referenced type must match the target's actual type.
- **Legacy Formats**: String-only lists (e.g., `["cupy"]`) are rejected. All references must use the structured `ContentRef` format (`{"id": "cupy", "type": "package"}`).

---

## Minimum Content Quality Constraints

- **Models**:
  - Minimum of 3 `pros`.
  - Minimum of 3 `cons`.
  - Minimum of 1 `key_hyperparams` (unless the only problem type is `"detection"`).
- **Packages**:
  - Minimum of 1 task object.
- **Workflows**:
  - Minimum of 3 step objects.
- **Cheatsheets**:
  - Minimum of 1 entry object.
- **Patterns**:
  - `concept` and `applicability` fields must be present and non-empty.
- **Debug Guides**:
  - Minimum of 1 observable `symptom`.
  - Minimum of 1 `root_cause`.
  - Minimum of 1 step-by-step `solution`.
- **Decision Guides**:
  - Minimum of 2 `options` to evaluate.
  - Minimum of 1 `evaluation_criteria`.
- **Principles**:
  - `statement` field must be present.

---

## Placeholder Detection

To prevent unfinished content from slipping into production, the validator rejects files containing any of the following substrings (case-insensitive):
- `Placeholder`
- `TODO`
- `TBD`
- `Coming soon`
- `# Instantiate model here`
- `Use when you need a`
- `Avoid when resources are highly constrained`
- `Well established architecture`
- `Requires modern hardware`

---

## Environment Variables

- `STRICT_REFERENCE_MODE=true`
  If set to `true`, referential integrity warnings (broken links, missing IDs in graph) are treated as fatal errors, causing the command to exit with code `1` and failing the build. By default, these are treated as warnings.

## References

- See [`docs/engineering/validation.md`](file:///d:/Project/ai-engineering-handbook/docs/engineering/validation.md) for full engineering specifications.
