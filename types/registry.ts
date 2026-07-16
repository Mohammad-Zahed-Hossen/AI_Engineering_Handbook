import { z } from 'zod';
import {
  ModalitySchema,
  CapabilitiesSchema,
  DeploymentSchema,
  HardwareSchema,
  DownloadSchema,
  RuntimeCompatibilitySchema,
  LicenseSchema,
  StatusSchema,
  EngineeringSnapshotSchema,
  MaintenanceStatusSchema,
  ArchitectureSchema,
  SpecificationsSchema,
  FormatsSchema,
  EcosystemSchema,
  EcosystemSupportSchema,
  ReferenceSchema,
  ReferenceCategorySchema,
  EngineeringNotesSchema,
  RelatedModelSchema,
  TimelineEntrySchema,
  RegistryFamilySchema,
  RegistryVariantSchema,
  PerformanceDimensionSchema,
  DeploymentProfileSchema,
  RuntimeMatrixEntrySchema,
  EngineeringDecisionSchema,
  RelatedResourceSchema,
} from '@/lib/schemas/registry';
import {
  LifecycleStateSchema,
  StabilityLevelSchema,
  ConfidenceLevelSchema,
  EngineeringMaturitySchema,
  CanonicalStatusSchema,
} from '@/lib/schemas/base';

export type Modality = z.infer<typeof ModalitySchema>;

export type Capabilities = z.infer<typeof CapabilitiesSchema>;
export type Deployment = z.infer<typeof DeploymentSchema>;
export type Hardware = z.infer<typeof HardwareSchema>;
export type Download = z.infer<typeof DownloadSchema>;
export type RuntimeCompatibility = z.infer<typeof RuntimeCompatibilitySchema>;
export type License = z.infer<typeof LicenseSchema>;
export type Status = z.infer<typeof StatusSchema>;
export type EngineeringSnapshot = z.infer<typeof EngineeringSnapshotSchema>;
export type MaintenanceStatus = z.infer<typeof MaintenanceStatusSchema>;
export type Architecture = z.infer<typeof ArchitectureSchema>;
export type Specifications = z.infer<typeof SpecificationsSchema>;
export type Formats = z.infer<typeof FormatsSchema>;
export type Ecosystem = z.infer<typeof EcosystemSchema>;
export type EcosystemSupport = z.infer<typeof EcosystemSupportSchema>;
export type Reference = z.infer<typeof ReferenceSchema>;
export type ReferenceCategory = z.infer<typeof ReferenceCategorySchema>;
export type EngineeringNotes = z.infer<typeof EngineeringNotesSchema>;
export type RelatedModel = z.infer<typeof RelatedModelSchema>;
export type TimelineEntry = z.infer<typeof TimelineEntrySchema>;
export type RegistryFamily = z.infer<typeof RegistryFamilySchema>;
export type RegistryVariant = z.infer<typeof RegistryVariantSchema>;

// New types for Engineering Decision Cards
export type PerformanceDimension = z.infer<typeof PerformanceDimensionSchema>;
export type DeploymentProfile = z.infer<typeof DeploymentProfileSchema>;
export type RuntimeMatrixEntry = z.infer<typeof RuntimeMatrixEntrySchema>;
export type EngineeringDecision = z.infer<typeof EngineeringDecisionSchema>;
export type RelatedResource = z.infer<typeof RelatedResourceSchema>;

// BaseMetaSchema types for Registry
export type LifecycleState = z.infer<typeof LifecycleStateSchema>;
export type StabilityLevel = z.infer<typeof StabilityLevelSchema>;
export type ConfidenceLevel = z.infer<typeof ConfidenceLevelSchema>;
export type EngineeringMaturity = z.infer<typeof EngineeringMaturitySchema>;
export type CanonicalStatus = z.infer<typeof CanonicalStatusSchema>;
