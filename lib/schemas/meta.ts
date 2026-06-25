import { z } from 'zod';

export const ContentRefSchema = z.object({
  id: z.string(),
  type: z.enum(['model', 'package', 'workflow', 'cheatsheet', 'registry']),
});

export const BaseMetaSchema = z.object({
  created_at: z.string().date({ message: "Invalid date format. Expected YYYY-MM-DD" }),
  updated_at: z.string().date({ message: "Invalid date format. Expected YYYY-MM-DD" }),
  sources: z.array(z.string().url({ message: "Invalid source URL" })).min(1, { message: "At least one source is required" }),
  github_repo: z
    .string()
    .url({ message: "Invalid GitHub repository URL" })
    .startsWith('https://github.com', { message: "GitHub repository URL must start with https://github.com" })
    .optional(),
});
