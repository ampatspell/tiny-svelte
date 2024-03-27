import { z } from 'zod';

export const SizeSchema = z.object({
  width: z.number(),
  height: z.number(),
});

export type Size = z.infer<typeof SizeSchema>;

export const PointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export type Point = z.infer<typeof PointSchema>;

export const IdentifierSchema = z.string().trim().min(1);
export const PixelSchema = z.number().min(1).max(64);
