<script lang="ts" generics="T">
	import {
		RenderContext,
		getRenderContext,
		getStageContext,
		setRenderContext
	} from './context.svelte';
	import type { DrawFunction, Position } from '$lib/types';
	import type { Snippet } from 'svelte';

	let { position, model, draw, children, onCreated } = $props<{
		position?: Position;
		model: T;
		draw: DrawFunction<T>;
		children?: Snippet;
		onCreated?: (context: RenderContext<T>) => void;
	}>();

	let stage = getStageContext();
	let parent = getRenderContext();
	let context = new RenderContext<T>({
		stage,
		parent,
		position: () => position,
		model: () => model,
		draw: () => draw
	});
	setRenderContext(context);
	onCreated?.(context);
</script>

<div class="render" bind:this={context.element}>
	{#if children}
		{@render children()}
	{/if}
</div>
