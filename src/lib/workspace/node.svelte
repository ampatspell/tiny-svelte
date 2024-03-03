<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getWorkspaceContext } from './model.svelte';
	import type { Point } from '$lib/types';
	import {
		addPoints,
		dividePoint,
		multiplyPoint,
		roundPoint,
		subtractPoints
	} from '$lib/utils/math';
	import { mouseClientPositionToPoint } from '$lib/utils/event';

	let { position, onPosition, children } = $props<{
		position: Point;
		onPosition: (position: Point) => void;
		children: Snippet;
	}>();

	let context = getWorkspaceContext();

	let translate = $derived.by(() => {
		let point = multiplyPoint(addPoints(context.position, position), context.pixel);
		return `${point.x}px ${point.y}px`;
	});

	let isOver = $state(false);
	let onMouseOver = () => (isOver = true);
	let onMouseOut = () => (isOver = false);

	let dragging = $state<{
		node: Point;
		window: Point;
		pixel: number;
	}>();

	let onMouseDown = (e: MouseEvent) => {
		if (e.button !== 0 || !isOver) {
			return;
		}

		dragging = {
			node: { x: position.x, y: position.y },
			window: mouseClientPositionToPoint(e),
			pixel: context.pixel
		};
	};

	let onMouseUp = () => {
		if (!dragging) {
			return;
		}
		dragging = undefined;
	};

	let onMouseMove = (e: MouseEvent) => {
		if (!dragging) {
			return;
		}

		let client = mouseClientPositionToPoint(e);
		let delta = dividePoint(subtractPoints(client, dragging.window), dragging.pixel);
		let point = roundPoint(addPoints(dragging.node, delta));
		onPosition(point);
	};
</script>

<svelte:window onmouseup={onMouseUp} onmousemove={onMouseMove} />

<!-- svelte-ignore a11y-mouse-events-have-key-events a11y-no-static-element-interactions -->
<div
	class="node"
	class:over={isOver}
	style:translate
	onmousedown={onMouseDown}
	onmouseover={onMouseOver}
	onmouseout={onMouseOut}
>
	{@render children()}
</div>

<style lang="scss">
	.node {
		position: absolute;
		border: 1px solid fade-out(#000, 0.85);
		transition: 0.15s ease-in-out border-color;
		&.over {
			border-color: fade-out(#ef476f, 0.5);
		}
	}
</style>
