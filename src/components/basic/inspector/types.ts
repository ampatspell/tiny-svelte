import type { Point } from '$lib/types/schema';

export type HasMutablePixel = {
  pixel: number;
  onPixel: (pixel: number) => void;
};

export type HasMutablePosition = {
  position: Point;
  onPosition: (position: Point) => void;
};

export type HasIdentifier = {
  identifier: string;
  onIdentifier: (identifier: string) => void;
};
