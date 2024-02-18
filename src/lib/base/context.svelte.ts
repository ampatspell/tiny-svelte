import type { Nullable, Point, Size } from '$lib/types';
import { getContext, setContext } from 'svelte';

const STAGE = 'canvas:stage';
const RENDER = 'canvas:render';
const LAYER = 'canvas:layer';

export class StageContext {
	size = $state<Size>();
}

export const setStageContext = (context: StageContext) => {
	setContext(STAGE, context);
};

export const getStageContext = () => {
	return getContext(STAGE) as StageContext;
};

export type RenderContextDrawFunction<T> = (ctx: CanvasRenderingContext2D, model: T) => void;
export type RenderContextModelGetter<T> = () => T;
export type RenderContextPositionGetter = () => Nullable<Point>;

export type RenderContextOptions<T> = {
	stage: StageContext;
	parent?: RenderContext;
	position?: RenderContextPositionGetter;
	model: RenderContextModelGetter<T>;
	draw: () => RenderContextDrawFunction<T>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class RenderContext<T = any> {
	options: RenderContextOptions<T>;
	element = $state<HTMLElement>();
	renders: RenderContext[] = [];

	constructor(options: RenderContextOptions<T>) {
		this.options = options;
		$effect(() => {
			return this.parent?.registerRender(this);
		});
		$effect(() => {
			this.model;
			this.draw;
			this.position;
			this.element;
			this.setNeedsRender();
			return () => {
				this.setNeedsRender();
			};
		});
	}

	registerRender(context: RenderContext) {
		this.renders.push(context);
		return () => {
			this.renders = this.renders.filter((child) => child !== context);
		};
	}

	get index() {
		const { element } = this;
		if (!element) {
			return 0;
		}
		return [...element.parentElement!.children].indexOf(element!);
	}

	get sortedChildren() {
		return this.renders.toSorted((a, b) => {
			return a.index - b.index;
		});
	}

	get model() {
		return this.options.model();
	}

	get draw() {
		return this.options.draw();
	}

	get position(): Point {
		return this.options.position?.() ?? { x: 0, y: 0 };
	}

	get stage() {
		return this.options.stage;
	}

	get parent() {
		return this.options.parent;
	}

	setNeedsRender() {
		this.parent!.setNeedsRender();
	}

	render(ctx: CanvasRenderingContext2D) {
		const { position, model, draw, sortedChildren: children } = this;
		ctx.save();
		{
			ctx.translate(position?.x ?? 0, position?.y ?? 0);
			draw(ctx, model);
			children.forEach((context) => context.render(ctx));
		}
		ctx.restore();
	}

	clientPositionToRenderPosition(client: Point): Point {
		const { position, parent } = this;
		if (position) {
			client = {
				x: client.x - position.x,
				y: client.y - position.y
			};
		}
		if (parent) {
			return parent.clientPositionToRenderPosition(client);
		}
		return client;
	}

	eventToRenderPosition(e: MouseEvent): Point {
		return this.clientPositionToRenderPosition({ x: e.clientX, y: e.clientY });
	}
}

export const setRenderContext = (context: RenderContext) => {
	setContext(RENDER, context);
};

export const getRenderContext = () => {
	return getContext(RENDER) as RenderContext;
};

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
			if(children) {
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
