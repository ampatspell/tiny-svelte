<script lang="ts">
	import { classes, type Classes } from '$lib/utils/classes';
	import { resize } from '$lib/utils/use-resize.svelte';
	import { draggable } from '$lib/utils/use-draggable.svelte';
	import { space } from '$lib/utils/use-space.svelte';
	import type { Snippet } from 'svelte';
	import { setWorkspaceContext, WorkspaceContext } from './model.svelte';
	import type { Point } from '$lib/types';

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

	let onSpace = (space: boolean) => {
		isDraggable = space;
	};

	let onPosition = (position: Point) => {
		context.position = position;
	};
</script>

<div
	class={classes('workspace', _class)}
	use:resize={{ onResize: context.onResize }}
	use:draggable={{
		isDraggable,
		position: context.position,
		pixel: context.pixel,
		onPosition
	}}
	use:space={{ onSpace }}
>
	{#if children}
		{@render children()}
	{/if}
</div>

<style lang="scss">
	.workspace {
		background: fade-out(#000, 0.97);
		position: relative;
		overflow: hidden;
	}
</style>
