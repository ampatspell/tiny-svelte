import type { Point } from "$lib/types";

export const mouseClientPositionToPoint = (e: MouseEvent): Point => ({
  x: e.clientX,
  y: e.clientY
});
