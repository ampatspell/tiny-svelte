<script lang="ts">
	import { classes, type Classes } from '$lib/utils/classes';
	import type { Horizontal, Vertical } from './model.svelte';
	import { draggable } from '$lib/utils/use-draggable.svelte';
	import type { Point } from '$lib/types';

	let {
		horizontal,
		vertical,
		size,
		class: _class,
		pixel,
		step,
		onResize
	} = $props<{
		class?: Classes;
		size: number;
		horizontal: Horizontal;
		vertical: Vertical;
		pixel: number;
		step: number;
		onResize: (delta: Point) => void;
	}>();

	let position = $state<Point>({ x: 0, y: 0 });
	let onPosition = (next: Point) => {
		position = next;
		onResize({ x: next.x, y: next.y });
	};
</script>

<div
	class={classes('pin', `horizontal-${horizontal}`, `vertical-${vertical}`, _class)}
	style:--size="{size}px"
	use:draggable={{
		isDraggable: true,
		pixel,
		position,
		onPosition
	}}
></div>

<style lang="scss">
	.pin {
		width: var(--size);
		height: var(--size);
		background: fade-out(#ef476f, 0.7);
		border-radius: 2px;
		&:hover {
			background: fade-out(#ef476f, 0.3);
		}
	}
</style>
