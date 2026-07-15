import { z } from 'zod';
import { DebugGuideSchema, DebugCategorySchema, DebugOverviewSchema, QuickIdentificationItemSchema, DebugSymptomSchema, DebugRootCauseSchema, InvestigationChecklistItemSchema, DiagnosticCommandSchema, DiagnosticTestSchema, DebugDecisionTreeSchema, DebugSolutionSchema, VerificationChecklistItemSchema, PreventionCategorySchema, DebugMisconceptionSchema, FalsePositiveCaseSchema, EscalationPathSchema } from '@/lib/schemas/debug-guide';

export type DebugGuide = z.infer<typeof DebugGuideSchema>;
export type DebugCategory = z.infer<typeof DebugCategorySchema>;
export type DebugOverview = z.infer<typeof DebugOverviewSchema>;
export type QuickIdentificationItem = z.infer<typeof QuickIdentificationItemSchema>;
export type DebugSymptom = z.infer<typeof DebugSymptomSchema>;
export type DebugRootCause = z.infer<typeof DebugRootCauseSchema>;
export type InvestigationChecklistItem = z.infer<typeof InvestigationChecklistItemSchema>;
export type DiagnosticCommand = z.infer<typeof DiagnosticCommandSchema>;
export type DiagnosticTest = z.infer<typeof DiagnosticTestSchema>;
export type DebugDecisionTree = z.infer<typeof DebugDecisionTreeSchema>;
export type DebugSolution = z.infer<typeof DebugSolutionSchema>;
export type VerificationChecklistItem = z.infer<typeof VerificationChecklistItemSchema>;
export type PreventionCategory = z.infer<typeof PreventionCategorySchema>;
export type DebugMisconception = z.infer<typeof DebugMisconceptionSchema>;
export type FalsePositiveCase = z.infer<typeof FalsePositiveCaseSchema>;
export type EscalationPath = z.infer<typeof EscalationPathSchema>;