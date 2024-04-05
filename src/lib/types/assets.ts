import { z } from 'zod';

import { IdentifierSchema, SizeSchema } from './schema';

export const AssetDataBaseSchema = z.object({
  parent: z.string().optional(),
  identifier: IdentifierSchema,
});

//

export const BoxAssetDataSchema = AssetDataBaseSchema.extend({
  type: z.literal('box'),
  size: SizeSchema,
  color: z.string(),
});

export type BoxAssetData = z.infer<typeof BoxAssetDataSchema>;

//

export const SpriteAssetDataSchema = AssetDataBaseSchema.extend({
  type: z.literal('sprite'),
  size: SizeSchema,
  pixels: z.array(z.number()),
});

export type SpriteAssetData = z.infer<typeof SpriteAssetDataSchema>;

//

// export const LoopAssetDataSchema = AssetDataBaseSchema.extend({
//   type: z.literal('loop'),
//   sprites: z.array(
//     z.object({
//       id: z.string(),
//     }),
//   ),
// });

// export type LoopAssetData = z.infer<typeof LoopAssetDataSchema>;

//

export const SceneAssetDataSchema = AssetDataBaseSchema.extend({
  type: z.literal('scene'),
  size: SizeSchema,
});

export type SceneAssetData = z.infer<typeof SceneAssetDataSchema>;

//

export const SceneLayerAssetDataSchema = AssetDataBaseSchema.extend({
  type: z.literal('scene-layer'),
  size: SizeSchema,
});

export type SceneLayerAssetData = z.infer<typeof SceneLayerAssetDataSchema>;

//

export const AssetDataSchema = z.discriminatedUnion('type', [
  BoxAssetDataSchema,
  SpriteAssetDataSchema,
  SceneAssetDataSchema,
  SceneLayerAssetDataSchema,
]);

export type AssetData = z.infer<typeof AssetDataSchema>;
export type AssetType = AssetData['type'];
