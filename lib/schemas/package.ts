import { z } from 'zod';
import { BaseMetaSchema, ContentRefSchema } from './meta';

export const PackageFunctionSchema = z.object({
  fn: z.string(),
  purpose: z.string(),
  example: z.string(),
  category: z.string(),
});

export const PackageSectionSchema = z.object({
  name: z.string(),
  functions: z.array(PackageFunctionSchema),
  gotchas: z.array(z.string()),
});

export const PackageSchema = BaseMetaSchema.extend({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  install: z.string(),
  import_as: z.string(),
  summary: z.string(),
  sections: z.array(PackageSectionSchema),
  alternatives: z.array(ContentRefSchema),
});
