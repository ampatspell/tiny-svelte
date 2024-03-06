<script lang="ts">
	import { classes, type Classes } from '$lib/utils/classes';
	import { resize } from '$lib/utils/use-resize.svelte';
	import { draggable } from '$lib/utils/use-draggable.svelte';
	import { space } from '$lib/utils/use-space.svelte';
	import type { Snippet } from 'svelte';
	import { setWorkspaceContext, WorkspaceContext } from './model.svelte';
	import type { Point } from '$lib/types';
	import { stopPropagation } from '$lib/utils/event';

	let {
		class: _class,
		onCreated,
		onClick,
		children
	} = $props<{
		class?: Classes;
		onCreated?: (context: WorkspaceContext) => void;
		onClick: () => void;
		children?: Snippet;
	}>();

	const context = new WorkspaceContext();
	setWorkspaceContext(context);
	onCreated?.(context);

	let position = $derived(context.position);
	let pixel = $derived(context.pixel);
	let onResize = $derived(context.onResize);
	let isDraggable = $derived(context.isWorkspaceDraggable);

	let onSpace = (space: boolean) => (context.isWorkspaceDraggable = space);
	let onPosition = (position: Point) => (context.position = position);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
<div
	class={classes('workspace', _class)}
	use:resize={{ onResize }}
	use:draggable={{
		isDraggable,
		position,
		pixel,
		onPosition
	}}
	use:space={{ onSpace }}
	onclick={stopPropagation(() => onClick())}
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
