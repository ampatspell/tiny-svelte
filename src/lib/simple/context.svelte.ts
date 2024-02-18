import type { DrawFunction, Position, Size } from '$lib/types';
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

export type RenderContextOptions<T> = {
	stage: StageContext;
	parent?: RenderContext;
	position?: () => Position | undefined;
	model: () => T;
	draw: () => DrawFunction<T>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class RenderContext<T = any> {
	options: RenderContextOptions<T>;
	element = $state<HTMLElement>();
	children: RenderContext[] = [];

	constructor(options: RenderContextOptions<T>) {
		this.options = options;
		$effect(() => {
			return this.parent?.registerChild(this);
		});
		$effect(() => {
			this.model;
			this.draw;
			this.setNeedsRender();
			return () => {
				this.setNeedsRender();
			};
		});
	}

	registerChild(context: RenderContext) {
		this.children.push(context);
		return () => {
			this.children = this.children.filter((child) => child !== context);
		};
	}

	get index() {
		const { element } = this;
		return [...element!.parentElement!.children].indexOf(element!);
	}

	get sortedChildren() {
		return this.children.toSorted((a, b) => {
			return a.index - b.index;
		});
	}

	get model() {
		return this.options.model();
	}

	get draw() {
		return this.options.draw();
	}

	get position(): Position {
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
}

export const setRenderContext = (context: RenderContext) => {
	setContext(RENDER, context);
};

export const getRenderContext = () => {
	return getContext(RENDER) as RenderContext;
};

export class LayerContext extends RenderContext<void> {
	frame?: number;

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
}

export const setLayerContext = (context: LayerContext) => {
	setContext(LAYER, context);
};

export const getLayerContext = () => {
	return getContext(LAYER) as LayerContext;
};

export class EachContext<I> extends RenderContext<I[]> {
	prev: I[] = [];

	constructor(options: RenderContextOptions<I[]>) {
		super(options);
		$effect(() => {
			const { prev } = this;
			if (!prev) {
				return;
			}
			const curr = [...this.model];
			if (!this.orderEquals(prev, curr)) {
				this.setNeedsRender();
			}
			this.prev = curr;
		});
	}

	orderEquals(a: I[], b: I[]) {
		if (a.length !== b.length) {
			return false;
		}
		for (let i = 0; i < a.length; i++) {
			if (a[i] !== b[i]) {
				return false;
			}
		}
		return true;
	}
}
