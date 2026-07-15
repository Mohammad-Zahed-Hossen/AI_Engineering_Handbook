import { z } from 'zod';
import {
  RegistryModelSchema,
  RegistryTaskSchema,
  MissingModelRefSchema,
  IdentitySchema,
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
} from '@/lib/schemas/registry';

export type RegistryTask = z.infer<typeof RegistryTaskSchema>;
export type MissingModelRef = z.infer<typeof MissingModelRefSchema>;
export type RegistryModel = z.infer<typeof RegistryModelSchema>;
export type Identity = z.infer<typeof IdentitySchema>;
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