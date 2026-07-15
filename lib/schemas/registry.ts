import { z } from 'zod';

export const RegistryTaskSchema = z.enum([
  'embedding',
  'reranker',
  'vision',
  'speech',
  'llm',
  'multimodal',
  'ocr',
]);
export type RegistryTask = z.infer<typeof RegistryTaskSchema>;

export const RegistryCategorySchema = z.enum([
  'models',
  'datasets',
  'benchmarks',
  'services',
  'leaderboards',
  'mcp_servers',
  'repos',
]);
export type RegistryCategory = z.infer<typeof RegistryCategorySchema>;

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

// ── Capabilities Section ──────────────────────────────────────────

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

// ── Deployment Section ────────────────────────────────────────────

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

// ── Downloads Section ───────────────────────────────────────────

export const DownloadSchema = z.object({
  platform: z.string(),
  url: z.string().url(),
  official: z.boolean().default(false),
  notes: z.string().optional(),
});
export type Download = z.infer<typeof DownloadSchema>;

// ── Runtime Compatibility Section ─────────────────────────────────

export const RuntimeCompatibilitySchema = z.object({
  runtime: z.string(),
  supported: z.boolean(),
  minimum_version: z.string().optional(),
  notes: z.string().optional(),
});
export type RuntimeCompatibility = z.infer<typeof RuntimeCompatibilitySchema>;

// ── Licensing Section ───────────────────────────────────────────

export const LicenseSchema = z.object({
  name: z.string(),
  commercial_use: z.boolean().optional(),
  modification: z.boolean().optional(),
  redistribution: z.boolean().optional(),
  attribution_required: z.boolean().optional(),
  notes: z.string().optional(),
});
export type License = z.infer<typeof LicenseSchema>;

// ── Status Section ──────────────────────────────────────────────

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

// ── Engineering Snapshot Section ──────────────────────────────────

export const EngineeringSnapshotSchema = z.object({
  best_for: z.array(z.string()).default([]),
  avoid_for: z.array(z.string()).default([]),
  deployment_complexity: z.string().optional(),
  production_ready: z.boolean().optional(),
  recommended_use_case: z.string().optional(),
});
export type EngineeringSnapshot = z.infer<typeof EngineeringSnapshotSchema>;

// ── Main Registry Model Schema ───────────────────────────────────

// Link field supports both string paths and structured missing references
export const RegistryModelSchema = z.object({
  // Core identification
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  name: z.string(),
  
  // Registry-specific fields
  task: RegistryTaskSchema,
  category: RegistryCategorySchema,
  size_mb: z.number(),
  
  // Legacy fields (preserved for backward compatibility)
  link: z.union([z.string(), MissingModelRefSchema]).optional(),
  hardware_requirements: z.string().optional(),
  download_location: z.string().url().optional(),
  license: z.string().optional(),
  
  // ── New Structured Metadata ───────────────────────────────────
  
  // Identity
  identity: IdentitySchema.optional(),
  
  // Capabilities
  capabilities: CapabilitiesSchema.optional(),
  
  // Deployment
  deployment: DeploymentSchema.optional(),
  
  // Hardware (structured)
  hardware: HardwareSchema.optional(),
  
  // Downloads (multiple sources)
  downloads: z.array(DownloadSchema).default([]),
  
  // Runtime compatibility (extensible)
  runtime_compatibility: z.array(RuntimeCompatibilitySchema).default([]),
  
  // Licensing (structured)
  license_info: LicenseSchema.optional(),
  
  // Status
  status: StatusSchema.optional(),
  
  // Engineering Snapshot
  engineering_snapshot: EngineeringSnapshotSchema.optional(),
  
  // Legacy fields (preserved)
  supported_tasks: z.array(z.string()).default([]),
  version_compatibility: z.array(z.string()).default([]),
  
  // Reference to official resources
  official_resources: z.array(z.string().url()).default([]),
  
  // Metadata fields
  created_at: z.string(),
  updated_at: z.string(),
  sources: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
  aliases: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  search_tokens: z.array(z.string()).default([]),
});

export type RegistryModel = z.infer<typeof RegistryModelSchema>;