import { z } from 'zod';
import { CheatsheetSchema, CheatsheetEntrySchema } from '@/lib/schemas/cheatsheet';

export type CheatsheetEntry = z.infer<typeof CheatsheetEntrySchema>;
export type Cheatsheet = z.infer<typeof CheatsheetSchema>;
