import { z } from 'zod';
import { BaseMetaSchema, ContentRefSchema } from '@/lib/schemas/meta';

export type BaseMeta = z.infer<typeof BaseMetaSchema>;
export type ContentRef = z.infer<typeof ContentRefSchema>;
