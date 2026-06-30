---
id: reference-schemas
title: Schema Reference
type: reference
status: active
owner: contributors
canonical: true
version: 1.0
related:
  - engineering-content-schema
  - engineering-validation
ai_priority: 5
---

# Schema Reference

## Package Schema

### Location
- TypeScript: `types/package.ts`
- Zod Schema: `lib/schemas/package.ts`

### Required Fields
```typescript
{
  id: string;              // kebab-case, matches filename
  name: string;            // official properly-cased name
  version: string;         // semantic version (X.Y.Z)
  install: string;         // exact CLI command
  import_as: string;       // canonical Python import
  summary: string;         // 1-2 sentence description
  tasks: PackageTask[];    // at least 1 task
  alternatives: ContentRef[];
  sources: string[];       // at least one URL
  created_at: string;      // YYYY-MM-DD
  updated_at: string;      // YYYY-MM-DD
}
```

### PackageTask Schema
```typescript
{
  task: string;                    // function name
  mental_trigger: string;          // when to use
  syntax: string;                  // code syntax
  important_params: string[];     // parameter names
  example: string;                // usage example
  use_when: string;               // use case
  avoid_when: string;             // avoid case
  decision_notes: string;         // decision guidance
  gotchas: string[];              // common mistakes
  official_docs: string;          // official docs URL
}
```

---

## Model Schema

### Location
- TypeScript: `types/model.ts`
- Zod Schema: `lib/schemas/model.ts`

### Required Fields
```typescript
{
  id: string;                    // kebab-case, matches filename
  name: string;                  // official model name
  category: 'ml' | 'dl' | 'llm'; // model category
  summary: string;               // 1-2 sentence description
  use_when: string;              // when to use
  avoid_when: string;            // when to avoid
  decision_notes: string;        // decision guidance
  pros: string[];                // at least 3 pros
  cons: string[];                // at least 3 cons
  inference_speed: 'fast' | 'medium' | 'slow';
  memory_usage: 'low' | 'medium' | 'high';
  problem_types: string[];       // problem type enum
  key_hyperparams: Hyperparam[]; // at least 1 (unless detection-only)
  quick_start: string;           // example code
  alternatives: ContentRef[];
  sources: string[];             // at least one URL
  created_at: string;            // YYYY-MM-DD
  updated_at: string;            // YYYY-MM-DD
}
```

### Hyperparam Schema
```typescript
{
  param: string;           // parameter name
  default: any;            // default value
  description: string;     // parameter description
}
```

---

## Workflow Schema

### Location
- TypeScript: `types/workflow.ts`
- Zod Schema: `lib/schemas/workflow.ts`

### Required Fields
```typescript
{
  id: string;              // kebab-case, matches filename
  name: string;            // workflow name
  summary: string;          // 1-2 sentence description
  starter_stack: string[]; // tools and libraries
  steps: WorkflowStep[];   // at least 3 steps
  alternatives: ContentRef[];
  sources: string[];       // at least one URL
  created_at: string;      // YYYY-MM-DD
  updated_at: string;      // YYYY-MM-DD
}
```

### WorkflowStep Schema
```typescript
{
  name: string;            // step name
  what: string;            // what this step does
  tools: string[];         // tools used
  decision: string;        // decision guidance
  failure: string;         // failure points
  uses: ContentRef[];      // related content
}
```

---

## Cheatsheet Schema

### Location
- TypeScript: `types/cheatsheet.ts`
- Zod Schema: `lib/schemas/cheatsheet.ts`

### Required Fields
```typescript
{
  id: string;              // kebab-case, matches filename
  name: string;            // cheatsheet name
  summary: string;          // 1-2 sentence description
  entries: CheatsheetEntry[]; // at least 1 entry
  alternatives: ContentRef[];
  sources: string[];       // at least one URL
  created_at: string;      // YYYY-MM-DD
  updated_at: string;      // YYYY-MM-DD
}
```

### CheatsheetEntry Schema
```typescript
{
  problem: string;         // problem being solved
  trigger: string;         // mental trigger
  snippet: string;         // code snippet
  minimal_notes: string;   // brief explanation
  common_bug: string;      // common mistake
  docs_url: string;        // official docs URL
}
```

---

## Registry Schema

### Location
- TypeScript: `types/registry.ts`
- Zod Schema: `lib/schemas/registry.ts`

### Required Fields
```typescript
{
  id: string;              // model ID
  task: RegistryTask;      // task enum
  size_mb: number;         // model size in MB
  link: string;            // model URL
}
```

### RegistryTask Enum
- `embedding`
- `llms`
- `rerankers`
- `vision`
- `speech`
- `multimodal`
- `ocr`

---

## BaseMeta Schema

### Location
- TypeScript: `types/meta.ts`
- Zod Schema: `lib/schemas/meta.ts`

### Fields (inherited by all content types)
```typescript
{
  created_at: string;   // YYYY-MM-DD
  updated_at: string;   // YYYY-MM-DD
  sources: string[];    // at least one URL
}
```

---

## ContentRef Schema

### Location
- TypeScript: `types/meta.ts`
- Zod Schema: `lib/schemas/meta.ts`

### Structure
```typescript
{
  id: string;           // target content ID
  type: ContentType;   // package | model | workflow | cheatsheet
}
```

---

## Related Documentation

- **Content Guidelines**: See `engineering/content-schema.md`
- **Validation Rules**: See `engineering/validation.md`
- **Naming Conventions**: See `reference/naming.md`
