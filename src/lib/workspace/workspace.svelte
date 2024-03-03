<script lang="ts">
	import { classes, type Classes } from '$lib/utils/classes';
	import { resize } from '$lib/utils/use-resize.svelte';
	import type { Snippet } from 'svelte';
	import { setWorkspaceContext, WorkspaceContext } from './model.svelte';
	import type { Point } from '$lib/types';
	import { mouseClientPositionToPoint } from '$lib/utils/event';
	import { addPoints, dividePoint, roundPoint, subtractPoints } from '$lib/utils/math';

	let {
		class: _class,
		onCreated,
		children
	} = $props<{
		class?: Classes;
		onCreated?: (context: WorkspaceContext) => void;
		children?: Snippet;
	}>();

	const context = new WorkspaceContext();
	setWorkspaceContext(context);
	onCreated?.(context);

	let isDraggable = $state(false);
	let isOver = $state(false);
	let dragging = $state<{
		node: Point;
		window: Point;
		pixel: number;
	}>();

	let onMouseOver = () => (isOver = true);
	let onMouseOut = () => (isOver = false);

	let onKeyDown = (e: KeyboardEvent) => {
		if (e.code === 'Space' && !isDraggable) {
			isDraggable = true;
		}
	};

	let onKeyUp = () => {
		isDraggable = false;
	};

	let onMouseDown = (e: MouseEvent) => {
		if (e.button !== 0 || !isOver || !isDraggable) {
			return;
		}

		dragging = {
			node: { x: context.position.x, y: context.position.y },
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
		context.position = point;
	};
</script>

<svelte:window
	onkeydown={onKeyDown}
	onkeyup={onKeyUp}
	onfocus={onKeyUp}
	onmouseup={onMouseUp}
	onmousemove={onMouseMove}
/>

<!-- svelte-ignore a11y-mouse-events-have-key-events a11y-no-static-element-interactions -->
<div
	class={classes('workspace', _class)}
	onmousedown={onMouseDown}
	onmouseover={onMouseOver}
	onmouseout={onMouseOut}
	use:resize={{ onResize: context.onResize }}
>
	{#if children}
		{@render children()}
	{/if}
</div>

<style lang="scss">
	.workspace {
		background: fade-out(#000, 0.97);
		overflow: hidden;
	}
</style>
