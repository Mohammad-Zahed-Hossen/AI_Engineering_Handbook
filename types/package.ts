import { z } from 'zod';
import { PackageSchema, PackageTaskSchema, VisualizationEquivalentSchema } from '@/lib/schemas/package';
import type { CanonicalRelationship } from '@/lib/relationships/types';

export type PackageTask = z.infer<typeof PackageTaskSchema> & {
	related_workflow_links?: CanonicalRelationship[];
	related_cheatsheet_links?: CanonicalRelationship[];
	related_model_links?: CanonicalRelationship[];
	related_pattern_links?: CanonicalRelationship[];
	related_decision_guide_links?: CanonicalRelationship[];
	related_package_task_links?: CanonicalRelationship[];
	related_api_links?: CanonicalRelationship[];
};
export type VisualizationEquivalent = z.infer<typeof VisualizationEquivalentSchema>;
export type Package = z.infer<typeof PackageSchema> & {
	tasks: PackageTask[];
};
