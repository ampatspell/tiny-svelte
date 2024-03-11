import { z } from 'zod';

export const ProjectDocumentDataSchema = z.object({
  identifier: z.string().trim().min(0)
});

export type ProjectDocumentData = z.infer<typeof ProjectDocumentDataSchema>;
