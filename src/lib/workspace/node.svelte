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

	let { name, position, onPosition, children } = $props<{
		name: string;
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
		e.preventDefault();

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
	<div class="header">
		<div class="name">{name}</div>
	</div>
	<div class="content">
		{@render children()}
	</div>
</div>

<style lang="scss">
	.node {
		position: absolute;
		> .header {
			position: absolute;
			top: -10px;
			left: 0;
			user-select: none;
			max-width: 100%;
			> .name {
				font-size: 10px;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
		}
		> .content {
			border: 1px solid fade-out(#000, 0.85);
			transition: 0.15s ease-in-out border-color;
		}
		&.over {
			> .content {
				border-color: fade-out(#ef476f, 0.5);
			}
		}
	}
</style>
