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