import { z } from 'zod';

// Structured missing model reference for graph completeness
export const MissingModelRefSchema = z.object({
  type: z.literal('missing'),
  id: z.string(),
  reason: z.string().optional(),
});
export type MissingModelRef = z.infer<typeof MissingModelRefSchema>;

// ── Identity Section ──────────────────────────────────────────────

export const IdentitySchema = z.object({
  family: z.string().optional(),
  variant: z.string().optional(),
  checkpoint: z.string().optional(),
  provider: z.string().optional(),
});
export type Identity = z.infer<typeof IdentitySchema>;

// ── Architecture Section ──────────────────────────────────────────

export const ArchitectureSchema = z.object({
  architecture_type: z.string().optional(),
  transformer_type: z.string().optional(),
  attention_mechanism: z.string().optional(),
  tokenizer: z.string().optional(),
  positional_encoding: z.string().optional(),
  mixture_of_experts: z.boolean().optional(),
  kv_cache: z.boolean().optional(),
  flash_attention: z.boolean().optional(),
  grouped_query_attention: z.boolean().optional(),
});
export type Architecture = z.infer<typeof ArchitectureSchema>;

// ── Model Specifications Section ───────────────────────────────────

export const SpecificationsSchema = z.object({
  parameter_count: z.number().optional(),
  active_parameters: z.number().optional(),
  hidden_size: z.number().optional(),
  layers: z.number().optional(),
  attention_heads: z.number().optional(),
  vocab_size: z.number().optional(),
  training_tokens: z.number().optional(),
  context_window: z.number().optional(),
  max_output_tokens: z.number().optional(),
});
export type Specifications = z.infer<typeof SpecificationsSchema>;

// ── File Formats Section ───────────────────────────────────────────

export const FormatsSchema = z.object({
  safetensors: z.boolean().optional(),
  gguf: z.boolean().optional(),
  awq: z.boolean().optional(),
  gptq: z.boolean().optional(),
  exl2: z.boolean().optional(),
  mlx: z.boolean().optional(),
  onnx: z.boolean().optional(),
  tensorrt: z.boolean().optional(),
});
export type Formats = z.infer<typeof FormatsSchema>;

// ── Ecosystem Support Section ───────────────────────────────────────

export const EcosystemSupportSchema = z.object({
  supported: z.boolean(),
  notes: z.string().optional(),
});
export type EcosystemSupport = z.infer<typeof EcosystemSupportSchema>;

export const EcosystemSchema = z.object({
  transformers: EcosystemSupportSchema.optional(),
  vllm: EcosystemSupportSchema.optional(),
  ollama: EcosystemSupportSchema.optional(),
  llama_cpp: EcosystemSupportSchema.optional(),
  mlx: EcosystemSupportSchema.optional(),
  litellm: EcosystemSupportSchema.optional(),
  openrouter: EcosystemSupportSchema.optional(),
  lm_studio: EcosystemSupportSchema.optional(),
  tensorrt_llm: EcosystemSupportSchema.optional(),
});
export type Ecosystem = z.infer<typeof EcosystemSchema>;

// ── Reference System Section ───────────────────────────────────────

export const ReferenceCategorySchema = z.enum([
  'official',
  'documentation',
  'papers',
  'benchmarks',
  'deployment',
  'repositories',
  'fine_tuning',
  'quantization',
  'leaderboards',
  'tutorials',
  'community',
]);
export type ReferenceCategory = z.infer<typeof ReferenceCategorySchema>;

export const ReferenceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  category: ReferenceCategorySchema,
  official: z.boolean().default(false),
  priority: z.number().default(0),
  description: z.string().optional(),
});
export type Reference = z.infer<typeof ReferenceSchema>;

// ── Engineering Notes Section ─────────────────────────────────────

export const EngineeringNotesSchema = z.object({
  inference_notes: z.array(z.string()).default([]),
  deployment_notes: z.array(z.string()).default([]),
  optimization_notes: z.array(z.string()).default([]),
  compatibility_notes: z.array(z.string()).default([]),
  common_pitfalls: z.array(z.string()).default([]),
});
export type EngineeringNotes = z.infer<typeof EngineeringNotesSchema>;

// ── Related Models Section ─────────────────────────────────────────

export const RelatedModelSchema = z.object({
  id: z.string(),
  relationship: z.string(),
});
export type RelatedModel = z.infer<typeof RelatedModelSchema>;

// ── Release Timeline Section ───────────────────────────────────────

export const TimelineEntrySchema = z.object({
  version: z.string(),
  release_date: z.string(),
  notes: z.string().optional(),
});
export type TimelineEntry = z.infer<typeof TimelineEntrySchema>;

// ── Capabilities Section ───────────────────────────────────────────

export const CapabilitiesSchema = z.object({
  instruction_tuned: z.boolean().optional(),
  reasoning: z.boolean().optional(),
  vision: z.boolean().optional(),
  multilingual: z.boolean().optional(),
  tool_calling: z.boolean().optional(),
  function_calling: z.boolean().optional(),
  thinking_model: z.boolean().optional(),
  context_window: z.number().optional(),
  max_output_tokens: z.number().optional(),
});
export type Capabilities = z.infer<typeof CapabilitiesSchema>;

