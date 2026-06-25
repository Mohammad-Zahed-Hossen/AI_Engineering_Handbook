import { z } from 'zod';
import { BaseMetaSchema, ContentRefSchema } from './meta';

export const PackageTaskSchema = z.object({
  task: z.string(),
  mental_trigger: z.string(),
  syntax: z.string(),
  important_params: z.array(z.string()).max(5),
  example: z.string(),
  use_when: z.string(),
  avoid_when: z.string(),
  decision_notes: z.string(),
  gotchas: z.array(z.string()),
  official_docs: z.string().url(),
  related_workflows: z.array(z.string()),
  related_cheatsheets: z.array(z.string()),
});

export const PackageSchema = BaseMetaSchema.extend({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  install: z.string(),
  import_as: z.string(),
  summary: z.string(),
  tasks: z.array(PackageTaskSchema),
  alternatives: z.array(ContentRefSchema),
});
