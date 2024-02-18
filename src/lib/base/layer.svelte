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

<div class="layer">
	<canvas class="canvas" bind:this={layer.element} />
	<div class="children" bind:this={layer.children}>
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style lang="scss">
	.layer {
		display: contents;
		> .canvas {
			background: transparent;
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
		}
		> .children {
			display: none;
		}
	}
</style>
