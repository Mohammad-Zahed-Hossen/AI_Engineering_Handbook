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
