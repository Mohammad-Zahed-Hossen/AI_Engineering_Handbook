import { z } from 'zod';
import { PackageSchema, PackageTaskSchema } from '@/lib/schemas/package';

export type PackageTask = z.infer<typeof PackageTaskSchema>;
export type Package = z.infer<typeof PackageSchema>;
