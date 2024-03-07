import type { Point, Size } from '$lib/types';

export const toIndex = (position: Point, size: Size) => {
  return position.y * size.width + position.x;
};

export const fromIndex = (index: number, size: Size) => {
  const y = Math.floor(index / size.width);
  const x = index - y * size.width;
  return { x, y };
};
