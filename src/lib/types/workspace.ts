import { z } from 'zod';
import { IdentifierSchema, PixelSchema, PointSchema } from './schema';

export const WorkspaceDataSchema = z.object({
  identifier: IdentifierSchema
});

export type WorkspaceData = z.infer<typeof WorkspaceDataSchema>;

//

export const WorkspaceNodeDataSchema = z.object({
  position: PointSchema,
  pixel: PixelSchema,
  asset: IdentifierSchema
});

export type WorkspaceNodeData = z.infer<typeof WorkspaceNodeDataSchema>;

export type WorkspaceNodeIndex = Record<string, never>;
