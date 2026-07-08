import { z } from 'zod';
import { PrincipleSchema, PrincipleCategorySchema } from '@/lib/schemas/principle';

export type Principle = z.infer<typeof PrincipleSchema>;
export type PrincipleCategory = z.infer<typeof PrincipleCategorySchema>;