// ── Deployment Section ──────────────────────────────────────────────

export const DeploymentSchema = z.object({
  supported_runtimes: z.array(z.string()).default([]),
  recommended_runtime: z.string().optional(),
  quantizations: z.array(z.string()).default([]),
  recommended_quantization: z.string().optional(),
  cpu_supported: z.boolean().optional(),
  gpu_supported: z.boolean().optional(),
  mps_supported: z.boolean().optional(),
});
export type Deployment = z.infer<typeof DeploymentSchema>;

// ── Hardware Section ──────────────────────────────────────────────

export const HardwareSchema = z.object({
  minimum_gpu_memory: z.number().optional(),
  recommended_gpu_memory: z.number().optional(),
  minimum_ram: z.number().optional(),
  recommended_ram: z.number().optional(),
  disk_space: z.number().optional(),
  recommended_gpu: z.string().optional(),
});
export type Hardware = z.infer<typeof HardwareSchema>;

// ── Downloads Section ───────────────────────────────────────────────

export const DownloadSchema = z.object({
  platform: z.string(),
  url: z.string().url(),
  official: z.boolean().default(false),
  notes: z.string().optional(),
});
export type Download = z.infer<typeof DownloadSchema>;

// ── Runtime Compatibility Section ───────────────────────────────────

export const RuntimeCompatibilitySchema = z.object({
  runtime: z.string(),
  supported: z.boolean(),
  minimum_version: z.string().optional(),
  notes: z.string().optional(),
});
export type RuntimeCompatibility = z.infer<typeof RuntimeCompatibilitySchema>;

// ── Licensing Section ───────────────────────────────────────────────

export const LicenseSchema = z.object({
  name: z.string(),
  commercial_use: z.boolean().optional(),
  modification: z.boolean().optional(),
  redistribution: z.boolean().optional(),
  attribution_required: z.boolean().optional(),
  notes: z.string().optional(),
});
export type License = z.infer<typeof LicenseSchema>;

// ── Status Section ─────────────────────────────────────────────────

export const MaintenanceStatusSchema = z.enum([
  'production',
  'experimental',
  'deprecated',
  'research',
  'legacy',
]);
export type MaintenanceStatus = z.infer<typeof MaintenanceStatusSchema>;

export const StatusSchema = z.object({
  release_date: z.string().optional(),
  last_verified: z.string().optional(),
  maintenance_status: MaintenanceStatusSchema.optional(),
});
export type Status = z.infer<typeof StatusSchema>;

// ── Engineering Snapshot Section ───────────────────────────────────

export const EngineeringSnapshotSchema = z.object({
  best_for: z.array(z.string()).default([]),
  avoid_for: z.array(z.string()).default([]),
  deployment_complexity: z.string().optional(),
  production_ready: z.boolean().optional(),
  recommended_use_case: z.string().optional(),
});
export type EngineeringSnapshot = z.infer<typeof EngineeringSnapshotSchema>;

// ── Registry Family Schema ───────────────────────────────────────────

// Family-level schema for model families (e.g., Llama 3, DeepSeek)
export const RegistryFamilySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  provider: z.string(),
  variants: z.array(z.string()).default([]),
  // Family-level metadata (shared across variants)
  architecture: ArchitectureSchema.optional(),
  capabilities: CapabilitiesSchema.optional(),
  formats: FormatsSchema.optional(),
  ecosystem: EcosystemSchema.optional(),
  references: z.array(ReferenceSchema).default([]),
  engineering_notes: EngineeringNotesSchema.optional(),
  license_info: LicenseSchema.optional(),
  status: StatusSchema.optional(),
  engineering_snapshot: EngineeringSnapshotSchema.optional(),
  timeline: z.array(TimelineEntrySchema).default([]),
  related_models: z.array(RelatedModelSchema).default([]),
  // Metadata fields
  created_at: z.string(),
  updated_at: z.string(),
  sources: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
  aliases: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  search_tokens: z.array(z.string()).default([]),
});

export type RegistryFamily = z.infer<typeof RegistryFamilySchema>;

// ── Registry Variant Schema ────────────────────────────────────────

// Variant-level schema for individual model variants
export const RegistryVariantSchema = z.object({
  id: z.string(),
  family_id: z.string(),
  name: z.string(),
  description: z.string(),
  // Variant-specific metadata
  size_mb: z.number(),
  specifications: SpecificationsSchema.optional(),
  hardware: HardwareSchema.optional(),
  deployment: DeploymentSchema.optional(),
  downloads: z.array(DownloadSchema).default([]),
  runtime_compatibility: z.array(RuntimeCompatibilitySchema).default([]),
  // Inherit from family
  architecture: ArchitectureSchema.optional(),
  capabilities: CapabilitiesSchema.optional(),
  license_info: LicenseSchema.optional(),
  status: StatusSchema.optional(),
  engineering_snapshot: EngineeringSnapshotSchema.optional(),
  // Metadata fields
  created_at: z.string(),
  updated_at: z.string(),
  sources: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
  aliases: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  search_tokens: z.array(z.string()).default([]),
});

export type RegistryVariant = z.infer<typeof RegistryVariantSchema>;