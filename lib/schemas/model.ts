import { z } from 'zod';

export const ModelCategorySchema = z.enum(['ml', 'dl', 'llm']);
export type ModelCategory = z.infer<typeof ModelCategorySchema>;

export const ProblemTypeSchema = z.string(); // Freeform problem types in the new schema

export const ModelSubcategorySchema = z.enum([
  // Classical ML
  'regression',
  'classification',
  'clustering',
  'dimensionality_reduction',
  'anomaly_detection',
  'ensemble_learning',
  // DL architecture primitives
  'convolutional',
  'recurrent_sequence',
  'transformer_encoder',
  'transformer_decoder',
  'generative_adversarial',
  'diffusion',
  'graph_neural_network',
  // Vision specializations
  'vision_backbone',
  'vision_detection',
  'vision_segmentation',
  // LLM architecture families
  'foundation_llm',
  'instruction_tuned_llm',
  'multimodal_llm',
  'small_efficient_llm',
  'embedding_llm',
  // Applied domains
  'time_series',
  'recommendation',
  'reinforcement_learning',
]);
export type ModelSubcategory = z.infer<typeof ModelSubcategorySchema>;

export const HyperParameterSchema = z.object({
  name: z.string(),
  purpose: z.string(),
  increaseeffect: z.string(),
  decreaseeffect: z.string(),
  tradeoffs: z.string(),
  tuningpriority: z.string(),
  interactions: z.array(z.string()),
  commonmistakes: z.array(z.string()),
});

/*
 * ModelSchema intentionally does not extend BaseMetaSchema.
 *
 * This schema predates the shared BaseMetaSchema architecture.
 * A transform layer (see .transform() below) provides compatibility with the rest of the application.
 *
 * Refactoring would require migrating approximately 30 model resources.
 * The migration cost outweighs the architectural benefit.
 *
 * This is an intentional and documented permanent exception for historical compatibility.
 * This is not considered architecture debt.
 */
export const ModelSchema = z.object({
  // Identity & Discovery
  id: z.string(),
  title: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  aliases: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  searchtokens: z.array(z.string()).default([]),
  
  // Maintenance
  createdat: z.string(),
  updatedat: z.string(),
  lastverified: z.string(),
  reviewfrequency: z.string(),
  verifiedagainst: z.string(),
  
  // Governance
  lifecycle: z.string(),
  stability: z.string(),
  confidence: z.string(),
  engineeringmaturity: z.string(),
  
  // Classification
  domain: ModelCategorySchema,
  category: z.string(), // E.g., "ensemble learning"
  difficulty: z.string(),
  engineeringarea: z.string(),
  estimatedreadingtime: z.number(),
  prerequisites: z.array(z.string()).default([]),
  recommendednext: z.array(z.string()).default([]),
  
  // Relationships
  relatedcontent: z.array(z.object({
    type: z.string(),
    id: z.string(),
    relationship: z.string()
  })).default([]),
  owner: z.string().optional(),
  sources: z.array(z.object({
    title: z.string(),
    url: z.string()
  })).min(1),
  githubrepo: z.string().url().optional(),
  problemtypes: z.array(z.string()),
  
  // Structured blocks
  decisionsummary: z.object({
    summary: z.string(),
    bestusecases: z.array(z.string()),
    avoidwhen: z.array(z.string()),
    strengths: z.array(z.string()),
    limitations: z.array(z.string()),
    interpretability: z.string(),
    trainingcharacteristics: z.string(),
    inferencecharacteristics: z.string(),
    computationalcharacteristics: z.string(),
  }),
  coreunderstanding: z.object({
    intuition: z.string(),
    learningmechanism: z.string(),
    assumptions: z.array(z.string()),
    mathematicalintuition: z.string(),
    complexity: z.string(),
    memorycomplexity: z.string(),
    robustness: z.string(),
    scalability: z.string(),
    overfittingtendency: z.string(),
    biasvariance: z.string(),
  }),
  hyperparameters: z.array(HyperParameterSchema),
  engineeringconsiderations: z.object({
    datasetsuitability: z.array(z.string()),
    scalability: z.array(z.string()),
    parallelization: z.string(),
    computationalcost: z.string(),
    memorybehavior: z.string(),
    inferencecharacteristics: z.string(),
    robustness: z.array(z.string()),
    sensitivitytooutliers: z.string(),
    featureengineeringdependency: z.string(),
    featurescalingrequirement: z.string(),
    classimbalancebehavior: z.string(),
    commonlimitations: z.array(z.string()),
    pipelineposition: z.string(),
  }),
  comparisons: z.array(z.object({
    model: z.string(),
    choose_this_when: z.string(),
    prefer_other_when: z.string(),
    tradeoffs: z.string(),
  })),
  relatedknowledge: z.object({
    relatedmodels: z.array(z.string()),
    alternative_models: z.array(z.string()),
    related_principles: z.array(z.string()),
    related_workflows: z.array(z.string()),
    related_patterns: z.array(z.string()),
    related_packages: z.array(z.string()),
    related_guides: z.array(z.string()),
    related_registry: z.array(z.string()),
  }),
  quickstart: z.object({
    language: z.string(),
    implementation_package: z.string(),
    code: z.string().min(1),
    explanation: z.string(),
    inputs: z.string(),
    outputs: z.string(),
    notes: z.string().optional(),
  }).optional(),
  learning_resources: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    type: z.enum(['article', 'video', 'course', 'guide', 'documentation', 'tutorial']),
    why_to_read: z.string(),
    expected_outcome: z.string(),
    reading_time: z.number().optional(),
  })).optional(),
}).superRefine((val, ctx) => {
  const urls = new Set<string>();
  val.sources.forEach((s, idx) => {
    if (urls.has(s.url)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate resource URL: ${s.url}`,
        path: ['sources', idx, 'url'],
      });
    }
    urls.add(s.url);
  });
  if (val.learning_resources) {
    val.learning_resources.forEach((lr, idx) => {
      if (urls.has(lr.url)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate resource URL (already exists in sources or learning resources): ${lr.url}`,
          path: ['learning_resources', idx, 'url'],
        });
      }
      urls.add(lr.url);
    });
  }
}).transform(val => {
  // Map fields to match standard naming used in application logic
  const subcategoryKey = val.category.replace(/\s+/g, '_') as ModelSubcategory;
  return {
    ...val,
    category: val.domain, // maps to 'ml' | 'dl' | 'llm' for page routes
    subcategory: subcategoryKey, // maps to underscore-separated subcategory (e.g. 'ensemble_learning')
    updated_at: val.updatedat, // standard navigation compat
    created_at: val.createdat, // standard navigation compat
    problem_types: val.problemtypes, // standard navigation compat
  };
});

export type Model = z.output<typeof ModelSchema>;

