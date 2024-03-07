<script lang="ts">
	import { classes, type Classes } from '$lib/utils/classes';
	import { resize } from '$lib/utils/use-resize.svelte';
	import { draggable } from '$lib/utils/use-draggable.svelte';
	import type { Snippet } from 'svelte';
	import { setWorkspaceContext, WorkspaceModel } from './model.svelte';
	import type { Point } from '$lib/types';

	let {
		class: _class,
		model,
		onClick,
		isDraggable,
		children
	} = $props<{
		class?: Classes;
		model: WorkspaceModel;
		isDraggable: boolean;
		onClick: () => void;
		children?: Snippet;
	}>();

	setWorkspaceContext(model);

	let position = $derived(model.position);
	let pixel = $derived(model.pixel);
	let onResize = $derived(model.onResize);
	let onPosition = (position: Point) => (model.position = position);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class={classes('workspace', _class)}
	use:resize={{ onResize }}
	use:draggable={{
		isDraggable,
		position,
		pixel,
		onPosition
	}}
	onmousedown={() => onClick()}
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
