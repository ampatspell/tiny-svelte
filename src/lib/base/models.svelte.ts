import type { Position, Size } from '$lib/types';
import { getContext, setContext } from 'svelte';

const STAGE_CONTEXT = 'stage';
const LAYER_CONTEXT = 'layer';
const RENDER_CONTEXT = 'render';

export type DrawFunction<T> = (model: T, ctx: CanvasRenderingContext2D) => void;
export type DrawFunctionGetter<T> = () => DrawFunction<T>;
export type ModelFunction<T> = () => T;
export type PositionFunction = () => Position | undefined;

export type RenderContextOptions<T> = {
	layer: LayerContext;
	parent?: RenderContext<unknown>;
	position: PositionFunction;
	model: ModelFunction<T>;
	draw: DrawFunctionGetter<T>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class RenderContext<T = any> {
	options: RenderContextOptions<T>;
	element = $state<HTMLElement>();
	renders = $state<RenderContext[]>([]);

	constructor(options: RenderContextOptions<T>) {
		this.options = options;
		$effect(() => {
			this.element;
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
		return this.options.model();
	}

	get draw() {
		return this.options.draw();
	}

	registerRender(render: RenderContext) {
		this.renders.push(render);
	}

	unregisterRender(render: RenderContext) {
		this.renders = this.renders.filter((arg) => arg !== render);
	}

	render(ctx: CanvasRenderingContext2D) {
		const { model, draw, position } = this;
		ctx.save();
		{
			ctx.translate(position?.x ?? 0, position?.y ?? 0);
			draw(model, ctx);

			const renders = this.renders.toSorted((a, b) => a.index - b.index);
			renders.forEach((render) => render.render(ctx));
		}
		ctx.restore();
	}
}

const layerModel = () => null;
const layerDraw = () => () => null;

export class LayerContext {
	stage: StageContext;
	render: RenderContext<null>;
	isRendering = false;

	constructor(stage: StageContext) {
		this.stage = stage;
		this.render = new RenderContext({
			layer: this,
			position: () => ({ x: 0, y: 0 }),
			model: layerModel,
			draw: layerDraw
		});
		$effect(() => {
			this.size;
			this.canvas;
			this.setNeedsRender();
		});
	}

	get canvas() {
		return this.render.element as HTMLCanvasElement | undefined;
	}

	get size() {
		return this.stage.size;
	}

	setNeedsRender() {
		if (this.isRendering) {
			return;
		}
		this.isRendering = true;
		requestAnimationFrame(() => {
			const { size, canvas } = this;
			if (size.width > 0 && size.height > 0 && canvas) {
				canvas.width = size.width;
				canvas.height = size.height;
				const ctx = canvas.getContext('2d')!;
				ctx.clearRect(0, 0, size.width, size.height);
				this.render.render(ctx);
			}
			this.isRendering = false;
		});
	}

	convertToLayerPosition(e: MouseEvent): Position {
		const clientRect = this.canvas?.getBoundingClientRect();
		if (!clientRect) {
			throw new Error('no canvas');
		}
		const x = e.clientX - clientRect.left;
		const y = e.clientY - clientRect.top;
		return { x, y };
	}
}

export type StageContextOptions = {
	size?: () => Size | undefined;
};

export class StageContext {
	layers = $state<LayerContext[]>([]);
	size = $state<Size>({ width: 0, height: 0 });

	constructor(options: StageContextOptions) {
		$effect(() => {
			const size = options.size?.();
			if (size) {
				this.size = size;
			}
		});
	}

	registerLayer(layer: LayerContext) {
		this.layers.push(layer);
	}

	unregisterLayer(layer: LayerContext) {
		this.layers = this.layers.filter((arg) => arg !== layer);
	}
}

export const setLayerContext = (context: LayerContext) => {
	setContext(LAYER_CONTEXT, context);
};

export const getLayerContext = () => {
	return getContext(LAYER_CONTEXT) as LayerContext;
};

export const setRenderContext = (context: RenderContext) => {
	setContext(RENDER_CONTEXT, context);
};

export const getRenderContext = <T>() => {
	return getContext(RENDER_CONTEXT) as RenderContext<T>;
};

export const setStageContext = (context: StageContext) => {
	setContext(STAGE_CONTEXT, context);
};

export const getStageContext = () => {
	return getContext(STAGE_CONTEXT) as StageContext;
};
