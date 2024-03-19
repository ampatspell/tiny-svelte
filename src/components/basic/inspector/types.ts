import type { Point, Size } from '$lib/types/schema';

export type HasMutablePixel = {
  pixel: number;
  onPixel: (pixel: number) => void;
};

export type HasMutablePosition = {
  position: Point;
  onPosition: (position: Point) => void;
};

export type HasMutableIdentifier = {
  identifier: string;
  onIdentifier: (identifier: string) => void;
};

export type HasMutableSize = {
  size: Size;
  onSize: (size: Size) => void;
};

export type HasDelete = {
  delete(): Promise<void>;
};
