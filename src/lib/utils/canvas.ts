import type { Size } from '$lib/types/schema';

export type DrawGridOptions = {
  ctx: CanvasRenderingContext2D;
  pixel: number;
  size: Size;
};

export const nest = <T>(ctx: CanvasRenderingContext2D, fn: () => T): T => {
  ctx.save();
  const res = fn();
  ctx.restore();
  return res;
};

const o = 0;

export const drawGrid = ({ ctx, pixel, size: { width, height } }: DrawGridOptions) => {
  nest(ctx, () => {
    ctx.strokeStyle = 'rgba(0,0,0,0.075)';
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = 1; x < width; x++) {
      ctx.moveTo(x * pixel + o, o);
      ctx.lineTo(x * pixel + o, height * pixel + o);
    }
    for (let y = 1; y < height; y++) {
      ctx.moveTo(0, y * pixel + o);
      ctx.lineTo(width * pixel + o, y * pixel + o);
    }
    ctx.stroke();
  });
};
