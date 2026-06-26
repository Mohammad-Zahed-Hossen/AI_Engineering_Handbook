import { z } from 'zod';
import { RegistryModelSchema, RegistryTaskSchema, MissingModelRefSchema } from '@/lib/schemas/registry';

export type RegistryTask = z.infer<typeof RegistryTaskSchema>;
export type MissingModelRef = z.infer<typeof MissingModelRefSchema>;
export type RegistryModel = z.infer<typeof RegistryModelSchema>;
