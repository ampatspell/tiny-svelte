import { z } from 'zod';
import { IdentifierSchema } from './schema';

export const ProjectDataSchema = z.object({
  identifier: IdentifierSchema
});

export type ProjectData = z.infer<typeof ProjectDataSchema>;
