export type Nullable<T> = T | null | undefined;
export type EmptyObject = Record<string, never>;

export type Size = { width: number; height: number };
export type Point = { x: number; y: number };

export type AssetData = {
	parent?: string;
	identifier: string;
} & (SpriteAssetData | LoopAssetData);

export type SpriteAssetData = {
	type: 'sprite';
	size: Size;
	pixels: number[];
};

export type LoopAssetData = {
	type: 'loop';
	sprites: string[];
};

export type AssetIndex = {
	parent?: string;
	identifier: string;
	type: string;
};
