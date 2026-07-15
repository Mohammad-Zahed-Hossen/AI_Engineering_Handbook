import { z } from 'zod';
import { DecisionGuideSchema, DecisionCategorySchema, DecisionOptionSchema, DecisionMatrixEntrySchema, ConstraintRecommendationSchema, TradeoffEntrySchema, DecisionTreeEntrySchema, HybridStrategySchema, MigrationStepSchema, ProductionExampleSchema } from '@/lib/schemas/decision-guide';

export type DecisionGuide = z.infer<typeof DecisionGuideSchema>;
export type DecisionCategory = z.infer<typeof DecisionCategorySchema>;
export type DecisionOption = z.infer<typeof DecisionOptionSchema>;
export type DecisionMatrixEntry = z.infer<typeof DecisionMatrixEntrySchema>;
export type ConstraintRecommendation = z.infer<typeof ConstraintRecommendationSchema>;
export type TradeoffEntry = z.infer<typeof TradeoffEntrySchema>;
export type DecisionTreeEntry = z.infer<typeof DecisionTreeEntrySchema>;
export type HybridStrategy = z.infer<typeof HybridStrategySchema>;
export type MigrationStep = z.infer<typeof MigrationStepSchema>;
export type ProductionExample = z.infer<typeof ProductionExampleSchema>;