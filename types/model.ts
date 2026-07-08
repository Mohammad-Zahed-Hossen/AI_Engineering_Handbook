import { z } from 'zod';
import { ModelSchema, ModelCategorySchema, ModelSubcategorySchema, ProblemTypeSchema, HyperParameterSchema } from '@/lib/schemas/model';

export type ModelCategory = z.infer<typeof ModelCategorySchema>;
export type ModelSubcategory = z.infer<typeof ModelSubcategorySchema>;
export type ProblemType = z.infer<typeof ProblemTypeSchema>;
export type HyperParameter = z.infer<typeof HyperParameterSchema>;
export type Model = z.infer<typeof ModelSchema>;
