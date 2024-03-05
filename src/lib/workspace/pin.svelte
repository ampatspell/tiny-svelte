<script lang="ts">
	import { classes, type Classes } from '$lib/utils/classes';
	import type { Horizontal, Vertical } from './model.svelte';
	import { draggable } from '$lib/utils/use-draggable.svelte';
	import type { Point, Size } from '$lib/types';

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
		onResize: (delta: Size) => void;
	}>();

	let position = { x: 0, y: 0 };

	let onPosition = (next: Point) => {
		onResize({ width: next.x, height: next.y });
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
