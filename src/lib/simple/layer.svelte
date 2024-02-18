<script lang="ts">
	import type { Snippet } from 'svelte';
	import {
		LayerContext,
		getStageContext,
		setLayerContext,
		setRenderContext
	} from './context.svelte';

	let { children } = $props<{
		name?: string;
		children?: Snippet;
	}>();

	let stage = getStageContext();
	let layer = new LayerContext({
		stage,
		model: () => null,
		draw: () => () => {}
	});
	setLayerContext(layer);
	setRenderContext(layer);
</script>

<canvas class="layer" bind:this={layer.element} />

{#if children}
	{@render children()}
{/if}

<style lang="scss">
	.layer {
		background: transparent;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
	}
</style>
