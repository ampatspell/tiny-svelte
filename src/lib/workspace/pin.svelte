<script lang="ts">
	import { classes, type Classes } from '$lib/utils/classes';
	import { Horizontal, Vertical } from './model.svelte';
	import { draggable, DraggableAxis } from '$lib/utils/use-draggable.svelte';
	import type { Point, Size } from '$lib/types';
	import { addPoints, addSizes, calcPoint, subtractPoints, subtractSizes } from '$lib/utils/math';

	let {
		horizontal,
		vertical,
		pin,
		class: _class,
		pixel,
		step,
		position,
		size,
		onResize
	} = $props<{
		class?: Classes;
		pin: number;
		horizontal: Horizontal;
		vertical: Vertical;
		pixel: number;
		position: Point;
		size: Size;
		step: number;
		onResize: (position: Point, size: Size) => void;
	}>();

	let draggablePosition = $state<Point>({ x: 0, y: 0 });
	let startSize: Size;

	let onPosition = (next: Point) => {
		const delta = calcPoint(next, (d) => Math.round(d / step) * step);
		let { x, y } = position;

		console.log(delta);

		let width = startSize.width + delta.x;
		let height = startSize.height + delta.y;

		if (horizontal === Horizontal.Left) {
			x += width;
		}

		onResize({ x, y }, { width, height });
	};

	let axis = $derived.by(() => {
		if (horizontal === Horizontal.Center) {
			return DraggableAxis.Vertical;
		} else if (vertical === Vertical.Center) {
			return DraggableAxis.Horizontal;
		} else {
			return DraggableAxis.Both;
		}
	});

	let isResizing = $state(false);
	let onStart = () => {
		isResizing = true;
		startSize = { width: size.width, height: size.height };
		draggablePosition = { x: 0, y: 0 };
	};
	let onEnd = () => (isResizing = false);
</script>

<div
	class={classes(
		'pin',
		`horizontal-${horizontal}`,
		`vertical-${vertical}`,
		isResizing && 'resizing',
		_class
	)}
	style:--size="{pin}px"
	use:draggable={{
		isDraggable: true,
		pixel,
		position: draggablePosition,
		onPosition,
		onStart,
		onEnd,
		axis
	}}
></div>

<style lang="scss">
	.pin {
		width: var(--size);
		height: var(--size);
		background: fade-out(#ef476f, 0.7);
		border-radius: 2px;
		&:hover,
		&.resizing {
			background: fade-out(#ef476f, 0.3);
		}
	}
</style>
