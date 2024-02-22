export type Nullable<T> = T | null | undefined;

export type Size = { width: number; height: number };
export type Point = { x: number; y: number };

export type SpriteData = {
  name: string;
  size: Size;
  pixels: number[];
}

export type SpriteIndex = Pick<SpriteData, 'name'>;
