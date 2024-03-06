<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getWorkspaceContext, type OnResizeFn } from './model.svelte';
	import type { Point, Size } from '$lib/types';
	import { addPoints, multiplyPoint } from '$lib/utils/math';
	import { draggable } from '$lib/utils/use-draggable.svelte';
	import Resizable from './resizable.svelte';
	import { stopPropagation } from '$lib/utils/event';

	let {
		name,
		description,
		position,
		onPosition,
		size,
		step,
		onResize,
		isDraggable: _isDraggable,
		isResizable: _isResizable,
		onClick,
		children
	} = $props<{
		name: string;
		description?: string;
		position: Point;
		size: Size;
		step: number;
		onPosition: (position: Point) => void;
		isDraggable: boolean;
		isResizable: boolean;
		onResize: OnResizeFn;
		onClick: () => void;
		children: Snippet;
	}>();

	let context = getWorkspaceContext();
	let pixel = $derived(context.pixel);

	let isDraggable = $derived(_isDraggable && context.isNodeDraggable);
	let isResizable = $derived(_isResizable && context.isNodeResizable);

	let translate = $derived.by(() => {
		let point = multiplyPoint(addPoints(context.position, position), context.pixel);
		return `${point.x}px ${point.y}px`;
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
<div
	class="node"
	class:resizable={isResizable}
	style:translate
	use:draggable={{
		isDraggable,
		pixel,
		position,
		onPosition,
		onStart: onClick
	}}
>
	<div class="header">
		<div class="name">{name}</div>
		{#if description}
			<div class="description">{description}</div>
		{/if}
	</div>
	<Resizable {pixel} {step} {position} {size} {isResizable} {onResize} class="content">
		{@render children()}
	</Resizable>
</div>

<style lang="scss">
	.node {
		position: absolute;
		> .header {
			position: absolute;
			top: -11px;
			left: 0;
			user-select: none;
			min-width: 0;
			max-width: 100%;
			gap: 3px;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			font-size: 11px;
			color: fade-out(#000, 0.5);
			> .name,
			> .description {
				display: inline;
			}
			> .name {
				color: #000;
			}
			> .description {
				&::before {
					content: '(';
				}
				&::after {
					content: ')';
				}
			}
		}
		&.resizable {
			> .header {
				display: none;
			}
		}
	}
</style>
