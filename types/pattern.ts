import { z } from 'zod';
import { PatternSchema, PatternCategorySchema } from '@/lib/schemas/pattern';

export type Pattern = z.infer<typeof PatternSchema>;
export type PatternCategory = z.infer<typeof PatternCategorySchema>;
