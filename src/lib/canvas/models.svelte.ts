import type { Position, Size } from "$lib/types";
import { getContext, setContext } from "svelte";

const STAGE_CONTEXT = 'stage';
const LAYER_CONTEXT = 'layer';
const RENDER_CONTEXT = 'render';

export class LayerContext {
  stage: StageContext;
  render: RenderContext;

  constructor(stage: StageContext) {
    this.stage = stage;
    this.render = new RenderContext({
      layer: this,
      position: () => ({ x: 0, y: 0 }),
      draw: {
        model: () => null,
        draw: () => () => null,
      }
    });
  }

  get canvas() {
    return this.render.element! as HTMLCanvasElement;
  }

  get size() {
    return this.stage.size;
  }

  isRendering = false;

  setNeedsRender() {
    if(this.isRendering) {
      return;
    }
    this.isRendering = true;
    requestAnimationFrame(() => {
      const { size, canvas } = this;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, size.width, size.height);
      this.render.render(ctx);
      this.isRendering = false;
    });
  }

}

export type RenderContextDrawFunction<T> = (model: T, ctx: CanvasRenderingContext2D) => void;
export type RenderContextModelFunction<T> = () => T;

export type RenderContextDraw<T> = {
  model: RenderContextModelFunction<T>;
  draw: () => RenderContextDrawFunction<T>;
};

export type RenderContextOptions = {
  layer: LayerContext;
  parent?: RenderContext;
  position: () => Position;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  draw: RenderContextDraw<any>;
};

export class RenderContext {
  options: RenderContextOptions;
  element?: HTMLElement;
  renders = $state<RenderContext[]>([]);

  constructor(options: RenderContextOptions) {
    this.options = options;
    $effect(() => {
      this.position;
      this.model;
      this.draw;
      this.renders;
      this.layer.setNeedsRender();
    });
  }

  get layer() {
    return this.options.layer;
  }

  get parent() {
    return this.options.parent;
  }

  get position() {
    return this.options.position();
  }

  get index() {
    const { element } = this;
    return [...element!.parentElement!.children].indexOf(element!);
  }

  get model() {
    return this.options.draw.model();
  }

  get draw() {
    return this.options.draw.draw();
  }

  registerRender(render: RenderContext) {
    this.renders.push(render);
  }

  unregisterRender(render: RenderContext) {
    this.renders = this.renders.filter(arg => arg !== render);
  }

  render(ctx: CanvasRenderingContext2D) {
    const { model, draw, position } = this;
    ctx.save();
    {
      ctx.translate(position.x, position.y);
      draw(model, ctx);

      const renders = this.renders.toSorted((a, b) => a.index - b.index);
      renders.forEach(render => render.render(ctx));
    }
    ctx.restore();
  }

}

export class StageContext {
  layers = $state<LayerContext[]>([]);
  size = $state<Size>({ width: 0, height: 0 });

  registerLayer(layer: LayerContext) {
    this.layers.push(layer);
  }

  unregisterLayer(layer: LayerContext) {
    this.layers = this.layers.filter(arg => arg !== layer);
  }

  onMouseMove(cb: (e: MouseEvent) => void) {
    $effect.pre(() => {
      window.addEventListener('mousemove', cb);
      return () => {
        window.removeEventListener('mousemove', cb);
      }
    });
  }

}

export const setLayerContext = (context: LayerContext) => {
  setContext(LAYER_CONTEXT, context);
}

export const getLayerContext = () => {
  return getContext(LAYER_CONTEXT) as LayerContext;
}

export const setRenderContext = (context: RenderContext) => {
  setContext(RENDER_CONTEXT, context);
}

export const getRenderContext = () => {
  return getContext(RENDER_CONTEXT) as RenderContext;
}

export const setStageContext = (context: StageContext) => {
  setContext(STAGE_CONTEXT, context);
}

export const getStageContext = () => {
  return getContext(STAGE_CONTEXT) as StageContext;
}
