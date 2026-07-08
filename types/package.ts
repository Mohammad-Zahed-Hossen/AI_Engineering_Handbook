import { z } from 'zod';
import { PackageSchema, PackageTaskSchema, VisualizationEquivalentSchema } from '@/lib/schemas/package';

export type PackageTask = z.infer<typeof PackageTaskSchema>;
export type VisualizationEquivalent = z.infer<typeof VisualizationEquivalentSchema>;
export type Package = z.infer<typeof PackageSchema>;
