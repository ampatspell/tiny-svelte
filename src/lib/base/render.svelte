<script lang="ts" generics="T">
	import {
		RenderContext,
		getRenderContext,
		getStageContext,
		setRenderContext,

		type RenderContextDrawFunction

	} from './context.svelte';
	import type {  Point } from '$lib/types';
	import type { Snippet } from 'svelte';

	let { name, position, model, draw, children, onCreated } = $props<{
		name: string;
		position?: Point;
		model: T;
		draw: RenderContextDrawFunction<T>;
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

<div data-node={name} bind:this={context.element}>
	{#if children}
		{@render children()}
	{/if}
</div>
