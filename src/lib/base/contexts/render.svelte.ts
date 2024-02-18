import type { Nullable, Point } from '$lib/types';
import { getContext, setContext } from 'svelte';
import type { StageContext } from './stage.svelte';

const RENDER = 'canvas:render';

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
