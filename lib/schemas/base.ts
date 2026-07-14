import { z } from 'zod';

/**
 * AENS v2 Base Metadata Schema
 * 
 * This is the shared base schema for ALL content types in AENS.
 * Every knowledge object (Workflow, Pattern, Model, Package, Cheatsheet, Debug Guide, Registry, Decision Guide, Principle)
 * must inherit from this schema.
 * 
 * This schema implements the AENS Knowledge Layer Specification v1.0 metadata requirements.
 */

// ── Lifecycle States ────────────────────────────────────────────────

export const LifecycleStateSchema = z.enum(['draft', 'verified', 'stable', 'deprecated', 'archived']);
export type LifecycleState = z.infer<typeof LifecycleStateSchema>;

// ── Stability Classification ───────────────────────────────────────────

export const StabilityLevelSchema = z.enum(['stable', 'semi_stable', 'volatile']);
export type StabilityLevel = z.infer<typeof StabilityLevelSchema>;

// ── Confidence Levels ──────────────────────────────────────────────────

export const ConfidenceLevelSchema = z.enum(['verified', 'production_proven', 'community_accepted', 'experimental', 'research']);
export type ConfidenceLevel = z.infer<typeof ConfidenceLevelSchema>;

// ── Engineering Maturity ───────────────────────────────────────────────

export const EngineeringMaturitySchema = z.enum(['research', 'experimental', 'emerging', 'production_ready', 'legacy']);
export type EngineeringMaturity = z.infer<typeof EngineeringMaturitySchema>;

// ── Canonical Status ───────────────────────────────────────────────────

export const CanonicalStatusSchema = z.enum(['canonical', 'reference', 'generated']);
export type CanonicalStatus = z.infer<typeof CanonicalStatusSchema>;

// ── Relationship Types (Typed Graph Relationships) ───────────────────

export const RelationshipTypeSchema = z.enum([
  'uses',
  'used_by',
  'implements',
  'implemented_by',
  'requires',
  'required_by',
  'depends_on',
  'depended_on_by',
  'alternative_to',
  'extends',
  'extended_by',
  'built_with',
  'builds',
  'optimized_by',
  'optimizes',
  'benchmarked_by',
  'benchmarks',
  'debugged_by',
  'debugs',
  'deployed_with',
  'deploys',
  'references',
  'referenced_by',
  'supersedes',
  'superseded_by',
  'related_to',
]);
export type RelationshipType = z.infer<typeof RelationshipTypeSchema>;

// ── Content Reference (Typed) ─────────────────────────────────────────

export const ContentRefSchema = z.object({
  id: z.string(),
  type: z.enum([
    'workflow',
    'pattern',
    'model',
    'package',
    'cheatsheet',
    'debug_guide',
    'registry',
    'decision_guide',
    'principle',
  ]),
  relationship_type: z.string().optional(),
});
export type ContentRef = z.infer<typeof ContentRefSchema>;

// ── Base Metadata Schema ───────────────────────────────────────────────

export const BaseMetaSchema = z.object({
  // ── Identity ────────────────────────────────────────────────────────
  id: z.string(),
  title: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),


  // ── Discovery ────────────────────────────────────────────────────────
  tags: z.array(z.string()).default([]),
  aliases: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  search_tokens: z.array(z.string()).default([]),

  // ── Classification ───────────────────────────────────────────────────
  domain: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  engineering_area: z.string().optional(),

  // ── Learning ─────────────────────────────────────────────────────────
  estimated_reading_time: z.number().optional(), // in minutes
  prerequisites: z.array(z.string()).default([]),
  recommended_next: z.array(z.string()).default([]),
  related_content: z.array(ContentRefSchema).default([]),

  // ── Maintenance ──────────────────────────────────────────────────────
  created_at: z.string().date({ message: "Invalid date format. Expected YYYY-MM-DD" }),
  updated_at: z.string().date({ message: "Invalid date format. Expected YYYY-MM-DD" }),
  last_verified: z.string().date({ message: "Invalid date format. Expected YYYY-MM-DD" }).optional(),
  review_frequency: z.enum(['monthly', 'quarterly', 'semi_annually', 'annually']).optional(),

  // ── Versioning ───────────────────────────────────────────────────────
  verified_against: z.string().optional(),
  compatible_versions: z.array(z.string()).default([]),
  breaking_changes: z.array(z.string()).default([]),

  // ── Governance ──────────────────────────────────────────────────────
  owner: z.string().optional(),
  canonical_status: CanonicalStatusSchema.default('canonical'),
  lifecycle: LifecycleStateSchema.default('draft'),
  stability: StabilityLevelSchema.default('volatile'),
  confidence: ConfidenceLevelSchema.optional(),
  engineering_maturity: EngineeringMaturitySchema.optional(),

  // ── Sources ───────────────────────────────────────────────────────────
  sources: z.array(
    z.union([
      z.string().url({ message: "Invalid source URL" }),
      z.object({ title: z.string(), url: z.string().url({ message: "Invalid source URL" }) }),
    ])
  ).min(1, { message: "At least one source is required" }),
  github_repo: z
    .string()
    .url({ message: "Invalid GitHub repository URL" })
    .startsWith('https://github.com', { message: "GitHub repository URL must start with https://github.com" })
    .optional(),
});

export type BaseMeta = z.infer<typeof BaseMetaSchema>;
