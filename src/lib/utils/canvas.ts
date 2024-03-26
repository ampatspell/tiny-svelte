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

export const drawGrid = ({ ctx, pixel, size: { width, height } }: DrawGridOptions) => {
  nest(ctx, () => {
    ctx.fillStyle = 'rgba(0,0,0,0.01)';
    ctx.fillRect(0, 0, pixel * width + 1, pixel * height + 1);

    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= width; x++) {
      ctx.moveTo(x * pixel - 0.5, 0);
      ctx.lineTo(x * pixel - 0.5, height * pixel - 0.5);
    }
    for (let y = 0; y <= height; y++) {
      ctx.moveTo(0, y * pixel - 0.5);
      ctx.lineTo(width * pixel - 0.5, y * pixel - 0.5);
    }
    ctx.stroke();
  });
};
