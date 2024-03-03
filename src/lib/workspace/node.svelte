<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getWorkspaceContext } from './model.svelte';
	import type { Point } from '$lib/types';
	import { addPoints, multiplyPoint } from '$lib/utils/math';
	import { draggable } from '$lib/utils/use-draggable.svelte';

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
</script>

<div
	class="node"
	style:translate
	use:draggable={{
		isDraggable: true,
		pixel: context.pixel,
		position,
		onPosition
	}}
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
		&:hover {
			> .content {
				border-color: fade-out(#ef476f, 0.5);
			}
		}
	}
</style>
