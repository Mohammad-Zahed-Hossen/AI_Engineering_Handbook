import { z } from 'zod';
import { CheatsheetSchema, CheatsheetEntrySchema, CommonErrorSchema, PerformanceChecklistObjectSchema, QuickReferenceTableSchema } from '@/lib/schemas/cheatsheet';
import type { CanonicalRelationship } from '@/lib/relationships/types';

export type QuickReferenceTable = z.infer<typeof QuickReferenceTableSchema>;
export type CommonError = z.infer<typeof CommonErrorSchema>;
export type PerformanceChecklistObject = z.infer<typeof PerformanceChecklistObjectSchema>;
export type ProductionChecklistItem = string | PerformanceChecklistObject;

export type CheatsheetEntry = z.infer<typeof CheatsheetEntrySchema> & {
	related_package_links?: CanonicalRelationship[];
	related_workflow_links?: CanonicalRelationship[];
	related_pattern_links?: CanonicalRelationship[];
	related_decision_guide_links?: CanonicalRelationship[];
	related_api_links?: CanonicalRelationship[];
};
export type Cheatsheet = z.infer<typeof CheatsheetSchema> & {
	entries: CheatsheetEntry[];
	quick_reference_tables?: QuickReferenceTable[];
	common_errors?: CommonError[];
	performance_checklist?: ProductionChecklistItem[];
	production_checklist?: ProductionChecklistItem[];
};
