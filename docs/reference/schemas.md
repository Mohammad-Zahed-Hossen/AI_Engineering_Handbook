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
- Zod Schema: `lib/schemas/package.ts`
- Base Schema: `lib/schemas/base.ts`

### Required Fields
```typescript
{
  // BaseMeta fields (inherited from BaseMetaSchema)
  id: string;
  title: string;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  aliases: string[];
  keywords: string[];
  search_tokens: string[];
  domain: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  engineering_area: string;
  estimated_reading_time: number;
  prerequisites: string[];
  recommended_next: string[];
  related_content: ContentRef[];
  created_at: string;      // YYYY-MM-DD
  updated_at: string;      // YYYY-MM-DD
  last_verified: string;
  review_frequency: 'monthly' | 'quarterly' | 'semi_annually' | 'annually';
  verified_against: string;
  compatible_versions: string[];
  breaking_changes: string[];
  owner: string;
  canonical_status: 'canonical' | 'reference' | 'generated';
  lifecycle: 'draft' | 'verified' | 'stable' | 'deprecated' | 'archived';
  stability: 'stable' | 'semi_stable' | 'volatile';
  confidence: 'verified' | 'production_proven' | 'community_accepted' | 'experimental' | 'research';
  engineering_maturity: 'research' | 'experimental' | 'emerging' | 'production_ready' | 'legacy';
  sources: string[];       // at least one URL
  github_repo: string;
  
  // Package-specific fields
  version: string;         // semantic version (X.Y.Z)
  install: string;         // exact CLI command
  import_as: string;       // canonical Python import
  language: string;        // default: 'python'
  summary: string;         // 1-2 sentence description
  tasks: PackageTask[];    // at least 1 task
  alternatives: ContentRef[];
  package_specific_debugging: string[];
  migration_notes: string[];
  breaking_changes: string[];
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
- Zod Schema: `lib/schemas/model.ts`
- Base Schema: `lib/schemas/base.ts`

### Required Fields
```typescript
{
  // BaseMeta fields (inherited from BaseMetaSchema)
  id: string;
  title: string;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  aliases: string[];
  keywords: string[];
  search_tokens: string[];
  domain: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  engineering_area: string;
  estimated_reading_time: number;
  prerequisites: string[];
  recommended_next: string[];
  related_content: ContentRef[];
  created_at: string;      // YYYY-MM-DD
  updated_at: string;      // YYYY-MM-DD
  last_verified: string;
  review_frequency: 'monthly' | 'quarterly' | 'semi_annually' | 'annually';
  verified_against: string;
  compatible_versions: string[];
  breaking_changes: string[];
  owner: string;
  canonical_status: 'canonical' | 'reference' | 'generated';
  lifecycle: 'draft' | 'verified' | 'stable' | 'deprecated' | 'archived';
  stability: 'stable' | 'semi_stable' | 'volatile';
  confidence: 'verified' | 'production_proven' | 'community_accepted' | 'experimental' | 'research';
  engineering_maturity: 'research' | 'experimental' | 'emerging' | 'production_ready' | 'legacy';
  sources: string[];       // at least one URL
  github_repo: string;
  
  // Model-specific fields
  category: 'ml' | 'dl' | 'llm'; // model category
  problem_types: ProblemType[];
  summary: string;               // 1-2 sentence description
  use_when: string;              // when to use
  avoid_when: string;            // when to avoid
  pros: string[];                // at least 3 pros
  cons: string[];                // at least 3 cons
  key_hyperparams: HyperParameter[];
  training_speed: 'fast' | 'medium' | 'slow';
  inference_speed: 'fast' | 'medium' | 'slow';
  memory_usage: 'low' | 'medium' | 'high';
  interpretability: 'high' | 'medium' | 'low';
  quick_start: string;           // example code
  alternatives: ContentRef[];
  related_workflows: string[];  // plain IDs, not ContentRef
  decision_notes: string;        // decision guidance
  competitors: ContentRef[];
  research_background: string;
  computational_requirements: string;
}
```

### HyperParameter Schema
```typescript
{
  name: string;           // parameter name
  default: string | number | null;  // default value
  note: string;           // parameter note
}
```

---

## Workflow Schema

### Location
- Zod Schema: `lib/schemas/workflow.ts`
- Base Schema: `lib/schemas/base.ts`

### Required Fields
```typescript
{
  // BaseMeta fields (inherited from BaseMetaSchema)
  id: string;
  title: string;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  aliases: string[];
  keywords: string[];
  search_tokens: string[];
  domain: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  engineering_area: string;
  estimated_reading_time: number;
  prerequisites: string[];
  recommended_next: string[];
  related_content: ContentRef[];
  created_at: string;      // YYYY-MM-DD
  updated_at: string;      // YYYY-MM-DD
  last_verified: string;
  review_frequency: 'monthly' | 'quarterly' | 'semi_annually' | 'annually';
  verified_against: string;
  compatible_versions: string[];
  breaking_changes: string[];
  owner: string;
  canonical_status: 'canonical' | 'reference' | 'generated';
  lifecycle: 'draft' | 'verified' | 'stable' | 'deprecated' | 'archived';
  stability: 'stable' | 'semi_stable' | 'volatile';
  confidence: 'verified' | 'production_proven' | 'community_accepted' | 'experimental' | 'research';
  engineering_maturity: 'research' | 'experimental' | 'emerging' | 'production_ready' | 'legacy';
  sources: string[];       // at least one URL
  github_repo: string;
  
  // Workflow-specific fields
  type: 'pipeline' | 'snippet';
  category: string;            // workflow category
  overview: string;            // 1-2 sentence description
  starter_stack: string[];     // tools and libraries
  steps: WorkflowStep[];      // at least 3 steps
  common_failure_points: string[];
  evaluation_checks: string[];
  next_links: string[];
  worked_examples: WorkedExample[];
  production_notes: string;
  scaling_notes: string;
  related_patterns: ContentRef[];
  related_models: ContentRef[];
  related_packages: ContentRef[];
  related_debug_guides: ContentRef[];
}
```

### WorkflowStep Schema
```typescript
{
  step: number;
  name: string;
  what: string;
  tools: string[];
  decision: string;
  uses: {
    packages: string[];
    models: string[];
    cheatsheets: string[];
  };
  failure_points: string[];
}
```

---

## Pattern Schema

### Location
- Zod Schema: `lib/schemas/pattern.ts`
- Base Schema: `lib/schemas/base.ts`

### Required Fields
```typescript
{
  // BaseMeta fields (inherited from BaseMetaSchema)
  id: string;
  title: string;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  aliases: string[];
  keywords: string[];
  search_tokens: string[];
  domain: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  engineering_area: string;
  estimated_reading_time: number;
  prerequisites: string[];
  recommended_next: string[];
  related_content: ContentRef[];
  created_at: string;      // YYYY-MM-DD
  updated_at: string;      // YYYY-MM-DD
  last_verified: string;
  review_frequency: 'monthly' | 'quarterly' | 'semi_annually' | 'annually';
  verified_against: string;
  compatible_versions: string[];
  breaking_changes: string[];
  owner: string;
  canonical_status: 'canonical' | 'reference' | 'generated';
  lifecycle: 'draft' | 'verified' | 'stable' | 'deprecated' | 'archived';
  stability: 'stable' | 'semi_stable' | 'volatile';
  confidence: 'verified' | 'production_proven' | 'community_accepted' | 'experimental' | 'research';
  engineering_maturity: 'research' | 'experimental' | 'emerging' | 'production_ready' | 'legacy';
  sources: string[];       // at least one URL
  github_repo: string;
  
  // Pattern-specific fields
  category: PatternCategory;
  concept: string;
  applicability: string;
  anti_patterns: string[];
  implementation_notes: string;
  examples: string[];
  related_workflows: string[];  // plain IDs
  related_models: string[];     // plain IDs
  related_packages: string[];   // plain IDs
  related_principles: string[]; // plain IDs
}
```

---

## Principle Schema

### Location
- Zod Schema: `lib/schemas/principle.ts`
- Base Schema: `lib/schemas/base.ts`

### Required Fields
```typescript
{
  // BaseMeta fields (inherited from BaseMetaSchema)
  id: string;
  title: string;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  aliases: string[];
  keywords: string[];
  search_tokens: string[];
  domain: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  engineering_area: string;
  estimated_reading_time: number;
  prerequisites: string[];
  recommended_next: string[];
  related_content: ContentRef[];
  created_at: string;      // YYYY-MM-DD
  updated_at: string;      // YYYY-MM-DD
  last_verified: string;
  review_frequency: 'monthly' | 'quarterly' | 'semi_annually' | 'annually';
  verified_against: string;
  compatible_versions: string[];
  breaking_changes: string[];
  owner: string;
  canonical_status: 'canonical' | 'reference' | 'generated';
  lifecycle: 'draft' | 'verified' | 'stable' | 'deprecated' | 'archived';
  stability: 'stable' | 'semi_stable' | 'volatile';
  confidence: 'verified' | 'production_proven' | 'community_accepted' | 'experimental' | 'research';
  engineering_maturity: 'research' | 'experimental' | 'emerging' | 'production_ready' | 'legacy';
  sources: string[];       // at least one URL
  github_repo: string;
  
  // Principle-specific fields
  category: PrincipleCategory;
  statement: string;
  mathematical_formulation: string;
  intuition: string;
  implications: string[];
  limitations: string[];
  related_concepts: string[];
  referenced_by_patterns: string[];  // inverse direction, plain IDs
  referenced_by_models: string[];     // inverse direction, plain IDs
  referenced_by_workflows: string[];  // inverse direction, plain IDs
}
```

---

## Cheatsheet Schema

### Location
- Zod Schema: `lib/schemas/cheatsheet.ts`
- Base Schema: `lib/schemas/base.ts`

### Required Fields
```typescript
{
  // BaseMeta fields (inherited from BaseMetaSchema)
  id: string;
  title: string;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  aliases: string[];
  keywords: string[];
  search_tokens: string[];
  domain: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  engineering_area: string;
  estimated_reading_time: number;
  prerequisites: string[];
  recommended_next: string[];
  related_content: ContentRef[];
  created_at: string;      // YYYY-MM-DD
  updated_at: string;      // YYYY-MM-DD
  last_verified: string;
  review_frequency: 'monthly' | 'quarterly' | 'semi_annually' | 'annually';
  verified_against: string;
  compatible_versions: string[];
  breaking_changes: string[];
  owner: string;
  canonical_status: 'canonical' | 'reference' | 'generated';
  lifecycle: 'draft' | 'verified' | 'stable' | 'deprecated' | 'archived';
  stability: 'stable' | 'semi_stable' | 'volatile';
  confidence: 'verified' | 'production_proven' | 'community_accepted' | 'experimental' | 'research';
  engineering_maturity: 'research' | 'experimental' | 'emerging' | 'production_ready' | 'legacy';
  sources: string[];       // at least one URL
  github_repo: string;
  
  // Cheatsheet-specific fields
  name: string;
  entries: CheatsheetEntry[]; // at least 1 entry, max 60
  package_reference: string;  // singular package ID
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

## Debug Guide Schema

### Location
- Zod Schema: `lib/schemas/debug-guide.ts`
- Base Schema: `lib/schemas/base.ts`

### Required Fields
```typescript
{
  // BaseMeta fields (inherited from BaseMetaSchema)
  id: string;
  title: string;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  aliases: string[];
  keywords: string[];
  search_tokens: string[];
  domain: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  engineering_area: string;
  estimated_reading_time: number;
  prerequisites: string[];
  recommended_next: string[];
  related_content: ContentRef[];
  created_at: string;      // YYYY-MM-DD
  updated_at: string;      // YYYY-MM-DD
  last_verified: string;
  review_frequency: 'monthly' | 'quarterly' | 'semi_annually' | 'annually';
  verified_against: string;
  compatible_versions: string[];
  breaking_changes: string[];
  owner: string;
  canonical_status: 'canonical' | 'reference' | 'generated';
  lifecycle: 'draft' | 'verified' | 'stable' | 'deprecated' | 'archived';
  stability: 'stable' | 'semi_stable' | 'volatile';
  confidence: 'verified' | 'production_proven' | 'community_accepted' | 'experimental' | 'research';
  engineering_maturity: 'research' | 'experimental' | 'emerging' | 'production_ready' | 'legacy';
  sources: string[];       // at least one URL
  github_repo: string;
  
  // Debug Guide-specific fields
  category: DebugCategory;
  symptoms: DebugSymptom[];
  root_causes: DebugRootCause[];
  diagnosis: DebugDiagnosis[];
  solutions: DebugSolution[];
  prevention: DebugPrevention[];
  related_packages: ContentRef[];
  related_workflows: ContentRef[];
  related_patterns: ContentRef[];
  related_models: ContentRef[];
  related_registry: ContentRef[];
}
```

---

## Decision Guide Schema

### Location
- Zod Schema: `lib/schemas/decision-guide.ts`
- Base Schema: `lib/schemas/base.ts`

### Required Fields
```typescript
{
  // BaseMeta fields (inherited from BaseMetaSchema)
  id: string;
  title: string;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  aliases: string[];
  keywords: string[];
  search_tokens: string[];
  domain: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  engineering_area: string;
  estimated_reading_time: number;
  prerequisites: string[];
  recommended_next: string[];
  related_content: ContentRef[];
  created_at: string;      // YYYY-MM-DD
  updated_at: string;      // YYYY-MM-DD
  last_verified: string;
  review_frequency: 'monthly' | 'quarterly' | 'semi_annually' | 'annually';
  verified_against: string;
  compatible_versions: string[];
  breaking_changes: string[];
  owner: string;
  canonical_status: 'canonical' | 'reference' | 'generated';
  lifecycle: 'draft' | 'verified' | 'stable' | 'deprecated' | 'archived';
  stability: 'stable' | 'semi_stable' | 'volatile';
  confidence: 'verified' | 'production_proven' | 'community_accepted' | 'experimental' | 'research';
  engineering_maturity: 'research' | 'experimental' | 'emerging' | 'production_ready' | 'legacy';
  sources: string[];       // at least one URL
  github_repo: string;
  
  // Decision Guide-specific fields
  category: DecisionCategory;
  problem: string;
  evaluation_criteria: DecisionCriteria[];
  options: DecisionOption[];
  comparison_table: Record<string, string>;
  recommendations: string;
  use_cases: string[];
  related_workflows: ContentRef[];
  related_packages: ContentRef[];
  related_models: ContentRef[];
}
```

---

## Registry Schema

### Location
- Zod Schema: `lib/schemas/registry.ts`
- Base Schema: `lib/schemas/base.ts`

### Required Fields
```typescript
{
  // BaseMeta fields (inherited from BaseMetaSchema)
  id: string;
  title: string;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  aliases: string[];
  keywords: string[];
  search_tokens: string[];
  domain: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  engineering_area: string;
  estimated_reading_time: number;
  prerequisites: string[];
  recommended_next: string[];
  related_content: ContentRef[];
  created_at: string;      // YYYY-MM-DD
  updated_at: string;      // YYYY-MM-DD
  last_verified: string;
  review_frequency: 'monthly' | 'quarterly' | 'semi_annually' | 'annually';
  verified_against: string;
  compatible_versions: string[];
  breaking_changes: string[];
  owner: string;
  canonical_status: 'canonical' | 'reference' | 'generated';
  lifecycle: 'draft' | 'verified' | 'stable' | 'deprecated' | 'archived';
  stability: 'stable' | 'semi_stable' | 'volatile';
  confidence: 'verified' | 'production_proven' | 'community_accepted' | 'experimental' | 'research';
  engineering_maturity: 'research' | 'experimental' | 'emerging' | 'production_ready' | 'legacy';
  sources: string[];       // at least one URL
  github_repo: string;
  
  // Registry-specific fields
  task: RegistryTask;
  category: RegistryCategory;
  size_mb: number;
  link: string | MissingModelRef;
  hardware_requirements: string;
  download_location: string;
  license: string;
  supported_tasks: string[];
  version_compatibility: string[];
  official_resources: string[];
}
```

### RegistryTask Enum
- `embedding`
- `reranker`
- `vision`
- `speech`
- `llm`
- `multimodal`
- `ocr`

---

## BaseMeta Schema

### Location
- Zod Schema: `lib/schemas/base.ts`

### Fields (inherited by all content types)
```typescript
{
  // Identity
  id: string;
  title: string;
  name: string;
  slug: string;
  description: string;
  
  // Discovery
  tags: string[];
  aliases: string[];
  keywords: string[];
  search_tokens: string[];
  
  // Classification
  domain: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  engineering_area: string;
  
  // Learning
  estimated_reading_time: number;
  prerequisites: string[];
  recommended_next: string[];
  related_content: ContentRef[];
  
  // Maintenance
  created_at: string;   // YYYY-MM-DD
  updated_at: string;   // YYYY-MM-DD
  last_verified: string;
  review_frequency: 'monthly' | 'quarterly' | 'semi_annually' | 'annually';
  
  // Versioning
  verified_against: string;
  compatible_versions: string[];
  breaking_changes: string[];
  
  // Governance
  owner: string;
  canonical_status: 'canonical' | 'reference' | 'generated';
  lifecycle: 'draft' | 'verified' | 'stable' | 'deprecated' | 'archived';
  stability: 'stable' | 'semi_stable' | 'volatile';
  confidence: 'verified' | 'production_proven' | 'community_accepted' | 'experimental' | 'research';
  engineering_maturity: 'research' | 'experimental' | 'emerging' | 'production_ready' | 'legacy';
  
  // Sources
  sources: string[];    // at least one URL
  github_repo: string;
}
```

---

## ContentRef Schema

### Location
- Zod Schema: `lib/schemas/base.ts`

### Structure
```typescript
{
  id: string;           // target content ID
  type: ContentType;   // workflow | pattern | model | package | cheatsheet | debug_guide | registry | decision_guide | principle
  relationship_type: RelationshipType; // optional: uses | implements | requires | depends_on | alternative_to | extends | built_with | optimized_by | benchmarked_by | debugged_by | deployed_with | references | supersedes | related_to
}
```

---

## Related Documentation

- **Content Guidelines**: See `engineering/content-schema.md`
- **Validation Rules**: See `engineering/validation.md`
- **Naming Conventions**: See `reference/naming.md`
