import { z } from 'zod';
import { DecisionGuideSchema, DecisionCategorySchema } from '@/lib/schemas/decision-guide';

export type DecisionGuide = z.infer<typeof DecisionGuideSchema>;
export type DecisionCategory = z.infer<typeof DecisionCategorySchema>;
