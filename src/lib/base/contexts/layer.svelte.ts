import type { Point } from '$lib/types';
import { getContext, setContext } from 'svelte';
import { RenderContext, type RenderContextOptions } from './render.svelte';

const LAYER = 'canvas:layer';

export class LayerContext extends RenderContext<void> {
  frame?: number;
  children = $state<HTMLDivElement>();

  constructor(options: RenderContextOptions<void>) {
    super(options);
    $effect(() => {
      const {
        stage: { size },
        canvas
      } = this;
      if (size && canvas) {
        if (canvas.width !== size.width || canvas.height !== size.height) {
          this.setNeedsRender();
        }
      }
    });
    $effect(() => {
      const { children } = this;
      if (children) {
        const observer = new MutationObserver(() => this.setNeedsRender());
        observer.observe(children, { childList: true, subtree: true });
        return () => observer.disconnect();
      }
    });
  }

  get size() {
    return this.stage.size;
  }

  get canvas() {
    return this.element as HTMLCanvasElement | undefined;
  }

  setNeedsRender() {
    const { frame } = this;
    if (frame) {
      cancelAnimationFrame(frame);
    }
    this.frame = requestAnimationFrame(() => this.renderLayer());
  }

  renderLayer() {
    const { canvas, size } = this;
    if (!canvas || !size) {
      return;
    }
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, size.width, size.height);
    this.render(ctx);
  }

  clientPositionToRenderPosition(position: Point): Point {
    const clientRect = this.canvas?.getBoundingClientRect();
    if (!clientRect) {
      throw new Error('no canvas');
    }
    const x = position.x - clientRect.left;
    const y = position.y - clientRect.top;
    return { x, y };
  }
}

export const setLayerContext = (context: LayerContext) => {
  setContext(LAYER, context);
};

export const getLayerContext = () => {
  return getContext(LAYER) as LayerContext;
};
