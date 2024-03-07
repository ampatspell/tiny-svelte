import type { Point } from '$lib/types';

export const mouseClientPositionToPoint = (e: MouseEvent): Point => ({
  x: e.clientX,
  y: e.clientY
});

export const stopPropagation =
  <T extends Event>(fn: (e: T) => void) =>
  (e: T) => {
    e.stopPropagation();
    return fn(e);
  };
