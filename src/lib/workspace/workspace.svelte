<script lang="ts">
	import { classes, type Classes } from '$lib/utils/classes';
	import { resize } from '$lib/utils/use-resize.svelte';
	import type { Snippet } from 'svelte';
	import { setWorkspaceContext, WorkspaceContext } from './model.svelte';

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
</script>

<div class={classes('workspace', _class)} use:resize={{ onResize: context.onResize }}>
	{#if children}
		{@render children()}
	{/if}
</div>

<style lang="scss">
	.workspace {
		background: rgba(255, 0, 0, 0.02);
		overflow: hidden;
	}
</style>
