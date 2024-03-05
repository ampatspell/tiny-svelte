<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getWorkspaceContext, type OnResizeFn } from './model.svelte';
	import type { Point, Size } from '$lib/types';
	import { addPoints, multiplyPoint } from '$lib/utils/math';
	import { draggable } from '$lib/utils/use-draggable.svelte';
	import { space } from '$lib/utils/use-space.svelte';
	import Resizable from './resizable.svelte';

	let { name, position, onPosition, size, step, onResize, children } = $props<{
		name: string;
		position: Point;
		size: Size;
		step: number;
		onPosition: (position: Point) => void;
		onResize: OnResizeFn;
		children: Snippet;
	}>();

	let context = getWorkspaceContext();
	let pixel = $derived(context.pixel);

	let translate = $derived.by(() => {
		let point = multiplyPoint(addPoints(context.position, position), context.pixel);
		return `${point.x}px ${point.y}px`;
	});

	// TODO: disabled
	let isDraggable = $state(false);
	let onSpace = (space: boolean) => {
		isDraggable = !space;
	};
</script>

<div
	class="node"
	style:translate
	use:draggable={{
		isDraggable,
		pixel,
		position,
		onPosition
	}}
	use:space={{ onSpace }}
>
	<div class="header">
		<div class="name">{name}</div>
	</div>
	<Resizable {pixel} {step} {position} {size} {onResize} class="content">
		{@render children()}
	</Resizable>
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
	}
</style>
