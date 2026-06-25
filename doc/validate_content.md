# Content Validation Guide

To ensure high data quality, maintainability, and consistent navigation, all content files under the `data/` directory are statically checked before the application builds.

The validation is enforced automatically during the `prebuild` phase of the build pipeline and can also be run manually.

## Validation Script

- **Script location**: [`scripts/validate-content.ts`](file:///d:/Project/ai-engineering-handbook/scripts/validate-content.ts)
- **Command**: `npm run validate`

---

## Enforced Rules

The content validation system performs checks across five main dimensions:

### 1. Schema Validation (Zod)
Every JSON file in the `data/` subdirectory must conform to its corresponding Zod schema located in [`lib/schemas/`](file:///d:/Project/ai-engineering-handbook/lib/schemas/):
- **Packages** (`data/packages/*.json`): Verified against `PackageSchema`
- **Models** (`data/models/{ml,dl,llm}/*.json`): Verified against `ModelSchema`
- **Workflows** (`data/workflows/*.json`): Verified against `WorkflowSchema`
- **Cheatsheets** (`data/cheatsheets/*.json`): Verified against `CheatsheetSchema`
- **Registries** (`data/registry/*.json`): Verified against an array of `RegistryModelSchema`

### 2. Naming Conventions (kebab-case)
All content file base names and their declared internal `"id"` values must conform to a versioned kebab-case format:
- Must consist only of lowercase letters (`a-z`), numbers (`0-9`), hyphens (`-`), and periods (`.`).
- Regex pattern: `/^[a-z0-9.-]+$/`
- Examples of valid IDs: `numpy`, `scikit-learn`, `bge-large-en-v1.5`, `llava-1.5-7b`

### 3. File Base Name vs. Internal ID Matching
For all standalone content items (excluding registry tables and indices), the JSON file name must exactly match the internal `"id"` property declared inside the file.
- Example: `data/packages/numpy.json` must declare `"id": "numpy"`.

### 4. Cross-Folder ID Collisions
To preserve routing integrity and search mapping correctness, the following namespace isolation rules apply:
- **Core Entities Mutual Exclusion**: The core entity types (`package`, `model`, `workflow`) share a global namespace. No two core entities of different types can share an ID (e.g. you cannot have a package named `rag` and a workflow named `rag`).
- **Cheatsheet Mapping**: A `cheatsheet` is allowed to share its ID with a `package` or `model` (e.g., cheatsheet `numpy` and package `numpy` can co-exist).
- **Registry Mapping**: A `registry_item` (declared within a registry task array) is allowed to share its ID with a detailed `model` profile (e.g. registry model `mistral-7b` and detailed model `mistral-7b` can co-exist).
- **Duplicate Prevention**: No two files of the *same* type can share an ID (e.g. no two detailed models can both declare ID `mistral-7b`).

### 5. Referential Integrity (Orphan & Type Validation)
All alternative lists (cross-links) declared in any JSON files are checked for consistency:
- **Orphan Detection**: The referenced ID must exist somewhere in the catalog.
- **Type Compatibility**: The referenced type must match the target's actual type. An exception is made to allow `registry_item` targets to be linked under the `'model'` reference type.

---

## Running Validation

If content files are modified, run validation locally before pushing changes:

```bash
npm run validate
```

If validation fails, the script outputs detailed, descriptive errors indicating the file path, field, index, or ID conflict that caused the failure, and exits with code `1` (failing the build pipeline).
