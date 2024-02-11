<script lang="ts" generics="T">
	import { classes } from '$lib/utils/classes';
	import {
		RenderContext,
		getRenderContext,
		setRenderContext,
		type DrawFunction,

		getLayerContext,

		getStageContext


	} from './models.svelte';
	import type { Position } from '$lib/types';
	import type { Snippet } from 'svelte';

	let { name, position, model, draw, children, onCreated } = $props<{
		name?: string;
		position?: Position;
		model: T;
		draw: DrawFunction<T>;
		children?: Snippet;
		onCreated?: (render: RenderContext) => void;
	}>();

	let parent = getRenderContext();
	let render = new RenderContext({
		layer: parent.layer,
		parent: parent,
		position: () => position,
		model: () => model,
		draw: () => draw
	});
	parent.registerRender(render);
	setRenderContext(render);
	onCreated?.(render);

	$effect(() => {
		return () => {
			parent.unregisterRender(render!);
		};
	});
</script>

<div class={classes('render', name)} bind:this={render.element}>
	{#if children}
		{@render children()}
	{/if}
</div>
