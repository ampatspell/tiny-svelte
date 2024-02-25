import { z } from "zod";

export type Nullable<T> = T | null | undefined;
export type EmptyObject = Record<string, never>;

export const SizeSchema = z.object({
	width: z.number(),
	height: z.number(),
});

export type Size = z.infer<typeof SizeSchema>;

export const PointSchema = z.object({
	x: z.number(),
	y: z.number()
});

export type Point = z.infer<typeof PointSchema>;

export const AssetDataBaseSchema = z.object({
	parent: z.string().optional(),
	identifier: z.string().trim().min(1)
});

export const SpriteAssetDataSchema = AssetDataBaseSchema.extend({
	type: z.literal('sprite'),
	size: SizeSchema,
	pixels: z.array(z.number()),
});

export type SpriteAssetData = z.infer<typeof SpriteAssetDataSchema>;

export const LoopAssetDataSchema = AssetDataBaseSchema.extend({
	type: z.literal('loop'),
	sprites: z.array(z.object({
		id: z.string()
	})),
});

export type LoopAssetData = z.infer<typeof LoopAssetDataSchema>;

export const AssetDataSchema = z.discriminatedUnion('type', [ SpriteAssetDataSchema, LoopAssetDataSchema ]);

export type AssetData = z.infer<typeof AssetDataSchema>;

export type AssetIndex = {
	parent: AssetData['parent'];
	identifier: AssetData['identifier'];
	type: AssetData['type'];
};
