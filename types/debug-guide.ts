import { z } from 'zod';
import { DebugGuideSchema, DebugCategorySchema } from '@/lib/schemas/debug-guide';

export type DebugGuide = z.infer<typeof DebugGuideSchema>;
export type DebugCategory = z.infer<typeof DebugCategorySchema>;
