import { z } from 'zod';
import { ModelSchema, ModelCategorySchema, ModelSubcategorySchema, ProblemTypeSchema, SpeedRatingSchema, SizeRatingSchema, InterpretabilityRatingSchema, HyperParameterSchema } from '@/lib/schemas/model';

export type ModelCategory = z.infer<typeof ModelCategorySchema>;
export type ModelSubcategory = z.infer<typeof ModelSubcategorySchema>;
export type ProblemType = z.infer<typeof ProblemTypeSchema>;
export type SpeedRating = z.infer<typeof SpeedRatingSchema>;
export type SizeRating = z.infer<typeof SizeRatingSchema>;
export type InterpretabilityRating = z.infer<typeof InterpretabilityRatingSchema>;
export type HyperParameter = z.infer<typeof HyperParameterSchema>;
export type Model = z.infer<typeof ModelSchema>;
