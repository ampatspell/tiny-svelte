<script lang="ts">
	import type { RenderContext } from '$lib/base/context.svelte';
	import Render from '$lib/base/render.svelte';
	import type { Point, Size } from '$lib/types';
	import { drawGrid } from '$lib/utils/canvas';
	import { fromIndex, toIndex } from '$lib/utils/pixel';

	let { position, pixel, size, data, onUpdated } = $props<{
		position?: Point;
		pixel: number;
		size: Size;
		data: number[];
		onUpdated: (data: number[]) => void;
	}>();

	type Model = {
		pixel: number;
		size: Size;
		hover?: Point;
		data: number[];
	};

	let hover = $state<Point>();
	let model = $derived<Model>({ pixel, size, hover, data });

	let draw = (ctx: CanvasRenderingContext2D) => {
		let drawPixel = (position: Point, fillStyle: string) => {
			ctx.fillStyle = fillStyle;
			ctx.fillRect(position.x * pixel, position.y * pixel, pixel, pixel);
		};

		for (let i = 0; i < size.width * size.height; i++) {
			let value = data[i];
			let position = fromIndex(i, size);
			let fillStyle = value === 0 ? '#fff' : '#333';
			drawPixel(position, fillStyle);
		}

		if (pixel > 8) {
			drawGrid({ ctx, pixel, size });
		}

		if (hover) {
			drawPixel(hover, 'rgba(255,0,0,0.05)');
		}
	};

	let render = $state<RenderContext>();

	let toPixel = (e: MouseEvent) => {
		let point = render!.eventToRenderPosition(e);
		let px = Math.floor(point.x / pixel);
		let py = Math.floor(point.y / pixel);
		if (px >= 0 && px < size.width && py >= 0 && py < size.height) {
			return { x: px, y: py };
		}
	};

	let drawing = $state<{ color: number }>();

	let update = (pixel: Point) => {
		let index = toIndex(pixel, size);
		let next = [...data];
		next[index] = drawing!.color;
		onUpdated(next);
	};

	let onmousedown = (e: MouseEvent) => {
		let pixel = toPixel(e);
		if (pixel) {
			let color = data[toIndex(pixel, size)] === 0 ? 1 : 0;
			drawing = { color };
			update(pixel);
		}
	};

	let onmousemove = (e: MouseEvent) => {
		let pixel = toPixel(e);
		hover = pixel;
		if (pixel && drawing) {
			update(pixel);
		}
	};

	let onmouseup = () => {
		drawing = undefined;
	};
</script>

<svelte:window on:mousemove={onmousemove} on:mousedown={onmousedown} on:mouseup={onmouseup} />

<Render name="sprite-editor" onCreated={(ctx) => (render = ctx)} {position} {model} {draw} />
