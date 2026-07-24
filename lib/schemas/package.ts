import { z } from 'zod';
import { BaseMetaSchema, ContentRefSchema } from './base';

export const VisualizationEquivalentSchema = z.object({
  package: z.string().min(1),
  task: z.string().min(1),
  reason: z.string().min(1),
});

export const PackageTaskSchema = z.object({
  task: z.string(),
  resource_id: z.string().optional(),
  mental_trigger: z.string().optional(),
  syntax: z.string(),
  important_params: z.array(z.string()).max(7).optional().default([]),
  example: z.string(),
  use_when: z.string().optional(),
  avoid_when: z.string().optional(),
  decision_notes: z.string().optional(),
  gotchas: z.array(z.string()).optional().default([]),
  official_docs: z.string().url().optional(),
  related_workflows: z.array(z.string()).optional().default([]),
  related_cheatsheets: z.array(z.string()).optional().default([]),
  related_models: z.array(z.string()).optional().default([]),
  related_patterns: z.array(z.string()).optional().default([]),
  related_decision_guides: z.array(z.string()).optional().default([]),
  related_package_tasks: z.array(z.string()).optional().default([]),
  related_apis: z.array(z.string()).optional().default([]),
  visualization_equivalents: z.array(VisualizationEquivalentSchema).optional().default([]),
});

export const PackageSchema = BaseMetaSchema.extend({
  // Package-specific fields
  name: z.string(),
  version: z.string(),
  install: z.string().optional(),
  import_as: z.string().optional(),
  language: z.string().optional().default('python'),
  summary: z.string(),
  tasks: z.array(PackageTaskSchema),
  alternatives: z.array(ContentRefSchema).optional().default([]),
  
  // Package-specific debugging
  package_specific_debugging: z.array(z.string()).default([]),
  migration_notes: z.array(z.string()).default([]),
  breaking_changes: z.array(z.string()).default([]),
});
